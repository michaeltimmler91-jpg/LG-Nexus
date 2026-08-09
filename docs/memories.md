# LG Nexus – Memories

Dieses Dokument beschreibt den verbindlichen Stand des Memories-Moduls nach Auswertung bis Frage 3410.

## Albumarten

Nexus unterstützt:

- persönliche Memories-Alben von Bürgern
- Organisations-Alben
- Event-Memories; ein Event kann mehrere Memories-Alben besitzen

Persönliche Alben werden vom jeweiligen Bürger selbst verwaltet. Organisations- und Eventalben werden über passende Organisationsrechte verwaltet.

## Persönliche Alben

Jeder aktive Bürger darf eigene Alben erstellen.

Sichtbarkeit je Album:

- privat
- ausgewählte Bürger
- aktive Nexus-Bürger
- öffentlich

Die Sichtbarkeit ist je Album einstellbar. Persönliche Alben werden jedoch **nicht** in der öffentlichen `Entdecken`-Galerie gezeigt und sind nicht über eine öffentliche Memories-Suche auffindbar. Ein öffentlich freigegebenes persönliches Album kann nur über seinen vorgesehenen direkten Kontext/Link erreicht werden.

Ein persönliches Album kann optional mit einem Event verknüpft werden.

Gemeinsame Albumverwaltung durch mehrere Bürger ist nicht vorgesehen.

## Bilder

Bilder werden über externe Bildlinks eingebunden.

- keine feste maximale Bildanzahl pro persönlichem Album
- Bildunterschriften erlaubt
- Bildbeschreibungen/Alternativtexte erlaubt
- kein separates RP-Bilddatum, das vom normalen Eintragsdatum abweicht
- optionaler Bezug zu einer LS-Map-Position

## Personenmarkierungen

Personen können auf einem Memories-Bild markiert werden.

- mehrere Personen pro Bild möglich
- Markierung wird erst aktiv, nachdem die markierte Person sie bestätigt hat
- die markierte Person kann ihre Markierung später jederzeit selbst entfernen
- Änderungen/Markierungen lösen die vorgesehenen Nexus-Benachrichtigungen aus

## Kommentare und Reaktionen

Öffentliche Memories-Inhalte können:

- Emoji-Reaktionen erhalten
- öffentliche Kommentare erhalten

Der Album-Owner kann Kommentare für sein Album deaktivieren.

Album-Favoriten sind nicht vorgesehen.

## Melden und Moderation

Bürger dürfen unangemessene Bilder beziehungsweise Alben melden.

Die Stadtverwaltung kann gemeldete öffentliche Memories-Inhalte moderieren oder entfernen. Der Eigentümer wird über eine Moderations-/Entfernungsmaßnahme benachrichtigt.

Die Meldefunktion ist öffentlich nutzbar, der eigentliche Moderationsvorgang bleibt intern.

## Löschen und Aufbewahrung

Ein Bürger darf eigene persönliche Alben löschen.

Gelöschte persönliche Alben verbleiben **14 Tage** im Papierkorb und werden danach endgültig entfernt.

Für Organisations-/Eventalben kann eine deaktivierte/entfernte Darstellung unmittelbar verschwinden. Eine zusätzliche allgemeine Langzeit-Archivfunktion für alte Memories-Alben ist nicht vorgesehen.

## Event-Memories

Event-Memories bleiben fachlich von der normalen Eventverwaltung getrennt. Die bestehenden Event-Regeln zur Freigabe vorgeschlagener Bilder gelten weiterhin.

Event-Memories dürfen mehrere Alben besitzen.

## Öffentliche Galerie

Eine öffentliche `Entdecken`-/Galerieseite ist vorgesehen.

Sie enthält keine persönlichen Alben. Eine öffentliche Volltext-/Filtersuche über Memories ist derzeit nicht vorgesehen.

## Nicht vorgesehen

- gemeinsame Bürgerverwaltung eines persönlichen Albums
- Favorisieren von Memories-Alben
- öffentliche Memories-Suche
- eigene Sortierfunktion für Alben
- separate Archivfunktion für alte Alben

## Sicherheit

Sichtbarkeit muss serverseitig geprüft werden. Ein privates oder nur für ausgewählte Bürger freigegebenes Album darf weder über Suche, API, Direkt-ID noch Bildmetadaten gegenüber Unberechtigten offengelegt werden.
