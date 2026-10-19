import { Link } from 'react-router';
import { CATEGORIAS, TIENDA } from '@/config/tienda';

export const Footer = () => (
  <footer className="mt-24 bg-tinta pb-7 pt-[72px] text-[#cfcfd4]">
    <div className="wrap">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-[18px] inline-block rounded-[10px] bg-white px-3.5 py-2.5">
            <img src="/img/logo.png" alt="TREE" className="h-7" />
          </div>
          <p className="max-w-[300px] text-sm leading-relaxed">
            {TIENDA.lema}. Pensado y diseñado por skaters.
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            {TIENDA.local.direccion}
            <br />
            {TIENDA.local.horario}
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-[13px] uppercase tracking-[1.5px] text-white">Tienda</h4>
          <ul className="grid gap-2.5 text-sm">
            {CATEGORIAS.map((c) => (
              <li key={c.id}>
                <Link to={`/tienda/${c.id}`} className="hover:text-white">{c.nombre}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[13px] uppercase tracking-[1.5px] text-white">Ayuda</h4>
          <ul className="grid gap-2.5 text-sm">
            <li><Link to="/ayuda#como-comprar" className="hover:text-white">Cómo comprar</Link></li>
            <li><Link to="/ayuda#envios" className="hover:text-white">Envíos</Link></li>
            <li><Link to="/ayuda#cambios" className="hover:text-white">Cambios y devoluciones</Link></li>
            <li><Link to="/nosotros#mayoristas" className="hover:text-white">Vendé TREE en tu tienda</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[13px] uppercase tracking-[1.5px] text-white">Contacto</h4>
          <ul className="grid gap-2.5 text-sm">
            <li><a href={TIENDA.contacto.telefonoHref} className="hover:text-white">{TIENDA.contacto.telefono}</a></li>
            <li><a href={`mailto:${TIENDA.contacto.email}`} className="hover:text-white">{TIENDA.contacto.email}</a></li>
            <li><a href={`https://instagram.com/${TIENDA.contacto.instagram}`} target="_blank" rel="noopener" className="hover:text-white">Instagram</a></li>
            <li><a href={`https://facebook.com/${TIENDA.contacto.facebook}`} target="_blank" rel="noopener" className="hover:text-white">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-[#2a2a2e] pt-6 text-[13px] text-[#8b8b92]">
        <span>© {new Date().getFullYear()} TREE Skateboarding · Buenos Aires</span>
        <a href="https://argentinawebdesign.com.ar" target="_blank" rel="noopener" className="hover:text-white">
          Diseño y desarrollo: Argentina Webdesign
        </a>
      </div>
    </div>
  </footer>
);
