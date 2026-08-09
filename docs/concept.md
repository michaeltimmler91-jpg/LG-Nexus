# LG Nexus – Gesamtkonzept

## Grundidee

LG Nexus ist die digitale Infrastruktur der RP-Stadt und deutlich mehr als ein Behörden-MDT.

Es verbindet öffentliche Bürgerfunktionen, Unternehmen, Kommunikation, Kalender, Events und Karten mit streng getrennten internen Organisations- und Behördenmodulen.

## Öffentliche / persönliche Hauptbereiche

- Dashboard
- Unternehmen / Business-Verzeichnis
- Angebote, Kundenanfragen und Reservierungen
- Stellenangebote
- Events
- City Hub
- LS Map
- Kalender
- Nexus-Mail
- Personenprofile
- Memories
- Games
- Benachrichtigungen

## Berechtigungsabhängige interne Bereiche

Je nach Organisation/Rolle erscheinen zusätzliche Module, insbesondere:

- Organisationsverwaltung
- Aufgaben / Taskboard
- Organisations-Mail
- Dokumente / Wissensdatenbank
- Medical
- Police
- Fire & Rescue
- Justice
- Stadtverwaltung
- gemeinsame Vorfälle/Einsätze
- technische Administration

## Navigation

Schmale feste Icon-Leiste links.

- aktive App hervorgehoben
- Tooltips bei Hover
- Benachrichtigungsindikatoren
- große Apps besitzen eigene interne Unterbereiche
- öffentliche Apps sichtbar, geschützte Apps nur bei Berechtigung

V1 wird primär für Desktop und feste Tablet-/Ingame-Darstellung gestaltet. Eine spezielle Smartphone-Navigation ist keine V1-Anforderung.

## Design

- moderner dunkler Grundstil
- Dark Mode Standard
- optional Light Mode
- persönliche Akzentfarbe
- High-Contrast-Modus als persönliche Einstellung

## Organisationen und Unternehmen

Öffentliche Profile können unter anderem besitzen:

- Name, Beschreibung, Logo/Titelbild
- mehrere Standorte
- Kontakt
- Öffnungszeiten
- manueller Status geöffnet/eingeschränkt/geschlossen
- Statustext
- Angebote/Leistungen
- Reservierungen
- FAQ
- Galerie
- Bewertungen
- Stellenangebote

Interne Organisationen verwenden Rollen-/Rechtesystem, Mail, Dokumente, Aufgaben und Kalender.

## Bürger und Identität

- 1 Account = 1 RP-Charakter
- stabile Nexus-ID
- interner Nexus-Mailaccount
- Privatsphäre für persönliche Kontakt-/Profilfelder
- RP-Namensänderungen nur über Stadtverwaltungsprozess
- historische Fachreferenzen bleiben bei Accountlöschung erhalten

## Staatliche Zusammenarbeit

PD, Medical und Fire & Rescue können gemeinsame Vorfälle nutzen.

Der gemeinsame Bereich bleibt bewusst schlank. Geschützte Fachdaten werden nicht automatisch geteilt, sondern nur gezielt freigegeben.

Besondere Grenzen:

- Stadtverwaltung kein Medical-Zugriff
- Stadtverwaltung kein interner PD-Zugriff
- Stadtverwaltung kein interner FD-Zugriff
- Stadtverwaltung nur read-only auf Justice
- technische Systemadministration erhält ebenfalls keinen automatischen fachlichen Medical-/PD-/Justice-Zugriff

## Datenhaltung

Aufbewahrung richtet sich nach Fachmodul.

Besonders wichtig:

- **Medical-Akteninhalte werden niemals automatisch gelöscht**
- Justice-Verfahren und relevante Verfahrensakten bleiben dauerhaft
- andere Module besitzen ihre ausdrücklich festgelegten Fristen

## V1 und FiveM

**V1 funktioniert vollständig ohne direkte FiveM-Verbindung.**

Das gilt auch für:

- `/nexus`
- Ingame-Tablet-Öffnung
- Wegpunktübertragung
- Job-/Dienststatus-Synchronisation

Diese Dinge sind erst für eine spätere Integrationsphase vorgesehen.

Die V1-Web-App bleibt vollständig außerhalb von FiveM nutzbar.

## Spätere FiveM-Integration

Architektonisch vorbereitet werden sichere, versionierte Schnittstellen.

Geplant nach V1:

- Job/Organisation: FiveM → Nexus
- Dienststatus: FiveM → Nexus
- `/nexus` / Ingame-Tablet
- Nexus → FiveM-Wegpunkt

FiveM erhält niemals direkte privilegierte Supabase-Service-Schlüssel.

## Technik

- React
- TypeScript
- Vite
- Supabase Auth
- PostgreSQL
- Row Level Security
- Supabase Realtime, wo fachlich sinnvoll
- GitHub für Code, Dokumentation und Migrationen
- getrennte Staging-/Testumgebung

## Sicherheit

- serverseitige Rechteprüfung/RLS
- CSRF-Schutz
- Content-Security-Policy
- Rate Limits
- externe Bildhoster-Allowlist
- Schutz gegen massenhafte Datenabrufe
- technische Audit-/Diagnosefunktionen

Technische Betreiberrechte und IC-Fachrechte bleiben getrennt.

## Betrieb

- Datenbank-Backups alle 6 Stunden
- eigene technische Backup-/Betriebsrolle
- Restore-Tests
- Monitoring und Healthchecks
- öffentliche Statusseite
- Wartungsmodus

## Verbindlicher Detailstand

Der normalisierte Gesamtentscheidungsstand durch **Frage 3410** ist zusätzlich in `docs/decision-baseline-3410.md` dokumentiert. Die einzelnen Modul-Dokumente konkretisieren diesen Stand.
