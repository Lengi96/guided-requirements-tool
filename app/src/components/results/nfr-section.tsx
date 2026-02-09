'use client';

import { NFR } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const recColors: Record<string, string> = {
  Standard: 'bg-gray-100 text-gray-700',
  Erweitert: 'bg-blue-100 text-blue-700',
  Enterprise: 'bg-purple-100 text-purple-700',
};

export function NFRSection({ nfrs }: { nfrs: NFR[] }) {
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
          <h3 className="text-md font-semibold mb-3">{category}</h3>
          <div className="space-y-2">
            {items.map((nfr) => (
              <Card key={nfr.id} className="bg-gray-50">
                <CardContent className="py-3 px-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-gray-400 mr-2">{nfr.id}</span>
                    <span className="text-sm">{nfr.requirement}</span>
                  </div>
                  <Badge variant="secondary" className={recColors[nfr.recommendation] || ''}>
                    {nfr.recommendation}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
