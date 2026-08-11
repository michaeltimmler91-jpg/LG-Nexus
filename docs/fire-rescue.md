# LG Nexus – Fire & Rescue

Fire & Rescue ist bewusst als schneller Arbeitsbereich aufgebaut. Im Einsatz sollen nur die Informationen erfasst werden, die später wirklich nützlich sind.

## Aktuelle Bereiche

Die Oberfläche besitzt vier Bereiche:

- **Einsätze**
- **Objekte**
- **Fahrzeuge / Geräte**
- **Wissen**

## Einsätze

Ein neuer Einsatz benötigt nur:

- Einsatzart
- Ort
- Einheiten optional
- Fahrzeuge optional
- kurze Lage
- Maßnahmen

Jeder Einsatz erhält automatisch eine eindeutige Nummer im Format `FD-000001`.

Status:

- Offen
- Erledigt

Während ein Einsatz offen ist, können die Daten bearbeitet und kurze Verlaufseinträge ergänzt werden. Ein erledigter Einsatz kann bei Bedarf wieder geöffnet werden.

Nicht Bestandteil der einfachen Version sind zusätzliche Einsatzabschnitte, komplexe Führungsstrukturen, Ressourcenanforderungen oder separate Abschlussformulare.

## Objekte

Die Objektübersicht dient als schnelle Hilfe vor oder während eines Einsatzes.

Pro Objekt können gepflegt werden:

- Name
- Adresse / Ort
- Zufahrt
- Hydrant / Wasser
- besondere Gefahren
- weitere Hinweise

Es gibt bewusst keine separate Gefahrstoff-, Plan-, Prüf- oder Hydrantenverwaltung. Solche Informationen können bei Bedarf direkt im Objekt vermerkt werden.

## Fahrzeuge / Geräte

Fahrzeuge und wichtige Geräte können gemeinsam gepflegt werden.

Je Eintrag:

- Art: Fahrzeug oder Gerät
- Name
- Kennung optional
- Status
- kurzer Hinweis
- einfache Checkliste

Status:

- Einsatzbereit
- Defekt
- In Wartung
- Außer Dienst

Eine umfangreiche Lager-, Ausgabe- oder Wartungshistorie ist für die aktuelle Version nicht vorgesehen.

## Wissen

Die interne Wissenssammlung enthält kurze praktische Einträge mit:

- Titel
- Kategorie optional
- Inhalt

Sie ist für Anleitungen und wichtige interne Informationen gedacht. Ausbildungstests und umfangreiche Lernverwaltung sind nicht Teil der aktuellen Fire-Version.

## Rechte

Fire & Rescue besitzt getrennte Rechte für Anzeigen und Bearbeiten der vier Bereiche. Der Standardrang `Einsatzdienst` sowie die `Leitung` erhalten die aktuellen Fire-Rechte.

Eine Mitgliedschaft bei einer anderen Organisation oder technische Administration gewährt keinen automatischen Zugriff auf Fire & Rescue.

## Technische Umsetzung

Die Fachdaten liegen in eigenen Fire-Tabellen. Direkter Browserzugriff auf diese Tabellen ist gesperrt. Die Oberfläche arbeitet ausschließlich über geprüfte Funktionen, die die Fire-Berechtigungen des angemeldeten Benutzers serverseitig kontrollieren.
