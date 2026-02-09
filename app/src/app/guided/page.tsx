'use client';

import { useRouter } from 'next/navigation';
import { useGuidedForm } from '@/hooks/use-guided-form';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CATEGORIES,
  EXISTING_SYSTEM_OPTIONS,
  PLATFORM_OPTIONS,
  STRATEGY_OPTIONS,
  OFFLINE_OPTIONS,
  USER_COUNT_OPTIONS,
  getPainPointOptions,
  getFeatureOptions,
  getPhaseInfo,
  needsSystemDetails,
  needsOfflineQuestion,
} from '@/lib/questions';
import { GuidedFormAnswers } from '@/lib/types';
import { useEffect, useState, useCallback } from 'react';

export default function GuidedPage() {
  const router = useRouter();
  const store = useGuidedForm();
  const { currentStep, answers, isGenerating, generatedOutput } = store;
  const [error, setError] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (generatedOutput) {
      router.push('/results');
    }
  }, [generatedOutput, router]);

  // Calculate actual step mapping based on conditional logic
  const getStepConfig = useCallback(() => {
    const steps: { id: string; phase: number }[] = [
      { id: 'vision', phase: 1 },
      { id: 'audience', phase: 1 },
      { id: 'category', phase: 1 },
      { id: 'systems', phase: 1 },
    ];
    if (needsSystemDetails(answers)) {
      steps.push({ id: 'systemDetails', phase: 1 });
    }
    steps.push({ id: 'problems', phase: 2 });
    steps.push({ id: 'features', phase: 2 });
    steps.push({ id: 'platforms', phase: 2 });
    if (needsOfflineQuestion(answers)) {
      steps.push({ id: 'offline', phase: 2 });
    }
    steps.push({ id: 'strategy', phase: 3 });
    steps.push({ id: 'email', phase: 3 });
    return steps;
  }, [answers]);

  const steps = getStepConfig();
  const totalSteps = steps.length;
  const currentStepConfig = steps[currentStep - 1];
  const progress = Math.round((currentStep / totalSteps) * 100);
  const phaseInfo = currentStepConfig
    ? getPhaseInfo(currentStep)
    : { phase: 1, name: '' };

  const handleNext = () => {
    setError('');
    if (currentStep >= totalSteps) {
      handleGenerate();
      return;
    }

    // Check if we should show AI summary after phase 2
    const currentPhase = currentStepConfig?.phase;
    const nextPhase = steps[currentStep]?.phase;
    if (currentPhase === 2 && nextPhase === 3 && !store.phase2Summary && !showSummary) {
      fetchSummary(2);
      return;
    }

    store.nextStep();
  };

  const handleBack = () => {
    setError('');
    setShowSummary(false);
    setSummaryText('');
    store.prevStep();
  };

  const fetchSummary = async (phase: 2 | 3) => {
    setSummaryLoading(true);
    setShowSummary(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, phase }),
      });
      const data = await res.json();
      if (data.success) {
        setSummaryText(data.summary);
        if (phase === 2) store.setPhase2Summary(data.summary);
        else store.setPhase3Summary(data.summary);
      } else {
        setSummaryText('Zusammenfassung konnte nicht erstellt werden. Sie können trotzdem fortfahren.');
      }
    } catch {
      setSummaryText('Netzwerkfehler. Sie können trotzdem fortfahren.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSummaryConfirm = () => {
    setShowSummary(false);
    setSummaryText('');
    store.nextStep();
  };

  const handleGenerate = async () => {
    store.setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.success && data.output) {
        store.setGeneratedOutput(data.output);
      } else {
        store.setError(data.error || 'Fehler bei der Generierung');
      }
    } catch {
      store.setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    }
  };

  // Validation helpers
  const canProceed = (): boolean => {
    if (!currentStepConfig) return false;
    const a = answers;
    switch (currentStepConfig.id) {
      case 'vision':
        return !!a.projectVision && a.projectVision.length >= 30;
      case 'audience':
        return !!a.targetRoles && !!a.userCount && !!a.techLevel;
      case 'category':
        return !!a.category;
      case 'systems':
        return !!a.existingSystem;
      case 'systemDetails':
        return !!a.existingSystemDetails && a.existingSystemDetails.length > 5;
      case 'problems':
        return !!a.mainPain && a.mainPain.length > 0;
      case 'features':
        return !!a.topFeatures && a.topFeatures.length >= 3;
      case 'platforms':
        return !!a.platforms && a.platforms.length > 0;
      case 'offline':
        return !!a.offlineCapability;
      case 'strategy':
        return !!a.strategy;
      case 'email':
        return true; // optional
      default:
        return true;
    }
  };

  // Loading state
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2">Ihre User Stories werden generiert...</h2>
            <p className="text-gray-600 text-sm">
              Das dauert ca. 15-30 Sekunden. Bitte warten.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (store.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-bold mb-2 text-red-600">Fehler</h2>
            <p className="text-gray-600 mb-4">{store.error}</p>
            <Button onClick={() => { store.setError(null); handleGenerate(); }}>
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // AI Summary overlay
  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="py-8">
              <h2 className="text-xl font-bold mb-4">Das habe ich verstanden</h2>
              {summaryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3" />
                  <span className="text-gray-600">Zusammenfassung wird erstellt...</span>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 whitespace-pre-wrap text-sm">
                    {summaryText}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSummaryConfirm} className="flex-1">
                      Stimmt so, weiter
                    </Button>
                    <Button variant="outline" onClick={() => { setShowSummary(false); }}>
                      Zurück zur Korrektur
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render step content
  const renderStep = () => {
    if (!currentStepConfig) return null;
    const a = answers;

    switch (currentStepConfig.id) {
      case 'vision':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-1">
                Beschreiben Sie in 2-3 S&auml;tzen, was Ihre Software k&ouml;nnen soll.
              </h2>
              <p className="text-sm text-gray-500">
                Stellen Sie sich vor, Sie erkl&auml;ren einem Kollegen in der Kaffeek&uuml;che, worum es geht.
              </p>
            </div>
            <Textarea
              value={a.projectVision || ''}
              onChange={(e) => store.setAnswer('projectVision', e.target.value)}
              placeholder='z.B. "Wir brauchen ein System, mit dem unser Vertriebsteam Leads verwalten und den Status von Verkaufsgesprächen tracken kann."'
              rows={5}
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right">
              {(a.projectVision || '').length}/500 Zeichen (min. 30)
            </p>
          </div>
        );

      case 'audience':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Wer nutzt die Software?</h2>
            <div className="space-y-2">
              <Label>Rollen und ungef&auml;hre Anzahl</Label>
              <Input
                value={a.targetRoles || ''}
                onChange={(e) => store.setAnswer('targetRoles', e.target.value)}
                placeholder='z.B. "15 Vertriebsmitarbeiter, 3 Teamleiter, 2 Backoffice"'
              />
            </div>
            <div className="space-y-2">
              <Label>Gesamtanzahl Nutzer</Label>
              <div className="grid grid-cols-2 gap-2">
                {USER_COUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => store.setAnswer('userCount', opt as GuidedFormAnswers['userCount'])}
                    className={`p-3 rounded-lg border text-sm transition-colors ${
                      a.userCount === opt
                        ? 'border-primary bg-primary/5 font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {opt} Nutzer
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Technisches Level der Hauptnutzer: {a.techLevel || '?'}/5</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-20">Kaum PC</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={a.techLevel || 3}
                  onChange={(e) => store.setAnswer('techLevel', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-20 text-right">Power User</span>
              </div>
            </div>
          </div>
        );

      case 'category':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">In welche Kategorie f&auml;llt Ihre Software?</h2>
            <div className="grid gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    store.setAnswer('category', cat);
                    // Reset dependent fields when category changes
                    store.setAnswer('mainPain', []);
                    store.setAnswer('topFeatures', []);
                  }}
                  className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                    a.category === cat
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        );

      case 'systems':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              Gibt es ein bestehendes System?
            </h2>
            <div className="grid gap-2">
              {EXISTING_SYSTEM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => store.setAnswer('existingSystem', opt.value as GuidedFormAnswers['existingSystem'])}
                  className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                    a.existingSystem === opt.value
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'systemDetails':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              {a.existingSystem === 'replace'
                ? 'Welches System wird ersetzt? Was funktioniert gut, was nicht?'
                : 'Welche Systeme m\u00fcssen angebunden werden?'}
            </h2>
            <Textarea
              value={a.existingSystemDetails || ''}
              onChange={(e) => store.setAnswer('existingSystemDetails', e.target.value)}
              placeholder={
                a.existingSystem === 'replace'
                  ? 'z.B. "Excel-Tabellen und Outlook. Jeder hat seine eigene Version."'
                  : 'z.B. "SAP für Auftragsabwicklung, Outlook für E-Mail"'
              }
              rows={4}
            />
          </div>
        );

      case 'problems':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-1">
                Was sind die gr&ouml;&szlig;ten Probleme?
              </h2>
              <p className="text-sm text-gray-500">
                W&auml;hlen Sie die zutreffenden Punkte aus.
              </p>
            </div>
            <div className="grid gap-2">
              {getPainPointOptions(a.category).map((pain) => {
                const selected = (a.mainPain || []).includes(pain);
                return (
                  <button
                    key={pain}
                    onClick={() => {
                      const current = a.mainPain || [];
                      store.setAnswer(
                        'mainPain',
                        selected ? current.filter((p) => p !== pain) : [...current, pain],
                      );
                    }}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      selected
                        ? 'border-primary bg-primary/5 font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selected ? '\u2611 ' : '\u2610 '}
                    {pain}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-1">
                Welche 3 Funktionen sind am wichtigsten?
              </h2>
              <p className="text-sm text-gray-500">
                W&auml;hlen Sie genau 3 Funktionen. Die Reihenfolge der Auswahl bestimmt die Priorit&auml;t.
              </p>
            </div>
            <div className="grid gap-2">
              {getFeatureOptions(a.category).map((feat) => {
                const idx = (a.topFeatures || []).indexOf(feat);
                const selected = idx >= 0;
                const full = (a.topFeatures || []).length >= 3 && !selected;
                return (
                  <button
                    key={feat}
                    disabled={full}
                    onClick={() => {
                      const current = a.topFeatures || [];
                      store.setAnswer(
                        'topFeatures',
                        selected ? current.filter((f) => f !== feat) : [...current, feat],
                      );
                    }}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      selected
                        ? 'border-primary bg-primary/5 font-medium'
                        : full
                          ? 'border-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selected ? `${idx + 1}. ` : ''}
                    {feat}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">
              Gew&auml;hlt: {(a.topFeatures || []).length}/3
            </p>
          </div>
        );

      case 'platforms':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              Auf welchen Ger&auml;ten soll die Software laufen?
            </h2>
            <div className="grid gap-2">
              {PLATFORM_OPTIONS.map((plat) => {
                const selected = (a.platforms || []).includes(plat);
                return (
                  <button
                    key={plat}
                    onClick={() => {
                      const current = a.platforms || [];
                      store.setAnswer(
                        'platforms',
                        selected ? current.filter((p) => p !== plat) : [...current, plat],
                      );
                    }}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      selected
                        ? 'border-primary bg-primary/5 font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selected ? '\u2611 ' : '\u2610 '}
                    {plat}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'offline':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              Muss die App auch offline funktionieren?
            </h2>
            <div className="grid gap-2">
              {OFFLINE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => store.setAnswer('offlineCapability', opt.value as GuidedFormAnswers['offlineCapability'])}
                  className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                    a.offlineCapability === opt.value
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Was ist Ihnen wichtiger?</h2>
            <div className="grid gap-3">
              {STRATEGY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => store.setAnswer('strategy', opt)}
                  className={`p-4 rounded-lg border text-left text-sm transition-colors ${
                    a.strategy === opt
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Fast geschafft!</h2>
            <p className="text-sm text-gray-600">
              Optional: Hinterlassen Sie Ihre E-Mail, falls Sie das PDF sp&auml;ter erneut erhalten m&ouml;chten.
            </p>
            <Input
              type="email"
              value={a.email || ''}
              onChange={(e) => store.setAnswer('email', e.target.value)}
              placeholder="ihre.email@beispiel.de (optional)"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800">
                Klicken Sie auf &quot;User Stories generieren&quot; um Ihre Anforderungen zu erstellen.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header with progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            {currentStep > 1 && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                &larr; Zur&uuml;ck
              </Button>
            )}
            <span className="text-sm text-gray-500 ml-auto">
              Phase {phaseInfo.phase}: {phaseInfo.name}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Schritt {currentStep} von {totalSteps}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Step content */}
        <Card>
          <CardContent className="py-6">
            {renderStep()}

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            <div className="mt-6">
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full"
              >
                {currentStep >= totalSteps
                  ? 'User Stories generieren'
                  : 'Weiter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
