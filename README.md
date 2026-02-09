# Guided Requirements Engineering Tool

> Strukturierte Anforderungserfassung für Product Owner, die kein technisches Formulierungs-Know-how brauchen.

## Das Problem

**70% der IT-Projekte scheitern an unklaren Anforderungen.**

Product Owner und Business Analysts in mittelständischen Unternehmen kennen ihre Branche, ihre Kunden und ihre Prozesse. Was ihnen fehlt: die Fähigkeit, dieses Wissen in strukturierte, entwicklertaugliche User Stories zu übersetzen.

Das Ergebnis sind Anforderungen wie:
- *"Das System soll benutzerfreundlich sein"*
- *"Wir brauchen eine moderne Lösung"*
- *"Es soll einfach alles können, was das alte System konnte"*

Solche Aussagen sind keine Anforderungen. Sie führen zu Missverständnissen, Nacharbeiten und gescheiterten Projekten.

## Die Lösung

Das **Guided Requirements Tool** führt Nicht-Techniker durch einen strukturierten Frageprozess und generiert daraus professionelle User Stories mit Akzeptanzkriterien.

**Kein Blank Canvas. Kein freier Chat. Ein geführter Prozess.**

Der Guided Mode stellt kontextbasierte Fragen, schlägt Optionen vor und verfeinert iterativ -- bis am Ende exportfertige User Stories stehen.

### Wie es funktioniert

1. **Kontext erfassen** -- "Beschreibe in 2-3 Sätzen, was deine Software können soll"
2. **Zielgruppe klären** -- Rollen, Nutzeranzahl, technisches Level
3. **Kategorisieren** -- Multiple Choice statt freier Eingabe
4. **Schmerzpunkte identifizieren** -- "Was ist der größte Schmerz, den die Software lösen soll?"
5. **Priorisieren** -- "Welche 3 Funktionen sind am wichtigsten?"
6. **Trade-offs aufzeigen** -- "Echtzeit-Sync erhöht Komplexität und Kosten"
7. **User Stories generieren** -- Automatisch im Standardformat
8. **Iterativ verfeinern** -- "Hier sind 5 User Stories -- welche ist unklar?"

### Output-Format

```
Als [Rolle]
möchte ich [Funktion]
damit [Business Value]

Akzeptanzkriterien:
- [Kriterium 1]
- [Kriterium 2]
- [Kriterium 3]
```

Plus nicht-funktionale Anforderungen zu Performance, Security und Plattformen.

## Warum nicht einfach ChatGPT?

| | ChatGPT / freier Chat | Guided Requirements Tool |
|---|---|---|
| **Einstieg** | Blank Canvas -- User muss wissen, was er fragen soll | Geführter Prozess mit Vorschlägen |
| **Zielgruppe** | Technik-affine User | Product Owner ohne technischen Background |
| **Struktur** | Freitext-Antworten | Strukturierte Fragen + Multiple Choice |
| **Qualität** | Abhängig vom Prompt-Wissen des Users | Konsistente Ergebnisse durch Fragenkatalog |
| **Integration** | Copy-Paste | JIRA-Export, Confluence, PDF |
| **Kontext** | Geht bei langen Sessions verloren | Persistenter Projekt-Kontext |

## Zielgruppe

**Primär:** Product Owner und Business Analysts in mittelständischen Softwarehäusern und IT-Dienstleistern (50-500 Mitarbeiter).

Menschen, die:
- Fachlich kompetent sind, aber keine User Stories schreiben können
- Bisher Anforderungen in Word-Dokumenten oder E-Mails festhalten
- Frustriert sind, weil Entwickler ihre Anforderungen nicht verstehen
- Keine Zeit oder Lust haben, sich in Prompt Engineering einzuarbeiten

**Nicht die Zielgruppe:** Startup-Founder mit technischem Hintergrund oder Senior POs in Tech-Konzernen.

## Business Model

| Plan | Preis | Zielgruppe |
|---|---|---|
| **Starter** | 29 EUR/Monat | Einzelne Product Owner |
| **Professional** | 79 EUR/Monat | PO-Teams, erweiterte Exports |
| **Enterprise / White-Label** | 299 EUR/Monat | Agenturen, IT-Dienstleister |

## Projekt-Status

**Phase 1: Dokumentation & Konzept-Validierung**

- [x] Produkt-Vision und Problem-Definition
- [x] Guided Mode Fragenstruktur
- [x] Architektur-Konzept (MVP + Full Version)
- [x] MVP-Implementierungsanleitung (No-Code)
- [ ] Beta-Tester gewinnen
- [ ] MVP mit No-Code-Tools umsetzen

> Beta-Tester gesucht! Wenn du Product Owner bist und Anforderungen besser formulieren möchtest, melde dich.

## MVP: Jetzt testen

**Der MVP ist bereit zum Aufbau.** Komplette Anleitung im [`/mvp`](./mvp/) Ordner.

| | |
|---|---|
| **Stack** | Tally + Make.com + Claude API |
| **Setup-Zeit** | ~1 Arbeitstag |
| **Kosten** | ~42 USD/Monat für bis zu 100 Beta-Tester |
| **User-Erlebnis** | 10 Fragen → PDF per E-Mail in 5 Minuten |

**Quick Links:**
- [MVP-Überblick](./mvp/README.md)
- [Tally-Formular einrichten](./mvp/tally-setup.md)
- [Make.com Szenario](./mvp/make-scenario.md)
- [Claude API Prompt](./mvp/claude-prompt-mvp.md)
- [Testing Guide](./mvp/testing-guide.md)
- [Kostenübersicht](./mvp/cost-estimate.md)

## Repository-Struktur

```
/
├── README.md                          # Dieses Dokument
├── ARCHITECTURE.md                    # Tech Stack MVP vs. Full Version
├── USER_FLOW.md                       # Guided Mode Step-by-Step
├── mvp/
│   ├── README.md                      # MVP-Überblick und Quick Start
│   ├── tally-setup.md                 # Tally-Formular Konfiguration
│   ├── make-scenario.md               # Make.com Szenario Blueprint
│   ├── google-docs-template.md        # PDF-Template Spezifikation
│   ├── claude-prompt-mvp.md           # Optimierter Single-Shot Prompt
│   ├── testing-guide.md               # Testszenarien und Beta-Plan
│   └── cost-estimate.md               # Kostenaufstellung
├── examples/
│   ├── example-input.md               # Beispiel-Antworten aus dem Guided Mode
│   ├── example-output.md              # Daraus generierte User Stories
│   └── crm-case-study.md             # Vollständiges Beispiel: CRM-Projekt
├── docs/
│   ├── question-catalog.md            # Alle Fragen kategorisiert
│   ├── prompt-engineering.md          # Claude API Prompts
│   └── export-formats.md             # JIRA, Confluence, PDF Specs
└── .gitignore
```

## Kontakt

**Christoph Lengowski**
IT-Berater | Requirements Engineering | Agile Coaching

## Lizenz

Copyright (c) 2026 Christoph Lengowski. Alle Rechte vorbehalten.
