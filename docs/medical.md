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

Patienten dürfen diese medizinischen Stammdaten nicht selbst ergänzen oder verändern; Pflege erfolgt durch Medical.

Wichtige medizinische Notfallhinweise werden im Patientenkopf besonders hervorgehoben.

Warnhinweise/Flags können:

- ein optionales Ablaufdatum besitzen
- die Priorität `Hinweis`, `Wichtig` oder `Kritisch` besitzen

Setzen und Entfernen erfolgt über ein eigenes Rollenrecht. Der Ersteller eines Flags wird in der normalen Medical-Oberfläche nicht als eigenes sichtbares Feld gespeichert/angezeigt.

## Behandlungsvorgänge

Neue Behandlungen dürfen nur Mitglieder mit dem Rollenrecht `Behandlungen anlegen` erstellen.

Bestehende, noch offene Behandlungen dürfen nur Mitglieder mit dem Rollenrecht `Behandlungen bearbeiten` verändern.

Behandlungsstatus:

- Offen
- Abgeschlossen

Bei jeder Behandlung wird ein verantwortlicher Medic fest gespeichert. Zusätzlich können mehrere weitere Medics gleichzeitig als Behandler zugeordnet werden.

Ein abgeschlossener Behandlungsvorgang ist nicht normal weiter bearbeitbar. Änderungen erfolgen nur über Korrektur beziehungsweise neue Versionen, sodass frühere Inhalte erhalten bleiben.

Medizinische Einträge können storniert werden. Dabei gilt:

- Stornierungsgrund ist Pflicht.
- Der stornierte Eintrag bleibt in der Krankenakte sichtbar und wird klar als storniert gekennzeichnet.

Ein Behandlungsvorgang kann enthalten:

- Körper-/Verletzungsschema zur Markierung von Verletzungen
- chronologische Maßnahmen-/Behandlungs-Zeitleiste
- externe Links als Anhänge

Strukturierte Vitalwerte sind derzeit nicht vorgesehen.

Ein eigener Transport-/RTW-Bericht ist nicht vorgesehen. Ein separates Feld für Zielkrankenhaus beziehungsweise Übergabeort ist ebenfalls nicht vorgesehen.

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

- jede Justice-Anfrage muss mit einem konkreten Justice-Verfahren verknüpft sein
- Medical sieht den konkreten Anfragegrund
- bei Ablehnung durch Medical ist ein Ablehnungsgrund Pflicht
- eine ausdrücklich richterlich angeordnete medizinische Freigabe darf die normale Patientenzustimmung ersetzen
- diese richterliche Ausnahme erzeugt keinen pauschalen Justice-Zugriff auf die Krankenakte; freigegeben werden nur die konkret angeordneten beziehungsweise genehmigten Informationen
- der betroffene Bürger sieht nicht automatisch, dass Justice eine medizinische Anfrage gestellt hat

## Behandlungsvorlagen

Medical kann Behandlungsvorlagen erstellen.

Verwaltung über das Rollenrecht `Vorlagen verwalten`.

Vorlagen:

- besitzen einen Versionsverlauf
- können strukturierte Felder vorbefüllen

## Rezepte / Verordnungen

Medical kann RP-Rezepte beziehungsweise Verordnungen ausstellen.

Jedes Rezept:

- erhält automatisch eine eindeutige Rezeptnummer
- besitzt die Status `Aktiv` oder `Ungültig`
- kann ein Ablaufdatum besitzen
- ist für den betroffenen Bürger in Nexus sichtbar, solange es nach den festgelegten Regeln sichtbar/relevant ist
- kann über eine öffentliche Prüfnummer verifiziert werden

Nach Einlösung wird ein Rezept nicht als eigener historischer Rezept-Eintrag für den Bürger weiter angezeigt.

## Medizinische Bescheinigungen / Krankschreibungen

Medical kann Bescheinigungen und Krankschreibungen als Nexus-Dokument erzeugen.

Jede Bescheinigung:

- erhält automatisch eine eindeutige Dokumentnummer
- besitzt strukturierte Felder für Start- und Enddatum
- ist für den betroffenen Bürger in Nexus sichtbar

Der Bürger kann eine Bescheinigung gezielt mit einer Organisation/Firma teilen. Dabei sieht die empfangende Organisation nur die notwendigen Bescheinigungsdaten, niemals automatisch die vollständige Krankenakte.

## Verstorben-Markierung

Medical kann einen Patienten medizinisch als verstorben kennzeichnen.

- Das Setzen verlangt eine ausdrückliche Bestätigung.
- Eine fälschlich gesetzte Markierung kann mit besonderem Rollenrecht wieder aufgehoben werden.
- Beim Aufheben ist ein Grund Pflicht.

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
- Ein Azubi kann einem oder mehreren festen Ausbildern zugeordnet werden.
- Ausbildungspläne zeigen Fortschritt in Prozent beziehungsweise erledigten Punkten.
- Ausbilder dürfen zu einzelnen Ausbildungspunkten interne Notizen hinterlegen.
- Diese Ausbildungsnotizen sind für den Azubi nicht sichtbar.
- Es gibt Testpatienten für Ausbildungszwecke.
- Ausbilder können Wissenstests erstellen.
- Wissenstests werden erst nach Freigabe sichtbar.
- Nach Abgabe kann der Ausbilder den Test wieder ausblenden.
- Auswertung: Punktzahl + Versuchshistorie.
- Pro Wissenstest ist immer nur **ein Versuch** erlaubt.
- Eine Mindestpunktzahl zum Bestehen ist nicht vorgesehen.
- Testergebnisse werden dem Azubi erst nach Freigabe durch einen Ausbilder angezeigt.

## Urlaub / Abwesenheit

Medical besitzt einen Bereich für Urlaub und Abwesenheiten.

- Eintrag direkt ohne Genehmigungsprozess.
- Zeitraum `von` / `bis` ist Pflicht.
- Ein Grund/Kommentar ist optional.
- Wenn ein Grund eingetragen wurde, dürfen ihn alle Medical-Mitglieder sehen.
- Alle Medical-Mitglieder dürfen die eingetragenen Abwesenheiten sehen.
- Der Bereich bleibt bewusst **ohne Dienstplan-/Schichtplan-Funktion**.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- zentrale Patientenakte pro Nexus-Person
- Behandlungsvorgänge mit Behandlungsnummer und Status Offen/Abgeschlossen
- Rollenrechte `Behandlungen anlegen` und `Behandlungen bearbeiten`
- verantwortlicher Medic + mehrere Behandler
- Korrektur-/Versionslogik für abgeschlossene Behandlungen
- Stornierung mit Pflichtgrund und sichtbarem Stornozustand
- Diagnosen, Allergien, Medikamente, Blutgruppe, Notfallhinweise
- medizinische Flags mit Ablaufdatum, Priorität und Rollenrecht
- Körper-/Verletzungsschema
- Behandlungs-Timeline
- externe Link-Anhänge
- medizinische Freigabe-Zusammenfassungen
- formelle PD-/Justice-Anfragen einschließlich zwingender Justice-Verfahrensverknüpfung und richterlicher Ausnahme
- Vorlagen + Versionshistorie
- Rezepte mit Nummer, Gültigkeit und öffentlicher Verifikation
- Bescheinigungen mit Dokumentnummer und gezielter Organisationsfreigabe
- Verstorben-Markierung mit Bestätigung und Korrekturrecht
- Wissensdatenbank
- Ausbildungspläne, Ausbilderzuweisung, Fortschritt, interne Ausbildungsnotizen, Testpatienten, Wissenstests
- Abwesenheitsbereich mit Pflichtzeitraum

Medical-Daten müssen serverseitig besonders strikt geschützt und von allgemeinen Organisationsdaten getrennt werden.