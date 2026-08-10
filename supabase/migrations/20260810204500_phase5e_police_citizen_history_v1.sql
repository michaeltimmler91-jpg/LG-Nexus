-- LG Nexus V1
-- Phase 5E: lightweight citizen history for Police.

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
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  if not private.has_service_permission_for(auth.uid(), 'police', 'police.people.search')
     or not private.has_service_permission_for(auth.uid(), 'police', 'police.cases.view') then
    raise exception 'missing Police permission';
  end if;

  select p.* into citizen
  from public.profiles p
  where p.id = target_profile
    and p.account_status = 'active';

  if citizen.id is null then
    raise exception 'citizen not found';
  end if;

  return jsonb_build_object(
    'profile_id', citizen.id,
    'display_name', citizen.display_name,
    'nexus_id', citizen.nexus_id,
    'date_of_birth', citizen.date_of_birth,
    'cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id,
        'case_number', c.case_number,
        'title', c.title,
        'state', case when c.status in ('completed', 'archived') then 'done' else 'open' end,
        'summary', c.summary,
        'actions_text', c.actions_text,
        'evidence_text', c.evidence_text,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'roles', coalesce((
          select jsonb_agg(r.person_role order by r.person_role)
          from (
            select distinct cp_role.person_role
            from public.police_case_people cp_role
            where cp_role.case_id = c.id
              and cp_role.profile_id = citizen.id
              and cp_role.is_active = true
          ) r
        ), '[]'::jsonb)
      ) order by c.updated_at desc)
      from public.police_cases c
      where exists (
        select 1
        from public.police_case_people cp
        where cp.case_id = c.id
          and cp.profile_id = citizen.id
          and cp.is_active = true
      )
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.police_get_citizen_history(uuid) from public, anon;
grant execute on function public.police_get_citizen_history(uuid) to authenticated;
