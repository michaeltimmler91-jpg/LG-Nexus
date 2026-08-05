alter function public.set_updated_at() set search_path = '';

revoke execute on function public.is_org_manager(uuid) from public;
