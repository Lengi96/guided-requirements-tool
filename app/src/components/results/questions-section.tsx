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
            <span className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-xl w-8 h-8 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              {idx + 1}
            </span>
            <span className="text-sm text-gray-700 pt-1.5 leading-relaxed">{question}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
