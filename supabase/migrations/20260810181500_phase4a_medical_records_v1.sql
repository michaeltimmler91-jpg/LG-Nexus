-- LG Nexus V1
-- Phase 4A: secure Medical record foundation, patient search and first treatment workflow.
-- Medical data is exposed only through permission-checked RPCs; direct client table access stays closed.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('medical.records.view', 'medical', 'Krankenakten ansehen', 'Erlaubt die Suche nach Patienten und das Lesen medizinischer Akten.', true, true),
  ('medical.records.edit', 'medical', 'Krankenakten bearbeiten', 'Erlaubt die Bearbeitung medizinischer Stammdaten und Hinweise.', true, true),
  ('medical.treatments.create', 'medical', 'Behandlungen anlegen', 'Erlaubt das Anlegen neuer Behandlungsvorgänge.', true, true),
  ('medical.treatments.edit', 'medical', 'Behandlungen bearbeiten', 'Erlaubt die Bearbeitung und den Abschluss offener Behandlungsvorgänge.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

create or replace function private.has_service_permission_for(
  target_profile uuid,
  target_module text,
  requested_permission text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members m
    join public.organizations o
      on o.id = m.organization_id
     and o.service_module = target_module
     and o.is_archived = false
    join public.organization_roles r
      on r.id = m.role_id
     and r.organization_id = m.organization_id
     and r.is_active = true
    join public.profiles p
      on p.id = m.user_id
     and p.account_status = 'active'
    where m.user_id = target_profile
      and m.is_active = true
      and m.left_at is null
      and (
        r.is_owner = true
        or exists (
          select 1
          from public.organization_role_permissions rp
          join public.permissions perm
            on perm.key = rp.permission_key
           and perm.is_active = true
          where rp.role_id = r.id
            and rp.permission_key = requested_permission
        )
      )
  );
$$;

revoke all on function private.has_service_permission_for(uuid, text, text) from public;

create or replace function private.can_view_profile_phone(viewer_profile uuid, target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select case p.phone_visibility
      when 'everyone' then true
      when 'citizens' then exists (
        select 1 from public.profiles v where v.id = viewer_profile and v.account_status = 'active'
      )
      when 'citizens_and_authorities' then exists (
        select 1 from public.profiles v where v.id = viewer_profile and v.account_status = 'active'
      )
      when 'authorities' then exists (
        select 1
        from public.organization_members vm
        join public.organizations vo on vo.id = vm.organization_id and vo.is_archived = false
        where vm.user_id = viewer_profile
          and vm.is_active = true
          and vm.left_at is null
          and vo.service_module in ('city', 'medical', 'police', 'fire', 'justice')
      )
      when 'own_org' then exists (
        select 1
        from public.organization_members a
        join public.organization_members b on b.organization_id = a.organization_id
        where a.user_id = viewer_profile
          and b.user_id = target_profile
          and a.is_active = true and a.left_at is null
          and b.is_active = true and b.left_at is null
      )
      else false
    end
    from public.profiles p
    where p.id = target_profile
  ), false) or viewer_profile = target_profile;
$$;

revoke all on function private.can_view_profile_phone(uuid, uuid) from public;

create sequence if not exists public.medical_record_number_seq start with 1;
create sequence if not exists public.medical_treatment_number_seq start with 1;

create table if not exists public.medical_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  patient_nexus_id text,
  patient_name text not null,
  record_number text not null unique default ('MA-' || lpad(nextval('public.medical_record_number_seq')::text, 6, '0')),
  blood_group text check (blood_group is null or blood_group in ('0+', '0-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
  emergency_notes text,
  internal_warning text,
  deceased boolean not null default false,
  deceased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create table if not exists public.medical_treatments (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.medical_records(id) on delete restrict,
  treatment_number text not null unique default ('BH-' || lpad(nextval('public.medical_treatment_number_seq')::text, 6, '0')),
  status text not null default 'open' check (status in ('open', 'completed')),
  summary text,
  responsible_profile_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  completed_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create index if not exists medical_treatments_record_id_idx on public.medical_treatments(record_id);
create index if not exists medical_treatments_status_idx on public.medical_treatments(status);
create index if not exists medical_records_patient_nexus_id_idx on public.medical_records(patient_nexus_id);

alter table public.medical_records enable row level security;
alter table public.medical_treatments enable row level security;

revoke all on table public.medical_records from anon, authenticated;
revoke all on table public.medical_treatments from anon, authenticated;
revoke all on sequence public.medical_record_number_seq from anon, authenticated;
revoke all on sequence public.medical_treatment_number_seq from anon, authenticated;

drop trigger if exists medical_records_set_updated_at on public.medical_records;
create trigger medical_records_set_updated_at
before update on public.medical_records
for each row execute function public.set_updated_at();

drop trigger if exists medical_records_increment_row_version on public.medical_records;
create trigger medical_records_increment_row_version
before update on public.medical_records
for each row execute function private.increment_row_version();

drop trigger if exists medical_treatments_set_updated_at on public.medical_treatments;
create trigger medical_treatments_set_updated_at
before update on public.medical_treatments
for each row execute function public.set_updated_at();

drop trigger if exists medical_treatments_increment_row_version on public.medical_treatments;
create trigger medical_treatments_increment_row_version
before update on public.medical_treatments
for each row execute function private.increment_row_version();

-- Existing active citizens receive their one central record immediately.
insert into public.medical_records (profile_id, patient_nexus_id, patient_name)
select p.id, p.nexus_id, p.display_name
from public.profiles p
where p.account_status = 'active'
on conflict (profile_id) do nothing;

create or replace function private.ensure_medical_record_for_active_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.account_status = 'active' then
    insert into public.medical_records (profile_id, patient_nexus_id, patient_name)
    values (new.id, new.nexus_id, new.display_name)
    on conflict (profile_id) do update
    set patient_nexus_id = excluded.patient_nexus_id,
        patient_name = excluded.patient_name;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_ensure_medical_record on public.profiles;
create trigger profiles_ensure_medical_record
after insert or update of account_status, nexus_id, display_name on public.profiles
for each row execute function private.ensure_medical_record_for_active_profile();

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
    'can_edit_treatments', private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.edit')
  );
$$;

revoke all on function public.medical_get_my_context() from public;
grant execute on function public.medical_get_my_context() to authenticated;

create or replace function public.medical_search_patients(search_text text)
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
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.records.view') then
    raise exception 'missing permission: medical.records.view';
  end if;
  if char_length(needle) < 2 then return '[]'::jsonb; end if;

  return (
    select coalesce(jsonb_agg(to_jsonb(q) order by lower(q.display_name)), '[]'::jsonb)
    from (
      select
        p.id as profile_id,
        p.display_name,
        p.nexus_id,
        p.date_of_birth,
        case when private.can_view_profile_phone(auth.uid(), p.id) then p.phone else null end as phone,
        mr.record_number
      from public.profiles p
      left join public.medical_records mr on mr.profile_id = p.id
      where p.account_status = 'active'
        and (
          p.display_name ilike '%' || needle || '%'
          or coalesce(p.nexus_id, '') ilike '%' || needle || '%'
          or coalesce(to_char(p.date_of_birth, 'DD.MM.YYYY'), '') ilike '%' || needle || '%'
          or coalesce(p.date_of_birth::text, '') ilike '%' || needle || '%'
          or (
            private.can_view_profile_phone(auth.uid(), p.id)
            and coalesce(p.phone, '') ilike '%' || needle || '%'
          )
        )
      order by lower(p.display_name)
      limit 30
    ) q
  );
end;
$$;

revoke all on function public.medical_search_patients(text) from public;
grant execute on function public.medical_search_patients(text) to authenticated;

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
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.medical_get_patient_overview(uuid) from public;
grant execute on function public.medical_get_patient_overview(uuid) to authenticated;

create or replace function public.medical_update_record_basics(
  target_profile uuid,
  next_blood_group text,
  next_emergency_notes text,
  next_internal_warning text,
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
      emergency_notes = nullif(trim(coalesce(next_emergency_notes, '')), ''),
      internal_warning = nullif(trim(coalesce(next_internal_warning, '')), '')
  where profile_id = target_profile
    and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: medical record changed since it was opened'; end if;
  return new_version;
end;
$$;

revoke all on function public.medical_update_record_basics(uuid, text, text, text, bigint) from public;
grant execute on function public.medical_update_record_basics(uuid, text, text, text, bigint) to authenticated;

create or replace function public.medical_create_treatment(target_profile uuid, treatment_summary text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec_id uuid;
  new_treatment public.medical_treatments%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.create') then
    raise exception 'missing permission: medical.treatments.create';
  end if;

  select id into rec_id from public.medical_records where profile_id = target_profile;
  if rec_id is null then raise exception 'medical record not found'; end if;

  insert into public.medical_treatments (record_id, summary, responsible_profile_id, created_by)
  values (rec_id, nullif(trim(coalesce(treatment_summary, '')), ''), auth.uid(), auth.uid())
  returning * into new_treatment;

  return jsonb_build_object(
    'id', new_treatment.id,
    'treatment_number', new_treatment.treatment_number,
    'status', new_treatment.status,
    'row_version', new_treatment.row_version
  );
end;
$$;

revoke all on function public.medical_create_treatment(uuid, text) from public;
grant execute on function public.medical_create_treatment(uuid, text) to authenticated;

create or replace function public.medical_complete_treatment(
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
  set status = 'completed',
      completed_at = now(),
      completed_by = auth.uid()
  where id = target_treatment
    and status = 'open'
    and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: treatment changed or is already completed'; end if;
  return new_version;
end;
$$;

revoke all on function public.medical_complete_treatment(uuid, bigint) from public;
grant execute on function public.medical_complete_treatment(uuid, bigint) to authenticated;
