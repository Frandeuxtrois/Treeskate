import { ENVIOS, TIENDA, type MetodoEnvio } from '@/config/tienda';
import { formatPrecio } from '@/lib/formato';
import type { ItemCarrito } from '@/types/producto';

export interface DatosPedido {
  nombre: string;
  email: string;
  telefono: string;
  envio: MetodoEnvio;
  direccion?: string;
  localidad?: string;
  codigoPostal?: string;
  notas?: string;
}

export interface Pedido {
  numero: string;
  fecha: string;
  datos: DatosPedido;
  items: ItemCarrito[];
  subtotal: number;
}

export const crearNumeroPedido = (): string => `TR-${Date.now().toString(36).toUpperCase().slice(-6)}`;

export const textoPedido = (pedido: Pedido): string => {
  const envio = ENVIOS.find((e) => e.id === pedido.datos.envio);
  const lineas = pedido.items.map((i) => {
    const extra = [i.variante !== 'Única' ? i.variante : null, i.talle ? `talle ${i.talle}` : null].filter(Boolean).join(', ');
    return `• ${i.cantidad} x ${i.nombre}${extra ? ` (${extra})` : ''}: ${formatPrecio(i.precio * i.cantidad)}`;
  });
  const destino =
    pedido.datos.envio === 'retiro'
      ? 'Retiro en el local'
      : `${envio?.nombre ?? ''}: ${pedido.datos.direccion ?? ''}, ${pedido.datos.localidad ?? ''} (CP ${pedido.datos.codigoPostal ?? '-'})`;

  return [
    `Hola ${TIENDA.nombre}! Quiero hacer este pedido (${pedido.numero}):`,
    '',
    ...lineas,
    '',
    `Subtotal: ${formatPrecio(pedido.subtotal)}`,
    `Entrega: ${destino}`,
    '',
    `Nombre: ${pedido.datos.nombre}`,
    `Tel: ${pedido.datos.telefono}`,
    `Email: ${pedido.datos.email}`,
    pedido.datos.notas ? `Notas: ${pedido.datos.notas}` : '',
  ]
    .filter((l, idx, arr) => !(l === '' && arr[idx - 1] === ''))
    .join('\n')
    .trim();
};

export const linkEnvioPedido = (pedido: Pedido): string => {
  const texto = textoPedido(pedido);
  if (TIENDA.contacto.whatsapp) return `https://wa.me/${TIENDA.contacto.whatsapp}?text=${encodeURIComponent(texto)}`;
  return `mailto:${TIENDA.contacto.email}?subject=${encodeURIComponent(`Pedido ${pedido.numero}`)}&body=${encodeURIComponent(texto)}`;
};
