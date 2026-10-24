#!/usr/bin/env bash
# Testar supabase/schema.sql mot en tom Postgres: körs två gånger (ska gå att köra om)
# och sedan supabase/tester.sql (rättigheter och regler).
# Kräver psql och en Postgres som nås via PGHOST/PGPORT/PGUSER (CI: tjänstecontainer).
set -euo pipefail
cd "$(dirname "$0")/.."
DB=kalori_test
psql -q -v ON_ERROR_STOP=1 -d postgres -c "drop database if exists $DB" -c "create database $DB" 2>/dev/null
q() { psql -q -v ON_ERROR_STOP=1 -d $DB "$@"; }
q -f supabase/stub.sql
q -f supabase/schema.sql 2>/dev/null && echo "✓ schema.sql körning 1"
q -f supabase/schema.sql 2>/dev/null && echo "✓ schema.sql körning 2 (går att köra om)"
set +e
UT=$(q -f supabase/tester.sql 2>&1); KOD=$?
set -e
echo "$UT" | sed -n 's/.*NOTICE:  OK: /✓ /p; s/.*\(FEL: .*\)/✕ \1/p; s/.*ERROR: \(.*\)/✕ \1/p'
[ $KOD -eq 0 ] || { echo "Schematesterna misslyckades"; exit 1; }
echo "✓ Alla schematester OK"
