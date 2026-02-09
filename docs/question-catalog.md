# Fragenkatalog

Alle Fragen des Guided Mode, kategorisiert und mit Logik-Hinweisen für die Implementierung.

## Legende

- **[P]** = Pflichtfrage (immer gestellt)
- **[K]** = Kontextabhängig (nur bei bestimmten Antworten)
- **[O]** = Optional (User kann überspringen)
- **→** = Folgefrage wird ausgelöst

---

## Kategorie 1: Projekt-Kontext

### 1.1 Projekt-Vision [P]
**Frage:** "Beschreibe in 2-3 Sätzen, was deine Software können soll."
**Typ:** Freitext
**Hilfestellung:** "Stell dir vor, du erklärst einem Kollegen in der Kaffeeküche, worum es geht."
**Beispiel-Antwort:** "Wir brauchen ein System, mit dem unser Vertriebsteam Leads verwalten kann."
**KI-Verarbeitung:** Keyword-Extraktion, Domänen-Erkennung, Vorbereitung kontextspezifischer Folgefragen.

### 1.2 Zielgruppe [P]
**Frage:** "Wer wird die Software hauptsächlich nutzen?"
**Typ:** Kombiniert (Freitext + Dropdown + Skala)
**Unterfelder:**
- Rolle(n): Freitext mit KI-Vorschlägen basierend auf 1.1
- Anzahl User: Dropdown (1-10, 10-50, 50-200, 200+)
- Technisches Level: Skala 1-5 ("Nutzt kaum PC" bis "Power User")

### 1.3 Software-Kategorie [P]
**Frage:** "In welche Kategorie fällt deine Software am ehesten?"
**Typ:** Multiple Choice (Einfachauswahl + Freitext-Option)
**Optionen:**
- CRM / Kundenmanagement
- ERP / Ressourcenplanung
- Workflow / Prozessautomatisierung
- Reporting / Dashboards
- Kommunikation / Collaboration
- E-Commerce / Shop
- Portal (Kunden-/Mitarbeiterportal)
- Mobile App
- Andere: [Freitext]

**KI-Verarbeitung:** Kategorie bestimmt Vorschläge in späteren Fragen.

### 1.4 Bestehende Systeme [P]
**Frage:** "Gibt es bereits ein System, das ersetzt oder ergänzt werden soll?"
**Typ:** Single Choice mit Folgefragen
**Optionen:**
- Ja, Ersatz → **1.4a:** "Welches System? Was funktioniert gut, was nicht?"
- Ja, Ergänzung → **1.4b:** "Welche Systeme müssen angebunden werden?"
- Nein, Neustart

### 1.5 Projektzeitrahmen [O]
**Frage:** "Gibt es einen festen Termin oder eine Deadline?"
**Typ:** Single Choice
**Optionen:**
- Ja, fester Go-Live-Termin → **1.5a:** "Welches Datum?"
- Grober Zeitrahmen → **1.5b:** Dropdown (3 Monate, 6 Monate, 12 Monate, offen)
- Keine Deadline

---

## Kategorie 2: Schmerzpunkte & Motivation

### 2.1 Hauptproblem [P]
**Frage:** "Was ist der größte Schmerz, den die Software lösen soll?"
**Typ:** Multiple Choice + Freitext (kontextbasierte Optionen)
**Hilfestellung:** "Denk an den Moment, in dem du denkst: 'Das muss doch besser gehen!'"

**Optionen nach Kategorie:**

**CRM:**
- Leads gehen verloren (E-Mails/Excel)
- Kein Überblick über Verkaufsgespräche
- Manuelles Reporting
- Teamübergaben funktionieren nicht
- Kundendaten sind verstreut

**Workflow:**
- Prozesse sind nicht dokumentiert
- Freigaben dauern zu lange
- Keine Nachvollziehbarkeit
- Zu viele manuelle Schritte
- Medienbrüche (Papier → Digital)

**E-Commerce:**
- Bestellprozess zu kompliziert
- Lagerverwaltung nicht synchron
- Kundenservice überlastet
- Keine Personalisierung
- Zahlungsintegration fehlt

### 2.2 Auswirkung des Problems [K]
**Bedingung:** Wird gestellt, wenn 2.1 beantwortet
**Frage:** "Was passiert konkret, wenn das Problem nicht gelöst wird?"
**Typ:** Multiple Choice + Freitext
**Optionen:**
- Umsatzverlust
- Kunden wechseln zur Konkurrenz
- Mitarbeiter sind frustriert
- Compliance-Risiken
- Zeitverschwendung (geschätzte Stunden pro Woche: [Dropdown])

---

## Kategorie 3: Funktionale Anforderungen

### 3.1 Top-Funktionen [P]
**Frage:** "Welche 3 Funktionen sind am wichtigsten? Sortiere sie nach Priorität."
**Typ:** Drag & Drop Ranking
**Optionen:** Kontextbasiert (s.u.) + "Andere: [Freitext]"

**CRM-Vorschläge:**
1. Lead-Erfassung und -Verwaltung
2. Pipeline/Kanban-Ansicht
3. Reporting und Dashboards
4. E-Mail-Integration
5. Kalender und Aufgaben
6. Kontakthistorie
7. Angebots-/Rechnungserstellung
8. Automatische Erinnerungen

**Workflow-Vorschläge:**
1. Formular-basierte Eingabe
2. Freigabe-Workflows
3. Benachrichtigungen
4. Audit Trail / Nachvollziehbarkeit
5. Dokumenten-Management
6. Status-Tracking
7. Automatische Eskalation
8. Berichterstellung

### 3.2 Funktionsdetails [K]
**Bedingung:** Für jede der Top-3-Funktionen aus 3.1
**Frage:** "Erzähl mir mehr über [Funktion X]. Was genau soll passieren?"
**Typ:** Kombination aus geführten Fragen

Beispiel für "Lead-Erfassung":
- "Welche Daten sollen erfasst werden?" → Checkbox-Liste + Freitext
- "Wer darf Leads anlegen?" → Rollen-Auswahl
- "Soll eine Duplikat-Erkennung stattfinden?" → Ja/Nein
- "Woher kommen die Leads?" → Checkbox (Manuell, Website-Formular, Import, API)

### 3.3 User-Rollen und Berechtigungen [K]
**Bedingung:** Wenn mehr als eine Rolle in 1.2 genannt
**Frage:** "Welche Rolle darf was?"
**Typ:** Matrix (Rollen x Aktionen)

```
                    | Lesen | Erstellen | Bearbeiten | Löschen | Admin
Vertriebsmitarbeiter|  ✓   |    ✓     |    ✓       |   ✗    |   ✗
Teamleiter          |  ✓   |    ✓     |    ✓       |   ✓    |   ✗
Admin               |  ✓   |    ✓     |    ✓       |   ✓    |   ✓
```

---

## Kategorie 4: Plattform & Technik

### 4.1 Geräte [P]
**Frage:** "Auf welchen Geräten soll die Software genutzt werden?"
**Typ:** Multiple Choice (Mehrfachauswahl)
**Optionen:**
- Desktop (Büro-PC/Laptop)
- Tablet
- Smartphone
- Alle (Responsive)

### 4.2 Offline-Fähigkeit [K]
**Bedingung:** Wenn Tablet oder Smartphone in 4.1
**Frage:** "Muss die App auch offline funktionieren?"
**Typ:** Single Choice
**Optionen:**
- Ja, vollständig offline → **4.2a:** "Welche Funktionen müssen offline verfügbar sein?"
- Teilweise (Lesen ja, Bearbeiten nein)
- Nein, immer online

### 4.3 Browser-Anforderungen [K]
**Bedingung:** Wenn Desktop in 4.1
**Frage:** "Welche Browser müssen unterstützt werden?"
**Typ:** Multiple Choice
**Optionen:**
- Nur aktuelle Browser (Chrome, Firefox, Edge, Safari)
- Auch ältere Versionen (IE11)
- Egal / keine Vorgabe

### 4.4 Integrationen [O]
**Frage:** "Welche bestehenden Systeme sollen angebunden werden?"
**Typ:** Checkbox + Freitext
**Optionen:**
- Microsoft 365 (Outlook, Teams, SharePoint)
- Google Workspace
- Slack
- JIRA / Confluence
- SAP
- Andere ERP-Systeme
- Eigene APIs
- Keine Integrationen nötig

---

## Kategorie 5: Trade-offs

### 5.1 Geschwindigkeit vs. Umfang [P]
**Frage:** "Was ist dir wichtiger?"
**Typ:** Slider oder Single Choice
**Optionen:**
- Schnell fertig mit Basisfunktionen → dann iterativ erweitern
- Alles auf einmal, dafür dauert es länger

### 5.2 Feature-spezifische Trade-offs [K]
**Bedingung:** Generiert basierend auf Top-Funktionen aus 3.1
**Typ:** Single Choice mit Konsequenz-Hinweis

Beispiel-Template:
```
"Du willst [Funktion]. Wie wichtig ist [Aspekt]?"

○ Option A → "Konsequenz: [positiv] / [negativ]"
○ Option B → "Konsequenz: [positiv] / [negativ]"
○ Option C → "Konsequenz: [positiv] / [negativ]"
```

### 5.3 Budget-Indikation [O]
**Frage:** "Hast du eine Budget-Vorstellung?"
**Typ:** Dropdown
**Optionen:**
- Unter 10.000 EUR
- 10.000 - 50.000 EUR
- 50.000 - 150.000 EUR
- Über 150.000 EUR
- Kein festes Budget
- Möchte ich nicht angeben

---

## Kategorie 6: Nicht-funktionale Anforderungen

### 6.1 Performance [K]
**Bedingung:** Ableitung aus Nutzeranzahl (1.2)
**Frage:** "Wie schnell soll die Anwendung reagieren?"
**Typ:** Single Choice mit Empfehlung
**Optionen:**
- Seitenaufbau unter 3 Sekunden (Standard)
- Seitenaufbau unter 2 Sekunden [empfohlen für X User]
- Seitenaufbau unter 1 Sekunde (Premium)

### 6.2 Security [K]
**Bedingung:** Abhängig von Datensensibilität
**Frage:** "Wie sensibel sind die Daten?"
**Typ:** Single Choice mit Empfehlung
**Optionen:**
- Interne Daten, nicht kritisch → Standard-Security (Login, HTTPS)
- Kundendaten, personenbezogen → Erweitert (2FA, Audit-Log) [empfohlen]
- Hochsensibel (Finanzen, Gesundheit) → Enterprise (SSO, Verschlüsselung, Zertifizierung)

### 6.3 Verfügbarkeit [K]
**Frage:** "Wann muss die Software verfügbar sein?"
**Typ:** Single Choice
**Optionen:**
- Bürozeiten (Mo-Fr 8-18 Uhr)
- Erweitert (Mo-Sa 7-22 Uhr)
- 24/7

### 6.4 Sprache und Lokalisierung [O]
**Frage:** "In welchen Sprachen soll die Software verfügbar sein?"
**Typ:** Multiple Choice
**Optionen:**
- Nur Deutsch
- Deutsch und Englisch
- Mehrsprachig (welche Sprachen?)

---

## Kategorie 7: Verfeinerung

### 7.1 Story-Review [P]
**Frage:** "Hier sind deine User Stories. Welche ist unklar oder unvollständig?"
**Typ:** Liste mit Auswahl + Feedback-Feld
**Aktion:** Ausgewählte Story wird mit Folgefragen verfeinert

### 7.2 Fehlende Anforderungen [P]
**Frage:** "Gibt es noch etwas, das wir vergessen haben?"
**Typ:** Freitext + Vorschläge
**Vorschläge (kontextbasiert):**
- "Was passiert bei Fehlern? (Fehlermeldungen, Retry)"
- "Braucht ihr eine Suchfunktion?"
- "Sollen Daten importiert/exportiert werden können?"
- "Gibt es gesetzliche Vorgaben (DSGVO, Barrierefreiheit)?"

### 7.3 Priorisierung bestätigen [P]
**Frage:** "Bitte bestätige die Reihenfolge der User Stories nach Business Value."
**Typ:** Drag & Drop Ranking der generierten Stories
**Zusatz:** MoSCoW-Labels zuweisen (Must, Should, Could, Won't)
