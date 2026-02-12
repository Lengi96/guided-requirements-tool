'use client';

import { UserStory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const priorityColors: Record<string, string> = {
  HOCH: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0',
  MITTEL: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0',
  NIEDRIG: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white border-0',
};

const effortLabels: Record<string, string> = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  XL: 'Extra Large',
};

export function StoryCard({ story }: { story: UserStory }) {
  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.005]">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            <span className="text-indigo-500 font-mono">#{story.number}</span>{' '}
            {story.title}
          </h3>
          <div className="flex gap-2 shrink-0">
            <Badge variant="outline" className={priorityColors[story.priority]}>
              {story.priority}
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-0">
              {effortLabels[story.effort] || story.effort}
            </Badge>
          </div>
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
      </div>
    </div>
  );
}
