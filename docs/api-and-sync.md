# LG Nexus – API, Synchronisation und Datenflüsse

Dieses Dokument beschreibt den verbindlichen technischen Plan für Schnittstellen und Synchronisation.

## V1

V1 besitzt:

- keine öffentliche Read-only-API für allgemeine externe Nutzung
- keine allgemein nutzbare FiveM-API
- keine Servicekonten für technische Integrationen

Die interne Architektur wird trotzdem so aufgebaut, dass spätere Integrationen nicht direkt auf privilegierte Datenbankzugänge angewiesen sind.

## Versionierung

API-/Edge-Function-Endpunkte werden von Beginn an versionierbar geplant. Änderungen an einem Integrationsvertrag dürfen bestehende Clients nicht stillschweigend brechen.

## Webhooks

Webhook-Ausgänge bei Nexus-Ereignissen und Webhook-Eingänge aus FiveM können technisch vorbereitet werden. Sie sind in V1 noch keine allgemein freigeschaltete Integrationsschnittstelle.

## Idempotenz

Nach V1 werden idempotente Synchronisationsschlüssel verwendet.

Ziel: Derselbe technische Vorgang darf bei Wiederholung nicht doppelt verarbeitet werden.

Beispiel: Eine FiveM-Jobänderung, die wegen eines Timeouts erneut gesendet wird, erzeugt nicht zwei Mitgliedschaften, zwei Logs oder doppelte Benachrichtigungen.

## Fehlgeschlagene Syncs

Für spätere Synchronisation vorgesehen:

- Warteschlange für fehlgeschlagene Syncs
- automatische spätere Wiederholung
- manuelle Wiederholung durch berechtigte technische Nutzer
- klare Fehler-ID beziehungsweise Fehlerursache
- kritische Fehler in der Systemdiagnose

## Datenquellen-Priorität

Je synchronisiertem Datentyp wird eine führende Quelle definiert.

Für die zuerst geplanten FiveM-Daten gilt:

- Job/Organisation: FiveM führend
- Dienststatus: FiveM führend
- Nexus-Wegpunkt: Nexus erzeugt das Ziel für den FiveM-Client

Konflikte dürfen nicht pauschal mit `letzter Schreibvorgang gewinnt` gelöst werden.

## Einführung

Neue Integrationen werden zuerst im Testmodus beziehungsweise Staging aktiviert. Erst nach erfolgreicher Prüfung werden sie für den produktiven Betrieb freigeschaltet.

## Sicherheit

- keine Supabase-Service-Keys in FiveM-Clients oder normalen Resources
- minimale technische Rechte pro Endpoint
- serverseitige Authentifizierung und Autorisierung
- Rate Limits
- Protokollierung kritischer Integrationsfehler
- Schutz vor Replay-/Doppelverarbeitung
