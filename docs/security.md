# LG Nexus – Sicherheit und technische Schutzmechanismen

Dieses Dokument beschreibt die verbindliche Sicherheitsbasis nach Auswertung bis Frage 3410.

## Grundsatz

Sicherheitsfunktionen werden serverseitig durchgesetzt. UI-Ausblendungen gelten niemals als Berechtigungsprüfung.

Technische Systemadministration ist von IC-Stadtverwaltung getrennt. Ein technischer System-Admin erhält **keinen automatischen Zugriff** auf vertrauliche Medical-, Police- oder Justice-Inhalte.

## Web-Sicherheitsstandards

Folgende Schutzmechanismen gehören als technische Standards zu Nexus:

- CSRF-Schutz für schreibende Aktionen
- Content-Security-Policy (CSP)
- serverseitige Berechtigungs- und RLS-Prüfung
- Hoster-Allowlist für externe Bilder
- sichere Behandlung externer Links
- Schutz vor massenhaften Datenexporten

CSRF und CSP sind keine optionalen Benutzerfunktionen; die generischen Workflow-/Benachrichtigungsfragen dazu gelten nicht.

## Externe Bilder

Externe Bild-URLs werden nur von erlaubten Hostern akzeptiert.

- Regel gilt für alle Nutzer.
- Prüfung wird serverseitig erzwungen.
- Nicht erlaubte beziehungsweise technisch unsichere Links werden blockiert.
- Normale Ablehnungen müssen nicht als Benutzer-Sicherheitsereignis protokolliert werden.

## Rate Limits

Serverseitige Rate Limits sind vorgesehen für mindestens:

- Suchanfragen
- persönlichen/organisationalen Mailversand
- Meldungen und Kommentare
- Loginversuche nach den bereits festgelegten Auth-Regeln

Bei Überschreitung wird die Aktion blockiert. Sicherheitsrelevanter Missbrauch kann protokolliert werden.

## Sitzungen und Passwortänderung

Bei einer Passwortänderung werden bestehende Sitzungen entsprechend der Sicherheitsregel invalidiert beziehungsweise gesperrt, damit ein möglicherweise kompromittiertes Gerät nicht einfach weiter angemeldet bleibt.

Die bestehende persönliche Sitzungsverwaltung und Remote-Abmeldung bleiben erhalten.

## Ungewöhnliche Logins

Ungewöhnliche Login-Orte beziehungsweise Login-Muster werden als Sicherheitsereignis erkannt und protokolliert.

Die bereits festgelegte Benachrichtigung bei einem unbekannten Gerät bleibt bestehen. Für einen bloßen zusätzlichen Ortsverdacht ist keine zweite separate Benutzerbenachrichtigung erforderlich.

## Sicherheitsprotokolle

Es gibt technische Admin-Sicherheitsprotokolle. Besonders sensible Systemaktionen landen im technischen Auditlog.

Der technische Auditlog wird grundsätzlich **12 Monate** gespeichert, soweit kein spezielleres Sicherheits-/Betriebsprotokoll eine andere Frist besitzt.

## Schutz vor Massenexport

Nexus soll ungewöhnlich große oder massenhafte Datenabrufe/Exporte erkennen und blockieren beziehungsweise begrenzen.

Das gilt insbesondere für:

- Personen-/Profildaten
- Organisationsdaten
- geschützte Fachmodule
- systematische API-Abfragen

Ein technisches Administrationsrecht darf diesen Schutz nicht automatisch in ein fachliches Leserecht verwandeln.

## Fehler und Diagnose

Nexus zeigt bei technischen Fehlern eine eindeutige Fehler-ID, soweit sinnvoll. Berechtigte technische Admins erhalten eine Diagnoseansicht für getrennte Zustände von Datenbank, API und Storage.

Diagnosedaten dürfen keine sensiblen Fachinhalte oder Geheimnisse offenlegen.

## Umgebungen und Feature-Schalter

- getrennte Staging-/Testumgebung ist vorgesehen
- Module können per Feature-Schalter schrittweise freigegeben werden
- Modulfreigaben können bei Bedarf pro Organisation erfolgen

## Keine 2FA zum aktuellen Stand

Eine Zwei-Faktor-Authentifizierung ist aktuell nicht vorgesehen. Diese Entscheidung kann später als eigener Sicherheitsausbau erneut bewertet werden.
