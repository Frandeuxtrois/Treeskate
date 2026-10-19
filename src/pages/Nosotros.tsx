import { Link } from 'react-router';
import { TIENDA } from '@/config/tienda';
import { LocalSeccion } from '@/components/LocalSeccion';

export const Nosotros = () => (
  <>
    <section className="relative overflow-hidden bg-tinta py-24 text-white sm:py-32">
      <img src="/img/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="wrap relative">
        <div className="kicker">Desde {TIENDA.fundacion}</div>
        <h1 className="display max-w-[12ch] text-[clamp(56px,9vw,128px)]">
          Pensado y diseñado por <span className="text-rojo">skaters</span>
        </h1>
      </div>
    </section>

    <section className="py-16 sm:py-24">
      <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          {TIENDA.historia.map((p) => (
            <p key={p} className="mb-6 text-2xl leading-snug sm:text-3xl">{p}</p>
          ))}
          <Link to="/tienda" className="btn btn-rojo mt-4">Ver la colección</Link>
        </div>
        <img src="/img/nosotros.jpg" alt="Remera TREE" className="aspect-[4/3] w-full rounded-[22px] object-cover" />
      </div>
    </section>

    <section id="mayoristas" className="scroll-mt-24">
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] border-2 border-tinta p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <div className="kicker">Mayoristas</div>
            <h2 className="display text-[clamp(32px,4vw,52px)]">¿Te gustaría vender TREE en tu tienda?</h2>
          </div>
          <a href={`mailto:${TIENDA.contacto.email}?subject=${encodeURIComponent('Quiero vender TREE en mi tienda')}`} className="btn btn-tinta flex-none">
            Escribinos
          </a>
        </div>
      </div>
    </section>

    <LocalSeccion />
  </>
);
