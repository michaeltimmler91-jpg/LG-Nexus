-- Avoid changing row_version merely because a Medical record is opened.
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
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.medical_get_patient_overview(uuid) from public;
grant execute on function public.medical_get_patient_overview(uuid) to authenticated;
