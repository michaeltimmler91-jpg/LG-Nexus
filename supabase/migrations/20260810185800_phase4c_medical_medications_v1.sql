-- LG Nexus V1
-- Phase 4C: medication history and dosage documentation.
-- Medication entries are never hard-deleted; stopping a medication preserves the full history.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('medical.medications.manage', 'medical', 'Medikamente verwalten', 'Erlaubt das Erfassen und Absetzen von Medikamenten einschließlich Dosierungsangaben.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

create table if not exists public.medical_patient_medications (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.medical_records(id) on delete restrict,
  medication_name text not null,
  dosage text not null,
  instructions text,
  indication text,
  status text not null default 'active' check (status in ('active', 'stopped')),
  recorded_by uuid references public.profiles(id) on delete set null,
  recorded_at timestamptz not null default now(),
  stopped_by uuid references public.profiles(id) on delete set null,
  stopped_at timestamptz,
  stop_reason text,
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create index if not exists medical_patient_medications_record_id_idx on public.medical_patient_medications(record_id);
create index if not exists medical_patient_medications_status_idx on public.medical_patient_medications(status);
create index if not exists medical_patient_medications_recorded_by_idx on public.medical_patient_medications(recorded_by);
create index if not exists medical_patient_medications_stopped_by_idx on public.medical_patient_medications(stopped_by);

alter table public.medical_patient_medications enable row level security;
revoke all on table public.medical_patient_medications from anon, authenticated;

drop trigger if exists medical_patient_medications_set_updated_at on public.medical_patient_medications;
create trigger medical_patient_medications_set_updated_at
before update on public.medical_patient_medications
for each row execute function public.set_updated_at();

drop trigger if exists medical_patient_medications_increment_row_version on public.medical_patient_medications;
create trigger medical_patient_medications_increment_row_version
before update on public.medical_patient_medications
for each row execute function private.increment_row_version();

alter table public.medical_clinical_entry_history
  drop constraint if exists medical_clinical_entry_history_entry_type_check;

alter table public.medical_clinical_entry_history
  add constraint medical_clinical_entry_history_entry_type_check
  check (entry_type in ('diagnosis', 'allergy', 'medication'));

create or replace function public.medical_get_my_context()
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
    'can_manage_diagnoses', private.has_service_permission_for(auth.uid(), 'medical', 'medical.diagnoses.manage'),
    'can_manage_allergies', private.has_service_permission_for(auth.uid(), 'medical', 'medical.allergies.manage'),
    'can_manage_medications', private.has_service_permission_for(auth.uid(), 'medical', 'medical.medications.manage')
  );
$$;

revoke all on function public.medical_get_my_context() from public, anon;
grant execute on function public.medical_get_my_context() to authenticated;

create or replace function public.medical_list_medications(target_record_number text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  rec_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.records.view') then
    raise exception 'missing permission: medical.records.view';
  end if;

  select id into rec_id
  from public.medical_records
  where record_number = trim(coalesce(target_record_number, ''));

  if rec_id is null then raise exception 'medical record not found'; end if;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', m.id,
        'medication_name', m.medication_name,
        'dosage', m.dosage,
        'instructions', m.instructions,
        'indication', m.indication,
        'status', m.status,
        'recorded_by_name', rp.display_name,
        'recorded_at', m.recorded_at,
        'stopped_by_name', sp.display_name,
        'stopped_at', m.stopped_at,
        'stop_reason', m.stop_reason,
        'row_version', m.row_version
      ) order by (m.status = 'active') desc, m.recorded_at desc
    )
    from public.medical_patient_medications m
    left join public.profiles rp on rp.id = m.recorded_by
    left join public.profiles sp on sp.id = m.stopped_by
    where m.record_id = rec_id
  ), '[]'::jsonb);
end;
$$;

revoke all on function public.medical_list_medications(text) from public, anon;
grant execute on function public.medical_list_medications(text) to authenticated;

create or replace function public.medical_add_medication(
  target_record_number text,
  medication_name text,
  medication_dosage text,
  medication_instructions text default null,
  medication_indication text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec_id uuid;
  new_medication public.medical_patient_medications%rowtype;
  clean_name text := trim(coalesce(medication_name, ''));
  clean_dosage text := trim(coalesce(medication_dosage, ''));
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.medications.manage') then
    raise exception 'missing permission: medical.medications.manage';
  end if;
  if char_length(clean_name) < 2 then raise exception 'medication name required'; end if;
  if char_length(clean_dosage) < 1 then raise exception 'dosage required'; end if;

  select id into rec_id
  from public.medical_records
  where record_number = trim(coalesce(target_record_number, ''));

  if rec_id is null then raise exception 'medical record not found'; end if;

  insert into public.medical_patient_medications (
    record_id,
    medication_name,
    dosage,
    instructions,
    indication,
    recorded_by
  )
  values (
    rec_id,
    clean_name,
    clean_dosage,
    nullif(trim(coalesce(medication_instructions, '')), ''),
    nullif(trim(coalesce(medication_indication, '')), ''),
    auth.uid()
  )
  returning * into new_medication;

  insert into public.medical_clinical_entry_history (
    record_id,
    entry_type,
    entry_id,
    action_key,
    snapshot,
    actor_profile_id
  )
  values (
    rec_id,
    'medication',
    new_medication.id,
    'created',
    to_jsonb(new_medication),
    auth.uid()
  );

  return jsonb_build_object(
    'id', new_medication.id,
    'status', new_medication.status,
    'row_version', new_medication.row_version
  );
end;
$$;

revoke all on function public.medical_add_medication(text, text, text, text, text) from public, anon;
grant execute on function public.medical_add_medication(text, text, text, text, text) to authenticated;

create or replace function public.medical_stop_medication(
  target_medication uuid,
  expected_row_version bigint,
  medication_stop_reason text default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_medication public.medical_patient_medications%rowtype;
  updated_medication public.medical_patient_medications%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.medications.manage') then
    raise exception 'missing permission: medical.medications.manage';
  end if;

  select * into current_medication
  from public.medical_patient_medications
  where id = target_medication;

  if not found then raise exception 'medication not found'; end if;

  update public.medical_patient_medications
  set status = 'stopped',
      stopped_by = auth.uid(),
      stopped_at = now(),
      stop_reason = nullif(trim(coalesce(medication_stop_reason, '')), '')
  where id = target_medication
    and status = 'active'
    and row_version = expected_row_version
  returning * into updated_medication;

  if updated_medication.id is null then
    raise exception 'conflict: medication changed or is already stopped';
  end if;

  insert into public.medical_clinical_entry_history (
    record_id,
    entry_type,
    entry_id,
    action_key,
    snapshot,
    actor_profile_id
  )
  values (
    updated_medication.record_id,
    'medication',
    updated_medication.id,
    'stopped',
    to_jsonb(updated_medication),
    auth.uid()
  );

  return updated_medication.row_version;
end;
$$;

revoke all on function public.medical_stop_medication(uuid, bigint, text) from public, anon;
grant execute on function public.medical_stop_medication(uuid, bigint, text) to authenticated;
