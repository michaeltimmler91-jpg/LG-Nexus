drop policy if exists organization_media_delete on storage.objects;
drop policy if exists organization_media_insert on storage.objects;
drop policy if exists organization_media_public_read on storage.objects;
drop policy if exists organization_media_update on storage.objects;

drop function if exists private.can_manage_org_media_path(text);

alter table public.organizations
  drop constraint if exists organizations_logo_url_https_check,
  drop constraint if exists organizations_banner_url_https_check;

alter table public.organizations
  add constraint organizations_logo_url_https_check
    check (logo_url is null or logo_url ~* '^https://'),
  add constraint organizations_banner_url_https_check
    check (banner_url is null or banner_url ~* '^https://');
