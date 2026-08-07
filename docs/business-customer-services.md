# LG Nexus – Unternehmensangebote, Kundenanfragen und Reservierungen

Dieses Dokument beschreibt die festgelegten Regeln für öffentliche Angebotskataloge von Organisationen, Kundenanfragen und Reservierungen.

## Öffentlicher Angebots-/Leistungskatalog

Öffentliche Organisationsprofile können einen eigenen Katalog für **Produkte und Dienstleistungen** besitzen.

Jeder Katalogeintrag besitzt mindestens:

- Titel
- Beschreibung
- Preisangabe
- Verfügbarkeitsstatus

### Preise

Preise können flexibel dargestellt werden als:

- Festpreis
- Preisspanne
- auf Anfrage
- kostenlos

Geldbeträge werden standardmäßig als RP-Dollar (`$`) dargestellt.

### Kategorien und Verfügbarkeit

Jede Organisation darf eigene Katalogkategorien anlegen.

Ein Angebot kann folgende Verfügbarkeitszustände verwenden:

- Verfügbar
- Eingeschränkt
- Nicht verfügbar

Ein Angebot darf vorübergehend ausgeblendet werden, ohne es zu löschen.

Zusätzlich kann ein Angebot einen Gültigkeitszeitraum besitzen. Nach Ablauf wird es automatisch aus der öffentlichen Darstellung ausgeblendet.

### Bilder

Angebote dürfen externe Bildlinks verwenden.

Pro Angebot sind maximal **3 Bilder** vorgesehen.

### Standorte

Ein Angebot kann einer bestimmten Filiale beziehungsweise einem Organisationsstandort zugeordnet werden.

### Öffentliche Suche

LG Nexus besitzt eine stadtweite öffentliche Suche nach angebotenen Produkten und Dienstleistungen.

Filter:

- Kategorie
- Organisation
- Öffnungsstatus

Sortierung:

- Name
- Preis
- Bewertung

Organisationen dürfen einzelne Angebote als `Hervorgehoben` markieren.

### Verwaltung

Der Katalog wird über das Rollenrecht `Angebote verwalten` gepflegt.

Änderungen am Angebotskatalog werden nicht zusätzlich protokolliert.

Eine öffentliche Preisliste wird nicht als PDF exportiert.

## Öffentliche Organisationsgalerie

Ein öffentliches Organisationsprofil darf eine Bildergalerie besitzen.

- Bilder werden über externe Bildlinks eingebunden.
- Es gibt keine feste maximale Anzahl an Galeriebildern.
- Bilder dürfen eine kurze Bildunterschrift besitzen.
- Verwaltung erfolgt über das Rollenrecht `Galerie verwalten`.

## Öffnungsstatus bei mehreren Filialen

Zusätzlich zum zentralen Organisationsstatus darf jede Filiale einen eigenen Öffnungsstatus besitzen.

Besucher sehen den Status jeder einzelnen Filiale.

Auf der zentralen Organisationskarte ist der **niedrigste Status aller Filialen** maßgeblich. Damit wird beispielsweise eine teilweise eingeschränkte oder geschlossene Filiallage auch auf der zentralen Darstellung sichtbar.

Ein öffentlich angezeigter `aktuell erreichbarer Ansprechpartner` ist derzeit nicht vorgesehen.

## Öffentliche FAQ

Jede Organisation darf einen öffentlichen FAQ-Bereich betreiben.

- Verwaltung über das Rollenrecht `FAQ verwalten`.
- Antworten unterstützen formatierten Text beziehungsweise Markdown.

Interne Profilstatistiken wie Seitenaufrufe oder Favoritenzahl sind für Owner derzeit nicht vorgesehen.

# Kundenanfragen

## Direkte Anfrage aus dem Organisationsprofil

Ein Bürger kann direkt vom öffentlichen Organisationsprofil aus eine Service-/Kundenanfrage senden.

Technisch wird die Anfrage als **eigener Thread im Organisations-Mail-System** geführt.

Die Organisation kann:

- eigene Anfragearten definieren
- je Anfrageart eigene Formularfelder und Fragen festlegen

## Status

Kundenanfragen verwenden:

- Neu
- In Bearbeitung
- Rückfrage
- Erledigt
- Abgelehnt

Eine Anfrage kann mehreren Mitarbeitern gleichzeitig zugewiesen werden.

## Kommentare und Kommunikation

Kundenanfragen besitzen interne Kommentare.

Nach aktueller Festlegung darf der anfragende Bürger diese Kommentare **sehen**. Die Bezeichnung `intern` beschreibt damit die technische Kommentarfunktion innerhalb des Anfrage-Threads, nicht eine verborgene Mitarbeiterebene.

Der Bürger darf externe Links zu seiner Anfrage hinzufügen.

Die Organisation kann direkt innerhalb der Anfrage offiziell antworten.

Bei jeder Statusänderung erhält der Bürger eine Nexus-Benachrichtigung.

## Bearbeitung durch den Bürger

Ein Bürger darf:

- eine noch offene Anfrage zurückziehen
- die Anfrage nach dem Absenden noch bearbeiten, **bis die Organisation mit der Bearbeitung beginnt**

Abgeschlossene Kundenanfragen werden **6 Monate** gespeichert.

# Reservierungen und Kundentermine

## Aktivierung

Organisationen können über Nexus Reservierungen beziehungsweise Kundentermine anbieten.

Jede Organisation entscheidet selbst, ob diese Funktion aktiviert ist.

## Terminfenster

Verfügbare Terminfenster werden **manuell durch die Organisation** angelegt.

Sie werden nicht automatisch aus dem internen Organisationskalender erzeugt.

Pro Terminfenster ist die maximale Anzahl an Buchungen frei konfigurierbar.

## Buchung und Bestätigung

Eine Kundenbuchung muss durch die Organisation bestätigt werden.

Nach Bestätigung:

- erscheint die Reservierung automatisch im persönlichen Nexus-Kalender des Bürgers
- erscheint sie automatisch im internen Organisationskalender
- erhält der Bürger feste Erinnerungen **24 Stunden** und **1 Stunde** vor dem Termin

## Stornierung

Der Bürger darf eine bestätigte Reservierung selbst stornieren.

Dabei ist ein Stornierungsgrund Pflicht.

Die Organisation darf eine Reservierung ebenfalls absagen und dabei einen Grund angeben.

## Kapazität und Warteliste

Ist ein Terminfenster ausgebucht, wird eine Warteliste verwendet.

Die Anzahl bereits gebuchter Plätze ist öffentlich **nicht sichtbar**.

Bei einer Buchung kann ein Bürger mehrere teilnehmende Personen als Personenanzahl angeben.

## Nicht erschienen / No-Show

Die Organisation darf einen Termin nachträglich als `Nicht erschienen` markieren.

Eine interne Historie früherer No-Shows eines Bürgers darf für die Organisation sichtbar sein.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- Organisations-Angebote mit Typ Produkt/Dienstleistung
- organisationsdefinierte Angebotskategorien
- Preisart und RP-Dollar-Anzeige
- Angebotsstatus, Sichtbarkeit und Gültigkeitszeitraum
- bis zu drei externe Bildlinks je Angebot
- Standortzuordnung
- stadtweite Angebots-Suche, Filter und Sortierung
- öffentliche Organisationsgalerie
- filialbezogene Öffnungsstatus
- Organisations-FAQ
- Kundenanfragearten und dynamische Formulare
- Kundenanfragen als spezialisierte Organisations-Mail-Threads
- Mehrfachzuweisung, Kommentare, Status und 6-Monats-Aufbewahrung
- manuell definierte Reservierungs-Zeitfenster
- Kapazitäten, Wartelisten und Bestätigungsworkflow
- Kalenderverknüpfungen und feste Reservierungserinnerungen
- No-Show-Status und interne No-Show-Historie

Alle organisationsinternen Verwaltungsrechte müssen serverseitig geprüft werden. Öffentliche Angebots-, Galerie- und Reservierungsdaten dürfen keine verborgenen Mitglieds- oder Kontaktdaten offenlegen.