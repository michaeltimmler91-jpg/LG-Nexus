# LG Nexus – Events und City Hub

Dieses Dokument beschreibt den verbindlichen Stand für Events und City Hub bis Frage 3410.

## Events – Grundprinzip

Organisationen dürfen Events erstellen. Normale Bürger erstellen keine eigenen Nexus-Events.

Verwaltung über `Events verwalten`.

Grundfelder:

- Titel Pflicht
- formatierte Beschreibung
- Datum und Startzeit Pflicht
- Endzeit optional
- mehrtägig und wiederkehrend möglich
- Ort als Freitext, Map-Position oder Organisationsstandort
- Titelbild/Banner
- optionales Teilnehmerlimit
- feste Nexus-Eventkategorie

Öffentliche Suche nach Datum, Kategorie, Ort und Veranstalter. Event-Kartenpositionen erzeugen öffentliche LS-Map-Marker. Öffentliche Events besitzen einen direkten Nexus-Teilen-Link.

## Veranstalter und Team

Mehrere Organisationen können Veranstalter sein. Mitveranstalter müssen bestätigen, erhalten dadurch aber kein automatisches Bearbeitungsrecht.

Internes Event-Team kann Rollen wie Leitung, Mitveranstalter und Helfer verwenden.

## Wiederkehrende Events

Unterstützt werden täglich, wöchentlich, monatlich und frei definierbare Regeln.

- mehrere Wochentage möglich
- Enddatum oder Anzahl Wiederholungen
- Einzeltermin separat änder-/absagbar
- Bearbeitung: nur dieser / dieser und folgende / ganze Serie
- Absagegrund Pflicht
- Teilnahme gilt je Einzeltermin

## Teilnahme und Warteliste

Teilnahmestatus:

- Teilnehmen
- Vielleicht
- Absagen

Teilnehmer und Teilnehmerzahl sind öffentlich nicht sichtbar.

Bei vollem Event Warteliste; erste Person rückt automatisch nach und wird benachrichtigt. Wartelistenposition selbst bleibt verborgen.

Kein manuelles Check-in-/Anwesenheitssystem.

## Erinnerungen

Feste Erinnerungen:

- 24 Stunden
- 1 Stunde
- 30 Minuten vorher

`Vielleicht` erhält ebenfalls Erinnerungen. Bei kurzfristig erstellten Events werden nur noch mögliche Erinnerungen gesendet. Startzeitänderungen berechnen Erinnerungen neu.

## Eventverwaltung

- veröffentlichte Events bearbeitbar
- größere Änderung zeigt `Event geändert`
- kein endgültiges Löschen, sondern Absage/Archivierung
- nach Ende automatische Archivierung
- vergangene Events 6 Monate abrufbar

## Erweiterte Eventfunktionen

Zusätzlich vorgesehen:

- kostenlose Ticket-/Platzcodes ohne echtes Bezahlsystem
- Gästelisten für eingeladene Personen
- private Organisations-Events
- Zugang nur für ausgewählte Organisationen/Rollen
- Alters-/Zugangshinweise
- Event-Regeln und Teilnahmebedingungen
- Programmabläufe
- mehrere Orte pro Veranstaltung
- Helfer-Schichten ohne Dienstplancharakter
- Sponsoren/Partner

Diese Inhalte werden über passende Eventrechte verwaltet, besitzen je Eintrag konfigurierbare Sichtbarkeit, lösen nur bei wesentlichen Änderungen Benachrichtigungen aus und verwenden bei Entfernung grundsätzlich 30 Tage Papierkorb, soweit sie nicht mit dem gesamten Event archiviert werden.

## Eventbilder / Memories

Eventbilder werden über externe Links eingebunden. Teilnehmer dürfen Bilder vorschlagen; Veranstalter müssen Vorschläge freigeben.

Nach dem Event können Event-Memories entstehen. Das eigenständige Memories-Modul ist in `docs/memories.md` beschrieben und darf pro Event mehrere Memories-Alben unterstützen.

## Event-Feedback

Teilnehmerfeedback ist möglich. Öffentlich sichtbar ist nur die Durchschnittsbewertung, nicht die einzelnen Bewertungen.

# City Hub

Der City Hub enthält offizielle stadtweite Informationen. Normale Organisationen veröffentlichen keine allgemeinen City-Hub-News.

Verwaltung über `City Hub verwalten`; Kategorien bleiben strukturell Stadtverwaltungs-Ownern vorbehalten.

## Beiträge

- Entwürfe
- geplante Veröffentlichung
- nach Veröffentlichung bearbeitbar mit `Bearbeitet`
- Änderungsverlauf
- Löschen → 30 Tage Papierkorb
- optionales Ablaufdatum
- Titelbild
- Verlinkung zu Event, Organisation oder LS-Map-Position
- Volltextsuche
- Archivfilter nach Kategorie und Datum

## Kategorien

- nur Stadtverwaltungs-Owner
- Farbe/Icon
- mehrere Kategorien pro Beitrag
- geschützte Systemkategorien nicht löschbar

## Kommentare und Reaktionen

Kommentare je Beitrag aktivierbar/deaktivierbar. Zielgruppe kann alle aktiven Bürger oder ausgewählte Rollen/Organisationen sein.

- eigene Kommentare bearbeit-/löschbar
- Moderation durch `City Hub verwalten`
- Moderationsgrund Pflicht und intern
- Kommentare meldbar

Emoji-Reaktionen aus fester Nexus-Auswahl, mehrere Reaktionen pro Bürger möglich, öffentliche Reaktionszahlen.

## Eilmeldungen und Warnungen

Nexus unterstützt:

- stadtweite Eilmeldungen mit Prioritätsstufen
- regionale Warnmeldungen für bestimmte Kartenbereiche
- eigenen stadtweiten Warn-/Notfallbanner

Das Sonderrecht `Stadtwarnung auslösen` bleibt getrennt vom normalen City-Hub-Recht.

Warnbanner können je Fall entweder bis zur manuellen Aufhebung bestehen oder mit einer festgelegten Zeit automatisch ablaufen.

## Presse und Korrekturen

Vorgesehen:

- offizielle Pressemitteilungen einzelner Behörden
- öffentliche Korrekturhinweise für fehlerhafte Meldungen
- öffentliche FAQ der Stadtverwaltung
- öffentliche Nexus-Changelogs

## Nicht vorgesehen

- öffentliche City-Hub-Umfragen
- zeitlich begrenzte Abstimmungen
- Pflicht-Lesebestätigung für normale wichtige City-Hub-Beiträge

Die bereits getrennt geregelten Stadtverwaltungs-/System-Pflichtmeldungen können weiterhin eine Lesebestätigung verlangen.

## Kalender

Bei `Teilnehmen` oder `Vielleicht` wird ein öffentliches Event automatisch in den persönlichen Kalender eingetragen.

## Technische Leitplanken

Events, private Events, Zugangsbeschränkungen, Gästelisten und Helferinformationen müssen serverseitig nach Sichtbarkeit geschützt werden. Warnungen und amtliche Veröffentlichungen benötigen klar getrennte Verwaltungsrechte.
