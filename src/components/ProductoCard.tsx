import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrecio } from '@/lib/formato';
import type { Producto } from '@/types/producto';

export const ProductoCard = ({ producto }: { producto: Producto }) => {
  const [idx, setIdx] = useState(0);
  const total = producto.variantes.length;
  const variante = producto.variantes[idx] ?? producto.variantes[0];

  const mover = (paso: number) => setIdx((i) => (i + paso + total) % total);

  return (
    <div className="group relative flex flex-col">
      <Link to={`/producto/${producto.slug}`} className="flex flex-col">
        <div className="relative mb-3.5 aspect-square overflow-hidden rounded-2xl bg-white">
          {producto.agotado && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-tinta px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
              Agotado
            </span>
          )}
          {total > 1 && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-papel px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              {total} opciones
            </span>
          )}
          <img
            src={variante?.imagen ?? ''}
            alt={`${producto.nombre}${total > 1 && variante ? ` ${variante.etiqueta}` : ''}`}
            loading="lazy"
            className={`h-full w-full object-contain p-[8%] transition duration-500 group-hover:scale-105 ${producto.agotado ? 'opacity-60' : ''}`}
          />
          {total > 1 && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
              {producto.variantes.map((v, i) => (
                <span key={v.imagen} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-tinta' : 'w-1.5 bg-tinta/25'}`} />
              ))}
            </div>
          )}
        </div>
        <small className="text-xs font-semibold uppercase tracking-wider text-gris">{producto.marca}</small>
        <h3 className="mb-1.5 mt-1 text-[15px] font-semibold leading-snug">{producto.nombre}</h3>
        <div className="text-[17px] font-bold">{producto.precio !== null ? formatPrecio(producto.precio) : 'Sin stock'}</div>
      </Link>

      {total > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-square items-center justify-between px-2">
          {[
            { paso: -1, Icono: ChevronLeft, label: 'Opción anterior' },
            { paso: 1, Icono: ChevronRight, label: 'Opción siguiente' },
          ].map(({ paso, Icono, label }) => (
            <button
              key={paso}
              type="button"
              onClick={() => mover(paso)}
              className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-papel/90 text-tinta shadow-sm transition hover:bg-tinta hover:text-white lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
              aria-label={`${label} de ${producto.nombre}`}
            >
              <Icono size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
