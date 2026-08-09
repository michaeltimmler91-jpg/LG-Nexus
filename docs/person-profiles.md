# LG Nexus – Personenprofile

Dieses Dokument beschreibt den verbindlichen Stand der Personenprofile und persönlichen Profilfunktionen bis Frage 3410.

## Profilbild

Jeder Bürger darf ein Profilbild über einen externen Bildlink hinterlegen.

- nur erlaubte Bildhoster
- Initialen-Fallback ohne Bild
- sechs Sichtbarkeitsstufen wie Telefon/Nexus-Mail
- Stadtverwaltung darf unangemessene öffentliche Profilbilder moderieren
- Betroffener wird bei Moderation/Entfernung benachrichtigt

Temporäre Profilbilder sind nicht vorgesehen.

## Bio und Statustext

Öffentliche Bio:

- maximal 300 Zeichen
- einfache Formatierung/Markdown
- moderierbar

Persönlicher Statustext:

- maximal 60 Zeichen
- eigene Sichtbarkeit
- optionaler automatischer Ablauf

## Name und Nexus-ID

Name und Nexus-ID bleiben die stabilen sichtbaren Identifikationsmerkmale nach den festgelegten Such-/Accountregeln.

RP-Namensänderungen laufen über Stadtverwaltungsantrag. Frühere RP-Namen bleiben nur intern im Identitätsverlauf nachvollziehbar.

## Geburtsdatum

RP-Geburtsdatum verwendet die sechs Sichtbarkeitsstufen. Optional kann nur Tag/Monat freigegeben werden. Wenn das vollständige Datum sichtbar ist, darf Nexus das RP-Alter berechnen.

Geburtstage im Kalender werden **nicht automatisch aus diesem Profilfeld erzeugt**. Geburtstage werden manuell als Kalendereinträge gepflegt.

## Organisationsmitgliedschaften

Mitgliedschaften werden nicht automatisch als eigene Profilliste eingeblendet. Organisationsbezogene Sichtbarkeit und Suche richten sich nach den Organisationsregeln.

## Bewertungen

Öffentliche vom Bürger abgegebene Organisationsbewertungen können im Profil erscheinen mit Sternezahl, Organisation und Text.

Eine aktive öffentliche Bewertung kann nicht nur für das Profil ausgeblendet werden. Wird sie gelöscht, verschwindet sie auch aus dem Profil.

## Profil-Badges

Nexus unterstützt zwei getrennte Badge-Arten.

### Frei wählbare verliehene Badges

- werden durch die Stadtverwaltung erstellt/verliehen
- Bürger kann nur aus tatsächlich erhaltenen Badges wählen
- Bürger entscheidet selbst, welche erhaltenen Badges im Profil angezeigt werden
- sichtbare Badges sind öffentlich
- Badges sind kein Suchkriterium
- die Stadtverwaltung kann ein verliehenes Badge wieder entziehen/deaktivieren

### Offizielle verifizierte Rollen-Badges

Offizielle Rollen-/Funktionsbadges können beispielsweise eine verifizierte Zugehörigkeit/Funktion darstellen.

- werden durch die zuständige Organisations-/Leitungslogik erzeugt
- öffentlich sichtbar
- kein Suchkriterium
- verschwinden automatisch, sobald die notwendige Rolle oder Organisationszugehörigkeit verloren geht

Game-Achievements sind **keine Profil-Badges** und erscheinen nicht im Personenprofil.

## Favorisierte Personenprofile

Bürger dürfen Personenprofile privat favorisieren.

- nur der favoritisierende Bürger sieht diese Favoriten
- Favorisieren erzeugt keine Benachrichtigung beim favorisierten Bürger
- bei nicht mehr zugänglichem Profil entsteht kein Berechtigungs-Override

## Nicht vorgesehen

- Pronomen-/Anredefeld im RP-Profil
- Profilbanner
- temporäre Profilbilder
- gruppenspezifische Gesamtprofil-Sichtbarkeit
- individuelle Freigabelisten pro Profilfeld
- Profil-Suchbarkeit unabhängig von der Feldsichtbarkeit
- Ausblenden einzelner öffentlicher Bewertungen nur aus Suchansichten
- öffentliche Game-Achievements im Profil
- öffentliche Favoritenlisten

## Externe Profil-Links

Maximal 3 externe Links.

- HTTP/HTTPS
- sichtbare Bezeichnung
- öffentliche Anzeige erst nach Stadtfreigabe

## Online-/Offline

Ein aus FiveM synchronisierter persönlicher Online-/Offline-Status ist nicht vorgesehen.

## Blockieren

Bürger können andere Nutzer blockieren.

- direkte Bürger-Mails werden während Blockierung nicht zugestellt und nach Entblocken gemäß bestehender Mailregel nachgeliefert
- vorhandene Threads bleiben lesbar
- blockierter Nutzer sieht Profil/öffentliche Kommentare/Bewertungen des Blockierenden nicht
- notwendige gemeinsame Organisationsarbeit bleibt möglich
- Stadt-/Systemmeldungen umgehen Benutzerblockierung
- Blockierung bleibt für blockierten Nutzer verborgen

Ein komplettes Blockieren einer gesamten Organisation für Direktkontakt ist nicht vorgesehen.

## Profil melden und Moderation

Profile können mit festen Meldegründen und optionalem Freitext gemeldet werden.

Identität des Meldenden bleibt gegenüber dem Gemeldeten verborgen. Öffentliche Profilinhalte dürfen moderiert werden.

## Personalisierung

- Hell-/Dunkelmodus, Standard Dunkel
- persönliche Akzentfarbe
- High-Contrast-Modus als persönliche Einstellung

V1 ist primär auf feste Desktop-/Tablet-Darstellung ausgelegt; eine spezielle Smartphone-Navigation ist nicht vorgesehen.

## Sprache und Formate

- Deutsch
- 24-Stunden-Format
- `TT.MM.JJJJ`

## Sicherheit

Profil- und Privatsphäreentscheidungen werden serverseitig durchgesetzt. Versteckte Daten dürfen nicht über Suche, APIs, Favoriten oder direkte Bild-/Datensatz-IDs offengelegt werden.
