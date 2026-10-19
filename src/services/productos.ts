import catalogo from '@/data/productos.json';
import type { Producto } from '@/types/producto';

// Etapa 1: el catálogo sale de un JSON local generado con `npm run catalogo`.
// Etapa 2: reemplazar el cuerpo de estas funciones por queries a Supabase
// (ver supabase/schema.sql). Las firmas no cambian, así las páginas no se tocan.
const productos = catalogo as Producto[];

export const fetchProductos = async (): Promise<Producto[]> => productos;

export const fetchProducto = async (slug: string): Promise<Producto | null> =>
  productos.find((p) => p.slug === slug) ?? null;
