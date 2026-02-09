# Beispiel-Input: Guided Mode Antworten

Dieses Dokument zeigt beispielhafte Antworten eines Product Owners, der den Guided Mode durchläuft. Szenario: CRM-System für ein mittelständisches Vertriebsteam.

---

## Phase 1: Projekt-Kontext

### Schritt 1: Projekt-Vision
**Frage:** "Beschreibe in 2-3 Sätzen, was deine Software können soll."

**Antwort:**
> "Wir brauchen ein System, mit dem unser Vertriebsteam Leads verwalten und den Status von Verkaufsgesprächen tracken kann. Momentan machen wir das alles in Excel und Outlook, und es gehen ständig Leads verloren."

---

### Schritt 2: Zielgruppe
**Frage:** "Wer wird die Software hauptsächlich nutzen?"

**Antworten:**
- **Rollen:** Vertriebsmitarbeiter (15), Vertriebsleiter (3), Backoffice (2)
- **Anzahl User:** 10-50
- **Technisches Level:** 2 von 5 ("Nutzen Office und E-Mail, mehr nicht")

---

### Schritt 3: Kategorie
**Frage:** "In welche Kategorie fällt deine Software am ehesten?"

**Antwort:** CRM / Kundenmanagement

---

### Schritt 4: Bestehende Systeme
**Frage:** "Gibt es bereits ein System, das ersetzt oder ergänzt werden soll?"

**Antwort:** Ja, wir ersetzen ein bestehendes System

**Folgefrage:** "Welches System? Was funktioniert gut, was nicht?"

**Antwort:**
> "Wir haben alles in Excel-Tabellen und Outlook-Ordnern. Excel funktioniert für einfache Listen, aber wir haben keine gemeinsame Sicht auf Leads. Wenn ein Kollege krank ist, weiß niemand, wo seine Leads stehen. Outlook-Erinnerungen gehen oft unter."

---

## Phase 2: Schmerzpunkte & Prioritäten

### Schritt 5: Hauptproblem
**Frage:** "Was ist der größte Schmerz, den die Software lösen soll?"

**Antwort:** (Mehrfachauswahl)
- [x] Leads gehen verloren, weil sie nur in E-Mails/Excel stehen
- [x] Kein Überblick über den Status von Verkaufsgesprächen
- [ ] Manuelles Reporting
- [x] Teamübergaben funktionieren nicht

**Zusatz-Freitext:**
> "Besonders schlimm ist, wenn ein Vertriebsmitarbeiter das Unternehmen verlässt. Dann sind alle seine Kontakte und Gesprächsnotizen weg."

---

### Schritt 6: Top-Funktionen
**Frage:** "Welche 3 Funktionen sind am wichtigsten?"

**Ranking:**
1. Lead-Erfassung und -Verwaltung
2. Pipeline/Kanban-Ansicht
3. Kontakthistorie

*(Nicht gewählt: E-Mail-Integration, Reporting, Kalender)*

---

### Schritt 7: Plattform
**Frage:** "Auf welchen Geräten soll die Software genutzt werden?"

**Antwort:**
- [x] Desktop (Büro-PC/Laptop)
- [x] Smartphone

**Folgefrage:** "Muss die App auch offline funktionieren?"

**Antwort:** Teilweise (Lesen ja, Bearbeiten nein)
> "Die Vertriebler sind viel unterwegs. Sie sollten zumindest Kontaktdaten und Notizen offline lesen können."

---

## Phase 3: Trade-off-Fragen

### Schritt 8a: Lead-Erfassung Detail
**Frage:** "Du willst Lead-Erfassung als Top-Priorität. Wie schnell soll das gehen?"

**Antwort:** Standard (Name, Firma, Telefon, E-Mail, Quelle)
> "Gute Balance zwischen Geschwindigkeit und Datenqualität"

---

### Schritt 8b: Echtzeit-Sync
**Frage:** "Sollen Änderungen an Leads in Echtzeit für alle sichtbar sein?"

**Antwort:** Nach Seitenaktualisierung (Near-Realtime)
> "Wir brauchen kein Echtzeit. Wenn ich die Seite aktualisiere und dann die neuesten Daten sehe, reicht das."

---

### Schritt 8c: E-Mail-Integration
**Frage:** "Wie wichtig ist die Integration mit eurem E-Mail-System?"

**Antwort:** E-Mails manuell zuordnen reicht
> "Wäre schön, aber ist nicht essentiell. Wir können Notizen auch manuell aus Mails übertragen."

---

## Phase 4: Zusammenfassung bestätigt

### Schritt 9
**Zusammenfassung angezeigt:**

| Feld | Wert |
|---|---|
| Projekt | CRM für Vertriebsteam |
| Nutzer | 20 (15 Vertriebler + 3 Leiter + 2 Backoffice) |
| Hauptproblem | Leads gehen in Excel/Outlook verloren |
| Top-3 | Lead-Erfassung, Pipeline-Ansicht, Kontakthistorie |
| Plattform | Desktop + Smartphone (Offline-Lesen) |
| Sync | Near-Realtime |
| E-Mail | Manuell |

**User-Aktion:** "Ja, stimmt -- User Stories generieren"

---

## Metadaten

- **Session-Dauer:** 22 Minuten
- **Schritte durchlaufen:** 9 von 13
- **Übersprungene Schritte:** Zeitrahmen (1.5), Budget (5.3)
- **Rückfragen des Users:** 0
- **Änderungen an Zusammenfassung:** 0
