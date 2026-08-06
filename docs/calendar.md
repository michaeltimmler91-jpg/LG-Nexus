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

Eine zusätzliche Agenda-/Listenansicht ist derzeit nicht vorgesehen. Ein ICS-Export des persönlichen Kalenders ist ebenfalls nicht vorgesehen.

Das Nexus-Dashboard zeigt einen kompakten Bereich `Heute / nächste Termine`.

## Öffentliche Events im persönlichen Kalender

Öffentliche Events werden automatisch in den persönlichen Kalender übernommen, wenn der Bürger `Teilnehmen` oder `Vielleicht` gewählt hat.

Zusätzlich darf ein Bürger ein öffentliches Event manuell in seinen Kalender übernehmen, ohne dafür einen Teilnahme-Status setzen zu müssen.

Aus einer City-Hub-News kann direkt ein persönlicher Kalendereintrag erstellt werden. Dasselbe gilt für einen vereinbarten Bewerbungsgesprächstermin.

## Private persönliche Termine

Jeder Bürger darf eigene private Termine erstellen.

Private Termine können:

- ganztägig sein
- eine persönliche Notiz enthalten
- eigene Farben beziehungsweise Kategorien besitzen
- einen Ort als Freitext enthalten
- zusätzlich eine LS-Map-Position besitzen
- einen externen Link enthalten
- externe Datei-/Bildlinks enthalten
- eine oder mehrere Erinnerungen besitzen
- wiederkehrend angelegt werden
- mit anderen Bürgern geteilt werden

Die Stadtverwaltung darf private persönliche Kalendertermine eines Bürgers nicht einsehen. Ebenso dürfen Organisations-Owner private persönliche Termine ihrer Mitglieder nicht einsehen.

### Wiederkehrende private Termine

Private Terminserien unterstützen:

- täglich
- wöchentlich
- monatlich
- frei definierbare Wiederholungsregeln

Beim Bearbeiten einer Serie kann gewählt werden zwischen:

- nur dieser Termin
- dieser und folgende Termine
- ganze Serie

### Konfliktwarnungen

Überschneiden sich Termine, zeigt Nexus eine Konfliktwarnung. Der Benutzer darf den Termin trotzdem speichern; Überschneidungen werden nicht technisch verhindert.

### Erinnerungen

Neue private Termine erhalten standardmäßig eine Erinnerung **30 Minuten vorher**.

- Mehrere Erinnerungen pro Termin sind möglich.
- Erinnerungszeiten dürfen frei gewählt werden.

## Einladungen zu privaten Terminen

Der Ersteller kann andere Bürger zu einem privaten Termin einladen und auch nachträglich weitere Personen hinzufügen.

- Eingeladene Personen können zusagen oder absagen.
- Eine Einladung erscheint erst nach Zusage als eigener Kalendereintrag beim Empfänger.
- Eingeladene sehen die vollständige Teilnehmerliste sowie die jeweiligen Zusage-/Absagestatus.
- Eingeladene dürfen selbst keine weiteren Personen einladen.
- Der Ersteller darf eine Einladung wieder entziehen; die betroffene Person wird darüber benachrichtigt.
- Änderungen eines geteilten privaten Termins lösen automatisch Benachrichtigungen an die Eingeladenen aus.

Bei wiederkehrenden privaten Terminserien wird jeder einzelne Termin separat bestätigt; eine Zusage gilt nicht automatisch für die gesamte Serie.

Wird ein geteilter privater Termin abgesagt, ist kein Absagegrund Pflicht. Wenn freiwillig ein Absagegrund angegeben wird, wird er allen Eingeladenen angezeigt.

## Interner Organisationskalender

Jede Organisation besitzt einen eigenen internen Kalender. Das Erstellen und Verwalten erfolgt über das Rollenrecht `Kalender verwalten`.

Ein interner Termin kann:

- wiederkehrend angelegt werden
- ganztägig sein
- an bestimmte Rollen gerichtet werden
- an einzelne Mitglieder gerichtet werden
- als verpflichtend markiert werden
- einen Nexus-Kartenstandort besitzen
- einen externen Link enthalten
- eine formatierte Beschreibung enthalten
- eine eigene Farbe besitzen
- Kategorien beziehungsweise Tags besitzen

Normale Mitglieder sehen nur:

- allgemeine Termine der Organisation
- Termine für die eigene Rolle
- Termine, die gezielt an die eigene Person gerichtet sind

Rollenspezifische Termine sind für nicht betroffene Rollen vollständig verborgen.

## Verpflichtende Organisationstermine

Verpflichtende Termine verlangen eine Lesebestätigung beziehungsweise Zusage.

Ein betroffenes Mitglied darf einen verpflichtenden Termin ablehnen, muss dabei jedoch einen Grund angeben.

- Den Ablehnungsgrund sehen nur der Ersteller und Personen mit `Kalender verwalten`.
- Nach einer Ablehnung erhält die Person keine weiteren Erinnerungen für diesen Termin.

## Optionale Organisationstermine

Bei optionalen Organisationsterminen werden die Rückmeldungen `Teilnehmen` und `Absagen` verwendet. Ein zusätzlicher Status `Vielleicht` ist nicht vorgesehen.

Für optionale Organisationstermine kann eine Zusage-/Absagefrist hinterlegt werden.

## Erinnerungen bei Organisationsterminen

Organisationstermine verwenden standardmäßig drei feste Nexus-Erinnerungen:

- 24 Stunden vorher
- 1 Stunde vorher
- 30 Minuten vorher

Die Erinnerungszeiten werden nicht individuell durch Teilnehmer bestimmt.

## Änderungen und Teilnehmerverwaltung

Ein veröffentlichter interner Organisationstermin darf nachträglich bearbeitet werden.

- Bei Änderungen werden nur Personen benachrichtigt, die dem Termin bereits zugesagt haben.
- Nach Veröffentlichung können weitere Rollen oder Mitglieder hinzugefügt werden.
- Einzelne Teilnehmer können nach Veröffentlichung entfernt werden.
- Beim Entfernen ist ein Grund optional.
- Entfernte Teilnehmer werden benachrichtigt.

Wird ein interner Organisationstermin vollständig abgesagt:

- ist ein Absagegrund Pflicht
- alle betroffenen Teilnehmer werden benachrichtigt

## Aufbewahrung

Vergangene interne Organisationstermine bleiben **6 Monate** gespeichert und können danach automatisch entfernt werden.

## Verknüpfungen

Aus einer Nexus-Mail kann direkt ein persönlicher Kalendereintrag erstellt werden.

Zusätzlich können persönliche Kalendereinträge aus City-Hub-News und vereinbarten Bewerbungsgesprächen erzeugt werden.

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- persönliche Kalendertermine
- frei definierbare Wiederholungsregeln und Serienausnahmen
- Konfliktprüfung mit Warnhinweis
- private Termin-Einladungen und Zusage-/Absagestatus
- persönliche Farben/Kategorien
- mehrere frei wählbare Erinnerungen pro privatem Termin
- externe Link-/Dateilink-Felder
- Organisationskalender
- Zielrollen und Zielmitglieder bei Organisationsterminen
- verpflichtende Termine mit Ablehnungsgrund
- feste Erinnerungsregeln für Organisationstermine
- Terminänderungs- und Absagebenachrichtigungen
- 6-Monats-Aufbewahrung vergangener Organisationstermine
- Mail-/City-Hub-/Bewerbungs-zu-Kalender-Verknüpfungen

Private Kalendereinträge müssen serverseitig strikt gegen Stadtverwaltung, Organisations-Owner und andere unberechtigte Nutzer abgeschirmt werden.