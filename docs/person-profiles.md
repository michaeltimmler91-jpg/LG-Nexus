# LG Nexus – Personenprofile

Dieses Dokument beschreibt die aktuell festgelegten Regeln für öffentliche Nexus-Personenprofile und persönliche Profil-Einstellungen.

## Profilbild

Jeder Bürger darf ein Profilbild hinterlegen.

- Das Bild wird über einen externen Bildlink eingebunden, nicht als direkter Nexus-Dateiupload.
- Nexus soll im Profil-Editor Hinweise auf geeignete kostenlose Bildhoster anbieten.
- Der Benutzer entscheidet selbst, für wen das Profilbild sichtbar ist.
- Die genauen auswählbaren Sichtbarkeitsstufen werden noch separat festgelegt.
- Die Stadtverwaltung darf unangemessene öffentliche Profilbilder moderieren beziehungsweise entfernen.

## Öffentliche Bio und Statustext

Ein Bürger darf eine kurze öffentliche Profilbeschreibung/Bio hinterlegen.

Zusätzlich darf ein eigener kurzer Statustext gesetzt werden.

Die Stadtverwaltung darf eine unangemessene öffentliche Bio moderieren beziehungsweise entfernen.

## Name und Nexus-ID

Der Name im Nexus-Personenprofil kann nicht verborgen werden.

Die Nexus-ID bleibt nach den bestehenden Nexus-Regeln ebenfalls die stabile, sichtbare Kennung des Bürgers.

## RP-Geburtsdatum

Der Bürger entscheidet selbst, ob beziehungsweise für wen sein RP-Geburtsdatum im Profil sichtbar ist.

Die genaue Auswahl der Sichtbarkeitsstufen wird noch separat festgelegt.

## Organisationsmitgliedschaften

Sichtbare Organisationsmitgliedschaften werden **nicht automatisch als Liste im Personenprofil eingeblendet**.

Die bereits festgelegten organisationsbezogenen Sichtbarkeits- und Suchregeln bleiben davon unberührt. Eine öffentlich sichtbare Mitgliedschaft kann also an den dafür vorgesehenen Organisations-/Suchstellen erscheinen, ohne automatisch Teil des Personenprofils zu werden.

## Bewertungen

Vom Bürger abgegebene Organisationsbewertungen dürfen im öffentlichen Personenprofil angezeigt werden.

## Online-/Offline-Status

Ein späterer aus FiveM übernommener Online-/Offline-Status im Personenprofil ist derzeit nicht vorgesehen.

## Favoriten

Private Organisations-Favoriten bleiben privat und erscheinen nicht im Personenprofil.

## Externe Links

Ein Personenprofil darf externe Links enthalten.

## Aktivitätschronik und Profilaufrufe

- Es gibt keine öffentliche Aktivitätschronik eines Bürgers.
- Ein Bürger sieht nicht, wer sein Profil angesehen hat.

## Blockieren

Bürger können andere Nexus-Benutzer für direkte Kontakte beziehungsweise direkte Mails blockieren.

Die konkrete Wirkung der Blockierung auf bestehende Threads, Organisations-Mail und amtliche/behördliche Kontakte wird noch separat festgelegt.

## Profil melden und Moderation

Ein Bürger darf ein anderes Personenprofil melden.

Die Stadtverwaltung darf öffentliche Profilinhalte wie Profilbild und Bio moderieren beziehungsweise entfernen.

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

- externe Profilbild-URL
- Profilbild-Sichtbarkeit
- Bio
- Statustext
- RP-Geburtsdatum-Sichtbarkeit
- externe Profil-Links
- veröffentlichte abgegebene Organisationsbewertungen
- Benutzer-Blockierungen
- Profilmeldungen und Moderationsstatus
- persönliche Farbschema-Einstellung

Profilbezogene Sichtbarkeitsentscheidungen müssen serverseitig durchgesetzt werden; versteckte Daten dürfen weder direkt noch über Suche/API-Nebenwege offengelegt werden.