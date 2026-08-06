# LG Nexus – Dashboard & System

Dieses Dokument beschreibt die aktuell festgelegten Regeln für das persönliche Dashboard und grundlegende Nexus-Systemfunktionen.

## Persönliches Dashboard

Das persönliche Dashboard unterstützt frei auswählbare Widgets.

Benutzer dürfen:

- Widgets per Drag & Drop anordnen
- einzelne Widgets vollständig ein- oder ausblenden

Organisationen dürfen eigene interne Dashboard-Widgets für ihre Mitglieder bereitstellen.

Rollen können automatisch passende Schnellzugriffe auf dem Dashboard erhalten.

## Globale Suche

LG Nexus besitzt eine globale Suche.

Die globale Suche durchsucht derzeit **nur öffentliche Bereiche**. Berechtigte interne Inhalte wie Dokumente, Fälle oder Vorfälle werden nicht über die globale Suche durchsucht.

## Zuletzt geöffnet

Eine persönliche Liste zuletzt geöffneter Inhalte ist derzeit nicht vorgesehen.

## Systemweite Favoriten

Benutzer können systemweite persönliche Favoriten für geeignete Nexus-Inhalte verwenden, zum Beispiel:

- Seiten
- Dokumente
- Fälle
- Marker

Die jeweilige Sichtbarkeit und Berechtigung des Inhalts bleibt dabei maßgeblich; ein Favorit darf keinen Zugriff auf später nicht mehr berechtigte Inhalte erhalten.

## Tastaturkürzel

Tastaturkürzel für häufige Nexus-Aktionen sind derzeit nicht vorgesehen.

## Sitzungen und Geräte

Nexus-Sitzungen laufen nach längerer Inaktivität automatisch ab.

Zusätzlich gibt es die Option `angemeldet bleiben`.

Ein Benutzer kann:

- seine aktiven Nexus-Sitzungen beziehungsweise Geräte einsehen
- andere aktive Sitzungen aus der Ferne abmelden

Die genaue Inaktivitätsdauer und Sicherheitsregeln für `angemeldet bleiben` werden bei der technischen Umsetzung festgelegt.

## Visuelles Grunddesign

Benutzer können zwischen **hellem und dunklem Grunddesign** wählen.

Persönliche Farbanpassungen beziehungsweise Akzentfarben bleiben zusätzlich möglich.

Damit ersetzt diese Entscheidung die frühere offene Frage, ob Nexus zwingend immer dunkel bleiben soll.

## Technische Zielstruktur

Voraussichtlich benötigt werden:

- persönliches Widget-Layout pro Benutzer
- Drag-&-Drop-Reihenfolge
- sichtbare/verborgene Widgets
- organisationsinterne Widgets
- rollenbasierte Schnellzugriffe
- öffentliche globale Suche
- systemweite persönliche Favoriten
- Sitzungsverwaltung mit Inaktivitätsablauf
- `angemeldet bleiben`
- Geräte-/Sitzungsübersicht
- Remote-Abmeldung
- Hell-/Dunkelmodus plus persönliche Akzentfarben

Interne Daten dürfen durch Widgets, Favoriten oder Suchindizes niemals Berechtigungsgrenzen umgehen.