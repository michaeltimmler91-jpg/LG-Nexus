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

Verfahren können abhängig von der Justice-Rolle unterschiedlich sichtbar sein.

Zusätzlich gibt es besonders geschützte beziehungsweise versiegelte Verfahren. Versiegeln und Freigeben erfolgt über ein eigenes Sonderrecht.

## Zuständigkeiten

Einem Verfahren kann zugewiesen werden:

- ein zuständiger Richter
- ein oder mehrere Staatsanwälte
- Verteidiger beziehungsweise Anwälte als offizielle Beteiligte

## Sichtbarkeit für betroffene Bürger

Ein betroffener Bürger darf in Nexus eine Zusammenfassung seines eigenen Justice-Verfahrens sehen.

Bei Dokumenten gilt:

- sichtbar sind nur Dokumente, die ausdrücklich für Beteiligte veröffentlicht wurden
- interne Justice-Dokumente bleiben verborgen

## Tatbestände und PD-Verknüpfung

Anklagepunkte beziehungsweise Tatbestände werden strukturiert im Verfahren erfasst.

Ein Justice-Verfahren kann direkt mit einem oder mehreren PD-Fällen verknüpft werden.

Justice darf ausgewählte PD-Beweismittel in ein Verfahren übernehmen beziehungsweise verknüpfen.

Dabei gilt:

- die PD-Chain-of-Custody bleibt für Justice lesbar
- Justice darf verknüpfte PD-Beweismittel nicht verändern
- Justice arbeitet nur lesend beziehungsweise verknüpfend mit den PD-Beweisdaten

## Durchsuchungs-, Haft- und weitere Befehle

Justice bearbeitet PD-Anträge auf Befehle direkt im Nexus.

Die Befehlsarten sind **frei definierbar** und nicht auf Durchsuchungs- oder Haftbefehle begrenzt.

Für Anträge gilt:

- Justice kann annehmen oder ablehnen
- bei Ablehnung ist ein Grund Pflicht
- PD sieht Bearbeitungsstatus und Entscheidung direkt im zugehörigen Fall

Genehmigte Befehle:

- erhalten automatisch eine eindeutige Dokument-/Befehlsnummer
- können ein optionales Ablaufdatum besitzen
- können später durch Justice widerrufen werden
- beim Widerruf ist ein Grund Pflicht

PD wird automatisch bei Statusänderung, Genehmigung, Ablehnung oder Widerruf benachrichtigt.

## Medizinische Berichtsanfragen

Justice kann formelle medizinische Berichtsanfragen an Medical senden.

- Medical sieht den konkreten Anfragegrund.
- Lehnt Medical eine Anfrage ab, ist ein Ablehnungsgrund Pflicht.
- Eine ausdrücklich richterlich angeordnete medizinische Freigabe kann die normale Patientenzustimmung ersetzen.

Diese richterliche Ausnahme muss technisch als eigener, nachvollziehbarer Freigabegrund behandelt werden und darf kein pauschaler Justice-Zugriff auf Krankenakten sein.

## Verhandlungstermine

Verhandlungstermine werden direkt mit dem Nexus-Kalender verknüpft.

- Beteiligte werden bei neuen oder geänderten Terminen automatisch benachrichtigt.
- Ein Verhandlungstermin kann als verpflichtend markiert werden.

## Verhandlungsprotokolle

Justice besitzt strukturierte Verhandlungsprotokolle innerhalb des Verfahrens.

Protokolle besitzen einen Versions-/Änderungsverlauf.

## Urteile und Entscheidungen

Justice kann Urteile beziehungsweise Entscheidungen als eigene Nexus-Dokumente erzeugen.

Strukturiert erfasst werden können:

- Strafen und Maßnahmen
- Geldstrafen als offener RP-Betrag
- Haftdauer beziehungsweise Haftmaß
- Führerschein-/Lizenzentzug und weitere Lizenzmaßnahmen

Lizenzmaßnahmen können mit dem zentralen Lizenz-/Genehmigungssystem der Stadtverwaltung verknüpft werden.

## Berufung / Einspruch

Es gibt einen formellen Berufungs-/Einspruchsprozess.

- Für Berufung beziehungsweise Einspruch kann eine Frist hinterlegt werden.
- Ein bereits abgeschlossenes Verfahren darf durch einen gültigen Berufungs-/Einspruchsprozess wieder in Bearbeitung gehen.

## Aufbewahrung und Export

Abgeschlossene Justice-Verfahren werden **dauerhaft** gespeichert.

Ein PDF-Export von Justice-Verfahren ist nicht vorgesehen.

## Zugriff der Stadtverwaltung

Die Stadtverwaltung darf interne Justice-Verfahren **immer einsehen**.

Dieser Zugriff ist ausdrücklich eine Sonderregel des Justice-Moduls und darf nicht automatisch auf Medical-, Police- oder andere geschützte Fraktionsdaten übertragen werden.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- Justice-Verfahren mit Verfahrensnummer, Typ und Status
- rollenabhängige Sichtbarkeit und versiegelte Verfahren
- Richter-/Staatsanwalt-/Anwaltszuweisungen
- Bürgeransicht mit explizit veröffentlichten Dokumenten
- strukturierte Tatbestände
- PD-Fall- und Beweismittelverknüpfungen
- lesbare Chain-of-Custody
- frei definierbare Befehlsarten und PD-Antragsworkflow
- Befehlsnummern, Ablauf und Widerruf
- medizinische Berichtsanfragen mit richterlicher Ausnahme
- Kalenderverknüpfte Verhandlungstermine
- versionierte Verhandlungsprotokolle
- Urteilsdokumente und strukturierte Maßnahmen
- Berufungs-/Einspruchsworkflow
- dauerhafte Aufbewahrung

Justice-Daten müssen serverseitig strikt nach Verfahren, Rolle, Versiegelung und Beteiligten-Sichtbarkeit abgesichert werden.