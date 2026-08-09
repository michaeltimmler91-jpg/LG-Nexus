# LG Nexus – Registrierung, Account und Identität

Dieses Dokument beschreibt den verbindlichen Stand der Registrierung, Accountstatus und Identitätsverwaltung bis Frage 3410.

## Grundregel

**1 Account = 1 RP-Charakter.**

Nicht vorgesehen:

- mehrere Charaktere unter einem Login
- Account-Übergabe an einen anderen Charakter
- Umzug eines Charakters auf einen neuen Benutzernamen

## Registrierung

Pflichtfelder:

- eindeutiger Benutzername
- Passwort
- Passwort wiederholen
- Vorname
- Nachname
- RP-Geburtsdatum

Optional: Telefonnummer.

Keine echte E-Mail-Adresse erforderlich.

Nach Registrierung: `pending`.

## Benutzername

Der Benutzername ist nach Registrierung dauerhaft unveränderlich und unabhängig vom Charakternamen.

- case-insensitive eindeutig
- auch nach `disabled` dauerhaft reserviert
- weder Bürger noch Stadtverwaltung ändern ihn

## Accountstatus

- `pending`
- `active`
- `suspended`
- `rejected`
- `disabled`

`disabled` bleibt endgültig und wird nicht reaktiviert.

## Pending

Pending-Nutzer dürfen sich anmelden und ausschließlich öffentliche Bereiche nutzen.

Sie dürfen vor Freischaltung selbst korrigieren:

- Vorname
- Nachname
- Geburtsdatum
- Telefonnummer

Benutzername und geschützte Accountfelder bleiben unveränderlich.

## Freischaltung

Stadtverwaltung prüft die Identität im RP.

Berechtigte Verwaltung darf während `pending` Vorname, Nachname, Geburtsdatum und auf Wunsch Telefonnummer korrigieren.

Bei Freischaltung entstehen:

- Nexus-ID, z. B. `NX-000001`
- interne Nexus-Mail, z. B. `lennox.davis@nexus.ls`

Die Nexus-ID bleibt stabil.

## Namensänderung nach Freischaltung

Der RP-Charaktername kann nach Aktivierung geändert werden, aber **nicht direkt durch den Bürger**.

Ablauf:

1. Bürger stellt einen Namensänderungsantrag bei der Stadtverwaltung.
2. Berechtigte Verwaltung prüft/genehmigt.
3. Der aktuelle RP-Name wird geändert.
4. Der vorherige RP-Name bleibt im internen Identitätsverlauf dauerhaft nachvollziehbar.

Der unveränderliche Login-Benutzername wird dadurch nicht geändert.

## Korrektur des RP-Geburtsdatums

Nach Freischaltung kann das RP-Geburtsdatum nur administrativ korrigiert werden.

- manuelle berechtigte Aktion
- Änderung wird vollständig protokolliert
- Bürger wird bei relevanter Korrektur informiert
- bei technischem Widerspruch wird die Änderung blockiert

## Doppelaccounts zusammenführen

Versehentlich doppelte Accounts können durch berechtigte Administration manuell zusammengeführt werden.

- keine automatische Zusammenführung
- vollständige Protokollierung
- Bürger wird informiert
- bei Konflikt/Fehler wird abgebrochen

Die konkrete Merge-Strategie für Fachreferenzen wird technisch festgelegt; historische Fall-/Aktenreferenzen dürfen nicht verloren gehen.

## Eigene Daten bei aktivem Account

Telefonnummer darf weiterhin selbst geändert/entfernt werden.

Vorname, Nachname und Geburtsdatum nicht direkt selbst änderbar.

Privatsphäre für Telefon/Nexus-Mail und Profilfelder wird separat geregelt.

## Suspended

Ein `suspended` Account kann sich anmelden, erhält aber keinen Zugriff auf Nexus-Inhalte und sieht nur die Sperrstatus-Seite.

- interner Sperrgrund Pflicht
- Grund wird Bürger nicht angezeigt
- berechtigte Verwaltung kann zurück auf `active` setzen

## Rejected

Ablehnung benötigt einen sichtbaren Ablehnungsgrund.

`rejected` kann durch berechtigte Verwaltung wieder auf `pending` gesetzt werden. Kein Self-Service-Button; erneute Prüfung erfolgt IC.

## Disabled und Selbstlöschung

`disabled` ist der endgültige technische Accountzustand.

Zusätzlich darf ein Bürger die Selbstlöschung seines Nexus-Accounts auslösen.

Dabei gilt verbindlich:

- Login und normales Bürgerprofil werden entfernt/deaktiviert
- Account kann danach nicht reaktiviert werden
- Benutzername bleibt reserviert
- notwendige historische Fachdatensätze bleiben erhalten
- PD-/Medical-/Justice-/Verwaltungsreferenzen behalten mindestens Nexus-ID und erforderlichen historischen Namen
- Selbstlöschung darf keine Akten, Verfahren oder rechtlich/fachlich notwendige Historie beschädigen

Ein eigener Export aller Nexus-Stammdaten vor der Löschung ist derzeit nicht vorgesehen.

## Accountrechte der Stadtverwaltung

Getrennte Rechte für:

- `Accounts freischalten`
- Suspendieren/Reaktivieren
- `Passwort zurücksetzen`
- endgültiges Deaktivieren
- Identitätskorrekturen/Namensänderungen
- Doppelaccount-Zusammenführung

Endgültiges `disabled` benötigt weiterhin das Vier-Augen-Prinzip.

## Passwort

Login: Benutzername + Passwort.

Passwort vergessen läuft IC über Stadtverwaltung. `Passwort zurücksetzen` setzt ein temporäres Passwort und `must_change_password`.

Passwort-Reset-Aktionen werden 6 Monate protokolliert.

Bei einer Passwortänderung werden bestehende Sitzungen nach der festgelegten Sicherheitsregel invalidiert beziehungsweise gesperrt.

## Sitzungen und Login-Sicherheit

- Inaktivitätsablauf: 4 Stunden
- `angemeldet bleiben`: maximal 90 Tage
- Bürger sieht eigene Geräte/Sitzungen und kann andere remote beenden
- Re-Authentifizierung per Passwort für sensible persönliche Aktionen
- unbekanntes Gerät erzeugt Nexus-Benachrichtigung
- ungewöhnliche Login-Muster/Orte können zusätzliche Sicherheitsprüfung auslösen
- 2FA aktuell nicht vorgesehen

Erfolgreiche/fehlgeschlagene Logins werden 30 Tage als Sicherheitsereignisse gespeichert.

Schutz:

- Rate Limiting
- CAPTCHA/Anti-Bot nach mehreren Fehlversuchen
- temporäre Login-Sperre nach sehr vielen Fehlversuchen

## Betreiber- und Datenschutzgrenze

Stadtverwaltung oder technische Systemadministration erhalten durch ihre Betreiberrolle **keinen automatischen Zugriff** auf vertrauliche Medical-/PD-Inhalte. Justice besitzt nur die separat festgelegte IC-Leseregel der Stadtverwaltung.

Technische Account- und Sicherheitsrechte bleiben von fachlichen Fraktionsrechten getrennt.
