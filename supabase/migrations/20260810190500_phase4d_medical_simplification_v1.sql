-- LG Nexus V1
-- Phase 4D: simplify Medical to one central record, treatment notes/templates and lightweight follow-up tracking.
-- Older diagnosis/allergy/medication structures are retained for history but retired from the browser workflow.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('medical.templates.manage', 'medical', 'Behandlungsvorlagen verwalten', 'Erlaubt das Erstellen und Bearbeiten von Behandlungsvorlagen.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

update public.permissions
set is_active = false
where key in (
  'medical.diagnoses.manage',
  'medical.allergies.manage',
  'medical.medications.manage'
);

alter table public.medical_records
  add column if not exists allergies text,
  add column if not exists emergency_contacts text,
  add column if not exists medical_notes text;

create table if not exists public.medical_treatment_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  treatment_text text not null,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create unique index if not exists medical_treatment_templates_name_active_idx
  on public.medical_treatment_templates (lower(name))
  where is_active = true;

create index if not exists medical_treatment_templates_created_by_idx
  on public.medical_treatment_templates(created_by);

alter table public.medical_treatment_templates enable row level security;
revoke all on table public.medical_treatment_templates from anon, authenticated;

drop trigger if exists medical_treatment_templates_set_updated_at on public.medical_treatment_templates;
create trigger medical_treatment_templates_set_updated_at
before update on public.medical_treatment_templates
for each row execute function public.set_updated_at();

drop trigger if exists medical_treatment_templates_increment_row_version on public.medical_treatment_templates;
create trigger medical_treatment_templates_increment_row_version
before update on public.medical_treatment_templates
for each row execute function private.increment_row_version();

alter table public.medical_treatments
  add column if not exists template_id uuid references public.medical_treatment_templates(id) on delete set null,
  add column if not exists performed_text text,
  add column if not exists followup_required boolean not null default false,
  add column if not exists followup_mode text,
  add column if not exists followup_from date,
  add column if not exists followup_to date,
  add column if not exists followup_checkpoints text[] not null default '{}'::text[],
  add column if not exists followup_attended_at timestamptz,
  add column if not exists followup_attended_by uuid references public.profiles(id) on delete set null;

alter table public.medical_treatments
  drop constraint if exists medical_treatments_followup_mode_check;

alter table public.medical_treatments
  add constraint medical_treatments_followup_mode_check
  check (followup_mode is null or followup_mode in ('exact', 'range'));

create index if not exists medical_treatments_template_id_idx on public.medical_treatments(template_id);
create index if not exists medical_treatments_followup_attended_by_idx on public.medical_treatments(followup_attended_by);
create index if not exists medical_treatments_pending_followup_idx
  on public.medical_treatments(followup_from, followup_to)
  where followup_required = true and followup_attended_at is null;

update public.medical_treatments
set performed_text = coalesce(nullif(trim(summary), ''), 'Behandlung dokumentiert.')
where performed_text is null;

insert into public.medical_treatment_templates (name, treatment_text)
values
  ('Allgemeine Behandlung', 'Patient untersucht und medizinisch versorgt.'),
  ('Wundversorgung', 'Wunde gereinigt, desinfiziert und versorgt.'),
  ('Verbandwechsel', 'Verband entfernt, Wunde kontrolliert und neuer Verband angelegt.'),
  ('Nachkontrolle', 'Nachkontrolle durchgeführt und Heilungsverlauf überprüft.')
on conflict do nothing;

create or replace function public.medical_simple_get_context()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'can_open', private.has_service_permission_for(auth.uid(), 'medical', 'medical.access'),
    'can_view_records', private.has_service_permission_for(auth.uid(), 'medical', 'medical.records.view'),
    'can_edit_records', private.has_service_permission_for(auth.uid(), 'medical', 'medical.records.edit'),
    'can_create_treatments', private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.create'),
    'can_edit_treatments', private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.edit'),
    'can_manage_templates', private.has_service_permission_for(auth.uid(), 'medical', 'medical.templates.manage')
  );
$$;

revoke all on function public.medical_simple_get_context() from public, anon;
grant execute on function public.medical_simple_get_context() to authenticated;

create or replace function public.medical_simple_list_templates()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not (
    private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.create')
    or private.has_service_permission_for(auth.uid(), 'medical', 'medical.templates.manage')
  ) then
    raise exception 'missing medical permission';
  end if;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', t.id,
        'name', t.name,
        'treatment_text', t.treatment_text,
        'row_version', t.row_version
      ) order by lower(t.name)
    )
    from public.medical_treatment_templates t
    where t.is_active = true
  ), '[]'::jsonb);
end;
$$;

revoke all on function public.medical_simple_list_templates() from public, anon;
grant execute on function public.medical_simple_list_templates() to authenticated;

create or replace function public.medical_simple_save_template(
  target_template uuid,
  template_name text,
  template_text text,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_name text := trim(coalesce(template_name, ''));
  clean_text text := trim(coalesce(template_text, ''));
  saved public.medical_treatment_templates%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.templates.manage') then
    raise exception 'missing permission: medical.templates.manage';
  end if;
  if char_length(clean_name) < 2 then raise exception 'template name required'; end if;
  if char_length(clean_text) < 2 then raise exception 'template text required'; end if;

  if target_template is null then
    insert into public.medical_treatment_templates (name, treatment_text, created_by)
    values (clean_name, clean_text, auth.uid())
    returning * into saved;
  else
    update public.medical_treatment_templates
    set name = clean_name,
        treatment_text = clean_text
    where id = target_template
      and is_active = true
      and row_version = expected_row_version
    returning * into saved;

    if saved.id is null then raise exception 'conflict: treatment template changed'; end if;
  end if;

  return jsonb_build_object(
    'id', saved.id,
    'name', saved.name,
    'treatment_text', saved.treatment_text,
    'row_version', saved.row_version
  );
end;
$$;

revoke all on function public.medical_simple_save_template(uuid, text, text, bigint) from public, anon;
grant execute on function public.medical_simple_save_template(uuid, text, text, bigint) to authenticated;

create or replace function public.medical_simple_get_patient(target_profile uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  patient public.profiles%rowtype;
  rec public.medical_records%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.records.view') then
    raise exception 'missing permission: medical.records.view';
  end if;

  select * into patient
  from public.profiles
  where id = target_profile and account_status = 'active';

  if not found then raise exception 'patient not found'; end if;

  insert into public.medical_records (profile_id, patient_nexus_id, patient_name)
  values (patient.id, patient.nexus_id, patient.display_name)
  on conflict (profile_id) do update
  set patient_nexus_id = excluded.patient_nexus_id,
      patient_name = excluded.patient_name
  returning * into rec;

  return jsonb_build_object(
    'profile_id', patient.id,
    'display_name', patient.display_name,
    'nexus_id', patient.nexus_id,
    'date_of_birth', patient.date_of_birth,
    'phone', case when private.can_view_profile_phone(auth.uid(), patient.id) then patient.phone else null end,
    'record', jsonb_build_object(
      'id', rec.id,
      'record_number', rec.record_number,
      'blood_group', rec.blood_group,
      'allergies', rec.allergies,
      'emergency_contacts', rec.emergency_contacts,
      'medical_notes', rec.medical_notes,
      'updated_at', rec.updated_at,
      'row_version', rec.row_version
    ),
    'treatments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'treatment_number', t.treatment_number,
          'performed_text', coalesce(t.performed_text, t.summary, 'Behandlung dokumentiert.'),
          'template_name', tpl.name,
          'treated_by_name', actor.display_name,
          'created_at', t.created_at,
          'followup_required', t.followup_required,
          'followup_mode', t.followup_mode,
          'followup_from', t.followup_from,
          'followup_to', t.followup_to,
          'followup_checkpoints', t.followup_checkpoints,
          'followup_attended_at', t.followup_attended_at,
          'followup_attended_by_name', follow_actor.display_name,
          'row_version', t.row_version
        ) order by t.created_at desc
      )
      from public.medical_treatments t
      left join public.medical_treatment_templates tpl on tpl.id = t.template_id
      left join public.profiles actor on actor.id = coalesce(t.completed_by, t.created_by, t.responsible_profile_id)
      left join public.profiles follow_actor on follow_actor.id = t.followup_attended_by
      where t.record_id = rec.id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.medical_simple_get_patient(uuid) from public, anon;
grant execute on function public.medical_simple_get_patient(uuid) to authenticated;

create or replace function public.medical_simple_update_record(
  target_profile uuid,
  next_blood_group text,
  next_allergies text,
  next_emergency_contacts text,
  next_medical_notes text,
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
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.records.edit') then
    raise exception 'missing permission: medical.records.edit';
  end if;

  update public.medical_records
  set blood_group = nullif(trim(coalesce(next_blood_group, '')), ''),
      allergies = nullif(trim(coalesce(next_allergies, '')), ''),
      emergency_contacts = nullif(trim(coalesce(next_emergency_contacts, '')), ''),
      medical_notes = nullif(trim(coalesce(next_medical_notes, '')), '')
  where profile_id = target_profile
    and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: medical record changed since it was opened'; end if;
  return new_version;
end;
$$;

revoke all on function public.medical_simple_update_record(uuid, text, text, text, text, bigint) from public, anon;
grant execute on function public.medical_simple_update_record(uuid, text, text, text, text, bigint) to authenticated;

create or replace function public.medical_simple_create_treatment(
  target_profile uuid,
  target_template uuid,
  treatment_text text,
  needs_followup boolean,
  next_followup_mode text,
  next_followup_from date,
  next_followup_to date,
  next_followup_checkpoints text[]
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec_id uuid;
  clean_text text := trim(coalesce(treatment_text, ''));
  clean_checks text[] := array(
    select trim(x)
    from unnest(coalesce(next_followup_checkpoints, '{}'::text[])) x
    where trim(x) <> ''
  );
  new_treatment public.medical_treatments%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.create') then
    raise exception 'missing permission: medical.treatments.create';
  end if;
  if char_length(clean_text) < 2 then raise exception 'treatment text required'; end if;

  select id into rec_id
  from public.medical_records
  where profile_id = target_profile;

  if rec_id is null then raise exception 'medical record not found'; end if;

  if needs_followup then
    if next_followup_mode not in ('exact', 'range') then raise exception 'follow-up mode required'; end if;
    if next_followup_from is null then raise exception 'follow-up date required'; end if;
    if next_followup_mode = 'range' and next_followup_to is null then raise exception 'follow-up end date required'; end if;
    if next_followup_mode = 'range' and next_followup_to < next_followup_from then raise exception 'invalid follow-up range'; end if;
    if coalesce(array_length(clean_checks, 1), 0) = 0 then raise exception 'follow-up checkpoints required'; end if;
  end if;

  insert into public.medical_treatments (
    record_id,
    template_id,
    status,
    summary,
    performed_text,
    responsible_profile_id,
    created_by,
    completed_by,
    completed_at,
    followup_required,
    followup_mode,
    followup_from,
    followup_to,
    followup_checkpoints
  )
  values (
    rec_id,
    target_template,
    'completed',
    clean_text,
    clean_text,
    auth.uid(),
    auth.uid(),
    auth.uid(),
    now(),
    needs_followup,
    case when needs_followup then next_followup_mode else null end,
    case when needs_followup then next_followup_from else null end,
    case
      when not needs_followup then null
      when next_followup_mode = 'exact' then next_followup_from
      else next_followup_to
    end,
    case when needs_followup then clean_checks else '{}'::text[] end
  )
  returning * into new_treatment;

  return jsonb_build_object(
    'id', new_treatment.id,
    'treatment_number', new_treatment.treatment_number,
    'row_version', new_treatment.row_version
  );
end;
$$;

revoke all on function public.medical_simple_create_treatment(uuid, uuid, text, boolean, text, date, date, text[]) from public, anon;
grant execute on function public.medical_simple_create_treatment(uuid, uuid, text, boolean, text, date, date, text[]) to authenticated;

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
    and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: follow-up changed or was already completed'; end if;
  return new_version;
end;
$$;

revoke all on function public.medical_simple_mark_followup_attended(uuid, bigint) from public, anon;
grant execute on function public.medical_simple_mark_followup_attended(uuid, bigint) to authenticated;

-- Retire the browser-facing complex clinical workflow. Existing data remains stored.
revoke execute on function public.medical_list_diagnosis_catalog() from authenticated;
revoke execute on function public.medical_add_diagnosis(uuid, uuid, text) from authenticated;
revoke execute on function public.medical_resolve_diagnosis(uuid, bigint) from authenticated;
revoke execute on function public.medical_add_allergy(uuid, text, text, text, text) from authenticated;
revoke execute on function public.medical_deactivate_allergy(uuid, bigint) from authenticated;
revoke execute on function public.medical_list_medications(text) from authenticated;
revoke execute on function public.medical_add_medication(text, text, text, text, text) from authenticated;
revoke execute on function public.medical_stop_medication(uuid, bigint, text) from authenticated;
