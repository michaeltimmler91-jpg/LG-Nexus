-- LG Nexus V1
-- Phase 5C: manage case participants and lightweight evidence records.

alter table public.police_case_people
  add column if not exists is_active boolean not null default true,
  add column if not exists removed_at timestamptz,
  add column if not exists removed_by uuid references public.profiles(id) on delete set null;

create index if not exists police_case_people_active_case_idx
  on public.police_case_people(case_id, is_active);
create index if not exists police_case_people_removed_by_idx
  on public.police_case_people(removed_by);

create sequence if not exists public.police_evidence_number_seq start 1;
revoke all on sequence public.police_evidence_number_seq from anon, authenticated;

create table if not exists public.police_case_evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.police_cases(id) on delete cascade,
  evidence_number text not null unique default ('EV-' || lpad(nextval('public.police_evidence_number_seq')::text, 6, '0')),
  evidence_type text not null,
  title text not null,
  description text,
  reference_text text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  is_active boolean not null default true,
  removed_at timestamptz,
  removed_by uuid references public.profiles(id) on delete set null,
  constraint police_case_evidence_type_check check (evidence_type in ('photo', 'document', 'object', 'statement', 'digital', 'other'))
);

create index if not exists police_case_evidence_case_idx
  on public.police_case_evidence(case_id, is_active, created_at desc);
create index if not exists police_case_evidence_created_by_idx
  on public.police_case_evidence(created_by);
create index if not exists police_case_evidence_removed_by_idx
  on public.police_case_evidence(removed_by);

alter table public.police_case_evidence enable row level security;
revoke all on table public.police_case_evidence from anon, authenticated;

alter table public.police_case_timeline
  drop constraint if exists police_case_timeline_entry_type_check;
alter table public.police_case_timeline
  add constraint police_case_timeline_entry_type_check
  check (entry_type in ('created', 'note', 'status', 'person_added', 'person_removed', 'evidence_added', 'evidence_removed'));

create or replace function public.police_list_case_people(target_case_number text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view') then
    raise exception 'missing permission: police.cases.view';
  end if;

  select c.id into target_id
  from public.police_cases c
  where c.case_number = trim(coalesce(target_case_number, ''));

  if target_id is null then raise exception 'case not found'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'profile_id', cp.profile_id,
      'display_name', p.display_name,
      'nexus_id', p.nexus_id,
      'person_role', cp.person_role,
      'note', cp.note,
      'added_at', cp.created_at
    ) order by lower(p.display_name), cp.created_at)
    from public.police_case_people cp
    join public.profiles p on p.id = cp.profile_id
    where cp.case_id = target_id and cp.is_active = true
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_case_people(text) from public, anon;
grant execute on function public.police_list_case_people(text) to authenticated;

create or replace function public.police_add_case_person(
  target_case_number text,
  target_profile uuid,
  target_person_role text,
  person_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_case public.police_cases%rowtype;
  person_name text;
  clean_note text := nullif(trim(coalesce(person_note, '')), '');
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;
  if target_person_role not in ('accused', 'victim', 'witness', 'other') then
    raise exception 'invalid person role';
  end if;
  if clean_note is not null and char_length(clean_note) > 1000 then raise exception 'note too long'; end if;

  select * into target_case
  from public.police_cases c
  where c.case_number = trim(coalesce(target_case_number, ''))
  for update;

  if target_case.id is null then raise exception 'case not found'; end if;
  if target_case.status in ('completed', 'archived') then raise exception 'case is closed'; end if;

  select p.display_name into person_name
  from public.profiles p
  where p.id = target_profile and p.account_status = 'active';
  if person_name is null then raise exception 'person not found'; end if;

  insert into public.police_case_people (case_id, profile_id, person_role, note, created_by, is_active)
  values (target_case.id, target_profile, target_person_role, clean_note, auth.uid(), true)
  on conflict (case_id, profile_id, person_role) do update
    set note = excluded.note,
        created_by = auth.uid(),
        created_at = now(),
        is_active = true,
        removed_at = null,
        removed_by = null;

  insert into public.police_case_timeline (case_id, entry_type, body, created_by)
  values (target_case.id, 'person_added', person_name || ' wurde als ' || target_person_role || ' hinzugefügt.', auth.uid());

  update public.police_cases set updated_at = now() where id = target_case.id;
  return jsonb_build_object('ok', true);
end;
$$;
revoke all on function public.police_add_case_person(text, uuid, text, text) from public, anon;
grant execute on function public.police_add_case_person(text, uuid, text, text) to authenticated;

create or replace function public.police_remove_case_person(
  target_case_number text,
  target_profile uuid,
  target_person_role text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_case public.police_cases%rowtype;
  person_name text;
  affected integer;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;

  select * into target_case
  from public.police_cases c
  where c.case_number = trim(coalesce(target_case_number, ''))
  for update;

  if target_case.id is null then raise exception 'case not found'; end if;
  if target_case.status in ('completed', 'archived') then raise exception 'case is closed'; end if;

  select p.display_name into person_name from public.profiles p where p.id = target_profile;

  update public.police_case_people
  set is_active = false, removed_at = now(), removed_by = auth.uid()
  where case_id = target_case.id
    and profile_id = target_profile
    and person_role = target_person_role
    and is_active = true;
  get diagnostics affected = row_count;

  if affected = 0 then raise exception 'case person not found'; end if;

  insert into public.police_case_timeline (case_id, entry_type, body, created_by)
  values (target_case.id, 'person_removed', coalesce(person_name, 'Person') || ' wurde als ' || target_person_role || ' entfernt.', auth.uid());

  update public.police_cases set updated_at = now() where id = target_case.id;
  return jsonb_build_object('ok', true);
end;
$$;
revoke all on function public.police_remove_case_person(text, uuid, text) from public, anon;
grant execute on function public.police_remove_case_person(text, uuid, text) to authenticated;

create or replace function public.police_list_case_evidence(target_case_number text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view') then
    raise exception 'missing permission: police.cases.view';
  end if;

  select c.id into target_id
  from public.police_cases c
  where c.case_number = trim(coalesce(target_case_number, ''));
  if target_id is null then raise exception 'case not found'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', e.id,
      'evidence_number', e.evidence_number,
      'evidence_type', e.evidence_type,
      'title', e.title,
      'description', e.description,
      'reference_text', e.reference_text,
      'author_name', p.display_name,
      'created_at', e.created_at
    ) order by e.created_at desc, e.id desc)
    from public.police_case_evidence e
    left join public.profiles p on p.id = e.created_by
    where e.case_id = target_id and e.is_active = true
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_case_evidence(text) from public, anon;
grant execute on function public.police_list_case_evidence(text) to authenticated;

create or replace function public.police_add_case_evidence(
  target_case_number text,
  evidence_type text,
  evidence_title text,
  evidence_description text default null,
  evidence_reference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_case public.police_cases%rowtype;
  clean_title text := trim(coalesce(evidence_title, ''));
  clean_description text := nullif(trim(coalesce(evidence_description, '')), '');
  clean_reference text := nullif(trim(coalesce(evidence_reference, '')), '');
  new_evidence public.police_case_evidence%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;
  if evidence_type not in ('photo', 'document', 'object', 'statement', 'digital', 'other') then raise exception 'invalid evidence type'; end if;
  if char_length(clean_title) < 2 then raise exception 'evidence title required'; end if;
  if char_length(clean_title) > 160 then raise exception 'evidence title too long'; end if;
  if clean_description is not null and char_length(clean_description) > 4000 then raise exception 'description too long'; end if;
  if clean_reference is not null and char_length(clean_reference) > 1000 then raise exception 'reference too long'; end if;

  select * into target_case
  from public.police_cases c
  where c.case_number = trim(coalesce(target_case_number, ''))
  for update;

  if target_case.id is null then raise exception 'case not found'; end if;
  if target_case.status in ('completed', 'archived') then raise exception 'case is closed'; end if;

  insert into public.police_case_evidence (case_id, evidence_type, title, description, reference_text, created_by)
  values (target_case.id, evidence_type, clean_title, clean_description, clean_reference, auth.uid())
  returning * into new_evidence;

  insert into public.police_case_timeline (case_id, entry_type, body, created_by)
  values (target_case.id, 'evidence_added', new_evidence.evidence_number || ' · ' || new_evidence.title || ' wurde hinzugefügt.', auth.uid());

  update public.police_cases set updated_at = now() where id = target_case.id;
  return jsonb_build_object('id', new_evidence.id, 'evidence_number', new_evidence.evidence_number);
end;
$$;
revoke all on function public.police_add_case_evidence(text, text, text, text, text) from public, anon;
grant execute on function public.police_add_case_evidence(text, text, text, text, text) to authenticated;

create or replace function public.police_remove_case_evidence(target_case_number text, target_evidence uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_case public.police_cases%rowtype;
  evidence_label text;
  affected integer;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;

  select * into target_case
  from public.police_cases c
  where c.case_number = trim(coalesce(target_case_number, ''))
  for update;

  if target_case.id is null then raise exception 'case not found'; end if;
  if target_case.status in ('completed', 'archived') then raise exception 'case is closed'; end if;

  select e.evidence_number || ' · ' || e.title into evidence_label
  from public.police_case_evidence e
  where e.id = target_evidence and e.case_id = target_case.id and e.is_active = true;

  update public.police_case_evidence
  set is_active = false, removed_at = now(), removed_by = auth.uid()
  where id = target_evidence and case_id = target_case.id and is_active = true;
  get diagnostics affected = row_count;
  if affected = 0 then raise exception 'evidence not found'; end if;

  insert into public.police_case_timeline (case_id, entry_type, body, created_by)
  values (target_case.id, 'evidence_removed', coalesce(evidence_label, 'Beweismittel') || ' wurde entfernt.', auth.uid());

  update public.police_cases set updated_at = now() where id = target_case.id;
  return jsonb_build_object('ok', true);
end;
$$;
revoke all on function public.police_remove_case_evidence(text, uuid) from public, anon;
grant execute on function public.police_remove_case_evidence(text, uuid) to authenticated;

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
        where cp.case_id = c.id and cp.is_active = true
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
         where cp2.case_id = c.id and cp2.is_active = true
           and (pp2.display_name ilike '%' || needle || '%' or coalesce(pp2.nexus_id, '') ilike '%' || needle || '%')
       )
    limit 100
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_cases(text) from public, anon;
grant execute on function public.police_list_cases(text) to authenticated;
