import { Link } from 'react-router';
import { ENVIOS, POLITICA_CAMBIOS, TIENDA } from '@/config/tienda';

const PASOS = [
  'Elegí los productos y agregalos al carrito. Lo ves arriba a la derecha.',
  'Elegí cómo lo querés recibir: retiro en el local, moto en CABA o envío con Shipnow.',
  'Completá tus datos tal cual figuran en tu documento, así coinciden al retirar.',
  'Confirmá el pedido y mandalo a la tienda. Te respondemos con el pago y la entrega.',
];

export const Ayuda = () => (
  <section className="py-12 sm:py-16">
    <div className="wrap max-w-[880px]">
      <h1 className="display mb-12 text-[clamp(48px,7vw,96px)]">Ayuda</h1>

      <div id="como-comprar" className="mb-14 scroll-mt-28">
        <h2 className="display mb-6 text-4xl">Cómo comprar</h2>
        <ol className="space-y-4">
          {PASOS.map((p, i) => (
            <li key={p} className="flex gap-4 rounded-2xl bg-white p-5">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-rojo font-display text-lg text-white">{i + 1}</span>
              <span className="pt-1.5">{p}</span>
            </li>
          ))}
        </ol>
      </div>

      <div id="envios" className="mb-14 scroll-mt-28">
        <h2 className="display mb-6 text-4xl">Envíos y retiro</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {ENVIOS.map((e) => (
            <div key={e.id} className="rounded-2xl bg-white p-5">
              <b className="mb-2 block">{e.nombre}</b>
              <p className="text-sm text-gris">{e.detalle}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="cambios" className="mb-14 scroll-mt-28">
        <h2 className="display mb-6 text-4xl">Cambios y devoluciones</h2>
        <ul className="space-y-3">
          {POLITICA_CAMBIOS.map((p) => (
            <li key={p} className="flex gap-3 leading-relaxed">
              <span className="mt-2.5 h-2 w-2 flex-none rounded-sm bg-rojo" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[28px] bg-azul p-8 text-white sm:p-10">
        <h2 className="display mb-3 text-4xl">¿Tenés dudas?</h2>
        <p className="mb-6 opacity-90">
          Escribinos a {TIENDA.contacto.email}, llamanos al {TIENDA.contacto.telefono} o pasá por el local ({TIENDA.local.horario.toLowerCase()}).
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${TIENDA.contacto.email}`} className="btn btn-rojo">Escribinos</a>
          <Link to="/nosotros#mayoristas" className="btn btn-borde">Soy comercio</Link>
        </div>
      </div>
    </div>
  </section>
);
