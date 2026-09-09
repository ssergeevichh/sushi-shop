-- "Усі" is a virtual storefront category and is intentionally not stored.
insert into public.categories (
  id,
  slug,
  name,
  description,
  image_path,
  sort_order
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'sets',
    'Сети',
    'Великі добірки ролів для компанії або особливого вечора.',
    '/images/categories/sets.webp',
    10
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'philadelphia',
    'Філадельфія',
    'Ніжні роли з лососем, вершковим сиром та свіжими овочами.',
    '/images/categories/philadelphia.webp',
    20
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'california',
    'Каліфорнія',
    'Класичні роли з яскравою ікрою та збалансованими начинками.',
    '/images/categories/california.webp',
    30
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'baked',
    'Запечені',
    'Теплі роли під запеченою сирною шапкою.',
    '/images/categories/baked.webp',
    40
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'tempura',
    'Темпура',
    'Хрусткі гарячі роли в легкій темпурі.',
    '/images/categories/tempura.webp',
    50
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    'maki',
    'Макі',
    'Лаконічні класичні роли з улюбленими начинками.',
    '/images/categories/maki.webp',
    60
  ),
  (
    '10000000-0000-4000-8000-000000000007',
    'vegetarian',
    'Веган',
    'Рослинні роли зі свіжими овочами та яскравими смаками.',
    '/images/categories/vegetarian.webp',
    70
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_path = excluded.image_path,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.products (
  id,
  category_id,
  slug,
  name,
  description,
  ingredients,
  image_path,
  price,
  old_price,
  weight,
  labels,
  is_available,
  sort_order
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    'philadelphia-classic',
    'Філадельфія Класик',
    'Класичний рол із ніжним лососем та вершковим сиром.',
    array['Лосось', 'вершковий сир', 'огірок', 'авокадо', 'рис', 'норі'],
    '/images/categories/philadelphia.webp',
    325,
    null,
    320,
    array['bestseller']::public.product_label[],
    true,
    10
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000003',
    'california-salmon',
    'Каліфорнія з лососем',
    'Легкий рол із лососем, авокадо та ікрою тобіко.',
    array['Лосось', 'авокадо', 'огірок', 'ікра тобіко', 'рис', 'норі'],
    '/images/categories/california.webp',
    295,
    null,
    290,
    array['bestseller']::public.product_label[],
    true,
    20
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000005',
    'tempura-shrimp',
    'Темпура з креветкою',
    'Хрусткий гарячий рол із тигровою креветкою.',
    array['Креветка', 'вершковий сир', 'авокадо', 'темпура', 'рис', 'норі'],
    '/images/categories/tempura.webp',
    310,
    null,
    300,
    array['bestseller']::public.product_label[],
    true,
    30
  )
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  ingredients = excluded.ingredients,
  image_path = excluded.image_path,
  price = excluded.price,
  old_price = excluded.old_price,
  weight = excluded.weight,
  labels = excluded.labels,
  is_available = excluded.is_available,
  is_active = true,
  sort_order = excluded.sort_order;
