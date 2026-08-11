alter table public.organizations
  drop constraint if exists organizations_logo_url_https_check,
  drop constraint if exists organizations_banner_url_https_check;

alter table public.organizations
  add constraint organizations_logo_url_https_check
    check (
      logo_url is null
      or (
        logo_url ~* '^https://'
        and lower(logo_url) not like 'https://pfbjblrtwpnhsuvshpcc.supabase.co/%'
      )
    ),
  add constraint organizations_banner_url_https_check
    check (
      banner_url is null
      or (
        banner_url ~* '^https://'
        and lower(banner_url) not like 'https://pfbjblrtwpnhsuvshpcc.supabase.co/%'
      )
    );
