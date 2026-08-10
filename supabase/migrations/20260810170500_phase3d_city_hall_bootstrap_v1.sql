-- LG Nexus V1
-- Phase 3D: establish the real City Hall organization and move bootstrap access
-- from the temporary technical system role into the city organization model.

insert into public.organizations (
  slug,
  name,
  short_name,
  organization_type,
  service_module,
  description,
  phone,
  location_label,
  status,
  status_message,
  is_public,
  members_public
)
values (
  'stadtverwaltung-los-santos',
  'Stadtverwaltung Los Santos',
  'Stadthalle',
  'government',
  'city',
  'Bürgerservice, Register und offizielle Verwaltungsangelegenheiten der Stadt Los Santos.',
  '555-0100',
  'City Hall',
  'open',
  'Bürgerservice geöffnet',
  true,
  false
)
on conflict (slug) do update
set name = excluded.name,
    short_name = excluded.short_name,
    organization_type = excluded.organization_type,
    service_module = excluded.service_module,
    description = excluded.description,
    phone = excluded.phone,
    location_label = excluded.location_label,
    is_public = excluded.is_public,
    members_public = excluded.members_public,
    updated_at = now();

insert into public.organization_roles (
  organization_id,
  name,
  description,
  hierarchy_rank,
  is_owner,
  is_standard,
  is_active
)
select
  o.id,
  'Leitung',
  'Geschützte Leitungsrolle der Stadtverwaltung.',
  1000,
  true,
  false,
  true
from public.organizations o
where o.slug = 'stadtverwaltung-los-santos'
  and not exists (
    select 1
    from public.organization_roles r
    where r.organization_id = o.id
      and r.is_owner = true
  );

insert into public.organization_roles (
  organization_id,
  name,
  description,
  hierarchy_rank,
  is_owner,
  is_standard,
  is_active
)
select
  o.id,
  'Mitarbeiter',
  'Standardrolle für neue Mitarbeiter der Stadtverwaltung. Zusätzliche Rechte werden gezielt vergeben.',
  100,
  false,
  true,
  true
from public.organizations o
where o.slug = 'stadtverwaltung-los-santos'
  and not exists (
    select 1
    from public.organization_roles r
    where r.organization_id = o.id
      and lower(r.name) = lower('Mitarbeiter')
  );

insert into public.organization_members (
  organization_id,
  user_id,
  role_id,
  role_title,
  is_manager,
  is_active
)
select
  o.id,
  p.id,
  r.id,
  r.name,
  true,
  true
from public.organizations o
join public.organization_roles r
  on r.organization_id = o.id
 and r.is_owner = true
join public.profiles p
  on p.username = 'admin'
where o.slug = 'stadtverwaltung-los-santos'
on conflict (organization_id, user_id) do update
set role_id = excluded.role_id,
    role_title = excluded.role_title,
    is_manager = true,
    is_active = true,
    inactive_reason = null,
    inactive_at = null,
    inactive_by = null,
    left_at = null,
    leave_reason = null,
    removed_by = null,
    removal_reason = null,
    row_version = public.organization_members.row_version + 1;

-- The first development account no longer needs the temporary technical
-- system_admin role once City Hall ownership is established.
delete from public.system_role_assignments a
using public.system_roles sr, public.profiles p
where a.system_role_id = sr.id
  and a.profile_id = p.id
  and sr.key = 'system_admin'
  and p.username = 'admin';

insert into public.system_audit_log (
  actor_profile_id,
  action_key,
  target_type,
  target_id,
  metadata
)
select
  null,
  'bootstrap.city_hall.established',
  'organization',
  o.id::text,
  jsonb_build_object(
    'owner_username', 'admin',
    'temporary_system_admin_removed', true
  )
from public.organizations o
where o.slug = 'stadtverwaltung-los-santos';
