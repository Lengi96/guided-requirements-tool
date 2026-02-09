import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Guided Requirements Tool
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Strukturierte Anforderungserfassung f&uuml;r Product Owner.
            10 gef&uuml;hrte Fragen &ndash; professionelle User Stories als Ergebnis.
          </p>
          <Link href="/guided">
            <Button size="lg" className="text-lg px-8 py-6">
              Jetzt starten
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-3">Kostenlos &middot; Kein Login &middot; 15-20 Minuten</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Kein Blank Canvas</h3>
              <p className="text-sm text-gray-600">
                Gef&uuml;hrter Frageprozess mit kontextbasierten Vorschl&auml;gen statt leerem Textfeld.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">KI-unterst&uuml;tzt</h3>
              <p className="text-sm text-gray-600">
                Claude AI generiert professionelle User Stories mit Akzeptanzkriterien.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Sofort verwendbar</h3>
              <p className="text-sm text-gray-600">
                User Stories im Standardformat, bereit f&uuml;r Ihr Entwicklungsteam. Als PDF exportierbar.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Keine Vorkenntnisse</h3>
              <p className="text-sm text-gray-600">
                Sie brauchen kein technisches Know-how. Das Tool &uuml;bersetzt Ihre Anforderungen.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">So funktioniert es</h2>
          <ol className="space-y-4">
            {[
              ['Kontext erfassen', 'Beschreiben Sie Ihr Projekt in einfachen Worten'],
              ['Priorit\u00e4ten setzen', 'W\u00e4hlen Sie aus kontextbasierten Vorschl\u00e4gen'],
              ['Trade-offs kl\u00e4ren', 'Transparente Entscheidungen \u00fcber Komplexit\u00e4t'],
              ['User Stories erhalten', 'Professionelle Stories mit Akzeptanzkriterien'],
            ].map(([title, desc], i) => (
              <li key={i} className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold mr-4 text-sm">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
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
