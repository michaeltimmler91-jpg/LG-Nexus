-- LG Nexus V1
-- Phase 5C: Police participant management and evidence records.

alter table public.police_case_people
  add column if not exists is_active boolean not null default true,
  add column if not exists removed_at timestamptz,
  add column if not exists removed_by uuid references public.profiles(id) on delete set null,
  add column if not exists removal_reason text;

create index if not exists police_case_people_active_idx
  on public.police_case_people(case_id, is_active, created_at);

create sequence if not exists public.police_evidence_number_seq start 1;
revoke all on sequence public.police_evidence_number_seq from anon, authenticated;

create table if not exists public.police_evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.police_cases(id) on delete restrict,
  evidence_number text not null unique default ('BW-' || lpad(nextval('public.police_evidence_number_seq')::text, 6, '0')),
  evidence_type text not null,
  title text not null,
  description text,
  reference_text text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  row_version bigint not null default 1,
  constraint police_evidence_type_check check (evidence_type in ('object', 'photo', 'document', 'digital', 'statement', 'other'))
);

create index if not exists police_evidence_case_idx on public.police_evidence(case_id, created_at desc);
create index if not exists police_evidence_created_by_idx on public.police_evidence(created_by);

alter table public.police_evidence enable row level security;
revoke all on table public.police_evidence from anon, authenticated;

drop trigger if exists police_evidence_increment_row_version on public.police_evidence;
create trigger police_evidence_increment_row_version
before update on public.police_evidence
for each row execute function private.increment_row_version();

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
         where cp2.case_id = c.id
           and cp2.is_active = true
           and (pp2.display_name ilike '%' || needle || '%' or coalesce(pp2.nexus_id, '') ilike '%' || needle || '%')
       )
    limit 100
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_cases(text) from public, anon;
grant execute on function public.police_list_cases(text) to authenticated;

create or replace function public.police_list_case_people(target_case_number text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_case_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view') then
    raise exception 'missing permission: police.cases.view';
  end if;

  select c.id into target_case_id
  from public.police_cases c
  where c.case_number = target_case_number;

  if target_case_id is null then raise exception 'case not found'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'profile_id', cp.profile_id,
      'display_name', p.display_name,
      'nexus_id', p.nexus_id,
      'person_role', cp.person_role,
      'note', cp.note
    ) order by lower(p.display_name), cp.created_at)
    from public.police_case_people cp
    join public.profiles p on p.id = cp.profile_id
    where cp.case_id = target_case_id and cp.is_active = true
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
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_case_id uuid;
  target_status text;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;
  if target_person_role not in ('accused', 'victim', 'witness', 'other') then raise exception 'invalid person role'; end if;

  select c.id, c.status into target_case_id, target_status
  from public.police_cases c where c.case_number = target_case_number;
  if target_case_id is null then raise exception 'case not found'; end if;
  if target_status in ('completed', 'archived') then raise exception 'case is closed'; end if;
  if not exists (select 1 from public.profiles p where p.id = target_profile and p.account_status = 'active') then
    raise exception 'person not found';
  end if;

  insert into public.police_case_people (case_id, profile_id, person_role, note, created_by, is_active)
  values (target_case_id, target_profile, target_person_role, nullif(trim(coalesce(person_note, '')), ''), auth.uid(), true)
  on conflict (case_id, profile_id, person_role) do update
    set is_active = true,
        note = excluded.note,
        removed_at = null,
        removed_by = null,
        removal_reason = null;
end;
$$;
revoke all on function public.police_add_case_person(text, uuid, text, text) from public, anon;
grant execute on function public.police_add_case_person(text, uuid, text, text) to authenticated;

create or replace function public.police_remove_case_person(
  target_case_number text,
  target_profile uuid,
  target_person_role text,
  reason text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_case_id uuid;
  target_status text;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;

  select c.id, c.status into target_case_id, target_status
  from public.police_cases c where c.case_number = target_case_number;
  if target_case_id is null then raise exception 'case not found'; end if;
  if target_status in ('completed', 'archived') then raise exception 'case is closed'; end if;

  update public.police_case_people
  set is_active = false,
      removed_at = now(),
      removed_by = auth.uid(),
      removal_reason = nullif(trim(coalesce(reason, '')), '')
  where case_id = target_case_id
    and profile_id = target_profile
    and person_role = target_person_role
    and is_active = true;
end;
$$;
revoke all on function public.police_remove_case_person(text, uuid, text, text) from public, anon;
grant execute on function public.police_remove_case_person(text, uuid, text, text) to authenticated;

create or replace function public.police_list_case_evidence(target_case_number text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_case_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view') then
    raise exception 'missing permission: police.cases.view';
  end if;

  select c.id into target_case_id from public.police_cases c where c.case_number = target_case_number;
  if target_case_id is null then raise exception 'case not found'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', e.id,
      'evidence_number', e.evidence_number,
      'evidence_type', e.evidence_type,
      'title', e.title,
      'description', e.description,
      'reference_text', e.reference_text,
      'created_by_name', p.display_name,
      'created_at', e.created_at
    ) order by e.created_at desc)
    from public.police_evidence e
    left join public.profiles p on p.id = e.created_by
    where e.case_id = target_case_id
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_case_evidence(text) from public, anon;
grant execute on function public.police_list_case_evidence(text) to authenticated;

create or replace function public.police_add_case_evidence(
  target_case_number text,
  target_evidence_type text,
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
  target_case_id uuid;
  target_status text;
  new_evidence public.police_evidence%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;
  if target_evidence_type not in ('object', 'photo', 'document', 'digital', 'statement', 'other') then
    raise exception 'invalid evidence type';
  end if;
  if char_length(trim(coalesce(evidence_title, ''))) < 2 then raise exception 'evidence title required'; end if;

  select c.id, c.status into target_case_id, target_status
  from public.police_cases c where c.case_number = target_case_number;
  if target_case_id is null then raise exception 'case not found'; end if;
  if target_status in ('completed', 'archived') then raise exception 'case is closed'; end if;

  insert into public.police_evidence (case_id, evidence_type, title, description, reference_text, created_by)
  values (
    target_case_id,
    target_evidence_type,
    trim(evidence_title),
    nullif(trim(coalesce(evidence_description, '')), ''),
    nullif(trim(coalesce(evidence_reference, '')), ''),
    auth.uid()
  )
  returning * into new_evidence;

  return jsonb_build_object('id', new_evidence.id, 'evidence_number', new_evidence.evidence_number);
end;
$$;
revoke all on function public.police_add_case_evidence(text, text, text, text, text) from public, anon;
grant execute on function public.police_add_case_evidence(text, text, text, text, text) to authenticated;
