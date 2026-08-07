# LG Nexus – Fire & Rescue

Dieses Dokument beschreibt die festgelegten Regeln für das Fire-&-Rescue-Modul.

## Einsatzberichte

Fire & Rescue führt eigene Einsatzberichte im Nexus.

FD-Einsätze besitzen strukturierte Einsatzarten, zum Beispiel:

- Brand
- Technische Hilfe
- Rettung
- Sonstiges

Jeder FD-Einsatzbericht erhält automatisch eine eindeutige Einsatznummer.

Neue Einsatzberichte dürfen nur Mitglieder mit einem passenden Rollenrecht anlegen. Für die Bearbeitung existiert das eigene Rollenrecht `Einsatzberichte bearbeiten`.

Status:

- Entwurf
- Laufend
- Abgeschlossen
- Archiviert

Ein abgeschlossener Einsatzbericht ist nicht normal weiter bearbeitbar. Änderungen erfolgen nur über eine Korrekturversion.

Beim Abschließen ist ein Abschluss- beziehungsweise Kurzfazit Pflicht.

Ein FD-Einsatzbericht kann mit einem gemeinsamen fraktionsübergreifenden Vorfall verknüpft werden.

Ein Einsatz kann eine Einsatzleitung beziehungsweise einen Incident Commander festhalten.

Zusätzlich können strukturiert zugeordnet werden:

- eingesetzte FD-Mitglieder
- eingesetzte Fahrzeuge und Einheiten

## Einsatzdokumentation

FD-Einsatzberichte können enthalten:

- chronologische Einsatz-Zeitleiste
- strukturierte Gefahren/Hinweise am Einsatzort
- externe Links als Bild-/Dateianhänge
- interne Kommentare

Direkte Datei-Uploads sind nicht vorgesehen.

Jeder Timeline-Eintrag zeigt an, wer ihn erstellt hat.

In internen Kommentaren sind @-Erwähnungen möglich. Eine @-Erwähnung löst eine Nexus-Benachrichtigung aus.

## Objekt- und Gefahrendaten

Fire & Rescue besitzt eine interne Objekt-/Gebäude-Gefahrendatenbank.

Anlegen und Bearbeiten erfolgt über das Rollenrecht `Objektdaten verwalten`.

Ein Gefahrenobjekt kann:

- eine feste LS-Map-Position besitzen
- externe Pläne/Bilder als Links enthalten
- ausgewählte Gefahrinformationen gezielt mit PD oder Medical teilen

Eine bereits geteilte Gefahrinformation kann jederzeit wieder entzogen werden.

Zusätzlich können interne Kartenmarker geführt werden für:

- Hydranten
- Zufahrten
- besondere Gefahrenpunkte
- temporäre Sperr-/Gefahrenbereiche

Hydrantenmarker können strukturierte Felder besitzen, unter anderem:

- Typ
- Status
- Notiz

Ein defekter beziehungsweise nicht nutzbarer Hydrant kann direkt über den Status gekennzeichnet werden.

Diese Funktionen bauen auf den bereits festgelegten internen Organisations-Kartenebenen auf.

## Zusammenarbeit mit Medical und PD

Bei einer Patientenübergabe kann FD eine kleine Einsatz-Zusammenfassung gezielt an Medical übergeben.

Ein Einsatz kann für Brand-/Ursachenermittlung gezielt an PD übergeben beziehungsweise mit einem PD-Vorgang verknüpft werden.

## Nachbesprechung

Nach einem Einsatz kann optional ein interner Nachbesprechungs-/After-Action-Bericht erstellt werden.

## Wissensdatenbank und Ausbildung

Fire & Rescue besitzt:

- eine eigene interne Wissensdatenbank
- Ausbildungspläne ähnlich dem Medical-Modul
- Wissenstests innerhalb der Ausbildungspläne

Ein FD-Azubi kann einem oder mehreren festen Ausbildern zugeordnet werden.

Die konkrete Rechte-/Freigabelogik wird an die allgemeinen Organisationsrollen angebunden.

## Geräte und Ausrüstung

Fire & Rescue kann interne Geräte-/Ausrüstungs-Checklisten erstellen und abhaken.

Jedes Gerät beziehungsweise Ausrüstungsteil kann eine eindeutige interne Inventar-ID besitzen.

Gerätestatus:

- Einsatzbereit
- In Wartung
- Defekt
- Außer Dienst

Mängel können die Priorität besitzen:

- Niedrig
- Normal
- Hoch
- Kritisch

Bei fälliger Wartung erhalten Berechtigte automatisch eine Nexus-Erinnerung.

Die Wartungshistorie pro Fahrzeug/Gerät bleibt dauerhaft nachvollziehbar.

## Brandschutz- / Objektprüfungen

Fire & Rescue kann Brandschutz-/Objektprüfungen als eigene interne Berichte erfassen.

Strukturierte Prüfergebnisse:

- Bestanden
- Mängel
- Nachprüfung nötig

Bei festgestellten Mängeln kann eine Nachprüfungsfrist hinterlegt werden.

Eine betroffene Organisation/Firma kann einen ausdrücklich freigegebenen Prüfbericht in Nexus sehen.

Aus einer bestandenen Prüfung kann Fire & Rescue eine Bescheinigung erzeugen.

## Aufbewahrung

Abgeschlossene FD-Einsatzberichte werden **12 Monate** gespeichert.

## Stadtverwaltung

Die Stadtverwaltung darf interne FD-Einsatzberichte **nicht** einsehen.

Ein allgemeiner Stadtverwaltungs-Override ist damit ausgeschlossen.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- FD-Einsatzberichte mit eindeutiger Einsatznummer, Einsatzart, Status und Incident Commander
- Rollenrechte für Berichtsanlage und `Einsatzberichte bearbeiten`
- Abschlussfazit und Korrekturversionen
- strukturierte Einsatzkräfte, Fahrzeuge und Einheiten
- chronologische Einsatz-Timeline mit Autor
- interne Kommentare, @-Erwähnungen und Benachrichtigungen
- Gefahren-/Hinweisfelder
- externe Link-Anhänge
- Objekt-/Gebäude-Gefahrendatenbank mit `Objektdaten verwalten`
- feste Objektpositionen, externe Pläne/Bilder und widerrufbare Freigaben an PD/Medical
- interne Hydranten-/Zufahrts-/Gefahrenmarker mit Statusfeldern
- temporäre Sperr-/Gefahrenbereiche
- Medical-Übergabezusammenfassung
- PD-Verknüpfung für Brand-/Ursachenermittlung
- After-Action-Berichte
- Wissensdatenbank
- Ausbildungspläne, Wissenstests und feste Ausbilderzuweisung
- Geräte-/Ausrüstungs-Checklisten
- Inventar-ID, Gerätestatus und Mangelpriorität
- Wartungserinnerungen und dauerhafte Wartungshistorie
- Brandschutz-/Objektprüfungen mit Ergebnis, Nachprüfungsfrist und freigegebenem Bericht
- Bescheinigung nach bestandener Prüfung
- 12-Monats-Aufbewahrung abgeschlossener Einsatzberichte

Interne FD-Daten müssen serverseitig vom allgemeinen Stadtverwaltungszugriff getrennt bleiben.