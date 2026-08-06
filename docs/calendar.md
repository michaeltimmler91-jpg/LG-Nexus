# LG Nexus – Kalender

Dieses Dokument beschreibt die aktuell festgelegten Regeln für den persönlichen Nexus-Kalender, private Termine und interne Organisationstermine.

## Persönlicher Nexus-Kalender

Jeder aktive Nexus-Bürger besitzt einen persönlichen Kalender.

Darin können gemeinsam angezeigt werden:

- öffentliche Events
- interne Organisationstermine
- private persönliche Termine

Der Benutzer kann diese Kalenderarten über Filter ein- und ausblenden.

Kalenderansichten:

- Monat
- Woche
- Tag

Eine zusätzliche Agenda-/Listenansicht ist derzeit nicht vorgesehen.

Ein ICS-Export des persönlichen Kalenders ist nicht vorgesehen.

## Öffentliche Events im persönlichen Kalender

Öffentliche Events werden automatisch in den persönlichen Kalender übernommen, wenn der Bürger den Teilnahme-Status `Teilnehmen` oder `Vielleicht` gewählt hat.

## Private persönliche Termine

Jeder Bürger darf eigene private Termine erstellen.

Private Termine können:

- eine persönliche Notiz enthalten
- eigene Farben beziehungsweise Kategorien besitzen
- eine oder mehrere Erinnerungen besitzen
- wiederkehrend angelegt werden
- mit anderen Bürgern geteilt werden

Die Stadtverwaltung darf private persönliche Kalendertermine eines Bürgers nicht einsehen. Ebenso dürfen Organisations-Owner private persönliche Termine ihrer Mitglieder nicht einsehen.

### Einladungen zu privaten Terminen

Der Ersteller kann andere Bürger zu einem privaten Termin einladen.

- Eingeladene Personen können zusagen oder absagen.
- Der Ersteller sieht, wer zugesagt beziehungsweise abgesagt hat.
- Eine Einladung erscheint nicht automatisch im Kalender des Empfängers; sie wird erst nach Zusage als eigener Kalendereintrag übernommen.
- Ein Eingeladener darf die Einladung ablehnen.

## Interner Organisationskalender

Jede Organisation besitzt einen eigenen internen Kalender.

Das Erstellen und Verwalten interner Organisationstermine erfolgt über das Rollenrecht `Kalender verwalten`.

Ein interner Termin kann:

- an bestimmte Rollen gerichtet werden
- an einzelne Mitglieder gerichtet werden
- als verpflichtend markiert werden
- einen Nexus-Kartenstandort besitzen
- einen externen Link enthalten
- eine formatierte Beschreibung enthalten
- eine eigene Farbe besitzen
- Kategorien beziehungsweise Tags besitzen

## Verpflichtende Organisationstermine

Verpflichtende Termine verlangen eine Lesebestätigung beziehungsweise Zusage.

Ein betroffenes Mitglied darf einen verpflichtenden Termin ablehnen, muss dabei jedoch einen Grund angeben.

Der Ersteller beziehungsweise berechtigte Organisator sieht Zusagen und Absagen.

## Optionale Organisationstermine

Bei optionalen Organisationsterminen werden die Rückmeldungen `Teilnehmen` und `Absagen` verwendet. Ein zusätzlicher Status `Vielleicht` ist für diese internen Termine derzeit nicht vorgesehen.

## Erinnerungen bei Organisationsterminen

Interne Organisationstermine verwenden feste Nexus-Erinnerungszeiten. Die konkreten Zeitpunkte werden noch separat festgelegt.

Die Erinnerungszeiten werden nicht individuell durch Teilnehmer bestimmt.

## Änderungen und Absagen

Werden Datum oder Uhrzeit eines internen Organisationstermins geändert, erhalten alle betroffenen Teilnehmer automatisch eine Nexus-Benachrichtigung.

Wird ein interner Organisationstermin abgesagt:

- ist ein Absagegrund Pflicht
- alle betroffenen Teilnehmer werden benachrichtigt

## Aufbewahrung

Vergangene interne Organisationstermine bleiben **6 Monate** gespeichert und können danach automatisch entfernt werden.

## Verknüpfung mit Nexus-Mail

Aus einer Nexus-Mail kann direkt ein persönlicher Kalendereintrag erstellt werden.

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- persönliche Kalendertermine
- wiederkehrende private Termine
- private Termin-Einladungen und Zusage-/Absagestatus
- persönliche Farben/Kategorien
- mehrere Erinnerungen pro privatem Termin
- Organisationskalender
- Zielrollen und Zielmitglieder bei Organisationsterminen
- verpflichtende Termine mit Ablehnungsgrund
- feste Erinnerungsregeln für Organisationstermine
- Terminänderungs- und Absagebenachrichtigungen
- 6-Monats-Aufbewahrung vergangener Organisationstermine
- Mail-zu-Kalender-Verknüpfung

Private Kalendereinträge müssen serverseitig strikt gegen Stadtverwaltung, Organisations-Owner und andere unberechtigte Nutzer abgeschirmt werden.