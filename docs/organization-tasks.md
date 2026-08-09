# LG Nexus – Organisationsaufgaben / Taskboard

Dieses Dokument beschreibt den verbindlichen Stand des internen Aufgaben-/Taskboard-Systems bis Frage 3410.

## Grundprinzip

Jede Organisation besitzt ein internes Taskboard. Neue Aufgaben werden über `Aufgaben verwalten` erstellt.

Grundstatus:

- Offen
- In Bearbeitung
- Blockiert
- Erledigt

Organisationen dürfen zusätzliche eigene Status anlegen.

## Ansichten

Es gibt zwei gleichwertige Ansichten:

- **Kanban**
- **Liste/Tabelle**

Kanban-Spalten entsprechen direkt den Aufgabenstatus. Es gibt kein zweites unabhängiges Spaltensystem.

Zusätzlich gibt es Filter nach:

- Status
- Priorität
- Fälligkeit
- Person
- Rolle

Eine Volltextsuche über Aufgaben ist nicht vorgesehen.

Rollenbezogene Aufgaben-Dashboards sind vorgesehen.

## Priorität und Fälligkeit

Prioritäten:

- Niedrig
- Normal
- Hoch
- Dringend

Ein optionales Fälligkeitsdatum ist möglich. Überfällige Aufgaben lösen eine Nexus-Erinnerung aus.

Eine separate Startzeit oder mehrstufige Fälligkeiten sind nicht vorgesehen.

Eine Aufgabe kann optional manuell in den persönlichen Kalender eines Zugewiesenen übernommen werden. Ein Fälligkeitsdatum erzeugt nicht automatisch einen Kalendereintrag.

## Zuweisung

Aufgaben können zugewiesen werden an:

- mehrere einzelne Mitglieder
- ganze Rollen

Ein zusätzlicher eigener `Verantwortlicher` neben den Zugewiesenen ist nicht vorgesehen.

Ein Zugewiesener darf:

- den Status ändern

Ein Zugewiesener darf ohne passendes Verwaltungsrecht nicht:

- das Fälligkeitsdatum ändern
- weitere Personen hinzufügen

## Bearbeiten und Löschen

Eine bestehende Aufgabe darf bearbeitet werden durch:

- Ersteller
- Zugewiesene im zulässigen Umfang
- Personen mit `Aufgaben verwalten`

Endgültiges Löschen erfolgt über `Aufgaben verwalten`.

- Löschgrund Pflicht
- vorher **14 Tage Papierkorb**

## Sichtbarkeit und Vertraulichkeit

Sichtbarkeit kann begrenzt werden auf:

- alle Mitglieder
- ausgewählte Rollen
- ausgewählte Personen

Aufgaben können zusätzlich als vertraulich markiert werden. Für vertrauliche Aufgaben ist ein eigenes passendes Sicht-/Rollenrecht erforderlich.

Die Stadtverwaltung darf interne Aufgaben normaler Organisationen nicht pauschal einsehen.

## Kommentare und Links

- interne Kommentare
- @-Erwähnungen
- Nexus-Benachrichtigung bei @-Erwähnung
- externe Links als Anlagen

## Checklisten

Eine Aufgabe besitzt maximal **eine Checkliste**.

- mehrere Checklistenpunkte möglich
- einzelne Punkte dürfen Personen zugewiesen werden
- Checklistenpunkte besitzen kein eigenes Fälligkeitsdatum
- Fortschritt kann aus erledigten Punkten berechnet werden

## Wiederkehrende Aufgaben

Wiederkehrende Aufgaben sind vorgesehen.

Nach Erledigung wird automatisch die nächste Instanz erzeugt.

Unterstützte Wiederholungen:

- täglich
- wöchentlich
- monatlich

Nicht vorgesehen:

- frei definierbare Wiederholung
- Serienausnahmen
- eigenes Serien-Enddatum als Sonderfunktion

Aufgabenvorlagen bleiben über `Aufgabenvorlagen verwalten` vorgesehen.

## Keine Aufgabenabhängigkeiten

Ein Abhängigkeits-/Blocker-System zwischen Aufgaben ist nicht vorgesehen.

Damit entfallen:

- Abhängigkeiten zu anderen Aufgaben
- automatische Freigabe nach Abschluss einer blockierenden Aufgabe
- eigener `blockiert durch Aufgabe X`-Mechanismus

Der Status `Blockiert` bleibt als normaler Aufgabenstatus verwendbar.

## Pflichtaufgaben

Eine Aufgabe kann als Pflichtaufgabe markiert werden und eine echte Erledigungsbestätigung verlangen.

Der Ersteller kann sehen, welche zugewiesenen Personen bestätigt haben.

## Standortbezug

Eine Aufgabe kann einem Organisationsstandort zugeordnet werden.

## Historie

Angezeigt werden mindestens:

- Ersteller
- letzter Bearbeiter

Aufgaben besitzen einen Änderungsverlauf.

## Verknüpfungen

Mögliche Verknüpfungen:

- interne Dokumente
- Events
- Kalendereinträge
- Bewerbungen
- Kundenanfragen
- Reservierungen
- Verwaltungsanfragen

Eine Verknüpfung gewährt niemals Zugriff auf den verknüpften Inhalt.

## Meine Aufgaben

Jeder Bürger erhält `Meine Aufgaben` als organisationsübergreifende persönliche Ansicht für alle für ihn sichtbaren/zugewiesenen Aufgaben.

Auch als Dashboard-Widget verfügbar.

## Auswertungen

Organisationen dürfen Auswertungen wie offene/überfällige Aufgaben pro Rolle sehen, sofern die auswertende Person die dafür notwendigen Rechte besitzt.

## Aufbewahrung

Erledigte Aufgaben werden **6 Monate** gespeichert und können im Aufgabenarchiv erscheinen.

## Bewusst nicht vorgesehen

- Aufgabenabhängigkeiten
- mehrstufige Fälligkeiten
- Eskalationssystem
- Kopieren bestehender Aufgaben
- Massenänderungen mehrerer Aufgaben
- persönliche Unteraufgaben als eigenes System
- mehrere Checklisten pro Aufgabe
- Volltextsuche

## Technische Leitplanken

Aufgaben, Zuweisungen, Vertraulichkeit und Verknüpfungen werden serverseitig nach Organisationsmitgliedschaft, Rolle und Sichtbarkeit abgesichert. Beim Entzug eines Rechts oder einer Rolle darf ein geöffneter Datensatz nicht mit alter Berechtigung weiter gespeichert werden.
