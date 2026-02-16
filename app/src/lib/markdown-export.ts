import { GeneratedOutput, UserStory, NFR, SprintPlan } from './types';

interface MarkdownExportOptions {
  output: GeneratedOutput;
  projectName: string;
  email?: string;
  date: string;
}

function formatStory(story: UserStory): string {
  const lines: string[] = [];
  lines.push(`### User Story ${story.number}: ${story.title}`);
  lines.push('');
  lines.push(`**Priorität:** ${story.priority}`);
  lines.push('');
  lines.push(`Als ${story.role}`);
  lines.push(`möchte ich ${story.action}`);
  lines.push(`damit ${story.benefit}`);
  lines.push('');
  if (story.acceptanceCriteria.length > 0) {
    lines.push('**Akzeptanzkriterien:**');
    for (const criterion of story.acceptanceCriteria) {
      lines.push(`- [ ] ${criterion}`);
    }
    lines.push('');
  }
  if (story.dependencies.length > 0) {
    lines.push(`**Abhängigkeiten:** ${story.dependencies.join(', ')}`);
  }
  lines.push(`**Geschätzter Aufwand:** ${story.effort}`);
  if (story.sourceTag) {
    lines.push(`**Quelle:** ${story.sourceTag}`);
  }
  lines.push('');
  return lines.join('\n');
}

function formatNFR(nfr: NFR): string {
  const parts = [`**${nfr.id}:** ${nfr.requirement} — Empfehlung: ${nfr.recommendation}`];
  if (nfr.sourceTag) {
    parts.push(`  *Quelle: ${nfr.sourceTag}*`);
  }
  return parts.join('\n');
}

function formatSprintRow(sprint: SprintPlan): string {
  return `| Sprint ${sprint.sprintNumber} | ${sprint.stories} | ${sprint.reasoning} |`;
}

export function generateMarkdown(options: MarkdownExportOptions): string {
  const { output, projectName, email, date } = options;
  const { userStories, nfrs, openQuestions, sprintPlan } = output;

  const lines: string[] = [];

  // Header
  lines.push(`# Anforderungsdokument: ${projectName}`);
  lines.push('');
  lines.push(`> Generiert am ${date}${email ? ` | ${email}` : ''}`);
  lines.push('');

  // Table of Contents
  lines.push('## Inhaltsverzeichnis');
  lines.push('');
  lines.push('1. [User Stories](#teil-1-user-stories)');
  lines.push('2. [Nicht-funktionale Anforderungen](#teil-2-nicht-funktionale-anforderungen)');
  lines.push('3. [Offene Fragen](#teil-3-offene-fragen)');
  lines.push('4. [Empfohlene Umsetzungsreihenfolge](#teil-4-empfohlene-umsetzungsreihenfolge)');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Statistics
  lines.push('## Übersicht');
  lines.push('');
  lines.push(`| Metrik | Wert |`);
  lines.push(`|---|---|`);
  lines.push(`| User Stories | ${userStories.length} |`);
  lines.push(`| Hohe Priorität | ${userStories.filter((s) => s.priority === 'HOCH').length} |`);
  lines.push(`| NFRs | ${nfrs.length} |`);
  lines.push(`| Sprints | ${sprintPlan.length} |`);
  lines.push(`| Offene Fragen | ${openQuestions.length} |`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // User Stories
  lines.push('## TEIL 1: USER STORIES');
  lines.push('');
  for (const story of userStories) {
    lines.push(formatStory(story));
    lines.push('---');
    lines.push('');
  }

  // NFRs
  lines.push('## TEIL 2: NICHT-FUNKTIONALE ANFORDERUNGEN');
  lines.push('');
  const grouped = nfrs.reduce(
    (acc, nfr) => {
      const cat = nfr.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(nfr);
      return acc;
    },
    {} as Record<string, NFR[]>,
  );
  for (const [category, items] of Object.entries(grouped)) {
    lines.push(`### ${category}`);
    lines.push('');
    for (const nfr of items) {
      lines.push(formatNFR(nfr));
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Open Questions
  lines.push('## TEIL 3: OFFENE FRAGEN');
  lines.push('');
  for (const [idx, question] of openQuestions.entries()) {
    lines.push(`${idx + 1}. ${question}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Sprint Plan
  lines.push('## TEIL 4: EMPFOHLENE UMSETZUNGSREIHENFOLGE');
  lines.push('');
  if (sprintPlan.length > 0) {
    lines.push('| Sprint | User Stories | Begründung |');
    lines.push('|---|---|---|');
    for (const sprint of sprintPlan) {
      lines.push(formatSprintRow(sprint));
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*Generiert mit dem Guided Requirements Tool*');

  return lines.join('\n');
}
