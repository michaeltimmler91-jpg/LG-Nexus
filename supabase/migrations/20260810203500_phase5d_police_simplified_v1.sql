-- LG Nexus V1
-- Phase 5D: simplified Police workflow for fast city play.

alter table public.police_cases
  add column if not exists actions_text text,
  add column if not exists evidence_text text;

create or replace function public.police_simple_list_cases(search_text text default null)
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
      'actions_text', c.actions_text,
      'evidence_text', c.evidence_text,
      'state', case when c.status in ('completed','archived') then 'done' else 'open' end,
      'lead_name', lead.display_name,
      'created_at', c.created_at,
      'updated_at', c.updated_at,
      'row_version', c.row_version,
      'people', coalesce((
        select jsonb_agg(jsonb_build_object(
          'profile_id', cp.profile_id,
          'display_name', pp.display_name,
          'nexus_id', pp.nexus_id,
          'person_role', cp.person_role
        ) order by lower(pp.display_name))
        from public.police_case_people cp
        join public.profiles pp on pp.id = cp.profile_id
        where cp.case_id = c.id and cp.is_active = true
      ), '[]'::jsonb),
      'timeline', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', t.id,
          'entry_type', t.entry_type,
          'body', t.body,
          'from_status', t.from_status,
          'to_status', t.to_status,
          'author_name', author.display_name,
          'created_at', t.created_at
        ) order by t.created_at asc)
        from public.police_case_timeline t
        left join public.profiles author on author.id = t.created_by
        where t.case_id = c.id
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
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_simple_list_cases(text) from public, anon;
grant execute on function public.police_simple_list_cases(text) to authenticated;

create or replace function public.police_simple_create_case(
  case_title text,
  case_summary text,
  case_actions text,
  case_evidence text,
  participants jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_title text := trim(coalesce(case_title, ''));
  new_case public.police_cases%rowtype;
  item jsonb;
  participant_profile uuid;
  participant_role text;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.create') then
    raise exception 'missing permission: police.cases.create';
  end if;
  if char_length(clean_title) < 3 then raise exception 'case title required'; end if;
  if jsonb_typeof(coalesce(participants, '[]'::jsonb)) <> 'array' then raise exception 'participants must be array'; end if;

  insert into public.police_cases (
    title, summary, actions_text, evidence_text, status, lead_profile_id, created_by
  ) values (
    clean_title,
    nullif(trim(coalesce(case_summary, '')), ''),
    nullif(trim(coalesce(case_actions, '')), ''),
    nullif(trim(coalesce(case_evidence, '')), ''),
    'investigation', auth.uid(), auth.uid()
  ) returning * into new_case;

  insert into public.police_case_timeline (case_id, entry_type, body, created_by)
  values (new_case.id, 'created', null, auth.uid());

  for item in select value from jsonb_array_elements(coalesce(participants, '[]'::jsonb))
  loop
    participant_profile := nullif(item->>'profile_id', '')::uuid;
    participant_role := coalesce(nullif(item->>'person_role', ''), 'other');
    if participant_profile is null then continue; end if;
    if participant_role not in ('accused','victim','witness','other') then participant_role := 'other'; end if;
    if not exists (select 1 from public.profiles p where p.id = participant_profile and p.account_status = 'active') then continue; end if;

    insert into public.police_case_people (case_id, profile_id, person_role, created_by, is_active, removed_at, removed_by, removal_reason)
    values (new_case.id, participant_profile, participant_role, auth.uid(), true, null, null, null)
    on conflict (case_id, profile_id, person_role) do update
      set is_active = true, removed_at = null, removed_by = null, removal_reason = null;
  end loop;

  return jsonb_build_object('id', new_case.id, 'case_number', new_case.case_number, 'row_version', new_case.row_version);
end;
$$;
revoke all on function public.police_simple_create_case(text, text, text, text, jsonb) from public, anon;
grant execute on function public.police_simple_create_case(text, text, text, text, jsonb) to authenticated;

create or replace function public.police_simple_update_case(
  target_case uuid,
  case_title text,
  case_summary text,
  case_actions text,
  case_evidence text,
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
  if char_length(trim(coalesce(case_title,''))) < 3 then raise exception 'case title required'; end if;

  update public.police_cases
  set title = trim(case_title),
      summary = nullif(trim(coalesce(case_summary,'')), ''),
      actions_text = nullif(trim(coalesce(case_actions,'')), ''),
      evidence_text = nullif(trim(coalesce(case_evidence,'')), '')
  where id = target_case
    and row_version = expected_row_version
    and status not in ('completed','archived')
  returning row_version into new_version;

  if new_version is null then raise exception 'case changed, closed or missing'; end if;
  return new_version;
end;
$$;
revoke all on function public.police_simple_update_case(uuid, text, text, text, text, bigint) from public, anon;
grant execute on function public.police_simple_update_case(uuid, text, text, text, text, bigint) to authenticated;

create or replace function public.police_simple_set_case_state(
  target_case uuid,
  next_state text,
  expected_row_version bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_status text;
  target_status text;
  new_version bigint;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;
  if next_state not in ('open','done') then raise exception 'invalid state'; end if;

  select status into current_status from public.police_cases where id = target_case;
  if current_status is null then raise exception 'case missing'; end if;
  target_status := case when next_state = 'done' then 'completed' else 'investigation' end;

  update public.police_cases
  set status = target_status,
      completed_at = case when target_status = 'completed' then now() else null end
  where id = target_case and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'case changed'; end if;

  if current_status is distinct from target_status then
    insert into public.police_case_timeline (case_id, entry_type, from_status, to_status, created_by)
    values (target_case, 'status', current_status, target_status, auth.uid());
  end if;

  return new_version;
end;
$$;
revoke all on function public.police_simple_set_case_state(uuid, text, bigint) from public, anon;
grant execute on function public.police_simple_set_case_state(uuid, text, bigint) to authenticated;

create or replace function public.police_simple_add_note(target_case uuid, note_text text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;
  if char_length(trim(coalesce(note_text,''))) < 2 then raise exception 'note required'; end if;
  if exists (select 1 from public.police_cases c where c.id = target_case and c.status in ('completed','archived')) then
    raise exception 'case closed';
  end if;

  insert into public.police_case_timeline (case_id, entry_type, body, created_by)
  values (target_case, 'note', trim(note_text), auth.uid()) returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.police_simple_add_note(uuid, text) from public, anon;
grant execute on function public.police_simple_add_note(uuid, text) to authenticated;

create or replace function public.police_simple_add_person(target_case uuid, target_profile uuid, target_person_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then raise exception 'missing permission'; end if;
  if target_person_role not in ('accused','victim','witness','other') then raise exception 'invalid role'; end if;
  if exists (select 1 from public.police_cases c where c.id = target_case and c.status in ('completed','archived')) then raise exception 'case closed'; end if;
  if not exists (select 1 from public.profiles p where p.id = target_profile and p.account_status = 'active') then raise exception 'person missing'; end if;

  insert into public.police_case_people (case_id, profile_id, person_role, created_by, is_active, removed_at, removed_by, removal_reason)
  values (target_case, target_profile, target_person_role, auth.uid(), true, null, null, null)
  on conflict (case_id, profile_id, person_role) do update
    set is_active = true, removed_at = null, removed_by = null, removal_reason = null;
end;
$$;
revoke all on function public.police_simple_add_person(uuid, uuid, text) from public, anon;
grant execute on function public.police_simple_add_person(uuid, uuid, text) to authenticated;

create or replace function public.police_simple_remove_person(target_case uuid, target_profile uuid, target_person_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then raise exception 'missing permission'; end if;
  if exists (select 1 from public.police_cases c where c.id = target_case and c.status in ('completed','archived')) then raise exception 'case closed'; end if;

  update public.police_case_people
  set is_active = false, removed_at = now(), removed_by = auth.uid(), removal_reason = 'Zuordnung entfernt'
  where case_id = target_case and profile_id = target_profile and person_role = target_person_role and is_active = true;
end;
$$;
revoke all on function public.police_simple_remove_person(uuid, uuid, text) from public, anon;
grant execute on function public.police_simple_remove_person(uuid, uuid, text) to authenticated;
