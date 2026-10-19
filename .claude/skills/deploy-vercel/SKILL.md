---
name: deploy-vercel
description: Publicar la demo de TREE en Vercel para pasarle un link al cliente. Usar cuando pidan "subila", "deployá", "pasame un link" o "publicala".
---

# Deploy de la demo en Vercel

Publicar es una acción externa: **confirmá con Franco antes de correr el deploy** si no lo pidió explícitamente en este turno.

1. Verificá que todo compile: `npm run typecheck && npm run build`.
2. Revisá que la barra "Propuesta de rediseño para TREE · hecha por Argentina Webdesign" siga en `src/components/layout/Layout.tsx`
   y que `index.html` tenga `<meta name="robots" content="noindex">`. La demo **no** debe indexarse ni parecer la web oficial.
3. Opción A (CLI):
   ```bash
   npx vercel login        # una sola vez, interactivo: lo tiene que hacer Franco
   npx vercel --prod       # framework Vite, build `npm run build`, output `dist`
   ```
   Opción B (sin CLI): vercel.com → Add New → Project → subir la carpeta o el repo de GitHub. Vercel detecta Vite solo.
4. `vercel.json` ya tiene el rewrite SPA (las rutas como `/producto/x` funcionan al refrescar).
5. Nombre sugerido del proyecto: `tree-propuesta-awd` → `tree-propuesta-awd.vercel.app`. No usar "treeskate" solo, para no confundir con la web oficial.
6. Probá en el celular: home, un producto, agregar al carrito, checkout.

No hacen falta variables de entorno en la etapa 1.
