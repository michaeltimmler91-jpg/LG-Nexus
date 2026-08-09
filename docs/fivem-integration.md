# LG Nexus – FiveM-Integration

Dieses Dokument beschreibt die verbindliche Planung für eine spätere FiveM-Anbindung.

## V1-Grenze

**V1 funktioniert vollständig ohne direkte FiveM-Verbindung.**

Damit gehören ausdrücklich noch nicht zu V1:

- `/nexus` beziehungsweise Öffnen aus einem Ingame-Tablet
- Setzen eines FiveM-Wegpunkts aus Nexus
- automatische Job-/Dienststatus-Synchronisation
- sonstige Live-Synchronisation

Nexus bleibt als normale Web-App nutzbar.

## Architektur von Beginn an vorbereiten

Obwohl V1 keine Verbindung aufbaut, wird die Daten- und Rechtearchitektur so angelegt, dass eine spätere Integration möglich ist.

Grundregeln:

- Zuordnung über die stabile Nexus-ID
- FiveM arbeitet niemals direkt mit privilegierten Supabase-Service-Schlüsseln
- spätere Schreib-/Sync-Aktionen laufen über eine serverseitige API-/Edge-Function-Schicht
- API-Verträge werden versioniert
- Syncs müssen wiederholbar und idempotent geplant werden

## Erste spätere Integrationen

### Job / Organisation

Automatische Job-/Organisationssynchronisation kommt nach V1.

- Richtung: **FiveM → Nexus**
- FiveM ist für diesen Datentyp die führende Quelle
- bei Ausfall werden Änderungen zwischengespeichert und später nachgeholt
- Einführung zuerst im Testmodus
- kritische Syncfehler werden für technische Admins sichtbar

### Dienststatus

Automatische Dienststatus-Synchronisation kommt nach V1.

- Richtung: **FiveM → Nexus**
- FiveM ist führende Quelle
- Ausfälle werden nachgeholt
- Einführung zunächst im Testmodus

### Nexus öffnen

Nach V1 soll Nexus aus FiveM geöffnet werden können, beispielsweise über `/nexus` im T-Chat beziehungsweise ein Ingame-Tablet.

Die Aktion öffnet nur die Nexus-Oberfläche und ist kein allgemeiner Datensync.

### Wegpunkt

Nach V1 soll ein geeigneter Nexus-Kartenpunkt als FiveM-Wegpunkt gesetzt werden können.

- Richtung: **Nexus → FiveM**
- Nexus liefert den gewählten Zielpunkt
- Einführung zuerst im Testmodus

## Derzeit nicht vorgesehen

- automatische interne Spieler-Onlineanzeige
- Übernahme aktueller Spielerpositionen in Einsatzmodule
- Fahrzeugkennzeichen-Synchronisation
- Fahrzeughalter-Synchronisation aus ESX
- Synchronisation der Ingame-Telefonnummer

## LB Phone

Deep-Link-Unterstützung zu LB Phone kann technisch vorbereitet werden, ist aber noch keine feste aktive V1-Funktion.

## Sicherheit

Jede spätere FiveM-Aktion verwendet nur minimal notwendige Berechtigungen. Ein kompromittiertes FiveM-Resource darf keinen direkten Datenbank-Vollzugriff erhalten.
