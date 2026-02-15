'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface EditQuestionModalProps {
  question: string | null;
  index: number | null;
  onSave: (question: string, index: number | null) => void;
  onClose: () => void;
}

export function EditQuestionModal({ question, index, onSave, onClose }: EditQuestionModalProps) {
  const isNew = question === null;

  const [text, setText] = useState(question ?? '');
  const [hasError, setHasError] = useState(false);

  const handleSave = () => {
    if (!text.trim()) {
      setHasError(true);
      return;
    }
    onSave(text.trim(), index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="glass-strong rounded-2xl w-full max-w-md shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/30">
          <h2 className="text-lg font-bold text-gradient">
            {isNew ? 'Neue Frage hinzufügen' : 'Frage bearbeiten'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-gray-700">Frage *</Label>
            <Textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setHasError(false); }}
              placeholder="Offene Frage eingeben..."
              className={hasError ? 'border-red-400 ring-red-400/20 ring-2' : ''}
              rows={4}
            />
            {hasError && <p className="text-xs text-red-500">Frage darf nicht leer sein.</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/30">
          <Button variant="outline" onClick={onClose} className="glass-subtle border-white/30 hover:bg-white/50">
            Abbrechen
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20"
          >
            Speichern
          </Button>
        </div>
      </div>
    </div>
  );
}
