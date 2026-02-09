# Google Docs Template: PDF-Vorlage

Anleitung zum Erstellen des Google Docs Templates, das von Make.com mit Claude-Output befüllt und als PDF exportiert wird.

---

## Template erstellen

### Schritt 1: Neues Google Doc anlegen

1. Gehe zu [docs.google.com](https://docs.google.com)
2. Erstelle ein neues leeres Dokument
3. Benenne es: **"[TEMPLATE] Anforderungsdokument"**

### Schritt 2: Inhalt mit Platzhaltern einfügen

Kopiere folgenden Inhalt in das Google Doc. Die `{{PLATZHALTER}}` werden von Make.com automatisch ersetzt.

---

```
═══════════════════════════════════════════════════════

              ANFORDERUNGSDOKUMENT
              {{PROJECT_NAME}}

              Erstellt am: {{CREATED_DATE}}
              Erstellt für: {{USER_EMAIL}}

═══════════════════════════════════════════════════════


──────────────────────────────────────────────────────
GENERIERTE USER STORIES UND ANFORDERUNGEN
──────────────────────────────────────────────────────

{{USER_STORIES}}


──────────────────────────────────────────────────────
NÄCHSTE SCHRITTE
──────────────────────────────────────────────────────

1. Besprechen Sie die User Stories mit Ihrem Entwicklungsteam
2. Klären Sie die offenen Fragen im Dokument
3. Passen Sie Prioritäten an Ihre aktuelle Situation an
4. Nutzen Sie die Stories als Grundlage für Ihre Sprint-Planung

Tipp: Gehen Sie die Akzeptanzkriterien mit dem Team durch.
Wenn ein Kriterium unklar ist, ist die Story noch nicht
bereit für die Umsetzung.


──────────────────────────────────────────────────────
MÖCHTEN SIE DIE STORIES VERFEINERN?
──────────────────────────────────────────────────────

Dieses Dokument ist Ihr Startpunkt. Für eine tiefere
Verfeinerung der User Stories bieten wir:

• Persönliche Beratung: Gemeinsam Ihre Stories
  durchgehen und optimieren
• Follow-up Session: Erneut das Tool nutzen mit
  spezifischeren Eingaben
• Full Version (Coming Soon): Interaktive Verfeinerung
  in Echtzeit

Kontakt: christoph@lengowski.de


──────────────────────────────────────────────────────

Erstellt mit dem Guided Requirements Tool
https://github.com/Lengi96/guided-requirements-tool

═══════════════════════════════════════════════════════
```

---

## Schritt 3: Formatierung anpassen

### Überschriften
- **Titel** ("ANFORDERUNGSDOKUMENT"): Heading 1, zentriert, fett
- **Abschnitt-Titel** ("GENERIERTE USER STORIES..."): Heading 2, fett
- **"NÄCHSTE SCHRITTE"**, **"MÖCHTEN SIE..."**: Heading 2, fett

### Schrift
- **Schriftart:** Arial oder Open Sans
- **Textgröße:** 11pt für Fließtext
- **Platzhalter:** Gleiche Formatierung wie umgebender Text

### Seiteneinstellungen
- **Format:** A4
- **Ränder:** 2,5 cm oben/unten, 2 cm links/rechts
- **Seitenzahlen:** Unten zentriert (Einfügen → Seitenzahlen)

### Farben
- **Überschriften:** Dunkelgrau (#333333)
- **Fließtext:** Schwarz (#000000)
- **Hinweise/Footer:** Hellgrau (#888888)

---

## Schritt 4: Template-ID notieren

1. Öffne das Template in Google Docs
2. Kopiere die URL: `https://docs.google.com/document/d/XXXXXX/edit`
3. Die **Document ID** ist der Teil `XXXXXX` zwischen `/d/` und `/edit`
4. Notiere diese ID für die Make.com Konfiguration (Modul 6)

---

## Schritt 5: Berechtigungen

Das Google Docs Template muss für den Make.com Service-Account zugänglich sein:

1. In Make.com: Google-Verbindung autorisieren
2. Make.com erhält Zugriff auf Google Drive
3. Template muss im selben Account oder per "Freigabe" zugänglich sein

> **Empfehlung:** Erstelle einen eigenen Google Drive Ordner "Requirements Tool" und speichere Template + generierte Dokumente dort.

---

## Platzhalter-Referenz

| Platzhalter | Beschreibung | Quelle (Make.com) |
|---|---|---|
| `{{PROJECT_NAME}}` | Projekt-Vision (gekürzt) | Modul 2: `project_vision` (erste 80 Zeichen) |
| `{{CREATED_DATE}}` | Erstellungsdatum | `formatDate(now; "DD.MM.YYYY HH:mm")` |
| `{{USER_EMAIL}}` | E-Mail des Users | Modul 2: `user_email` |
| `{{USER_STORIES}}` | Claude-Output (kompletter Text) | Modul 5: `claude_output` |

---

## Hinweise

### Markdown im Google Doc
Claude gibt Markdown aus (z.B. `### Heading`, `- [ ] Checkbox`). Google Docs interpretiert Markdown **nicht** automatisch. Das bedeutet:

- Markdown-Syntax wird als Plaintext angezeigt
- Das ist für den MVP akzeptabel -- die Formatierung ist trotzdem lesbar
- In der Full Version wird react-pdf mit korrektem Rendering verwendet

### Alternative: HTML-zu-PDF
Falls die Markdown-Darstellung nicht ausreicht, kannst du statt Google Docs einen HTML-zu-PDF Service nutzen:

1. **Carbone.io** (Make.com Integration verfügbar)
2. **PDFShift** (API-basiert, Make.com HTTP-Modul)
3. **html2pdf.app** (einfachste Option)

Für den MVP ist Google Docs ausreichend.

---

## Checkliste

- [ ] Google Doc Template erstellt
- [ ] Alle 4 Platzhalter eingefügt
- [ ] Formatierung angepasst (Schrift, Größe, Ränder)
- [ ] Document ID notiert
- [ ] Template im Make.com Modul 6 verlinkt
- [ ] Test: Platzhalter werden korrekt ersetzt
