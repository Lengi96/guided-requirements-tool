'use client';

export function QuestionsSection({ questions }: { questions: string[] }) {
  if (questions.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        Keine offenen Fragen identifiziert.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-4">
        Diese Fragen sollten vor Beginn der Entwicklung geklärt werden:
      </p>
      <ol className="space-y-3">
        {questions.map((question, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-700 text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <span className="text-sm text-gray-700 pt-1">{question}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
