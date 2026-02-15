import { UserStory } from './types';

export interface InvestScore {
  criterion: string;
  label: string;
  score: 'good' | 'warning' | 'bad';
  feedback: string;
}

export interface InvestResult {
  storyNumber: number;
  storyTitle: string;
  overallScore: number;
  scores: InvestScore[];
}

function checkIndependent(story: UserStory, allStories: UserStory[]): InvestScore {
  const hasDeps = story.dependencies.length > 0;
  const depOnOtherStories = story.dependencies.some((d) =>
    allStories.some((s) => s.number !== story.number && (d.includes(`#${s.number}`) || d.includes(`Story ${s.number}`))),
  );

  if (!hasDeps) {
    return { criterion: 'I', label: 'Independent', score: 'good', feedback: 'Keine Abhängigkeiten zu anderen Stories.' };
  }
  if (depOnOtherStories) {
    return { criterion: 'I', label: 'Independent', score: 'warning', feedback: `Abhängig von anderen Stories: ${story.dependencies.join(', ')}. Prüfen, ob entkoppelbar.` };
  }
  return { criterion: 'I', label: 'Independent', score: 'good', feedback: 'Externe Abhängigkeiten, aber unabhängig von anderen Stories.' };
}

function checkNegotiable(story: UserStory): InvestScore {
  const tooSpecific = /genau|exakt|muss zwingend|nur so|ausschließlich/i.test(
    `${story.action} ${story.benefit}`,
  );
  const hasImplementationDetail = /API|Datenbank|SQL|REST|React|Button|Klick|CSS/i.test(story.action);

  if (tooSpecific || hasImplementationDetail) {
    return {
      criterion: 'N',
      label: 'Negotiable',
      score: 'warning',
      feedback: 'Enthält möglicherweise Implementierungsdetails. User Stories sollten das "Was", nicht das "Wie" beschreiben.',
    };
  }
  return { criterion: 'N', label: 'Negotiable', score: 'good', feedback: 'Story ist auf Business-Ebene formuliert und verhandelbar.' };
}

function checkValuable(story: UserStory): InvestScore {
  if (!story.benefit || story.benefit.length < 10) {
    return { criterion: 'V', label: 'Valuable', score: 'bad', feedback: 'Kein klarer Business Value angegeben. "damit..." sollte konkreten Nutzen beschreiben.' };
  }
  const vagueTerms = /besser|einfacher|schneller|effizienter|optimiert/i.test(story.benefit);
  if (vagueTerms && story.benefit.length < 30) {
    return { criterion: 'V', label: 'Valuable', score: 'warning', feedback: 'Business Value ist vage formuliert. Konkretere Angaben wie messbare Ergebnisse wären besser.' };
  }
  return { criterion: 'V', label: 'Valuable', score: 'good', feedback: 'Klarer Business Value definiert.' };
}

function checkEstimable(story: UserStory): InvestScore {
  const criteriaCount = story.acceptanceCriteria.length;
  if (criteriaCount === 0) {
    return { criterion: 'E', label: 'Estimable', score: 'bad', feedback: 'Keine Akzeptanzkriterien. Ohne klare Kriterien ist der Aufwand nicht schätzbar.' };
  }
  if (criteriaCount < 3) {
    return { criterion: 'E', label: 'Estimable', score: 'warning', feedback: `Nur ${criteriaCount} Akzeptanzkriterien. 3-5 Kriterien helfen bei der Aufwandschätzung.` };
  }
  if (!story.action || story.action.length < 15) {
    return { criterion: 'E', label: 'Estimable', score: 'warning', feedback: 'Aktion ist sehr kurz. Mehr Details helfen bei der Aufwandschätzung.' };
  }
  return { criterion: 'E', label: 'Estimable', score: 'good', feedback: 'Story ist gut genug beschrieben, um den Aufwand zu schätzen.' };
}

function checkSmall(story: UserStory): InvestScore {
  const criteriaCount = story.acceptanceCriteria.length;
  if (story.effort === 'XL') {
    return { criterion: 'S', label: 'Small', score: 'bad', feedback: 'Aufwand XL: Story sollte in kleinere Stories aufgeteilt werden.' };
  }
  if (story.effort === 'L' && criteriaCount > 5) {
    return { criterion: 'S', label: 'Small', score: 'warning', feedback: 'Aufwand L mit vielen Kriterien. Aufteilen in 2-3 kleinere Stories erwägen.' };
  }
  if (criteriaCount > 7) {
    return { criterion: 'S', label: 'Small', score: 'warning', feedback: `${criteriaCount} Akzeptanzkriterien deuten auf eine zu große Story hin.` };
  }
  return { criterion: 'S', label: 'Small', score: 'good', feedback: 'Story hat einen angemessenen Umfang.' };
}

function checkTestable(story: UserStory): InvestScore {
  if (story.acceptanceCriteria.length === 0) {
    return { criterion: 'T', label: 'Testable', score: 'bad', feedback: 'Keine Akzeptanzkriterien – Story ist nicht testbar.' };
  }

  const vagueCount = story.acceptanceCriteria.filter((c) =>
    /sollte|angemessen|gut|schön|korrekt|richtig|ordnungsgemäß/i.test(c) &&
    !/\d/.test(c),
  ).length;

  if (vagueCount > story.acceptanceCriteria.length / 2) {
    return {
      criterion: 'T',
      label: 'Testable',
      score: 'warning',
      feedback: `${vagueCount} von ${story.acceptanceCriteria.length} Kriterien sind vage formuliert. Messbare Werte verwenden.`,
    };
  }
  return { criterion: 'T', label: 'Testable', score: 'good', feedback: 'Akzeptanzkriterien sind testbar formuliert.' };
}

export function validateStory(story: UserStory, allStories: UserStory[]): InvestResult {
  const scores: InvestScore[] = [
    checkIndependent(story, allStories),
    checkNegotiable(story),
    checkValuable(story),
    checkEstimable(story),
    checkSmall(story),
    checkTestable(story),
  ];

  const scoreValues = { good: 3, warning: 2, bad: 1 };
  const total = scores.reduce((sum, s) => sum + scoreValues[s.score], 0);
  const overallScore = Math.round((total / (scores.length * 3)) * 100);

  return {
    storyNumber: story.number,
    storyTitle: story.title,
    overallScore,
    scores,
  };
}

export function validateAllStories(stories: UserStory[]): InvestResult[] {
  return stories.map((story) => validateStory(story, stories));
}
