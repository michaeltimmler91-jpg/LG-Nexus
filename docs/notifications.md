# LG Nexus – Benachrichtigungen

Dieses Dokument beschreibt die aktuell festgelegten Regeln für die zentrale Nexus-Benachrichtigungszentrale.

## Zentrale Benachrichtigungszentrale

LG Nexus besitzt eine zentrale Benachrichtigungszentrale.

- Am Navigationssymbol wird die Anzahl ungelesener Benachrichtigungen angezeigt.
- Benachrichtigungen können nach Kategorien gruppiert werden.
- Es gibt `Alle als gelesen markieren`.
- Einzelne Benachrichtigungen können gelöscht werden.
- Zusätzlich ist ein Archivieren möglich.
- Suche und Filter sind vorgesehen.
- Benachrichtigungen können Prioritäten besitzen.

## Aufbewahrung

Normale Benachrichtigungen werden **6 Monate** aufbewahrt und können danach automatisch entfernt werden.

## Pflichtbenachrichtigungen und Kategorien

Wichtige Pflichtbenachrichtigungen können weiterhin nicht deaktiviert werden.

Auch normale Benachrichtigungskategorien können vom Benutzer derzeit nicht vollständig abgeschaltet werden.

Benachrichtigungen bleiben grundsätzlich Bestandteil von Nexus; eine Zustellung per externer E-Mail ist nicht vorgesehen.

## Ruhezeiten / Nicht stören

Benutzer können Ruhezeiten beziehungsweise einen `Nicht stören`-Modus verwenden.

Dringende Pflichtmeldungen dürfen diese Ruhezeiten übergehen.

## Gruppierung

Ähnliche Benachrichtigungen können zusammengefasst werden, damit die Zentrale nicht mit vielen gleichartigen Einzelmeldungen überladen wird.

## Navigation

Ein Klick auf eine Benachrichtigung führt direkt zum zugehörigen Inhalt, sofern dieser noch vorhanden und für den Benutzer zugänglich ist.

Nach dem Anklicken bleibt die Benachrichtigung bestehen und wird lediglich als gelesen markiert.

## Push und Darstellung

- Kleine Popup-/Toast-Hinweise bei neuen Meldungen sind vorgesehen.
- Browser-/Desktop-Push kann später unterstützt werden.
- Eine spätere FiveM-Ingame-Anzeige der Nexus-Benachrichtigungen ist derzeit **nicht vorgesehen**.
- Unterschiedliche Benachrichtigungstöne je Kategorie sind nicht vorgesehen.
- Ein vorhandener Benachrichtigungston kann vollständig stummgeschaltet werden.

## @-Erwähnungen

@-Erwähnungen erzeugen grundsätzlich eine Nexus-Benachrichtigung, sofern der erwähnte Benutzer den betreffenden Inhalt sehen darf.

## City-Hub- und Systemmeldungen

City-Hub-Pushmeldungen können gezielt an bestimmte Rollen oder Organisationen adressiert werden, statt immer an alle aktiven Bürger zu gehen.

Die Stadtverwaltung darf außerdem gezielte Nexus-Systemmeldungen an ausgewählte Bürger senden.

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- zentrale Benachrichtigungstabelle
- Kategorien
- Prioritäten
- gelesen/ungelesen
- Archivstatus
- Löschstatus beziehungsweise Löschaktion
- 6-Monats-Aufbewahrung
- Gruppierungs-/Thread-Logik für ähnliche Meldungen
- Deep-Links zum jeweiligen Nexus-Inhalt
- Ruhezeiten/Nicht-stören
- Kennzeichnung dringender Pflichtmeldungen
- Toast-Hinweise
- optionaler Browser-/Desktop-Push
- zielgruppenbasierte City-Hub-Pushmeldungen
- gezielte Stadtverwaltungs-Systemmeldungen

Berechtigungen und Zielgruppen müssen serverseitig geprüft werden; eine Benachrichtigung darf niemals auf einen Inhalt verweisen, den der Empfänger nicht sehen darf.