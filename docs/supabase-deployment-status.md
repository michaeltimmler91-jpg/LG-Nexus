# LG Nexus – Supabase Deployment-Status

## Stand 10.08.2026

Die technische V1-Grundlage für Accounts, Organisationen, RBAC, Registrierung, Accountfreischaltung, rechtegesteuerte Navigation sowie die fünf Behörden-/Fachorganisationen ist auf dem Supabase-Projekt `lg_nexus` aktiv.

## Angewandte Phasen

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

Technische Systemrollen:

- `system_admin`
- `security_admin`
- `backup_operator`
- `moderator`

Keine dieser Rollen erhält automatisch Medical-, Police-, Fire- oder Justice-Fachzugriff.

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
- sichere Organisationsprofil-/Statusänderungen
- Rollenwechsel mit Hierarchieprüfung
- geschützter Owner-Weg
- optimistische Konfliktprüfung über `row_version`
- Audit-/History-Einträge bei relevanten Änderungen

### Phase 2C – RLS-/Index-Härtung

Supabase-Migrationsversion:

- `20260809203509_phase2c_rls_and_index_hardening_v1`

GitHub-Quellmigration:

- `supabase/migrations/20260809224500_phase2c_rls_and_index_hardening_v1.sql`

Enthalten sind:

- zusammengeführte SELECT-Policy für öffentliche beziehungsweise eigene Organisationen
- fehlende Foreign-Key-Indizes aus dem Supabase Performance Advisor
- Vorbereitung für Rollen-, Historien-, Security- und Audit-Abfragen unter Last

### Phase 3A – echte Account-Registrierung

GitHub-Quellmigration:

- `supabase/migrations/20260810074500_phase3_auth_registration_foundation_v1.sql`

Aktiv sind:

- automatische Profilanlage bei neuem Supabase-Auth-Benutzer
- neue Accounts starten als `pending`
- Nexus-ID und Nexus-Mail erst bei Freischaltung
- serverseitiger Registrierungs-Throttle
- Edge Function `register-user`
- Registrierung mit Vorname, Nachname, Benutzername, Geburtsdatum und Passwort
- sichtbare Anmeldung ausschließlich mit Benutzername + Passwort
- keine Service-/Secret-Keys im Browser

### Phase 3B – Freischaltung durch die Stadthalle

GitHub-Quellmigration:

- `supabase/migrations/20260810164500_phase3_account_approval_v1.sql`

Neu aktiv:

- `city.accounts.view`
- `city.accounts.approve`
- `city.accounts.reject`
- `get_account_admin_context()`
- `list_pending_accounts()`
- `review_pending_account(...)`
- eindeutige Nexus-ID-Vergabe über `nexus_id_seq`
- automatische Nexus-Mail-Vergabe bei Freischaltung
- permanente Accountstatus-Historie
- System-Audit bei Freischaltung/Ablehnung
- Ablehnung nur mit Begründung

### Phase 3C – Modulrechte und sichtbare Rechte-Navigation

GitHub-Quellmigration:

- `supabase/migrations/20260810165500_phase3c_module_navigation_permissions_v1.sql`

Neu aktiv:

- `organizations.service_module` für `city`, `medical`, `police`, `fire` und `justice`
- `city.access`
- `medical.access`
- `police.access`
- `fire.access`
- `justice.access`
- Owner erhalten normale `org.*`-Rechte sowie nur Fachrechte ihres eigenen `service_module`
- Rollen können keine Fachrechte eines fremden Moduls erhalten
- technische Systemrollen zählen nicht als Fachmodulzugriff
- geschützte Navigation wird anhand der echten Organisationsrechte ein-/ausgeblendet

Der Permission-Katalog enthält aktuell **32 aktive Berechtigungen**.

### Phase 3D – echte Stadtverwaltung / Stadthalle

GitHub-Quellmigration:

- `supabase/migrations/20260810170500_phase3d_city_hall_bootstrap_v1.sql`

Aktiv:

- reale Organisation `Stadtverwaltung Los Santos`
- Slug `stadtverwaltung-los-santos`
- Modul `city`
- Owner-Rolle `Leitung`
- Standardrolle `Mitarbeiter`
- der erste Entwicklungsaccount ist regulär Mitglied der Stadtverwaltung als `Leitung`
- die temporäre technische `system_admin`-Zuweisung wurde wieder entfernt
- Accountfreischaltungen funktionieren über echte `city.accounts.*`-Rechte

### Phase 3E – Medical / Police / Fire & Rescue / Justice als echte Organisationen

GitHub-Quellmigration:

- `supabase/migrations/20260810171600_phase3e_service_organizations_v1.sql`

Auf Supabase aktiv angelegt:

- `Los Santos Medical Center` / `LSMC` / Modul `medical`
- `Los Santos Police Department` / `LSPD` / Modul `police`
- `Los Santos Fire & Rescue` / `LSFR` / Modul `fire`
- `Justiz Los Santos` / `Justice` / Modul `justice`

Jede Organisation besitzt zunächst:

- geschützte Owner-Rolle `Leitung`
- eine konservative Standardrolle
- ausschließlich die zum eigenen Modul passende Einstiegsberechtigung für die Standardrolle

Standardrollen:

- Medical: `Medizinischer Dienst` → `medical.access`
- Police: `Polizeidienst` → `police.access`
- Fire & Rescue: `Einsatzdienst` → `fire.access`
- Justice: `Justizdienst` → `justice.access`

Es wurden bewusst noch keine erfundenen Detailrollen oder pauschalen Fachaktenrechte vergeben. Feinere Fachrechte folgen getrennt und werden später durch RLS abgesichert.

## Frontend-Status

Die GitHub-Pages-Vorschau ist direkt mit `lg_nexus` verbunden.

Aktiv im sichtbaren Frontend:

- echter Login und echte Registrierung
- persistente Supabase-Session
- echter Profil-/Accountstatus
- Nexus-ID und Nexus-Mail nach Freischaltung
- echte Organisationskontexte über `get_my_organization_context()`
- Accountfreischaltungen mit Freischalten/Ablehnen
- rechtegesteuerte Medical-/Police-/Fire-Navigation
- eigener rechtegesteuerter Navigationseintrag **Stadtverwaltung**
- eigener rechtegesteuerter Navigationseintrag **Justice**
- eigener interner Stadtverwaltungsbereich
- Accountfreischaltungs-Panel wird beim Öffnen der Stadtverwaltung direkt dort eingebunden
- Justice besitzt bereits eine interne Vorschauseite für Verfahren, Anhörungen, Entscheidungen und Beweismittel
- unberechtigte Benutzer sehen die jeweiligen Fachbereiche nicht

Die sichtbare Nexus-Oberfläche verwendet keine Begriffe wie `RP`, `IC` oder `OOC`.

## Erster Testaccount

Der erste registrierte Testaccount ist aktiv:

- Benutzername: `admin`
- Nexus-ID: `NX-000001`
- Nexus-Mail: `lennox.davis@nexus.ls`
- Status: `active`
- Organisation: `Stadtverwaltung Los Santos`
- Rolle: `Leitung`

Der Account besitzt keine technische `system_admin`-Zuweisung. Seine Verwaltungsrechte stammen regulär aus der Stadtverwaltungsmitgliedschaft. Er besitzt dadurch aktuell keinen automatischen Zugriff auf Medical, Police, Fire & Rescue oder Justice.

## Tests nach dem Rollout

Geprüft wurde:

- RLS/RBAC-Grundlage aktiv
- 32 aktive Permissions vorhanden
- Registrierung und Freischaltungs-RPCs aktiv
- Stadtverwaltung als echte Organisation aktiv
- City-Hall-Owner-Rechte enthalten `city.*` und `org.*`, aber keine fremden Fachmodulrechte
- Medical-, Police-, Fire-&-Rescue- und Justice-Organisationen vorhanden
- jede Fachorganisation besitzt Owner- und Standardrolle
- jede Fach-Standardrolle besitzt nur die eigene `*.access`-Berechtigung
- Frontend-Build nach City-/Justice-Navigation erfolgreich
- GitHub-Pages-Build erfolgreich
- GitHub-Pages-Deployment erfolgreich

## Security-Hinweis

Einige Foundation-Tabellen melden weiterhin `RLS Enabled No Policy`. Das ist beabsichtigt: Security-/System-Audit und bestimmte Identitätshistorien werden nicht pauschal direkt für den Client geöffnet.

Öffentliche `SECURITY DEFINER`-RPCs sind nur für vorgesehene Rollen aufrufbar und prüfen intern Authentifizierung, aktiven Accountstatus sowie Organisations- beziehungsweise Systemrechte. Fachaktenzugriffe entstehen daraus nicht automatisch.

## Nächster technischer Schritt

1. Mitglieder-/Rollenverwaltung als echte Nexus-Oberfläche bauen
2. damit Benutzer kontrolliert Medical, Police, Fire & Rescue, Justice oder Stadtverwaltung zugewiesen werden können
3. danach feinere Fachberechtigungen pro Modul definieren und technisch absichern
4. Account-/Privatsphäre-Einstellungen aus der Demoansicht in echte Supabase-Daten überführen
5. verbliebene Legacy-Felder `is_manager` und `role_title` aus dem aktiven Frontend entfernen
6. erst danach die eigentlichen Fachdatentabellen und RLS-Regeln für Medical, Police, Fire und Justice schrittweise umsetzen
