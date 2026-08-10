# LG Nexus – Supabase Deployment-Status

## Stand 10.08.2026

Die technische V1-Grundlage für Accounts, Organisationen, RBAC, Registrierung und Accountfreischaltung ist auf dem Supabase-Projekt `lg_nexus` aktiv.

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

### Phase 2C – RLS-/Index-Härtung

Supabase-Migrationsversion:

- `20260809203509_phase2c_rls_and_index_hardening_v1`

GitHub-Quellmigration:

- `supabase/migrations/20260809224500_phase2c_rls_and_index_hardening_v1.sql`

Enthalten sind:

- zusammengeführte SELECT-Policy für öffentliche bzw. eigene Organisationen
- fehlende Foreign-Key-Indizes aus dem Supabase Performance Advisor
- Vorbereitung für Rollen-, Historien-, Security- und Audit-Abfragen unter Last

### Phase 3A – echte Account-Registrierung

GitHub-Quellmigration:

- `supabase/migrations/20260810074500_phase3_auth_registration_foundation_v1.sql`

Aktiv sind:

- automatische Anlage eines `profiles`-Datensatzes bei neuem Supabase-Auth-Benutzer
- neue Accounts starten als `pending`
- Nexus-ID und Nexus-Mail werden erst bei Freischaltung erzeugt
- serverseitiger Registrierungs-Throttle mit gehashter Client-IP
- öffentliche Edge Function `register-user`
- Registrierung mit Vorname, Nachname, Benutzername, Geburtsdatum und Passwort
- Anmeldung nach außen ausschließlich mit Benutzername + Passwort
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
- permanente Accountstatus-Historie bei Freischaltung/Ablehnung
- System-Audit-Einträge für Freischaltung und Ablehnung
- Ablehnung nur mit Begründung
- normale Stadthallenmitarbeiter erhalten Zugriff später ausschließlich über ihre Organisationsrolle und die passenden Rechte
- `system_admin` dient nur als technischer Bootstrap-/Notfallzugang und erhält dadurch keine Fachaktenrechte

Der Permission-Katalog enthält jetzt **27 aktive Kernberechtigungen**.

## Frontend-Status

Die GitHub-Pages-Vorschau ist direkt mit dem echten `lg_nexus`-Projekt verbunden.

Aktiv im sichtbaren Frontend:

- echter Login mit Benutzername + Passwort
- echte Registrierung
- Supabase-Session bleibt im Browser erhalten
- eigener Profil-/Accountstatus wird aus `profiles` geladen
- `pending`, `active`, `suspended`, `rejected` und `disabled` werden sichtbar unterschieden
- nach Freischaltung werden Nexus-ID und Nexus-Mail angezeigt
- `get_my_organization_context()` wird für aktive Accounts geladen
- der Demo-Account wird durch den echten Accountstatus überlagert
- Accountseite zeigt echte Accountdaten
- berechtigte Mitarbeiter sehen auf der Accountseite zusätzlich **Accountfreischaltungen**
- offene Registrierungen zeigen Name, Benutzername, Geburtsdatum und Registrierungszeit
- Freischalten und Ablehnen sind direkt in Nexus möglich
- bei Ablehnung ist eine Begründung Pflicht

Die sichtbare Oberfläche verwendet weiterhin keine Begriffe wie `RP`, `IC` oder `OOC`.

## Erster Testaccount / Bootstrap

Der erste registrierte Testaccount wurde für die Entwicklung kontrolliert aktiviert:

- Benutzername: `admin`
- Nexus-ID: `NX-000001`
- Nexus-Mail: `lennox.davis@nexus.ls`
- Status: `active`

Der Account besitzt vorübergehend die technische Rolle `system_admin`, damit die Freischaltungsoberfläche getestet und weitere Accounts freigeschaltet werden können. Diese technische Rolle verleiht ausdrücklich keinen Medical-, Police-, Fire- oder Justice-Fachzugriff und kann entfernt werden, sobald ein echter Stadthallen-Administrator eingerichtet ist.

## Tests nach dem Rollout

Geprüft wurde:

- Phase-1- und Phase-2-Tabellen vorhanden
- RLS auf geschützten Tabellen aktiv
- technische Systemrollen vorhanden
- 27 aktive Kern-Permissions vorhanden
- RBAC-RPCs vorhanden
- Phase 2B und Phase 2C in der Supabase-Migrationshistorie vorhanden
- Foreign-Key-Warnungen des Performance Advisors beseitigt
- echte Registrierungsmigration erfolgreich angewendet
- Edge Function `register-user` aktiv
- sichere Freischaltungs-RPCs erfolgreich angelegt
- erster Testaccount erfolgreich mit `NX-000001` aktiviert
- technischer Bootstrap-Zugriff erfolgreich zugewiesen
- Frontend-Build nach Freischaltungsoberfläche erfolgreich
- GitHub-Pages-Build erfolgreich
- GitHub-Pages-Deployment erfolgreich

## Security Advisor

Einige Foundation-Tabellen melden weiterhin `RLS Enabled No Policy`. Das ist momentan beabsichtigt: Tabellen wie Security-/System-Audit oder bestimmte Identitätshistorien sollen nicht pauschal direkt vom Client lesbar sein. Zugriff wird über vorgesehene Adminfunktionen freigeschaltet.

Öffentliche `SECURITY DEFINER`-RPCs sind nur für `authenticated` ausführbar und prüfen intern Authentifizierung, aktiven Accountstatus, Stadthallen-Permission bzw. technische Systemrolle. Direkte fachliche Tabellenrechte entstehen dadurch nicht.

## Nächster technischer Schritt

Als Nächstes folgt die echte sichtbare Rechte-Navigation:

1. geschützte Navigation anhand echter Organisations-Permissions ein-/ausblenden
2. Stadtverwaltung als reale Organisation mit Rollen und Accountverwaltungsrechten anlegen
3. `Medical`, `Police`, `Fire & Rescue`, `Justice` und Stadtverwaltung mit eigenen Modulrechten versehen
4. Account-/Privatsphäre-Einstellungen aus der Demoansicht in echte Supabase-Daten überführen
5. `is_manager` und `role_title` vollständig aus dem aktiven Frontend entfernen
