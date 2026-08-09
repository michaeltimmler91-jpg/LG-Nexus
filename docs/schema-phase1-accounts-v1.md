# LG Nexus – Phase 1 Accounts/Identität: Spaltenschema V1

Dieses Dokument konkretisiert Phase 1 der technischen Blaupause bis auf Tabellen- und Spaltenebene. Es ist die Vorlage für die erste V1-Migration und ersetzt noch keine bestehende Datenbankstruktur.

## Grundsätze

- `auth.users` bleibt die technische Login-Identität.
- `public.profiles.id` bleibt dieselbe UUID wie `auth.users.id`.
- Die Nexus-ID bleibt der stabile fachliche Personen-Schlüssel.
- Historien werden in eigene Tabellen ausgelagert und nicht in JSON-Felder gepackt.
- Direkte Client-Schreibrechte auf Status-, Rollen- oder Auditdaten sind nicht vorgesehen.
- Bearbeitbare Tabellen erhalten `row_version bigint not null default 1` für optimistische Konfliktkontrolle.

## `public.profiles`

Bestehende Kernspalten bleiben erhalten:

- `id uuid primary key -> auth.users.id`
- `username text`
- `first_name text`
- `last_name text`
- `display_name text`
- `date_of_birth date`
- `phone text`
- `avatar_url text`
- `account_status text`
- `nexus_id text`
- `nexus_email text`
- `approved_at timestamptz`
- `approved_by uuid`
- `must_change_password boolean`
- Ablehnungs-/Freischaltungsfelder aus den bestehenden Migrationen
- bestehende Sichtbarkeitsfelder für Telefon/Nexus-Mail
- `created_at timestamptz`
- `updated_at timestamptz`

Phase-1-Ergänzungen:

- `avatar_visibility text not null default 'nobody'`
- `date_of_birth_visibility text not null default 'nobody'`
- `birthday_day_month_visible boolean not null default false`
- `allow_new_direct_contacts boolean not null default true`
- `row_version bigint not null default 1`

Für bisher noch nicht fachlich festgelegte Standard-Sichtbarkeiten verwenden wir technisch zunächst **Least Privilege** (`nobody`). Der Bürger kann sie später selbst ändern.

Erlaubte Sichtbarkeitswerte:

- `nobody`
- `citizens`
- `authorities`
- `citizens_and_authorities`
- `own_organization`
- `everyone`

## `public.profile_preferences`

Persönliche Darstellung, 1:1 zu Profil.

Spalten:

- `profile_id uuid primary key -> profiles.id on delete cascade`
- `theme text not null default 'dark'` (`dark|light`)
- `accent_key text null`
- `high_contrast boolean not null default false`
- `font_scale numeric(4,2) not null default 1.00`
- `density text not null default 'comfortable'` (`comfortable|compact`)
- `notification_sound_enabled boolean not null default true`
- `notification_volume smallint not null default 100`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `row_version bigint not null default 1`

Nur der Eigentümer darf diese Daten lesen und ändern.

## `public.profile_name_history`

Dauerhafte RP-Namenshistorie.

Spalten:

- `id uuid primary key default gen_random_uuid()`
- `profile_id uuid not null -> profiles.id`
- `old_first_name text not null`
- `old_last_name text not null`
- `new_first_name text not null`
- `new_last_name text not null`
- `change_request_id uuid null`
- `reason text null`
- `changed_by uuid null -> auth.users.id on delete set null`
- `changed_at timestamptz not null default now()`

Keine automatische Löschung.

## `public.profile_identity_change_requests`

Stadtverwaltungsprozess für Namens-/Identitätskorrekturen.

Spalten:

- `id uuid primary key default gen_random_uuid()`
- `profile_id uuid not null -> profiles.id`
- `request_type text not null` (`name_change|birthdate_correction`)
- `requested_first_name text null`
- `requested_last_name text null`
- `requested_date_of_birth date null`
- `reason text not null`
- `status text not null default 'new'` (`new|in_review|approved|rejected|withdrawn`)
- `decision_reason text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `decided_at timestamptz null`
- `decided_by uuid null -> auth.users.id`
- `row_version bigint not null default 1`

## `public.account_status_history`

Dauerhafte Historie aller Accountstatuswechsel.

Spalten:

- `id bigint generated always as identity primary key`
- `profile_id uuid not null -> profiles.id`
- `old_status text null`
- `new_status text not null`
- `reason text null`
- `changed_by uuid null -> auth.users.id on delete set null`
- `created_at timestamptz not null default now()`

Diese Tabelle wird nie durch normale Nutzer geändert.

## `public.profile_blocks`

Blockierungen Bürger ↔ Bürger.

Spalten:

- `blocker_id uuid not null -> profiles.id on delete cascade`
- `blocked_id uuid not null -> profiles.id on delete cascade`
- `created_at timestamptz not null default now()`
- Primary Key `(blocker_id, blocked_id)`
- Check `blocker_id <> blocked_id`

Nur der Blockierende darf den Eintrag sehen, anlegen oder entfernen. Fachmodule dürfen über serverseitige Helper prüfen, ob eine Blockierung besteht.

## `public.system_roles`

Technische Rollen getrennt von IC-Organisationen.

Spalten:

- `id uuid primary key default gen_random_uuid()`
- `key text not null unique`
- `name text not null`
- `description text not null default ''`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

V1-Systemrollen:

- `system_admin`
- `security_admin`
- `backup_operator`
- `moderator`

Keine dieser Rollen gewährt automatisch Medical-/PD-/Justice-Fachzugriff.

## `public.system_role_assignments`

Spalten:

- `system_role_id uuid not null -> system_roles.id on delete cascade`
- `profile_id uuid not null -> profiles.id on delete cascade`
- `assigned_by uuid null -> auth.users.id on delete set null`
- `assigned_at timestamptz not null default now()`
- Primary Key `(system_role_id, profile_id)`

Schreibzugriffe nur über privilegierte serverseitige Administration.

## `public.system_audit_log`

Technischer Auditlog für sensible Systemaktionen.

Spalten:

- `id bigint generated always as identity primary key`
- `actor_profile_id uuid null -> profiles.id on delete set null`
- `action_key text not null`
- `target_type text null`
- `target_id text null`
- `metadata jsonb not null default '{}'::jsonb`
- `request_id uuid null`
- `created_at timestamptz not null default now()`

Aufbewahrung gemäß Security-/Betriebskonzept, nicht als normaler Benutzerinhalt.

## `public.security_events`

Für Login-/Sicherheitsereignisse, getrennt vom allgemeinen Auditlog.

Spalten:

- `id bigint generated always as identity primary key`
- `profile_id uuid null -> profiles.id on delete set null`
- `event_type text not null`
- `success boolean not null`
- `device_label text null`
- `ip_address inet null`
- `approx_region text null`
- `user_agent text null`
- `created_at timestamptz not null default now()`

Normale Benutzeroberflächen erhalten keine fremden IP-Daten. Standardaufbewahrung für Loginereignisse: 30 Tage.

## Trigger / Hilfslogik

Phase 1 benötigt:

- generischen `set_updated_at()`-Trigger
- generischen `increment_row_version()`-Trigger
- Trigger für `account_status_history`
- serverseitige Namensänderungsaktion, die gleichzeitig `profile_name_history` schreibt
- Helper `private.is_active_account(profile_id)`
- Helper `private.has_system_role(role_key)`

## RLS-Ziel

`profiles` wird nicht wieder pauschal für alle authentifizierten Nutzer geöffnet. Öffentliche Profilansichten sollen später über gezielte Views/RPCs mit Privacy-Auflösung erfolgen.

Direkte Tabellenrechte:

- eigenes Profil: nur ausdrücklich selbst änderbare Felder
- eigene Preferences: lesen/schreiben
- eigene Blocks: lesen/schreiben
- Histories/Audit/Systemrollen: keine normalen Client-Schreibrechte

## Konfliktkontrolle

Bei Updates auf bearbeitbaren Tabellen wird `row_version` mitgesendet.

Beispiel:

- Browser liest `row_version = 7`
- Speichern nur mit Bedingung `row_version = 7`
- erfolgreicher Save erhöht auf `8`
- zweiter Browser mit alter Version erhält Konflikt
- dessen lokale Eingaben bleiben sichtbar/kopierbar
- Nutzer lädt Datensatz neu und übernimmt seine Änderung erneut
