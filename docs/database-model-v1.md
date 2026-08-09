# LG Nexus – Datenbankmodell V1

Dieses Dokument ist die fachlich-technische Entity-/Tabellenkarte für V1. Es ist noch kein SQL-Schema. Namen können bei der späteren Migration geringfügig angepasst werden, die fachliche Trennung soll jedoch erhalten bleiben.

## Konventionen

Standardfelder auf bearbeitbaren Kerntabellen:

- `id uuid`
- `created_at timestamptz`
- `updated_at timestamptz`
- `row_version bigint`

Bei Soft-Delete je nach Modul zusätzlich:

- `deleted_at`
- `deleted_by`
- `delete_reason`
- `purge_after`

Bei Archivierung separat:

- `archived_at`
- `archived_by`

## A. Accounts, Profile und Identität

### `profiles`
Zentrale Nexus-Person, 1:1 zu `auth.users`.

Wichtige Inhalte:
- Username
- Vor-/Nachname
- RP-Geburtsdatum
- Telefonnummer
- Accountstatus
- Nexus-ID
- Nexus-Mail
- Freischaltungsinformationen
- Profileinstellungen

### `profile_name_history`
Historische RP-Namen nach genehmigter Namensänderung.

FK:
- `profile_id -> profiles.id`

### `profile_identity_change_requests`
Anträge auf Namens-/Identitätskorrektur, soweit über Stadtverwaltung abgewickelt.

### `account_status_history`
Dauerhafte Historie von pending/active/suspended/rejected/disabled.

### `profile_blocks`
Bürger blockiert Bürger.

FK:
- `blocker_id -> profiles.id`
- `blocked_id -> profiles.id`

### `profile_badges`
Von Stadtverwaltung definierte/verliehene freie Badges.

### `profile_badge_assignments`
Zuweisung eines Badges an eine Person plus `is_visible`.

### `verified_role_badges`
Automatisch aus offizieller Organisationsrolle abgeleitete Badges.

### `profile_external_links`
Bis zu den fachlich erlaubten externen Profil-Links inkl. Freigabestatus.

### `profile_favorites`
Private Favoriten für Personenprofile.

### `profile_preferences`
Darstellung, Dark/Light, Akzent, High Contrast, Schriftgröße, Dichte usw.

## B. Technische Rollen und Administration

### `system_roles`
Technische Rollen außerhalb IC-Organisationen.

Beispiele:
- Systemadministration
- Sicherheitsadministration
- Backup/Betrieb
- Moderation

### `system_role_assignments`
Zuordnung Systemrolle ↔ Person.

### `system_audit_log`
Technisch besonders relevante Aktionen.

### `system_feature_flags`
Schrittweise Freischaltung noch nicht aktiver Module/Funktionen.

## C. Organisationen, Rollen und Mitgliedschaften

### `organizations`
Zentrale Organisation.

### `organization_locations`
Mehrere Standorte/Filialen je Organisation.

FK:
- `organization_id -> organizations.id`

### `organization_roles`
Normale Rollen + geschützte Owner-Rolle.

Wichtige Felder:
- Name
- Beschreibung
- Farbe/Icon
- Hierarchie
- `is_owner_role`
- `is_default_role`
- `is_active`

### `permissions`
Globaler Katalog technischer Permission-Keys.

Beispiele:
- `members.manage`
- `tasks.manage`
- `medical.treatments.create`

### `organization_role_permissions`
Zuordnung Rolle ↔ Permission.

### `organization_memberships`
Aktuelle Mitgliedschaft Person ↔ Organisation.

Wichtig:
- `role_id`
- Aktiv/Inaktiv
- Eintritt

Unique:
- eine aktive Mitgliedschaft je Person/Organisation

### `organization_membership_history`
Ein-/Austritt/Entfernung und frühere Rolle.

### `organization_member_notes`
Interne Mitgliedsnotizen.

### `organization_audit_log`
Rollen-/Mitglieds-/Owner-/Profilaktionen der Organisation.

### `organization_public_status_history`
Historie öffentlicher Öffnungsstatus, falls weiterhin fachlich benötigt.

### `organization_founding_requests`
Gründungsanträge.

### `organization_founding_request_owners`
Vorgeschlagene zukünftige Owner + Bestätigung.

## D. Öffentliche Organisationsdarstellung und Business

### `organization_offers`
Produkte/Dienstleistungen.

### `organization_offer_variants`
Basic/Premium usw. mit eigenem Preis.

### `organization_offer_addons`
Optionale Zusatzleistungen.

### `organization_offer_images`
Externe Bildlinks, fachlich begrenzt.

### `organization_offer_categories`
Organisationsdefinierte Angebotskategorien.

### `organization_offer_category_links`
Zuordnung Angebot ↔ Kategorie.

### `organization_offer_promotions`
Rabatte, Aktionen, zeitlich begrenzte Sonderangebote.

### `organization_offer_location_prices`
Standortabhängige Preise.

### `organization_offer_bundles`
Pakete/Bundles.

### `organization_offer_bundle_items`
Enthaltene Angebote/Varianten.

### `organization_offer_favorites`
Private Merkliste je Bürger.

### `organization_gallery_items`
Öffentliche Organisationsgalerie.

### `organization_faq_entries`
FAQ-Einträge.

### `organization_reviews`
Bewertungen der Organisation.

### `organization_review_replies`
Offizielle Organisationsantworten auf Bewertungen.

### `organization_favorites`
Private Organisationsfavoriten.

## E. Kundenanfragen und Reservierungen

### `customer_request_types`
Organisationsdefinierte Anfrageart.

### `customer_request_fields`
Dynamische Formularfragen je Anfrageart.

### `customer_requests`
Kundenanfrage als fachlicher Vorgang.

### `customer_request_answers`
Antworten auf dynamische Felder.

### `customer_request_assignments`
Mehrere zuständige Organisationsmitglieder.

### `customer_request_comments`
Kommentare/Kommunikation innerhalb der Anfrage.

### `reservation_types`
Reservierungsart je Organisation.

### `reservation_form_fields`
Zusatzfragen je Reservierungsart.

### `reservation_slots`
Manuell angelegte Terminfenster.

### `reservations`
Reservierung mit Bürger, Status, Personenanzahl, Zeit, Standort.

### `reservation_answers`
Antworten auf Reservierungsfragen.

### `reservation_waitlist`
Warteliste.

### `reservation_waitlist_priority_history`
Pflichtgrund und Historie manueller Prioritätsänderungen.

### `reservation_notes`
Reservierungsnotizen nach festgelegter Sichtbarkeit.

### `reservation_occurrences`
Einzeltermine wiederkehrender Reservierungen.

### `reservation_time_segments`
Mehrere Zeitabschnitte einer Reservierung.

### `reservation_change_requests`
Umbuchung durch Bürger/Organisation inkl. erneuter Zustimmung.

## F. Organisationsaufgaben

### `organization_task_statuses`
Grundstatus plus organisationsdefinierte Status.

### `organization_tasks`
Aufgabe.

### `organization_task_person_assignments`
Zuweisung an einzelne Mitglieder.

### `organization_task_role_assignments`
Zuweisung an Rollen.

### `organization_task_visibility_roles`
Sichtbarkeit für Rollen.

### `organization_task_visibility_people`
Sichtbarkeit für Personen.

### `organization_task_comments`
Kommentare/@-Erwähnungen.

### `organization_task_checklist_items`
Eine Checkliste je Aufgabe, beliebig viele Punkte.

### `organization_task_confirmations`
Erledigungsbestätigungen von Pflichtaufgaben.

### `organization_task_templates`
Aufgabenvorlagen.

### `organization_task_links`
Typisierte Referenzen auf erlaubte andere Nexus-Inhalte.

### `organization_task_history`
Änderungsverlauf.

### `organization_task_recurring_rules`
Täglich/wöchentlich/monatlich.

## G. Stellenangebote und Bewerbungen

### `job_postings`
Öffentliche oder interne Stellenangebote.

### `job_posting_questions`
Dynamische Bewerbungsfragen.

### `job_applications`
Bewerbung.

### `job_application_answers`
Antworten.

### `job_application_links`
Externe Anlagenlinks.

### `job_application_assignments`
Mehrere interne Bearbeiter.

### `job_application_comments`
Interne Kommentare.

### `job_application_status_history`
Statuswechsel.

### `job_application_info_requests`
Nachforderung weiterer Informationen.

### `job_application_interviews`
Gesprächsstufen/Termine.

### `job_application_practical_tests`
Probeaufgaben/praktische Tests.

### `job_application_recommendations`
Empfehlungen bestehender Mitglieder.

### `job_application_transfers`
Übertragung auf andere Stelle innerhalb derselben Organisation mit Zustimmung.

## H. Kalender

### `calendar_events`
Zentrale Terminentität für persönliche und referenzierte Termine.

Kernfelder:
- Besitzer/Ersteller
- Kalenderart
- Titel/Beschreibung
- Start/Ende
- ganztägig
- Ort/Map-Referenz
- Quelle/Quell-ID

### `calendar_event_attendees`
Einladungen und Zusage-/Absagestatus.

### `calendar_event_reminders`
Erinnerungen.

### `calendar_recurring_rules`
Serienregeln.

### `calendar_event_exceptions`
Ausnahmen einzelner Serientermine.

### `calendar_shares`
Kalenderfreigaben zwischen Bürgern.

### `shared_private_calendars`
Gemeinsame private Kalender.

### `shared_private_calendar_members`
Mitglieder dieser Kalender.

### `calendar_categories`
Persönliche Kategorien/Farben.

## I. Events und City Hub

### `events`
Event-Kern.

### `event_series`
Wiederkehrende Events.

### `event_occurrences`
Einzeltermine.

### `event_organizers`
Mehrere Veranstalterorganisationen + Bestätigung.

### `event_team_members`
Internes Event-Team.

### `event_locations`
Mehrere Orte pro Event.

### `event_attendance`
Teilnehmen/Vielleicht/Absagen.

### `event_waitlist`
Warteliste.

### `event_guest_list`
Gästeliste.

### `event_access_rules`
Zugang nach Organisation/Rolle und weitere Hinweise.

### `event_ticket_codes`
Kostenlose Platz-/Ticketcodes.

### `event_program_items`
Programmablauf.

### `event_helper_slots`
Helferschichten ohne Dienstplancharakter.

### `event_sponsors`
Partner/Sponsoren.

### `event_feedback`
Teilnehmerfeedback.

### `city_hub_posts`
News/Pressemitteilungen/FAQ/Changelog als typisierte Beiträge.

### `city_hub_categories`
Kategorien.

### `city_hub_post_categories`
N:M-Verknüpfung.

### `city_hub_comments`
Öffentliche Kommentare.

### `city_hub_reactions`
Emoji-Reaktionen.

### `city_warnings`
Stadt-/Regionalwarnungen und Banner.

### `city_hub_post_versions`
Bearbeitungsverlauf.

## J. Memories

### `memory_albums`
Persönlich, Organisation oder Event.

### `memory_items`
Bildlink + Caption + Alttext + Map-Position.

### `memory_person_tags`
Personenmarkierung inkl. Bestätigungsstatus.

### `memory_comments`
Kommentare.

### `memory_reactions`
Emoji-Reaktionen.

### `memory_reports`
Meldungen können alternativ über das zentrale Moderationssystem referenziert werden.

## K. Games

### `games`
Spielkatalog.

### `game_sessions`
Einzel-/Mehrspieler-Session.

### `game_session_players`
Teilnehmer.

### `game_scores`
Score/Highscore.

### `game_achievements`
Achievement-Katalog.

### `game_user_achievements`
Erreichte Achievements.

### `game_challenges`
Tägliche/wochentliche Herausforderungen.

### `game_challenge_progress`
Fortschritt.

### `game_events`
Zeitlich begrenzte In-Nexus-Game-Events.

### `game_user_stats`
Aggregierte Spielstatistiken.

### `game_invites`
Match-Einladungen.

## L. Persönliche Mail

### `personal_mail_threads`
Thread.

### `personal_mail_messages`
Einzelne Nachricht.

### `personal_mail_recipients`
To/Cc/Bcc und Lesestatus.

### `personal_mail_labels`
Persönliche Labels/Kategorien.

### `personal_mail_label_links`
Mail/Thread ↔ Label.

### `personal_mail_filters`
Persönliche Filterregeln.

### `personal_mail_user_state`
Archiv, Papierkorb, Wichtig, Priorität je Benutzeransicht.

### `personal_mail_held_deliveries`
Während Blockierung zurückgehaltene Nachrichten, falls die technische Umsetzung diese Logik weiterhin so abbildet.

## M. Organisations-Mail

### `organization_mail_addresses`
Mehrere Organisationsadressen.

### `organization_mailboxes`
Rollenbezogene Postfächer.

### `organization_mailbox_roles`
Welche Rollen sehen welches Postfach.

### `organization_mail_address_routes`
Adresse → Postfach.

### `organization_mail_threads`
Thread.

### `organization_mail_messages`
Nachrichten.

### `organization_mail_assignments`
Zuständige Mitarbeiter.

### `organization_mail_notes`
Interne Notizen/@-Erwähnungen.

### `organization_mail_labels`
Gemeinsame Labels/Ordner.

### `organization_mail_drafts`
Gemeinsame Entwürfe, soweit im bestehenden Org-Mail-Konzept vorgesehen.

## N. Dokumente und Wissensdatenbank

### `organization_document_folders`
Ordnerstruktur.

### `organization_documents`
Dokument.

### `organization_document_versions`
Versionen.

### `organization_document_role_access`
Rollenfreigaben.

### `organization_document_read_confirmations`
Pflicht-Lesebestätigung.

### `organization_document_comments`
Kommentare.

### `organization_document_templates`
Vorlagen.

### `knowledge_categories`
Wissensdatenbank-Kategorien je Organisation/Fachmodul.

### `knowledge_articles`
Artikel.

### `knowledge_article_versions`
Versionen.

### `knowledge_article_tags`
Schlagworte.

## O. Benachrichtigungen

### `notifications`
Konkrete Empfängerbenachrichtigung.

### `notification_preferences`
Persönliche zulässige Einstellungen.

### `notification_quiet_hours`
Nicht-stören-Zeiten.

### `organization_notification_rules`
Organisationsdefinierte Regeln, soweit fachlich erlaubt.

### `system_messages`
Gezielte offizielle System-/Stadtmeldungen.

### `system_message_recipients`
Empfänger, Lesebestätigung und Rückrufstatus.

## P. LS Map

### `map_markers_public`
Öffentliche Marker.

### `map_marker_approval_history`
Freigabe/Ablehnung öffentlicher Organisationsmarker.

### `map_marker_reports`
Falsche/veraltete Marker.

### `map_markers_personal`
Persönliche Marker.

### `map_personal_lists`
Persönliche Kartenlisten.

### `map_personal_list_items`
Marker in Listen.

### `map_saved_views`
Gespeicherte Kartenausschnitte/Layerzustände.

### `map_internal_layers`
Interne Organisationslayer.

### `map_internal_markers`
Interne Marker.

### `map_internal_marker_role_access`
Rollenfreigaben.

### `map_internal_marker_person_access`
Personenfreigaben.

### `map_cross_org_shares`
Organisationsübergreifende Freigabe.

### `map_regions`
Kartenbereiche wie Los Santos/Cayo Perico/weitere Bereiche.

## Q. Medical

### `medical_records`
Genau eine zentrale Akte pro Patient.

### `medical_treatments`
Behandlung/Einsatz mit Behandlungsnummer.

### `medical_treatment_staff`
Verantwortlicher + weitere Behandler.

### `medical_treatment_versions`
Korrekturen/Versionen.

### `medical_diagnoses`
Patientenbezogene Diagnosen.

### `medical_diagnosis_catalog`
Interner Diagnosekatalog.

### `medical_allergies`
Allergien + Schweregrad.

### `medical_medications`
Medikation + Dosierungsfreitext.

### `medical_emergency_notes`
Notfallhinweise.

### `medical_flags`
Interne Flags/Sperrvermerke.

### `medical_procedures`
OP-/Eingriffsberichte.

### `medical_lab_reports`
Labor-/Befunde.

### `medical_prevention_entries`
Impf-/Vorsorgeeinträge.

### `medical_followups`
Nachkontrollen.

### `medical_consents`
Dokumentierte Einwilligungen.

### `medical_prescriptions`
Rezepte.

### `medical_certificates`
Bescheinigungen/Krankschreibungen.

### `medical_information_releases`
Gezielte Freigabe an andere Stelle.

### `medical_report_requests`
PD-/Justice-Anfragen.

### `medical_publication_flags`
Welche Akteninhalte für den betroffenen Bürger sichtbar sind.

### `medical_training_cases`
Anonymisierte Testfälle/Testpatienten.

### `medical_training_plans`, `medical_training_tests`, `medical_training_attempts`
Ausbildungssystem.

### `medical_absences`
Urlaub/Abwesenheit ohne Dienstplan.

**Keine automatische physische Löschung medizinischer Akteninhalte.**

## R. Police

### `police_cases`
Fall.

### `police_case_versions`
Versions-/Änderungshistorie ausgewählter Inhalte.

### `police_case_people`
Beteiligte und Rollen.

### `police_case_relationships`
Fall ↔ Fall.

### `police_case_person_relationships`
Beziehungen zwischen Personen im Fall.

### `police_case_vehicle_relationships`
Fahrzeugbezüge.

### `police_case_investigators`
Federführender + weitere Ermittler.

### `police_case_comments`
Interne Kommentare.

### `police_case_timeline`
Ermittlungszeitleiste.

### `police_evidence`
Beweismittel.

### `police_evidence_groups`
Gruppierung.

### `police_evidence_custody`
Chain of Custody.

### `police_evidence_justice_shares`
Gezielte Freigabe an Justice.

### `police_storage_locations`
Digitale Asservatenorte.

### `police_interviews`
Vernehmungsprotokolle.

### `police_investigation_tasks`
Interne Ermittlungsaufträge.

### `police_observations`
Observationen.

### `police_bolos`
BOLO/Fahndung.

### `police_wanted_reasons`
Mehrere aktive Gesucht-Gründe.

### `police_vehicle_flags`
Fahrzeughinweise.

### `police_fines`
Bußgelder.

### `police_fine_appeals`
Einsprüche mit Justice-Bezug.

### `police_offense_catalog`
Tatbestandskatalog.

## S. Fire & Rescue

### `fire_incidents`
FD-Einsatzbericht.

### `fire_incident_sections`
Einsatzabschnitte.

### `fire_incident_members`
Eingesetzte Mitglieder.

### `fire_incident_units`
Fahrzeuge/Einheiten.

### `fire_incident_timeline`
Zeitleiste.

### `fire_incident_comments`
Kommentare.

### `fire_resource_requests`
Ressourcenanforderungen zwischen Einheiten.

### `fire_hazard_objects`
Objekt-/Gefahrendatenbank.

### `fire_hazard_materials`
Gefahrstoff-Datensätze.

### `fire_object_plans`
Objektpläne.

### `fire_object_plan_versions`
Versionen.

### `fire_hydrants`
Hydrantenstatus.

### `fire_equipment`
Geräte/Ausrüstung.

### `fire_equipment_maintenance`
Wartungshistorie.

### `fire_vehicle_checklists`
Fahrzeugchecks vor Einsatz.

### `fire_inspections`
Brandschutz-/Objektprüfung.

### `fire_inspection_certificates`
Bescheinigung nach bestandener Prüfung.

## T. Justice

### `justice_cases`
Verfahren.

### `justice_case_relationships`
Zusammenhängende Verfahren.

### `justice_case_people`
Beteiligte.

### `justice_assignments`
Richter/Staatsanwälte/weitere Zuständigkeiten.

### `justice_lawyer_changes`
Vertretungswechsel.

### `justice_recusals`
Befangenheitsvermerke.

### `justice_deadlines`
Interne Fristen.

### `justice_comments`
Interne bzw. gezielt veröffentlichte Kommentare.

### `justice_documents`
Verfahrensdokumente.

### `justice_document_versions`
Versionen.

### `justice_document_submissions`
Bürger-Einreichungen vor Freigabe.

### `justice_evidence_requests`
Beweisanträge.

### `justice_summonses`
Zeugenladungen/Bürger-Vorladungen.

### `justice_order_types`
Befehlsarten.

### `justice_orders`
Genehmigte/abgelehnte/widerrufene Befehle.

### `justice_order_requests`
PD-Anträge.

### `justice_hearings`
Verhandlungstermine.

### `justice_hearing_minutes`
Protokolle.

### `justice_decision_drafts`
Interne Beschlussentwürfe.

### `justice_judgments`
Urteile/Entscheidungen.

### `justice_judgment_corrections`
Korrekturverfahren.

### `justice_enforcement_status`
Vollstreckungsstatus.

### `justice_appeals`
Berufung/Einspruch.

### `justice_precedent_articles`
Interne Präzedenz-Wissenssammlung.

**Verfahren und relevante Verfahrensakten dauerhaft.**

## U. Stadtverwaltung

### `city_citizen_notes`
Interne Bürgernotizen.

### `city_request_categories`
Antragskategorien.

### `city_request_fields`
Dynamische Formularfragen.

### `city_requests`
Bürgerantrag.

### `city_request_answers`
Antworten.

### `city_request_assignments`
Bearbeiter.

### `city_request_comments`
Interne Kommentare.

### `city_appointment_queue`
Bürgertermine/Warteschlange.

### `city_document_templates`
Vorlagen offizieller Dokumente.

### `city_documents`
Ausgestellte Dokumente.

### `city_license_types`
Lizenz-/Genehmigungsarten.

### `city_licenses`
Bürger-/Organisationslizenzen.

### `city_company_registry`
Firmenregisterdaten.

## V. Gemeinsame Vorfälle

### `shared_incidents`
Gemeinsamer PD/Medical/FD-Vorfall.

### `shared_incident_factions`
Beteiligte Fraktionen + Bestätigung.

### `shared_incident_people`
Beteiligte Bürger.

### `shared_incident_notes`
Gemeinsame Notizen.

### `shared_incident_timeline`
System- und manuelle Timeline.

### `shared_incident_locations`
Mehrere Orte/Map-Positionen.

### `shared_incident_shares`
Selektive Freigabe einzelner Fraktionsinhalte.

### `shared_incident_merges`
Merge-Referenzen alter Vorgangsnummern.

## W. Moderation

### `moderation_reports`
Zentrale Meldungsübersicht.

Referenzen auf:
- Profile
- Memories
- City-Hub-Kommentare
- Mailthreads
- Games
- weitere meldbare Inhalte

### `moderation_actions`
Getroffene Maßnahme.

### `moderation_warnings`
Dauerhaft nachvollziehbare Verwarnungen.

## X. Technische Querschnittstabellen

### `number_sequences`
Zentrale Nummernkreisdefinition.

### `retention_jobs`
Geplante Lösch-/Bereinigungsaufträge, falls nicht ausschließlich aus `purge_after` gelesen wird.

### `error_events`
Technische Fehler-IDs und Diagnosemetadaten.

### `integration_outbox`
Erst später für Integration/Webhooks; in V1 kann die Tabelle entfallen.

### `integration_failures`
Erst später für fehlgeschlagene Syncs.

## Reihenfolge der späteren Schemaumsetzung

1. Identität/Profile
2. Organisationsrollen/Rechte
3. systemweite Querschnittsfunktionen
4. Benachrichtigungen
5. Mail
6. Kalender
7. Business/Kundenservice
8. Jobs
9. Events/City Hub
10. LS Map
11. Dokumente/Wissen
12. Memories/Games
13. Stadtverwaltung
14. Medical
15. Police
16. Fire & Rescue
17. Justice
18. Shared Incidents
19. Moderation
20. spätere Integration

Diese Reihenfolge ist noch keine Entwicklungsreihenfolge des Frontends, sondern die Abhängigkeitsreihenfolge des Datenmodells.
