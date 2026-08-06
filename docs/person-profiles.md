# LG Nexus – Personenprofile

Dieses Dokument beschreibt die aktuell festgelegten Regeln für öffentliche Nexus-Personenprofile und persönliche Profil-Einstellungen.

## Profilbild

Jeder Bürger darf ein Profilbild hinterlegen.

- Das Bild wird über einen externen Bildlink eingebunden, nicht als direkter Nexus-Dateiupload.
- Nexus soll im Profil-Editor Hinweise auf geeignete kostenlose Bildhoster anbieten.
- Profilbild-URLs werden nur von ausdrücklich erlaubten Bildhostern akzeptiert.
- Ist kein Profilbild gesetzt, zeigt Nexus automatisch einen Avatar mit den Initialen des Bürgers.
- Für die Sichtbarkeit des Profilbilds gelten dieselben sechs Sichtbarkeitsstufen wie für Telefonnummer und Nexus-Mail.
- Die Stadtverwaltung darf unangemessene öffentliche Profilbilder moderieren beziehungsweise entfernen.
- Wird ein Profilbild durch die Stadtverwaltung moderiert oder entfernt, wird der betroffene Bürger benachrichtigt.

## Öffentliche Bio

Ein Bürger darf eine öffentliche Profilbeschreibung/Bio hinterlegen.

- Maximale Länge: **300 Zeichen**.
- Einfache Formatierung beziehungsweise Markdown ist erlaubt.
- Die Stadtverwaltung darf unangemessene Bio-Inhalte moderieren beziehungsweise entfernen.
- Wird eine Bio durch die Stadtverwaltung moderiert oder entfernt, wird der betroffene Bürger benachrichtigt.

## Persönlicher Statustext

Zusätzlich darf ein eigener kurzer Statustext gesetzt werden.

- Maximale Länge: **60 Zeichen**.
- Der Benutzer entscheidet selbst über die Sichtbarkeit.
- Ein Statustext kann automatisch nach einer vom Benutzer gewählten Zeit ablaufen.

Die genaue Zielgruppen-Auswahl für den Statustext wird separat festgelegt.

## Name und Nexus-ID

Der Name im Nexus-Personenprofil kann nicht verborgen werden.

Die Nexus-ID bleibt nach den bestehenden Nexus-Regeln ebenfalls die stabile, sichtbare Kennung des Bürgers.

## RP-Geburtsdatum

Für das RP-Geburtsdatum gelten dieselben sechs Sichtbarkeitsstufen wie für Telefonnummer und Nexus-Mail.

Zusätzlich kann der Bürger alternativ nur **Tag und Monat** seines Geburtstags freigeben, ohne das Geburtsjahr sichtbar zu machen.

Wenn das vollständige Geburtsdatum für einen Betrachter sichtbar ist, darf Nexus automatisch das aktuelle RP-Alter berechnen und anzeigen.

## Organisationsmitgliedschaften

Sichtbare Organisationsmitgliedschaften werden **nicht automatisch als Liste im Personenprofil eingeblendet**.

Die bereits festgelegten organisationsbezogenen Sichtbarkeits- und Suchregeln bleiben davon unberührt.

## Bewertungen

Vom Bürger abgegebene Organisationsbewertungen werden im öffentlichen Personenprofil angezeigt mit:

- Sternebewertung
- Organisation
- Bewertungstext

Ein Bürger kann einzelne eigene Bewertungen nicht nur für sein Personenprofil ausblenden, solange die Bewertung selbst öffentlich besteht.

Wird eine eigene Bewertung gelöscht, verschwindet sie automatisch auch aus dem Personenprofil.

## Online-/Offline-Status

Ein späterer aus FiveM übernommener Online-/Offline-Status im Personenprofil ist derzeit nicht vorgesehen.

## Favoriten

Private Organisations-Favoriten bleiben privat und erscheinen nicht im Personenprofil.

## Externe Profil-Links

Ein Personenprofil darf maximal **3 externe Links** enthalten.

- Jeder Link darf eine eigene sichtbare Bezeichnung besitzen.
- Erlaubt sind nur HTTP-/HTTPS-Adressen.
- Externe Profil-Links müssen vor ihrer öffentlichen Anzeige durch die Stadtverwaltung freigegeben werden.

## Aktivitätschronik und Profilaufrufe

- Es gibt keine öffentliche Aktivitätschronik eines Bürgers.
- Ein Bürger sieht nicht, wer sein Profil angesehen hat.

## Blockieren

Bürger können andere Nexus-Benutzer blockieren.

Aktuell gilt:

- Eine Blockierung verhindert **nicht** automatisch direkte Bürger-zu-Bürger-Nexus-Mails.
- Der blockierte Benutzer kann das öffentliche Profil des Blockierenden nicht mehr sehen.
- Der blockierte Benutzer sieht öffentliche Kommentare und Bewertungen des Blockierenden nicht mehr.
- Wenn beide Personen derselben Organisation angehören, bleiben notwendige interne Organisationskontakte weiterhin möglich.
- Offizielle Stadtverwaltungs- und Nexus-Systemmeldungen umgehen eine Benutzer-Blockierung immer.
- Der blockierte Benutzer wird nicht darüber informiert, dass er blockiert wurde.
- Die eigene Blockierliste ist ausschließlich für den jeweiligen Benutzer selbst sichtbar.
- Eine Blockierung kann jederzeit wieder aufgehoben werden.

Die Auswirkungen auf bestehende Mailthreads und weitere direkte Kontaktfunktionen können im Nexus-Mail-Konzept noch genauer ausgearbeitet werden.

## Profil melden und Moderation

Ein Bürger darf ein anderes Personenprofil melden.

Eine Profilmeldung verwendet:

- feste Meldegründe
- optionalen Freitext

Die Identität des Meldenden bleibt gegenüber dem gemeldeten Bürger verborgen.

Der gemeldete Bürger wird unmittelbar darüber benachrichtigt, dass sein Profil gemeldet wurde, jedoch ohne die Identität des Meldenden offenzulegen.

Die Stadtverwaltung darf öffentliche Profilinhalte wie Profilbild und Bio moderieren beziehungsweise entfernen und informiert den betroffenen Bürger über die Maßnahme.

## Personalisierung

Jeder Benutzer darf innerhalb von Nexus ein persönliches Farbschema auswählen.

Die genaue Reichweite dieser Personalisierung – beispielsweise nur Akzentfarbe oder vollständiges Theme – wird noch separat festgelegt.

## Sprache, Zeit- und Datumsformat

Aktuell gilt:

- Sprache: nur Deutsch
- Zeitformat: 24-Stunden-Format
- Datumsformat: `TT.MM.JJJJ`

## Technische Zielstruktur

Für die spätere Umsetzung werden voraussichtlich benötigt:

- externe Profilbild-URL mit Hoster-Allowlist
- Profilbild-Sichtbarkeit über die sechs Nexus-Stufen
- Initialen-Fallback-Avatar
- Bio mit 300-Zeichen-Limit und einfacher Formatierung
- Statustext mit Sichtbarkeit und optionalem Ablauf
- RP-Geburtsdatum-Sichtbarkeit über die sechs Nexus-Stufen
- optional Tag/Monat-only-Freigabe
- externe Profil-Links mit Freigabestatus
- veröffentlichte abgegebene Organisationsbewertungen
- Benutzer-Blockierungen
- Profilmeldungen und Moderationsstatus
- persönliche Farbschema-Einstellung

Profilbezogene Sichtbarkeitsentscheidungen müssen serverseitig durchgesetzt werden; versteckte Daten dürfen weder direkt noch über Suche/API-Nebenwege offengelegt werden.