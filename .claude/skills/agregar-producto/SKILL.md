---
name: agregar-producto
description: Agregar, editar o quitar un producto del catálogo de TREE (nombre, precio, variantes, imágenes). Usar cuando pidan "agregá este producto", "cambiá el precio de…", "sacá…", o pasen un link de treeskate.com/product-page/…
---

# Agregar / editar un producto

El catálogo NO se edita en `src/data/productos.json` (es generado). Se edita la fuente y se regenera.

1. Si te pasan un link de `treeskate.com/product-page/…`, usá WebFetch para sacar nombre, precio y los media ids de imagen (`3dfe29_<id>~mv2.<ext>` → guardar `<id>~mv2.<ext>`).
2. Editá `scripts/catalogo-fuente.json`:
   ```json
   { "nombre": "Remera Tree Ejemplo", "marca": "Tree", "categoria": "ropa", "subcategoria": "remeras",
     "precio": 25000, "variantes": [["Negra", "<id>~mv2.jpg"], ["Blanca", "<id>~mv2.jpg"]] }
   ```
   - `precio`: entero en ARS, `null` si está agotado.
   - Una sola imagen → `[["Única", "<id>"]]`.
   - Para tablas con varias medidas, la etiqueta es la medida (`"8.25\""`): la página de producto muestra "Medida" y no agrega talles.
   - Si la imagen no es de Wix, copiala a `public/productos/<slug>-<n>.webp` a mano y no la pongas en la fuente; avisá que habría que llevarla a Storage en la etapa 2.
3. `npm run catalogo` (baja solo las imágenes nuevas).
4. Si tiene que aparecer en la home, sumá el slug a `DESTACADOS` en `src/config/tienda.ts` (máximo 8).
5. `npm run typecheck`.
6. Opcional: `npm run build && npm run capturas -- /producto/<slug>` y revisá la captura.

El slug sale del nombre: minúsculas, sin acentos, espacios → `-` (por ejemplo "Öus Döts Prt Branco II" → `ous-dots-prt-branco-ii`).
