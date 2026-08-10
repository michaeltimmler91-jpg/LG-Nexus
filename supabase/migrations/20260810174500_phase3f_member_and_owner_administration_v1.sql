-- LG Nexus V1
-- Phase 3F: secure organization member administration and City Hall emergency owner assignment.
--
-- Important rules implemented from the organization governance concept:
-- - new members receive the current standard role automatically
-- - normal role assignment respects hierarchy; larger hierarchy_rank = higher normal rank
-- - only owners can remove normal members
-- - owners cannot be changed/removed through the normal member RPCs
-- - City Hall may assign an emergency owner only when an organization currently has no owner
-- - technical/system roles do not grant these organization capabilities

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values (
  'city.organizations.owner_emergency',
  'city',
  'Notfall-Owner einsetzen',
  'Erlaubt der Stadtverwaltung, bei einer Organisation ohne vorhandenen Owner einen neuen Owner einzusetzen.',
  true,
  true
)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

create or replace function public.get_my_member_admin_context()
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
        'service_module', o.service_module,
        'role_id', r.id,
        'role_name', r.name,
        'hierarchy_rank', r.hierarchy_rank,
        'is_owner', r.is_owner,
        'can_view', (
          r.is_owner
          or private.has_org_permission(o.id, 'org.members.view')
          or private.has_org_permission(o.id, 'org.members.manage')
          or private.has_org_permission(o.id, 'org.roles.assign')
        ),
        'can_add', (r.is_owner or private.has_org_permission(o.id, 'org.members.manage')),
        'can_assign', (r.is_owner or private.has_org_permission(o.id, 'org.roles.assign')),
        'can_remove', r.is_owner
      )
      order by o.name
    ),
    '[]'::jsonb
  )
  from public.organization_members om
  join public.organizations o on o.id = om.organization_id
  join public.organization_roles r on r.id = om.role_id and r.organization_id = om.organization_id
  join public.profiles p on p.id = om.user_id
  where om.user_id = auth.uid()
    and om.is_active = true
    and om.left_at is null
    and o.is_archived = false
    and r.is_active = true
    and p.account_status = 'active'
    and (
      r.is_owner
      or private.has_org_permission(o.id, 'org.members.view')
      or private.has_org_permission(o.id, 'org.members.manage')
      or private.has_org_permission(o.id, 'org.roles.assign')
    );
$$;

revoke all on function public.get_my_member_admin_context() from public;
grant execute on function public.get_my_member_admin_context() to authenticated;

create or replace function public.list_organization_members_for_admin(target_org uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  if not (
    private.is_org_owner(target_org, auth.uid())
    or private.has_org_permission(target_org, 'org.members.view')
    or private.has_org_permission(target_org, 'org.members.manage')
    or private.has_org_permission(target_org, 'org.roles.assign')
  ) then
    raise exception 'missing permission to view organization members';
  end if;

  return (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'profile_id', p.id,
          'display_name', p.display_name,
          'username', p.username,
          'nexus_id', p.nexus_id,
          'account_status', p.account_status,
          'member_id', om.id,
          'role_id', r.id,
          'role_name', r.name,
          'hierarchy_rank', r.hierarchy_rank,
          'is_owner', r.is_owner,
          'is_active', om.is_active,
          'joined_at', om.joined_at,
          'row_version', om.row_version
        )
        order by r.is_owner desc, r.hierarchy_rank desc, lower(p.display_name)
      ),
      '[]'::jsonb
    )
    from public.organization_members om
    join public.profiles p on p.id = om.user_id
    join public.organization_roles r on r.id = om.role_id and r.organization_id = om.organization_id
    where om.organization_id = target_org
      and om.left_at is null
  );
end;
$$;

revoke all on function public.list_organization_members_for_admin(uuid) from public;
grant execute on function public.list_organization_members_for_admin(uuid) to authenticated;

create or replace function public.list_assignable_organization_roles(target_org uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor_rank integer;
  actor_owner boolean;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;

  select r.hierarchy_rank, r.is_owner
    into actor_rank, actor_owner
  from public.organization_members om
  join public.organization_roles r on r.id = om.role_id and r.organization_id = om.organization_id
  join public.profiles p on p.id = om.user_id
  where om.organization_id = target_org
    and om.user_id = auth.uid()
    and om.is_active = true
    and om.left_at is null
    and r.is_active = true
    and p.account_status = 'active';

  if not found then raise exception 'actor membership not found'; end if;
  if not (actor_owner or private.has_org_permission(target_org, 'org.roles.assign')) then
    raise exception 'missing permission: org.roles.assign';
  end if;

  return (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'name', r.name,
          'description', r.description,
          'hierarchy_rank', r.hierarchy_rank,
          'is_standard', r.is_standard
        ) order by r.hierarchy_rank desc, lower(r.name)
      ),
      '[]'::jsonb
    )
    from public.organization_roles r
    where r.organization_id = target_org
      and r.is_active = true
      and r.is_owner = false
      and (actor_owner or r.hierarchy_rank < actor_rank)
  );
end;
$$;

revoke all on function public.list_assignable_organization_roles(uuid) from public;
grant execute on function public.list_assignable_organization_roles(uuid) to authenticated;

create or replace function public.search_active_profiles_for_organization(target_org uuid, search_text text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := trim(coalesce(search_text, ''));
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not (private.is_org_owner(target_org, auth.uid()) or private.has_org_permission(target_org, 'org.members.manage')) then
    raise exception 'missing permission: org.members.manage';
  end if;
  if char_length(needle) < 2 then return '[]'::jsonb; end if;

  return (
    select coalesce(jsonb_agg(to_jsonb(q) order by lower(q.display_name)), '[]'::jsonb)
    from (
      select
        p.id as profile_id,
        p.display_name,
        p.username,
        p.nexus_id
      from public.profiles p
      where p.account_status = 'active'
        and (
          p.display_name ilike '%' || needle || '%'
          or coalesce(p.username, '') ilike '%' || needle || '%'
          or coalesce(p.nexus_id, '') ilike '%' || needle || '%'
        )
        and not exists (
          select 1
          from public.organization_members om
          where om.organization_id = target_org
            and om.user_id = p.id
            and om.left_at is null
        )
      order by lower(p.display_name)
      limit 20
    ) q
  );
end;
$$;

revoke all on function public.search_active_profiles_for_organization(uuid, text) from public;
grant execute on function public.search_active_profiles_for_organization(uuid, text) to authenticated;

create or replace function public.add_organization_member(target_org uuid, target_profile uuid)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_rank integer;
  actor_owner boolean;
  standard_role uuid;
  standard_rank integer;
  standard_name text;
  target_status text;
  new_version bigint;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not (private.is_org_owner(target_org, auth.uid()) or private.has_org_permission(target_org, 'org.members.manage')) then
    raise exception 'missing permission: org.members.manage';
  end if;

  select r.hierarchy_rank, r.is_owner
    into actor_rank, actor_owner
  from public.organization_members om
  join public.organization_roles r on r.id = om.role_id and r.organization_id = om.organization_id
  where om.organization_id = target_org
    and om.user_id = auth.uid()
    and om.is_active = true
    and om.left_at is null;
  if not found then raise exception 'actor membership not found'; end if;

  select p.account_status into target_status
  from public.profiles p where p.id = target_profile;
  if target_status is distinct from 'active' then raise exception 'target account is not active'; end if;

  if exists (
    select 1 from public.organization_members om
    where om.organization_id = target_org
      and om.user_id = target_profile
      and om.left_at is null
  ) then
    raise exception 'profile is already a current member';
  end if;

  select r.id, r.hierarchy_rank, r.name
    into standard_role, standard_rank, standard_name
  from public.organization_roles r
  where r.organization_id = target_org
    and r.is_standard = true
    and r.is_active = true
    and r.is_owner = false
  limit 1;
  if standard_role is null then raise exception 'organization has no active standard role'; end if;

  if not actor_owner and standard_rank >= actor_rank then
    raise exception 'standard role is not below actor role';
  end if;

  insert into public.organization_members (
    organization_id, user_id, role_id, role_title, is_manager, is_active, joined_at,
    inactive_reason, inactive_at, inactive_by, left_at, leave_reason, removed_by, removal_reason
  )
  values (
    target_org, target_profile, standard_role, standard_name, false, true, now(),
    null, null, null, null, null, null, null
  )
  on conflict (organization_id, user_id) do update
  set role_id = excluded.role_id,
      role_title = excluded.role_title,
      is_manager = false,
      is_active = true,
      joined_at = now(),
      inactive_reason = null,
      inactive_at = null,
      inactive_by = null,
      left_at = null,
      leave_reason = null,
      removed_by = null,
      removal_reason = null,
      row_version = public.organization_members.row_version + 1
  returning row_version into new_version;

  insert into public.organization_membership_history (
    organization_id, profile_id, event_type, new_role_id, actor_profile_id
  ) values (
    target_org, target_profile, 'joined', standard_role, auth.uid()
  );

  insert into public.organization_audit_log (
    organization_id, actor_profile_id, action_key, target_type, target_id, new_data
  ) values (
    target_org, auth.uid(), 'organization.member.added', 'profile', target_profile::text,
    jsonb_build_object('role_id', standard_role)
  );

  return new_version;
end;
$$;

revoke all on function public.add_organization_member(uuid, uuid) from public;
grant execute on function public.add_organization_member(uuid, uuid) to authenticated;

-- Correct the hierarchy comparison in the existing role-assignment RPC.
-- hierarchy_rank uses larger numbers for higher normal roles; owner remains protected separately.
create or replace function public.assign_organization_member_role(
  target_org uuid,
  target_profile uuid,
  target_role uuid,
  expected_member_row_version bigint,
  change_reason text default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_rank integer;
  actor_owner boolean;
  current_role uuid;
  current_rank integer;
  current_is_owner boolean;
  new_rank integer;
  new_is_owner boolean;
  new_version bigint;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not (private.is_org_owner(target_org, auth.uid()) or private.has_org_permission(target_org, 'org.roles.assign')) then
    raise exception 'missing permission: org.roles.assign';
  end if;
  if target_profile = auth.uid() then raise exception 'own role cannot be changed here'; end if;

  select r.hierarchy_rank, r.is_owner
    into actor_rank, actor_owner
  from public.organization_members om
  join public.organization_roles r on r.id = om.role_id
  where om.organization_id = target_org
    and om.user_id = auth.uid()
    and om.is_active = true
    and om.left_at is null
    and r.is_active = true;
  if not found then raise exception 'actor membership not found'; end if;

  select om.role_id, r.hierarchy_rank, r.is_owner
    into current_role, current_rank, current_is_owner
  from public.organization_members om
  join public.organization_roles r on r.id = om.role_id
  where om.organization_id = target_org
    and om.user_id = target_profile
    and om.left_at is null;
  if not found then raise exception 'target membership not found'; end if;
  if current_is_owner then raise exception 'owner role cannot be changed here'; end if;

  select hierarchy_rank, is_owner into new_rank, new_is_owner
  from public.organization_roles
  where id = target_role and organization_id = target_org and is_active = true;
  if not found then raise exception 'target role not found'; end if;
  if new_is_owner then raise exception 'owner assignment requires the protected owner procedure'; end if;

  if not actor_owner and (current_rank >= actor_rank or new_rank >= actor_rank) then
    raise exception 'role hierarchy does not allow this change';
  end if;

  update public.organization_members
  set role_id = target_role,
      role_title = (select name from public.organization_roles where id = target_role)
  where organization_id = target_org
    and user_id = target_profile
    and row_version = expected_member_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: membership changed since it was opened'; end if;

  insert into public.organization_membership_history (
    organization_id, profile_id, event_type, old_role_id, new_role_id, reason, actor_profile_id
  ) values (
    target_org, target_profile, 'role_changed', current_role, target_role,
    nullif(trim(coalesce(change_reason, '')), ''), auth.uid()
  );

  insert into public.organization_audit_log (
    organization_id, actor_profile_id, action_key, target_type, target_id, old_data, new_data, metadata
  ) values (
    target_org, auth.uid(), 'organization.member.role_changed', 'profile', target_profile::text,
    jsonb_build_object('role_id', current_role),
    jsonb_build_object('role_id', target_role),
    jsonb_build_object('reason', nullif(trim(coalesce(change_reason, '')), ''))
  );

  return new_version;
end;
$$;

revoke all on function public.assign_organization_member_role(uuid, uuid, uuid, bigint, text) from public;
grant execute on function public.assign_organization_member_role(uuid, uuid, uuid, bigint, text) to authenticated;

create or replace function public.remove_organization_member(
  target_org uuid,
  target_profile uuid,
  expected_member_row_version bigint,
  removal_reason text default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_role uuid;
  target_is_owner boolean;
  new_version bigint;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.is_org_owner(target_org, auth.uid()) then
    raise exception 'only an organization owner may remove normal members';
  end if;
  if target_profile = auth.uid() then raise exception 'use the organization leave flow for yourself'; end if;

  select om.role_id, r.is_owner into old_role, target_is_owner
  from public.organization_members om
  join public.organization_roles r on r.id = om.role_id
  where om.organization_id = target_org
    and om.user_id = target_profile
    and om.left_at is null;
  if not found then raise exception 'target membership not found'; end if;
  if target_is_owner then raise exception 'owners cannot remove other owners'; end if;

  update public.organization_members
  set is_active = false,
      left_at = now(),
      removed_by = auth.uid(),
      removal_reason = nullif(trim(coalesce(removal_reason, '')), ''),
      row_version = row_version + 1
  where organization_id = target_org
    and user_id = target_profile
    and row_version = expected_member_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: membership changed since it was opened'; end if;

  insert into public.organization_membership_history (
    organization_id, profile_id, event_type, old_role_id, reason, actor_profile_id
  ) values (
    target_org, target_profile, 'removed', old_role,
    nullif(trim(coalesce(removal_reason, '')), ''), auth.uid()
  );

  insert into public.organization_audit_log (
    organization_id, actor_profile_id, action_key, target_type, target_id, old_data, metadata
  ) values (
    target_org, auth.uid(), 'organization.member.removed', 'profile', target_profile::text,
    jsonb_build_object('role_id', old_role),
    jsonb_build_object('reason', nullif(trim(coalesce(removal_reason, '')), ''))
  );

  return new_version;
end;
$$;

revoke all on function public.remove_organization_member(uuid, uuid, bigint, text) from public;
grant execute on function public.remove_organization_member(uuid, uuid, bigint, text) to authenticated;

create or replace function public.list_ownerless_organizations()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_city_permission_for(auth.uid(), 'city.organizations.owner_emergency') then
    raise exception 'missing permission: city.organizations.owner_emergency';
  end if;

  return (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'organization_id', o.id,
          'organization_name', o.name,
          'organization_short_name', o.short_name,
          'service_module', o.service_module,
          'member_count', (
            select count(*) from public.organization_members om2
            where om2.organization_id = o.id and om2.left_at is null
          )
        ) order by o.name
      ),
      '[]'::jsonb
    )
    from public.organizations o
    where o.is_archived = false
      and not exists (
        select 1
        from public.organization_members om
        join public.organization_roles r on r.id = om.role_id
        where om.organization_id = o.id
          and om.left_at is null
          and r.is_owner = true
      )
  );
end;
$$;

revoke all on function public.list_ownerless_organizations() from public;
grant execute on function public.list_ownerless_organizations() to authenticated;

create or replace function public.search_active_profiles_for_emergency_owner(target_org uuid, search_text text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := trim(coalesce(search_text, ''));
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_city_permission_for(auth.uid(), 'city.organizations.owner_emergency') then
    raise exception 'missing permission: city.organizations.owner_emergency';
  end if;
  if exists (
    select 1 from public.organization_members om
    join public.organization_roles r on r.id = om.role_id
    where om.organization_id = target_org and om.left_at is null and r.is_owner = true
  ) then
    raise exception 'organization already has an owner';
  end if;
  if char_length(needle) < 2 then return '[]'::jsonb; end if;

  return (
    select coalesce(jsonb_agg(to_jsonb(q) order by lower(q.display_name)), '[]'::jsonb)
    from (
      select p.id as profile_id, p.display_name, p.username, p.nexus_id
      from public.profiles p
      where p.account_status = 'active'
        and (
          p.display_name ilike '%' || needle || '%'
          or coalesce(p.username, '') ilike '%' || needle || '%'
          or coalesce(p.nexus_id, '') ilike '%' || needle || '%'
        )
        and not exists (
          select 1 from public.organization_members om
          where om.organization_id = target_org
            and om.user_id = p.id
            and om.left_at is null
            and om.is_active = false
        )
      order by lower(p.display_name)
      limit 20
    ) q
  );
end;
$$;

revoke all on function public.search_active_profiles_for_emergency_owner(uuid, text) from public;
grant execute on function public.search_active_profiles_for_emergency_owner(uuid, text) to authenticated;

create or replace function public.assign_emergency_organization_owner(target_org uuid, target_profile uuid)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_role uuid;
  owner_name text;
  target_status text;
  existing_inactive boolean;
  new_version bigint;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_city_permission_for(auth.uid(), 'city.organizations.owner_emergency') then
    raise exception 'missing permission: city.organizations.owner_emergency';
  end if;

  if exists (
    select 1 from public.organization_members om
    join public.organization_roles r on r.id = om.role_id
    where om.organization_id = target_org and om.left_at is null and r.is_owner = true
  ) then
    raise exception 'organization already has an owner';
  end if;

  select p.account_status into target_status from public.profiles p where p.id = target_profile;
  if target_status is distinct from 'active' then raise exception 'target account is not active'; end if;

  select exists (
    select 1 from public.organization_members om
    where om.organization_id = target_org
      and om.user_id = target_profile
      and om.left_at is null
      and om.is_active = false
  ) into existing_inactive;
  if existing_inactive then raise exception 'inactive member must be activated before owner assignment'; end if;

  select r.id, r.name into owner_role, owner_name
  from public.organization_roles r
  where r.organization_id = target_org and r.is_owner = true and r.is_active = true
  limit 1;
  if owner_role is null then raise exception 'organization owner role not found'; end if;

  insert into public.organization_members (
    organization_id, user_id, role_id, role_title, is_manager, is_active, joined_at,
    inactive_reason, inactive_at, inactive_by, left_at, leave_reason, removed_by, removal_reason
  ) values (
    target_org, target_profile, owner_role, owner_name, false, true, now(),
    null, null, null, null, null, null, null
  )
  on conflict (organization_id, user_id) do update
  set role_id = excluded.role_id,
      role_title = excluded.role_title,
      is_manager = false,
      is_active = true,
      joined_at = case when public.organization_members.left_at is null then public.organization_members.joined_at else now() end,
      inactive_reason = null,
      inactive_at = null,
      inactive_by = null,
      left_at = null,
      leave_reason = null,
      removed_by = null,
      removal_reason = null,
      row_version = public.organization_members.row_version + 1
  returning row_version into new_version;

  insert into public.organization_membership_history (
    organization_id, profile_id, event_type, new_role_id, reason, actor_profile_id
  ) values (
    target_org, target_profile, 'owner_emergency_assigned', owner_role,
    'Notfall-Owner durch Stadtverwaltung eingesetzt', auth.uid()
  );

  insert into public.organization_audit_log (
    organization_id, actor_profile_id, action_key, target_type, target_id, new_data,
    metadata
  ) values (
    target_org, auth.uid(), 'organization.owner.emergency_assigned', 'profile', target_profile::text,
    jsonb_build_object('role_id', owner_role),
    jsonb_build_object('source', 'city_administration')
  );

  insert into public.system_audit_log (
    actor_profile_id, action_key, target_type, target_id, metadata
  ) values (
    auth.uid(), 'city.organization.owner_emergency_assigned', 'organization', target_org::text,
    jsonb_build_object('profile_id', target_profile)
  );

  return new_version;
end;
$$;

revoke all on function public.assign_emergency_organization_owner(uuid, uuid) from public;
grant execute on function public.assign_emergency_organization_owner(uuid, uuid) to authenticated;
