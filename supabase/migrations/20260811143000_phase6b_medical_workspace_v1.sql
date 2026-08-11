-- LG Nexus · Phase 6B
-- Modern Medical workspace: clear sections, global follow-ups and internal knowledge.

insert into public.permissions (key, module, name, description, is_sensitive, is_active)
values
  ('medical.knowledge.view', 'medical', 'Wissen ansehen', 'Darf die interne Medical-Wissenssammlung ansehen.', true, true),
  ('medical.knowledge.manage', 'medical', 'Wissen bearbeiten', 'Darf die interne Medical-Wissenssammlung pflegen.', true, true)
on conflict (key) do update
set module = excluded.module,
    name = excluded.name,
    description = excluded.description,
    is_sensitive = excluded.is_sensitive,
    is_active = true;

-- The normal Medical service role should be usable without leadership powers.
insert into public.organization_role_permissions (role_id, permission_key)
select r.id, p.key
from public.organization_roles r
join public.organizations o on o.id = r.organization_id
cross join public.permissions p
where o.service_module = 'medical'
  and r.is_active is true
  and r.is_standard is true
  and p.key in (
    'medical.access',
    'medical.records.view',
    'medical.records.edit',
    'medical.treatments.create',
    'medical.treatments.edit',
    'medical.knowledge.view'
  )
on conflict (role_id, permission_key) do nothing;

create table if not exists public.medical_knowledge (
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

create index if not exists medical_knowledge_updated_idx on public.medical_knowledge (updated_at desc);
create index if not exists medical_knowledge_created_by_idx on public.medical_knowledge (created_by);
create index if not exists medical_knowledge_updated_by_idx on public.medical_knowledge (updated_by);

alter table public.medical_knowledge enable row level security;
revoke all on public.medical_knowledge from public, anon, authenticated;

drop trigger if exists medical_knowledge_updated_at on public.medical_knowledge;
create trigger medical_knowledge_updated_at
before update on public.medical_knowledge
for each row execute function public.set_updated_at();

drop trigger if exists medical_knowledge_row_version on public.medical_knowledge;
create trigger medical_knowledge_row_version
before update on public.medical_knowledge
for each row execute function private.increment_row_version();

create or replace function public.medical_workspace_get_context()
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
    'can_manage_templates', private.has_service_permission_for(auth.uid(), 'medical', 'medical.templates.manage'),
    'can_view_knowledge', private.has_service_permission_for(auth.uid(), 'medical', 'medical.knowledge.view'),
    'can_manage_knowledge', private.has_service_permission_for(auth.uid(), 'medical', 'medical.knowledge.manage')
  );
$$;

create or replace function public.medical_list_open_followups(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'medical', 'medical.records.view') then
    raise exception 'not_allowed';
  end if;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'treatment_id', t.id,
        'treatment_number', t.treatment_number,
        'patient_id', p.id,
        'patient_name', p.display_name,
        'nexus_id', p.nexus_id,
        'record_number', r.record_number,
        'performed_text', coalesce(t.performed_text, t.summary, 'Behandlung dokumentiert.'),
        'followup_mode', t.followup_mode,
        'followup_from', t.followup_from,
        'followup_to', t.followup_to,
        'followup_checkpoints', coalesce(t.followup_checkpoints, '{}'::text[]),
        'treated_by_name', actor.display_name,
        'created_at', t.created_at,
        'row_version', t.row_version
      ) order by t.followup_from nulls last, t.created_at
    )
    from public.medical_treatments t
    join public.medical_records r on r.id = t.record_id
    join public.profiles p on p.id = r.profile_id
    left join public.profiles actor on actor.id = coalesce(t.completed_by, t.created_by, t.responsible_profile_id)
    where t.followup_required is true
      and t.followup_attended_at is null
      and (
        needle is null
        or p.display_name ilike '%' || needle || '%'
        or coalesce(p.nexus_id, '') ilike '%' || needle || '%'
        or coalesce(r.record_number, '') ilike '%' || needle || '%'
        or coalesce(t.treatment_number, '') ilike '%' || needle || '%'
      )
  ), '[]'::jsonb);
end;
$$;

create or replace function public.medical_list_knowledge(search_text text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  needle text := nullif(trim(search_text), '');
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'medical', 'medical.knowledge.view') then
    raise exception 'not_allowed';
  end if;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', k.id,
        'title', k.title,
        'category', k.category,
        'body', k.body,
        'updated_by_name', updater.display_name,
        'updated_at', k.updated_at,
        'row_version', k.row_version
      ) order by lower(coalesce(k.category, '')), lower(k.title)
    )
    from public.medical_knowledge k
    left join public.profiles updater on updater.id = coalesce(k.updated_by, k.created_by)
    where needle is null
       or k.title ilike '%' || needle || '%'
       or coalesce(k.category, '') ilike '%' || needle || '%'
       or k.body ilike '%' || needle || '%'
  ), '[]'::jsonb);
end;
$$;

create or replace function public.medical_save_knowledge(
  target_article uuid,
  article_title text,
  article_category text,
  article_body text,
  expected_row_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_title text := trim(coalesce(article_title, ''));
  clean_category text := nullif(trim(coalesce(article_category, '')), '');
  clean_body text := trim(coalesce(article_body, ''));
  saved public.medical_knowledge%rowtype;
begin
  if auth.uid() is null or not private.has_service_permission_for(auth.uid(), 'medical', 'medical.knowledge.manage') then
    raise exception 'not_allowed';
  end if;
  if char_length(clean_title) < 2 or char_length(clean_body) < 2 then
    raise exception 'invalid_input';
  end if;

  if target_article is null then
    insert into public.medical_knowledge (title, category, body, created_by, updated_by)
    values (clean_title, clean_category, clean_body, auth.uid(), auth.uid())
    returning * into saved;
  else
    update public.medical_knowledge
    set title = clean_title,
        category = clean_category,
        body = clean_body,
        updated_by = auth.uid()
    where id = target_article
      and row_version = expected_row_version
    returning * into saved;

    if saved.id is null then raise exception 'conflict'; end if;
  end if;

  return jsonb_build_object(
    'id', saved.id,
    'title', saved.title,
    'row_version', saved.row_version
  );
end;
$$;

revoke all on function public.medical_workspace_get_context() from public, anon;
revoke all on function public.medical_list_open_followups(text) from public, anon;
revoke all on function public.medical_list_knowledge(text) from public, anon;
revoke all on function public.medical_save_knowledge(uuid, text, text, text, bigint) from public, anon;

grant execute on function public.medical_workspace_get_context() to authenticated;
grant execute on function public.medical_list_open_followups(text) to authenticated;
grant execute on function public.medical_list_knowledge(text) to authenticated;
grant execute on function public.medical_save_knowledge(uuid, text, text, text, bigint) to authenticated;
