-- LG Nexus V1 – Phase 2C: RLS/read-policy cleanup and FK index hardening

-- -----------------------------------------------------------------------------
-- Organizations: one SELECT policy instead of two permissive policies
-- -----------------------------------------------------------------------------

drop policy if exists public_can_read_public_organizations on public.organizations;
drop policy if exists org_members_can_read_own_organizations on public.organizations;
drop policy if exists organizations_select_public_or_member on public.organizations;

create policy organizations_select_public_or_member
on public.organizations
for select
to anon, authenticated
using (
  is_public = true
  or (select private.is_active_org_member(id))
);

-- -----------------------------------------------------------------------------
-- Cover foreign keys reported by the Supabase performance advisor
-- -----------------------------------------------------------------------------

create index if not exists account_status_history_changed_by_idx
  on public.account_status_history(changed_by);

create index if not exists organization_member_notes_member_profile_idx
  on public.organization_member_notes(member_profile_id);

create index if not exists organization_members_inactive_by_idx
  on public.organization_members(inactive_by);

create index if not exists organization_members_removed_by_idx
  on public.organization_members(removed_by);

create index if not exists organization_members_role_only_idx
  on public.organization_members(role_id);

create index if not exists organization_membership_history_new_role_idx
  on public.organization_membership_history(new_role_id);

create index if not exists organization_membership_history_old_role_idx
  on public.organization_membership_history(old_role_id);

create index if not exists organization_membership_history_profile_only_idx
  on public.organization_membership_history(profile_id);

create index if not exists organization_role_permissions_granted_by_idx
  on public.organization_role_permissions(granted_by);

create index if not exists organization_status_history_changed_by_idx
  on public.organization_status_history(changed_by);

create index if not exists organization_status_history_org_idx
  on public.organization_status_history(organization_id);

create index if not exists profile_blocks_blocked_idx
  on public.profile_blocks(blocked_id);

create index if not exists profile_identity_change_requests_decided_by_idx
  on public.profile_identity_change_requests(decided_by);

create index if not exists profile_identity_change_requests_profile_idx
  on public.profile_identity_change_requests(profile_id);

create index if not exists profile_name_history_change_request_idx
  on public.profile_name_history(change_request_id);

create index if not exists profile_name_history_changed_by_idx
  on public.profile_name_history(changed_by);

create index if not exists profiles_approved_by_idx
  on public.profiles(approved_by);

create index if not exists profiles_rejected_by_idx
  on public.profiles(rejected_by);

create index if not exists system_audit_log_actor_idx
  on public.system_audit_log(actor_profile_id);

create index if not exists system_role_assignments_assigned_by_idx
  on public.system_role_assignments(assigned_by);

create index if not exists system_role_assignments_profile_idx
  on public.system_role_assignments(profile_id);
