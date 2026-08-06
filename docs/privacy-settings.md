# LG Nexus – Privatsphäre-Einstellungen

## Grundregel

Persönliche Informationen werden in LG Nexus nicht automatisch für andere Nutzer freigegeben, wenn für das jeweilige Feld eine Sichtbarkeitseinstellung vorgesehen ist.

Die gewählte Sichtbarkeit gilt auch gegenüber Behörden und staatlichen Stellen. Es gibt keinen pauschalen Behörden-Override.

## Sichtbarkeitsstufen

Für Telefonnummer, Nexus-Mail, Profilbild und vollständiges RP-Geburtsdatum stehen dieselben Sichtbarkeitsstufen zur Verfügung:

- `nobody` – Niemand
- `citizens` – Nur freigeschaltete Nexus-Bürger
- `authorities` – Nur Behörden / staatliche Stellen
- `citizens_and_authorities` – Bürger + Behörden
- `own_organization` – Nur eigene Firma / Organisation
- `everyone` – Alle

Für Telefonnummer und Nexus-Mail ist Standard jeweils `nobody`. Standardwerte für Profilbild und RP-Geburtsdatum werden bei der technischen Umsetzung separat festgelegt.

## Eigene Firma / Organisation

Bei `own_organization` gilt die Freigabe für **alle aktiven Organisationen**, denen der Bürger angehört. Es gibt keine einzelne Hauptorganisation.

Ist ein Bürger beispielsweise gleichzeitig Mitglied eines Unternehmens und einer staatlichen Organisation, können Mitglieder beider Organisationen die freigegebene Information sehen, sofern beide Mitgliedschaften aktiv sind.

## Telefonnummer

Die Telefonnummer ist optional. Ein aktiver Bürger kann seine Telefonnummer selbst ändern oder entfernen und die Sichtbarkeit jederzeit selbst festlegen.

Die Sichtbarkeitseinstellung gilt immer. Auch PD, Medical, Fire & Rescue, Stadtverwaltung oder andere staatliche Organisationen sehen die Nummer nur, wenn die gewählte Sichtbarkeitsstufe dies erlaubt.

## Nexus-Mail

Die interne Nexus-Mail wird nach erfolgreicher Freischaltung automatisch erzeugt. Der Bürger entscheidet anschließend selbst, wer diese Nexus-Mail sehen darf.

Für die Nexus-Mail gelten dieselben Sichtbarkeitsstufen und dieselbe Organisationslogik wie für die Telefonnummer. Auch hier gibt es keinen automatischen Behördenzugriff.

Die Sichtbarkeit der Nexus-Mail hat keinen Einfluss auf die Zustellung interner Nexus-Mails. Sie regelt ausschließlich, ob die Adresse anderen Nutzern in Profilen, Kontaktsuchen oder vergleichbaren Ansichten angezeigt werden darf.

## Profilbild

Für Profilbilder gelten ebenfalls die sechs Nexus-Sichtbarkeitsstufen. Die Freigabe wird serverseitig geprüft; ein verborgenes Profilbild darf nicht über direkte Bild- oder API-Antworten offengelegt werden.

## RP-Geburtsdatum

Das vollständige RP-Geburtsdatum verwendet dieselben sechs Sichtbarkeitsstufen.

Zusätzlich kann ein Bürger alternativ nur **Tag und Monat** seines Geburtstags ohne Geburtsjahr freigeben. Wenn das vollständige Geburtsdatum sichtbar ist, darf Nexus daraus das aktuelle RP-Alter berechnen und anzeigen.

## Nexus-ID

Die Nexus-ID ist **nicht privat** und besitzt keine eigene Sichtbarkeitseinstellung. Sobald ein Account freigeschaltet wurde und eine Nexus-ID erhalten hat, darf diese innerhalb von LG Nexus immer angezeigt und für die Suche verwendet werden.

Die Nexus-ID dient als dauerhaft eindeutige Kennung eines Charakters. Dadurch können Nutzer auch bei identischen oder ähnlichen Namen zuverlässig unterschieden und gezielt gesucht werden.

Beispiel:

- Name: `Lennox Davis`
- Nexus-ID: `NX-000001`

Die Nexus-ID bleibt unverändert und kann vom Bürger nicht ausgeblendet oder geändert werden.

## Personensuche

Die Personensuche darf nach folgenden Merkmalen suchen:

- Vorname und Nachname
- Nexus-ID
- Nexus-Mail
- Telefonnummer
- Firma / Organisation

Name und Nexus-ID sind grundsätzlich als Suchmerkmale verfügbar, sofern der Account für die jeweilige Ansicht suchbar ist.

Die Nexus-Mail darf nur dann als Suchmerkmal verwendet werden, wenn der suchende Nutzer die Nexus-Mail des gesuchten Bürgers gemäß dessen aktueller Sichtbarkeitseinstellung sehen darf. Ist die Nexus-Mail für den Suchenden nicht freigegeben, darf eine Suche nach dieser Mailadresse den Bürger weder als direkten Treffer noch als indirekten Hinweis zurückgeben.

Dasselbe gilt für die Telefonnummer. Der Bürger darf über seine Telefonnummer nur von Nutzern gefunden werden, die diese Telefonnummer gemäß der aktuellen Sichtbarkeitseinstellung auch sehen dürfen. Ist die Telefonnummer für den Suchenden verborgen, liefert auch eine exakte Suche nach der Nummer keinen Treffer und keinen Hinweis darauf, welchem Bürger sie gehört.

Damit schützen die Privatsphäre-Einstellungen nicht nur die Anzeige von Telefonnummer und Nexus-Mail, sondern auch die Auffindbarkeit über diese Kontaktdaten.

### Suche über Firma / Organisation

Eine Firma oder Organisation kann ebenfalls als Suchmerkmal beziehungsweise Filter der Personensuche verwendet werden.

Wird beispielsweise nach einem Unternehmen, einer Behörde oder einer anderen Organisation gesucht, darf LG Nexus die Personen anzeigen, die dort aktuell Mitglied sind und deren Mitgliedschaft für den jeweiligen Suchenden in dieser Ansicht sichtbar ist.

Die Sichtbarkeit einer Organisationsmitgliedschaft wird **nicht vom einzelnen Bürger**, sondern von der jeweiligen Firma oder Organisation festgelegt. Nur dafür berechtigte Organisationsmitglieder dürfen bestimmen, ob die Mitgliedschaften nach außen sichtbar sind.

Die Einstellung gilt **einheitlich für alle Mitglieder der jeweiligen Organisation**. Eine Organisation kann also ihre Mitgliederliste insgesamt sichtbar oder verborgen schalten; es gibt keine individuelle Sichtbarkeit pro Mitarbeiter.

Neue Firmen und Organisationen starten standardmäßig mit **sichtbarer Mitgliederliste**. Eine berechtigte Person der jeweiligen Organisation kann die Mitgliederliste später für die gesamte Organisation ausblenden.

Ist die Mitgliederliste sichtbar, werden bei jedem aktiven Mitglied mindestens folgende Informationen angezeigt:

- Vorname und Nachname
- Nexus-ID
- Position / Rolle innerhalb der Organisation, zum Beispiel Geschäftsführer, Mitarbeiter oder Ausbilder

Die jeweilige Organisation kann ihre Positions- und Rollenbezeichnungen selbst frei festlegen. Es gibt keine stadtweit vorgegebene feste Liste.

Telefonnummer, Nexus-Mail, Profilbild und RP-Geburtsdatum werden durch eine sichtbare Mitgliedschaft nicht automatisch freigegeben. Diese Felder richten sich weiterhin nach den persönlichen Privatsphäre-Einstellungen des jeweiligen Bürgers.

Der Bürger kann die von der Organisation festgelegte Sichtbarkeit seiner Mitgliedschaft nicht selbst überschreiben. Persönliche Daten mit eigener Sichtbarkeit bleiben davon getrennt.

Die Organisationssuche darf keine versteckte Mitgliedschaft offenlegen. Ist die Zugehörigkeit eines Bürgers zu einer Organisation für den Suchenden nicht sichtbar, darf dieser Bürger auch über die Suche nach dieser Organisation nicht als Mitglied gefunden oder indirekt bestätigt werden.

Bei mehreren aktiven Organisationen kann ein Bürger entsprechend über jede Organisation gefunden werden, deren Zugehörigkeit für den Suchenden sichtbar ist.