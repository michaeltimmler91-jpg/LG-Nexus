# LG Nexus – Schema-Transition-Plan V1

Dieses Dokument beschreibt den Übergang vom bereits vorhandenen frühen Supabase-Schema zur geplanten V1-Struktur. Es enthält bewusst noch keine ausführbare Migration.

## 1. Aktueller technischer Stand

Die frühe Basis enthält bereits:

- `public.profiles`
- `public.organizations`
- `public.organization_members`
- `public.organization_status_history`
- `private`-Schema für interne Helper
- Nexus-ID-Sequenz und automatische Identitätsvergabe
- Accountstatus und Nexus-Mail auf `profiles`
- erste Privacy-Felder
- erste RLS-Policies

Das ist eine gute Startbasis, aber nicht mehr ausreichend für das endgültige Rollen-/Rechtemodell.

## 2. Aktuelles Organisationsproblem

`organization_members` verwendet aktuell insbesondere:

- `role_title`
- `is_manager`
- `is_active`

Das kann die inzwischen festgelegten Anforderungen nicht sauber darstellen:

- beliebig viele Rollen
- Hierarchie
- eigene Permission-Keys
- geschützte Owner-Rolle
- eine Rolle pro Mitglied
- Rechte pro Modul
- Rollenbezogene Postfächer
- vertrauliche Aufgaben
- Fachrechte Medical/PD/FD/Justice

Daher wird `is_manager` nicht als dauerhafte V1-Berechtigungsquelle weitergeführt.

## 3. Zielzustand Organisation

Neue Kernstruktur:

- `organization_roles`
- `permissions`
- `organization_role_permissions`
- neue/umgebaute `organization_memberships`

Die bisherige Mitgliedschaft wird bei der Transition übernommen, nicht verworfen.

## 4. Übergangsstrategie Organisation

### Schritt O1 – neue Rollenstruktur ergänzen

Noch nichts Altes löschen.

Anlegen:

- Permission-Katalog
- Rollen je Organisation
- Standardrolle
- Owner-Rolle
- neue Mitgliedschaftsstruktur bzw. neue `role_id`-Spalte

### Schritt O2 – vorhandene Mitglieder migrieren

Für jede bestehende Organisation:

- geschützte Owner-Rolle erzeugen
- normale Standardrolle `Mitarbeiter` erzeugen, falls nicht vorhanden
- vorhandene Mitglieder einer Zielrolle zuordnen

Frühe `is_manager = true`-Mitglieder werden **nicht blind zu Ownern** gemacht. Vor produktiver Migration wird festgelegt, welche realen Personen Owner sein sollen.

### Schritt O3 – neue Permission-Auswertung aktivieren

Neue Funktionen/Policies verwenden nur noch das neue Rollenmodell.

Alte `is_org_manager()`-Logik darf anschließend nicht parallel zweite Wahrheit bleiben.

### Schritt O4 – Kompatibilitätsphase

Frontend wird auf neue APIs/Views umgestellt.

Erst wenn keine aktuelle Funktion mehr `role_title` oder `is_manager` als Berechtigungsquelle benötigt, werden Altspalten entfernt oder als reine historische Übergangsfelder stillgelegt.

## 5. Profile – aktueller Stand

`profiles` besitzt bereits wichtige V1-Grundfelder:

- `username`
- `first_name`
- `last_name`
- `date_of_birth`
- `phone`
- `account_status`
- `nexus_id`
- `nexus_email`
- `approved_at`
- `approved_by`

Zusätzlich existieren nach späteren Migrationen u. a. Pflicht-Passwortwechsel, Ablehnungsgrund und Privacy-Felder.

## 6. Profile – Zielbereinigung

`profiles` bleibt die zentrale Identität, wird aber nicht mit beliebig vielen Historien- und Verwaltungsdaten überladen.

Auslagern in eigene Tabellen:

- Namenshistorie
- Accountstatus-Historie
- Badges
- Blockierungen
- externe Links
- persönliche Favoriten
- technische Systemrollen

## 7. Nexus-ID und Nexus-Mail

Die bestehende Identitätsvergabe bleibt fachlich gültig:

- Nexus-ID erst bei Aktivierung
- stabile Nexus-ID
- Nexus-Mail aus bestätigtem Namen
- Kollisionsauflösung durch Suffix

Vor der nächsten Migration prüfen:

- ob die bestehende Sequenz direkt weiterverwendet wird
- ob spätere allgemeine Nummernkreise diese Sequenz nur ergänzen oder vereinheitlichen

Empfehlung: bestehende Nexus-ID-Sequenz nicht unnötig umnummerieren. Bereits vergebene Nexus-IDs bleiben unverändert.

## 8. Profile-RLS

Die aktuelle starke Beschränkung auf eigenes Rohprofil war als Sicherheits-Härtung sinnvoll.

Für die spätere öffentliche Personensuche sollte **nicht** wieder einfach `SELECT * FROM profiles` für alle aktiviert werden.

Stattdessen:

- sichere öffentliche/personalisierte Profil-View oder RPC
- Privacy-Auswertung serverseitig
- sensible Rohfelder bleiben geschützt

## 9. Organisationen

Die bestehende `organizations`-Tabelle kann grundsätzlich erhalten und erweitert werden.

Bestehende stabile `id` bleibt erhalten.

Dadurch funktionieren spätere Umbenennungen ohne Neuverknüpfung.

Auslagern in Nebentabellen:

- mehrere Standorte
- Rollen
- Angebote
- FAQ
- Galerie
- Mailadressen/Postfächer
- Jobs
- Aufgaben
- Dokumente

Die Basistabelle soll nicht zu einer riesigen Sammelstruktur werden.

## 10. `location_label`

Das frühe einzelne Standortfeld ist durch die Entscheidung für mehrere Standorte fachlich überholt.

Transition:

1. `organization_locations` anlegen
2. vorhandenes `location_label` bei Bedarf als erster/Hauptstandort übernehmen
3. Frontend auf Standorttabelle umstellen
4. Altspalte später entfernen oder nicht mehr verwenden

## 11. Statushistorie

`organization_status_history` kann grundsätzlich bestehen bleiben.

Vor V1 wird geprüft, ob:

- die bestehende Tabelle direkt weitergenutzt wird
- Statuswechsel nach neuer Owner-/Permission-Logik geschrieben werden
- bestehende öffentliche Lesepolicy noch zum endgültigen Datenschutzmodell passt

## 12. Realtime

Die frühe Veröffentlichung von `organizations` in Supabase Realtime kann bleiben, wenn RLS und Nutzwert passen.

Weitere Tabellen werden **nicht pauschal** hinzugefügt.

Neue Realtime-Tabellen erst nach jeweiliger Modulprüfung.

## 13. Migrationsphasen

### M1 – Querschnittsgrundlagen

- `row_version`-Konvention
- gemeinsame Zeitstempelkonvention
- Systemrollen
- Account-/Namenshistorie

### M2 – Organisationsrollen

- Permission-Katalog
- Rollen
- Role-Permissions
- Mitgliedschaftstransition

### M3 – Organisationsstandorte

- mehrere Standorte
- Migration `location_label`

### M4 – neue sichere Profile-Ausgabe

- Privacy-Auswertung
- öffentliche/personalisierte Profilansicht
- Suchbasis

### M5 – Benachrichtigungen/Kalender

Erste gemeinsame Infrastruktur, auf die viele spätere Module angewiesen sind.

Danach folgen die Fachmodule gemäß `implementation-roadmap-v1.md`.

## 14. Migrationssicherheit

Für jede Transition gilt:

- bestehende IDs niemals unnötig neu erzeugen
- Daten zuerst kopieren/migrieren, Altstruktur erst später entfernen
- neue Policies vor Freigabe testen
- bei kritischem Rollenumbau Datenmengen/Zuordnungen vorher prüfen
- jede Migration einzeln versionieren
- keine manuelle Produktionsänderung außerhalb der dokumentierten Migrationen

## 15. Testfälle für Rollenumbau

Vor Entfernen der Altlogik mindestens testen:

- normales Mitglied ohne Verwaltungsrecht
- Mitglied mit einem einzelnen Verwaltungsrecht
- Mitglied mit mehreren Rechten
- Owner
- inaktives Mitglied
- Mitglied mehrerer Organisationen mit unterschiedlichen Rollen
- Rollenwechsel
- Rollenlöschung mit/ohne Zuweisungen
- Austritt
- Wiederaufnahme
- Organisation ohne Owner
- Stadtverwaltungs-Notfallaktion

## 16. Was ausdrücklich noch nicht passiert

Dieser Transition-Plan führt noch **keine** Datenbankänderung aus.

Erst nach finalem Tabellen-/Permission-Abgleich werden M1 und M2 als konkrete SQL-Migrationen vorbereitet.
