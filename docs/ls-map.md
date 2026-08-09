# LG Nexus – LS Map

Dieses Dokument beschreibt den verbindlichen Stand der LS Map bis Frage 3410.

## Zugriff und Kartenbereiche

Die LS Map ist für alle aktiven Nexus-Bürger zugänglich.

Neben Los Santos/Blaine County soll die Kartenarchitektur auch **Cayo Perico und weitere Kartenbereiche** unterstützen können.

## Öffentliche Marker

Öffentliche Organisationsstandorte erscheinen nach Freigabe als Marker. Öffentliche Events mit hinterlegter Kartenposition erzeugen ebenfalls Marker. Stellenangebote werden nicht als eigener Kartenbestand dargestellt.

Für öffentliche Marker gibt es feste Nexus-Systemkategorien und zusätzliche stadtverwaltete Kategorien.

### Organisationsmarker

- mehrere öffentliche Marker pro Organisation möglich
- neue und geänderte Organisationsmarker benötigen Stadtfreigabe
- während erneuter Prüfung kann der Marker ausgeblendet werden
- Ablehnung benötigt Grund und benachrichtigt die Organisation
- Marker kann zum Organisationsprofil führen
- Detailansicht zeigt manuellen Öffnungsstatus, Öffnungszeiten und öffentliche Telefonnummer
- keine eigene Marker-Kurzbeschreibung, kein separates Markerbild und keine externen Links direkt am Marker

Eine zusätzliche automatische Ein-/Ausblendung nach Öffnungszeiten ist nicht vorgesehen.

### Eventmarker

Eventmarker können zur Eventseite führen. Mehrere Event-Orte sind möglich.

## Temporäre Marker

Spezielle temporäre öffentliche Event-/Gefahren-/Organisationsmarker bleiben möglich. Temporäre Organisationsmarker verwenden weiterhin die festgelegte Freigabe und maximal 24 Stunden Laufzeit.

**Normale Marker erhalten dagegen keine frei einstellbare allgemeine Ablaufzeit.**

## Gefahren- und Sperrhinweise

Öffentliche Gefahren-, Sperr- und Verkehrshinweise sind vorgesehen. Die operative Berechtigung richtet sich nach dem zuständigen Fachbereich, insbesondere PD für Verkehrs-/Sperrhinweise.

## Marker melden

Bürger können öffentliche Marker mit Pflichtgrund als falsch/veraltet melden. Stadtverwaltung erhält eine Prüfübersicht.

## Persönliche Marker

Bürger können persönliche Marker mit Name, Beschreibung und persönlichen Kategorien/Farben anlegen.

- standardmäßig nur für Ersteller sichtbar
- keine frei einstellbare Ablaufzeit
- nicht als eigener Favoritentyp vorgesehen

### Teilen

Teilen über privaten Freigabelink:

- Empfänger nur lesen
- kein Bearbeiten
- kein Weiterteilen
- Freigabe jederzeit entziehbar
- Entzug wirkt sofort

## Gespeicherte Kartenansichten

Vorgesehen:

- gespeicherte persönliche Kartenansichten
- persönliche Kartenlisten

Nicht vorgesehen:

- Routenverknüpfung zwischen mehreren Markern
- Marker-Favoriten
- Positionsänderungs-Historie

## FiveM

V1 besitzt keine direkte FiveM-Verbindung. Das Setzen eines FiveM-Wegpunkts aus Nexus ist erst nach V1 als optionale Integration vorgesehen.

Eine automatische Übernahme von Spielerpositionen in Nexus ist derzeit nicht vorgesehen.

## Suche und Filter

- Kategorienfilter
- Ortssuche
- Organisationssuche
- Eventsuche
- Clustering naher Marker

## Interne Organisations-Kartenebenen

Organisationen können getrennte interne Kartenebenen besitzen.

- Freigabe an mehrere Rollen und/oder einzelne Mitglieder
- gezielte organisationsübergreifende Freigabe möglich
- Verwaltung über `Interne Karte verwalten`
- Stadtverwaltung kein pauschaler Zugriff
- keine Kommentare/@-Erwähnungen
- keine zusätzliche Positions-/Änderungshistorie
- keine direkte Dokumentverknüpfung an internen Markern
- keine frei definierbare allgemeine Ablaufzeit normaler interner Marker

Spezielle temporäre Gefahren-/Sperrmarker bleiben davon getrennt möglich.

## Sicherheit

Öffentliche, persönliche und interne Kartenbereiche werden serverseitig getrennt. Freigaben oder Links dürfen keine Sichtbarkeitsregeln umgehen.
