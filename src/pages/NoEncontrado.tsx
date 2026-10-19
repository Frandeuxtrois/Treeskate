import { Link } from 'react-router';

export const NoEncontrado = () => (
  <section className="wrap py-28 text-center">
    <div className="display mb-2 text-[clamp(96px,18vw,220px)] text-rojo">404</div>
    <h1 className="display mb-6 text-4xl">Esta página se fue al bowl</h1>
    <Link to="/tienda" className="btn btn-tinta">Volver a la tienda</Link>
  </section>
);
