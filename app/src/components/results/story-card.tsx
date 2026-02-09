'use client';

import { UserStory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const priorityColors: Record<string, string> = {
  HOCH: 'bg-red-100 text-red-800 border-red-200',
  MITTEL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  NIEDRIG: 'bg-green-100 text-green-800 border-green-200',
};

const effortLabels: Record<string, string> = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  XL: 'Extra Large',
};

export function StoryCard({ story }: { story: UserStory }) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">
            #{story.number} {story.title}
          </CardTitle>
          <div className="flex gap-2 shrink-0">
            <Badge variant="outline" className={priorityColors[story.priority]}>
              {story.priority}
            </Badge>
            <Badge variant="secondary">{effortLabels[story.effort] || story.effort}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
          <p>
            <span className="font-medium">Als</span> {story.role}
          </p>
          <p>
            <span className="font-medium">möchte ich</span> {story.action}
          </p>
          <p>
            <span className="font-medium">damit</span> {story.benefit}
          </p>
        </div>

        {story.acceptanceCriteria.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Akzeptanzkriterien</h4>
            <ul className="space-y-1">
              {story.acceptanceCriteria.map((criterion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400 mt-0.5">☐</span>
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {story.dependencies.length > 0 && (
          <div className="text-sm text-gray-500">
            <span className="font-medium">Abhängigkeiten:</span>{' '}
            {story.dependencies.join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
