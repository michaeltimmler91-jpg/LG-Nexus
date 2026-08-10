-- LG Nexus V1
-- Phase 4F: allow authorized Medical staff to correct follow-up dates/checkpoints
-- and expose who confirmed an attended follow-up.

create table if not exists public.medical_followup_edit_history (
  id bigint generated always as identity primary key,
  treatment_id uuid not null references public.medical_treatments(id) on delete restrict,
  previous_followup_mode text,
  previous_followup_from date,
  previous_followup_to date,
  previous_followup_checkpoints text[] not null default '{}'::text[],
  changed_by uuid references public.profiles(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index if not exists medical_followup_edit_history_treatment_idx
  on public.medical_followup_edit_history(treatment_id, changed_at desc);

create index if not exists medical_followup_edit_history_changed_by_idx
  on public.medical_followup_edit_history(changed_by);

alter table public.medical_followup_edit_history enable row level security;
revoke all on table public.medical_followup_edit_history from anon, authenticated;

create or replace function public.medical_simple_get_treatment_for_edit(target_treatment_number text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  treatment_row public.medical_treatments%rowtype;
  actor_name text;
  template_name text;
  attended_by_name text;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.edit') then
    raise exception 'missing permission: medical.treatments.edit';
  end if;

  select * into treatment_row
  from public.medical_treatments
  where treatment_number = trim(coalesce(target_treatment_number, ''));

  if treatment_row.id is null then raise exception 'treatment not found'; end if;

  select display_name into actor_name
  from public.profiles
  where id = coalesce(treatment_row.completed_by, treatment_row.created_by, treatment_row.responsible_profile_id);

  select name into template_name
  from public.medical_treatment_templates
  where id = treatment_row.template_id;

  select display_name into attended_by_name
  from public.profiles
  where id = treatment_row.followup_attended_by;

  return jsonb_build_object(
    'id', treatment_row.id,
    'treatment_number', treatment_row.treatment_number,
    'performed_text', coalesce(treatment_row.performed_text, treatment_row.summary, 'Behandlung dokumentiert.'),
    'treated_by_name', actor_name,
    'template_name', template_name,
    'created_at', treatment_row.created_at,
    'followup_required', treatment_row.followup_required,
    'followup_mode', treatment_row.followup_mode,
    'followup_from', treatment_row.followup_from,
    'followup_to', treatment_row.followup_to,
    'followup_checkpoints', treatment_row.followup_checkpoints,
    'followup_attended_at', treatment_row.followup_attended_at,
    'followup_attended_by_name', attended_by_name,
    'row_version', treatment_row.row_version
  );
end;
$$;

revoke all on function public.medical_simple_get_treatment_for_edit(text) from public, anon;
grant execute on function public.medical_simple_get_treatment_for_edit(text) to authenticated;

create or replace function public.medical_simple_update_followup(
  target_treatment uuid,
  next_followup_mode text,
  next_followup_from date,
  next_followup_to date,
  next_followup_checkpoints text[],
  expected_row_version bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_row public.medical_treatments%rowtype;
  clean_checks text[] := array(
    select trim(x)
    from unnest(coalesce(next_followup_checkpoints, '{}'::text[])) x
    where trim(x) <> ''
  );
  normalized_to date;
  new_version bigint;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.edit') then
    raise exception 'missing permission: medical.treatments.edit';
  end if;

  if next_followup_mode not in ('exact', 'range') then raise exception 'follow-up mode required'; end if;
  if next_followup_from is null then raise exception 'follow-up date required'; end if;
  if next_followup_mode = 'range' and next_followup_to is null then raise exception 'follow-up end date required'; end if;
  if next_followup_mode = 'range' and next_followup_to < next_followup_from then raise exception 'invalid follow-up range'; end if;
  if coalesce(array_length(clean_checks, 1), 0) = 0 then raise exception 'follow-up checkpoints required'; end if;

  normalized_to := case when next_followup_mode = 'exact' then next_followup_from else next_followup_to end;

  select * into current_row
  from public.medical_treatments
  where id = target_treatment
  for update;

  if not found then raise exception 'treatment not found'; end if;
  if not current_row.followup_required then raise exception 'treatment has no follow-up'; end if;
  if current_row.row_version <> expected_row_version then
    raise exception 'conflict: follow-up changed since it was opened';
  end if;

  insert into public.medical_followup_edit_history (
    treatment_id,
    previous_followup_mode,
    previous_followup_from,
    previous_followup_to,
    previous_followup_checkpoints,
    changed_by
  ) values (
    current_row.id,
    current_row.followup_mode,
    current_row.followup_from,
    current_row.followup_to,
    current_row.followup_checkpoints,
    auth.uid()
  );

  update public.medical_treatments
  set followup_mode = next_followup_mode,
      followup_from = next_followup_from,
      followup_to = normalized_to,
      followup_checkpoints = clean_checks
  where id = current_row.id
    and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: follow-up changed since it was opened'; end if;
  return new_version;
end;
$$;

revoke all on function public.medical_simple_update_followup(uuid, text, date, date, text[], bigint) from public, anon;
grant execute on function public.medical_simple_update_followup(uuid, text, date, date, text[], bigint) to authenticated;

-- Marking attendance is intentionally lightweight: once a follow-up is still open,
-- the current server-side follow-up state is the authoritative one. The version
-- parameter remains for API compatibility with the existing frontend.
create or replace function public.medical_simple_mark_followup_attended(
  target_treatment uuid,
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
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.edit') then
    raise exception 'missing permission: medical.treatments.edit';
  end if;

  update public.medical_treatments
  set followup_attended_at = now(),
      followup_attended_by = auth.uid()
  where id = target_treatment
    and followup_required = true
    and followup_attended_at is null
  returning row_version into new_version;

  if new_version is null then raise exception 'follow-up was already completed or is no longer required'; end if;
  return new_version;
end;
$$;

revoke all on function public.medical_simple_mark_followup_attended(uuid, bigint) from public, anon;
grant execute on function public.medical_simple_mark_followup_attended(uuid, bigint) to authenticated;
