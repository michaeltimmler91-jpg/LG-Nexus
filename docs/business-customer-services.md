# LG Nexus – Unternehmensangebote, Kundenanfragen und Reservierungen

Dieses Dokument beschreibt den verbindlichen Stand für öffentliche Angebotskataloge, Kundenanfragen und Reservierungen bis Frage 3410.

## Öffentlicher Angebots-/Leistungskatalog

Öffentliche Organisationsprofile können einen Katalog für **Produkte und Dienstleistungen** besitzen.

Jeder Eintrag besitzt mindestens Titel, Beschreibung, Preisangabe und Verfügbarkeitsstatus. Die Beschreibung ist auf **3000 Zeichen** begrenzt.

### Preise und Varianten

Preisarten:

- Festpreis
- Preisspanne
- auf Anfrage
- kostenlos

Standardwährung ist RP-Dollar (`$`).

Zusätzlich unterstützt Nexus:

- Angebotsvarianten, z. B. Basic/Premium
- eigene Preise je Variante
- optionale Zusatzleistungen
- standortabhängige Preise
- Angebots-Bundles/Pakete
- Mindest-/Maximalbestellmengen
- individuelle Preisangebote auf Kundenanfrage
- Rabatt-/Aktionsangebote
- zeitlich begrenzte Sonderaktionen

Eine separate interne Artikel-/Leistungsnummer ist nicht vorgesehen.

### Kategorien, Verfügbarkeit und Laufzeit

Organisationen dürfen eigene Kategorien anlegen.

Verfügbarkeit:

- Verfügbar
- Eingeschränkt
- Nicht verfügbar

Weitere Darstellungen:

- `ausverkauft`
- öffentlich sichtbare sofortige Verfügbarkeit
- öffentliche Liefer-/Wartezeithinweise
- `nur mit Termin/Reservierung`

Eine allgemeine zusätzliche Auslastungsampel `frei / wenig Kapazität / ausgelastet` ist nicht vorgesehen.

Angebote dürfen zeitlich gültig sein und danach automatisch aus der öffentlichen Darstellung verschwinden. Entfernte/deaktivierte vertiefte Angebotsobjekte werden grundsätzlich 30 Tage im Papierkorb gehalten.

### Bilder und Standorte

- externe Bildlinks
- maximal 3 Bilder pro Angebot
- ein Angebot gilt entweder allgemein oder ist genau **einem** Organisationsstandort zugeordnet; keine gleichzeitige Mehrfach-Standortzuordnung

### Suche und Favoriten

Stadtweite Suche nach Produkten/Dienstleistungen mit Filtern nach Kategorie, Organisation und Öffnungsstatus sowie Sortierung nach Name, Preis und Bewertung.

Organisationen dürfen Angebote hervorheben.

Bürger können einzelne Angebote privat favorisieren. Favorisierte Angebote erscheinen in einer persönlichen Merkliste.

Einzelne Angebote erhalten keine eigene Bewertung; bewertet wird weiterhin die Organisation.

### Verwaltung

Grundverwaltung über `Angebote verwalten`; vertiefte Angebotsarten können über passende eigene Rollenrechte gesteuert werden.

Bei erweiterten Angebotsfunktionen gilt grundsätzlich:

- Sichtbarkeit je Eintrag konfigurierbar
- öffentliche Auffindbarkeit nur, wenn der Eintrag öffentlich freigegeben ist
- Benachrichtigungen nur bei wesentlichen Änderungen

Normale Änderungen am Basiskatalog werden nicht zusätzlich auditiert. Kein öffentlicher PDF-Preislistenexport.

## Organisationsgalerie, Filialstatus und FAQ

Öffentliche Organisationsgalerie:

- externe Bildlinks
- unbegrenzte Bildanzahl
- Bildunterschriften
- Verwaltung über `Galerie verwalten`

Filialen dürfen eigene Öffnungsstatus besitzen. Auf der zentralen Organisationskarte ist der **niedrigste Status aller Filialen** maßgeblich.

Kein öffentlicher `aktuell erreichbarer Ansprechpartner`.

Öffentliche FAQ:

- Verwaltung über `FAQ verwalten`
- formatierter Text/Markdown

Owner erhalten keine zusätzlichen Profilstatistiken wie Seitenaufrufe oder Favoritenzahl.

# Kundenanfragen

Ein Bürger kann direkt aus einem Organisationsprofil beziehungsweise aus einem konkreten Angebot eine Kunden-/Serviceanfrage starten.

Technisch ist die Anfrage ein spezialisierter Thread im Organisations-Mail-System.

Organisationen dürfen eigene Anfragearten sowie dynamische Formularfelder definieren.

Status:

- Neu
- In Bearbeitung
- Rückfrage
- Erledigt
- Abgelehnt

Mehrere Mitarbeiter können gleichzeitig zugewiesen werden.

Kommentare innerhalb des Anfrage-Threads sind nach aktueller Festlegung **für den Bürger sichtbar**. Die Organisation kann offiziell antworten, der Bürger externe Links ergänzen.

Bei jeder Statusänderung erhält der Bürger eine Nexus-Benachrichtigung.

Der Bürger darf:

- offene Anfrage zurückziehen
- bis zum Bearbeitungsbeginn bearbeiten

Abgeschlossene Kundenanfragen werden 6 Monate gespeichert.

Kundenanfragen können als interne Aufgabe ins Taskboard übernommen werden.

# Reservierungen und Kundentermine

## Aktivierung und Terminfenster

Organisationen entscheiden selbst, ob Reservierungen angeboten werden.

Terminfenster werden manuell durch die Organisation angelegt, nicht automatisch aus dem Organisationskalender erzeugt.

Pro Fenster ist eine Kapazität definierbar. Bereits gebuchte Platzanzahl wird öffentlich nicht angezeigt.

Ein Angebot kann mit einer Reservierungsart verknüpft sein. Aus einem Angebot heraus kann ein Bürger direkt einen verfügbaren Termin wählen.

Je Reservierungsart können festgelegt werden:

- zugehörige Angebote
- maximale Buchungsweite im Voraus
- zusätzliche Formularfragen

Eine Mindestvorlaufzeit ist nicht vorgesehen.

## Buchung und Status

Eine Buchung benötigt Organisationsbestätigung.

Interne Reservierungsstatus:

- Neu
- Bestätigt
- In Bearbeitung
- Erledigt
- Storniert
- No-Show

Nach Bestätigung:

- persönlicher Kalender des Bürgers
- interner Organisationskalender
- Erinnerungen 24 Stunden und 1 Stunde vorher

## Verschieben und Umbuchen

Sowohl Bürger als auch Organisation dürfen eine Reservierung umbuchen.

Verschiebt die Organisation einen Termin, wird der Bürger benachrichtigt und muss dem neuen Termin **erneut zustimmen**.

Wiederkehrende Kundenreservierungen und Reservierungen mit mehreren Zeitabschnitten sind vorgesehen.

Gruppen-/Veranstaltungsreservierungen sind ebenfalls vorgesehen.

## Notizen

Organisationen können Reservierungsnotizen führen. Nach der aktuell festgelegten Sichtbarkeit darf der Bürger diese Notizen sehen.

Ein separates zusätzliches Workflow-System nur für Kunden- oder interne Reservierungsnotizen ist nicht vorgesehen.

## Stornierung

Der Bürger darf eine bestätigte Reservierung stornieren; Grund ist Pflicht.

Die Organisation darf ebenfalls absagen und einen Grund angeben.

## Warteliste

Bei ausgebuchten Terminfenstern gibt es eine Warteliste.

Eine manuelle Änderung der Wartelisten-Priorität ist erlaubt, jedoch nur intern berechtigt und mit:

- Pflichtgrund
- Protokollierung der Änderung

Eine eigene Nachrück-/Annahmefrist ist nicht vorgesehen.

## No-Show

Organisation darf `No-Show` setzen und eine interne No-Show-Historie sehen.

Eine automatische Reservierungssperre bei wiederholten No-Shows ist nicht vorgesehen.

## Aufbewahrung und Taskboard

Erledigte Reservierungen bleiben als Kerndatensatz **6 Monate** gespeichert.

Nach Abschluss kann der Bürger automatisch zur Organisationsbewertung eingeladen werden.

Reservierungen können als interne Aufgabe ins Taskboard übernommen werden.

## Technische Leitplanken

Benötigt werden insbesondere:

- Angebote, Kategorien, Varianten, Zusatzleistungen, Preisarten und zeitliche Aktionen
- standortbezogene Preise und Verfügbarkeit
- private Angebotsfavoriten
- Anfragearten und dynamische Formulare
- Kundenanfragen als Mail-Threads
- Reservierungsarten, Terminfenster, Kapazitäten und Status
- wiederkehrende und mehrteilige Reservierungen
- Umbuchung mit erneuter Zustimmung bei Organisationsverschiebung
- Warteliste mit begründeter manueller Priorisierung
- Kalender- und Taskboard-Verknüpfungen
- 6-Monats-Aufbewahrung abgeschlossener Reservierungen

Alle internen Verwaltungsrechte müssen serverseitig geprüft werden. Öffentliche Angebots- und Reservierungsdaten dürfen keine verborgenen Mitglieds- oder Kontaktdaten offenlegen.
