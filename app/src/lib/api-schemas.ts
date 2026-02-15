import { z } from 'zod';

const softwareCategorySchema = z.enum([
  'CRM / Kundenmanagement',
  'ERP / Ressourcenplanung',
  'Workflow / Prozessautomatisierung',
  'Reporting / Dashboards',
  'Kommunikation / Collaboration',
  'E-Commerce / Shop',
  'Portal',
  'Mobile App',
  'Andere',
]);

const guidedFormAnswersSchema = z.object({
  projectVision: z.string().trim().min(1, 'Projektvision ist erforderlich.'),
  targetRoles: z.string().trim().min(1, 'Zielgruppen-Rollen sind erforderlich.'),
  userCount: z.enum(['1-10', '10-50', '50-200', '200+']),
  techLevel: z.number().int().min(1).max(5),
  category: softwareCategorySchema,
  existingSystem: z.enum(['replace', 'integrate', 'new']),
  existingSystemDetails: z.string().optional(),
  mainPain: z.array(z.string().trim().min(1)).min(1, 'Hauptprobleme sind erforderlich.'),
  topFeatures: z.array(z.string().trim().min(1)).min(1, 'Top-Funktionen sind erforderlich.'),
  platforms: z.array(z.string().trim().min(1)).min(1, 'Plattformen sind erforderlich.'),
  offlineCapability: z.enum(['full', 'partial', 'none']).optional(),
  strategy: z.string().trim().min(1, 'Strategie ist erforderlich.'),
  email: z.string().optional(),
  contextDocument: z.string().max(512000).optional(),
  contextDocumentName: z.string().max(255).optional(),
});

const followUpQuestionSchema = z.object({
  id: z.string().trim().min(1),
  question: z.string().trim().min(1),
  isCritical: z.boolean(),
});

export const generateRequestSchema = z.object({
  answers: guidedFormAnswersSchema,
  followUpQuestions: z.array(followUpQuestionSchema).optional(),
  followUpAnswers: z.record(z.string(), z.string()).optional(),
});

export const summarizeRequestSchema = z.object({
  answers: guidedFormAnswersSchema.partial(),
  phase: z.union([z.literal(2), z.literal(3)]),
});

const pdfOutputSchema = z.object({
  userStories: z.array(z.unknown()).min(1, 'Keine User Stories zum Exportieren.'),
  nfrs: z.array(z.unknown()),
  openQuestions: z.array(z.string()),
  sprintPlan: z.array(z.unknown()),
  rawResponse: z.string(),
  parsingWarnings: z.array(z.string()),
});

export const pdfExportRequestSchema = z.object({
  output: pdfOutputSchema,
  projectName: z.string().optional(),
  email: z.string().optional(),
});

export function getValidationErrorMessage(error: z.ZodError): string {
  const firstIssue = error.issues[0];
  if (!firstIssue) return 'Ungültige Eingabedaten.';
  return firstIssue.message || `Ungültiger Wert für Feld "${firstIssue.path.join('.')}".`;
}
