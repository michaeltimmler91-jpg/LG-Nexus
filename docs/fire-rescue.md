# LG Nexus – Fire & Rescue

Dieses Dokument beschreibt den verbindlichen Stand des Fire-&-Rescue-Moduls bis Frage 3410.

## Einsatzberichte

FD führt eigene Einsatzberichte mit strukturierter Einsatzart, eindeutiger Einsatznummer und Status:

- Entwurf
- Laufend
- Abgeschlossen
- Archiviert

Neue Berichte nur mit passendem Rollenrecht; Bearbeitung über `Einsatzberichte bearbeiten`.

Abgeschlossene Berichte nur über Korrekturversion änderbar. Abschlussfazit Pflicht.

Ein Einsatz kann mit einem gemeinsamen fraktionsübergreifenden Vorfall verknüpft werden und enthält Incident Commander, eingesetzte FD-Mitglieder sowie Fahrzeuge/Einheiten.

## Einsatzabschnitte und Ressourcen

Zusätzlich unterstützt Nexus:

- **Einsatzabschnitte innerhalb eines FD-Einsatzes**
- **Ressourcenanforderungen zwischen FD-Einheiten**

Diese Informationen sind geschützte FD-Fachdaten und können fall-/vorgangsbezogene Zugriffsregeln besitzen.

## Einsatzdokumentation

- chronologische Timeline mit Autor
- Gefahren/Hinweise
- externe Links
- interne Kommentare
- @-Erwähnungen + Nexus-Benachrichtigung

Keine direkten Datei-Uploads.

## Objekt-, Gefahrstoff- und Plandaten

FD besitzt eine interne Objekt-/Gebäude-Gefahrendatenbank über `Objektdaten verwalten`.

Objekte können feste LS-Map-Positionen und externe Pläne/Bilder besitzen.

Zusätzlich vorgesehen:

- **Gefahrstoff-Datensätze**
- **Objektpläne mit Versionsstand**

Ausgewählte Informationen können gezielt/formell an PD oder Medical freigegeben und wieder entzogen werden.

## Hydranten und interne Marker

Interne Marker für Hydranten, Zufahrten, Gefahrenpunkte und spezielle temporäre Gefahrenbereiche bleiben vorgesehen.

Hydranten besitzen Typ, Status und Notiz; unbrauchbar/defekt kann über Status markiert werden.

Ein separates zusätzliches `Hydranten-Wartungszustände`-Workflow-System ist nicht vorgesehen. Die vorhandene Status-/Objektlogik reicht aus.

## Zusammenarbeit

- kleine Patienten-/Einsatz-Zusammenfassung gezielt an Medical
- Brand-/Ursachenermittlung kann an PD übergeben/verknüpft werden
- externe Freigaben nur gezielt, nicht automatisch durch fremde Organisationsrechte

## Nachbesprechung

Optionaler interner After-Action-Bericht bleibt möglich.

## Wissensdatenbank und Ausbildung

- eigene Wissensdatenbank
- Ausbildungspläne
- Wissenstests
- ein oder mehrere feste Ausbilder je Azubi

Die allgemeinen Dokument-/Wissensregeln gelten ergänzend.

## Geräte, Fahrzeuge und Checklisten

Bestehende interne Geräte-/Ausrüstungs-Checklisten bleiben.

Zusätzlich sind **Fahrzeug-Checklisten vor Einsatz** vorgesehen.

Geräte können Inventar-ID und Status besitzen:

- Einsatzbereit
- In Wartung
- Defekt
- Außer Dienst

Mangelpriorität:

- Niedrig
- Normal
- Hoch
- Kritisch

Fällige Wartung erzeugt Erinnerung. Wartungshistorie bleibt dauerhaft.

Nicht als zusätzliche Systeme vorgesehen:

- Geräteausgabe an einzelne Mitglieder
- allgemeine Mängelmeldungen durch alle FD-Mitglieder

## Brandschutz-/Objektprüfungen

Prüfergebnisse:

- Bestanden
- Mängel
- Nachprüfung nötig

Nachprüfungsfrist möglich. Betroffene Organisation kann einen ausdrücklich freigegebenen Bericht sehen. Nach bestandener Prüfung kann Bescheinigung erzeugt werden.

Ein automatisches separates Task-System für Nachprüfungen wird nicht zusätzlich erzeugt.

## Öffentliche Sicherheitsinformationen

Ein eigenes zusätzliches FD-Untermodul für öffentliche Sicherheitsinformationen ist nicht vorgesehen. Öffentliche Warnungen/Gefahrenhinweise laufen über die bestehenden City-Hub-/LS-Map-Mechanismen mit passenden Rechten.

## Aufbewahrung

Abgeschlossene FD-Einsatzberichte werden **12 Monate** gespeichert. Dauerhafte Wartungshistorien bleiben davon getrennt.

## Stadtverwaltung und technische Admins

- Stadtverwaltung darf interne FD-Einsatzberichte nicht einsehen
- technische Systemadministration erhält ebenfalls kein automatisches fachliches FD-Zugriffsrecht

## Technische Leitplanken

FD-Daten müssen nach Rollen, Einsatzbezug, Objektfreigabe und externen Freigaben serverseitig getrennt werden. Gemeinsame Vorfälle gewähren keinen automatischen Zugang zu internen FD-Fachdaten.
