-- LG Nexus V1 – Phase 2B: activate organization RBAC safely
-- Replaces legacy is_manager-based write access with permission-checked RPCs.
-- Direct client writes to protected organization tables are intentionally revoked.

-- -----------------------------------------------------------------------------
-- Permission catalogue additions
-- -----------------------------------------------------------------------------

insert into public.permissions (key, module, name, description, is_sensitive)
values
  ('org.roles.manage', 'organization', 'Rollen verwalten', 'Organisationsrollen anlegen und bearbeiten.', true),
  ('org.audit.view', 'organization', 'Organisationsprotokoll ansehen', 'Interne Organisationsprotokolle ansehen.', true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

-- -----------------------------------------------------------------------------
-- Remove legacy manager write policies
-- -----------------------------------------------------------------------------

drop policy if exists managers_can_update_organization on public.organizations;
drop policy if exists managers_can_add_members on public.organization_members;
drop policy if exists managers_can_remove_members on public.organization_members;
drop policy if exists managers_can_update_members on public.organization_members;
drop policy if exists members_can_read_own_membership on public.organization_members;

-- Direct writes are no longer part of the browser contract for protected RBAC data.
revoke insert, update, delete on public.organizations from anon, authenticated;
revoke insert, update, delete on public.organization_members from anon, authenticated;
revoke insert, update, delete on public.organization_roles from anon, authenticated;
revoke insert, update, delete on public.organization_role_permissions from anon, authenticated;
revoke insert, update, delete on public.organization_locations from anon, authenticated;
revoke insert, update, delete on public.organization_membership_history from anon, authenticated;
revoke insert, update, delete on public.organization_member_notes from anon, authenticated;
revoke insert, update, delete on public.organization_audit_log from anon, authenticated;
revoke insert, update, delete on public.permissions from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Read policies
-- -----------------------------------------------------------------------------

-- Public organization cards remain readable through the existing public policy.
drop policy if exists org_members_can_read_own_organizations on public.organizations;
create policy org_members_can_read_own_organizations
on public.organizations
for select
to authenticated
using ((select private.is_active_org_member(id)));

-- Active permission catalogue is visible to signed-in users. It contains no secrets.
drop policy if exists authenticated_can_read_active_permissions on public.permissions;
create policy authenticated_can_read_active_permissions
on public.permissions
for select
to authenticated
using (is_active = true);

-- A member may always see their own membership. Full member lists require permission.
drop policy if exists members_can_read_allowed_memberships on public.organization_members;
create policy members_can_read_allowed_memberships
on public.organization_members
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select private.has_org_permission(organization_id, 'org.members.view'))
);

-- Roles and their permission layout are internal, but visible to active members of that org.
drop policy if exists active_members_can_read_org_roles on public.organization_roles;
create policy active_members_can_read_org_roles
on public.organization_roles
for select
to authenticated
using ((select private.is_active_org_member(organization_id)));

drop policy if exists active_members_can_read_role_permissions on public.organization_role_permissions;
create policy active_members_can_read_role_permissions
on public.organization_role_permissions
for select
to authenticated
using (
  exists (
    select 1
    from public.organization_roles r
    where r.id = role_id
      and (select private.is_active_org_member(r.organization_id))
  )
);

-- Public map-enabled locations can be read by everyone; internal locations by org members.
drop policy if exists public_or_members_can_read_org_locations on public.organization_locations;
create policy public_or_members_can_read_org_locations
on public.organization_locations
for select
to anon, authenticated
using (
  (is_active = true and public_marker_enabled = true)
  or (select private.is_active_org_member(organization_id))
);

-- Membership history is available to authorized organization leadership only.
drop policy if exists authorized_can_read_membership_history on public.organization_membership_history;
create policy authorized_can_read_membership_history
on public.organization_membership_history
for select
to authenticated
using ((select private.has_org_permission(organization_id, 'org.members.view')));

-- Internal member notes are more sensitive than the ordinary member list.
drop policy if exists authorized_can_read_member_notes on public.organization_member_notes;
create policy authorized_can_read_member_notes
on public.organization_member_notes
for select
to authenticated
using ((select private.has_org_permission(organization_id, 'org.members.manage')));

-- Audit log is owner-visible by default; explicit audit permission can also grant access.
drop policy if exists authorized_can_read_org_audit on public.organization_audit_log;
create policy authorized_can_read_org_audit
on public.organization_audit_log
for select
to authenticated
using (
  (select private.is_org_owner(organization_id))
  or (select private.has_org_permission(organization_id, 'org.audit.view'))
);

-- -----------------------------------------------------------------------------
-- Frontend-safe RBAC helpers
-- -----------------------------------------------------------------------------

create or replace function public.has_my_org_permission(target_org uuid, requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.coalesce((select private.has_org_permission(target_org, requested_permission)), false);
$$;

-- public.coalesce does not exist; replace the helper with the direct boolean expression.
create or replace function public.has_my_org_permission(target_org uuid, requested_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when auth.uid() is null then false
    else private.has_org_permission(target_org, requested_permission)
  end;
$$;

revoke all on function public.has_my_org_permission(uuid, text) from public, anon;
grant execute on function public.has_my_org_permission(uuid, text) to authenticated;

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
        'role_id', r.id,
        'role_name', r.name,
        'hierarchy_rank', r.hierarchy_rank,
        'is_owner', r.is_owner,
        'permissions',
          case
            when r.is_owner then (
              select coalesce(jsonb_agg(p.key order by p.key), '[]'::jsonb)
              from public.permissions p
              where p.is_active = true
            )
            else (
              select coalesce(jsonb_agg(rp.permission_key order by rp.permission_key), '[]'::jsonb)
              from public.organization_role_permissions rp
              join public.permissions p on p.key = rp.permission_key and p.is_active = true
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
  join public.profiles p on p.id = om.user_id
  where om.user_id = auth.uid()
    and om.is_active = true
    and om.left_at is null
    and o.is_archived = false
    and r.is_active = true
    and p.account_status = 'active';
$$;

revoke all on function public.get_my_organization_context() from public, anon;
grant execute on function public.get_my_organization_context() to authenticated;

-- -----------------------------------------------------------------------------
-- Safe organization mutations with optimistic locking
-- -----------------------------------------------------------------------------

create or replace function public.update_organization_profile(
  target_org uuid,
  expected_row_version bigint,
  new_name text,
  new_description text,
  new_phone text default null,
  new_location_label text default null,
  new_public_email text default null,
  new_short_name text default null,
  new_is_public boolean default true
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_row public.organizations%rowtype;
  new_version bigint;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  if not private.has_org_permission(target_org, 'org.profile.manage') then
    raise exception 'missing permission: org.profile.manage';
  end if;

  if length(trim(coalesce(new_name, ''))) < 2 then
    raise exception 'organization name is too short';
  end if;

  select * into old_row
  from public.organizations
  where id = target_org and is_archived = false;

  if not found then
    raise exception 'organization not found';
  end if;

  update public.organizations
  set name = trim(new_name),
      description = coalesce(new_description, ''),
      phone = nullif(trim(coalesce(new_phone, '')), ''),
      location_label = nullif(trim(coalesce(new_location_label, '')), ''),
      public_email = nullif(trim(coalesce(new_public_email, '')), ''),
      short_name = nullif(trim(coalesce(new_short_name, '')), ''),
      is_public = new_is_public
  where id = target_org
    and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then
    raise exception 'conflict: organization changed since it was opened';
  end if;

  insert into public.organization_audit_log (
    organization_id, actor_profile_id, action_key, target_type, target_id, old_data, new_data
  ) values (
    target_org,
    auth.uid(),
    'organization.profile.updated',
    'organization',
    target_org::text,
    jsonb_build_object(
      'name', old_row.name,
      'description', old_row.description,
      'phone', old_row.phone,
      'location_label', old_row.location_label,
      'public_email', old_row.public_email,
      'short_name', old_row.short_name,
      'is_public', old_row.is_public
    ),
    jsonb_build_object(
      'name', trim(new_name),
      'description', coalesce(new_description, ''),
      'phone', nullif(trim(coalesce(new_phone, '')), ''),
      'location_label', nullif(trim(coalesce(new_location_label, '')), ''),
      'public_email', nullif(trim(coalesce(new_public_email, '')), ''),
      'short_name', nullif(trim(coalesce(new_short_name, '')), ''),
      'is_public', new_is_public
    )
  );

  return new_version;
end;
$$;

revoke all on function public.update_organization_profile(uuid, bigint, text, text, text, text, text, text, boolean) from public, anon;
grant execute on function public.update_organization_profile(uuid, bigint, text, text, text, text, text, text, boolean) to authenticated;

create or replace function public.update_organization_status(
  target_org uuid,
  expected_row_version bigint,
  new_status text,
  new_status_message text default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_status text;
  old_message text;
  new_version bigint;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  if not private.has_org_permission(target_org, 'org.status.manage') then
    raise exception 'missing permission: org.status.manage';
  end if;

  if new_status not in ('open', 'limited', 'closed') then
    raise exception 'invalid organization status';
  end if;

  select status, status_message
  into old_status, old_message
  from public.organizations
  where id = target_org and is_archived = false;

  if not found then
    raise exception 'organization not found';
  end if;

  update public.organizations
  set status = new_status,
      status_message = nullif(trim(coalesce(new_status_message, '')), '')
  where id = target_org
    and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then
    raise exception 'conflict: organization changed since it was opened';
  end if;

  insert into public.organization_status_history (
    organization_id, old_status, new_status, old_message, new_message, changed_by
  ) values (
    target_org, old_status, new_status, old_message,
    nullif(trim(coalesce(new_status_message, '')), ''), auth.uid()
  );

  insert into public.organization_audit_log (
    organization_id, actor_profile_id, action_key, target_type, target_id, old_data, new_data
  ) values (
    target_org,
    auth.uid(),
    'organization.status.updated',
    'organization',
    target_org::text,
    jsonb_build_object('status', old_status, 'status_message', old_message),
    jsonb_build_object('status', new_status, 'status_message', nullif(trim(coalesce(new_status_message, '')), ''))
  );

  return new_version;
end;
$$;

revoke all on function public.update_organization_status(uuid, bigint, text, text) from public, anon;
grant execute on function public.update_organization_status(uuid, bigint, text, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Safe role assignment. Owner assignment is deliberately excluded.
-- -----------------------------------------------------------------------------

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
  new_rank integer;
  new_is_owner boolean;
  new_version bigint;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  if not private.has_org_permission(target_org, 'org.roles.assign') then
    raise exception 'missing permission: org.roles.assign';
  end if;

  select r.hierarchy_rank, r.is_owner
  into actor_rank, actor_owner
  from public.organization_members om
  join public.organization_roles r on r.id = om.role_id
  where om.organization_id = target_org
    and om.user_id = auth.uid()
    and om.is_active = true
    and om.left_at is null
    and r.is_active = true;

  if not found then
    raise exception 'actor membership not found';
  end if;

  select om.role_id, r.hierarchy_rank
  into current_role, current_rank
  from public.organization_members om
  join public.organization_roles r on r.id = om.role_id
  where om.organization_id = target_org
    and om.user_id = target_profile
    and om.is_active = true
    and om.left_at is null;

  if not found then
    raise exception 'target membership not found';
  end if;

  select hierarchy_rank, is_owner
  into new_rank, new_is_owner
  from public.organization_roles
  where id = target_role
    and organization_id = target_org
    and is_active = true;

  if not found then
    raise exception 'target role not found';
  end if;

  if new_is_owner then
    raise exception 'owner assignment requires the protected owner procedure';
  end if;

  if not actor_owner and (current_rank <= actor_rank or new_rank <= actor_rank) then
    raise exception 'role hierarchy does not allow this change';
  end if;

  update public.organization_members
  set role_id = target_role,
      role_title = (select name from public.organization_roles where id = target_role)
  where organization_id = target_org
    and user_id = target_profile
    and row_version = expected_member_row_version
  returning row_version into new_version;

  if new_version is null then
    raise exception 'conflict: membership changed since it was opened';
  end if;

  insert into public.organization_membership_history (
    organization_id, profile_id, event_type, old_role_id, new_role_id, reason, actor_profile_id
  ) values (
    target_org, target_profile, 'role_changed', current_role, target_role,
    nullif(trim(coalesce(change_reason, '')), ''), auth.uid()
  );

  insert into public.organization_audit_log (
    organization_id, actor_profile_id, action_key, target_type, target_id, old_data, new_data, metadata
  ) values (
    target_org,
    auth.uid(),
    'organization.member.role_changed',
    'profile',
    target_profile::text,
    jsonb_build_object('role_id', current_role),
    jsonb_build_object('role_id', target_role),
    jsonb_build_object('reason', nullif(trim(coalesce(change_reason, '')), ''))
  );

  return new_version;
end;
$$;

revoke all on function public.assign_organization_member_role(uuid, uuid, uuid, bigint, text) from public, anon;
grant execute on function public.assign_organization_member_role(uuid, uuid, uuid, bigint, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Protected Owner assignment for emergency/bootstrap administration.
-- This does not give the technical role any Fachaktenzugriff.
-- -----------------------------------------------------------------------------

create or replace function public.assign_organization_owner(
  target_org uuid,
  target_profile uuid,
  assignment_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_role uuid;
  old_role uuid;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  if not private.has_system_role('system_admin') then
    raise exception 'system_admin role required';
  end if;

  if length(trim(coalesce(assignment_reason, ''))) < 3 then
    raise exception 'assignment reason required';
  end if;

  select id into owner_role
  from public.organization_roles
  where organization_id = target_org
    and is_owner = true
    and is_active = true;

  if not found then
    raise exception 'owner role not found';
  end if;

  select role_id into old_role
  from public.organization_members
  where organization_id = target_org
    and user_id = target_profile
    and is_active = true
    and left_at is null;

  if not found then
    raise exception 'target must already be an active organization member';
  end if;

  update public.organization_members
  set role_id = owner_role,
      role_title = 'Owner'
  where organization_id = target_org
    and user_id = target_profile;

  insert into public.organization_membership_history (
    organization_id, profile_id, event_type, old_role_id, new_role_id, reason, actor_profile_id
  ) values (
    target_org, target_profile, 'owner_assigned', old_role, owner_role,
    trim(assignment_reason), auth.uid()
  );

  insert into public.organization_audit_log (
    organization_id, actor_profile_id, action_key, target_type, target_id, old_data, new_data, metadata
  ) values (
    target_org,
    auth.uid(),
    'organization.owner.assigned',
    'profile',
    target_profile::text,
    jsonb_build_object('role_id', old_role),
    jsonb_build_object('role_id', owner_role),
    jsonb_build_object('reason', trim(assignment_reason))
  );
end;
$$;

revoke all on function public.assign_organization_owner(uuid, uuid, text) from public, anon;
grant execute on function public.assign_organization_owner(uuid, uuid, text) to authenticated;

-- -----------------------------------------------------------------------------
-- Foreign-key indexes used by the activated access paths
-- -----------------------------------------------------------------------------

create index if not exists organization_role_permissions_role_idx
  on public.organization_role_permissions(role_id);
create index if not exists organization_members_user_idx
  on public.organization_members(user_id, is_active);
create index if not exists organization_membership_history_actor_idx
  on public.organization_membership_history(actor_profile_id);
create index if not exists organization_member_notes_author_idx
  on public.organization_member_notes(author_profile_id);
create index if not exists organization_audit_log_actor_idx
  on public.organization_audit_log(actor_profile_id);
