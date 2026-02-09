# MVP: No-Code Implementation

> Tally + Make.com + Claude API → PDF per E-Mail

## Was du bekommst

Beta-Tester öffnen einen Tally-Link, beantworten 10 geführte Fragen (~15-20 Minuten) und erhalten automatisch generierte User Stories als PDF per E-Mail.

## Architektur

```
┌──────────┐     ┌──────────────────────┐     ┌──────────────┐
│  Tally   │────>│  Make.com            │────>│  E-Mail      │
│  Formular│     │  ┌─────────────────┐ │     │  mit PDF     │
│  (10     │     │  │ Claude API      │ │     │  Anhang      │
│  Fragen) │     │  │ (Sonnet 4)     │ │     │              │
│          │     │  └─────────────────┘ │     │              │
└──────────┘     │  ┌─────────────────┐ │     └──────────────┘
                 │  │ Google Docs     │ │
                 │  │ → PDF Export    │ │
                 │  └─────────────────┘ │
                 └──────────────────────┘
```

## Setup-Zeit

| Schritt | Dauer |
|---|---|
| Tally-Formular erstellen | 2-3 Stunden |
| Make.com Szenario aufbauen | 3-4 Stunden |
| Google Docs Template | 30 Minuten |
| Testing | 1-2 Stunden |
| **Gesamt** | **~1 Arbeitstag** |

## Anleitung

1. [Tally-Formular einrichten](./tally-setup.md)
2. [Make.com Szenario konfigurieren](./make-scenario.md)
3. [Google Docs Template erstellen](./google-docs-template.md)
4. [Claude API Prompt](./claude-prompt-mvp.md)
5. [Testen](./testing-guide.md)

## Kosten

Siehe [Kostenübersicht](./cost-estimate.md).

**Kurzfassung:** ~42 USD/Monat für bis zu 100 Beta-Tester.

## Voraussetzungen

- [ ] Tally Pro Account ($29/Monat) -- für Conditional Logic
- [ ] Make.com Core Account ($9/Monat) -- für Automatisierung
- [ ] Claude API Key (console.anthropic.com) -- vorhanden
- [ ] Google Account -- für Docs Template + PDF-Export
- [ ] E-Mail-Adresse für Absender (z.B. Gmail oder eigene Domain)

## MVP vs. Full Version

| Feature | MVP | Full Version |
|---|---|---|
| Fragen | 10 (statisch) | 28 (dynamisch, KI-gesteuert) |
| Interaktion | Formular → E-Mail | Echtzeit-Konversation |
| Verfeinerung | Nein | Ja, iterativ |
| Export | PDF per E-Mail | JIRA, Confluence, PDF |
| Accounts | Keine | User-Dashboard |
| Kosten/Monat | ~42 USD | Hosting + API (~100+ USD) |
