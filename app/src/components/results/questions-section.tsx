'use client';

import { Pencil, Trash2 } from 'lucide-react';

interface QuestionsSectionProps {
  questions: string[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export function QuestionsSection({ questions, onEdit, onDelete }: QuestionsSectionProps) {
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
          <li key={idx} className="flex items-start gap-3 group">
            <span className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-xl w-8 h-8 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              {idx + 1}
            </span>
            <span className="text-sm text-gray-700 pt-1.5 leading-relaxed flex-1">{question}</span>
            <div className="flex gap-1 shrink-0 pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(idx)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Bearbeiten"
                >
                  <Pencil className="size-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(idx)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Löschen"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
