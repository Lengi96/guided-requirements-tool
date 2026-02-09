# Kostenübersicht MVP

Monatliche und pro-Session Kosten für den No-Code MVP.

---

## Fixkosten (monatlich)

| Tool | Plan | Kosten/Monat | Wofür |
|---|---|---|---|
| **Tally** | Pro | $29 | Formular mit Conditional Logic, Webhooks |
| **Make.com** | Core | $9 | 10.000 Operations/Monat, Webhooks |
| **Google Workspace** | Free | $0 | Google Docs + Drive (privater Account reicht) |
| **E-Mail** | Gmail (Free) | $0 | PDF-Versand |
| **Gesamt Fixkosten** | | **$38/Monat** | |

---

## Variable Kosten (pro Session)

| Aktion | Kosten |
|---|---|
| Claude API (Sonnet 4, ~600 Input + ~3000 Output Tokens) | ~$0.025 |
| Make.com Operations (8 Module pro Run) | ~$0.007 |
| Google Docs API | $0.00 |
| E-Mail-Versand (Gmail) | $0.00 |
| **Gesamt pro Session** | **~$0.032** |

---

## Hochrechnung nach Nutzerzahl

| Sessions/Monat | Variable Kosten | Fix-Kosten | Gesamt/Monat | Pro Session |
|---|---|---|---|---|
| 10 | $0.32 | $38.00 | **$38.32** | $3.83 |
| 50 | $1.60 | $38.00 | **$39.60** | $0.79 |
| 100 | $3.20 | $38.00 | **$41.20** | $0.41 |
| 250 | $8.00 | $38.00 | **$46.00** | $0.18 |
| 500 | $16.00 | $38.00 | **$54.00** | $0.11 |
| 1.000 | $32.00 | $47.00* | **$79.00** | $0.08 |

*Ab ~700 Sessions/Monat: Make.com Upgrade auf Teams ($29/Monat) nötig wegen Operation-Limit.

---

## Break-Even-Rechnung

### Bei $29/Monat Starter-Preis (1 zahlender Kunde)

| | |
|---|---|
| Einnahmen | $29.00 |
| Fixkosten | $38.00 |
| Variable (geschätzt 10 Sessions) | $0.32 |
| **Ergebnis** | **-$9.32** |
| **Break-Even bei** | **2 zahlende Kunden** |

### Bei 5 zahlenden Kunden (Starter-Plan)

| | |
|---|---|
| Einnahmen | $145.00 |
| Fixkosten | $38.00 |
| Variable (geschätzt 50 Sessions) | $1.60 |
| **Ergebnis** | **+$105.40** |

### Bei 1 B2B-Kunde (Enterprise/White-Label)

| | |
|---|---|
| Einnahmen | $299.00 |
| Fixkosten | $38.00 |
| Variable (geschätzt 100 Sessions) | $3.20 |
| **Ergebnis** | **+$257.80** |

---

## Kostenvergleich: MVP vs. Full Version

| | MVP (No-Code) | Full Version |
|---|---|---|
| Setup-Kosten | $0 (nur Zeit) | ~$5.000-15.000 Entwicklung |
| Monatliche Kosten (100 User) | ~$41 | ~$100-200 (Hosting + API) |
| Skalierungsgrenze | ~500-1.000 Sessions | Unbegrenzt |
| Time-to-Market | 1 Woche | 4-8 Wochen |

---

## Optimierungsmöglichkeiten

### Kosten senken
- **Claude API:** Haiku statt Sonnet für einfache Projekte (~70% günstiger, aber geringere Qualität)
- **E-Mail:** Resend.com Free Tier (3.000 E-Mails/Monat kostenlos)
- **Tally:** Kostenlose Version testen (ohne Conditional Logic) -- nur als erster Test

### Kosten-Monitoring
- Make.com Dashboard: Operations pro Szenario überwachen
- Anthropic Console: Token-Verbrauch und Kosten einsehen
- Google Drive: Speicherplatz der generierten PDFs im Auge behalten (15 GB Free)

---

## Zusammenfassung

| Metrik | Wert |
|---|---|
| **Minimale monatliche Kosten** | $38 (ohne Nutzung) |
| **Kosten pro Beta-Tester** | ~$0.03 |
| **Break-Even** | 2 zahlende Kunden (Starter) |
| **Profitabel ab** | 3+ zahlende Kunden |
