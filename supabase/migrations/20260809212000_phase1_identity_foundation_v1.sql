-- LG Nexus V1 – Phase 1 identity/system foundation
-- Prepared from docs/schema-phase1-accounts-v1.md.
-- IMPORTANT: committed as migration source, but not applied to Supabase by this planning step.

create schema if not exists private;

-- -----------------------------------------------------------------------------
-- Profiles: privacy + optimistic concurrency
-- -----------------------------------------------------------------------------

alter table public.profiles
  add column if not exists avatar_visibility text not null default 'nobody',
  add column if not exists date_of_birth_visibility text not null default 'nobody',
  add column if not exists birthday_day_month_visible boolean not null default false,
  add column if not exists allow_new_direct_contacts boolean not null default true,
  add column if not exists row_version bigint not null default 1;

alter table public.profiles
  drop constraint if exists profiles_avatar_visibility_check;
alter table public.profiles
  add constraint profiles_avatar_visibility_check
  check (avatar_visibility in (
    'nobody', 'citizens', 'authorities', 'citizens_and_authorities',
    'own_organization', 'everyone'
  ));

alter table public.profiles
  drop constraint if exists profiles_date_of_birth_visibility_check;
alter table public.profiles
  add constraint profiles_date_of_birth_visibility_check
  check (date_of_birth_visibility in (
    'nobody', 'citizens', 'authorities', 'citizens_and_authorities',
    'own_organization', 'everyone'
  ));

-- Self-editable profile/privacy columns. Protected account fields remain guarded by
-- private.guard_self_profile_update().
grant update (
  avatar_url,
  phone,
  phone_visibility,
  nexus_email_visibility,
  avatar_visibility,
  date_of_birth_visibility,
  birthday_day_month_visible,
  allow_new_direct_contacts
) on public.profiles to authenticated;

-- -----------------------------------------------------------------------------
-- Generic row version helper
-- -----------------------------------------------------------------------------

create or replace function private.increment_row_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.row_version := old.row_version + 1;
  return new;
end;
$$;

revoke all on function private.increment_row_version() from public, anon, authenticated;

drop trigger if exists profiles_increment_row_version on public.profiles;
create trigger profiles_increment_row_version
before update on public.profiles
for each row execute function private.increment_row_version();

-- -----------------------------------------------------------------------------
-- User preferences
-- -----------------------------------------------------------------------------

create table if not exists public.profile_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  theme text not null default 'dark' check (theme in ('dark', 'light')),
  accent_key text,
  high_contrast boolean not null default false,
  font_scale numeric(4,2) not null default 1.00 check (font_scale between 0.75 and 1.50),
  density text not null default 'comfortable' check (density in ('comfortable', 'compact')),
  notification_sound_enabled boolean not null default true,
  notification_volume smallint not null default 100 check (notification_volume between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

insert into public.profile_preferences (profile_id)
select p.id
from public.profiles p
where not exists (
  select 1 from public.profile_preferences pref where pref.profile_id = p.id
);

alter table public.profile_preferences enable row level security;

drop policy if exists "profile_preferences_read_own" on public.profile_preferences;
create policy "profile_preferences_read_own"
on public.profile_preferences for select
to authenticated
using (profile_id = (select auth.uid()));

drop policy if exists "profile_preferences_insert_own" on public.profile_preferences;
create policy "profile_preferences_insert_own"
on public.profile_preferences for insert
to authenticated
with check (profile_id = (select auth.uid()));

drop policy if exists "profile_preferences_update_own" on public.profile_preferences;
create policy "profile_preferences_update_own"
on public.profile_preferences for update
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

grant select, insert, update on public.profile_preferences to authenticated;

create trigger profile_preferences_set_updated_at
before update on public.profile_preferences
for each row execute function public.set_updated_at();

create trigger profile_preferences_increment_row_version
before update on public.profile_preferences
for each row execute function private.increment_row_version();

-- -----------------------------------------------------------------------------
-- Identity change requests + permanent name history
-- -----------------------------------------------------------------------------

create table if not exists public.profile_identity_change_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  request_type text not null check (request_type in ('name_change', 'birthdate_correction')),
  requested_first_name text,
  requested_last_name text,
  requested_date_of_birth date,
  reason text not null,
  status text not null default 'new'
    check (status in ('new', 'in_review', 'approved', 'rejected', 'withdrawn')),
  decision_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles(id) on delete set null,
  row_version bigint not null default 1
);

create table if not exists public.profile_name_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  old_first_name text not null,
  old_last_name text not null,
  new_first_name text not null,
  new_last_name text not null,
  change_request_id uuid references public.profile_identity_change_requests(id) on delete set null,
  reason text,
  changed_by uuid references public.profiles(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index if not exists profile_name_history_profile_idx
  on public.profile_name_history (profile_id, changed_at desc);

alter table public.profile_identity_change_requests enable row level security;
alter table public.profile_name_history enable row level security;

-- No broad direct write policies yet. These records are intended to be handled
-- by dedicated city-administration RPCs in a later implementation migration.
revoke insert, update, delete on public.profile_identity_change_requests from anon, authenticated;
revoke insert, update, delete on public.profile_name_history from anon, authenticated;

create trigger profile_identity_change_requests_set_updated_at
before update on public.profile_identity_change_requests
for each row execute function public.set_updated_at();

create trigger profile_identity_change_requests_increment_row_version
before update on public.profile_identity_change_requests
for each row execute function private.increment_row_version();

-- -----------------------------------------------------------------------------
-- Permanent account status history
-- -----------------------------------------------------------------------------

create table if not exists public.account_status_history (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  old_status text,
  new_status text not null,
  reason text,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists account_status_history_profile_idx
  on public.account_status_history (profile_id, created_at desc);

insert into public.account_status_history (
  profile_id, old_status, new_status, reason, changed_by, created_at
)
select
  p.id,
  null,
  p.account_status,
  'phase1_baseline',
  p.approved_by,
  coalesce(p.approved_at, p.created_at)
from public.profiles p
where not exists (
  select 1 from public.account_status_history h where h.profile_id = p.id
);

create or replace function private.log_account_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.account_status is distinct from old.account_status then
    insert into public.account_status_history (
      profile_id, old_status, new_status, changed_by
    ) values (
      new.id, old.account_status, new.account_status, auth.uid()
    );
  end if;
  return new;
end;
$$;

revoke all on function private.log_account_status_change() from public, anon, authenticated;

drop trigger if exists profiles_log_account_status_change on public.profiles;
create trigger profiles_log_account_status_change
after update of account_status on public.profiles
for each row execute function private.log_account_status_change();

alter table public.account_status_history enable row level security;
revoke insert, update, delete on public.account_status_history from anon, authenticated;

-- -----------------------------------------------------------------------------
-- User blocking
-- -----------------------------------------------------------------------------

create table if not exists public.profile_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint profile_blocks_no_self check (blocker_id <> blocked_id)
);

alter table public.profile_blocks enable row level security;

drop policy if exists "profile_blocks_read_own" on public.profile_blocks;
create policy "profile_blocks_read_own"
on public.profile_blocks for select
to authenticated
using (blocker_id = (select auth.uid()));

drop policy if exists "profile_blocks_insert_own" on public.profile_blocks;
create policy "profile_blocks_insert_own"
on public.profile_blocks for insert
to authenticated
with check (blocker_id = (select auth.uid()));

drop policy if exists "profile_blocks_delete_own" on public.profile_blocks;
create policy "profile_blocks_delete_own"
on public.profile_blocks for delete
to authenticated
using (blocker_id = (select auth.uid()));

grant select, insert, delete on public.profile_blocks to authenticated;

-- -----------------------------------------------------------------------------
-- Technical system roles (separate from IC organizations)
-- -----------------------------------------------------------------------------

create table if not exists public.system_roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.system_role_assignments (
  system_role_id uuid not null references public.system_roles(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz not null default now(),
  primary key (system_role_id, profile_id)
);

insert into public.system_roles (key, name, description)
values
  ('system_admin', 'Systemadministration', 'Technische Nexus-Administration ohne automatischen Fachaktenzugriff.'),
  ('security_admin', 'Sicherheitsadministration', 'Technische Sicherheits- und Diagnosefunktionen.'),
  ('backup_operator', 'Backup/Betrieb', 'Backups, Restore-Tests und technische Betriebsaufgaben.'),
  ('moderator', 'Moderation', 'Moderation gemeldeter öffentlicher/kommunikativer Inhalte.')
on conflict (key) do update
set name = excluded.name,
    description = excluded.description;

alter table public.system_roles enable row level security;
alter table public.system_role_assignments enable row level security;

revoke insert, update, delete on public.system_roles from anon, authenticated;
revoke insert, update, delete on public.system_role_assignments from anon, authenticated;

create or replace function private.is_active_account(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = target_profile
      and p.account_status = 'active'
  );
$$;

create or replace function private.has_system_role(role_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.system_role_assignments sra
    join public.system_roles sr on sr.id = sra.system_role_id
    join public.profiles p on p.id = sra.profile_id
    where sra.profile_id = auth.uid()
      and sr.key = role_key
      and sr.is_active = true
      and p.account_status = 'active'
  );
$$;

revoke all on function private.is_active_account(uuid) from public, anon;
revoke all on function private.has_system_role(text) from public, anon;
grant execute on function private.is_active_account(uuid) to authenticated;
grant execute on function private.has_system_role(text) to authenticated;

-- -----------------------------------------------------------------------------
-- Technical audit + security events
-- -----------------------------------------------------------------------------

create table if not exists public.system_audit_log (
  id bigint generated always as identity primary key,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action_key text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  request_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id bigint generated always as identity primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  success boolean not null,
  device_label text,
  ip_address inet,
  approx_region text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists system_audit_log_created_idx
  on public.system_audit_log (created_at desc);
create index if not exists security_events_profile_created_idx
  on public.security_events (profile_id, created_at desc);

alter table public.system_audit_log enable row level security;
alter table public.security_events enable row level security;

revoke insert, update, delete on public.system_audit_log from anon, authenticated;
revoke insert, update, delete on public.security_events from anon, authenticated;

-- Explicitly do not add a policy granting system admins access to Medical/PD/
-- Justice tables. Those permissions are independent by design.
