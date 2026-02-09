# User Flow: Guided Mode

## Überblick

Der Guided Mode ist das Herzstück des Tools. Er führt Nicht-Techniker Schritt für Schritt durch die Anforderungserfassung -- ohne Vorkenntnisse in User-Story-Formulierung.

## Prinzipien

1. **Keine leere Seite** -- Der User startet nie mit einem Blank Canvas
2. **Vorschläge statt Freitext** -- Wo möglich, Multiple Choice oder Vorschläge anbieten
3. **Kontext aufbauen** -- Jede Frage baut auf vorherigen Antworten auf
4. **Trade-offs transparent machen** -- Konsequenzen von Entscheidungen aufzeigen
5. **Iterativ verfeinern** -- Ergebnisse gemeinsam mit dem User verbessern

---

## Phase 1: Projekt-Kontext (3-5 Minuten)

### Schritt 1: Projekt-Vision
```
Frage: "Beschreibe in 2-3 Sätzen, was deine Software können soll."

Hilfestellung: "Stell dir vor, du erklärst einem Kollegen in der
Kaffeeküche, worum es geht."

Beispiel: "Wir brauchen ein System, mit dem unser Vertriebsteam Leads
verwalten und den Status von Verkaufsgesprächen tracken kann."
```

**KI-Aktion:** Extrahiert Keywords, identifiziert Domäne, bereitet kontextspezifische Folgefragen vor.

### Schritt 2: Zielgruppe
```
Frage: "Wer wird die Software hauptsächlich nutzen?"

Eingaben:
- Rolle(n): [Freitext mit Vorschlägen]
  → Vorschläge basierend auf Schritt 1: "Vertriebsmitarbeiter",
    "Vertriebsleiter", "Backoffice"
- Anzahl User: [Dropdown: 1-10, 10-50, 50-200, 200+]
- Technisches Level: [Skala: "Nutzt kaum PC" bis "Power User"]
```

### Schritt 3: Kategorie
```
Frage: "In welche Kategorie fällt deine Software am ehesten?"

Multiple Choice (basierend auf Schritt 1):
□ CRM / Kundenmanagement
□ ERP / Ressourcenplanung
□ Workflow / Prozessautomatisierung
□ Reporting / Dashboards
□ Kommunikation / Collaboration
□ E-Commerce / Shop
□ Andere: [Freitext]
```

### Schritt 4: Bestehende Systeme
```
Frage: "Gibt es bereits ein System, das ersetzt oder ergänzt werden soll?"

Optionen:
○ Ja, wir ersetzen ein bestehendes System
  → Folgefrage: "Welches System? Was funktioniert gut, was nicht?"
○ Ja, wir ergänzen bestehende Systeme
  → Folgefrage: "Welche Systeme müssen angebunden werden?"
○ Nein, kompletter Neustart
```

---

## Phase 2: Schmerzpunkte & Prioritäten (5-8 Minuten)

### Schritt 5: Hauptproblem
```
Frage: "Was ist der größte Schmerz, den die Software lösen soll?"

Hilfestellung: "Denk an den Moment, in dem du denkst: 'Das muss
doch besser gehen!'"

Vorschläge (kontextbasiert für CRM):
□ Leads gehen verloren, weil sie nur in E-Mails/Excel stehen
□ Kein Überblick über den Status von Verkaufsgesprächen
□ Reporting ist manuell und zeitaufwendig
□ Teamübergaben funktionieren nicht sauber
□ Anderes: [Freitext]
```

### Schritt 6: Top-Funktionen
```
Frage: "Welche 3 Funktionen sind am wichtigsten? Sortiere sie
nach Priorität."

Drag & Drop Ranking (kontextbasiert):
1. ___  [Lead-Erfassung und -Verwaltung]
2. ___  [Pipeline/Kanban-Ansicht]
3. ___  [Reporting und Dashboards]
4. ___  [E-Mail-Integration]
5. ___  [Kalender und Aufgaben]
6. ___  [Kontakthistorie]
7. ___  [Andere: ___]

Anweisung: "Ziehe die 3 wichtigsten nach oben."
```

### Schritt 7: Plattform
```
Frage: "Auf welchen Geräten soll die Software genutzt werden?"

Multiple Choice:
□ Desktop (Büro-PC/Laptop)
□ Tablet (iPad, etc.)
□ Smartphone
□ Alle Geräte (Responsive)

Folgefrage bei Mobile:
"Muss die App auch offline funktionieren?
(z.B. Vertriebsmitarbeiter beim Kundenbesuch ohne Internet)"
```

---

## Phase 3: Trade-off-Fragen (3-5 Minuten)

### Schritt 8: Komplexitäts-Trade-offs

Die KI generiert Trade-off-Fragen basierend auf den bisherigen Antworten:

```
Frage 8a: "Du willst Lead-Erfassung als Top-Priorität.
Wie schnell soll das gehen?"

○ Minimal (Name + Telefon, 2 Felder)
  → "Schnell gebaut, aber wenig Daten für Reporting"
○ Standard (Name, Firma, Telefon, E-Mail, Quelle)
  → "Gute Balance zwischen Geschwindigkeit und Datenqualität"
○ Umfangreich (20+ Felder, Custom Fields)
  → "Maximale Daten, aber Erfassung dauert länger"
```

```
Frage 8b: "Sollen Änderungen an Leads in Echtzeit für alle
sichtbar sein?"

○ Ja, sofort (Echtzeit-Sync)
  → "Technisch aufwendiger, höhere Serverkosten"
○ Nach Seitenaktualisierung (Near-Realtime)
  → "Einfacher umzusetzen, für die meisten Teams ausreichend"
○ Einmal täglich synchronisieren
  → "Am einfachsten, aber Daten können veraltet sein"
```

```
Frage 8c: "Wie wichtig ist die Integration mit eurem E-Mail-System?"

○ Muss direkt integriert sein (Outlook/Gmail)
  → "Aufwendig, aber spart dem Team viel Zeit"
○ E-Mails manuell zuordnen reicht
  → "Weniger Aufwand, aber zusätzliche Klicks"
○ Brauchen wir nicht
```

---

## Phase 4: Generierung & Verfeinerung (5-10 Minuten)

### Schritt 9: Zusammenfassung
```
"Basierend auf deinen Antworten habe ich folgendes verstanden:

Projekt: CRM für Vertriebsteam
Nutzer: 20 Vertriebsmitarbeiter + 3 Teamleiter
Hauptproblem: Leads gehen in E-Mails verloren
Top-3-Funktionen: Lead-Erfassung, Pipeline-Ansicht, Reporting
Plattform: Desktop + Smartphone (mit Offline-Funktion)
E-Mail-Integration: Direkte Outlook-Anbindung

Stimmt das so? Möchtest du etwas ändern?"

○ Ja, stimmt -- User Stories generieren
○ Nein, ich möchte Änderungen vornehmen → [zurück zum relevanten Schritt]
```

### Schritt 10: User Stories generieren

Die KI generiert User Stories im Standardformat:

```
Ich habe 8 User Stories generiert. Hier die Top 3 nach Priorität:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User Story 1: Lead-Erfassung                          Priorität: HOCH

Als Vertriebsmitarbeiter
möchte ich neue Leads in max. 3 Klicks erfassen können
damit ich bei Kundengesprächen nicht den Fokus verliere

Akzeptanzkriterien:
✓ Pflichtfelder: Name, Firma, Telefon
✓ Automatische Zeitstempel-Erfassung
✓ Optionale Notizen (Freitext)
✓ Erfolgsbestätigung sichtbar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Story 2...]
[Story 3...]

Möchtest du:
○ Alle 8 Stories sehen
○ Eine Story verfeinern
○ Neue Anforderungen ergänzen
○ Exportieren
```

### Schritt 11: Iterative Verfeinerung
```
Frage: "Welche Story möchtest du verfeinern?"

[User wählt Story 1]

"Was fehlt oder ist unklar bei der Lead-Erfassung?"

Vorschläge:
□ Felder anpassen (mehr/weniger Pflichtfelder)
□ Duplikat-Erkennung ergänzen
□ Quelle des Leads erfassen (Messe, Website, Empfehlung)
□ Lead einem Teammitglied zuweisen
□ Anderes: [Freitext]
```

---

## Phase 5: Nicht-funktionale Anforderungen (2-3 Minuten)

### Schritt 12: NFRs ableiten

Basierend auf den Antworten leitet die KI nicht-funktionale Anforderungen ab:

```
"Basierend auf deinen Angaben (20 User, Mobile, Echtzeit) empfehle
ich folgende technische Anforderungen:"

Performance:
○ Seitenaufbau unter 2 Sekunden ✓ [empfohlen für 20 User]
○ Seitenaufbau unter 1 Sekunde  [nur nötig bei 200+ User]

Security:
○ Standard (Passwort-Login, HTTPS)
○ Erweitert (2FA, Audit-Log) ✓ [empfohlen bei Kundendaten]
○ Enterprise (SSO, IP-Whitelist)

Verfügbarkeit:
○ Bürozeiten (Mo-Fr 8-18 Uhr)
○ Erweitert (Mo-Sa 7-22 Uhr) ✓ [empfohlen für Vertrieb]
○ 24/7

"Möchtest du diese Empfehlungen übernehmen oder anpassen?"
```

---

## Phase 6: Export (1 Minute)

### Schritt 13: Export
```
"Dein Anforderungsdokument ist fertig! Wie möchtest du es erhalten?"

○ PDF herunterladen
○ Nach Notion exportieren
○ JIRA-Tickets erstellen (Coming Soon)
○ Confluence-Seite erstellen (Coming Soon)
○ Alles oben genannte
```

---

## Zeitübersicht

| Phase | Dauer | Schritte |
|---|---|---|
| 1. Projekt-Kontext | 3-5 Min | Schritt 1-4 |
| 2. Schmerzpunkte & Prioritäten | 5-8 Min | Schritt 5-7 |
| 3. Trade-off-Fragen | 3-5 Min | Schritt 8 |
| 4. Generierung & Verfeinerung | 5-10 Min | Schritt 9-11 |
| 5. NFRs | 2-3 Min | Schritt 12 |
| 6. Export | 1 Min | Schritt 13 |
| **Gesamt** | **19-32 Min** | **13 Schritte** |

## Besonderheiten des Guided Mode

### Adaptive Fragen
Nicht alle User durchlaufen alle Schritte. Die KI entscheidet basierend auf dem Kontext:
- Einfaches internes Tool → weniger Security-Fragen
- Kundenportal → mehr Security- und UX-Fragen
- Mobile App → Offline-Fragen
- Ersatz für Altsystem → Migrationsfragen

### Vorschlags-Engine
Jede Frage kommt mit kontextbasierten Vorschlägen:
- Schritt 1 erwähnt "Vertrieb" → Schritt 6 schlägt CRM-typische Features vor
- Schritt 7 wählt "Mobile" → Schritt 8 fragt nach Offline-Fähigkeit
- Schritt 5 erwähnt "Kundendaten" → Schritt 12 empfiehlt erweiterte Security

### Fortschrittsanzeige
```
[████████████░░░░░░░░] 60% -- Schritt 8 von 13
Geschätzte Restzeit: 8 Minuten
```
