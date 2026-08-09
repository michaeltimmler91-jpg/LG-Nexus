# LG Nexus – Gemeinsame Einsätze / Vorfälle

Dieses Dokument beschreibt den verbindlichen Stand des fraktionsübergreifenden Vorfallsystems bis Frage 3410.

## Grundprinzip

Gemeinsame Vorfälle verbinden insbesondere PD, Medical und Fire & Rescue, ohne deren geschützte Fachdaten automatisch zusammenzuführen.

Ein Vorfall:

- eindeutige Vorgangsnummer
- passende Rollenberechtigung für Anlage
- PD/Medical/FD bei Anlage grundsätzlich als vorgesehene Beteiligte
- neue/weitere Fraktion bestätigt Beteiligung
- federführende Organisation darf weitere Fraktionen hinzufügen
- bereits beteiligte Fraktion wird nicht einfach durch die Federführung entfernt
- hinzugefügte Fraktion wird benachrichtigt

## Gemeinsame Basisdaten

- Ort
- Zeit
- Vorfallsart
- Status
- kurze gemeinsame Beschreibung
- beteiligte Bürger mit Name + Nexus-ID
- Priorität Niedrig/Normal/Hoch/Dringend

Beschreibung ist versioniert bearbeitbar.

## Gemeinsamer Informationsbereich

Gemeinsame Notizen/Kommentare zeigen Autor, Fraktion und Zeitpunkt.

- gemeinsame Timeline
- keine fraktionsübergreifenden @-Erwähnungen
- Autor darf eigenen Eintrag bearbeiten → `Bearbeitet`
- Eintrag darf mit Recht vollständig entfernt werden; kein `gelöscht`-Platzhalter

Timeline übernimmt automatisch Status- und Federführungswechsel; manuelle Timeline-Einträge möglich.

## Bewusst schlanker gemeinsamer Bereich

Die Vertiefung bis Frage 3410 bestätigt ausdrücklich, dass der gemeinsame Vorfall **kein zweites Komplett-Einsatzleitsystem** wird.

Nicht zusätzlich vorgesehen:

- eigene gemeinsame Einsatzrollen pro Fraktion
- gemeinsame Lagekarte als separates System
- gemeinsames Taskboard
- eigene Statusmeldungen je Fraktion
- Bürgerbeteiligungsrollen
- gemeinsame Fahrzeug-/Einheitenliste
- Freigaben mit eigener Ablaufzeit
- zusätzliche gemeinsame Abschlusszusammenfassung
- Vorfall als wiederverwendbare Vorlage
- bloße Verknüpfung mehrerer Vorfälle ohne Merge

Fachliche Einheiten, Fahrzeuge, Aufgaben, Karten und Berichte bleiben in den jeweiligen PD-/Medical-/FD-Modulen.

## Sensible Daten und Freigaben

Interne Fachdaten werden nicht automatisch sichtbar.

Eine Fraktion kann ausgewählte interne Einträge beziehungsweise Dokumente gezielt für andere beteiligte Fraktionen freigeben.

- Empfängerfraktionen explizit auswählen
- Freigabe widerrufbar
- Widerruf beendet Zugriff sofort
- kein allgemeiner Anfrageprozess auf zusätzliche geschützte Bereiche
- keine generische zeitgesteuerte Ablauf-Freigabe

## Federführung und Status

Status:

- Neu
- In Bearbeitung
- Abgeschlossen
- Archiviert

Nur Federführung darf Status ändern/abschließen. Abschlussgrund Pflicht. Abgeschlossener Vorfall nicht normal wieder öffnen.

Federführung übertragbar; neue Organisation muss bestätigen. Alle Beteiligten werden über Wechsel benachrichtigt.

## Dubletten / Merge

Nexus warnt anhand Zeit/Ort vor Dubletten.

Zusammenführung:

- Vorschau vor Merge
- nur Federführung des Zielvorfalls
- alte Vorgangsnummer bleibt Referenz/Weiterleitung

Eine reine `verknüpft, aber nicht zusammengeführt`-Beziehung zwischen Vorfällen ist nicht vorgesehen.

## Suche

Suche nach:

- Vorgangsnummer
- Ort
- Datum
- beteiligter Person

Archivierte Vorfälle bleiben während Aufbewahrungsfrist suchbar.

## Kartenbezug

Vorfall kann mehrere LS-Map-Positionen besitzen und mit vorhandenen internen Kartenkontexten der beteiligten Fraktionen arbeiten.

Es gibt jedoch keine eigene zusätzliche gemeinsame Lagekarten-Engine.

Positionen bleiben intern und nicht öffentlich.

## Bürgeransicht

Nur ausdrücklich veröffentlichte Zusammenfassung, kein automatischer Vollzugriff.

## Anhänge

Keine eigene Anhangsfunktion. Dokumente werden bei Bedarf aus dem jeweiligen Fach-/Organisationsbereich gezielt freigegeben.

## Protokollierung

Keine zusätzliche pauschale Zugriffs-/Freigabelog-Tabelle nur für gemeinsame Vorfälle. Normale fachliche Änderungs-/Systemlogs bleiben unberührt.

## Stadtverwaltung

Stadtverwaltung darf nur den gemeinsamen Vorfallbereich **read-only** sehen.

Kein Zugriff dadurch auf Medical-/PD-/FD-Fachdaten.

Technische Systemadministration erhält ebenfalls kein fachliches Freigaberecht durch ihre technische Rolle.

## Aufbewahrung

Abgeschlossene/archivierte gemeinsame Vorfälle: grundsätzlich **6 Monate**.

Berechtigte Nutzer können vor automatischer Löschung die Aufbewahrung verlängern.

Archiviert sperrt normale Bearbeitung.

## Sicherheit

Die Grenze zwischen gemeinsamem Bereich und Fachdaten wird serverseitig strikt durchgesetzt. Ein Link oder eine Vorfallbeteiligung darf niemals selbst ein fachliches Aktenrecht erzeugen.
