import { useState } from 'react';
import { X } from 'lucide-react';
import { TIENDA } from '@/config/tienda';
import { LogoWhatsapp } from '@/components/LogosRedes';

export const BotonesFlotantes = () => {
  const [aviso, setAviso] = useState(false);
  const whatsapp = TIENDA.contacto.whatsapp;
  const clases = 'grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:-translate-y-0.5';

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {aviso && (
        <div role="status" className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl bg-white p-4 text-sm shadow-xl">
          <button type="button" onClick={() => setAviso(false)} className="absolute right-2 top-2 p-1 text-gris hover:text-tinta" aria-label="Cerrar aviso">
            <X size={16} />
          </button>
          <b className="mb-1 block">WhatsApp de TREE</b>
          <span className="text-gris">Botón de muestra: se activa cuando TREE pase su número de WhatsApp.</span>
        </div>
      )}
      {whatsapp ? (
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp" className={clases}>
          <LogoWhatsapp />
        </a>
      ) : (
        <button type="button" onClick={() => setAviso((v) => !v)} aria-label="WhatsApp (de muestra)" aria-expanded={aviso} className={clases}>
          <LogoWhatsapp />
        </button>
      )}
    </div>
  );
};
