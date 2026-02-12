# Beitragen zum Guided Requirements Tool

Vielen Dank, dass du einen Beitrag leisten willst! Hier findest du alles, was du brauchst, um loszulegen.

## Entwicklungsumgebung einrichten

```bash
# Repository klonen
git clone https://github.com/Lengi96/guided-requirements-tool.git
cd guided-requirements-tool/app

# Abhangigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.local.example .env.local
# ANTHROPIC_API_KEY in .env.local eintragen

# Entwicklungsserver starten
npm run dev
```

## Workflow

1. **Issue erstellen** -- Beschreibe das Problem oder Feature, bevor du anfangst.
2. **Branch anlegen** -- Nutze das Format `feature/beschreibung` oder `fix/beschreibung`.
3. **Entwickeln** -- Halte dich an die bestehenden Code-Konventionen.
4. **Testen** -- Stelle sicher, dass `npm run build` und `npm run lint` fehlerfrei durchlaufen.
5. **Pull Request** -- Erstelle einen PR gegen `master` mit einer klaren Beschreibung.

## Code-Konventionen

- **Sprache:** UI-Texte auf Deutsch, Code und Kommentare auf Englisch
- **TypeScript:** Strict Mode aktiviert, keine `any` ohne Kommentar
- **Styling:** Tailwind CSS Utility-Klassen, keine separaten CSS-Dateien
- **Komponenten:** Funktionale Komponenten mit Hooks
- **State:** Zustand Store fur globalen State, lokaler State mit `useState`
- **Commits:** Aussagekraftige Commit-Messages auf Englisch

## Projektstruktur

```
app/src/
|-- app/          # Next.js Pages und API Routes
|-- components/   # React-Komponenten (ui/ + results/)
|-- hooks/        # Custom Hooks (Zustand Store)
|-- lib/          # Utilities, Types, Prompts, Parser
```

## Wichtige Dateien

| Datei | Beschreibung |
|---|---|
| `lib/questions.ts` | Kategorien, Pain Points, Features (Fragen-Katalog) |
| `lib/prompts.ts` | Claude System-Prompt und Generation-Prompt |
| `lib/parser.ts` | Regex-basiertes Parsing der Claude-Antwort |
| `lib/types.ts` | TypeScript Interfaces fur alle Datenstrukturen |
| `hooks/use-guided-form.ts` | Zustand Store (zentraler Form-State) |

## Neue Kategorie hinzufugen

1. Neuen Eintrag in `SoftwareCategory` Type (`lib/types.ts`)
2. Kategorie zu `CATEGORIES` Array hinzufugen (`lib/questions.ts`)
3. Pain Points und Features fur die Kategorie definieren (`getPainPointOptions`, `getFeatureOptions`)
4. Build testen: `npm run build`

## Pull Request Checkliste

- [ ] Code kompiliert fehlerfrei (`npm run build`)
- [ ] Linting bestanden (`npm run lint`)
- [ ] Keine `console.log` Statements im Production-Code
- [ ] TypeScript: Keine neuen `any`-Typen ohne Begru&#x308;ndung
- [ ] UI-Texte sind auf Deutsch
- [ ] PR-Beschreibung erkla&#x308;rt das "Warum", nicht nur das "Was"

## Fragen?

Erstelle ein [Issue](https://github.com/Lengi96/guided-requirements-tool/issues) oder kontaktiere [@Lengi96](https://github.com/Lengi96).
