import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { MapPin, Minus, Plus, RefreshCcw, Truck } from 'lucide-react';
import { CATEGORIAS, SUBCATEGORIAS, TALLES, TIENDA } from '@/config/tienda';
import { useCarrito } from '@/context/CarritoContext';
import { useProducto, useProductos } from '@/hooks/useProductos';
import { formatPrecio } from '@/lib/formato';
import { ProductoCard } from '@/components/ProductoCard';
import { NoEncontrado } from '@/pages/NoEncontrado';

const ProductoDetalle = ({ slug }: { slug: string }) => {
  const { data: producto, isLoading } = useProducto(slug);
  const { data: productos = [] } = useProductos();
  const { agregar } = useCarrito();

  const [varianteIdx, setVarianteIdx] = useState(0);
  const [talle, setTalle] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [faltaTalle, setFaltaTalle] = useState(false);

  const relacionados = useMemo(
    () => (producto ? productos.filter((p) => p.subcategoria === producto.subcategoria && p.slug !== producto.slug && !p.agotado).slice(0, 4) : []),
    [productos, producto],
  );

  if (isLoading) return <div className="min-h-[60vh]" />;
  if (!producto) return <NoEncontrado />;

  const variante = producto.variantes[varianteIdx] ?? producto.variantes[0];
  // en tablas con varias medidas, la variante ya es la medida
  const talles = producto.subcategoria === 'tablas' && producto.variantes.length > 1 ? [] : (TALLES[producto.subcategoria] ?? []);
  const categoria = CATEGORIAS.find((c) => c.id === producto.categoria);
  const tieneVariantes = producto.variantes.length > 1;

  const onAgregar = () => {
    if (producto.precio === null || !variante) return;
    if (talles.length > 0 && !talle) {
      setFaltaTalle(true);
      return;
    }
    agregar(
      { slug: producto.slug, nombre: producto.nombre, precio: producto.precio, imagen: variante.imagen, variante: variante.etiqueta, talle },
      cantidad,
    );
  };

  return (
    <>
      <section className="py-10 sm:py-14">
        <div className="wrap">
          <nav className="mb-6 text-sm text-gris" aria-label="Migas de pan">
            <Link to="/" className="hover:text-tinta">Inicio</Link> /{' '}
            <Link to={`/tienda/${producto.categoria}`} className="hover:text-tinta">{categoria?.nombre}</Link> /{' '}
            <Link to={`/tienda/${producto.categoria}?sub=${producto.subcategoria}`} className="hover:text-tinta">{SUBCATEGORIAS[producto.subcategoria]}</Link>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
                <img src={variante?.imagen} alt={`${producto.nombre} ${variante?.etiqueta ?? ''}`} className="h-full w-full object-contain p-[7%]" />
                {producto.agotado && (
                  <span className="absolute left-4 top-4 rounded-full bg-tinta px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">Agotado</span>
                )}
              </div>
              {tieneVariantes && (
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {producto.variantes.map((v, i) => (
                    <button
                      key={v.imagen}
                      type="button"
                      onClick={() => setVarianteIdx(i)}
                      className={`aspect-square overflow-hidden rounded-xl border-2 bg-white transition ${i === varianteIdx ? 'border-tinta' : 'border-transparent hover:border-linea'}`}
                      aria-label={`Ver ${v.etiqueta}`}
                    >
                      <img src={v.imagen} alt="" className="h-full w-full object-contain p-1.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-4">
              <Link to={`/tienda?marca=${encodeURIComponent(producto.marca)}`} className="text-sm font-bold uppercase tracking-[2px] text-rojo">
                {producto.marca}
              </Link>
              <h1 className="display mb-5 mt-2 text-[clamp(38px,4.6vw,62px)]">{producto.nombre}</h1>
              <p className="mb-8 text-3xl font-bold">{producto.precio !== null ? formatPrecio(producto.precio) : 'Sin stock'}</p>

              {tieneVariantes && (
                <div className="mb-7">
                  <p className="mb-3 text-sm font-semibold">
                    {producto.subcategoria === 'tablas' ? 'Medida' : 'Modelo'}: <span className="font-normal text-gris">{variante?.etiqueta}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {producto.variantes.map((v, i) => (
                      <button key={v.imagen} type="button" onClick={() => setVarianteIdx(i)} className={`chip ${i === varianteIdx ? 'chip-on' : ''}`}>
                        {v.etiqueta}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {talles.length > 0 && !producto.agotado && (
                <div className="mb-7">
                  <p className="mb-3 text-sm font-semibold">
                    {producto.subcategoria === 'tablas' ? 'Medida' : 'Talle'}
                    {faltaTalle && <span className="ml-2 font-normal text-rojo">Elegí uno para continuar</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {talles.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTalle(t);
                          setFaltaTalle(false);
                        }}
                        className={`chip min-w-[56px] ${talle === t ? 'chip-on' : ''} ${faltaTalle ? 'border-rojo' : ''}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!producto.agotado ? (
                <div className="mb-8 flex gap-3">
                  <div className="flex items-center rounded-full border-2 border-linea">
                    <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} className="grid h-12 w-12 place-items-center" aria-label="Restar uno">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{cantidad}</span>
                    <button type="button" onClick={() => setCantidad((c) => c + 1)} className="grid h-12 w-12 place-items-center" aria-label="Sumar uno">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button type="button" onClick={onAgregar} className="btn btn-rojo flex-1">Agregar al carrito</button>
                </div>
              ) : (
                <p className="mb-8 rounded-2xl bg-white p-5 text-[15px]">
                  Este producto está agotado. Para consultar disponibilidad, escribinos a{' '}
                  <a href={`mailto:${TIENDA.contacto.email}`} className="font-semibold underline">{TIENDA.contacto.email}</a>.
                </p>
              )}

              <ul className="divide-y divide-linea border-y border-linea text-[15px]">
                {[
                  { icono: Truck, t: 'Envíos a todo el país con Shipnow. En CABA también por moto.' },
                  { icono: MapPin, t: 'Retiro en Av. Santa Fe 1670, de lunes a sábados de 11 a 19 hs.' },
                  { icono: RefreshCcw, t: 'Cambios dentro de los 30 días corridos, con factura, etiquetas y packaging originales.' },
                ].map(({ icono: Icono, t }) => (
                  <li key={t} className="flex gap-3 py-3.5">
                    <Icono size={19} className="mt-0.5 flex-none text-azul" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="pb-8">
          <div className="wrap">
            <h2 className="display mb-8 text-[clamp(32px,4vw,52px)]">También te puede gustar</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-[22px] lg:grid-cols-4">
              {relacionados.map((p) => <ProductoCard key={p.id} producto={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export const Producto = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  return <ProductoDetalle key={slug} slug={slug} />;
};
