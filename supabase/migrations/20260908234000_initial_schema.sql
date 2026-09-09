begin;

create extension if not exists pgcrypto with schema extensions;

create type public.product_label as enum (
  'bestseller',
  'new',
  'spicy'
);

create type public.order_status as enum (
  'new',
  'confirmed',
  'preparing',
  'ready',
  'delivering',
  'completed',
  'cancelled'
);

create type public.fulfillment_type as enum (
  'delivery',
  'pickup'
);

create type public.delivery_time_type as enum (
  'asap',
  'scheduled'
);

create type public.payment_method as enum (
  'cash',
  'card-on-delivery'
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  image_path text not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint categories_name_not_blank check (btrim(name) <> '')
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text not null default '',
  ingredients text[] not null default '{}',
  image_path text not null,
  price integer not null check (price > 0),
  old_price integer check (old_price is null or old_price > price),
  weight integer not null check (weight > 0),
  labels public.product_label[] not null default '{}',
  is_available boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint products_name_not_blank check (btrim(name) <> '')
);

create index products_category_id_idx on public.products(category_id);
create index products_catalog_order_idx
  on public.products(category_id, sort_order, created_at);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  status public.order_status not null default 'new',
  customer_name text not null,
  customer_phone text not null,
  fulfillment_type public.fulfillment_type not null,
  street text,
  house text,
  apartment text,
  entrance text,
  floor text,
  delivery_time_type public.delivery_time_type not null,
  scheduled_for timestamptz,
  payment_method public.payment_method not null,
  comment text,
  total_price integer not null check (total_price > 0),
  total_weight integer not null check (total_weight > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_customer_name_not_blank check (btrim(customer_name) <> ''),
  constraint orders_customer_phone_not_blank check (btrim(customer_phone) <> ''),
  constraint orders_delivery_address_required check (
    fulfillment_type = 'pickup'
    or (
      nullif(btrim(street), '') is not null
      and nullif(btrim(house), '') is not null
    )
  ),
  constraint orders_scheduled_time_required check (
    (delivery_time_type = 'asap' and scheduled_for is null)
    or (delivery_time_type = 'scheduled' and scheduled_for is not null)
  )
);

create index orders_created_at_idx on public.orders(created_at desc);
create index orders_status_created_at_idx
  on public.orders(status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price integer not null check (unit_price > 0),
  unit_weight integer not null check (unit_weight > 0),
  quantity integer not null check (quantity between 1 and 99),
  line_total integer generated always as (unit_price * quantity) stored,
  line_weight integer generated always as (unit_weight * quantity) stored,
  created_at timestamptz not null default now(),
  constraint order_items_product_name_not_blank check (btrim(product_name) <> ''),
  constraint order_items_one_product_per_order unique (order_id, product_id)
);

create index order_items_order_id_idx on public.order_items(order_id);

create sequence public.order_number_seq;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_fulfillment_type public.fulfillment_type,
  p_street text,
  p_house text,
  p_apartment text,
  p_entrance text,
  p_floor text,
  p_delivery_time_type public.delivery_time_type,
  p_scheduled_for timestamptz,
  p_payment_method public.payment_method,
  p_comment text,
  p_items jsonb
)
returns table (
  order_id uuid,
  order_number text,
  created_at timestamptz,
  total_price integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_created_at timestamptz;
  v_total_price integer;
  v_total_weight integer;
  v_requested_count integer;
  v_matched_count integer;
  v_has_invalid_quantity boolean;
begin
  if p_items is null
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) = 0
  then
    raise exception 'Cart is empty' using errcode = '22023';
  end if;

  if nullif(btrim(p_customer_name), '') is null
    or nullif(btrim(p_customer_phone), '') is null
  then
    raise exception 'Customer data is required' using errcode = '22023';
  end if;

  if p_fulfillment_type = 'delivery'
    and (
      nullif(btrim(p_street), '') is null
      or nullif(btrim(p_house), '') is null
    )
  then
    raise exception 'Delivery address is required' using errcode = '22023';
  end if;

  if (p_delivery_time_type = 'scheduled') <> (p_scheduled_for is not null)
  then
    raise exception 'Scheduled delivery time is invalid' using errcode = '22023';
  end if;

  with requested_items as (
    select
      item.product_id,
      sum(item.quantity)::integer as quantity
    from jsonb_to_recordset(p_items)
      as item(product_id uuid, quantity integer)
    group by item.product_id
  )
  select
    count(*)::integer,
    count(product.id)::integer,
    coalesce(sum(product.price * requested.quantity), 0)::integer,
    coalesce(sum(product.weight * requested.quantity), 0)::integer,
    coalesce(bool_or(
      requested.product_id is null
      or requested.quantity not between 1 and 99
    ), false)
  into
    v_requested_count,
    v_matched_count,
    v_total_price,
    v_total_weight,
    v_has_invalid_quantity
  from requested_items as requested
  left join public.products as product
    on product.id = requested.product_id
    and product.is_active
    and product.is_available;

  if v_has_invalid_quantity
    or v_requested_count = 0
    or v_matched_count <> v_requested_count
  then
    raise exception 'Cart contains invalid or unavailable products'
      using errcode = '22023';
  end if;

  v_order_number := format(
    'RL-%s-%s',
    to_char(timezone('Europe/Kyiv', now()), 'YYYYMMDD'),
    lpad(nextval('public.order_number_seq')::text, 6, '0')
  );

  insert into public.orders (
    order_number,
    customer_name,
    customer_phone,
    fulfillment_type,
    street,
    house,
    apartment,
    entrance,
    floor,
    delivery_time_type,
    scheduled_for,
    payment_method,
    comment,
    total_price,
    total_weight
  )
  values (
    v_order_number,
    btrim(p_customer_name),
    btrim(p_customer_phone),
    p_fulfillment_type,
    nullif(btrim(p_street), ''),
    nullif(btrim(p_house), ''),
    nullif(btrim(p_apartment), ''),
    nullif(btrim(p_entrance), ''),
    nullif(btrim(p_floor), ''),
    p_delivery_time_type,
    p_scheduled_for,
    p_payment_method,
    nullif(btrim(p_comment), ''),
    v_total_price,
    v_total_weight
  )
  returning id, public.orders.created_at
  into v_order_id, v_created_at;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    unit_price,
    unit_weight,
    quantity
  )
  select
    v_order_id,
    product.id,
    product.name,
    product.price,
    product.weight,
    requested.quantity
  from (
    select
      item.product_id,
      sum(item.quantity)::integer as quantity
    from jsonb_to_recordset(p_items)
      as item(product_id uuid, quantity integer)
    group by item.product_id
  ) as requested
  join public.products as product
    on product.id = requested.product_id
    and product.is_active
    and product.is_available;

  return query
  select
    v_order_id,
    v_order_number,
    v_created_at,
    v_total_price;
end;
$$;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

revoke all on table public.categories from anon, authenticated;
revoke all on table public.products from anon, authenticated;
revoke all on table public.orders from anon, authenticated;
revoke all on table public.order_items from anon, authenticated;

grant select on table public.categories to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant all on table public.categories to service_role;
grant all on table public.products to service_role;
grant all on table public.orders to service_role;
grant all on table public.order_items to service_role;

create policy "Active categories are publicly readable"
on public.categories
for select
to anon, authenticated
using (is_active);

create policy "Active products are publicly readable"
on public.products
for select
to anon, authenticated
using (
  is_active
  and exists (
    select 1
    from public.categories
    where categories.id = products.category_id
      and categories.is_active
  )
);

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.create_order(
  text,
  text,
  public.fulfillment_type,
  text,
  text,
  text,
  text,
  text,
  public.delivery_time_type,
  timestamptz,
  public.payment_method,
  text,
  jsonb
) from public, anon, authenticated;

grant execute on function public.create_order(
  text,
  text,
  public.fulfillment_type,
  text,
  text,
  text,
  text,
  text,
  public.delivery_time_type,
  timestamptz,
  public.payment_method,
  text,
  jsonb
) to service_role;

commit;
