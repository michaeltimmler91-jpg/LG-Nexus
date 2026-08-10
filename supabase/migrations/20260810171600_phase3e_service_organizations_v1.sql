-- LG Nexus V1
-- Phase 3E: create real service organizations and conservative foundation roles.
-- Detailed specialist permissions are added later; this migration only establishes
-- stable organizations, base roles and module-entry permissions.

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
values
  (
    'los-santos-medical-center',
    'Los Santos Medical Center',
    'LSMC',
    'government',
    'medical',
    'Medizinische Versorgung, Rettungsdienst und Notfallbehandlung für Los Santos.',
    '911',
    'Pillbox Hill',
    'open',
    'Regelbetrieb',
    true,
    false
  ),
  (
    'los-santos-police-department',
    'Los Santos Police Department',
    'LSPD',
    'government',
    'police',
    'Polizeiliche Anlaufstelle, öffentliche Sicherheit und Ermittlungsarbeit.',
    '911',
    'Mission Row',
    'open',
    'Wache besetzt',
    true,
    false
  ),
  (
    'los-santos-fire-rescue',
    'Los Santos Fire & Rescue',
    'LSFR',
    'government',
    'fire',
    'Feuerwehr, technische Hilfeleistung und Rettungseinsätze für Los Santos.',
    '911',
    'Los Santos',
    'open',
    'Einsatzbereit',
    true,
    false
  ),
  (
    'justice-los-santos',
    'Justiz Los Santos',
    'Justice',
    'justice',
    'justice',
    'Gerichte, Verfahren und justizielle Verwaltung der Stadt Los Santos.',
    null,
    'Los Santos',
    'open',
    'Dienstbetrieb',
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

-- One protected owner role per service organization.
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
  'Geschützte Leitungsrolle der Organisation.',
  1000,
  true,
  false,
  true
from public.organizations o
where o.service_module in ('medical', 'police', 'fire', 'justice')
  and not exists (
    select 1
    from public.organization_roles r
    where r.organization_id = o.id
      and r.is_owner = true
  );

-- Conservative module-specific standard roles. They only open the matching
-- module. Fine-grained record permissions are intentionally not invented here.
with role_seed(service_module, role_name, role_description) as (
  values
    ('medical'::text, 'Medizinischer Dienst'::text, 'Standardrolle für den medizinischen Dienst.'::text),
    ('police'::text, 'Polizeidienst'::text, 'Standardrolle für den Polizeidienst.'::text),
    ('fire'::text, 'Einsatzdienst'::text, 'Standardrolle für Fire & Rescue.'::text),
    ('justice'::text, 'Justizdienst'::text, 'Standardrolle für den Justizdienst.'::text)
)
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
  s.role_name,
  s.role_description,
  100,
  false,
  true,
  true
from public.organizations o
join role_seed s on s.service_module = o.service_module
where o.slug in (
  'los-santos-medical-center',
  'los-santos-police-department',
  'los-santos-fire-rescue',
  'justice-los-santos'
)
  and not exists (
    select 1
    from public.organization_roles r
    where r.organization_id = o.id
      and r.is_standard = true
      and r.is_active = true
  );

-- Standard service roles receive only their own module entry permission.
insert into public.organization_role_permissions (role_id, permission_key)
select
  r.id,
  o.service_module || '.access'
from public.organization_roles r
join public.organizations o on o.id = r.organization_id
join public.permissions p on p.key = o.service_module || '.access' and p.is_active = true
where o.slug in (
  'los-santos-medical-center',
  'los-santos-police-department',
  'los-santos-fire-rescue',
  'justice-los-santos'
)
  and r.is_standard = true
  and r.is_active = true
on conflict do nothing;

insert into public.system_audit_log (
  actor_profile_id,
  action_key,
  target_type,
  target_id,
  metadata
)
select
  null,
  'bootstrap.service_organization.established',
  'organization',
  o.id::text,
  jsonb_build_object('service_module', o.service_module)
from public.organizations o
where o.slug in (
  'los-santos-medical-center',
  'los-santos-police-department',
  'los-santos-fire-rescue',
  'justice-los-santos'
);
