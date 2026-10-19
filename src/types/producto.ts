export type Categoria = 'skate' | 'zapatillas' | 'ropa' | 'accesorios';

export type Subcategoria =
  | 'tablas'
  | 'rulemanes'
  | 'zapatillas'
  | 'remeras'
  | 'buzos'
  | 'camperas'
  | 'camisas'
  | 'pantalones'
  | 'gorras'
  | 'bolsos';

export interface Variante {
  etiqueta: string;
  imagen: string;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  marca: string;
  categoria: Categoria;
  subcategoria: Subcategoria;
  /** ARS sin decimales. null = sin precio publicado (agotado). */
  precio: number | null;
  agotado: boolean;
  variantes: Variante[];
}

export interface ItemCarrito {
  /** slug + variante + talle: identifica la línea del carrito */
  clave: string;
  slug: string;
  nombre: string;
  precio: number;
  imagen: string;
  variante: string;
  talle: string | null;
  cantidad: number;
}
