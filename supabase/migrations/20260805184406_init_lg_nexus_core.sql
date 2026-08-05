create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  organization_type text not null default 'business' check (organization_type in ('business','government','justice','other')),
  description text not null default '',
  phone text,
  location_label text,
  logo_url text,
  banner_url text,
  status text not null default 'closed' check (status in ('open','limited','closed')),
  status_message text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_title text not null default 'Mitarbeiter',
  is_manager boolean not null default false,
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.organization_status_history (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  status text not null check (status in ('open','limited','closed')),
  status_message text,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create or replace function public.is_org_manager(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org
      and om.user_id = (select auth.uid())
      and om.is_manager = true
      and om.is_active = true
  );
$$;

grant execute on function public.is_org_manager(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_status_history enable row level security;

create policy "profiles_authenticated_read"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "public_can_read_public_organizations"
on public.organizations for select
to anon, authenticated
using (is_public = true);

create policy "managers_can_update_organization"
on public.organizations for update
to authenticated
using ((select public.is_org_manager(id)))
with check ((select public.is_org_manager(id)));

create policy "members_can_read_own_membership"
on public.organization_members for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select public.is_org_manager(organization_id))
);

create policy "managers_can_add_members"
on public.organization_members for insert
to authenticated
with check ((select public.is_org_manager(organization_id)));

create policy "managers_can_update_members"
on public.organization_members for update
to authenticated
using ((select public.is_org_manager(organization_id)))
with check ((select public.is_org_manager(organization_id)));

create policy "managers_can_remove_members"
on public.organization_members for delete
to authenticated
using ((select public.is_org_manager(organization_id)));

create policy "public_can_read_status_history"
on public.organization_status_history for select
to anon, authenticated
using (
  exists (
    select 1 from public.organizations o
    where o.id = organization_id and o.is_public = true
  )
);

create policy "managers_can_add_status_history"
on public.organization_status_history for insert
to authenticated
with check (
  (select public.is_org_manager(organization_id))
  and changed_by = (select auth.uid())
);

alter publication supabase_realtime add table public.organizations;
