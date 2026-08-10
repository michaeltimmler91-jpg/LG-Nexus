-- LG Nexus V1
-- Security hardening: SECURITY DEFINER RPCs in the public API schema must not be callable anonymously.
-- Intended browser RPCs keep their explicit authenticated grants; internal-only functions remain internal-only.

do $$
declare
  target record;
begin
  for target in
    select p.oid::regprocedure as function_signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef = true
  loop
    execute format('revoke execute on function %s from anon', target.function_signature);
    execute format('revoke execute on function %s from public', target.function_signature);
  end loop;
end;
$$;
