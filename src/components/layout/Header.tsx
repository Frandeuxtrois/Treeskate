import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { CATEGORIAS } from '@/config/tienda';
import { useCarrito } from '@/context/CarritoContext';

const links = [
  ...CATEGORIAS.map((c) => ({ to: `/tienda/${c.id}`, label: c.nombre })),
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/ayuda', label: 'Ayuda' },
];

export const Header = () => {
  const { cantidadTotal, abrir } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuAbierto(false), [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-linea bg-papel/90 backdrop-blur-md">
      <div className="flex h-[72px] w-full px-4 sm:px-6 lg:px-10 items-center justify-between gap-4">
        <Link to="/" aria-label="TREE, inicio">
          <img src="/img/logo.png" alt="TREE" className="h-[34px] w-auto" />
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex gap-7 text-sm font-semibold uppercase tracking-[0.6px]">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `relative py-1.5 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-rojo after:transition-all ${
                      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/tienda" className="btn btn-rojo hidden sm:inline-flex">
            Tienda
          </Link>
          <button
            type="button"
            onClick={abrir}
            className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-black/5"
            aria-label={`Abrir carrito (${cantidadTotal} productos)`}
          >
            <ShoppingBag size={22} />
            {cantidadTotal > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rojo px-1 text-[11px] font-bold text-white">
                {cantidadTotal}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-black/5 lg:hidden"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <nav className="border-t border-linea bg-papel lg:hidden">
          <ul className="wrap flex flex-col py-3">
            {[{ to: '/tienda', label: 'Toda la tienda' }, ...links].map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className="block border-b border-linea py-4 font-display text-2xl uppercase">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
