-- LG Nexus V1
-- Phase 4E: allow authorized Medical staff to correct treatment history entries.
-- Edits are optimistic-lock protected and every previous version is kept internally.

create table if not exists public.medical_treatment_edit_history (
  id bigint generated always as identity primary key,
  treatment_id uuid not null references public.medical_treatments(id) on delete restrict,
  previous_text text not null,
  changed_by uuid references public.profiles(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index if not exists medical_treatment_edit_history_treatment_idx
  on public.medical_treatment_edit_history(treatment_id, changed_at desc);

create index if not exists medical_treatment_edit_history_changed_by_idx
  on public.medical_treatment_edit_history(changed_by);

alter table public.medical_treatment_edit_history enable row level security;
revoke all on table public.medical_treatment_edit_history from anon, authenticated;

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
  where id = treatment_row.responsible_profile_id;

  select name into template_name
  from public.medical_treatment_templates
  where id = treatment_row.template_id;

  return jsonb_build_object(
    'id', treatment_row.id,
    'treatment_number', treatment_row.treatment_number,
    'performed_text', coalesce(treatment_row.performed_text, treatment_row.summary, 'Behandlung dokumentiert.'),
    'treated_by_name', actor_name,
    'template_name', template_name,
    'created_at', treatment_row.created_at,
    'row_version', treatment_row.row_version
  );
end;
$$;

revoke all on function public.medical_simple_get_treatment_for_edit(text) from public, anon;
grant execute on function public.medical_simple_get_treatment_for_edit(text) to authenticated;

create or replace function public.medical_simple_update_treatment_text(
  target_treatment uuid,
  next_treatment_text text,
  expected_row_version bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_row public.medical_treatments%rowtype;
  new_version bigint;
  clean_text text := trim(coalesce(next_treatment_text, ''));
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'medical', 'medical.treatments.edit') then
    raise exception 'missing permission: medical.treatments.edit';
  end if;
  if char_length(clean_text) < 2 then raise exception 'treatment text required'; end if;

  select * into current_row
  from public.medical_treatments
  where id = target_treatment
  for update;

  if not found then raise exception 'treatment not found'; end if;
  if current_row.row_version <> expected_row_version then
    raise exception 'conflict: treatment changed since it was opened';
  end if;

  insert into public.medical_treatment_edit_history (
    treatment_id,
    previous_text,
    changed_by
  ) values (
    current_row.id,
    coalesce(current_row.performed_text, current_row.summary, 'Behandlung dokumentiert.'),
    auth.uid()
  );

  update public.medical_treatments
  set performed_text = clean_text,
      summary = clean_text
  where id = current_row.id
    and row_version = expected_row_version
  returning row_version into new_version;

  if new_version is null then raise exception 'conflict: treatment changed since it was opened'; end if;

  return new_version;
end;
$$;

revoke all on function public.medical_simple_update_treatment_text(uuid, text, bigint) from public, anon;
grant execute on function public.medical_simple_update_treatment_text(uuid, text, bigint) to authenticated;
