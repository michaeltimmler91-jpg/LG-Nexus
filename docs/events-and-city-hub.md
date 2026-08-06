# LG Nexus – Events und City Hub

Dieses Dokument beschreibt die aktuell festgelegten Regeln für öffentliche Events, Eventserien, Teilnahme, Erinnerungen, Eventbilder und Memories, den zentralen City Hub sowie die grundlegende Nexus-Kalenderlogik.

## Events – Grundprinzip

Jede Organisation darf öffentliche Events erstellen.

- Das Erstellen und Verwalten von Events erfolgt über das eigene Rollenrecht `Events verwalten`.
- Normale Bürger können keine eigenen öffentlichen oder privaten Events über Nexus erstellen.
- Ein Event benötigt einen Titel.
- Die Beschreibung unterstützt formatierten Text, insbesondere Überschriften und Listen.
- Datum und Startzeit sind Pflicht.
- Eine Endzeit ist optional.
- Mehrtägige Events sind möglich.
- Wiederkehrende Events sind möglich.
- Der Veranstaltungsort kann sowohl als Freitext als auch als Nexus-Kartenposition angegeben werden.
- Ein vorhandener Organisationsstandort kann direkt als Eventort ausgewählt werden.
- Ein Event kann ein Titelbild beziehungsweise Banner besitzen.
- Ein Event kann optional eine maximale Teilnehmerzahl besitzen.

## Wiederkehrende Events / Eventserien

Wiederholungen können täglich, wöchentlich, monatlich sowie über frei definierbare Wiederholungsregeln angelegt werden.

- Bei wöchentlichen Serien können mehrere Wochentage ausgewählt werden.
- Eine Serie kann ein Enddatum besitzen.
- Alternativ kann eine feste Anzahl an Wiederholungen festgelegt werden.
- Einzelne Termine einer Serie können separat geändert werden.
- Beim Bearbeiten kann gewählt werden zwischen `nur dieser Termin`, `dieser und folgende Termine` und `gesamte Serie`.
- Einzelne Termine einer Serie können abgesagt werden, ohne die gesamte Serie zu beenden.
- Auch bei der Absage eines einzelnen Serientermins ist ein Absagegrund Pflicht.
- Eine Teilnahme gilt nicht automatisch für die gesamte Serie. Die Anmeldung erfolgt je einzelnem Termin.

## Teilnahme

Bürger können auf Events mit folgenden Rückmeldungen reagieren:

- `Teilnehmen`
- `Vielleicht`
- `Absagen`

Öffentlich wird weder angezeigt, wie viele Personen teilnehmen, noch wer konkret teilnimmt.

Der Veranstalter beziehungsweise entsprechend berechtigte Organisationsmitglieder sehen intern:

- die Teilnehmerzahl
- konkrete Teilnehmer
- `Teilnehmen`
- `Vielleicht`
- `Abgesagt`
- Wartelistenstatus

### Anmeldefrist und Teilnehmerlimit

- Events können eine Anmeldefrist besitzen.
- Teilnehmer dürfen ihre Rückmeldung bis zur Anmeldefrist ändern.
- Der Veranstalter kann die Anmeldung nicht vor der hinterlegten Anmeldefrist manuell schließen.
- Ist die maximale Teilnehmerzahl erreicht, wird eine Warteliste verwendet.
- Wird ein Platz frei, rückt automatisch die erste Person der Warteliste nach.
- Der Nachrücker erhält darüber eine Nexus-Benachrichtigung.
- Personen auf der Warteliste erhalten keine normalen Event-Erinnerungen.

### Manuelles Entfernen

Der Veranstalter darf Teilnehmer manuell entfernen.

- Ein Entfernungsgrund ist optional.
- Wenn ein Grund angegeben wurde, wird er dem entfernten Teilnehmer angezeigt.
- Der entfernte Teilnehmer erhält eine Nexus-Benachrichtigung.
- Ein manuell entfernter Teilnehmer kann sich nicht selbst erneut anmelden.
- Der Veranstalter kann diese Sperre später wieder aufheben.
- Der Veranstalter kann Teilnehmer nicht manuell neu zum Event hinzufügen.

## Erinnerungen und Änderungen

Für Teilnehmer werden drei feste Erinnerungen vorgesehen:

- 24 Stunden vorher
- 1 Stunde vorher
- 30 Minuten vorher

Diese Erinnerungen können vom Teilnehmer weder individuell verschoben noch vollständig deaktiviert werden.

Auch Personen mit Status `Vielleicht` erhalten die normalen Erinnerungen.

Wird ein Event weniger als 24 Stunden vor Beginn erstellt, werden nur noch die zeitlich möglichen Erinnerungen eingeplant. Wird es weniger als 30 Minuten vor Beginn erstellt, wird keine nachträgliche Sofort-Erinnerung erzeugt.

Ändert sich die Startzeit eines Events, wird die Erinnerungsplanung automatisch anhand der neuen Startzeit neu berechnet.

Teilnehmer erhalten zusätzlich eine Nexus-Benachrichtigung, wenn:

- ein Event nach Veröffentlichung geändert wird
- ein Event abgesagt wird

Beim Absagen eines Events ist ein Grund Pflicht. Dieser Absagegrund wird allen Teilnehmern angezeigt.

## Eventverwaltung

Ein veröffentlichtes Event darf nachträglich bearbeitet werden.

- Größere Änderungen werden sichtbar mit `Event geändert` gekennzeichnet.
- Ein Event wird nicht endgültig gelöscht, sondern abgesagt beziehungsweise archiviert.
- Nach dem Ende wird ein Event automatisch archiviert.
- Vergangene Events bleiben 6 Monate sichtbar beziehungsweise abrufbar.

## Eventbilder

Eventbilder werden nicht direkt in Nexus hochgeladen, sondern über externe Bildlinks eingebunden.

### Vor dem Event

- Das Titelbild beziehungsweise Banner wird über einen externen Bildlink eingebunden.
- Zusätzlich dürfen mehrere weitere externe Bilder vor dem Event hinterlegt werden.

### Nach dem Event

- Nach dem Event können unbegrenzt viele externe Bildlinks ergänzt werden.
- Nicht nur Personen mit `Events verwalten`, sondern auch Eventteilnehmer dürfen Bildvorschläge einreichen.
- Von Teilnehmern eingereichte Bildlinks müssen zuerst durch den Veranstalter freigegeben werden.
- Ein Bild kann eine kurze Bildunterschrift besitzen.
- Es wird gespeichert, wer einen Bildlink hinzugefügt beziehungsweise vorgeschlagen hat.
- Nach erfolgter Aufnahme wird ein hinterlegter Bildlink nicht über die normale Oberfläche wieder entfernt.

Die konkrete Auswahl geeigneter kostenloser externer Bildhoster wird separat festgelegt. Nexus sollte externe Bild-URLs validieren und nur erlaubte beziehungsweise technisch geeignete Quellen einbetten.

## Memories

Sobald für ein vergangenes Event Bilder vorhanden sind, wird automatisch ein öffentliches Memories-Album erzeugt.

- Albumtitel und Eventdatum werden automatisch vom Event übernommen.
- Das Album verlinkt nicht zwingend zurück auf das ursprüngliche Event.
- Memories-Alben sind öffentlich.
- Auch nach Erstellung des Albums können weitere Bilder ergänzt werden.

## City Hub

LG Nexus besitzt einen zentralen öffentlichen `City Hub` für offizielle Meldungen und News.

Organisationen veröffentlichen keine eigenen allgemeinen News im City Hub. Offizielle City-Hub-Meldungen stammen von der Stadtverwaltung.

### Berechtigungen

Innerhalb der Stadtverwaltung wird das Erstellen und Verwalten von City-Hub-Beiträgen über das eigene Rollenrecht `City Hub verwalten` gesteuert.

Bestimmte besonders strukturelle Aktionen bleiben der Stadtverwaltungs-Owner-Ebene vorbehalten, insbesondere das Erstellen von Kategorien.

## City-Hub-Beiträge

- Entwürfe sind möglich.
- Beiträge können für ein zukünftiges Veröffentlichungsdatum inklusive Uhrzeit geplant werden.
- Veröffentlichte Beiträge dürfen nachträglich bearbeitet werden.
- Nach einer Bearbeitung wird sichtbar `Bearbeitet` angezeigt.
- Ein Änderungsverlauf der News wird gespeichert.
- Personen mit `City Hub verwalten` dürfen Beiträge löschen.
- Gelöschte Beiträge landen 30 Tage im Papierkorb.
- Ein Beitrag kann ein Ablaufdatum besitzen.
- Ein Beitrag kann ein Titelbild besitzen.

### Kategorien

- Kategorien werden durch Stadtverwaltungs-Owner erstellt.
- Kategorien können Farbe und Icon besitzen.
- Eine News kann mehreren Kategorien gleichzeitig zugeordnet sein.
- Es gibt feste geschützte Systemkategorien, die nicht gelöscht werden können.
- Kategorien werden nicht über eine zusätzliche Deaktivierungsfunktion stillgelegt.

## City-Hub-Kommentare

Kommentare können pro Beitrag optional aktiviert oder deaktiviert werden. Diese Einstellung darf auch nach Veröffentlichung geändert werden.

Für die Kommentierberechtigung wird eine konfigurierbare Variante vorgesehen: Je nach Beitrag können entweder alle aktiven Bürger kommentieren oder die Kommentarfunktion kann auf ausgewählte Rollen beziehungsweise Organisationen begrenzt werden.

Für Kommentare gilt:

- Bürger dürfen eigene Kommentare bearbeiten.
- Bearbeitete Kommentare werden mit `Bearbeitet` gekennzeichnet.
- Bürger dürfen eigene Kommentare löschen.
- Personen mit `City Hub verwalten` dürfen fremde Kommentare moderieren beziehungsweise entfernen.
- Beim Moderations-Löschen ist ein Grund Pflicht.
- Dieser Moderationsgrund ist ausschließlich intern sichtbar und wird dem Kommentarautor nicht angezeigt.
- Bürger dürfen Kommentare melden.
- Die Stadtverwaltung besitzt eine eigene Übersicht/Liste gemeldeter Kommentare zur Moderation.

## Reaktionen

City-Hub-Beiträge unterstützen mehrere Emoji-Reaktionen aus einer festen Nexus-Auswahl.

- Ein Bürger darf mehrere Reaktionen gleichzeitig auf denselben Beitrag setzen.
- Reaktionen können geändert beziehungsweise entfernt werden.
- Die Anzahl der Reaktionen wird öffentlich angezeigt.

## Wichtige Meldungen

Wichtige Stadtmeldungen können oben im City Hub angepinnt werden.

Eine wichtige Stadtmeldung löst nicht automatisch eine Pflichtbenachrichtigung an alle aktiven Nexus-Bürger aus.

Die Stadtverwaltung entscheidet bei jeder Meldung, ob sie:

- nur im City Hub erscheint oder
- zusätzlich als Nexus-Push beziehungsweise Nexus-Benachrichtigung versendet wird.

## Persönlicher Nexus-Kalender

Jeder Bürger besitzt einen persönlichen Nexus-Kalender.

Öffentliche Events werden automatisch eingetragen, wenn der Bürger:

- `Teilnehmen` gewählt hat oder
- `Vielleicht` gewählt hat.

Die Grundansichten des persönlichen Kalenders sind:

- Monat
- Woche
- Tag

Eine zusätzliche Agenda-/Listenansicht ist aktuell nicht vorgesehen.

## Interner Organisationskalender

Jede Organisation besitzt zusätzlich einen internen Kalender.

- Interne Organisationstermine werden über das eigene Rollenrecht `Kalender verwalten` erstellt und verwaltet.
- Termine können an bestimmte Rollen gerichtet werden.
- Termine können an einzelne Mitglieder gerichtet werden.
- Termine können als verpflichtend markiert werden.
- Verpflichtende Termine verlangen eine Lesebestätigung beziehungsweise Zusage.

Weitere Details zu privaten Terminen, Organisationsterminen, Sichtbarkeit, Erinnerungen und Terminverwaltung werden separat weiter ausgearbeitet.

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- `events`
- Eventserien und Wiederholungsregeln
- einzelne Serienausnahmen für Änderung/Absage
- Eventorte mit Freitext, Kartenkoordinaten und optionaler Organisationsstandort-Referenz
- Eventteilnahmen mit Status `going / maybe / declined`
- Teilnehmerlimits, Wartelistenpositionen und manuelle Teilnahme-Sperren
- Event-Erinnerungen
- Eventänderungs-/Absagebenachrichtigungen
- Eventarchivierung und 6-Monats-Aufbewahrung
- externe Eventbild-URLs, Bildvorschläge und Freigaben
- Memories-Alben
- `city_hub_posts`
- City-Hub-Kategorien und geschützte Systemkategorien
- City-Hub-Entwürfe und geplante Veröffentlichungen
- News-Änderungsverlauf und Papierkorb
- optionale und zielgruppenbegrenzbare Kommentarfunktion
- interne Moderationsgründe
- Kommentar-Meldungen und Moderationsübersicht für die Stadtverwaltung
- Emoji-Reaktionen
- Pin-/Wichtig-Markierung
- optionale Nexus-Benachrichtigungsverteilung durch die Stadtverwaltung
- persönlicher Nexus-Kalender
- Organisationskalender
- Zielrollen/-mitglieder für Organisationstermine
- verpflichtende Terminbestätigungen

Alle berechtigungsrelevanten Aktionen werden serverseitig beziehungsweise über Supabase/RLS abgesichert.