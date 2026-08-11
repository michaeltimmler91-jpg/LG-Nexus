-- LG Nexus · Phase 6A
-- Simple Fire & Rescue workspace for incidents, objects, assets and knowledge.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('fire.incidents.view', 'fire', 'Einsätze ansehen', 'Darf Fire-&-Rescue-Einsätze ansehen.', true, true),
  ('fire.incidents.manage', 'fire', 'Einsätze bearbeiten', 'Darf Fire-&-Rescue-Einsätze anlegen und bearbeiten.', true, true),
  ('fire.objects.view', 'fire', 'Objekte ansehen', 'Darf interne Objektinformationen ansehen.', true, true),
  ('fire.objects.manage', 'fire', 'Objekte bearbeiten', 'Darf interne Objektinformationen pflegen.', true, true),
  ('fire.assets.view', 'fire', 'Fahrzeuge und Geräte ansehen', 'Darf Fahrzeuge und Geräte ansehen.', true, true),
  ('fire.assets.manage', 'fire', 'Fahrzeuge und Geräte bearbeiten', 'Darf Fahrzeuge und Geräte pflegen.', true, true),
  ('fire.knowledge.view', 'fire', 'Wissen ansehen', 'Darf die interne Wissenssammlung ansehen.', true, true),
  ('fire.knowledge.manage', 'fire', 'Wissen bearbeiten', 'Darf die interne Wissenssammlung pflegen.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

insert into public.organization_role_permissions (role_id, permission_key)
select r.id, p.key
from public.organization_roles r
join public.organizations o on o.id = r.organization_id
cross join public.permissions p
where o.service_module = 'fire'
  and r.is_active is true
  and (r.is_standard is true or r.is_owner is true)
  and p.key in (
    'fire.access',
    'fire.incidents.view', 'fire.incidents.manage',
    'fire.objects.view', 'fire.objects.manage',
    'fire.assets.view', 'fire.assets.manage',
    'fire.knowledge.view', 'fire.knowledge.manage'
  )
on conflict (role_id, permission_key) do nothing;

create sequence if not exists public.fire_incident_number_seq start with 1 increment by 1;
revoke all on sequence public.fire_incident_number_seq from public, anon, authenticated;

create table if not exists public.fire_incidents (
  id uuid primary key default gen_random_uuid(),
  incident_number text not null unique default ('FD-' || lpad(nextval('public.fire_incident_number_seq')::text, 6, '0')),
  incident_type text not null check (char_length(trim(incident_type)) between 2 and 100),
  location text not null check (char_length(trim(location)) between 2 and 180),
  units_text text,
  vehicles_text text,
  situation_text text,
  actions_text text,
  state text not null default 'open' check (state in ('open', 'done')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  row_version bigint not null default 1,
  check (units_text is null or char_length(units_text) <= 4000),
  check (vehicles_text is null or char_length(vehicles_text) <= 4000),
  check (situation_text is null or char_length(situation_text) <= 8000),
  check (actions_text is null or char_length(actions_text) <= 8000)
);

create index if not exists fire_incidents_state_updated_idx on public.fire_incidents (state, updated_at desc);

create table if not exists public.fire_incident_timeline (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.fire_incidents(id) on delete cascade,
  entry_type text not null default 'note' check (entry_type in ('created', 'note', 'status')),
  body text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (body is null or char_length(body) <= 4000)
);

create index if not exists fire_incident_timeline_incident_idx on public.fire_incident_timeline (incident_id, created_at desc);

create table if not exists public.fire_objects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  address text,
  access_text text,
  hydrant_text text,
  hazards_text text,
  notes_text text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1,
  check (address is null or char_length(address) <= 240),
  check (access_text is null or char_length(access_text) <= 4000),
  check (hydrant_text is null or char_length(hydrant_text) <= 4000),
  check (hazards_text is null or char_length(hazards_text) <= 4000),
  check (notes_text is null or char_length(notes_text) <= 4000)
);

create index if not exists fire_objects_updated_idx on public.fire_objects (updated_at desc);

create table if not exists public.fire_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (asset_type in ('vehicle', 'equipment')),
  name text not null check (char_length(trim(name)) between 2 and 160),
  identifier text,
  status text not null default 'ready' check (status in ('ready', 'defect', 'maintenance', 'out')),
  note text,
  checklist_text text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1,
  check (identifier is null or char_length(identifier) <= 120),
  check (note is null or char_length(note) <= 4000),
  check (checklist_text is null or char_length(checklist_text) <= 6000)
);

create index if not exists fire_assets_status_updated_idx on public.fire_assets (status, updated_at desc);

create table if not exists public.fire_knowledge (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 180),
  category text,
  body text not null check (char_length(trim(body)) between 2 and 12000),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version bigint not null default 1,
  check (category is null or char_length(category) <= 100)
);

create index if not exists fire_knowledge_updated_idx on public.fire_knowledge (updated_at desc);

alter table public.fire_incidents enable row level security;
alter table public.fire_incident_timeline enable row level security;
alter table public.fire_objects enable row level security;
alter table public.fire_assets enable row level security;
alter table public.fire_knowledge enable row level security;

revoke all on public.fire_incidents from public, anon, authenticated;
revoke all on public.fire_incident_timeline from public, anon, authenticated;
revoke all on public.fire_objects from public, anon, authenticated;
revoke all on public.fire_assets from public, anon, authenticated;
revoke all on public.fire_knowledge from public, anon, authenticated;

create or replace function public.fire_get_my_context()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'can_open', private.has_service_permission_for(auth.uid(), 'fire', 'fire.access'),
    'can_view_incidents', private.has_service_permission_for(auth.uid(), 'fire', 'fire.incidents.view'),
    'can_manage_incidents', private.has_service_permission_for(auth.uid(), 'fire', 'fire.incidents.manage'),
    'can_view_objects', private.has_service_permission_for(auth.uid(), 'fire', 'fire.objects.view'),
    'can_manage_objects', private.has_service_permission_for(auth.uid(), 'fire', 'fire.objects.manage'),
    'can_view_assets', private.has_service_permission_for(auth.uid(), 'fire', 'fire.assets.view'),
    'can_manage_assets', private.has_service_permission_for(auth.uid(), 'fire', 'fire.assets.manage'),
    'can_view_knowledge', private.has_service_permission_for(auth.uid(), 'fire', 'fire.knowledge.view'),
    'can_manage_knowledge', private.has_service_permission_for(auth.uid(), 'fire', 'fire.knowledge.manage')
  );
$$;

create or replace function public.fire_list_incidents(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.incidents.view') then
    raise exception 'not_allowed';
  end if;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', i.id,
        'incident_number', i.incident_number,
        'incident_type', i.incident_type,
        'location', i.location,
        'units_text', i.units_text,
        'vehicles_text', i.vehicles_text,
        'situation_text', i.situation_text,
        'actions_text', i.actions_text,
        'state', i.state,
        'created_by_name', creator.display_name,
        'created_at', i.created_at,
        'updated_at', i.updated_at,
        'row_version', i.row_version,
        'timeline', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', t.id,
            'entry_type', t.entry_type,
            'body', t.body,
            'author_name', author.display_name,
            'created_at', t.created_at
          ) order by t.created_at desc)
          from public.fire_incident_timeline t
          left join public.profiles author on author.id = t.created_by
          where t.incident_id = i.id
        ), '[]'::jsonb)
      ) order by (i.state = 'open') desc, i.updated_at desc
    )
    from public.fire_incidents i
    left join public.profiles creator on creator.id = i.created_by
    where needle is null
       or i.incident_number ilike '%' || needle || '%'
       or i.incident_type ilike '%' || needle || '%'
       or i.location ilike '%' || needle || '%'
       or coalesce(i.units_text, '') ilike '%' || needle || '%'
       or coalesce(i.vehicles_text, '') ilike '%' || needle || '%'
       or coalesce(i.situation_text, '') ilike '%' || needle || '%'
  ), '[]'::jsonb);
end;
$$;

create or replace function public.fire_create_incident(
  incident_type text,
  incident_location text,
  incident_units text default null,
  incident_vehicles text default null,
  incident_situation text default null,
  incident_actions text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
  new_number text;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.incidents.manage') then
    raise exception 'not_allowed';
  end if;
  if char_length(trim(incident_type)) < 2 or char_length(trim(incident_location)) < 2 then
    raise exception 'invalid_input';
  end if;

  insert into public.fire_incidents (
    incident_type, location, units_text, vehicles_text, situation_text, actions_text, created_by
  ) values (
    trim(incident_type), trim(incident_location), nullif(trim(incident_units), ''), nullif(trim(incident_vehicles), ''),
    nullif(trim(incident_situation), ''), nullif(trim(incident_actions), ''), auth.uid()
  ) returning id, incident_number into new_id, new_number;

  insert into public.fire_incident_timeline (incident_id, entry_type, body, created_by)
  values (new_id, 'created', 'Einsatz angelegt.', auth.uid());

  return jsonb_build_object('id', new_id, 'incident_number', new_number);
end;
$$;

create or replace function public.fire_update_incident(
  target_incident uuid,
  incident_type text,
  incident_location text,
  incident_units text default null,
  incident_vehicles text default null,
  incident_situation text default null,
  incident_actions text default null,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_row public.fire_incidents;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.incidents.manage') then
    raise exception 'not_allowed';
  end if;
  if char_length(trim(incident_type)) < 2 or char_length(trim(incident_location)) < 2 then
    raise exception 'invalid_input';
  end if;

  update public.fire_incidents
  set incident_type = trim(fire_update_incident.incident_type),
      location = trim(fire_update_incident.incident_location),
      units_text = nullif(trim(fire_update_incident.incident_units), ''),
      vehicles_text = nullif(trim(fire_update_incident.incident_vehicles), ''),
      situation_text = nullif(trim(fire_update_incident.incident_situation), ''),
      actions_text = nullif(trim(fire_update_incident.incident_actions), ''),
      updated_at = now(),
      row_version = row_version + 1
  where id = target_incident
    and state = 'open'
    and (expected_row_version is null or row_version = expected_row_version)
  returning * into updated_row;

  if updated_row.id is null then raise exception 'conflict_or_closed'; end if;
  return jsonb_build_object('id', updated_row.id, 'row_version', updated_row.row_version);
end;
$$;

create or replace function public.fire_set_incident_state(
  target_incident uuid,
  next_state text,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_state text;
  updated_version bigint;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.incidents.manage') then
    raise exception 'not_allowed';
  end if;
  if next_state not in ('open', 'done') then raise exception 'invalid_state'; end if;

  select state into previous_state from public.fire_incidents where id = target_incident;
  if previous_state is null then raise exception 'not_found'; end if;

  update public.fire_incidents
  set state = next_state,
      completed_at = case when next_state = 'done' then now() else null end,
      updated_at = now(),
      row_version = row_version + 1
  where id = target_incident
    and (expected_row_version is null or row_version = expected_row_version)
  returning row_version into updated_version;

  if updated_version is null then raise exception 'conflict'; end if;

  if previous_state is distinct from next_state then
    insert into public.fire_incident_timeline (incident_id, entry_type, body, created_by)
    values (target_incident, 'status', case when next_state = 'done' then 'Einsatz abgeschlossen.' else 'Einsatz wieder geöffnet.' end, auth.uid());
  end if;

  return jsonb_build_object('id', target_incident, 'row_version', updated_version, 'state', next_state);
end;
$$;

create or replace function public.fire_add_incident_note(target_incident uuid, note_text text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.incidents.manage') then
    raise exception 'not_allowed';
  end if;
  if char_length(trim(note_text)) < 2 or char_length(note_text) > 4000 then raise exception 'invalid_note'; end if;
  if not exists (select 1 from public.fire_incidents where id = target_incident and state = 'open') then raise exception 'closed_or_missing'; end if;

  insert into public.fire_incident_timeline (incident_id, entry_type, body, created_by)
  values (target_incident, 'note', trim(note_text), auth.uid()) returning id into new_id;

  update public.fire_incidents set updated_at = now(), row_version = row_version + 1 where id = target_incident;
  return new_id;
end;
$$;

create or replace function public.fire_list_objects(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.objects.view') then raise exception 'not_allowed'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', o.id, 'name', o.name, 'address', o.address, 'access_text', o.access_text,
    'hydrant_text', o.hydrant_text, 'hazards_text', o.hazards_text, 'notes_text', o.notes_text,
    'updated_by_name', p.display_name, 'updated_at', o.updated_at, 'row_version', o.row_version
  ) order by o.updated_at desc)
  from public.fire_objects o left join public.profiles p on p.id = o.updated_by
  where needle is null or o.name ilike '%'||needle||'%' or coalesce(o.address,'') ilike '%'||needle||'%' or coalesce(o.hazards_text,'') ilike '%'||needle||'%'), '[]'::jsonb);
end;
$$;

create or replace function public.fire_save_object(
  target_object uuid default null,
  object_name text default null,
  object_address text default null,
  object_access text default null,
  object_hydrant text default null,
  object_hazards text default null,
  object_notes text default null,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare saved public.fire_objects;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.objects.manage') then raise exception 'not_allowed'; end if;
  if char_length(trim(object_name)) < 2 then raise exception 'invalid_name'; end if;

  if target_object is null then
    insert into public.fire_objects(name,address,access_text,hydrant_text,hazards_text,notes_text,created_by,updated_by)
    values(trim(object_name),nullif(trim(object_address),''),nullif(trim(object_access),''),nullif(trim(object_hydrant),''),nullif(trim(object_hazards),''),nullif(trim(object_notes),''),auth.uid(),auth.uid())
    returning * into saved;
  else
    update public.fire_objects
    set name=trim(object_name), address=nullif(trim(object_address),''), access_text=nullif(trim(object_access),''), hydrant_text=nullif(trim(object_hydrant),''),
        hazards_text=nullif(trim(object_hazards),''), notes_text=nullif(trim(object_notes),''), updated_by=auth.uid(), updated_at=now(), row_version=row_version+1
    where id=target_object and (expected_row_version is null or row_version=expected_row_version)
    returning * into saved;
    if saved.id is null then raise exception 'conflict_or_missing'; end if;
  end if;
  return jsonb_build_object('id', saved.id, 'row_version', saved.row_version);
end;
$$;

create or replace function public.fire_list_assets(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.assets.view') then raise exception 'not_allowed'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', a.id, 'asset_type', a.asset_type, 'name', a.name, 'identifier', a.identifier, 'status', a.status,
    'note', a.note, 'checklist_text', a.checklist_text, 'updated_by_name', p.display_name, 'updated_at', a.updated_at, 'row_version', a.row_version
  ) order by (a.status='ready') asc, a.updated_at desc)
  from public.fire_assets a left join public.profiles p on p.id=a.updated_by
  where needle is null or a.name ilike '%'||needle||'%' or coalesce(a.identifier,'') ilike '%'||needle||'%' or coalesce(a.note,'') ilike '%'||needle||'%'), '[]'::jsonb);
end;
$$;

create or replace function public.fire_save_asset(
  target_asset uuid default null,
  asset_type text default 'vehicle',
  asset_name text default null,
  asset_identifier text default null,
  asset_status text default 'ready',
  asset_note text default null,
  asset_checklist text default null,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare saved public.fire_assets;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.assets.manage') then raise exception 'not_allowed'; end if;
  if asset_type not in ('vehicle','equipment') or asset_status not in ('ready','defect','maintenance','out') or char_length(trim(asset_name)) < 2 then raise exception 'invalid_input'; end if;
  if target_asset is null then
    insert into public.fire_assets(asset_type,name,identifier,status,note,checklist_text,created_by,updated_by)
    values(asset_type,trim(asset_name),nullif(trim(asset_identifier),''),asset_status,nullif(trim(asset_note),''),nullif(trim(asset_checklist),''),auth.uid(),auth.uid()) returning * into saved;
  else
    update public.fire_assets set asset_type=fire_save_asset.asset_type,name=trim(asset_name),identifier=nullif(trim(asset_identifier),''),status=asset_status,
      note=nullif(trim(asset_note),''),checklist_text=nullif(trim(asset_checklist),''),updated_by=auth.uid(),updated_at=now(),row_version=row_version+1
    where id=target_asset and (expected_row_version is null or row_version=expected_row_version) returning * into saved;
    if saved.id is null then raise exception 'conflict_or_missing'; end if;
  end if;
  return jsonb_build_object('id',saved.id,'row_version',saved.row_version);
end;
$$;

create or replace function public.fire_list_knowledge(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.knowledge.view') then raise exception 'not_allowed'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', k.id, 'title', k.title, 'category', k.category, 'body', k.body, 'updated_by_name', p.display_name, 'updated_at', k.updated_at, 'row_version', k.row_version
  ) order by k.updated_at desc)
  from public.fire_knowledge k left join public.profiles p on p.id=k.updated_by
  where needle is null or k.title ilike '%'||needle||'%' or coalesce(k.category,'') ilike '%'||needle||'%' or k.body ilike '%'||needle||'%'), '[]'::jsonb);
end;
$$;

create or replace function public.fire_save_knowledge(
  target_article uuid default null,
  article_title text default null,
  article_category text default null,
  article_body text default null,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare saved public.fire_knowledge;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'fire', 'fire.knowledge.manage') then raise exception 'not_allowed'; end if;
  if char_length(trim(article_title)) < 2 or char_length(trim(article_body)) < 2 then raise exception 'invalid_input'; end if;
  if target_article is null then
    insert into public.fire_knowledge(title,category,body,created_by,updated_by)
    values(trim(article_title),nullif(trim(article_category),''),trim(article_body),auth.uid(),auth.uid()) returning * into saved;
  else
    update public.fire_knowledge set title=trim(article_title),category=nullif(trim(article_category),''),body=trim(article_body),updated_by=auth.uid(),updated_at=now(),row_version=row_version+1
    where id=target_article and (expected_row_version is null or row_version=expected_row_version) returning * into saved;
    if saved.id is null then raise exception 'conflict_or_missing'; end if;
  end if;
  return jsonb_build_object('id',saved.id,'row_version',saved.row_version);
end;
$$;

revoke all on function public.fire_get_my_context() from public, anon;
revoke all on function public.fire_list_incidents(text) from public, anon;
revoke all on function public.fire_create_incident(text,text,text,text,text,text) from public, anon;
revoke all on function public.fire_update_incident(uuid,text,text,text,text,text,text,bigint) from public, anon;
revoke all on function public.fire_set_incident_state(uuid,text,bigint) from public, anon;
revoke all on function public.fire_add_incident_note(uuid,text) from public, anon;
revoke all on function public.fire_list_objects(text) from public, anon;
revoke all on function public.fire_save_object(uuid,text,text,text,text,text,text,bigint) from public, anon;
revoke all on function public.fire_list_assets(text) from public, anon;
revoke all on function public.fire_save_asset(uuid,text,text,text,text,text,text,bigint) from public, anon;
revoke all on function public.fire_list_knowledge(text) from public, anon;
revoke all on function public.fire_save_knowledge(uuid,text,text,text,bigint) from public, anon;

grant execute on function public.fire_get_my_context() to authenticated;
grant execute on function public.fire_list_incidents(text) to authenticated;
grant execute on function public.fire_create_incident(text,text,text,text,text,text) to authenticated;
grant execute on function public.fire_update_incident(uuid,text,text,text,text,text,text,bigint) to authenticated;
grant execute on function public.fire_set_incident_state(uuid,text,bigint) to authenticated;
grant execute on function public.fire_add_incident_note(uuid,text) to authenticated;
grant execute on function public.fire_list_objects(text) to authenticated;
grant execute on function public.fire_save_object(uuid,text,text,text,text,text,text,bigint) to authenticated;
grant execute on function public.fire_list_assets(text) to authenticated;
grant execute on function public.fire_save_asset(uuid,text,text,text,text,text,text,bigint) to authenticated;
grant execute on function public.fire_list_knowledge(text) to authenticated;
grant execute on function public.fire_save_knowledge(uuid,text,text,text,bigint) to authenticated;
