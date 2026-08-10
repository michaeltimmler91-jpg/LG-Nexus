-- LG Nexus V1 – Phase 3: sichere Accountfreischaltung

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('city.accounts.view', 'city', 'Accountfreischaltungen ansehen', 'Offene Accountregistrierungen in der Stadthalle ansehen.', true, true),
  ('city.accounts.approve', 'city', 'Accounts freischalten', 'Offene Accountregistrierungen freischalten.', true, true),
  ('city.accounts.reject', 'city', 'Accounts ablehnen', 'Offene Accountregistrierungen mit Begründung ablehnen.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = excluded.is_active;

create sequence if not exists public.nexus_id_seq start with 1 increment by 1;

do $$
declare
  current_max bigint;
begin
  select coalesce(max((substring(nexus_id from '^NX-([0-9]+)$'))::bigint), 0)
    into current_max
  from public.profiles
  where nexus_id ~ '^NX-[0-9]+$';

  perform setval('public.nexus_id_seq', current_max + 1, false);
end
$$;

create or replace function private.has_system_role_for(
  target_profile uuid,
  requested_role text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.system_role_assignments a
    join public.system_roles r on r.id = a.system_role_id
    where a.profile_id = target_profile
      and r.key = requested_role
      and r.is_active = true
  );
$$;

create or replace function private.has_city_permission_for(
  target_profile uuid,
  requested_permission text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members m
    join public.organizations o
      on o.id = m.organization_id
     and o.slug = 'stadtverwaltung-los-santos'
     and o.is_archived = false
    join public.organization_roles r
      on r.id = m.role_id
     and r.organization_id = m.organization_id
     and r.is_active = true
    join public.profiles p
      on p.id = m.user_id
     and p.account_status = 'active'
    where m.user_id = target_profile
      and m.is_active = true
      and m.left_at is null
      and (
        r.is_owner = true
        or exists (
          select 1
          from public.organization_role_permissions rp
          join public.permissions perm
            on perm.key = rp.permission_key
           and perm.is_active = true
          where rp.role_id = r.id
            and rp.permission_key = requested_permission
        )
      )
  );
$$;

create or replace function private.can_view_account_approvals(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    private.has_system_role_for(target_profile, 'system_admin')
    or private.has_city_permission_for(target_profile, 'city.accounts.view')
    or private.has_city_permission_for(target_profile, 'city.accounts.approve')
    or private.has_city_permission_for(target_profile, 'city.accounts.reject');
$$;

create or replace function public.get_account_admin_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  actor_status text;
  is_system_admin boolean := false;
  can_view boolean := false;
  can_approve boolean := false;
  can_reject boolean := false;
begin
  if actor is null then
    return jsonb_build_object(
      'can_view', false,
      'can_approve', false,
      'can_reject', false,
      'is_system_admin', false
    );
  end if;

  select p.account_status into actor_status
  from public.profiles p
  where p.id = actor;

  if actor_status is distinct from 'active' then
    return jsonb_build_object(
      'can_view', false,
      'can_approve', false,
      'can_reject', false,
      'is_system_admin', false
    );
  end if;

  is_system_admin := private.has_system_role_for(actor, 'system_admin');
  can_approve := is_system_admin or private.has_city_permission_for(actor, 'city.accounts.approve');
  can_reject := is_system_admin or private.has_city_permission_for(actor, 'city.accounts.reject');
  can_view := is_system_admin
    or private.has_city_permission_for(actor, 'city.accounts.view')
    or can_approve
    or can_reject;

  return jsonb_build_object(
    'can_view', can_view,
    'can_approve', can_approve,
    'can_reject', can_reject,
    'is_system_admin', is_system_admin
  );
end;
$$;

create or replace function public.list_pending_accounts()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  actor_status text;
  result jsonb;
begin
  if actor is null then
    raise exception 'not_authenticated';
  end if;

  select p.account_status into actor_status
  from public.profiles p
  where p.id = actor;

  if actor_status is distinct from 'active'
     or not private.can_view_account_approvals(actor) then
    raise exception 'not_authorized';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'display_name', p.display_name,
        'username', p.username,
        'first_name', p.first_name,
        'last_name', p.last_name,
        'date_of_birth', p.date_of_birth,
        'created_at', p.created_at,
        'row_version', p.row_version
      ) order by p.created_at asc
    ),
    '[]'::jsonb
  )
  into result
  from public.profiles p
  where p.account_status = 'pending';

  return result;
end;
$$;

create or replace function public.review_pending_account(
  target_profile uuid,
  decision text,
  reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  actor_status text;
  target public.profiles%rowtype;
  normalized_decision text := lower(trim(coalesce(decision, '')));
  generated_nexus_id text;
  mail_base text;
  mail_candidate text;
  suffix integer := 1;
  allowed boolean := false;
begin
  if actor is null then
    raise exception 'not_authenticated';
  end if;

  select p.account_status into actor_status
  from public.profiles p
  where p.id = actor;

  if actor_status is distinct from 'active' then
    raise exception 'not_authorized';
  end if;

  if normalized_decision = 'approve' then
    allowed := private.has_system_role_for(actor, 'system_admin')
      or private.has_city_permission_for(actor, 'city.accounts.approve');
  elsif normalized_decision = 'reject' then
    allowed := private.has_system_role_for(actor, 'system_admin')
      or private.has_city_permission_for(actor, 'city.accounts.reject');
  else
    raise exception 'invalid_decision';
  end if;

  if not allowed then
    raise exception 'not_authorized';
  end if;

  select p.* into target
  from public.profiles p
  where p.id = target_profile
  for update;

  if not found then
    raise exception 'profile_not_found';
  end if;

  if target.account_status <> 'pending' then
    raise exception 'account_not_pending';
  end if;

  if normalized_decision = 'reject' then
    if nullif(trim(coalesce(reason, '')), '') is null then
      raise exception 'rejection_reason_required';
    end if;

    update public.profiles
    set account_status = 'rejected',
        rejection_reason = trim(reason),
        rejected_at = now(),
        rejected_by = actor,
        approved_at = null,
        approved_by = null,
        row_version = row_version + 1
    where id = target_profile;

    insert into public.account_status_history (
      profile_id, old_status, new_status, reason, changed_by
    ) values (
      target_profile, 'pending', 'rejected', trim(reason), actor
    );

    insert into public.system_audit_log (
      actor_profile_id, action_key, target_type, target_id, metadata
    ) values (
      actor,
      'account.registration.rejected',
      'profile',
      target_profile::text,
      jsonb_build_object('reason', trim(reason))
    );

    return jsonb_build_object('ok', true, 'status', 'rejected');
  end if;

  generated_nexus_id := coalesce(
    target.nexus_id,
    'NX-' || lpad(nextval('public.nexus_id_seq')::text, 6, '0')
  );

  mail_base := lower(
    regexp_replace(
      trim(both '.' from concat_ws('.', nullif(target.first_name, ''), nullif(target.last_name, ''))),
      '[^a-zA-Z0-9.]+',
      '',
      'g'
    )
  );

  if mail_base = '' then
    mail_base := regexp_replace(lower(coalesce(target.username, 'citizen')), '[^a-z0-9]+', '', 'g');
  end if;

  if mail_base = '' then
    mail_base := 'citizen';
  end if;

  mail_candidate := mail_base || '@nexus.ls';

  while exists (
    select 1 from public.profiles p
    where p.nexus_email = mail_candidate
      and p.id <> target_profile
  ) loop
    suffix := suffix + 1;
    mail_candidate := mail_base || '.' || suffix::text || '@nexus.ls';
  end loop;

  update public.profiles
  set account_status = 'active',
      nexus_id = generated_nexus_id,
      nexus_email = coalesce(target.nexus_email, mail_candidate),
      approved_at = now(),
      approved_by = actor,
      rejection_reason = null,
      rejected_at = null,
      rejected_by = null,
      row_version = row_version + 1
  where id = target_profile;

  insert into public.account_status_history (
    profile_id, old_status, new_status, reason, changed_by
  ) values (
    target_profile,
    'pending',
    'active',
    nullif(trim(coalesce(reason, '')), ''),
    actor
  );

  insert into public.system_audit_log (
    actor_profile_id, action_key, target_type, target_id, metadata
  ) values (
    actor,
    'account.registration.approved',
    'profile',
    target_profile::text,
    jsonb_build_object('nexus_id', generated_nexus_id, 'nexus_email', coalesce(target.nexus_email, mail_candidate))
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'active',
    'nexus_id', generated_nexus_id,
    'nexus_email', coalesce(target.nexus_email, mail_candidate)
  );
end;
$$;

revoke all on function public.get_account_admin_context() from public;
revoke all on function public.list_pending_accounts() from public;
revoke all on function public.review_pending_account(uuid, text, text) from public;

grant execute on function public.get_account_admin_context() to authenticated;
grant execute on function public.list_pending_accounts() to authenticated;
grant execute on function public.review_pending_account(uuid, text, text) to authenticated;
