# LG Nexus – Permission- und RLS-Plan V1

Dieses Dokument definiert die technische Zugriffslogik für LG Nexus. Es ist noch keine konkrete RLS-Migration, sondern die Vorlage dafür.

## 1. Grundsatz

UI-Ausblendung ist niemals Sicherheit. Jeder Lese- und Schreibzugriff muss serverseitig geprüft werden.

Die Zugriffsentscheidung ergibt sich aus:

1. Accountstatus
2. Systemrolle
3. Organisationsmitgliedschaft
4. Organisationsrolle/Permission
5. zusätzlicher Datensatz-/Fallfreigabe
6. Privacy-/Sichtbarkeitseinstellung
7. Zustand des Datensatzes, z. B. archiviert, versiegelt oder gelöscht

Die strengste relevante Regel gewinnt.

## 2. Accountstatus als erste Schranke

### `active`
Normaler Zugriff entsprechend weiterer Rechte.

### `pending`
Nur ausdrücklich öffentliche Bereiche. Keine persönlichen, organisatorischen oder geschützten Fachmodule.

### `suspended`
Kein normaler Nexus-Zugriff. Nur Sperrstatus-Seite.

### `rejected`
Kein normaler Nexus-Zugriff. Nur Ablehnungsstatus-Seite.

### `disabled`
Kein Nexus-Zugriff. Historische Fachreferenzen bleiben erhalten.

## 3. Systemrollen

Systemrollen werden außerhalb von Organisationsrollen geführt.

### Systemadministration
Technische Nexus-Administration. Kein automatischer Medical-/PD-/Justice-Fachzugriff.

### Sicherheitsadministration
Zugriff auf technische Sicherheits-/Diagnosefunktionen, soweit ausdrücklich vorgesehen.

### Backup/Betrieb
Technische Betriebs- und Wiederherstellungsaufgaben. Kein IC-Stadtverwaltungsrecht.

### Moderation
Zugriff auf gemeldete öffentliche/kommunikative Inhalte entsprechend Moderationskonzept.

## 4. Organisations-Permissions

Permissions erhalten stabile technische Keys.

Empfohlene Benennung:

```text
<modul>.<bereich>.<aktion>
```

Beispiele:

```text
org.members.view
org.members.manage
org.roles.assign
org.tasks.manage
org.tasks.templates.manage
org.mail.read
org.mail.assign
org.documents.create
org.documents.manage
org.events.manage
org.offers.manage
org.faq.manage
medical.treatments.create
medical.treatments.edit
police.cases.edit
justice.templates.manage
city.accounts.approve
```

Die sichtbaren deutschen Rollen-/Rechtsnamen können sich ändern, die technischen Permission-Keys bleiben stabil.

## 5. Owner

Owner ist eine geschützte Organisationsrolle.

Technisch:

- Owner besitzt sämtliche normalen Permissions der eigenen Organisation.
- Owner-Status wird nicht durch hundert einzelne manuelle Role-Permission-Zeilen dargestellt, wenn eine sichere zentrale Owner-Regel einfacher ist.
- Owner einer normalen Organisation erhält dadurch keinen Zugriff auf geschützte Daten anderer Organisationen.
- Owner einer Organisation erhält niemals automatisch technische Systemrollen.

## 6. Hierarchie

Für Aktionen auf Mitgliedern wird zusätzlich zur Permission die Rollen-Hierarchie geprüft.

Beispiele:

- eigenes Rollenobjekt nicht beliebig ändern
- gleich-/höhergestellte Mitglieder nicht über normale Rechte verändern
- Zielrolle muss nach den fachlichen Regeln zulässig sein

Hierarchieprüfungen gehören in serverseitige Helper-Funktionen/RPCs, nicht nur ins Frontend.

## 7. RLS-Helferfunktionen

Geplant sind kleine, klar getrennte serverseitige Prüffunktionen, z. B. sinngemäß:

- `is_active_nexus_user()`
- `has_system_role(role_key)`
- `is_org_member(org_id)`
- `has_org_permission(org_id, permission_key)`
- `is_org_owner(org_id)`
- `can_manage_member(org_id, target_membership_id)`

Fachspezifisch zusätzlich:

- `can_read_medical_record(patient_id)`
- `can_read_police_case(case_id)`
- `can_read_justice_case(case_id)`
- `can_read_shared_incident(incident_id)`

Fachspezifische Funktionen dürfen nicht durch eine einzige universelle `is_admin()`-Abkürzung ersetzt werden.

## 8. Öffentliche Tabellenfamilien

Typische öffentliche Daten:

- öffentliche Organisationen
- freigegebene Organisationsstandorte
- öffentliche Angebote
- öffentliche Events
- veröffentlichte City-Hub-Inhalte
- öffentliche Map-Marker
- ausdrücklich öffentliche Memories-Inhalte

RLS-Prinzip:

- `anon` nur dort, wo das Konzept wirklich anonymen Browserzugriff vorsieht
- `authenticated` entsprechend Accountstatus
- nicht veröffentlichte/archivierte/interne Zeilen niemals über dieselbe Policy versehentlich sichtbar machen

## 9. Profile und Privacy

Name und Nexus-ID folgen den festgelegten Sichtbarkeitsregeln.

Für Telefonnummer, Nexus-Mail, Profilbild und RP-Geburtsdatum wird Sichtbarkeit serverseitig ausgewertet.

Ein verborgener Wert darf nicht:

- in einer normalen SELECT-Antwort enthalten sein
- über eine Suchfunktion bestätigbar sein
- in einem allgemein lesbaren Index stehen
- indirekt über Fehlertexte verraten werden

Empfohlen: öffentliche/personalisierte Profile über sichere Views oder RPCs ausgeben, statt allen Nutzern uneingeschränkten SELECT auf sämtliche Rohfelder von `profiles` zu erlauben.

## 10. Organisationsdaten

### Mitgliedschaften

Lesen abhängig von:

- eigene Mitgliedschaft
- passende Organisationsrechte
- öffentliche Mitgliederlisten-Regel
- besondere Stadtverwaltungsaufsicht, sofern fachlich erlaubt

### Interne Aufgaben

Stadtverwaltung erhält keinen pauschalen Zugriff auf normale Organisationsaufgaben.

### Interne Dokumente

Ordner-/Rollenfreigaben werden serverseitig geprüft. Eine Dokumentverknüpfung aus einem anderen Modul ersetzt diese Prüfung nicht.

### Organisations-Mail

Postfachzugriff richtet sich nach Rollenpostfach + zugehörigen Berechtigungen. Mehrere Mailadressen führen nicht zu einem Sicherheits-Bypass.

## 11. Medical

Medical ist eine besonders geschützte Datenfamilie.

Zugriff erfordert mindestens:

- aktiven Nexus-Account
- aktive Medical-Mitgliedschaft
- passendes Fachrecht
- ggf. zusätzliche Fall-/Sperrvermerk-Freigabe

Nicht automatisch berechtigt:

- Stadtverwaltung
- technische Systemadministration
- andere staatliche Organisationen
- Organisations-Owner außerhalb Medical

Bürgeransicht:

Nur Einträge, die ausdrücklich für den Patienten freigegeben wurden.

Freigaben an PD/FD/Justice erfolgen über eigene Freigabe-/Anfragedatensätze und nicht durch direkten Aktenzugriff.

## 12. Police

PD-Zugriff ist fallbezogen und rollenabhängig.

Versiegelte Fälle benötigen zusätzliche Freigabe.

Nicht berechtigt:

- normale Stadtverwaltung
- technische Systemadministration ohne separates Fachrecht
- Medical/FD nur wegen gemeinsamer Vorfälle

Selektiv an Justice freigegebene Beweismittel werden nur lesend sichtbar.

## 13. Fire & Rescue

FD-interne Einsatz-/Objekt-/Gefahrendaten sind intern geschützt.

Stadtverwaltung erhält keinen pauschalen Zugriff.

Gezielt freigegebene Gefahreninformationen an PD/Medical werden über explizite Freigaben sichtbar.

## 14. Justice

Justice-Zugriff richtet sich nach:

- aktiver Justice-Mitgliedschaft
- Rolle/Recht
- Versiegelungsstatus
- konkreter Verfahrensfreigabe

Sonderregel:

Stadtverwaltung besitzt den bereits festgelegten read-only Zugriff auf Justice-Verfahren. Dieser Zugriff ist ausdrücklich getrennt von Medical/PD/FD.

Read-only bedeutet:

- keine Inserts
- keine Updates
- keine Deletes
- keine fachlichen Freigaben

## 15. Shared Incidents

Nur bestätigte beteiligte Fraktionen sehen den gemeinsamen Bereich.

Eine Beteiligung am Shared Incident gewährt keinerlei automatischen Zugriff auf vollständige Medical-, PD- oder FD-Daten.

Freigegebene Facheinträge werden über explizite Share-Datensätze aufgelöst.

## 16. Bürger-/Eigentümerzugriff

Eigentümerprinzip wird nur verwendet, wenn es fachlich gilt.

Beispiele:

- eigene persönliche Kalendereinträge
- eigene persönlichen Mailzustände
- eigene Profileinstellungen
- eigene Memories-Alben

Es gilt **nicht** pauschal für:

- eigene Medical-Akte
- eigene PD-Fälle
- eigene Justice-Akte

Dort gelten die speziell festgelegten Freigaberegeln.

## 17. Soft-Delete und Archiv

Normale SELECT-Policies sollen gelöschte Inhalte standardmäßig ausschließen.

Papierkorb-Ansichten erhalten separate Regeln.

Archivierte Inhalte bleiben nur dann sichtbar, wenn:

- das Modul Archivzugriff erlaubt
- der Nutzer weiterhin fachlich berechtigt ist

Soft-Delete darf keine alte Freigabe umgehen.

## 18. Historien und Auditlogs

Historientabellen übernehmen grundsätzlich die Schutzklasse ihres Parent-Datensatzes.

Beispiel:

Wer einen aktuellen Medical-Bericht nicht lesen darf, darf auch dessen frühere Versionen nicht lesen.

Auditlogs besitzen eigene, oft strengere technische Rechte.

## 19. Benachrichtigungen

Ein Benutzer darf ausschließlich eigene konkrete Benachrichtigungen lesen.

Ein Deep-Link in einer Benachrichtigung erteilt niemals Zugriff. Beim Öffnen wird das Ziel erneut normal geprüft.

System-/Stadtmeldungen werden über eigene Empfängerzuordnungen abgesichert.

## 20. Suche

Globale Suche:
- nur öffentliche Inhalte

Interne Suchen:
- eigene serverseitige fachliche Berechtigungsprüfung

Es darf keine zentrale Such-View geben, die geschützte Datensätze aller Module zusammenführt und anschließend nur clientseitig filtert.

## 21. Schreibvorgänge mit mehreren Schritten

Komplexe Änderungen werden in einer serverseitigen Transaktion ausgeführt.

Beispiele:

- Mitglied aufnehmen + Standardrolle zuweisen + Historie erzeugen
- Bewerbung annehmen + Mitgliedsaufnahme anbieten
- Event absagen + Teilnehmer benachrichtigen
- Wartelistenpriorität ändern + Pflichtgrund protokollieren
- Shared Incident mergen
- Account endgültig deaktivieren

Damit entstehen keine halbfertigen Zwischenstände.

## 22. Konfliktkontrolle

RLS beantwortet `darf der Nutzer speichern?`.

Die Versionsprüfung beantwortet zusätzlich `bearbeitet der Nutzer noch die aktuelle Version?`.

Beides muss erfolgreich sein.

## 23. RLS-Testmatrix

Für jede Tabellenfamilie werden vor Migration mindestens diese Fälle getestet:

1. anonymous
2. pending
3. active normal citizen
4. eigener Datensatz
5. fremder Datensatz
6. aktives Organisationsmitglied ohne Recht
7. Mitglied mit passendem Recht
8. Owner
9. inaktives Organisationsmitglied
10. Stadtverwaltung
11. Systemadministration
12. Backup/Betrieb
13. fachfremde Behörde
14. explizit freigegebener Datensatz
15. Freigabe nachträglich entzogen
16. archivierter Datensatz
17. soft-deleted Datensatz
18. disabled historische Person

Für Medical/PD/Justice kommen versiegelte/besonders geschützte Fälle zusätzlich hinzu.

## 24. Migrationsregel

Keine neue Fachdatentabelle wird ohne aktivierte RLS und mindestens grundlegende Policies produktiv freigegeben.

Der bestehende frühe Organisations-Manager-Helper wird beim Rollenumbau durch das neue Permission-System ersetzt und nicht dauerhaft parallel als zweite Wahrheit weitergeführt.
