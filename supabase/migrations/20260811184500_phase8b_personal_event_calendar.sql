create table if not exists public.personal_event_calendar (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.organization_events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, event_id)
);

create index if not exists personal_event_calendar_event_idx on public.personal_event_calendar(event_id);

alter table public.personal_event_calendar enable row level security;
revoke all on public.personal_event_calendar from anon, authenticated;

create or replace function public.calendar_event_is_saved(target_event uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when auth.uid() is null then false
    else exists(
      select 1
      from public.personal_event_calendar c
      where c.profile_id = auth.uid()
        and c.event_id = target_event
    )
  end;
$$;

create or replace function public.calendar_set_event_saved(target_event uuid, should_save boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  allowed boolean;
begin
  if actor is null then raise exception 'authentication required'; end if;
  if not exists (
    select 1 from public.profiles p
    where p.id = actor and p.account_status = 'active'
  ) then
    raise exception 'active account required';
  end if;

  if coalesce(should_save, false) then
    select exists(
      select 1
      from public.organization_events e
      join public.organizations o on o.id = e.organization_id
      where e.id = target_event
        and e.is_public = true
        and o.is_public = true
        and o.is_archived = false
    ) into allowed;

    if not allowed then raise exception 'event is not publicly available'; end if;

    insert into public.personal_event_calendar(profile_id, event_id)
    values(actor, target_event)
    on conflict (profile_id, event_id) do nothing;
  else
    delete from public.personal_event_calendar
    where profile_id = actor and event_id = target_event;
  end if;

  return exists(
    select 1 from public.personal_event_calendar c
    where c.profile_id = actor and c.event_id = target_event
  );
end;
$$;

create or replace function public.calendar_list_my_events()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when auth.uid() is null then '[]'::jsonb
    else coalesce((
      select jsonb_agg(to_jsonb(q) order by q.starts_at asc)
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
          c.created_at as saved_at
        from public.personal_event_calendar c
        join public.organization_events e on e.id = c.event_id
        join public.organizations o on o.id = e.organization_id
        where c.profile_id = auth.uid()
          and e.is_public = true
          and o.is_public = true
          and o.is_archived = false
      ) q
    ), '[]'::jsonb)
  end;
$$;

grant execute on function public.calendar_event_is_saved(uuid) to authenticated;
grant execute on function public.calendar_set_event_saved(uuid, boolean) to authenticated;
grant execute on function public.calendar_list_my_events() to authenticated;
