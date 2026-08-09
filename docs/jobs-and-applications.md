# LG Nexus – Stellenangebote und Bewerbungen

Dieses Dokument beschreibt den verbindlichen Stand für Stellenangebote und Bewerbungen bis Frage 3410.

## Stellenangebote

Organisationen dürfen mehrere Stellenangebote gleichzeitig veröffentlichen.

Verwaltung über `Stellenangebote verwalten`.

Grundfunktionen:

- pausieren/reaktivieren
- manuell schließen
- geschlossen verschwindet aus öffentlicher Suche
- optionale Anzahl verfügbarer Stellen
- optional automatisch schließen, wenn alle Plätze besetzt sind
- Bewerbungszahl nicht öffentlich
- Suche, Volltextsuche und Filter nach Organisation/Branche

Pflicht-/Profilfelder:

- Titel
- ausführliche Beschreibung
- gewünschte Rolle/Position
- optionaler Ansprechpartner
- optionaler Organisationsstandort

Ein allgemeines Ablaufdatum ist weiterhin nicht vorgesehen; stattdessen können konkrete **Bewerbungsfristen** verwendet werden.

## Öffentliche und interne Stellen

Normale öffentliche Stellenangebote bleiben vorgesehen.

Zusätzlich kann eine Organisation **interne Stellenangebote nur für bestehende Mitglieder** erstellen.

Vertrauliche Stellenangebote als separate geheime Angebotsart sind nicht vorgesehen.

## Änderungen nach Bewerbungseingang

Nach Eingang der ersten Bewerbung dürfen nur nicht wesentliche Felder normal geändert werden. Bei wesentlichen Änderungen werden vorhandene Bewerber benachrichtigt.

## Direktbewerbung

Aktive Bürger dürfen sich über Nexus bewerben.

Je Stelle können eigene Fragen definiert werden:

- Freitext
- Auswahl
- Ja/Nein
- Pflichtfelder

Automatisch übermittelt werden Name und Nexus-ID. Telefonnummer/Nexus-Mail nur, wenn die persönliche Sichtbarkeit dies erlaubt.

Mit Zustimmung können weitere sichtbare Profildaten übernommen werden.

Maximal **5 externe Links** pro Bewerbung. Kein zusätzlicher allgemeiner Bewerbungstext.

## Mehrfach- und Wiederbewerbung

- keine parallele Doppelbewerbung auf dieselbe aktive Stelle
- mehrere unterschiedliche Stellen derselben Organisation gleichzeitig möglich
- Wiederbewerbung nach Ablehnung auf dieselbe offene Stelle erst nach **14 Tagen**
- Nexus warnt vor offensichtlichen Dubletten

Kein allgemeiner Bewerber-Sperrlisten-Mechanismus.

## Bearbeitung durch Bewerber

Bis zum Bearbeitungsbeginn darf der Bewerber seine Bewerbung ändern.

- Rückziehen möglich
- laufender Status sichtbar
- abgeschlossene Bewerbung für Bewerber danach nicht weiter einsehbar

Zurückgezogene Bewerbungen werden nach den bestehenden Regeln sofort entfernt.

## Status

Grundstatus:

- Neu
- In Prüfung
- Gespräch
- Angenommen
- Abgelehnt

Organisationen dürfen Zusatzstatus anlegen.

Bei jeder Statusänderung erhält der Bewerber eine Nexus-Benachrichtigung. Statuswechsel werden nicht als separater zusätzlicher Auditlog geführt.

Ablehnungsgrund optional und intern.

Bei Annahme: `Als Mitglied aufnehmen`; Aufnahme folgt normalen Mitgliedsregeln und aktueller Standardrolle.

## Rückfragen

Organisation darf nach Bearbeitungsbeginn zusätzliche Informationen anfordern. Antwort erfolgt innerhalb der Bewerbung.

## Bewerbungsrunden und Gespräche

Bewerbungen dürfen mehrere Gesprächs-/Auswahlstufen besitzen.

Vorstellungsgespräch kann als Nexus-Termin angelegt werden:

- im Bewerberkalender
- in Kalendern zuständiger Mitarbeiter
- Bewerber kann Alternativtermin vorschlagen

Strukturiertes Ergebnis:

- Geeignet
- Nicht geeignet
- Zurückgestellt

Keine interne numerische Bewertung und keine internen Bewerber-Tags.

## Praktische Tests / Probeaufgaben

Organisationen können im Bewerbungsverfahren Probeaufgaben beziehungsweise praktische Tests vorsehen.

Diese gehören zum jeweiligen Bewerbungsprozess und erhalten kein separates organisationsübergreifendes Testsystem.

## Bewerbungsfristen

Stellenangebote können eine Bewerbungsfrist besitzen.

Nach Ablauf können verspätete Bewerbungen automatisch abgelehnt beziehungsweise nicht mehr angenommen werden.

## Empfehlungen

Bestehende Organisationsmitglieder können Bewerber empfehlen. Diese Empfehlung ist Teil des jeweiligen internen Bewerbungsverfahrens.

## Übertragung

Eine Bewerbung darf mit Zustimmung des Bewerbers auf ein anderes Stellenangebot **derselben Organisation** übertragen werden. Bewerber wird benachrichtigt.

Eine Übernahme von Bewerbern aus fremden Organisationen ist nicht vorgesehen.

## Nicht vorgesehen

- Talentpool für frühere Bewerber
- Bewerber-Sperrlisten
- vertrauliche/geheime Stellenanzeigen
- organisationsübergreifende Bewerberübernahme

## Interner Bewerbungsbereich

Rechte:

- `Bewerbungen ansehen`
- `Bewerbungen bearbeiten`

Mehrere Bearbeiter möglich; Zuweisung erzeugt Benachrichtigung.

Interne Kommentare sind für Bewerber unsichtbar.

Keine eigene interne Volltextsuche/Filterfunktion und kein separater Stellenfilter im Bewerbungsbereich.

## Aufbewahrung

- abgelehnt: 6 Monate
- angenommen: 6 Monate
- zurückgezogen: sofort entfernen

## Stadtverwaltung

Dafür berechtigte Stadtverwaltungsmitglieder dürfen Bewerbungen normaler Organisationen ansehen/bearbeiten. Geschützte Fachorganisationen können strengere Sonderregeln besitzen.

## Technische Leitplanken

Benötigt werden Stellen, interne Stellen, Fragen/Antworten, Fristen, Mehrstufenprozesse, praktische Tests, Empfehlungen, Gesprächstermine, Zuweisungen, Kommentare und 14-Tage-Wiederbewerbungssperre.

Bewerbungs- und Kontaktdaten müssen serverseitig nach Rollenrechten und persönlicher Privatsphäre geschützt werden.
