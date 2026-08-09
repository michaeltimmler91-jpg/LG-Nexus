-- LG Nexus V1 – Phase 2 organization/RBAC foundation
-- Prepared from docs/schema-phase2-organizations-v1.md.
-- IMPORTANT: committed as migration source, but not applied to Supabase by this planning step.
-- The legacy is_manager/role_title path remains temporarily for compatibility.

create schema if not exists private;

-- -----------------------------------------------------------------------------
-- Organization core additions
-- -----------------------------------------------------------------------------

alter table public.organizations
  add column if not exists short_name text,
  add column if not exists public_email text,
  add column if not exists is_archived boolean not null default false,
  add column if not exists archived_at timestamptz,
  add column if not exists row_version bigint not null default 1;

-- row_version helper is introduced by Phase 1.
drop trigger if exists organizations_increment_row_version on public.organizations;
create trigger organizations_increment_row_version
before update on public.organizations
for each row execute function private.increment_row_version();

-- -----------------------------------------------------------------------------
-- Locations
-- -----------------------------------------------------------------------------

create table if not exists public.organization_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  location_type text not null default 'other',
  address_label text,
  map_x numeric,
  map_y numeric,
  map_z numeric,
  opening_hours_text text,
  status text check (status is null or status in ('open', 'limited', 'closed')),
  is_main boolean not null default false,
  is_active boolean not null default true,
  public_marker_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create unique index if not exists organization_locations_one_main_uidx
  on public.organization_locations (organization_id)
  where is_main = true and is_active = true;

create index if not exists organization_locations_org_idx
  on public.organization_locations (organization_id, is_active);

create trigger organization_locations_set_updated_at
before update on public.organization_locations
for each row execute function public.set_updated_at();

create trigger organization_locations_increment_row_version
before update on public.organization_locations
for each row execute function private.increment_row_version();

alter table public.organization_locations enable row level security;

-- -----------------------------------------------------------------------------
-- Global permission catalogue
-- -----------------------------------------------------------------------------

create table if not exists public.permissions (
  key text primary key,
  module text not null,
  name text not null,
  description text not null default '',
  is_sensitive boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.permissions (key, module, name, description, is_sensitive)
values
  ('org.profile.manage', 'organization', 'Organisationsprofil verwalten', 'Öffentliches Organisationsprofil bearbeiten.', false),
  ('org.status.manage', 'organization', 'Organisationsstatus verwalten', 'Öffnungsstatus und Statusmeldung verwalten.', false),
  ('org.locations.manage', 'organization', 'Standorte verwalten', 'Organisationsstandorte anlegen und bearbeiten.', false),
  ('org.members.view', 'organization', 'Mitglieder ansehen', 'Interne Mitgliederübersicht ansehen.', false),
  ('org.members.manage', 'organization', 'Mitglieder verwalten', 'Mitglieder aufnehmen und zulässige Mitgliedsaktionen ausführen.', true),
  ('org.members.remove', 'organization', 'Mitglieder entfernen', 'Normale Mitglieder entfernen; fachliche Owner-Regeln bleiben maßgeblich.', true),
  ('org.roles.assign', 'organization', 'Rollen zuweisen', 'Zulässige Rollenwechsel unter Beachtung der Hierarchie.', true),
  ('org.tasks.manage', 'tasks', 'Aufgaben verwalten', 'Interne Aufgaben verwalten.', false),
  ('org.tasks.templates.manage', 'tasks', 'Aufgabenvorlagen verwalten', 'Aufgabenvorlagen verwalten.', false),
  ('org.mail.read', 'mail', 'Organisations-Mail lesen', 'Rollenbezogene Organisationspostfächer lesen.', false),
  ('org.mail.assign', 'mail', 'Organisations-Mail zuweisen', 'Mailvorgänge Mitarbeitern zuweisen.', false),
  ('org.documents.create', 'documents', 'Dokumente erstellen', 'Interne Dokumente erstellen.', false),
  ('org.documents.manage', 'documents', 'Dokumente verwalten', 'Ordner und interne Dokumente verwalten.', false),
  ('org.events.manage', 'events', 'Events verwalten', 'Organisationsevents verwalten.', false),
  ('org.offers.manage', 'business', 'Angebote verwalten', 'Produkte und Dienstleistungen verwalten.', false),
  ('org.gallery.manage', 'business', 'Galerie verwalten', 'Öffentliche Organisationsgalerie verwalten.', false),
  ('org.faq.manage', 'business', 'FAQ verwalten', 'Öffentliche Organisations-FAQ verwalten.', false),
  ('org.jobs.manage', 'jobs', 'Stellenangebote verwalten', 'Stellenangebote verwalten.', false),
  ('org.applications.view', 'jobs', 'Bewerbungen ansehen', 'Bewerbungen lesen.', true),
  ('org.applications.manage', 'jobs', 'Bewerbungen bearbeiten', 'Bewerbungen bearbeiten und Status ändern.', true),
  ('org.calendar.manage', 'calendar', 'Kalender verwalten', 'Internen Organisationskalender verwalten.', false),
  ('org.internal_map.manage', 'map', 'Interne Karte verwalten', 'Interne Organisationskartenebenen verwalten.', false)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

alter table public.permissions enable row level security;

-- -----------------------------------------------------------------------------
-- Roles
-- -----------------------------------------------------------------------------

create table if not exists public.organization_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text not null default '',
  color_key text,
  icon_key text,
  hierarchy_rank integer not null,
  is_owner boolean not null default false,
  is_standard boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create unique index if not exists organization_roles_name_uidx
  on public.organization_roles (organization_id, lower(name));

create unique index if not exists organization_roles_owner_uidx
  on public.organization_roles (organization_id)
  where is_owner = true;

create unique index if not exists organization_roles_standard_uidx
  on public.organization_roles (organization_id)
  where is_standard = true and is_active = true;

create index if not exists organization_roles_hierarchy_idx
  on public.organization_roles (organization_id, hierarchy_rank, is_active);

create trigger organization_roles_set_updated_at
before update on public.organization_roles
for each row execute function public.set_updated_at();

create trigger organization_roles_increment_row_version
before update on public.organization_roles
for each row execute function private.increment_row_version();

alter table public.organization_roles enable row level security;

-- One protected Owner role and one normal default role per existing organization.
insert into public.organization_roles (
  organization_id, name, description, hierarchy_rank, is_owner, is_standard, is_active
)
select
  o.id, 'Owner', 'Systemgeschützte Owner-Rolle', 0, true, false, true
from public.organizations o
where not exists (
  select 1 from public.organization_roles r
  where r.organization_id = o.id and r.is_owner = true
);

insert into public.organization_roles (
  organization_id, name, description, hierarchy_rank, is_owner, is_standard, is_active
)
select
  o.id, 'Mitarbeiter', 'Normale Standardrolle', 1000, false, true, true
from public.organizations o
where not exists (
  select 1 from public.organization_roles r
  where r.organization_id = o.id and r.is_standard = true and r.is_active = true
);

-- -----------------------------------------------------------------------------
-- Role permissions
-- -----------------------------------------------------------------------------

create table if not exists public.organization_role_permissions (
  role_id uuid not null references public.organization_roles(id) on delete cascade,
  permission_key text not null references public.permissions(key) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles(id) on delete set null,
  primary key (role_id, permission_key)
);

create index if not exists organization_role_permissions_permission_idx
  on public.organization_role_permissions (permission_key, role_id);

alter table public.organization_role_permissions enable row level security;

-- -----------------------------------------------------------------------------
-- Membership transition
-- -----------------------------------------------------------------------------

alter table public.organization_members
  add column if not exists role_id uuid references public.organization_roles(id) on delete restrict,
  add column if not exists inactive_reason text,
  add column if not exists inactive_at timestamptz,
  add column if not exists inactive_by uuid references public.profiles(id) on delete set null,
  add column if not exists left_at timestamptz,
  add column if not exists leave_reason text,
  add column if not exists removed_by uuid references public.profiles(id) on delete set null,
  add column if not exists removal_reason text,
  add column if not exists row_version bigint not null default 1;

-- Do NOT convert legacy is_manager=true users to Owner automatically.
-- Every current member receives the ordinary standard role first.
update public.organization_members om
set role_id = r.id
from public.organization_roles r
where om.role_id is null
  and r.organization_id = om.organization_id
  and r.is_standard = true
  and r.is_active = true;

create index if not exists organization_members_role_idx
  on public.organization_members (organization_id, role_id, is_active);

drop trigger if exists organization_members_increment_row_version on public.organization_members;
create trigger organization_members_increment_row_version
before update on public.organization_members
for each row execute function private.increment_row_version();

-- Prevent a role from another organization being assigned by mistake.
create or replace function private.guard_membership_role_org()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role_id is not null and not exists (
    select 1
    from public.organization_roles r
    where r.id = new.role_id
      and r.organization_id = new.organization_id
      and r.is_active = true
  ) then
    raise exception 'membership role must belong to the same organization and be active';
  end if;
  return new;
end;
$$;

revoke all on function private.guard_membership_role_org() from public, anon, authenticated;

drop trigger if exists organization_members_guard_role_org on public.organization_members;
create trigger organization_members_guard_role_org
before insert or update of organization_id, role_id on public.organization_members
for each row execute function private.guard_membership_role_org();

-- -----------------------------------------------------------------------------
-- Membership history / notes / audit
-- -----------------------------------------------------------------------------

create table if not exists public.organization_membership_history (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  event_type text not null,
  old_role_id uuid references public.organization_roles(id) on delete set null,
  new_role_id uuid references public.organization_roles(id) on delete set null,
  reason text,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organization_membership_history_org_profile_idx
  on public.organization_membership_history (organization_id, profile_id, created_at desc);

create table if not exists public.organization_member_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  member_profile_id uuid not null references public.profiles(id) on delete cascade,
  author_profile_id uuid not null references public.profiles(id) on delete restrict,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create index if not exists organization_member_notes_member_idx
  on public.organization_member_notes (organization_id, member_profile_id, created_at desc);

create trigger organization_member_notes_set_updated_at
before update on public.organization_member_notes
for each row execute function public.set_updated_at();

create trigger organization_member_notes_increment_row_version
before update on public.organization_member_notes
for each row execute function private.increment_row_version();

create table if not exists public.organization_audit_log (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action_key text not null,
  target_type text,
  target_id text,
  old_data jsonb,
  new_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_audit_log_org_created_idx
  on public.organization_audit_log (organization_id, created_at desc);

alter table public.organization_membership_history enable row level security;
alter table public.organization_member_notes enable row level security;
alter table public.organization_audit_log enable row level security;

-- -----------------------------------------------------------------------------
-- New RBAC helpers
-- -----------------------------------------------------------------------------

create or replace function private.is_active_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    join public.organizations o on o.id = om.organization_id
    join public.profiles p on p.id = om.user_id
    where om.organization_id = target_org
      and om.user_id = auth.uid()
      and om.is_active = true
      and om.left_at is null
      and o.is_archived = false
      and p.account_status = 'active'
  );
$$;

create or replace function private.is_org_owner(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    join public.organization_roles r on r.id = om.role_id
    join public.organizations o on o.id = om.organization_id
    join public.profiles p on p.id = om.user_id
    where om.organization_id = target_org
      and om.user_id = auth.uid()
      and om.is_active = true
      and om.left_at is null
      and r.organization_id = target_org
      and r.is_owner = true
      and r.is_active = true
      and o.is_archived = false
      and p.account_status = 'active'
  );
$$;

create or replace function private.has_org_permission(target_org uuid, requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    join public.organization_roles r on r.id = om.role_id
    join public.organizations o on o.id = om.organization_id
    join public.profiles p on p.id = om.user_id
    where om.organization_id = target_org
      and om.user_id = auth.uid()
      and om.is_active = true
      and om.left_at is null
      and r.organization_id = target_org
      and r.is_active = true
      and o.is_archived = false
      and p.account_status = 'active'
      and (
        r.is_owner = true
        or exists (
          select 1
          from public.organization_role_permissions rp
          join public.permissions perm on perm.key = rp.permission_key
          where rp.role_id = r.id
            and rp.permission_key = requested_permission
            and perm.is_active = true
        )
      )
  );
$$;

revoke all on function private.is_active_org_member(uuid) from public, anon;
revoke all on function private.is_org_owner(uuid) from public, anon;
revoke all on function private.has_org_permission(uuid, text) from public, anon;

grant execute on function private.is_active_org_member(uuid) to authenticated;
grant execute on function private.is_org_owner(uuid) to authenticated;
grant execute on function private.has_org_permission(uuid, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Deliberate compatibility boundary
-- -----------------------------------------------------------------------------

-- We intentionally DO NOT alter the existing RLS policies that currently call
-- private.is_org_manager() in this migration. Doing so before Owner assignments,
-- RPCs and frontend migration are complete could lock users out.
--
-- Next implementation migration must:
--   1. explicitly assign real Owner memberships,
--   2. build role-management RPCs with hierarchy checks,
--   3. switch policies from private.is_org_manager() to the new RBAC helpers,
--   4. verify access tests,
--   5. only then retire is_manager/role_title as authorization sources.
