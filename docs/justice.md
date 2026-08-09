# LG Nexus – Justice

Dieses Dokument beschreibt den verbindlichen Stand des Justice-Moduls bis Frage 3410.

## Personensuche und Verfahren

Justice besitzt eine interne Personensuche nach Name und Nexus-ID.

Jedes Verfahren:

- eindeutige Verfahrensnummer
- Titel/Kurzbeschreibung
- Typ `Straf`, `Zivil`, `Verwaltung`, `Sonstige`
- Status `Neu`, `Prüfung`, `Verhandlung`, `Entscheidung`, `Abgeschlossen`, `Archiviert`
- Beteiligte mit Rollen wie Beschuldigter, Kläger, Beklagter, Zeuge, Anwalt, Sonstige
- rollenabhängige Sichtbarkeit
- optional versiegelt

Anlage erfolgt über das passende allgemeine Justice-Verfahrensrecht, nicht über ein separates `Verfahren anlegen`.

## Verfahrensverknüpfungen

Zusammenhängende Justice-Verfahren können miteinander verknüpft werden.

Dies ist eine Referenzbeziehung; die Verfahren bleiben eigenständige Akten mit eigener Nummer und Berechtigung.

## Zuständigkeiten und Vertretung

Ein Verfahren kann besitzen:

- zuständigen Richter
- einen oder mehrere Staatsanwälte
- Anwälte/Verteidiger

**Vertretungswechsel bei Anwälten** werden unterstützt und nachvollziehbar festgehalten.

**Befangenheits-/Ausschlussvermerke bei Richtern** sind vorgesehen.

## Fristen und Zusammenarbeit

- interne Fristen/Deadlines
- Erinnerungen
- interne Kommentare
- @-Erwähnungen + Benachrichtigung

Bürger sehen interne Kommentare nur bei ausdrücklicher Freigabe.

## Bürgeransicht

Betroffene Bürger sehen eine freigegebene Zusammenfassung ihres Verfahrens sowie ausdrücklich veröffentlichte Dokumente.

Kein automatischer Vollzugriff auf die Justice-Akte.

## Dokumente

Verfahrensbezogene Dokument-/Ordnerstruktur, externe Links statt direkter Datei-Uploads, Justice-Vorlagen über `Vorlagen verwalten`.

Bürger können Unterlagen/Beweislinks einreichen; Justice muss sie prüfen, bevor sie offizielle Verfahrensunterlagen werden.

Zusätzlich vorgesehen:

- interne Beschlussentwürfe
- Beweisanträge innerhalb eines Verfahrens

## PD-Verknüpfung und Beweise

Justice-Verfahren können mit mehreren PD-Fällen verknüpft werden.

Ausgewählte PD-Beweismittel können lesend übernommen/verknüpft werden.

- Chain of Custody bleibt lesbar
- Justice verändert PD-Beweise nicht
- formelle PD→Justice-Beweisfreigaben sind vorgesehen

## Bußgeld-Einsprüche

PD-Bußgeld-Einspruch kann automatisch passenden Justice-Vorgang erzeugen. Bußgeldnummer und PD-Fallreferenz bleiben erhalten.

## Befehle / Anordnungen

Befehlsarten sind frei definierbar und werden über `Befehlsarten verwalten` gepflegt.

Je Befehlsart eigene Vorlage/Pflichtfelder.

PD-Anträge:

- annehmen/ablehnen
- Ablehnung benötigt Grund
- Status/Entscheidung im PD-Fall sichtbar
- interne Justice-Kommentare möglich
- PD sieht als entscheidende Stelle `Justice`, nicht die konkrete Person

Genehmigte Befehle:

- eindeutige Dokument-/Befehlsnummer
- optionales Ablaufdatum
- widerrufbar, Widerrufsgrund Pflicht
- PD wird über Statusänderungen benachrichtigt

Abgelaufene/widerrufene Befehle müssen nicht als eigener Langzeitbestand dauerhaft bleiben, sofern ihre relevante Information im dauerhaft gespeicherten Verfahren erhalten ist.

## Medizinische Berichtsanfragen

Justice kann formelle Anfragen an Medical senden.

- konkrete Justice-Verfahrensverknüpfung Pflicht
- Medical sieht Anfragegrund
- Ablehnung benötigt Grund
- richterliche Anordnung kann die normale Patientenzustimmung für konkret bezeichnete Daten ersetzen
- kein pauschaler Medical-Zugriff
- Bürger sieht Anfrage nicht automatisch

## Termine, Ladungen und Vorladungen

Verhandlungstermine werden mit Nexus-Kalender verknüpft und können verpflichtend sein.

Zusätzlich unterstützt Justice:

- **Zeugenladungen**
- **Vorladungen für Bürger**

Diese werden dem betroffenen Bürger im dafür vorgesehenen freigegebenen Bereich zugestellt/angezeigt und können mit einem konkreten Verfahren und Termin verknüpft werden.

## Verhandlungsprotokolle

Strukturierte Protokolle mit Versionsverlauf während Bearbeitung. Nach Finalisierung unveränderlich.

## Urteile und Entscheidungen

Strukturiert möglich:

- Geldstrafe
- Haftdauer/-maß
- Führerschein-/Lizenzmaßnahmen
- weitere Maßnahmen

Urteile werden für Beteiligte manuell veröffentlicht. Optional öffentliche Veröffentlichung im Justiz-/City-Hub-Kontext; keine eigene nur-Urteile-Suchmaschine.

Zusätzlich vorgesehen:

- **Urteils-Korrekturverfahren**
- **Vollstreckungsstatus von Urteilen**

Korrekturen verändern ein endgültiges Urteil nicht stillschweigend, sondern werden als nachvollziehbarer Folge-/Korrekturvorgang geführt.

## Berufung / Einspruch

Formeller Prozess durch betroffenen Bürger oder verknüpften Anwalt.

- Grund Pflicht
- externe Links möglich
- Frist möglich
- gültige Berufung kann ein abgeschlossenes Verfahren wieder in Bearbeitung bringen

## Präzedenzfälle / Wissenssammlung

Justice erhält eine interne Wissenssammlung für Präzedenzfälle beziehungsweise relevante frühere Entscheidungen.

Sie ist ein internes Wissenssystem und kein öffentlicher Urteilssuchdienst.

## Aufbewahrung

**Abgeschlossene Justice-Verfahren und relevante Verfahrensakten werden dauerhaft gespeichert.**

Diese spätere Festlegung überschreibt generische 6-/12-Monats-Antworten aus Vertiefungsfragen.

Wenn ein Account später `disabled` wird, bleiben Nexus-ID und historischer Name in alten Verfahren erhalten.

Kein PDF-Export des gesamten Verfahrens.

## Stadtverwaltung

Stadtverwaltung darf interne Justice-Verfahren weiterhin **nur lesend** einsehen.

- kein Bearbeiten
- kein automatischer Übergriff auf Medical/PD/FD
- Zugriff wird derzeit nicht zusätzlich pro Aufruf geloggt

Technische Systemadministration erhält **kein automatisches fachliches Justice-Leserecht** durch die technische Rolle.

## Technische Leitplanken

Benötigt werden Verfahrensverknüpfungen, Vertretungshistorie, Befangenheitsvermerke, Beweisanträge, Ladungen/Vorladungen, Beschlussentwürfe, Korrekturverfahren, Vollstreckungsstatus und Präzedenzfall-Wissenssammlung.

Justice-Daten werden serverseitig nach Verfahren, Rolle, Versiegelung und Beteiligtenfreigabe geschützt und dauerhaft aufbewahrt.
