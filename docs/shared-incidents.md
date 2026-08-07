# LG Nexus – Gemeinsame Einsätze / Vorfälle

Dieses Dokument beschreibt die festgelegten Regeln für fraktionsübergreifende Vorfälle zwischen Police Department, Medical und Fire & Rescue.

## Grundprinzip

LG Nexus erhält ein gemeinsames Einsatz-/Vorfall-System für PD, Medical und Fire & Rescue.

Ein gemeinsamer Vorfall kann von Mitgliedern dieser Organisationen mit passendem Rollenrecht angelegt werden und erhält automatisch eine eindeutige Vorgangsnummer.

Beim Anlegen werden PD, Medical und Fire & Rescue grundsätzlich automatisch als beteiligte Fraktionen vorgesehen. Eine neu hinzugefügte Fraktion muss ihre Beteiligung bestätigen, bevor sie als aktiv beteiligt gilt.

Die federführende Organisation darf später weitere Fraktionen hinzufügen. Eine bereits beteiligte Fraktion kann durch die federführende Organisation nicht wieder entfernt werden.

Beim Hinzufügen einer Fraktion erhalten deren dafür berechtigte Mitglieder eine Nexus-Benachrichtigung.

## Gemeinsame Basisdaten

Alle beteiligten Fraktionen sehen gemeinsame Basisdaten:

- Ort
- Zeit
- Art des Vorfalls
- Status
- kurze gemeinsame Einsatzbeschreibung
- beteiligte Bürger mit Name + Nexus-ID
- interne Priorität

Prioritäten:

- Niedrig
- Normal
- Hoch
- Dringend

Die gemeinsame Einsatzbeschreibung darf nachträglich bearbeitet werden. Änderungen besitzen einen Versionsverlauf.

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

Ein Autor darf seinen eigenen gemeinsamen Notiz-/Kommentar-Eintrag bearbeiten. Bearbeitete Einträge werden mit `Bearbeitet` gekennzeichnet.

Gemeinsame Notiz-/Kommentar-Einträge dürfen mit passendem Recht gelöscht werden. Nach dem Löschen bleibt kein `gelöscht`-Platzhalter zurück; der Eintrag wird aus der normalen Ansicht vollständig entfernt.

## Gemeinsame Zeitleiste

Die Zeitleiste übernimmt automatisch wichtige Systemereignisse, insbesondere:

- Statuswechsel
- Wechsel der federführenden Organisation

Zusätzlich können berechtigte Nutzer manuell eigene Timeline-Ereignisse anlegen.

## Sensible Fraktionsdaten und Freigaben

Sensible interne Daten einer Fraktion werden **nicht automatisch** für andere Fraktionen sichtbar.

Eine Fraktion kann einzelne interne Einträge gezielt für ausgewählte andere beteiligte Fraktionen freigeben.

- Die freigebende Fraktion wählt die Empfängerfraktionen aus.
- Eine Freigabe kann später wieder entzogen werden.
- Nach Entzug verschwindet der Zugriff der anderen Fraktion sofort.

Zusätzlich können einzelne interne Organisationsdokumente gezielt für eine andere beteiligte Fraktion freigegeben werden. Wird eine Dokumentfreigabe entzogen, endet der Zugriff sofort.

Ein allgemeiner Anfrageprozess, mit dem eine andere Fraktion Zugriff auf zusätzlich geschützte Bereiche anfordert, ist nicht vorgesehen.

## Federführung und Status

Jeder gemeinsame Vorfall besitzt eine federführende Organisation.

Status:

- Neu
- In Bearbeitung
- Abgeschlossen
- Archiviert

Nur die federführende Organisation darf:

- den Status ändern
- den gemeinsamen Vorfall abschließen

Beim Abschließen ist ein Abschlussgrund Pflicht.

Ein abgeschlossener gemeinsamer Vorfall kann nicht wieder geöffnet werden.

Die Federführung kann an eine andere beteiligte Organisation übertragen werden. Die neue Organisation muss die Übernahme bestätigen. Nach einem Federführungswechsel werden alle beteiligten Fraktionen benachrichtigt.

## Dubletten und Zusammenführung

Doppelt angelegte Vorfälle können zusammengeführt werden.

Beim Anlegen warnt Nexus anhand von Zeit und Ort vor möglichen bereits vorhandenen Vorfällen.

Vor einer Zusammenführung zeigt Nexus eine Vorschau der zusammenzuführenden Daten.

Zusammenführen darf nur die federführende Organisation des Zielvorfalls.

Die alte Vorgangsnummer wird nicht gelöscht, sondern bleibt als Referenz beziehungsweise Weiterleitung auf den zusammengeführten Zielvorfall erhalten.

## Suche

Gemeinsame Vorfälle können gesucht werden nach:

- Vorgangsnummer
- Ort
- Datum
- beteiligter Person

Archivierte Vorfälle bleiben bis zum Ende ihrer Aufbewahrungsfrist durchsuchbar.

## Kartenverknüpfung

Ein gemeinsamer Vorfall kann:

- mehrere LS-Map-Positionen beziehungsweise Orte besitzen
- mit internen Kartenmarkern beteiligter Organisationen verknüpft werden

Die Kartenpositionen gemeinsamer Vorfälle sind nur intern für die beteiligten Fraktionen sichtbar und nicht öffentlich.

## Bürgeransicht

Bürger sehen gemeinsame Einsätze/Vorfälle nicht automatisch vollständig.

Für einen Vorfall kann jedoch eine ausdrücklich veröffentlichte Zusammenfassung für die normale Bürgeransicht freigegeben werden.

## Anhänge

Der gemeinsame Vorfall besitzt keine eigene Anhangsfunktion.

Falls Informationen über Dokumente geteilt werden sollen, erfolgt dies über die gezielte Freigabe vorhandener interner Organisationsdokumente.

## Protokollierung

Fraktionsübergreifende Zugriffe und Freigaben werden nicht zusätzlich in einem eigenen Zugriffs-/Freigabeprotokoll des Vorfalls protokolliert.

Auch der lesende Stadtverwaltungszugriff auf gemeinsame Vorfälle erhält derzeit keinen separaten Zugriffslog.

## Stadtverwaltung

Die Stadtverwaltung darf gemeinsame Vorfälle grundsätzlich einsehen.

Dieser Zugriff ist **nur lesend**. Die Stadtverwaltung darf gemeinsame Vorfälle nicht bearbeiten.

Dies gilt nur für den gemeinsamen Vorfallbereich. Geschützte Medical-, Police- oder Fire-&-Rescue-Fachdaten bleiben weiterhin nach den Regeln des jeweiligen Moduls geschützt.

## Archivierung und Aufbewahrung

Beim Archivieren wird die normale Bearbeitung eines gemeinsamen Vorfalls gesperrt.

Abgeschlossene beziehungsweise archivierte gemeinsame Vorfälle werden grundsätzlich **6 Monate** gespeichert und können danach automatisch entfernt werden.

Vor der automatischen Löschung darf ein berechtigter Nutzer die Aufbewahrung verlängern.

Bis zum Ende der jeweiligen Aufbewahrungsfrist bleibt ein archivierter Vorfall durchsuchbar.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- gemeinsame Vorfallstabelle mit eindeutiger Vorgangsnummer und Priorität
- automatisch vorgesehene Beteiligung PD/Medical/FD + bestätigungspflichtige Beteiligungen
- weitere Fraktionen mit Hinzufüge-Workflow und Benachrichtigung
- federführende Organisation mit bestätigungspflichtiger Übergabe
- Status + Abschlussgrund, Statusänderung nur durch Federführung
- gemeinsame Basisdaten und versionierte Kurzbeschreibung
- Bürgerbeteiligungen mit Name/Nexus-ID-Referenz
- gemeinsame Timeline / Kommentare mit Autor und Fraktion
- editierbare Kommentare mit `Bearbeitet`-Kennzeichnung und vollständiger Löschung bei Berechtigung
- automatische sowie manuelle Timeline-Ereignisse
- selektive Freigabe einzelner Fraktionseinträge mit Entzug
- gezielte Dokumentfreigabe mit sofortigem Entzug
- mehrere interne Kartenpositionen und Marker-Verknüpfungen
- Bürger-Zusammenfassung als explizite Veröffentlichung
- Dublettenwarnung, Merge-Vorschau, Zusammenführung und alte Vorgangsnummer als Referenz
- Suche nach Vorgangsnummer, Ort, Datum und Person
- Archiv-Schreibsperre
- 6-Monats-Aufbewahrung mit verlängerbarer Frist

Die Trennung zwischen gemeinsamem Vorfallbereich und vertraulichen Fraktionsdaten muss serverseitig strikt durchgesetzt werden.