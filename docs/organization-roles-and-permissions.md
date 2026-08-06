# LG Nexus – Organisationsrollen und Berechtigungen

## Grundprinzip

Jede Firma oder Organisation kann ihre Rollenbezeichnungen grundsätzlich selbst festlegen. Beispiele sind `Geschäftsführer`, `Werkstattleiter`, `Chief of Medicine`, `Ausbilder`, `Azubi` oder beliebige andere IC-Rollen.

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

## Standardrolle

Jede neu angelegte Organisation erhält automatisch eine normale Standardrolle **`Mitarbeiter`**.

Damit besitzt jede Organisation von Beginn an mindestens eine normale Rolle, auf die Mitglieder gesetzt werden können. Die geschützte Owner-Rolle bleibt davon getrennt.

Die Standardrolle darf durch einen Owner **umbenannt** werden. Ihre Funktion als normale Rolle bleibt dabei unverändert; sie ist technisch nicht dauerhaft an den sichtbaren Namen `Mitarbeiter` gebunden.

Die Organisation darf festlegen, **welche ihrer vorhandenen normalen Rollen aktuell als Standardrolle** für neue Mitglieder verwendet wird. Es muss zu jedem Zeitpunkt genau eine gültige normale Standardrolle festgelegt sein.

Soll die aktuell festgelegte Standardrolle gelöscht werden, muss **zuerst eine andere vorhandene normale Rolle als neue Standardrolle ausgewählt** werden. Eine automatische Auswahl durch das System erfolgt nicht.

Eine normale Rolle – einschließlich einer ehemaligen Standardrolle – darf nur gelöscht werden, wenn **kein Mitglied mehr dieser Rolle zugewiesen ist** und **mindestens eine andere normale Rolle** in der Organisation vorhanden ist. Eine Organisation muss damit immer mindestens eine normale Rolle behalten.

Neu aufgenommene Mitglieder erhalten **automatisch die aktuell festgelegte Standardrolle** der Organisation. Bei der Aufnahme muss daher nicht jedes Mal manuell eine Rolle ausgewählt werden.

## Rollenverwaltung

Das Recht **`Rollen verwalten`** erlaubt nicht automatisch das Erstellen neuer normaler Rollen und auch nicht das Umbenennen bestehender normaler Rollen. Diese besonders weitreichenden Strukturänderungen bleiben der geschützten Owner-Ebene vorbehalten.

Auch die **Berechtigungen/Rechte einer normalen Rolle dürfen ausschließlich von einem Owner geändert werden**. Das normale Recht `Rollen verwalten` reicht dafür nicht aus.

Eine normale Rolle darf **nicht gelöscht werden, solange noch mindestens ein Mitglied dieser Rolle zugewiesen ist**. Vor dem Löschen müssen sämtliche betroffenen Mitglieder auf andere vorhandene Rollen gesetzt werden.

Das Erstellen, Umbenennen und Löschen normaler Rollen wird dauerhaft protokolliert. Das Rollen-Audit enthält mindestens:

- die betroffene Organisation
- die Aktion (`Rolle erstellt`, `Rolle umbenannt` oder `Rolle gelöscht`)
- die betroffene Rolle beziehungsweise alten und neuen Rollennamen
- die ausführende Person
- Datum und Uhrzeit

Änderungen an den konkreten Berechtigungen einer normalen Rolle sowie reine Änderungen der Rollenreihenfolge werden dagegen **nicht zusätzlich protokolliert**.

## Rangstufen und Hierarchie

Normale Organisationsrollen besitzen zusätzlich eine **Rangstufe beziehungsweise Hierarchieposition**. Die Organisation legt damit selbst fest, welche Rollen über oder unter anderen Rollen stehen.

Die Reihenfolge der normalen Rollen darf in der Organisationsverwaltung **frei per Drag & Drop geändert** werden. Beim Verschieben einer Rolle wird ihre Hierarchieposition entsprechend neu berechnet. Die neue Reihenfolge gilt anschließend für alle hierarchieabhängigen Prüfungen, insbesondere für die Vergabe von Rollen.

Die Reihenfolge darf nur von Mitgliedern geändert werden, deren aktuelle Rolle ausdrücklich die Berechtigung **`Rollen verwalten`** besitzt. Ohne dieses Recht ist die Drag-&-Drop-Sortierung nur sichtbar, aber nicht veränderbar. Auch bei vorhandener Berechtigung bleibt die geschützte Owner-Rolle von der Sortierung ausgenommen.

Die geschützte Owner-Rolle kann dabei nicht verschoben werden und bleibt technisch immer oberhalb aller normalen Rollen.

Die Hierarchie beeinflusst insbesondere die Rollenverwaltung. Ein Mitglied kann eine Rolle nur dann an ein anderes Mitglied vergeben, wenn es das entsprechende Berechtigungsrecht besitzt **und die Zielrolle unterhalb der eigenen Rolle liegt**.

Eine gleichrangige oder höher eingestufte Rolle darf über die normale Rollenverwaltung nicht vergeben werden. Dadurch kann sich ein Mitglied nicht selbst oder andere Personen auf die eigene beziehungsweise eine höhere Hierarchiestufe hochstufen.

Beispiel:

1. Leitung
2. Werkstattleiter
3. Mitarbeiter
4. Azubi

Ein `Werkstattleiter` mit dem Recht `Rollen zuweisen` dürfte in diesem Beispiel `Mitarbeiter` oder `Azubi` vergeben, aber weder `Werkstattleiter` noch `Leitung`.

Die Rangstufe allein erteilt keine Verwaltungsrechte. Eine Rolle benötigt weiterhin ausdrücklich die passende Berechtigung, beispielsweise `Rollen zuweisen` oder `Mitglieder verwalten`. Hierarchie und Berechtigungen werden gemeinsam geprüft.

## Mitgliederverwaltung

Neue Mitglieder dürfen durch einen **Owner** oder durch ein Mitglied aufgenommen werden, dessen aktuelle Rolle ausdrücklich die Berechtigung **`Mitglieder verwalten`** besitzt.

Die Aufnahme erfolgt **sofort und ohne vorherige Bestätigung oder Einladung durch die aufzunehmende Person**. Nach erfolgreicher Aufnahme ist die Mitgliedschaft unmittelbar aktiv und die aktuell festgelegte Standardrolle wird zugewiesen.

Da neue Mitglieder automatisch die Standardrolle erhalten, darf ein Nicht-Owner mit `Mitglieder verwalten` eine Aufnahme nur durchführen, wenn die aktuelle Standardrolle **unterhalb seiner eigenen Hierarchiestufe** liegt. Ein Owner ist von dieser Einschränkung ausgenommen.

Das Recht **`Mitglieder verwalten`** erlaubt außerdem das Bearbeiten dafür vorgesehener interner Mitgliedsdaten, zum Beispiel interner Notizen oder eines organisationsinternen Status. Es erlaubt jedoch **nicht**, andere Mitglieder aus der Organisation zu entfernen.

Ein **Owner darf normale Mitglieder aus der Organisation entfernen**. Andere Owner sind davon ausdrücklich ausgenommen; für sie gelten die besonderen Owner-Schutzregeln weiter unten. Beim Entfernen eines normalen Mitglieds darf optional ein Freitext-Grund angegeben werden; ein Grund ist nicht verpflichtend.

Ein normales Mitglied darf die Organisation **selbstständig verlassen**. Die eigene Mitgliedschaft kann damit ohne Freigabe durch eine Führungsperson beendet werden.

Ehemalige Mitglieder dürfen zu einem späteren Zeitpunkt **erneut in dieselbe Organisation aufgenommen** werden. Für die erneute Aufnahme gelten dieselben Regeln wie für jede andere Aufnahme, einschließlich der automatischen Zuweisung der aktuellen Standardrolle.

Aufnahmen und das Ende einer Mitgliedschaft werden dauerhaft protokolliert. Das Mitgliedschafts-Audit enthält mindestens:

- die betroffene Organisation
- die betroffene Person
- die Aktion (`Mitglied aufgenommen`, `Mitglied selbst ausgetreten` oder `Mitglied entfernt`)
- die ausführende Person
- Datum und Uhrzeit
- bei einer Entfernung durch einen Owner optional den angegebenen Grund

Änderungen an der Rolle eines Mitglieds werden ebenfalls dauerhaft protokolliert. Das Rollenwechsel-Protokoll enthält mindestens:

- die betroffene Organisation
- die betroffene Person
- die vorherige Rolle
- die neue Rolle
- die ausführende Person
- Datum und Uhrzeit

## Benachrichtigungen bei Mitgliedsänderungen

Das betroffene Mitglied erhält innerhalb von LG Nexus eine Benachrichtigung bei folgenden Ereignissen:

- Aufnahme in eine Organisation
- Entfernung aus einer Organisation
- Rollenwechsel innerhalb einer Organisation
- Wechsel auf `inaktiv/beurlaubt`
- Rückkehr von `inaktiv/beurlaubt` auf aktiv

Eine Ernennung zum Owner gilt ebenfalls als Rollenwechsel und löst entsprechend eine Benachrichtigung aus.

## Inaktiv / beurlaubt

Mitglieder können innerhalb einer Organisation auf **`inaktiv` beziehungsweise `beurlaubt`** gesetzt werden, ohne ihre Mitgliedschaft zu verlieren oder aus der Organisation entfernt zu werden.

Dieser Status kann als organisationsinterner Mitgliedsstatus von einem Owner oder von einer Rolle mit der Berechtigung `Mitglieder verwalten` gesetzt beziehungsweise wieder aufgehoben werden.

Für `inaktiv/beurlaubt` wird **kein Zeitraum von/bis** gespeichert oder verlangt. Der Status bleibt bestehen, bis er manuell wieder aufgehoben wird.

Der Status wird in der normalen internen Mitgliederliste **nicht zusätzlich sichtbar markiert**.

Während ein Mitglied auf `inaktiv/beurlaubt` steht, bleibt seine Organisation und seine zugewiesene Rolle gespeichert, der **Zugriff auf interne Organisationsbereiche wird jedoch vollständig gesperrt**. Die mit der Rolle verbundenen internen Rechte können in diesem Zustand nicht genutzt werden.

Nach Rückkehr in den aktiven Status gilt wieder die zuvor zugewiesene Rolle mit ihren normalen Berechtigungen.

## Feste Leitungs-/Owner-Rolle

Jede Organisation besitzt eine **feste Leitungs-/Owner-Rolle**.

Diese Rolle ist systemgeschützt und kann von der Organisation nicht gelöscht werden. Sie besitzt immer sämtliche für die jeweilige Organisation verfügbaren Organisationsrechte und dient als oberste Verwaltungsrolle.

Die Rechte dieser Owner-Rolle können nicht so verändert werden, dass ihr notwendige Verwaltungsrechte entzogen werden. Die Owner-Rolle selbst bleibt damit immer als verwaltbare Systemrolle erhalten.

Die Owner-Rolle darf **mehreren Mitgliedern gleichzeitig** zugewiesen werden. Eine Organisation kann damit beispielsweise mehrere gleichberechtigte Geschäftsführer, Chiefs oder Leitungsmitglieder besitzen. Alle Mitglieder mit dieser Rolle erhalten dasselbe vollständige Owner-Rechtepaket.

Die Regel „genau eine Rolle pro Mitglied“ bleibt dabei bestehen: Ein Owner besitzt innerhalb dieser Organisation die Owner-Rolle als seine eine zugewiesene Rolle. Mehrere Personen dürfen jedoch dieselbe Owner-Rolle verwenden.

Ein bestehender Owner darf ein **normales Mitglied derselben Organisation zu einem weiteren Owner ernennen**. Die bisherige normale Rolle des betroffenen Mitglieds wird dabei unmittelbar durch die geschützte Owner-Rolle ersetzt. Die Ernennung eines weiteren Owners erfordert keine Stadtverwaltung.

Jede Owner-Ernennung durch einen bestehenden Owner wird **dauerhaft protokolliert**. Das Protokoll enthält mindestens:

- die betroffene Organisation
- die betroffene Person
- den Owner, der die Ernennung durchgeführt hat
- die vorherige Rolle
- die Aktion `Owner ernannt`
- Datum und Uhrzeit

Ein Owner darf **keinem anderen Owner** die Owner-Rolle entziehen, ihn auf eine normale Rolle zurückstufen oder ihn über die normale Organisationsverwaltung aus der Owner-Stellung entfernen. Owner sind untereinander in Bezug auf die Owner-Rolle gleichgestellt und können sich gegenseitig nicht entmachten.

Ein Owner darf seine **eigene Owner-Rolle freiwillig abgeben**. Dafür ist keine Zustimmung eines anderen Owners oder der Stadtverwaltung erforderlich. Die freiwillige Abgabe betrifft ausschließlich die eigene Rolle und darf nicht zur Veränderung der Owner-Rolle anderer Mitglieder genutzt werden.

Bei der freiwilligen Abgabe bleibt die Person **Mitglied der Organisation**. Die Owner-Rolle wird dabei unmittelbar durch eine vorhandene normale Organisationsrolle ersetzt. Die Person verlässt die Organisation durch die Abgabe also nicht automatisch.

Der abgebende Owner darf **selbst auswählen**, auf welche aktuell vorhandene normale Rolle der Organisation er wechseln möchte. Die geschützte Owner-Rolle steht bei dieser Auswahl nicht zur Verfügung. Nach Bestätigung wird die Owner-Rolle unmittelbar durch die ausgewählte normale Rolle ersetzt; ab diesem Zeitpunkt gelten ausschließlich deren Berechtigungen und die bisherigen Owner-Rechte entfallen sofort.

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

## Sicherheitsregel

Berechtigungen müssen serverseitig beziehungsweise über Supabase/RLS geprüft werden. Eine reine Ausblendung von Schaltflächen im Frontend reicht nicht aus.

Eine Organisation erhält durch ihre eigenen Rollen niemals automatisch Zugriff auf Daten anderer Organisationen oder geschützte Bereiche anderer Module.

Protokolle zu Rollen-, Mitgliedschafts- und Owner-Eingriffen dürfen von normalen Organisationsmitgliedern nicht manipuliert oder gelöscht werden.

## Bestehende Mitgliederdaten

`organization_members.role_title` kann vorerst weiterhin den sichtbaren Rollentitel speichern. Für das vollständige Rollen- und Berechtigungssystem wird später eine eigene Rollenstruktur ergänzt, damit Berechtigungen zentral an einer Rolle statt einzeln an jedem Mitarbeiter gepflegt werden können.

Bei der späteren technischen Umsetzung erhält jede Organisationsmitgliedschaft genau eine Rollenreferenz. Ein separates Many-to-Many-System zwischen Mitgliedern und Rollen ist damit nicht notwendig.