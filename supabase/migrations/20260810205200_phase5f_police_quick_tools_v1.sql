-- LG Nexus V1
-- Phase 5F: simplified Police quick tools.
-- Goal: fast city workflow, not a full law-enforcement suite.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('police.wanted.manage', 'police', 'Fahndungen verwalten', 'Personen- und Fahrzeugfahndungen anlegen und beenden.', true, true),
  ('police.vehicles.manage', 'police', 'Fahrzeuge verwalten', 'Interne Fahrzeug- und Kennzeichenhinweise pflegen.', false, true),
  ('police.fines.manage', 'police', 'Bußgelder verwalten', 'Bußgelder ausstellen und Status ändern.', true, true),
  ('police.warrants.manage', 'police', 'Haftbefehle verwalten', 'Haftbefehle anlegen und beenden.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

-- Give the standard Police role the complete lightweight toolset.
insert into public.organization_role_permissions (role_id, permission_key, granted_by)
select r.id, p.key, null
from public.organization_roles r
join public.organizations o on o.id = r.organization_id
join public.permissions p on p.key in (
  'police.wanted.manage',
  'police.vehicles.manage',
  'police.fines.manage',
  'police.warrants.manage'
)
where o.service_module = 'police'
  and r.is_standard = true
  and r.is_active = true
on conflict (role_id, permission_key) do nothing;

create sequence if not exists public.police_wanted_number_seq;
create sequence if not exists public.police_fine_number_seq;
create sequence if not exists public.police_warrant_number_seq;

create table if not exists public.police_wanted (
  id uuid primary key default gen_random_uuid(),
  wanted_number text not null unique default ('FA-' || lpad(nextval('public.police_wanted_number_seq')::text, 6, '0')),
  target_type text not null check (target_type in ('person', 'vehicle')),
  profile_id uuid references public.profiles(id) on delete restrict,
  plate text,
  reason text not null,
  note text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'active' check (status in ('active', 'done')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  closed_by uuid references public.profiles(id) on delete set null,
  closed_at timestamptz,
  close_reason text,
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1,
  constraint police_wanted_target_check check (
    (target_type = 'person' and profile_id is not null and plate is null)
    or
    (target_type = 'vehicle' and profile_id is null and plate is not null and char_length(trim(plate)) >= 2)
  )
);

create table if not exists public.police_vehicles (
  id uuid primary key default gen_random_uuid(),
  plate text not null unique,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  model text,
  color text,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1,
  constraint police_vehicles_plate_check check (char_length(trim(plate)) >= 2)
);

create table if not exists public.police_fines (
  id uuid primary key default gen_random_uuid(),
  fine_number text not null unique default ('BG-' || lpad(nextval('public.police_fine_number_seq')::text, 6, '0')),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  case_id uuid references public.police_cases(id) on delete set null,
  reason text not null,
  amount numeric(12,2) not null check (amount >= 0),
  status text not null default 'open' check (status in ('open', 'paid', 'waived', 'cancelled')),
  issued_by uuid references public.profiles(id) on delete set null,
  issued_at timestamptz not null default now(),
  changed_by uuid references public.profiles(id) on delete set null,
  changed_at timestamptz,
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create table if not exists public.police_warrants (
  id uuid primary key default gen_random_uuid(),
  warrant_number text not null unique default ('HB-' || lpad(nextval('public.police_warrant_number_seq')::text, 6, '0')),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  case_id uuid references public.police_cases(id) on delete set null,
  reason text not null,
  note text,
  status text not null default 'active' check (status in ('active', 'done', 'cancelled')),
  issued_by uuid references public.profiles(id) on delete set null,
  issued_at timestamptz not null default now(),
  closed_by uuid references public.profiles(id) on delete set null,
  closed_at timestamptz,
  close_reason text,
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1
);

create index if not exists police_wanted_profile_status_idx on public.police_wanted(profile_id, status);
create index if not exists police_wanted_plate_status_idx on public.police_wanted(plate, status);
create index if not exists police_wanted_created_by_idx on public.police_wanted(created_by);
create index if not exists police_wanted_closed_by_idx on public.police_wanted(closed_by);
create index if not exists police_vehicles_owner_idx on public.police_vehicles(owner_profile_id);
create index if not exists police_vehicles_created_by_idx on public.police_vehicles(created_by);
create index if not exists police_vehicles_updated_by_idx on public.police_vehicles(updated_by);
create index if not exists police_fines_profile_status_idx on public.police_fines(profile_id, status);
create index if not exists police_fines_case_idx on public.police_fines(case_id);
create index if not exists police_fines_issued_by_idx on public.police_fines(issued_by);
create index if not exists police_fines_changed_by_idx on public.police_fines(changed_by);
create index if not exists police_warrants_profile_status_idx on public.police_warrants(profile_id, status);
create index if not exists police_warrants_case_idx on public.police_warrants(case_id);
create index if not exists police_warrants_issued_by_idx on public.police_warrants(issued_by);
create index if not exists police_warrants_closed_by_idx on public.police_warrants(closed_by);

alter table public.police_wanted enable row level security;
alter table public.police_vehicles enable row level security;
alter table public.police_fines enable row level security;
alter table public.police_warrants enable row level security;

revoke all on public.police_wanted from anon, authenticated;
revoke all on public.police_vehicles from anon, authenticated;
revoke all on public.police_fines from anon, authenticated;
revoke all on public.police_warrants from anon, authenticated;

create or replace function public.police_tools_get_context()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'can_open', private.has_service_permission_for(auth.uid(), 'police', 'police.access'),
    'can_search_people', private.has_service_permission_for(auth.uid(), 'police', 'police.people.search'),
    'can_view_cases', private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view'),
    'can_manage_wanted', private.has_service_permission_for(auth.uid(), 'police', 'police.wanted.manage'),
    'can_manage_vehicles', private.has_service_permission_for(auth.uid(), 'police', 'police.vehicles.manage'),
    'can_manage_fines', private.has_service_permission_for(auth.uid(), 'police', 'police.fines.manage'),
    'can_manage_warrants', private.has_service_permission_for(auth.uid(), 'police', 'police.warrants.manage')
  );
$$;
revoke all on function public.police_tools_get_context() from public, anon;
grant execute on function public.police_tools_get_context() to authenticated;

create or replace function public.police_list_wanted(show_done boolean default false)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.wanted.manage') then raise exception 'missing Police permission'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', w.id,
      'wanted_number', w.wanted_number,
      'target_type', w.target_type,
      'profile_id', w.profile_id,
      'display_name', p.display_name,
      'nexus_id', p.nexus_id,
      'plate', w.plate,
      'reason', w.reason,
      'note', w.note,
      'priority', w.priority,
      'status', w.status,
      'created_by_name', creator.display_name,
      'created_at', w.created_at,
      'closed_by_name', closer.display_name,
      'closed_at', w.closed_at,
      'close_reason', w.close_reason,
      'row_version', w.row_version
    ) order by (w.status = 'active') desc, case w.priority when 'urgent' then 4 when 'high' then 3 when 'normal' then 2 else 1 end desc, w.created_at desc)
    from public.police_wanted w
    left join public.profiles p on p.id = w.profile_id
    left join public.profiles creator on creator.id = w.created_by
    left join public.profiles closer on closer.id = w.closed_by
    where show_done or w.status = 'active'
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_wanted(boolean) from public, anon;
grant execute on function public.police_list_wanted(boolean) to authenticated;

create or replace function public.police_create_person_wanted(
  target_profile uuid,
  wanted_reason text,
  wanted_note text default null,
  wanted_priority text default 'normal'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  row public.police_wanted%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.wanted.manage') then raise exception 'missing Police permission'; end if;
  if not exists (select 1 from public.profiles p where p.id = target_profile and p.account_status = 'active') then raise exception 'person missing'; end if;
  if char_length(trim(coalesce(wanted_reason, ''))) < 2 then raise exception 'reason required'; end if;
  if wanted_priority not in ('low','normal','high','urgent') then raise exception 'invalid priority'; end if;

  insert into public.police_wanted(target_type, profile_id, reason, note, priority, created_by)
  values ('person', target_profile, trim(wanted_reason), nullif(trim(coalesce(wanted_note,'')), ''), wanted_priority, auth.uid())
  returning * into row;

  return jsonb_build_object('id', row.id, 'wanted_number', row.wanted_number);
end;
$$;
revoke all on function public.police_create_person_wanted(uuid, text, text, text) from public, anon;
grant execute on function public.police_create_person_wanted(uuid, text, text, text) to authenticated;

create or replace function public.police_create_vehicle_wanted(
  target_plate text,
  wanted_reason text,
  wanted_note text default null,
  wanted_priority text default 'normal'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_plate text := upper(trim(coalesce(target_plate,'')));
  row public.police_wanted%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.wanted.manage') then raise exception 'missing Police permission'; end if;
  if char_length(clean_plate) < 2 then raise exception 'plate required'; end if;
  if char_length(trim(coalesce(wanted_reason, ''))) < 2 then raise exception 'reason required'; end if;
  if wanted_priority not in ('low','normal','high','urgent') then raise exception 'invalid priority'; end if;

  insert into public.police_wanted(target_type, plate, reason, note, priority, created_by)
  values ('vehicle', clean_plate, trim(wanted_reason), nullif(trim(coalesce(wanted_note,'')), ''), wanted_priority, auth.uid())
  returning * into row;

  return jsonb_build_object('id', row.id, 'wanted_number', row.wanted_number);
end;
$$;
revoke all on function public.police_create_vehicle_wanted(text, text, text, text) from public, anon;
grant execute on function public.police_create_vehicle_wanted(text, text, text, text) to authenticated;

create or replace function public.police_close_wanted(target_wanted uuid, close_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.wanted.manage') then raise exception 'missing Police permission'; end if;
  if char_length(trim(coalesce(close_reason,''))) < 2 then raise exception 'close reason required'; end if;

  update public.police_wanted
  set status = 'done', closed_by = auth.uid(), closed_at = now(), close_reason = trim(close_reason), updated_at = now(), row_version = row_version + 1
  where id = target_wanted and status = 'active';
  if not found then raise exception 'wanted entry missing or closed'; end if;
end;
$$;
revoke all on function public.police_close_wanted(uuid, text) from public, anon;
grant execute on function public.police_close_wanted(uuid, text) to authenticated;

create or replace function public.police_search_vehicles(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := trim(coalesce(search_text,''));
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.vehicles.manage') then raise exception 'missing Police permission'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', v.id,
      'plate', v.plate,
      'owner_profile_id', v.owner_profile_id,
      'owner_name', p.display_name,
      'owner_nexus_id', p.nexus_id,
      'model', v.model,
      'color', v.color,
      'notes', v.notes,
      'wanted_active', exists(select 1 from public.police_wanted w where w.target_type='vehicle' and w.plate=v.plate and w.status='active'),
      'updated_at', v.updated_at,
      'row_version', v.row_version
    ) order by v.updated_at desc)
    from public.police_vehicles v
    left join public.profiles p on p.id = v.owner_profile_id
    where needle = ''
       or v.plate ilike '%' || needle || '%'
       or coalesce(v.model,'') ilike '%' || needle || '%'
       or coalesce(p.display_name,'') ilike '%' || needle || '%'
       or coalesce(p.nexus_id,'') ilike '%' || needle || '%'
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_search_vehicles(text) from public, anon;
grant execute on function public.police_search_vehicles(text) to authenticated;

create or replace function public.police_save_vehicle(
  target_vehicle uuid,
  vehicle_plate text,
  target_owner uuid,
  vehicle_model text,
  vehicle_color text,
  vehicle_notes text,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_plate text := upper(trim(coalesce(vehicle_plate,'')));
  row public.police_vehicles%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.vehicles.manage') then raise exception 'missing Police permission'; end if;
  if char_length(clean_plate) < 2 then raise exception 'plate required'; end if;
  if target_owner is not null and not exists (select 1 from public.profiles p where p.id = target_owner and p.account_status='active') then raise exception 'owner missing'; end if;

  if target_vehicle is null then
    insert into public.police_vehicles(plate, owner_profile_id, model, color, notes, created_by, updated_by)
    values (clean_plate, target_owner, nullif(trim(coalesce(vehicle_model,'')), ''), nullif(trim(coalesce(vehicle_color,'')), ''), nullif(trim(coalesce(vehicle_notes,'')), ''), auth.uid(), auth.uid())
    returning * into row;
  else
    update public.police_vehicles
    set plate = clean_plate,
        owner_profile_id = target_owner,
        model = nullif(trim(coalesce(vehicle_model,'')), ''),
        color = nullif(trim(coalesce(vehicle_color,'')), ''),
        notes = nullif(trim(coalesce(vehicle_notes,'')), ''),
        updated_by = auth.uid(), updated_at = now(), row_version = row_version + 1
    where id = target_vehicle and row_version = expected_row_version
    returning * into row;
    if row.id is null then raise exception 'vehicle changed or missing'; end if;
  end if;

  return jsonb_build_object('id', row.id, 'plate', row.plate, 'row_version', row.row_version);
end;
$$;
revoke all on function public.police_save_vehicle(uuid, text, uuid, text, text, text, bigint) from public, anon;
grant execute on function public.police_save_vehicle(uuid, text, uuid, text, text, text, bigint) to authenticated;

create or replace function public.police_list_fines(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := trim(coalesce(search_text,''));
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.fines.manage') then raise exception 'missing Police permission'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', f.id,
      'fine_number', f.fine_number,
      'profile_id', f.profile_id,
      'display_name', p.display_name,
      'nexus_id', p.nexus_id,
      'case_number', c.case_number,
      'reason', f.reason,
      'amount', f.amount,
      'status', f.status,
      'issued_by_name', issuer.display_name,
      'issued_at', f.issued_at,
      'changed_at', f.changed_at,
      'row_version', f.row_version
    ) order by (f.status='open') desc, f.issued_at desc)
    from public.police_fines f
    join public.profiles p on p.id = f.profile_id
    left join public.police_cases c on c.id = f.case_id
    left join public.profiles issuer on issuer.id = f.issued_by
    where needle = ''
       or f.fine_number ilike '%' || needle || '%'
       or p.display_name ilike '%' || needle || '%'
       or coalesce(p.nexus_id,'') ilike '%' || needle || '%'
       or f.reason ilike '%' || needle || '%'
       or coalesce(c.case_number,'') ilike '%' || needle || '%'
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_fines(text) from public, anon;
grant execute on function public.police_list_fines(text) to authenticated;

create or replace function public.police_issue_fine(
  target_profile uuid,
  fine_reason text,
  fine_amount numeric,
  linked_case_number text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  linked_case uuid;
  row public.police_fines%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.fines.manage') then raise exception 'missing Police permission'; end if;
  if not exists (select 1 from public.profiles p where p.id=target_profile and p.account_status='active') then raise exception 'person missing'; end if;
  if char_length(trim(coalesce(fine_reason,''))) < 2 then raise exception 'reason required'; end if;
  if fine_amount is null or fine_amount < 0 then raise exception 'invalid amount'; end if;

  if nullif(trim(coalesce(linked_case_number,'')), '') is not null then
    select c.id into linked_case from public.police_cases c where c.case_number = upper(trim(linked_case_number));
    if linked_case is null then raise exception 'case missing'; end if;
  end if;

  insert into public.police_fines(profile_id, case_id, reason, amount, issued_by)
  values (target_profile, linked_case, trim(fine_reason), fine_amount, auth.uid())
  returning * into row;
  return jsonb_build_object('id', row.id, 'fine_number', row.fine_number);
end;
$$;
revoke all on function public.police_issue_fine(uuid, text, numeric, text) from public, anon;
grant execute on function public.police_issue_fine(uuid, text, numeric, text) to authenticated;

create or replace function public.police_set_fine_status(target_fine uuid, next_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.fines.manage') then raise exception 'missing Police permission'; end if;
  if next_status not in ('paid','waived','cancelled') then raise exception 'invalid status'; end if;

  update public.police_fines
  set status = next_status, changed_by=auth.uid(), changed_at=now(), updated_at=now(), row_version=row_version+1
  where id=target_fine and status='open';
  if not found then raise exception 'fine missing or already closed'; end if;
end;
$$;
revoke all on function public.police_set_fine_status(uuid, text) from public, anon;
grant execute on function public.police_set_fine_status(uuid, text) to authenticated;

create or replace function public.police_list_warrants(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := trim(coalesce(search_text,''));
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.warrants.manage') then raise exception 'missing Police permission'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', w.id,
      'warrant_number', w.warrant_number,
      'profile_id', w.profile_id,
      'display_name', p.display_name,
      'nexus_id', p.nexus_id,
      'case_number', c.case_number,
      'reason', w.reason,
      'note', w.note,
      'status', w.status,
      'issued_by_name', issuer.display_name,
      'issued_at', w.issued_at,
      'closed_by_name', closer.display_name,
      'closed_at', w.closed_at,
      'close_reason', w.close_reason,
      'row_version', w.row_version
    ) order by (w.status='active') desc, w.issued_at desc)
    from public.police_warrants w
    join public.profiles p on p.id = w.profile_id
    left join public.police_cases c on c.id = w.case_id
    left join public.profiles issuer on issuer.id = w.issued_by
    left join public.profiles closer on closer.id = w.closed_by
    where needle = ''
       or w.warrant_number ilike '%' || needle || '%'
       or p.display_name ilike '%' || needle || '%'
       or coalesce(p.nexus_id,'') ilike '%' || needle || '%'
       or w.reason ilike '%' || needle || '%'
       or coalesce(c.case_number,'') ilike '%' || needle || '%'
  ), '[]'::jsonb);
end;
$$;
revoke all on function public.police_list_warrants(text) from public, anon;
grant execute on function public.police_list_warrants(text) to authenticated;

create or replace function public.police_issue_warrant(
  target_profile uuid,
  warrant_reason text,
  warrant_note text default null,
  linked_case_number text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  linked_case uuid;
  row public.police_warrants%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.warrants.manage') then raise exception 'missing Police permission'; end if;
  if not exists (select 1 from public.profiles p where p.id=target_profile and p.account_status='active') then raise exception 'person missing'; end if;
  if char_length(trim(coalesce(warrant_reason,''))) < 2 then raise exception 'reason required'; end if;

  if nullif(trim(coalesce(linked_case_number,'')), '') is not null then
    select c.id into linked_case from public.police_cases c where c.case_number = upper(trim(linked_case_number));
    if linked_case is null then raise exception 'case missing'; end if;
  end if;

  insert into public.police_warrants(profile_id, case_id, reason, note, issued_by)
  values (target_profile, linked_case, trim(warrant_reason), nullif(trim(coalesce(warrant_note,'')), ''), auth.uid())
  returning * into row;
  return jsonb_build_object('id', row.id, 'warrant_number', row.warrant_number);
end;
$$;
revoke all on function public.police_issue_warrant(uuid, text, text, text) from public, anon;
grant execute on function public.police_issue_warrant(uuid, text, text, text) to authenticated;

create or replace function public.police_close_warrant(target_warrant uuid, next_status text, close_reason text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.warrants.manage') then raise exception 'missing Police permission'; end if;
  if next_status not in ('done','cancelled') then raise exception 'invalid status'; end if;

  update public.police_warrants
  set status=next_status, closed_by=auth.uid(), closed_at=now(), close_reason=nullif(trim(coalesce(close_reason,'')), ''), updated_at=now(), row_version=row_version+1
  where id=target_warrant and status='active';
  if not found then raise exception 'warrant missing or closed'; end if;
end;
$$;
revoke all on function public.police_close_warrant(uuid, text, text) from public, anon;
grant execute on function public.police_close_warrant(uuid, text, text) to authenticated;

-- Extend the lightweight citizen view with the Police quick-tool status.
create or replace function public.police_get_citizen_history(target_profile uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  citizen public.profiles%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.people.search')
     or not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view') then
    raise exception 'missing Police permission';
  end if;

  select p.* into citizen from public.profiles p where p.id=target_profile and p.account_status='active';
  if citizen.id is null then raise exception 'citizen not found'; end if;

  return jsonb_build_object(
    'profile_id', citizen.id,
    'display_name', citizen.display_name,
    'nexus_id', citizen.nexus_id,
    'date_of_birth', citizen.date_of_birth,
    'active_wanted', coalesce((
      select jsonb_agg(jsonb_build_object('wanted_number',w.wanted_number,'reason',w.reason,'note',w.note,'priority',w.priority,'created_at',w.created_at) order by w.created_at desc)
      from public.police_wanted w where w.target_type='person' and w.profile_id=citizen.id and w.status='active'
    ), '[]'::jsonb),
    'active_warrants', coalesce((
      select jsonb_agg(jsonb_build_object('warrant_number',w.warrant_number,'reason',w.reason,'note',w.note,'case_number',c.case_number,'issued_at',w.issued_at) order by w.issued_at desc)
      from public.police_warrants w left join public.police_cases c on c.id=w.case_id where w.profile_id=citizen.id and w.status='active'
    ), '[]'::jsonb),
    'fines', coalesce((
      select jsonb_agg(jsonb_build_object('fine_number',f.fine_number,'reason',f.reason,'amount',f.amount,'status',f.status,'case_number',c.case_number,'issued_at',f.issued_at) order by f.issued_at desc)
      from public.police_fines f left join public.police_cases c on c.id=f.case_id where f.profile_id=citizen.id
    ), '[]'::jsonb),
    'cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id,
        'case_number', c.case_number,
        'title', c.title,
        'state', case when c.status in ('completed','archived') then 'done' else 'open' end,
        'summary', c.summary,
        'actions_text', c.actions_text,
        'evidence_text', c.evidence_text,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'roles', coalesce((select jsonb_agg(r.person_role order by r.person_role) from (select distinct cp2.person_role from public.police_case_people cp2 where cp2.case_id=c.id and cp2.profile_id=citizen.id and cp2.is_active=true) r), '[]'::jsonb)
      ) order by c.updated_at desc)
      from public.police_cases c
      where exists(select 1 from public.police_case_people cp where cp.case_id=c.id and cp.profile_id=citizen.id and cp.is_active=true)
    ), '[]'::jsonb)
  );
end;
$$;
revoke all on function public.police_get_citizen_history(uuid) from public, anon;
grant execute on function public.police_get_citizen_history(uuid) to authenticated;
