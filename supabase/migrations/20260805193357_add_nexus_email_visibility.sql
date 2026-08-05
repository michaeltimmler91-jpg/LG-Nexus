alter table public.profiles
  add column if not exists nexus_email_visibility text not null default 'nobody';

alter table public.profiles
  drop constraint if exists profiles_nexus_email_visibility_check;

alter table public.profiles
  add constraint profiles_nexus_email_visibility_check
  check (nexus_email_visibility = any (array[
    'nobody'::text,
    'citizens'::text,
    'authorities'::text,
    'citizens_and_authorities'::text,
    'own_organization'::text,
    'everyone'::text
  ]));
