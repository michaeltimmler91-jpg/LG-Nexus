alter table public.profiles
  add column if not exists rejection_reason text,
  add column if not exists rejected_at timestamptz,
  add column if not exists rejected_by uuid references auth.users(id) on delete set null;

alter table public.profiles
  add constraint profiles_rejection_reason_required
  check (
    account_status <> 'rejected'
    or nullif(btrim(rejection_reason), '') is not null
  );
