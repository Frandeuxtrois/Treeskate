import type { Categoria, Subcategoria } from '@/types/producto';

// Datos relevados de treeskate.com (oct 2026). Todo lo que no figura en su web
// está marcado como PENDIENTE y hay que confirmarlo con el cliente.
export const TIENDA = {
  nombre: 'TREE',
  fundacion: 2000,
  lema: 'Skateboarding argentino desde el año 2000',
  historia: [
    'Creada en el año 2000, TREE es una marca de skateboarding argentina pensada y diseñada por skaters.',
    'Nuestro objetivo es difundir esta forma de vida a lo largo del país.',
  ],
  local: {
    direccion: 'Av. Santa Fe 1670, Local 55 · Planta Alta',
    ciudad: 'CABA, Buenos Aires',
    horario: 'Lunes a sábados · 11 a 19 hs',
    mapsQuery: 'Av. Santa Fe 1670, Buenos Aires',
  },
  contacto: {
    telefono: '(011) 5811-1336',
    telefonoHref: 'tel:+541158111336',
    email: 'treeargentina@gmail.com',
    instagram: 'treebuenosaires',
    facebook: 'treebuenosaires',
    // PENDIENTE: no publican un WhatsApp. Si lo pasan, el checkout lo usa en vez del mail.
    whatsapp: null as string | null,
  },
} as const;

export const CATEGORIAS: { id: Categoria; nombre: string; imagen: string }[] = [
  { id: 'skate', nombre: 'Skate', imagen: '/productos/tabla-maple-craim-1.webp' },
  { id: 'zapatillas', nombre: 'Zapatillas', imagen: '/productos/ous-imigrante-notorio-essencial-1.webp' },
  { id: 'ropa', nombre: 'Ropa', imagen: '/productos/remera-grizzly-og-bear-white-black-1.webp' },
  { id: 'accesorios', nombre: 'Accesorios', imagen: '/productos/gorra-grizzly-fire-starter-1.webp' },
];

export const SUBCATEGORIAS: Record<Subcategoria, string> = {
  tablas: 'Tablas',
  rulemanes: 'Rulemanes',
  zapatillas: 'Zapatillas',
  remeras: 'Remeras',
  buzos: 'Buzos',
  camperas: 'Camperas',
  camisas: 'Camisas',
  pantalones: 'Pantalones',
  gorras: 'Gorras',
  bolsos: 'Riñoneras y bolsos',
};

// PENDIENTE: su web pide "MEDIDAS"/talle pero no publica los valores. Son talles estándar de referencia.
export const TALLES: Partial<Record<Subcategoria, string[]>> = {
  tablas: ['8.0"', '8.25"', '8.5"'],
  zapatillas: ['38', '39', '40', '41', '42', '43', '44'],
  remeras: ['S', 'M', 'L', 'XL'],
  buzos: ['S', 'M', 'L', 'XL'],
  camperas: ['S', 'M', 'L', 'XL'],
  camisas: ['S', 'M', 'L', 'XL'],
  pantalones: ['38', '40', '42', '44', '46'],
};

export const DESTACADOS = [
  'tabla-maple-vog-mariano-gonzalez',
  'tabla-maple-grizzly-sanskrit',
  'ous-imigrante-notorio-essencial',
  'gorra-grizzly-fire-starter',
  'campera-bomber-tree',
  'ous-dots-marrom-branco-preto',
  'remera-grizzly-og-bear-white-black',
  'pantalon-tree-baggy',
];

export const ENVIOS = [
  {
    id: 'retiro',
    nombre: 'Retiro en el local',
    detalle: 'Av. Santa Fe 1670, Local 55. Lunes a sábados de 11 a 19 hs.',
    costo: 0,
  },
  {
    id: 'moto',
    nombre: 'Moto en CABA',
    detalle: 'Motomensajería dentro de Capital. El envío se abona al recibir.',
    costo: null,
  },
  {
    id: 'shipnow',
    nombre: 'Envío con Shipnow',
    detalle: 'A domicilio en GBA y todo el interior del país. Se cotiza al confirmar el pedido.',
    costo: null,
  },
] as const;

export type MetodoEnvio = (typeof ENVIOS)[number]['id'];

// Texto de treeskate.com/cambios-y-devoluciones. PENDIENTE: esa página dice horario 11 a 20:30; el resto del sitio, 11 a 19.
export const POLITICA_CAMBIOS = [
  'Los cambios deben realizarse dentro de los 30 días corridos desde la fecha de recepción del producto.',
  'En el local: presentá la factura de compra y el producto con sus etiquetas y packaging originales.',
  'Si compraste desde el interior, comunicate al (011) 5811-1336.',
  'Las devoluciones proceden si el talle o modelo no corresponde al elegido en la compra, o si el producto llegó dañado.',
  'Se toma el valor abonado, ya sea en efectivo o con tarjeta, con o sin descuento.',
  'Si el producto no corresponde a la orden de compra o llegó dañado, TREE se hace cargo del costo de envío y retiro.',
];
