import { GeneratedOutput, UserStory, NFR, SprintPlan } from './types';

export function parseClaudeOutput(raw: string): GeneratedOutput {
  return {
    rawResponse: raw,
    userStories: parseStories(raw),
    nfrs: parseNFRs(raw),
    openQuestions: parseOpenQuestions(raw),
    sprintPlan: parseSprintPlan(raw),
  };
}

function parseStories(raw: string): UserStory[] {
  const stories: UserStory[] = [];
  const blocks = raw.split(/### User Story (\d+):/);

  for (let i = 1; i < blocks.length; i += 2) {
    const num = parseInt(blocks[i], 10);
    const body = blocks[i + 1] || '';

    const titleMatch = body.match(/^(.+?)[\r\n]/);
    const title = titleMatch ? titleMatch[1].trim() : `Story ${num}`;

    const priorityMatch = body.match(/\*\*Priorität:\*\*\s*(HOCH|MITTEL|NIEDRIG)/);
    const priority = (priorityMatch?.[1] || 'MITTEL') as UserStory['priority'];

    const roleMatch = body.match(/Als\s+(.+?)[\r\n]/);
    const role = roleMatch ? roleMatch[1].trim() : '';

    const actionMatch = body.match(/möchte ich\s+(.+?)[\r\n]/);
    const action = actionMatch ? actionMatch[1].trim() : '';

    const benefitMatch = body.match(/damit\s+(.+?)[\r\n]/);
    const benefit = benefitMatch ? benefitMatch[1].trim() : '';

    const criteriaMatches = [...body.matchAll(/- \[ \]\s+(.+)/g)];
    const acceptanceCriteria = criteriaMatches.map((m) => m[1].trim());

    const depMatch = body.match(/\*\*Abhängigkeiten:\*\*\s*(.+)/);
    const dependencies = depMatch
      ? depMatch[1]
          .split(/[,;]/)
          .map((d) => d.trim())
          .filter((d) => d && d !== 'Keine' && d !== 'keine' && d !== '-')
      : [];

    const effortMatch = body.match(/\*\*(?:Geschätzter )?Aufwand:\*\*\s*(S|M|L|XL)/);
    const effort = effortMatch ? effortMatch[1] : 'M';

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
    });
  }

  return stories;
}

function parseNFRs(raw: string): NFR[] {
  const nfrs: NFR[] = [];
  const matches = [...raw.matchAll(/\*\*NFR-([A-Za-z]+)(\d+):\*\*\s*(.+)/g)];

  for (const m of matches) {
    const catCode = m[1];
    const num = m[2];
    const rest = m[3];

    const catMap: Record<string, string> = {
      P: 'Performance',
      S: 'Security',
      V: 'Verfügbarkeit',
      PL: 'Plattformen',
    };

    const recMatch = rest.match(/Empfehlung:\s*(Standard|Erweitert|Enterprise)/);

    nfrs.push({
      id: `NFR-${catCode}${num}`,
      category: catMap[catCode] || catCode,
      requirement: rest.replace(/\s*Empfehlung:.*/, '').trim(),
      recommendation: recMatch ? recMatch[1] : 'Standard',
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
    }
  }

  return nfrs;
}

function parseOpenQuestions(raw: string): string[] {
  const section = raw.match(/## TEIL 3: OFFENE FRAGEN([\s\S]*?)(?=## TEIL 4|$)/);
  if (!section) return [];

  const matches = [...section[1].matchAll(/\d+\.\s+(.+)/g)];
  return matches.map((m) => m[1].trim());
}

function parseSprintPlan(raw: string): SprintPlan[] {
  const plans: SprintPlan[] = [];
  const matches = [...raw.matchAll(/\|\s*Sprint\s+(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g)];

  for (const m of matches) {
    plans.push({
      sprintNumber: parseInt(m[1], 10),
      stories: m[2].trim(),
      reasoning: m[3].trim(),
    });
  }

  return plans;
}
