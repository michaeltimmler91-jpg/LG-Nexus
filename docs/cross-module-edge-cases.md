# LG Nexus – Modulübergreifende Sonderfälle

Dieses Dokument beschreibt verbindliche Regeln für Sonderfälle, die mehrere Nexus-Module betreffen.

## Rechteentzug während eines geöffneten Datensatzes

Wird einem Nutzer während der Bearbeitung das notwendige Recht entzogen:

- Zugriff und Speichern werden sofort gestoppt
- der **aktuelle** Berechtigungsstatus ist maßgeblich
- zuvor geladene geschützte Daten dürfen nicht als dauerhafte Leseberechtigung behandelt werden
- bei unklarer Lage wird die Aktion blockiert und eine berechtigte Entscheidung verlangt

Wenn Datenzugriff betroffen ist, kann der Vorgang als Sicherheits-/Auditereignis protokolliert werden. Direkt betroffene Stellen können benachrichtigt werden.

## Organisationsaustritt während laufender Vorgänge

Ein Austritt erzeugt keine automatische dauerhafte Weiterberechtigung.

- die strengste beteiligte Berechtigungsregel gilt
- offene Zuweisungen werden geprüft
- bei Bedarf wird der Vorgang in einen sicheren Zustand gesetzt beziehungsweise manuell neu zugewiesen
- nur ausdrücklich weiter erlaubte historische/archivierte Inhalte bleiben sichtbar

## Account-Sperre bei Bewerbungen/Anträgen

Bei `suspended`:

- der Account kann laufende Bewerbungen/Anträge nicht weiter bearbeiten
- aktueller Accountstatus hat Vorrang
- Organisation/Stadt kann den Vorgang intern entsprechend der normalen Rechte weiterführen
- unklare Aktionen werden blockiert

## Disabled-Account in PD-/Justice-Verfahren

Ein `disabled`-Account erhält keinen neuen Zugriff.

Historische Referenzen bleiben jedoch erhalten:

- Nexus-ID
- historischer Name
- Beteiligtenrolle im Verfahren/Fall

PD-/Justice-Verfahren dürfen durch die Accountlöschung nicht beschädigt oder automatisch gelöscht werden.

## Organisationsumbenennung

Organisationen werden intern über eine feste unveränderliche Organisations-ID referenziert.

Bei einer Umbenennung:

- ändert sich nur der Anzeigename
- bestehende Links und Datensatzverknüpfungen bleiben gültig
- keine manuelle Reparatur der Verknüpfungen erforderlich

## Organisationsarchivierung mit offenen Vorgängen

Archivierung stoppt den normalen internen Zugriff der Organisation.

Offene Vorgänge dürfen nicht stillschweigend als normal weiterlaufend behandelt werden. Sie werden sicher beendet, übertragen oder durch berechtigte Stellen entschieden.

## Rollenlöschung/-deaktivierung mit offenen Zuweisungen

Eine Rolle darf nicht dazu führen, dass offene Aufgaben, Termine, Mailpostfächer oder andere Datensätze in einen ungültigen Zustand geraten.

Vor beziehungsweise bei Deaktivierung:

- offene Zuweisungen erkennen
- in sicheren Zwischenzustand setzen
- neue Rolle/Person zuordnen oder Berechtigung entfernen
- historische Autorenschaft erhalten

## Privatsphäreänderung nach früherer Freigabe

Aktuelle Privatsphäre hat für zukünftigen Zugriff Vorrang.

Wird eine Freigabe entzogen:

- Nexus liefert die Daten zukünftig nicht mehr aus
- bestehende systeminterne Verknüpfungen werden nicht als Umgehung verwendet
- bei unklaren Fällen wird die strengere Regel angewendet oder der Zugriff blockiert

Fachlich vorgeschriebene historische Aktenbestände bleiben intern erhalten, auch wenn die betroffene Person ihren normalen Profilzugriff ändert.

## Benutzerblockierung bei gemeinsamer Organisationsarbeit

Eine persönliche Blockierung darf notwendige interne Organisationsarbeit nicht zerstören.

- öffentliche/private Direktkontakte werden nach Blockierregeln eingeschränkt
- notwendige interne Organisationskontakte bleiben möglich
- Organisationsberechtigung und die strengste einschlägige Regel bleiben maßgeblich

## Gleichzeitige Bearbeitung desselben Datensatzes

Nexus verwendet **optimistische Konfliktkontrolle**.

Ablauf:

1. Zwei Nutzer öffnen denselben Datensatz.
2. Nutzer A speichert zuerst erfolgreich.
3. Nutzer B versucht danach mit einer veralteten Version zu speichern.
4. Nexus blockiert den zweiten Speichervorgang und zeigt eine Konfliktmeldung.
5. Die noch nicht gespeicherten Eingaben von Nutzer B bleiben im Formular sichtbar und kopierbar.
6. Nutzer B kann seine Daten kopieren, den Datensatz neu öffnen und die Änderungen auf dem aktuellen Stand erneut eintragen.

Es wird nicht pauschal der komplette Datensatz für alle anderen gesperrt, nur weil eine Person ihn geöffnet hat.

Technisch sollte jeder bearbeitbare Datensatz dafür einen Versions-/Änderungszähler oder einen vergleichbaren Concurrency-Token besitzen.
