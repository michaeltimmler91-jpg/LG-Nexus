# LG Nexus – LS Map

Dieses Dokument beschreibt die aktuell festgelegten Regeln für die öffentliche LS Map, persönliche Kartenmarker sowie interne Organisations-Kartenebenen.

## Zugriff

Die LS Map ist für alle aktiven Nexus-Bürger zugänglich.

## Öffentliche Marker

Öffentliche Organisationsstandorte erscheinen automatisch als Kartenmarker, sobald der jeweilige Standort öffentlich freigegeben ist.

Öffentliche Events mit hinterlegter Kartenposition erscheinen ebenfalls automatisch als Marker.

Öffentliche Stellenangebote werden derzeit nicht als eigener Kartenbestand auf der LS Map dargestellt.

### Kategorien

Für öffentliche Marker gibt es:

- feste Nexus-Systemkategorien
- zusätzliche durch die Stadtverwaltung angelegte Kategorien

### Organisationsmarker

- Eine Organisation darf mehrere öffentliche Marker besitzen.
- Neue öffentliche Organisationsmarker müssen durch die Stadtverwaltung freigegeben werden.
- Farbe und Icon öffentlicher Organisationsmarker werden durch die Stadtverwaltung festgelegt.
- Organisationsstandorte können Typen wie `Hauptsitz`, `Filiale`, `Wache` oder `Sonstiges` besitzen.
- Wird ein Organisationsstandort deaktiviert, verschwindet sein öffentlicher Marker automatisch von der Karte.
- Ein Organisationsmarker kann direkt zum öffentlichen Organisationsprofil führen.
- Im Marker-Detailfenster werden Öffnungsstatus und Öffnungszeiten aus dem Organisationsprofil angezeigt.
- Eine eigene Marker-Kurzbeschreibung ist nicht vorgesehen; verwendet wird die Profilbeschreibung der Organisation.
- Logo/Bild der Organisation wird im Marker-Detail nicht zusätzlich angezeigt.
- Die öffentliche Organisations-Telefonnummer wird angezeigt.
- Externe Links direkt am Marker sind nicht vorgesehen.

### Änderungen und Freigabe

Änderungen an einem bereits freigegebenen öffentlichen Organisationsmarker müssen erneut von der Stadtverwaltung freigegeben werden.

- Während eine Änderung auf Freigabe wartet, wird der Marker vorübergehend ausgeblendet.
- Bei Ablehnung ist ein Ablehnungsgrund Pflicht.
- Die Organisation wird über Freigabe oder Ablehnung benachrichtigt.

### Eventmarker

Ein Eventmarker kann direkt zur jeweiligen Eventseite führen.

## Temporäre öffentliche Marker

Temporäre öffentliche Marker sind möglich.

- Neben der Stadtverwaltung dürfen auch Organisationen temporäre öffentliche Marker anlegen.
- Dafür wird kein zusätzliches separates Rollenrecht `Öffentliche Karte verwalten` eingeführt; die Berechtigung wird über den jeweils passenden bestehenden Event-/Profil-Verwaltungsbereich abgebildet.
- Temporäre Organisationsmarker müssen durch die Stadtverwaltung freigegeben werden.
- Die maximale Laufzeit beträgt **24 Stunden**.
- Danach verschwindet der Marker automatisch.

## Öffentliche Marker melden

Bürger dürfen öffentliche Marker als falsch oder veraltet melden.

- Ein Meldegrund ist Pflicht.
- Die Stadtverwaltung erhält eine eigene Warteschlange für gemeldete Kartenmarker.

## Persönliche Marker

Bürger dürfen eigene persönliche Kartenmarker anlegen.

Persönliche Marker können:

- Name und Beschreibung besitzen
- eigene Kategorien/Farben besitzen
- ein automatisches Ablaufdatum besitzen
- als persönliche Favoriten gespeichert werden

Persönliche Marker sind standardmäßig nur für den Ersteller sichtbar.

### Teilen persönlicher Marker

Persönliche Marker werden über einen privaten Freigabelink geteilt.

- Empfänger dürfen einen geteilten Marker nur ansehen.
- Empfänger dürfen ihn nicht bearbeiten.
- Empfänger dürfen ihn nicht weiterteilen.
- Der Ersteller kann eine Freigabe jederzeit entziehen.
- Nach Entzug verschwindet der Marker beim Empfänger sofort.

Eine Funktion zum Anzeigen/Kopieren von GTA-Koordinaten oder zum direkten Setzen eines FiveM-Wegpunkts ist in der aktuellen Web-Version nicht vorgesehen.

## Persönliche Live-Positionen

Eine persönliche Live-Position soll später grundsätzlich möglich sein, jedoch ausschließlich **freiwillig/Opt-in**. Die konkrete Freigabelogik wird separat definiert.

Eine spätere Anzeige von Live-Positionen eigener Einsatzmittel aus FiveM für Einsatzorganisationen ist derzeit nicht vorgesehen.

## Detailansicht, Suche und Filter

Ein Klick auf einen Marker öffnet ein Detailfenster.

Die LS Map unterstützt:

- Filter nach Kategorien
- Suche nach Orten
- Suche nach Organisationen
- Suche nach Events
- automatische Gruppierung nah beieinanderliegender Marker bei passender Zoomstufe

## Interne Organisations-Kartenebenen

Organisationen dürfen mehrere getrennte interne, nicht öffentliche Kartenebenen besitzen.

- Interne Marker können gleichzeitig für mehrere Rollen freigegeben werden.
- Interne Marker können zusätzlich gezielt für einzelne Mitglieder sichtbar sein.
- Interne Kartenebenen beziehungsweise Marker dürfen organisationsübergreifend mit einer anderen Organisation geteilt werden.
- Interne Marker können ein Ablaufdatum besitzen und danach automatisch verschwinden.
- Interne Marker können auf ein internes Organisationsdokument verlinken.
- Eine Kommentar-Funktion für interne Marker ist derzeit nicht vorgesehen.
- Damit entfallen dort auch @-Erwähnungen und zugehörige Benachrichtigungen.
- Änderungen und Löschungen interner Marker werden derzeit nicht zusätzlich protokolliert.
- Die Verwaltung erfolgt über das Rollenrecht `Interne Karte verwalten`.
- Die Stadtverwaltung erhält keinen pauschalen Zugriff auf interne Kartenebenen normaler Organisationen.

Diese interne Kartenlogik ist von der öffentlichen Organisationsdarstellung getrennt und muss serverseitig entsprechend abgesichert werden.

## Straßensperrungen und Verkehrshinweise

Öffentliche Straßensperrungen und Verkehrshinweise auf der LS Map sind vorgesehen. Operativ soll diese Funktion jedoch primär durch das **Police Department** verwaltet werden und nicht als allgemeines Stadtverwaltungsrecht verstanden werden.

Die genaue PD-Berechtigung wird im Police-Modul festgelegt.

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- öffentliche Kartenmarker
- feste und stadtverwaltete Kategorien
- Referenzen auf Organisationsstandorte
- Referenzen auf Events
- Freigabe- und Änderungsstatus öffentlicher Organisationsmarker
- Ablehnungsgründe und Organisationsbenachrichtigungen
- temporäre Marker mit 24-Stunden-Ablauf
- Marker-Meldungen mit Verwaltungswarteschlange
- persönliche Marker mit Kategorien, Freigabelinks und Ablaufdatum
- persönliche Marker-Favoriten
- Karten-Suche und Filter
- Clustering naher Marker
- interne Organisations-Kartenebenen
- rollen- und mitgliedsbasierte Sichtbarkeit interner Marker
- organisationsübergreifende Kartenfreigaben
- Rollenrecht `Interne Karte verwalten`
- spätere freiwillige persönliche Live-Positionen
- PD-Verkehrs-/Sperrungsmarker

Öffentliche, persönliche und interne Marker müssen als getrennte Sichtbarkeitsbereiche behandelt werden.