# LG Nexus – Benachrichtigungen

Dieses Dokument beschreibt den verbindlichen Stand der zentralen Nexus-Benachrichtigungszentrale bis Frage 3410.

## Zentrale Benachrichtigungszentrale

LG Nexus besitzt eine zentrale Benachrichtigungszentrale.

- Badge mit Anzahl ungelesener Meldungen
- Gruppierung nach Kategorien
- `Alle als gelesen markieren`
- gelesen wieder auf ungelesen setzen
- Filter `nur ungelesene`
- normale Meldungen löschen oder archivieren
- Suche und Filter

## Prioritäten

- Niedrig
- Normal
- Hoch
- Dringend

Standard-Sortierung zuerst nach Priorität, danach Aktualität.

@-Erwähnungen erzeugen weiterhin eine normale Nexus-Benachrichtigung; es gibt kein zweites paralleles Erwähnungs-Workflow-System. Bestehende Standardpriorität für Erwähnungen: Dringend.

## Aufbewahrung

- normale Benachrichtigungen: 6 Monate
- manuell gelöscht: 30 Tage Papierkorb
- archiviert: maximal 12 Monate

## Pflichtbenachrichtigungen

Wichtige Pflichtmeldungen können nicht deaktiviert oder manuell gelöscht werden, dürfen aber archiviert werden.

Dringende Pflichtmeldungen dürfen Ruhezeiten übergehen.

## Nicht stören

Mehrere Ruhezeitpläne sowie `Nicht stören bis …` sind möglich.

Während DND:

- normale Toasts unterdrückt
- dringende Pflichtmeldung darf erscheinen

Ein separates `Snooze` einzelner normaler Benachrichtigungen ist nicht vorgesehen.

## Gruppierung

Ähnliche Meldungen können weiterhin zusammengefasst werden.

- Gruppe aufklappbar
- Badge zählt eine ungelesene Gruppe als 1

Die spätere Frage `Benachrichtigungs-Bündelung als eigener Workflow` wurde abgelehnt; das hebt diese vorhandene Darstellungsgruppierung nicht auf.

## Keine Digests

Nicht vorgesehen:

- tägliche Benachrichtigungsübersicht/Digest
- zusätzliches periodisches Zusammenfassungs-System

## Organisationsregeln

Organisationen dürfen eigene Benachrichtigungsregeln für organisationsinterne Funktionen konfigurieren, sofern das Mitglied ein passendes Rollenrecht besitzt.

Diese Regeln dürfen keine systemweiten Pflichtmeldungen oder fachlich zwingenden Sicherheitsmeldungen abschalten.

## Navigation

Klick führt zum zugehörigen Inhalt, sofern weiterhin vorhanden und berechtigt. Danach bleibt Meldung erhalten und wird gelesen markiert.

## Toast, Push und Ton

- Nexus-Toasts vorgesehen
- feste Toast-Dauer
- Browser/Desktop-Push später optional, Opt-in
- Push separat deaktivierbar
- kein FiveM-Ingame-Notification-Overlay geplant
- ein globaler Nexus-Benachrichtigungston
- Lautstärke einstellbar/stummschaltbar
- keine unterschiedlichen Töne je Kategorie

## Mail

Persönliche und Organisations-Mail nutzen Kategorie `Mail`. Persönliche Mail-@mentions erzeugen keine zusätzliche Erwähnungsmeldung.

## City Hub und Systemmeldungen

City-Hub-Push kann zielgruppenbezogen an Rollen/Organisationen gehen.

Stadtverwaltung darf gezielte Systemmeldungen an ausgewählte Bürger senden.

Systemmeldungen können:

- Titel/Text
- Deep-Link
- Ablaufdatum
- Lesebestätigung
- Rückruf

besitzen.

Bei Lesebestätigung darf Stadtverwaltung sehen, wer bestätigt hat. Rückruf informiert Empfänger. Interne Nachvollziehbarkeit: 6 Monate.

Normale wichtige City-Hub-Beiträge benötigen dagegen keine verpflichtende Lesebestätigung.

## Rechteänderungen und Beitritte

Es wird kein eigener mehrstufiger Benachrichtigungs-Workflow für Rechteverlust, Organisationsbeitritt oder Inhaltslöschung gebaut. Fachmodule dürfen bei tatsächlich relevanten Ereignissen weiterhin normale Nexus-Benachrichtigungen auslösen.

## Sicherheit

Berechtigung und Zielgruppe werden serverseitig geprüft. Eine Meldung darf keinen Zugriff auf einen nicht mehr sichtbaren Inhalt erzeugen.
