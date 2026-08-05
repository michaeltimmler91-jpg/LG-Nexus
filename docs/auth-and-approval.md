# LG Nexus – Registrierung und Freischaltung

## Grundregel

**1 Account = 1 RP-Charakter.**

Der Account ist fest mit genau einem Charakter verknüpft. Ein weiterer Charakter benötigt einen eigenen Nexus-Account.

## Registrierung

Jeder Bürger darf sich selbst registrieren.

Pflichtfelder:

- Benutzername (frei wählbar, aber eindeutig)
- Passwort
- Passwort wiederholen
- Vorname
- Nachname
- Geburtsdatum

Optional:

- Telefonnummer

Es wird **keine echte E-Mail-Adresse** verlangt.

Nach der Registrierung erhält der Account den Status `pending` und wartet auf die Freischaltung durch die Stadtverwaltung.

## Account-Status

- `pending` – wartet auf Freischaltung
- `active` – freigeschaltet und normal nutzbar
- `suspended` – vorübergehend gesperrt
- `rejected` – Registrierung abgelehnt
- `disabled` – dauerhaft deaktiviert

## Prüfung und Freischaltung durch die Stadtverwaltung

Die Stadtverwaltung ist Betreiber von LG Nexus und übernimmt die Identitätsprüfung im RP.

Solange ein Account den Status `pending` hat, darf ein Mitarbeiter der Stadtverwaltung mit dem entsprechenden Nexus-Recht vor der Freischaltung folgende Charakterdaten korrigieren:

- Vorname
- Nachname
- Geburtsdatum

Damit können Tippfehler oder Abweichungen bei der IC-Identitätsprüfung direkt berichtigt werden. Der frei gewählte Benutzername bleibt davon getrennt und wird nicht automatisch an den Charakternamen angepasst.

Erst nach Abschluss dieser Prüfung wird der Account freigeschaltet. Für die automatische Nexus-Mail werden die **zuletzt von der Stadtverwaltung bestätigten Namen** verwendet.

Bei der Freischaltung werden automatisch vergeben:

- eine Nexus-ID im Format `NX-000001`
- eine interne Nexus-Mailadresse

Beispiel:

- Charakter: `Lennox Davis`
- Nexus-ID: `NX-000001`
- Nexus-Mail: `lennox.davis@nexus.ls`

Existiert dieselbe Mailadresse bereits, wird automatisch hochgezählt:

- `lennox.davis2@nexus.ls`
- `lennox.davis3@nexus.ls`
- usw.

Die Nexus-Mail ist ausschließlich für das interne Mailsystem von LG Nexus gedacht und wird **nicht** als Login-Adresse oder zur Passwort-Wiederherstellung verwendet.

## Login

Der Nutzer meldet sich mit folgendem an:

- Benutzername
- Passwort

Der Charaktername und die Nexus-Mail sind vom Login getrennt.

## Passwort vergessen

Es gibt keine Wiederherstellung per E-Mail.

Wer sein Passwort vergessen hat, muss sich IC an die Stadtverwaltung wenden. Die spätere Verwaltungsfunktion soll ein neues Passwort setzen können; optional kann anschließend ein Passwortwechsel beim nächsten Login erzwungen werden.

## Sicherheit

Nexus-ID und Nexus-Mail werden erst bei erfolgreicher Aktivierung erzeugt. Ein normaler Nutzer darf seinen eigenen Account-Status nicht ändern und kann sich damit nicht selbst freischalten.

Die Korrektur von Vorname, Nachname und Geburtsdatum vor der Freischaltung wird später an ein separates Stadtverwaltungs-Recht gebunden. Dadurch bekommt nicht automatisch jeder Mitarbeiter der Stadtverwaltung diese Berechtigung.

Die Stadtverwaltung erhält durch ihre Betreiberrolle nicht automatisch Zugriff auf sensible Inhalte anderer Module wie Medical- oder Police-Akten. Solche Rechte werden separat geregelt.
