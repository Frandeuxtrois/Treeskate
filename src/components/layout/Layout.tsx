import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CarritoDrawer } from '@/components/layout/CarritoDrawer';
import { BotonesFlotantes } from '@/components/layout/BotonesFlotantes';

export const Layout = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <div className="bg-tinta px-4 py-2 text-center text-[12.5px] text-white">
        Propuesta de rediseño para TREE · hecha por{' '}
        <a href="https://argentinawebdesign.com.ar" target="_blank" rel="noopener" className="underline">
          Argentina Webdesign
        </a>
      </div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BotonesFlotantes />
      <CarritoDrawer />
    </>
  );
};
