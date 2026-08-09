# LG Nexus – Technische Blaupause V1

Dieses Dokument übersetzt den fachlichen Entscheidungsstand bis Frage 3410 in eine technische Zielarchitektur. Es ist noch keine Datenbankmigration.

## Zielbild

LG Nexus bleibt eine React-/TypeScript-Webanwendung mit Supabase als Backend.

V1:

- React + TypeScript + Vite
- Supabase Auth
- PostgreSQL
- Row Level Security
- Supabase Realtime nur für ausgewählte Live-Bereiche
- GitHub als Quelle für Code, Dokumentation und Migrationen
- keine direkte FiveM-Verbindung in V1

## Architekturprinzipien

### Fachmodule getrennt halten

Medical, Police, Fire & Rescue, Justice, Stadtverwaltung, Organisationen, Mail, Events und Memories erhalten getrennte Datenbereiche. Stark unterschiedliche Rechte- und Aufbewahrungsregeln werden nicht in eine universelle Vorgangstabelle gepresst.

### Gemeinsame Infrastruktur zentral bauen

Modulübergreifend gemeinsam genutzt werden:

- Benutzeridentität und Nexus-ID
- Organisationen, Rollen und Rechte
- Benachrichtigungen
- Versions- und Statushistorien
- Moderationsmeldungen
- Kalenderverknüpfungen
- Nummernkreise
- Papierkorb, Archiv und Aufbewahrung

### Stabile technische IDs

Fachdatensätze erhalten unveränderliche UUIDs. Sichtbare Nummern wie `NX-000001`, Fallnummern oder Behandlungsnummern sind zusätzliche eindeutige Anzeigeschlüssel und niemals die eigentliche Primär-ID.

Personen und Organisationen werden immer über feste IDs verknüpft. Namensänderungen und Organisationsumbenennungen zerstören daher keine Beziehungen.

## Account- und Identitätskern

`auth.users` bleibt die technische Authentifizierungsquelle. `public.profiles` bleibt die zentrale Nexus-Person und wird langfristig um fachlich passende Nebentabellen ergänzt.

Nebentabellen sind insbesondere sinnvoll für:

- Namenshistorie
- Accountstatus-Historie
- Blockierungen
- Profil-Badges
- externe Profil-Links
- persönliche Favoriten
- Anzeige-/Profileinstellungen

## Organisationskern

Das frühe Modell mit `role_title` und `is_manager` wird später durch ein echtes Rollenmodell ersetzt.

Zielobjekte:

- Organisation
- Organisationsstandort
- Rolle
- Permission
- Role-Permission-Zuordnung
- Mitgliedschaft
- Mitgliedschaftshistorie
- interne Mitgliedsnotizen
- Organisationsprotokoll

Eine Mitgliedschaft besitzt genau eine aktive Rolle. Owner ist eine geschützte Systemrolle der jeweiligen Organisation.

## Rechteebenen

Vier Ebenen werden getrennt ausgewertet:

1. Accountstatus
2. technische Systemrolle
3. Organisationsmitgliedschaft und Organisationsrolle
4. zusätzliche Datensatz-/Fallfreigabe

Die strengste relevante Regel gewinnt. Ein allgemeines Organisationsrecht darf geschützte Fachfreigaben nicht umgehen.

Technische Rollen und IC-Rollen bleiben getrennt. Ein technischer Administrator erhält dadurch keinen automatischen fachlichen Zugriff auf Medical-, PD- oder Justice-Inhalte.

## Bearbeitungskonflikte

Bearbeitbare Kerndatensätze erhalten eine Versionsnummer, z. B. `row_version`.

Beim Speichern wird geprüft, ob die geladene Version noch aktuell ist. Hat inzwischen jemand anderes gespeichert:

- der zweite Speichervorgang wird abgewiesen
- die noch nicht gespeicherten Eingaben bleiben im Formular sichtbar und kopierbar
- der Datensatz muss neu geladen werden

Es gibt keine dauerhafte Bearbeitungssperre.

## Historienarten

Drei Dinge werden technisch unterschieden:

- Fachversion: frühere Inhaltsstände
- Statushistorie: Ablauf eines Vorgangs
- Auditlog: wichtige administrative/systemische Aktion

Nicht jedes Modul braucht alle drei Arten.

## Papierkorb, Archiv und Aufbewahrung

Papierkorb und Archiv sind getrennte Zustände.

Typische Soft-Delete-Felder:

- `deleted_at`
- `deleted_by`
- optionaler Löschgrund
- geplanter endgültiger Löschzeitpunkt

Archivierte Datensätze bleiben fachlich vorhanden, solange die Modulregeln dies vorsehen.

Besondere Dauerregeln:

- Medical-Akteninhalte werden niemals automatisch gelöscht
- Justice-Verfahren und relevante Verfahrensakten bleiben dauerhaft

Automatische Bereinigung darf nur Datensätze entfernen, deren Modulregel eine endgültige Löschung ausdrücklich erlaubt.

## Nummernkreise

Sichtbare Nummern werden zentral und transaktionssicher erzeugt.

Vorgesehen sind unter anderem Nummern für:

- Nexus-ID
- Medical-Behandlungen
- Rezepte und Bescheinigungen
- PD-Fälle, Beweise und Bußgelder
- FD-Einsätze
- gemeinsame Vorfälle
- Justice-Verfahren und Befehle
- Verwaltungsdokumente

## Benachrichtigungen

Benachrichtigungen bleiben eine zentrale Infrastruktur. Fachmodule erzeugen Benachrichtigungen über definierte serverseitige Aktionen.

Kerninformationen:

- Empfänger
- Kategorie
- Priorität
- Titel/Kurztext
- Ziel innerhalb von Nexus
- gelesen/ungelesen
- archiviert
- Pflichtmeldung ja/nein
- optionaler Gruppierungsschlüssel
- Aufbewahrungszeitpunkt

## Realtime

Realtime wird nur dort eingesetzt, wo es echten Nutzen bringt.

Gute V1-Kandidaten:

- Organisationsstatus
- Benachrichtigungen
- Organisations-Mail/Kundenanfragen
- Taskboard
- gemeinsame Vorfälle
- Statusänderungen laufender Vorgänge

Nicht jede Tabelle wird automatisch als Realtime-Tabelle behandelt.

## Suche

Die globale Suche bleibt auf öffentliche Inhalte begrenzt.

Geschützte Modul-Suchen arbeiten separat. Verborgene Telefonnummern, Nexus-Mail-Adressen oder andere private Felder werden nie in allgemein lesbare Suchdaten kopiert.

## Kalenderverknüpfungen

Andere Module erzeugen bei Bedarf referenzierte Kalendereinträge, anstatt Kalenderdaten doppelt zu speichern.

Beispiele:

- Reservierung
- Bewerbungsgespräch
- Justice-Verhandlung
- manuell übernommene Aufgabe

Der Kalendereintrag speichert Quelle und Quell-ID.

## Modulverknüpfungen

Eine Verknüpfung gewährt niemals automatisch Zugriff auf das Ziel.

Beispiel: Eine Aufgabe kann auf einen geschützten Fall verweisen. Ohne Fallrecht sieht der Nutzer den Fallinhalt trotzdem nicht.

## Frontend-Struktur

Empfohlene Feature-Aufteilung:

```text
src/
  app/
  components/
  features/
    auth/
    profiles/
    organizations/
    notifications/
    mail/
    calendar/
    business/
    jobs/
    events/
    map/
    memories/
    games/
    medical/
    police/
    fire-rescue/
    justice/
    city-admin/
    shared-incidents/
    system-admin/
  lib/
  routes/
  types/
```

Fachlogik gehört in Feature-Module und nicht in große globale Komponenten.

## V1 ohne FiveM

Nicht Teil von V1:

- `/nexus`
- Ingame-Tablet-Brücke
- Job-/Dienststatus-Synchronisation
- Wegpunktübertragung
- Liveposition
- Fahrzeug-/Kennzeichensynchronisation

Die spätere Integrationsarchitektur wird separat vorbereitet.

## Übergang vom bestehenden Schema

Die vorhandenen Core-Migrationen bleiben zunächst unangetastet. Vor der ersten größeren V1-Migration wird ein Übergangsplan erstellt, insbesondere für das einfache bisherige Organisationsmitgliedsmodell und die vorhandenen Profilfelder.

## Voraussetzung vor echten Migrationen

Vor dem nächsten großen Datenbankausbau müssen vorliegen:

1. vollständige Tabellen-/Entity-Map
2. Foreign-Key-Plan
3. Permission-Katalog
4. RLS-Matrix je Tabellenfamilie
5. Nummernkreisplan
6. Aufbewahrungsmatrix
7. Liste komplexer serverseitiger Aktionen
8. Migrationsreihenfolge
9. Rechte-/Lebenszyklus-Testfälle
10. Restore-/Rückfallplan
