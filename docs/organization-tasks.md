# LG Nexus – Organisationsaufgaben / Taskboard

Dieses Dokument beschreibt die festgelegten Regeln für das interne Aufgaben- und Taskboard-System von Organisationen.

## Grundprinzip

Jede Organisation besitzt ein internes Aufgaben-/Taskboard.

Neue Aufgaben werden über das Rollenrecht `Aufgaben verwalten` erstellt.

## Status

Grundstatus:

- Offen
- In Bearbeitung
- Blockiert
- Erledigt

Zusätzlich darf jede Organisation eigene Aufgabenstatus definieren.

## Priorität und Fälligkeit

Aufgaben können eine Priorität besitzen:

- Niedrig
- Normal
- Hoch
- Dringend

Ein optionales Fälligkeitsdatum ist möglich.

Überfällige Aufgaben lösen automatisch eine Nexus-Erinnerung aus.

## Zuweisung und Sichtbarkeit

Eine Aufgabe kann gleichzeitig:

- mehreren einzelnen Mitgliedern zugewiesen werden
- einer ganzen Rolle zugewiesen werden

Die Sichtbarkeit kann auf folgende Zielgruppen beschränkt werden:

- alle Mitglieder
- ausgewählte Rollen
- ausgewählte Personen

## Kommentare und Zusammenarbeit

Aufgaben besitzen interne Kommentare.

- @-Erwähnungen sind möglich.
- Eine @-Erwähnung löst eine Nexus-Benachrichtigung aus.
- Externe Links können als Anlagen hinterlegt werden.

## Checklisten und Fortschritt

Eine Aufgabe kann Checklisten beziehungsweise Unterpunkte besitzen.

Der Fortschritt darf automatisch aus dem Anteil erledigter Checklistenpunkte berechnet werden.

## Wiederkehrende Aufgaben

Wiederkehrende Aufgaben sind möglich.

Zusätzlich gibt es Vorlagen für typische beziehungsweise wiederkehrende Aufgaben.

Die Vorlagenverwaltung erfolgt über das Rollenrecht `Aufgabenvorlagen verwalten`.

## Historie

Bei jeder Aufgabe wird angezeigt:

- wer sie erstellt hat
- wer sie zuletzt bearbeitet hat

Aufgaben besitzen einen Änderungsverlauf.

## Pflichtaufgaben

Aufgaben können als verpflichtend markiert werden und eine Bestätigung verlangen.

## Verknüpfungen

Eine Aufgabe kann verknüpft werden mit:

- internen Dokumenten
- Events
- Kalendereinträgen
- Bewerbungen
- Kundenanfragen
- Verwaltungsanfragen

Die Verknüpfung gewährt niemals automatisch Zugriff auf den verknüpften Inhalt. Die jeweilige ursprüngliche Berechtigung bleibt erforderlich.

## Meine Aufgaben

Jeder Bürger erhält eine persönliche Ansicht `Meine Aufgaben`, die berechtigte eigene Aufgaben aus allen Organisationen zusammenführt.

`Meine Aufgaben` ist außerdem als Dashboard-Widget verfügbar.

## Archiv und Aufbewahrung

Erledigte Aufgaben werden **6 Monate** gespeichert.

Es gibt einen eigenen Aufgaben-Archivbereich.

## Zugriff der Stadtverwaltung

Die Stadtverwaltung darf interne Aufgaben normaler Organisationen **nicht** einsehen.

Ein allgemeines Aufsichtsrecht auf Organisationsaufgaben ist damit ausgeschlossen.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- Organisationsaufgaben
- feste Grundstatus plus organisationsdefinierte Zusatzstatus
- Priorität und Fälligkeit
- Mehrfachzuweisungen an Personen und Rollen
- zielgruppenbezogene Sichtbarkeit
- Kommentare und @-Erwähnungen
- externe Link-Anlagen
- wiederkehrende Aufgaben
- Checklisten und berechneter Fortschritt
- Änderungsverlauf
- verpflichtende Aufgaben mit Bestätigung
- Aufgabenvorlagen
- Verknüpfungen mit Dokumenten, Kalender, Events und Vorgängen
- organisationsübergreifende persönliche `Meine Aufgaben`-Ansicht
- Dashboard-Widget
- 6-Monats-Aufbewahrung und Archiv

Aufgaben, Zuweisungen und Verknüpfungen müssen serverseitig nach Organisationsmitgliedschaft, Rollenrechten und Sichtbarkeit abgesichert werden.