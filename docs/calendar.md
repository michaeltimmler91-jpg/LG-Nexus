# LG Nexus – Kalender

Dieses Dokument beschreibt den verbindlichen Stand des Nexus-Kalenders bis Frage 3410.

## Persönlicher Kalender

Jeder aktive Bürger besitzt einen persönlichen Kalender.

Gemeinsam darstellbar:

- öffentliche Events
- interne Organisationstermine
- private persönliche Termine
- manuell gepflegte Geburtstage

Filter erlauben das Ein-/Ausblenden der Kalenderarten.

Ansichten:

- Monat
- Woche
- Tag

Keine zusätzliche Agenda-/Listenansicht und kein ICS-Export.

Dashboard zeigt `Heute / nächste Termine`.

## Events und andere explizite Termine

Öffentliche Events werden bei `Teilnehmen` oder `Vielleicht` automatisch übernommen. Ein Event kann auch manuell ohne Teilnahmestatus in den Kalender aufgenommen werden.

Direkte Kalendereinträge können weiterhin ausdrücklich entstehen aus:

- City-Hub-News
- Bewerbungsgesprächen
- bestätigten Reservierungen
- Justice-Verhandlungsterminen
- anderen Funktionen, die ausdrücklich einen Termin erzeugen

Es gibt **keine pauschale automatische Kalenderübernahme jedes Justice-, Medical- oder PD-Vorgangs**.

## Private Termine

Private Termine können:

- ganztägig sein
- persönliche Notiz besitzen
- eigene Farbe/Kategorie besitzen
- Ort als Freitext und optional LS-Map-Position enthalten
- externe Links und externe Datei-/Bildlinks enthalten
- mehrere Erinnerungen besitzen
- wiederkehrend sein
- mit anderen Bürgern geteilt werden

Die generischen späteren `Workflow = Nein`-Antworten zu Terminserien, Links, Notizen, Farben oder Konfliktwarnungen heben diese normalen Kalenderfunktionen **nicht** auf.

Stadtverwaltung und Organisations-Owner sehen private persönliche Termine nicht.

## Wiederkehrende private Termine

Unterstützt:

- täglich
- wöchentlich
- monatlich
- frei definierte Wiederholungsregeln
- Bearbeitung nur dieser / dieser und folgende / ganze Serie
- Serienausnahmen nach der bestehenden Kalenderlogik

## Konfliktwarnung

Bei Überschneidung zeigt Nexus eine Warnung. Speichern bleibt möglich.

## Erinnerungen

Private Termine erhalten standardmäßig 30 Minuten vorher eine Erinnerung. Mehrere frei gewählte Erinnerungen möglich.

## Einladungen und Kalenderfreigaben

Private Termine können mit anderen Bürgern geteilt werden.

- Eingeladene können zusagen/absagen
- erst nach Zusage eigener Kalendereintrag beim Empfänger
- Teilnehmerliste und Status für Eingeladene sichtbar
- Eingeladene laden nicht selbst weitere Personen ein
- Ersteller kann Einladung entziehen; Betroffener wird benachrichtigt
- Änderungen erzeugen Benachrichtigungen
- bei Serien wird jeder Einzeltermin separat bestätigt

Zusätzlich sind **Kalenderfreigaben zwischen Bürgern** und **gemeinsame private Kalender** vorgesehen.

Diese Freigaben müssen ausdrücklich vom betroffenen Bürger ausgehen beziehungsweise bestätigt werden. Sie erzeugen kein Zugriffsrecht für Stadtverwaltung oder Organisationen.

## Geburtstage

Geburtstage werden **manuell im Kalender eingetragen**.

Sie werden nicht automatisch aus dem RP-Geburtsdatum im Personenprofil erzeugt. Dadurch kann ein Bürger selbst entscheiden, welche Geburtstage er persönlich im Kalender pflegt, unabhängig von Profil-Privatsphäre.

## Interner Organisationskalender

Jede Organisation besitzt einen internen Kalender. Verwaltung über `Kalender verwalten`.

Termine können:

- wiederkehrend
- ganztägig
- rollenspezifisch
- personenspezifisch
- verpflichtend
- mit Map-Position
- mit externem Link
- mit formatierter Beschreibung
- mit Farbe/Kategorie/Tags

Normale Mitglieder sehen nur allgemeine, eigene Rollen- oder eigene Personentermine.

## Verpflichtende Organisationstermine

Verlangen Lesebestätigung/Zusage.

Ablehnung möglich, aber Grund Pflicht. Ablehnungsgrund sehen nur Ersteller und `Kalender verwalten`. Nach Ablehnung keine weiteren Erinnerungen.

## Optionale Organisationstermine

Status:

- Teilnehmen
- Absagen

Kein `Vielleicht`.

Optionale Zusage-/Absagefrist möglich.

## Erinnerungen Organisation

Feste Erinnerungen:

- 24 Stunden
- 1 Stunde
- 30 Minuten vorher

## Änderungen

Veröffentlichte interne Termine bleiben bearbeitbar.

- Änderungen benachrichtigen Personen, die bereits zugesagt haben
- Rollen/Mitglieder nachträglich ergänzbar
- Teilnehmer entfernbar; Grund optional
- entfernte Teilnehmer werden benachrichtigt
- Komplettabsage: Grund Pflicht + Benachrichtigung aller Betroffenen

## Aufbewahrung

Vergangene interne Organisationstermine werden 6 Monate gespeichert.

## Mail-/Vorgangsverknüpfung

Aus einer Nexus-Mail kann ein persönlicher Termin erstellt werden. Direkte Terminaktionen aus konkreten Fachprozessen bleiben möglich, aber es gibt keinen generischen Auto-Kalender für alle Fachvorgänge.

## Sicherheit

Private Termine und gemeinsame private Kalender müssen serverseitig strikt gegen unberechtigte Bürger, Owner und Stadtverwaltung abgeschirmt werden. Freigaben sind widerrufbar und dürfen keine Profil-/Organisationsrechte ersetzen.
