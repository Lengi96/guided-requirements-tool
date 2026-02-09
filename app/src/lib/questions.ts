import { SoftwareCategory, GuidedFormAnswers } from './types';

export interface QuestionOption {
  value: string;
  label: string;
}

export function getPainPointOptions(category: SoftwareCategory | undefined): string[] {
  const map: Record<string, string[]> = {
    'CRM / Kundenmanagement': [
      'Leads gehen verloren (E-Mails/Excel)',
      'Kein Überblick über Verkaufsgespräche',
      'Manuelles Reporting',
      'Teamübergaben funktionieren nicht',
      'Kundendaten sind verstreut',
    ],
    'Workflow / Prozessautomatisierung': [
      'Prozesse sind nicht dokumentiert',
      'Freigaben dauern zu lange',
      'Keine Nachvollziehbarkeit',
      'Zu viele manuelle Schritte',
      'Medienbrüche (Papier → Digital)',
    ],
    'E-Commerce / Shop': [
      'Bestellprozess zu kompliziert',
      'Lagerverwaltung nicht synchron',
      'Kundenservice überlastet',
      'Keine Personalisierung',
      'Zahlungsintegration fehlt',
    ],
    'ERP / Ressourcenplanung': [
      'Daten über mehrere Systeme verstreut',
      'Manuelle Datenpflege kostet zu viel Zeit',
      'Keine Echtzeit-Übersicht',
      'Reporting ist aufwendig',
      'Schnittstellen funktionieren nicht',
    ],
    'Reporting / Dashboards': [
      'Daten in unterschiedlichen Systemen',
      'Reports werden manuell erstellt',
      'Keine Echtzeit-Daten',
      'Zu viele Excel-Tabellen',
      'Keine visuellen Auswertungen',
    ],
    'Kommunikation / Collaboration': [
      'Informationen gehen in E-Mail-Ketten verloren',
      'Keine zentrale Wissensdatenbank',
      'Team arbeitet nicht synchron',
      'Versionskonflikte bei Dokumenten',
      'Zu viele verschiedene Tools',
    ],
    'Portal': [
      'Nutzer müssen anrufen statt selbst zu suchen',
      'Informationen sind veraltet',
      'Keine Self-Service-Optionen',
      'Zu viele Login-Systeme',
      'Mobiler Zugriff fehlt',
    ],
    'Mobile App': [
      'Web-Anwendung nicht mobil nutzbar',
      'Offline-Funktionalität fehlt',
      'Performance auf Mobilgeräten schlecht',
      'Keine Push-Benachrichtigungen',
      'Kein nativer Look & Feel',
    ],
  };
  const fallback = [
    'Prozess ist ineffizient',
    'Datenqualität ist schlecht',
    'Keine Integration mit anderen Systemen',
    'Benutzer sind frustriert',
    'Compliance-Anforderungen nicht erfüllt',
  ];
  return map[category || ''] || fallback;
}

export function getFeatureOptions(category: SoftwareCategory | undefined): string[] {
  const map: Record<string, string[]> = {
    'CRM / Kundenmanagement': [
      'Lead-Erfassung und -Verwaltung',
      'Pipeline/Kanban-Ansicht',
      'Reporting und Dashboards',
      'E-Mail-Integration',
      'Kalender und Aufgaben',
      'Kontakthistorie',
      'Angebots-/Rechnungserstellung',
      'Automatische Erinnerungen',
    ],
    'Workflow / Prozessautomatisierung': [
      'Formular-basierte Eingabe',
      'Freigabe-Workflows',
      'Benachrichtigungen',
      'Audit Trail / Nachvollziehbarkeit',
      'Dokumenten-Management',
      'Status-Tracking',
      'Automatische Eskalation',
      'Berichterstellung',
    ],
    'E-Commerce / Shop': [
      'Produktkatalog',
      'Warenkorb & Checkout',
      'Zahlungsintegration',
      'Bestellverwaltung',
      'Kundenkonto',
      'Lagerverwaltung',
      'Versandintegration',
      'Produktsuche & Filter',
    ],
    'ERP / Ressourcenplanung': [
      'Stammdatenverwaltung',
      'Auftragsbearbeitung',
      'Lagerverwaltung',
      'Finanzmodul',
      'Reporting',
      'Schnittstellen zu Drittsystemen',
      'Benutzerverwaltung',
      'Workflow-Engine',
    ],
    'Reporting / Dashboards': [
      'Interaktive Dashboards',
      'Datenvisualisierung (Charts)',
      'Echtzeit-Daten',
      'Filteroptionen',
      'Export (PDF, Excel)',
      'Scheduled Reports',
      'Drill-Down Funktionalität',
      'Multi-Source Integration',
    ],
    'Kommunikation / Collaboration': [
      'Chat/Messaging',
      'Dokumenten-Management',
      'Versionierung',
      'Kommentarfunktion',
      'Benachrichtigungen',
      'Suche',
      'User-Profile',
      'Activity Feed',
    ],
    'Portal': [
      'Benutzer-Login',
      'Self-Service Bereich',
      'Dokumenten-Download',
      'Ticketsystem / Support',
      'FAQ / Wissensdatenbank',
      'Profilverwaltung',
      'Benachrichtigungen',
      'Suchfunktion',
    ],
    'Mobile App': [
      'Push-Benachrichtigungen',
      'Offline-Modus',
      'Kamera-Integration',
      'GPS/Standort',
      'Biometrische Authentifizierung',
      'Daten-Synchronisation',
      'Native Performance',
      'App-Store Deployment',
    ],
  };
  const fallback = [
    'Benutzerverwaltung',
    'Datenerfassung',
    'Suche und Filterung',
    'Reporting',
    'Benachrichtigungen',
    'Import / Export von Daten',
    'Dokumenten-Verwaltung',
    'Automatisierung von Abläufen',
  ];
  return map[category || ''] || fallback;
}

export const CATEGORIES: SoftwareCategory[] = [
  'CRM / Kundenmanagement',
  'ERP / Ressourcenplanung',
  'Workflow / Prozessautomatisierung',
  'Reporting / Dashboards',
  'Kommunikation / Collaboration',
  'E-Commerce / Shop',
  'Portal',
  'Mobile App',
  'Andere',
];

export const PLATFORM_OPTIONS = [
  'Desktop (Büro-PC/Laptop)',
  'Tablet',
  'Smartphone',
];

export const EXISTING_SYSTEM_OPTIONS = [
  { value: 'replace', label: 'Ja, wir ersetzen ein bestehendes System' },
  { value: 'integrate', label: 'Ja, wir ergänzen bestehende Systeme' },
  { value: 'new', label: 'Nein, kompletter Neustart' },
];

export const STRATEGY_OPTIONS = [
  'Schnell fertig mit Basisfunktionen – dann iterativ erweitern',
  'Alles auf einmal, dafür dauert es länger',
];

export const OFFLINE_OPTIONS = [
  { value: 'full', label: 'Ja, vollständig offline' },
  { value: 'partial', label: 'Teilweise (Lesen ja, Bearbeiten nein)' },
  { value: 'none', label: 'Nein, immer online' },
];

export const USER_COUNT_OPTIONS = ['1-10', '10-50', '50-200', '200+'];

export function getPhaseInfo(step: number): { phase: number; name: string } {
  if (step <= 4) return { phase: 1, name: 'Projekt-Kontext' };
  if (step <= 7) return { phase: 2, name: 'Schmerzpunkte & Prioritäten' };
  if (step <= 9) return { phase: 3, name: 'Strategie & Abschluss' };
  return { phase: 4, name: 'Generierung' };
}

export function needsOfflineQuestion(answers: Partial<GuidedFormAnswers>): boolean {
  return (
    !!answers.platforms &&
    (answers.platforms.includes('Tablet') || answers.platforms.includes('Smartphone'))
  );
}

export function needsSystemDetails(answers: Partial<GuidedFormAnswers>): boolean {
  return answers.existingSystem === 'replace' || answers.existingSystem === 'integrate';
}

/** Total visible steps based on current answers */
export function getTotalSteps(answers: Partial<GuidedFormAnswers>): number {
  let steps = 9; // base steps
  if (needsSystemDetails(answers)) steps++;
  if (needsOfflineQuestion(answers)) steps++;
  return steps;
}
