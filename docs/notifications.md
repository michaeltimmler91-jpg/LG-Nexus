# LG Nexus – Benachrichtigungen

Dieses Dokument beschreibt die aktuell festgelegten Regeln für die zentrale Nexus-Benachrichtigungszentrale.

## Zentrale Benachrichtigungszentrale

LG Nexus besitzt eine zentrale Benachrichtigungszentrale.

- Am Navigationssymbol wird die Anzahl ungelesener Benachrichtigungen angezeigt.
- Benachrichtigungen können nach Kategorien gruppiert werden.
- Es gibt `Alle als gelesen markieren`.
- Eine gelesene Benachrichtigung kann wieder als ungelesen markiert werden.
- Ein Filter `nur ungelesene` ist direkt verfügbar.
- Einzelne normale Benachrichtigungen können gelöscht werden.
- Zusätzlich ist ein Archivieren möglich.
- Suche und Filter sind vorgesehen.

## Prioritäten und Sortierung

Benachrichtigungen verwenden die Prioritätsstufen:

- Niedrig
- Normal
- Hoch
- Dringend

Die Standard-Sortierung richtet sich zuerst nach der Priorität. Innerhalb derselben Priorität kann nach Aktualität sortiert werden.

@-Erwähnungen erhalten standardmäßig die Priorität **Dringend**.

## Aufbewahrung, Papierkorb und Archiv

Normale Benachrichtigungen werden grundsätzlich **6 Monate** aufbewahrt.

Beim manuellen Löschen einer normalen Benachrichtigung landet sie zunächst **30 Tage im Papierkorb** und wird danach endgültig entfernt.

Archivierte normale Benachrichtigungen dürfen maximal **12 Monate** gespeichert bleiben.

## Pflichtbenachrichtigungen

Wichtige Pflichtbenachrichtigungen können nicht deaktiviert werden.

- Pflichtbenachrichtigungen dürfen vom Benutzer nicht manuell gelöscht werden.
- Sie dürfen jedoch archiviert werden.
- Dringende Pflichtmeldungen dürfen Ruhezeiten übergehen.

Auch normale Benachrichtigungskategorien können vom Benutzer derzeit nicht vollständig abgeschaltet werden.

Benachrichtigungen bleiben grundsätzlich Bestandteil von Nexus; eine Zustellung per externer E-Mail ist nicht vorgesehen.

## Ruhezeiten / Nicht stören

Benutzer können `Nicht stören` verwenden.

Möglich sind:

- ein täglicher Ruhezeit-Plan
- mehrere unterschiedliche Pläne, etwa Werktage/Wochenende
- eine manuelle Aktivierung `Nicht stören bis …`

Während `Nicht stören`:

- normale Toast-Popups werden unterdrückt
- dringende Pflichtmeldungen dürfen weiterhin als Toast erscheinen

## Gruppierung

Ähnliche Benachrichtigungen können zusammengefasst werden.

- Gruppen sind aufklappbar, damit die einzelnen Meldungen sichtbar bleiben.
- Im Navigations-Badge zählt eine ungelesene Gruppe als **1**, nicht jede enthaltene Einzelmeldung separat.

## Navigation

Ein Klick auf eine Benachrichtigung führt direkt zum zugehörigen Inhalt, sofern dieser noch vorhanden und für den Benutzer zugänglich ist.

Nach dem Anklicken bleibt die Benachrichtigung bestehen und wird lediglich als gelesen markiert.

## Push, Toast und Ton

- Kleine Popup-/Toast-Hinweise bei neuen Meldungen sind vorgesehen.
- Die Toast-Anzeigedauer ist eine feste Nexus-Vorgabe.
- Browser-/Desktop-Push kann später unterstützt werden.
- Browser-/Desktop-Push muss ausdrücklich durch den Benutzer aktiviert werden.
- Browser-Push kann separat deaktiviert werden, ohne Nexus-interne Benachrichtigungen abzuschalten.
- Eine spätere FiveM-Ingame-Anzeige der Nexus-Benachrichtigungen ist derzeit nicht vorgesehen.
- Es gibt einen einzigen globalen Nexus-Benachrichtigungston.
- Die Lautstärke dieses Tons ist einstellbar.
- Der Ton kann vollständig stummgeschaltet werden.
- Unterschiedliche Töne je Kategorie sind nicht vorgesehen.

## @-Erwähnungen

@-Erwähnungen erzeugen grundsätzlich eine Nexus-Benachrichtigung, sofern der erwähnte Benutzer den betreffenden Inhalt sehen darf.

Standardpriorität: **Dringend**.

## City-Hub- und Systemmeldungen

City-Hub-Pushmeldungen können gezielt an bestimmte Rollen oder Organisationen adressiert werden, statt immer an alle aktiven Bürger zu gehen.

Die Stadtverwaltung darf außerdem gezielte Nexus-Systemmeldungen an ausgewählte Bürger senden.

### Stadtverwaltungs-Systemmeldungen

Für gezielte Systemmeldungen gilt:

- Als Absender wird dem Bürger nur `Stadtverwaltung` angezeigt; der konkrete Mitarbeitername wird nicht offengelegt.
- Titel und Nachrichtentext sind Pflicht.
- Eine Meldung darf einen Button beziehungsweise Deep-Link zu einem Nexus-Inhalt enthalten.
- Eine Meldung darf ein Ablaufdatum besitzen.
- Die Stadtverwaltung kann eine Lesebestätigung verlangen.
- Wenn eine Lesebestätigung verlangt wird, darf die Stadtverwaltung sehen, wer bestätigt hat.
- Bereits versendete Systemmeldungen dürfen zurückgerufen werden.
- Bei einem Rückruf werden die Empfänger darüber informiert.
- Die Stadtverwaltung kann versendete Systemmeldungen intern **6 Monate** nachvollziehen.

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- zentrale Benachrichtigungstabelle
- Kategorien
- Prioritäten `low / normal / high / urgent`
- gelesen/ungelesen
- Archivstatus
- 30-Tage-Papierkorb
- normale 6-Monats-Aufbewahrung
- Archiv-Aufbewahrung bis 12 Monate
- Gruppierungs-/Thread-Logik für ähnliche Meldungen
- Deep-Links zum jeweiligen Nexus-Inhalt
- mehrere Ruhezeit-Pläne und temporäres Nicht-stören
- Kennzeichnung dringender Pflichtmeldungen
- Toast-Hinweise
- ein globaler einstellbarer Benachrichtigungston
- optionaler Browser-/Desktop-Push mit Opt-in
- zielgruppenbasierte City-Hub-Pushmeldungen
- gezielte Stadtverwaltungs-Systemmeldungen
- Lesebestätigungen und Rückrufstatus für Systemmeldungen

Berechtigungen und Zielgruppen müssen serverseitig geprüft werden; eine Benachrichtigung darf niemals auf einen Inhalt verweisen, den der Empfänger nicht sehen darf.