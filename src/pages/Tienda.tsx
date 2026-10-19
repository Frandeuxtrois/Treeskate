import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { Search, X } from 'lucide-react';
import { CATEGORIAS, SUBCATEGORIAS } from '@/config/tienda';
import { useProductos } from '@/hooks/useProductos';
import { ProductoCard } from '@/components/ProductoCard';
import type { Categoria, Producto, Subcategoria } from '@/types/producto';

type Orden = 'relevancia' | 'menor' | 'mayor' | 'nombre';

const ORDENES: { id: Orden; label: string }[] = [
  { id: 'relevancia', label: 'Relevancia' },
  { id: 'menor', label: 'Menor precio' },
  { id: 'mayor', label: 'Mayor precio' },
  { id: 'nombre', label: 'Nombre A-Z' },
];

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const ordenar = (lista: Producto[], orden: Orden): Producto[] => {
  const conPrecio = (p: Producto) => p.precio ?? Number.POSITIVE_INFINITY;
  const copia = [...lista];
  if (orden === 'menor') return copia.sort((a, b) => conPrecio(a) - conPrecio(b));
  if (orden === 'mayor') return copia.sort((a, b) => (b.precio ?? -1) - (a.precio ?? -1));
  if (orden === 'nombre') return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return copia.sort((a, b) => Number(a.agotado) - Number(b.agotado));
};

export const Tienda = () => {
  const { categoria } = useParams<{ categoria?: Categoria }>();
  const [params, setParams] = useSearchParams();
  const { data: productos = [], isLoading } = useProductos();

  const sub = params.get('sub') as Subcategoria | null;
  const marca = params.get('marca');
  const q = params.get('q') ?? '';
  const orden = (params.get('orden') as Orden | null) ?? 'relevancia';

  const setParam = (clave: string, valor: string | null) => {
    const next = new URLSearchParams(params);
    if (valor) next.set(clave, valor);
    else next.delete(clave);
    setParams(next, { replace: true });
  };

  const deCategoria = useMemo(() => (categoria ? productos.filter((p) => p.categoria === categoria) : productos), [productos, categoria]);
  const subcategorias = useMemo(() => [...new Set(deCategoria.map((p) => p.subcategoria))], [deCategoria]);
  const marcas = useMemo(() => [...new Set(deCategoria.map((p) => p.marca))].sort((a, b) => a.localeCompare(b, 'es')), [deCategoria]);

  const resultado = useMemo(() => {
    const termino = normalizar(q.trim());
    const filtrados = deCategoria.filter(
      (p) =>
        (!sub || p.subcategoria === sub) &&
        (!marca || p.marca === marca) &&
        (!termino || normalizar(`${p.nombre} ${p.marca}`).includes(termino)),
    );
    return ordenar(filtrados, orden);
  }, [deCategoria, sub, marca, q, orden]);

  const titulo = CATEGORIAS.find((c) => c.id === categoria)?.nombre ?? 'Tienda';
  const hayFiltros = Boolean(sub || marca || q);

  return (
    <section className="py-12 sm:py-16">
      <div className="wrap">
        <nav className="mb-4 text-sm text-gris" aria-label="Migas de pan">
          <Link to="/" className="hover:text-tinta">Inicio</Link> / <Link to="/tienda" className="hover:text-tinta">Tienda</Link>
          {categoria && <> / <span className="text-tinta">{titulo}</span></>}
        </nav>
        <h1 className="display mb-8 text-[clamp(48px,7vw,96px)]">{titulo}</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          <Link to="/tienda" className={`chip ${!categoria ? 'chip-on' : ''}`}>Todo</Link>
          {CATEGORIAS.map((c) => (
            <Link key={c.id} to={`/tienda/${c.id}`} className={`chip ${categoria === c.id ? 'chip-on' : ''}`}>{c.nombre}</Link>
          ))}
        </div>

        <div className="mb-8 grid gap-3 rounded-2xl border border-linea bg-white/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative">
            <span className="sr-only">Buscar</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gris" />
            <input value={q} onChange={(e) => setParam('q', e.target.value || null)} placeholder="Buscar producto o marca" className="input pl-11" />
          </label>
          <select value={sub ?? ''} onChange={(e) => setParam('sub', e.target.value || null)} className="input" aria-label="Tipo de producto">
            <option value="">Todos los tipos</option>
            {subcategorias.map((s) => <option key={s} value={s}>{SUBCATEGORIAS[s]}</option>)}
          </select>
          <select value={marca ?? ''} onChange={(e) => setParam('marca', e.target.value || null)} className="input" aria-label="Marca">
            <option value="">Todas las marcas</option>
            {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={orden} onChange={(e) => setParam('orden', e.target.value === 'relevancia' ? null : e.target.value)} className="input" aria-label="Ordenar">
            {ORDENES.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-gris">
          <span>{resultado.length} {resultado.length === 1 ? 'producto' : 'productos'}</span>
          {hayFiltros && (
            <button type="button" onClick={() => setParams({}, { replace: true })} className="inline-flex items-center gap-1 font-semibold text-tinta">
              <X size={15} /> Limpiar filtros
            </button>
          )}
        </div>

        {isLoading ? null : resultado.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-linea py-20 text-center">
            <p className="mb-4 text-gris">No encontramos productos con esos filtros.</p>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="btn btn-tinta">Ver todo</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-[22px] lg:grid-cols-4">
            {resultado.map((p) => <ProductoCard key={p.id} producto={p} />)}
          </div>
        )}
      </div>
    </section>
  );
};
