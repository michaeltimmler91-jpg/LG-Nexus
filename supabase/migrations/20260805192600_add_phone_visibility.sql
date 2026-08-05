alter table public.profiles
  add column if not exists phone_visibility text not null default 'nobody';

alter table public.profiles
  drop constraint if exists profiles_phone_visibility_check;

alter table public.profiles
  add constraint profiles_phone_visibility_check
  check (phone_visibility in (
    'nobody',
    'citizens',
    'authorities',
    'citizens_and_authorities',
    'own_organization',
    'everyone'
  ));
