# LG Nexus – Stadtverwaltung

Dieses Dokument beschreibt die aktuell festgelegten Regeln für das interne Stadtverwaltungs-Modul.

## Bürgerverwaltung

Die Stadtverwaltung besitzt ein eigenes internes Bürgerverwaltungs-Modul.

Die Suche erfolgt mindestens nach:

- Name
- Nexus-ID

Dort ist außerdem der technische Nexus-Accountstatus sichtbar:

- `pending`
- `active`
- `suspended`
- `rejected`
- `disabled`

Die Stadtverwaltung kann interne Verwaltungsnotizen zu Bürgern hinterlegen. Diese Notizen sind für den betroffenen Bürger **nicht sichtbar**.

Die Historie von Account-Freigaben, Sperren und Statusänderungen wird **dauerhaft** aufbewahrt.

## Verwaltungs-Dashboard

Die Stadtverwaltung erhält ein internes Dashboard für offene Account-Freigaben und weitere Verwaltungsaufgaben.

## Bürgeranträge / Anliegen

Es gibt einen zentralen Bereich für Bürgeranträge und Anliegen an die Stadtverwaltung.

Aktive Bürger dürfen solche Anträge direkt über Nexus einreichen.

Die Stadtverwaltung darf eigene Kategorien für Bürgeranträge anlegen.

Status:

- Neu
- In Bearbeitung
- Rückfrage
- Erledigt
- Abgelehnt

Ein Antrag kann mehreren Verwaltungsmitarbeitern gleichzeitig zugewiesen werden.

Interne Kommentare sind möglich und bleiben für den antragstellenden Bürger verborgen.

Anhänge erfolgen ausschließlich über **externe Links**. Auch der antragstellende Bürger darf externe Links hinzufügen.

Aus einem Antrag heraus kann die Stadtverwaltung direkt eine offizielle Antwort an den Bürger senden.

Eine interne Bearbeitungsfrist für Bürgeranträge ist derzeit nicht vorgesehen. Entsprechend entfällt auch eine automatische Fristerinnerung.

Erledigte und abgelehnte Bürgeranträge werden **6 Monate** gespeichert.

## Terminverwaltung

Eine allgemeine Selbstbuchung freier Termine durch Bürger über Nexus ist derzeit nicht vorgesehen.

Unterschiedliche Verwaltungsbereiche dürfen dennoch eigene interne Termin-Kalender besitzen.

Wenn ein Verwaltungstermin auf anderem Weg vereinbart beziehungsweise angelegt wurde:

- kann er automatisch bestätigt und im Bürgerkalender eingetragen werden
- darf die Stadtverwaltung ihn verschieben und den Bürger automatisch benachrichtigen
- beim Absagen ist ein Grund Pflicht

## Offizielle Bescheinigungen und Dokumente

Die Stadtverwaltung kann offizielle Nexus-Dokumente und Bescheinigungen für Bürger erzeugen.

Dafür können Dokumentvorlagen verwendet werden.

Jedes offizielle Verwaltungsdokument:

- erhält automatisch eine eindeutige Dokumentnummer
- kann ein optionales Ablaufdatum besitzen
- kann über eine öffentliche Prüfnummer beziehungsweise QR-Verifikation auf Echtheit geprüft werden

Die öffentliche Verifikation darf nur die zur Echtheitsprüfung nötigen Daten offenlegen und keine unnötigen internen Verwaltungsdaten anzeigen.

## Lizenzen und Genehmigungen

Die Stadtverwaltung verwaltet Lizenzen und Genehmigungen zentral im Nexus.

- Die Stadtverwaltung darf eigene Lizenz-/Genehmigungsarten anlegen.
- Eine Lizenz/Genehmigung kann erteilt, pausiert und entzogen werden.
- Beim Entzug ist ein Grund Pflicht.
- Bürger sehen ihre eigenen aktiven und abgelaufenen Lizenzen/Genehmigungen.

### Zugriff durch PD

PD darf nur solche Lizenzarten direkt einsehen, die ausdrücklich für die Polizeiarbeit freigegeben wurden.

### Zugriff durch normale Unternehmen

Normale Unternehmen erhalten keinen pauschalen Zugriff.

Ein Unternehmen darf eine Bürgerlizenz nur sehen, wenn der Bürger diese gezielt freigibt.

## Gebühren / Zahlungsstatus

Die Stadtverwaltung kann Gebühren beziehungsweise Zahlungsstatus zu Anträgen oder Dokumenten als **reinen RP-Status** erfassen.

LG Nexus bleibt dabei bewusst ohne echte Zahlungsanbieter und ohne echtes Geld.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- internes Bürgerverwaltungs-Modul
- Accountstatus- und dauerhafte Statushistorie
- interne Bürgernotizen
- Verwaltungs-Dashboard
- Bürgeranträge mit Kategorien, Status, Mehrfachzuweisung und internen Kommentaren
- externe Link-Anhänge
- 6-Monats-Aufbewahrung abgeschlossener Bürgeranträge
- interne Bereichskalender der Stadtverwaltung
- offizielle Dokumente mit Vorlagen und Dokumentnummern
- öffentliche Prüfnummer/QR-Verifikation
- zentrale Lizenz-/Genehmigungsarten und Status
- explizite PD-Freigabe je Lizenzart
- gezielte Bürgerfreigabe an Unternehmen
- reine RP-Gebühren-/Zahlungsstatus

Interne Verwaltungsnotizen und sensible Verwaltungsdaten müssen serverseitig strikt vor normalen Bürgern und unberechtigten Organisationen geschützt werden.