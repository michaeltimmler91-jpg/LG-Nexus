# LG Nexus – Persönliche Nexus-Mail

Dieses Dokument beschreibt die aktuell festgelegten Regeln für direkte Nexus-Mails zwischen einzelnen Bürgern.

## Direkte Bürger-Mails

Direkte Nexus-Mails zwischen einzelnen Bürgern sind möglich.

Empfänger können gesucht beziehungsweise ausgewählt werden über:

- Name
- Nexus-ID
- sichtbare Nexus-Mail

Ist die Nexus-Mail eines Bürgers für den Absender verborgen, darf dieser Bürger **nicht allein über seine Nexus-ID als Mail-Empfänger ausgewählt werden**.

Wird ein Empfänger auf einem zulässigen Weg ausgewählt, bleibt eine für den Absender verborgene Nexus-Mail-Adresse weiterhin verborgen.

## Verfassen

- Betreff ist Pflicht.
- Mailtext unterstützt formatierten Text beziehungsweise Markdown.
- Mehrere direkte Empfänger über An/Cc sind möglich.
- BCC ist möglich.
- `Allen antworten` wird unterstützt.
- Weiterleiten wird unterstützt.

Anhänge erfolgen über externe Links.

Pro Mail sind maximal **5 externe Anhangslinks** vorgesehen.

## Lesestatus

Der Absender kann sehen, ob eine direkte Bürger-Mail gelesen wurde.

Der Empfänger darf Lesebestätigungen für direkte Bürger-Mails deaktivieren.

## Entwürfe und geplantes Senden

Persönliche Nexus-Mail besitzt derzeit **keine Entwurfsfunktion**. Entsprechend gibt es auch kein automatisches Speichern von Entwürfen.

Zeitversetztes beziehungsweise geplantes Senden ist nicht vorgesehen.

## Ordner und Labels

Jeder Bürger darf eigene persönliche Mail-Ordner beziehungsweise Labels anlegen.

Eine Mail kann mehrere persönliche Labels gleichzeitig besitzen.

## Blockieren und Stummschalten

Eine separate Funktion `Absender stummschalten` ist nicht vorgesehen.

Wird ein Bürger durch einen anderen Bürger blockiert, werden direkte persönliche Nexus-Mails des blockierten Benutzers **gar nicht zugestellt**.

Diese Blockierwirkung betrifft direkte Bürger-zu-Bürger-Mail. Notwendige interne Organisationskontakte sowie offizielle Stadtverwaltungs-/Systemmeldungen bleiben von den bereits festgelegten Ausnahmen unberührt.

Ein einzelner Mail-Thread kann unabhängig davon stummgeschaltet werden.

## Archiv, Papierkorb und Wiederherstellung

Persönliche Mails können archiviert werden.

Gelöschte persönliche Mails bleiben **30 Tage** im Papierkorb.

Der Bürger darf Mails aus dem Papierkorb wiederherstellen.

## Suche, Markierungen und Prioritäten

Persönliche Nexus-Mail unterstützt:

- Suche
- Filter
- Favorit-/Wichtig-Markierung
- Prioritäten

## Signaturen und Vorlagen

Persönliche Mail-Signaturen sind nicht vorgesehen.

Persönliche Mail-Vorlagen sind nicht vorgesehen.

## Darstellung in der Mail-App

Persönliche Mail und Organisations-Mail werden in **einem gemeinsamen Posteingang** dargestellt.

Offizielle System- beziehungsweise Stadtverwaltungsnachrichten werden dagegen in einem eigenen Mail-/Systembereich getrennt dargestellt.

Offizielle Organisationen und die Stadtverwaltung erhalten bei Mails ein verifiziertes Absender-Badge.

## Aufbewahrung

Normale persönliche Nexus-Mails werden **12 Monate** gespeichert.

Die technische Lösch-/Papierkorbregel bleibt davon getrennt: manuell gelöschte Mails verbringen 30 Tage im Papierkorb.

## Missbrauch melden

Ein Bürger kann eine missbräuchliche direkte Nexus-Mail an die Stadtverwaltung melden.

Die konkrete Moderations- und Einsichtslogik für eine gemeldete Mail wird separat festgelegt; eine Meldung darf nicht automatisch pauschalen Zugriff auf das gesamte Postfach ermöglichen.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- persönliche Mailthreads und Nachrichten
- Empfängerauswahl mit Privatsphäreprüfung
- An/Cc/BCC
- Lesestatus mit Empfänger-Opt-out
- externe Links, maximal 5 pro Mail
- persönliche Ordner und Mehrfachlabels
- Thread-Stummschaltung
- Blockierprüfung vor Zustellung
- Archiv und 30-Tage-Papierkorb
- Suche, Filter, Wichtig-Markierung und Priorität
- gemeinsamer Posteingang für persönliche und Organisations-Mail
- separater Systemnachrichtenbereich
- verifizierte Organisations-/Stadt-Absender
- 12-Monats-Aufbewahrung
- Mail-Meldungen an die Stadtverwaltung

Privatsphäre und Blockierungen müssen serverseitig vor Zustellung beziehungsweise Empfängerauswahl geprüft werden.