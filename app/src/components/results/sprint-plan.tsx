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
          <tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold">Sprint</th>
            <th className="text-left py-3 px-4 font-semibold">User Stories</th>
            <th className="text-left py-3 px-4 font-semibold">Begründung</th>
          </tr>
        </thead>
        <tbody>
          {sprints.map((sprint) => (
            <tr key={sprint.sprintNumber} className="border-b">
              <td className="py-3 px-4 font-medium whitespace-nowrap">
                Sprint {sprint.sprintNumber}
              </td>
              <td className="py-3 px-4">{sprint.stories}</td>
              <td className="py-3 px-4 text-gray-600">{sprint.reasoning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
