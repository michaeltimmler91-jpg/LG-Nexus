# LG Nexus – Medical

Dieses Dokument beschreibt den verbindlichen, bewusst einfachen Stand des Medical-Moduls.

## Grundsatz

Medical soll keine komplizierte Krankenhaussoftware sein. Für jeden Bürger gibt es genau **eine Krankenakte**. In dieser Akte werden wenige wichtige Stammdaten gepflegt und Behandlungen als kurze, nachvollziehbare Einträge gespeichert.

## Patientensuche

Medical kann Patienten nach Name, Nexus-ID und Geburtsdatum suchen. Telefonnummern werden nur angezeigt beziehungsweise bei der Suche berücksichtigt, wenn die Privatsphäre des Bürgers dies für den suchenden Mitarbeiter erlaubt.

## Krankenakte

Die Krankenakte enthält die Bürger-Stammdaten als schreibgeschützte Identität:

- Name
- Nexus-ID
- Geburtsdatum

Medical pflegt nur die medizinisch wichtigen Stammdaten:

- Blutgruppe
- Allergien
- Notfallkontakte
- wichtige medizinische Hinweise

Es gibt innerhalb der normalen Krankenakte **keinen separaten Diagnosekatalog, kein eigenes Medikamentenmodul, keine Laborverwaltung und kein komplexes Behandlungsschema**.

Wenn bei einer Behandlung beispielsweise ein Medikament gegeben wurde, wird dies einfach im Behandlungstext dokumentiert.

## Behandlung eintragen

Medical klickt in der geöffneten Krankenakte auf eine neue Behandlung und trägt ein, was gemacht wurde.

Automatisch gespeichert werden:

- Behandlungsnummer
- Datum und Uhrzeit
- behandelnder Medical-Mitarbeiter
- Behandlungstext
- verwendete Vorlage, falls vorhanden

Eine Behandlung wird beim Speichern direkt als dokumentierter Vorgang abgelegt. Ein zusätzlicher Offen-/Abgeschlossen-Arbeitsablauf ist nicht nötig.

## Behandlungsvorlagen

Berechtigte Mitarbeiter können Behandlungsvorlagen anlegen und bearbeiten.

Eine Vorlage besteht aus:

- Name
- vorbefülltem Behandlungstext

Beim Anlegen einer Behandlung wählt Medical optional eine Vorlage. Der Text wird übernommen und kann für den konkreten Patienten noch angepasst werden.

Beispiele:

- Wundversorgung
- Verbandwechsel
- allgemeine Behandlung
- Nachkontrolle

## Nachbehandlung

Beim Speichern einer Behandlung gibt es genau eine Entscheidung:

**Nachbehandlung erforderlich: Ja / Nein**

Wenn Nein gewählt wird, ist nichts Weiteres nötig.

Wenn Ja gewählt wird, werden nur folgende Angaben benötigt:

- Termin an einem bestimmten Datum **oder** innerhalb eines Datumsbereichs
- stichpunktartige Kontrollpunkte

Beispiel:

- Wundheilung kontrollieren
- Schwellung prüfen
- Verband kontrollieren
- Beweglichkeit prüfen

## Patient war zur Nachbehandlung da

Offene Nachbehandlungen werden in der Krankenakte deutlich angezeigt.

Wenn der Patient zur Nachbehandlung erscheint, muss Medical nur auf **„Patient war da“** klicken.

Nexus speichert automatisch:

- Datum und Uhrzeit der Bestätigung
- bestätigenden Medical-Mitarbeiter

Die Nachbehandlung gilt danach als erledigt und bleibt in der Behandlungshistorie sichtbar.

## Aufbewahrung

Einmal gespeicherte Behandlungen und erledigte Nachbehandlungen bleiben nachvollziehbar. Sie werden nicht automatisch gelöscht.

## Berechtigungen

Der Medical-Bereich bleibt rechtebasiert. Insbesondere werden getrennt geprüft:

- Medical öffnen
- Krankenakten lesen
- medizinische Stammdaten bearbeiten
- Behandlungen anlegen
- Nachbehandlungen bestätigen
- Behandlungsvorlagen verwalten

Technische Administratoren, Stadtverwaltung, Police, Fire & Rescue und Justice erhalten durch ihre jeweilige Rolle keinen automatischen Zugriff auf Krankenakten.

## Andere Medical-Bereiche

Wissensdatenbank, Ausbildung, Testpatienten, Wissenstests und Abwesenheiten sind eigenständige organisatorische Medical-Bereiche. Sie gehören nicht in die Krankenakte und ändern den bewusst einfachen Behandlungsablauf nicht.

## Technischer Übergang

Frühere Tabellen für strukturierte Diagnosen, Allergien und Medikamente bleiben vorerst nur zur Datenhistorie erhalten. Der normale Browser-Arbeitsablauf verwendet sie nicht mehr. Neue medizinische Einträge erfolgen über die vereinfachte Krankenakte und den Behandlungstext.
