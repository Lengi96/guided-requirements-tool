'use client';

import { NFR } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

const recColors: Record<string, string> = {
  Standard: 'bg-gray-100 text-gray-700 border-0',
  Erweitert: 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white border-0',
  Enterprise: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0',
};

interface NFRSectionProps {
  nfrs: NFR[];
  onEdit?: (nfr: NFR) => void;
  onDelete?: (id: string) => void;
}

export function NFRSection({ nfrs, onEdit, onDelete }: NFRSectionProps) {
  if (nfrs.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        Keine nicht-funktionalen Anforderungen generiert.
      </p>
    );
  }

  const grouped = nfrs.reduce(
    (acc, nfr) => {
      const cat = nfr.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(nfr);
      return acc;
    },
    {} as Record<string, NFR[]>,
  );

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-md font-semibold mb-3 text-gray-800">{category}</h3>
          <div className="space-y-2">
            {items.map((nfr) => (
              <div key={nfr.id} className="glass-subtle rounded-xl py-3 px-4 flex items-start justify-between gap-4 transition-all duration-200 hover:bg-white/50">
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs text-indigo-400 mr-2">{nfr.id}</span>
                  <span className="text-sm text-gray-700">{nfr.requirement}</span>
                  {nfr.sourceTag && (
                    <div className="text-xs text-gray-400 mt-1 italic">
                      <span className="font-medium text-indigo-400 not-italic">Quelle:</span> {nfr.sourceTag}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className={recColors[nfr.recommendation] || ''}>
                    {nfr.recommendation}
                  </Badge>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(nfr)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Bearbeiten"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(nfr.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Löschen"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
