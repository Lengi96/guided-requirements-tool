# Testing Guide

Testszenarien und Checklisten für den MVP.

---

## Testszenarien

### Szenario 1: CRM-Projekt (Happy Path)

**Eingaben:**

| Frage | Antwort |
|---|---|
| Vision | "Wir brauchen ein System, mit dem unser Vertriebsteam Leads verwalten und den Status von Verkaufsgesprächen tracken kann." |
| Rollen | "15 Vertriebsmitarbeiter, 3 Teamleiter, 2 Backoffice" |
| Anzahl | 10-50 Nutzer |
| Tech-Level | 2/5 |
| Kategorie | CRM / Kundenmanagement |
| System | Ja, ersetzen → "Excel und Outlook. Jeder hat seine eigene Tabelle." |
| Problem | Leads gehen verloren + Kein Überblick |
| Features | 1. Lead-Erfassung, 2. Pipeline-Ansicht, 3. Kontakthistorie |
| Plattform | Desktop + Smartphone → Offline: teilweise |
| Strategie | Schnell starten |
| E-Mail | test@example.com |

**Erwartetes Ergebnis:**
- [ ] E-Mail mit PDF innerhalb von 5 Minuten
- [ ] 5-8 User Stories im PDF
- [ ] Stories sind CRM-spezifisch (Lead-Erfassung, Pipeline, etc.)
- [ ] Akzeptanzkriterien sind konkret und testbar
- [ ] NFRs passen zu 20 Usern und Mobile
- [ ] Offene Fragen sind sinnvoll

---

### Szenario 2: E-Commerce-Projekt

**Eingaben:**

| Frage | Antwort |
|---|---|
| Vision | "Wir wollen einen Online-Shop für unsere handgemachten Möbel. Kunden sollen Produkte konfigurieren und bestellen können." |
| Rollen | "Kunden (extern), 5 Mitarbeiter für Bestellabwicklung" |
| Anzahl | 50-200 Nutzer |
| Tech-Level | 3/5 |
| Kategorie | E-Commerce / Online-Shop |
| System | Nein, Neustart |
| Problem | Bestellprozess zu kompliziert + Keine Personalisierung |
| Features | 1. Produktkatalog, 2. Warenkorb/Checkout, 3. Kundenportal |
| Plattform | Alle Geräte (Responsive) |
| Strategie | Alles auf einmal |
| E-Mail | test@example.com |

**Erwartetes Ergebnis:**
- [ ] Stories sind E-Commerce-spezifisch
- [ ] Kundenrolle und Mitarbeiterrolle unterschieden
- [ ] NFRs berücksichtigen 200+ externe Nutzer (höhere Performance)
- [ ] Security-Empfehlung: Erweitert (Zahlungsdaten)

---

### Szenario 3: Minimal-Input

**Eingaben:**

| Frage | Antwort |
|---|---|
| Vision | "Aufgabenverwaltung für mein Team" |
| Rollen | "5 Mitarbeiter" |
| Anzahl | 1-10 Nutzer |
| Tech-Level | 3/5 |
| Kategorie | Workflow / Prozessautomatisierung |
| System | Nein, Neustart |
| Problem | Zu viele manuelle Schritte |
| Features | 1. Dateneingabe, 2. Status-Tracking, 3. Benachrichtigungen |
| Plattform | Desktop |
| Strategie | Schnell starten |
| E-Mail | test@example.com |

**Erwartetes Ergebnis:**
- [ ] Claude generiert trotz knapper Eingaben sinnvolle Stories
- [ ] Mehr offene Fragen als bei detaillierten Eingaben
- [ ] Mindestens 5 Stories generiert

---

### Szenario 4: Maximal-Input (Stresstest)

**Eingaben:**

| Frage | Antwort |
|---|---|
| Vision | 500 Zeichen langer, detaillierter Text mit vielen Anforderungen |
| Rollen | 6 verschiedene Rollen mit Beschreibungen |
| Anzahl | Mehr als 200 Nutzer |
| Tech-Level | 1/5 (sehr niedrig) |
| Kategorie | ERP / Ressourcenplanung |
| System | Ja, ersetzen → 300 Zeichen Beschreibung des Altsystems |
| Problem | Alle 5 Optionen + langer Freitext |
| Features | Alle 8 Optionen gerankt |
| Plattform | Alle Geräte + Offline vollständig |
| Strategie | Alles auf einmal |
| E-Mail | test@example.com |

**Erwartetes Ergebnis:**
- [ ] Claude bleibt innerhalb der 4096 Token
- [ ] Stories sind trotzdem priorisiert (nicht alle HOCH)
- [ ] NFRs berücksichtigen Enterprise-Anforderungen (200+ User, Offline, ERP)
- [ ] PDF ist vollständig und lesbar

---

## Validierungs-Checkliste

### Formular (Tally)

- [ ] Alle 10 Fragen (+3 konditionale) sind erreichbar
- [ ] Conditional Logic: CRM → CRM-Probleme/Features
- [ ] Conditional Logic: Workflow → Workflow-Probleme/Features
- [ ] Conditional Logic: E-Commerce → E-Commerce-Probleme/Features
- [ ] Conditional Logic: Andere → Standard-Probleme/Features
- [ ] Conditional Logic: System ersetzen → Folgefrage 4a
- [ ] Conditional Logic: System ergänzen → Folgefrage 4b
- [ ] Conditional Logic: Mobile → Offline-Frage 7a
- [ ] Pflichtfelder werden erzwungen
- [ ] Welcome Page wird angezeigt
- [ ] Thank-You Page wird angezeigt
- [ ] Formular in unter 20 Minuten durchlaufbar

### Automatisierung (Make.com)

- [ ] Webhook empfängt Tally-Daten korrekt
- [ ] Alle Variablen werden korrekt gemappt
- [ ] Konditionale Felder (4a/4b, 7a) werden korrekt verarbeitet
- [ ] Claude API wird mit korrektem Prompt aufgerufen
- [ ] Claude-Response wird korrekt geparst
- [ ] Google Doc wird mit Platzhalter-Ersetzung erstellt
- [ ] PDF wird korrekt exportiert
- [ ] E-Mail wird zugestellt (auch Gmail, Outlook, Yahoo)
- [ ] PDF ist im E-Mail-Anhang und lesbar
- [ ] Error Handler funktioniert bei API-Fehler
- [ ] Gesamtdauer unter 120 Sekunden

### Output-Qualität (Claude)

- [ ] 5-8 User Stories generiert
- [ ] Alle Stories im korrekten Format (Als... möchte ich... damit...)
- [ ] Jede Story hat 3-5 Akzeptanzkriterien
- [ ] Akzeptanzkriterien sind testbar (keine vagen Begriffe)
- [ ] Priorisierung ist nachvollziehbar (HOCH/MITTEL/NIEDRIG)
- [ ] NFRs sind vorhanden und zum Kontext passend
- [ ] Offene Fragen sind sinnvoll
- [ ] Sprint-Empfehlung ist vorhanden
- [ ] Gesamter Output auf Deutsch
- [ ] Keine Halluzinationen (keine erfundenen Anforderungen)

### PDF-Qualität

- [ ] Projekt-Name korrekt
- [ ] Datum korrekt
- [ ] E-Mail korrekt
- [ ] User Stories vollständig enthalten
- [ ] Formatierung lesbar (auch wenn Markdown als Plaintext)
- [ ] "Nächste Schritte" Abschnitt vorhanden
- [ ] Kontaktdaten enthalten

---

## Beta-Testing-Plan

### Phase 1: Interner Test (Tag 1-2)

**Tester:** Du selbst + 2-3 Vertrauenspersonen
**Ziel:** Technische Fehler finden und beheben
**Vorgehen:**
1. Alle 4 Testszenarien durchspielen
2. Jede Conditional-Logic-Variante testen
3. Ergebnisse dokumentieren
4. Bugs fixen

### Phase 2: Closed Beta (Woche 1-2)

**Tester:** 10 ausgewählte Personen aus dem Netzwerk
**Ziel:** UX-Feedback und Output-Qualität validieren
**Vorgehen:**
1. Persönliche Einladung per LinkedIn/E-Mail
2. Tally-Link teilen mit kurzer Erklärung
3. Nach 2 Tagen Feedback einholen

**Feedback-Fragen (separates Tally-Formular):**
1. Wie klar waren die Fragen? (1-5)
2. Wie nützlich sind die generierten User Stories? (1-5)
3. Was hat gefehlt?
4. Was war überflüssig?
5. Würdest du dafür bezahlen? Wenn ja, wie viel?
6. Würdest du es einem Kollegen empfehlen?

### Phase 3: Open Beta (Woche 3-4)

**Tester:** 20-50 Personen via LinkedIn-Post
**Ziel:** Skalierung testen, breiteres Feedback
**Vorgehen:**
1. LinkedIn-Post mit Link und Beschreibung
2. Tally-Link öffentlich teilen
3. Automatisches Feedback-Formular nach PDF-Erhalt
4. Make.com Logs monitoren (Fehlerrate, Durchlaufzeit)

### Erfolgskriterien

| Metrik | Ziel |
|---|---|
| Formular-Completion-Rate | > 80% |
| Nützlichkeit der Stories (1-5) | > 3.5 |
| Würde bezahlen | > 50% |
| Weiterempfehlung | > 60% |
| Technische Fehlerrate | < 5% |
| Durchschnittliche Durchlaufzeit | < 3 Minuten |
