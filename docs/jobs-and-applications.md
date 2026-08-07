# LG Nexus – Stellenangebote und Bewerbungen

Dieses Dokument beschreibt die festgelegten Regeln für öffentliche Stellenangebote und den internen Bewerbungsbereich von Organisationen.

## Stellenangebote

Organisationen dürfen mehrere öffentliche Stellenangebote gleichzeitig veröffentlichen.

Verwaltung:
- Stellenangebote werden über das eigene Rollenrecht `Stellenangebote verwalten` erstellt und gepflegt.
- Stellenangebote können manuell pausiert und später wieder aktiviert werden.
- Ein Ablaufdatum ist nicht vorgesehen.
- Ein Stellenangebot kann manuell geschlossen werden, ohne es zu löschen.
- Geschlossene Stellenangebote verschwinden aus der öffentlichen Suche.
- Ein Stellenangebot kann eine Anzahl verfügbarer Stellen/Plätze besitzen.
- Je Angebot kann eingestellt werden, dass es automatisch geschlossen wird, sobald alle vorgesehenen Plätze besetzt sind.
- Die Zahl eingegangener Bewerbungen wird öffentlich nicht angezeigt.
- Öffentliche Suche und Filter nach Organisation beziehungsweise Branche sind vorgesehen.
- Eine Volltextsuche über Stellenangebote ist vorgesehen.

Pflicht-/Profilfelder eines Stellenangebots:
- Titel
- ausführliche Beschreibung
- gewünschte Rolle beziehungsweise Position
- optionaler Ansprechpartner
- optional auswählbarer Organisationsstandort

### Änderungen nach ersten Bewerbungen

Sobald Bewerbungen eingegangen sind, dürfen nur noch **nicht wesentliche Felder** des Stellenangebots bearbeitet werden.

Bei wesentlichen Änderungen erhalten bereits vorhandene Bewerber automatisch eine Nexus-Benachrichtigung.

## Bewerben über Nexus

Aktive Bürger dürfen sich direkt über Nexus auf ein öffentliches Stellenangebot bewerben.

Die Organisation kann pro Stellenangebot eigene Bewerbungsfragen definieren.

Unterstützte Fragetypen:
- Freitext
- Auswahl
- Ja/Nein

Einzelne Fragen können als Pflichtfeld markiert werden.

Automatisch übermittelte Identität:
- Name
- Nexus-ID

Kontaktinformationen:
- Telefonnummer wird nur übermittelt, wenn die persönliche Sichtbarkeitseinstellung des Bewerbers dies gegenüber der Organisation beziehungsweise dem Empfänger erlaubt.
- Nexus-Mail wird ebenfalls nur übermittelt, wenn die persönliche Sichtbarkeitseinstellung dies erlaubt.
- Die Bewerbung umgeht diese Privatsphäre-Einstellungen nicht.

Mit ausdrücklicher Zustimmung des Bewerbers dürfen zusätzliche sichtbare Profildaten in die Bewerbung übernommen werden.

Ein zusätzlicher allgemeiner Bewerbungstext außerhalb der organisationsspezifischen Fragen ist nicht vorgesehen.

Bewerbungen dürfen externe Links als Anlagen enthalten. Pro Bewerbung sind maximal **5 externe Links** vorgesehen.

## Mehrfach- und erneute Bewerbungen

- Ein Bürger darf sich nicht mehrfach gleichzeitig auf dasselbe aktuell offene Stellenangebot bewerben.
- Ein Bürger darf sich gleichzeitig auf mehrere unterschiedliche Stellenangebote derselben Organisation bewerben.
- Nach einer Ablehnung darf sich der Bürger auf dasselbe noch offene Stellenangebot erneut bewerben, jedoch erst nach einer **Wartezeit von 14 Tagen**.
- Nexus soll vor offensichtlich doppelten Bewerbungen desselben Bürgers warnen.

## Bearbeitung durch den Bewerber

Nach dem Absenden darf der Bewerber seine Bewerbung bearbeiten, solange sie noch nicht durch die Organisation bearbeitet wurde.

Der Bewerber darf eine Bewerbung zurückziehen.

Der Bewerber sieht den aktuellen Bewerbungsstatus während des laufenden Verfahrens.

Nach Abschluss kann der Bewerber die abgeschlossene Bewerbung nicht weiter einsehen.

## Bewerbungsstatus

Vorgesehene Grundstatus:
- `Neu`
- `In Prüfung`
- `Gespräch`
- `Angenommen`
- `Abgelehnt`

Organisationen dürfen zusätzliche eigene Status anlegen.

Statusänderungen werden nicht zusätzlich als Audit-Eintrag protokolliert.

Der Bewerber erhält bei jeder Statusänderung eine Nexus-Benachrichtigung.

### Ablehnung

- Ein Ablehnungsgrund ist optional.
- Der Bewerber sieht den internen Ablehnungsgrund nicht.

### Annahme

Bei angenommener Bewerbung erscheint intern die Aktion `Als Mitglied aufnehmen`.

Wird die Person darüber aufgenommen, gelten die normalen Organisationsregeln:
- Aufnahme erfolgt als normale Mitgliedsaufnahme.
- Die aktuelle Standardrolle der Organisation wird zugewiesen.
- Das Stellenangebot bestimmt nicht automatisch eine abweichende Rolle.

## Rückfragen

Nach Beginn der Bearbeitung darf die Organisation zusätzliche Informationen vom Bewerber anfordern.

Der Bewerber antwortet darauf direkt innerhalb der Bewerbung; ein Wechsel in eine normale Nexus-Mail ist nicht erforderlich.

## Vorstellungsgespräche

Aus einer Bewerbung kann direkt ein Vorstellungsgespräch als Nexus-Termin erstellt werden.

- Der Termin erscheint automatisch im Kalender des Bewerbers.
- Der Termin erscheint automatisch in den Kalendern der zuständigen Mitarbeiter.
- Der Bewerber darf einen Alternativtermin vorschlagen.
- Das Gesprächsergebnis kann strukturiert erfasst werden als `Geeignet`, `Nicht geeignet` oder `Zurückgestellt`.

Eine zusätzliche interne Punktzahl/Bewertung für Bewerbungen ist nicht vorgesehen.

Der Bewerber sieht interne Bearbeitungsinformationen beziehungsweise interne Bewertungen nicht.

Interne Bewerbungs-Tags/Markierungen sind derzeit ebenfalls nicht vorgesehen.

## Übertragung auf anderes Stellenangebot

Eine Bewerbung darf auf ein anderes Stellenangebot derselben Organisation übertragen werden, **wenn der Bewerber zustimmt**.

Der Bewerber erhält darüber automatisch eine Nexus-Benachrichtigung.

## Interner Bewerbungsbereich

Bewerbungen landen in einem eigenen internen Bewerbungsbereich der Organisation.

Rechte:
- `Bewerbungen ansehen` steuert, wer Bewerbungen lesen darf.
- `Bewerbungen bearbeiten` steuert, wer Bewerbungsstatus und Bearbeitung ändern darf.
- Owner besitzen diese Rechte aufgrund ihrer vollständigen Owner-Berechtigungen automatisch.

Bearbeitung:
- Eine Bewerbung kann intern Mitarbeitern zugewiesen werden.
- Mehrere Bearbeiter gleichzeitig sind möglich.
- Zugewiesene Bearbeiter erhalten eine Nexus-Benachrichtigung.
- Interne Kommentare zur Bewerbung sind möglich.
- Interne Kommentare sind für den Bewerber nicht sichtbar.
- Ein Favorisieren/Markieren von Bewerbungen ist nicht vorgesehen.
- Eine eigene Suche oder Filterfunktion im internen Bewerbungsbereich ist nicht vorgesehen.
- Es gibt auch keinen separaten Filter nach Stellenangebot.

## Aufbewahrung

- Abgelehnte Bewerbungen: **6 Monate**
- Angenommene Bewerbungen: **6 Monate**
- Zurückgezogene Bewerbungen: **sofort löschen**

Nach Ablauf der jeweiligen Aufbewahrungsfrist können die Daten automatisch gelöscht werden.

## Stadtverwaltung

Dafür berechtigte Personen der Stadtverwaltung dürfen Bewerbungen normaler Organisationen:
- ansehen
- bearbeiten

Dies ist ein verwaltungsseitiges Aufsichtsrecht. Für fachlich besonders geschützte Organisationen oder Fraktionsmodule können später strengere Sonderregeln festgelegt werden.

## Bezug zu Bewertungen

Für Organisationsbewertungen gelten zusätzlich folgende Regeln:
- Mehrere aktive Bewertungen desselben Bürgers sind zwar zulässig.
- Für die Durchschnittsbewertung zählt pro Bürger jedoch nur dessen **neueste aktive Bewertung**.
- Owner dürfen ihre eigene Organisation nicht bewerten.
- Aktuelle Mitarbeiter dürfen ihre eigene Organisation ebenfalls nicht bewerten.

## Technische Zielstruktur

Voraussichtlich benötigt werden unter anderem:
- `organization_job_postings`
- verfügbare Plätze und Auto-Schließen
- Status `pausiert/geschlossen`
- Regeln für wesentliche/nicht wesentliche Änderungen nach Bewerbungseingang
- `organization_job_application_questions`
- `organization_job_applications`
- `organization_job_application_answers`
- externe Link-Anlagen
- Wiederbewerbungs-Sperrfrist von 14 Tagen
- `organization_job_application_assignments`
- `organization_job_application_comments`
- Rückfragen/Antworten innerhalb der Bewerbung
- Vorstellungsgespräche mit Kalenderverknüpfung und strukturiertem Ergebnis
- Bewerbungsübertragung mit Zustimmung
- konfigurierbare zusätzliche Bewerbungsstatus pro Organisation
- RLS/RPC für Sichtbarkeit, Bearbeitung und Aufnahme als Mitglied
- automatische Aufbewahrungs-/Löschlogik

Bewerbungs- und Kontaktdaten müssen serverseitig gemäß Rollenrechten und persönlichen Sichtbarkeitseinstellungen geschützt werden.