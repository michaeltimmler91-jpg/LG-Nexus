# LG Nexus – Privatsphäre-Einstellungen

Dieses Dokument beschreibt den verbindlichen Stand persönlicher Sichtbarkeit und Privatsphäre bis Frage 3410.

## Grundregel

Persönliche Daten werden nicht automatisch für andere Nutzer freigegeben, wenn für das Feld eine Sichtbarkeitseinstellung vorgesehen ist.

Die gewählte Sichtbarkeit gilt auch gegenüber Behörden. Es gibt keinen pauschalen Behörden-Override.

## Sichtbarkeitsstufen

Für Telefonnummer, Nexus-Mail, Profilbild und vollständiges RP-Geburtsdatum gelten:

- `nobody` – Niemand
- `citizens` – Nur freigeschaltete Nexus-Bürger
- `authorities` – Nur Behörden / staatliche Stellen
- `citizens_and_authorities` – Bürger + Behörden
- `own_organization` – Nur eigene Firma / Organisation
- `everyone` – Alle

Telefonnummer und Nexus-Mail starten standardmäßig auf `nobody`.

Bei `own_organization` gilt die Freigabe für alle aktiven Organisationen, denen der Bürger angehört. Es gibt keine Hauptorganisation.

## Telefonnummer

Telefonnummer ist optional, durch aktiven Bürger änder-/entfernbar und nur gemäß aktueller Sichtbarkeit anzeigbar/suchbar.

Auch PD, Medical, FD und Stadtverwaltung erhalten keinen pauschalen Profil-Telefonzugriff.

## Nexus-Mail

Die interne Nexus-Mail entsteht bei Freischaltung. Der Bürger steuert ihre Sichtbarkeit.

Die Einstellung bestimmt:

- Anzeige im Profil
- exakte Suche
- zulässige Wege der Empfängerauswahl bei Bürger-Mail

Ist die Nexus-Mail für einen Absender verborgen, darf die Empfängerauswahl keine indirekte Offenlegung erzeugen.

## Neue Direktkontakte

Zusätzlich kann ein Bürger neue direkte Bürgerkontakte über Nexus-Mail durch eine persönliche Privatsphäre-Einstellung sperren.

Diese Sperre gilt für neue direkte Bürger-zu-Bürger-Kontakte. Notwendige interne Organisationskontakte sowie offizielle Stadt-/Systemmeldungen folgen ihren eigenen Sonderregeln.

## Profilbild

Verwendet dieselben sechs Sichtbarkeitsstufen und eine technische Hoster-Allowlist. Ein verborgenes Bild darf nicht über direkte URLs/API-Antworten durch Nexus offengelegt werden.

## RP-Geburtsdatum

Sechs Sichtbarkeitsstufen. Optional kann nur Tag/Monat freigegeben werden. Bei vollständig sichtbarem Datum darf Nexus das aktuelle RP-Alter berechnen.

Geburtstags-Erinnerungen werden nicht automatisch aus diesem Feld erzeugt; persönliche Geburtstage werden manuell im Kalender gepflegt.

## Nexus-ID

Nexus-ID ist nicht privat und besitzt keine eigene Sichtbarkeitseinstellung.

- stabil
- sichtbar
- suchbar
- nicht änderbar

## Personensuche

Suchbar nach Name und Nexus-ID. Kontaktfelder nur dann als Suchkriterium, wenn der Suchende das jeweilige Feld auch sehen darf.

Eine Suche darf niemals bestätigen, dass ein verborgenes Telefon-/Mailfeld existiert.

## Organisationszugehörigkeit

Die öffentliche Sichtbarkeit einer Organisationsmitgliedschaft wird von der jeweiligen Organisation festgelegt, nicht individuell vom Mitglied.

Wenn sichtbar:

- aktive Mitgliedschaft
- Name
- Nexus-ID
- sichtbare Position/Rolle

Private Profilfelder werden dadurch nicht automatisch freigegeben.

## Keine zusätzlichen Freigabelisten

Nicht vorgesehen:

- individuelle persönliche Allowlist pro Profilfeld
- gruppenspezifische Gesamtprofil-Sichtbarkeit
- eigenständige Profil-Suchbarkeit unabhängig von Feld-/Account-Sichtbarkeit
- Blockierung einer ganzen Organisation als Direktkontaktgruppe

Die sechs festen Sichtbarkeitsstufen bleiben das zentrale Modell.

## Blockierungen

Persönliche Nutzerblockierungen bleiben getrennt von Feldsichtbarkeit.

Sie können direkte Bürgerkontakte und öffentliche Sichtbarkeit zwischen zwei Bürgern einschränken, dürfen aber notwendige interne Organisationsarbeit nicht zerstören.

## Technische Durchsetzung

Privatsphäre wird serverseitig/RLS-seitig geprüft. Versteckte Daten dürfen weder über normale Ansicht, Suche, API, Benachrichtigungen, Favoriten noch indirekte Datensatzreferenzen offengelegt werden.
