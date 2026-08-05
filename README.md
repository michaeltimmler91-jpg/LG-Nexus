# LG Nexus

LG Nexus ist die zentrale Web-Plattform für Los Santos. Das System soll Bürger, Unternehmen und staatliche Fraktionen in einer gemeinsamen Oberfläche verbinden.

## Ziel

- Öffentliche Stadtplattform für Bürger
- Unternehmensverzeichnis mit Live-Status
- Events, Kalender, Karte und Kommunikation
- Eigene geschützte Bereiche für Medical, Police und Fire & Rescue
- Später weitere Unternehmen, Justiz und Verwaltung
- Nutzung als normale Webseite und eingebettet in FiveM

## Aktueller Stand

Die erste technische Basis ist vorhanden:

- React + TypeScript + Vite
- schmale Icon-Navigation links
- Dashboard
- Unternehmensübersicht
- Supabase-Anbindung vorbereitet
- Realtime-Abonnement für Unternehmensstatus
- Demo-Daten, solange noch keine Umgebungsvariablen gesetzt sind
- Supabase-Migrationen im Repository versioniert

## Lokale Entwicklung

```bash
npm install
cp .env.example .env.local
npm run dev
```

Danach in `.env.local` eintragen:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Es darf nur ein Supabase Publishable Key im Browser verwendet werden. Secret-/Service-Keys gehören niemals in das Frontend oder ins Repository.

## Aufbau

```text
src/
  App.tsx
  styles.css
  lib/
    supabase.ts

supabase/
  migrations/

docs/
```

## Geplante Hauptmodule

1. Dashboard
2. Unternehmen & Behörden
3. Events
4. City Hub
5. LS Map
6. Kalender
7. Mail
8. Medical
9. Police
10. Fire & Rescue
11. Account / Rechte

## Sicherheit

Die Datenbank verwendet Row Level Security (RLS). Öffentliche Organisationsdaten können gelesen werden, während interne Änderungen nur entsprechend berechtigten Benutzern erlaubt werden. Sicherheitsrelevante Helper-Funktionen liegen außerhalb des öffentlich exponierten Schemas.
