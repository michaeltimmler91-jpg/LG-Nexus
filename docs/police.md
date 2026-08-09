# LG Nexus – Police

Dieses Dokument beschreibt den verbindlichen Stand des Police-Moduls bis Frage 3410.

## Personensuche und Fälle

PD besitzt eine interne Personensuche nach Name und Nexus-ID sowie ein eigenes Fall-/Aktensystem.

Jeder Fall:

- eindeutige Fallnummer
- Titel/Kurzbeschreibung
- Status `Neu / Ermittlung / Prüfung / Abgeschlossen / Archiviert`
- Beteiligte mit Rollen wie Beschuldigter, Opfer, Zeuge, Sonstige
- federführender Ermittler + mehrere weitere Ermittler

Neue Fälle nur mit passendem Rollenrecht; Bearbeitung über `Fälle bearbeiten`.

Fälle besitzen interne Ermittlungs-Zeitleiste, Kommentare, @-Erwähnungen und entsprechende Benachrichtigungen.

## Fallbeziehungen und strukturierte Verknüpfungen

Zusätzlich vorgesehen:

- Beziehungen zwischen mehreren PD-Fällen
- Personenbeziehungen innerhalb eines Falls
- Fahrzeugbeziehungen innerhalb eines Falls
- interne Ermittlungsaufträge
- Observationen als eigene Vorgangsart

Diese Inhalte können zusätzlich zum allgemeinen Modulzugriff fall-/vorgangsbezogene Berechtigungen verlangen.

## Bürgeransicht

Bürger sehen PD-Fälle nicht automatisch vollständig. PD kann ausdrücklich eine Zusammenfassung beziehungsweise ausgewählte Inhalte veröffentlichen.

Die vertieften Fallbeziehungen, Observationen und internen Ermittlungsaufträge bleiben standardmäßig verborgen.

## Geschützte Fälle

Rollen-/rangabhängige Sichtbarkeit und versiegelte Fälle bleiben vorgesehen.

Beim Versiegeln:

- Sonderrecht
- Grund Pflicht
- Versiegeler gespeichert
- unberechtigte Nutzer sehen den Fall nicht einmal als Suchplatzhalter

Opfer-/Zeugenidentitäten können zusätzlich geschützt werden.

## Historie und Abschluss

Fallnotizen besitzen Versionsverlauf. Abschlussgrund Pflicht. Abgeschlossene Fälle werden nicht normal wieder geöffnet.

Abgeschlossene PD-Fälle: **12 Monate** Aufbewahrung.

Bei `disabled` bleiben historischer Name und Nexus-ID in alten Fällen erhalten.

Kein PDF-Export.

## Beweismittel

Jedes Beweismittel:

- eindeutige Beweisnummer
- Typ Foto/Video/Gegenstand/Dokument/Sonstiges
- Lager-/Aufbewahrungsort
- Chain of Custody
- Grund/Zweck je Übergabe
- externe Link-Anhänge
- Korrekturen/Linkänderungen versioniert

Zusätzlich:

- Beweismittel-Gruppierungen
- digitale Asservaten-/Lagerorte
- gezielte Beweisfreigaben an Justice

Justice arbeitet mit freigegebenen/verknüpften PD-Beweisen nur lesend und verändert die PD-Chain nicht.

Ein Beweismittel kann mit besonderem Sonderrecht endgültig gelöscht werden; die allgemein beschlossene Medical-Nichtlöschregel gilt nicht für PD-Beweismittel.

## Aussagen / Vernehmungen

Neben strukturierten Aussagen unterstützt PD **Vernehmungsprotokolle** als eigene strukturierte Einträge.

## BOLO / Fahndung

Personen-/Fahrzeug-BOLOs mit Priorität Niedrig/Normal/Hoch/Dringend, optionalem Ablauf und automatischer Archivierung.

Manuelles Beenden benötigt Grund.

Gesucht-Status:

- Pflichtgrund
- mehrere aktive Gründe
- Verknüpfung zu einem oder mehreren Fällen
- Bürger sieht ihn nur bei ausdrücklicher PD-Freigabe

Zusätzlich können **interne Fahndungsnotizen** geführt werden; sie sind nicht automatisch Bürger-sichtbar.

## Fahrzeuge

Interne Kennzeichensuche kann Halter, Modell und Farbe anzeigen.

Fahrzeugflags mit optionalem Ablauf und eigenem Rollenrecht.

Eine direkte FiveM-/ESX-Synchronisation von Kennzeichen oder Halterdaten ist nach aktuellem Integrationsplan nicht vorgesehen.

## Verwarnungen und Bußgelder

Bußgelder:

- eindeutige Vorgangsnummer
- optional Fallverknüpfung
- Status Offen/Bezahlt/Erlassen/Storniert
- Bürger sieht eigene offenen/erledigten Bußgelder
- Einspruch über Nexus möglich
- Einspruch kann Justice-Vorgang erzeugen

Tatbestandskatalog über `Tatbestandskatalog verwalten`, mit Standardbetrag und optionalen Haft-/Maßnahmenwerten.

## Justice-Anbindung

PD kann von Justice definierte Befehle beantragen. Status im PD-Fall sichtbar.

Bei Antrag können Fall und relevante Beweise automatisch verknüpft werden.

Gezielte Beweisfreigaben an Justice sind möglich, ohne Justice Änderungsrechte am PD-Beweis zu geben.

## Gemeinsame Vorfälle

PD-Fall kann mit gemeinsamem Vorfall verknüpft sein. Andere Fraktionen sehen nur gemeinsame Basisdaten und ausdrücklich freigegebene PD-Inhalte.

## Externe Freigaben

Vertiefte PD-Inhalte werden an andere Fraktionen/Behörden nur gezielt über einen formellen Freigabe-/Verknüpfungsprozess sichtbar. Es gibt keinen allgemeinen fremden Modulleserechts-Override.

## Stadtverwaltung und Systemadministration

- Stadtverwaltung: **kein** Zugriff auf interne PD-Fälle
- technische System-Admins: ebenfalls **kein automatischer fachlicher PD-Zugriff**

Externe Lesezugriffe werden weiterhin nicht pauschal in einem eigenen PD-Zugriffslog protokolliert; Änderungen an vertieften Daten bleiben nachvollziehbar/versioniert.

## Technische Leitplanken

Erforderlich sind Fälle, Fallbeziehungen, Beteiligten-/Fahrzeugbeziehungen, Beweisgruppen, Asservatenorte, Vernehmungen, Ermittlungsaufträge, Observationen und formelle Justice-Freigaben.

PD-Daten werden serverseitig nach Rolle, Fallzugehörigkeit, Versiegelung und expliziter Freigabe geschützt.
