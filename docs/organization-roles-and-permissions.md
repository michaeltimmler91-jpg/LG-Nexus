# LG Nexus – Organisationsrollen und Berechtigungen

## Grundprinzip

Jede Firma oder Organisation kann ihre normalen Rollen grundsätzlich selbst gestalten. Beispiele sind `Werkstattleiter`, `Chief of Medicine`, `Ausbilder`, `Azubi` oder beliebige andere IC-Rollen.

Eine Rolle ist nicht nur ein sichtbarer Titel. An jede Rolle können konkrete Rechte und Berechtigungen innerhalb der jeweiligen Organisation gebunden werden.

Beispiele für mögliche Rechte:

- Mitglieder verwalten
- Rollen verwalten
- Rollen zuweisen
- interne Dokumente ansehen
- interne Dokumente bearbeiten
- Akten oder organisationsspezifische Daten bearbeiten
- Vorlagen verwalten
- Ausbildungsinhalte verwalten

Welche Berechtigungen angeboten werden, hängt vom jeweiligen Organisationsmodul ab. Medical, Police, Fire & Rescue, Unternehmen und andere Bereiche dürfen unterschiedliche Berechtigungsschlüssel besitzen.

Das öffentliche Organisationsprofil, der Öffnungsstatus und die öffentliche Sichtbarkeit der Mitgliederliste werden nicht über frei vergebbare normale Rollenrechte verwaltet, sondern ausschließlich durch Owner.

## Rollen pro Mitglied

Ein Mitglied besitzt innerhalb derselben Organisation **genau eine Rolle gleichzeitig**.

Die zugewiesene Rolle bestimmt sowohl den sichtbaren Rollentitel als auch das zugehörige Rechtepaket. Soll sich die Funktion eines Mitarbeiters ändern, wird seine bisherige Rolle durch eine andere Rolle ersetzt.

Mehrere parallele Rollen innerhalb derselben Organisation sind nicht vorgesehen. Ein Bürger kann jedoch Mitglied mehrerer verschiedener Organisationen sein und besitzt in jeder Organisation jeweils eine eigene Rolle.

## Darstellung normaler Rollen

Normale Rollen dürfen folgende zusätzliche Darstellungsdaten besitzen:

- eindeutiger Rollenname innerhalb der Organisation
- optionale Kurzbeschreibung
- optionale Rollenfarbe
- optionales Rollen-Icon aus der festen Nexus-Iconbibliothek

Zwei normale Rollen derselben Organisation dürfen **nicht denselben Namen** besitzen.

Es gibt **keine maximale Anzahl normaler Rollen** pro Organisation.

## Standardrolle

Jede neu angelegte Organisation erhält automatisch eine normale Standardrolle **`Mitarbeiter`**.

Die Organisation darf später festlegen, **welche vorhandene normale Rolle die aktuelle Standardrolle** für neue Mitglieder ist. Diese Auswahl darf ausschließlich durch einen Owner geändert werden. Es muss jederzeit genau eine gültige normale Standardrolle festgelegt sein.

Beim Wechsel der Standardrolle zeigt das Frontend vor dem Speichern eine Bestätigung an, zum Beispiel: `Neue Mitglieder erhalten künftig die Rolle X.`

Der Wechsel der Standardrolle wird **nicht protokolliert**.

Die Standardrolle darf durch einen Owner umbenannt werden. Ihre technische Funktion als Standardrolle hängt nicht am sichtbaren Namen `Mitarbeiter`.

Soll die aktuell festgelegte Standardrolle gelöscht oder deaktiviert werden, muss **zuerst eine andere vorhandene aktive normale Rolle als neue Standardrolle ausgewählt** werden. Eine automatische Ersatzauswahl durch das System erfolgt nicht.

Eine normale Rolle darf nur gelöscht werden, wenn ihr **kein Mitglied mehr zugewiesen** ist und mindestens eine andere normale Rolle bestehen bleibt.

Neu aufgenommene und erneut aufgenommene ehemalige Mitglieder erhalten automatisch die aktuell festgelegte Standardrolle.

## Rollenverwaltung

Das Recht **`Rollen verwalten`** erlaubt nicht automatisch das Erstellen oder Umbenennen normaler Rollen. Das Erstellen, Umbenennen und Löschen normaler Rollen sowie das Ändern ihrer konkreten Berechtigungen bleibt der geschützten Owner-Ebene vorbehalten.

Vor dem Löschen einer normalen Rolle muss eine ausdrückliche Bestätigung im Frontend erfolgen.

Ein Owner darf eine vorhandene normale Rolle **duplizieren**. Dabei werden die Berechtigungen der Ausgangsrolle übernommen; Name, Beschreibung, Farbe und Icon können anschließend angepasst werden.

Ein Owner darf eine normale Rolle außerdem **deaktivieren**, ohne sie zu löschen. Eine deaktivierte Rolle darf weder Mitgliedern neu zugewiesen werden noch weiterhin von Mitgliedern belegt sein. Vor der Deaktivierung müssen daher alle Mitglieder auf andere aktive Rollen gesetzt werden. Eine deaktivierte Rolle kann später wieder aktiviert werden.

Die Bearbeitung von Rollenberechtigungen wird im Frontend nach Modulen beziehungsweise Themenbereichen gruppiert, zum Beispiel `Allgemein`, `Medical`, `Ausbildung`, `Akten` oder `Verwaltung`.

Das Erstellen, Umbenennen und Löschen normaler Rollen wird protokolliert. Das Rollen-Audit enthält mindestens:

- Organisation
- Aktion
- betroffene Rolle beziehungsweise alten und neuen Rollennamen
- ausführende Person
- Datum und Uhrzeit

Änderungen an konkreten Rollenberechtigungen, reine Änderungen der Rollenreihenfolge, Wechsel der Standardrolle sowie Aktivierung/Deaktivierung normaler Rollen werden nicht zusätzlich protokolliert, solange später nichts anderes festgelegt wird.

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

Ein Owner darf jedem normalen Mitglied **jede beliebige aktive normale Rolle** zuweisen, unabhängig von der normalen Hierarchie.

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

Wird ein ehemaliges Mitglied später erneut aufgenommen, werden vorhandene frühere interne Mitgliedsnotizen dieser Person wieder sichtbar.

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

Das Bearbeiten des öffentlichen Organisationsprofils wird protokolliert. Dabei werden die **alten und neuen Werte** der geänderten Felder gespeichert.

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

Das betroffene aktive Mitglied erhält innerhalb von LG Nexus eine Benachrichtigung bei:

- Aufnahme in eine Organisation
- Entfernung aus einer Organisation
- Rollenwechsel
- Ernennung zum Owner
- Rückkehr von `inaktiv/beurlaubt` auf aktiv

Beim Wechsel auf `inaktiv/beurlaubt` erhält die betroffene Person einen unmittelbaren Statushinweis; ein optional hinterlegter Grund ist für sie sichtbar. Während der inaktiven Phase erhält sie jedoch keine weiteren persönlichen oder allgemeinen Organisations-Benachrichtigungen und keine internen Organisations-Mails.

Ein optionaler Entfernungsgrund wird in der Benachrichtigung des entfernten Mitglieds angezeigt, sofern die Benachrichtigung zugestellt werden kann.

Owner einer Organisation erhalten zusätzlich eine Benachrichtigung, wenn:

- ein Mitglied die Organisation selbst verlässt
- eine Person mit `Mitglieder verwalten` ein neues Mitglied aufnimmt
- ein normales Mitglied auf `inaktiv/beurlaubt` gesetzt wird
- ein normales Mitglied wieder auf aktiv gesetzt wird

Diese wichtigen Organisations-Benachrichtigungen können vom Benutzer **nicht deaktiviert** werden.

## Inaktiv / beurlaubt

Normale Mitglieder können innerhalb einer Organisation auf **`inaktiv/beurlaubt`** gesetzt werden, ohne ihre Mitgliedschaft oder Rolle zu verlieren.

Für normale Mitglieder ist ein Grund **optional**. Wenn ein Grund eingetragen wird, kann die betroffene Person diesen sehen.

Für diesen Status wird kein Zeitraum von/bis gespeichert. Er bleibt bestehen, bis er manuell wieder aufgehoben wird.

Der Status wird in der normalen internen Mitgliederliste nicht zusätzlich sichtbar markiert. Für Owner gibt es jedoch eine separate Ansicht beziehungsweise einen Filter für inaktive Mitglieder.

Während `inaktiv/beurlaubt` bleibt die Organisation und die zugewiesene Rolle gespeichert, der Zugriff auf **interne Organisationsbereiche wird vollständig gesperrt**. Öffentliche Seiten und öffentliche Informationen der Organisation bleiben weiterhin sichtbar.

Nach Rückkehr auf aktiv gelten wieder die normalen Rechte der gespeicherten Rolle.

Das Setzen und Aufheben von `inaktiv/beurlaubt` wird protokolliert.

Ein Owner darf **sich selbst nicht** auf `inaktiv/beurlaubt` setzen.

Ein Owner darf **keinen anderen Owner** auf `inaktiv/beurlaubt` setzen. Auch eine normale Rolle mit `Mitglieder verwalten` darf keinen Owner auf `inaktiv/beurlaubt` setzen.

Eine dafür berechtigte Person der **Stadtverwaltung** darf einen Owner auf `inaktiv/beurlaubt` setzen und wieder aktivieren. Beim Setzen eines Owners auf inaktiv ist ein **Grund verpflichtend**. Der Eingriff wird protokolliert; der betroffene Owner und die übrigen Owner der Organisation erhalten eine Nexus-Benachrichtigung.

Ein Owner darf ein `inaktiv/beurlaubt` gesetztes normales Mitglied weiterhin aus der Organisation entfernen.

Die Rolle eines `inaktiv/beurlaubt` gesetzten normalen Mitglieds darf geändert werden. Für die Rollenänderung gelten dieselben Hierarchie- und Berechtigungsregeln wie sonst auch.

Ein `inaktiv/beurlaubt` gesetztes Mitglied darf **nicht direkt zum Owner ernannt** werden. Vor der Owner-Ernennung muss es wieder aktiv gesetzt werden.

Ein Mitglied mit Owner-Rolle zählt für die Owner-Existenzprüfung weiterhin als Owner, auch wenn sein Mitgliedsstatus `inaktiv/beurlaubt` ist. Für die Notfallregel der Stadtverwaltung ist damit die **zugewiesene Owner-Rolle** entscheidend, nicht der Aktivstatus.

## Öffentliche Mitgliederliste

Die öffentliche Mitgliederliste wird organisationsweit sichtbar oder verborgen geschaltet. Einzelne Mitglieder können ihre Organisationszugehörigkeit dort nicht selbst ausblenden.

Ist die Mitgliederliste sichtbar:

- werden nur aktive Mitglieder angezeigt
- werden aktive Owner ganz oben angezeigt
- werden die übrigen Mitglieder nach Rollen-Hierarchie sortiert
- gibt es keine eigene Namenssuche innerhalb der Liste
- werden Rollenfarbe, Rollen-Icon und Rollenbeschreibung nicht öffentlich angezeigt

Ein `inaktiv/beurlaubt` gesetztes Mitglied wird öffentlich **nicht** angezeigt. Dies gilt auch für einen inaktiven Owner.

Ist die Mitgliederliste verborgen, bleiben aktive Owner dennoch öffentlich sichtbar. Außerdem darf weiterhin die **Gesamtzahl der Mitglieder** angezeigt werden, ohne die verborgenen Personen offenzulegen.

Ehemalige Mitglieder werden öffentlich niemals angezeigt.

Die sichtbare Bezeichnung der Owner-Rolle wird auf dem öffentlichen Organisationsprofil nicht zusätzlich ausgewiesen.

## Öffentliches Organisationsprofil

Das öffentliche Organisationsprofil darf **nur von Ownern** bearbeitet werden.

Dazu gehören insbesondere:

- Beschreibung
- Telefon
- Standort
- Logo
- Banner

Änderungen am öffentlichen Organisationsprofil werden mit alten und neuen Werten protokolliert.

Der Öffnungsstatus `geöffnet / eingeschränkt / geschlossen` sowie eine dazugehörige Statusmeldung werden ebenfalls ausschließlich durch Owner verwaltet. Der Öffnungsstatus wird aktuell **nur manuell** geändert; eine automatische FiveM-Erkennung ist nicht vorgesehen.

Änderungen des Öffnungsstatus werden nicht protokolliert.

Auch das öffentliche Sichtbar-/Verstecktschalten der Mitgliederliste darf ausschließlich durch Owner erfolgen und wird nicht protokolliert.

Da ausschließlich Owner diese öffentlichen Organisationsdaten ändern dürfen, ist kein zusätzliches Freigabe- oder Genehmigungsverfahren für Änderungen normaler Mitglieder vorgesehen.

## Feste Leitungs-/Owner-Rolle

Jede Organisation besitzt eine **feste, systemgeschützte Owner-Rolle**.

Diese Rolle kann nicht gelöscht werden und besitzt immer sämtliche für die jeweilige Organisation verfügbaren Organisationsrechte. Ihre Rechte können nicht reduziert werden.

Die Owner-Rolle darf mehreren Mitgliedern gleichzeitig zugewiesen werden. Alle Owner sind in Bezug auf die Owner-Rolle gleichgestellt.

Die **sichtbare Bezeichnung der Owner-Rolle wird von der Stadtverwaltung festgelegt**. Owner der Organisation können diese Bezeichnung nicht selbst ändern.

Alle Owner derselben Organisation verwenden immer dieselbe sichtbare Owner-Bezeichnung.

Die Organisation darf für ihre Owner-Rolle eine Darstellungsfarbe und ein Icon aus der festen Nexus-Iconbibliothek festlegen. Die technische Owner-Rolle bleibt davon unberührt.

Technisch bleibt die Rolle unabhängig von ihrer sichtbaren Bezeichnung, Farbe oder ihrem Icon immer als geschützte Owner-Rolle erkennbar.

Ändert die Stadtverwaltung die sichtbare Owner-Bezeichnung einer Organisation, wird diese Änderung protokolliert und die Owner der Organisation werden benachrichtigt.

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

Die Person bleibt Mitglied der Organisation und darf selbst auswählen, auf welche aktuell vorhandene aktive normale Rolle sie wechseln möchte. Die Owner-Rolle steht bei dieser Auswahl nicht zur Verfügung.

Nach Bestätigung gelten sofort ausschließlich die Rechte der ausgewählten normalen Rolle.

Die freiwillige Abgabe wird **nicht protokolliert**.

Es gibt keine Schutzregel für den letzten Owner. Auch der letzte Owner darf seine eigene Owner-Rolle freiwillig abgeben. Besitzt die Organisation danach keinen Owner mehr, wird die Stadtverwaltung darüber automatisch informiert.

### Organisation als Owner direkt verlassen

Ein Owner darf die Organisation auch **direkt verlassen**, ohne zuvor manuell auf eine normale Rolle zu wechseln. Dabei wird seine Owner-Rolle automatisch beendet und die Mitgliedschaft endet unmittelbar.

Der direkte Austritt benötigt wie jeder freiwillige Austritt eine ausdrückliche Bestätigung im Frontend und wird als Ende der Mitgliedschaft protokolliert.

Führt der Austritt dazu, dass die Organisation keinen Owner mehr besitzt, wird die Stadtverwaltung automatisch darüber informiert.

## Organisation ohne Owner

Eine Organisation darf vorübergehend **0 Owner** besitzen.

In diesem Zustand:

- bleiben normale Mitglieder und deren bestehende Rollenrechte weiterhin nutzbar
- bleibt die Organisation öffentlich sichtbar
- erscheint im internen Bereich ein deutlicher Hinweis, dass aktuell kein Owner vorhanden ist
- erscheint die Organisation in einer dafür vorgesehenen Übersicht der Stadtverwaltung

Die fehlende Owner-Rolle führt also nicht automatisch zu einer vollständigen Sperrung der Organisation.

## Notfall-Eingriff der Stadtverwaltung

Hat eine Organisation **überhaupt kein Mitglied mit zugewiesener Owner-Rolle**, darf eine dafür berechtigte Person der Stadtverwaltung im Notfall einem Mitglied dieser Organisation die geschützte Owner-Rolle zuweisen.

Ein `inaktiv/beurlaubt` gesetzter Owner zählt weiterhin als vorhandener Owner. Solange mindestens ein Mitglied die Owner-Rolle besitzt, darf die Stadtverwaltung über die Notfallfunktion keinen weiteren Owner einsetzen.

Ein `inaktiv/beurlaubt` gesetztes normales Mitglied darf durch die Stadtverwaltung **nicht direkt zum Owner gemacht** werden. Es muss zuvor wieder aktiv gesetzt werden.

Für die Notfall-Zuweisung muss kein zusätzlicher Freitext-Grund angegeben werden.

Eine dafür berechtigte Person der Stadtverwaltung darf einem bestehenden Owner die Owner-Rolle auch wieder entziehen. Die Voraussetzung von 0 Ownern gilt nur für das **Einsetzen** eines neuen Owners, nicht für den Entzug.

Beim Entzug der Owner-Rolle durch die Stadtverwaltung bleibt die betroffene Person **Mitglied der Organisation**. Die Stadtverwaltung muss dabei eine vorhandene aktive normale Rolle auswählen, auf die die Person unmittelbar zurückgestuft wird.

Sowohl das Einsetzen als auch das Entziehen einer Owner-Rolle durch die Stadtverwaltung wird protokolliert. Das Protokoll enthält mindestens:

- Organisation
- Art des Eingriffs (`Owner eingesetzt` oder `Owner entzogen`)
- betroffene Person
- ausführende Person der Stadtverwaltung
- gegebenenfalls die nach dem Entzug ausgewählte normale Rolle
- Datum und Uhrzeit

Die betroffene Person wird über den Eingriff benachrichtigt. Auch die übrigen Owner der Organisation werden über entsprechende Stadtverwaltungs-Eingriffe informiert.

Die Stadtverwaltung wird durch einen solchen Eingriff nicht selbst Mitglied oder Owner der Organisation und erhält dadurch keinen dauerhaften Zugriff auf interne Organisationsdaten.

## Ehemalige Mitglieder

Jede Organisation erhält eine interne Ansicht **`Ehemalige Mitglieder`**.

Dort werden mindestens angezeigt:

- ehemalige Person
- Eintrittsdatum der zuletzt beendeten Mitgliedschaft
- Austritts- beziehungsweise Entfernungsdatum
- letzte Rolle in der Organisation
- optionaler Entfernungsgrund, sofern bei einer Entfernung einer angegeben wurde

Ein optionaler Entfernungsgrund ist dort nur für Owner sowie entsprechend berechtigte Personen der Stadtverwaltung sichtbar.

Die Ansicht ehemaliger Mitglieder wird **12 Monate** aufbewahrt. Danach darf der Eintrag automatisch entfernt werden.

Wird eine ehemalige Person erneut aufgenommen, verschwindet der bisherige Eintrag aus der Ansicht `Ehemalige Mitglieder`. Frühere Mitgliedschaftszeiträume werden dort nicht als getrennte Historie weitergeführt. Die Person erhält bei der Wiederaufnahme immer die aktuelle Standardrolle.

Vorhandene frühere interne Mitgliedsnotizen werden bei einer Wiederaufnahme wieder sichtbar.

Ein gespeicherter früherer Entfernungsgrund darf nachträglich **nicht geändert** werden.

Owner können Einträge aus `Ehemalige Mitglieder` **nicht manuell löschen**.

Dafür berechtigte Personen der Stadtverwaltung dürfen die Liste ehemaliger Mitglieder einsehen.

Von einem ehemaligen Mitglied erstellte interne Dokumente oder Akten bleiben nach dem Austritt beziehungsweise der Entfernung **erhalten**.

In der späteren Anzeige dieser erhaltenen Inhalte wird der ursprüngliche Autor jedoch **nicht mit Name oder Nexus-ID sichtbar dargestellt**.

Ehemalige Mitglieder werden niemals auf der öffentlichen Mitgliederliste angezeigt.

## Sicherheitsabfragen im Frontend

Folgende Aktionen benötigen vor der endgültigen Ausführung eine ausdrückliche Bestätigung:

- freiwilliger Austritt aus einer Organisation
- freiwillige Abgabe der eigenen Owner-Rolle
- Löschen einer normalen Rolle
- Ernennung eines neuen Owners
- Wechsel der Standardrolle

Bei der Owner-Ernennung muss die Sicherheitsabfrage ausdrücklich darauf hinweisen, dass die Person danach vollständige Owner-Rechte besitzt.

## Sicherheitsregel

Berechtigungen müssen serverseitig beziehungsweise über Supabase/RLS geprüft werden. Eine reine Ausblendung von Schaltflächen im Frontend reicht nicht aus.

Eine Organisation erhält durch ihre eigenen Rollen niemals automatisch Zugriff auf Daten anderer Organisationen oder geschützte Bereiche anderer Module.

Protokolle dürfen von normalen Organisationsmitgliedern nicht manipuliert oder gelöscht werden.

## Bestehende Mitgliederdaten

`organization_members.role_title` kann vorerst weiterhin den sichtbaren Rollentitel speichern.

Für das vollständige Rollen- und Berechtigungssystem wird später eine eigene Rollenstruktur ergänzt. Jede Organisationsmitgliedschaft erhält genau eine Rollenreferenz; ein Many-to-Many-System zwischen Mitgliedern und Rollen ist nicht notwendig.
