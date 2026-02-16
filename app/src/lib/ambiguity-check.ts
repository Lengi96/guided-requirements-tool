import { QualityIssue, UserStory } from './types';

interface AmbiguousTermRule {
  term: string;
  pattern: RegExp;
  suggestion: string;
  severity: QualityIssue['severity'];
}

const AMBIGUOUS_TERMS: AmbiguousTermRule[] = [
  {
    term: 'optimiert',
    pattern: /\boptimiert\w*\b/gi,
    suggestion: 'Definiere ein messbares Optimierungsziel, z.B. "Bearbeitungszeit < 2 Minuten".',
    severity: 'mittel',
  },
  {
    term: 'schnell',
    pattern: /\bschnell\w*\b/gi,
    suggestion: 'Ersetze durch konkrete Performance-Grenzen, z.B. "Antwortzeit <= 1,5 Sekunden".',
    severity: 'hoch',
  },
  {
    term: 'ca.',
    pattern: /\bca\.?\b/gi,
    suggestion: 'Nenne exakte Werte oder Toleranzen, z.B. "zwischen 95 und 105".',
    severity: 'mittel',
  },
  {
    term: 'zeitnah',
    pattern: /\bzeitnah\b/gi,
    suggestion: 'Ersetze durch festen Zeitraum, z.B. "innerhalb von 4 Stunden".',
    severity: 'mittel',
  },
  {
    term: 'benutzerfreundlich',
    pattern: /\bbenutzerfreundlich\w*\b/gi,
    suggestion: 'Definiere beobachtbares UX-Kriterium, z.B. "Aufgabe in max. 3 Klicks".',
    severity: 'mittel',
  },
];

function findIssuesInText(
  text: string,
  location: string,
  issuePrefix: string,
): QualityIssue[] {
  const issues: QualityIssue[] = [];

  for (const rule of AMBIGUOUS_TERMS) {
    for (const match of text.matchAll(rule.pattern)) {
      const start = Math.max(0, (match.index ?? 0) - 40);
      const end = Math.min(text.length, (match.index ?? 0) + match[0].length + 40);
      const context = text.slice(start, end).trim();

      issues.push({
        id: `${issuePrefix}-${rule.term}-${match.index ?? 0}`,
        term: match[0],
        location,
        context,
        suggestion: rule.suggestion,
        severity: rule.severity,
      });
    }
  }

  return issues;
}

export function analyzeStoryAmbiguity(story: UserStory): QualityIssue[] {
  const issues: QualityIssue[] = [];

  issues.push(...findIssuesInText(story.title, 'Titel', `${story.number}-title`));
  issues.push(...findIssuesInText(story.action, 'Story-Text (Aktion)', `${story.number}-action`));
  issues.push(...findIssuesInText(story.benefit, 'Story-Text (Nutzen)', `${story.number}-benefit`));

  for (const [index, criterion] of story.acceptanceCriteria.entries()) {
    issues.push(
      ...findIssuesInText(
        criterion,
        `Akzeptanzkriterium ${index + 1}`,
        `${story.number}-ac-${index + 1}`,
      ),
    );
  }

  return issues;
}

