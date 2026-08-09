# LG Nexus – Stadtverwaltung

Dieses Dokument beschreibt den verbindlichen Stand des Stadtverwaltungs-Moduls bis Frage 3410.

## Bürgerverwaltung

Interne Suche mindestens nach Name und Nexus-ID. Sichtbar ist der technische Accountstatus `pending`, `active`, `suspended`, `rejected`, `disabled`.

Account-Freigaben, Sperren und Statusänderungen bleiben dauerhaft nachvollziehbar.

Eine allgemeine RP-Wohn-/Adressdatenbank ist nicht vorgesehen.

## Interne Bürgernotizen

- alle Stadtverwaltungsmitglieder dürfen Notizen sehen
- Erstellen/Bearbeiten/Löschen nur mit `Bürgernotizen verwalten`
- Versions-/Änderungsverlauf
- keine Kategorien/Tags
- externe Links erlaubt
- Bürger sieht interne Notizen nicht

Ein zusätzliches separates System `interne Verwaltungsfälle pro Bürger` ist nicht vorgesehen.

## Accountverwaltung

Getrennte Rollenrechte für:

- `Accounts freischalten`
- Suspendieren/Reaktivieren
- `Passwort zurücksetzen`
- endgültiges `disabled`
- Identitätskorrekturen/Namensänderungen
- Doppelaccount-Zusammenführung

Suspendierung benötigt internen Grund. Endgültiges `disabled` benötigt Vier-Augen-Prinzip.

## Namensänderungsanträge

Bürger können nach Freischaltung einen **Namensänderungsantrag** bei der Stadtverwaltung stellen.

- Bearbeitung nur mit passendem Verwaltungsrecht
- Bürger sieht den eigenen Vorgang
- Änderungen am Antrag werden nachvollziehbar geführt
- abgeschlossener Antrag kann 6 Monate als Verwaltungsantrag gespeichert bleiben
- nach genehmigter Änderung bleibt der frühere RP-Name getrennt davon **dauerhaft im internen Identitätsverlauf** erhalten

## RP-Geburtsdatum

Korrekturen nach Freischaltung erfolgen ausschließlich durch berechtigte Verwaltung und werden protokolliert.

## Sitzungen bei Sicherheitsfällen

Stadtverwaltung sieht normale Geräte/Sitzungsdetails nicht. Berechtigte Sicherheitsfunktion darf dennoch alle Sitzungen eines Bürgers beenden.

## Verwaltungs-Dashboard

Dashboard für offene Accountfreigaben und relevante Verwaltungsaufgaben.

## Bürgeranträge / Anliegen

Aktive Bürger können Anträge einreichen.

- stadtverwaltete Kategorien
- dynamische Formulare und Pflichtfragen
- Status Neu/In Bearbeitung/Rückfrage/Erledigt/Abgelehnt
- Mehrfachzuweisung
- interne, für Bürger unsichtbare Kommentare
- externe Links
- offizielle Antwort innerhalb des Vorgangs
- Statusbenachrichtigungen
- Ablehnungsgrund Pflicht und für Bürger sichtbar
- Rückziehen offen möglich
- Bearbeitung durch Bürger nur solange Status `Neu`
- erledigt nicht wieder öffnen
- interne Weiterleitung möglich + Benachrichtigung
- keine generische Bearbeitungsfrist

Erledigte/abgelehnte Bürgeranträge: 6 Monate.

## Bürgertermine

Die Stadtverwaltung unterstützt **Bürgertermine mit Warteschlange**.

Dies ergänzt die frühere Regel: Es gibt kein allgemeines frei konfigurierbares Selbstbuchungsportal für jede Verwaltungsleistung. Ausdrücklich aktivierte Verwaltungs-Terminarten dürfen jedoch Terminfenster/Warteschlange verwenden.

Bei vereinbartem Termin:

- Eintrag im Bürgerkalender möglich
- Verschiebung durch Verwaltung + Benachrichtigung
- Absagegrund Pflicht

## Offizielle Dokumente

Vorlagen über `Dokumentvorlagen verwalten`, Ausstellung über `Dokumente ausstellen`.

Jedes Dokument:

- eindeutige Dokumentnummer
- optionales Ablaufdatum
- öffentliche Prüfnummer/QR-Verifikation
- widerrufbar; Widerrufsgrund Pflicht

Öffentliche Prüfung zeigt nur `gültig`/`ungültig`.

Meldebescheinigungen sind nicht als eigener spezieller Dokumenttyp vorgesehen.

## Lizenzen und Genehmigungen

- eigene Lizenzarten
- erteilen, pausieren, entziehen
- Entzug Grund Pflicht
- Bürger sieht eigene aktive/abgelaufene Lizenzen
- Standardgültigkeitsdauer möglich
- Ablauf-Erinnerung
- Antrag über Nexus je Lizenzart konfigurierbar
- auch Organisations-/Firmenlizenzen

PD sieht nur ausdrücklich freigegebene Lizenzarten. Normale Unternehmen nur nach gezielter Bürgerfreigabe.

## Firmenregister

Ein internes/administratives **Firmenregister** ist vorgesehen.

Es kann relevante Organisations-/Firmenstammdaten enthalten und wird über ein eigenes passendes Verwaltungsrecht gepflegt.

- normale Bürger sehen nicht automatisch den vollständigen Registerdatensatz
- gezielte Weitergabe an andere Stellen nur, wenn dafür eine fachliche Berechtigung/Einwilligung besteht
- Registerdaten dürfen als notwendige Verwaltungsstammdaten dauerhaft erhalten bleiben

Nicht vorgesehen:

- öffentliche Registerauszüge als eigener Nexus-Dienst
- eigener Organisationsgründungsgebühren-Status

## Massenbenachrichtigungen

Ein neues System für dynamische Massenbenachrichtigungen an frei definierte Bürgergruppen ist nicht vorgesehen.

Die bereits festgelegten gezielten Stadtverwaltungs-/Systemmeldungen an ausgewählte konkrete Empfänger bleiben möglich.

## Delegierte Verwaltungsbereiche

Ein zusätzliches Unterrollensystem `delegierte Verwaltungsbereiche mit eigenen Rechten` ist nicht vorgesehen. Es gelten die normalen Organisationsrollen/-rechte der Stadtverwaltung.

## Gebühren

Gebühren/Zahlungsstatus bleiben reine RP-Statusfelder ohne echten Zahlungsanbieter.

## Zugriff auf andere Fachmodule

Stadtverwaltung erhält durch Betreiberrolle keinen pauschalen Zugriff auf:

- Medical
- Police
- Fire & Rescue

Justice: nur die ausdrücklich festgelegte read-only-Sonderregel.

Gemeinsame Vorfälle: nur gemeinsamer Bereich read-only.

Technische System-/Backuprechte bleiben von IC-Stadtverwaltungsrechten getrennt.

## Technische Leitplanken

Benötigt werden Bürgerverwaltung, Identitätsverlauf, Namensänderungsanträge, dynamische Bürgeranträge, Bürgertermine/Warteschlange, Dokumente/Lizenzen und Firmenregister.

Interne Verwaltungsdaten werden serverseitig strikt vor Bürgern und unberechtigten Organisationen geschützt.
