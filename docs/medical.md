# LG Nexus – Medical

Dieses Dokument beschreibt die festgelegten Regeln für das Medical-Modul.

## Patientensuche

Medical kann Patienten suchen nach:

- Name
- Nexus-ID
- RP-Geburtsdatum
- Telefonnummer, **nur wenn die Telefonnummer für den suchenden Medic gemäß Privatsphäre sichtbar ist**

Es gibt keinen pauschalen Medical-Override für private Telefonnummern.

## Krankenakte

Jeder Patient besitzt genau eine zentrale Krankenakte.

Einzelne Behandlungen beziehungsweise Einsätze werden als eigene Vorgänge innerhalb dieser Akte geführt und erhalten automatisch eine eindeutige Behandlungsnummer.

Strukturierte medizinische Stammdaten:

- Diagnosen
- Allergien
- Medikamente
- Blutgruppe
- wichtige medizinische Notfallhinweise
- interne medizinische Warnhinweise / Flags

Warnhinweise können ein optionales Ablaufdatum besitzen. Setzen und Entfernen erfolgt über ein eigenes Rollenrecht.

## Bearbeitung und Historie

Jede Bearbeitung der Krankenakte besitzt einen Änderungsverlauf.

Korrekturen erzeugen einen neuen Versionsstand, sodass ältere Inhalte erhalten bleiben.

Abgeschlossene medizinische Einträge dürfen mit einem besonderen Recht endgültig gelöscht werden.

## Sichtbarkeit für den Patienten

Ein Bürger darf seine eigene Krankenakte vollständig in Nexus einsehen.

Neue Behandlungen lösen jedoch keine automatische Benachrichtigung an den Patienten aus.

## Zugriff anderer Stellen

### Police Department

PD darf medizinische Akten nicht direkt einsehen. Sichtbar werden nur medizinische Zusammenfassungen, die ausdrücklich freigegeben wurden.

### Fire & Rescue

Fire & Rescue darf medizinische Akten ebenfalls nicht direkt einsehen. Sichtbar werden nur ausdrücklich freigegebene medizinische Zusammenfassungen.

### Stadtverwaltung

Die Stadtverwaltung darf medizinische Krankenakten nicht einsehen.

## Medizinische Notfall-Zusammenfassung

Für Einsätze kann eine kleine medizinische Zusammenfassung gezielt mit PD/FD geteilt werden:

- Allergien
- Medikamente
- Blutgruppe

Für die Weitergabe medizinischer Informationen ist grundsätzlich eine Zustimmung des Patienten erforderlich, außer bei einer klar definierten Notfallregel oder einer ausdrücklich richterlich angeordneten Freigabe.

Der Patient erhält keine automatische Nexus-Benachrichtigung, wenn medizinische Informationen gezielt an eine andere Stelle freigegeben werden.

## Formelle Anfragen

PD und Justice können medizinische Berichte über einen formellen Nexus-Anfrageprozess anfordern.

Für Justice-Anfragen gilt zusätzlich:

- Medical sieht den konkreten Anfragegrund.
- Bei Ablehnung durch Medical ist ein Ablehnungsgrund Pflicht.
- Eine ausdrücklich richterlich angeordnete medizinische Freigabe darf die normale Patientenzustimmung ersetzen.
- Diese richterliche Ausnahme erzeugt keinen pauschalen Justice-Zugriff auf die Krankenakte; freigegeben werden nur die konkret angeordneten beziehungsweise genehmigten Informationen.

## Behandlungsvorlagen

Medical kann Behandlungsvorlagen erstellen.

Verwaltung über das Rollenrecht `Vorlagen verwalten`.

Vorlagen:

- besitzen einen Versionsverlauf
- können strukturierte Felder vorbefüllen

## Behandlungsvorgang

Ein Behandlungsvorgang kann enthalten:

- Körper-/Verletzungsschema zur Markierung von Verletzungen
- chronologische Maßnahmen-/Behandlungs-Zeitleiste
- externe Links als Anhänge

Strukturierte Vitalwerte sind derzeit nicht vorgesehen.

Ein eigener Transport-/RTW-Bericht ist nicht vorgesehen. Ein separates Feld für Zielkrankenhaus beziehungsweise Übergabeort ist ebenfalls nicht vorgesehen.

## Weitere medizinische Funktionen

Medical kann:

- einen Patienten medizinisch als verstorben kennzeichnen
- Bescheinigungen/Krankschreibungen als Nexus-Dokument erzeugen
- RP-Verordnungen/Rezepte erstellen

## Zugriffshistorie

Zugriffe auf Krankenakten werden nicht zusätzlich protokolliert.

Dementsprechend sieht ein Patient auch nicht, wer seine Krankenakte aufgerufen hat.

## Aufbewahrung

Medizinische Krankenakten werden **dauerhaft** aufbewahrt.

## Wissensdatenbank

Medical besitzt eine interne Wissensdatenbank mit:

- Kategorien und Unterkategorien
- Versionsverlauf je Artikel
- Verwaltung über das Rollenrecht `Wissensdatenbank verwalten`

## Ausbildung

Medical besitzt Ausbildungspläne für Azubis.

- Ausbildungspläne werden erst nach Freischaltung durch einen Ausbilder für den Azubi sichtbar.
- Es gibt Testpatienten für Ausbildungszwecke.
- Ausbilder können Wissenstests erstellen.
- Wissenstests werden erst nach Freigabe sichtbar.
- Nach Abgabe kann der Ausbilder den Test wieder ausblenden.
- Auswertung: Punktzahl + Versuchshistorie.
- Pro Wissenstest ist immer nur **ein Versuch** erlaubt.

## Urlaub / Abwesenheit

Medical besitzt einen Bereich für Urlaub und Abwesenheiten.

- Eintrag direkt ohne Genehmigungsprozess.
- Alle Medical-Mitglieder dürfen die eingetragenen Abwesenheiten sehen.
- Der Bereich bleibt bewusst **ohne Dienstplan-/Schichtplan-Funktion**.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- zentrale Patientenakte pro Nexus-Person
- Behandlungsvorgänge mit Behandlungsnummer
- Diagnosen, Allergien, Medikamente, Blutgruppe, Notfallhinweise
- medizinische Flags mit Ablaufdatum und Rollenrecht
- Versionshistorie und besondere Löschberechtigung
- Körper-/Verletzungsschema
- Behandlungs-Timeline
- externe Link-Anhänge
- medizinische Freigabe-Zusammenfassungen
- formelle PD-/Justice-Anfragen einschließlich richterlicher Ausnahme
- Vorlagen + Versionshistorie
- Bescheinigungen und RP-Rezepte
- Wissensdatenbank
- Ausbildungspläne, Testpatienten, Wissenstests
- Abwesenheitsbereich

Medical-Daten müssen serverseitig besonders strikt geschützt und von allgemeinen Organisationsdaten getrennt werden.