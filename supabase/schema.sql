-- Kaloriappen – databas i Supabase (delar projekt med Jaktvind och Svampkartan)
-- Kör hela filen i Supabase: SQL Editor → New query → klistra in → Run.
-- Filen går att köra flera gånger.
--
-- Allt här har prefixet kalori_ (tabeller, index, regler, bucket) och rör
-- inte de andra apparnas tabeller.
--
-- Rättigheter: bara inloggade kommer åt något, och varje användare ser och
-- ändrar bara sina egna rader och foton.

-- ---------------------------------------------------------------------------
-- Profil (US-02). Vikten ligger inte här utan i kalori_vikt (senaste raden gäller).
create table if not exists public.kalori_profil (
  user_id        uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  fodelsedatum   date not null check (fodelsedatum between '1900-01-01' and current_date),
  kon            text not null check (kon in ('man', 'kvinna')),
  langd_cm       smallint not null check (langd_cm between 100 and 250),
  aktivitet      text not null check (aktivitet in ('stillasittande', 'latt', 'mattlig', 'hog')),
  malvikt_kg     numeric(5,1) not null check (malvikt_kg between 30 and 300),
  takt_kg_vecka  numeric(3,2) not null check (takt_kg_vecka in (0.25, 0.50, 0.75)),
  uppdaterad     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Vikt (US-09, US-10). En mätning per dag – ny ersätter gammal (upsert).
create table if not exists public.kalori_vikt (
  user_id  uuid not null default auth.uid() references auth.users(id) on delete cascade,
  datum    date not null,
  vikt_kg  numeric(5,1) not null check (vikt_kg between 30 and 300),
  primary key (user_id, datum)
);

-- ---------------------------------------------------------------------------
-- Måltider (US-04–US-08)
create table if not exists public.kalori_maltid (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tid       timestamptz not null default now(),
  typ       text not null check (typ in ('frukost', 'lunch', 'middag', 'mellanmal')),
  kalla     text not null check (kalla in ('foto', 'manuell')),
  miniatyr  text,                                         -- sökväg i bucketen kalori-foton
  unique (id, user_id)                                    -- så att rader bara kan höra till egna måltider
);

create table if not exists public.kalori_maltid_rad (
  id            uuid primary key default gen_random_uuid(),
  maltid_id     uuid not null,
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  namn          text not null check (length(namn) between 1 and 200),
  livsmedel_nr  integer,                                  -- nummer i Livsmedelsverkets databas, null för AI-rader
  gram          numeric(6,1) not null check (gram > 0 and gram <= 5000),
  kcal          numeric(6,1) not null check (kcal >= 0 and kcal <= 10000),
  foreign key (maltid_id, user_id) references public.kalori_maltid (id, user_id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- Träning (US-11–US-13). kcal sparas vid loggning så att historiken inte ändras med vikten.
create table if not exists public.kalori_traning (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  datum      date not null,
  typ        text not null,                                -- regel nedan: styrka, lopning, promenad, cykling, lopband
  minuter    smallint not null check (minuter between 1 and 1440),
  km         numeric(5,2) check (km > 0 and km <= 500),
  lutning_procent numeric(3,1) check (lutning_procent between 0 and 15),  -- bara gång på löpband (D-23)
  kommentar  text check (length(kommentar) <= 500),
  kcal       numeric(6,1) not null check (kcal >= 0 and kcal <= 10000),
  check ((typ = 'styrka') = (km is null))                 -- styrka har aldrig sträcka, övriga har alltid
);

-- Tillägg som kan köras på en befintlig databas (gång på löpband, D-23, 2026-10-25).
-- Regeln för tillåtna typer byts ut, och lutning får bara anges för löpband.
alter table public.kalori_traning add column if not exists lutning_procent numeric(3,1) check (lutning_procent between 0 and 15);
alter table public.kalori_traning drop constraint if exists kalori_traning_typ_check;
alter table public.kalori_traning add constraint kalori_traning_typ_check
  check (typ in ('styrka', 'lopning', 'promenad', 'cykling', 'lopband'));
alter table public.kalori_traning drop constraint if exists kalori_traning_lutning_typ_check;
alter table public.kalori_traning add constraint kalori_traning_lutning_typ_check
  check (lutning_procent is null or typ = 'lopband');

-- ---------------------------------------------------------------------------
-- Index för de vanligaste frågorna (dag för dag, vecka för vecka)
create index if not exists kalori_vikt_user_datum    on public.kalori_vikt (user_id, datum desc);
create index if not exists kalori_maltid_user_tid    on public.kalori_maltid (user_id, tid desc);
create index if not exists kalori_maltid_rad_maltid  on public.kalori_maltid_rad (maltid_id);
create index if not exists kalori_maltid_rad_senaste on public.kalori_maltid_rad (user_id, livsmedel_nr) where livsmedel_nr is not null;
create index if not exists kalori_traning_user_datum on public.kalori_traning (user_id, datum desc);

-- ---------------------------------------------------------------------------
-- Rättigheter: samma regler för alla kalori_-tabeller
do $$
declare
  t text;
begin
  foreach t in array array['kalori_profil', 'kalori_vikt', 'kalori_maltid', 'kalori_maltid_rad', 'kalori_traning'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', t || '_select', t);
    execute format('drop policy if exists %I on public.%I', t || '_insert', t);
    execute format('drop policy if exists %I on public.%I', t || '_update', t);
    execute format('drop policy if exists %I on public.%I', t || '_delete', t);

    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t || '_select', t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t || '_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t || '_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t || '_delete', t);

    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Miniatyrer av matfoton: privat bucket. Varje bild läggs under <user_id>/<maltid-id>.jpg
-- Appen krymper till högst ca 30 kB (D-10), så 1 GB räcker till tiotusentals måltider.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('kalori-foton', 'kalori-foton', false, 102400,  -- max 100 kB per bild
        array['image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "kalori_foton_select" on storage.objects;
drop policy if exists "kalori_foton_insert" on storage.objects;
drop policy if exists "kalori_foton_update" on storage.objects;
drop policy if exists "kalori_foton_delete" on storage.objects;
create policy "kalori_foton_select" on storage.objects for select to authenticated
  using (bucket_id = 'kalori-foton' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "kalori_foton_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'kalori-foton' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "kalori_foton_update" on storage.objects for update to authenticated
  using (bucket_id = 'kalori-foton' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'kalori-foton' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "kalori_foton_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'kalori-foton' and (storage.foldername(name))[1] = (select auth.uid())::text);
