create schema if not exists private;

create sequence if not exists private.nexus_id_seq start with 1 increment by 1;

alter table public.profiles
  add column username text,
  add column first_name text,
  add column last_name text,
  add column date_of_birth date,
  add column phone text,
  add column account_status text not null default 'pending',
  add column nexus_id text,
  add column nexus_email text,
  add column approved_at timestamptz,
  add column approved_by uuid references auth.users(id) on delete set null;

alter table public.profiles
  add constraint profiles_account_status_check
  check (account_status in ('pending','active','suspended','rejected','disabled'));

create unique index profiles_username_lower_uidx
  on public.profiles (lower(username))
  where username is not null;

create unique index profiles_nexus_id_uidx
  on public.profiles (nexus_id)
  where nexus_id is not null;

create unique index profiles_nexus_email_lower_uidx
  on public.profiles (lower(nexus_email))
  where nexus_email is not null;

create or replace function private.nexus_mail_part(input_text text)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select trim(both '.' from regexp_replace(
    lower(
      replace(replace(replace(replace(replace(replace(replace(input_text,
        'ä','ae'),'ö','oe'),'ü','ue'),'ß','ss'),'Ä','ae'),'Ö','oe'),'Ü','ue')
    ),
    '[^a-z0-9]+',
    '.',
    'g'
  ));
$$;

create or replace function private.assign_nexus_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_local text;
  candidate_local text;
  suffix_no integer := 1;
  next_nexus_number bigint;
begin
  if new.account_status = 'active' then
    if new.nexus_id is null then
      next_nexus_number := nextval('private.nexus_id_seq'::regclass);
      new.nexus_id := 'NX-' || lpad(next_nexus_number::text, 6, '0');
    end if;

    if new.nexus_email is null then
      base_local := private.nexus_mail_part(coalesce(new.first_name, ''))
        || '.' || private.nexus_mail_part(coalesce(new.last_name, ''));
      base_local := trim(both '.' from regexp_replace(base_local, '\\.+', '.', 'g'));

      if base_local = '' then
        base_local := lower(replace(new.nexus_id, '-', ''));
      end if;

      perform pg_advisory_xact_lock(hashtext(base_local));
      candidate_local := base_local || '@nexus.ls';

      while exists (
        select 1
        from public.profiles p
        where lower(p.nexus_email) = lower(candidate_local)
          and p.id <> new.id
      ) loop
        suffix_no := suffix_no + 1;
        candidate_local := base_local || suffix_no::text || '@nexus.ls';
      end loop;

      new.nexus_email := candidate_local;
    end if;

    if new.approved_at is null then
      new.approved_at := now();
    end if;
  end if;

  if new.first_name is not null and new.last_name is not null then
    new.display_name := trim(new.first_name || ' ' || new.last_name);
  end if;

  return new;
end;
$$;

revoke all on function private.nexus_mail_part(text) from public, anon, authenticated;
revoke all on function private.assign_nexus_identity() from public, anon, authenticated;

create trigger profiles_assign_nexus_identity
before insert or update of account_status, first_name, last_name
on public.profiles
for each row
execute function private.assign_nexus_identity();

-- Existing profile policies were created before sensitive account fields existed.
-- Tighten them now so users cannot activate themselves or read other users' private data.
drop policy if exists "profiles_authenticated_read" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_read_own"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (avatar_url, phone) on public.profiles to authenticated;
