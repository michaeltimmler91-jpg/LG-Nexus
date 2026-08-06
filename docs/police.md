# LG Nexus – Police

Dieses Dokument beschreibt die festgelegten Regeln für das Police-Modul.

## Personensuche und Fälle

PD besitzt eine interne Personensuche nach Name und Nexus-ID.

PD erhält ein eigenes Fall-/Akten-System.

Jeder Fall:

- erhält automatisch eine eindeutige Fallnummer
- besitzt Titel und Kurzbeschreibung
- verwendet die Status `Neu / Ermittlung / Prüfung / Abgeschlossen / Archiviert`
- kann Beteiligte mit Rollen wie `Beschuldigter`, `Opfer`, `Zeuge`, `Sonstige` führen

## Sichtbarkeit und geschützte Fälle

PD-Fälle können je nach Rolle/Rang unterschiedlich sichtbar sein.

Zusätzlich gibt es besonders geschützte beziehungsweise versiegelte Fälle.

Das Versiegeln oder Freigeben eines Falls erfolgt über ein eigenes Sonderrecht.

Die Identität einzelner Opfer oder Zeugen kann innerhalb eines Falls zusätzlich geschützt werden.

## Fallnotizen und Historie

Bearbeitungen von Fallnotizen besitzen einen Versions-/Änderungsverlauf.

Beim Abschließen eines Falls ist ein Abschlussgrund Pflicht.

Ein abgeschlossener PD-Fall kann nicht wieder geöffnet werden.

Abgeschlossene PD-Fälle werden **12 Monate** gespeichert.

Ein PDF-Export von PD-Fällen ist nicht vorgesehen.

## Beweismittel

PD besitzt ein eigenes Beweismittel-Modul innerhalb von Fällen.

Jedes Beweismittel:

- erhält automatisch eine eindeutige Beweisnummer
- besitzt eine protokollierte Übergabe-/Besitzkette (Chain of Custody)

Anhänge erfolgen über **externe Links**, nicht über direkte Datei-Uploads.

## Aussagen

Fälle unterstützen strukturierte Zeugen-/Aussagen-Einträge.

## BOLO / Fahndung

PD kann BOLO-/Fahndungseinträge erstellen für:

- Personen
- Fahrzeuge

Fahndungseinträge können ein optionales Ablaufdatum besitzen.

Eine Person kann zusätzlich einen aktiven `Gesucht`-Status erhalten.

- Ein Grund ist beim Setzen Pflicht.
- Eine Person kann gleichzeitig mehrere aktive Fahndungs-/Gesucht-Gründe besitzen.

## Fahrzeuge

PD besitzt eine interne Fahrzeugsuche nach Kennzeichen.

Fahrzeuge können interne PD-Warnhinweise beziehungsweise Flags erhalten.

## Verwarnungen und Bußgelder

PD kann Verwarnungen/Bußgelder direkt im Nexus erfassen.

Dafür gibt es einen zentralen pflegbaren Bußgeld-/Tatbestandskatalog.

## Justice-Anbindung

PD kann Durchsuchungs- und Haftbefehle über Nexus bei Justice beantragen.

Der Status eines solchen Justice-Antrags ist direkt im zugehörigen PD-Fall sichtbar.

## Verbindung zu gemeinsamen Vorfällen

Ein PD-Fall kann mit einem gemeinsamen fraktionsübergreifenden Vorfall verknüpft werden.

Medical und Fire & Rescue sehen dort:

- die gemeinsamen Basisdaten
- zusätzlich ausdrücklich ausgewählte PD-Einträge

PD-interne Inhalte werden nicht automatisch vollständig freigegeben.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- interne Personensuche
- Fälle mit Fallnummer, Status, Titel und Kurzbeschreibung
- Fallbeteiligte mit Rollen
- rollen-/rangbasierte Fallsichtbarkeit
- versiegelte Fälle + Sonderrecht
- geschützte Opfer-/Zeugenidentität
- Versionshistorie für Notizen
- Beweismittel mit Beweisnummer und Chain of Custody
- externe Link-Anhänge
- strukturierte Aussagen
- Personen- und Fahrzeug-BOLOs
- Gesucht-Status mit mehreren Gründen
- Kennzeichensuche und Fahrzeugflags
- Bußgelder + Tatbestandskatalog
- Justice-Anträge + Statusverknüpfung
- Verbindung zu gemeinsamen Vorfällen mit selektiver Freigabe
- 12-Monats-Aufbewahrung abgeschlossener Fälle

PD-Daten müssen serverseitig nach Rollen, Fallfreigaben und Sonderrechten geschützt werden.