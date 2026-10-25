-- Tester för schema.sql: rättigheter (RLS) och regler i tabellerna.
-- Körs mot en tom Postgres med låtsasversioner av Supabases auth och storage, se tests/schema.sh.
-- Varje test skriver "OK: …" eller avbryter med ett fel.
\set ON_ERROR_STOP 1
\set QUIET 1

insert into auth.users values ('aaaaaaaa-0000-0000-0000-000000000001'), ('bbbbbbbb-0000-0000-0000-000000000002');

create or replace function pg_temp.forvanta_fel(sql text, vad text) returns void language plpgsql as $$
begin
  execute sql;
  raise exception 'FEL: % borde ha nekats', vad;
exception when others then
  if sqlerrm like 'FEL:%' then raise; end if;
  raise notice 'OK: % nekas (%)', vad, sqlerrm;
end $$;

-- ---- Användare A loggar data ----
set role authenticated;
set test.uid = 'aaaaaaaa-0000-0000-0000-000000000001';

insert into kalori_profil (fodelsedatum, kon, langd_cm, aktivitet, malvikt_kg, takt_kg_vecka)
  values ('1980-05-01', 'man', 182, 'latt', 85, 0.5);
insert into kalori_vikt (datum, vikt_kg) values ('2026-10-24', 92.4);
insert into kalori_vikt (datum, vikt_kg) values ('2026-10-24', 92.1)
  on conflict (user_id, datum) do update set vikt_kg = excluded.vikt_kg;
insert into kalori_maltid (id, typ, kalla) values ('cccccccc-0000-0000-0000-000000000001', 'lunch', 'foto');
insert into kalori_maltid_rad (maltid_id, namn, gram, kcal) values ('cccccccc-0000-0000-0000-000000000001', 'Kycklinggryta', 350, 520);
insert into kalori_traning (datum, typ, minuter, km, kcal) values ('2026-10-24', 'lopning', 30, 5.2, 380);
insert into kalori_traning (datum, typ, minuter, kcal) values ('2026-10-24', 'styrka', 45, 290);

do $$ begin
  if (select vikt_kg from kalori_vikt) <> 92.1 or (select count(*) from kalori_vikt) <> 1 then raise exception 'FEL: ny vikt samma dag ska ersätta'; end if;
  raise notice 'OK: ny vikt samma dag ersätter den gamla';
  if (select count(*) from kalori_maltid_rad) <> 1 or (select count(*) from kalori_traning) <> 2 then raise exception 'FEL: A ska se sina rader'; end if;
  raise notice 'OK: A ser sina egna rader';
end $$;

-- Gång på löpband (D-23): lutning bara för löpband, 0–15 %
insert into kalori_traning (datum, typ, minuter, km, lutning_procent, kcal) values ('2026-10-24', 'lopband', 45, 4.13, 8, 510);
do $$ begin
  if (select count(*) from kalori_traning where typ = 'lopband' and lutning_procent = 8) <> 1 then raise exception 'FEL: löpband med lutning ska gå att spara'; end if;
  raise notice 'OK: gång på löpband med lutning sparas';
end $$;
delete from kalori_traning where typ = 'lopband';

-- Regler i tabellerna
select pg_temp.forvanta_fel($$insert into kalori_traning (datum, typ, minuter, km, kcal) values ('2026-10-24', 'styrka', 30, 2, 100)$$, 'styrka med sträcka');
select pg_temp.forvanta_fel($$insert into kalori_traning (datum, typ, minuter, kcal) values ('2026-10-24', 'promenad', 30, 100)$$, 'promenad utan sträcka');
select pg_temp.forvanta_fel($$update kalori_profil set takt_kg_vecka = 1.0$$, 'takt 1 kg/vecka');
select pg_temp.forvanta_fel($$insert into kalori_traning (datum, typ, minuter, km, lutning_procent, kcal) values ('2026-10-24', 'lopning', 30, 5, 5, 300)$$, 'lutning på annat än löpband');
select pg_temp.forvanta_fel($$insert into kalori_traning (datum, typ, minuter, km, lutning_procent, kcal) values ('2026-10-24', 'lopband', 30, 3, 20, 300)$$, 'lutning 20 %');
select pg_temp.forvanta_fel($$insert into kalori_traning (datum, typ, minuter, km, kcal) values ('2026-10-24', 'lopband', 30, null, 300)$$, 'löpband utan sträcka');
select pg_temp.forvanta_fel($$insert into kalori_vikt (datum, vikt_kg) values ('2026-10-25', 12)$$, 'vikt 12 kg');
select pg_temp.forvanta_fel($$insert into kalori_maltid (typ, kalla) values ('brunch', 'manuell')$$, 'okänd måltidstyp');
select pg_temp.forvanta_fel($$insert into kalori_maltid (typ, kalla, user_id) values ('lunch', 'manuell', 'bbbbbbbb-0000-0000-0000-000000000002')$$, 'måltid i någon annans namn');

-- ---- Användare B ----
set test.uid = 'bbbbbbbb-0000-0000-0000-000000000002';
do $$ begin
  if (select count(*) from kalori_profil) + (select count(*) from kalori_vikt) + (select count(*) from kalori_maltid)
     + (select count(*) from kalori_maltid_rad) + (select count(*) from kalori_traning) <> 0 then
    raise exception 'FEL: B ser A:s data';
  end if;
  raise notice 'OK: B ser ingenting av A:s data';
end $$;
update kalori_vikt set vikt_kg = 50;
delete from kalori_traning;
select pg_temp.forvanta_fel($$insert into kalori_maltid_rad (maltid_id, namn, gram, kcal) values ('cccccccc-0000-0000-0000-000000000001', 'Smuggel', 100, 100)$$, 'rad i någon annans måltid');

-- ---- Anon ----
reset test.uid;
set role anon;
select pg_temp.forvanta_fel($$select * from kalori_profil$$, 'anon läser profil');
select pg_temp.forvanta_fel($$insert into kalori_vikt (user_id, datum, vikt_kg) values ('aaaaaaaa-0000-0000-0000-000000000001', '2026-10-26', 90)$$, 'anon skriver vikt');

-- ---- A:s data är orörd efter B:s försök ----
set role authenticated;
set test.uid = 'aaaaaaaa-0000-0000-0000-000000000001';
do $$ begin
  if (select vikt_kg from kalori_vikt) <> 92.1 or (select count(*) from kalori_traning) <> 2 then raise exception 'FEL: B har ändrat A:s data'; end if;
  raise notice 'OK: B kunde varken ändra eller ta bort A:s data';
end $$;

-- Ta bort måltid tar bort raderna
delete from kalori_maltid;
do $$ begin
  if (select count(*) from kalori_maltid_rad) <> 0 then raise exception 'FEL: raderna ska försvinna med måltiden'; end if;
  raise notice 'OK: raderna tas bort med måltiden';
end $$;

-- Foton: bara i egen mapp
insert into storage.objects (bucket_id, name) values ('kalori-foton', 'aaaaaaaa-0000-0000-0000-000000000001/x.jpg');
select pg_temp.forvanta_fel($$insert into storage.objects (bucket_id, name) values ('kalori-foton', 'bbbbbbbb-0000-0000-0000-000000000002/x.jpg')$$, 'foto i någon annans mapp');
select 'ALLA SCHEMATESTER OK' as resultat;
