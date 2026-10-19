import { TIENDA } from '@/config/tienda';

export const LocalSeccion = () => (
  <section id="local" className="scroll-mt-24 pt-16 sm:pt-24">
    <div className="wrap">
      <div className="grid overflow-hidden rounded-[28px] bg-azul text-white lg:grid-cols-[1fr_1.1fr]">
        <div className="px-7 py-10 sm:p-[60px]">
          <div className="kicker !text-white/75">Vení a probarte</div>
          <h2 className="display mb-7 text-[clamp(40px,5vw,66px)]">Nuestro local</h2>
          {[
            { l: 'Dirección', v: TIENDA.local.direccion },
            { l: 'Horarios', v: TIENDA.local.horario },
            { l: 'Contacto', v: `${TIENDA.contacto.telefono} · ${TIENDA.contacto.email}` },
          ].map((d) => (
            <div key={d.l} className="border-t border-white/20 py-[18px] last:border-b">
              <small className="mb-1 block text-xs uppercase tracking-[1.5px] opacity-70">{d.l}</small>
              <b className="break-words text-[17px] font-semibold">{d.v}</b>
            </div>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-rojo" href={`https://maps.google.com/?q=${encodeURIComponent(TIENDA.local.mapsQuery)}`} target="_blank" rel="noopener">
              Cómo llegar
            </a>
            <a className="btn btn-borde" href={`https://instagram.com/${TIENDA.contacto.instagram}`} target="_blank" rel="noopener">
              @{TIENDA.contacto.instagram}
            </a>
          </div>
        </div>
        <iframe
          title="Mapa del local de TREE"
          src={`https://www.google.com/maps?q=${encodeURIComponent(TIENDA.local.mapsQuery)}&output=embed`}
          className="h-full min-h-[360px] w-full border-0 grayscale-[.3]"
        />
      </div>
    </div>
  </section>
);
