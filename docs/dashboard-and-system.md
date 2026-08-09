# LG Nexus – Dashboard & System

Dieses Dokument beschreibt den verbindlichen Stand des persönlichen Dashboards und grundlegender Systemfunktionen bis Frage 3410.

## Persönliches Dashboard

Dashboard unterstützt frei auswählbare Widgets.

Benutzer dürfen:

- Widgets per Drag & Drop anordnen
- normale Widgets ein-/ausblenden

Organisationen dürfen interne Widgets bereitstellen und einzelne Widgets verpflichtend machen. Verpflichtende Widgets können vom betroffenen Mitglied nicht verborgen werden.

Rollen können passende Schnellzugriffe erhalten; neue Nutzer starten nicht mit einem erzwungenen rollenabhängigen Widget-Preset.

## Globale Suche

Globale Suche durchsucht nur öffentliche Bereiche, mindestens:

- Personen
- Organisationen
- Events
- City Hub
- Jobs
- öffentliche Map-Inhalte

Interne Fälle/Akten/Dokumente werden nicht über die globale Suche durchsucht.

Nicht vorgesehen:

- gespeicherte globale Suchanfragen
- Suchverlauf
- gespeicherte zuletzt verwendete Filter

Privacy muss im Suchindex serverseitig eingehalten werden.

## Favoriten

Favoriten sind **modulspezifisch** und nicht automatisch für jeden Inhaltstyp verfügbar.

Aktuell ausdrücklich vorgesehen:

- Organisationen
- Unternehmensangebote
- private Personenprofil-Favoriten
- Dokumentfavoriten innerhalb des vorhandenen Dokumentbereichs

Nicht vorgesehen:

- Kartenmarker-Favoriten
- City-Hub-Favoriten
- Event-Favoriten
- angepinnte Seiten
- persönliche Schnellzugriffe in der linken Seitenleiste

Ein Favorit gewährt niemals Zugriff auf einen später nicht mehr berechtigten Inhalt.

## Visuelles Grunddesign

- Hell und Dunkel; Standard Dunkel
- Theme accountweit synchronisiert
- persönliche Akzentfarbe für Buttons/aktive Elemente/Highlights
- einstellbare Schriftgröße
- kompakte oder komfortable Inhaltsdichte nach bestehender Grundregel
- High-Contrast-Modus als persönliche Einstellung

Nicht als eigene Zusatzfunktionen vorgesehen:

- reduzierte Animationen
- spezieller Tastatur-only-Modus
- eigener Screenreader-Modus
- größere Klickflächen als Einstellung
- benutzerdefinierte Tabellenspalten
- gespeicherte Tabellensortierung
- Druckansichten

## Zielgeräte / Responsive Verhalten

V1 ist bewusst primär für **Desktop und feste Ingame-/Tablet-Darstellung** ausgelegt.

Eine vollständig responsive Smartphone-Oberfläche und spezielle mobile Navigation sind **keine V1-Anforderung**.

## Sitzungen

- Inaktivitätsablauf 4 Stunden
- `angemeldet bleiben` maximal 90 Tage
- eigene Geräte/Sitzungen einsehbar
- andere eigene Sitzungen remote abmeldbar
- Anzeige Gerät/Browser, letzte Aktivität, ungefähre Region
- genaue IP nur für ausdrücklich berechtigte technische Sicherheitsadministration

Bei Passwortänderung werden bestehende Sitzungen entsprechend der Sicherheitsregel invalidiert/gesperrt.

## Re-Authentifizierung

Passwortbestätigung mindestens für:

- Passwortänderung
- Privatsphäre
- Sitzungsverwaltung
- persönliche Sicherheitsaktionen

## Login-Sicherheit

- unbekanntes Gerät → Nexus-Benachrichtigung
- ungewöhnliche Login-Orte/-Muster können zusätzliche Sicherheitsprüfung auslösen
- erfolgreiche/fehlgeschlagene Logins 30 Tage protokolliert
- Rate Limiting
- CAPTCHA nach mehreren Fehlversuchen
- temporäre Login-Sperre bei massivem Fehlversuchsmuster
- 2FA aktuell nicht vorgesehen

## Systemadministration

Nexus besitzt eine eigene technische System-Admin-Rolle außerhalb normaler Organisationsrollen.

- Vergabe durch bestehende System-Admins
- getrennt von IC-Stadtverwaltung
- **kein automatischer Zugriff auf vertrauliche Medical-/PD-/Justice-Daten**
- sensible Systemaktionen landen im technischen Auditlog
- technischer Auditlog: 12 Monate

System-Admins können Feature-Schalter und Systemdiagnose verwenden.

## Systemdiagnose

Berechtigte technische Admins erhalten eine Diagnoseansicht für getrennte Zustände von:

- Datenbank
- API
- Storage

Fehler können eine eindeutige Fehler-ID besitzen.

Diagnosedaten dürfen keine geschützten Fachinhalte offenlegen.

## Feature-Schalter / Staging

- Module können per Feature-Schalter freigegeben werden
- Freischaltung kann pro Organisation erfolgen
- getrennte Staging-/Testumgebung vorgesehen

## Wartungsmodus und Statusseite

Globaler Wartungsmodus mit öffentlicher Wartungsseite. Nur berechtigte technische Administration kann trotz Wartung ins eigentliche System.

Zusätzlich globaler Hinweis-/Wartungsbanner.

Öffentliche Nexus-Statusseite mit Komponentenstatus.

## Backups und technische Betriebsrolle

Backups werden **alle 6 Stunden** eingeplant.

Für Backup/Restore und ausgewählte Betriebsaufgaben gibt es eine **eigene technische Backup-/Betriebsrolle**, damit diese Aufgaben nicht an einer einzelnen Person hängen.

Diese Rolle ist von IC-Stadtverwaltung getrennt und erzeugt kein fachliches Akten-Leserecht.

Weitere Details: `docs/operations-and-backups.md`.

## FiveM-Grenze V1

V1 funktioniert **vollständig ohne direkte FiveM-Verbindung**.

Auch `/nexus`, Ingame-Tablet, Wegpunkt und Job-/Dienststatus-Sync kommen erst nach V1. Die Architektur bereitet spätere Integrationen lediglich vor.

## Sicherheit

Zusätzliche technische Standards stehen in `docs/security.md`, darunter CSRF, CSP, Rate Limits, Hoster-Allowlist und Schutz gegen massenhafte Datenabfragen.

Interne Daten dürfen durch Widgets, Favoriten, Suchindizes, Diagnose oder Systemadministration niemals Berechtigungsgrenzen umgehen.
