create or replace function private.guard_self_profile_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() = old.id then
    if new.id is distinct from old.id then
      raise exception 'profile id cannot be changed';
    end if;

    if new.username is distinct from old.username then
      raise exception 'username is permanent and cannot be changed';
    end if;

    if new.account_status is distinct from old.account_status
       or new.nexus_id is distinct from old.nexus_id
       or new.nexus_email is distinct from old.nexus_email
       or new.approved_at is distinct from old.approved_at
       or new.approved_by is distinct from old.approved_by
       or new.must_change_password is distinct from old.must_change_password
       or new.rejection_reason is distinct from old.rejection_reason
       or new.rejected_at is distinct from old.rejected_at
       or new.rejected_by is distinct from old.rejected_by
       or new.created_at is distinct from old.created_at then
      raise exception 'protected account fields cannot be changed by the account owner';
    end if;

    if old.account_status <> 'pending' and (
      new.first_name is distinct from old.first_name
      or new.last_name is distinct from old.last_name
      or new.date_of_birth is distinct from old.date_of_birth
      or new.phone is distinct from old.phone
    ) then
      raise exception 'registration data can only be changed by the account owner while pending';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.guard_self_profile_update() from public, anon, authenticated;

drop trigger if exists profiles_guard_self_profile_update on public.profiles;
create trigger profiles_guard_self_profile_update
before update on public.profiles
for each row execute function private.guard_self_profile_update();
