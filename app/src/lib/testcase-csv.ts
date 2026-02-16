import { RequirementTestSuite } from './types';

function escapeCsv(value: string): string {
  const normalized = value.replace(/\r?\n/g, ' ').trim();
  if (/[",;]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export function generateTestCasesCsv(suites: RequirementTestSuite[]): string {
  const rows: string[] = [];
  rows.push(
    [
      'StoryNumber',
      'StoryTitle',
      'Format',
      'TestCaseId',
      'Scenario',
      'Steps',
      'ExpectedResult',
    ].join(';'),
  );

  for (const suite of suites) {
    for (const gherkin of suite.gherkin) {
      const steps = [
        `Given: ${gherkin.given.join(' | ')}`,
        `When: ${gherkin.when.join(' | ')}`,
        `Then: ${gherkin.then.join(' | ')}`,
      ].join(' || ');

      rows.push(
        [
          suite.storyNumber.toString(),
          escapeCsv(suite.storyTitle),
          'Gherkin',
          escapeCsv(gherkin.id),
          escapeCsv(gherkin.scenario),
          escapeCsv(steps),
          escapeCsv(gherkin.then.join(' | ')),
        ].join(';'),
      );
    }

    for (const classic of suite.classic) {
      rows.push(
        [
          suite.storyNumber.toString(),
          escapeCsv(suite.storyTitle),
          'Classic',
          escapeCsv(classic.id),
          escapeCsv(classic.scenario),
          escapeCsv(classic.steps.join(' | ')),
          escapeCsv(classic.expectedResult),
        ].join(';'),
      );
    }
  }

  return rows.join('\n');
}

