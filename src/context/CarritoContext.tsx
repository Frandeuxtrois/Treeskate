import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ItemCarrito } from '@/types/producto';

const STORAGE_KEY = 'tree-carrito';

interface CarritoContextValue {
  items: ItemCarrito[];
  cantidadTotal: number;
  subtotal: number;
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
  agregar: (item: Omit<ItemCarrito, 'clave' | 'cantidad'>, cantidad?: number) => void;
  cambiarCantidad: (clave: string, cantidad: number) => void;
  quitar: (clave: string) => void;
  vaciar: () => void;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

const leerGuardado = (): ItemCarrito[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ItemCarrito[]) : [];
  } catch {
    return [];
  }
};

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemCarrito[]>(leerGuardado);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // modo privado o storage lleno: el carrito sigue funcionando en memoria
    }
  }, [items]);

  const agregar = useCallback<CarritoContextValue['agregar']>((item, cantidad = 1) => {
    const clave = [item.slug, item.variante, item.talle ?? ''].join('|');
    setItems((prev) => {
      const existente = prev.find((i) => i.clave === clave);
      if (existente) return prev.map((i) => (i.clave === clave ? { ...i, cantidad: i.cantidad + cantidad } : i));
      return [...prev, { ...item, clave, cantidad }];
    });
    setAbierto(true);
  }, []);

  const cambiarCantidad = useCallback((clave: string, cantidad: number) => {
    setItems((prev) =>
      cantidad <= 0 ? prev.filter((i) => i.clave !== clave) : prev.map((i) => (i.clave === clave ? { ...i, cantidad } : i)),
    );
  }, []);

  const quitar = useCallback((clave: string) => setItems((prev) => prev.filter((i) => i.clave !== clave)), []);
  const vaciar = useCallback(() => setItems([]), []);

  const value = useMemo<CarritoContextValue>(
    () => ({
      items,
      cantidadTotal: items.reduce((acc, i) => acc + i.cantidad, 0),
      subtotal: items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
    }),
    [items, abierto, agregar, cambiarCantidad, quitar, vaciar],
  );

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
};

export const useCarrito = (): CarritoContextValue => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
};
