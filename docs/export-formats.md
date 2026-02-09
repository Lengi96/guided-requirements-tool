# Export-Formate

Spezifikation der Export-Formate für JIRA, Confluence und PDF.

---

## PDF-Export

### Aufbau des Dokuments

```
┌────────────────────────────────────────────┐
│           Anforderungsdokument             │
│          [Projektname]                     │
│                                            │
│  Erstellt am: [Datum]                      │
│  Erstellt von: [Username]                  │
│  Version: [Auto-Increment]                 │
├────────────────────────────────────────────┤
│  1. Projektübersicht                       │
│     - Vision                               │
│     - Zielgruppe                           │
│     - Kategorie                            │
│     - Bestehende Systeme                   │
├────────────────────────────────────────────┤
│  2. User Stories                           │
│     - Story 1 (HOCH)                       │
│     - Story 2 (HOCH)                       │
│     - Story 3 (MITTEL)                     │
│     - ...                                  │
├────────────────────────────────────────────┤
│  3. Nicht-funktionale Anforderungen        │
│     - Performance                          │
│     - Security                             │
│     - Verfügbarkeit                        │
├────────────────────────────────────────────┤
│  4. Offene Fragen                          │
│     - [Falls vorhanden]                    │
├────────────────────────────────────────────┤
│  5. Anhang                                 │
│     - Trade-off-Entscheidungen             │
│     - Abhängigkeitsdiagramm                │
└────────────────────────────────────────────┘
```

### PDF-Generierung (Full Version)

**Bibliothek:** `react-pdf` oder `@react-pdf/renderer`

**Formatierung:**
- A4-Format
- Schrift: Inter oder Open Sans
- Farben: Prioritäten farblich kodiert (Rot=HOCH, Orange=MITTEL, Grau=NIEDRIG)
- Seitenzahlen und Inhaltsverzeichnis
- Logo-Platzhalter (für White-Label)

### PDF-Generierung (MVP)

**Tool:** Make.com + Google Docs Template oder Carbone.io
- Google Docs Template mit Platzhaltern
- Make.com füllt Platzhalter mit Claude-Output
- Export als PDF per Google Drive API

---

## JIRA-Export

### Mapping: User Story → JIRA Issue

| User Story Feld | JIRA Feld | JIRA Typ |
|---|---|---|
| Kurztitel | Summary | String |
| "Als... möchte ich... damit..." | Description | Text (Markdown) |
| Akzeptanzkriterien | Description (Abschnitt) oder Custom Field | Text / Checkbox-Liste |
| Priorität (HOCH/MITTEL/NIEDRIG) | Priority | Priority (Highest/High/Medium/Low/Lowest) |
| Geschätzter Aufwand (S/M/L/XL) | Story Points oder Custom Field | Number / Select |
| Abhängigkeiten | Linked Issues | Issue Link |
| NFRs | Labels oder Epics | Label[] |

### JIRA REST API Integration

**Endpoint:** `POST /rest/api/3/issue`

**Request-Body pro User Story:**

```json
{
  "fields": {
    "project": {
      "key": "{user_project_key}"
    },
    "summary": "Lead-Erfassung in max. 3 Klicks",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Als Vertriebsmitarbeiter\nmöchte ich neue Leads in max. 3 Klicks erfassen können\ndamit ich bei Kundengesprächen nicht den Fokus verliere"
            }
          ]
        },
        {
          "type": "heading",
          "attrs": { "level": 3 },
          "content": [
            { "type": "text", "text": "Akzeptanzkriterien" }
          ]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    { "type": "text", "text": "Pflichtfelder: Name, Firma, Telefon" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "issuetype": {
      "name": "Story"
    },
    "priority": {
      "name": "High"
    },
    "labels": ["requirements-tool", "generated"]
  }
}
```

### JIRA Prioritäts-Mapping

| Tool Priorität | JIRA Priority |
|---|---|
| HOCH | High |
| MITTEL | Medium |
| NIEDRIG | Low |

### JIRA Auth

**OAuth 2.0 (3LO)** für Atlassian Cloud:
1. User autorisiert App über Atlassian
2. Access Token + Refresh Token speichern
3. Token automatisch erneuern

**Benötigte Scopes:**
- `write:jira-work` -- Issues erstellen/bearbeiten
- `read:jira-work` -- Projekte/Issues lesen
- `read:jira-user` -- User-Zuordnung

### Batch-Import

Für mehrere Stories gleichzeitig: **Bulk Create API**

```
POST /rest/api/3/issue/bulk
```

Max. 50 Issues pro Request. Bei mehr: sequenzielle Batches.

---

## Confluence-Export

### Seitenstruktur

```
[Projektname] - Anforderungsdokument
├── Projektübersicht
├── User Stories
│   ├── Epic 1: [Feature-Gruppe]
│   │   ├── Story 1
│   │   └── Story 2
│   └── Epic 2: [Feature-Gruppe]
│       ├── Story 3
│       └── Story 4
├── Nicht-funktionale Anforderungen
└── Offene Fragen
```

### Confluence REST API

**Endpoint:** `POST /wiki/api/v2/pages`

**Request-Body:**

```json
{
  "spaceId": "{user_space_id}",
  "status": "current",
  "title": "CRM-Projekt - Anforderungsdokument",
  "parentId": "{parent_page_id}",
  "body": {
    "representation": "storage",
    "value": "<h2>Projektübersicht</h2><p>...</p><h2>User Stories</h2>..."
  }
}
```

### Confluence Storage Format (Auszug)

```xml
<h2>User Story 1: Lead-Erfassung</h2>
<ac:structured-macro ac:name="panel">
  <ac:parameter ac:name="title">Priorität: HOCH</ac:parameter>
  <ac:rich-text-body>
    <p><strong>Als</strong> Vertriebsmitarbeiter<br/>
    <strong>möchte ich</strong> neue Leads in max. 3 Klicks erfassen können<br/>
    <strong>damit</strong> ich bei Kundengesprächen nicht den Fokus verliere</p>
  </ac:rich-text-body>
</ac:structured-macro>

<h3>Akzeptanzkriterien</h3>
<ac:task-list>
  <ac:task>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Pflichtfelder: Name, Firma, Telefon</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Automatische Zeitstempel-Erfassung</ac:task-body>
  </ac:task>
</ac:task-list>
```

### Confluence Auth

Gleich wie JIRA (Atlassian OAuth 2.0):
- Scope: `write:confluence-content`
- Scope: `read:confluence-space.summary`

---

## CSV-Export (Bonus)

Für Import in andere Tools (Azure DevOps, Trello, etc.):

```csv
"ID","Title","Role","Action","Benefit","Priority","Acceptance Criteria","Effort"
"US-001","Lead-Erfassung","Vertriebsmitarbeiter","neue Leads in max. 3 Klicks erfassen","bei Kundengesprächen nicht den Fokus verliere","HOCH","Pflichtfelder: Name, Firma, Telefon | Automatische Zeitstempel | Optionale Notizen | Erfolgsbestätigung","M"
```

---

## Export-Einstellungen (UI)

### MVP
- PDF-Download (direkt)
- Notion-Export (via Make.com → Notion API)

### Full Version

```
Export-Dialog:

┌─────────────────────────────────────────┐
│  Export: CRM-Projekt                    │
│                                         │
│  Format:                                │
│  ○ PDF herunterladen                    │
│  ○ JIRA-Tickets erstellen               │
│    → Projekt: [Dropdown]                │
│    → Epic: [Optional]                   │
│  ○ Confluence-Seite erstellen           │
│    → Space: [Dropdown]                  │
│    → Übergeordnete Seite: [Optional]    │
│  ○ CSV herunterladen                    │
│                                         │
│  Optionen:                              │
│  ☑ User Stories einschließen            │
│  ☑ NFRs einschließen                    │
│  ☑ Projektübersicht einschließen        │
│  ☐ Trade-off-Dokumentation              │
│                                         │
│  [Exportieren]     [Abbrechen]          │
└─────────────────────────────────────────┘
```
