<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Claude_API-Sonnet-7C3AED?style=for-the-badge&logo=anthropic" alt="Claude API" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<h1 align="center">Guided Requirements Tool</h1>

<p align="center">
  <strong>Strukturierte Anforderungserfassung mit KI</strong><br />
  Von der Projekt-Idee zu professionellen User Stories in 5 Minuten.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> &bull;
  <a href="#-features">Features</a> &bull;
  <a href="#-tech-stack">Tech Stack</a> &bull;
  <a href="#%EF%B8%8F-architektur">Architektur</a> &bull;
  <a href="#-beitragen">Beitragen</a>
</p>

---

## Das Problem

**70 % der IT-Projekte scheitern an unklaren Anforderungen.**

Product Owner kennen ihre Branche, ihre Kunden und ihre Prozesse. Was ihnen fehlt: die Erfahrung, dieses Wissen in strukturierte, entwicklertaugliche User Stories zu formulieren. Das Ergebnis sind vage Anforderungen wie *"Das System soll benutzerfreundlich sein"* -- keine Basis, auf der ein Entwicklungsteam arbeiten kann.

## Die Lösung

Das **Guided Requirements Tool** ersetzt das leere Textfeld durch einen gefu&#x308;hrten Interview-Prozess. Kontextbasierte Fragen, kategorieabha&#x308;ngige Vorschla&#x308;ge und KI-gestu&#x308;tzte Generierung liefern am Ende ein vollsta&#x308;ndiges Anforderungsdokument:

- **User Stories** im Standardformat mit messbaren Akzeptanzkriterien
- **Nicht-funktionale Anforderungen** (Performance, Security, Plattformen)
- **Sprint-Plan** mit empfohlener Umsetzungsreihenfolge
- **Offene Fragen**, die vor Entwicklungsstart gekla&#x308;rt werden sollten

---

## Features

| Feature | Beschreibung |
|---|---|
| **Guided Interview** | 10+ kontextbasierte Fragen in 3 Phasen statt freier Texteingabe |
| **9 Software-Kategorien** | CRM, ERP, E-Commerce, Workflow, Reporting, Collaboration, Portal, Mobile App u.a. |
| **KI-Zusammenfassungen** | Zwischenzusammenfassungen zur Validierung nach jeder Phase |
| **User Story Generierung** | 5-8 priorisierte Stories mit Akzeptanzkriterien via Claude API |
| **NFR-Ableitung** | Automatische nicht-funktionale Anforderungen aus dem Projektkontext |
| **Sprint-Planung** | Empfohlene Umsetzungsreihenfolge als Tabelle |
| **PDF-Export** | Professionelles Anforderungsdokument als PDF-Download |
| **Responsive UI** | Glassmorphism-Design, optimiert fur Desktop und Mobile |

---

## Quick Start

### Voraussetzungen

- [Node.js](https://nodejs.org/) 18+
- [Anthropic API Key](https://console.anthropic.com/)

### Installation

```bash
# Repository klonen
git clone https://github.com/Lengi96/guided-requirements-tool.git
cd guided-requirements-tool/app

# Abha&#x308;ngigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.local.example .env.local
# -> ANTHROPIC_API_KEY in .env.local eintragen

# Entwicklungsserver starten
npm run dev
```

Die App ist dann erreichbar unter [http://localhost:3000](http://localhost:3000).

### Umgebungsvariablen

| Variable | Erforderlich | Beschreibung |
|---|---|---|
| `ANTHROPIC_API_KEY` | Ja | API-Key von [console.anthropic.com](https://console.anthropic.com/) |
| `ANTHROPIC_MODEL` | Nein | Claude-Modell (Default: `claude-sonnet-4-5-20250929`) |

---

## Tech Stack

| Schicht | Technologie | Zweck |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Full-Stack React mit Server-Side API Routes |
| **Frontend** | React 19, TypeScript 5 | Typsichere UI-Entwicklung |
| **Styling** | Tailwind CSS 4, shadcn/ui | Utility-First CSS mit accessible Components |
| **State** | Zustand 5 | Leichtgewichtiges Client-State-Management |
| **KI** | Anthropic Claude API | User Story Generierung und Zusammenfassungen |
| **PDF** | @react-pdf/renderer | Server-seitige PDF-Generierung |
| **Icons** | Lucide React | Konsistente Icon-Bibliothek |

---

## Architektur

```
app/src/
|-- app/
|   |-- page.tsx                  # Landing Page
|   |-- guided/page.tsx           # Guided Interview (10+ Steps)
|   |-- results/page.tsx          # Ergebnis-Dashboard
|   |-- api/
|       |-- generate/route.ts     # Claude API -> User Stories
|       |-- summarize/route.ts    # Phasen-Zusammenfassungen
|       |-- export/pdf/           # PDF-Generierung
|
|-- components/
|   |-- ui/                       # shadcn/ui Basiskomponenten
|   |-- results/                  # Story Cards, NFRs, Sprint-Plan
|
|-- hooks/
|   |-- use-guided-form.ts        # Zustand Store (Form-State)
|
|-- lib/
    |-- types.ts                  # TypeScript Interfaces
    |-- questions.ts              # Kategorien, Pain Points, Features
    |-- prompts.ts                # Claude System- und Generation-Prompts
    |-- parser.ts                 # Strukturiertes Parsing der KI-Antwort
```

### Datenfluss

```
User Input (Guided Form)
        |
        v
  Zustand Store (Client State)
        |
        v
  /api/summarize  -->  Phasen-Zusammenfassung (Claude)
        |
        v
  /api/generate   -->  User Stories + NFRs + Sprint-Plan (Claude)
        |
        v
  Parser (Regex-basiert mit Fallbacks)
        |
        v
  Results Dashboard  -->  /api/export/pdf  -->  PDF Download
```

---

## Guided Interview Phasen

| Phase | Steps | Inhalt |
|---|---|---|
| **1. Projekt-Kontext** | Vision, Zielgruppe, Kategorie, Bestehendes System | Grundlegende Projektinformationen erfassen |
| **2. Schmerzpunkte & Priorita&#x308;ten** | Probleme, Top-3-Features, Plattformen, Offline | Kategorieabha&#x308;ngige Vorschla&#x308;ge mit Multiple Choice |
| **3. Strategie & Abschluss** | Projekt-Strategie, E-Mail (optional) | Ausrichtung festlegen, Generierung starten |

---

## API Endpoints

| Endpoint | Methode | Beschreibung |
|---|---|---|
| `/api/generate` | POST | Generiert User Stories, NFRs, Sprint-Plan via Claude |
| `/api/summarize` | POST | Erstellt KI-Zusammenfassung einer Interview-Phase |
| `/api/export/pdf` | POST | Generiert PDF-Anforderungsdokument |

---

## Projektstruktur

```
guided-requirements-tool/
|-- app/                   # Next.js Web-Applikation
|-- docs/                  # Technische Dokumentation
|   |-- question-catalog.md
|   |-- prompt-engineering.md
|   |-- export-formats.md
|-- examples/              # Beispiel-Inputs und -Outputs
|   |-- example-input.md
|   |-- example-output.md
|   |-- crm-case-study.md
|-- mvp/                   # MVP-Guide (No-Code mit Tally + Make.com)
|-- ARCHITECTURE.md        # Architektur-Vergleich MVP vs. Full Version
|-- USER_FLOW.md           # Detaillierter User Flow
|-- CONTRIBUTING.md        # Beitragsrichtlinien
|-- LICENSE                # MIT-Lizenz
```

---

## Scripts

```bash
npm run dev       # Entwicklungsserver starten
npm run build     # Production Build erstellen
npm start         # Production Server starten
npm run lint      # ESLint ausfuhren
```

---

## Beitragen

Beitra&#x308;ge sind willkommen! Siehe [CONTRIBUTING.md](./CONTRIBUTING.md) fur Details.

1. Fork erstellen
2. Feature-Branch anlegen (`git checkout -b feature/mein-feature`)
3. Commits erstellen (`git commit -m 'Add: Mein Feature'`)
4. Branch pushen (`git push origin feature/mein-feature`)
5. Pull Request erstellen

---

## Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](./LICENSE) lizenziert.

---

<p align="center">
  <sub>Entwickelt von <a href="https://github.com/Lengi96">Christoph Lengowski</a></sub>
</p>
