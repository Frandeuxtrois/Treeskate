import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { CheckCircle2, Copy, Mail, MessageCircle } from 'lucide-react';
import { TIENDA } from '@/config/tienda';
import { formatPrecio } from '@/lib/formato';
import { linkEnvioPedido, textoPedido, type Pedido } from '@/lib/pedido';
import { PEDIDO_STORAGE_KEY } from '@/pages/Checkout';

const leerPedido = (state: unknown): Pedido | null => {
  if (state && typeof state === 'object' && 'numero' in state) return state as Pedido;
  try {
    const raw = sessionStorage.getItem(PEDIDO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pedido) : null;
  } catch {
    return null;
  }
};

export const PedidoConfirmado = () => {
  const { state } = useLocation();
  const [pedido] = useState(() => leerPedido(state));
  const [copiado, setCopiado] = useState(false);

  if (!pedido) {
    return (
      <section className="wrap py-24 text-center">
        <h1 className="display mb-6 text-6xl">No hay un pedido reciente</h1>
        <Link to="/tienda" className="btn btn-rojo">Ir a la tienda</Link>
      </section>
    );
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(textoPedido(pedido));
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  const porWhatsapp = Boolean(TIENDA.contacto.whatsapp);

  return (
    <section className="py-16 sm:py-20">
      <div className="wrap max-w-[760px]">
        <CheckCircle2 size={56} className="mb-6 text-azul" />
        <div className="kicker">Pedido {pedido.numero}</div>
        <h1 className="display mb-5 text-[clamp(44px,6.5vw,80px)]">¡Gracias, {pedido.datos.nombre.split(' ')[0]}!</h1>
        <p className="mb-10 text-lg leading-relaxed text-[#3a3a40]">
          Último paso: mandale el pedido a la tienda para que lo confirmen y te pasen los datos de pago
          {pedido.datos.envio === 'retiro' ? ' y retiro' : ' y el costo de envío'}.
        </p>

        <div className="mb-8 flex flex-wrap gap-3">
          <a href={linkEnvioPedido(pedido)} target="_blank" rel="noopener" className="btn btn-rojo">
            {porWhatsapp ? <MessageCircle size={18} /> : <Mail size={18} />}
            Enviar pedido por {porWhatsapp ? 'WhatsApp' : 'email'}
          </a>
          <button type="button" onClick={copiar} className="btn btn-borde">
            <Copy size={16} /> {copiado ? 'Copiado' : 'Copiar resumen'}
          </button>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-8">
          <h2 className="display mb-4 text-3xl">Resumen</h2>
          <ul className="divide-y divide-linea">
            {pedido.items.map((i) => (
              <li key={i.clave} className="flex justify-between gap-4 py-3 text-[15px]">
                <span>
                  {i.cantidad} × {i.nombre}
                  <span className="block text-sm text-gris">{[i.variante !== 'Única' ? i.variante : null, i.talle].filter(Boolean).join(' · ')}</span>
                </span>
                <span className="font-semibold">{formatPrecio(i.precio * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-linea pt-4 text-xl font-bold">
            <span>Total</span>
            <span>{formatPrecio(pedido.subtotal)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
