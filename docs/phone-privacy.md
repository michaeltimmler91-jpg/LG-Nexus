# LG Nexus – Sichtbarkeit der Telefonnummer

Die Telefonnummer ist optional. Der Bürger entscheidet selbst, wer seine hinterlegte Telefonnummer sehen darf.

## Sichtbarkeitsstufen

- `nobody` – Niemand
- `citizens` – Nur freigeschaltete Nexus-Bürger
- `authorities` – Nur Behörden / staatliche Stellen
- `citizens_and_authorities` – Bürger und Behörden
- `own_organization` – Nur Mitglieder der eigenen Firma / Organisation
- `everyone` – Alle

Die Standardeinstellung ist `nobody`.

Die gewählte Sichtbarkeitsstufe muss bei jeder Anzeige der Telefonnummer serverseitig berücksichtigt werden. Eine versteckte Telefonnummer darf nicht lediglich im Frontend ausgeblendet werden.

Bei `own_organization` wird die Nummer nur Nutzern angezeigt, die über eine aktive Mitgliedschaft zur selben Firma oder Organisation gehören. Die genaue Behandlung mehrerer gleichzeitiger Organisationsmitgliedschaften wird separat festgelegt.
