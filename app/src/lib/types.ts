export type SoftwareCategory =
  | 'CRM / Kundenmanagement'
  | 'ERP / Ressourcenplanung'
  | 'Workflow / Prozessautomatisierung'
  | 'Reporting / Dashboards'
  | 'Kommunikation / Collaboration'
  | 'E-Commerce / Shop'
  | 'Portal'
  | 'Mobile App'
  | 'Andere';

export interface GuidedFormAnswers {
  projectVision: string;
  targetRoles: string;
  userCount: '1-10' | '10-50' | '50-200' | '200+';
  techLevel: number;
  category: SoftwareCategory;
  existingSystem: 'replace' | 'integrate' | 'new';
  existingSystemDetails: string;
  mainPain: string[];
  topFeatures: string[];
  platforms: string[];
  offlineCapability: 'full' | 'partial' | 'none';
  strategy: string;
  email: string;
}

export interface GuidedFormState {
  currentStep: number;
  totalSteps: number;
  currentPhase: number;
  answers: Partial<GuidedFormAnswers>;
  phase2Summary: string | null;
  phase3Summary: string | null;
  generatedOutput: GeneratedOutput | null;
  isGenerating: boolean;
  error: string | null;
}

export interface UserStory {
  number: number;
  title: string;
  priority: 'HOCH' | 'MITTEL' | 'NIEDRIG';
  role: string;
  action: string;
  benefit: string;
  acceptanceCriteria: string[];
  dependencies: string[];
  effort: string;
}

export interface NFR {
  id: string;
  category: string;
  requirement: string;
  recommendation: string;
}

export interface SprintPlan {
  sprintNumber: number;
  stories: string;
  reasoning: string;
}

export interface GeneratedOutput {
  rawResponse: string;
  userStories: UserStory[];
  nfrs: NFR[];
  openQuestions: string[];
  sprintPlan: SprintPlan[];
}
