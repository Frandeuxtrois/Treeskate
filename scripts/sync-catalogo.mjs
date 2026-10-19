// Genera src/data/productos.json y descarga las imágenes a public/productos/
// a partir de scripts/catalogo-fuente.json (datos relevados de treeskate.com).
// Uso: npm run catalogo            -> solo baja imágenes que faltan
//      npm run catalogo -- --forzar -> vuelve a bajar todas
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR_IMG = join(RAIZ, 'public', 'productos');
const SALIDA = join(RAIZ, 'src', 'data', 'productos.json');
const WIX = 'https://static.wixstatic.com/media/3dfe29_';
const forzar = process.argv.includes('--forzar');

const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

mkdirSync(DIR_IMG, { recursive: true });
mkdirSync(dirname(SALIDA), { recursive: true });

const fuente = JSON.parse(readFileSync(join(RAIZ, 'scripts', 'catalogo-fuente.json'), 'utf8'));
const productos = [];
let bajadas = 0;

for (const p of fuente) {
  const slug = slugify(p.nombre);
  const variantes = [];
  for (const [i, [etiqueta, media]] of p.variantes.entries()) {
    const archivo = `${slug}-${i + 1}.webp`;
    const destino = join(DIR_IMG, archivo);
    if (forzar || !existsSync(destino)) {
      // "fit" (no "fill") para no rellenar con negro las transparencias de los PNG
      const res = await fetch(`${WIX}${media}/v1/fit/w_1000,h_1000,q_90/${archivo}`);
      if (!res.ok) throw new Error(`No se pudo bajar ${p.nombre} (${etiqueta}): HTTP ${res.status}`);
      writeFileSync(destino, Buffer.from(await res.arrayBuffer()));
      bajadas++;
    }
    variantes.push({ etiqueta, imagen: `/productos/${archivo}` });
  }
  productos.push({
    id: slug,
    slug,
    nombre: p.nombre,
    marca: p.marca,
    categoria: p.categoria,
    subcategoria: p.subcategoria,
    precio: p.precio,
    agotado: p.precio === null,
    variantes,
  });
}

writeFileSync(SALIDA, JSON.stringify(productos, null, 2) + '\n');
console.log(`${productos.length} productos -> src/data/productos.json (${bajadas} imágenes bajadas)`);
