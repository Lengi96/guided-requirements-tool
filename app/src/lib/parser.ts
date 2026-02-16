import { GeneratedOutput, UserStory, NFR, SprintPlan, FollowUpQuestion, SummaryResponse } from './types';

export function parseSummaryResponse(raw: string): SummaryResponse {
  const summaryMatch = raw.match(/---ZUSAMMENFASSUNG---([\s\S]*?)---RÜCKFRAGEN---/);
  const questionsMatch = raw.match(/---RÜCKFRAGEN---([\s\S]*?)$/);

  const summaryText = summaryMatch
    ? summaryMatch[1].trim()
    : raw.trim(); // Fallback: entire response = summary

  const followUpQuestions: FollowUpQuestion[] = [];

  if (questionsMatch) {
    const questionsBlock = questionsMatch[1].trim();
    if (questionsBlock.toLowerCase() !== 'keine') {
      const lines = questionsBlock.split('\n').filter((l) => l.trim());
      lines.forEach((line, idx) => {
        const criticalMatch = line.match(/\[KRITISCH\]\s*(.+)/);
        const optionalMatch = line.match(/\[OPTIONAL\]\s*(.+)/);

        if (criticalMatch) {
          followUpQuestions.push({
            id: `fq-${idx + 1}`,
            question: criticalMatch[1].trim(),
            isCritical: true,
          });
        } else if (optionalMatch) {
          followUpQuestions.push({
            id: `fq-${idx + 1}`,
            question: optionalMatch[1].trim(),
            isCritical: false,
          });
        } else if (line.trim()) {
          followUpQuestions.push({
            id: `fq-${idx + 1}`,
            question: line.trim(),
            isCritical: false,
          });
        }
      });
    }
  }

  return { summaryText, followUpQuestions };
}

export function parseClaudeOutput(raw: string): GeneratedOutput {
  const warnings: string[] = [];
  const userStories = parseStories(raw, warnings);
  const nfrs = parseNFRs(raw, warnings);
  const openQuestions = parseOpenQuestions(raw, warnings);
  const sprintPlan = parseSprintPlan(raw);
  const mermaidDiagram = parseMermaidDiagram(raw);

  if (userStories.length === 0) {
    warnings.push('Keine User Stories erkannt. Prüfen Sie die rohe Antwort.');
  }
  if (nfrs.length === 0) {
    warnings.push('Keine NFRs erkannt.');
  }
  if (sprintPlan.length === 0) {
    warnings.push('Kein Sprint-Plan erkannt.');
  }

  return {
    rawResponse: raw,
    userStories,
    testSuites: [],
    nfrs,
    openQuestions,
    sprintPlan,
    mermaidDiagram,
    parsingWarnings: warnings,
  };
}

const VALID_EFFORTS = ['S', 'M', 'L', 'XL'] as const;
const VALID_PRIORITIES = ['HOCH', 'MITTEL', 'NIEDRIG'] as const;
const VALID_RECOMMENDATIONS = ['Standard', 'Erweitert', 'Enterprise'] as const;

function parseStories(raw: string, warnings: string[]): UserStory[] {
  const stories: UserStory[] = [];
  const blocks = raw.split(/###\s*User Story\s+(\d+)\s*:/);

  for (let i = 1; i < blocks.length; i += 2) {
    const num = parseInt(blocks[i], 10);
    if (isNaN(num)) {
      warnings.push(`Story-Nummer konnte nicht gelesen werden: "${blocks[i]}"`);
      continue;
    }
    const body = blocks[i + 1] || '';

    const titleMatch = body.match(/^(.+?)[\r\n]/);
    const title = titleMatch ? titleMatch[1].trim() : `Story ${num}`;

    const priorityMatch = body.match(/\*\*Priorität:\*\*\s*(HOCH|MITTEL|NIEDRIG)/i);
    const priorityRaw = priorityMatch?.[1]?.toUpperCase() || 'MITTEL';
    const priority = (VALID_PRIORITIES.includes(priorityRaw as typeof VALID_PRIORITIES[number])
      ? priorityRaw
      : 'MITTEL') as UserStory['priority'];

    const roleMatch = body.match(/Als\s+(.+?)(?:[\r\n]|$)/);
    const role = roleMatch ? roleMatch[1].trim() : '';

    const actionMatch = body.match(/möchte ich\s+(.+?)(?:[\r\n]|$)/);
    const action = actionMatch ? actionMatch[1].trim() : '';

    const benefitMatch = body.match(/damit\s+(.+?)(?:[\r\n]|$)/);
    const benefit = benefitMatch ? benefitMatch[1].trim() : '';

    if (!role && !action) {
      warnings.push(`Story #${num}: "Als/möchte ich"-Format nicht erkannt.`);
    }

    // Flexible acceptance criteria matching: - [ ], - [x], * [ ], or just - with text
    const criteriaMatches = [...body.matchAll(/[-*]\s*\[[\sx]?\]\s*(.+)/g)];
    const acceptanceCriteria = criteriaMatches.map((m) => m[1].trim());

    if (acceptanceCriteria.length === 0) {
      warnings.push(`Story #${num}: Keine Akzeptanzkriterien erkannt.`);
    }

    const depMatch = body.match(/\*\*Abhängigkeiten:\*\*\s*(.+)/);
    const dependencies = depMatch
      ? depMatch[1]
          .split(/[,;]/)
          .map((d) => d.trim())
          .filter((d) => d && d.toLowerCase() !== 'keine' && d !== '-' && d.toLowerCase() !== 'none')
      : [];

    const effortMatch = body.match(/\*\*(?:Geschätzter\s+)?Aufwand:\*\*\s*(S|M|L|XL)/i);
    const effortRaw = effortMatch ? effortMatch[1].toUpperCase() : 'M';
    const effort = (VALID_EFFORTS.includes(effortRaw as typeof VALID_EFFORTS[number])
      ? effortRaw
      : 'M') as UserStory['effort'];

    const sourceMatch = body.match(/\*\*Quelle:\*\*\s*(.+)/);
    const sourceTag = sourceMatch ? sourceMatch[1].trim() : undefined;

    stories.push({
      number: num,
      title,
      priority,
      role,
      action,
      benefit,
      acceptanceCriteria,
      dependencies,
      effort,
      sourceTag,
    });
  }

  return stories;
}

function parseNFRs(raw: string, warnings: string[]): NFR[] {
  const nfrs: NFR[] = [];
  const matches = [...raw.matchAll(/\*\*NFR-([A-Za-z]+)(\d+):\*\*\s*(.+)/g)];

  const catMap: Record<string, string> = {
    P: 'Performance',
    S: 'Security',
    V: 'Verfügbarkeit',
    PL: 'Plattformen',
    U: 'Usability',
    W: 'Wartbarkeit',
    SK: 'Skalierbarkeit',
    D: 'Datenschutz',
  };

  for (const m of matches) {
    const catCode = m[1];
    const num = m[2];
    const rest = m[3];

    const recMatch = rest.match(/Empfehlung:\s*(Standard|Erweitert|Enterprise)/);
    const recRaw = recMatch?.[1] || 'Standard';
    const recommendation = (VALID_RECOMMENDATIONS.includes(recRaw as typeof VALID_RECOMMENDATIONS[number])
      ? recRaw
      : 'Standard') as NFR['recommendation'];

    const sourceTagMatch = rest.match(/Abgeleitet aus:\s*(.+?)(?:\s*Empfehlung:|$)/);
    const nfrSourceTag = sourceTagMatch ? sourceTagMatch[1].trim() : undefined;

    nfrs.push({
      id: `NFR-${catCode}${num}`,
      category: catMap[catCode] || catCode,
      requirement: rest.replace(/\s*(?:Empfehlung:|Abgeleitet aus:).*/, '').trim(),
      recommendation,
      sourceTag: nfrSourceTag,
    });
  }

  // Fallback: if regex didn't find formatted NFRs, extract section as text
  if (nfrs.length === 0) {
    const section = raw.match(
      /## TEIL 2: NICHT-FUNKTIONALE ANFORDERUNGEN([\s\S]*?)(?=## TEIL 3|$)/,
    );
    if (section) {
      const lines = section[1]
        .split('\n')
        .filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
      for (const [idx, line] of lines.entries()) {
        nfrs.push({
          id: `NFR-${idx + 1}`,
          category: 'Allgemein',
          requirement: line.replace(/^[-*]\s*/, '').trim(),
          recommendation: 'Standard',
        });
      }
      if (lines.length > 0) {
        warnings.push('NFRs wurden im Fallback-Modus erkannt (kein Standard-Format).');
      }
    }
  }

  return nfrs;
}

function parseOpenQuestions(raw: string, warnings: string[]): string[] {
  const section = raw.match(/## TEIL 3: OFFENE FRAGEN([\s\S]*?)(?=## TEIL 4|$)/);
  if (!section) {
    warnings.push('Abschnitt "Offene Fragen" nicht gefunden.');
    return [];
  }

  const matches = [...section[1].matchAll(/\d+\.\s+(.+)/g)];
  return matches.map((m) => m[1].trim());
}

function parseSprintPlan(raw: string): SprintPlan[] {
  const plans: SprintPlan[] = [];
  const matches = [...raw.matchAll(/\|\s*Sprint\s+(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g)];

  for (const m of matches) {
    const sprintNum = parseInt(m[1], 10);
    if (isNaN(sprintNum)) continue;
    plans.push({
      sprintNumber: sprintNum,
      stories: m[2].trim(),
      reasoning: m[3].trim(),
    });
  }

  return plans;
}

function parseMermaidDiagram(raw: string): string | undefined {
  const match = raw.match(/---MERMAID_START---([\s\S]*?)---MERMAID_END---/);
  if (match) {
    return match[1].trim();
  }
  // Fallback: try to find a mermaid code block
  const codeBlockMatch = raw.match(/```mermaid\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  return undefined;
}
