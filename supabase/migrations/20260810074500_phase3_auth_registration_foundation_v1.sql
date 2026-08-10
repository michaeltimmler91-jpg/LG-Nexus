-- LG Nexus V1 – Phase 3: real account registration foundation
-- Creates profile rows from Supabase Auth users and provides a small server-only
-- registration throttle used by the public registration Edge Function.

create table if not exists public.registration_throttle (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.registration_throttle enable row level security;
revoke all on public.registration_throttle from anon, authenticated;

create or replace function public.consume_registration_throttle(
  throttle_key text,
  maximum_attempts integer default 5,
  window_minutes integer default 15
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_row public.registration_throttle%rowtype;
begin
  if throttle_key is null or length(throttle_key) < 16 then
    raise exception 'invalid throttle key';
  end if;

  if maximum_attempts < 1 or maximum_attempts > 100 then
    raise exception 'invalid maximum attempts';
  end if;

  if window_minutes < 1 or window_minutes > 1440 then
    raise exception 'invalid throttle window';
  end if;

  insert into public.registration_throttle (key_hash, window_started_at, attempt_count, updated_at)
  values (throttle_key, now(), 0, now())
  on conflict (key_hash) do nothing;

  select * into current_row
  from public.registration_throttle
  where key_hash = throttle_key
  for update;

  if current_row.window_started_at <= now() - make_interval(mins => window_minutes) then
    update public.registration_throttle
    set window_started_at = now(), attempt_count = 1, updated_at = now()
    where key_hash = throttle_key;
    return true;
  end if;

  if current_row.attempt_count >= maximum_attempts then
    return false;
  end if;

  update public.registration_throttle
  set attempt_count = attempt_count + 1, updated_at = now()
  where key_hash = throttle_key;

  return true;
end;
$$;

revoke all on function public.consume_registration_throttle(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_registration_throttle(text, integer, integer) to service_role;

create or replace function private.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_username text;
  supplied_first_name text;
  supplied_last_name text;
  supplied_dob_text text;
  supplied_dob date;
  resolved_display_name text;
begin
  normalized_username := lower(nullif(trim(coalesce(new.raw_user_meta_data ->> 'username', '')), ''));
  supplied_first_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), '');
  supplied_last_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), '');
  supplied_dob_text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'date_of_birth', '')), '');

  if supplied_dob_text is not null and supplied_dob_text ~ '^\d{4}-\d{2}-\d{2}$' then
    begin
      supplied_dob := supplied_dob_text::date;
    exception when others then
      supplied_dob := null;
    end;
  end if;

  resolved_display_name := trim(concat_ws(' ', supplied_first_name, supplied_last_name));
  if resolved_display_name = '' then
    resolved_display_name := coalesce(normalized_username, 'Neuer Bürger');
  end if;

  insert into public.profiles (
    id,
    display_name,
    username,
    first_name,
    last_name,
    date_of_birth,
    account_status
  ) values (
    new.id,
    resolved_display_name,
    normalized_username,
    supplied_first_name,
    supplied_last_name,
    supplied_dob,
    'pending'
  );

  return new;
end;
$$;

revoke all on function private.create_profile_for_auth_user() from public, anon, authenticated;

drop trigger if exists auth_user_create_nexus_profile on auth.users;
create trigger auth_user_create_nexus_profile
after insert on auth.users
for each row execute function private.create_profile_for_auth_user();

create index if not exists registration_throttle_updated_idx
  on public.registration_throttle (updated_at);
