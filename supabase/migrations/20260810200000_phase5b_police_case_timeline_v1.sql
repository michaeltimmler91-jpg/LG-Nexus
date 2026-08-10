-- LG Nexus V1
-- Phase 5B: immutable Police case timeline and investigation notes.

create table if not exists public.police_case_timeline (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.police_cases(id) on delete cascade,
  entry_type text not null,
  body text,
  from_status text,
  to_status text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint police_case_timeline_entry_type_check check (entry_type in ('created', 'note', 'status')),
  constraint police_case_timeline_status_check check (
    (from_status is null or from_status in ('new', 'investigation', 'review', 'completed', 'archived'))
    and (to_status is null or to_status in ('new', 'investigation', 'review', 'completed', 'archived'))
  )
);

create index if not exists police_case_timeline_case_idx
  on public.police_case_timeline(case_id, created_at desc);
create index if not exists police_case_timeline_created_by_idx
  on public.police_case_timeline(created_by);

alter table public.police_case_timeline enable row level security;
revoke all on table public.police_case_timeline from anon, authenticated;

create or replace function private.police_case_timeline_on_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.police_case_timeline (case_id, entry_type, body, to_status, created_by, created_at)
  values (new.id, 'created', 'Fall angelegt', new.status, coalesce(new.created_by, auth.uid()), new.created_at);
  return new;
end;
$$;

revoke all on function private.police_case_timeline_on_insert() from public, anon, authenticated;

drop trigger if exists police_cases_timeline_after_insert on public.police_cases;
create trigger police_cases_timeline_after_insert
after insert on public.police_cases
for each row execute function private.police_case_timeline_on_insert();

create or replace function private.police_case_timeline_on_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status is distinct from new.status then
    insert into public.police_case_timeline (case_id, entry_type, body, from_status, to_status, created_by)
    values (new.id, 'status', 'Fallstatus geändert', old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

revoke all on function private.police_case_timeline_on_status_change() from public, anon, authenticated;

drop trigger if exists police_cases_timeline_after_status_change on public.police_cases;
create trigger police_cases_timeline_after_status_change
after update of status on public.police_cases
for each row execute function private.police_case_timeline_on_status_change();

insert into public.police_case_timeline (case_id, entry_type, body, to_status, created_by, created_at)
select c.id, 'created', 'Fall angelegt', c.status, c.created_by, c.created_at
from public.police_cases c
where not exists (
  select 1
  from public.police_case_timeline t
  where t.case_id = c.id and t.entry_type = 'created'
);

create or replace function public.police_list_case_timeline(target_case_number text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view') then
    raise exception 'missing permission: police.cases.view';
  end if;

  select c.id into target_id
  from public.police_cases c
  where c.case_number = trim(coalesce(target_case_number, ''));

  if target_id is null then raise exception 'case not found'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', t.id,
      'entry_type', t.entry_type,
      'body', t.body,
      'from_status', t.from_status,
      'to_status', t.to_status,
      'author_name', p.display_name,
      'created_at', t.created_at
    ) order by t.created_at desc, t.id desc)
    from public.police_case_timeline t
    left join public.profiles p on p.id = t.created_by
    where t.case_id = target_id
  ), '[]'::jsonb);
end;
$$;

revoke all on function public.police_list_case_timeline(text) from public, anon;
grant execute on function public.police_list_case_timeline(text) to authenticated;

create or replace function public.police_add_case_note(target_case_number text, note_text text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_case public.police_cases%rowtype;
  clean_note text := trim(coalesce(note_text, ''));
  new_entry public.police_case_timeline%rowtype;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.edit') then
    raise exception 'missing permission: police.cases.edit';
  end if;
  if char_length(clean_note) < 2 then raise exception 'note required'; end if;
  if char_length(clean_note) > 4000 then raise exception 'note too long'; end if;

  select * into target_case
  from public.police_cases c
  where c.case_number = trim(coalesce(target_case_number, ''))
  for update;

  if target_case.id is null then raise exception 'case not found'; end if;
  if target_case.status in ('completed', 'archived') then raise exception 'case is closed'; end if;

  insert into public.police_case_timeline (case_id, entry_type, body, created_by)
  values (target_case.id, 'note', clean_note, auth.uid())
  returning * into new_entry;

  update public.police_cases
  set updated_at = now()
  where id = target_case.id;

  return jsonb_build_object('id', new_entry.id, 'created_at', new_entry.created_at);
end;
$$;

revoke all on function public.police_add_case_note(text, text) from public, anon;
grant execute on function public.police_add_case_note(text, text) to authenticated;
