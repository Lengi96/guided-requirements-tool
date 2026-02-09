# Case Study: CRM für Vertriebsteam der Müller & Partner GmbH

Vollständiges Beispiel eines Guided-Mode-Durchlaufs -- von der ersten Frage bis zum fertigen Anforderungsdokument.

---

## Unternehmensprofil

| | |
|---|---|
| **Firma** | Müller & Partner GmbH (fiktiv) |
| **Branche** | IT-Dienstleistung / Managed Services |
| **Mitarbeiter** | 85 |
| **Vertriebsteam** | 15 Außendienst, 3 Teamleiter, 2 Backoffice |
| **Bisheriges System** | Excel + Outlook |
| **Budget-Rahmen** | 50.000 - 150.000 EUR |
| **Timeline** | Go-Live in 6 Monaten |

---

## Ausgangssituation

Sabine Meier ist Product Owner bei Müller & Partner. Sie kennt die Vertriebsprozesse in- und auswendig, hat aber noch nie User Stories geschrieben. Ihr letzter Versuch, Anforderungen zu formulieren, endete in einem 40-seitigen Word-Dokument, das der Entwicklungspartner als "nicht umsetzbar" zurückgab.

**Ihre Frustration:** "Ich weiß genau, was wir brauchen. Aber die Entwickler verstehen mich nicht, und ich verstehe deren Sprache nicht."

---

## Guided Mode: Durchlauf

### Schritt 1 -- Projekt-Vision

**Tool:** "Beschreibe in 2-3 Sätzen, was deine Software können soll."

**Sabine:** "Wir brauchen eine zentrale Stelle, wo alle im Vertrieb ihre Leads eintragen und den Fortschritt sehen können. Wenn jemand krank wird oder die Firma verlässt, darf kein Lead verloren gehen."

**KI-Analyse:**
- Domäne: CRM / Vertrieb
- Keywords: zentral, Leads, Fortschritt, Teamübergabe
- Implizite Anforderungen: Persistenz, Teamzugang, Ausfallsicherheit

---

### Schritt 2 -- Zielgruppe

**Sabine:**
- Hauptnutzer: Vertriebsmitarbeiter (15 Personen)
- Weitere: Vertriebsleiter (3), Backoffice (2)
- Technisches Level: 2/5 ("Die meisten können gerade Excel und Outlook")

**KI-Notiz:** Niedrige technische Affinität → UI muss besonders intuitiv sein. Komplexe Funktionen brauchen Onboarding.

---

### Schritt 3 -- Kategorie

**Sabine:** CRM / Kundenmanagement

---

### Schritt 4 -- Bestehende Systeme

**Sabine:** "Ja, wir ersetzen Excel und Outlook."

**Folgefrage:** "Was funktioniert gut, was nicht?"

**Sabine:** "Excel ist flexibel, das ist gut. Aber jeder hat seine eigene Tabelle, es gibt keine gemeinsame Sicht. Wenn ein Kollege krank ist, müssen wir seine E-Mails durchforsten, um den Stand zu finden. Das kostet uns im Schnitt 5 Stunden pro Woche."

**KI-Notiz:** 5h/Woche × 52 Wochen × geschätzter Stundensatz 50 EUR = 13.000 EUR/Jahr an verschwendeter Zeit. Relevanter ROI-Datenpunkt.

---

### Schritt 5 -- Hauptproblem

**Sabine wählt:**
- [x] Leads gehen verloren
- [x] Kein Überblick über Verkaufsgespräche
- [x] Teamübergaben funktionieren nicht

**Freitext:** "Letzten Monat haben wir einen Großauftrag verloren, weil ein Vertriebler den Follow-up vergessen hat. Der Lead lag in seinem persönlichen Outlook."

---

### Schritt 6 -- Top-Funktionen

**Sabines Ranking:**
1. Lead-Erfassung und -Verwaltung
2. Pipeline/Kanban-Ansicht
3. Kontakthistorie

**Nicht priorisiert:** E-Mail-Integration, Reporting, Kalender

---

### Schritt 7 -- Plattform

**Sabine:** Desktop + Smartphone
**Offline:** "Die Vertriebler sollen zumindest Kontaktdaten lesen können, wenn sie im Zug sitzen."

---

### Schritt 8 -- Trade-offs

**8a: Lead-Erfassung-Umfang**
Sabine wählt: Standard (Name, Firma, Telefon, E-Mail, Quelle)
"Wenn wir zu viele Felder haben, tragen die Leute gar nichts ein."

**8b: Echtzeit-Sync**
Sabine wählt: Near-Realtime
"Wir brauchen kein Live-Ticker. Wenn ich F5 drücke und es ist aktuell, reicht das."

**8c: E-Mail-Integration**
Sabine wählt: Manuell
"Wäre schön, aber erstmal brauchen wir die Basics."

---

### Schritt 9 -- Zusammenfassung

Sabine bestätigt die Zusammenfassung ohne Änderungen.

**Session-Dauer bis hierhin:** 18 Minuten

---

## Generiertes Ergebnis

### User Stories (Übersicht)

| # | Titel | Priorität | Aufwand | Sprint |
|---|---|---|---|---|
| US-1 | Lead-Erfassung | HOCH | M | 1 |
| US-2 | Pipeline/Kanban | HOCH | L | 3 |
| US-3 | Kontakthistorie | HOCH | M | 2 |
| US-4 | Lead-Übergabe | MITTEL | S | 4 |
| US-5 | Login & Rollen | MITTEL | M | 1 |
| US-6 | Mobile Ansicht | MITTEL | M | 5 |
| US-7 | Lead-Suche | NIEDRIG | S | 2 |
| US-8 | Duplikat-Warnung | NIEDRIG | S | 4 |

### Detaillierte User Stories

*(Vollständige Stories siehe `example-output.md`)*

---

### Schritt 10-11 -- Verfeinerung

**Tool:** "Hier sind 8 User Stories. Welche möchtest du verfeinern?"

**Sabine:** "Story 2, die Pipeline-Ansicht. Ich will, dass man auch nach Umsatzvolumen filtern kann."

**KI:** "Verstanden. Soll das Umsatzvolumen bei der Lead-Erfassung (US-1) als optionales Feld ergänzt werden?"

**Sabine:** "Ja, genau. Geschätztes Auftragsvolumen."

**KI aktualisiert US-1:**
- Neues optionales Feld: Geschätztes Auftragsvolumen (EUR)

**KI aktualisiert US-2:**
- Neues Akzeptanzkriterium: Filter nach geschätztem Auftragsvolumen (Bereiche: <10k, 10k-50k, 50k-100k, >100k)
- Neues Akzeptanzkriterium: Summe des Auftragsvolumens pro Spalte sichtbar

---

### Schritt 12 -- NFRs

**Tool zeigt Empfehlungen basierend auf Kontext:**

| NFR | Empfehlung | Sabines Entscheidung |
|---|---|---|
| Performance | Unter 2 Sek. (20 User) | Übernommen |
| Security | Erweitert (Kundendaten) | "Ja, wir haben Kundendaten, 2FA ist wichtig" |
| Verfügbarkeit | Mo-Sa 7-22 Uhr | "Mo-Fr reicht, wir arbeiten nicht samstags" → Angepasst |
| Sprache | Nur Deutsch | Übernommen |

---

### Schritt 13 -- Export

**Sabine wählt:** PDF herunterladen

**Generiertes Dokument:** 12 Seiten
- Projektübersicht (1 Seite)
- 8 User Stories mit Akzeptanzkriterien (8 Seiten)
- NFRs (1 Seite)
- Offene Fragen (1 Seite)
- Abhängigkeitsdiagramm (1 Seite)

---

## Ergebnis-Bewertung

### Vorher (ohne Tool)
- 40-seitiges Word-Dokument
- Vage Formulierungen ("benutzerfreundlich", "schnell", "modern")
- Keine Akzeptanzkriterien
- Keine Priorisierung
- Entwicklungspartner konnte nicht starten
- **Zeitaufwand:** 2 Wochen

### Nachher (mit Guided Requirements Tool)
- 8 strukturierte User Stories
- 40 testbare Akzeptanzkriterien
- Klare Priorisierung (MoSCoW)
- Sprint-Planung möglich
- Entwicklungspartner kann direkt loslegen
- **Zeitaufwand:** 25 Minuten

### ROI-Betrachtung

| Faktor | Berechnung |
|---|---|
| Zeitersparnis pro Projekt | 2 Wochen → 25 Minuten |
| Vermiedene Nacharbeiten | ca. 30% weniger Änderungsanfragen (Branchenschnitt) |
| Vermiedene Lead-Verluste | 13.000 EUR/Jahr (5h/Woche × 50 EUR) |
| Tool-Kosten | 79 EUR/Monat (Professional Plan) |
| **Break-even** | **Nach dem ersten Projekt** |

---

## Lessons Learned

1. **Technisches Level beachten:** Sabine brauchte keine Fachbegriffe. Das Tool übersetzte "gemeinsame Sicht" in "Multi-User Dashboard mit Filterung".

2. **Trade-offs funktionieren:** Sabine hätte ohne Trade-off-Fragen wahrscheinlich "alles sofort" verlangt. Die Fragen halfen bei realistischer Priorisierung.

3. **Verfeinerung ist wertvoll:** Die zusätzliche Anforderung "Auftragsvolumen" wäre in einem statischen Formular nicht aufgetaucht. Erst durch das Sehen der Stories wurde der Wunsch konkret.

4. **Offene Fragen generieren Folgeaufträge:** Die 4 offenen Fragen (DSGVO, Import, Reporting, Aufbewahrung) führen zu weiteren Sessions -- wiederkehrende Nutzung des Tools.
