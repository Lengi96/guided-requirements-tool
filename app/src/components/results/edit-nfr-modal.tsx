'use client';

import { useState } from 'react';
import { NFR } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface EditNFRModalProps {
  nfr: NFR | null;
  onSave: (nfr: NFR) => void;
  onClose: () => void;
}

const recommendationOptions: { value: NFR['recommendation']; label: string; activeClass: string }[] = [
  { value: 'Standard', label: 'Standard', activeClass: 'bg-gray-700 text-white shadow-md shadow-gray-500/20' },
  { value: 'Erweitert', label: 'Erweitert', activeClass: 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-md shadow-blue-500/20' },
  { value: 'Enterprise', label: 'Enterprise', activeClass: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md shadow-purple-500/20' },
];

function generateId(): string {
  return `NFR-U${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

export function EditNFRModal({ nfr, onSave, onClose }: EditNFRModalProps) {
  const isNew = nfr === null;

  const [id, setId] = useState(nfr?.id ?? generateId());
  const [category, setCategory] = useState(nfr?.category ?? '');
  const [requirement, setRequirement] = useState(nfr?.requirement ?? '');
  const [recommendation, setRecommendation] = useState<NFR['recommendation']>(nfr?.recommendation ?? 'Standard');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!id.trim()) newErrors.id = true;
    if (!category.trim()) newErrors.category = true;
    if (!requirement.trim()) newErrors.requirement = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const updatedNFR: NFR = {
      id: id.trim(),
      category: category.trim(),
      requirement: requirement.trim(),
      recommendation,
    };

    onSave(updatedNFR);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/30">
          <h2 className="text-lg font-bold text-gradient">
            {isNew ? 'Neue NFR erstellen' : 'NFR bearbeiten'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* ID */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">ID *</Label>
            <Input
              value={id}
              onChange={(e) => { setId(e.target.value); setErrors((p) => ({ ...p, id: false })); }}
              placeholder="z.B. NFR-001"
              className={errors.id ? 'border-red-400 ring-red-400/20 ring-2' : ''}
            />
            {errors.id && <p className="text-xs text-red-500">ID ist erforderlich.</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Kategorie *</Label>
            <Input
              value={category}
              onChange={(e) => { setCategory(e.target.value); setErrors((p) => ({ ...p, category: false })); }}
              placeholder="z.B. Performance, Security"
              className={errors.category ? 'border-red-400 ring-red-400/20 ring-2' : ''}
            />
            {errors.category && <p className="text-xs text-red-500">Kategorie ist erforderlich.</p>}
          </div>

          {/* Requirement */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Anforderung *</Label>
            <Textarea
              value={requirement}
              onChange={(e) => { setRequirement(e.target.value); setErrors((p) => ({ ...p, requirement: false })); }}
              placeholder="Beschreibung der nicht-funktionalen Anforderung"
              className={errors.requirement ? 'border-red-400 ring-red-400/20 ring-2' : ''}
              rows={3}
            />
            {errors.requirement && <p className="text-xs text-red-500">Anforderung ist erforderlich.</p>}
          </div>

          {/* Recommendation */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Empfehlung</Label>
            <div className="flex gap-2">
              {recommendationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRecommendation(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    recommendation === opt.value
                      ? opt.activeClass
                      : 'glass-subtle text-gray-600 hover:bg-white/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
