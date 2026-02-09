# Claude API Prompt: MVP (Single-Shot)

Optimierter Prompt für die einmalige Generierung von User Stories aus Tally-Formulardaten. Kein Konversationskontext, alles in einem API-Call.

---

## System Prompt

Wird im `system`-Feld des API-Requests übergeben:

```
Du bist ein erfahrener Requirements Engineer und Business Analyst mit 15 Jahren Erfahrung.

Deine Aufgabe: Erstelle aus informellen Projekt-Beschreibungen professionelle, sofort verwendbare User Stories mit Akzeptanzkriterien.

Regeln:
1. Schreibe immer auf Deutsch.
2. Verwende das Format: "Als [Rolle] möchte ich [Funktion] damit [Business Value]"
3. Jede User Story braucht 3-5 messbare, testbare Akzeptanzkriterien.
4. Akzeptanzkriterien müssen eindeutig testbar sein -- ein Entwickler muss wissen, wann das Kriterium erfüllt ist.
5. Vermeide vage Begriffe: NICHT "benutzerfreundlich", "schnell", "modern", "intuitiv". STATTDESSEN konkrete Zahlen und Beschreibungen.
6. Priorisiere User Stories nach geschätztem Business Value.
7. Berücksichtige das technische Level der Nutzer bei UX-Anforderungen.
8. Leite nicht-funktionale Anforderungen aus dem Kontext ab (Nutzeranzahl, Plattformen, Datensensibilität).
9. Sei präzise und professionell. Keine Füllwörter, keine Prosa.
10. Wenn Informationen fehlen oder unklar sind, formuliere offene Fragen.
```

---

## User Prompt

Wird im `messages`-Array als `user`-Nachricht übergeben. Die `{{Variablen}}` werden von Make.com durch die Tally-Antworten ersetzt.

```
Erstelle ein vollständiges Anforderungsdokument basierend auf folgenden Informationen eines Product Owners:

## Projekt-Kontext
- **Vision:** {{project_vision}}
- **Kategorie:** {{category}}
- **Bestehendes System:** {{existing_systems}}

## Zielgruppe
- **Rollen:** {{target_roles}}
- **Anzahl Nutzer:** {{user_count}}
- **Technisches Level:** {{tech_level}} von 5

## Anforderungen
- **Hauptprobleme:** {{main_pain}}
- **Top-3-Funktionen (priorisiert):**
  {{top_features}}
- **Plattformen:** {{platforms}}

## Projekt-Strategie
{{strategy}}

---

Erstelle folgende Abschnitte:

## TEIL 1: USER STORIES

Erstelle 5-8 User Stories. Für jede Story:

### User Story [Nummer]: [Kurztitel]
**Priorität:** HOCH / MITTEL / NIEDRIG

Als [spezifische Rolle aus der Zielgruppe]
möchte ich [konkrete, messbare Funktion]
damit [konkreter Business Value, der ein genanntes Problem löst]

**Akzeptanzkriterien:**
- [ ] [Eindeutig testbares Kriterium 1]
- [ ] [Eindeutig testbares Kriterium 2]
- [ ] [Eindeutig testbares Kriterium 3]
- [ ] [Optional: Kriterium 4]

**Abhängigkeiten:** [Andere User Stories, falls vorhanden]
**Geschätzter Aufwand:** S / M / L / XL

---

Priorisierungslogik:
- HOCH: Löst genannte Hauptprobleme direkt, Teil der Top-3-Funktionen
- MITTEL: Unterstützt Top-3-Funktionen oder löst sekundäre Probleme
- NIEDRIG: Sinnvolle Ergänzung, aber nicht kritisch

Ergänze zusätzlich implizite Stories (z.B. Login/Auth bei Multi-User, grundlegende CRUD-Operationen), falls nicht bereits abgedeckt.

---

## TEIL 2: NICHT-FUNKTIONALE ANFORDERUNGEN

Leite aus dem Kontext ab:

### Performance
- Antwortzeiten basierend auf {{user_count}} Nutzern
- Seitenaufbauzeiten basierend auf {{platforms}}

### Security
- Authentifizierung (angemessen für Datensensibilität der Kategorie {{category}})
- Autorisierung (basierend auf den genannten Rollen)
- Verschlüsselung und Datenschutz

### Verfügbarkeit
- Betriebszeiten (basierend auf Nutzungskontext)
- Wartungsfenster

### Plattformen
- Unterstützte Geräte: {{platforms}}
- Browser-/OS-Anforderungen

Format pro NFR:
**NFR-[Kürzel][Nr]:** [Beschreibung]
Empfehlung: Standard / Erweitert / Enterprise

---

## TEIL 3: OFFENE FRAGEN

Liste 3-5 wichtige Fragen, die der Product Owner noch klären sollte, bevor die Entwicklung startet. Basiere diese auf Lücken oder Unklarheiten in den Eingaben.

---

## TEIL 4: EMPFOHLENE UMSETZUNGSREIHENFOLGE

Schlage eine Sprint-Reihenfolge vor:

| Sprint | User Stories | Begründung |
|---|---|---|
| Sprint 1 | US-X, US-Y | [Warum zuerst] |
| Sprint 2 | US-X, US-Y | [Warum als nächstes] |
| ... | ... | ... |
```

---

## API-Konfiguration

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 4096,
  "temperature": 0.3,
  "system": "[System Prompt von oben]",
  "messages": [
    {
      "role": "user",
      "content": "[User Prompt mit eingesetzten Variablen]"
    }
  ]
}
```

### Parameter-Begründung

| Parameter | Wert | Begründung |
|---|---|---|
| `model` | claude-sonnet-4-5-20250929 | Beste Balance aus Qualität und Geschwindigkeit |
| `max_tokens` | 4096 | Ausreichend für 5-8 Stories + NFRs + offene Fragen |
| `temperature` | 0.3 | Niedrig für konsistente, strukturierte Ausgaben |

---

## Variablen-Mapping (Make.com → Prompt)

| Prompt-Variable | Make.com Quelle | Beispielwert |
|---|---|---|
| `{{project_vision}}` | Tally Frage 1 | "Wir brauchen ein CRM für unser Vertriebsteam..." |
| `{{category}}` | Tally Frage 3 | "CRM / Kundenmanagement" |
| `{{existing_systems}}` | Tally Frage 4 (+4a/4b) | "Ersetzt Excel und Outlook. Excel ist flexibel, aber..." |
| `{{target_roles}}` | Tally Frage 2a | "15 Vertriebsmitarbeiter, 3 Teamleiter, 2 Backoffice" |
| `{{user_count}}` | Tally Frage 2b | "10-50 Nutzer" |
| `{{tech_level}}` | Tally Frage 2c | "2" |
| `{{main_pain}}` | Tally Frage 5 | "Leads gehen verloren, kein Überblick über Status" |
| `{{top_features}}` | Tally Frage 6 | "1. Lead-Erfassung, 2. Pipeline-Ansicht, 3. Kontakthistorie" |
| `{{platforms}}` | Tally Frage 7 (+7a) | "Desktop + Smartphone, Offline: teilweise" |
| `{{strategy}}` | Tally Frage 8 | "Schnell starten mit Basisfunktionen, dann erweitern" |

---

## Beispiel-Output

Basierend auf dem CRM-Beispiel aus `examples/example-input.md`:

```
## TEIL 1: USER STORIES

### User Story 1: Lead-Erfassung
**Priorität:** HOCH

Als Vertriebsmitarbeiter
möchte ich neue Leads in max. 3 Klicks erfassen können
damit ich bei Kundengesprächen nicht den Fokus verliere

**Akzeptanzkriterien:**
- [ ] Pflichtfelder: Name, Firma, Telefon
- [ ] Optionale Felder: E-Mail, Lead-Quelle (Dropdown), Notiz
- [ ] Automatische Zeitstempel-Erfassung bei Anlage
- [ ] Erfolgsbestätigung nach Speicherung (min. 3 Sekunden sichtbar)
- [ ] Lead wird dem erstellenden Mitarbeiter zugeordnet

**Abhängigkeiten:** US-5 (Login)
**Geschätzter Aufwand:** M

[... weitere Stories ...]
```

---

## Kosten pro API-Call

| Metrik | Wert |
|---|---|
| Input Tokens (ca.) | 600-900 |
| Output Tokens (ca.) | 2.000-3.500 |
| Kosten pro Call | ~$0.02-0.04 |
| Bei 100 Calls/Monat | ~$2-4 |

---

## Troubleshooting

### Claude-Output zu kurz (weniger als 5 Stories)
→ Prüfe ob `max_tokens` auf 4096 gesetzt ist
→ Prüfe ob die Eingaben ausreichend detailliert sind

### Claude-Output enthält englischen Text
→ System Prompt prüfen: "Schreibe immer auf Deutsch" muss enthalten sein

### Claude-Output hat falsches Format
→ Temperature prüfen: Muss 0.3 sein (nicht höher)
→ Format-Beispiel im Prompt prüfen

### API-Error 429 (Rate Limit)
→ Make.com Retry-Modul mit 30 Sekunden Delay einrichten

### API-Error 500 (Server Error)
→ Retry nach 10 Sekunden (automatisch via Make.com Error Handler)
