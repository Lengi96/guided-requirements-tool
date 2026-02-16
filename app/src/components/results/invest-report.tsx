'use client';

import { InvestResult, InvestScore } from '@/lib/invest-validator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const scoreIcon = {
  good: <CheckCircle className="size-4 text-emerald-500" />,
  warning: <AlertTriangle className="size-4 text-amber-500" />,
  bad: <XCircle className="size-4 text-red-500" />,
};

const scoreBgClass = {
  good: 'bg-emerald-50 border-emerald-200',
  warning: 'bg-amber-50 border-amber-200',
  bad: 'bg-red-50 border-red-200',
};

function OverallScoreBadge({ score }: { score: number }) {
  let color: string;
  let label: string;
  if (score >= 85) {
    color = 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0';
    label = 'Sehr gut';
  } else if (score >= 65) {
    color = 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0';
    label = 'Verbesserbar';
  } else {
    color = 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0';
    label = 'Überarbeiten';
  }
  return (
    <Badge className={color}>
      {score}% – {label}
    </Badge>
  );
}

function ScoreRow({ score }: { score: InvestScore }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${scoreBgClass[score.score]}`}>
      <div className="shrink-0 mt-0.5">{scoreIcon[score.score]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-xs font-bold text-gray-600">{score.criterion}</span>
          <span className="text-sm font-medium text-gray-800">{score.label}</span>
        </div>
        <p className="text-xs text-gray-600">{score.feedback}</p>
      </div>
    </div>
  );
}

interface InvestReportProps {
  results: InvestResult[];
}

export function InvestReport({ results }: InvestReportProps) {
  if (results.length === 0) {
    return <p className="text-gray-500 text-sm">Keine Stories zum Validieren vorhanden.</p>;
  }

  const avgScore = Math.round(results.reduce((s, r) => s + r.overallScore, 0) / results.length);
  const issueCount = results.reduce(
    (count, r) => count + r.scores.filter((s) => s.score !== 'good').length,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="glass-subtle rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">
            INVEST-Gesamtbewertung: <OverallScoreBadge score={avgScore} />
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {results.length} Stories analysiert, {issueCount} Verbesserungsvorschläge
          </p>
        </div>
        <div className="text-3xl font-bold text-gray-300">{avgScore}%</div>
      </div>

      {/* Per-story results */}
      {results.map((result) => (
        <div key={result.storyNumber} className="glass-subtle rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800">
              <span className="text-indigo-500 font-mono">#{result.storyNumber}</span>{' '}
              {result.storyTitle}
            </h4>
            <OverallScoreBadge score={result.overallScore} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.scores.map((score) => (
              <ScoreRow key={score.criterion} score={score} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
