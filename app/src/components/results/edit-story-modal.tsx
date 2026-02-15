'use client';

import { useState } from 'react';
import { UserStory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2 } from 'lucide-react';

interface EditStoryModalProps {
  story: UserStory | null;
  onSave: (story: UserStory) => void;
  onClose: () => void;
  nextNumber?: number;
}

const priorityOptions: { value: UserStory['priority']; label: string; activeClass: string }[] = [
  { value: 'HOCH', label: 'HOCH', activeClass: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md shadow-red-500/20' },
  { value: 'MITTEL', label: 'MITTEL', activeClass: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md shadow-amber-500/20' },
  { value: 'NIEDRIG', label: 'NIEDRIG', activeClass: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-md shadow-emerald-500/20' },
];

const effortOptions: { value: UserStory['effort']; label: string }[] = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

export function EditStoryModal({ story, onSave, onClose, nextNumber = 1 }: EditStoryModalProps) {
  const isNew = story === null;

  const [title, setTitle] = useState(story?.title ?? '');
  const [role, setRole] = useState(story?.role ?? '');
  const [action, setAction] = useState(story?.action ?? '');
  const [benefit, setBenefit] = useState(story?.benefit ?? '');
  const [priority, setPriority] = useState<UserStory['priority']>(story?.priority ?? 'MITTEL');
  const [effort, setEffort] = useState<UserStory['effort']>(story?.effort ?? 'M');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(
    story?.acceptanceCriteria?.length ? [...story.acceptanceCriteria] : ['']
  );
  const [dependenciesText, setDependenciesText] = useState(story?.dependencies?.join(', ') ?? '');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleAddCriterion = () => {
    setAcceptanceCriteria((prev) => [...prev, '']);
  };

  const handleRemoveCriterion = (index: number) => {
    setAcceptanceCriteria((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCriterionChange = (index: number, value: string) => {
    setAcceptanceCriteria((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (!title.trim()) newErrors.title = true;
    if (!role.trim()) newErrors.role = true;
    if (!action.trim()) newErrors.action = true;
    if (!benefit.trim()) newErrors.benefit = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const filteredCriteria = acceptanceCriteria.filter((c) => c.trim() !== '');
    const deps = dependenciesText
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d !== '');

    const updatedStory: UserStory = {
      number: story?.number ?? nextNumber,
      title: title.trim(),
      priority,
      role: role.trim(),
      action: action.trim(),
      benefit: benefit.trim(),
      acceptanceCriteria: filteredCriteria,
      dependencies: deps,
      effort,
    };

    onSave(updatedStory);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/30">
          <h2 className="text-lg font-bold text-gradient">
            {isNew ? 'Neue User Story erstellen' : 'User Story bearbeiten'}
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
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Titel *</Label>
            <Input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: false })); }}
              placeholder="Titel der User Story"
              className={errors.title ? 'border-red-400 ring-red-400/20 ring-2' : ''}
            />
            {errors.title && <p className="text-xs text-red-500">Titel ist erforderlich.</p>}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Rolle *</Label>
            <Input
              value={role}
              onChange={(e) => { setRole(e.target.value); setErrors((p) => ({ ...p, role: false })); }}
              placeholder="z.B. Vertriebsmitarbeiter"
              className={errors.role ? 'border-red-400 ring-red-400/20 ring-2' : ''}
            />
            {errors.role && <p className="text-xs text-red-500">Rolle ist erforderlich.</p>}
          </div>

          {/* Action */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Aktion *</Label>
            <Textarea
              value={action}
              onChange={(e) => { setAction(e.target.value); setErrors((p) => ({ ...p, action: false })); }}
              placeholder="z.B. Leads in einer Pipeline-Ansicht verwalten"
              className={errors.action ? 'border-red-400 ring-red-400/20 ring-2' : ''}
              rows={2}
            />
            {errors.action && <p className="text-xs text-red-500">Aktion ist erforderlich.</p>}
          </div>

          {/* Benefit */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Nutzen *</Label>
            <Textarea
              value={benefit}
              onChange={(e) => { setBenefit(e.target.value); setErrors((p) => ({ ...p, benefit: false })); }}
              placeholder="z.B. ich den Überblick über alle Verkaufsgespräche behalte"
              className={errors.benefit ? 'border-red-400 ring-red-400/20 ring-2' : ''}
              rows={2}
            />
            {errors.benefit && <p className="text-xs text-red-500">Nutzen ist erforderlich.</p>}
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Priorität</Label>
            <div className="flex gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    priority === opt.value
                      ? opt.activeClass
                      : 'glass-subtle text-gray-600 hover:bg-white/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Effort */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Aufwand</Label>
            <div className="flex gap-2">
              {effortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEffort(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    effort === opt.value
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'
                      : 'glass-subtle text-gray-600 hover:bg-white/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700">Akzeptanzkriterien</Label>
              <button
                type="button"
                onClick={handleAddCriterion}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                <Plus className="size-3.5" />
                Hinzufügen
              </button>
            </div>
            <div className="space-y-2">
              {acceptanceCriteria.map((criterion, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="size-6 rounded-md bg-indigo-100 text-indigo-500 flex items-center justify-center text-xs shrink-0 font-medium">
                    {idx + 1}
                  </span>
                  <Input
                    value={criterion}
                    onChange={(e) => handleCriterionChange(idx, e.target.value)}
                    placeholder={`Kriterium ${idx + 1}`}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCriterion(idx)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dependencies */}
          <div className="space-y-1.5">
            <Label className="text-gray-700">Abhängigkeiten</Label>
            <Input
              value={dependenciesText}
              onChange={(e) => setDependenciesText(e.target.value)}
              placeholder="Kommagetrennt, z.B. US-1, US-3"
            />
            <p className="text-xs text-gray-400">Mehrere Abhängigkeiten mit Komma trennen.</p>
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
