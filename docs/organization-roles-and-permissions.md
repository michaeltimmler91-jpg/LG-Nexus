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

## Feste Leitungs-/Owner-Rolle

Jede Organisation besitzt eine **feste Leitungs-/Owner-Rolle**.

Diese Rolle ist systemgeschützt und kann von der Organisation nicht gelöscht werden. Sie besitzt immer sämtliche für die jeweilige Organisation verfügbaren Organisationsrechte und dient als oberste Verwaltungsrolle.

Die Rechte dieser Owner-Rolle können nicht so verändert werden, dass ihr notwendige Verwaltungsrechte entzogen werden. Die Owner-Rolle selbst bleibt damit immer als verwaltbare Systemrolle erhalten.

Die Owner-Rolle darf **mehreren Mitgliedern gleichzeitig** zugewiesen werden. Eine Organisation kann damit beispielsweise mehrere gleichberechtigte Geschäftsführer, Chiefs oder Leitungsmitglieder besitzen. Alle Mitglieder mit dieser Rolle erhalten dasselbe vollständige Owner-Rechtepaket.

Die Regel „genau eine Rolle pro Mitglied“ bleibt dabei bestehen: Ein Owner besitzt innerhalb dieser Organisation die Owner-Rolle als seine eine zugewiesene Rolle. Mehrere Personen dürfen jedoch dieselbe Owner-Rolle verwenden.

Ein Owner darf **keinem anderen Owner** die Owner-Rolle entziehen, ihn auf eine normale Rolle zurückstufen oder ihn über die normale Organisationsverwaltung aus der Owner-Stellung entfernen. Owner sind untereinander in Bezug auf die Owner-Rolle gleichgestellt und können sich gegenseitig nicht entmachten.

Ein Owner darf seine **eigene Owner-Rolle freiwillig abgeben**. Dafür ist keine Zustimmung eines anderen Owners oder der Stadtverwaltung erforderlich. Die freiwillige Abgabe betrifft ausschließlich die eigene Rolle und darf nicht zur Veränderung der Owner-Rolle anderer Mitglieder genutzt werden.

Es gibt **keine Schutzregel für den letzten verbleibenden Owner**. Auch der letzte Owner darf seine eigene Owner-Rolle freiwillig abgeben. Dadurch kann eine Organisation vorübergehend keine Person mit zugewiesener Owner-Rolle besitzen.

Hat eine Organisation keinen zugewiesenen Owner mehr, darf eine dafür berechtigte Person der **Stadtverwaltung** im Notfall einem Mitglied dieser Organisation die geschützte Owner-Rolle zuweisen. Dadurch kann die Organisation wieder administriert werden, ohne dass die Stadtverwaltung dauerhaft Zugriff auf interne Organisationsdaten erhält.

Dieser Notfallzugriff ist **ausschließlich dann erlaubt, wenn aktuell kein einziges aktives Mitglied der Organisation die Owner-Rolle besitzt**. Sobald mindestens ein aktiver Owner vorhanden ist, darf die Stadtverwaltung keine weitere Owner-Zuweisung vornehmen und keine bestehende Owner-Struktur überschreiben.

Für die Notfall-Zuweisung eines neuen Owners muss **kein zusätzlicher Grund angegeben werden**. Die Berechtigung der ausführenden Person und die Voraussetzung von 0 aktiven Ownern reichen für die Durchführung aus.

Eine dafür berechtigte Person der **Stadtverwaltung darf einem bestehenden Owner die Owner-Rolle auch wieder entziehen**. Die Einschränkung auf 0 aktive Owner gilt nur für das Einsetzen eines neuen Owners, nicht für den Entzug einer bestehenden Owner-Rolle.

**Sowohl das Einsetzen als auch das Entziehen einer Owner-Rolle durch die Stadtverwaltung wird dauerhaft protokolliert.** Das Protokoll enthält mindestens:

- die betroffene Organisation
- die Art des Eingriffs (`Owner eingesetzt` oder `Owner entzogen`)
- die betroffene Person
- die Person der Stadtverwaltung, die den Eingriff durchgeführt hat
- Datum und Uhrzeit des Eingriffs

Für diese Eingriffe muss kein zusätzlicher Freitext-Grund angegeben werden. Die Protokollierung dient der Nachvollziehbarkeit und darf von normalen Organisationsmitgliedern nicht manipuliert oder gelöscht werden.

Dieser Notfallzugriff dient ausschließlich der Wiederherstellung beziehungsweise administrativen Korrektur der Organisationsleitung. Die Stadtverwaltung wird dadurch nicht selbst Mitglied oder Owner der betroffenen Organisation.

Die Bezeichnung der Owner-Rolle kann im Frontend je nach Organisation passend dargestellt werden, zum Beispiel `Geschäftsführer`, `Chief`, `Leitung` oder `Direktor`. Technisch bleibt sie jedoch als geschützte Owner-Rolle erkennbar und darf nicht mit einer normalen frei konfigurierbaren Rolle verwechselt werden.

Normale Rollen dürfen frei erstellt, umbenannt, bearbeitet und – sofern sie nicht mehr benötigt werden – gelöscht werden. Die systemgeschützte Owner-Rolle ist davon ausgenommen.

## Sicherheitsregel

Berechtigungen müssen serverseitig beziehungsweise über Supabase/RLS geprüft werden. Eine reine Ausblendung von Schaltflächen im Frontend reicht nicht aus.

Eine Organisation erhält durch ihre eigenen Rollen niemals automatisch Zugriff auf Daten anderer Organisationen oder geschützte Bereiche anderer Module.

## Bestehende Mitgliederdaten

`organization_members.role_title` kann vorerst weiterhin den sichtbaren Rollentitel speichern. Für das vollständige Rollen- und Berechtigungssystem wird später eine eigene Rollenstruktur ergänzt, damit Berechtigungen zentral an einer Rolle statt einzeln an jedem Mitarbeiter gepflegt werden können.

Bei der späteren technischen Umsetzung erhält jede Organisationsmitgliedschaft genau eine Rollenreferenz. Ein separates Many-to-Many-System zwischen Mitgliedern und Rollen ist damit nicht notwendig.
