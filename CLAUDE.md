# TREE · Rediseño de tienda online (propuesta de Argentina Webdesign)

## Qué es este proyecto

**TREE** es una marca argentina de skateboarding fundada en el año 2000. Tiene un local en
Av. Santa Fe 1670 (CABA) y una web vieja en Wix: **https://www.treeskate.com**.

Su web actual tiene problemas visibles: links rotos (por ejemplo "Ropa" lleva a Envíos y "Thrasher" a `/treasher`), una página
de "Compras durante COVID-19", texto de plantilla suelto ("Ancla 1") y un inicio sin productos.

Este repo es una **propuesta de rediseño que hace Franco Vigo (Argentina Webdesign) para
venderles una web nueva**. TREE **todavía no es cliente**: nadie de TREE pidió ni aprobó esto.
Es material de prospección: la idea es mostrárselo al dueño (en el local o por mail) con un
link de Vercel y cerrar el proyecto.

> Contexto del negocio: Argentina Webdesign es el emprendimiento de Franco. Al momento de crear
> esto (oct 2026) no tenía clientes, y TREE es el primer prospecto serio. Prioridad: que la demo
> **se sienta real** y que **no contenga datos inventados sobre TREE**.

## Etapas

| Etapa | Estado | Qué incluye |
|---|---|---|
| **1. Demo navegable** | ✅ Hecha | Home, tienda con filtros, producto, carrito, checkout que genera el pedido y lo manda por mail. Sin backend. Datos reales de su web. |
| **2. Tienda real** | ⏳ Solo si TREE paga | Supabase (catálogo + stock + pedidos), Mercado Pago, panel de carga para TREE, dominio. |

**No avanzar con la etapa 2 sin que TREE haya aceptado y pagado.** Es el 80% del trabajo.

## Stack

- Vite 8 + React 18 + TypeScript (estricto, `noUncheckedIndexedAccess`) + Tailwind CSS v3
- React Router v7 (`import … from 'react-router'`)
- TanStack Query v5 (ya preparado para cuando los datos vengan de Supabase)
- React Hook Form (checkout)
- lucide-react (únicos íconos permitidos)
- Alias `@/` → `src/`

## Comandos

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc -b + vite build -> dist/
npm run typecheck    # correr SIEMPRE antes de dar algo por terminado
npm run catalogo     # regenera src/data/productos.json y baja imágenes faltantes
npm run catalogo -- --forzar   # vuelve a bajar todas las imágenes
npm run capturas     # (requiere build) screenshots desktop + mobile en capturas/
npm run capturas -- /tienda /producto/<slug>   # solo esas rutas (desde PowerShell; Git Bash convierte "/" en una ruta de Windows)
```

## Estructura

```
src/
  config/tienda.ts        Datos del local, contacto, envíos, política de cambios, talles, destacados. FUENTE DE VERDAD del negocio.
  data/productos.json     GENERADO por scripts/sync-catalogo.mjs. No editar a mano.
  types/producto.ts       Producto, Variante, ItemCarrito, Categoria, Subcategoria.
  services/productos.ts   fetchProductos / fetchProducto. Hoy leen el JSON; en etapa 2 consultan Supabase (mismas firmas).
  hooks/useProductos.ts   useProductos / useProducto (TanStack Query).
  context/CarritoContext.tsx  Carrito global, persistido en localStorage ("tree-carrito"). Abre el drawer al agregar.
  lib/pedido.ts           Arma el texto del pedido y el link de envío (WhatsApp si hay número, si no mailto).
  lib/formato.ts          formatPrecio (ARS, sin decimales).
  components/layout/      Layout (barra "Propuesta de rediseño", scroll al cambiar de ruta), Header, Footer, CarritoDrawer.
  components/             ProductoCard, LocalSeccion (datos + mapa de Google embebido).
  pages/                  Inicio, Tienda, Producto, Checkout, PedidoConfirmado, Nosotros, Ayuda, NoEncontrado.
scripts/
  catalogo-fuente.json    Catálogo relevado a mano de treeskate.com (nombre, marca, categoría, precio, ids de imagen Wix).
  sync-catalogo.mjs       Genera productos.json y baja las imágenes de Wix a public/productos/*.webp.
  capturas.mjs            Screenshots con Edge/Chrome headless sobre `vite preview`.
public/
  img/                    logo.png, hero.jpg, nosotros.jpg (de su web).
  productos/              76 imágenes .webp (53 productos, varios con variantes).
supabase/schema.sql       Esquema para la etapa 2. NO aplicado todavía.
.claude/agents, .claude/skills   Ver abajo.
```

## Rutas

| Ruta | Página |
|---|---|
| `/` | Inicio: hero, categorías, destacados con filtro, banda de beneficios, historia, marcas, local |
| `/tienda`, `/tienda/:categoria` | Catálogo. Filtros en query string: `?sub=remeras&marca=Tree&q=gorra&orden=menor` |
| `/producto/:slug` | Galería de variantes, medida/talle, cantidad, agregar al carrito, relacionados |
| `/checkout` | Datos, entrega (retiro / moto CABA / Shipnow), notas. Valida con RHF |
| `/pedido-confirmado` | Resumen y botón "Enviar pedido por email" (mailto a TREE con el detalle) + copiar |
| `/nosotros` | Historia real + sección mayoristas (`#mayoristas`) + local |
| `/ayuda` | `#como-comprar`, `#envios`, `#cambios` |

`vercel.json` reescribe todo a `index.html` (SPA).

## Datos: qué es real y qué no

**Real (sacado de treeskate.com en oct 2026):**
- 53 productos / 76 variantes con nombre, marca, precio e imagen. Precios en ARS tal cual estaban publicados.
- Historia: "Creada en el año 2000, TREE es una marca de Skateboarding Argentina pensada y diseñada por skaters…"
- Local: Av. Santa Fe 1670, Local 55, P.A. Lunes a sábados de 11 a 19 hs. Tel 5811-1336. treeargentina@gmail.com. IG/FB @treebuenosaires.
- Envíos: Shipnow (GBA e interior), motomensajería en CABA (se paga al recibir), retiro en el local.
- Cambios: 30 días corridos, con factura, etiquetas y packaging. TREE paga el envío si llegó mal o dañado.

**PENDIENTE de confirmar con TREE (marcado en `src/config/tienda.ts`):**
- `TALLES`: su web pide "MEDIDAS"/talle pero no publica valores. Los que hay son estándar de referencia.
- `whatsapp`: no publican uno. Si lo pasan, se carga en `TIENDA.contacto.whatsapp` (formato `549…`) y el checkout pasa a WhatsApp solo.
- Nombres de variantes "Modelo 1/2/3": en su web son publicaciones duplicadas sin color indicado.
- Stock real: hoy solo "Remera Tree Sunrise" figura agotada.

**Regla: no inventar datos de TREE** (cuotas, tiempos de despacho, cantidad de ventas, "más vendido", provincias, etc.).
Si una sección necesita un dato que no tenemos, usar algo derivado de los datos reales (por ejemplo,
cantidad de productos = `productos.length`) o dejarlo afuera. La primera maqueta tenía datos inventados
que se sacaron por esto.

## Cómo actualizar el catálogo

1. Editar `scripts/catalogo-fuente.json`. Cada producto: `nombre`, `marca`, `categoria`, `subcategoria`,
   `precio` (o `null` si está agotado) y `variantes: [[etiqueta, mediaIdWix], …]`.
   El media id de Wix es la parte `xxxxx~mv2.ext` de `https://static.wixstatic.com/media/3dfe29_xxxxx~mv2.ext`.
2. `npm run catalogo`
3. `npm run typecheck`

Hay un agente (`catalogo-sync`) que hace el relevamiento contra treeskate.com y una skill (`agregar-producto`).

## Diseño

- Colores de marca (del logo): `rojo #D7232A`, `azul #0B2E6B`. Fondo `papel #F3F0E8`, texto `tinta #0E0E10`.
- Tipografías: **Anton** (títulos, clase `.display`, siempre en mayúsculas) + **Inter** (texto).
- Componentes de utilidad en `src/index.css`: `.wrap`, `.display`, `.kicker`, `.btn`, `.btn-rojo`, `.btn-tinta`, `.btn-borde`, `.chip`, `.chip-on`, `.input`, `.link-subrayado`.
- Fotos de producto sobre fondo blanco con `object-contain` y padding; tarjetas con `rounded-2xl`.
- Mobile first: probar siempre a 390px (`npm run capturas`).
- El usuario (Franco) tiene daltonismo leve: no distinguir estados solo por rojo/verde.

## Convenciones

- Componentes funcionales con arrow functions nombradas y `export const`.
- Dominio en español (`producto`, `carrito`, `talle`, `pedido`), infraestructura en inglés (`query`, `context`, `hook`).
- Sin `any`. Sin comentarios salvo que el porqué no sea obvio.
- Todo dato de negocio vive en `src/config/tienda.ts`, no hardcodeado en páginas.

## Deploy (demo)

Vercel: importar la carpeta o `npx vercel --prod`. Build `npm run build`, output `dist`. No necesita variables de entorno.
Ver skill `deploy-vercel`. El `<meta name="robots" content="noindex">` evita que Google indexe la demo: **sacarlo recién en producción real**.

## Etapa 2 (cuando TREE confirme)

1. Crear proyecto Supabase, aplicar `supabase/schema.sql`, subir imágenes a Storage (bucket `productos`).
2. Script de seed desde `src/data/productos.json`.
3. Reemplazar `src/services/productos.ts` por queries a Supabase (mismas firmas → las páginas no cambian).
4. Checkout: Edge Function que crea el pedido + preferencia de Mercado Pago (`VITE_MERCADOPAGO_PUBLIC_KEY`), webhook que marca `pagado`.
5. Panel `/admin` con Supabase Auth para que TREE cargue productos, precios y stock.
6. Dominio treeskate.com → Vercel. Sacar la barra "Propuesta de rediseño" del Layout y el `noindex`.

## Para retomar con otro Claude

- Leé este archivo entero primero.
- Antes de terminar cualquier cambio: `npm run typecheck` y, si tocaste UI, `npm run build && npm run capturas` y mirá las imágenes de `capturas/`.
- Si algo es un dato de TREE que no está acá, preguntá; no lo inventes.
