begin;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Users allowed to access the private restaurant administration API.';

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from public, anon, authenticated;
grant all on table public.admin_users to service_role;

commit;
