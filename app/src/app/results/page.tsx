'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGuidedForm } from '@/hooks/use-guided-form';
import { StoryCard } from '@/components/results/story-card';
import { NFRSection } from '@/components/results/nfr-section';
import { QuestionsSection } from '@/components/results/questions-section';
import { SprintPlanSection } from '@/components/results/sprint-plan';
import { InvestReport } from '@/components/results/invest-report';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, RotateCcw, BookOpen, ShieldCheck, HelpCircle, Calendar, Loader2, AlertTriangle, FileText, GitBranch, ClipboardCheck } from 'lucide-react';
import { generateMarkdown } from '@/lib/markdown-export';
import { MermaidDiagram } from '@/components/results/mermaid-diagram';
import { validateAllStories } from '@/lib/invest-validator';

export default function ResultsPage() {
  const router = useRouter();
  const { generatedOutput, answers, reset } = useGuidedForm();
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [pdfError, setPdfError] = useState('');

  useEffect(() => {
    if (!generatedOutput) {
      router.push('/guided');
    }
  }, [generatedOutput, router]);

  if (!generatedOutput) {
    return null;
  }

  const { userStories, nfrs, openQuestions, sprintPlan, mermaidDiagram, parsingWarnings } = generatedOutput;

  const investResults = useMemo(() => validateAllStories(userStories), [userStories]);

  const handleDownloadPDF = async () => {
    if (isDownloadingPDF) return;
    setIsDownloadingPDF(true);
    setPdfError('');
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
      setPdfError('PDF-Download fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const markdown = generateMarkdown({
      output: generatedOutput,
      projectName: answers.projectVision?.slice(0, 60) || 'Projekt',
      email: answers.email || '',
      date: new Date().toLocaleDateString('de-DE'),
    });
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anforderungen-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestart = () => {
    reset();
    router.push('/');
  };

  const stats = [
    { label: 'User Stories', value: userStories.length, color: 'from-indigo-500 to-blue-500', icon: BookOpen },
    { label: 'Hohe Priorität', value: userStories.filter((s) => s.priority === 'HOCH').length, color: 'from-red-500 to-pink-500', icon: ShieldCheck },
    { label: 'NFRs', value: nfrs.length, color: 'from-purple-500 to-violet-500', icon: HelpCircle },
    { label: 'Sprints', value: sprintPlan.length, color: 'from-emerald-500 to-teal-500', icon: Calendar },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50">
      {/* Floating decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-300/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-20 right-1/3 w-60 h-60 bg-blue-300/20 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Header */}
      <div className="relative glass-strong border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Dein Anforderungsdokument</h1>
              <p className="text-gray-500 text-sm mt-1">
                {userStories.length} User Stories &middot;{' '}
                {nfrs.length} NFRs &middot;{' '}
                {openQuestions.length} offene Fragen
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRestart} className="glass-subtle border-white/30 hover:bg-white/50">
                <RotateCcw className="size-4 mr-2" />
                Neues Projekt
              </Button>
              <Button variant="outline" onClick={handleDownloadMarkdown} className="glass-subtle border-white/30 hover:bg-white/50">
                <FileText className="size-4 mr-2" />
                Markdown
              </Button>
              <Button onClick={handleDownloadPDF} disabled={isDownloadingPDF} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 disabled:opacity-70">
                {isDownloadingPDF ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Download className="size-4 mr-2" />
                )}
                {isDownloadingPDF ? 'Wird erstellt...' : 'PDF herunterladen'}
              </Button>
            </div>
          </div>
          {pdfError && (
            <p className="text-red-500 text-sm mt-2 text-right">{pdfError}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="relative max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center transition-all duration-300 hover:scale-[1.02]">
              <div className="flex justify-center mb-2">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent`}>{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Parsing warnings */}
        {parsingWarnings && parsingWarnings.length > 0 && (
          <div className="glass rounded-2xl p-4 mb-6 border border-amber-300/30 bg-amber-50/40">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">Hinweise zum Parsing</p>
                <ul className="text-sm text-amber-700 space-y-0.5">
                  {parsingWarnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Legend for interpretation */}
        <div className="glass rounded-2xl p-5 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Legende: Prioritaet und Aufwand</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prioritaet</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">HOCH</Badge>
                  <p className="text-sm text-gray-700">Direkter Business-Nutzen oder kritisch fuer den Start.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0">MITTEL</Badge>
                  <p className="text-sm text-gray-700">Wichtig, aber nicht zwingend fuer den ersten Release.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white border-0">NIEDRIG</Badge>
                  <p className="text-sm text-gray-700">Spaetere Optimierung oder Nice-to-have.</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Aufwand</p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold text-gray-900">S:</span> kleiner, klar abgrenzbarer Umfang</p>
                <p><span className="font-semibold text-gray-900">M:</span> mittlerer Umfang mit ueblichem Implementierungsaufwand</p>
                <p><span className="font-semibold text-gray-900">L:</span> groesserer Umfang mit mehr Abstimmung und Tests</p>
                <p><span className="font-semibold text-gray-900">XL:</span> sehr grosser Umfang ueber mehrere Iterationen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stories" className="space-y-6">
          <TabsList className="flex w-full glass-strong rounded-xl p-1 gap-1">
            <TabsTrigger value="stories" className="flex-1 rounded-lg data-[state=active]:bg-white/70 data-[state=active]:shadow-sm text-xs sm:text-sm">
              Stories
              <Badge variant="secondary" className="ml-1.5 text-xs bg-indigo-100 text-indigo-700">
                {userStories.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="nfrs" className="flex-1 rounded-lg data-[state=active]:bg-white/70 data-[state=active]:shadow-sm text-xs sm:text-sm">
              NFRs
              <Badge variant="secondary" className="ml-1.5 text-xs bg-purple-100 text-purple-700">
                {nfrs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex-1 rounded-lg data-[state=active]:bg-white/70 data-[state=active]:shadow-sm text-xs sm:text-sm">
              Fragen
              <Badge variant="secondary" className="ml-1.5 text-xs bg-amber-100 text-amber-700">
                {openQuestions.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sprints" className="flex-1 rounded-lg data-[state=active]:bg-white/70 data-[state=active]:shadow-sm text-xs sm:text-sm">
              Sprints
            </TabsTrigger>
            <TabsTrigger value="invest" className="flex-1 rounded-lg data-[state=active]:bg-white/70 data-[state=active]:shadow-sm text-xs sm:text-sm">
              <ClipboardCheck className="size-3.5 mr-1" />
              INVEST
            </TabsTrigger>
            {mermaidDiagram && (
              <TabsTrigger value="diagram" className="flex-1 rounded-lg data-[state=active]:bg-white/70 data-[state=active]:shadow-sm text-xs sm:text-sm">
                <GitBranch className="size-3.5 mr-1" />
                Flow
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="stories" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">Filter:</span>
              {['HOCH', 'MITTEL', 'NIEDRIG'].map((p) => {
                const count = userStories.filter((s) => s.priority === p).length;
                return count > 0 ? (
                  <Badge key={p} variant="outline" className="text-xs glass-subtle border-white/30">
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
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gradient mb-4">Nicht-funktionale Anforderungen</h3>
              <NFRSection nfrs={nfrs} />
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gradient mb-4">Offene Fragen</h3>
              <QuestionsSection questions={openQuestions} />
            </div>
          </TabsContent>

          <TabsContent value="sprints">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gradient mb-4">Empfohlene Umsetzungsreihenfolge</h3>
              <SprintPlanSection sprints={sprintPlan} />
            </div>
          </TabsContent>

          <TabsContent value="invest">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gradient mb-4">INVEST-Qualitätsprüfung</h3>
              <p className="text-sm text-gray-500 mb-4">
                Automatische Analyse der User Stories nach den INVEST-Kriterien (Independent, Negotiable, Valuable, Estimable, Small, Testable).
              </p>
              <InvestReport results={investResults} />
            </div>
          </TabsContent>

          {mermaidDiagram && (
            <TabsContent value="diagram">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gradient mb-4">User Flow Diagramm</h3>
                <p className="text-sm text-gray-500 mb-4">Automatisch generierter Nutzerfluss basierend auf deinen Anforderungen.</p>
                <MermaidDiagram chart={mermaidDiagram} />
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Raw output toggle */}
        <details className="mt-8 glass rounded-2xl p-5">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors">
            Rohe Claude-Antwort anzeigen
          </summary>
          <pre className="mt-4 text-xs glass-subtle rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">
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
