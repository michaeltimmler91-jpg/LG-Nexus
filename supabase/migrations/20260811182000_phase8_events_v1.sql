create table if not exists public.organization_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text,
  location_label text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'planned' check (status in ('planned','live','finished','cancelled')),
  image_url text,
  is_public boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1,
  constraint organization_events_time_check check (ends_at is null or ends_at >= starts_at)
);

create index if not exists organization_events_org_starts_idx on public.organization_events(organization_id, starts_at desc);
create index if not exists organization_events_public_starts_idx on public.organization_events(is_public, starts_at);

alter table public.organization_events enable row level security;

revoke all on public.organization_events from anon, authenticated;

drop trigger if exists organization_events_set_updated_at on public.organization_events;
create trigger organization_events_set_updated_at
before update on public.organization_events
for each row execute function public.set_updated_at();

drop trigger if exists organization_events_increment_row_version on public.organization_events;
create trigger organization_events_increment_row_version
before update on public.organization_events
for each row execute function private.increment_row_version();

create or replace function public.organization_management_get_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  global boolean;
begin
  if actor is null then return '[]'::jsonb; end if;
  global := private.is_global_admin_for(actor);

  return (
    select coalesce(jsonb_agg(to_jsonb(q) order by lower(q.name)), '[]'::jsonb)
    from (
      select distinct
        o.id as organization_id,
        o.name,
        o.short_name,
        o.description,
        o.phone,
        o.public_email,
        o.location_label,
        o.logo_url,
        o.banner_url,
        o.status,
        o.status_message,
        o.is_public,
        o.organization_type,
        o.service_module,
        o.row_version,
        global or private.is_org_owner(o.id) or private.has_org_permission(o.id, 'org.profile.manage') as can_profile,
        global or private.is_org_owner(o.id) or private.has_org_permission(o.id, 'org.status.manage') as can_status,
        global or private.is_org_owner(o.id) or private.has_org_permission(o.id, 'org.profile.manage') as can_media,
        global or private.is_org_owner(o.id) or private.has_org_permission(o.id, 'org.members.view') or private.has_org_permission(o.id, 'org.members.manage') as can_members,
        global or private.is_org_owner(o.id) or private.has_org_permission(o.id, 'org.roles.manage') as can_roles,
        global or private.is_org_owner(o.id) or private.has_org_permission(o.id, 'org.roles.assign') as can_assign_roles,
        global or private.is_org_owner(o.id) or private.has_org_permission(o.id, 'org.events.manage') as can_events,
        global as is_global_admin,
        case when global then false else coalesce(r.is_owner, false) end as is_owner
      from public.organizations o
      left join public.organization_members m
        on m.organization_id = o.id
       and m.user_id = actor
       and m.is_active = true
       and m.left_at is null
      left join public.organization_roles r
        on r.id = m.role_id
       and r.organization_id = o.id
       and r.is_active = true
      where o.is_archived = false
        and (
          global
          or (m.id is not null and (
            r.is_owner = true
            or private.has_org_permission(o.id, 'org.profile.manage')
            or private.has_org_permission(o.id, 'org.status.manage')
            or private.has_org_permission(o.id, 'org.members.view')
            or private.has_org_permission(o.id, 'org.members.manage')
            or private.has_org_permission(o.id, 'org.roles.assign')
            or private.has_org_permission(o.id, 'org.roles.manage')
            or private.has_org_permission(o.id, 'org.events.manage')
          ))
        )
    ) q
  );
end;
$$;

create or replace function public.events_list_public(search_text text default null)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(to_jsonb(q) order by q.starts_at asc), '[]'::jsonb)
  from (
    select
      e.id,
      e.organization_id,
      o.name as organization_name,
      o.short_name as organization_short_name,
      o.logo_url as organization_logo_url,
      e.title,
      e.description,
      e.category,
      e.location_label,
      e.starts_at,
      e.ends_at,
      e.status,
      e.image_url,
      e.created_at,
      e.updated_at
    from public.organization_events e
    join public.organizations o on o.id = e.organization_id
    where e.is_public = true
      and o.is_public = true
      and o.is_archived = false
      and (
        nullif(trim(coalesce(search_text, '')), '') is null
        or lower(concat_ws(' ', e.title, e.description, e.category, e.location_label, o.name, o.short_name)) like '%' || lower(trim(search_text)) || '%'
      )
  ) q;
$$;

create or replace function public.organization_events_list(target_org uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_org_permission(target_org, 'org.events.manage') then raise exception 'missing permission: org.events.manage'; end if;

  return (
    select coalesce(jsonb_agg(to_jsonb(q) order by q.starts_at desc), '[]'::jsonb)
    from (
      select
        e.id,
        e.organization_id,
        e.title,
        e.description,
        e.category,
        e.location_label,
        e.starts_at,
        e.ends_at,
        e.status,
        e.image_url,
        e.is_public,
        e.created_at,
        e.updated_at,
        e.row_version
      from public.organization_events e
      where e.organization_id = target_org
    ) q
  );
end;
$$;

create or replace function public.organization_events_save(
  target_org uuid,
  target_event uuid,
  event_title text,
  event_description text,
  event_category text,
  event_location text,
  event_starts_at timestamptz,
  event_ends_at timestamptz,
  event_status text,
  event_image_url text,
  event_is_public boolean,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  saved public.organization_events%rowtype;
  old_row public.organization_events%rowtype;
  clean_image text := nullif(trim(coalesce(event_image_url, '')), '');
begin
  if actor is null then raise exception 'authentication required'; end if;
  if not private.has_org_permission(target_org, 'org.events.manage') then raise exception 'missing permission: org.events.manage'; end if;
  if length(trim(coalesce(event_title, ''))) < 3 then raise exception 'event title is too short'; end if;
  if event_starts_at is null then raise exception 'event start is required'; end if;
  if event_ends_at is not null and event_ends_at < event_starts_at then raise exception 'event end must be after start'; end if;
  if event_status not in ('planned','live','finished','cancelled') then raise exception 'invalid event status'; end if;
  if clean_image is not null and clean_image !~* '^https://' then raise exception 'event image must use https'; end if;
  if clean_image is not null and clean_image ilike '%pfbjblrtwpnhsuvshpcc.supabase.co%' then raise exception 'event image must be externally hosted'; end if;

  if target_event is null then
    insert into public.organization_events(
      organization_id,title,description,category,location_label,starts_at,ends_at,status,image_url,is_public,created_by,updated_by
    ) values (
      target_org,
      trim(event_title),
      coalesce(event_description, ''),
      nullif(trim(coalesce(event_category, '')), ''),
      nullif(trim(coalesce(event_location, '')), ''),
      event_starts_at,
      event_ends_at,
      event_status,
      clean_image,
      coalesce(event_is_public, true),
      actor,
      actor
    ) returning * into saved;

    insert into public.organization_audit_log(organization_id,actor_profile_id,action_key,target_type,target_id,new_data)
    values(target_org,actor,'organization.event.created','event',saved.id::text,
      jsonb_build_object('title',saved.title,'starts_at',saved.starts_at,'status',saved.status,'is_public',saved.is_public));
  else
    select * into old_row
    from public.organization_events
    where id = target_event and organization_id = target_org;
    if not found then raise exception 'event not found'; end if;

    update public.organization_events
    set title = trim(event_title),
        description = coalesce(event_description, ''),
        category = nullif(trim(coalesce(event_category, '')), ''),
        location_label = nullif(trim(coalesce(event_location, '')), ''),
        starts_at = event_starts_at,
        ends_at = event_ends_at,
        status = event_status,
        image_url = clean_image,
        is_public = coalesce(event_is_public, true),
        updated_by = actor
    where id = target_event
      and organization_id = target_org
      and row_version = expected_row_version
    returning * into saved;

    if saved.id is null then raise exception 'conflict: event changed since it was opened'; end if;

    insert into public.organization_audit_log(organization_id,actor_profile_id,action_key,target_type,target_id,old_data,new_data)
    values(target_org,actor,'organization.event.updated','event',saved.id::text,
      jsonb_build_object('title',old_row.title,'starts_at',old_row.starts_at,'status',old_row.status,'is_public',old_row.is_public),
      jsonb_build_object('title',saved.title,'starts_at',saved.starts_at,'status',saved.status,'is_public',saved.is_public));
  end if;

  if private.is_global_admin_for(actor) then
    insert into public.global_admin_audit_log(actor_profile_id,action_key,target_organization_id,metadata)
    values(actor,case when target_event is null then 'organization.event.created' else 'organization.event.updated' end,target_org,
      jsonb_build_object('event_id',saved.id,'title',saved.title));
  end if;

  return to_jsonb(saved);
end;
$$;

grant execute on function public.events_list_public(text) to anon, authenticated;
grant execute on function public.organization_events_list(uuid) to authenticated;
grant execute on function public.organization_events_save(uuid,uuid,text,text,text,text,timestamptz,timestamptz,text,text,boolean,bigint) to authenticated;
