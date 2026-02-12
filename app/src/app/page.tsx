import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, FileText, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: 'Kein Blank Canvas',
    desc: 'Geführter Frageprozess mit kontextbasierten Vorschlägen statt leerem Textfeld.',
  },
  {
    icon: Brain,
    title: 'KI-unterstützt',
    desc: 'Claude AI generiert professionelle User Stories mit Akzeptanzkriterien.',
  },
  {
    icon: FileText,
    title: 'Sofort verwendbar',
    desc: 'User Stories im Standardformat, bereit für Ihr Entwicklungsteam. Als PDF exportierbar.',
  },
  {
    icon: Sparkles,
    title: 'Keine Vorkenntnisse',
    desc: 'Sie brauchen kein technisches Know-how. Das Tool übersetzt Ihre Anforderungen.',
  },
];

const steps = [
  ['Kontext erfassen', 'Beschreiben Sie Ihr Projekt in einfachen Worten'],
  ['Prioritäten setzen', 'Wählen Sie aus kontextbasierten Vorschlägen'],
  ['Trade-offs klären', 'Transparente Entscheidungen über Komplexität'],
  ['User Stories erhalten', 'Professionelle Stories mit Akzeptanzkriterien'],
];

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 animate-gradient">
      {/* Floating decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-300/25 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-2/3 left-10 w-40 h-40 bg-violet-400/15 rounded-full blur-2xl animate-pulse-glow" />
      </div>

      <div className="relative container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-subtle rounded-full px-4 py-1.5 text-sm text-indigo-700 font-medium mb-6">
            <Sparkles className="size-4" />
            KI-gestützte Anforderungserfassung
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient leading-tight">
            Guided Requirements
            <br />
            Tool
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Strukturierte Anforderungserfassung für Product Owner.
            10 geführte Fragen &ndash; professionelle User Stories als Ergebnis.
          </p>
          <Link href="/guided">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]">
              Jetzt starten
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">Kostenlos &middot; Kein Login &middot; 15-20 Minuten</p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.01] group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-8 text-center text-gradient">So funktioniert es</h2>
          <ol className="space-y-5">
            {steps.map(([title, desc], i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
