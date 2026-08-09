# LG Nexus – Supabase Deployment-Status

## Stand 09.08.2026

Die technische V1-Grundlage für Accounts, Organisationen und das neue RBAC-Modell ist auf dem Supabase-Projekt `lg_nexus` aktiv.

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

Die technischen Systemrollen sind:

- `system_admin`
- `security_admin`
- `backup_operator`
- `moderator`

Keine dieser Rollen erhält automatisch Medical-, Police- oder Justice-Fachzugriff.

### Phase 2 – Organisationen / Rollen / RBAC-Grundlage

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

### Phase 2B – RBAC aktiviert

Supabase-Migrationsversion:

- `20260809203357_phase2b_rbac_activation_v1`

GitHub-Quellmigration:

- `supabase/migrations/20260809223000_phase2b_rbac_activation_v1.sql`

Neu aktiv:

- alte `is_manager`-Schreib-Policies entfernt
- geschützte Organisationstabellen nicht mehr direkt vom Browser beschreibbar
- RLS-Leseregeln für Mitgliedschaften, Rollen, Standorte, Historie, interne Notizen und Auditlog
- `get_my_organization_context()` für den späteren Frontend-Rechtekontext
- `has_my_org_permission(...)` als Frontend-Helfer
- sichere Profiländerung über `update_organization_profile(...)`
- sichere Statusänderung über `update_organization_status(...)`
- Rollenwechsel mit Hierarchieprüfung über `assign_organization_member_role(...)`
- Owner-Zuweisung nur über geschützten System-Admin-Weg
- optimistische Konfliktprüfung über `row_version`
- Audit-/History-Einträge bei relevanten Änderungen

Der Permission-Katalog enthält jetzt **24 aktive Kernberechtigungen**.

### Phase 2C – RLS-/Index-Härtung

Supabase-Migrationsversion:

- `20260809203509_phase2c_rls_and_index_hardening_v1`

GitHub-Quellmigration:

- `supabase/migrations/20260809224500_phase2c_rls_and_index_hardening_v1.sql`

Enthalten sind:

- zusammengeführte SELECT-Policy für öffentliche bzw. eigene Organisationen
- fehlende Foreign-Key-Indizes aus dem Supabase Performance Advisor
- Vorbereitung für Rollen-, Historien-, Security- und Audit-Abfragen unter Last

## Aktueller Datenbestand beim ersten Rollout

Zum Zeitpunkt der ersten Phase-1/2-Migration waren vorhanden:

- `0` Profile
- `0` Organisationen
- `0` Organisationsmitgliedschaften
- `0` Legacy-Manager

Damit konnte die Struktur ohne Migration bestehender Bürger-/Organisationsdaten eingeführt werden.

## Tests nach dem Rollout

Geprüft wurde:

- Phase-1- und Phase-2-Tabellen vorhanden
- RLS auf den geschützten Tabellen aktiv
- technische Systemrollen vorhanden
- 24 aktive Organisations-Permissions vorhanden
- RBAC-RPCs vorhanden
- Phase 2B und Phase 2C in der Supabase-Migrationshistorie vorhanden
- Foreign-Key-Warnungen des Performance Advisors beseitigt
- keine doppelte permissive Organisations-SELECT-Policy mehr

## Security Advisor

Einige Foundation-Tabellen melden weiterhin `RLS Enabled No Policy`. Das ist momentan beabsichtigt: Tabellen wie Security-/System-Audit oder bestimmte Identitätshistorien sollen nicht pauschal direkt vom Client lesbar sein. Zugriff wird erst über die dafür vorgesehenen Adminfunktionen freigeschaltet.

Der Advisor kennzeichnet außerdem unsere öffentlichen `SECURITY DEFINER`-RPCs als Warnung. Diese RPCs sind **absichtlich** für `authenticated` aufrufbar, führen aber jeweils intern Authentifizierung, Account-/Organisationsstatus, Permission- bzw. Systemrollenprüfung und bei Änderungen zusätzlich Hierarchie-/Konfliktprüfungen durch. Direkte Tabellen-Schreibrechte sind dem Browser entzogen.

Supabase-Hinweise:

- https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable

## Performance Advisor

Die zuvor gemeldeten fehlenden Foreign-Key-Indizes wurden ergänzt. Der Advisor meldet aktuell im Wesentlichen `Unused Index`-Hinweise. Bei einem noch leeren bzw. kaum genutzten Projekt ist das erwartbar; die vorgesehenen Indizes werden deshalb nicht vorschnell entfernt.

Supabase-Hinweis:

- https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Nächster technischer Schritt

Als Nächstes wird die Account-/Frontend-Schicht an die echte Grundlage angeschlossen:

1. sichere Registrierung mit Status `pending`
2. Anmeldung mit Benutzername + Passwort
3. Freischaltungs-/Ablehnungsablauf für Stadt-/Accountverwaltung
4. Profil und Accountstatus aus Supabase laden
5. `get_my_organization_context()` ins Frontend integrieren
6. Organisationsmodule nur anhand echter Permissions anzeigen
7. danach `is_manager` und `role_title` als Berechtigungsquelle vollständig außer Betrieb nehmen
