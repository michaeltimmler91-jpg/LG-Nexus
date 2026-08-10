# LG Nexus – Supabase Deployment-Status

## Stand 10.08.2026

Die technische V1-Grundlage für Accounts, Organisationen, RBAC und die erste echte Registrierung ist auf dem Supabase-Projekt `lg_nexus` aktiv.

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
- `get_my_organization_context()` für den Frontend-Rechtekontext
- `has_my_org_permission(...)` als Frontend-Helfer
- sichere Profiländerung über `update_organization_profile(...)`
- sichere Statusänderung über `update_organization_status(...)`
- Rollenwechsel mit Hierarchieprüfung über `assign_organization_member_role(...)`
- Owner-Zuweisung nur über geschützten System-Admin-Weg
- optimistische Konfliktprüfung über `row_version`
- Audit-/History-Einträge bei relevanten Änderungen

Der Permission-Katalog enthält **24 aktive Kernberechtigungen**.

### Phase 2C – RLS-/Index-Härtung

Supabase-Migrationsversion:

- `20260809203509_phase2c_rls_and_index_hardening_v1`

GitHub-Quellmigration:

- `supabase/migrations/20260809224500_phase2c_rls_and_index_hardening_v1.sql`

Enthalten sind:

- zusammengeführte SELECT-Policy für öffentliche bzw. eigene Organisationen
- fehlende Foreign-Key-Indizes aus dem Supabase Performance Advisor
- Vorbereitung für Rollen-, Historien-, Security- und Audit-Abfragen unter Last

### Phase 3 – echte Account-Registrierung

GitHub-Quellmigration:

- `supabase/migrations/20260810074500_phase3_auth_registration_foundation_v1.sql`

Aktiv sind jetzt:

- automatische Anlage eines `profiles`-Datensatzes bei neuem Supabase-Auth-Benutzer
- neue Accounts starten immer als `pending`
- Nexus-ID und Nexus-Mail werden weiterhin erst bei Freischaltung auf `active` erzeugt
- serverseitiger Registrierungs-Throttle mit gehashter Client-IP
- öffentliche Edge Function `register-user`
- Registrierung mit Vorname, Nachname, Benutzername, Geburtsdatum und Passwort
- Anmeldung nach außen ausschließlich mit Benutzername + Passwort; die technische Auth-Mail bleibt für den Nutzer unsichtbar
- keine Service-/Secret-Keys im Browser

Die Edge Function `register-user` ist aktiv und verwendet serverseitig den Supabase Secret Key. Der Browser nutzt ausschließlich den Publishable Key.

## Frontend-Status

Die GitHub-Pages-Vorschau ist seit Phase 3 direkt mit dem echten `lg_nexus`-Projekt verbunden.

Neu im sichtbaren Frontend:

- echter Login mit Benutzername + Passwort
- echte Registrierung
- Supabase-Session bleibt im Browser erhalten
- eigener Profil-/Accountstatus wird aus `profiles` geladen
- `pending`, `active`, `suspended`, `rejected` und `disabled` werden sichtbar unterschieden
- nach Freischaltung werden Nexus-ID und Nexus-Mail angezeigt
- `get_my_organization_context()` wird für aktive Accounts geladen
- der bisherige Demo-Account oben rechts wird durch den echten Accountstatus überlagert
- die sichtbare Account-Seite zeigt nicht mehr das Demo-Profil, sobald die neue Auth-Schicht aktiv ist

Die sichtbare Oberfläche verwendet weiterhin keine Begriffe wie `RP`, `IC` oder `OOC`.

## Datenbestand vor Phase 3

Vor Aktivierung der echten Registrierung waren vorhanden:

- `0` Auth-Benutzer
- `0` Profile

Damit konnte der neue Auth-Trigger ohne Bestandsmigration aktiviert werden.

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
- Phase-3-Registrierungsmigration erfolgreich angewendet
- Edge Function `register-user` erfolgreich deployed und aktiv
- Frontend-Build nach Auth-Integration erfolgreich
- GitHub-Pages-Build erfolgreich
- GitHub-Pages-Deployment erfolgreich

## Security Advisor

Einige Foundation-Tabellen melden weiterhin `RLS Enabled No Policy`. Das ist momentan beabsichtigt: Tabellen wie Security-/System-Audit oder bestimmte Identitätshistorien sollen nicht pauschal direkt vom Client lesbar sein. Zugriff wird erst über die dafür vorgesehenen Adminfunktionen freigeschaltet.

Der Advisor kennzeichnet außerdem unsere öffentlichen `SECURITY DEFINER`-RPCs als Warnung. Diese RPCs sind **absichtlich** für bestimmte Rollen aufrufbar, führen aber intern Authentifizierung, Account-/Organisationsstatus, Permission- bzw. Systemrollenprüfung und bei Änderungen zusätzlich Hierarchie-/Konfliktprüfungen durch. Direkte Tabellen-Schreibrechte sind dem Browser entzogen.

Supabase-Hinweise:

- https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable

## Performance Advisor

Die zuvor gemeldeten fehlenden Foreign-Key-Indizes wurden ergänzt. `Unused Index`-Hinweise sind bei einem noch praktisch leeren Projekt erwartbar; die vorgesehenen Indizes werden deshalb nicht vorschnell entfernt.

Supabase-Hinweis:

- https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Nächster technischer Schritt

Als Nächstes folgt die echte Freischaltungs- und Berechtigungsschicht im Frontend:

1. Freischaltungs-/Ablehnungsablauf für Stadt-/Accountverwaltung
2. ersten verwaltenden Account kontrolliert bootstrappen
3. geschützte Navigation anhand echter Organisations-Permissions ein-/ausblenden
4. `Medical`, `Police`, `Fire & Rescue`, `Justice` und Stadtverwaltung mit eigenen Modulrechten versehen
5. Account-/Privatsphäre-Einstellungen aus der Demoansicht in echte Supabase-Daten überführen
6. danach `is_manager` und `role_title` auch als reine Legacy-Anzeigefelder vollständig aus dem aktiven Frontend entfernen
