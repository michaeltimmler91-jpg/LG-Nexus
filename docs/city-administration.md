# LG Nexus – Stadtverwaltung

Dieses Dokument beschreibt die aktuell festgelegten Regeln für das interne Stadtverwaltungs-Modul.

## Bürgerverwaltung

Die Stadtverwaltung besitzt ein eigenes internes Bürgerverwaltungs-Modul.

Die Suche erfolgt mindestens nach:

- Name
- Nexus-ID

Dort ist außerdem der technische Nexus-Accountstatus sichtbar:

- `pending`
- `active`
- `suspended`
- `rejected`
- `disabled`

Die Historie von Account-Freigaben, Sperren und Statusänderungen wird **dauerhaft** aufbewahrt.

## Interne Bürgernotizen

Die Stadtverwaltung kann interne Verwaltungsnotizen zu Bürgern hinterlegen. Diese Notizen sind für den betroffenen Bürger **nicht sichtbar**.

Für die Sichtbarkeit gilt:

- alle Stadtverwaltungsmitglieder dürfen interne Bürgernotizen sehen
- Erstellen, Bearbeiten und Löschen erfolgt nur über das Rollenrecht `Bürgernotizen verwalten`
- Änderungen besitzen einen Versions-/Änderungsverlauf
- Kategorien/Tags für Bürgernotizen sind nicht vorgesehen
- externe Links innerhalb einer Bürgernotiz sind erlaubt

## Accountverwaltung und Rechte

Account-Aktionen werden rollenbasiert getrennt.

- Freischaltung neuer Accounts: eigenes Rollenrecht `Accounts freischalten`
- Suspendieren und Reaktivieren: eigenes Rollenrecht
- Passwort zurücksetzen: eigenes Rollenrecht `Passwort zurücksetzen`
- endgültiges `disabled`: über das normale dafür vorgesehene Account-Verwaltungsrecht, jedoch mit zusätzlicher Sicherheitsbestätigung

Beim Suspendieren eines Accounts ist ein interner Grund Pflicht.

Das endgültige Deaktivieren (`disabled`) benötigt das **Vier-Augen-Prinzip**: zwei dafür berechtigte Verwaltungsmitarbeiter müssen die Aktion bestätigen.

Passwort-Reset-Aktionen werden intern **6 Monate** protokolliert.

## Sitzungen bei Sicherheitsfällen

Die Stadtverwaltung darf aktive Sitzungen/Geräte eines Bürgers **nicht einsehen**.

Bei einem Sicherheitsfall darf eine dafür berechtigte Verwaltungsfunktion dennoch alle aktiven Sitzungen des Bürgers beenden. Das ist eine gezielte Sicherheitsaktion und kein allgemeines Einsichtsrecht in Geräte-/Sitzungsdetails.

## Verwaltungs-Dashboard

Die Stadtverwaltung erhält ein internes Dashboard für offene Account-Freigaben und weitere Verwaltungsaufgaben.

## Bürgeranträge / Anliegen

Es gibt einen zentralen Bereich für Bürgeranträge und Anliegen an die Stadtverwaltung.

Aktive Bürger dürfen solche Anträge direkt über Nexus einreichen.

Die Stadtverwaltung darf eigene Kategorien für Bürgeranträge anlegen.

Jede Kategorie darf ein eigenes Formular besitzen. Pro Kategorie können eigene Fragen definiert und einzelne Fragen als Pflichtfeld markiert werden.

Status:

- Neu
- In Bearbeitung
- Rückfrage
- Erledigt
- Abgelehnt

Ein Antrag kann mehreren Verwaltungsmitarbeitern gleichzeitig zugewiesen werden.

Interne Kommentare sind möglich und bleiben für den antragstellenden Bürger verborgen.

Anhänge erfolgen ausschließlich über **externe Links**. Auch der antragstellende Bürger darf externe Links hinzufügen.

Aus einem Antrag heraus kann die Stadtverwaltung direkt eine offizielle Antwort an den Bürger senden.

### Bearbeitung durch den Bürger

- Der Bürger wird bei jeder Statusänderung benachrichtigt.
- Bei Ablehnung ist ein Grund Pflicht.
- Der Ablehnungsgrund wird dem Bürger angezeigt.
- Ein noch offener Antrag darf vom Bürger zurückgezogen werden.
- Der Bürger darf einen bereits abgesendeten Antrag bearbeiten, solange der Status noch `Neu` ist.
- Ein erledigter Antrag wird nicht wieder geöffnet; bei neuem Bedarf ist ein neuer Antrag erforderlich.

### Interne Weiterleitung

Ein Bürgerantrag kann intern an einen anderen Verwaltungsbereich weitergeleitet werden. Der Bürger wird über die Weiterleitung benachrichtigt.

Eine interne Bearbeitungsfrist für Bürgeranträge ist derzeit nicht vorgesehen. Entsprechend entfällt auch eine automatische Fristerinnerung.

Erledigte und abgelehnte Bürgeranträge werden **6 Monate** gespeichert.

## Terminverwaltung

Eine allgemeine Selbstbuchung freier Termine durch Bürger über Nexus ist derzeit nicht vorgesehen.

Unterschiedliche Verwaltungsbereiche dürfen dennoch eigene interne Termin-Kalender besitzen.

Wenn ein Verwaltungstermin auf anderem Weg vereinbart beziehungsweise angelegt wurde:

- kann er automatisch bestätigt und im Bürgerkalender eingetragen werden
- darf die Stadtverwaltung ihn verschieben und den Bürger automatisch benachrichtigen
- beim Absagen ist ein Grund Pflicht

## Offizielle Bescheinigungen und Dokumente

Die Stadtverwaltung kann offizielle Nexus-Dokumente und Bescheinigungen für Bürger erzeugen.

Dafür können Dokumentvorlagen verwendet werden.

- Vorlagen werden über das Rollenrecht `Dokumentvorlagen verwalten` verwaltet.
- Dokumente werden über das Rollenrecht `Dokumente ausstellen` ausgestellt.

Jedes offizielle Verwaltungsdokument:

- erhält automatisch eine eindeutige Dokumentnummer
- kann ein optionales Ablaufdatum besitzen
- kann über eine öffentliche Prüfnummer beziehungsweise QR-Verifikation auf Echtheit geprüft werden
- kann nachträglich widerrufen werden

Beim Widerruf ist ein Grund Pflicht.

Die öffentliche Verifikation zeigt **nur `gültig` beziehungsweise `ungültig`**. Dokumentart, Ausstellungsdatum oder Name des Inhabers werden dort nicht zusätzlich veröffentlicht.

## Lizenzen und Genehmigungen

Die Stadtverwaltung verwaltet Lizenzen und Genehmigungen zentral im Nexus.

- Die Stadtverwaltung darf eigene Lizenz-/Genehmigungsarten anlegen.
- Eine Lizenz/Genehmigung kann erteilt, pausiert und entzogen werden.
- Beim Entzug ist ein Grund Pflicht.
- Bürger sehen ihre eigenen aktiven und abgelaufenen Lizenzen/Genehmigungen.
- Lizenz-/Genehmigungsarten können eine Standard-Gültigkeitsdauer besitzen.
- Bürger werden vor Ablauf automatisch erinnert.
- Je Lizenzart kann eingestellt werden, ob Bürger sie direkt über Nexus beantragen dürfen.
- Das System unterstützt zusätzlich Lizenzen/Genehmigungen für Organisationen beziehungsweise Firmen.

### Zugriff durch PD

PD darf nur solche Lizenzarten direkt einsehen, die ausdrücklich für die Polizeiarbeit freigegeben wurden.

Welche Lizenzarten das sind, legt die **Stadtverwaltung je Lizenzart** fest.

### Zugriff durch normale Unternehmen

Normale Unternehmen erhalten keinen pauschalen Zugriff.

Ein Unternehmen darf eine Bürgerlizenz nur sehen, wenn der Bürger diese gezielt freigibt.

## Gebühren / Zahlungsstatus

Die Stadtverwaltung kann Gebühren beziehungsweise Zahlungsstatus zu Anträgen oder Dokumenten als **reinen RP-Status** erfassen.

LG Nexus bleibt dabei bewusst ohne echte Zahlungsanbieter und ohne echtes Geld.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- internes Bürgerverwaltungs-Modul
- Accountstatus- und dauerhafte Statushistorie
- interne Bürgernotizen mit Versionshistorie
- getrennte Account-/Passwort-/Sicherheitsrechte
- Vier-Augen-Freigabe für `disabled`
- 6-Monats-Protokoll für Passwort-Resets
- Sicherheitsaktion zum Beenden aller Sitzungen ohne Sitzungseinsicht
- Verwaltungs-Dashboard
- Bürgeranträge mit Kategorien, individuellen Formularen, Pflichtfragen, Status, Mehrfachzuweisung und internen Kommentaren
- Bürger-Bearbeitung nur im Status `Neu`
- interne Weiterleitung mit Benachrichtigung
- externe Link-Anhänge
- 6-Monats-Aufbewahrung abgeschlossener Bürgeranträge
- interne Bereichskalender der Stadtverwaltung
- offizielle Dokumente mit Vorlagen, Dokumentnummern und Widerruf
- öffentliche Prüfnummer/QR-Verifikation mit minimaler Ausgabe
- zentrale Lizenz-/Genehmigungsarten und Status
- Standard-Gültigkeitsdauer und Ablauf-Erinnerungen
- Lizenzanträge durch Bürger je Lizenzart
- Organisations-/Firmenlizenzen
- explizite PD-Freigabe je Lizenzart durch die Stadtverwaltung
- gezielte Bürgerfreigabe an Unternehmen
- reine RP-Gebühren-/Zahlungsstatus

Interne Verwaltungsnotizen und sensible Verwaltungsdaten müssen serverseitig strikt vor normalen Bürgern und unberechtigten Organisationen geschützt werden.