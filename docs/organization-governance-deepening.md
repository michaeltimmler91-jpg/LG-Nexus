# LG Nexus – Organisations-Governance und Organisations-Mail – Vertiefung

Dieses Dokument ergänzt `organization-roles-and-permissions.md` um die späteren Entscheidungen bis Frage 3410. Bei einem Widerspruch in den hier behandelten Punkten gilt diese neuere Festlegung.

## Rollenmodell bleibt bewusst einfach

Innerhalb einer Organisation besitzt ein Mitglied weiterhin genau eine normale Rolle beziehungsweise die geschützte Owner-Rolle.

Nicht zusätzlich vorgesehen sind:

- zeitlich befristete Rollen
- kommissarische Rollen
- rollenbezogene Genehmigungsstufen
- Vier-Augen-Freigaben für normale Organisationsaktionen
- standortbeschränkte Rollen
- Rollen mit zeitlich begrenzten Sonderrechten
- Rollen-Vorlagen zwischen Organisationen
- Import/Export von Rollenrechten
- automatische Rollenwechsel nach Ereignissen

## Stellvertretende Owner-Funktionen

Eine Organisation darf normalen Rollen weitreichende stellvertretende Leitungsrechte geben, **ohne** diese Personen zu Ownern zu machen.

Dafür wird kein zweiter Owner-Typ eingeführt. Stattdessen werden die benötigten normalen Rechte gezielt vergeben.

Die geschützte Owner-Rolle bleibt weiterhin die einzige Rolle mit automatisch vollständigen Organisationsrechten.

## Rollenlöschung und offene Zuweisungen

Eine Rolle darf nicht so gelöscht/deaktiviert werden, dass Aufgaben, Mailpostfächer, Termine oder andere Datensätze ungültig werden.

Offene Zuweisungen müssen erkannt und in einen sicheren Zustand gebracht beziehungsweise neu zugeordnet werden. Historische Autorenschaft bleibt erhalten.

## Organisations-Mail – mehrere Adressen

Eine Organisation kann **mehrere Nexus-Mailadressen** besitzen.

Beispiele können fachlich etwa unterschiedliche Kontaktzwecke darstellen. Diese Adressen erzeugen jedoch nicht jeweils ein völlig separates Mailsystem.

## Rollenbezogene Postfächer

Die eigentlichen internen Zielbereiche sind **rollenbezogene Organisations-Postfächer**.

Mehrere Organisations-Mailadressen können einem passenden Rollenpostfach zugeordnet werden.

Beispielprinzip:

- eine öffentliche Kontaktadresse → allgemeines Postfach
- eine Bewerbungsadresse → für entsprechend berechtigte Rollen
- eine Leitungsadresse → Leitungs-/Owner-nahe Rollen

Sichtbarkeit kann nach Rollen und einzelnen Personen begrenzt werden.

## Kein separates Alias-System

Neben den mehreren konfigurierten Organisationsadressen gibt es kein zusätzliches komplexes Alias-Verwaltungssystem.

## Interne Mailnotizen

Organisations-Mail unterstützt interne Notizen mit @-Erwähnungen.

- Notizen sind für externe Absender nicht sichtbar
- normale Mitglieder mit internem Mailzugriff dürfen sie nach der jeweiligen Postfachberechtigung verwenden
- kein eigener Versionsverlauf für jede Notizänderung
- keine unnötige Zusatzbenachrichtigung außer nach den normalen Zuweisungs-/Erwähnungsregeln

## Nicht vorgesehen im Organisations-Mail-System

- Mail-Warteschlangen pro Abteilung
- automatische Eskalation wegen langer Nichtbearbeitung
- automatische Zuweisung nach Anfrageart
- Thread-Zusammenführung
- Thread-Aufteilung
- unterschiedliche Aufbewahrungsregeln je Mailordner

## Sicherheitsregel

Eine Organisationsadresse oder Rollenpostfachzuordnung gewährt nur Zugriff, wenn das Mitglied die dafür notwendige aktuelle Organisationsberechtigung besitzt. Rollenverlust/Austritt stoppt den Zugriff sofort.
