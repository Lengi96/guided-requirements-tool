'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ClassicTestCase, GherkinTestCase, QualityIssue, RequirementTestSuite, UserStory } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';

interface ValidationTestsSectionProps {
  stories: UserStory[];
  suites: RequirementTestSuite[];
  qualityByStory: Record<number, QualityIssue[]>;
  generatingStoryNumber: number | null;
  generationErrorByStory: Record<number, string>;
  onGenerateTestCases: (story: UserStory) => void;
  onUpdateGherkin: (
    storyNumber: number,
    testCaseId: string,
    updates: Partial<GherkinTestCase>,
  ) => void;
  onUpdateClassic: (
    storyNumber: number,
    testCaseId: string,
    updates: Partial<ClassicTestCase>,
  ) => void;
}

const severityClass: Record<QualityIssue['severity'], string> = {
  niedrig: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  mittel: 'bg-amber-100 text-amber-700 border-amber-200',
  hoch: 'bg-red-100 text-red-700 border-red-200',
};

function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ValidationTestsSection({
  stories,
  suites,
  qualityByStory,
  generatingStoryNumber,
  generationErrorByStory,
  onGenerateTestCases,
  onUpdateGherkin,
  onUpdateClassic,
}: ValidationTestsSectionProps) {
  if (stories.length === 0) {
    return <p className="text-sm text-gray-500">Keine User Stories vorhanden.</p>;
  }

  return (
    <div className="space-y-6">
      {stories.map((story) => {
        const suite = suites.find((item) => item.storyNumber === story.number);
        const qualityIssues = qualityByStory[story.number] || [];
        const isGenerating = generatingStoryNumber === story.number;
        const generationError = generationErrorByStory[story.number];

        return (
          <div key={story.number} className="glass-subtle rounded-xl border border-white/40 p-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  <span className="text-indigo-500 font-mono">#{story.number}</span> {story.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Als {story.role} moechte ich {story.action} damit {story.benefit}
                </p>
              </div>
              <Button
                onClick={() => onGenerateTestCases(story)}
                disabled={isGenerating}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs sm:text-sm"
              >
                {isGenerating ? (
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                ) : (
                  <Wand2 className="size-4 mr-1.5" />
                )}
                Testfaelle generieren
              </Button>
            </div>

            {generationError && (
              <p className="text-xs text-red-600">{generationError}</p>
            )}

            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Anforderungen-Qualitaetscheck (Ambiguity)
              </h5>
              {qualityIssues.length === 0 ? (
                <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                  Keine schwammigen Begriffe erkannt.
                </p>
              ) : (
                <div className="space-y-2">
                  {qualityIssues.map((issue) => (
                    <div key={issue.id} className="rounded-lg border border-amber-200 bg-amber-50 p-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={severityClass[issue.severity]}>{issue.severity}</Badge>
                        <span className="text-xs font-semibold text-gray-700">&quot;{issue.term}&quot; in {issue.location}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Kontext: {issue.context}</p>
                      <p className="text-xs text-gray-700">
                        Verbesserung: {issue.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {suite && (
              <div className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-800">Gherkin (Given/When/Then)</h5>
                    {suite.gherkin.map((item) => (
                      <div key={item.id} className="rounded-lg border border-white/40 bg-white/50 p-3 space-y-2">
                        <Input
                          value={item.id}
                          onChange={(e) =>
                            onUpdateGherkin(story.number, item.id, { id: e.target.value })
                          }
                          className="text-xs"
                        />
                        <Input
                          value={item.scenario}
                          onChange={(e) =>
                            onUpdateGherkin(story.number, item.id, { scenario: e.target.value })
                          }
                          className="text-sm"
                        />
                        <Textarea
                          value={item.given.join('\n')}
                          onChange={(e) =>
                            onUpdateGherkin(story.number, item.id, { given: splitLines(e.target.value) })
                          }
                          rows={3}
                          className="text-xs"
                          placeholder="Given Zeilenweise"
                        />
                        <Textarea
                          value={item.when.join('\n')}
                          onChange={(e) =>
                            onUpdateGherkin(story.number, item.id, { when: splitLines(e.target.value) })
                          }
                          rows={2}
                          className="text-xs"
                          placeholder="When Zeilenweise"
                        />
                        <Textarea
                          value={item.then.join('\n')}
                          onChange={(e) =>
                            onUpdateGherkin(story.number, item.id, { then: splitLines(e.target.value) })
                          }
                          rows={3}
                          className="text-xs"
                          placeholder="Then Zeilenweise"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-800">Klassische Testschritte</h5>
                    {suite.classic.map((item) => (
                      <div key={item.id} className="rounded-lg border border-white/40 bg-white/50 p-3 space-y-2">
                        <Input
                          value={item.id}
                          onChange={(e) =>
                            onUpdateClassic(story.number, item.id, { id: e.target.value })
                          }
                          className="text-xs"
                        />
                        <Input
                          value={item.scenario}
                          onChange={(e) =>
                            onUpdateClassic(story.number, item.id, { scenario: e.target.value })
                          }
                          className="text-sm"
                        />
                        <Textarea
                          value={item.steps.join('\n')}
                          onChange={(e) =>
                            onUpdateClassic(story.number, item.id, { steps: splitLines(e.target.value) })
                          }
                          rows={4}
                          className="text-xs"
                          placeholder="Schritte zeilenweise"
                        />
                        <Textarea
                          value={item.expectedResult}
                          onChange={(e) =>
                            onUpdateClassic(story.number, item.id, { expectedResult: e.target.value })
                          }
                          rows={2}
                          className="text-xs"
                          placeholder="Expected Result"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
