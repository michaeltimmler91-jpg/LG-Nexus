-- LG Nexus V1
-- Phase 5A: Police core - person search and lightweight case management.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('police.people.search', 'police', 'Personensuche', 'Erlaubt die interne Suche nach Bürgern für Police-Vorgänge.', true, true),
  ('police.cases.view', 'police', 'Fälle ansehen', 'Erlaubt das Lesen von Police-Fällen.', true, true),
  ('police.cases.create', 'police', 'Fälle anlegen', 'Erlaubt das Anlegen neuer Police-Fälle.', true, true),
  ('police.cases.edit', 'police', 'Fälle bearbeiten', 'Erlaubt das Bearbeiten bestehender Police-Fälle.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

create sequence if not exists public.police_case_number_seq start 1;
revoke all on sequence public.police_case_number_seq from anon, authenticated;

create table if not exists public.police_cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique default ('PD-' || lpad(nextval('public.police_case_number_seq')::text, 6, '0')),
  title text not null,
  summary text,
  status text not null default 'new',
  lead_profile_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  row_version bigint not null default 1,
  constraint police_cases_status_check check (status in ('new', 'investigation', 'review', 'completed', 'archived'))
);

create index if not exists police_cases_status_idx on public.police_cases(status, updated_at desc);
create index if not exists police_cases_lead_profile_idx on public.police_cases(lead_profile_id);
create index if not exists police_cases_created_by_idx on public.police_cases(created_by);

alter table public.police_cases enable row level security;
revoke all on table public.police_cases from anon, authenticated;

drop trigger if exists police_cases_set_updated_at on public.police_cases;
create trigger police_cases_set_updated_at
before update on public.police_cases
for each row execute function public.set_updated_at();

drop trigger if exists police_cases_increment_row_version on public.police_cases;
create trigger police_cases_increment_row_version
before update on public.police_cases
for each row execute function private.increment_row_version();

create table if not exists public.police_case_people (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.police_cases(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  person_role text not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint police_case_people_role_check check (person_role in ('accused', 'victim', 'witness', 'other')),
  unique(case_id, profile_id, person_role)
);

create index if not exists police_case_people_case_idx on public.police_case_people(case_id);
create index if not exists police_case_people_profile_idx on public.police_case_people(profile_id);
create index if not exists police_case_people_created_by_idx on public.police_case_people(created_by);

alter table public.police_case_people enable row level security;
revoke all on table public.police_case_people from anon, authenticated;

create or replace function public.police_get_my_context()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'can_open', private.has_service_permission_for(auth.uid(), 'police', 'police.access'),
    'can_search_people', private.has_service_permission_for(auth.uid(), 'police', 'police.people.search'),
    'can_view_cases', private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view'),
    'can_create_cases', private.has_service_permission_for(auth.uid(), 'police', 'police.cases.create'),
    'can_edit_cases', private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit')
  );
$$;
revoke all on function public.police_get_my_context() from public, anon;
grant execute on function public.police_get_my_context() to authenticated;

create or replace function public.police_search_people(search_text text)
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
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.people.search') then
    raise exception 'missing permission: police.people.search';
  end if;
  if char_length(needle) < 2 then return '[]'::jsonb; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'profile_id', p.id,
      'display_name', p.display_name,
      'nexus_id', p.nexus_id,
      'date_of_birth', p.date_of_birth
    ) order by lower(p.display_name))
    from (
      select p.*
      from public.profiles p
      where p.account_status = 'active'
        and (
          p.display_name ilike '%' || needle || '%'
          or coalesce(p.nexus_id, '') ilike '%' || needle || '%'
        )
      order by lower(p.display_name)
      limit 20
    ) p
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_search_people(text) from public, anon;
grant execute on function public.police_search_people(text) to authenticated;

create or replace function public.police_list_cases(search_text text default null)
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
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view') then
    raise exception 'missing permission: police.cases.view';
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', c.id,
      'case_number', c.case_number,
      'title', c.title,
      'summary', c.summary,
      'status', c.status,
      'lead_name', lead.display_name,
      'created_at', c.created_at,
      'updated_at', c.updated_at,
      'row_version', c.row_version,
      'people', coalesce((
        select jsonb_agg(jsonb_build_object(
          'profile_id', cp.profile_id,
          'display_name', pp.display_name,
          'nexus_id', pp.nexus_id,
          'person_role', cp.person_role,
          'note', cp.note
        ) order by lower(pp.display_name))
        from public.police_case_people cp
        join public.profiles pp on pp.id = cp.profile_id
        where cp.case_id = c.id
      ), '[]'::jsonb)
    ) order by c.updated_at desc)
    from public.police_cases c
    left join public.profiles lead on lead.id = c.lead_profile_id
    where needle = ''
       or c.case_number ilike '%' || needle || '%'
       or c.title ilike '%' || needle || '%'
       or exists (
         select 1
         from public.police_case_people cp2
         join public.profiles pp2 on pp2.id = cp2.profile_id
         where cp2.case_id = c.id
           and (pp2.display_name ilike '%' || needle || '%' or coalesce(pp2.nexus_id, '') ilike '%' || needle || '%')
       )
    limit 100
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_cases(text) from public, anon;
grant execute on function public.police_list_cases(text) to authenticated;

create or replace function public.police_create_case(
  case_title text,
  case_summary text,
  target_profile uuid default null,
  target_person_role text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_title text := trim(coalesce(case_title, ''));
  clean_summary text := nullif(trim(coalesce(case_summary, '')), '');
  new_case public.police_cases%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.create') then
    raise exception 'missing permission: police.cases.create';
  end if;
  if char_length(clean_title) < 3 then raise exception 'case title required'; end if;
  if target_profile is not null and target_person_role not in ('accused', 'victim', 'witness', 'other') then
    raise exception 'invalid person role';
  end if;

  insert into public.police_cases (title, summary, lead_profile_id, created_by)
  values (clean_title, clean_summary, auth.uid(), auth.uid())
  returning * into new_case;

  if target_profile is not null then
    if not exists (select 1 from public.profiles p where p.id = target_profile and p.account_status = 'active') then
      raise exception 'person not found';
    end if;
    insert into public.police_case_people (case_id, profile_id, person_role, created_by)
    values (new_case.id, target_profile, target_person_role, auth.uid());
  end if;

  return jsonb_build_object(
    'id', new_case.id,
    'case_number', new_case.case_number,
    'row_version', new_case.row_version
  );
end;
$$;
revoke all on function public.police_create_case(text, text, uuid, text) from public, anon;
grant execute on function public.police_create_case(text, text, uuid, text) to authenticated;

create or replace function public.police_update_case_status(
  target_case uuid,
  next_status text,
  expected_row_version bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_version bigint;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;
  if next_status not in ('new', 'investigation', 'review', 'completed', 'archived') then
    raise exception 'invalid case status';
  end if;

  update public.police_cases
  set status = next_status,
      completed_at = case when next_status = 'completed' then coalesce(completed_at, now()) else completed_at end
  where id = target_case and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: case changed since it was opened'; end if;
  return new_version;
end;
$$;
revoke all on function public.police_update_case_status(uuid, text, bigint) from public, anon;
grant execute on function public.police_update_case_status(uuid, text, bigint) to authenticated;
