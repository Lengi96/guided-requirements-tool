'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGuidedForm } from '@/hooks/use-guided-form';
import { StoryCard } from '@/components/results/story-card';
import { NFRSection } from '@/components/results/nfr-section';
import { QuestionsSection } from '@/components/results/questions-section';
import { SprintPlanSection } from '@/components/results/sprint-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function ResultsPage() {
  const router = useRouter();
  const { generatedOutput, answers, reset } = useGuidedForm();

  useEffect(() => {
    if (!generatedOutput) {
      router.push('/guided');
    }
  }, [generatedOutput, router]);

  if (!generatedOutput) {
    return null;
  }

  const { userStories, nfrs, openQuestions, sprintPlan } = generatedOutput;

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          output: generatedOutput,
          projectName: answers.projectVision?.slice(0, 60) || 'Projekt',
          email: answers.email || '',
        }),
      });

      if (!response.ok) {
        throw new Error('PDF-Generierung fehlgeschlagen');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anforderungen-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('PDF-Download fehlgeschlagen. Bitte versuche es erneut.');
    }
  };

  const handleRestart = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dein Anforderungsdokument</h1>
              <p className="text-gray-500 text-sm mt-1">
                {userStories.length} User Stories &middot;{' '}
                {nfrs.length} NFRs &middot;{' '}
                {openQuestions.length} offene Fragen
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRestart}>
                Neues Projekt
              </Button>
              <Button onClick={handleDownloadPDF}>
                PDF herunterladen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{userStories.length}</div>
              <div className="text-sm text-gray-500 mt-1">User Stories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-red-600">
                {userStories.filter((s) => s.priority === 'HOCH').length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Hohe Priorität</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{nfrs.length}</div>
              <div className="text-sm text-gray-500 mt-1">NFRs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">{sprintPlan.length}</div>
              <div className="text-sm text-gray-500 mt-1">Sprints</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stories">
              User Stories
              <Badge variant="secondary" className="ml-2 text-xs">
                {userStories.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="nfrs">
              NFRs
              <Badge variant="secondary" className="ml-2 text-xs">
                {nfrs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="questions">
              Offene Fragen
              <Badge variant="secondary" className="ml-2 text-xs">
                {openQuestions.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sprints">Sprint-Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">Filter:</span>
              {['HOCH', 'MITTEL', 'NIEDRIG'].map((p) => {
                const count = userStories.filter((s) => s.priority === p).length;
                return count > 0 ? (
                  <Badge key={p} variant="outline" className="text-xs">
                    {p} ({count})
                  </Badge>
                ) : null;
              })}
            </div>
            {userStories.map((story) => (
              <StoryCard key={story.number} story={story} />
            ))}
          </TabsContent>

          <TabsContent value="nfrs">
            <Card>
              <CardHeader>
                <CardTitle>Nicht-funktionale Anforderungen</CardTitle>
              </CardHeader>
              <CardContent>
                <NFRSection nfrs={nfrs} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Offene Fragen</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionsSection questions={openQuestions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sprints">
            <Card>
              <CardHeader>
                <CardTitle>Empfohlene Umsetzungsreihenfolge</CardTitle>
              </CardHeader>
              <CardContent>
                <SprintPlanSection sprints={sprintPlan} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Raw output toggle */}
        <details className="mt-8 border rounded-lg p-4">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Rohe Claude-Antwort anzeigen
          </summary>
          <pre className="mt-4 text-xs bg-gray-50 p-4 rounded overflow-x-auto whitespace-pre-wrap">
            {generatedOutput.rawResponse}
          </pre>
        </details>

        {/* Footer */}
        <div className="text-center py-12 text-sm text-gray-400">
          Generiert mit dem Guided Requirements Tool &middot;{' '}
          {new Date().toLocaleDateString('de-DE')}
        </div>
      </div>
    </div>
  );
}
