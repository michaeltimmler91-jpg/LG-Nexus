# LG Nexus – Dashboard & System

Dieses Dokument beschreibt die aktuell festgelegten Regeln für das persönliche Dashboard und grundlegende Nexus-System- und Sicherheitsfunktionen.

## Persönliches Dashboard

Das persönliche Dashboard unterstützt frei auswählbare Widgets.

Benutzer dürfen:

- Widgets per Drag & Drop anordnen
- einzelne normale Widgets vollständig ein- oder ausblenden

Organisationen dürfen eigene interne Dashboard-Widgets für ihre Mitglieder bereitstellen.

Rollen können automatisch passende Schnellzugriffe auf dem Dashboard erhalten.

Neue Nutzer starten jedoch **nicht automatisch mit rollenabhängig vorausgefüllten Standard-Widgets**; das normale persönliche Widget-Layout beginnt leer beziehungsweise ohne erzwungene Standardauswahl.

Organisationen dürfen einzelne interne Widgets als **verpflichtend** markieren. Solche verpflichtenden Widgets können vom betroffenen Mitglied nicht ausgeblendet werden.

## Globale Suche

LG Nexus besitzt eine globale Suche.

Die globale Suche durchsucht derzeit **nur öffentliche Bereiche**. Berechtigte interne Inhalte wie Dokumente, Fälle oder Vorfälle werden nicht über die globale Suche durchsucht.

Mindestens durchsuchbar sind:

- Personen
- Organisationen
- Events
- City Hub
- Jobs
- öffentliche Map-Inhalte

Persönliche Privatsphäre-Regeln für Telefon, Nexus-Mail, Profilfelder und andere geschützte Daten müssen serverseitig vollständig berücksichtigt werden. Ein Suchindex darf keine versteckten Daten indirekt offenlegen.

## Zuletzt geöffnet

Eine persönliche Liste zuletzt geöffneter Inhalte ist derzeit nicht vorgesehen.

## Systemweite Favoriten

Benutzer können systemweite persönliche Favoriten für geeignete Nexus-Inhalte verwenden, zum Beispiel:

- Seiten
- Dokumente
- Fälle
- Marker

Favoriten können eigene persönliche Ordner/Kategorien besitzen und werden auf allen Geräten des Nexus-Benutzers synchronisiert.

Die jeweilige Sichtbarkeit und Berechtigung des Inhalts bleibt maßgeblich; ein Favorit darf keinen Zugriff auf später nicht mehr berechtigte Inhalte erhalten.

## Tastaturkürzel

Tastaturkürzel für häufige Nexus-Aktionen sind derzeit nicht vorgesehen.

## Visuelles Grunddesign

Benutzer können zwischen **hellem und dunklem Grunddesign** wählen.

Für neue Nutzer ist standardmäßig **Dunkel** aktiv.

Die Hell-/Dunkel-Einstellung wird im Nexus-Benutzerprofil gespeichert und auf allen Geräten synchronisiert.

Persönliche Akzentfarben verändern:

- Buttons
- aktive Elemente
- Highlights

Sie verändern nicht die komplette Oberfläche oder sämtliche Karten/Widgets.

Zusätzlich unterstützt Nexus:

- eine einstellbare Schriftgröße
- wählbare kompakte oder komfortable Inhaltsdichte

## Sitzungen und Geräte

Eine normale Nexus-Sitzung läuft nach **4 Stunden Inaktivität** automatisch ab.

Die Option `angemeldet bleiben` kann eine Anmeldung maximal **90 Tage** aufrechterhalten.

Ein Benutzer kann:

- seine aktiven Nexus-Sitzungen beziehungsweise Geräte einsehen
- andere aktive Sitzungen aus der Ferne abmelden

Die eigene Sitzungs-/Geräteübersicht zeigt:

- Gerät beziehungsweise Browser
- letzte Aktivität
- ungefähre Region

Die genaue IP-Adresse wird in normalen Benutzeroberflächen nicht dem Bürger angezeigt. Dafür ausdrücklich berechtigte Sicherheitsadministratoren dürfen die genaue IP-Adresse für Sicherheitszwecke einsehen.

## Erneute Passwortbestätigung

Für besonders sensible persönliche Sicherheitsaktionen verlangt Nexus eine erneute Passwortbestätigung.

Mindestens betroffen sind:

- Passwortänderungen
- Privatsphäre-Einstellungen
- Sitzungsverwaltung
- persönliche Sicherheitsaktionen

Eine pauschale zusätzliche Passwortabfrage für jede sensible Fraktions-/Adminaktion ist damit nicht automatisch festgelegt.

## Neue und auffällige Anmeldungen

Bei einer neuen Anmeldung auf einem unbekannten Gerät erhält der Bürger eine Nexus-Benachrichtigung.

Bei auffälligen beziehungsweise neuen Anmeldungen darf Nexus eine zusätzliche Sicherheitsprüfung verlangen.

## Zwei-Faktor-Authentifizierung

Eine 2FA-Funktion ist derzeit **nicht vorgesehen**.

Daher entfallen aktuell:

- 2FA für normale Bürger
- Backup-/Recovery-Codes
- verpflichtende 2FA für Stadtverwaltungsmitglieder
- verpflichtende 2FA für Organisations-Owner

## Login-Sicherheitsereignisse

Erfolgreiche und fehlgeschlagene Login-Versuche werden als Sicherheitsereignisse protokolliert.

Aufbewahrung: **30 Tage**.

Zum Schutz gegen Login-Missbrauch werden vorgesehen:

- technisches Rate Limiting bei fehlgeschlagenen Login-Versuchen
- CAPTCHA/Anti-Bot-Schritt nach mehreren Fehlversuchen
- temporäre Login-Sperre eines Accounts nach sehr vielen Fehlversuchen

## Wartungsmodus

LG Nexus besitzt einen globalen Wartungsmodus.

Im Wartungsmodus:

- wird eine öffentliche Wartungsseite angezeigt
- nur dafür berechtigte Administratoren können das eigentliche Nexus weiterhin betreten

Zusätzlich darf die Stadtverwaltung beziehungsweise systemberechtigte Administration einen globalen Wartungs-/Hinweisbanner schalten.

## Öffentliche Statusseite

Es gibt eine öffentliche Nexus-Statusseite für Störungen und Wartungen.

## Backups

Als Zielvorgabe werden automatische Datenbank-Backups **alle 6 Stunden** eingeplant.

Die konkrete technische Backup-/Restore-Umsetzung richtet sich später nach der eingesetzten Supabase-/Hosting-Infrastruktur.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- persönliches Widget-Layout pro Benutzer
- Drag-&-Drop-Reihenfolge
- sichtbare/verborgene Widgets
- verpflichtende Organisationswidgets
- rollenbasierte Schnellzugriffe
- öffentliche globale Suche mit serverseitiger Privacy-Filterung
- systemweite persönliche Favoriten mit Ordnern und Gerätesynchronisierung
- Hell-/Dunkelmodus mit Standard `Dunkel`
- synchronisierte Anzeigeeinstellungen
- Akzentfarben für Buttons/aktive Elemente/Highlights
- Schriftgrößen- und Inhaltsdichte-Einstellung
- Sitzungsverwaltung mit 4-Stunden-Inaktivitätsablauf
- `angemeldet bleiben` bis 90 Tage
- Geräte-/Sitzungsübersicht und Remote-Abmeldung
- Sicherheitsadministrationsrecht für genaue IP-Einsicht
- Re-Authentifizierung mit Passwort für persönliche Sicherheitsaktionen
- Benachrichtigung bei unbekannten Geräten
- zusätzliche Sicherheitsprüfung bei auffälligen Logins
- Login-Sicherheitsereignisse mit 30-Tage-Aufbewahrung
- Rate Limit, CAPTCHA und temporäre Login-Sperre
- globaler Wartungsmodus
- Wartungs-/Hinweisbanner
- öffentliche Statusseite
- Backup-Ziel alle 6 Stunden

Interne Daten dürfen durch Widgets, Favoriten, Suchindizes oder Systemfunktionen niemals Berechtigungsgrenzen umgehen.