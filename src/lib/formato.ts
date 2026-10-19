const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export const formatPrecio = (valor: number): string => ars.format(valor);
