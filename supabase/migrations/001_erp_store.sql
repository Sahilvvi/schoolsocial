create table if not exists public.erp_store (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.erp_store disable row level security;

grant select, insert, update, delete on public.erp_store to anon;
grant select, insert, update, delete on public.erp_store to authenticated;
grant select, insert, update, delete on public.erp_store to service_role;
