# LG Nexus – Police

Dieses Dokument beschreibt den vereinfachten V1-Stand des Police-Moduls.

Ziel ist ein schneller Arbeitsablauf. Das Modul soll im Stadtalltag helfen und keine komplizierte Verwaltungssoftware nachbilden.

## Bürgersuche

Police kann Bürger nach Name oder Nexus-ID suchen.

Die Bürgerübersicht zeigt direkt:

- Name und Nexus-ID
- bisherige Vorgänge und die Rolle der Person darin
- aktive Fahndungen
- aktive Haftbefehle
- Bußgelder mit Status

Ein Bürger gilt nicht automatisch als Beschuldigter, nur weil er in einem Vorgang auftaucht. Die jeweilige Rolle wird immer sichtbar dargestellt.

## Vorgänge

Ein Vorgang enthält nur die Informationen, die im Alltag wirklich gebraucht werden:

- eindeutige Vorgangsnummer
- Titel
- Beteiligte mit Rolle `Beschuldigter / Opfer / Zeuge / Sonstige`
- Sachverhalt
- Maßnahmen
- optionale Beweise oder Links als Freitext
- Verlauf mit kurzen Ergänzungen
- Status `Offen / Erledigt`

Beteiligte können nachträglich ergänzt oder entfernt werden. Sachverhalt, Maßnahmen und Links können bei offenen Vorgängen bearbeitet werden.

Ein erledigter Vorgang bleibt lesbar.

## Fahndungen

Fahndungen können für Bürger oder Fahrzeuge angelegt werden.

Gespeichert werden:

- eindeutige Fahndungsnummer
- Person oder Kennzeichen
- Grund
- optionaler kurzer Hinweis
- Priorität `Niedrig / Normal / Hoch / Dringend`
- Status `Aktiv / Erledigt`

Zum Beenden wird ein kurzer Grund hinterlegt.

## Fahrzeuge und Kennzeichen

Police besitzt eine einfache interne Fahrzeugübersicht.

Ein Fahrzeug kann enthalten:

- Kennzeichen
- Modell
- Farbe
- optionaler Halter aus Nexus
- kurzer interner Hinweis

Die Suche funktioniert über Kennzeichen, Modell, Haltername oder Nexus-ID.

Aktive Fahrzeugfahndungen werden direkt kenntlich gemacht.

Es gibt in V1 keine automatische Fahrzeugsynchronisation.

## Bußgelder

Bußgelder werden direkt einem Bürger zugeordnet.

Gespeichert werden:

- eindeutige Bußgeldnummer
- Bürger
- Grund
- Betrag in $
- optional eine Vorgangsnummer
- Status `Offen / Bezahlt / Erlassen / Storniert`

Ein separater Tatbestandskatalog ist für V1 nicht erforderlich.

## Haftbefehle

Haftbefehle werden bewusst einfach gehalten.

Gespeichert werden:

- eindeutige Nummer
- Bürger
- Grund
- optionaler Hinweis
- optional eine Vorgangsnummer
- Status `Aktiv / Erledigt / Aufgehoben`

## Berechtigungen

Police-Zugriff bleibt organisationsgebunden.

Der normale Polizeidienst erhält in V1 Zugriff auf:

- Bürgersuche
- Vorgänge ansehen, anlegen und bearbeiten
- Fahndungen
- Fahrzeuge
- Bußgelder
- Haftbefehle

Die Leitung erhält über die Besitzerrolle alle aktiven Police-Rechte.

Stadtverwaltung oder technische Rollen erhalten dadurch keinen automatischen Police-Zugriff.

## Datenschutz und technische Umsetzung

Die Police-Tabellen sind nicht direkt aus dem Browser beschreibbar. Der Zugriff erfolgt über geprüfte Funktionen mit den jeweiligen Police-Berechtigungen.

Anonyme Aufrufe sind gesperrt.

## Nicht Teil der vereinfachten V1

Bewusst nicht umgesetzt werden unter anderem:

- Chain of Custody
- komplexe Asservatenverwaltung
- mehrere Ermittlungsstufen
- Observationen als eigene Vorgangsart
- komplizierte Fallbeziehungen
- interne Ermittlungsaufträge
- umfangreiche Vernehmungsverwaltung
- Tatbestandskataloge
- unnötig tiefe Freigabe- und Archivierungsabläufe

Solche Funktionen werden nur ergänzt, wenn sie später tatsächlich gebraucht werden.
