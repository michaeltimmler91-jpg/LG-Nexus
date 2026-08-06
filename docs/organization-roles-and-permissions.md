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

Welche Berechtigungen angeboten werden, hängt vom jeweiligen Organisationsmodul ab. Medical, Police, Fire & Rescue, Unternehmen und andere Bereiche dürfen unterschiedliche Berechtigungsschlüssel besitzen.

## Rollen pro Mitglied

Ein Mitglied besitzt innerhalb derselben Organisation **genau eine Rolle gleichzeitig**.

Die zugewiesene Rolle bestimmt sowohl den sichtbaren Rollentitel als auch das zugehörige Rechtepaket. Soll sich die Funktion eines Mitarbeiters ändern, wird seine bisherige Rolle durch eine andere Rolle ersetzt.

Mehrere parallele Rollen innerhalb derselben Organisation sind nicht vorgesehen. Ein Bürger kann jedoch Mitglied mehrerer verschiedener Organisationen sein und besitzt in jeder Organisation jeweils eine eigene Rolle.

## Standardrolle

Jede neu angelegte Organisation erhält automatisch eine normale Standardrolle **`Mitarbeiter`**.

Die Organisation darf später festlegen, **welche vorhandene normale Rolle die aktuelle Standardrolle** für neue Mitglieder ist. Diese Auswahl darf ausschließlich durch einen Owner geändert werden. Es muss jederzeit genau eine gültige normale Standardrolle festgelegt sein.

Die Standardrolle darf durch einen Owner umbenannt werden. Ihre technische Funktion als Standardrolle hängt nicht am sichtbaren Namen `Mitarbeiter`.

Soll die aktuell festgelegte Standardrolle gelöscht werden, muss **zuerst eine andere vorhandene normale Rolle als neue Standardrolle ausgewählt** werden. Eine automatische Ersatzauswahl durch das System erfolgt nicht.

Eine normale Rolle darf nur gelöscht werden, wenn ihr **kein Mitglied mehr zugewiesen** ist und mindestens eine andere normale Rolle bestehen bleibt.

Neu aufgenommene Mitglieder erhalten automatisch die aktuell festgelegte Standardrolle.

## Rollenverwaltung

Das Recht **`Rollen verwalten`** erlaubt nicht automatisch das Erstellen oder Umbenennen normaler Rollen. Das Erstellen, Umbenennen und Löschen normaler Rollen sowie das Ändern ihrer konkreten Berechtigungen bleibt der geschützten Owner-Ebene vorbehalten.

Das Erstellen, Umbenennen und Löschen normaler Rollen wird dauerhaft protokolliert. Das Rollen-Audit enthält mindestens:

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

Eine Rolle darf einem anderen Mitglied nur zugewiesen werden, wenn die ausführende Person die Berechtigung **`Rollen zuweisen`** besitzt und die Zielrolle unterhalb ihrer eigenen Hierarchiestufe liegt. Gleichrangige oder höher eingestufte Rollen dürfen über die normale Rollenverwaltung nicht vergeben werden.

Die Rangstufe allein verleiht keine Rechte. Hierarchie und konkrete Rollenberechtigungen werden gemeinsam geprüft.

## Mitgliederverwaltung

Neue Mitglieder dürfen durch einen Owner oder durch ein Mitglied aufgenommen werden, dessen Rolle ausdrücklich die Berechtigung **`Mitglieder verwalten`** besitzt.

Die Aufnahme erfolgt **sofort und ohne vorherige Bestätigung oder Einladung** durch die aufzunehmende Person. Nach erfolgreicher Aufnahme ist die Mitgliedschaft unmittelbar aktiv und die aktuelle Standardrolle wird automatisch zugewiesen.

Ein Nicht-Owner mit `Mitglieder verwalten` darf eine Aufnahme nur durchführen, wenn die aktuelle Standardrolle **unterhalb seiner eigenen Hierarchiestufe** liegt. Ein Owner ist von dieser Einschränkung ausgenommen.

`Mitglieder verwalten` erlaubt außerdem das Bearbeiten dafür vorgesehener interner Mitgliedsdaten, beispielsweise interner Notizen oder eines organisationsinternen Status. Dieses Recht erlaubt jedoch **nicht**, andere Mitglieder aus der Organisation zu entfernen.

Ein Owner darf normale Mitglieder aus der Organisation entfernen. Andere Owner sind davon ausgenommen und können über die normale Organisationsverwaltung nicht entfernt oder zurückgestuft werden.

Beim Entfernen eines normalen Mitglieds darf ein Owner optional einen Freitext-Grund angeben. Wenn ein Grund angegeben wurde, wird er dem entfernten Mitglied in seiner Nexus-Benachrichtigung angezeigt.

Ein normales Mitglied darf die Organisation selbstständig verlassen. Ehemalige Mitglieder dürfen später erneut aufgenommen werden; dabei gelten dieselben Aufnahmeregeln wie bei einer erstmaligen Aufnahme.

Es gibt **keine maximale Mitgliederzahl** pro Organisation.

## Protokollierung von Mitgliedschaft und Rollenwechseln

Aufnahmen und das Ende einer Mitgliedschaft werden dauerhaft protokolliert. Das Mitgliedschafts-Audit enthält mindestens:

- Organisation
- betroffene Person
- Aktion (`Mitglied aufgenommen`, `Mitglied selbst ausgetreten` oder `Mitglied entfernt`)
- ausführende Person
- Datum und Uhrzeit
- bei Entfernung optional den angegebenen Grund

Änderungen an der Rolle eines Mitglieds werden ebenfalls dauerhaft protokolliert. Das Rollenwechsel-Protokoll enthält mindestens:

- Organisation
- betroffene Person
- vorherige Rolle
- neue Rolle
- ausführende Person
- Datum und Uhrzeit

Die **freiwillige Abgabe der eigenen Owner-Rolle ist ausdrücklich von dieser Rollenwechsel-Protokollierung ausgenommen** und wird nicht zusätzlich protokolliert.

## Benachrichtigungen bei Mitgliedsänderungen

Das betroffene Mitglied erhält innerhalb von LG Nexus eine Benachrichtigung bei:

- Aufnahme in eine Organisation
- Entfernung aus einer Organisation
- Rollenwechsel
- Ernennung zum Owner
- Wechsel auf `inaktiv/beurlaubt`
- Rückkehr von `inaktiv/beurlaubt` auf aktiv

Ein optionaler Entfernungsgrund wird in der Benachrichtigung des entfernten Mitglieds angezeigt.

## Inaktiv / beurlaubt

Mitglieder können innerhalb einer Organisation auf **`inaktiv/beurlaubt`** gesetzt werden, ohne ihre Mitgliedschaft oder Rolle zu verlieren.

Für diesen Status wird kein Zeitraum von/bis gespeichert. Er bleibt bestehen, bis er manuell wieder aufgehoben wird.

Der Status wird in der normalen internen Mitgliederliste **nicht zusätzlich sichtbar markiert**.

Während `inaktiv/beurlaubt` bleibt die Organisation und die zugewiesene Rolle gespeichert, der Zugriff auf **interne Organisationsbereiche wird jedoch vollständig gesperrt**. Öffentliche Seiten und öffentliche Informationen der Organisation bleiben weiterhin sichtbar.

Nach Rückkehr auf aktiv gelten wieder die normalen Rechte der gespeicherten Rolle.

Das Setzen und Aufheben von `inaktiv/beurlaubt` wird dauerhaft protokolliert.

Ein Owner darf **sich selbst nicht** auf `inaktiv/beurlaubt` setzen.

Ein Mitglied mit Owner-Rolle zählt für die Owner-Existenzprüfung weiterhin als Owner, auch wenn sein Mitgliedsstatus `inaktiv/beurlaubt` ist. Für die Notfallregel der Stadtverwaltung ist damit die **zugewiesene Owner-Rolle** entscheidend, nicht der Aktivstatus.

## Feste Leitungs-/Owner-Rolle

Jede Organisation besitzt eine **feste, systemgeschützte Owner-Rolle**.

Diese Rolle kann nicht gelöscht werden und besitzt immer sämtliche für die jeweilige Organisation verfügbaren Organisationsrechte. Ihre Rechte können nicht reduziert werden.

Die Owner-Rolle darf mehreren Mitgliedern gleichzeitig zugewiesen werden. Alle Owner sind in Bezug auf die Owner-Rolle gleichgestellt.

Die sichtbare Bezeichnung kann im Frontend zur Organisation passen, zum Beispiel `Geschäftsführer`, `Chief`, `Leitung` oder `Direktor`. Technisch bleibt sie immer als geschützte Owner-Rolle erkennbar.

### Weitere Owner ernennen

Ein bestehender Owner darf ein normales Mitglied derselben Organisation zu einem weiteren Owner ernennen. Die bisherige normale Rolle wird dabei unmittelbar durch die Owner-Rolle ersetzt. Eine Zustimmung der Stadtverwaltung ist dafür nicht erforderlich.

Jede Owner-Ernennung durch einen bestehenden Owner wird dauerhaft protokolliert. Das Protokoll enthält mindestens:

- Organisation
- betroffene Person
- ernennender Owner
- vorherige Rolle
- Aktion `Owner ernannt`
- Datum und Uhrzeit

### Schutz zwischen Ownern

Ein Owner darf **keinem anderen Owner** die Owner-Rolle entziehen, ihn auf eine normale Rolle zurückstufen oder ihn über die normale Organisationsverwaltung aus der Owner-Stellung entfernen.

### Eigene Owner-Rolle freiwillig abgeben

Ein Owner darf seine **eigene Owner-Rolle freiwillig abgeben**. Dafür ist keine Zustimmung eines anderen Owners oder der Stadtverwaltung erforderlich.

Die Person bleibt Mitglied der Organisation und darf selbst auswählen, auf welche aktuell vorhandene normale Rolle sie wechseln möchte. Die Owner-Rolle steht bei dieser Auswahl nicht zur Verfügung.

Nach Bestätigung gelten sofort ausschließlich die Rechte der ausgewählten normalen Rolle.

Die freiwillige Abgabe wird **nicht protokolliert**.

Es gibt keine Schutzregel für den letzten Owner. Auch der letzte Owner darf seine eigene Owner-Rolle freiwillig abgeben, sodass eine Organisation vorübergehend keine zugewiesene Owner-Rolle besitzen kann.

## Notfall-Eingriff der Stadtverwaltung

Hat eine Organisation **überhaupt kein Mitglied mit zugewiesener Owner-Rolle**, darf eine dafür berechtigte Person der Stadtverwaltung im Notfall einem Mitglied dieser Organisation die geschützte Owner-Rolle zuweisen.

Ein `inaktiv/beurlaubt` gesetzter Owner zählt weiterhin als vorhandener Owner. Solange mindestens ein Mitglied die Owner-Rolle besitzt, darf die Stadtverwaltung über die Notfallfunktion keinen weiteren Owner einsetzen.

Für die Notfall-Zuweisung muss kein zusätzlicher Freitext-Grund angegeben werden.

Eine dafür berechtigte Person der Stadtverwaltung darf einem bestehenden Owner die Owner-Rolle auch wieder entziehen. Die Voraussetzung von 0 Ownern gilt nur für das **Einsetzen** eines neuen Owners, nicht für den Entzug.

Sowohl das Einsetzen als auch das Entziehen einer Owner-Rolle durch die Stadtverwaltung wird dauerhaft protokolliert. Das Protokoll enthält mindestens:

- Organisation
- Art des Eingriffs (`Owner eingesetzt` oder `Owner entzogen`)
- betroffene Person
- ausführende Person der Stadtverwaltung
- Datum und Uhrzeit

Die Stadtverwaltung wird durch einen solchen Eingriff nicht selbst Mitglied oder Owner der Organisation und erhält dadurch keinen dauerhaften Zugriff auf interne Organisationsdaten.

## Sicherheitsregel

Berechtigungen müssen serverseitig beziehungsweise über Supabase/RLS geprüft werden. Eine reine Ausblendung von Schaltflächen im Frontend reicht nicht aus.

Eine Organisation erhält durch ihre eigenen Rollen niemals automatisch Zugriff auf Daten anderer Organisationen oder geschützte Bereiche anderer Module.

Protokolle zu Rollen-, Mitgliedschafts- und Owner-Eingriffen dürfen von normalen Organisationsmitgliedern nicht manipuliert oder gelöscht werden.

## Bestehende Mitgliederdaten

`organization_members.role_title` kann vorerst weiterhin den sichtbaren Rollentitel speichern.

Für das vollständige Rollen- und Berechtigungssystem wird später eine eigene Rollenstruktur ergänzt. Jede Organisationsmitgliedschaft erhält genau eine Rollenreferenz; ein Many-to-Many-System zwischen Mitgliedern und Rollen ist nicht notwendig.