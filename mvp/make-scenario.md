# Make.com Szenario: Blueprint

Vollständige Konfiguration des Automatisierungs-Szenarios in Make.com.

## Voraussetzungen

- Make.com Core Account ($9/Monat)
- Claude API Key (Anthropic Console)
- Google Account (für Docs + Drive)
- E-Mail-Konto für Versand (Gmail oder SMTP)

---

## Szenario-Übersicht

```
[1] Tally         [2] Variablen    [3] Prompt       [4] Claude API
Webhook     ───>  setzen     ───>  bauen      ───>  aufrufen
                                                        │
[8] E-Mail        [7] PDF          [6] Google Doc   [5] Antwort
senden      <───  exportieren <─── erstellen   <─── parsen
                                                        │
                                               [9] Error Handler
```

**Szenario-Name:** `Requirements Tool MVP - Tally to PDF`
**Trigger:** Webhook (On-Demand)
**Geschätzte Laufzeit:** 30-60 Sekunden

---

## Modul 1: Tally Webhook

**Modul-Typ:** Webhooks → Custom Webhook

### Einrichtung
1. In Make.com: Neues Szenario erstellen
2. Erstes Modul: "Webhooks" → "Custom webhook"
3. "Add" klicken → Webhook benennen: `tally-requirements`
4. Webhook-URL wird generiert → kopieren
5. URL in Tally einfügen (siehe `tally-setup.md`, Schritt 6)
6. In Tally eine Test-Submission absenden
7. Zurück in Make.com: "Redetermine data structure" klicken

### Erwartete Datenstruktur

```json
{
  "eventId": "...",
  "eventType": "FORM_RESPONSE",
  "createdAt": "2026-02-09T...",
  "data": {
    "responseId": "...",
    "submissionId": "...",
    "formId": "...",
    "formName": "Guided Requirements Tool",
    "fields": [
      {
        "key": "question_xYz1",
        "label": "Beschreiben Sie in 2-3 Sätzen...",
        "type": "TEXTAREA",
        "value": "Wir brauchen ein CRM..."
      },
      {
        "key": "question_xYz2",
        "label": "Wer wird die Software nutzen?",
        "type": "INPUT_TEXT",
        "value": "15 Vertriebsmitarbeiter, 3 Teamleiter"
      }
    ]
  }
}
```

> **Wichtig:** Die `key`-Werte werden von Tally automatisch generiert. Nach dem Test-Submission sind sie in Make.com sichtbar und können per Drag & Drop referenziert werden.

---

## Modul 2: Variablen setzen

**Modul-Typ:** Tools → Set Multiple Variables

### Konfiguration

Erstelle folgende Variablen und mappe sie auf die Tally-Felder:

| Variable | Quelle (Tally-Feld) |
|---|---|
| `project_vision` | Frage 1: Projekt-Vision |
| `target_roles` | Frage 2a: Nutzer-Rollen |
| `user_count` | Frage 2b: Anzahl Nutzer |
| `tech_level` | Frage 2c: Technisches Level |
| `category` | Frage 3: Software-Kategorie |
| `existing_systems` | Frage 4 + 4a/4b: Bestehende Systeme |
| `main_pain` | Frage 5: Hauptproblem |
| `top_features` | Frage 6: Top-3-Funktionen |
| `platforms` | Frage 7 + 7a: Plattformen |
| `strategy` | Frage 8: Strategie |
| `user_email` | Frage 9: E-Mail |

**Hinweis für konditionale Felder (4a/4b, 7a):**
Verwende die Make.com `ifempty()`-Funktion:

```
existing_systems = {{data.fields.question_4.value}}
  {{ifempty(data.fields.question_4a.value, "")}}
  {{ifempty(data.fields.question_4b.value, "")}}
```

---

## Modul 3: Prompt zusammenbauen

**Modul-Typ:** Tools → Set Variable (Text)

### Variable: `claude_prompt`

```
Erstelle User Stories basierend auf folgenden Informationen:

## Projekt-Kontext
- Vision: {{project_vision}}
- Kategorie: {{category}}
- Bestehendes System: {{existing_systems}}

## Zielgruppe
- Rollen: {{target_roles}}
- Anzahl User: {{user_count}}
- Technisches Level: {{tech_level}}/5

## Anforderungen
- Hauptproblem: {{main_pain}}
- Top-3-Funktionen (priorisiert): {{top_features}}
- Plattformen: {{platforms}}

## Projekt-Strategie
{{strategy}}

## Aufgabe

### Teil 1: User Stories
Erstelle 5-8 User Stories nach diesem Schema:

### User Story [Nummer]: [Kurztitel]
**Priorität:** HOCH / MITTEL / NIEDRIG

Als [Rolle]
möchte ich [konkrete Funktion]
damit [messbarer Business Value]

**Akzeptanzkriterien:**
- [ ] [Testbares Kriterium 1]
- [ ] [Testbares Kriterium 2]
- [ ] [Testbares Kriterium 3]

**Geschätzter Aufwand:** S / M / L / XL

---

### Teil 2: Nicht-funktionale Anforderungen
Leite NFRs ab zu: Performance, Security, Verfügbarkeit, Plattformen.

### Teil 3: Offene Fragen
Liste max. 5 offene Fragen, die noch geklärt werden sollten.

### Teil 4: Empfohlene Umsetzungsreihenfolge
Schlage eine Sprint-Planung vor.

Regeln:
1. Schreibe auf Deutsch
2. Verwende konkrete Zahlen statt vage Begriffe
3. Priorisiere nach Business Value
4. Jede Story braucht 3-5 messbare Akzeptanzkriterien
5. Vermeide vage Begriffe wie "benutzerfreundlich" oder "modern"
6. Berücksichtige das technische Level der Nutzer bei UX-Anforderungen
```

> Siehe `claude-prompt-mvp.md` für die vollständige Prompt-Dokumentation.

---

## Modul 4: Claude API aufrufen

**Modul-Typ:** HTTP → Make a Request

### Konfiguration

| Einstellung | Wert |
|---|---|
| **URL** | `https://api.anthropic.com/v1/messages` |
| **Method** | POST |
| **Headers** | |

```
x-api-key: {{CLAUDE_API_KEY}}
anthropic-version: 2023-06-01
content-type: application/json
```

**Body (JSON):**

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 4096,
  "temperature": 0.3,
  "system": "Du bist ein erfahrener Requirements Engineer und Business Analyst. Deine Aufgabe ist es, aus informellen Beschreibungen professionelle, entwicklertaugliche User Stories zu erstellen. Schreibe auf Deutsch. Verwende das Format: Als [Rolle] möchte ich [Funktion] damit [Business Value]. Jede Story braucht 3-5 messbare Akzeptanzkriterien. Vermeide vage Begriffe. Verwende konkrete Zahlen.",
  "messages": [
    {
      "role": "user",
      "content": "{{claude_prompt}}"
    }
  ]
}
```

### API Key als Umgebungsvariable

1. In Make.com: Gehe zu **Organization → Custom Variables**
2. Erstelle Variable: `CLAUDE_API_KEY`
3. Wert: Dein API Key von console.anthropic.com
4. Referenziere im Header als `{{CLAUDE_API_KEY}}`

### Timeout

Setze den Timeout auf **120 Sekunden** (Claude braucht ~10-30 Sek. für 4096 Tokens).

---

## Modul 5: Antwort parsen

**Modul-Typ:** JSON → Parse JSON

### Konfiguration

**Input:** Body aus Modul 4 (HTTP Response)

**Erwartete Struktur:**

```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "### User Story 1: Lead-Erfassung\n..."
    }
  ],
  "model": "claude-sonnet-4-5-20250929",
  "usage": {
    "input_tokens": 800,
    "output_tokens": 2500
  }
}
```

**Variable setzen:**
```
claude_output = {{content[0].text}}
```

---

## Modul 6: Google Doc erstellen

**Modul-Typ:** Google Docs → Create a Document from a Template

### Vorbereitung (einmalig)

1. Erstelle ein Google Doc Template (siehe `google-docs-template.md`)
2. Füge Platzhalter ein: `{{PROJECT_NAME}}`, `{{CREATED_DATE}}`, `{{USER_STORIES}}`
3. Notiere die **Document ID** aus der URL

### Konfiguration

| Einstellung | Wert |
|---|---|
| **Connection** | Dein Google Account |
| **Template Document ID** | [ID des Templates] |
| **Title** | `Anforderungsdokument - {{formatDate(now; "DD.MM.YYYY")}}` |
| **New Document Location** | Eigener Google Drive Ordner |

**Platzhalter-Ersetzungen:**

| Platzhalter | Wert |
|---|---|
| `{{PROJECT_NAME}}` | `{{project_vision}}` (erste 80 Zeichen) |
| `{{CREATED_DATE}}` | `{{formatDate(now; "DD.MM.YYYY HH:mm")}}` |
| `{{USER_EMAIL}}` | `{{user_email}}` |
| `{{USER_STORIES}}` | `{{claude_output}}` |

**Output:** `google_doc_id` und `google_doc_url`

---

## Modul 7: PDF exportieren

**Modul-Typ:** Google Drive → Download a File

### Konfiguration

| Einstellung | Wert |
|---|---|
| **Connection** | Gleicher Google Account |
| **File ID** | `{{google_doc_id}}` (aus Modul 6) |
| **Convert to** | PDF |

**Output:** PDF-Datei als binäre Daten

---

## Modul 8: E-Mail senden

**Modul-Typ:** Email → Send an Email **oder** Gmail → Send an Email

### Option A: Gmail (einfacher)

| Einstellung | Wert |
|---|---|
| **Connection** | Dein Gmail Account |
| **To** | `{{user_email}}` |
| **Subject** | `Ihre User Stories sind fertig` |
| **Content Type** | HTML |

**Body:**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">

  <h2 style="color: #1a1a1a;">Ihre User Stories sind fertig!</h2>

  <p>Hallo,</p>

  <p>vielen Dank, dass Sie das Guided Requirements Tool genutzt haben.</p>

  <p><strong>Im Anhang finden Sie Ihr Anforderungsdokument mit:</strong></p>
  <ul>
    <li>5-8 User Stories mit Akzeptanzkriterien</li>
    <li>Nicht-funktionale Anforderungen</li>
    <li>Priorisierung und Sprint-Empfehlung</li>
    <li>Offene Fragen zur weiteren Klärung</li>
  </ul>

  <p><strong>Wie geht es weiter?</strong></p>
  <ol>
    <li>Lesen Sie die User Stories mit Ihrem Team durch</li>
    <li>Markieren Sie unklare oder fehlende Punkte</li>
    <li>Besprechen Sie die offenen Fragen</li>
    <li>Nutzen Sie das Dokument als Grundlage für Ihr Entwicklungsteam</li>
  </ol>

  <p><strong>Feedback?</strong><br>
  Wir verbessern das Tool ständig. Antworten Sie einfach auf diese E-Mail
  mit Ihrem Feedback.</p>

  <p>Viel Erfolg mit Ihrem Projekt!<br>
  <strong>Christoph Lengowski</strong><br>
  Guided Requirements Tool</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="font-size: 12px; color: #888;">
    Sie erhalten diese E-Mail, weil Sie das Guided Requirements Tool
    verwendet haben.
  </p>

</div>
```

**Attachment:**
- Dateiname: `Anforderungsdokument-{{formatDate(now; "YYYY-MM-DD")}}.pdf`
- Daten: PDF aus Modul 7

### Option B: SMTP (eigene Domain)

Falls du eine eigene E-Mail-Domain nutzen möchtest (z.B. info@requirements-tool.de):

| Einstellung | Wert |
|---|---|
| **Modul-Typ** | Email → Send an Email |
| **SMTP Host** | z.B. smtp.gmail.com oder eigener Server |
| **Port** | 587 (TLS) |
| **Username** | Deine E-Mail |
| **Password** | App-Passwort |

---

## Modul 9: Error Handler

**Modul-Typ:** Error Handler (Route)

### Einrichtung

1. Rechtsklick auf Modul 4 (Claude API) → "Add error handler"
2. Route hinzufügen: **Resume** (für Retry) oder **Ignore** (für Logging)

### Error-Benachrichtigung

Füge ein zusätzliches E-Mail-Modul im Error-Pfad hinzu:

**An:** deine persönliche E-Mail
**Betreff:** `[MVP Error] Form Submission fehlgeschlagen`
**Body:**
```
Fehler bei der Verarbeitung:

User E-Mail: {{user_email}}
Fehler: {{error.message}}
Modul: {{error.moduleName}}
Zeitpunkt: {{formatDate(now; "DD.MM.YYYY HH:mm")}}

Tally Response ID: {{data.responseId}}
```

---

## Szenario-Einstellungen

| Einstellung | Wert |
|---|---|
| **Scheduling** | ON (Instantly) |
| **Max. Execution Time** | 300 Sekunden |
| **Data Loss Prevention** | Enabled |
| **Sequential Processing** | Yes |

---

## Umgebungsvariablen

| Variable | Beschreibung | Wo anlegen |
|---|---|---|
| `CLAUDE_API_KEY` | Anthropic API Key | Make.com → Custom Variables |
| Google Docs Template ID | ID des PDF-Templates | Direkt im Modul 6 |

---

## Test-Ablauf

### 1. Einzelne Module testen
- Modul 1: Tally-Submission abschicken → prüfen ob Daten ankommen
- Modul 2-3: Variablen prüfen → sind alle Werte korrekt?
- Modul 4: Claude API → kommt ein valider Response?
- Modul 5: JSON parsen → ist `claude_output` ein sauberer Text?
- Modul 6: Google Doc → wird Dokument erstellt, Platzhalter ersetzt?
- Modul 7: PDF → wird PDF korrekt generiert?
- Modul 8: E-Mail → kommt E-Mail mit PDF an?

### 2. End-to-End Test
1. Formular komplett ausfüllen (CRM-Szenario)
2. Prüfen: E-Mail innerhalb von 5 Minuten erhalten?
3. PDF öffnen: Alle Abschnitte vorhanden?
4. User Stories prüfen: Qualität gut genug?

### 3. Fehlerfälle testen
- Ungültige E-Mail → Error Handler greift?
- Sehr kurze Eingaben → Claude generiert trotzdem sinnvoll?
- API-Timeout → Retry funktioniert?

---

## Checkliste

- [ ] Make.com Account erstellt und Szenario angelegt
- [ ] Webhook erstellt und URL in Tally eingetragen
- [ ] Claude API Key als Custom Variable gespeichert
- [ ] Google Account verbunden
- [ ] Google Docs Template erstellt und verlinkt
- [ ] E-Mail-Versand konfiguriert (Gmail oder SMTP)
- [ ] Error Handler eingerichtet
- [ ] Alle 8 Module einzeln getestet
- [ ] End-to-End Test erfolgreich
- [ ] Szenario auf "Active" gestellt
