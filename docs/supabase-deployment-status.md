# LG Nexus – Supabase Deployment-Status

## Stand 10.08.2026

Die technische V1-Grundlage für Accounts, Organisationen, RBAC, Registrierung, Accountfreischaltung und die erste echte Rechte-Navigation ist auf dem Supabase-Projekt `lg_nexus` aktiv.

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
- Owner erhalten automatisch alle normalen `org.*`-Rechte, aber Fachmodulrechte nur für das eigene `service_module`
- Rollen können keine Fachrechte eines fremden Moduls erhalten
- technische Systemrollen zählen ausdrücklich nicht als Fachmodulzugriff
- Medical-, Police- und Fire-&-Rescue-Symbole werden im Frontend nur noch bei echter Berechtigung angezeigt
- nicht angemeldete, noch nicht freigeschaltete oder unberechtigte Benutzer sehen diese geschützten Navigationseinträge nicht

Der Permission-Katalog enthält jetzt **32 aktive Berechtigungen**.

### Phase 3D – echte Stadtverwaltung / Stadthalle

GitHub-Quellmigration:

- `supabase/migrations/20260810170500_phase3d_city_hall_bootstrap_v1.sql`

Neu aktiv:

- reale Organisation `Stadtverwaltung Los Santos`
- Slug `stadtverwaltung-los-santos`
- internes Modul `city`
- geschützte Owner-Rolle `Leitung`
- Standardrolle `Mitarbeiter`
- Mitarbeiter erhalten nicht pauschal Verwaltungsrechte; Rechte werden über Rollen gezielt vergeben
- der erste Entwicklungsaccount ist jetzt regulär Mitglied der Stadtverwaltung und besitzt dort die Rolle `Leitung`
- die vorübergehende technische `system_admin`-Zuweisung des Entwicklungsaccounts wurde wieder entfernt
- Accountfreischaltungen funktionieren weiterhin über die echten `city.accounts.*`-Rechte der Stadtverwaltung

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
- geschützte Medical-/Police-/Fire-Navigation wird anhand echter Organisations-Permissions eingeblendet
- ein technischer Administrator ohne entsprechende Fachmitgliedschaft sieht diese Bereiche nicht

Die sichtbare Oberfläche verwendet weiterhin keine Begriffe wie `RP`, `IC` oder `OOC`.

## Erster Testaccount

Der erste registrierte Testaccount ist aktiv:

- Benutzername: `admin`
- Nexus-ID: `NX-000001`
- Nexus-Mail: `lennox.davis@nexus.ls`
- Status: `active`
- Organisation: `Stadtverwaltung Los Santos`
- Rolle: `Leitung`

Der Account besitzt **keine technische `system_admin`-Zuweisung mehr**. Die Freischaltungsrechte kommen jetzt regulär aus der Stadtverwaltungsmitgliedschaft. Dadurch bleibt die technische Administration von den fachlichen Stadt- und Behördenrechten getrennt.

## Tests nach dem Rollout

Geprüft wurde:

- Phase-1- und Phase-2-Tabellen vorhanden
- RLS auf geschützten Tabellen aktiv
- technische Systemrollen vorhanden
- 32 aktive Permissions vorhanden
- RBAC-RPCs vorhanden
- Foreign-Key-Warnungen des Performance Advisors beseitigt
- echte Registrierungsmigration erfolgreich angewendet
- Edge Function `register-user` aktiv
- sichere Freischaltungs-RPCs erfolgreich angelegt
- erster Testaccount erfolgreich mit `NX-000001` aktiviert
- Stadtverwaltung als echte Organisation angelegt
- erster Testaccount besitzt dort die Owner-Rolle `Leitung`
- `city.accounts.approve` und `city.accounts.reject` wirken über die Stadtverwaltungsrolle
- temporäre `system_admin`-Zuweisung des Testaccounts ist entfernt
- effektive Owner-Rechte der Stadtverwaltung enthalten `city.*` und `org.*`, aber keine `medical.*`, `police.*`, `fire.*` oder `justice.*`-Rechte
- Frontend-Build nach Rechte-Navigation erfolgreich
- GitHub-Pages-Build und Deployment erfolgreich

## Security Advisor

Einige Foundation-Tabellen melden weiterhin `RLS Enabled No Policy`. Das ist momentan beabsichtigt: Tabellen wie Security-/System-Audit oder bestimmte Identitätshistorien sollen nicht pauschal direkt vom Client lesbar sein. Zugriff wird über vorgesehene Adminfunktionen freigeschaltet.

Öffentliche `SECURITY DEFINER`-RPCs sind nur für `authenticated` ausführbar und prüfen intern Authentifizierung, aktiven Accountstatus, Organisationsrechte beziehungsweise gezielt vorgesehene technische Rollen. Direkte Fachaktenrechte entstehen dadurch nicht.

## Nächster technischer Schritt

Als Nächstes folgt die Vertiefung der Fachmodule und der echten Account-Einstellungen:

1. Stadtverwaltung und Justice als eigene sichtbare, rechtegesteuerte Navigationseinträge ergänzen
2. Medical-, Police-, Fire-&-Rescue- und Justice-Organisationen mit ihrem jeweiligen `service_module` vorbereiten
3. erste Fachrollen und feinere Modulrechte ergänzen
4. Account-/Privatsphäre-Einstellungen aus der Demoansicht in echte Supabase-Daten überführen
5. `is_manager` und `role_title` vollständig aus dem aktiven Frontend entfernen
