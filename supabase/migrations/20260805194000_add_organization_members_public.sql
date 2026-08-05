alter table public.organizations
  add column if not exists members_public boolean not null default true;

comment on column public.organizations.members_public is
  'Controls whether the organization member list is visible outside the organization. Applies uniformly to all active members. Defaults to visible.';
