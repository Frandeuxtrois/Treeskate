import { Link } from 'react-router';
import { formatPrecio } from '@/lib/formato';
import type { Producto } from '@/types/producto';

export const ProductoCard = ({ producto }: { producto: Producto }) => {
  const portada = producto.variantes[0]?.imagen ?? '';
  const segunda = producto.variantes[1]?.imagen;

  return (
    <Link to={`/producto/${producto.slug}`} className="group flex flex-col">
      <div className="relative mb-3.5 aspect-square overflow-hidden rounded-2xl bg-white">
        {producto.agotado && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-tinta px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
            Agotado
          </span>
        )}
        {producto.variantes.length > 1 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-papel px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider">
            {producto.variantes.length} opciones
          </span>
        )}
        <img
          src={portada}
          alt={producto.nombre}
          loading="lazy"
          className={`h-full w-full object-contain p-[8%] transition duration-500 ${segunda ? 'group-hover:opacity-0' : 'group-hover:scale-105'} ${producto.agotado ? 'opacity-60' : ''}`}
        />
        {segunda && (
          <img src={segunda} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain p-[8%] opacity-0 transition duration-500 group-hover:opacity-100" />
        )}
      </div>
      <small className="text-xs font-semibold uppercase tracking-wider text-gris">{producto.marca}</small>
      <h3 className="mb-1.5 mt-1 text-[15px] font-semibold leading-snug">{producto.nombre}</h3>
      <div className="text-[17px] font-bold">{producto.precio !== null ? formatPrecio(producto.precio) : 'Sin stock'}</div>
    </Link>
  );
};
