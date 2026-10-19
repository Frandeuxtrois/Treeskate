import { useEffect } from 'react';
import { Link } from 'react-router';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCarrito } from '@/context/CarritoContext';
import { formatPrecio } from '@/lib/formato';

export const CarritoDrawer = () => {
  const { items, abierto, cerrar, subtotal, cambiarCantidad, quitar } = useCarrito();

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cerrar();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [abierto, cerrar]);

  return (
    <div className={`fixed inset-0 z-50 ${abierto ? '' : 'pointer-events-none'}`} aria-hidden={!abierto}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${abierto ? 'opacity-100' : 'opacity-0'}`}
        onClick={cerrar}
      />
      <aside
        role="dialog"
        aria-label="Carrito"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-papel shadow-2xl transition-transform duration-300 ${
          abierto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-linea px-6 py-5">
          <h2 className="display text-3xl">Tu carrito</h2>
          <button type="button" onClick={cerrar} className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5" aria-label="Cerrar carrito">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={44} className="text-gris" />
            <p className="text-gris">Todavía no agregaste nada.</p>
            <Link to="/tienda" onClick={cerrar} className="btn btn-tinta">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-linea overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.clave} className="flex gap-4 py-5">
                  <Link to={`/producto/${i.slug}`} onClick={cerrar} className="h-24 w-24 flex-none overflow-hidden rounded-xl bg-white">
                    <img src={i.imagen} alt="" className="h-full w-full object-contain p-1.5" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[15px] font-semibold leading-snug">{i.nombre}</p>
                    <p className="mt-0.5 text-[13px] text-gris">
                      {[i.variante !== 'Única' ? i.variante : null, i.talle ? `Talle ${i.talle}` : null].filter(Boolean).join(' · ')}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-linea">
                        <button type="button" onClick={() => cambiarCantidad(i.clave, i.cantidad - 1)} className="grid h-8 w-8 place-items-center" aria-label="Restar uno">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{i.cantidad}</span>
                        <button type="button" onClick={() => cambiarCantidad(i.clave, i.cantidad + 1)} className="grid h-8 w-8 place-items-center" aria-label="Sumar uno">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold">{formatPrecio(i.precio * i.cantidad)}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => quitar(i.clave)} className="self-start p-1 text-gris hover:text-tinta" aria-label={`Quitar ${i.nombre}`}>
                    <Trash2 size={17} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-linea px-6 py-5">
              <div className="mb-1 flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>{formatPrecio(subtotal)}</span>
              </div>
              <p className="mb-4 text-[13px] text-gris">El envío se calcula en el siguiente paso.</p>
              <Link to="/checkout" onClick={cerrar} className="btn btn-rojo w-full">
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
