-- Låtsasversion av de delar av Supabase som schema.sql använder (auth, storage, roller).
-- Används bara av testerna i tests/schema.sh, aldrig i riktiga Supabase.
do $$ begin
  if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
end $$;
create schema auth; create schema storage;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
grant usage on schema auth to authenticated, anon; grant execute on function auth.uid() to authenticated, anon;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id serial primary key, bucket_id text, name text);
create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'),1)-1] $$;
grant usage on schema public, storage to authenticated, anon;
alter table storage.objects enable row level security;
grant select, insert, update, delete on storage.objects to authenticated;
grant usage, select on sequence storage.objects_id_seq to authenticated;
