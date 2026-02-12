'use client';

import { create } from 'zustand';
import { GuidedFormAnswers, GeneratedOutput } from '@/lib/types';
import { getTotalSteps } from '@/lib/questions';

interface GuidedFormStore {
  currentStep: number;
  answers: Partial<GuidedFormAnswers>;
  phase2Summary: string | null;
  phase3Summary: string | null;
  generatedOutput: GeneratedOutput | null;
  isGenerating: boolean;
  error: string | null;

  setAnswer: <K extends keyof GuidedFormAnswers>(key: K, value: GuidedFormAnswers[K]) => void;
  setAnswers: (partial: Partial<GuidedFormAnswers>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setPhase2Summary: (s: string | null) => void;
  setPhase3Summary: (s: string | null) => void;
  setGeneratedOutput: (o: GeneratedOutput) => void;
  setIsGenerating: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useGuidedForm = create<GuidedFormStore>((set) => ({
  currentStep: 1,
  answers: {},
  phase2Summary: null,
  phase3Summary: null,
  generatedOutput: null,
  isGenerating: false,
  error: null,

  setAnswer: (key, value) =>
    set((s) => {
      const update: Partial<GuidedFormStore> = { answers: { ...s.answers, [key]: value } };
      // Clear stale summaries when category changes
      if (key === 'category') {
        update.phase2Summary = null;
        update.phase3Summary = null;
      }
      return update;
    }),

  setAnswers: (partial) =>
    set((s) => ({ answers: { ...s.answers, ...partial } })),

  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, getTotalSteps(s.answers) + 1),
    })),

  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  goToStep: (step) => set({ currentStep: step }),

  setPhase2Summary: (s) => set({ phase2Summary: s }),
  setPhase3Summary: (s) => set({ phase3Summary: s }),

  setGeneratedOutput: (o) => set({ generatedOutput: o, isGenerating: false }),
  setIsGenerating: (v) => set({ isGenerating: v, error: null }),
  setError: (e) => set({ error: e, isGenerating: false }),

  reset: () =>
    set({
      currentStep: 1,
      answers: {},
      phase2Summary: null,
      phase3Summary: null,
      generatedOutput: null,
      isGenerating: false,
      error: null,
    }),
}));
