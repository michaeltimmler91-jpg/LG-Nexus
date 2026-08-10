-- LG Nexus V1
-- Phase 3C: module-scoped navigation permissions

alter table public.organizations
  add column if not exists service_module text;

alter table public.organizations
  drop constraint if exists organizations_service_module_check;

alter table public.organizations
  add constraint organizations_service_module_check
  check (service_module is null or service_module in ('city', 'medical', 'police', 'fire', 'justice'));

-- Existing Justice organizations are unambiguously part of the Justice module.
update public.organizations
set service_module = 'justice'
where organization_type = 'justice'
  and service_module is null;

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('city.access', 'city', 'Stadtverwaltung öffnen', 'Erlaubt den Zugriff auf den internen Bereich der Stadtverwaltung.', false, true),
  ('medical.access', 'medical', 'Medical öffnen', 'Erlaubt den Zugriff auf den internen Medical-Bereich.', true, true),
  ('police.access', 'police', 'Police öffnen', 'Erlaubt den Zugriff auf den internen Police-Bereich.', true, true),
  ('fire.access', 'fire', 'Fire & Rescue öffnen', 'Erlaubt den Zugriff auf den internen Fire-&-Rescue-Bereich.', true, true),
  ('justice.access', 'justice', 'Justice öffnen', 'Erlaubt den Zugriff auf den internen Justice-Bereich.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

-- Owners receive every normal organization permission, but module-specific
-- permissions only for the service module of their own organization.
create or replace function public.get_my_organization_context()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'organization_id', o.id,
        'organization_name', o.name,
        'organization_short_name', o.short_name,
        'organization_type', o.organization_type,
        'service_module', o.service_module,
        'role_id', r.id,
        'role_name', r.name,
        'hierarchy_rank', r.hierarchy_rank,
        'is_owner', r.is_owner,
        'permissions',
          case
            when r.is_owner then (
              select coalesce(jsonb_agg(p2.key order by p2.key), '[]'::jsonb)
              from public.permissions p2
              where p2.is_active = true
                and (
                  p2.key like 'org.%'
                  or (o.service_module is not null and p2.module = o.service_module)
                )
            )
            else (
              select coalesce(jsonb_agg(rp.permission_key order by rp.permission_key), '[]'::jsonb)
              from public.organization_role_permissions rp
              join public.permissions p2
                on p2.key = rp.permission_key
               and p2.is_active = true
              where rp.role_id = r.id
            )
          end
      ) order by o.name
    ),
    '[]'::jsonb
  )
  from public.organization_members om
  join public.organizations o on o.id = om.organization_id
  join public.organization_roles r on r.id = om.role_id and r.organization_id = om.organization_id
  join public.profiles pr on pr.id = om.user_id
  where om.user_id = auth.uid()
    and om.is_active = true
    and om.left_at is null
    and o.is_archived = false
    and r.is_active = true
    and pr.account_status = 'active';
$$;

revoke all on function public.get_my_organization_context() from public;
grant execute on function public.get_my_organization_context() to authenticated;

-- Prevent a role in an unrelated organization from ever being assigned a
-- sensitive module permission just because the key exists globally.
create or replace function private.validate_role_permission_scope()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  role_org uuid;
  org_module text;
  permission_module text;
begin
  select r.organization_id
    into role_org
  from public.organization_roles r
  where r.id = new.role_id;

  if role_org is null then
    raise exception 'Unknown organization role';
  end if;

  select o.service_module
    into org_module
  from public.organizations o
  where o.id = role_org;

  select p.module
    into permission_module
  from public.permissions p
  where p.key = new.permission_key
    and p.is_active = true;

  if permission_module is null then
    raise exception 'Unknown or inactive permission';
  end if;

  if new.permission_key like 'org.%' then
    return new;
  end if;

  if org_module is null or permission_module <> org_module then
    raise exception 'Permission is outside the organization module';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_role_permission_scope on public.organization_role_permissions;
create trigger validate_role_permission_scope
before insert or update of role_id, permission_key
on public.organization_role_permissions
for each row
execute function private.validate_role_permission_scope();
