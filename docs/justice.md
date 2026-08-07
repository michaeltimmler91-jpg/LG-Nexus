# LG Nexus – Justice

Dieses Dokument beschreibt die aktuell festgelegten Regeln für das Justice-Modul.

## Personensuche und Verfahren

Justice besitzt eine interne Personensuche nach Name und Nexus-ID.

Justice erhält ein eigenes Fall-/Verfahrenssystem. Jedes Verfahren:

- erhält automatisch eine eindeutige Verfahrensnummer
- besitzt Titel und Kurzbeschreibung
- unterstützt die Verfahrensarten `Straf`, `Zivil`, `Verwaltung` und `Sonstige`
- verwendet die Status `Neu`, `Prüfung`, `Verhandlung`, `Entscheidung`, `Abgeschlossen`, `Archiviert`
- kann Beteiligte mit Rollen wie `Beschuldigter`, `Kläger`, `Beklagter`, `Zeuge`, `Anwalt` und `Sonstige` führen
- kann dieselbe Person auch dann verknüpfen, wenn diese bereits in anderen Justice-Verfahren beteiligt ist
- besitzt keine zusätzlichen internen Kategorien/Tags

Neue Verfahren dürfen von berechtigten Justice-Mitgliedern angelegt werden. Dafür wird **kein separates Rollenrecht `Verfahren anlegen`** eingeführt; die Berechtigung wird über das allgemeine passende Justice-Fall-/Verfahrensrecht abgebildet.

Verfahren können abhängig von der Justice-Rolle unterschiedlich sichtbar sein.

Zusätzlich gibt es besonders geschützte beziehungsweise versiegelte Verfahren. Versiegeln und Freigeben erfolgt über ein eigenes Sonderrecht.

## Zuständigkeiten

Einem Verfahren kann zugewiesen werden:

- ein zuständiger Richter
- ein oder mehrere Staatsanwälte
- Verteidiger beziehungsweise Anwälte als offizielle Beteiligte

## Interne Fristen und Zusammenarbeit

Innerhalb eines Justice-Verfahrens können interne Fristen/Deadlines angelegt werden.

- Zuständige Justice-Mitarbeiter werden vor solchen Fristen automatisch erinnert.
- Berechtigte Justice-Mitarbeiter können interne Kommentare hinterlegen.
- In internen Kommentaren sind @-Erwähnungen möglich.
- Eine @-Erwähnung löst eine Nexus-Benachrichtigung aus.

Betroffene Bürger sehen interne Justice-Kommentare **nur dann**, wenn ein Kommentar ausdrücklich für sie freigegeben wurde. Nicht freigegebene interne Kommentare bleiben verborgen.

## Sichtbarkeit für betroffene Bürger

Ein betroffener Bürger darf in Nexus eine Zusammenfassung seines eigenen Justice-Verfahrens sehen.

Bei Dokumenten gilt:

- sichtbar sind nur Dokumente, die ausdrücklich für Beteiligte veröffentlicht wurden
- interne Justice-Dokumente bleiben verborgen

## Dokumente und Unterlagen

Jedes Justice-Verfahren besitzt eine eigene Dokument-/Ordnerstruktur.

Ein zusätzlicher rollenbasierter Schutz einzelner Dokumente innerhalb eines bereits geschützten Verfahrens ist derzeit nicht vorgesehen; maßgeblich ist der jeweilige Verfahrenszugriff.

Justice-Dokumentvorlagen werden über das Rollenrecht `Vorlagen verwalten` verwaltet.

Justice-Verfahrensdokumente dürfen externe Links als Anlagen enthalten. Direkte Datei-Uploads sind nicht vorgesehen.

Beteiligte Bürger dürfen über Nexus Unterlagen beziehungsweise Beweislinks zu ihrem Verfahren einreichen. Diese Einreichungen müssen zunächst durch Justice geprüft und freigegeben werden, bevor sie als offizielle Verfahrensdokumente gelten.

## Tatbestände und PD-Verknüpfung

Anklagepunkte beziehungsweise Tatbestände werden strukturiert im Verfahren erfasst.

Ein Justice-Verfahren kann direkt mit einem oder mehreren PD-Fällen verknüpft werden.

Justice darf ausgewählte PD-Beweismittel in ein Verfahren übernehmen beziehungsweise verknüpfen.

Dabei gilt:

- die PD-Chain-of-Custody bleibt für Justice lesbar
- Justice darf verknüpfte PD-Beweismittel nicht verändern
- Justice arbeitet nur lesend beziehungsweise verknüpfend mit den PD-Beweisdaten

Bei PD-Anträgen können der zugehörige Fall und relevante Beweismittel automatisch verknüpft werden.

## Bußgeld-Einsprüche aus Police

Bürger können im Police-Modul gegen ein eigenes Bußgeld Einspruch einlegen.

Aus einem solchen Einspruch kann automatisch ein passender Justice-Vorgang beziehungsweise Justice-Antrag erstellt werden. Die ursprüngliche Bußgeld-Vorgangsnummer und gegebenenfalls der verknüpfte PD-Fall sollen dabei als Referenz erhalten bleiben.

## Durchsuchungs-, Haft- und weitere Befehle

Justice bearbeitet PD-Anträge auf Befehle direkt im Nexus.

Die Befehlsarten sind **frei definierbar** und nicht auf Durchsuchungs- oder Haftbefehle begrenzt.

Neue Befehlsarten werden über das Rollenrecht `Befehlsarten verwalten` angelegt. Jede Befehlsart kann eine eigene Vorlage und eigene Pflichtfelder besitzen.

Für Anträge gilt:

- Justice kann annehmen oder ablehnen
- bei Ablehnung ist ein Grund Pflicht
- PD sieht Bearbeitungsstatus und Entscheidung direkt im zugehörigen Fall
- ein PD-Befehlsantrag kann interne Justice-Kommentare besitzen
- PD sieht bei einer Entscheidung nur `Justice` als entscheidende Stelle, nicht den konkreten Richter beziehungsweise Mitarbeiter

Genehmigte Befehle:

- erhalten automatisch eine eindeutige Dokument-/Befehlsnummer
- können ein optionales Ablaufdatum besitzen
- können später durch Justice widerrufen werden
- beim Widerruf ist ein Grund Pflicht

PD wird automatisch bei Statusänderung, Genehmigung, Ablehnung oder Widerruf benachrichtigt.

Widerrufene beziehungsweise abgelaufene Befehle bleiben nicht dauerhaft als eigener Langzeitbestand erhalten; nach Ende ihrer Relevanz dürfen sie nach der dafür vorgesehenen Aufbewahrungslogik entfernt werden.

## Medizinische Berichtsanfragen

Justice kann formelle medizinische Berichtsanfragen an Medical senden.

- Jede medizinische Justice-Anfrage muss mit einem konkreten Justice-Verfahren verknüpft sein.
- Medical sieht den konkreten Anfragegrund.
- Lehnt Medical eine Anfrage ab, ist ein Ablehnungsgrund Pflicht.
- Eine ausdrücklich richterlich angeordnete medizinische Freigabe kann die normale Patientenzustimmung ersetzen.
- Der betroffene Bürger sieht nicht automatisch, dass Justice eine medizinische Anfrage gestellt hat.

Diese richterliche Ausnahme muss technisch als eigener, nachvollziehbarer Freigabegrund behandelt werden und darf kein pauschaler Justice-Zugriff auf Krankenakten sein.

## Verhandlungstermine

Verhandlungstermine werden direkt mit dem Nexus-Kalender verknüpft.

- Beteiligte werden bei neuen oder geänderten Terminen automatisch benachrichtigt.
- Ein Verhandlungstermin kann als verpflichtend markiert werden.

## Verhandlungsprotokolle

Justice besitzt strukturierte Verhandlungsprotokolle innerhalb des Verfahrens.

Protokolle besitzen während der Bearbeitung einen Versions-/Änderungsverlauf.

Ein Verhandlungsprotokoll kann offiziell finalisiert werden. Nach der Finalisierung ist es **nicht mehr änderbar**.

## Urteile und Entscheidungen

Justice kann Urteile beziehungsweise Entscheidungen als eigene Nexus-Dokumente erzeugen.

Strukturiert erfasst werden können:

- Strafen und Maßnahmen
- Geldstrafen als offener RP-Betrag
- Haftdauer beziehungsweise Haftmaß
- Führerschein-/Lizenzentzug und weitere Lizenzmaßnahmen

Lizenzmaßnahmen können mit dem zentralen Lizenz-/Genehmigungssystem der Stadtverwaltung verknüpft werden.

Ein Urteil wird für betroffene Verfahrensbeteiligte **nicht automatisch** sichtbar. Justice veröffentlicht es manuell für die Beteiligten.

Abgeschlossene Urteile können zusätzlich optional öffentlich im City-Hub-/Justizbereich veröffentlicht werden. Eine eigene gesonderte Suche oder Filterfunktion nur für öffentliche Urteile ist derzeit nicht vorgesehen.

## Berufung / Einspruch

Es gibt einen formellen Berufungs-/Einspruchsprozess.

- Einreichen dürfen der betroffene Bürger oder ein mit dem Verfahren verknüpfter Anwalt.
- Ein Grund ist Pflicht.
- Externe Links als Anlagen sind erlaubt.
- Für Berufung beziehungsweise Einspruch kann eine Frist hinterlegt werden.
- Ein bereits abgeschlossenes Verfahren darf durch einen gültigen Berufungs-/Einspruchsprozess wieder in Bearbeitung gehen.

## Aufbewahrung und Export

Abgeschlossene Justice-Verfahren werden **dauerhaft** gespeichert.

Ein PDF-Export von Justice-Verfahren ist nicht vorgesehen.

Wenn ein Nexus-Account später `disabled` wird, bleiben historischer Name und Nexus-ID in alten Justice-Verfahren erhalten.

## Zugriff der Stadtverwaltung

Die Stadtverwaltung darf interne Justice-Verfahren **immer einsehen**.

Dieser Zugriff ist **nur lesend**. Die Stadtverwaltung darf Justice-Verfahren nicht bearbeiten.

Zugriffe der Stadtverwaltung auf Justice-Verfahren werden derzeit nicht zusätzlich als eigener Zugriffslog protokolliert.

Diese Sonderregel darf nicht automatisch auf Medical-, Police- oder andere geschützte Fraktionsdaten übertragen werden.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- Justice-Verfahren mit Verfahrensnummer, Typ und Status
- allgemeines Justice-Fall-/Verfahrensrecht zum Anlegen
- rollenabhängige Sichtbarkeit und versiegelte Verfahren
- Richter-/Staatsanwalt-/Anwaltszuweisungen
- interne Fristen, Erinnerungen, Kommentare und @-Erwähnungen
- Bürgeransicht mit explizit veröffentlichten Kommentaren/Dokumenten
- Verfahrensordner und Dokumentvorlagen
- Bürger-Einreichungen mit Freigabestatus
- strukturierte Tatbestände
- PD-Fall- und Beweismittelverknüpfungen
- Bußgeld-Einsprüche aus PD mit automatischer Justice-Erstellung
- lesbare Chain-of-Custody
- frei definierbare Befehlsarten, Pflichtfelder und PD-Antragsworkflow
- Befehlsnummern, Ablauf und Widerruf
- medizinische Berichtsanfragen mit zwingender Verfahrensverknüpfung und richterlicher Ausnahme
- kalenderverknüpfte Verhandlungstermine
- finalisierbare Verhandlungsprotokolle
- Urteilsdokumente und strukturierte Maßnahmen
- optionale öffentliche Urteilsveröffentlichung
- Berufungs-/Einspruchsworkflow
- dauerhafte Verfahrensaufbewahrung
- schreibgeschützter Stadtverwaltungszugriff

Justice-Daten müssen serverseitig strikt nach Verfahren, Rolle, Versiegelung und Beteiligten-Sichtbarkeit abgesichert werden.