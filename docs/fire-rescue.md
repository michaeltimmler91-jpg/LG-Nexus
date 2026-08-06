# LG Nexus – Fire & Rescue

Dieses Dokument beschreibt die festgelegten Regeln für das Fire-&-Rescue-Modul.

## Einsatzberichte

Fire & Rescue führt eigene Einsatzberichte im Nexus.

FD-Einsätze besitzen strukturierte Einsatzarten, zum Beispiel:

- Brand
- Technische Hilfe
- Rettung
- Sonstiges

Ein FD-Einsatzbericht kann mit einem gemeinsamen fraktionsübergreifenden Vorfall verknüpft werden.

Ein Einsatz kann eine Einsatzleitung beziehungsweise einen Incident Commander festhalten.

## Einsatzdokumentation

FD-Einsatzberichte können enthalten:

- chronologische Einsatz-Zeitleiste
- strukturierte Gefahren/Hinweise am Einsatzort
- externe Links als Bild-/Dateianhänge

Direkte Datei-Uploads sind nicht vorgesehen.

## Objekt- und Gefahrendaten

Fire & Rescue besitzt eine interne Objekt-/Gebäude-Gefahrendatenbank.

Zusätzlich können interne Kartenmarker geführt werden für:

- Hydranten
- Zufahrten
- besondere Gefahrenpunkte
- temporäre Sperr-/Gefahrenbereiche

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

Die konkrete Rechte-/Freigabelogik wird an die allgemeinen Organisationsrollen angebunden.

## Geräte und Ausrüstung

Fire & Rescue kann:

- interne Geräte-/Ausrüstungs-Checklisten erstellen und abhaken
- Wartungs-/Mängeldokumentation für Fahrzeuge und Ausrüstung führen
- Brandschutz-/Objektprüfungen als eigene interne Berichte erfassen

## Aufbewahrung

Abgeschlossene FD-Einsatzberichte werden **12 Monate** gespeichert.

## Stadtverwaltung

Die Stadtverwaltung darf interne FD-Einsatzberichte **nicht** einsehen.

Ein allgemeiner Stadtverwaltungs-Override ist damit ausgeschlossen.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- FD-Einsatzberichte mit Einsatzart und Incident Commander
- chronologische Einsatz-Timeline
- Gefahren-/Hinweisfelder
- externe Link-Anhänge
- Objekt-/Gebäude-Gefahrendatenbank
- interne Hydranten-/Zufahrts-/Gefahrenmarker
- temporäre Sperr-/Gefahrenbereiche
- Medical-Übergabezusammenfassung
- PD-Verknüpfung für Brand-/Ursachenermittlung
- After-Action-Berichte
- Wissensdatenbank
- Ausbildungspläne
- Geräte-/Ausrüstungs-Checklisten
- Wartungs-/Mängeldokumentation
- Brandschutz-/Objektprüfungen
- 12-Monats-Aufbewahrung abgeschlossener Einsatzberichte

Interne FD-Daten müssen serverseitig vom allgemeinen Stadtverwaltungszugriff getrennt bleiben.