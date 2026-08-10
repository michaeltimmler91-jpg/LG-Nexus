-- LG Nexus V1
-- Phase 4B: diagnoses, diagnosis catalogue and allergies.
-- Clinical data remains private and is exposed only through permission-checked RPCs.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('medical.diagnoses.manage', 'medical', 'Diagnosen verwalten', 'Erlaubt das Erfassen und Abschließen von Diagnosen in medizinischen Akten.', true, true),
  ('medical.allergies.manage', 'medical', 'Allergien verwalten', 'Erlaubt das Erfassen und Inaktivsetzen von Allergien in medizinischen Akten.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

create table if not exists public.medical_diagnosis_catalog (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create table if not exists public.medical_patient_diagnoses (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.medical_records(id) on delete restrict,
  catalog_id uuid not null references public.medical_diagnosis_catalog(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'resolved')),
  notes text,
  diagnosed_by uuid references public.profiles(id) on delete set null,
  diagnosed_at timestamptz not null default now(),
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create table if not exists public.medical_patient_allergies (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.medical_records(id) on delete restrict,
  allergen text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  reaction text,
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  recorded_by uuid references public.profiles(id) on delete set null,
  recorded_at timestamptz not null default now(),
  inactivated_by uuid references public.profiles(id) on delete set null,
  inactivated_at timestamptz,
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create table if not exists public.medical_clinical_entry_history (
  id bigint generated always as identity primary key,
  record_id uuid not null references public.medical_records(id) on delete restrict,
  entry_type text not null check (entry_type in ('diagnosis', 'allergy')),
  entry_id uuid not null,
  action_key text not null,
  snapshot jsonb not null default '{}'::jsonb,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists medical_patient_diagnoses_record_id_idx on public.medical_patient_diagnoses(record_id);
create index if not exists medical_patient_diagnoses_catalog_id_idx on public.medical_patient_diagnoses(catalog_id);
create index if not exists medical_patient_diagnoses_status_idx on public.medical_patient_diagnoses(status);
create index if not exists medical_patient_allergies_record_id_idx on public.medical_patient_allergies(record_id);
create index if not exists medical_patient_allergies_status_idx on public.medical_patient_allergies(status);
create index if not exists medical_clinical_history_record_id_idx on public.medical_clinical_entry_history(record_id);
create index if not exists medical_clinical_history_entry_idx on public.medical_clinical_entry_history(entry_type, entry_id);

alter table public.medical_diagnosis_catalog enable row level security;
alter table public.medical_patient_diagnoses enable row level security;
alter table public.medical_patient_allergies enable row level security;
alter table public.medical_clinical_entry_history enable row level security;

revoke all on table public.medical_diagnosis_catalog from anon, authenticated;
revoke all on table public.medical_patient_diagnoses from anon, authenticated;
revoke all on table public.medical_patient_allergies from anon, authenticated;
revoke all on table public.medical_clinical_entry_history from anon, authenticated;

-- Catalogue entries are intentionally conservative and can be expanded later through a dedicated catalogue editor.
insert into public.medical_diagnosis_catalog (code, name, description)
values
  ('DX-PRELLUNG', 'Prellung', 'Stumpfe Verletzung ohne offenen Gewebedefekt.'),
  ('DX-FRAKTUR', 'Fraktur', 'Knochenbruch oder klinischer Frakturverdacht.'),
  ('DX-SCHNITT', 'Schnittverletzung', 'Offene Verletzung durch scharfe Einwirkung.'),
  ('DX-STICH', 'Stichverletzung', 'Penetrierende Verletzung durch spitzen Gegenstand.'),
  ('DX-SCHUSS', 'Schussverletzung', 'Verletzung durch Projektil oder vergleichbare Einwirkung.'),
  ('DX-VERBRENNUNG', 'Verbrennung', 'Thermische Verletzung der Haut oder tieferer Strukturen.'),
  ('DX-VERGIFTUNG', 'Vergiftung', 'Akute oder vermutete toxische Einwirkung.'),
  ('DX-BEWUSSTLOS', 'Bewusstlosigkeit', 'Zeitweise oder anhaltende Bewusstlosigkeit.'),
  ('DX-KREISLAUF', 'Kreislaufkollaps', 'Akuter Kreislaufzusammenbruch oder Synkope.')
on conflict (code) do update
set name = excluded.name,
    description = excluded.description,
    is_active = true;

drop trigger if exists medical_diagnosis_catalog_set_updated_at on public.medical_diagnosis_catalog;
create trigger medical_diagnosis_catalog_set_updated_at
before update on public.medical_diagnosis_catalog
for each row execute function public.set_updated_at();

drop trigger if exists medical_diagnosis_catalog_increment_row_version on public.medical_diagnosis_catalog;
create trigger medical_diagnosis_catalog_increment_row_version
before update on public.medical_diagnosis_catalog
for each row execute function private.increment_row_version();

drop trigger if exists medical_patient_diagnoses_set_updated_at on public.medical_patient_diagnoses;
create trigger medical_patient_diagnoses_set_updated_at
before update on public.medical_patient_diagnoses
for each row execute function public.set_updated_at();

drop trigger if exists medical_patient_diagnoses_increment_row_version on public.medical_patient_diagnoses;
create trigger medical_patient_diagnoses_increment_row_version
before update on public.medical_patient_diagnoses
for each row execute function private.increment_row_version();

drop trigger if exists medical_patient_allergies_set_updated_at on public.medical_patient_allergies;
create trigger medical_patient_allergies_set_updated_at
before update on public.medical_patient_allergies
for each row execute function public.set_updated_at();

drop trigger if exists medical_patient_allergies_increment_row_version on public.medical_patient_allergies;
create trigger medical_patient_allergies_increment_row_version
before update on public.medical_patient_allergies
for each row execute function private.increment_row_version();

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
    'can_manage_allergies', private.has_service_permission_for(auth.uid(), 'medical', 'medical.allergies.manage')
  );
$$;

revoke all on function public.medical_get_my_context() from public;
grant execute on function public.medical_get_my_context() to authenticated;

create or replace function public.medical_list_diagnosis_catalog()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.records.view') then
    raise exception 'missing permission: medical.records.view';
  end if;

  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', c.id,
      'code', c.code,
      'name', c.name,
      'description', c.description
    ) order by lower(c.name)), '[]'::jsonb)
    from public.medical_diagnosis_catalog c
    where c.is_active = true
  );
end;
$$;

revoke all on function public.medical_list_diagnosis_catalog() from public;
grant execute on function public.medical_list_diagnosis_catalog() to authenticated;

create or replace function public.medical_add_diagnosis(
  target_profile uuid,
  target_catalog uuid,
  diagnosis_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec_id uuid;
  catalog_name text;
  new_entry public.medical_patient_diagnoses%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.diagnoses.manage') then
    raise exception 'missing permission: medical.diagnoses.manage';
  end if;

  select mr.id into rec_id
  from public.medical_records mr
  join public.profiles p on p.id = mr.profile_id
  where mr.profile_id = target_profile and p.account_status = 'active';
  if rec_id is null then raise exception 'medical record not found'; end if;

  select c.name into catalog_name
  from public.medical_diagnosis_catalog c
  where c.id = target_catalog and c.is_active = true;
  if catalog_name is null then raise exception 'diagnosis catalogue entry not found'; end if;

  insert into public.medical_patient_diagnoses (
    record_id, catalog_id, notes, diagnosed_by
  ) values (
    rec_id, target_catalog, nullif(trim(coalesce(diagnosis_notes, '')), ''), auth.uid()
  )
  returning * into new_entry;

  insert into public.medical_clinical_entry_history (
    record_id, entry_type, entry_id, action_key, snapshot, actor_profile_id
  ) values (
    rec_id, 'diagnosis', new_entry.id, 'diagnosis.created',
    jsonb_build_object(
      'catalog_id', new_entry.catalog_id,
      'catalog_name', catalog_name,
      'status', new_entry.status,
      'notes', new_entry.notes,
      'diagnosed_at', new_entry.diagnosed_at
    ),
    auth.uid()
  );

  return jsonb_build_object('id', new_entry.id, 'row_version', new_entry.row_version);
end;
$$;

revoke all on function public.medical_add_diagnosis(uuid, uuid, text) from public;
grant execute on function public.medical_add_diagnosis(uuid, uuid, text) to authenticated;

create or replace function public.medical_resolve_diagnosis(
  target_diagnosis uuid,
  expected_row_version bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec_id uuid;
  new_entry public.medical_patient_diagnoses%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.diagnoses.manage') then
    raise exception 'missing permission: medical.diagnoses.manage';
  end if;

  update public.medical_patient_diagnoses d
  set status = 'resolved',
      resolved_by = auth.uid(),
      resolved_at = now()
  where d.id = target_diagnosis
    and d.status = 'active'
    and d.row_version = expected_row_version
  returning d.* into new_entry;

  if new_entry.id is null then raise exception 'conflict: diagnosis changed since it was opened'; end if;
  rec_id := new_entry.record_id;

  insert into public.medical_clinical_entry_history (
    record_id, entry_type, entry_id, action_key, snapshot, actor_profile_id
  ) values (
    rec_id, 'diagnosis', new_entry.id, 'diagnosis.resolved',
    jsonb_build_object(
      'catalog_id', new_entry.catalog_id,
      'status', new_entry.status,
      'notes', new_entry.notes,
      'resolved_at', new_entry.resolved_at
    ),
    auth.uid()
  );

  return new_entry.row_version;
end;
$$;

revoke all on function public.medical_resolve_diagnosis(uuid, bigint) from public;
grant execute on function public.medical_resolve_diagnosis(uuid, bigint) to authenticated;

create or replace function public.medical_add_allergy(
  target_profile uuid,
  allergy_name text,
  allergy_severity text,
  allergy_reaction text default null,
  allergy_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec_id uuid;
  clean_name text := trim(coalesce(allergy_name, ''));
  new_entry public.medical_patient_allergies%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.allergies.manage') then
    raise exception 'missing permission: medical.allergies.manage';
  end if;
  if char_length(clean_name) < 2 or char_length(clean_name) > 120 then
    raise exception 'allergen must be between 2 and 120 characters';
  end if;
  if allergy_severity not in ('low', 'medium', 'high', 'critical') then
    raise exception 'invalid allergy severity';
  end if;

  select mr.id into rec_id
  from public.medical_records mr
  join public.profiles p on p.id = mr.profile_id
  where mr.profile_id = target_profile and p.account_status = 'active';
  if rec_id is null then raise exception 'medical record not found'; end if;

  insert into public.medical_patient_allergies (
    record_id, allergen, severity, reaction, notes, recorded_by
  ) values (
    rec_id,
    clean_name,
    allergy_severity,
    nullif(trim(coalesce(allergy_reaction, '')), ''),
    nullif(trim(coalesce(allergy_notes, '')), ''),
    auth.uid()
  )
  returning * into new_entry;

  insert into public.medical_clinical_entry_history (
    record_id, entry_type, entry_id, action_key, snapshot, actor_profile_id
  ) values (
    rec_id, 'allergy', new_entry.id, 'allergy.created',
    jsonb_build_object(
      'allergen', new_entry.allergen,
      'severity', new_entry.severity,
      'reaction', new_entry.reaction,
      'notes', new_entry.notes,
      'status', new_entry.status,
      'recorded_at', new_entry.recorded_at
    ),
    auth.uid()
  );

  return jsonb_build_object('id', new_entry.id, 'row_version', new_entry.row_version);
end;
$$;

revoke all on function public.medical_add_allergy(uuid, text, text, text, text) from public;
grant execute on function public.medical_add_allergy(uuid, text, text, text, text) to authenticated;

create or replace function public.medical_deactivate_allergy(
  target_allergy uuid,
  expected_row_version bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec_id uuid;
  new_entry public.medical_patient_allergies%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.allergies.manage') then
    raise exception 'missing permission: medical.allergies.manage';
  end if;

  update public.medical_patient_allergies a
  set status = 'inactive',
      inactivated_by = auth.uid(),
      inactivated_at = now()
  where a.id = target_allergy
    and a.status = 'active'
    and a.row_version = expected_row_version
  returning a.* into new_entry;

  if new_entry.id is null then raise exception 'conflict: allergy changed since it was opened'; end if;
  rec_id := new_entry.record_id;

  insert into public.medical_clinical_entry_history (
    record_id, entry_type, entry_id, action_key, snapshot, actor_profile_id
  ) values (
    rec_id, 'allergy', new_entry.id, 'allergy.inactivated',
    jsonb_build_object(
      'allergen', new_entry.allergen,
      'severity', new_entry.severity,
      'reaction', new_entry.reaction,
      'notes', new_entry.notes,
      'status', new_entry.status,
      'inactivated_at', new_entry.inactivated_at
    ),
    auth.uid()
  );

  return new_entry.row_version;
end;
$$;

revoke all on function public.medical_deactivate_allergy(uuid, bigint) from public;
grant execute on function public.medical_deactivate_allergy(uuid, bigint) to authenticated;

create or replace function public.medical_get_patient_overview(target_profile uuid)
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

  select * into patient from public.profiles where id = target_profile and account_status = 'active';
  if not found then raise exception 'patient not found'; end if;

  insert into public.medical_records (profile_id, patient_nexus_id, patient_name)
  values (patient.id, patient.nexus_id, patient.display_name)
  on conflict (profile_id) do nothing;

  select * into rec
  from public.medical_records
  where profile_id = patient.id;

  if rec.patient_nexus_id is distinct from patient.nexus_id
     or rec.patient_name is distinct from patient.display_name then
    update public.medical_records
    set patient_nexus_id = patient.nexus_id,
        patient_name = patient.display_name
    where id = rec.id
    returning * into rec;
  end if;

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
      'emergency_notes', rec.emergency_notes,
      'internal_warning', rec.internal_warning,
      'deceased', rec.deceased,
      'created_at', rec.created_at,
      'updated_at', rec.updated_at,
      'row_version', rec.row_version
    ),
    'treatments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'treatment_number', t.treatment_number,
          'status', t.status,
          'summary', t.summary,
          'responsible_name', rp.display_name,
          'created_at', t.created_at,
          'completed_at', t.completed_at,
          'row_version', t.row_version
        ) order by t.created_at desc
      )
      from public.medical_treatments t
      left join public.profiles rp on rp.id = t.responsible_profile_id
      where t.record_id = rec.id
    ), '[]'::jsonb),
    'diagnoses', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', d.id,
          'catalog_id', d.catalog_id,
          'code', c.code,
          'name', c.name,
          'status', d.status,
          'notes', d.notes,
          'diagnosed_by_name', dp.display_name,
          'diagnosed_at', d.diagnosed_at,
          'resolved_at', d.resolved_at,
          'row_version', d.row_version
        ) order by (d.status = 'active') desc, d.diagnosed_at desc
      )
      from public.medical_patient_diagnoses d
      join public.medical_diagnosis_catalog c on c.id = d.catalog_id
      left join public.profiles dp on dp.id = d.diagnosed_by
      where d.record_id = rec.id
    ), '[]'::jsonb),
    'allergies', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'allergen', a.allergen,
          'severity', a.severity,
          'reaction', a.reaction,
          'notes', a.notes,
          'status', a.status,
          'recorded_by_name', ap.display_name,
          'recorded_at', a.recorded_at,
          'inactivated_at', a.inactivated_at,
          'row_version', a.row_version
        ) order by (a.status = 'active') desc,
                   case a.severity when 'critical' then 4 when 'high' then 3 when 'medium' then 2 else 1 end desc,
                   a.recorded_at desc
      )
      from public.medical_patient_allergies a
      left join public.profiles ap on ap.id = a.recorded_by
      where a.record_id = rec.id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.medical_get_patient_overview(uuid) from public;
grant execute on function public.medical_get_patient_overview(uuid) to authenticated;
