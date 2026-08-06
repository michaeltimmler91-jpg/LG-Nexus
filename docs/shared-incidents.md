# LG Nexus – Gemeinsame Einsätze / Vorfälle

Dieses Dokument beschreibt die festgelegten Regeln für fraktionsübergreifende Vorfälle zwischen Police Department, Medical und Fire & Rescue.

## Grundprinzip

LG Nexus erhält ein gemeinsames Einsatz-/Vorfall-System für PD, Medical und Fire & Rescue.

Ein gemeinsamer Vorfall kann von Mitgliedern dieser Organisationen mit passendem Rollenrecht angelegt werden und erhält automatisch eine eindeutige Vorgangsnummer.

## Gemeinsame Basisdaten

Alle beteiligten Fraktionen sehen gemeinsame Basisdaten:

- Ort
- Zeit
- Art des Vorfalls
- Status
- kurze gemeinsame Einsatzbeschreibung
- beteiligte Bürger mit Name + Nexus-ID

Ein Vorfall kann außerdem eine LS-Map-Position besitzen.

## Gemeinsamer Informationsbereich

Der gemeinsame Bereich verwendet eine gemeinsame Einsatznotiz für alle beteiligten Fraktionen.

Jeder Eintrag muss klar anzeigen:

- wer ihn geschrieben hat
- zu welcher Fraktion der Autor gehört
- Zeitpunkt des Eintrags

Zusätzlich gibt es:

- gemeinsame Einsatz-Zeitleiste
- Kommentare zwischen beteiligten Fraktionen

Fraktionsübergreifende @-Erwähnungen sind in diesem Bereich nicht vorgesehen.

## Sensible Fraktionsdaten

Sensible interne Daten einer Fraktion werden **nicht automatisch** für andere Fraktionen sichtbar.

Eine Fraktion kann jedoch einzelne sensible beziehungsweise interne Einträge gezielt für andere am Vorfall beteiligte Fraktionen freigeben.

Zusätzlich können einzelne interne Organisationsdokumente gezielt für eine andere beteiligte Fraktion freigegeben werden.

Ein allgemeiner Anfrageprozess, mit dem eine andere Fraktion Zugriff auf zusätzlich geschützte Bereiche anfordert, ist nicht vorgesehen.

## Federführung und Status

Jeder gemeinsame Vorfall besitzt eine federführende Organisation.

Die Federführung kann später an eine andere beteiligte Organisation übertragen werden.

Status:

- Neu
- In Bearbeitung
- Abgeschlossen
- Archiviert

Beim Abschließen ist ein Abschlussgrund Pflicht.

Ein abgeschlossener gemeinsamer Vorfall kann nicht wieder geöffnet werden.

## Dubletten

Doppelt angelegte Vorfälle können zusammengeführt werden.

Beim Anlegen warnt Nexus anhand von Zeit und Ort vor möglichen bereits vorhandenen Vorfällen.

## Kartenverknüpfung

Ein gemeinsamer Vorfall kann:

- eine eigene LS-Map-Position besitzen
- mit internen Kartenmarkern beteiligter Organisationen verknüpft werden

## Anhänge

Der gemeinsame Vorfall besitzt keine eigene Anhangsfunktion.

Falls Informationen über Dokumente geteilt werden sollen, erfolgt dies über die gezielte Freigabe vorhandener interner Organisationsdokumente.

## Protokollierung

Fraktionsübergreifende Zugriffe und Freigaben werden nicht zusätzlich in einem eigenen Zugriffs-/Freigabeprotokoll des Vorfalls protokolliert.

Damit entfällt auch eine separate Protokollansicht.

## Stadtverwaltung

Die Stadtverwaltung darf gemeinsame Vorfälle grundsätzlich einsehen.

Dies gilt nur für den gemeinsamen Vorfallbereich. Geschützte Medical-, Police- oder Fire-&-Rescue-Fachdaten bleiben weiterhin nach den Regeln des jeweiligen Moduls geschützt.

## Aufbewahrung

Abgeschlossene gemeinsame Vorfälle werden **6 Monate** gespeichert und können danach automatisch entfernt werden.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- gemeinsame Vorfallstabelle mit eindeutiger Vorgangsnummer
- beteiligte Organisationen
- federführende Organisation
- Status + Abschlussgrund
- gemeinsame Basisdaten und Kurzbeschreibung
- Bürgerbeteiligungen mit Name/Nexus-ID-Referenz
- gemeinsame Timeline / Kommentare mit Autor und Fraktion
- selektive Freigabe einzelner Fraktionseinträge
- gezielte Freigabe interner Dokumente
- Kartenposition und Marker-Verknüpfungen
- Dublettenwarnung und Zusammenführung
- 6-Monats-Aufbewahrung

Die Trennung zwischen gemeinsamem Vorfallbereich und vertraulichen Fraktionsdaten muss serverseitig strikt durchgesetzt werden.