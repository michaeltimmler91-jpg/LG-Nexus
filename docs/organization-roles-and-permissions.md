# LG Nexus – Organisationsrollen und Berechtigungen

Dieses Dokument bündelt die aktuell festgelegten Regeln für Organisationsrollen, Mitgliederverwaltung, Owner, öffentliche Organisationsdarstellung, Organisations-Mail, Dokumente, Ankündigungen, Bewertungen, Stellenangebote/Bewerbungen, Gründungsanträge und Eingriffe der Stadtverwaltung.

## Grundprinzip

- Ein Mitglied besitzt innerhalb derselben Organisation **genau eine Rolle gleichzeitig**.
- Ein Bürger kann Mitglied mehrerer Organisationen sein und besitzt dort jeweils eine eigene Rolle.
- Rollen bestehen aus sichtbarer Bezeichnung, Hierarchieposition und Rechtepaket.
- Berechtigungen werden serverseitig beziehungsweise über Supabase/RLS geprüft; UI-Ausblendungen allein reichen nicht.
- Organisationsrechte geben niemals automatisch Zugriff auf Daten anderer Organisationen.

## Normale Rollen

Normale Rollen können von der Organisation frei gestaltet werden und besitzen einen innerhalb der Organisation eindeutigen Namen, optionale Kurzbeschreibung, optionale Farbe, optionales Icon aus der Nexus-Iconbibliothek, Hierarchieposition und ein modulabhängiges Rechtepaket. Zwei normale Rollen dürfen nicht denselben Namen besitzen; eine maximale Rollenanzahl gibt es nicht.

### Standardrolle

Jede neue Organisation erhält zunächst `Mitarbeiter` als normale Standardrolle.

- Genau eine aktive normale Rolle muss Standardrolle sein.
- Nur Owner bestimmen die Standardrolle.
- Neue und erneut aufgenommene Mitglieder erhalten automatisch die aktuelle Standardrolle.
- Vor einem Wechsel erscheint eine Bestätigung; der Wechsel wird nicht protokolliert.
- Die Standardrolle darf umbenannt werden.
- Vor Löschen/Deaktivieren der Standardrolle muss eine andere aktive normale Rolle gewählt werden.

### Erstellen, Duplizieren, Deaktivieren und Löschen

`Rollen verwalten` reicht nicht zum Erstellen, Umbenennen, Löschen oder Ändern von Rollenrechten; diese Strukturänderungen bleiben Ownern vorbehalten.

- Eine Rolle darf nur gelöscht werden, wenn niemand mehr zugewiesen ist und mindestens eine andere normale Rolle bestehen bleibt.
- Vor dem Löschen ist eine Sicherheitsbestätigung erforderlich.
- Owner dürfen Rollen duplizieren; übernommen werden nur die Berechtigungen.
- Owner dürfen Rollen deaktivieren und später reaktivieren.
- Deaktivierte Rollen bleiben sichtbar, ihr Name bleibt reserviert, sie dürfen umbenannt und unbenutzt gelöscht werden.
- Auf deaktivierten Rollen dürfen keine Mitglieder verbleiben und sie dürfen nicht neu zugewiesen werden.
- Reaktivierte Rollen werden ganz unten einsortiert.
- Aktivierung/Deaktivierung wird protokolliert.

### Rollenrechte

Rechte werden im Editor nach Modulen/Themen gruppiert, z. B. Allgemein, Medical, Ausbildung, Akten oder Verwaltung.

- Änderungen wirken sofort für alle Mitglieder der Rolle.
- Vor dem Speichern geänderter Rechte ist eine Bestätigung erforderlich.
- Bei weitreichenden Rechten wie `Mitglieder verwalten` oder `Rollen verwalten` erscheint zusätzlich eine Warnung.
- Änderungen an Rollenfarbe, Icon oder Beschreibung werden nicht protokolliert.

## Hierarchie und Rollenvergabe

Die Owner-Rolle steht technisch immer über allen normalen Rollen und ist nicht verschiebbar.

Normale Rollen können mit `Rollen verwalten` per Drag & Drop sortiert werden. Für normale Rollen gilt dabei:
- eigene Rolle nicht verschiebbar
- Rollen oberhalb der eigenen Rolle nicht verschiebbar
- Rollen unterhalb frei sortierbar

Owner dürfen die gesamte normale Hierarchie verwalten.

Für `Rollen zuweisen` gilt:
- eigene Rolle nicht selbst änderbar
- Rolle eines gleich- oder höherrangigen Mitglieds nicht änderbar
- Zielrolle muss unterhalb der eigenen Rolle liegen
- Mitglieder unterhalb dürfen innerhalb dieses Bereichs hoch- oder herabgestuft werden

Owner dürfen jedem normalen Mitglied jede aktive normale Rolle zuweisen.

## Mitglieder aufnehmen und entfernen

Neue Mitglieder dürfen durch Owner oder Rollen mit `Mitglieder verwalten` aufgenommen werden.

- Aufnahme erfolgt sofort ohne Bestätigung des neuen Mitglieds.
- Automatische Zuweisung der Standardrolle.
- Nicht-Owner mit `Mitglieder verwalten` dürfen nur aufnehmen, wenn die Standardrolle unterhalb der eigenen Stufe liegt.
- Ehemalige Mitglieder können erneut aufgenommen werden; dies ist eine neue Aufnahme und keine Rücknahme der früheren Entfernung.
- Keine maximale Mitgliederzahl.

Nur Owner dürfen normale Mitglieder entfernen. Vorher erscheint eine Sicherheitsabfrage. Ein optionaler Grund ist möglich, wird der entfernten Person angezeigt und kann später nicht verändert werden. Owner können andere Owner nicht entfernen.

Ein Mitglied darf selbst austreten, auch inaktiv/beurlaubt; Bestätigung erforderlich, eigener Austrittsgrund optional.

## Interne Mitgliedsdaten und Notizen

Owner und Rollen mit `Mitglieder verwalten` dürfen interne Mitgliedsnotizen sehen; das betroffene Mitglied selbst nicht. Normale Rollen mit diesem Recht dürfen interne Daten nur bei Mitgliedern unterhalb der eigenen Hierarchiestufe bearbeiten.

Notizen dürfen von Ownern und `Mitglieder verwalten` angelegt werden. Bearbeiten/löschen dürfen nur Ersteller oder Owner. Änderungen/Löschungen werden nicht protokolliert. Bei Wiederaufnahme werden frühere Notizen wieder sichtbar.

## Inaktiv / beurlaubt

Normale Mitglieder können auf `inaktiv/beurlaubt` gesetzt werden, ohne Mitgliedschaft oder Rolle zu verlieren.

- Grund optional, für Betroffenen sichtbar und später nicht änderbar.
- Owner und `Mitglieder verwalten` dürfen den Grund sehen.
- Kein Zeitraum von/bis; Status bleibt bis manueller Änderung bestehen.
- Owner erhalten separaten Filter/Ansicht für Inaktive.
- Inaktive Mitglieder erscheinen nicht öffentlich.
- Interne Organisationsbereiche sind gesperrt; öffentliche Organisationsseiten bleiben sichtbar.
- Während Inaktivität keine internen/persönlichen Organisationsbenachrichtigungen und keine internen Organisations-Mails.
- Aktiv/Inaktiv-Wechsel werden protokolliert.
- Normale Mitglieder dürfen sich selbst inaktiv setzen; kein Anfragesystem.
- `Mitglieder verwalten` darf nur Mitglieder unterhalb der eigenen Stufe inaktiv/aktiv setzen.
- Owner dürfen inaktive normale Mitglieder entfernen.
- Rollenänderungen inaktiver normaler Mitglieder bleiben nach Hierarchieregeln möglich.
- Inaktive Mitglieder müssen vor Owner-Ernennung aktiviert werden.

## Geschützte Owner-Rolle

Jede Organisation besitzt eine feste systemgeschützte Owner-Rolle.

- nicht löschbar
- immer sämtliche verfügbaren Organisationsrechte
- Rechte nicht reduzierbar
- mehrere gleichberechtigte Owner möglich
- Owner können andere Owner nicht entfernen, zurückstufen oder inaktiv setzen

### Sichtbare Owner-Bezeichnung

Die Stadtverwaltung legt die sichtbare Owner-Bezeichnung als freien Text fest, z. B. Geschäftsführer, Chief oder Direktor. Alle Owner derselben Organisation verwenden dieselbe Bezeichnung. Owner können sie nicht selbst ändern. Änderungen werden protokolliert und Owner benachrichtigt; ein Grund ist nicht erforderlich. Die Bezeichnung wird nicht als eigener Punkt im öffentlichen Profil angezeigt.

### Owner-Farbe und Owner-Icon

Farbe/Icon dürfen nur durch einen speziellen Design-Owner geändert werden.

- Stadtverwaltung bestimmt den Design-Owner.
- Gibt es genau einen Owner, ist dieser automatisch Design-Owner.
- Design-Owner kann nicht beliebig/jederzeit gewechselt werden.
- Wechsel sowie Farb-/Iconänderungen werden nicht protokolliert.
- Sonderfall beim Wegfall des Design-Owners ist noch technisch zu konkretisieren.

### Weitere Owner ernennen

Ein bestehender Owner darf jedes **aktive normale Mitglied** zum weiteren Owner ernennen, unabhängig von dessen normaler Rolle. Keine Zustimmung des Ernannten nötig. Vorher deutliche Warnung über vollständige Owner-Rechte. Ernennung wirkt sofort und wird protokolliert; keine zusätzliche interne Notiz.

### Eigene Owner-Rolle abgeben / Organisation verlassen

Owner dürfen die eigene Owner-Rolle freiwillig abgeben. Bestätigung erforderlich; Person bleibt Mitglied und wählt selbst eine normale Rolle. Die freiwillige Abgabe wird nicht protokolliert und ist auch beim letzten Owner möglich.

Owner dürfen die Organisation auch direkt verlassen; Owner-Rolle und Mitgliedschaft enden gleichzeitig. Austrittsgrund optional. Fällt dadurch der letzte Owner weg, wird die Stadtverwaltung benachrichtigt.

## Organisationen ohne Owner

0 Owner sind vorübergehend zulässig.

- normale Rollen/Rechte funktionieren weiter
- Organisation bleibt öffentlich sichtbar
- interner Hinweis „aktuell kein Owner“
- Stadtverwaltung sieht entsprechende Übersicht und Dashboard-Warnung
- direkte Notfall-Owner-Zuweisung aus dieser Übersicht möglich

## Stadtverwaltung – Organisationsaufsicht

### Owner einsetzen

Notfall-Zuweisung eines Owners nur, wenn aktuell **überhaupt kein Mitglied** die Owner-Rolle besitzt. Ein inaktiver Owner zählt weiterhin als vorhandener Owner. Inaktive Mitglieder müssen vor Ernennung aktiviert werden.

### Owner-Rolle entziehen

Stadtverwaltung darf einem Owner die Owner-Rolle entziehen, auch wenn weitere Owner existieren. Person bleibt Mitglied; Stadtverwaltung wählt eine normale Rolle. Eingriff wird protokolliert; Betroffener und übrige Owner werden benachrichtigt.

### Owner inaktiv/aktiv setzen

Nur Stadtverwaltung darf Owner inaktiv/aktiv setzen. Beim Inaktivsetzen ist ein Grund Pflicht; Betroffener und übrige Owner sehen ihn. Eingriff wird protokolliert und benachrichtigt.

### Weitere Rechte bei normalen Organisationen

Berechtigte Stadtverwaltungs-Personen dürfen:
- vollständige Mitgliederliste sehen, auch wenn öffentlich verborgen
- interne Mitgliedsnotizen sehen
- allgemeine interne Dokumente ansehen, bearbeiten und neu erstellen
- normale Mitglieder entfernen
- ehemalige Mitglieder sehen
- Organisations-Protokolle sehen
- Bewerbungen sehen und bearbeiten

Sie dürfen nicht:
- normale Mitglieder aufnehmen
- normale Rollen eines Mitglieds ändern
- normale Mitglieder über Stadtverwaltung inaktiv/aktiv setzen
- allgemeine interne Dokumente löschen

Besonders geschützte Medical-/Police-/Justice-Bereiche können strengere Sonderregeln erhalten.

## Öffentliche Mitgliederliste

Nur Owner ändern die öffentliche Sichtbarkeit.

Wenn sichtbar:
- nur aktive Mitglieder
- Owner zuerst, danach Rollen-Hierarchie
- Rollenfarbe/Icon/Beschreibung öffentlich nicht sichtbar
- keine eigene Namenssuche
- sichtbare Mitglieder können zum Nexus-Personenprofil geöffnet werden

Wenn verborgen:
- aktive Owner bleiben sichtbar
- Name + Nexus-ID der Owner
- exakte Zahl aktiver Mitglieder darf angezeigt werden
- Inaktive zählen nicht mit

Ehemalige Mitglieder sind nie öffentlich. Suspendierte/gesperrte Nexus-Accounts bleiben sichtbar, solange Mitgliedschaft und sonstige Sichtbarkeitsregeln bestehen.

## Öffentliches Organisationsprofil

Nur Owner bearbeiten öffentliches Profil, Öffnungsstatus, Statusmeldung und Mitgliederlisten-Sichtbarkeit.

Profilfelder:
- Organisationsname: nur Stadtverwaltung
- Kurzbezeichnung: möglich, aber nur Stadtverwaltung
- Beschreibung: einfacher Text
- genau eine öffentliche Telefonnummer
- mehrere Standorte/Filialen
- optionale Statusmeldung, max. 120 Zeichen
- öffentliche Öffnungszeiten
- öffentliche Nexus-Mailadresse
- externe Links/Social Media
- Logo/Banner: Upload oder Nexus-Bibliothek
- Profilvorschau vor Speichern

Telefon, Standorte, Logo/Banner gehören zur Owner-Profilbearbeitung. Profiländerungen werden mit alten/neuen Werten protokolliert; Öffnungsstatus und Mitgliederlisten-Sichtbarkeit nicht.

## Öffnungszeiten und Standorte

Öffnungszeiten sind einfacher Freitext. Mehrere Zeitblöcke pro Tag können im Text angegeben werden. Keine Sonderöffnungszeiten-Funktion, keine Feiertagslogik und keine automatische „Jetzt geöffnet“-Berechnung. Manueller Status bleibt maßgeblich.

Organisationen dürfen mehrere Standorte haben. Jeder Standort darf Namen, eigene Öffnungszeiten, Kartenmarker und Aktiv/Deaktiv-Status besitzen. Ein Hauptstandort wird markiert. Standorte nutzen die zentrale Organisations-Telefonnummer.

## Organisations-Nexus-Mail

Jede Organisation erhält automatisch eine aus dem Namen erzeugte Nexus-Mailadresse und einen gemeinsamen Posteingang.

Rechte/Sichtbarkeit:
- `Organisations-Mail lesen`: lesen, als gelesen markieren, Status ändern
- Senden/Antworten als Organisation: nur Owner
- intern sichtbarer tatsächlicher Verfasser; extern erscheint nur die Organisation
- interne Kommentare sind für externen Absender unsichtbar

Status/Priorität:
- Status `neu`, `in Bearbeitung`, `erledigt`
- Priorität `Niedrig`, `Normal`, `Hoch`, `Dringend`
- wichtig-Markierung möglich
- externer Absender darf Lesestatus sehen

Zuweisung:
- mehrere Mitarbeiter gleichzeitig möglich
- Owner oder Recht `Mail zuweisen`
- zugewiesene Mitarbeiter dürfen auf erledigt setzen
- Benachrichtigung bei Zuweisung
- einmal gesetzte Zuweisung kann nicht geändert werden
- Zuweisungsverlauf bleibt sichtbar

Organisation:
- gemeinsame Ordner/Labels, nur Owner verwalten sie
- Suche und Status-/Zuweisungsfilter
- Weiterleiten möglich
- gemeinsame Entwürfe für alle mit `Organisations-Mail lesen`
- keine separate Archiv-Funktion
- feste Signatur, automatische Abwesenheits-/Antwortnachricht, Mail-Vorlagen; jeweils Verwaltung durch Owner
- keine Dateianhänge
- Owner dürfen löschen; Papierkorb 30 Tage; Wiederherstellung nur Owner

## Allgemeiner interner Dokumentenbereich

- Ordnerstruktur möglich; `Dokumente verwalten` verwaltet Ordner.
- Ganze Ordner können rollenbeschränkt sein; Dokumente darin **erben automatisch** die Ordner-Sichtbarkeit.
- `Dokumente erstellen` erlaubt neue Dokumente.
- Keine doppelten Dokumentnamen im selben Ordner.
- Dokumente können mehreren Rollen oder nur Ownern sichtbar sein.
- `nur lesen` / `bearbeitbar` möglich.
- Bei Rollenlöschung werden entsprechende Freigaben automatisch entfernt.
- `Dokumente verwalten` darf Dokumente verschieben.
- Favoriten persönlich pro Nutzer; Volltextsuche vorgesehen.
- Keine Funktion „Dokument duplizieren“.
- Dokument-Vorlagen: nur Owner verwalten.
- Kommentar-Funktion pro Dokument optional; @-Erwähnungen mit Nexus-Benachrichtigung.
- Gleichzeitiges Bearbeiten mehrerer Personen und Autosave.
- Versionsverlauf mit Datum/Bearbeiter; alte Version wiederherstellbar; verdrängte aktuelle Fassung wird dabei nicht automatisch als zusätzliche neue Version gespeichert.
- keine Anhänge/Datei-Uploads, kein PDF-Export.
- gezielte öffentliche Freigabe eines internen Dokuments möglich.
- Löschen nur Owner; 14-Tage-Papierkorb; Wiederherstellung nur Owner; kein zusätzliches Audit dafür.
- Stadtverwaltung darf ansehen, bearbeiten und neu erstellen, aber nicht löschen; ihre Bearbeitung wird im Versionsverlauf markiert und die Organisation benachrichtigt.

## Interne Ankündigungen

- eigenes Rollenrecht zum Erstellen; jeder mit diesem Recht darf auch löschen
- an alle oder eine/mehrere Rollen adressierbar
- wichtig-Markierung möglich
- wichtige Meldungen brauchen Lesebestätigung und bleiben bis dahin beim Login deutlich sichtbar
- Berechtigte sehen Leser/Bestätigungen
- Inaktive sehen wichtige Meldungen nicht
- Ablaufdatum möglich; danach Archivierung
- Archivierung 6 Monate
- keine Anhänge/Bilder
- keine Entwürfe, keine zeitgesteuerte Veröffentlichung
- veröffentlichte Ankündigungen nicht nachträglich bearbeitbar
- mehrere gleichzeitig anpinnbar

Kommentar-Funktion optional pro Ankündigung. Bei Aktivierung dürfen Mitglieder kommentieren; eigene Kommentare bearbeiten; Löschen durch Kommentar-Ersteller oder Personen mit Ankündigungsrecht.

## Bewertungen und Favoriten

Bewertungen:
- jeder aktive Nexus-Bürger darf bewerten
- 1–5 Sterne + optionaler Text
- eigene Bewertung bearbeitbar/löschbar
- mehrere aktive Bewertungen desselben Bürgers zulässig
- für den Durchschnitt zählt pro Bürger nur die **neueste aktive Bewertung**
- Owner und aktuelle Mitarbeiter dürfen die eigene Organisation nicht bewerten
- Owner dürfen öffentlich auf Bewertungen antworten
- Organisation darf Bewertungen nicht selbst löschen
- Stadtverwaltung darf unangemessene Bewertungen entfernen
- Durchschnitt bereits auf Organisationskarte sichtbar

Favoriten:
- Bürger können Organisationen privat favorisieren
- Organisation sieht nicht, wer favorisiert hat
- `Organisation folgen` ist derzeit deaktiviert
- falls später aktiviert, erhalten Follower Benachrichtigungen bei neuen öffentlichen Meldungen/News

## Stellenangebote und Bewerbungen

Die vollständigen Detailregeln stehen zusätzlich in `docs/jobs-and-applications.md`.

### Stellenangebote

Organisationen dürfen mehrere öffentliche Stellenangebote gleichzeitig veröffentlichen. Verwaltung erfolgt über `Stellenangebote verwalten`.

Ein Stellenangebot besitzt:
- Titel
- ausführliche Beschreibung
- gewünschte Rolle/Position
- optionalen Ansprechpartner
- optionalen Standort

Kein Ablaufdatum. Angebote können manuell pausiert und reaktiviert werden. Bewerbungszahl wird öffentlich nicht angezeigt. Öffentliche Suche, Volltextsuche und Filter nach Organisation/Branche sind vorgesehen.

### Direktbewerbung über Nexus

Aktive Bürger dürfen sich **direkt über Nexus** bewerben.

Organisationen definieren pro Stelle eigene Fragen:
- Freitext
- Auswahl
- Ja/Nein
- einzelne Fragen als Pflichtfeld

Automatisch übermittelt werden Name und Nexus-ID. Telefonnummer und Nexus-Mail werden nur übermittelt, wenn die persönlichen Sichtbarkeitseinstellungen dies erlauben; Bewerbungen umgehen die Privatsphäre nicht. Kein zusätzlicher allgemeiner Bewerbungstext.

Der Bewerber darf die Bewerbung nach Absenden bearbeiten, solange die Organisation sie noch nicht bearbeitet hat, und darf sie zurückziehen. Während des Verfahrens sieht er den Status; abgeschlossene Bewerbungen später nicht mehr.

### Bewerbungsstatus

Grundstatus:
- Neu
- In Prüfung
- Gespräch
- Angenommen
- Abgelehnt

Organisationen dürfen weitere eigene Status anlegen. Statusänderungen werden nicht zusätzlich auditiert, lösen aber jeweils eine Nexus-Benachrichtigung an den Bewerber aus.

Bei Ablehnung ist ein Grund optional und für den Bewerber **nicht sichtbar**.

Bei Annahme erscheint `Als Mitglied aufnehmen`; Aufnahme folgt normalen Regeln und weist die aktuelle Standardrolle zu.

### Interner Bewerbungsbereich

- `Bewerbungen ansehen` steuert Leserechte.
- `Bewerbungen bearbeiten` steuert Bearbeitung/Status.
- Bewerbungen können Mitarbeitern zugewiesen werden; mehrere Bearbeiter möglich.
- Zugewiesene Bearbeiter erhalten Benachrichtigung.
- Interne Kommentare möglich und für Bewerber unsichtbar.
- kein Favorisieren/Markieren
- keine eigene Suche/Filter im internen Bewerbungsbereich und kein separater Stellenfilter

Aufbewahrung:
- abgelehnt: 6 Monate
- angenommen: 6 Monate
- zurückgezogen: sofort löschen

Berechtigte Stadtverwaltung darf Bewerbungen ansehen und bearbeiten.

## Organisationsgründung / Gründungsanträge

Neue Organisationen werden nur durch Stadtverwaltung angelegt; jeder aktive Bürger darf einen Antrag stellen.

Antrag enthält:
- gewünschten Namen
- Beschreibung/Konzept
- gewünschten Organisationstyp
- mindestens einen gewünschten zukünftigen Owner

Mehrere Owner möglich; jede vorgeschlagene Person muss ihre Nennung bestätigen.

Status: `Entwurf`, `Eingereicht`, `In Prüfung`, `Angenommen`, `Abgelehnt`.

- offene Anträge durch Antragsteller bearbeitbar/zurückziehbar
- Stadtverwaltung darf Änderungen verlangen und Antrag zurückgeben
- kompletter Statusverlauf wird gespeichert
- Ablehnungsgrund Pflicht
- erneuter Antrag nach Ablehnung möglich
- Benachrichtigung bei Annahme/Ablehnung
- abgeschlossene Anträge 6 Monate gespeichert

Neue Organisation muss vor öffentlicher Sichtbarkeit freigeschaltet werden, darf zunächst 0 Owner haben und der Organisationstyp ist nur durch Stadtverwaltung änderbar.

Archivierung:
- Stadtverwaltung darf archivieren
- archiviert: öffentlich unsichtbar, intern vollständig gesperrt
- Reaktivierung möglich
- endgültiges Löschen durch Stadtverwaltung möglich

## Ehemalige Mitglieder

Interne Ansicht mit Person, Eintritt, Austritt/Entfernung, letzter Rolle und optionalem Entfernungsgrund.

- Grund für Owner sichtbar und nicht nachträglich änderbar
- Einträge max. 12 Monate, danach automatisch entfernen
- Owner können nicht manuell löschen
- Stadtverwaltung darf Liste sehen
- bei Wiederaufnahme verschwindet alter Ehemaligen-Eintrag; keine getrennten historischen Zeiträume
- Wiederaufnahme mit aktueller Standardrolle
- frühere interne Notizen werden wieder sichtbar
- erstellte interne Dokumente/Akten bleiben erhalten
- früherer Autor darin später nicht mit Name/Nexus-ID sichtbar

## Protokolle / Audit

Protokolliert werden insbesondere Rollen erstellen/umbenennen/löschen/aktivieren/deaktivieren, Mitgliederaufnahme/-entfernung/Austritt, Rollenwechsel, Owner-Ernennung, Stadtverwaltungs-Eingriffe an Ownern, Inaktiv/Aktiv, öffentliche Profiländerungen und Owner-Bezeichnungsänderungen.

Nicht protokolliert werden insbesondere freiwillige Owner-Abgabe, Standardrollenwechsel, Rollenrechte, Drag-&-Drop-Hierarchie, Rollenfarbe/Icon/Beschreibung, Owner-Farbe/Icon, Design-Owner-Wechsel, Öffnungsstatus, Mitgliederlisten-Sichtbarkeit, Mitgliedsnotiz-Änderungen und Dokument-Löschen/Wiederherstellen sowie Bewerbungsstatusänderungen.

Audit enthält je nach Ereignis Organisation, Aktion, betroffene Person/Rolle, ausführende Person, Zeit und relevante alte/neue Werte. Name + Nexus-ID des Ausführenden werden gespeichert; historischer Name bleibt auch nach Account-Deaktivierung erhalten.

- Organisationsintern nur Owner
- berechtigte Stadtverwaltung ebenfalls
- kein frei vergebbares `Protokolle ansehen`
- Suche/Filter
- kein CSV/PDF-Export
- Aufbewahrung 6 Monate, danach automatische Löschung

## Benachrichtigungen

Aktive Betroffene erhalten Benachrichtigungen bei Aufnahme, Entfernung, Rollenwechsel und Owner-Ernennung. Owner erhalten Pflichtbenachrichtigungen insbesondere bei freiwilligem Austritt, Aufnahme durch `Mitglieder verwalten`, Inaktiv/Aktiv, Stadtverwaltungs-Eingriffen an Ownern, Owner-Bezeichnungsänderung und Wegfall des letzten Owners. Diese wichtigen Meldungen können nicht deaktiviert werden.

Weitere Modul-Benachrichtigungen entstehen z. B. bei Mail-Zuweisungen, Dokument-@-Erwähnungen, Stadtverwaltungs-Dokumentbearbeitung, Bewerbungs-Zuweisungen und Bewerbungsstatusänderungen.

## Sicherheitsabfragen im Frontend

Ausdrückliche Bestätigung mindestens bei freiwilligem Austritt, freiwilliger Owner-Abgabe, direktem Owner-Austritt, Rollenlöschung, Mitgliederentfernung, Owner-Ernennung, Standardrollenwechsel und Speichern geänderter Rollenrechte.

## Offene Detailentscheidung

Noch offen ist der technische Ausnahmeweg, wenn der festgelegte Design-Owner seine Owner-Rolle verliert oder die Organisation verlässt.

## Technische Zielstruktur

`organization_members.role_title` kann vorerst als sichtbarer Titel bestehen bleiben. Langfristig erhält jede Organisationsmitgliedschaft genau eine strukturierte Rollenreferenz.

Voraussichtlich benötigt werden unter anderem:
- `organization_roles`
- Rollen-Hierarchie/Sortierposition und Rollenberechtigungen
- aktive/deaktivierte Rollen + Standardrollen-Markierung
- Mitgliedsstatus und interne Mitgliedsnotizen
- Ehemaligen-Historie
- Organisationsgründungsanträge + Statusverlauf + Owner-Bestätigungen
- Standorte
- Organisations-Mailpostfach mit Status, Priorität, Zuweisungen, Kommentaren, Labels/Ordnern, Entwürfen, Vorlagen und Papierkorb
- Dokumentenbereich mit Ordnern, vererbten Rollenfreigaben, Versionen, Kommentaren, Favoriten/Suche und Papierkorb
- interne Ankündigungen mit Zielrollen, Archivierung, Lesebestätigung und optionalen Kommentaren
- Bewertungen, Owner-Antworten und private Favoriten
- Stellenangebote, Bewerbungsfragen, Bewerbungen, Zuweisungen und interne Kommentare
- Audit-/Protokolltabellen
- serverseitige/RLS-gesicherte Owner- und Stadtverwaltungsaktionen

Ein Many-to-Many-System zwischen Mitgliedern und Rollen ist nicht erforderlich.