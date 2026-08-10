-- LG Nexus V1
-- Phase 5B: make the standard Polizeidienst role usable for the Police core.

insert into public.organization_role_permissions (role_id, permission_key)
select r.id, p.permission_key
from public.organization_roles r
join public.organizations o on o.id = r.organization_id
cross join (values
  ('police.people.search'::text),
  ('police.cases.view'::text),
  ('police.cases.create'::text),
  ('police.cases.edit'::text)
) as p(permission_key)
where o.slug = 'los-santos-police-department'
  and r.name = 'Polizeidienst'
  and r.is_active = true
on conflict (role_id, permission_key) do nothing;
