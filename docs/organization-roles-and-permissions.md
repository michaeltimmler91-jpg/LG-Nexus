# LG Nexus – Organisationsrollen und Berechtigungen

## Grundprinzip

Jede Firma oder Organisation kann ihre normalen Rollen grundsätzlich selbst gestalten. Beispiele sind `Werkstattleiter`, `Chief of Medicine`, `Ausbilder`, `Azubi` oder beliebige andere IC-Rollen.

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

Welche Berechtigungen angeboten werden, hängt vom jeweiligen Organisationsmodul ab. Medical, Police, Fire & Rescue, Unternehmen und andere Bereiche dürfen unterschiedliche Berechtigungsschlüssel besitzen.

## Rollen pro Mitglied

Ein Mitglied besitzt innerhalb derselben Organisation **genau eine Rolle gleichzeitig**.

Die zugewiesene Rolle bestimmt sowohl den sichtbaren Rollentitel als auch das zugehörige Rechtepaket. Soll sich die Funktion eines Mitarbeiters ändern, wird seine bisherige Rolle durch eine andere Rolle ersetzt.

Mehrere parallele Rollen innerhalb derselben Organisation sind nicht vorgesehen. Ein Bürger kann jedoch Mitglied mehrerer verschiedener Organisationen sein und besitzt in jeder Organisation jeweils eine eigene Rolle.

## Darstellung normaler Rollen

Normale Rollen dürfen folgende zusätzliche Darstellungsdaten besitzen:

- eindeutiger Rollenname innerhalb der Organisation
- optionale Kurzbeschreibung
- optionale Rollenfarbe
- optionales Rollen-Icon

Zwei normale Rollen derselben Organisation dürfen **nicht denselben Namen** besitzen.

Es gibt **keine maximale Anzahl normaler Rollen** pro Organisation.

## Standardrolle

Jede neu angelegte Organisation erhält automatisch eine normale Standardrolle **`Mitarbeiter`**.

Die Organisation darf später festlegen, **welche vorhandene normale Rolle die aktuelle Standardrolle** für neue Mitglieder ist. Diese Auswahl darf ausschließlich durch einen Owner geändert werden. Es muss jederzeit genau eine gültige normale Standardrolle festgelegt sein.

Beim Wechsel der Standardrolle zeigt das Frontend vor dem Speichern eine Bestätigung an, zum Beispiel: `Neue Mitglieder erhalten künftig die Rolle X.`

Der Wechsel der Standardrolle wird **nicht protokolliert**.

Die Standardrolle darf durch einen Owner umbenannt werden. Ihre technische Funktion als Standardrolle hängt nicht am sichtbaren Namen `Mitarbeiter`.

Soll die aktuell festgelegte Standardrolle gelöscht werden, muss **zuerst eine andere vorhandene normale Rolle als neue Standardrolle ausgewählt** werden. Eine automatische Ersatzauswahl durch das System erfolgt nicht.

Eine normale Rolle darf nur gelöscht werden, wenn ihr **kein Mitglied mehr zugewiesen** ist und mindestens eine andere normale Rolle bestehen bleibt.

Neu aufgenommene Mitglieder erhalten automatisch die aktuell festgelegte Standardrolle.

## Rollenverwaltung

Das Recht **`Rollen verwalten`** erlaubt nicht automatisch das Erstellen oder Umbenennen normaler Rollen. Das Erstellen, Umbenennen und Löschen normaler Rollen sowie das Ändern ihrer konkreten Berechtigungen bleibt der geschützten Owner-Ebene vorbehalten.

Vor dem Löschen einer normalen Rolle muss eine ausdrückliche Bestätigung im Frontend erfolgen.

Das Erstellen, Umbenennen und Löschen normaler Rollen wird protokolliert. Das Rollen-Audit enthält mindestens:

- Organisation
- Aktion
- betroffene Rolle beziehungsweise alten und neuen Rollennamen
- ausführende Person
- Datum und Uhrzeit

Änderungen an konkreten Rollenberechtigungen und reine Änderungen der Rollenreihenfolge werden dagegen **nicht zusätzlich protokolliert**.

## Rangstufen und Hierarchie

Normale Organisationsrollen besitzen zusätzlich eine **Rangstufe beziehungsweise Hierarchieposition**. Die Organisation legt damit fest, welche normalen Rollen über oder unter anderen Rollen stehen.

Die Reihenfolge darf per Drag & Drop geändert werden. Dafür benötigt die ausführende Person ausdrücklich die Berechtigung **`Rollen verwalten`**.

Die geschützte Owner-Rolle kann nicht verschoben werden und steht technisch immer oberhalb aller normalen Rollen.

Für normale Rollen mit `Rollen verwalten` gelten zusätzlich folgende Grenzen:

- die eigene Rolle darf nicht verschoben werden
- Rollen oberhalb der eigenen Rolle dürfen nicht verschoben werden
- Rollen unterhalb der eigenen Rolle dürfen frei untereinander sortiert werden

Ein Owner darf die gesamte normale Rollenhierarchie verwalten.

Eine Rolle darf einem anderen Mitglied nur zugewiesen werden, wenn die ausführende Person die Berechtigung **`Rollen zuweisen`** besitzt und die Zielrolle unterhalb ihrer eigenen Hierarchiestufe liegt.

Zusätzlich gilt für normale Rollen mit `Rollen zuweisen`:

- die eigene Rolle darf nicht selbst geändert werden
- die Rolle eines Mitglieds mit gleicher oder höherer Rangstufe darf nicht geändert werden
- Mitglieder unterhalb der eigenen Rangstufe dürfen auf andere Rollen unterhalb der eigenen Rangstufe hoch- oder herabgestuft werden

Ein Owner darf jedem normalen Mitglied **jede beliebige normale Rolle** zuweisen, unabhängig von der normalen Hierarchie.

Die Rangstufe allein verleiht keine Rechte. Hierarchie und konkrete Rollenberechtigungen werden gemeinsam geprüft.

## Mitgliederverwaltung

Neue Mitglieder dürfen durch einen Owner oder durch ein Mitglied aufgenommen werden, dessen Rolle ausdrücklich die Berechtigung **`Mitglieder verwalten`** besitzt.

Die Aufnahme erfolgt **sofort und ohne vorherige Bestätigung oder Einladung** durch die aufzunehmende Person. Nach erfolgreicher Aufnahme ist die Mitgliedschaft unmittelbar aktiv und die aktuelle Standardrolle wird automatisch zugewiesen.

Ein Nicht-Owner mit `Mitglieder verwalten` darf eine Aufnahme nur durchführen, wenn die aktuelle Standardrolle **unterhalb seiner eigenen Hierarchiestufe** liegt. Ein Owner ist von dieser Einschränkung ausgenommen.

`Mitglieder verwalten` erlaubt außerdem das Bearbeiten dafür vorgesehener interner Mitgliedsdaten. Dieses Recht erlaubt jedoch **nicht**, andere Mitglieder aus der Organisation zu entfernen.

Ein Owner darf normale Mitglieder aus der Organisation entfernen. Andere Owner sind davon ausgenommen und können über die normale Organisationsverwaltung nicht entfernt oder zurückgestuft werden.

Beim Entfernen eines normalen Mitglieds darf ein Owner optional einen Freitext-Grund angeben. Wenn ein Grund angegeben wurde, wird er dem entfernten Mitglied in seiner Nexus-Benachrichtigung angezeigt.

Ein normales Mitglied darf die Organisation selbstständig verlassen. Dies gilt auch, wenn das Mitglied `inaktiv/beurlaubt` ist.

Vor dem freiwilligen Austritt muss im Frontend eine Bestätigung erfolgen.

Ehemalige Mitglieder dürfen später erneut aufgenommen werden; dabei gelten dieselben Aufnahmeregeln wie bei einer erstmaligen Aufnahme.

Es gibt **keine maximale Mitgliederzahl** pro Organisation.

## Interne Mitgliedsnotizen

Interne Mitgliedsnotizen dürfen von Ownern und Rollen mit **`Mitglieder verwalten`** eingesehen werden.

Das betroffene Mitglied selbst darf seine eigenen internen Mitgliedsnotizen **nicht** sehen.

Eine Person mit `Mitglieder verwalten` darf neue interne Notizen anlegen. Eine bestehende Notiz darf anschließend nur von

- der Person, die diese Notiz erstellt hat, oder
- einem Owner

bearbeitet oder gelöscht werden.

Änderungen und Löschungen interner Mitgliedsnotizen werden **nicht protokolliert**.

## Protokollierung von Mitgliedschaft und Rollenwechseln

Aufnahmen und das Ende einer Mitgliedschaft werden protokolliert. Das Mitgliedschafts-Audit enthält mindestens:

- Organisation
- betroffene Person
- Aktion (`Mitglied aufgenommen`, `Mitglied selbst ausgetreten` oder `Mitglied entfernt`)
- ausführende Person
- Datum und Uhrzeit
- bei Entfernung optional den angegebenen Grund

Änderungen an der Rolle eines Mitglieds werden ebenfalls protokolliert. Das Rollenwechsel-Protokoll enthält mindestens:

- Organisation
- betroffene Person
- vorherige Rolle
- neue Rolle
- ausführende Person
- Datum und Uhrzeit

Die **freiwillige Abgabe der eigenen Owner-Rolle ist ausdrücklich von dieser Rollenwechsel-Protokollierung ausgenommen** und wird nicht zusätzlich protokolliert.

Das Bearbeiten des öffentlichen Organisationsprofils wird protokolliert.

Nicht protokolliert werden dagegen:

- Wechsel der Standardrolle
- Änderungen konkreter Rollenberechtigungen
- reine Änderungen der Rollenreihenfolge
- Änderung des Öffnungsstatus `geöffnet / eingeschränkt / geschlossen`
- Änderung der öffentlichen Sichtbarkeit der Mitgliederliste
- Bearbeitung oder Löschung interner Mitgliedsnotizen

## Aufbewahrung und Sichtbarkeit von Protokollen

Alle in diesem Dokument vorgesehenen Organisations-, Rollen-, Mitgliedschafts- und Owner-Protokolle werden **6 Monate** aufbewahrt. Danach können sie automatisch gelöscht werden.

Innerhalb einer Organisation dürfen die Organisations-Protokolle **nur Owner** einsehen. Es gibt dafür keine zusätzliche frei vergebbare Rollenberechtigung wie `Protokolle ansehen`.

Dafür berechtigte Personen der **Stadtverwaltung** dürfen die Organisations-Protokolle ebenfalls einsehen. Dies ist nicht auf die von der jeweiligen Stadtverwaltungs-Person selbst ausgeführten Owner-Eingriffe beschränkt.

Der Zugriff auf Protokolle macht die Stadtverwaltung nicht zum Mitglied der Organisation und gibt ihr keinen allgemeinen Zugriff auf sonstige interne Organisationsdaten.

## Benachrichtigungen bei Mitgliedsänderungen

Das betroffene Mitglied erhält innerhalb von LG Nexus eine Benachrichtigung bei:

- Aufnahme in eine Organisation
- Entfernung aus einer Organisation
- Rollenwechsel
- Ernennung zum Owner
- Wechsel auf `inaktiv/beurlaubt`
- Rückkehr von `inaktiv/beurlaubt` auf aktiv

Ein optionaler Entfernungsgrund wird in der Benachrichtigung des entfernten Mitglieds angezeigt.

Owner einer Organisation erhalten zusätzlich eine Benachrichtigung, wenn:

- ein Mitglied die Organisation selbst verlässt
- eine Person mit `Mitglieder verwalten` ein neues Mitglied aufnimmt
- ein Mitglied auf `inaktiv/beurlaubt` gesetzt wird
- ein Mitglied wieder auf aktiv gesetzt wird

Diese wichtigen Organisations-Benachrichtigungen können vom Benutzer **nicht deaktiviert** werden.

## Inaktiv / beurlaubt

Mitglieder können innerhalb einer Organisation auf **`inaktiv/beurlaubt`** gesetzt werden, ohne ihre Mitgliedschaft oder Rolle zu verlieren.

Für diesen Status wird kein Zeitraum von/bis gespeichert. Er bleibt bestehen, bis er manuell wieder aufgehoben wird.

Der Status wird in der normalen internen Mitgliederliste **nicht zusätzlich sichtbar markiert**.

Während `inaktiv/beurlaubt` bleibt die Organisation und die zugewiesene Rolle gespeichert, der Zugriff auf **interne Organisationsbereiche wird jedoch vollständig gesperrt**. Öffentliche Seiten und öffentliche Informationen der Organisation bleiben weiterhin sichtbar.

Nach Rückkehr auf aktiv gelten wieder die normalen Rechte der gespeicherten Rolle.

Das Setzen und Aufheben von `inaktiv/beurlaubt` wird protokolliert.

Ein Owner darf **sich selbst nicht** auf `inaktiv/beurlaubt` setzen.

Ein Owner darf **keinen anderen Owner** auf `inaktiv/beurlaubt` setzen. Auch eine normale Rolle mit `Mitglieder verwalten` darf keinen Owner auf `inaktiv/beurlaubt` setzen.

Eine dafür berechtigte Person der **Stadtverwaltung** darf einen Owner auf `inaktiv/beurlaubt` setzen und wieder aktivieren.

Ein Owner darf ein `inaktiv/beurlaubt` gesetztes normales Mitglied weiterhin aus der Organisation entfernen.

Die Rolle eines `inaktiv/beurlaubt` gesetzten normalen Mitglieds darf geändert werden. Für die Rollenänderung gelten dieselben Hierarchie- und Berechtigungsregeln wie sonst auch.

Ein `inaktiv/beurlaubt` gesetztes Mitglied darf **nicht direkt zum Owner ernannt** werden. Vor der Owner-Ernennung muss es wieder aktiv gesetzt werden.

Ein Mitglied mit Owner-Rolle zählt für die Owner-Existenzprüfung weiterhin als Owner, auch wenn sein Mitgliedsstatus `inaktiv/beurlaubt` ist. Für die Notfallregel der Stadtverwaltung ist damit die **zugewiesene Owner-Rolle** entscheidend, nicht der Aktivstatus.

## Feste Leitungs-/Owner-Rolle

Jede Organisation besitzt eine **feste, systemgeschützte Owner-Rolle**.

Diese Rolle kann nicht gelöscht werden und besitzt immer sämtliche für die jeweilige Organisation verfügbaren Organisationsrechte. Ihre Rechte können nicht reduziert werden.

Die Owner-Rolle darf mehreren Mitgliedern gleichzeitig zugewiesen werden. Alle Owner sind in Bezug auf die Owner-Rolle gleichgestellt.

Die **sichtbare Bezeichnung der Owner-Rolle wird von der Stadtverwaltung festgelegt**. Owner der Organisation können diese Bezeichnung nicht selbst ändern.

Alle Owner derselben Organisation verwenden immer dieselbe sichtbare Owner-Bezeichnung.

Technisch bleibt die Rolle unabhängig von ihrer sichtbaren Bezeichnung immer als geschützte Owner-Rolle erkennbar.

### Weitere Owner ernennen

Ein bestehender Owner darf **jedes aktive normale Mitglied derselben Organisation** zu einem weiteren Owner ernennen, unabhängig davon, welche normale Rolle die Person vorher besitzt.

Eine Bestätigung durch das ernannte Mitglied ist nicht erforderlich. Die Ernennung wird nach Bestätigung durch den ausführenden Owner sofort wirksam und ersetzt die bisherige normale Rolle unmittelbar durch die Owner-Rolle.

Vor der Ernennung zeigt das Frontend eine deutliche Sicherheitsabfrage an, dass die betroffene Person anschließend vollständige Owner-Rechte besitzt.

Für eine Owner-Ernennung ist keine zusätzliche interne Notiz vorgesehen.

Jede Owner-Ernennung durch einen bestehenden Owner wird protokolliert. Das Protokoll enthält mindestens:

- Organisation
- betroffene Person
- ernennender Owner
- vorherige Rolle
- Aktion `Owner ernannt`
- Datum und Uhrzeit

### Schutz zwischen Ownern

Ein Owner darf **keinem anderen Owner** die Owner-Rolle entziehen, ihn auf eine normale Rolle zurückstufen, aus der Organisation entfernen oder auf `inaktiv/beurlaubt` setzen.

### Eigene Owner-Rolle freiwillig abgeben

Ein Owner darf seine **eigene Owner-Rolle freiwillig abgeben**. Dafür ist keine Zustimmung eines anderen Owners oder der Stadtverwaltung erforderlich.

Vor der freiwilligen Abgabe muss eine deutliche Bestätigung im Frontend erfolgen.

Die Person bleibt Mitglied der Organisation und darf selbst auswählen, auf welche aktuell vorhandene normale Rolle sie wechseln möchte. Die Owner-Rolle steht bei dieser Auswahl nicht zur Verfügung.

Nach Bestätigung gelten sofort ausschließlich die Rechte der ausgewählten normalen Rolle.

Die freiwillige Abgabe wird **nicht protokolliert**.

Es gibt keine Schutzregel für den letzten Owner. Auch der letzte Owner darf seine eigene Owner-Rolle freiwillig abgeben, sodass eine Organisation vorübergehend keine zugewiesene Owner-Rolle besitzen kann.

## Notfall-Eingriff der Stadtverwaltung

Hat eine Organisation **überhaupt kein Mitglied mit zugewiesener Owner-Rolle**, darf eine dafür berechtigte Person der Stadtverwaltung im Notfall einem Mitglied dieser Organisation die geschützte Owner-Rolle zuweisen.

Ein `inaktiv/beurlaubt` gesetzter Owner zählt weiterhin als vorhandener Owner. Solange mindestens ein Mitglied die Owner-Rolle besitzt, darf die Stadtverwaltung über die Notfallfunktion keinen weiteren Owner einsetzen.

Für die Notfall-Zuweisung muss kein zusätzlicher Freitext-Grund angegeben werden.

Eine dafür berechtigte Person der Stadtverwaltung darf einem bestehenden Owner die Owner-Rolle auch wieder entziehen. Die Voraussetzung von 0 Ownern gilt nur für das **Einsetzen** eines neuen Owners, nicht für den Entzug.

Sowohl das Einsetzen als auch das Entziehen einer Owner-Rolle durch die Stadtverwaltung wird protokolliert. Das Protokoll enthält mindestens:

- Organisation
- Art des Eingriffs (`Owner eingesetzt` oder `Owner entzogen`)
- betroffene Person
- ausführende Person der Stadtverwaltung
- Datum und Uhrzeit

Für diese Protokolle gilt ebenfalls die allgemeine Aufbewahrungsfrist von **6 Monaten**.

Die Stadtverwaltung wird durch einen solchen Eingriff nicht selbst Mitglied oder Owner der Organisation und erhält dadurch keinen dauerhaften Zugriff auf interne Organisationsdaten.

## Ehemalige Mitglieder

Jede Organisation erhält eine interne Ansicht **`Ehemalige Mitglieder`**.

Dort werden mindestens angezeigt:

- ehemalige Person
- Eintrittsdatum
- Austritts- beziehungsweise Entfernungsdatum
- letzte Rolle in der Organisation
- optionaler Entfernungsgrund, sofern bei einer Entfernung einer angegeben wurde

Ein optionaler Entfernungsgrund ist dort nur für Owner sichtbar.

Von einem ehemaligen Mitglied erstellte interne Dokumente oder Akten bleiben nach dem Austritt beziehungsweise der Entfernung **erhalten**.

In der späteren Anzeige dieser erhaltenen Inhalte wird der ursprüngliche Autor jedoch **nicht mit Name oder Nexus-ID sichtbar dargestellt**.

## Sicherheitsabfragen im Frontend

Folgende Aktionen benötigen vor der endgültigen Ausführung eine ausdrückliche Bestätigung:

- freiwilliger Austritt aus einer Organisation
- freiwillige Abgabe der eigenen Owner-Rolle
- Löschen einer normalen Rolle
- Ernennung eines neuen Owners

Bei der Owner-Ernennung muss die Sicherheitsabfrage ausdrücklich darauf hinweisen, dass die Person danach vollständige Owner-Rechte besitzt.

## Sicherheitsregel

Berechtigungen müssen serverseitig beziehungsweise über Supabase/RLS geprüft werden. Eine reine Ausblendung von Schaltflächen im Frontend reicht nicht aus.

Eine Organisation erhält durch ihre eigenen Rollen niemals automatisch Zugriff auf Daten anderer Organisationen oder geschützte Bereiche anderer Module.

Protokolle dürfen von normalen Organisationsmitgliedern nicht manipuliert oder gelöscht werden.

## Bestehende Mitgliederdaten

`organization_members.role_title` kann vorerst weiterhin den sichtbaren Rollentitel speichern.

Für das vollständige Rollen- und Berechtigungssystem wird später eine eigene Rollenstruktur ergänzt. Jede Organisationsmitgliedschaft erhält genau eine Rollenreferenz; ein Many-to-Many-System zwischen Mitgliedern und Rollen ist nicht notwendig.