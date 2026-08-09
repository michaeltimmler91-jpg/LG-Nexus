# LG Nexus – Betrieb, Backups und Wartung

Dieses Dokument beschreibt den verbindlichen technischen Betriebsplan nach Auswertung bis Frage 3410.

## Technische Rollen

Für Backup-/Restore- und ausgewählte Betriebsaufgaben existiert eine **eigene technische Backup-/Betriebsrolle**.

Diese Rolle ist:

- von IC-Stadtverwaltungsrechten getrennt
- nicht automatisch identisch mit dem umfassenden System-Admin
- an mehrere vertrauenswürdige Personen vergebbar
- ausdrücklich nicht an eine einzelne Person gebunden

Die Rolle gewährt keinen fachlichen Zugriff auf vertrauliche Medical-/PD-/Justice-Inhalte.

## Datenbank-Backups

Automatische Datenbank-Backups werden **alle 6 Stunden** eingeplant.

- Überwachung durch die technische Backup-/Betriebsrolle
- bei wiederholten Problemen interner Alarm
- technische Backup-Fehlerlogs mindestens 30 Tage

## Wiederherstellungstests

Regelmäßige Restore-Tests sind vorgesehen.

- Verwaltung/Überwachung durch die technische Backup-/Betriebsrolle
- standardmäßig tägliche technische Prüfung/Planung
- kritische Fehler erzeugen internen Alarm
- relevante Fehlerprotokolle mindestens 30 Tage

## Backup-Aufbewahrungsstufen

Nexus verwendet abgestufte Backup-Aufbewahrung, damit nicht jedes Backup dauerhaft gehalten werden muss.

Die konkrete Staffelung wird bei der Infrastrukturumsetzung festgelegt. Verwaltung erfolgt über die technische Backup-/Betriebsrolle.

## Hochsensible Module

Für hochsensible Module sind zusätzliche getrennte Backup-Sicherungen vorgesehen.

- technische Prüfung mindestens wöchentlich
- kritische Fehler erzeugen Alarm
- relevante technische Protokolle 90 Tage

Die Trennung der Backups ändert nichts an den fachlichen Zugriffsrechten.

## Wartungsfenster

Geplante Wartungsfenster können vorab angekündigt werden.

- Verwaltung durch technische Systemadministration
- Wartungsmodus und öffentliche Wartungsseite bleiben verfügbar
- Probleme während des Wartungsfensters können interne Alarme auslösen

## Statusseite

Die öffentliche Statusseite zeigt Komponentenstatus für die wesentlichen Nexus-Dienste.

Mindestens unterscheidbar:

- Web-/Frontend
- API/Backend
- Datenbank
- Storage beziehungsweise externe Medienabhängigkeiten, soweit relevant

Die Statusseite darf keine internen Geheimnisse oder sensiblen Daten zeigen.

## Monitoring

Vorgesehen:

- Frontend-/Backend-Fehlerprotokollierung
- Performance-Monitoring
- Datenbank-Healthchecks
- eindeutige Fehler-IDs für technische Analyse

Kritische Zustände können interne Alarme für technische Verantwortliche erzeugen.

## Datenbereinigung

Abgelaufene Daten dürfen gemäß den **fachlich festgelegten Aufbewahrungsregeln** automatisch bereinigt werden.

Wichtig:

- Medical-Krankenakten werden niemals wegen einer generischen Bereinigungsfrist gelöscht.
- dauerhaft aufzubewahrende Justice-Verfahren und relevante Akten werden nicht automatisch entfernt.
- technische Bereinigung darf nur Datensätze löschen, deren Fachmodul dies ausdrücklich erlaubt.

Bereinigungsvorgänge werden technisch nachvollziehbar geplant; entsprechende technische Logs können bis zu 12 Monate vorgehalten werden.
