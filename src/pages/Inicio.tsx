import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, MapPin, RefreshCcw, Truck } from 'lucide-react';
import { CATEGORIAS, DESTACADOS, TIENDA } from '@/config/tienda';
import { useProductos } from '@/hooks/useProductos';
import { ProductoCard } from '@/components/ProductoCard';
import { LocalSeccion } from '@/components/LocalSeccion';
import type { Categoria } from '@/types/producto';

const FILTROS: { id: Categoria | 'todo'; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'skate', label: 'Skate' },
  { id: 'zapatillas', label: 'Zapatillas' },
  { id: 'ropa', label: 'Ropa' },
  { id: 'accesorios', label: 'Accesorios' },
];

const MARQUEE = ['Envíos a todo el país', 'Tablas maple', 'Grizzly', 'Thrasher', 'Öus', 'Av. Santa Fe 1670'];

export const Inicio = () => {
  const { data: productos = [] } = useProductos();
  const [filtro, setFiltro] = useState<Categoria | 'todo'>('todo');

  const destacados = useMemo(
    () => DESTACADOS.map((slug) => productos.find((p) => p.slug === slug)).filter((p) => p !== undefined),
    [productos],
  );
  const visibles = filtro === 'todo' ? destacados : destacados.filter((p) => p.categoria === filtro);
  const marcas = useMemo(() => [...new Set(productos.map((p) => p.marca))], [productos]);
  const anios = new Date().getFullYear() - TIENDA.fundacion;

  return (
    <>
      <section className="relative h-[min(88vh,820px)] min-h-[560px] overflow-hidden text-white">
        <img src="/img/hero.jpg" alt="Skater saltando en un skatepark" className="absolute inset-0 h-full w-full object-cover object-[60%_0%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,12,24,.82)_0%,rgba(8,12,24,.45)_45%,rgba(8,12,24,0)_75%),linear-gradient(0deg,rgba(8,12,24,.55),transparent_40%)]" />
        <div className="wrap relative z-10 flex h-full flex-col justify-end pb-16 pt-10">
          <div className="mb-5 flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[2px] before:h-[3px] before:w-[34px] before:bg-rojo">
            Skateboarding argentino · Desde {TIENDA.fundacion}
          </div>
          <h1 className="display max-w-[11ch] text-[clamp(52px,7.6vw,116px)]">
            Hecho por <span className="text-rojo">skaters</span> para skaters
          </h1>
          <p className="mt-6 max-w-[470px] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-[#e6e6ea]">
            Tablas, zapatillas, ropa y accesorios de las marcas que se usan en la calle. Comprá online o vení al local en Av. Santa Fe.
          </p>
        </div>
      </section>

      <div className="overflow-hidden whitespace-nowrap bg-azul py-4 text-white" aria-hidden="true">
        <div className="inline-block animate-marquee font-display text-[22px] uppercase tracking-[1.5px]">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>
              <span className="mx-6">{t}</span>
              <span className="text-rojo">●</span>
            </span>
          ))}
        </div>
      </div>

      <section className="py-16 sm:py-24">
        <div className="wrap">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="kicker">Categorías</div>
              <h2 className="display text-[clamp(40px,5.5vw,72px)]">Elegí tu<br />próximo setup</h2>
            </div>
            <Link to="/tienda" className="link-subrayado">Ver todo</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {CATEGORIAS.map((c) => (
              <Link key={c.id} to={`/tienda/${c.id}`} className="group relative aspect-[3/4] overflow-hidden rounded-[18px] bg-white">
                <img src={c.imagen} alt="" className="h-full w-full object-contain p-[10%] transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(11,46,107,.88),rgba(11,46,107,0)_55%)]" />
                <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between text-white sm:inset-x-5 sm:bottom-[18px]">
                  <b className="font-display text-xl font-normal uppercase sm:text-[34px]">{c.nombre}</b>
                  <i className="grid h-8 w-8 place-items-center rounded-full bg-white text-tinta transition group-hover:bg-rojo group-hover:text-white sm:h-[42px] sm:w-[42px]">
                    <ArrowRight size={18} />
                  </i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="wrap">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="kicker">Selección</div>
              <h2 className="display text-[clamp(40px,5.5vw,72px)]">Destacados</h2>
            </div>
            <Link to="/tienda" className="link-subrayado">Ver los {productos.length} productos</Link>
          </div>
          <div className="mb-7 flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFiltro(f.id)} className={`chip ${filtro === f.id ? 'chip-on' : ''}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-[22px] lg:grid-cols-4">
            {visibles.map((p) => <ProductoCard key={p.id} producto={p} />)}
          </div>
        </div>
      </section>

      <div className="bg-rojo text-white">
        <div className="wrap grid lg:grid-cols-3">
          {[
            { icono: Truck, t: 'Envíos a todo el país', d: 'Con Shipnow, y en moto dentro de CABA' },
            { icono: RefreshCcw, t: 'Cambios y devoluciones', d: 'Dentro de los 30 días corridos desde la recepción' },
            { icono: MapPin, t: 'Retiro en el local', d: 'Av. Santa Fe 1670, CABA' },
          ].map(({ icono: Icono, t, d }) => (
            <div key={t} className="flex items-center gap-4 border-b border-white/25 px-2 py-7 last:border-0 lg:border-b-0 lg:border-r lg:px-6">
              <Icono size={32} strokeWidth={1.8} className="flex-none" />
              <p>
                <b className="block text-base">{t}</b>
                <span className="text-sm opacity-90">{d}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <section className="py-16 sm:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
            <img src="/img/nosotros.jpg" alt="Remera TREE" className="h-full w-full object-cover object-[30%_50%]" />
            <div className="absolute bottom-5 right-5 grid h-32 w-32 place-items-center rounded-full bg-papel text-center font-display text-[15px] uppercase leading-[0.95] tracking-wider text-azul">
              <div>Desde<b className="block text-[44px] font-normal text-rojo">{TIENDA.fundacion}</b>Buenos Aires</div>
            </div>
          </div>
          <div>
            <div className="kicker">Nosotros</div>
            <h2 className="display mb-6 text-[clamp(44px,6vw,84px)]">
              {anios} años <span className="text-rojo">rodando</span>
            </h2>
            {TIENDA.historia.map((p) => (
              <p key={p} className="mb-4 max-w-[520px] text-lg leading-relaxed text-[#3a3a40]">{p}</p>
            ))}
            <div className="my-9 flex gap-8 sm:gap-10">
              {[
                { n: TIENDA.fundacion, l: 'Fundada' },
                { n: productos.length, l: 'Productos online' },
                { n: marcas.length, l: 'Marcas' },
              ].map((s) => (
                <div key={s.l}>
                  <b className="block font-display text-[38px] font-normal leading-none text-azul sm:text-5xl">{s.n}</b>
                  <span className="text-[13px] font-semibold uppercase tracking-wide text-gris">{s.l}</span>
                </div>
              ))}
            </div>
            <Link to="/nosotros" className="btn btn-rojo">Conocé la marca <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <div className="border-y border-linea py-8">
        <div className="wrap flex flex-wrap items-center justify-around gap-x-8 gap-y-4">
          {marcas.map((m) => (
            <Link key={m} to={`/tienda?marca=${encodeURIComponent(m)}`} className="font-display text-2xl uppercase tracking-wider text-[#a7a299] transition hover:text-tinta sm:text-[30px]">
              {m}
            </Link>
          ))}
        </div>
      </div>

      <LocalSeccion />
    </>
  );
};
