# LG Nexus – Organisationsrollen und Berechtigungen

Dieses Dokument bündelt die aktuell festgelegten Regeln für Organisationsrollen, Mitgliederverwaltung, Owner, öffentliche Organisationsdarstellung, Organisations-Mail, Dokumente, Ankündigungen, Bewertungen, Gründungsanträge und Eingriffe der Stadtverwaltung.

## Grundprinzip

- Ein Mitglied besitzt innerhalb derselben Organisation **genau eine Rolle gleichzeitig**.
- Ein Bürger kann Mitglied mehrerer Organisationen sein und besitzt dort jeweils eine eigene Rolle.
- Rollen bestehen aus sichtbarer Bezeichnung, Hierarchieposition und einem Rechtepaket.
- Berechtigungen werden serverseitig beziehungsweise über Supabase/RLS geprüft; UI-Ausblendungen allein reichen nicht.
- Normale Organisationsrechte geben niemals automatisch Zugriff auf Daten anderer Organisationen.

## Normale Rollen

Normale Rollen können von der Organisation frei gestaltet werden. Sie besitzen:

- einen innerhalb der Organisation eindeutigen Namen
- eine optionale Kurzbeschreibung
- eine optionale Farbe
- ein optionales Icon aus der festen Nexus-Iconbibliothek
- eine Hierarchieposition
- ein organisations-/modulabhängiges Rechtepaket

Zwei normale Rollen derselben Organisation dürfen nicht denselben Namen besitzen. Eine maximale Anzahl normaler Rollen gibt es nicht.

### Standardrolle

Jede neue Organisation erhält zunächst die normale Rolle `Mitarbeiter` als Standardrolle.

- Es muss jederzeit genau eine aktive normale Standardrolle geben.
- Nur ein Owner darf festlegen, welche normale Rolle Standardrolle ist.
- Neue und erneut aufgenommene Mitglieder erhalten automatisch die aktuelle Standardrolle.
- Vor einem Wechsel zeigt das Frontend eine Bestätigung wie `Neue Mitglieder erhalten künftig Rolle X.`
- Der Wechsel der Standardrolle wird nicht protokolliert.
- Die Standardrolle darf umbenannt werden.
- Soll die Standardrolle gelöscht oder deaktiviert werden, muss vorher eine andere aktive normale Rolle als Standardrolle gewählt werden.

### Rollen erstellen, bearbeiten und löschen

Das normale Recht `Rollen verwalten` reicht **nicht** zum Erstellen, Umbenennen oder Löschen normaler Rollen und auch nicht zum Ändern ihrer Berechtigungen. Diese Strukturänderungen bleiben Ownern vorbehalten.

Eine normale Rolle darf nur gelöscht werden, wenn ihr kein Mitglied mehr zugewiesen ist und mindestens eine andere normale Rolle bestehen bleibt. Vor dem Löschen ist eine Sicherheitsbestätigung erforderlich.

Owner dürfen Rollen duplizieren. Beim Duplizieren werden **nur die Berechtigungen** übernommen; Name, Beschreibung, Farbe und Icon werden nicht automatisch kopiert.

### Rollen deaktivieren

Owner dürfen normale Rollen deaktivieren und später reaktivieren.

- Mitglieder dürfen nicht auf einer deaktivierten Rolle verbleiben.
- Eine deaktivierte Rolle darf nicht neu zugewiesen werden.
- Vor der Deaktivierung müssen alle Mitglieder auf aktive Rollen wechseln.
- Die deaktivierte Rolle bleibt in der Rollenverwaltung sichtbar.
- Ihr Name bleibt reserviert.
- Ein Owner darf sie umbenennen.
- Eine deaktivierte, unbenutzte Rolle darf gelöscht werden.
- Nach Reaktivierung wird sie ganz unten in die normale Hierarchie eingeordnet.
- Aktivierung und Deaktivierung werden protokolliert.

### Rollenrechte

Rollenrechte werden im Editor nach Modulen/Themen gruppiert, zum Beispiel `Allgemein`, `Medical`, `Ausbildung`, `Akten` oder `Verwaltung`.

- Änderungen wirken **sofort** für alle Mitglieder dieser Rolle.
- Vor dem Speichern geänderter Rollenrechte ist eine Bestätigung erforderlich.
- Beim Aktivieren weitreichender Rechte wie `Mitglieder verwalten` oder `Rollen verwalten` erscheint eine zusätzliche Warnung.
- Änderungen an Rollenfarbe, Rollen-Icon oder Rollenbeschreibung werden nicht protokolliert.

## Hierarchie und Rollenvergabe

Die Owner-Rolle steht technisch immer oberhalb aller normalen Rollen und ist nicht verschiebbar.

Normale Rollen können per Drag & Drop sortiert werden. Dafür ist `Rollen verwalten` nötig.

Für ein normales Mitglied mit `Rollen verwalten` gilt:

- die eigene Rolle darf nicht verschoben werden
- Rollen oberhalb der eigenen Rolle dürfen nicht verschoben werden
- Rollen unterhalb der eigenen Rolle dürfen frei untereinander sortiert werden

Owner dürfen die gesamte normale Hierarchie verwalten.

Für `Rollen zuweisen` gilt:

- die eigene Rolle darf nicht selbst geändert werden
- die Rolle eines gleichrangigen oder höherrangigen Mitglieds darf nicht geändert werden
- Zielrollen müssen unterhalb der eigenen Rolle liegen
- Mitglieder unterhalb der eigenen Stufe dürfen innerhalb dieses Bereichs hoch- oder herabgestuft werden

Owner dürfen jedem normalen Mitglied jede beliebige **aktive** normale Rolle geben, unabhängig von der Hierarchie.

## Mitglieder aufnehmen und entfernen

Neue Mitglieder dürfen durch Owner oder Rollen mit `Mitglieder verwalten` aufgenommen werden.

- Die Aufnahme erfolgt sofort, ohne Bestätigung des neuen Mitglieds.
- Neue Mitglieder erhalten automatisch die Standardrolle.
- Ein Nicht-Owner mit `Mitglieder verwalten` darf aufnehmen, wenn die Standardrolle unterhalb seiner eigenen Hierarchiestufe liegt.
- Ehemalige Mitglieder können später erneut aufgenommen werden.
- Eine Rückkehr erfolgt immer als neue Aufnahme; eine frühere Entfernung wird nicht einfach rückgängig gemacht.
- Es gibt keine maximale Mitgliederzahl.

Nur Owner dürfen normale Mitglieder entfernen. Vor der Entfernung ist eine Sicherheitsbestätigung erforderlich. Ein optionaler Freitext-Grund ist möglich, wird der entfernten Person angezeigt und kann später nicht verändert werden. Owner können andere Owner nicht entfernen.

Ein Mitglied darf selbst austreten, auch wenn es inaktiv/beurlaubt ist. Vor dem Austritt ist eine Bestätigung erforderlich; ein eigener Austrittsgrund ist optional.

## Interne Mitgliedsdaten und Notizen

Owner und Rollen mit `Mitglieder verwalten` dürfen interne Mitgliedsnotizen sehen. Das betroffene Mitglied selbst sieht seine eigenen Notizen nicht.

Für normale Rollen mit `Mitglieder verwalten` gilt zusätzlich: Interne Mitgliedsdaten dürfen nur bei Mitgliedern **unterhalb der eigenen Hierarchiestufe** bearbeitet werden.

Notizen dürfen von Ownern und `Mitglieder verwalten` angelegt werden. Bearbeiten oder löschen dürfen sie nur der ursprüngliche Ersteller oder ein Owner. Änderungen/Löschungen werden nicht protokolliert. Bei einer späteren Wiederaufnahme werden frühere Notizen wieder sichtbar.

## Inaktiv / beurlaubt

Normale Mitglieder können auf `inaktiv/beurlaubt` gesetzt werden, ohne Mitgliedschaft oder Rolle zu verlieren.

- Ein Grund ist optional und für die betroffene Person sichtbar.
- Der Grund kann später nicht bearbeitet werden.
- Owner und Rollen mit `Mitglieder verwalten` dürfen den Grund sehen.
- Es gibt keinen Zeitraum von/bis; der Status bleibt bis zur manuellen Änderung bestehen.
- Owner haben eine separate Ansicht/einen Filter für inaktive Mitglieder.
- Inaktive Mitglieder werden in der normalen öffentlichen Mitgliederliste nicht angezeigt.
- Interne Organisationsbereiche sind vollständig gesperrt.
- Öffentliche Organisationsseiten bleiben sichtbar.
- Während der Inaktivität erhält das Mitglied keine allgemeinen internen Organisationsbenachrichtigungen, keine persönlichen Organisationsmeldungen und keine internen Organisations-Mails.
- Das Setzen und Aufheben von `inaktiv/beurlaubt` wird protokolliert.

Ein normales Mitglied darf sich selbst auf inaktiv setzen; ein separates Anfragesystem ist nicht vorgesehen. Eine normale Rolle mit `Mitglieder verwalten` darf nur Mitglieder unterhalb der eigenen Hierarchiestufe inaktiv setzen oder reaktivieren.

Ein Owner darf ein inaktives normales Mitglied weiterhin entfernen. Die Rolle eines inaktiven normalen Mitglieds darf nach den normalen Hierarchieregeln geändert werden. Ein inaktives Mitglied darf nicht direkt zum Owner ernannt werden; es muss vorher wieder aktiv sein.

## Geschützte Owner-Rolle

Jede Organisation besitzt eine feste, systemgeschützte Owner-Rolle.

- Sie kann nicht gelöscht werden.
- Sie besitzt immer sämtliche für die Organisation verfügbaren Rechte.
- Ihre Rechte können nicht reduziert werden.
- Mehrere Personen dürfen gleichzeitig Owner sein.
- Alle Owner derselben Organisation sind gleichgestellt.
- Owner können sich gegenseitig nicht entfernen, zurückstufen oder auf inaktiv setzen.

### Sichtbare Owner-Bezeichnung

Die sichtbare Bezeichnung der Owner-Rolle wird ausschließlich von der Stadtverwaltung als freier Text festgelegt, zum Beispiel `Geschäftsführer`, `Chief` oder `Direktor`.

- Alle Owner derselben Organisation verwenden dieselbe Bezeichnung.
- Owner können die Bezeichnung nicht selbst ändern.
- Änderungen werden protokolliert.
- Owner werden bei einer Änderung benachrichtigt.
- Ein Grund ist nicht erforderlich.
- Auf dem öffentlichen Organisationsprofil wird die Owner-Bezeichnung nicht als eigener Profilpunkt angezeigt.

### Owner-Farbe und Owner-Icon

Farbe und Icon der Owner-Rolle dürfen nur durch einen speziell festgelegten Design-Owner geändert werden.

- Die Stadtverwaltung bestimmt den Design-Owner.
- Gibt es genau einen Owner, ist dieser automatisch Design-Owner.
- Der Design-Owner kann nicht beliebig beziehungsweise jederzeit gewechselt werden.
- Ein Wechsel wird nicht protokolliert.
- Änderungen an Owner-Farbe oder Owner-Icon werden nicht protokolliert.

Ein technischer Ausnahmeweg für den Fall, dass der Design-Owner die Owner-Rolle verliert oder die Organisation verlässt, wird bei der Umsetzung noch konkretisiert.

### Weitere Owner ernennen

Ein bestehender Owner darf jedes **aktive normale Mitglied** derselben Organisation zum weiteren Owner ernennen, unabhängig von dessen vorheriger normaler Rolle.

- Die Ernennung benötigt keine Zustimmung des ernannten Mitglieds.
- Vor der Ernennung erscheint eine deutliche Warnung über die vollständigen Owner-Rechte.
- Die Ernennung wirkt sofort.
- Eine zusätzliche interne Notiz ist nicht vorgesehen.
- Die Ernennung wird protokolliert.

### Eigene Owner-Rolle abgeben / Organisation verlassen

Ein Owner darf seine eigene Owner-Rolle freiwillig abgeben. Eine Bestätigung ist erforderlich. Die Person bleibt Mitglied und wählt selbst eine vorhandene normale Rolle. Die freiwillige Owner-Abgabe wird nicht protokolliert; auch der letzte Owner darf sie durchführen.

Ein Owner darf außerdem die Organisation direkt verlassen. Dabei wird seine Owner-Rolle automatisch aufgegeben und die Mitgliedschaft beendet. Ein optionaler Austrittsgrund ist möglich. Ist dies der letzte Owner, wird die Stadtverwaltung benachrichtigt.

## Organisationen ohne Owner

Eine Organisation darf vorübergehend 0 Owner besitzen.

- Normale Rollen und ihre bisherigen Rechte funktionieren weiter.
- Die Organisation bleibt öffentlich sichtbar.
- Im internen Bereich erscheint ein Hinweis, dass aktuell kein Owner vorhanden ist.
- Die Stadtverwaltung erhält eine Übersicht über Organisationen ohne Owner.
- Diese Organisationen werden im Stadtverwaltungs-Dashboard besonders markiert.
- Aus dieser Übersicht kann direkt die Notfall-Owner-Zuweisung geöffnet werden.

## Notfall- und Verwaltungsrechte der Stadtverwaltung

### Owner einsetzen

Die Stadtverwaltung darf per Notfallfunktion einen neuen Owner einsetzen, **nur wenn aktuell überhaupt kein Mitglied die Owner-Rolle besitzt**. Ein inaktiver Owner zählt weiterhin als vorhandener Owner. Ein inaktives Mitglied darf nicht zum Owner gemacht werden; es muss vorher aktiv sein.

### Owner-Rolle entziehen

Die Stadtverwaltung darf einem bestehenden Owner die Owner-Rolle entziehen, auch wenn weitere Owner vorhanden sind.

- Die betroffene Person bleibt Mitglied.
- Die Stadtverwaltung wählt die neue normale Rolle.
- Der Eingriff wird protokolliert.
- Betroffene Person und übrige Owner werden benachrichtigt.

### Owner inaktiv/aktiv setzen

Nur die Stadtverwaltung darf einen Owner auf `inaktiv/beurlaubt` setzen oder wieder aktivieren.

- Beim Inaktivsetzen ist ein Grund Pflicht.
- Der Grund ist für den betroffenen Owner und die übrigen Owner sichtbar.
- Der Eingriff wird protokolliert.
- Betroffener Owner und übrige Owner werden benachrichtigt.

### Weitere Stadtverwaltungsrechte bei normalen Organisationen

Dafür berechtigte Stadtverwaltungs-Personen dürfen:

- die vollständige Mitgliederliste sehen, auch wenn sie öffentlich verborgen ist
- interne Mitgliedsnotizen einsehen
- allgemeine interne Dokumente normaler Organisationen einsehen, bearbeiten und neu erstellen
- normale Mitglieder aus einer Organisation entfernen
- die Liste ehemaliger Mitglieder einsehen

Sie dürfen dagegen nicht:

- normale Mitglieder direkt aufnehmen
- normale Rollen eines Mitglieds ändern
- normale Mitglieder über die Stadtverwaltung auf inaktiv/aktiv setzen
- allgemeine interne Dokumente löschen

Besonders geschützte Medical-/Police-/Justice-Bereiche können strengere eigene Zugriffsregeln erhalten.

## Öffentliche Mitgliederliste

Die Organisation entscheidet, ob ihre Mitgliederliste öffentlich sichtbar ist. Diese Einstellung kann **nur durch Owner** geändert werden.

Wenn die Liste sichtbar ist:

- nur aktive Mitglieder werden angezeigt
- Owner stehen ganz oben
- danach wird nach Rollen-Hierarchie sortiert
- Rollenfarbe, Rollen-Icon und Rollenbeschreibung werden öffentlich nicht angezeigt
- es gibt keine eigene Namenssuche innerhalb der Mitgliederliste
- sichtbare Mitglieder können zum Nexus-Personenprofil geöffnet werden

Wenn die Liste verborgen ist:

- aktive Owner bleiben sichtbar
- bei Ownern werden Name und Nexus-ID angezeigt
- die exakte Anzahl aktiver Mitglieder darf angezeigt werden
- inaktive Mitglieder zählen nicht mit

Ehemalige Mitglieder werden niemals öffentlich angezeigt. Ein suspendierter/gesperrter Nexus-Account bleibt sichtbar, solange die Organisationsmitgliedschaft und die übrigen Sichtbarkeitsregeln bestehen.

## Öffentliches Organisationsprofil

Das öffentliche Organisationsprofil darf nur durch Owner bearbeitet werden. Ebenfalls nur Owner dürfen Öffnungsstatus, Statusmeldung und öffentliche Sichtbarkeit der Mitgliederliste ändern.

### Profilfelder

- Organisationsname: nur Stadtverwaltung änderbar
- Kurzbezeichnung: möglich, aber nur Stadtverwaltung änderbar
- Beschreibung: normaler unformatierter Text
- öffentliche Telefonnummer: genau eine
- Standorte: mehrere Standorte/Filialen möglich
- Statusmeldung: optional, maximal 120 Zeichen
- öffentliche Öffnungszeiten: möglich
- öffentliche Nexus-Mailadresse: jede Organisation erhält eine
- externe Links/Social-Media-Links: möglich
- Logo/Banner: eigener Upload oder Nexus-Bibliothek
- Profilvorschau vor dem Speichern: ja

Telefon, Standorte, Logo und Banner gehören zur normalen Owner-Profilbearbeitung. Profiländerungen werden mit alten und neuen Werten protokolliert; Öffnungsstatus und Mitgliederlisten-Sichtbarkeit dagegen nicht.

## Öffnungszeiten

Öffnungszeiten werden als einfacher frei formulierbarer Text gepflegt.

- Mehrere Öffnungsblöcke an einem Tag sind möglich, z. B. `08:00–12:00 / 14:00–18:00`.
- Sonderöffnungszeiten für einzelne Tage/Events sind nicht als eigene Funktion vorgesehen.
- Keine automatische Feiertagslogik.
- Keine automatische Berechnung von `Jetzt geöffnet / geschlossen`.
- Der manuelle Organisationsstatus ist maßgeblich und hätte auch bei einer späteren Automatik Vorrang.

## Standorte / Filialen

Organisationen dürfen mehrere Standorte besitzen. Jeder Standort darf einen eigenen Namen, eigene Öffnungszeiten, einen Kartenmarker und einen Aktiv/Deaktiv-Status besitzen. Es gibt einen festgelegten Hauptstandort. Standorte besitzen keine eigene öffentliche Telefonnummer; verwendet wird die zentrale Organisationsnummer.

## Organisations-Nexus-Mail

Jede Organisation erhält automatisch eine aus dem Organisationsnamen erzeugte Nexus-Mailadresse und einen gemeinsamen Posteingang.

### Rechte und Sichtbarkeit

- `Organisations-Mail lesen` erlaubt Lesen, als gelesen markieren und Status ändern.
- Als Organisation senden oder antworten dürfen nur Owner.
- Intern wird gespeichert, welcher konkrete Owner/Mitarbeiter eine Organisations-Mail geschrieben hat; der externe Empfänger sieht als Absender nur die Organisation.
- Interne Kommentare im Mailthread sind **für den externen Absender nicht sichtbar**.

### Status, Zuweisung und Priorität

Eine Mail besitzt den Status `neu`, `in Bearbeitung` oder `erledigt` und optional die Priorität `Niedrig`, `Normal`, `Hoch` oder `Dringend`.

- Mails können mehreren Mitarbeitern gleichzeitig zugewiesen werden.
- Zuweisen dürfen Owner oder Rollen mit `Mail zuweisen`.
- Zugewiesene Mitarbeiter dürfen selbst auf `erledigt` setzen.
- Zugewiesene Mitarbeiter erhalten eine Nexus-Benachrichtigung.
- Eine einmal vorgenommene Zuweisung kann anschließend nicht geändert werden.
- Der Zuweisungsverlauf bleibt sichtbar.
- Mails können als `wichtig` markiert werden.
- Der externe Absender darf sehen, ob seine Mail gelesen wurde.

### Kommentare

Jeder mit `Organisations-Mail lesen` darf interne Kommentare schreiben. Diese Kommentare sind ausschließlich intern und für den externen Absender unsichtbar.

### Ordner, Labels, Suche und Entwürfe

- Mail-Ordner/Labels sind gemeinsam für die ganze Organisation.
- Nur Owner dürfen gemeinsame Ordner/Labels erstellen und verwalten.
- Suche und Filter nach Status/Zuweisung sind vorgesehen.
- Organisations-Mails können weitergeleitet werden.
- Es gibt Entwürfe; alle Personen mit `Organisations-Mail lesen` dürfen die gemeinsamen Entwürfe sehen.
- Eine separate Archiv-Funktion ist nicht vorgesehen.

### Signatur, Abwesenheit und Vorlagen

- Die Organisation kann eine feste Mail-Signatur hinterlegen; ändern dürfen sie nur Owner.
- Automatische Abwesenheits-/Antwortnachrichten sind möglich.
- Mail-Vorlagen sind vorgesehen und dürfen nur von Ownern erstellt beziehungsweise bearbeitet werden.

### Anhänge und Papierkorb

- Organisations-Mails unterstützen keine Dateianhänge.
- Owner dürfen Mails löschen.
- Gelöschte Mails landen für 30 Tage im Papierkorb.
- Nur Owner dürfen gelöschte Mails aus dem Papierkorb wiederherstellen.
- Danach werden sie endgültig gelöscht.

## Allgemeiner interner Dokumentenbereich

Jede Organisation besitzt einen allgemeinen internen Dokumentenbereich.

### Struktur und Berechtigungen

- Eine Ordnerstruktur ist möglich.
- Ordner dürfen durch Rollen mit `Dokumente verwalten` erstellt und verwaltet werden.
- Ganze Ordner können nur für bestimmte Rollen sichtbar sein.
- Dokumente in einem rollenbeschränkten Ordner **erben automatisch die Sichtbarkeitsberechtigungen dieses Ordners**.
- Neue Dokumente dürfen über `Dokumente erstellen` angelegt werden.
- Zwei Dokumente im selben Ordner dürfen nicht denselben Namen besitzen.
- Dokumente können für mehrere Rollen gleichzeitig oder ausschließlich für Owner sichtbar sein.
- Dokumente können als `nur lesen` oder `bearbeitbar` freigegeben werden.
- Wird eine Rolle gelöscht, werden ihre Dokument-Freigaben automatisch entfernt.
- Personen mit `Dokumente verwalten` dürfen Dokumente zwischen Ordnern verschieben.
- Dokument-Favoriten sind persönlich pro Benutzer.
- Dokumente können angepinnt/favorisiert werden und sind volltextsuchbar.
- Eine Funktion `Dokument duplizieren` ist nicht vorgesehen.

### Dokument-Vorlagen

Dokument-Vorlagen sind vorgesehen. Sie dürfen ausschließlich von Ownern verwaltet werden.

### Kommentare und Zusammenarbeit

- Die Kommentar-Funktion ist **pro Dokument optional aktivierbar**.
- Wenn aktiviert, können Mitglieder Kommentare schreiben.
- @-Erwähnungen anderer Mitglieder sind möglich und erzeugen Nexus-Benachrichtigungen.
- Mehrere Personen dürfen ein Dokument gleichzeitig bearbeiten.
- Änderungen werden automatisch gespeichert.

### Versionen

- Ersteller und letzter Bearbeiter werden gespeichert.
- Dokumente besitzen einen Versionsverlauf.
- Jede Version zeigt Datum/Uhrzeit und Bearbeiter.
- Eine ältere Version darf wiederhergestellt werden.
- Beim Wiederherstellen wird die verdrängte aktuelle Fassung nicht automatisch als zusätzliche neue Version gesichert.

### Dateien, Export und öffentliche Freigabe

- Dokumente besitzen keine Dateianhänge.
- Komplette Datei-Uploads wie PDF/Bild sind in diesem allgemeinen Dokumentenbereich nicht vorgesehen.
- Ein PDF-Export interner Dokumente ist nicht vorgesehen.
- Ein internes Dokument darf gezielt öffentlich freigegeben werden.

### Löschen und Papierkorb

- Nur Owner dürfen Dokumente löschen.
- Gelöschte Dokumente landen 14 Tage im Papierkorb.
- Nur Owner dürfen sie wiederherstellen.
- Danach erfolgt die endgültige Löschung.
- Löschen/Wiederherstellen wird nicht zusätzlich protokolliert.

### Stadtverwaltung

Berechtigte Stadtverwaltungs-Personen dürfen allgemeine interne Dokumente normaler Organisationen ansehen, bearbeiten und neu erstellen, aber nicht löschen. Stadtverwaltungs-Bearbeitungen werden im Versionsverlauf eindeutig gekennzeichnet; die Organisation erhält darüber eine Nexus-Benachrichtigung.

## Interne Ankündigungen

Organisationen können interne Ankündigungen erstellen.

- Das Erstellen erfolgt über ein eigenes Ankündigungs-Rollenrecht.
- Jede Person mit diesem Recht darf Ankündigungen bearbeiten und löschen.
- Ankündigungen können an alle Mitglieder oder gezielt an eine/mehrere Rollen gerichtet werden.
- Sie können als `wichtig` markiert werden.
- Wichtige Ankündigungen müssen bestätigt werden und werden bis zur Bestätigung beim Login deutlich angezeigt.
- Berechtigte Personen können sehen, wer gelesen/bestätigt hat.
- Inaktive Mitglieder sehen wichtige Ankündigungen nicht.
- Eine Ankündigung kann ein Ablaufdatum besitzen; danach wird sie archiviert.
- Archivierte Ankündigungen bleiben 6 Monate gespeichert.
- Anhänge/Bilder sind nicht vorgesehen.
- Es gibt keine Entwürfe und keine zeitgesteuerte Veröffentlichung.
- Eine einmal veröffentlichte Ankündigung darf nicht nachträglich bearbeitet werden.
- Mehrere Ankündigungen können gleichzeitig angepinnt werden.

### Kommentar-Funktion bei Ankündigungen

Kommentare/Antworten sind optional pro Ankündigung aktivierbar.

- Ist die Funktion aktiviert, dürfen Mitglieder kommentieren.
- Eigene Kommentare dürfen bearbeitet werden.
- Löschen dürfen der jeweilige Kommentar-Ersteller sowie Personen mit dem Ankündigungsrecht.
- Ist die Funktion deaktiviert, besitzt die Ankündigung keine Kommentar-/Antwortfunktion.

## Bewertungen von Organisationen

Öffentliche Bewertungen sind vorgesehen.

- Jeder aktive Nexus-Bürger darf bewerten.
- Bewertungssystem: 1 bis 5 Sterne.
- Ein zusätzlicher Bewertungstext ist möglich.
- Eigene Bewertungen dürfen später bearbeitet und gelöscht werden.
- Pro Bürger dürfen mehrere aktive Bewertungen derselben Organisation bestehen.
- Owner dürfen öffentlich auf Bewertungen antworten.
- Eine Organisation darf Bewertungen nicht selbst löschen.
- Berechtigte Stadtverwaltungs-Personen dürfen unangemessene Bewertungen entfernen.
- Die durchschnittliche Sternebewertung wird bereits auf der Organisations-/Unternehmenskarte in der Übersicht angezeigt.

## Favoriten

Bürger können Organisationen als Favorit speichern. Favoriten sind privat; die Organisation sieht nicht, wer sie favorisiert hat.

Die separate Funktion `Organisation folgen` ist derzeit **nicht aktiviert**. Sollte sie später doch aktiviert werden, sollen Follower bei neuen öffentlichen Meldungen beziehungsweise News eine Benachrichtigung erhalten.

## Stellenangebote / Bewerbungen

Organisationen dürfen öffentliche Stellenangebote einstellen.

- Stellenangebote werden über ein eigenes Rollenrecht `Stellenangebote verwalten` erstellt und verwaltet.
- Bewerbungen, die über Nexus eingehen, landen in einem eigenen internen Bewerbungsbereich der Organisation.
- Ob Bürger sich direkt über Nexus auf ein Stellenangebot bewerben können, ist noch nicht abschließend entschieden.

## Organisationsgründung / Gründungsanträge

Neue Organisationen können nur durch die Stadtverwaltung angelegt werden. Jeder aktive Bürger darf jedoch einen Gründungsantrag stellen.

Ein Antrag muss gewünschten Organisationsnamen, Beschreibung/Konzept, gewünschten Organisationstyp und mindestens einen gewünschten zukünftigen Owner enthalten. Mehrere Owner sind möglich; jede vorgeschlagene Person muss ihre Nennung bestätigen.

### Bearbeitung und Status

Status: `Entwurf`, `Eingereicht`, `In Prüfung`, `Angenommen`, `Abgelehnt`.

- Antragsteller dürfen offene Anträge bearbeiten und zurückziehen.
- Die Stadtverwaltung darf Änderungen/Ergänzungen verlangen und den Antrag zurückgeben.
- Der vollständige Statusverlauf wird gespeichert.
- Bei Ablehnung ist ein Grund Pflicht.
- Abgelehnte Anträge dürfen später erneut gestellt werden.
- Antragsteller erhalten bei Annahme/Ablehnung eine Nexus-Benachrichtigung.
- Abgeschlossene Gründungsanträge werden 6 Monate gespeichert.

Die Angabe gewünschter Owner bedeutet nicht, dass beim technischen Anlegen sofort ein Owner zugewiesen werden muss. Eine neue Organisation darf zunächst 0 Owner besitzen.

### Freischaltung, Typ und Archivierung

- Neue Organisationen müssen vor öffentlicher Sichtbarkeit durch die Stadtverwaltung freigeschaltet werden.
- Nur die Stadtverwaltung darf den Organisationstyp ändern.
- Die Stadtverwaltung darf Organisationen archivieren.
- Archivierte Organisationen sind öffentlich nicht sichtbar und intern vollständig gesperrt.
- Archivierte Organisationen können reaktiviert werden.
- Die Stadtverwaltung darf Organisationen auch endgültig löschen.

## Ehemalige Mitglieder

Jede Organisation besitzt eine interne Ansicht `Ehemalige Mitglieder` mit Person, Eintrittsdatum, Austritts-/Entfernungsdatum, letzter Rolle und optionalem Entfernungsgrund.

- Der Entfernungsgrund ist für Owner sichtbar und nicht nachträglich änderbar.
- Einträge bleiben maximal 12 Monate und werden danach automatisch entfernt.
- Owner können sie nicht manuell löschen.
- Stadtverwaltung darf die Liste sehen.
- Bei Wiederaufnahme verschwindet der alte Ehemaligen-Eintrag; getrennte historische Zeiträume werden nicht geführt.
- Wiederaufnahme erfolgt mit aktueller Standardrolle.
- Frühere interne Mitgliedsnotizen werden wieder sichtbar.
- Von ehemaligen Mitgliedern erstellte interne Dokumente/Akten bleiben erhalten.
- Der frühere Autor wird darin später nicht mit Name/Nexus-ID angezeigt.

## Protokolle / Audit

Protokolliert werden insbesondere:

- Rollen erstellen, umbenennen, löschen, aktivieren und deaktivieren
- Mitglieder aufnehmen, entfernen und freiwillige Austritte
- Rollenwechsel
- Owner-Ernennungen
- Stadtverwaltungs-Eingriffe an Ownern
- Inaktiv-/Aktiv-Wechsel
- öffentliche Profiländerungen
- Änderungen der sichtbaren Owner-Bezeichnung

Nicht protokolliert werden insbesondere:

- freiwillige Abgabe der eigenen Owner-Rolle
- Wechsel der Standardrolle
- Änderungen konkreter Rollenberechtigungen
- reine Drag-&-Drop-Hierarchieänderungen
- Rollenfarbe/Icon/Beschreibung
- Owner-Farbe/Icon
- Wechsel des Design-Owners
- Öffnungsstatus
- öffentliche Mitgliederlisten-Sichtbarkeit
- Bearbeitung/Löschung interner Mitgliedsnotizen
- Löschen/Wiederherstellen allgemeiner interner Dokumente

Protokolle speichern je nach Ereignis Organisation, Aktion, betroffene Person/Rolle, ausführende Person, Datum/Uhrzeit und relevante alte/neue Werte. Name und Nexus-ID des Ausführenden werden gespeichert; der damalige Name bleibt auch bei später deaktiviertem Account erhalten.

- Nur Owner sehen Organisations-Protokolle innerhalb der Organisation.
- Berechtigte Stadtverwaltung darf sie ebenfalls sehen.
- Es gibt kein frei vergebbares `Protokolle ansehen`.
- Suche und Filter sind vorgesehen.
- CSV-/PDF-Export ist nicht vorgesehen.
- Audit-Protokolle werden 6 Monate aufbewahrt und danach automatisch gelöscht.

## Benachrichtigungen

Das betroffene aktive Mitglied erhält Nexus-Benachrichtigungen bei Aufnahme, Entfernung, Rollenwechsel und Owner-Ernennung.

Owner erhalten zusätzliche Pflichtbenachrichtigungen insbesondere bei freiwilligem Austritt, Aufnahme durch `Mitglieder verwalten`, Inaktiv-/Aktiv-Wechsel, Stadtverwaltungs-Eingriffen an Ownern, Änderung der Owner-Bezeichnung und Wegfall des letzten Owners. Wichtige Organisations-Benachrichtigungen können nicht deaktiviert werden.

Zusätzliche Modul-Benachrichtigungen entstehen unter anderem bei Mail-Zuweisungen, @-Erwähnungen in Dokumenten und Stadtverwaltungs-Bearbeitungen allgemeiner interner Dokumente.

## Sicherheitsabfragen im Frontend

Eine ausdrückliche Bestätigung ist mindestens erforderlich bei freiwilligem Austritt, freiwilliger Owner-Abgabe, direktem Austritt eines Owners, Löschen einer Rolle, Entfernen eines Mitglieds, Ernennung eines Owners, Wechsel der Standardrolle und Speichern geänderter Rollenrechte.

## Offene Detailentscheidungen

Folgende Punkte sind noch nicht eindeutig festgelegt und werden nicht geraten:

- Der technische Ausnahmeweg, wenn der festgelegte Design-Owner wegfällt.
- Ob Bürger sich direkt über Nexus auf ein öffentliches Stellenangebot bewerben können.

## Technische Zielstruktur

`organization_members.role_title` kann vorerst als sichtbarer Titel bestehen bleiben. Für die vollständige Umsetzung soll jede Organisationsmitgliedschaft später genau eine strukturierte Rollenreferenz erhalten.

Voraussichtlich benötigt werden unter anderem:

- `organization_roles`
- Rollen-Hierarchie/Sortierposition
- Rollenberechtigungen
- aktive/deaktivierte Rollen
- Standardrollen-Markierung
- Mitgliedsstatus aktiv/inaktiv
- interne Mitgliedsnotizen
- Ehemaligen-Historie
- Organisationsgründungsanträge mit Statusverlauf und Owner-Bestätigungen
- Organisationsstandorte
- Organisations-Mailpostfach mit Status, Priorität, Mehrfach-Zuweisungen, Zuweisungsverlauf, Kommentaren, Labels/Ordnern, Entwürfen, Vorlagen und Papierkorb
- allgemeiner Dokumentenbereich mit Ordnern, vererbten Rollenfreigaben, Versionen, optionalen Kommentaren, Favoriten/Suche und Papierkorb
- interne Ankündigungen mit Zielrollen, Ablauf/Archivierung, Lesebestätigungen und optionaler Kommentar-Funktion
- Bewertungen, Owner-Antworten und private Favoriten
- Stellenangebote und interner Bewerbungsbereich
- Audit-/Protokolltabellen
- serverseitige/RLS-gesicherte Owner- und Stadtverwaltungsaktionen

Ein Many-to-Many-System zwischen Mitgliedern und Rollen ist nicht erforderlich.