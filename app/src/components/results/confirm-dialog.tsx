'use client';

import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="glass-strong rounded-2xl w-full max-w-md shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="p-5 pb-0">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 pt-0">
          <Button variant="outline" onClick={onCancel} className="glass-subtle border-white/30 hover:bg-white/50">
            Abbrechen
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white shadow-lg shadow-red-500/20"
          >
            Löschen
          </Button>
        </div>
      </div>
    </div>
  );
}
