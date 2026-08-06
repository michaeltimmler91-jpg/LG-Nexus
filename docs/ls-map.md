# LG Nexus – LS Map

Dieses Dokument beschreibt die aktuell festgelegten Regeln für die öffentliche LS Map, persönliche Kartenmarker sowie interne Organisations-Kartenebenen.

## Zugriff

Die LS Map ist für alle aktiven Nexus-Bürger zugänglich.

## Öffentliche Marker

Öffentliche Organisationsstandorte erscheinen automatisch als Kartenmarker, sobald der jeweilige Standort öffentlich freigegeben ist.

Öffentliche Events mit hinterlegter Kartenposition erscheinen ebenfalls automatisch als Marker.

Öffentliche Stellenangebote werden derzeit nicht als eigener Kartenbestand auf der LS Map dargestellt.

### Organisationsmarker

- Eine Organisation darf mehrere öffentliche Marker besitzen.
- Neue öffentliche Organisationsmarker müssen durch die Stadtverwaltung freigegeben werden.
- Farbe und Icon öffentlicher Organisationsmarker werden durch die Stadtverwaltung festgelegt.
- Wird ein Organisationsstandort deaktiviert, verschwindet sein öffentlicher Marker automatisch von der Karte.
- Ein Organisationsmarker kann direkt zum öffentlichen Organisationsprofil führen.

### Eventmarker

Ein Eventmarker kann direkt zur jeweiligen Eventseite führen.

## Temporäre öffentliche Marker

Temporäre öffentliche Marker sind möglich.

Für solche Marker kann ein automatisches Ablaufdatum hinterlegt werden, nach dessen Erreichen der Marker nicht mehr öffentlich angezeigt wird.

## Persönliche Marker

Bürger dürfen eigene persönliche Kartenmarker anlegen.

- Persönliche Marker sind standardmäßig nur für den Ersteller sichtbar.
- Ein Marker kann gezielt mit anderen Bürgern geteilt werden.
- Orte beziehungsweise Marker können als persönliche Favoriten gespeichert werden.

Eine Funktion zum Anzeigen/Kopieren von GTA-Koordinaten oder zum direkten Setzen eines FiveM-Wegpunkts ist in der aktuellen Web-Version nicht vorgesehen.

## Detailansicht, Suche und Filter

Ein Klick auf einen Marker öffnet ein Detailfenster.

Die LS Map unterstützt:

- Filter nach Kategorien
- Suche nach Orten
- Suche nach Organisationen
- Suche nach Events
- automatische Gruppierung nah beieinanderliegender Marker bei passender Zoomstufe

## Interne Organisations-Kartenebenen

Organisationen dürfen eigene interne, nicht öffentliche Kartenebenen besitzen.

- Interne Marker können nur für ausgewählte Rollen sichtbar sein.
- Die Verwaltung erfolgt über das eigene Rollenrecht `Interne Karte verwalten`.
- Die Stadtverwaltung erhält **keinen pauschalen Zugriff** auf interne Kartenebenen normaler Organisationen.

Diese interne Kartenlogik ist von der öffentlichen Organisationsdarstellung getrennt und muss serverseitig entsprechend abgesichert werden.

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- öffentliche Kartenmarker
- Referenzen auf Organisationsstandorte
- Referenzen auf Events
- Freigabestatus öffentlicher Organisationsmarker
- temporäre Marker mit Ablaufdatum
- persönliche Marker
- gezieltes Teilen persönlicher Marker
- persönliche Marker-Favoriten
- Marker-Kategorien
- Karten-Suche und Filter
- Clustering naher Marker
- interne Organisations-Kartenebenen
- rollenbasierte Sichtbarkeit interner Marker
- Rollenrecht `Interne Karte verwalten`

Öffentliche, persönliche und interne Marker müssen als getrennte Sichtbarkeitsbereiche behandelt werden.