create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_org_manager(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_org
      and om.user_id = (select auth.uid())
      and om.is_manager = true
      and om.is_active = true
  );
$$;

revoke all on function private.is_org_manager(uuid) from public, anon;
grant execute on function private.is_org_manager(uuid) to authenticated;

alter policy "managers_can_update_organization"
on public.organizations
using ((select private.is_org_manager(id)))
with check ((select private.is_org_manager(id)));

alter policy "members_can_read_own_membership"
on public.organization_members
using (
  user_id = (select auth.uid())
  or (select private.is_org_manager(organization_id))
);

alter policy "managers_can_add_members"
on public.organization_members
with check ((select private.is_org_manager(organization_id)));

alter policy "managers_can_update_members"
on public.organization_members
using ((select private.is_org_manager(organization_id)))
with check ((select private.is_org_manager(organization_id)));

alter policy "managers_can_remove_members"
on public.organization_members
using ((select private.is_org_manager(organization_id)));

alter policy "managers_can_add_status_history"
on public.organization_status_history
with check (
  (select private.is_org_manager(organization_id))
  and changed_by = (select auth.uid())
);

drop function if exists public.is_org_manager(uuid);
