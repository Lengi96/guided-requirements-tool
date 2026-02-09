# Architektur

## Überblick

Das Guided Requirements Tool wird in zwei Phasen entwickelt:

1. **MVP (No-Code)** -- Schnelle Validierung mit bestehenden Tools (4-6 Wochen)
2. **Full Version (Custom App)** -- Skalierbare Eigenentwicklung

## Phase 1: MVP (No-Code)

### Ziel
Konzept validieren, erste zahlende Kunden gewinnen, Feedback sammeln -- ohne eigene Entwicklung.

### Architektur

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Typeform /  │────>│  Make.com /       │────>│  Notion /        │
│  Tally       │     │  Zapier          │     │  Airtable        │
│  (Quiz-UI)   │     │  + Claude API    │     │  (Speicherung)   │
└─────────────┘     └──────────────────┘     └─────────────────┘
                            │
                            v
                    ┌──────────────────┐
                    │  PDF / Notion    │
                    │  Export          │
                    └──────────────────┘
```

### Komponenten

| Komponente | Tool | Aufgabe |
|---|---|---|
| **Frontend / Quiz-UI** | Typeform oder Tally | Strukturierte Fragen mit Conditional Logic |
| **Automatisierung** | Make.com oder Zapier | Antworten empfangen, Claude API aufrufen, Ergebnis speichern |
| **KI-Verarbeitung** | Claude API (Sonnet 4) | User Stories aus Antworten generieren |
| **Datenspeicherung** | Notion oder Airtable | Projekte und generierte Stories speichern |
| **Output** | PDF-Generation / Notion-Export | Ergebnisse an User ausliefern |

### Datenfluss

1. User beantwortet Fragen im Typeform/Tally-Formular
2. Webhook sendet Antworten an Make.com/Zapier
3. Automatisierung baut Claude API Prompt zusammen (siehe `docs/prompt-engineering.md`)
4. Claude generiert strukturierte User Stories
5. Ergebnisse werden in Notion/Airtable gespeichert
6. User erhält PDF oder Notion-Link per E-Mail

### Limitierungen MVP

- Keine echte Konversation (nur sequenzielle Fragen)
- Begrenzte Conditional Logic in Typeform
- Keine Session-Persistenz für iterative Verfeinerung
- Kein direkter JIRA-Export
- Skalierung auf ca. 50-100 User begrenzt

---

## Phase 2: Full Version (Custom App)

### Ziel
Vollständige Guided-Mode-Erfahrung mit Echtzeit-KI-Interaktion, Projekt-Persistenz und Integrations-Exports.

### Tech Stack

| Schicht | Technologie | Begründung |
|---|---|---|
| **Frontend** | Next.js + Tailwind CSS + shadcn/ui | Server-Side Rendering, schnelle Entwicklung, professionelle UI-Komponenten |
| **Backend** | Next.js API Routes | Gleiche Codebasis wie Frontend, serverless-fähig |
| **Datenbank** | PostgreSQL (Supabase) | Relationale Daten, Row-Level Security, Auth out-of-the-box |
| **Auth** | Supabase Auth | E-Mail/Passwort, SSO für Enterprise |
| **KI** | Claude API (Sonnet 4) | Beste Qualität für strukturierte Textgenerierung |
| **Hosting** | Vercel | Zero-Config Deployment, Edge Functions |
| **Export** | JIRA REST API, Confluence API, PDF (react-pdf) | Direkte Integration in Dev-Workflows |

### Architektur

```
┌──────────────────────────────────────────────────────────┐
│                        Frontend                          │
│                  Next.js + Tailwind + shadcn/ui          │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Guided   │  │ Projekt-     │  │ Export-            │  │
│  │ Mode UI  │  │ Dashboard    │  │ Manager            │  │
│  └──────────┘  └──────────────┘  └───────────────────┘  │
└──────────────────────┬───────────────────────────────────┘
                       │
                       v
┌──────────────────────────────────────────────────────────┐
│                    API Layer                              │
│               Next.js API Routes                         │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ /api/    │  │ /api/        │  │ /api/              │  │
│  │ guided   │  │ projects     │  │ export             │  │
│  └──────────┘  └──────────────┘  └───────────────────┘  │
└───────┬──────────────┬───────────────────┬───────────────┘
        │              │                   │
        v              v                   v
┌──────────────┐ ┌──────────────┐ ┌───────────────────┐
│ Claude API   │ │ PostgreSQL   │ │ JIRA / Confluence  │
│ (Sonnet 4)   │ │ (Supabase)   │ │ / PDF Generation   │
└──────────────┘ └──────────────┘ └───────────────────┘
```

### Datenmodell

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ users            │     │ projects          │     │ user_stories     │
├─────────────────┤     ├──────────────────┤     ├─────────────────┤
│ id (UUID)        │──┐  │ id (UUID)         │──┐  │ id (UUID)        │
│ email            │  └─>│ user_id (FK)      │  └─>│ project_id (FK)  │
│ name             │     │ title             │     │ role             │
│ company          │     │ description       │     │ action           │
│ plan             │     │ category          │     │ benefit          │
│ created_at       │     │ target_users      │     │ priority         │
└─────────────────┘     │ pain_points       │     │ acceptance_crit  │
                        │ status            │     │ status           │
                        │ guided_answers    │     │ version          │
                        │ created_at        │     │ created_at       │
                        └──────────────────┘     └─────────────────┘

┌──────────────────┐
│ nfr (Non-Func.)  │
├──────────────────┤
│ id (UUID)         │
│ project_id (FK)   │
│ category          │
│ requirement       │
│ priority          │
└──────────────────┘
```

### API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| POST | `/api/guided/start` | Neue Guided Session starten |
| POST | `/api/guided/answer` | Antwort senden, nächste Frage erhalten |
| GET | `/api/guided/summary` | Zusammenfassung der bisherigen Antworten |
| POST | `/api/projects` | Projekt erstellen |
| GET | `/api/projects/:id` | Projekt abrufen |
| GET | `/api/projects/:id/stories` | User Stories eines Projekts |
| POST | `/api/projects/:id/generate` | User Stories generieren lassen |
| POST | `/api/projects/:id/refine` | Stories iterativ verfeinern |
| POST | `/api/export/jira` | Export nach JIRA |
| POST | `/api/export/confluence` | Export nach Confluence |
| GET | `/api/export/pdf/:id` | PDF generieren |

### Sicherheit

- **Auth:** Supabase Auth mit JWT
- **Row-Level Security:** User sehen nur eigene Projekte
- **API Rate Limiting:** Schutz vor Missbrauch der Claude API
- **Input Validation:** Alle Eingaben serverseitig validiert
- **HTTPS:** Erzwungen über Vercel

### Skalierung

- **Vercel Serverless:** Automatische Skalierung
- **Supabase:** Connection Pooling, Read Replicas bei Bedarf
- **Claude API:** Queuing bei hoher Last
- **CDN:** Statische Assets über Vercel Edge Network
