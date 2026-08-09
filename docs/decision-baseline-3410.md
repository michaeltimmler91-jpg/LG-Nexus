# LG Nexus – Verbindlicher Entscheidungsstand bis Frage 3410

Dieses Dokument fasst den nach Auswertung der Fragen **1411–3410** verbindlichen Planungsstand zusammen. Es ergänzt die bestehenden Modul-Dokumente. Falls eine ältere Formulierung in einem Modul-Dokument diesem Stand widerspricht, gilt die **neuere Festlegung aus diesem Dokument**, bis das jeweilige Modul-Dokument redaktionell vollständig bereinigt ist.

## Auswertungsregel für den großen Fragenblock

Ein Teil der Fragen wurde technisch als „Workflow“ formuliert, obwohl die genannte Sache fachlich nur eine normale Funktion ist. Ein `Nein` auf „als eigener Workflow“ bedeutet deshalb **nicht automatisch**, dass die Grundfunktion entfällt. Bestehende fachliche Entscheidungen bleiben bestehen, sofern die spätere Frage nicht eindeutig die Funktion selbst verneint.

Abhängige Folgefragen werden ignoriert, wenn die zugehörige Hauptfunktion abgelehnt wurde.

## Unternehmen, Angebote und Kundenservice

- Bürger können einzelne Angebote favorisieren; favorisierte Angebote erscheinen in einer persönlichen Merkliste.
- Angebote selbst werden nicht separat bewertet; bewertet wird die Organisation.
- Angebotsbeschreibungen sind auf 3000 Zeichen begrenzt.
- Ein Angebot gehört entweder zu genau einem Standort oder gilt allgemein; Mehrfach-Standortzuordnung ist nicht vorgesehen.
- Angebote können als `nur mit Termin/Reservierung` gekennzeichnet werden.
- Angebote können direkt mit Reservierungsarten, Kundenanfragen und verfügbaren Terminfenstern verknüpft werden.
- Varianten, Variantenpreise und optionale Zusatzleistungen sind vorgesehen.
- Eine interne Artikel-/Leistungsnummer ist nicht vorgesehen.
- Sofortige Verfügbarkeit darf öffentlich angezeigt werden; eine allgemeine Auslastungsampel ist nicht vorgesehen.
- Je Reservierungsart kann festgelegt werden, wie weit im Voraus gebucht werden darf; eine Mindestvorlaufzeit ist nicht vorgesehen.
- Organisationen dürfen Termine verschieben; der Bürger muss einer solchen Verschiebung erneut zustimmen.
- Reservierungsformulare dürfen je Reservierungsart eigene Zusatzfragen besitzen.
- Reservierungen besitzen interne Notizen; nach aktueller Festlegung sind diese für den Bürger sichtbar.
- Reservierungsstatus: `Neu`, `Bestätigt`, `In Bearbeitung`, `Erledigt`, `Storniert`, `No-Show`.
- Erledigte Reservierungen bleiben als Kerndatensatz 6 Monate gespeichert.
- Nach erledigter Reservierung kann automatisch zur Organisationsbewertung eingeladen werden.
- Kundenanfragen und Reservierungen können ins interne Taskboard übernommen werden.

Zusätzliche Angebotsfunktionen:

- Rabatt-/Aktionsangebote
- zeitlich begrenzte Sonderaktionen
- variantenfähige Produkte/Dienstleistungen
- Preisänderungen
- Mindest-/Maximalbestellmengen
- individuelle Preisangebote auf Kundenanfrage
- öffentliche Liefer-/Wartezeithinweise
- Kennzeichnung `ausverkauft`
- standortabhängige Preise
- Bundles/Pakete

Für diese erweiterten Angebotsfunktionen gilt grundsätzlich: Verwaltung über ein eigenes passendes Rollenrecht, Sichtbarkeit je Eintrag, öffentliche Auffindbarkeit nur bei öffentlicher Freigabe, Benachrichtigungen nur bei wesentlichen Änderungen und 30-Tage-Papierkorb für entfernte/deaktivierte Einträge.

Reservierungsvertiefung:

- wiederkehrende Reservierungen: ja
- Reservierungen mit mehreren Zeitabschnitten: ja
- Umbuchung durch Bürger: ja
- Umbuchung durch Organisation: ja
- manuelle Wartelistenpriorisierung: ja; Änderung nur intern berechtigt, Pflichtgrund und Protokoll
- Wartelisten-Nachrückfristen: nein
- eigener Workflow für Kunden-/interne Reservierungsnotizen: nein; normale Notizfelder bleiben bestehen
- automatische Reservierungssperre wegen No-Shows: nein
- Gruppen-/Veranstaltungsreservierungen: ja

## Organisationsaufgaben

- Bearbeiten: Ersteller, Zugewiesene und `Aufgaben verwalten`.
- Endgültiges Löschen: `Aufgaben verwalten`; Löschgrund Pflicht; vorher 14 Tage Papierkorb.
- Zugewiesene dürfen Status ändern, aber weder Fälligkeit ändern noch weitere Personen hinzufügen.
- Kein zusätzlicher Verantwortlicher neben den Zugewiesenen.
- Keine Aufgabenabhängigkeiten und keine separate Blockierungsabhängigkeitslogik.
- Keine Startzeit neben dem Fälligkeitsdatum.
- Aufgabe kann optional manuell in den persönlichen Kalender übernommen werden; keine automatische Kalenderübernahme nur wegen Fälligkeit.
- Wiederkehrende Aufgaben erzeugen nach Erledigung die nächste Instanz; unterstützt werden täglich/wöchentlich/monatlich, ohne Serienausnahmen oder eigenes Serien-Enddatum.
- Pflichtaufgaben können eine echte Erledigungsbestätigung verlangen; Ersteller sieht die Bestätigungen.
- Eine Aufgabe besitzt maximal eine Checkliste; Checklistenpunkte dürfen Personen zugewiesen werden, aber keine eigene Fälligkeit besitzen.
- Kanban und Listenansicht sind beide vorgesehen. Kanban-Spalten entsprechen direkt den Aufgabenstatus; kein zweites Spaltensystem.
- Filter nach Status, Priorität, Fälligkeit, Person und Rolle: ja. Volltextsuche: nein.
- Vertrauliche Aufgaben: ja, mit eigenem Sicht-/Rollenrecht.
- Auswertungen zu offenen/überfälligen Aufgaben pro Rolle: ja.
- Keine Eskalationen, Massenänderungen, Kopierfunktion, persönlichen Unteraufgaben oder mehrstufigen Fälligkeiten.
- Rollenbezogene Aufgaben-Dashboards: ja.
- Aufgaben können einem Organisationsstandort zugeordnet werden.

## Jobs und Bewerbungen

- Keine vertraulichen Stellenangebote.
- Interne Stellenangebote nur für bestehende Mitglieder: ja.
- Bewerbungsrunden mit mehreren Gesprächsstufen: ja.
- Probeaufgaben/praktische Tests: ja.
- Bewerbungsfristen: ja.
- Verspätete Bewerbungen können automatisch abgelehnt werden.
- Kein Talentpool, keine Bewerber-Sperrlisten und keine organisationsübergreifende Bewerberübernahme.
- Empfehlungen durch bestehende Mitglieder: ja.
- Bereits festgelegte Regeln zu öffentlichen Stellen, Bewerbung, Rückfragen, Gesprächen, 14-Tage-Wiederbewerbungsfrist und Übertragung innerhalb derselben Organisation bleiben bestehen.

## Events und City Hub

Zusätzlich vorgesehen:

- kostenlose Ticket-/Platzcodes ohne Bezahlsystem
- Event-Gästelisten
- private Organisations-Events
- Zugangsbeschränkung nach Organisation/Rolle
- Alters-/Zugangshinweise
- Event-Regeln/Teilnahmebedingungen
- Event-Programmabläufe
- mehrere Event-Orte pro Veranstaltung
- Event-Helfer-Schichten ohne Dienstplancharakter
- Sponsoren/Partner

City Hub:

- stadtweite Eilmeldungen mit Prioritätsstufen
- regionale Warnmeldungen für Kartenbereiche
- Warnbanner können wahlweise manuell aufgehoben oder automatisch zeitlich beendet werden
- offizielle Pressemitteilungen einzelner Behörden
- sichtbare Korrekturhinweise bei fehlerhaften Meldungen
- Stadtverwaltungs-FAQ
- öffentliche Nexus-Changelogs
- keine öffentlichen Umfragen/Abstimmungen
- keine Lesebestätigung für normale wichtige City-Hub-Beiträge; ausdrücklich gesonderte System-/Pflichtmeldungen behalten ihre bereits festgelegte Bestätigungslogik

## Memories

- persönliche Alben: ja
- Organisations-Alben: ja
- Event-Memories mit mehreren Alben: ja
- persönliche Alben besitzen konfigurierbare Sichtbarkeit, erscheinen aber **nicht** in der öffentlichen `Entdecken`-Galerie und sind nicht öffentlich suchbar
- Organisations-/Eventalben können separat sichtbar geschaltet werden
- unbegrenzte Bildanzahl über externe Bildlinks
- Bildunterschriften und Alternativtexte/Bildbeschreibungen: ja
- kein separates abweichendes RP-Bilddatum
- Bilder können LS-Map-Positionen erhalten
- Personenmarkierungen: ja; markierte Person muss bestätigen und kann die Markierung jederzeit selbst entfernen
- mehrere Personen pro Bild möglich
- keine gemeinsame Albumverwaltung durch mehrere Bürger
- keine Album-Favoriten
- Emoji-Reaktionen und öffentliche Kommentare: ja; Album-Owner kann Kommentare deaktivieren
- Melden und Stadtverwaltungsmoderation: ja; Eigentümer wird bei Entfernung/Moderation benachrichtigt
- eigene persönliche Alben löschbar; 14 Tage Papierkorb
- Event-Memories bleiben fachlich von normalen Eventregeln getrennt; persönliches Album kann mit einem Event verknüpft werden
- öffentliche `Entdecken`-Seite bleibt bestehen, aber ohne persönliche Alben
- keine öffentliche Memories-Suchfunktion
- keine eigene Sortierfunktion und keine separate Altalbum-Archivfunktion

## Games

Games gehört zu V1 und funktioniert vollständig als Webfunktion ohne FiveM-Anbindung.

- Zugriff nur für aktive Bürger, nicht für `pending`
- Einzel- und Mehrspieler
- globale Ranglisten; keine Organisations-/Freundesranglisten, keine saisonalen Ranglisten, Ranglisteneintrag nicht ausblendbar
- Achievements ja, aber ausschließlich im Games-Bereich und **nicht** als Profil-Badges
- tägliche/wöchentliche Herausforderungen ja
- keine Nexus-Punktewährung und keinerlei Echtgeldkäufe
- Match-Einladungen mit Nexus-Benachrichtigung; Benutzer kann Game-Einladungen deaktivieren
- Fairplay-/Meldesystem ja
- keine separate Games-Sperre unabhängig vom Nexus-Account
- Quizspiel ja; tägliches Rätsel nein
- Minigame-Ranglisten ja
- private Highscores ja; Organisations-Highscores nein
- zeitlich begrenzte Game-Events ja
- Spielstatistiken pro Bürger ja
- Game-Inhalte können gemeldet werden

## Kalender

Bestehende Kalenderfunktionen bleiben erhalten. Die generischen `Workflow = Nein`-Antworten entfernen keine bereits beschlossenen normalen Kalenderfunktionen.

Zusätzlich:

- Kalenderfreigaben zwischen Bürgern: ja
- gemeinsame private Kalender: ja
- Geburtstage werden **manuell als Kalendereinträge** gepflegt und nicht aus dem Profil-/RP-Geburtsdatum übernommen
- keine pauschale automatische Erstellung von Kalendereinträgen aus Justice-, Medical- oder PD-Vorgängen; ausdrücklich erstellte Termine wie Verhandlungen, Vorstellungsgespräche oder Reservierungen bleiben möglich

## LS Map

- gespeicherte Kartenansichten: ja
- persönliche Kartenlisten: ja
- keine Routenverknüpfung zwischen mehreren Markern
- normale/persönliche Marker erhalten **keine frei definierbare Ablaufzeit**; spezielle temporäre Event-/Gefahrenmarker dürfen weiterhin automatisch ablaufen
- keine zusätzliche Öffnungszeiten-gesteuerte Markerlogik; bestehende Anzeige von Organisations-Öffnungszeiten bleibt möglich
- öffentliche Gefahren-/Sperrhinweise: ja
- keine internen Marker-Kommentare
- keine Verknüpfung interner Marker mit Dokumenten
- keine Positionsänderungs-Historie für Marker
- Cayo Perico und weitere Kartenbereiche sollen unterstützt werden
- persönliche Kartenmarker werden nicht mehr als eigener Favoritentyp geführt

## Benachrichtigungen

Die bestehende Benachrichtigungszentrale bleibt maßgeblich. Die als `Workflow` formulierten Ablehnungen erzeugen keine zusätzlichen Workflow-Systeme für Bündelung, tägliche Zusammenfassungen, Snooze oder Rechteverlust.

- bestehende Gruppierung ähnlicher Benachrichtigungen bleibt erhalten
- kein täglicher Benachrichtigungs-Digest
- kein Snooze für normale Benachrichtigungen
- Organisationen dürfen eigene Benachrichtigungsregeln mit passendem Rollenrecht konfigurieren
- @-Erwähnungen bleiben normale Nexus-Benachrichtigungen und erhalten kein zweites separates Workflow-System

## Persönliche und Organisations-Mail

Persönliche Mail:

- weiterhin keine Entwürfe und kein geplantes Senden
- persönliche Filter-/Mailregeln: ja
- keine automatische Verschieberegel ausschließlich nach Absender
- persönliche Mail-Kategorien/Labels: ja
- keine Verteiler für mehr als 50 Empfänger, keine Kontaktgruppen, keine Antwortvorlagen, keine Vertraulich-Markierung
- Bürger kann neue Direktkontakte über eine Privatsphäre-Einstellung sperren

Organisations-Mail:

- keine Abteilungs-Warteschlangen
- mehrere Organisations-Mailadressen: ja
- rollenbezogene Postfächer: ja
- mehrere Adressen werden den passenden rollenbezogenen Postfächern zugeordnet; kein komplett getrenntes Mailsystem pro Adresse
- kein separates Alias-Verwaltungssystem neben diesen Adressen
- keine Eskalation wegen langer Nichtbearbeitung und keine automatische Zuweisung nach Anfrageart
- interne Mailnotizen mit @-Erwähnungen: ja
- kein Zusammenführen/Aufteilen von Threads
- keine individuellen Aufbewahrungsregeln je Ordner

## Profile und Privatsphäre

- keine Pronomen-/Anredefelder
- frei wählbare Profil-Badges: ja; Stadtverwaltung erstellt/verleiht, Bürger entscheidet selbst, welche erhaltenen Badges sichtbar sind
- offizielle verifizierte Rollen-Badges: ja; sie verschwinden automatisch bei Verlust der entsprechenden Rolle/Organisationszugehörigkeit
- Badges sind öffentlich sichtbar, aber nicht als Suchkriterium vorgesehen
- keine temporären Profilbilder
- kein persönliches Profilbanner
- keine gruppenspezifische Gesamtprofil-Sichtbarkeit
- keine individuellen Freigabelisten pro Profilfeld
- keine Organisationsblockierung für Direktkontakt
- Profil-Favoriten: ja und ausschließlich privat

## Accounts und Identität

- weiterhin 1 Account = 1 RP-Charakter
- keine mehreren Charaktere unter einem Login, keine Accountübergabe auf einen anderen Charakter
- Benutzername bleibt unveränderlich; ein Charakter wird nicht auf einen neuen Benutzernamen umgezogen
- Namensänderung des RP-Charakters nach Aktivierung ist möglich, aber nur über Stadtverwaltungsantrag/Genehmigung; alter RP-Name bleibt intern historisch nachvollziehbar
- Korrektur des RP-Geburtsdatums nach Freischaltung ist administrativ möglich und wird protokolliert
- versehentliche Doppelaccounts können durch berechtigte Administration manuell zusammengeführt werden
- `disabled` wird nicht reaktiviert
- keine temporäre Selbstdeaktivierung
- Selbstlöschung: ja; Login und normales Profil werden entfernt, notwendige historische Medical-/PD-/Justice-/Verwaltungsreferenzen behalten Nexus-ID beziehungsweise historischen Namen
- kein eigener Stammdatenexport durch den Bürger

## Organisationsrollen und Governance

Nicht vorgesehen:

- zeitlich befristete Rollen
- kommissarische Rollen
- rollenbezogene Genehmigungsstufen
- Vier-Augen-Freigaben in normalen Organisationen
- standortbeschränkte Rollen
- zeitlich begrenzte Sonderrechte
- Rollen-Vorlagen zwischen Organisationen
- Import/Export von Rollenrechten
- automatische Rollenwechsel nach Ereignissen

Vorgesehen:

- stellvertretende Owner-Funktionen **ohne** volle Owner-Rechte; technisch bleiben dies delegierte normale Rechte und kein zweiter Owner-Typ

## Dokumente und Wissensdatenbank

- kein allgemeiner Dokument-Freigabeworkflow vor Veröffentlichung
- Pflicht-Lesebestätigung für Dokumente: ja
- Dokumente mit Ablaufdatum: ja
- kein Review-Datum
- kein eigenes Verantwortlicher/Eigentümer-Feld
- schreibgeschützte Abschnitte innerhalb von Dokumenten: ja
- keine Dokument-Querverweise als eigenes System
- Wissensartikel mit Schlagworten: ja
- keine vorgeschlagenen Änderungen und kein Lernfortschritt an normalen Wissensartikeln

## Medical

Verbindliche Klarstellung:

- **In einer Krankenakte wird nichts automatisch oder endgültig gelöscht.** Medizinische Akteninhalte bleiben dauerhaft erhalten. Stornierungen/Korrekturen bleiben nachvollziehbar.
- Bürger sehen nicht automatisch ihre vollständige Krankenakte. Sichtbar sind nur die Inhalte, die Medical ausdrücklich für die Bürgerseite freigibt.
- Zugriffe werden weiterhin nicht pauschal protokolliert; Änderungen besitzen Nachvollziehbarkeit/Versionierung.

Zusätzlich vorgesehen:

- organisationsinterner Diagnosekatalog
- Medikamentenlisten mit Dosierungsfreitext
- Allergie-Schweregrade
- Impf-/Vorsorgeeinträge im RP
- OP-/Eingriffsberichte
- strukturierte Labor-/Befundberichte
- medizinische Nachkontrolltermine
- dokumentierte Patienteneinwilligungen
- Sperrvermerke für besonders geschützte Akten
- anonymisierte Testfälle für Ausbildung

Diese Daten benötigen zusätzlich zum normalen Medical-Zugriff fall-/vorgangsbezogene Berechtigung. Freigaben an andere Stellen erfolgen über formelle Freigabe-/Anfrageprozesse. Medizinische Inhalte bleiben dauerhaft gespeichert.

## Police

Zusätzlich vorgesehen:

- Beziehungen zwischen mehreren PD-Fällen
- Personen- und Fahrzeugbeziehungen innerhalb eines Falls
- Beweismittel-Gruppierungen
- gezielte Beweisfreigaben an Justice
- digitale Asservaten-/Lagerorte
- Vernehmungsprotokolle
- interne Ermittlungsaufträge
- Observationen als eigene Vorgangsart
- interne Fahndungsnotizen

Zugriff zusätzlich fallbezogen; Bürgerseite nur nach ausdrücklicher Freigabe; Änderungen werden nachvollzogen; Weitergabe an andere Stellen über formelle Freigabeprozesse. Die bestehende 12-Monats-Aufbewahrung abgeschlossener PD-Fälle bleibt bestehen.

## Fire & Rescue

Zusätzlich vorgesehen:

- Einsatzabschnitte innerhalb eines FD-Einsatzes
- Ressourcenanforderungen zwischen FD-Einheiten
- Gefahrstoff-Datensätze
- Objektpläne mit Versionsstand
- Fahrzeug-Checklisten vor Einsatz

Nicht als zusätzliche Systeme vorgesehen:

- eigener Hydranten-Wartungsworkflow; der bestehende Hydrantenstatus bleibt
- Geräteausgabe an Mitglieder
- Mängelmeldungen durch alle FD-Mitglieder
- automatische Nachprüfungsaufgaben aus Brandschutzprüfungen
- separates öffentliches Sicherheitsinformationssystem aus dem FD-Modul

## Justice

Zusätzlich vorgesehen:

- Verknüpfungen zusammenhängender Justice-Verfahren
- Vertretungswechsel bei Anwälten
- Befangenheitsvermerke bei Richtern
- Beweisanträge
- Zeugenladungen
- Vorladungen für Bürger
- interne Beschlussentwürfe
- Urteils-Korrekturverfahren
- Vollstreckungsstatus von Urteilen
- Justice-interne Wissenssammlung für Präzedenzfälle

**Justice-Verfahren und relevante Verfahrensakten bleiben dauerhaft erhalten.** Die in den Vertiefungsfragen gewählte 12-Monats-Angabe wird durch diese spätere Klarstellung überschrieben.

## Stadtverwaltung

- keine RP-Wohn-/Adressdatenbank
- Namensänderungsanträge: ja; abgeschlossener Antrag 6 Monate, dauerhafte Namenshistorie getrennt im Identitätsverlauf
- keine Meldebescheinigungen
- Firmenregister-Daten: ja
- keine Organisationsgründungsgebühren als spezieller Status
- keine öffentlichen Registerauszüge
- keine separaten internen Verwaltungsfälle je Bürger
- Bürgertermine mit Warteschlange: ja
- keine Massenbenachrichtigung an dynamische Bürgergruppen; bereits beschlossene gezielte Systemmeldungen an ausgewählte Empfänger bleiben möglich
- keine delegierten Verwaltungsbereiche als separates Unterrollensystem

## Gemeinsame Einsätze

Der bereits festgelegte gemeinsame Vorfall bleibt bewusst schlank. Nicht zusätzlich vorgesehen sind:

- gemeinsame Einsatzrollen pro Fraktion
- gemeinsame Lagekarte als eigenes System
- gemeinsame Aufgaben
- eigene Statusmeldungen je Fraktion
- Bürgerbeteiligungsrollen
- gemeinsame Fahrzeug-/Einheitenlisten
- zeitlich ablaufende Freigaben
- eigene gemeinsame Abschlusszusammenfassung
- Vorfall-Vorlagen
- bloße Verknüpfung mehrerer Vorfälle ohne Merge

## Suche, Favoriten und Navigation

Nicht vorgesehen:

- gespeicherte globale Suchanfragen
- Suchverlauf
- gespeicherte letzte Filter
- favorisierte Kartenmarker
- favorisierte City-Hub-Beiträge
- favorisierte Events
- persönliche Schnellzugriffe in der Seitenleiste
- angepinnte Seiten
- organisationsabhängige Startseiten

Vorgesehen:

- private Favoriten für Personenprofile
- bestehende ausdrücklich beschlossene Favoriten für Organisationen und Unternehmensangebote

## Moderation

- zentrale Meldungsübersicht für Profile, Kommentare und Medien: ja
- keine zusätzliche Prioritäts-/Zuweisungs-/Kommentar-/Beweislink-Komplexität für Moderationsfälle
- Verwarnungen an Bürger: ja; dauerhaft nachvollziehbar
- keine temporäre Einschränkung einzelner Nexus-Funktionen
- kein eigener Widerspruchsworkflow gegen Moderationsmaßnahmen
- keine Wiederholungstäter-Hinweise

## UX / Darstellung

- High-Contrast-Modus: ja; persönliche Einstellung jedes Nutzers
- keine explizite Zusatzfunktion für reduzierte Animationen, Tastatur-only-Navigation, Screenreader-Optimierung, größere Klickflächen, kompakte Tabellen, frei wählbare Tabellenspalten, gespeicherte Tabellensortierung oder Druckansichten
- keine spezielle mobile Navigation
- V1 ist bewusst primär für feste Desktop-/Ingame-Tablet-Darstellung ausgelegt; eine vollständig responsive Smartphone-Oberfläche ist keine V1-Anforderung

## Sicherheit

Als technische Standards im Hintergrund verbindlich:

- CSRF-Schutz für schreibende Aktionen
- Content-Security-Policy
- Allowlist für externe Bildhoster
- Rate Limits für Suche, Mailversand sowie Meldungen/Kommentare
- Sitzungssperre beziehungsweise Invalidierung bei Passwortänderung
- Erkennung ungewöhnlicher Login-Orte als Sicherheitsereignis
- Admin-Sicherheitsprotokolle
- Schutz gegen massenhafte Datenexporte

Technische Systemadministratoren erhalten **keinen automatischen Zugriff** auf geschützte Medical-/PD-/Justice-Inhalte.

## FiveM-Integration

**V1 funktioniert vollständig ohne direkte FiveM-Verbindung.** Auch `/nexus`, Ingame-Tablet und Wegpunktübertragung kommen erst nach V1.

Für später vorgesehen:

- Job-/Organisationssynchronisation: FiveM → Nexus, FiveM ist führende Datenquelle
- Dienststatus: FiveM → Nexus, FiveM ist führende Datenquelle
- `/nexus` beziehungsweise Öffnen aus einem Ingame-Tablet
- Nexus → FiveM-Wegpunkt

Nicht vorgesehen:

- interne Spieler-Onlineanzeige
- Spielerpositionsübernahme in Einsatzmodule
- Fahrzeugkennzeichen-/Halter-Sync
- Synchronisation der Ingame-Telefonnummer

Eine spätere Verknüpfung verwendet die Nexus-ID. FiveM erhält niemals privilegierte Supabase-Service-Schlüssel.

## API und Synchronisation

V1 besitzt keine öffentliche Read-only-API und keine allgemein nutzbare FiveM-API.

Die Architektur bereitet jedoch sichere, versionierte Schnittstellen vor. Webhook-Ein- und -Ausgänge können technisch vorbereitet werden.

Für die spätere Integration vorgesehen:

- idempotente Synchronisationsschlüssel
- Queue für fehlgeschlagene Syncs
- manuelle Wiederholung fehlgeschlagener Syncs
- definierte Datenquellen-Priorität bei Konflikten
- API-Endpunkt-Versionierung von Beginn an

Keine allgemeinen Servicekonten für technische Integrationen.

## Betrieb, Backups und Wartung

Es gibt eine **eigene technische Backup-/Betriebsrolle**, getrennt von IC-Stadtverwaltung und nicht an eine einzelne Person gebunden.

- automatische Datenbank-Backups: alle 6 Stunden
- regelmäßige Wiederherstellungstests
- Backup-Aufbewahrungsstufen
- separate Backups für hochsensible Module
- Wartungsfenster mit Vorankündigung
- öffentliche Komponenten-Statusseite
- Frontend-/Backend-Fehlerprotokollierung
- Performance-Monitoring
- Datenbank-Healthchecks
- automatische Bereinigung tatsächlich abgelaufener Daten gemäß Modul-Aufbewahrungsregeln

Medical- und dauerhaft aufzubewahrende Justice-Daten dürfen von der Bereinigung niemals aufgrund einer generischen Frist entfernt werden.

## Modulübergreifende Sonderfälle

- Rechteentzug bei geöffnetem Datensatz: Zugriff/Aktion sofort stoppen; aktueller Berechtigungsstatus zählt; bei Unklarheit blockieren und berechtigte Adminentscheidung verlangen.
- Organisationsaustritt während laufender Vorgänge: nicht automatisch fortführen; strengste beteiligte Berechtigungsregel und ggf. manuelle Entscheidung.
- Account-Sperre während Bewerbung/Antrag: Zugriff sofort stoppen; aktueller Accountstatus zählt.
- `disabled` während PD-/Justice-Verfahren: historische Verfahrensreferenzen bleiben erhalten; der Account selbst erhält keinen Zugriff.
- Organisationsumbenennung: feste interne Organisations-ID; nur Anzeigename ändert sich, bestehende Links funktionieren weiter.
- Organisationsarchivierung mit offenen Vorgängen: Zugriff stoppen und offene Vorgänge sicher behandeln; keine stillschweigende Fortführung.
- Rollenlöschung/-deaktivierung mit offenen Zuweisungen: Zuweisungen in sicheren Zwischenzustand setzen und neu auflösen.
- Privatsphäreänderung nach Freigabe: aktueller Privacy-Stand hat Vorrang; entzogene Sichtbarkeit wirkt auf zukünftigen Zugriff.
- Benutzerblockierung darf notwendige gemeinsame Organisationsarbeit nicht zerstören; Organisationsberechtigungen und strengste Regel bleiben maßgeblich.
- Gleichzeitige Bearbeitung: optimistische Konfliktkontrolle. Der erste Speichervorgang gewinnt. Beim zweiten erscheint eine Konfliktmeldung; dessen noch nicht gespeicherte Eingaben bleiben sichtbar/kopierbar. Danach muss der Datensatz neu geöffnet werden.
