# LG Nexus – Konzept

## Grundidee

LG Nexus ist kein reines Behörden-MDT, sondern die digitale Infrastruktur der RP-Stadt.

### Öffentliche Ebene

- Dashboard
- Unternehmen & Behörden
- Öffnungsstatus
- Events
- City Hub
- Karte
- Kalender
- Mail

### Interne Ebene

Die internen Bereiche erscheinen nur bei entsprechender Berechtigung.

- Medical
- Police
- Fire & Rescue
- später Justiz und Verwaltung
- später Unternehmensverwaltung

## Navigation

Das Hauptmenü bleibt als schmale Icon-Leiste links sichtbar. Große Bereiche erhalten ein eigenes Modul. Detailfunktionen werden innerhalb des jeweiligen Moduls angezeigt, damit die Hauptnavigation nicht überladen wird.

## Unternehmen

Unternehmen und Behörden besitzen ein öffentliches Profil mit:

- Name
- Beschreibung
- Logo und Titelbild
- Standort
- Kontakt
- Status: geöffnet / eingeschränkt / geschlossen
- optionalem Statustext

Der Status ist über Supabase Realtime live aktualisierbar.

## Staatliche Zusammenarbeit

Medical, Police und Fire & Rescue sollen später gemeinsame Einsätze verwenden können. Gemeinsame Einsatzinformationen und fraktionsinterne sensible Daten werden dabei getrennt behandelt.

## Technik

- React
- TypeScript
- Vite
- Supabase Auth
- PostgreSQL
- Row Level Security
- Supabase Realtime
- GitHub für Code und Migrationen

Die Web-App soll sowohl im Browser als auch eingebettet in FiveM funktionieren. Eine direkte FiveM-Datenverbindung ist für die erste Version nicht erforderlich.
