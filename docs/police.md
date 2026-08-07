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
- kann einen federführenden Ermittler besitzen
- kann mehrere weitere Ermittler zugeordnet bekommen

Neue Fälle dürfen nur Mitglieder mit einem passenden Rollenrecht anlegen. Für die Bearbeitung existiert das eigene Rollenrecht `Fälle bearbeiten`.

PD-Fälle besitzen außerdem:

- interne Ermittlungs-Zeitleiste
- interne Kommentare
- @-Erwähnungen in Kommentaren
- Nexus-Benachrichtigung bei @-Erwähnung

## Sichtbarkeit für Fallbeteiligte

Bürger beziehungsweise Fallbeteiligte sehen nicht automatisch ihre vollständigen PD-Fälle.

PD kann jedoch eine ausdrücklich veröffentlichte Zusammenfassung eines Falls für berechtigte betroffene Bürger sichtbar machen.

## Sichtbarkeit und geschützte Fälle

PD-Fälle können je nach Rolle/Rang unterschiedlich sichtbar sein.

Zusätzlich gibt es besonders geschützte beziehungsweise versiegelte Fälle.

Das Versiegeln oder Freigeben eines Falls erfolgt über ein eigenes Sonderrecht.

Beim Versiegeln gilt:

- ein Grund ist Pflicht
- es wird gespeichert, wer den Fall versiegelt hat
- für nicht berechtigte Nutzer verschwindet der Fall vollständig aus normalen Suchergebnissen; es wird kein Platzhalter `gesperrt` angezeigt

Die Identität einzelner Opfer oder Zeugen kann innerhalb eines Falls zusätzlich geschützt werden.

## Fallnotizen und Historie

Bearbeitungen von Fallnotizen besitzen einen Versions-/Änderungsverlauf.

Beim Abschließen eines Falls ist ein Abschlussgrund Pflicht.

Ein abgeschlossener PD-Fall kann nicht wieder geöffnet werden.

Abgeschlossene PD-Fälle werden **12 Monate** gespeichert.

Wenn ein Nexus-Account später `disabled` wird, bleiben Name und Nexus-ID in historischen PD-Fällen erhalten.

Ein PDF-Export von PD-Fällen ist nicht vorgesehen.

## Beweismittel

PD besitzt ein eigenes Beweismittel-Modul innerhalb von Fällen.

Jedes Beweismittel:

- erhält automatisch eine eindeutige Beweisnummer
- besitzt einen strukturierten Typ, z. B. Foto / Video / Gegenstand / Dokument / Sonstiges
- kann einen Lager-/Aufbewahrungsort besitzen
- besitzt eine protokollierte Übergabe-/Besitzkette (Chain of Custody)

Jede Übergabe in der Chain of Custody enthält einen Grund beziehungsweise Zweck.

Anhänge erfolgen über **externe Links**, nicht über direkte Datei-Uploads.

Beweismitteldaten können korrigiert werden; Korrekturen erzeugen einen Versionsverlauf.

Auch externe Beweislinks dürfen nachträglich geändert werden, jedoch nur mit nachvollziehbarem Versionsverlauf.

Ein Beweismittel darf mit einem besonderen Sonderrecht endgültig gelöscht werden.

## Aussagen

Fälle unterstützen strukturierte Zeugen-/Aussagen-Einträge.

## BOLO / Fahndung

PD kann BOLO-/Fahndungseinträge erstellen für:

- Personen
- Fahrzeuge

BOLOs besitzen die Priorität:

- Niedrig
- Normal
- Hoch
- Dringend

Fahndungseinträge können ein optionales Ablaufdatum besitzen.

- Abgelaufene BOLOs werden automatisch archiviert.
- Ein BOLO kann vor Ablauf manuell beendet werden.
- Beim manuellen Beenden ist ein Grund Pflicht.

Eine Person kann zusätzlich einen aktiven `Gesucht`-Status erhalten.

- Ein Grund ist beim Setzen Pflicht.
- Eine Person kann gleichzeitig mehrere aktive Fahndungs-/Gesucht-Gründe besitzen.
- Ein aktiver Gesucht-Status kann auf einen oder mehrere konkrete PD-Fälle verlinken.
- Ein Bürger sieht den eigenen Gesucht-/BOLO-Status im normalen Nexus nur dann, wenn PD ihn ausdrücklich freigibt.

## Fahrzeuge

PD besitzt eine interne Fahrzeugsuche nach Kennzeichen.

Die Suche kann zusätzlich anzeigen:

- Fahrzeughalter
- Fahrzeugmodell
- Fahrzeugfarbe

Fahrzeuge können interne PD-Warnhinweise beziehungsweise Flags erhalten.

- Fahrzeug-Flags können ein optionales Ablaufdatum besitzen.
- Setzen und Entfernen erfolgt über ein eigenes Rollenrecht.

## Verwarnungen und Bußgelder

PD kann Verwarnungen/Bußgelder direkt im Nexus erfassen.

Jedes Bußgeld:

- erhält automatisch eine eindeutige Vorgangsnummer
- kann mit einem PD-Fall verknüpft werden
- besitzt einen der Status `Offen`, `Bezahlt`, `Erlassen`, `Storniert`

Bürger dürfen ihre eigenen offenen und erledigten Bußgelder in Nexus sehen.

Ein Bürger kann über Nexus Einspruch gegen ein Bußgeld einlegen. Aus einem solchen Einspruch kann automatisch ein passender Justice-Vorgang beziehungsweise Justice-Antrag entstehen.

## Tatbestandskatalog

Es gibt einen zentralen pflegbaren Bußgeld-/Tatbestandskatalog.

Verwaltung über das Rollenrecht `Tatbestandskatalog verwalten`.

Ein Tatbestand kann enthalten:

- Standardbetrag
- optionale Haftwerte
- optionale weitere Maßnahmenwerte

## Justice-Anbindung

PD kann Durchsuchungs-, Haft- und weitere von Justice definierte Befehle über Nexus beantragen.

Der Status eines solchen Justice-Antrags ist direkt im zugehörigen PD-Fall sichtbar.

Bei einem Justice-Antrag können automatisch verknüpft werden:

- der zugehörige PD-Fall
- relevante Beweismittel

## Verbindung zu gemeinsamen Vorfällen

Ein PD-Fall kann mit einem gemeinsamen fraktionsübergreifenden Vorfall verknüpft werden.

Medical und Fire & Rescue sehen dort:

- die gemeinsamen Basisdaten
- zusätzlich ausdrücklich ausgewählte PD-Einträge

PD-interne Inhalte werden nicht automatisch vollständig freigegeben.

## Stadtverwaltung und externe Zugriffe

Die Stadtverwaltung darf interne PD-Fälle **nicht** einsehen.

Es gibt keinen pauschalen Stadtverwaltungs-Override für PD-Fälle.

Zugriffe externer Stellen auf PD-Fälle werden derzeit nicht zusätzlich in einem eigenen Zugriffsprotokoll protokolliert.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- interne Personensuche
- Fälle mit Fallnummer, Status, Titel und Kurzbeschreibung
- Rollenrechte für Fallanlage und `Fälle bearbeiten`
- federführender Ermittler + weitere Ermittler
- interne Ermittlungs-Timeline, Kommentare und @-Erwähnungen
- Fallbeteiligte mit Rollen
- explizit veröffentlichbare Bürger-Zusammenfassung
- rollen-/rangbasierte Fallsichtbarkeit
- versiegelte Fälle + Sonderrecht, Pflichtgrund und vollständiges Search-Hiding
- geschützte Opfer-/Zeugenidentität
- Versionshistorie für Notizen
- Beweismittel mit Typ, Lagerort, Beweisnummer und Chain of Custody
- Übergabegrund in der Chain of Custody
- versionierbare externe Beweislinks
- Sonderrecht für endgültige Beweismittel-Löschung
- strukturierte Aussagen
- Personen- und Fahrzeug-BOLOs mit Priorität, Ablauf und Archivierung
- Gesucht-Status mit mehreren Gründen und Fallverknüpfungen
- Kennzeichensuche inklusive Halter/Modell/Farbe
- Fahrzeugflags mit Ablaufdatum und Rollenrecht
- Bußgelder mit Vorgangsnummer, Status und Bürgeransicht
- Bußgeld-Einspruch mit optionaler automatischer Justice-Erstellung
- Tatbestandskatalog mit Rollenrecht, Standardbetrag und optionalen Maßnahmenwerten
- Justice-Anträge + automatische Fall-/Beweisverknüpfung
- Verbindung zu gemeinsamen Vorfällen mit selektiver Freigabe
- 12-Monats-Aufbewahrung abgeschlossener Fälle

PD-Daten müssen serverseitig nach Rollen, Fallfreigaben und Sonderrechten geschützt werden.