'use client';

import { create } from 'zustand';
import {
  GuidedFormAnswers,
  GeneratedOutput,
  FollowUpQuestion,
  UserStory,
  NFR,
  RequirementTestSuite,
  GherkinTestCase,
  ClassicTestCase,
} from '@/lib/types';
import { getTotalSteps } from '@/lib/questions';

interface GuidedFormStore {
  currentStep: number;
  answers: Partial<GuidedFormAnswers>;
  phase2Summary: string | null;
  phase3Summary: string | null;
  generatedOutput: GeneratedOutput | null;
  isGenerating: boolean;
  error: string | null;

  // Follow-up questions (Feature 1)
  followUpQuestions: FollowUpQuestion[];
  followUpAnswers: Record<string, string>;

  // Actions — form navigation
  setAnswer: <K extends keyof GuidedFormAnswers>(key: K, value: GuidedFormAnswers[K]) => void;
  setAnswers: (partial: Partial<GuidedFormAnswers>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Actions — summaries & follow-ups
  setPhase2Summary: (s: string | null) => void;
  setPhase3Summary: (s: string | null) => void;
  setFollowUpQuestions: (questions: FollowUpQuestion[]) => void;
  setFollowUpAnswer: (questionId: string, answer: string) => void;
  clearFollowUpData: () => void;

  // Actions — generation
  setGeneratedOutput: (o: GeneratedOutput) => void;
  setIsGenerating: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;

  // Actions — edit results (Feature 2)
  updateUserStory: (number: number, updates: Partial<UserStory>) => void;
  addUserStory: (story: UserStory) => void;
  deleteUserStory: (number: number) => void;
  updateNFR: (id: string, updates: Partial<NFR>) => void;
  addNFR: (nfr: NFR) => void;
  deleteNFR: (id: string) => void;
  updateOpenQuestion: (index: number, newText: string) => void;
  addOpenQuestion: (question: string) => void;
  deleteOpenQuestion: (index: number) => void;
  upsertTestSuite: (suite: RequirementTestSuite) => void;
  updateGherkinTestCase: (
    storyNumber: number,
    testCaseId: string,
    updates: Partial<GherkinTestCase>,
  ) => void;
  updateClassicTestCase: (
    storyNumber: number,
    testCaseId: string,
    updates: Partial<ClassicTestCase>,
  ) => void;
}

export const useGuidedForm = create<GuidedFormStore>((set) => ({
  currentStep: 1,
  answers: {},
  phase2Summary: null,
  phase3Summary: null,
  generatedOutput: null,
  isGenerating: false,
  error: null,
  followUpQuestions: [],
  followUpAnswers: {},

  // --- Form navigation ---

  setAnswer: (key, value) =>
    set((s) => {
      const update: Partial<GuidedFormStore> = { answers: { ...s.answers, [key]: value } };
      if (key === 'category') {
        update.phase2Summary = null;
        update.phase3Summary = null;
        update.followUpQuestions = [];
        update.followUpAnswers = {};
      }
      return update;
    }),

  setAnswers: (partial) =>
    set((s) => ({ answers: { ...s.answers, ...partial } })),

  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, getTotalSteps(s.answers)),
    })),

  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  goToStep: (step) =>
    set((s) => ({
      currentStep: Math.max(1, Math.min(step, getTotalSteps(s.answers))),
    })),

  // --- Summaries & follow-ups ---

  setPhase2Summary: (s) => set({ phase2Summary: s }),
  setPhase3Summary: (s) => set({ phase3Summary: s }),

  setFollowUpQuestions: (questions) =>
    set({
      followUpQuestions: questions,
      followUpAnswers: Object.fromEntries(questions.map((q) => [q.id, ''])),
    }),

  setFollowUpAnswer: (questionId, answer) =>
    set((s) => ({
      followUpAnswers: { ...s.followUpAnswers, [questionId]: answer },
    })),

  clearFollowUpData: () =>
    set({ followUpQuestions: [], followUpAnswers: {} }),

  // --- Generation ---

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
      followUpQuestions: [],
      followUpAnswers: {},
    }),

  // --- Edit results (Feature 2) ---

  updateUserStory: (number, updates) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          userStories: s.generatedOutput.userStories.map((story) =>
            story.number === number ? { ...story, ...updates } : story,
          ),
        },
      };
    }),

  addUserStory: (story) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          userStories: [...s.generatedOutput.userStories, story],
        },
      };
    }),

  deleteUserStory: (number) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          userStories: s.generatedOutput.userStories.filter((story) => story.number !== number),
        },
      };
    }),

  updateNFR: (id, updates) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          nfrs: s.generatedOutput.nfrs.map((nfr) =>
            nfr.id === id ? { ...nfr, ...updates } : nfr,
          ),
        },
      };
    }),

  addNFR: (nfr) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          nfrs: [...s.generatedOutput.nfrs, nfr],
        },
      };
    }),

  deleteNFR: (id) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          nfrs: s.generatedOutput.nfrs.filter((nfr) => nfr.id !== id),
        },
      };
    }),

  updateOpenQuestion: (index, newText) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      const questions = [...s.generatedOutput.openQuestions];
      questions[index] = newText;
      return {
        generatedOutput: { ...s.generatedOutput, openQuestions: questions },
      };
    }),

  addOpenQuestion: (question) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          openQuestions: [...s.generatedOutput.openQuestions, question],
        },
      };
    }),

  deleteOpenQuestion: (index) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          openQuestions: s.generatedOutput.openQuestions.filter((_, i) => i !== index),
        },
      };
    }),

  upsertTestSuite: (suite) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      const suites = s.generatedOutput.testSuites ?? [];
      const existingIndex = suites.findIndex(
        (item) => item.storyNumber === suite.storyNumber,
      );
      const nextSuites = [...suites];
      if (existingIndex >= 0) {
        nextSuites[existingIndex] = suite;
      } else {
        nextSuites.push(suite);
      }
      return {
        generatedOutput: {
          ...s.generatedOutput,
          testSuites: nextSuites,
        },
      };
    }),

  updateGherkinTestCase: (storyNumber, testCaseId, updates) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          testSuites: (s.generatedOutput.testSuites ?? []).map((suite) => {
            if (suite.storyNumber !== storyNumber) return suite;
            return {
              ...suite,
              gherkin: suite.gherkin.map((tc) =>
                tc.id === testCaseId ? { ...tc, ...updates } : tc,
              ),
            };
          }),
        },
      };
    }),

  updateClassicTestCase: (storyNumber, testCaseId, updates) =>
    set((s) => {
      if (!s.generatedOutput) return s;
      return {
        generatedOutput: {
          ...s.generatedOutput,
          testSuites: (s.generatedOutput.testSuites ?? []).map((suite) => {
            if (suite.storyNumber !== storyNumber) return suite;
            return {
              ...suite,
              classic: suite.classic.map((tc) =>
                tc.id === testCaseId ? { ...tc, ...updates } : tc,
              ),
            };
          }),
        },
      };
    }),
}));
