-- Etapa 2: tienda real. Todavía NO está aplicado en ningún proyecto de Supabase.
-- Refleja los tipos de src/types/producto.ts para que el cambio de JSON -> Supabase
-- sea solo reemplazar src/services/productos.ts.

create table public.productos (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  nombre        text not null,
  marca         text not null,
  categoria     text not null check (categoria in ('skate', 'zapatillas', 'ropa', 'accesorios')),
  subcategoria  text not null,
  precio        integer check (precio is null or precio >= 0), -- ARS sin decimales; null = sin precio
  activo        boolean not null default true,
  creado_en     timestamptz not null default now()
);

create table public.variantes (
  id           uuid primary key default gen_random_uuid(),
  producto_id  uuid not null references public.productos (id) on delete cascade,
  etiqueta     text not null,
  imagen       text not null, -- path en Supabase Storage (bucket "productos")
  orden        smallint not null default 0
);

create table public.stock (
  variante_id  uuid not null references public.variantes (id) on delete cascade,
  talle        text not null default '',
  cantidad     integer not null default 0 check (cantidad >= 0),
  primary key (variante_id, talle)
);

create table public.pedidos (
  id                 uuid primary key default gen_random_uuid(),
  numero             text not null unique,
  estado             text not null default 'pendiente'
                     check (estado in ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
  nombre             text not null,
  email              text not null,
  telefono           text not null,
  envio              text not null check (envio in ('retiro', 'moto', 'shipnow')),
  direccion          text,
  localidad          text,
  codigo_postal      text,
  notas              text,
  subtotal           integer not null,
  costo_envio        integer,
  mp_preference_id   text, -- Mercado Pago
  mp_payment_id      text,
  creado_en          timestamptz not null default now()
);

create table public.pedido_items (
  id           uuid primary key default gen_random_uuid(),
  pedido_id    uuid not null references public.pedidos (id) on delete cascade,
  producto_id  uuid references public.productos (id),
  nombre       text not null, -- copia al momento de la compra
  variante     text not null,
  talle        text,
  precio       integer not null,
  cantidad     integer not null check (cantidad > 0)
);

-- Lectura pública del catálogo; pedidos solo vía Edge Function con service role.
alter table public.productos   enable row level security;
alter table public.variantes   enable row level security;
alter table public.stock       enable row level security;
alter table public.pedidos     enable row level security;
alter table public.pedido_items enable row level security;

create policy "catalogo publico" on public.productos for select using (activo);
create policy "variantes publicas" on public.variantes for select using (true);
create policy "stock publico" on public.stock for select using (true);
