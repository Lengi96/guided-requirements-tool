import { GuidedFormAnswers } from './types';

export const SYSTEM_PROMPT = `Du bist ein erfahrener Requirements Engineer und Business Analyst mit 15 Jahren Erfahrung.

Deine Aufgabe: Erstelle aus informellen Projekt-Beschreibungen professionelle, sofort verwendbare User Stories mit Akzeptanzkriterien.

Regeln:
1. Schreibe immer auf Deutsch.
2. Verwende das Format: "Als [Rolle] möchte ich [Funktion] damit [Business Value]"
3. Jede User Story braucht 3-5 messbare, testbare Akzeptanzkriterien.
4. Akzeptanzkriterien müssen eindeutig testbar sein.
5. Vermeide vage Begriffe: NICHT "benutzerfreundlich", "schnell", "modern", "intuitiv". STATTDESSEN konkrete Zahlen.
6. Priorisiere User Stories nach geschätztem Business Value.
7. Berücksichtige das technische Level der Nutzer bei UX-Anforderungen.
8. Leite nicht-funktionale Anforderungen aus dem Kontext ab.
9. Sei präzise und professionell. Keine Füllwörter.
10. Wenn Informationen fehlen oder unklar sind, formuliere offene Fragen.`;

export function buildGenerationPrompt(answers: GuidedFormAnswers): string {
  const systemLabel =
    answers.existingSystem === 'replace'
      ? 'Ersetzt ein bestehendes System'
      : answers.existingSystem === 'integrate'
        ? 'Ergänzt bestehende Systeme'
        : 'Kompletter Neustart';

  const offlineLine =
    answers.platforms.includes('Tablet') || answers.platforms.includes('Smartphone')
      ? `\n- **Offline-Fähigkeit:** ${answers.offlineCapability || 'nicht angegeben'}`
      : '';

  return `Erstelle ein vollständiges Anforderungsdokument basierend auf folgenden Informationen eines Product Owners:

## Projekt-Kontext
- **Vision:** ${answers.projectVision}
- **Kategorie:** ${answers.category}
- **Bestehendes System:** ${systemLabel}
${answers.existingSystemDetails ? `- **Details:** ${answers.existingSystemDetails}` : ''}

## Zielgruppe
- **Rollen:** ${answers.targetRoles}
- **Anzahl Nutzer:** ${answers.userCount}
- **Technisches Level:** ${answers.techLevel} von 5

## Anforderungen
- **Hauptprobleme:** ${answers.mainPain.join(', ')}
- **Top-3-Funktionen (priorisiert):**
  ${answers.topFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n  ')}
- **Plattformen:** ${answers.platforms.join(', ')}${offlineLine}

## Projekt-Strategie
${answers.strategy}

---

Erstelle folgende Abschnitte:

## TEIL 1: USER STORIES

Erstelle 5-8 User Stories. Für jede Story verwende exakt dieses Format:

### User Story [Nummer]: [Kurztitel]
**Priorität:** HOCH / MITTEL / NIEDRIG

Als [spezifische Rolle]
möchte ich [konkrete, messbare Funktion]
damit [konkreter Business Value]

**Akzeptanzkriterien:**
- [ ] [Testbares Kriterium 1]
- [ ] [Testbares Kriterium 2]
- [ ] [Testbares Kriterium 3]

**Abhängigkeiten:** [Falls vorhanden]
**Geschätzter Aufwand:** S / M / L / XL

---

## TEIL 2: NICHT-FUNKTIONALE ANFORDERUNGEN

Leite NFRs ab zu Performance, Security, Verfügbarkeit, Plattformen.

Format: **NFR-[Kürzel][Nr]:** [Beschreibung]
Empfehlung: Standard / Erweitert / Enterprise

---

## TEIL 3: OFFENE FRAGEN

Liste 3-5 offene Fragen als nummerierte Liste.

---

## TEIL 4: EMPFOHLENE UMSETZUNGSREIHENFOLGE

| Sprint | User Stories | Begründung |
|---|---|---|
| Sprint 1 | ... | ... |
| Sprint 2 | ... | ... |`;
}

export const SUMMARY_SYSTEM_PROMPT = `Du bist ein erfahrener Requirements Engineer, der einem Product Owner hilft, seine Anforderungen zu strukturieren.

Fasse zusammen, was der User bisher beschrieben hat. Identifiziere 1-2 kritische Rückfragen, falls etwas unklar ist.

Regeln:
1. Schreibe auf Deutsch.
2. Max. 150 Wörter.
3. Strukturiere in Stichpunkten.
4. Nur Rückfragen wenn wirklich kritisch unklar.`;

export function buildSummaryPrompt(
  answers: Partial<GuidedFormAnswers>,
  phase: 2 | 3,
): string {
  if (phase === 2) {
    return `Der Product Owner hat folgende Informationen gegeben:

- **Vision:** ${answers.projectVision}
- **Kategorie:** ${answers.category}
- **Zielgruppe:** ${answers.targetRoles} (${answers.userCount} Nutzer, Level ${answers.techLevel}/5)
- **System:** ${answers.existingSystem}${answers.existingSystemDetails ? ` – ${answers.existingSystemDetails}` : ''}
- **Probleme:** ${answers.mainPain?.join(', ')}
- **Top-Funktionen:** ${answers.topFeatures?.join(', ')}
- **Plattformen:** ${answers.platforms?.join(', ')}

Fasse in 3-4 Stichpunkten zusammen, was du verstanden hast. Falls etwas unklar ist, stelle 1-2 präzise Rückfragen.`;
  }

  return `Zusätzlich hat der Product Owner folgende Strategie gewählt:

**Strategie:** ${answers.strategy}

Bestätige kurz (2-3 Sätze), dass du die Gesamtausrichtung verstanden hast, und ob es noch etwas zu klären gibt, bevor die User Stories generiert werden.`;
}
