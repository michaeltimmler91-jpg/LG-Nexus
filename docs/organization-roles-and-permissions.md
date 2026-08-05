# LG Nexus – Organisationsrollen und Berechtigungen

## Grundprinzip

Jede Firma oder Organisation kann ihre Rollenbezeichnungen selbst frei anlegen. Beispiele sind `Geschäftsführer`, `Werkstattleiter`, `Chief of Medicine`, `Ausbilder`, `Azubi` oder beliebige andere IC-Rollen.

Eine Rolle ist nicht nur ein sichtbarer Titel. An jede Rolle können konkrete Rechte und Berechtigungen innerhalb der jeweiligen Organisation gebunden werden.

Beispiele für mögliche Rechte:

- Organisationsprofil bearbeiten
- Öffnungsstatus ändern
- Mitglieder verwalten
- Rollen verwalten
- Rollen zuweisen
- Mitgliederliste sichtbar/versteckt schalten
- interne Dokumente ansehen
- interne Dokumente bearbeiten
- Akten oder organisationsspezifische Daten bearbeiten
- Vorlagen verwalten
- Ausbildungsinhalte verwalten

Welche Berechtigungen tatsächlich angeboten werden, hängt vom jeweiligen Organisationsmodul ab. Medical, Police, Fire & Rescue, Unternehmen und andere Bereiche dürfen unterschiedliche Berechtigungsschlüssel besitzen.

## Rollen pro Mitglied

Ein Mitglied besitzt innerhalb derselben Organisation **genau eine Rolle gleichzeitig**.

Die zugewiesene Rolle bestimmt sowohl den sichtbaren Rollentitel als auch das zugehörige Rechtepaket. Soll sich die Funktion eines Mitarbeiters ändern, wird seine bisherige Rolle durch eine andere Rolle ersetzt.

Mehrere parallele Rollen innerhalb derselben Organisation sind nicht vorgesehen. Dadurch bleibt die Rechteauswertung eindeutig und die Organisationsstruktur übersichtlich.

Ein Bürger kann weiterhin Mitglied mehrerer verschiedener Organisationen sein. In jeder dieser Organisationen besitzt er jeweils eine eigene, genau einmal zugewiesene Rolle.

## Sicherheitsregel

Berechtigungen müssen serverseitig beziehungsweise über Supabase/RLS geprüft werden. Eine reine Ausblendung von Schaltflächen im Frontend reicht nicht aus.

Eine Organisation erhält durch ihre eigenen Rollen niemals automatisch Zugriff auf Daten anderer Organisationen oder geschützte Bereiche anderer Module.

## Bestehende Mitgliederdaten

`organization_members.role_title` kann vorerst weiterhin den sichtbaren Rollentitel speichern. Für das vollständige Rollen- und Berechtigungssystem wird später eine eigene Rollenstruktur ergänzt, damit Berechtigungen zentral an einer Rolle statt einzeln an jedem Mitarbeiter gepflegt werden können.

Bei der späteren technischen Umsetzung erhält jede Organisationsmitgliedschaft genau eine Rollenreferenz. Ein separates Many-to-Many-System zwischen Mitgliedern und Rollen ist damit nicht notwendig.
