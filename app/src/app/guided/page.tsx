'use client';

import { useRouter } from 'next/navigation';
import { useGuidedForm } from '@/hooks/use-guided-form';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  needsSystemDetails,
  needsOfflineQuestion,
} from '@/lib/questions';
import { GuidedFormAnswers } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, HelpCircle, Upload, X, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function GuidedPage() {
  const router = useRouter();
  const store = useGuidedForm();
  const { currentStep, answers, isGenerating, generatedOutput } = store;
  const [error, setError] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (generatedOutput) {
      router.push('/results');
    }
  }, [generatedOutput, router]);

  // Warn before losing unsaved progress
  useEffect(() => {
    if (currentStep <= 1) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [currentStep]);

  // Calculate actual step mapping based on conditional logic
  const steps = useMemo(() => {
    const s: { id: string; phase: number }[] = [
      { id: 'vision', phase: 1 },
      { id: 'audience', phase: 1 },
      { id: 'category', phase: 1 },
      { id: 'systems', phase: 1 },
    ];
    if (needsSystemDetails(answers)) {
      s.push({ id: 'systemDetails', phase: 1 });
    }
    s.push({ id: 'problems', phase: 2 });
    s.push({ id: 'features', phase: 2 });
    s.push({ id: 'platforms', phase: 2 });
    if (needsOfflineQuestion(answers)) {
      s.push({ id: 'offline', phase: 2 });
    }
    s.push({ id: 'strategy', phase: 3 });
    s.push({ id: 'email', phase: 3 });
    return s;
  }, [answers]);
  const totalSteps = steps.length;
  const currentStepConfig = steps[currentStep - 1];
  const progress = Math.round((currentStep / totalSteps) * 100);

  const PHASE_NAMES: Record<number, string> = {
    1: 'Projekt-Kontext',
    2: 'Schmerzpunkte & Prioritäten',
    3: 'Strategie & Abschluss',
  };
  const phaseInfo = currentStepConfig
    ? { phase: currentStepConfig.phase, name: PHASE_NAMES[currentStepConfig.phase] || '' }
    : { phase: 1, name: PHASE_NAMES[1] };

  useEffect(() => {
    if (currentStepConfig?.id === 'audience' && answers.techLevel === undefined) {
      store.setAnswer('techLevel', 3);
    }
  }, [answers.techLevel, currentStepConfig?.id, store]);

  const handleNext = () => {
    if (isSubmitting) return;
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
    // Invalidate phase summaries when going back so they refresh with updated answers
    const prevStepPhase = steps[currentStep - 2]?.phase;
    if (prevStepPhase === 2 || currentStepConfig?.phase === 2) {
      store.setPhase2Summary(null);
    }
    if (prevStepPhase === 3 || currentStepConfig?.phase === 3) {
      store.setPhase3Summary(null);
    }
    store.clearFollowUpData();
    store.prevStep();
  };

  const fetchSummary = async (phase: 2 | 3) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
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
        if (data.followUpQuestions?.length) {
          store.setFollowUpQuestions(data.followUpQuestions);
        }
        if (phase === 2) store.setPhase2Summary(data.summary);
        else store.setPhase3Summary(data.summary);
      } else {
        setSummaryText('Zusammenfassung konnte nicht erstellt werden. Sie können trotzdem fortfahren.');
      }
    } catch {
      setSummaryText('Netzwerkfehler. Sie können trotzdem fortfahren.');
    } finally {
      setSummaryLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleSummaryConfirm = () => {
    setShowSummary(false);
    setSummaryText('');
    store.nextStep();
  };

  const handleGenerate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    store.setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          followUpQuestions: store.followUpQuestions,
          followUpAnswers: store.followUpAnswers,
        }),
      });
      const data = await res.json();
      if (data.success && data.output) {
        store.setGeneratedOutput(data.output);
      } else {
        store.setError(data.error || 'Fehler bei der Generierung');
      }
    } catch {
      store.setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
      store.setIsGenerating(false);
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

  // Option button style helper
  const optionClass = (selected: boolean, disabled?: boolean) =>
    `p-3.5 rounded-xl text-left text-sm transition-all duration-200 ${
      selected
        ? 'glass-strong border-indigo-400/50 bg-indigo-50/60 font-medium text-indigo-900 glow-border'
        : disabled
          ? 'glass-subtle text-gray-400 cursor-not-allowed opacity-60'
          : 'glass-subtle hover:bg-white/50 hover:border-white/40 text-gray-700'
    }`;

  // Loading state
  if (isGenerating) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="relative glass-strong max-w-md w-full mx-4 rounded-2xl">
          <div className="py-12 px-6 text-center">
            <Loader2 className="size-12 text-indigo-500 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2 text-gradient">Ihre User Stories werden generiert...</h2>
            <p className="text-gray-600 text-sm">
              Das dauert ca. 15-30 Sekunden. Bitte warten.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (store.error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float" />
        </div>
        <div className="relative glass-strong max-w-md w-full mx-4 rounded-2xl">
          <div className="py-8 px-6 text-center">
            <AlertCircle className="size-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-red-600">Fehler</h2>
            <p className="text-gray-600 mb-6">{store.error}</p>
            <Button
              disabled={isSubmitting}
              onClick={() => { store.setError(null); handleGenerate(); }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            >
              Erneut versuchen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // AI Summary overlay
  if (showSummary) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="relative container mx-auto px-4 py-8 max-w-2xl">
          <div className="glass-strong rounded-2xl">
            <div className="py-8 px-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="size-6 text-indigo-500" />
                <h2 className="text-xl font-bold text-gradient">Das habe ich verstanden</h2>
              </div>
              {summaryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-8 text-indigo-500 animate-spin mr-3" />
                  <span className="text-gray-600">Zusammenfassung wird erstellt...</span>
                </div>
              ) : (
                <>
                  <div className="glass-subtle rounded-xl p-5 mb-6 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {summaryText}
                  </div>

                  {/* Follow-up questions */}
                  {store.followUpQuestions.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <HelpCircle className="size-4 text-indigo-500" />
                        Rückfragen
                      </h3>
                      {store.followUpQuestions.map((fq) => (
                        <div key={fq.id} className="glass-subtle rounded-xl p-4 space-y-2">
                          <div className="flex items-start gap-2">
                            <p className="text-sm text-gray-700 leading-relaxed flex-1">
                              {fq.question}
                            </p>
                            {fq.isCritical && (
                              <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 shrink-0">
                                Kritisch
                              </Badge>
                            )}
                          </div>
                          <Textarea
                            value={store.followUpAnswers[fq.id] || ''}
                            onChange={(e) => store.setFollowUpAnswer(fq.id, e.target.value)}
                            placeholder="Ihre Antwort..."
                            rows={2}
                            className="glass-subtle border-white/30 focus:border-indigo-400/50 focus:ring-indigo-500/20 rounded-xl text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Warning for unanswered critical questions */}
                  {store.followUpQuestions.some(
                    (fq) => fq.isCritical && !store.followUpAnswers[fq.id]?.trim(),
                  ) && (
                    <p className="text-xs text-amber-600 mb-3">
                      Hinweis: Es gibt noch unbeantwortete kritische Rückfragen. Sie können trotzdem fortfahren.
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSummaryConfirm}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                    >
                      Stimmt so, weiter
                    </Button>
                    <Button variant="outline" onClick={() => { setShowSummary(false); }} className="glass-subtle border-white/30">
                      Zurück zur Korrektur
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
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
              <h2 className="text-xl font-bold mb-1 text-gray-900">
                Beschreiben Sie in 2-3 Sätzen, was Ihre Software können soll.
              </h2>
              <p className="text-sm text-gray-500">
                Stellen Sie sich vor, Sie erklären einem Kollegen in der Kaffeeküche, worum es geht.
              </p>
            </div>
            <Textarea
              value={a.projectVision || ''}
              onChange={(e) => store.setAnswer('projectVision', e.target.value)}
              placeholder='z.B. "Wir brauchen ein System, mit dem unser Vertriebsteam Leads verwalten und den Status von Verkaufsgesprächen tracken kann."'
              rows={5}
              maxLength={500}
              className="glass-subtle border-white/30 focus:border-indigo-400/50 focus:ring-indigo-500/20 rounded-xl"
            />
            <p className="text-xs text-gray-400 text-right">
              {(a.projectVision || '').length}/500 Zeichen (min. 30)
            </p>

            {/* Context document upload */}
            <div className="pt-2 border-t border-white/30">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <FileText className="size-4 text-indigo-500" />
                Kontext-Dokument (optional)
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Laden Sie ein Lastenheft, Unternehmensrichtlinien oder andere Dokumente hoch (.txt, .md), damit die KI firmeninterne Standards berücksichtigt.
              </p>
              {a.contextDocument ? (
                <div className="glass-subtle rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="size-4 text-indigo-500 shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{a.contextDocumentName}</span>
                    <span className="text-xs text-gray-400 shrink-0">
                      ({Math.round(a.contextDocument.length / 1024)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      store.setAnswer('contextDocument', '' as never);
                      store.setAnswer('contextDocumentName', '' as never);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    title="Dokument entfernen"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="glass-subtle rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-white/50 transition-colors border-2 border-dashed border-white/40 hover:border-indigo-300/50">
                  <Upload className="size-5 text-indigo-400" />
                  <span className="text-sm text-gray-500">Datei auswählen (.txt, .md)</span>
                  <input
                    type="file"
                    accept=".txt,.md,.text,.markdown"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 500 * 1024) {
                        setError('Datei zu groß (max. 500 KB).');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        const text = reader.result as string;
                        store.setAnswer('contextDocument', text as never);
                        store.setAnswer('contextDocumentName', file.name as never);
                        setError('');
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 'audience': {
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Wer nutzt die Software?</h2>
            <div className="space-y-2">
              <Label>Rollen und ungefähre Anzahl</Label>
              <Input
                value={a.targetRoles || ''}
                onChange={(e) => store.setAnswer('targetRoles', e.target.value)}
                placeholder='z.B. "15 Vertriebsmitarbeiter, 3 Teamleiter, 2 Backoffice"'
                className="glass-subtle border-white/30 focus:border-indigo-400/50 focus:ring-indigo-500/20 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Gesamtanzahl Nutzer</Label>
              <div className="grid grid-cols-2 gap-2">
                {USER_COUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => store.setAnswer('userCount', opt as GuidedFormAnswers['userCount'])}
                    className={optionClass(a.userCount === opt)}
                  >
                    {opt} Nutzer
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Technisches Level der Hauptnutzer: {a.techLevel ?? 3}/5</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">Kaum PC</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={a.techLevel ?? 3}
                  onChange={(e) => store.setAnswer('techLevel', parseInt(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-xs text-gray-500 w-20 text-right">Power User</span>
              </div>
            </div>
          </div>
        );
      }

      case 'category':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">In welche Kategorie fällt Ihre Software?</h2>
            <div className="grid gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    store.setAnswer('category', cat);
                    store.setAnswer('mainPain', []);
                    store.setAnswer('topFeatures', []);
                  }}
                  className={optionClass(a.category === cat)}
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
            <h2 className="text-xl font-bold text-gray-900">
              Gibt es ein bestehendes System?
            </h2>
            <div className="grid gap-2">
              {EXISTING_SYSTEM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => store.setAnswer('existingSystem', opt.value as GuidedFormAnswers['existingSystem'])}
                  className={optionClass(a.existingSystem === opt.value)}
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
            <h2 className="text-xl font-bold text-gray-900">
              {a.existingSystem === 'replace'
                ? 'Welches System wird ersetzt? Was funktioniert gut, was nicht?'
                : 'Welche Systeme müssen angebunden werden?'}
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
              className="glass-subtle border-white/30 focus:border-indigo-400/50 focus:ring-indigo-500/20 rounded-xl"
            />
          </div>
        );

      case 'problems':
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-1 text-gray-900">
                Was sind die größten Probleme?
              </h2>
              <p className="text-sm text-gray-500">
                Wählen Sie die zutreffenden Punkte aus.
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
                    className={optionClass(selected)}
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
              <h2 className="text-xl font-bold mb-1 text-gray-900">
                Welche 3 Funktionen sind am wichtigsten?
              </h2>
              <p className="text-sm text-gray-500">
                Wählen Sie genau 3 Funktionen. Die Reihenfolge der Auswahl bestimmt die Priorität.
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
                    className={optionClass(selected, full)}
                  >
                    {selected ? `${idx + 1}. ` : ''}
                    {feat}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">
              Gewählt: {(a.topFeatures || []).length}/3
            </p>
          </div>
        );

      case 'platforms':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Auf welchen Geräten soll die Software laufen?
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
                    className={optionClass(selected)}
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
            <h2 className="text-xl font-bold text-gray-900">
              Muss die App auch offline funktionieren?
            </h2>
            <div className="grid gap-2">
              {OFFLINE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => store.setAnswer('offlineCapability', opt.value as GuidedFormAnswers['offlineCapability'])}
                  className={optionClass(a.offlineCapability === opt.value)}
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
            <h2 className="text-xl font-bold text-gray-900">Was ist Ihnen wichtiger?</h2>
            <div className="grid gap-3">
              {STRATEGY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => store.setAnswer('strategy', opt)}
                  className={optionClass(a.strategy === opt)}
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
            <h2 className="text-xl font-bold text-gray-900">Fast geschafft!</h2>
            <p className="text-sm text-gray-600">
              Optional: Hinterlassen Sie Ihre E-Mail, falls Sie das PDF später erneut erhalten möchten.
            </p>
            <Input
              type="email"
              value={a.email || ''}
              onChange={(e) => store.setAnswer('email', e.target.value)}
              placeholder="ihre.email@beispiel.de (optional)"
              className="glass-subtle border-white/30 focus:border-indigo-400/50 focus:ring-indigo-500/20 rounded-xl"
            />
            <div className="glass-subtle rounded-xl p-4 border-indigo-300/30">
              <p className="text-sm font-medium text-indigo-700">
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      {/* Floating decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-20 left-1/4 w-60 h-60 bg-blue-300/25 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-2xl">
        {/* Header with progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            {currentStep > 1 && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-gray-600 hover:text-gray-900 hover:bg-white/40">
                <ArrowLeft className="size-4 mr-1" />
                Zurück
              </Button>
            )}
            <span className="text-sm text-indigo-700/70 font-medium ml-auto glass-subtle rounded-full px-3 py-1">
              Phase {phaseInfo.phase}: {phaseInfo.name}
            </span>
          </div>
          <Progress value={progress} className="h-2.5" />
          <div className="flex justify-between text-xs text-gray-500 mt-1.5">
            <span>Schritt {currentStep} von {totalSteps}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Step content */}
        <div className="glass-strong rounded-2xl">
          <div className="py-6 px-6">
            {renderStep()}

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            <div className="mt-6">
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none rounded-xl h-11"
              >
                {currentStep >= totalSteps
                  ? 'User Stories generieren'
                  : 'Weiter'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
