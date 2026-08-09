# LG Nexus – Implementierungsfahrplan V1

Dieser Fahrplan beschreibt die empfohlene Reihenfolge für Datenbank, Backend und Frontend. Er setzt den Entscheidungsstand bis Frage 3410 sowie die technische Blaupause voraus.

## Grundregel

Nicht alle Module gleichzeitig beginnen. Zuerst wird die gemeinsame Plattform stabil gebaut, danach die Fachmodule.

Jede Phase endet mit:

- Migrationen versioniert in GitHub
- RLS-/Rechtetests
- Frontend-Grundfunktion
- Fehlerfälle
- Lösch-/Archivregeln
- kurze technische Dokumentation

## Phase 0 – Schema-Transition

Ziel: die frühe Demo-Basis kontrolliert in das endgültige Rollen-/Accountmodell überführen.

Aufgaben:

- vorhandene Migrationen inventarisieren
- `profiles` gegen Zielmodell abgleichen
- bestehende `organization_members`-Struktur analysieren
- Übergang von `role_title/is_manager` zu Rollen + Permissions planen
- alte Policies erfassen
- Migrations-/Rollbackreihenfolge dokumentieren

Noch keine Fachmodule erweitern.

## Phase 1 – Identität, Accounts und Grundsystem

### Datenbank

- Profile vervollständigen
- Accountstatus-Historie
- Namenshistorie
- Privacy-Grundstruktur
- Systemrollen
- Profileinstellungen
- Blockierungen

### Backend

- Registrierungs-/Freischaltungsaktionen
- sichere Profilansicht
- Privacy-Auflösung
- Namensänderungs-/Korrekturgrundlage

### Frontend

- Login
- Registrierung
- pending/rejected/suspended-Seiten
- Account/Profileinstellungen
- öffentliche/geschützte Profilansicht

### Fertig wenn

- Accountstatus kann keine verbotenen Bereiche umgehen
- Privacy ist serverseitig wirksam
- Namens-/ID-Verknüpfung stabil

## Phase 2 – Organisationen, Rollen und Rechte

### Datenbank

- Organisationen bereinigen
- Standorte
- Rollen
- Permissions
- Role-Permission-Zuordnung
- Mitgliedschaften
- Mitgliedschaftshistorie
- Owner-Sonderlogik
- Organisationsaudit

### Backend

- Rollenprüfung
- Hierarchieprüfung
- Mitglied aufnehmen/entfernen
- Rolle zuweisen
- inaktiv/aktiv
- Owner ernennen/entziehen

### Frontend

- Organisationsprofil
- Mitgliederverwaltung
- Rolleneditor
- Rechteeditor
- Standortverwaltung

### Fertig wenn

- kein `is_manager` mehr als dauerhafte Hauptberechtigung nötig ist
- alle Organisationsmodule denselben Permission-Katalog verwenden können

## Phase 3 – Querschnittsfunktionen

Parallel nur in klar getrennten Teilpaketen.

### 3A Benachrichtigungen

- zentrale Notification-Tabelle
- read/unread
- Archiv/Papierkorb
- Gruppierung
- DND
- Deep-Links
- Systemmeldungen

### 3B Kalender

- persönliche Termine
- Einladungen
- Erinnerungen
- Organisationstermine
- Serien
- Quellverknüpfungen

### 3C technische Historie

- Nummernkreise
- Fehler-IDs
- systemische Audit-Grundlagen
- Aufbewahrungs-/Cleanup-Grundlage

## Phase 4 – Kommunikation

### Persönliche Nexus-Mail

- Threads
- Nachrichten
- Empfänger
- Lesestatus
- Labels/Kategorien
- Filterregeln
- Archiv/Papierkorb
- Blockierlogik

### Organisations-Mail

- Organisationsadressen
- rollenbezogene Postfächer
- Routing Adresse → Postfach
- Threads/Nachrichten
- Zuweisung
- interne Notizen

Diese Phase kommt vor Kundenanfragen, weil Kundenanfragen fachlich auf der Organisationskommunikation aufbauen.

## Phase 5 – Business und Kundenservice

### Angebote

- Kategorien
- Angebote
- Varianten
- Zusatzleistungen
- Aktionen
- standortabhängige Preise
- Bundles
- Favoriten

### Kundenanfragen

- Anfragearten
- dynamische Formulare
- Zuweisungen
- Status
- Kommentare

### Reservierungen

- Reservierungsarten
- Terminfenster
- Fragen
- Buchungen
- Warteliste
- Umbuchungen
- wiederkehrende/mehrteilige Reservierungen
- Kalenderverknüpfung

## Phase 6 – Taskboard und Dokumente

### Taskboard

- Status
- Aufgaben
- Zuweisungen
- Sichtbarkeit
- Kommentare
- Checkliste
- Pflichtbestätigungen
- Vorlagen
- Wiederholungen
- Kanban + Liste

### Dokumente/Wissensdatenbank

- Ordner
- Rollenfreigaben
- Versionen
- Lesebestätigungen
- Vorlagen
- Kommentare
- Wissensartikel/Tags

## Phase 7 – Jobs und Bewerbungen

- Stellenangebote
- interne Stellen
- Bewerbungsfragen
- Bewerbungen
- Bearbeiter
- Rückfragen
- Gesprächsstufen
- Praxistests
- Empfehlungen
- Kalendertermine
- Aufnahme als Organisationsmitglied

## Phase 8 – Events und City Hub

### Events

- Events/Serien
- Veranstalter
- Team
- Teilnehmer/Warteliste
- Gästelisten
- Zugangsbeschränkungen
- Ticketcodes
- Programm
- Helferschichten
- Sponsoren
- Feedback

### City Hub

- Beiträge
- Kategorien
- Kommentare/Reaktionen
- Pressemitteilungen
- FAQ
- Changelog
- Warnungen/Banner

## Phase 9 – LS Map

- öffentliche Marker
- Freigaben
- Meldungen
- Event-/Organisationsverknüpfung
- persönliche Marker/Listen
- gespeicherte Ansichten
- interne Layer
- organisationsübergreifende Freigaben
- Cayo/weitere Kartenbereiche

## Phase 10 – Memories und Games

### Memories

- persönliche/Org-/Event-Alben
- Bilder
- Tags mit Bestätigung
- Kommentare/Reaktionen
- Moderationsanbindung

### Games

- Spielkatalog
- Sessions
- Scores
- Ranglisten
- Achievements
- Challenges
- Match-Einladungen
- Game-Events

Games darf technisch als eigenes Featurepaket entwickelt werden, sobald Account/Benachrichtigungen stabil sind; es muss nicht zwingend auf die Map warten.

## Phase 11 – Stadtverwaltung

- Bürgerverwaltung
- interne Notizen
- Accountaktionen
- Bürgeranträge
- Terminwarteschlange
- offizielle Dokumente
- Lizenzen
- Firmenregister

Accountaktionen bauen bereits auf Phase 1 auf; hier kommt die vollständige IC-Verwaltungsoberfläche.

## Phase 12 – Medical

Medical erst beginnen, wenn Permission-/RLS-Muster aus den vorherigen Modulen belastbar sind.

Reihenfolge:

1. Patienten-/Akte-Grundmodell
2. Behandlungen
3. Versionierung/Storno
4. Diagnosen/Allergien/Medikation
5. Befunde/OP/Vorsorge/Nachkontrolle
6. Einwilligungen/Sperrvermerke
7. Rezepte/Bescheinigungen
8. Freigaben und Anfragen
9. Ausbildung/Testfälle
10. Abwesenheit

Pflicht: keine generische Auto-Löschung medizinischer Akteninhalte.

## Phase 13 – Police

Reihenfolge:

1. Fälle und Beteiligte
2. Ermittler/Timeline/Kommentare
3. Versiegelung/Sichtbarkeit
4. Beweismittel/Chain of Custody
5. Fall-/Person-/Fahrzeugbeziehungen
6. Vernehmungen/Observation/Ermittlungsaufträge
7. BOLO/Gesucht
8. Fahrzeuge/Flags
9. Bußgelder/Tatbestände
10. Justice-Verknüpfung

## Phase 14 – Fire & Rescue

- Einsatzberichte
- Einsatzabschnitte
- Einheiten/Mitglieder
- Timeline/Kommentare
- Ressourcenanforderungen
- Objekt-/Gefahrendaten
- Gefahrstoffe
- Objektpläne
- Hydranten
- Geräte/Wartung
- Fahrzeugchecks
- Prüfungen/Bescheinigungen

## Phase 15 – Justice

- Verfahren
- Beteiligte/Zuständigkeiten
- Verfahrensbeziehungen
- Dokumente
- Fristen
- Beweisanträge
- Ladungen
- PD-Befehlsanträge
- Hearings/Kalender
- Protokolle
- Urteile
- Korrekturen
- Vollstreckung
- Berufung
- Präzedenzwissen

Pflicht: relevante Justice-Verfahrensdaten dauerhaft.

## Phase 16 – Gemeinsame Vorfälle

Erst nach Medical, PD und FD, weil Shared Incidents deren Freigabemodelle referenzieren.

- Incident-Kern
- Fraktionsbeteiligung
- Federführung
- gemeinsame Notizen/Timeline
- Orte
- selektive Freigaben
- Merge
- Bürgerzusammenfassung

## Phase 17 – Moderation und Systemverwaltung vervollständigen

- zentrale Meldungsübersicht
- Verwarnungen
- technische Diagnose
- Feature Flags
- Betriebsübersicht
- Status/Wartung

## Phase 18 – V1-Stabilisierung

Vor V1-Release:

- komplette Rechte-Testmatrix
- Aufbewahrungs-/Cleanup-Test
- Konfliktbearbeitungstest
- Privacy-Suchtests
- Performance der Hauptlisten
- Browser-/Desktop-Layoutprüfung
- Backup-/Restore-Test
- RLS-Prüfung aller neuen Tabellen
- Security Advisor / Datenbankprüfungen
- Fehlerseiten und Fehler-IDs

## Nach V1 – FiveM

Erst nach stabiler Web-V1:

1. Integrations-API
2. Nexus-ID-Mapping
3. Job/Organisation FiveM → Nexus
4. Dienststatus FiveM → Nexus
5. `/nexus` / Ingame-Tablet
6. Nexus → FiveM-Wegpunkt
7. Retry-/Fehlerqueue und Idempotenz

Keine FiveM-Funktion ist Release-Blocker für V1.

## Empfohlener unmittelbarer nächster Schritt

Nach dieser Planungsphase wird **nicht** sofort Medical oder Police programmiert.

Als nächstes wird Phase 0 ausgearbeitet:

- Ist-Schema vollständig erfassen
- Zieltabellen Phase 1 + 2 konkret definieren
- Transition für Profile und Organisationsmitgliedschaften planen
- danach erste kontrollierte Migrationen
