import { GuidedFormAnswers, FollowUpQuestion, UserStory } from './types';

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
10. Wenn Informationen fehlen oder unklar sind, formuliere offene Fragen.

WICHTIG – Quellenrückverfolgung (Source-Tagging):
11. Jede User Story MUSS ein Feld "**Quelle:**" enthalten, das angibt, auf welchen Teil des Nutzer-Inputs sie sich bezieht.
12. Verwende dafür exakte Zitate oder Verweise aus dem Input: z.B. "Quelle: Vision ('Online-Shop für nachhaltige Produkte'), Top-Feature #2 ('Warenkorb')".
13. Erfinde KEINE Anforderungen, die nicht aus dem Input ableitbar sind. Wenn du etwas ergänzt, kennzeichne es explizit als "[ERGÄNZUNG]" mit Begründung.
14. Bei NFRs gib ebenfalls an, ob sie aus dem Input abgeleitet oder als Best Practice ergänzt wurden: "Abgeleitet aus: [Quelle]" oder "[BEST PRACTICE]".`;

export function buildGenerationPrompt(
  answers: GuidedFormAnswers,
  followUpQuestions?: FollowUpQuestion[],
  followUpAnswers?: Record<string, string>,
): string {
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
${(() => {
  if (!followUpQuestions?.length || !followUpAnswers) return '';
  const pairs = followUpQuestions
    .filter((fq) => followUpAnswers[fq.id]?.trim())
    .map((fq) => `**Frage:** ${fq.question}\n**Antwort:** ${followUpAnswers[fq.id]}`);
  if (pairs.length === 0) return '';
  return `\n## Klärungen (Antworten auf Rückfragen)\n${pairs.join('\n\n')}`;
})()}
${(() => {
  if (!answers.contextDocument) return '';
  const docName = answers.contextDocumentName || 'Kontext-Dokument';
  return `\n## Kontext-Dokument: ${docName}\nDer Nutzer hat folgendes Dokument als zusätzlichen Kontext hochgeladen. Berücksichtige die darin enthaltenen Standards, Anforderungen und Rahmenbedingungen bei der Erstellung der User Stories und NFRs.\n\n${answers.contextDocument}`;
})()}

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
**Quelle:** [Exaktes Zitat oder Verweis auf den Nutzer-Input, z.B. "Vision: '...', Top-Feature #1: '...'"]

---

## TEIL 2: NICHT-FUNKTIONALE ANFORDERUNGEN

Leite NFRs ab zu Performance, Security, Verfügbarkeit, Plattformen.

Format: **NFR-[Kürzel][Nr]:** [Beschreibung]
Empfehlung: Standard / Erweitert / Enterprise
Abgeleitet aus: [Verweis auf Input oder "[BEST PRACTICE]"]

---

## TEIL 3: OFFENE FRAGEN

Liste 3-5 offene Fragen als nummerierte Liste.

---

## TEIL 4: EMPFOHLENE UMSETZUNGSREIHENFOLGE

| Sprint | User Stories | Begründung |
|---|---|---|
| Sprint 1 | ... | ... |
| Sprint 2 | ... | ... |

---

## TEIL 5: USER FLOW DIAGRAMM

Erstelle ein Mermaid-Flowchart-Diagramm, das den Haupt-Nutzerfluss der Anwendung zeigt.
Verwende das \`graph TD\`-Format (Top-Down). Beschrifte alle Knoten auf Deutsch.
Maximal 8-12 Knoten. Verwende Entscheidungsknoten (Rauten) wo sinnvoll.

Umschließe das Diagramm mit den Markern:
---MERMAID_START---
graph TD
  ...
---MERMAID_END---`;
}

export const SUMMARY_SYSTEM_PROMPT = `Du bist ein erfahrener Requirements Engineer, der einem Product Owner hilft, seine Anforderungen zu strukturieren.

Fasse zusammen, was der User bisher beschrieben hat. Stelle gezielte Rückfragen, um Unklarheiten zu beseitigen und bessere User Stories generieren zu können.

Regeln:
1. Schreibe auf Deutsch.
2. Max. 150 Wörter für die Zusammenfassung.
3. Strukturiere die Zusammenfassung in Stichpunkten.
4. Stelle 1-3 Rückfragen. Markiere kritische Fragen mit [KRITISCH], optionale mit [OPTIONAL].
5. Fokussiere Rückfragen auf: fehlende Business-Logik, unklare Abgrenzungen, Nutzer-Workflows, Schnittstellen und Prioritätskonflikte.

Ausgabeformat (exakt einhalten):

---ZUSAMMENFASSUNG---
[Deine Zusammenfassung in Stichpunkten]

---RÜCKFRAGEN---
[KRITISCH] Frage 1
[OPTIONAL] Frage 2

Falls keine Rückfragen nötig sind, schreibe nach ---RÜCKFRAGEN--- nur: Keine`;

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

Fasse in 3-4 Stichpunkten zusammen, was du verstanden hast. Stelle Rückfragen zu unklaren Punkten. Verwende das vorgegebene Ausgabeformat.`;
  }

  return `Zusätzlich hat der Product Owner folgende Strategie gewählt:

**Strategie:** ${answers.strategy}

Bestätige kurz, dass du die Gesamtausrichtung verstanden hast. Stelle abschließende Rückfragen, falls noch etwas geklärt werden sollte, bevor die User Stories generiert werden. Verwende das vorgegebene Ausgabeformat.`;
}

export const TEST_CASE_SYSTEM_PROMPT = `Du bist ein Senior QA Engineer mit Fokus auf testbare Anforderungen, Traceability und reproduzierbare Tests.

Regeln:
1. Schreibe auf Deutsch.
2. Arbeite strikt an der gegebenen User Story. Erfinde keine fremden Features.
3. Erzeuge realistische, klar durchfuehrbare Testfaelle.
4. Liefere gueltiges JSON entsprechend dem vorgegebenen Schema.
5. Stelle sicher, dass auch Negativ- und Randfaelle enthalten sind.
6. Jeder Testfall muss direkt auf die Akzeptanzkriterien der Story rueckfuehrbar sein.`;

export function buildTestCaseGenerationPrompt(story: UserStory): string {
  const criteria = story.acceptanceCriteria.length
    ? story.acceptanceCriteria.map((item, index) => `${index + 1}. ${item}`).join('\n')
    : 'Keine expliziten Akzeptanzkriterien vorhanden.';

  return `Erzeuge Testfaelle fuer diese User Story:

Story-Nummer: ${story.number}
Titel: ${story.title}
Prioritaet: ${story.priority}
Als ${story.role}
moechte ich ${story.action}
damit ${story.benefit}

Akzeptanzkriterien:
${criteria}

Rueckgabeformat (nur JSON, kein Markdown, kein weiterer Text):
{
  "gherkin": [
    {
      "id": "G-${story.number}-1",
      "scenario": "Kurzer Szenario-Titel",
      "given": ["Vorbedingung 1", "Vorbedingung 2"],
      "when": ["Aktion 1"],
      "then": ["Erwartung 1", "Erwartung 2"]
    }
  ],
  "classic": [
    {
      "id": "TC-${story.number}-1",
      "scenario": "Kurzer Szenario-Titel",
      "steps": ["Schritt 1", "Schritt 2"],
      "expectedResult": "Praezise Erwartung"
    }
  ]
}

Erzeuge mindestens 3 Gherkin- und 3 klassische Testfaelle.`;
}
