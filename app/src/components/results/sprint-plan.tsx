'use client';

import { SprintPlan } from '@/lib/types';

export function SprintPlanSection({ sprints }: { sprints: SprintPlan[] }) {
  if (sprints.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        Kein Sprint-Plan generiert.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/30">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Sprint</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">User Stories</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Begründung</th>
          </tr>
        </thead>
        <tbody>
          {sprints.map((sprint, idx) => (
            <tr key={sprint.sprintNumber} className={`border-b border-white/20 transition-colors hover:bg-white/30 ${idx % 2 === 0 ? 'bg-white/10' : ''}`}>
              <td className="py-3 px-4 font-medium whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <span className="size-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {sprint.sprintNumber}
                  </span>
                  Sprint {sprint.sprintNumber}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-700">{sprint.stories}</td>
              <td className="py-3 px-4 text-gray-500">{sprint.reasoning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
