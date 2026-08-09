# LG Nexus – Persönliche Nexus-Mail

Dieses Dokument beschreibt den verbindlichen Stand direkter Bürger-Mails bis Frage 3410.

## Direkte Bürger-Mails

Empfänger können zulässig ausgewählt werden über Name, Nexus-ID und sichtbare Nexus-Mail. Verborgene Nexus-Mailadressen bleiben verborgen und dürfen nicht durch Suche/Empfängerauswahl indirekt offengelegt werden.

Eine persönliche Privatsphäre-Einstellung kann **neue Direktkontakte sperren**. Bereits bestehende notwendige Organisations-/Stadt-/Systemkontakte bleiben nach ihren Sonderregeln möglich.

## Threads

Antworten werden als Threads dargestellt.

- `Allen antworten`
- Persönliche und Organisations-Mail bleiben intern getrennte Threadarten
- Thread kann stummgeschaltet werden; Nachrichten bleiben sichtbar, Benachrichtigungen entfallen

## Verfassen

- Betreff Pflicht
- Markdown/formatierter Text
- An/Cc/Bcc
- maximal 50 direkte Empfänger
- Weiterleiten
- gesendete Mail nicht nachträglich editierbar
- kein Rückruf ungelesener persönlicher Mail
- maximal 5 externe Anhangslinks
- externe Bilder können per Markdown eingebettet werden
- Link-Vorschau möglich; externe Links mit Sicherheitshinweis

Nicht vorgesehen:

- Mailentwürfe
- geplantes Senden
- Verteiler für mehr als 50 Teilnehmer
- Kontaktgruppen
- Antwortvorlagen
- persönliche Signaturen
- `vertraulich`-Kennzeichnung

## Löschen

Löscht der Absender eine gesendete Mail, verschwindet sie nur aus seiner eigenen Ansicht. Beim Empfänger bleibt sie erhalten.

## Lesestatus

Lesebestätigungen sind standardmäßig aktiv; Empfänger kann sie bei direkten Bürger-Mails deaktivieren.

## Persönliche Kategorien / Labels

Jeder Bürger darf eigene Mail-Kategorien beziehungsweise Labels anlegen und bearbeiten.

- mehrere Labels pro Mail möglich
- Suche/Filter nach Labels
- Kategorien sind persönliche Metadaten
- keine Status-/Workflow-Historie für Kategorien nötig

## Persönliche Mailregeln / Filter

Persönliche Filterregeln sind vorgesehen und werden vom Bürger selbst verwaltet.

Sie sind normale Einstellungen und kein mehrstufiger Workflow.

Eine spezielle automatische Regel `immer nach Absender in Ordner X verschieben` ist derzeit nicht als eigene Standardfunktion festgelegt.

## Blockieren

Bei persönlicher Blockierung:

- neue direkte Bürger-Mails des Blockierten werden nicht zugestellt
- bestehende Threads bleiben lesbar
- nach Entblocken werden während der Blockzeit zurückgehaltene Mails nach bisheriger Regel nachgeliefert
- notwendige Organisationskontakte und offizielle Stadt-/Systemmeldungen bleiben möglich

Blockieren erfolgt im Profil-/Benutzerbereich, nicht direkt aus dem Thread.

## Archiv und Papierkorb

- Archiv möglich
- Papierkorb 30 Tage
- Wiederherstellung möglich
- volle 30 Tage Papierkorb auch kurz vor normalem Ablauf
- archivierte Threads dauerhaft

## Suche und Markierungen

Suche über:

- Betreff
- Inhalt
- Absender
- Empfänger

Zusätzlich persönliche Wichtig-Markierung und Empfänger-Priorität.

## Benachrichtigungen

Jede neue persönliche Mail löst eine normale Nexus-Benachrichtigung aus.

Kategorie `Mail` wird gemeinsam mit Organisations-Mail genutzt.

@-Erwähnungen im Mailtext erzeugen keine zweite Erwähnungsbenachrichtigung.

## Kalender

Aus einer persönlichen Mail kann manuell ein persönlicher Kalendereintrag erstellt werden.

Keine direkte Fachvorgangs-Verknüpfung zu Bewerbung/Verwaltungsantrag usw.

## Gemeinsamer Posteingang

Persönliche und Organisations-Mail erscheinen in einem gemeinsamen Posteingang, visuell klar durch Badge/Icon unterschieden.

Offizielle System-/Stadtnachrichten bleiben in einem getrennten Systembereich.

Offizielle Organisationen/Stadtverwaltung erhalten verifiziertes Absender-Badge.

## Aufbewahrung

Normale persönliche Threads: **12 Monate ab letzter Thread-Aktivität**.

Archivierte Threads: dauerhaft.

Manuell gelöschte Mails: 30 Tage Papierkorb.

Kein PDF-Export.

## Missbrauch melden

Missbräuchliche Mail kann an Moderation gemeldet werden. Dabei wird nur der komplette **betroffene Thread** übermittelt, nicht andere Postfachinhalte.

Meldender sieht keinen laufenden Moderationsstatus; gemeldeter Absender wird nicht sofort über die Meldung informiert.

## Spam

Spam-/Junk-Ordner vorhanden. Automatische Filterung unbekannter Absender ist benutzersteuerbar.

## Sicherheit

Privatsphäre, neue-Kontakte-Sperre und Blockierungen müssen serverseitig vor Zustellung/Empfängerauswahl geprüft werden. Rate Limits für Mailversand gelten gemäß Sicherheitskonzept.
