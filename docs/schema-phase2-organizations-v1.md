# LG Nexus – Phase 2 Organisationen/Rollen: Spaltenschema V1

Dieses Dokument konkretisiert Phase 2 der technischen Blaupause bis auf Tabellen- und Spaltenebene. Es baut auf Phase 1 auf und ist die Vorlage für die Organisations-/RBAC-Migration.

## Übergangsgrundsatz

Die bestehende Tabelle `public.organization_members` bleibt zunächst bestehen und wird schrittweise erweitert. Die alten Felder `role_title` und `is_manager` werden während der Übergangsphase nicht sofort gelöscht, aber nach Aktivierung des neuen Rechtesystems nicht mehr als Berechtigungsquelle verwendet.

## `public.organizations`

Bestehende UUID bleibt stabil.

Ergänzungen/Zielspalten:

- `id uuid primary key`
- `slug text unique`
- `name text not null`
- `short_name text null`
- `organization_type text not null`
- `description text not null default ''`
- `phone text null`
- `public_email text null`
- `logo_url text null`
- `banner_url text null`
- `status text not null`
- `status_message text null`
- `members_public boolean not null default true`
- `is_public boolean not null default true`
- `is_archived boolean not null default false`
- `archived_at timestamptz null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `row_version bigint not null default 1`

Organisationen werden intern immer über `id` referenziert. Eine Namensänderung ändert keine FK-Beziehung.

## `public.organization_locations`

Spalten:

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null -> organizations.id on delete cascade`
- `name text not null`
- `location_type text not null default 'other'`
- `address_label text null`
- `map_x numeric null`
- `map_y numeric null`
- `map_z numeric null`
- `opening_hours_text text null`
- `status text null`
- `is_main boolean not null default false`
- `is_active boolean not null default true`
- `public_marker_enabled boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `row_version bigint not null default 1`

Pro Organisation höchstens ein aktiver Hauptstandort über Partial-Unique-Index.

## `public.permissions`

Globaler stabiler Permission-Katalog.

Spalten:

- `key text primary key`
- `module text not null`
- `name text not null`
- `description text not null default ''`
- `is_sensitive boolean not null default false`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`

Technische Keys werden nicht umbenannt, nur sichtbare Texte können geändert werden.

Erste Kernkeys:

- `org.profile.manage`
- `org.status.manage`
- `org.locations.manage`
- `org.members.view`
- `org.members.manage`
- `org.members.remove`
- `org.roles.assign`
- `org.tasks.manage`
- `org.tasks.templates.manage`
- `org.mail.read`
- `org.mail.assign`
- `org.documents.create`
- `org.documents.manage`
- `org.events.manage`
- `org.offers.manage`
- `org.gallery.manage`
- `org.faq.manage`
- `org.jobs.manage`
- `org.applications.view`
- `org.applications.manage`
- `org.calendar.manage`
- `org.internal_map.manage`

Fachmodule ergänzen später weitere Keys.

## `public.organization_roles`

Spalten:

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null -> organizations.id on delete cascade`
- `name text not null`
- `description text not null default ''`
- `color_key text null`
- `icon_key text null`
- `hierarchy_rank integer not null`
- `is_owner boolean not null default false`
- `is_standard boolean not null default false`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `row_version bigint not null default 1`

Constraints/Indizes:

- Rollenname je Organisation case-insensitive eindeutig
- exakt höchstens eine Owner-Systemrolle je Organisation
- exakt höchstens eine aktive Standardrolle je Organisation
- Owner-Rolle nicht löschbar/deaktivierbar über normale Org-Aktionen

`hierarchy_rank`: kleinerer Wert = höher in der Hierarchie; Owner wird logisch immer über allen normalen Rollen behandelt.

## `public.organization_role_permissions`

Spalten:

- `role_id uuid not null -> organization_roles.id on delete cascade`
- `permission_key text not null -> permissions.key on delete cascade`
- `granted_at timestamptz not null default now()`
- `granted_by uuid null -> profiles.id on delete set null`
- Primary Key `(role_id, permission_key)`

Owner muss nicht jede Permission physisch in dieser Tabelle besitzen. `private.has_org_permission()` behandelt `is_owner = true` als vollständige normale Organisationsberechtigung.

## Erweiterung `public.organization_members`

Übergangsziel:

- bestehende `id uuid`
- bestehende `organization_id uuid`
- bestehende `user_id uuid`
- `role_id uuid null -> organization_roles.id`
- bestehendes `is_active boolean`
- `inactive_reason text null`
- `inactive_at timestamptz null`
- `inactive_by uuid null -> profiles.id on delete set null`
- `left_at timestamptz null`
- `leave_reason text null`
- `removed_by uuid null -> profiles.id on delete set null`
- `removal_reason text null`
- bestehendes `joined_at timestamptz`
- `row_version bigint not null default 1`

Während der Migration werden alle vorhandenen Mitglieder zunächst der normalen Standardrolle zugeordnet. Frühe `is_manager = true`-Einträge werden **nicht automatisch zu Ownern**.

Nach manueller Owner-Zuordnung kann `role_id` verpflichtend werden.

## `public.organization_membership_history`

Historie von Aufnahme, Austritt, Entfernung und Rollenwechseln.

Spalten:

- `id bigint generated always as identity primary key`
- `organization_id uuid not null`
- `profile_id uuid not null`
- `event_type text not null`
- `old_role_id uuid null`
- `new_role_id uuid null`
- `reason text null`
- `actor_profile_id uuid null`
- `created_at timestamptz not null default now()`

Aufbewahrung der sichtbaren Ehemaligenansicht kann 12 Monate betragen; sicherheits-/auditrelevante technische Events können getrennt länger bestehen.

## `public.organization_member_notes`

Spalten:

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null`
- `member_profile_id uuid not null`
- `author_profile_id uuid not null`
- `content text not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `row_version bigint not null default 1`

Bearbeiten/Löschen nur nach den fachlich festgelegten Owner-/Erstellerregeln.

## `public.organization_audit_log`

Spalten:

- `id bigint generated always as identity primary key`
- `organization_id uuid not null`
- `actor_profile_id uuid null`
- `action_key text not null`
- `target_type text null`
- `target_id text null`
- `old_data jsonb null`
- `new_data jsonb null`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

Aufbewahrung: regulär 6 Monate, sofern ein Fachmodul keine strengere Regel benötigt.

## Server-Helfer

### `private.is_active_org_member(target_org uuid)`

True nur wenn:

- aktueller `auth.uid()` einem Profil entspricht
- Mitgliedschaft zur Organisation existiert
- `is_active = true`
- Organisation nicht archiviert ist
- Accountstatus den Zugriff erlaubt

### `private.is_org_owner(target_org uuid)`

True nur bei aktiver Mitgliedschaft auf aktiver `organization_roles.is_owner = true`.

### `private.has_org_permission(target_org uuid, permission_key text)`

Reihenfolge:

1. Accountstatus prüfen
2. aktive Mitgliedschaft prüfen
3. Owner → true
4. sonst Role-Permission prüfen
5. bei fehlender/ungültiger Rolle → false

`is_manager` wird hier niemals verwendet.

## RLS-Muster

Normale Organisationstabellen:

- öffentlich lesbare Daten: eigene explizite Public-Policy
- interne Daten: `private.is_active_org_member()` plus ggf. Permission
- Schreibaktionen: passender Permission-Key
- sensible Fachmodule: zusätzliche Fall-/Freigaberegeln; Owner-Regel der Organisation allein reicht dort nicht zwingend

## Rollen-Hierarchie

Hierarchieprüfung wird nicht nur im Frontend durchgeführt.

Bei Rollenvergabe muss serverseitig gelten:

- Owner darf jede normale aktive Rolle zuweisen
- Nicht-Owner braucht `org.roles.assign`
- Zielmitglied muss unterhalb des handelnden Mitglieds stehen
- Zielrolle muss unterhalb der handelnden Rolle liegen
- eigene Rolle nicht selbst verändern
- gleich-/höherrangige Mitglieder nicht verändern

## Owner-Sonderfall

Owner-Ernennung und Owner-Entzug werden nicht als normale Rollenvergabe behandelt, sondern als eigene serverseitige Aktionen mit Audit und den bereits festgelegten Sonderregeln.

## Transition aus dem Demo-Schema

Reihenfolge:

1. neue Tabellen/Spalten hinzufügen
2. Permissions seed'en
3. je Organisation Owner- und Standardrolle erzeugen
4. alle bestehenden Mitglieder zunächst Standardrolle zuordnen
5. reale Owner manuell festlegen
6. neue Helper/RPCs aktivieren
7. Frontend auf neue Rechte umstellen
8. RLS auf neue Helper umstellen
9. erst danach `is_manager`/`role_title` als Berechtigungsquelle stilllegen
10. Altspalten erst in einer späteren Cleanup-Migration entfernen
