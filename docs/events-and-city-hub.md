# LG Nexus – Events und City Hub

Dieses Dokument beschreibt die aktuell festgelegten Regeln für öffentliche Events, Eventteilnahme, Erinnerungen, vergangene Events sowie den zentralen City Hub.

## Events – Grundprinzip

Jede Organisation darf öffentliche Events erstellen.

- Das Erstellen und Verwalten von Events erfolgt über das eigene Rollenrecht `Events verwalten`.
- Normale Bürger können keine eigenen öffentlichen oder privaten Events über Nexus erstellen.
- Ein Event benötigt einen Titel.
- Die Beschreibung unterstützt formatierten Text, insbesondere Überschriften und Listen.
- Datum und Startzeit sind Pflicht.
- Eine Endzeit ist optional.
- Mehrtägige Events sind möglich.
- Wiederkehrende Events sind möglich, zum Beispiel wöchentlich jeden Freitag.
- Der Veranstaltungsort kann sowohl als Freitext als auch als Nexus-Kartenposition angegeben werden.
- Ein vorhandener Organisationsstandort kann direkt als Eventort ausgewählt werden.
- Ein Event kann ein Titelbild beziehungsweise Banner besitzen.
- Ein Event kann optional eine maximale Teilnehmerzahl besitzen.

## Teilnahme

Bürger können auf Events mit folgenden Rückmeldungen reagieren:

- `Teilnehmen`
- `Vielleicht`
- `Absagen`

Öffentlich wird weder angezeigt, wie viele Personen teilnehmen, noch wer konkret teilnimmt.

Der Veranstalter beziehungsweise entsprechend berechtigte Organisationsmitglieder dürfen die Teilnehmerliste intern sehen.

### Anmeldefrist und Teilnehmerlimit

- Events können eine Anmeldefrist besitzen.
- Ist die maximale Teilnehmerzahl erreicht, wird eine Warteliste verwendet.
- Wird ein Platz frei, rückt automatisch die erste Person der Warteliste nach.
- Der Nachrücker erhält darüber eine Nexus-Benachrichtigung.
- Der Veranstalter darf Teilnehmer manuell entfernen.
- Beim manuellen Entfernen ist ein Grund optional.

## Erinnerungen und Änderungen

Für Teilnehmer werden standardmäßig drei Event-Erinnerungen vorgesehen:

- 24 Stunden vorher
- 1 Stunde vorher
- 30 Minuten vorher

Teilnehmer können diese Standard-Erinnerungszeiten nicht individuell ändern.

Teilnehmer erhalten zusätzlich eine Nexus-Benachrichtigung, wenn:

- ein Event nach der Veröffentlichung geändert wird
- ein Event abgesagt wird

Beim Absagen eines Events ist ein Grund Pflicht. Dieser Absagegrund wird allen Teilnehmern angezeigt.

## Eventverwaltung

Ein veröffentlichtes Event darf nachträglich bearbeitet werden.

- Größere Änderungen werden sichtbar mit `Event geändert` gekennzeichnet.
- Ein Event wird nicht endgültig gelöscht, sondern abgesagt beziehungsweise archiviert.
- Nach dem Ende wird ein Event automatisch archiviert.
- Vergangene Events bleiben 6 Monate sichtbar beziehungsweise abrufbar.

## Bilder nach einem Event / Memories

Nach einem Event darf der Veranstalter Bilder ergänzen, allerdings nicht als direkten Nexus-Dateiupload. Stattdessen werden externe Bildlinks verwendet.

Aus den nachträglich hinterlegten Eventbildern kann später direkt ein `Memories`-Album erzeugt werden.

Die konkrete Auswahl geeigneter kostenloser externer Bildhoster wird separat festgelegt. Nexus sollte externe Bild-URLs validieren und nur erlaubte beziehungsweise technisch geeignete Quellen einbetten.

## City Hub

LG Nexus besitzt einen zentralen öffentlichen `City Hub` für offizielle Meldungen und News.

### Offizielle Stadtmeldungen

Offizielle Stadtmeldungen dürfen ausschließlich von der Stadtverwaltung erstellt werden.

Organisationen veröffentlichen keine eigenen allgemeinen öffentlichen News im City Hub.

### Kategorien und Darstellung

City-Hub-Beiträge können Kategorien besitzen, zum Beispiel:

- Stadt
- Unternehmen
- Polizei
- Medical
- Events
- sonstige passende Kategorien

Ein Beitrag kann ein Titelbild besitzen.

### Kommentare und Reaktionen

- Kommentare können pro Beitrag optional aktiviert werden.
- Bürger können auf News reagieren beziehungsweise sie liken.

Die genauen Reaktionstypen werden später festgelegt.

### Wichtige Meldungen

Wichtige Stadtmeldungen können oben im City Hub angepinnt werden.

Eine wichtige Stadtmeldung löst **nicht automatisch** eine Pflichtbenachrichtigung an alle aktiven Nexus-Bürger aus.

Die Stadtverwaltung entscheidet bei jeder Meldung, ob sie:

- nur im City Hub erscheint oder
- zusätzlich als Nexus-Push beziehungsweise Nexus-Benachrichtigung versendet wird.

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- `events`
- wiederkehrende Eventserien beziehungsweise Wiederholungsregeln
- Eventorte mit Freitext, Kartenkoordinaten und optionaler Organisationsstandort-Referenz
- Eventteilnahmen mit Status `going / maybe / declined`
- Teilnehmerlimits und Wartelistenpositionen
- Event-Erinnerungen
- Eventänderungs-/Absagebenachrichtigungen
- Eventarchivierung und 6-Monats-Aufbewahrung
- externe Eventbild-URLs
- Memories-Verknüpfung
- `city_hub_posts`
- City-Hub-Kategorien
- optionale Kommentarfunktion
- Reaktionen/Likes
- Pin-/Wichtig-Markierung
- optionale Nexus-Benachrichtigungsverteilung durch die Stadtverwaltung

Alle berechtigungsrelevanten Aktionen werden serverseitig beziehungsweise über Supabase/RLS abgesichert.