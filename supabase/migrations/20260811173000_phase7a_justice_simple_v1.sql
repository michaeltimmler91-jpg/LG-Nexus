-- LG Nexus · Phase 7A
-- Simple Justice workspace: cases, people, appointments and knowledge.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('justice.cases.view', 'justice', 'Fälle ansehen', 'Darf Justice-Fälle ansehen.', true, true),
  ('justice.cases.manage', 'justice', 'Fälle bearbeiten', 'Darf Justice-Fälle anlegen und bearbeiten.', true, true),
  ('justice.people.search', 'justice', 'Bürger suchen', 'Darf Bürger für Justice-Vorgänge suchen.', true, true),
  ('justice.appointments.view', 'justice', 'Termine ansehen', 'Darf Justice-Termine ansehen.', true, true),
  ('justice.appointments.manage', 'justice', 'Termine bearbeiten', 'Darf Justice-Termine anlegen und bearbeiten.', true, true),
  ('justice.knowledge.view', 'justice', 'Wissen ansehen', 'Darf Gesetze, Hinweise und Vorlagen ansehen.', true, true),
  ('justice.knowledge.manage', 'justice', 'Wissen bearbeiten', 'Darf Gesetze, Hinweise und Vorlagen pflegen.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

insert into public.organization_role_permissions (role_id, permission_key)
select r.id, p.key
from public.organization_roles r
join public.organizations o on o.id = r.organization_id
cross join public.permissions p
where o.service_module = 'justice'
  and r.is_active is true
  and (r.is_standard is true or r.is_owner is true)
  and p.key in (
    'justice.access',
    'justice.cases.view', 'justice.cases.manage',
    'justice.people.search',
    'justice.appointments.view', 'justice.appointments.manage',
    'justice.knowledge.view', 'justice.knowledge.manage'
  )
on conflict (role_id, permission_key) do nothing;

create sequence if not exists public.justice_case_number_seq start with 1 increment by 1;
revoke all on sequence public.justice_case_number_seq from public, anon, authenticated;

create table if not exists public.justice_cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique default ('JU-' || lpad(nextval('public.justice_case_number_seq')::text, 6, '0')),
  title text not null check (char_length(trim(title)) between 2 and 180),
  summary text,
  result_text text,
  state text not null default 'open' check (state in ('open', 'done')),
  responsible_profile uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  row_version bigint not null default 1,
  check (summary is null or char_length(summary) <= 10000),
  check (result_text is null or char_length(result_text) <= 10000)
);

create index if not exists justice_cases_state_updated_idx on public.justice_cases (state, updated_at desc);
create index if not exists justice_cases_responsible_idx on public.justice_cases (responsible_profile, updated_at desc);

create table if not exists public.justice_case_people (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.justice_cases(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_label text not null default 'Beteiligter' check (char_length(trim(role_label)) between 2 and 80),
  is_active boolean not null default true,
  added_by uuid references public.profiles(id) on delete set null,
  added_at timestamptz not null default now(),
  removed_by uuid references public.profiles(id) on delete set null,
  removed_at timestamptz,
  unique (case_id, profile_id, role_label)
);

create index if not exists justice_case_people_case_idx on public.justice_case_people (case_id, is_active);
create index if not exists justice_case_people_profile_idx on public.justice_case_people (profile_id, is_active);

create table if not exists public.justice_case_timeline (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.justice_cases(id) on delete cascade,
  entry_type text not null default 'note' check (entry_type in ('created', 'note', 'status')),
  body text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (body is null or char_length(body) <= 4000)
);

create index if not exists justice_case_timeline_case_idx on public.justice_case_timeline (case_id, created_at desc);

create table if not exists public.justice_appointments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.justice_cases(id) on delete set null,
  appointment_type text not null check (char_length(trim(appointment_type)) between 2 and 100),
  title text not null check (char_length(trim(title)) between 2 and 180),
  starts_at timestamptz not null,
  location text,
  participants_text text,
  note text,
  state text not null default 'scheduled' check (state in ('scheduled', 'done')),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  row_version bigint not null default 1,
  check (location is null or char_length(location) <= 240),
  check (participants_text is null or char_length(participants_text) <= 4000),
  check (note is null or char_length(note) <= 6000)
);

create index if not exists justice_appointments_state_start_idx on public.justice_appointments (state, starts_at);
create index if not exists justice_appointments_case_idx on public.justice_appointments (case_id, starts_at);

create table if not exists public.justice_knowledge (
  id uuid primary key default gen_random_uuid(),
  article_kind text not null default 'guide' check (article_kind in ('law', 'guide', 'template')),
  title text not null check (char_length(trim(title)) between 2 and 180),
  category text,
  body text not null check (char_length(trim(body)) between 2 and 16000),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1,
  check (category is null or char_length(category) <= 100)
);

create index if not exists justice_knowledge_kind_updated_idx on public.justice_knowledge (article_kind, updated_at desc);

alter table public.justice_cases enable row level security;
alter table public.justice_case_people enable row level security;
alter table public.justice_case_timeline enable row level security;
alter table public.justice_appointments enable row level security;
alter table public.justice_knowledge enable row level security;

revoke all on public.justice_cases from public, anon, authenticated;
revoke all on public.justice_case_people from public, anon, authenticated;
revoke all on public.justice_case_timeline from public, anon, authenticated;
revoke all on public.justice_appointments from public, anon, authenticated;
revoke all on public.justice_knowledge from public, anon, authenticated;

create or replace function public.justice_get_my_context()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'can_open', private.has_service_permission_for(auth.uid(), 'justice', 'justice.access'),
    'can_view_cases', private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.view'),
    'can_manage_cases', private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.manage'),
    'can_search_people', private.has_service_permission_for(auth.uid(), 'justice', 'justice.people.search'),
    'can_view_appointments', private.has_service_permission_for(auth.uid(), 'justice', 'justice.appointments.view'),
    'can_manage_appointments', private.has_service_permission_for(auth.uid(), 'justice', 'justice.appointments.manage'),
    'can_view_knowledge', private.has_service_permission_for(auth.uid(), 'justice', 'justice.knowledge.view'),
    'can_manage_knowledge', private.has_service_permission_for(auth.uid(), 'justice', 'justice.knowledge.manage')
  );
$$;

create or replace function public.justice_search_people(search_text text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.people.search') then
    raise exception 'not_allowed';
  end if;
  if needle is null or char_length(needle) < 2 then
    return '[]'::jsonb;
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'profile_id', p.id,
      'display_name', p.display_name,
      'nexus_id', p.nexus_id,
      'date_of_birth', p.date_of_birth
    ) order by p.display_name)
    from (
      select p.*
      from public.profiles p
      where p.account_status = 'active'
        and (p.display_name ilike '%' || needle || '%' or coalesce(p.nexus_id, '') ilike '%' || needle || '%')
      order by p.display_name
      limit 30
    ) p
  ), '[]'::jsonb);
end;
$$;

create or replace function public.justice_list_staff()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.view') then
    raise exception 'not_allowed';
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'profile_id', x.profile_id,
      'display_name', x.display_name,
      'role_title', x.role_title
    ) order by x.display_name)
    from (
      select distinct p.id as profile_id, p.display_name, coalesce(om.role_title, r.name) as role_title
      from public.organization_members om
      join public.organizations o on o.id = om.organization_id
      join public.profiles p on p.id = om.user_id
      left join public.organization_roles r on r.id = om.role_id
      where o.service_module = 'justice'
        and om.is_active is true
        and p.account_status = 'active'
    ) x
  ), '[]'::jsonb);
end;
$$;

create or replace function public.justice_list_cases(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.view') then
    raise exception 'not_allowed';
  end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', c.id,
      'case_number', c.case_number,
      'title', c.title,
      'summary', c.summary,
      'result_text', c.result_text,
      'state', c.state,
      'responsible_profile', c.responsible_profile,
      'responsible_name', responsible.display_name,
      'created_by_name', creator.display_name,
      'created_at', c.created_at,
      'updated_at', c.updated_at,
      'row_version', c.row_version,
      'people', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', cp.id,
          'profile_id', cp.profile_id,
          'display_name', pp.display_name,
          'nexus_id', pp.nexus_id,
          'role_label', cp.role_label
        ) order by cp.added_at)
        from public.justice_case_people cp
        join public.profiles pp on pp.id = cp.profile_id
        where cp.case_id = c.id and cp.is_active is true
      ), '[]'::jsonb),
      'timeline', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', t.id,
          'entry_type', t.entry_type,
          'body', t.body,
          'author_name', author.display_name,
          'created_at', t.created_at
        ) order by t.created_at desc)
        from public.justice_case_timeline t
        left join public.profiles author on author.id = t.created_by
        where t.case_id = c.id
      ), '[]'::jsonb)
    ) order by (c.state = 'open') desc, c.updated_at desc)
    from public.justice_cases c
    left join public.profiles responsible on responsible.id = c.responsible_profile
    left join public.profiles creator on creator.id = c.created_by
    where needle is null
       or c.case_number ilike '%' || needle || '%'
       or c.title ilike '%' || needle || '%'
       or coalesce(c.summary, '') ilike '%' || needle || '%'
       or coalesce(c.result_text, '') ilike '%' || needle || '%'
       or coalesce(responsible.display_name, '') ilike '%' || needle || '%'
       or exists (
         select 1 from public.justice_case_people cp2
         join public.profiles p2 on p2.id = cp2.profile_id
         where cp2.case_id = c.id and cp2.is_active is true
           and (p2.display_name ilike '%' || needle || '%' or coalesce(p2.nexus_id, '') ilike '%' || needle || '%')
       )
  ), '[]'::jsonb);
end;
$$;

create or replace function public.justice_create_case(
  case_title text,
  case_summary text default null,
  case_result text default null,
  responsible_profile uuid default null,
  participants jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
  new_number text;
  chosen_responsible uuid := coalesce(responsible_profile, auth.uid());
  participant jsonb;
  participant_profile uuid;
  participant_role text;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.manage') then
    raise exception 'not_allowed';
  end if;
  if char_length(coalesce(trim(case_title), '')) < 2 then raise exception 'invalid_input'; end if;

  if not exists (
    select 1 from public.organization_members om
    join public.organizations o on o.id = om.organization_id
    where o.service_module = 'justice' and om.user_id = chosen_responsible and om.is_active is true
  ) then
    raise exception 'invalid_responsible';
  end if;

  insert into public.justice_cases (title, summary, result_text, responsible_profile, created_by)
  values (trim(case_title), nullif(trim(case_summary), ''), nullif(trim(case_result), ''), chosen_responsible, auth.uid())
  returning id, case_number into new_id, new_number;

  if participants is not null and jsonb_typeof(participants) = 'array' then
    for participant in select value from jsonb_array_elements(participants)
    loop
      begin participant_profile := nullif(participant->>'profile_id', '')::uuid; exception when others then participant_profile := null; end;
      participant_role := coalesce(nullif(trim(participant->>'role_label'), ''), 'Beteiligter');
      if participant_profile is not null and exists (select 1 from public.profiles p where p.id = participant_profile and p.account_status = 'active') then
        insert into public.justice_case_people (case_id, profile_id, role_label, is_active, added_by, added_at, removed_by, removed_at)
        values (new_id, participant_profile, participant_role, true, auth.uid(), now(), null, null)
        on conflict (case_id, profile_id, role_label) do update
        set is_active = true, added_by = excluded.added_by, added_at = now(), removed_by = null, removed_at = null;
      end if;
    end loop;
  end if;

  insert into public.justice_case_timeline (case_id, entry_type, body, created_by)
  values (new_id, 'created', 'Fall angelegt.', auth.uid());

  return jsonb_build_object('id', new_id, 'case_number', new_number);
end;
$$;

create or replace function public.justice_update_case(
  target_case uuid,
  case_title text,
  case_summary text default null,
  case_result text default null,
  responsible_profile uuid default null,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_row public.justice_cases;
  chosen_responsible uuid := coalesce(responsible_profile, auth.uid());
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.manage') then
    raise exception 'not_allowed';
  end if;
  if char_length(coalesce(trim(case_title), '')) < 2 then raise exception 'invalid_input'; end if;
  if not exists (
    select 1 from public.organization_members om
    join public.organizations o on o.id = om.organization_id
    where o.service_module = 'justice' and om.user_id = chosen_responsible and om.is_active is true
  ) then raise exception 'invalid_responsible'; end if;

  update public.justice_cases
  set title = trim(justice_update_case.case_title),
      summary = nullif(trim(justice_update_case.case_summary), ''),
      result_text = nullif(trim(justice_update_case.case_result), ''),
      responsible_profile = chosen_responsible,
      updated_at = now(),
      row_version = row_version + 1
  where id = target_case
    and state = 'open'
    and (expected_row_version is null or row_version = expected_row_version)
  returning * into updated_row;

  if updated_row.id is null then raise exception 'conflict_or_closed'; end if;
  insert into public.justice_case_timeline (case_id, entry_type, body, created_by)
  values (target_case, 'note', 'Fall aktualisiert.', auth.uid());
  return jsonb_build_object('id', updated_row.id, 'row_version', updated_row.row_version);
end;
$$;

create or replace function public.justice_set_case_state(
  target_case uuid,
  next_state text,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_state text;
  updated_version bigint;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.manage') then raise exception 'not_allowed'; end if;
  if next_state not in ('open', 'done') then raise exception 'invalid_state'; end if;

  select state into previous_state from public.justice_cases where id = target_case;
  if previous_state is null then raise exception 'not_found'; end if;

  update public.justice_cases
  set state = next_state,
      completed_at = case when next_state = 'done' then now() else null end,
      updated_at = now(),
      row_version = row_version + 1
  where id = target_case and (expected_row_version is null or row_version = expected_row_version)
  returning row_version into updated_version;
  if updated_version is null then raise exception 'conflict'; end if;

  if previous_state is distinct from next_state then
    insert into public.justice_case_timeline (case_id, entry_type, body, created_by)
    values (target_case, 'status', case when next_state = 'done' then 'Fall abgeschlossen.' else 'Fall wieder geöffnet.' end, auth.uid());
  end if;
  return jsonb_build_object('id', target_case, 'row_version', updated_version, 'state', next_state);
end;
$$;

create or replace function public.justice_add_case_note(target_case uuid, note_text text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare new_id uuid;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.manage') then raise exception 'not_allowed'; end if;
  if char_length(coalesce(trim(note_text), '')) < 2 then raise exception 'invalid_input'; end if;
  if not exists (select 1 from public.justice_cases c where c.id = target_case and c.state = 'open') then raise exception 'closed_or_missing'; end if;
  insert into public.justice_case_timeline (case_id, entry_type, body, created_by)
  values (target_case, 'note', trim(note_text), auth.uid()) returning id into new_id;
  update public.justice_cases set updated_at = now(), row_version = row_version + 1 where id = target_case;
  return new_id;
end;
$$;

create or replace function public.justice_add_case_person(target_case uuid, target_profile uuid, role_label text default 'Beteiligter')
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare new_id uuid; clean_role text := coalesce(nullif(trim(role_label), ''), 'Beteiligter');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.manage') then raise exception 'not_allowed'; end if;
  if not exists (select 1 from public.justice_cases c where c.id = target_case and c.state = 'open') then raise exception 'closed_or_missing'; end if;
  if not exists (select 1 from public.profiles p where p.id = target_profile and p.account_status = 'active') then raise exception 'invalid_profile'; end if;

  insert into public.justice_case_people (case_id, profile_id, role_label, is_active, added_by, added_at, removed_by, removed_at)
  values (target_case, target_profile, clean_role, true, auth.uid(), now(), null, null)
  on conflict (case_id, profile_id, role_label) do update
  set is_active = true, added_by = excluded.added_by, added_at = now(), removed_by = null, removed_at = null
  returning id into new_id;
  update public.justice_cases set updated_at = now(), row_version = row_version + 1 where id = target_case;
  return new_id;
end;
$$;

create or replace function public.justice_remove_case_person(target_case uuid, target_profile uuid, role_label text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare affected integer;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.cases.manage') then raise exception 'not_allowed'; end if;
  if not exists (select 1 from public.justice_cases c where c.id = target_case and c.state = 'open') then raise exception 'closed_or_missing'; end if;
  update public.justice_case_people
  set is_active = false, removed_by = auth.uid(), removed_at = now()
  where case_id = target_case and profile_id = target_profile and role_label = trim(justice_remove_case_person.role_label) and is_active is true;
  get diagnostics affected = row_count;
  if affected > 0 then update public.justice_cases set updated_at = now(), row_version = row_version + 1 where id = target_case; end if;
  return affected > 0;
end;
$$;

create or replace function public.justice_get_person_overview(target_profile uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare person jsonb;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.people.search') then raise exception 'not_allowed'; end if;

  select jsonb_build_object(
    'profile_id', p.id,
    'display_name', p.display_name,
    'nexus_id', p.nexus_id,
    'date_of_birth', p.date_of_birth,
    'cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id,
        'case_number', c.case_number,
        'title', c.title,
        'state', c.state,
        'role_label', cp.role_label,
        'responsible_name', responsible.display_name,
        'updated_at', c.updated_at
      ) order by (c.state = 'open') desc, c.updated_at desc)
      from public.justice_case_people cp
      join public.justice_cases c on c.id = cp.case_id
      left join public.profiles responsible on responsible.id = c.responsible_profile
      where cp.profile_id = p.id and cp.is_active is true
    ), '[]'::jsonb)
  ) into person
  from public.profiles p
  where p.id = target_profile and p.account_status = 'active';

  if person is null then raise exception 'not_found'; end if;
  return person;
end;
$$;

create or replace function public.justice_list_appointments(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.appointments.view') then raise exception 'not_allowed'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', a.id,
      'case_id', a.case_id,
      'case_number', c.case_number,
      'appointment_type', a.appointment_type,
      'title', a.title,
      'starts_at', a.starts_at,
      'location', a.location,
      'participants_text', a.participants_text,
      'note', a.note,
      'state', a.state,
      'updated_by_name', updater.display_name,
      'updated_at', a.updated_at,
      'row_version', a.row_version
    ) order by (a.state = 'scheduled') desc, case when a.state = 'scheduled' then a.starts_at end asc, a.updated_at desc)
    from public.justice_appointments a
    left join public.justice_cases c on c.id = a.case_id
    left join public.profiles updater on updater.id = a.updated_by
    where needle is null
       or a.title ilike '%' || needle || '%'
       or a.appointment_type ilike '%' || needle || '%'
       or coalesce(a.location, '') ilike '%' || needle || '%'
       or coalesce(a.participants_text, '') ilike '%' || needle || '%'
       or coalesce(c.case_number, '') ilike '%' || needle || '%'
  ), '[]'::jsonb);
end;
$$;

create or replace function public.justice_save_appointment(
  target_appointment uuid default null,
  target_case uuid default null,
  appointment_type text default null,
  appointment_title text default null,
  appointment_starts_at timestamptz default null,
  appointment_location text default null,
  appointment_participants text default null,
  appointment_note text default null,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare saved public.justice_appointments;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.appointments.manage') then raise exception 'not_allowed'; end if;
  if char_length(coalesce(trim(appointment_type), '')) < 2 or char_length(coalesce(trim(appointment_title), '')) < 2 or appointment_starts_at is null then raise exception 'invalid_input'; end if;
  if target_case is not null and not exists (select 1 from public.justice_cases c where c.id = target_case) then raise exception 'invalid_case'; end if;

  if target_appointment is null then
    insert into public.justice_appointments (case_id, appointment_type, title, starts_at, location, participants_text, note, created_by, updated_by)
    values (target_case, trim(appointment_type), trim(appointment_title), appointment_starts_at, nullif(trim(appointment_location), ''), nullif(trim(appointment_participants), ''), nullif(trim(appointment_note), ''), auth.uid(), auth.uid())
    returning * into saved;
  else
    update public.justice_appointments
    set case_id = target_case,
        appointment_type = trim(justice_save_appointment.appointment_type),
        title = trim(justice_save_appointment.appointment_title),
        starts_at = justice_save_appointment.appointment_starts_at,
        location = nullif(trim(justice_save_appointment.appointment_location), ''),
        participants_text = nullif(trim(justice_save_appointment.appointment_participants), ''),
        note = nullif(trim(justice_save_appointment.appointment_note), ''),
        updated_by = auth.uid(), updated_at = now(), row_version = row_version + 1
    where id = target_appointment and state = 'scheduled'
      and (expected_row_version is null or row_version = expected_row_version)
    returning * into saved;
    if saved.id is null then raise exception 'conflict_or_closed'; end if;
  end if;
  return jsonb_build_object('id', saved.id, 'row_version', saved.row_version);
end;
$$;

create or replace function public.justice_set_appointment_state(
  target_appointment uuid,
  next_state text,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare updated_version bigint;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.appointments.manage') then raise exception 'not_allowed'; end if;
  if next_state not in ('scheduled', 'done') then raise exception 'invalid_state'; end if;
  update public.justice_appointments
  set state = next_state,
      completed_at = case when next_state = 'done' then now() else null end,
      updated_by = auth.uid(), updated_at = now(), row_version = row_version + 1
  where id = target_appointment and (expected_row_version is null or row_version = expected_row_version)
  returning row_version into updated_version;
  if updated_version is null then raise exception 'conflict_or_missing'; end if;
  return jsonb_build_object('id', target_appointment, 'row_version', updated_version, 'state', next_state);
end;
$$;

create or replace function public.justice_list_knowledge(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.knowledge.view') then raise exception 'not_allowed'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', k.id,
      'article_kind', k.article_kind,
      'title', k.title,
      'category', k.category,
      'body', k.body,
      'updated_by_name', updater.display_name,
      'updated_at', k.updated_at,
      'row_version', k.row_version
    ) order by k.article_kind, k.title)
    from public.justice_knowledge k
    left join public.profiles updater on updater.id = k.updated_by
    where needle is null
       or k.title ilike '%' || needle || '%'
       or coalesce(k.category, '') ilike '%' || needle || '%'
       or k.body ilike '%' || needle || '%'
  ), '[]'::jsonb);
end;
$$;

create or replace function public.justice_save_knowledge(
  target_article uuid default null,
  article_kind text default 'guide',
  article_title text default null,
  article_category text default null,
  article_body text default null,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare saved public.justice_knowledge;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'justice', 'justice.knowledge.manage') then raise exception 'not_allowed'; end if;
  if article_kind not in ('law', 'guide', 'template') or char_length(coalesce(trim(article_title), '')) < 2 or char_length(coalesce(trim(article_body), '')) < 2 then raise exception 'invalid_input'; end if;

  if target_article is null then
    insert into public.justice_knowledge (article_kind, title, category, body, created_by, updated_by)
    values (article_kind, trim(article_title), nullif(trim(article_category), ''), trim(article_body), auth.uid(), auth.uid())
    returning * into saved;
  else
    update public.justice_knowledge
    set article_kind = justice_save_knowledge.article_kind,
        title = trim(justice_save_knowledge.article_title),
        category = nullif(trim(justice_save_knowledge.article_category), ''),
        body = trim(justice_save_knowledge.article_body),
        updated_by = auth.uid(), updated_at = now(), row_version = row_version + 1
    where id = target_article and (expected_row_version is null or row_version = expected_row_version)
    returning * into saved;
    if saved.id is null then raise exception 'conflict_or_missing'; end if;
  end if;
  return jsonb_build_object('id', saved.id, 'row_version', saved.row_version);
end;
$$;

revoke all on function public.justice_get_my_context() from public, anon;
revoke all on function public.justice_search_people(text) from public, anon;
revoke all on function public.justice_list_staff() from public, anon;
revoke all on function public.justice_list_cases(text) from public, anon;
revoke all on function public.justice_create_case(text,text,text,uuid,jsonb) from public, anon;
revoke all on function public.justice_update_case(uuid,text,text,text,uuid,bigint) from public, anon;
revoke all on function public.justice_set_case_state(uuid,text,bigint) from public, anon;
revoke all on function public.justice_add_case_note(uuid,text) from public, anon;
revoke all on function public.justice_add_case_person(uuid,uuid,text) from public, anon;
revoke all on function public.justice_remove_case_person(uuid,uuid,text) from public, anon;
revoke all on function public.justice_get_person_overview(uuid) from public, anon;
revoke all on function public.justice_list_appointments(text) from public, anon;
revoke all on function public.justice_save_appointment(uuid,uuid,text,text,timestamptz,text,text,text,bigint) from public, anon;
revoke all on function public.justice_set_appointment_state(uuid,text,bigint) from public, anon;
revoke all on function public.justice_list_knowledge(text) from public, anon;
revoke all on function public.justice_save_knowledge(uuid,text,text,text,text,bigint) from public, anon;

grant execute on function public.justice_get_my_context() to authenticated;
grant execute on function public.justice_search_people(text) to authenticated;
grant execute on function public.justice_list_staff() to authenticated;
grant execute on function public.justice_list_cases(text) to authenticated;
grant execute on function public.justice_create_case(text,text,text,uuid,jsonb) to authenticated;
grant execute on function public.justice_update_case(uuid,text,text,text,uuid,bigint) to authenticated;
grant execute on function public.justice_set_case_state(uuid,text,bigint) to authenticated;
grant execute on function public.justice_add_case_note(uuid,text) to authenticated;
grant execute on function public.justice_add_case_person(uuid,uuid,text) to authenticated;
grant execute on function public.justice_remove_case_person(uuid,uuid,text) to authenticated;
grant execute on function public.justice_get_person_overview(uuid) to authenticated;
grant execute on function public.justice_list_appointments(text) to authenticated;
grant execute on function public.justice_save_appointment(uuid,uuid,text,text,timestamptz,text,text,text,bigint) to authenticated;
grant execute on function public.justice_set_appointment_state(uuid,text,bigint) to authenticated;
grant execute on function public.justice_list_knowledge(text) to authenticated;
grant execute on function public.justice_save_knowledge(uuid,text,text,text,text,bigint) to authenticated;
