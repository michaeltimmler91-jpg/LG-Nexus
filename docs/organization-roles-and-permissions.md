# LG Nexus – Organisationsrollen und Berechtigungen

Dieses Dokument bündelt die aktuell festgelegten Regeln für Organisationsrollen, Mitgliederverwaltung, Owner, öffentliche Organisationsdarstellung, Organisations-Mail, Dokumente, Ankündigungen und Eingriffe der Stadtverwaltung.

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

Eine normale Rolle darf nur gelöscht werden, wenn:

- ihr kein Mitglied mehr zugewiesen ist und
- mindestens eine andere normale Rolle bestehen bleibt.

Vor dem Löschen ist eine Sicherheitsbestätigung erforderlich.

### Rollen duplizieren

Owner dürfen Rollen duplizieren. Beim Duplizieren werden **nur die Berechtigungen** übernommen. Name, Beschreibung, Farbe und Icon werden nicht automatisch kopiert und können separat festgelegt werden.

### Rollen deaktivieren

Owner dürfen normale Rollen deaktivieren und später reaktivieren.

- Mitglieder dürfen nicht auf einer deaktivierten Rolle verbleiben.
- Eine deaktivierte Rolle darf nicht neu zugewiesen werden.
- Vor der Deaktivierung müssen alle Mitglieder auf aktive Rollen wechseln.
- Die deaktivierte Rolle bleibt in der Rollenverwaltung sichtbar.
- Ihr Name bleibt reserviert und kann nicht von einer anderen Rolle verwendet werden.
- Ein Owner darf eine deaktivierte Rolle umbenennen.
- Eine deaktivierte, unbenutzte Rolle darf gelöscht werden.
- Nach Reaktivierung wird die Rolle **ganz unten** in die normale Hierarchie eingeordnet.
- Aktivierung und Deaktivierung werden protokolliert.

### Rollenrechte

Rollenrechte werden im Editor nach Modulen/Themen gruppiert, zum Beispiel `Allgemein`, `Medical`, `Ausbildung`, `Akten` oder `Verwaltung`.

- Änderungen von Rollenrechten wirken **sofort** für alle Mitglieder dieser Rolle.
- Vor dem Speichern geänderter Rollenrechte ist eine Bestätigung erforderlich.
- Beim Aktivieren weitreichender Rechte wie `Mitglieder verwalten` oder `Rollen verwalten` zeigt das Frontend eine zusätzliche Warnung.
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
- Eine Rückkehr erfolgt immer als neue Aufnahme; eine vorherige Entfernung kann nicht einfach rückgängig gemacht werden.
- Es gibt keine maximale Mitgliederzahl.

### Mitglieder entfernen

- Nur Owner dürfen über die normale Organisationsverwaltung andere normale Mitglieder entfernen.
- Vor der Entfernung ist eine Sicherheitsbestätigung erforderlich.
- Ein optionaler Freitext-Grund ist möglich.
- Ist ein Grund vorhanden, wird er der entfernten Person angezeigt.
- Ein Entfernungsgrund kann später nicht verändert werden.
- Owner können andere Owner nicht entfernen.

Ein Mitglied darf selbst austreten, auch wenn es inaktiv/beurlaubt ist. Vor dem Austritt ist eine Bestätigung erforderlich. Beim freiwilligen Austritt kann optional ein eigener Grund angegeben werden.

## Interne Mitgliedsdaten und Notizen

Owner und Rollen mit `Mitglieder verwalten` dürfen interne Mitgliedsnotizen sehen. Das betroffene Mitglied selbst sieht seine eigenen internen Notizen nicht.

Für normale Rollen mit `Mitglieder verwalten` gilt zusätzlich: Interne Mitgliedsdaten dürfen nur bei Mitgliedern **unterhalb der eigenen Hierarchiestufe** bearbeitet werden.

Notizen:

- dürfen von Ownern und `Mitglieder verwalten` angelegt werden
- dürfen nur vom ursprünglichen Ersteller oder von einem Owner bearbeitet/gelöscht werden
- Änderungen/Löschungen werden nicht protokolliert
- bei einer späteren Wiederaufnahme werden frühere Notizen wieder sichtbar

## Inaktiv / beurlaubt

Normale Mitglieder können auf `inaktiv/beurlaubt` gesetzt werden, ohne Mitgliedschaft oder Rolle zu verlieren.

- Ein Grund ist optional.
- Ist ein Grund vorhanden, darf die betroffene Person ihn sehen.
- Der Grund kann später nicht bearbeitet werden.
- Owner und Rollen mit `Mitglieder verwalten` dürfen den Grund sehen.
- Es gibt keinen Zeitraum von/bis; der Status bleibt bis zur manuellen Änderung bestehen.
- Owner haben eine separate Ansicht/einen Filter für inaktive Mitglieder.
- Inaktive Mitglieder werden in der normalen öffentlichen Mitgliederliste nicht angezeigt.
- Interne Organisationsbereiche sind vollständig gesperrt.
- Öffentliche Organisationsseiten bleiben sichtbar.
- Während der Inaktivität erhält das Mitglied keine allgemeinen internen Organisationsbenachrichtigungen, keine persönlichen Organisationsmeldungen und keine internen Organisations-Mails.
- Das Setzen und Aufheben von `inaktiv/beurlaubt` wird protokolliert.

Ein normales Mitglied darf sich selbst auf inaktiv setzen. Ein separates Anfragesystem ist nicht vorgesehen.

Eine normale Rolle mit `Mitglieder verwalten` darf nur Mitglieder **unterhalb der eigenen Hierarchiestufe** inaktiv setzen oder reaktivieren.

Ein Owner darf ein inaktives normales Mitglied weiterhin entfernen. Die Rolle eines inaktiven normalen Mitglieds darf nach den normalen Hierarchieregeln geändert werden. Ein inaktives Mitglied darf nicht direkt zum Owner ernannt werden; es muss vorher wieder aktiv sein.

## Geschützte Owner-Rolle

Jede Organisation besitzt eine feste, systemgeschützte Owner-Rolle.

- Sie kann nicht gelöscht werden.
- Sie besitzt immer sämtliche für die Organisation verfügbaren Rechte.
- Ihre Rechte können nicht reduziert werden.
- Mehrere Personen dürfen gleichzeitig Owner sein.
- Alle Owner derselben Organisation sind in Bezug auf die Owner-Rolle gleichgestellt.
- Owner können sich gegenseitig nicht entfernen, zurückstufen oder auf inaktiv setzen.

### Sichtbare Owner-Bezeichnung

Die sichtbare Bezeichnung der Owner-Rolle wird **ausschließlich von der Stadtverwaltung** als freier Text festgelegt, zum Beispiel `Geschäftsführer`, `Chief` oder `Direktor`.

- Alle Owner derselben Organisation verwenden dieselbe Bezeichnung.
- Owner können die Bezeichnung nicht selbst ändern.
- Änderungen der Bezeichnung werden protokolliert.
- Bei einer Änderung werden die Owner der Organisation benachrichtigt.
- Ein Grund ist für die Änderung nicht erforderlich.
- Auf dem öffentlichen Organisationsprofil wird die Owner-Bezeichnung nicht als eigener Profilpunkt angezeigt.

### Owner-Farbe und Owner-Icon

Farbe und Icon der Owner-Rolle werden von der Organisation gestaltet, dürfen aber nur durch einen **speziell festgelegten Design-Owner** geändert werden.

- Die Stadtverwaltung bestimmt den Design-Owner.
- Gibt es genau einen Owner, ist dieser automatisch Design-Owner.
- Der Design-Owner kann nicht beliebig beziehungsweise jederzeit gewechselt werden.
- Ein Wechsel des Design-Owners wird nicht protokolliert.
- Änderungen an Owner-Farbe oder Owner-Icon werden nicht protokolliert.

Ein technischer Ausnahmeweg für den Fall, dass der festgelegte Design-Owner die Owner-Rolle verliert oder die Organisation verlässt, wird bei der Umsetzung noch konkretisiert.

### Weitere Owner ernennen

Ein bestehender Owner darf jedes **aktive normale Mitglied** derselben Organisation zum weiteren Owner ernennen, unabhängig von dessen vorheriger normaler Rolle.

- Die Ernennung benötigt keine Zustimmung des ernannten Mitglieds.
- Vor der Ernennung erscheint eine deutliche Warnung, dass die Person vollständige Owner-Rechte erhält.
- Die Ernennung wirkt sofort.
- Eine zusätzliche interne Notiz ist nicht vorgesehen.
- Die Ernennung wird protokolliert.

### Eigene Owner-Rolle abgeben

Ein Owner darf seine eigene Owner-Rolle freiwillig abgeben.

- Eine Bestätigung ist erforderlich.
- Die Person bleibt Mitglied.
- Sie wählt selbst eine aktuell vorhandene normale Rolle.
- Danach gelten sofort nur noch die Rechte dieser Rolle.
- Die freiwillige Owner-Abgabe wird **nicht** protokolliert.
- Auch der letzte Owner darf seine Rolle abgeben.

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

Die Stadtverwaltung darf per Notfallfunktion einen neuen Owner einsetzen, **nur wenn aktuell überhaupt kein Mitglied die Owner-Rolle besitzt**.

Ein inaktiver Owner zählt weiterhin als vorhandener Owner. Ein inaktives Mitglied darf nicht zum Owner gemacht werden; es muss vorher aktiv sein.

Die Stadtverwaltung wird durch die Zuweisung nicht selbst Mitglied oder Owner.

### Owner-Rolle entziehen

Eine berechtigte Person der Stadtverwaltung darf einem bestehenden Owner die Owner-Rolle entziehen, auch wenn weitere Owner vorhanden sind.

- Die betroffene Person bleibt Mitglied.
- Die Stadtverwaltung wählt die neue normale Rolle der Person aus.
- Der Eingriff wird protokolliert.
- Die betroffene Person und die übrigen Owner werden benachrichtigt.

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
- interne Dokumente/Akten einer normalen Organisation einsehen und bearbeiten
- normale Mitglieder aus einer Organisation entfernen
- die Liste ehemaliger Mitglieder einsehen

Sie dürfen dagegen nicht:

- normale Mitglieder direkt aufnehmen
- normale Rollen eines Mitglieds ändern
- normale Mitglieder über die Stadtverwaltung auf inaktiv/aktiv setzen

Diese Rechte gelten für die verwaltungsseitige Organisationsaufsicht. Besondere fachlich geschützte Fraktionsmodule können später strengere, eigene Zugriffsregeln erhalten.

## Öffentliche Mitgliederliste

Die Organisation entscheidet, ob ihre Mitgliederliste öffentlich sichtbar ist. Diese Einstellung kann **nur durch Owner** geändert werden.

Wenn die Liste sichtbar ist:

- nur aktive Mitglieder werden angezeigt
- Owner stehen ganz oben
- danach wird nach Rollen-Hierarchie sortiert
- öffentlich werden weder Rollenfarbe noch Rollen-Icon noch Rollenbeschreibung angezeigt
- es gibt keine eigene Namenssuche innerhalb der Mitgliederliste
- ein sichtbares Mitglied kann angeklickt werden, um dessen Nexus-Personenprofil zu öffnen

Wenn die Liste verborgen ist:

- aktive Owner bleiben sichtbar
- bei Ownern werden Name und Nexus-ID angezeigt
- die exakte Anzahl aktiver Mitglieder darf angezeigt werden
- inaktive Mitglieder zählen nicht in diese öffentliche Anzahl

Ehemalige Mitglieder werden niemals öffentlich angezeigt. Ein suspendierter/gesperrter Nexus-Account bleibt in der öffentlichen Mitgliederliste sichtbar, solange die Organisationsmitgliedschaft weiter besteht und die übrigen Sichtbarkeitsregeln erfüllt sind.

## Öffentliches Organisationsprofil

Das öffentliche Organisationsprofil darf **nur durch Owner** bearbeitet werden. Es gibt dafür kein frei vergebbares normales Rollenrecht.

Ebenfalls nur Owner dürfen:

- Öffnungsstatus ändern
- Statusmeldung ändern
- Mitgliederliste öffentlich sichtbar/versteckt schalten

Der Öffnungsstatus wird vorerst **nur manuell** gepflegt. Sollte später eine automatische Statusberechnung ergänzt werden, hat ein manueller Status Vorrang.

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
- Logo/Banner: Upload eigener Bilder oder Auswahl aus einer Nexus-Bibliothek
- Profilvorschau vor dem Speichern: ja

Telefon, Standorte, Logo und Banner gehören zur normalen Owner-Profilbearbeitung.

Profiländerungen werden protokolliert; dabei werden alte und neue Werte gespeichert. Änderungen des Öffnungsstatus oder der Mitgliederlisten-Sichtbarkeit werden dagegen nicht protokolliert.

## Öffnungszeiten

Öffnungszeiten werden als **einfacher frei formulierbarer Text** gepflegt und nicht als vollautomatisches Zeitregelwerk.

- Mehrere Öffnungsblöcke an einem Tag können im Text angegeben werden, zum Beispiel `08:00–12:00 / 14:00–18:00`.
- Sonderöffnungszeiten für einzelne Tage oder Events sind nicht als eigene Funktion vorgesehen.
- Eine automatische Feiertagslogik ist nicht vorgesehen.
- Nexus berechnet daraus nicht automatisch `Jetzt geöffnet / geschlossen`.
- Der manuelle Organisationsstatus bleibt maßgeblich.

## Standorte / Filialen

Organisationen dürfen mehrere Standorte beziehungsweise Filialen besitzen.

Jeder Standort darf:

- einen eigenen Namen besitzen
- eigene Öffnungszeiten besitzen
- einen eigenen Kartenmarker besitzen
- vorübergehend deaktiviert werden

Es gibt einen festgelegten **Hauptstandort**.

Standorte besitzen **keine eigene öffentliche Telefonnummer**; verwendet wird die zentrale Telefonnummer der Organisation.

## Organisations-Nexus-Mail

Jede Organisation erhält automatisch eine Nexus-Mailadresse, die aus dem Organisationsnamen erzeugt wird.

Die Organisation besitzt einen **gemeinsamen Posteingang**.

- Das Lesen eingehender Organisations-Mails wird über ein eigenes Rollenrecht `Organisations-Mail lesen` gesteuert.
- Als Organisation antworten beziehungsweise neue Organisations-Mails senden dürfen **nur Owner**.
- Mails können intern einem Mitarbeiter zugewiesen werden.
- Eine Organisations-Mail kann den Status `neu`, `in Bearbeitung` oder `erledigt` besitzen.
- Mails dürfen intern kommentiert werden.

Noch offen ist ausschließlich die Darstellungsfrage, ob beziehungsweise für wen sichtbar ist, **welcher konkrete Mitarbeiter eine Organisations-Mail tatsächlich geschrieben hat**.

## Allgemeiner interner Dokumentenbereich

Jede Organisation besitzt einen allgemeinen internen Dokumentenbereich.

- Eine Ordnerstruktur ist möglich.
- Ordner dürfen durch Rollen mit dem eigenen Recht `Dokumente verwalten` erstellt und verwaltet werden.
- Einzelne Dokumente können nur für bestimmte Rollen sichtbar sein.
- Dokumente können als `nur lesen` oder `bearbeitbar` freigegeben werden.
- Der Ersteller eines Dokuments wird gespeichert.
- Der letzte Bearbeiter wird gespeichert.
- Dokumente besitzen einen Versionsverlauf.
- Gelöschte Dokumente landen für **14 Tage** im Papierkorb und können in dieser Zeit wiederhergestellt werden; danach erfolgt die endgültige Löschung.
- Dafür berechtigte Stadtverwaltungs-Personen dürfen allgemeine interne Dokumente normaler Organisationen ansehen **und bearbeiten**.

Fachlich besonders geschützte Aktenbereiche, etwa Medical-/Police-/Justice-Daten, können später abweichende und strengere Regeln erhalten.

## Interne Ankündigungen

Organisationen können interne Ankündigungen erstellen.

- Das Erstellen erfolgt über ein eigenes Rollenrecht.
- Ankündigungen können gezielt an bestimmte Rollen gerichtet werden.
- Ankündigungen können als `wichtig` markiert werden.
- Wichtige Ankündigungen müssen vom Empfänger als gelesen bestätigt werden.
- Berechtigte Personen können sehen, wer eine Ankündigung gelesen beziehungsweise bestätigt hat.

## Organisationsgründung / Gründungsanträge

Neue Organisationen können **nur durch die Stadtverwaltung** angelegt werden. Jeder aktive Bürger darf jedoch einen Gründungsantrag stellen.

Ein Gründungsantrag muss enthalten:

- gewünschten Organisationsnamen
- Beschreibung beziehungsweise Konzept
- gewünschten Organisationstyp
- mindestens einen gewünschten zukünftigen Owner

Es dürfen auch mehrere gewünschte Owner angegeben werden.

Die Stadtverwaltung darf einen Antrag ablehnen. Bei einer Ablehnung ist ein **Ablehnungsgrund Pflicht**. Ein abgelehnter Antrag darf später erneut gestellt werden.

Der Antragsteller erhält bei Annahme oder Ablehnung eine Nexus-Benachrichtigung.

Die Angabe eines gewünschten zukünftigen Owners im Antrag bedeutet nicht, dass beim technischen Anlegen sofort ein Owner zugewiesen werden muss. Eine neu angelegte Organisation darf weiterhin zunächst 0 Owner besitzen.

### Freischaltung und Organisationstyp

- Eine neu angelegte Organisation muss durch die Stadtverwaltung freigeschaltet werden, bevor sie öffentlich ist.
- Beim Anlegen muss nicht sofort ein erster Owner festgelegt werden.
- Eine Organisation darf mit 0 Ownern entstehen.
- Nur die Stadtverwaltung darf den Organisationstyp ändern.

### Archivierung

Die Stadtverwaltung darf Organisationen archivieren.

- Archivierte Organisationen sind öffentlich nicht sichtbar.
- Interne Organisationsbereiche sind vollständig gesperrt.
- Eine archivierte Organisation kann später wieder aktiviert werden.
- Die Stadtverwaltung darf eine Organisation auch endgültig löschen.

## Ehemalige Mitglieder

Jede Organisation erhält eine interne Ansicht `Ehemalige Mitglieder`.

Dort werden angezeigt:

- Person
- Eintrittsdatum
- Austritts-/Entfernungsdatum
- letzte Rolle
- optionaler Entfernungsgrund

Der Entfernungsgrund ist für Owner sichtbar und kann nachträglich nicht geändert werden.

Weitere Regeln:

- Einträge bleiben maximal **12 Monate** erhalten und werden danach automatisch entfernt.
- Owner können diese Einträge nicht manuell löschen.
- Stadtverwaltung darf die Liste sehen.
- Wird die Person erneut aufgenommen, verschwindet der alte Ehemaligen-Eintrag; es werden keine getrennten historischen Mitgliedschaftszeiträume geführt.
- Bei Wiederaufnahme gilt die aktuelle Standardrolle, nicht die frühere Rolle.
- Frühere interne Mitgliedsnotizen werden bei Wiederaufnahme wieder sichtbar.
- Von ehemaligen Mitgliedern erstellte interne Dokumente/Akten bleiben erhalten.
- In diesen erhaltenen Inhalten wird der frühere Autor später nicht mit Name oder Nexus-ID angezeigt.

## Protokolle / Audit

Protokolliert werden insbesondere:

- Rollen erstellen, umbenennen und löschen
- Rollen aktivieren/deaktivieren
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

### Inhalt und Zugriff

Protokolle speichern je nach Ereignis mindestens Organisation, Aktion, betroffene Person/Rolle, ausführende Person, Datum/Uhrzeit sowie relevante alte/neue Werte. Neben dem Namen des Ausführenden wird dessen Nexus-ID gespeichert/angezeigt. Wird dessen Account später deaktiviert, bleibt der damalige Name im Protokoll erhalten.

- Innerhalb der Organisation sehen nur Owner die Organisations-Protokolle.
- Es gibt kein frei vergebbares Recht `Protokolle ansehen`.
- Berechtigte Stadtverwaltungs-Personen dürfen die Organisations-Protokolle ebenfalls einsehen.
- Protokolle bieten Suche und Filter.
- Ein Export als CSV oder PDF ist nicht vorgesehen.

Alle vorgesehenen Audit-Protokolle werden **6 Monate** aufbewahrt und danach automatisch gelöscht.

## Benachrichtigungen

Das betroffene aktive Mitglied erhält Nexus-Benachrichtigungen bei Aufnahme, Entfernung, Rollenwechsel und Owner-Ernennung.

Owner erhalten zusätzliche Pflichtbenachrichtigungen bei wichtigen Organisationsereignissen, insbesondere:

- freiwilligem Austritt eines Mitglieds
- Aufnahme durch eine Rolle mit `Mitglieder verwalten`
- Inaktiv-/Aktiv-Wechsel eines Mitglieds
- Stadtverwaltungs-Eingriffen an Ownern
- Änderung der Owner-Bezeichnung
- Wegfall des letzten Owners (zusätzlich Stadtverwaltung)

Wichtige Organisations-Benachrichtigungen können nicht deaktiviert werden.

## Sicherheitsabfragen im Frontend

Eine ausdrückliche Bestätigung ist mindestens erforderlich bei:

- freiwilligem Austritt aus einer Organisation
- freiwilliger Abgabe der eigenen Owner-Rolle
- direktem Austritt eines Owners
- Löschen einer normalen Rolle
- Entfernen eines normalen Mitglieds durch einen Owner
- Ernennung eines neuen Owners
- Wechsel der Standardrolle
- Speichern geänderter Rollenrechte

Bei der Owner-Ernennung wird ausdrücklich darauf hingewiesen, dass die Person anschließend vollständige Owner-Rechte besitzt.

## Technische Zielstruktur

`organization_members.role_title` kann vorerst als sichtbarer Titel bestehen bleiben. Für die vollständige Umsetzung soll jede Organisationsmitgliedschaft später genau eine strukturierte Rollenreferenz erhalten.

Voraussichtlich benötigt werden:

- `organization_roles`
- Rollen-Hierarchie/Sortierposition
- Rollenberechtigungen
- aktive/deaktivierte Rollen
- Standardrollen-Markierung
- Mitgliedsstatus aktiv/inaktiv
- interne Mitgliedsnotizen
- Ehemaligen-Historie
- Organisationsgründungsanträge
- Organisationsstandorte
- Organisations-Mailpostfach und Mailstatus
- allgemeiner Dokumentenbereich mit Ordnern, Berechtigungen, Versionen und Papierkorb
- interne Ankündigungen und Lesebestätigungen
- Audit-/Protokolltabellen
- serverseitige/RLS-gesicherte Owner- und Stadtverwaltungsaktionen

Ein Many-to-Many-System zwischen Mitgliedern und Rollen ist nicht erforderlich.