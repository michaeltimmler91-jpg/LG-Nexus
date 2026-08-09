# LG Nexus – Medical

Dieses Dokument beschreibt den verbindlichen Stand des Medical-Moduls nach Auswertung bis Frage 3410.

## Patientensuche

Medical kann Patienten suchen nach:

- Name
- Nexus-ID
- RP-Geburtsdatum
- Telefonnummer, **nur wenn die Telefonnummer für den suchenden Medic gemäß Privatsphäre sichtbar ist**

Es gibt keinen pauschalen Medical-Override für private Telefonnummern.

## Zentrale Krankenakte

Jeder Patient besitzt genau eine zentrale Krankenakte. Einzelne Behandlungen beziehungsweise Einsätze werden als eigene Vorgänge innerhalb dieser Akte geführt und erhalten automatisch eine eindeutige Behandlungsnummer.

Strukturierte medizinische Stammdaten:

- Diagnosen
- Allergien einschließlich Schweregrad
- Medikamente einschließlich Dosierungsfreitext
- Blutgruppe
- wichtige medizinische Notfallhinweise
- interne medizinische Warnhinweise / Flags
- Impf-/Vorsorgeeinträge im RP
- dokumentierte Patienteneinwilligungen

Patienten dürfen medizinische Stammdaten nicht selbst verändern; Pflege erfolgt durch Medical.

### Verbindliche Aufbewahrungsregel

**In einer Krankenakte wird nichts automatisch oder endgültig gelöscht.**

- medizinische Inhalte bleiben dauerhaft erhalten
- Korrekturen erzeugen neue Versionen
- Stornierungen bleiben sichtbar und als storniert gekennzeichnet
- eine frühere Planung, abgeschlossene medizinische Einträge mit Sonderrecht endgültig zu löschen, ist damit aufgehoben
- generische 6-/12-Monats-Fristen aus späteren Frageblöcken gelten nicht für Akteninhalte

## Behandlungs- und Befundvorgänge

Neue Behandlungen dürfen nur Mitglieder mit `Behandlungen anlegen` erstellen. Offene Behandlungen dürfen nur mit `Behandlungen bearbeiten` verändert werden.

Status:

- Offen
- Abgeschlossen

Gespeichert werden ein verantwortlicher Medic und optional mehrere weitere Behandler.

Abgeschlossene Vorgänge sind nicht normal editierbar; Änderungen erfolgen über Korrektur/Version.

Ein Behandlungsvorgang kann enthalten:

- Körper-/Verletzungsschema
- chronologische Maßnahmen-/Behandlungs-Zeitleiste
- externe Links als Anhänge
- Diagnosen aus einem organisationsinternen Diagnosekatalog
- OP-/Eingriffsberichte
- strukturierte Labor-/Befundberichte
- medizinische Nachkontrolltermine

Strukturierte Vitalwerte sind derzeit nicht vorgesehen. Ein eigener RTW-Transportbericht und ein separates Zielkrankenhaus-/Übergabeortfeld sind ebenfalls nicht vorgesehen.

## Besonders geschützte Akten

Medical kann Sperrvermerke für besonders geschützte Akten beziehungsweise Inhalte verwenden.

Für die neu vertieften medizinischen Fachbereiche gilt:

- normaler Medical-Modulzugriff allein reicht nicht immer aus
- zusätzlich kann eine fall-/vorgangsbezogene Berechtigung erforderlich sein
- Änderungen werden nachvollziehbar/versioniert
- reine Lesezugriffe werden weiterhin nicht pauschal zusätzlich protokolliert

## Sichtbarkeit für den Patienten

Ein Bürger sieht **nicht automatisch seine vollständige Krankenakte**.

Medical kann einzelne Inhalte beziehungsweise geeignete Zusammenfassungen ausdrücklich für die Bürgerseite freigeben. Nur diese freigegebenen Inhalte sind im normalen Bürgerbereich sichtbar.

Diese neuere Festlegung ersetzt die frühere Regel einer vollständigen automatischen Akteneinsicht.

Neue Behandlungen lösen keine automatische Benachrichtigung an den Patienten aus.

## Zugriff anderer Stellen

### Police Department

PD darf medizinische Akten nicht direkt einsehen. Sichtbar werden nur ausdrücklich freigegebene medizinische Informationen.

### Fire & Rescue

FD darf medizinische Akten nicht direkt einsehen. Sichtbar werden nur ausdrücklich freigegebene medizinische Informationen.

### Stadtverwaltung

Die Stadtverwaltung darf medizinische Krankenakten nicht einsehen.

### Technische Systemadministration

Technische System-Admins erhalten durch ihre Adminrolle ebenfalls **keinen automatischen fachlichen Aktenzugriff**.

## Medizinische Freigaben

Freigaben an andere Fraktionen/Behörden erfolgen über einen formellen Freigabe-/Anfrageprozess. Ein bloßes Rollenrecht einer anderen Organisation reicht nicht.

Für Einsätze kann eine kleine medizinische Zusammenfassung gezielt geteilt werden, beispielsweise:

- Allergien
- Medikamente
- Blutgruppe

Grundsätzlich ist Patientenzustimmung erforderlich, außer bei einer klar definierten Notfallregel oder ausdrücklich richterlich angeordneter Freigabe.

Der Patient erhält derzeit keine automatische Benachrichtigung über eine solche fachliche Freigabe.

## Formelle PD-/Justice-Anfragen

PD und Justice können medizinische Berichte über Nexus anfordern.

Für Justice:

- konkrete Verfahrensverknüpfung Pflicht
- Medical sieht den Anfragegrund
- Ablehnung durch Medical benötigt einen Grund
- richterliche Anordnung kann Patientenzustimmung für die konkret angeordneten Daten ersetzen
- kein pauschaler Justice-Zugriff auf die Akte
- Bürger sieht die Anfrage nicht automatisch

## Behandlungsvorlagen

Medical kann Behandlungsvorlagen über `Vorlagen verwalten` erstellen.

- Versionsverlauf
- strukturierte Vorbefüllung möglich

## Rezepte / Verordnungen

Jedes Rezept:

- eindeutige Rezeptnummer
- Status `Aktiv` oder `Ungültig`
- optionales Ablaufdatum
- öffentliche Verifikation über Prüfnummer

Der Bürger sieht aktuell relevante/freigegebene Rezepte. Nach Einlösung wird kein separater Bürger-Rezeptverlauf geführt; die medizinisch notwendige Aktenhistorie bleibt davon unberührt.

## Bescheinigungen / Krankschreibungen

Medical kann Nexus-Bescheinigungen ausstellen.

- eindeutige Dokumentnummer
- Start-/Enddatum
- für den betroffenen Bürger sichtbar
- gezielte Freigabe an ausgewählte Organisation/Firma möglich
- Freigabe enthält nur notwendige Bescheinigungsdaten, nie automatisch die Krankenakte

## Verstorben-Markierung

- Setzen nur mit Bestätigung
- Korrektur mit besonderem Recht möglich
- beim Aufheben Grund Pflicht

## Wissensdatenbank und Ausbildung

Medical besitzt eine interne Wissensdatenbank mit Kategorien/Unterkategorien und Versionsverlauf. Verwaltung über `Wissensdatenbank verwalten`.

Ausbildung:

- Ausbildungspläne erst nach Ausbilderfreigabe sichtbar
- ein oder mehrere feste Ausbilder je Azubi
- Fortschritt in Prozent/erledigten Punkten
- interne Ausbildernotizen je Ausbildungspunkt; für Azubi unsichtbar
- Testpatienten
- anonymisierte Testfälle für Ausbildung
- Wissenstests erst nach Freigabe sichtbar
- nach Abgabe wieder ausblendbar
- Punktzahl + Versuchshistorie
- genau ein Versuch pro Test
- keine Mindestpunktzahl zum Bestehen
- Ergebnis erst nach Ausbilderfreigabe sichtbar

## Urlaub / Abwesenheit

- direkter Eintrag ohne Genehmigungsprozess
- `von` / `bis` Pflicht
- Grund/Kommentar optional
- wenn Grund vorhanden, für alle Medical-Mitglieder sichtbar
- alle Medical-Mitglieder sehen Abwesenheiten
- bewusst kein Dienst-/Schichtplan

## Technische Leitplanken

Benötigt werden insbesondere:

- zentrale Akte pro Nexus-Person
- Behandlungsnummern und Versionierung
- Diagnosekatalog, Allergie-Schweregrade, Medikamenten-/Dosierungsdaten
- OP-/Befund-/Vorsorgeeinträge
- Einwilligungen und Sperrvermerke
- fallbezogene Zusatzberechtigungen
- formelle Freigabe-/Anfrageobjekte
- dauerhafte Aufbewahrung medizinischer Akteninhalte

Medical-Daten werden serverseitig besonders strikt von normalen Organisations-, Stadtverwaltungs- und technischen Adminrechten getrennt.
