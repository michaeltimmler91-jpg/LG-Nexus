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

## Benutzername

Der Benutzername wird bei der Registrierung frei gewählt, muss eindeutig sein und ist anschließend dauerhaft fest.

- Die Stadtverwaltung kann ihn nicht ändern.
- Der Nutzer kann ihn später nicht selbst ändern.
- Der Benutzername bleibt unabhängig vom Charakternamen.
- Auch nach einer endgültigen Deaktivierung mit `disabled` bleibt der Benutzername dauerhaft reserviert und kann niemals erneut registriert werden.

Die technische Eindeutigkeit wird unabhängig von Groß-/Kleinschreibung geprüft. Damit gelten beispielsweise `Lennox`, `lennox` und `LENNOX` als derselbe Benutzername.

## Account-Status

- `pending` – wartet auf Freischaltung
- `active` – freigeschaltet und normal nutzbar
- `suspended` – vorübergehend gesperrt
- `rejected` – Registrierung abgelehnt
- `disabled` – dauerhaft gelöscht / endgültig deaktiviert

### Zugriff während `pending`

Ein Bürger mit Status `pending` darf sich bereits anmelden und die **öffentlichen Bereiche von LG Nexus** verwenden, während die Registrierung noch von der Stadtverwaltung geprüft wird.

Dazu gehören insbesondere öffentliche Inhalte wie:

- Unternehmen / Business-Verzeichnis
- Events
- öffentliche City-Informationen und Ankündigungen
- weitere ausdrücklich als öffentlich gekennzeichnete Bereiche

Nicht freigeschaltet sind in diesem Zustand persönliche oder geschützte Nexus-Funktionen, interne Organisationsbereiche sowie Fraktionsmodule wie Medical, Police oder Fire & Rescue.

Die Oberfläche zeigt zusätzlich gut sichtbar an, dass die Registrierung noch auf Freischaltung durch die Stadtverwaltung wartet.

### Eigene Registrierungsdaten während `pending` ändern

Solange der Account noch den Status `pending` hat, darf der Bürger seine eigenen Registrierungsdaten selbst korrigieren:

- Vorname
- Nachname
- Geburtsdatum
- Telefonnummer

Die Telefonnummer bleibt weiterhin optional und kann auch wieder entfernt werden.

Der Benutzername bleibt davon ausgeschlossen und kann nach der Registrierung niemals geändert werden. Auch Account-Status, Nexus-ID, Nexus-Mail, Freischaltungsdaten, Ablehnungsdaten und andere geschützte Account-Felder können vom Bürger nicht verändert werden.

### Eigene Daten nach der Freischaltung

Bei einem Account mit Status `active` darf der Bürger seine **Telefonnummer weiterhin selbst ändern oder entfernen**.

Vorname, Nachname und Geburtsdatum können nach der Freischaltung nicht mehr selbst geändert werden. Spätere Korrekturen dieser Identitätsdaten laufen über die dafür berechtigte Stelle.

Bei `suspended`, `rejected` oder `disabled` können eigene Profildaten nicht geändert werden.

### Sichtbarkeit der Telefonnummer

Ob und für wen die hinterlegte Telefonnummer sichtbar ist, entscheidet der Bürger selbst über eine eigene Privatsphäre-Einstellung.

Die Telefonnummer darf deshalb nicht automatisch für alle Nutzer sichtbar gemacht werden. LG Nexus prüft beim Anzeigen eines Profils oder einer Kontaktdarstellung immer die vom Bürger gewählte Sichtbarkeitsstufe.

Auswählbare Sichtbarkeitsstufen:

- Niemand
- Nur freigeschaltete Nexus-Bürger
- Nur Behörden / staatliche Stellen
- Bürger + Behörden
- Nur eigene Firma / Organisation
- Alle

Standardmäßig ist die Telefonnummer für **Niemanden** sichtbar, bis der Bürger selbst eine andere Einstellung auswählt.

Bei **„Nur eigene Firma / Organisation“** gilt die Freigabe für **alle aktiven Organisationen**, denen der Bürger angehört. Ist ein Bürger beispielsweise gleichzeitig Mitglied eines Unternehmens und einer staatlichen Organisation, dürfen berechtigte Mitglieder beider Organisationen die Telefonnummer sehen. Es gibt dafür keine einzelne Hauptorganisation.

Die gewählte Sichtbarkeitsstufe gilt **immer**, auch gegenüber Behörden und staatlichen Stellen. Es gibt keinen pauschalen Behörden-Override. PD, Medical, Fire & Rescue, Stadtverwaltung oder andere staatliche Organisationen dürfen die im Nexus-Profil hinterlegte Telefonnummer nur sehen, wenn die vom Bürger gewählte Sichtbarkeitsstufe dies ausdrücklich erlaubt.

Die Telefonnummer selbst bleibt weiterhin optional und kann vom Bürger jederzeit entfernt werden, solange sein Account `active` ist.

Ein Account mit Status `disabled` gilt aus Nutzersicht als endgültig gelöscht. Er kann nicht wieder auf `pending`, `active`, `suspended` oder `rejected` gesetzt werden und erhält keinen Zugriff mehr auf LG Nexus. Dieser Status ist für endgültige Fälle gedacht, beispielsweise wenn ein Charakter dauerhaft ausgereist oder gelöscht wurde.

Der technische Account-Datensatz bleibt intern erhalten, damit unter anderem der bereits verwendete Benutzername dauerhaft blockiert bleibt und nicht von einem anderen Charakter übernommen werden kann.

Eine abgelehnte Registrierung ist nicht endgültig verloren. Ein Mitarbeiter der Stadtverwaltung mit dem entsprechenden Recht darf einen Account von `rejected` wieder auf `pending` setzen. Danach läuft die normale Prüfung und Freischaltung erneut durch.

### Vorübergehende Sperre

Ein Account mit Status `suspended` kann sich weiterhin anmelden, erhält jedoch keinen Zugriff auf das eigentliche Nexus-System. Stattdessen wird nur folgende Meldung angezeigt:

> Dein Nexus-Zugang wurde vorübergehend gesperrt.  
> Bitte wende dich an die Stadtverwaltung.

Ein Sperrgrund wird dem Bürger nicht angezeigt.

Beim Suspendieren ist intern ein Grund Pflicht.

Ein berechtigter Mitarbeiter der Stadtverwaltung darf einen `suspended` Account jederzeit wieder direkt auf `active` setzen. Eine erneute Freischaltungsprüfung ist dafür nicht erforderlich.

### Ablehnung einer Registrierung

Eine Registrierung darf nur mit einem angegebenen Ablehnungsgrund auf `rejected` gesetzt werden.

Der Bürger kann sich weiterhin mit Benutzername und Passwort anmelden, erhält jedoch keinen Zugriff auf das eigentliche Nexus-System. Stattdessen wird eine Statusseite mit dem Ablehnungsgrund angezeigt.

Beispiel:

> Deine Registrierung wurde von der Stadtverwaltung abgelehnt.  
> Grund: Geburtsdatum stimmt nicht mit den vorgelegten Unterlagen überein.

Der Ablehnungsgrund wird zusammen mit Zeitpunkt und bearbeitendem Mitarbeiter gespeichert.

Es gibt **keine Schaltfläche für eine erneute Prüfung** im Nexus. Möchte der Bürger eine erneute Prüfung, muss er persönlich IC bei der Stadtverwaltung vorsprechen. Erst dort kann ein berechtigter Mitarbeiter den Account wieder von `rejected` auf `pending` setzen.

## Prüfung und Freischaltung durch die Stadtverwaltung

Die Stadtverwaltung ist Betreiber von LG Nexus und übernimmt die Identitätsprüfung im RP.

Solange ein Account den Status `pending` hat, darf ein Mitarbeiter der Stadtverwaltung mit dem entsprechenden Nexus-Recht vor der Freischaltung folgende Charakterdaten korrigieren:

- Vorname
- Nachname
- Geburtsdatum
- Telefonnummer, falls der Bürger dies wünscht

Die Telefonnummer bleibt immer optional. Eine Telefonnummer ist keine Voraussetzung für die Freischaltung und darf von der Stadtverwaltung nur auf Wunsch beziehungsweise mit Zustimmung des Bürgers eingetragen oder korrigiert werden.

Damit können Tippfehler oder Abweichungen bei der IC-Identitätsprüfung direkt berichtigt werden. Der frei gewählte Benutzername bleibt davon getrennt und darf nicht geändert werden.

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

## Rollenrechte für Account-Aktionen

Für die Stadtverwaltung werden Account-Aktionen getrennt berechtigt:

- `Accounts freischalten`
- eigenes Recht für Suspendieren/Reaktivieren
- `Passwort zurücksetzen`
- Recht für endgültiges Deaktivieren (`disabled`)

Das endgültige `disabled` benötigt zusätzlich das **Vier-Augen-Prinzip**: zwei dafür berechtigte Verwaltungsmitarbeiter müssen die endgültige Deaktivierung bestätigen.

## Login

Der Nutzer meldet sich mit folgendem an:

- Benutzername
- Passwort

Der Charaktername und die Nexus-Mail sind vom Login getrennt.

## Passwort vergessen

Es gibt keine Wiederherstellung per E-Mail.

Wer sein Passwort vergessen hat, muss sich IC an die Stadtverwaltung wenden. Ein Mitarbeiter mit dem Rollenrecht `Passwort zurücksetzen` kann ein temporäres neues Passwort setzen.

Nach einem durch die Stadtverwaltung ausgelösten Passwort-Reset wird `must_change_password` gesetzt. Beim nächsten erfolgreichen Login muss der Bürger zwingend ein eigenes neues Passwort vergeben, bevor er LG Nexus normal weiterverwenden kann. Nach erfolgreichem Passwortwechsel wird die Markierung wieder entfernt.

Die Stadtverwaltung kann Passwörter nicht einsehen.

Passwort-Reset-Aktionen werden **6 Monate** intern protokolliert.

## Sitzungs- und Login-Sicherheit

Eine normale Nexus-Sitzung läuft nach **4 Stunden Inaktivität** ab.

Mit `angemeldet bleiben` kann eine Sitzung maximal **90 Tage** erhalten bleiben.

Benutzer können ihre eigenen aktiven Geräte/Sitzungen sehen und andere Sitzungen aus der Ferne beenden.

Für sensible persönliche Sicherheitsaktionen wird eine erneute Passwortbestätigung verlangt, mindestens für:

- Passwortänderungen
- Privatsphäre-Einstellungen
- Sitzungsverwaltung
- persönliche Sicherheitsaktionen

Bei einer Anmeldung auf einem unbekannten Gerät erhält der Bürger eine Nexus-Benachrichtigung. Auffällige oder neue Anmeldungen können eine zusätzliche Sicherheitsprüfung auslösen.

Eine Zwei-Faktor-Authentifizierung ist derzeit **nicht vorgesehen**.

## Login-Schutz

Erfolgreiche und fehlgeschlagene Login-Versuche werden als Sicherheitsereignisse für **30 Tage** gespeichert.

Nexus verwendet gegen Login-Missbrauch:

- Rate Limiting
- CAPTCHA/Anti-Bot-Schritt nach mehreren Fehlversuchen
- temporäre Login-Sperre nach sehr vielen Fehlversuchen

## Sicherheit

Nexus-ID und Nexus-Mail werden erst bei erfolgreicher Aktivierung erzeugt. Ein normaler Nutzer darf seinen eigenen Account-Status nicht ändern und kann sich damit nicht selbst freischalten.

Die Korrektur von Vorname, Nachname, Geburtsdatum und der optionalen Telefonnummer vor der Freischaltung wird an ein separates Stadtverwaltungs-Recht gebunden. Dadurch bekommt nicht automatisch jeder Mitarbeiter der Stadtverwaltung diese Berechtigung.

Die Stadtverwaltung erhält durch ihre Betreiberrolle nicht automatisch Zugriff auf sensible Inhalte anderer Module wie Medical- oder Police-Akten. Solche Rechte werden separat geregelt.

Die Stadtverwaltung darf normale Geräte-/Sitzungsdetails eines Bürgers nicht einsehen. Bei einem Sicherheitsfall kann eine dafür berechtigte Funktion jedoch alle aktiven Sitzungen eines Bürgers beenden.
