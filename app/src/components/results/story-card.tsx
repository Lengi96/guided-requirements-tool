'use client';

import { UserStory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const priorityMeta: Record<UserStory['priority'], { badgeClass: string; impactText: string }> = {
  HOCH: {
    badgeClass: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0',
    impactText: 'Sehr hoher Nutzen fuer das Projekt. Sollte frueh umgesetzt werden.',
  },
  MITTEL: {
    badgeClass: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0',
    impactText: 'Wichtiger Beitrag, aber nicht kritisch fuer den Projektstart.',
  },
  NIEDRIG: {
    badgeClass: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white border-0',
    impactText: 'Nice-to-have oder spaetere Optimierung mit geringerem Druck.',
  },
};

const effortMeta: Record<UserStory['effort'], { label: string; scopeText: string }> = {
  S: {
    label: 'S',
    scopeText: 'Kleiner Umfang, meist klar abgrenzbar und schnell umsetzbar.',
  },
  M: {
    label: 'M',
    scopeText: 'Mittlerer Umfang, evtl. mit kleineren Abhaengigkeiten.',
  },
  L: {
    label: 'L',
    scopeText: 'Groesserer Umfang mit hoeherem Abstimmungs- und Testaufwand.',
  },
  XL: {
    label: 'XL',
    scopeText: 'Sehr grosser Umfang, typischerweise ueber mehrere Iterationen.',
  },
};

interface StoryCardProps {
  story: UserStory;
  onEdit?: (story: UserStory) => void;
  onDelete?: (storyNumber: number) => void;
  onGenerateTestCases?: (story: UserStory) => void;
  isGeneratingTestCases?: boolean;
}

export function StoryCard({ story, onEdit, onDelete, onGenerateTestCases, isGeneratingTestCases = false }: StoryCardProps) {
  const criteriaCount = story.acceptanceCriteria.length;
  const dependencyCount = story.dependencies.length;
  const scopeHint =
    criteriaCount >= 5 || dependencyCount >= 2
      ? 'Komplexitaetshinweis: Erhoehte Komplexitaet durch viele Kriterien/Abhaengigkeiten.'
      : 'Komplexitaetshinweis: Ueberschaubare Komplexitaet auf Basis der aktuellen Angaben.';

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.005]">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            <span className="text-indigo-500 font-mono">#{story.number}</span>{' '}
            {story.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={priorityMeta[story.priority].badgeClass}>
              Prioritaet: {story.priority}
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-0">
              Aufwand: {effortMeta[story.effort].label}
            </Badge>
            {onEdit && (
              <button
                onClick={() => onEdit(story)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Bearbeiten"
              >
                <Pencil className="size-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(story.number)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Löschen"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {onGenerateTestCases && (
          <div className="mb-3">
            <Button
              size="sm"
              onClick={() => onGenerateTestCases(story)}
              disabled={isGeneratingTestCases}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            >
              <Wand2 className="size-3.5 mr-1.5" />
              {isGeneratingTestCases ? 'Generierung...' : 'Testfaelle generieren'}
            </Button>
          </div>
        )}

        <div className="glass-subtle rounded-xl p-3 mb-4 space-y-1.5">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Wichtigkeit:</span>{' '}
            {priorityMeta[story.priority].impactText}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Umfang:</span>{' '}
            {effortMeta[story.effort].scopeText}
          </p>
          <p className="text-xs text-gray-500">
            {scopeHint}
          </p>
        </div>

        <div className="glass-subtle rounded-xl p-4 text-sm space-y-1 mb-4">
          <p>
            <span className="font-medium text-indigo-700">Als</span> {story.role}
          </p>
          <p>
            <span className="font-medium text-indigo-700">möchte ich</span> {story.action}
          </p>
          <p>
            <span className="font-medium text-indigo-700">damit</span> {story.benefit}
          </p>
        </div>

        {story.acceptanceCriteria.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold mb-2 text-gray-800">Akzeptanzkriterien</h4>
            <ul className="space-y-1.5">
              {story.acceptanceCriteria.map((criterion, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="size-5 rounded-md bg-indigo-100 text-indigo-500 flex items-center justify-center text-xs mt-0.5 shrink-0">
                    {idx + 1}
                  </span>
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {story.dependencies.length > 0 && (
          <div className="text-sm text-gray-500 pt-2 border-t border-white/30">
            <span className="font-medium">Abhängigkeiten:</span>{' '}
            {story.dependencies.join(', ')}
          </div>
        )}

        {story.sourceTag && (
          <div className="text-xs text-gray-400 pt-2 border-t border-white/30 flex items-start gap-1.5">
            <span className="font-medium text-indigo-400 shrink-0">Quelle:</span>
            <span className="italic">{story.sourceTag}</span>
          </div>
        )}
      </div>
    </div>
  );
}
