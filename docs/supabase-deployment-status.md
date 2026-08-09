# LG Nexus – Supabase Deployment-Status

## Stand 09.08.2026

Die technische V1-Grundlage für Phase 1 und Phase 2 wurde auf dem Supabase-Projekt `lg_nexus` angewendet.

## Angewandte Migrationen

### Phase 1 – Accounts / Identität

Supabase-Migrationsversion:

- `20260809194929_phase1_identity_foundation_v1`

GitHub-Quellmigration:

- `supabase/migrations/20260809212000_phase1_identity_foundation_v1.sql`

Enthalten sind unter anderem:

- zusätzliche Profil-/Privacy-Felder
- `row_version` für optimistische Bearbeitungskonflikte
- persönliche Anzeigeeinstellungen
- Namensänderungs-/Identitätsanträge
- dauerhafte Namenshistorie
- dauerhafte Accountstatus-Historie
- Benutzerblockierungen
- technische Systemrollen
- System-Audit-Grundlage
- Security-Events

Die technischen Systemrollen wurden angelegt:

- `system_admin`
- `security_admin`
- `backup_operator`
- `moderator`

Keine dieser Rollen erhält automatisch Medical-, Police- oder Justice-Fachzugriff.

### Phase 2 – Organisationen / Rollen / RBAC

Supabase-Migrationsversion:

- `20260809195108_phase2_organization_rbac_foundation_v1`

GitHub-Quellmigration:

- `supabase/migrations/20260809212100_phase2_organization_rbac_foundation_v1.sql`

Enthalten sind unter anderem:

- Organisationsstandorte
- globaler Permission-Katalog
- echte Organisationsrollen
- Role-Permission-Zuordnung
- Übergang von `role_title/is_manager` zu `role_id`
- Mitgliedschaftshistorie
- interne Mitgliedsnotizen
- Organisations-Auditlog
- RBAC-Helper für Mitgliedschaft, Owner und Permissions

Der Permission-Katalog enthält derzeit 22 Kernberechtigungen.

## Aktueller Datenbestand beim Rollout

Zum Zeitpunkt der Migration waren vorhanden:

- `0` Profile
- `0` Organisationen
- `0` Organisationsmitgliedschaften
- `0` Legacy-Manager

Damit konnte die Struktur ohne Migration bestehender Bürger-/Organisationsdaten eingeführt werden.

## Tests nach dem Rollout

Geprüft wurde:

- alle Phase-1-Tabellen wurden angelegt
- alle Phase-2-Tabellen wurden angelegt
- RLS ist auf den neuen geschützten Tabellen aktiviert
- Systemrollen wurden korrekt geseedet
- Permission-Katalog enthält 22 Einträge
- beide Migrationen erscheinen in der Supabase-Migrationshistorie

## Security Advisor

Der Security Advisor meldet derzeit ausschließlich `RLS Enabled No Policy` für mehrere neue Foundation-Tabellen.

Das ist in diesem Zwischenstand beabsichtigt: Diese Tabellen sollen noch **nicht direkt vom normalen Client lesbar** sein. Die passenden Lese-/Schreib-Policies bzw. RPCs werden erst mit den jeweiligen Modul-/Adminfunktionen eingeführt.

Remediation-Hinweis von Supabase:

https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

## Performance Advisor

Der Performance Advisor meldet mehrere noch nicht abgedeckte Foreign-Key-Indizes. Diese werden vor produktiver Belastung in einer eigenen Index-/Performance-Migration ergänzt.

Die zusätzlich gemeldeten `Unused Index`-Hinweise sind bei einem aktuell leeren Projekt erwartbar und noch kein Grund, die vorgesehenen Indizes zu entfernen.

Remediation-Hinweis von Supabase:

https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys

## Nächster technischer Schritt

Als Nächstes folgt die kontrollierte Aktivierung des neuen RBAC-Modells:

1. Rollen-/Permission-RPCs mit Hierarchieprüfung
2. sichere Owner-Zuweisung
3. RLS-Policies auf Grundlage von `private.has_org_permission(...)`
4. Tests für aktive/inaktive Mitgliedschaften und Accountstatus
5. Frontend auf das neue Rollenmodell umstellen
6. erst danach `is_manager` und `role_title` als Berechtigungsquelle vollständig außer Betrieb nehmen
