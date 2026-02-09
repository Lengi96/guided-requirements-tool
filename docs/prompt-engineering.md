# Prompt Engineering: Claude API

Dokumentation der Prompts für die Claude API Integration. Diese Prompts verwandeln die Antworten aus dem Guided Mode in strukturierte User Stories.

## Übersicht

| Prompt | Einsatz | Modell |
|---|---|---|
| System Prompt | Basis-Konfiguration für alle Requests | Sonnet 4 |
| Story Generation | User Stories aus Antworten generieren | Sonnet 4 |
| Story Refinement | Einzelne Stories verfeinern | Sonnet 4 |
| NFR Derivation | Nicht-funktionale Anforderungen ableiten | Sonnet 4 |
| Trade-off Questions | Kontextbasierte Trade-off-Fragen generieren | Sonnet 4 |

---

## System Prompt

Wird bei jedem API-Call als System-Prompt mitgesendet:

```
Du bist ein erfahrener Requirements Engineer und Business Analyst.
Deine Aufgabe ist es, aus informellen Beschreibungen professionelle,
entwicklertaugliche User Stories zu erstellen.

Regeln:
1. Schreibe immer auf Deutsch, es sei denn, der User schreibt auf Englisch.
2. Verwende das Format: "Als [Rolle] möchte ich [Funktion] damit [Business Value]"
3. Jede User Story braucht 3-5 messbare Akzeptanzkriterien.
4. Akzeptanzkriterien müssen testbar und eindeutig sein.
5. Vermeide vage Begriffe wie "benutzerfreundlich", "schnell", "modern".
6. Wenn etwas unklar ist, formuliere es als offene Frage an den User.
7. Priorisiere User Stories nach geschätztem Business Value.
8. Berücksichtige nicht-funktionale Anforderungen separat.
9. Halte dich kurz und präzise. Keine Prosa, keine Füllwörter.
10. Verwende technische Begriffe nur, wenn sie für die Anforderung
    relevant sind. Erkläre sie dann kurz.
```

---

## Prompt 1: Story Generation

**Trigger:** Nach Schritt 9 (Zusammenfassung bestätigt)

**Input-Variablen:**
- `{project_vision}` -- Freitext aus Schritt 1
- `{target_roles}` -- Rollen aus Schritt 2
- `{user_count}` -- Nutzeranzahl aus Schritt 2
- `{category}` -- Kategorie aus Schritt 3
- `{existing_systems}` -- Info aus Schritt 4
- `{main_pain}` -- Hauptproblem aus Schritt 5
- `{top_features}` -- Priorisierte Features aus Schritt 6
- `{platforms}` -- Plattformen aus Schritt 7
- `{tradeoff_decisions}` -- Trade-off-Entscheidungen aus Schritt 8

```
Erstelle User Stories basierend auf folgenden Informationen:

## Projekt-Kontext
- Vision: {project_vision}
- Kategorie: {category}
- Bestehendes System: {existing_systems}

## Zielgruppe
- Rollen: {target_roles}
- Anzahl User: {user_count}

## Anforderungen
- Hauptproblem: {main_pain}
- Top-Funktionen (priorisiert):
  1. {top_features[0]}
  2. {top_features[1]}
  3. {top_features[2]}
- Plattformen: {platforms}

## Entscheidungen
{tradeoff_decisions}

## Aufgabe
Generiere User Stories nach folgendem Schema:

### User Story [Nummer]: [Kurztitel]
**Priorität:** HOCH / MITTEL / NIEDRIG

Als [Rolle]
möchte ich [konkrete Funktion]
damit [messbarer Business Value]

**Akzeptanzkriterien:**
- [ ] [Testbares Kriterium 1]
- [ ] [Testbares Kriterium 2]
- [ ] [Testbares Kriterium 3]

**Abhängigkeiten:** [Falls vorhanden]
**Geschätzter Aufwand:** S / M / L / XL

---

Regeln:
- Erstelle mindestens eine Story pro Top-Funktion
- Erstelle zusätzliche Stories für implizite Anforderungen
  (Login, Basisfunktionen, etc.)
- Sortiere nach Priorität (HOCH zuerst)
- Markiere Abhängigkeiten zwischen Stories
- Verwende konkrete Zahlen statt vage Beschreibungen
  (z.B. "in unter 3 Sekunden" statt "schnell")
```

---

## Prompt 2: Story Refinement

**Trigger:** User wählt eine Story zur Verfeinerung (Schritt 11)

**Input-Variablen:**
- `{original_story}` -- Die zu verfeinernde User Story
- `{user_feedback}` -- Feedback des Users
- `{project_context}` -- Gesamter Projekt-Kontext

```
Der User möchte folgende User Story verfeinern:

## Original Story
{original_story}

## User-Feedback
{user_feedback}

## Projekt-Kontext
{project_context}

## Aufgabe
1. Überarbeite die User Story basierend auf dem Feedback.
2. Passe Akzeptanzkriterien an oder ergänze neue.
3. Prüfe, ob durch die Änderung neue Abhängigkeiten entstehen.
4. Wenn das Feedback unklar ist, formuliere maximal 2 Rückfragen.

Antworte im gleichen Format wie die Original-Story.
Markiere Änderungen mit [NEU] oder [GEÄNDERT].
```

---

## Prompt 3: NFR Derivation

**Trigger:** Nach Schritt 11, vor Schritt 12

**Input-Variablen:**
- `{user_count}` -- Nutzeranzahl
- `{platforms}` -- Plattformen
- `{category}` -- Software-Kategorie
- `{data_sensitivity}` -- Abgeleitet aus Kontext
- `{pain_points}` -- Schmerzpunkte

```
Leite nicht-funktionale Anforderungen (NFRs) ab basierend auf:

- Nutzeranzahl: {user_count}
- Plattformen: {platforms}
- Kategorie: {category}
- Datensensibilität: {data_sensitivity}
- Genannte Schmerzpunkte: {pain_points}

Erstelle NFRs in folgenden Kategorien:

### Performance
- Antwortzeiten (basierend auf Nutzeranzahl)
- Durchsatz (gleichzeitige Operationen)
- Ladezeiten (basierend auf Plattformen)

### Security
- Authentifizierung (basierend auf Datensensibilität)
- Autorisierung
- Datenverschlüsselung
- Audit/Logging

### Verfügbarkeit
- Betriebszeiten
- Geplante Wartungsfenster
- Recovery-Ziele (RPO/RTO)

### Skalierbarkeit
- Erwartetes Wachstum
- Lastspitzen

Format pro NFR:
- **[Kategorie-Nummer]** [Beschreibung]
  Empfehlung: [Standard/Erweitert/Enterprise]
  Begründung: [Warum diese Empfehlung]

Gib für jede NFR eine begründete Empfehlung ab, die zum
Projektkontext passt. Vermeide Overengineering.
```

---

## Prompt 4: Trade-off Questions

**Trigger:** Nach Schritt 7, vor Schritt 8

**Input-Variablen:**
- `{top_features}` -- Top-3-Funktionen
- `{category}` -- Kategorie
- `{user_count}` -- Nutzeranzahl
- `{platforms}` -- Plattformen

```
Generiere 2-4 Trade-off-Fragen basierend auf:

- Top-Funktionen: {top_features}
- Kategorie: {category}
- Nutzeranzahl: {user_count}
- Plattformen: {platforms}

Jede Frage soll dem User eine Entscheidung abverlangen, die
Auswirkungen auf Komplexität, Kosten oder Zeitrahmen hat.

Format pro Frage:

### Trade-off [Nummer]: [Thema]
Frage: "[Verständliche Frage ohne Fachbegriffe]"

○ Option A: [Beschreibung]
  → Pro: [Vorteil]
  → Contra: [Nachteil/Mehraufwand]

○ Option B: [Beschreibung]
  → Pro: [Vorteil]
  → Contra: [Nachteil/Mehraufwand]

○ Option C: [Beschreibung]
  → Pro: [Vorteil]
  → Contra: [Nachteil/Mehraufwand]

Regeln:
- Formuliere in Alltagssprache, keine Fachbegriffe
- Mache Konsequenzen konkret (z.B. "ca. 2 Wochen mehr Entwicklung")
- Jede Option muss realistisch und umsetzbar sein
- Vermeide "offensichtlich richtige" Antworten -- alle Optionen
  sollen valide Trade-offs sein
```

---

## Prompt 5: Kontextbasierte Folgefragen

**Trigger:** Nach jeder User-Antwort im Guided Mode (Full Version)

**Input-Variablen:**
- `{current_answer}` -- Aktuelle Antwort
- `{previous_answers}` -- Alle bisherigen Antworten
- `{current_step}` -- Aktueller Schritt im Prozess

```
Basierend auf der aktuellen Antwort und dem bisherigen Kontext:

## Aktuelle Antwort (Schritt {current_step})
{current_answer}

## Bisherige Antworten
{previous_answers}

## Aufgabe
1. Gibt es Unklarheiten in der aktuellen Antwort, die eine
   Rückfrage erfordern? Wenn ja, formuliere maximal 1 Rückfrage.
2. Welche Frage sollte als nächstes gestellt werden?
3. Welche kontextbasierten Vorschläge/Optionen passen zur
   nächsten Frage?

Antworte im JSON-Format:
{
  "needs_clarification": true/false,
  "clarification_question": "...",
  "next_question_id": "3.1",
  "suggested_options": ["Option 1", "Option 2", ...],
  "context_notes": "Interne Notiz für die Verarbeitung"
}
```

---

## API-Konfiguration

### Empfohlene Parameter

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 4096,
  "temperature": 0.3,
  "top_p": 0.9
}
```

**Begründung:**
- **Temperature 0.3:** Niedrig genug für konsistente, strukturierte Ausgaben. Hoch genug für sinnvolle Variationen bei Vorschlägen.
- **max_tokens 4096:** Ausreichend für 5-8 User Stories mit Akzeptanzkriterien.
- **top_p 0.9:** Leicht eingeschränkt für fokussiertere Antworten.

### Kosten-Schätzung (Sonnet 4)

| Aktion | Input Tokens (ca.) | Output Tokens (ca.) | Kosten (ca.) |
|---|---|---|---|
| Story Generation | 800 | 2000 | $0.012 |
| Story Refinement | 600 | 1000 | $0.007 |
| NFR Derivation | 500 | 1500 | $0.009 |
| Trade-off Questions | 400 | 1200 | $0.007 |
| **Gesamt pro Session** | **~2500** | **~6000** | **~$0.035** |

Pro User-Session: ca. 3-4 Cent. Bei 1000 Sessions/Monat: ca. 35 EUR.

### Error Handling

```
Bei API-Fehlern:
1. Retry mit Exponential Backoff (max 3 Versuche)
2. Bei persistentem Fehler: Letzte Antwort cachen, User informieren
3. Nie unvollständige Stories anzeigen -- lieber "wird noch
   generiert" einblenden
4. Rate Limiting: Queue pro User (max 5 Requests/Minute)
```
