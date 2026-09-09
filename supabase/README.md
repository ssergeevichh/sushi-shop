# Supabase setup

The database is introduced in two migrations:

1. `migrations/20260908234000_initial_schema.sql` creates the catalog and order schema, RLS policies, and the transactional `create_order` function.
2. `migrations/20260908234500_initial_catalog.sql` adds the categories and products currently used by the production storefront.

`seed.sql` is intentionally reserved for development-only test data and is not needed for the initial production deployment.

The storefront category `all` is computed in the Nuxt application and is not a database record.

## Security model

- The publishable key can only read active categories and products.
- Orders and order items cannot be read or written by browser roles.
- The Nuxt server will create orders through `create_order` using a server-only secret key.
- The function reads current prices and weights from the database, so totals from the browser are never trusted.

Do not commit a Supabase secret key or expose it through Nuxt `runtimeConfig.public`.

## Nuxt environment variables

Copy `.env.example` to a local `.env` and fill it from the project's Connect panel:

```text
NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NUXT_SUPABASE_SECRET_KEY=
```

The URL and publishable key are available to the storefront. The secret key is only available to Nitro server routes.
