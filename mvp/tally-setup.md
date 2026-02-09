# Tally-Formular: Setup-Anleitung

Schritt-für-Schritt-Anleitung zum Erstellen des Guided Requirements Formulars in Tally.

## Voraussetzungen

- Tally Pro Account ($29/Monat) -- benötigt für Conditional Logic
- Ca. 2-3 Stunden Setup-Zeit

---

## Schritt 1: Formular anlegen

1. Gehe zu [tally.so](https://tally.so)
2. Klicke "Create form"
3. Wähle "Start from scratch"
4. Benenne das Formular: **"Guided Requirements Tool"**

---

## Schritt 2: Einleitung konfigurieren

Füge als erste Seite eine **Welcome Page** hinzu:

**Titel:**
```
Willkommen beim Guided Requirements Tool
```

**Beschreibung:**
```
In 10 geführten Fragen erfassen wir Ihre Software-Anforderungen.
Am Ende erhalten Sie professionelle User Stories per E-Mail.

⏱ Dauer: ca. 15-20 Minuten
📄 Ergebnis: PDF mit User Stories + Akzeptanzkriterien

Klicken Sie auf "Los geht's" um zu starten.
```

**Button-Text:** "Los geht's"

---

## Schritt 3: Fragen anlegen

### Frage 1: Projekt-Vision
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Long Text |
| **Frage** | Beschreiben Sie in 2-3 Sätzen, was Ihre Software können soll. |
| **Hilfetext** | Stellen Sie sich vor, Sie erklären einem Kollegen in der Kaffeeküche, worum es geht. |
| **Placeholder** | z.B. "Wir brauchen ein System, mit dem unser Vertriebsteam Leads verwalten und den Status von Verkaufsgesprächen tracken kann." |
| **Pflichtfeld** | Ja |
| **Min. Zeichen** | 50 |
| **Max. Zeichen** | 500 |

---

### Frage 2a: Nutzer-Rollen
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Short Text |
| **Frage** | Wer wird die Software hauptsächlich nutzen? Nennen Sie die Rollen. |
| **Hilfetext** | z.B. Vertriebsmitarbeiter, Teamleiter, Sachbearbeiter, Administrator |
| **Placeholder** | z.B. "15 Vertriebsmitarbeiter, 3 Teamleiter, 2 Backoffice" |
| **Pflichtfeld** | Ja |

---

### Frage 2b: Anzahl Nutzer
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Dropdown |
| **Frage** | Wie viele Personen werden die Software nutzen? |
| **Optionen** | 1-10 Nutzer / 10-50 Nutzer / 50-200 Nutzer / Mehr als 200 Nutzer |
| **Pflichtfeld** | Ja |

---

### Frage 2c: Technisches Level
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Opinion Scale (1-5) |
| **Frage** | Wie technisch versiert sind die Hauptnutzer? |
| **Links-Label** | Nutzen kaum PC |
| **Rechts-Label** | Power User |
| **Pflichtfeld** | Ja |

---

### Frage 3: Software-Kategorie
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Multiple Choice (Einfachauswahl) |
| **Frage** | In welche Kategorie fällt Ihre Software am ehesten? |
| **Optionen** | |

```
○ CRM / Kundenmanagement
○ ERP / Ressourcenplanung
○ Workflow / Prozessautomatisierung
○ Reporting / Dashboards
○ Kommunikation / Collaboration
○ E-Commerce / Online-Shop
○ Portal (Kunden- oder Mitarbeiterportal)
○ Andere (bitte beschreiben)
```

| **"Andere" Freitext** | Ja, bei Auswahl "Andere" |
| **Pflichtfeld** | Ja |

> **Wichtig:** Diese Frage steuert die Conditional Logic für Frage 5 und 6.

---

### Frage 4: Bestehendes System
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Multiple Choice (Einfachauswahl) |
| **Frage** | Gibt es bereits ein System, das ersetzt oder ergänzt werden soll? |
| **Optionen** | |

```
○ Ja, wir ersetzen ein bestehendes System
○ Ja, wir ergänzen bestehende Systeme
○ Nein, kompletter Neustart
```

| **Pflichtfeld** | Ja |

**Conditional Logic:**

**Frage 4a** (nur sichtbar wenn "ersetzen" gewählt):
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Long Text |
| **Frage** | Welches System wird ersetzt? Was funktioniert gut, was nicht? |
| **Placeholder** | z.B. "Wir nutzen Excel-Tabellen. Flexibel, aber jeder hat seine eigene Version und es gibt keine gemeinsame Sicht." |
| **Pflichtfeld** | Ja (wenn sichtbar) |

**Frage 4b** (nur sichtbar wenn "ergänzen" gewählt):
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Long Text |
| **Frage** | Welche bestehenden Systeme müssen angebunden werden? |
| **Placeholder** | z.B. "SAP für Auftragsabwicklung, Outlook für E-Mail, SharePoint für Dokumente" |
| **Pflichtfeld** | Ja (wenn sichtbar) |

---

### Frage 5: Hauptproblem
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Multiple Choice (Mehrfachauswahl) + Freitext |
| **Frage** | Was sind die größten Probleme, die die Software lösen soll? (Mehrfachauswahl möglich) |
| **Hilfetext** | Denken Sie an den Moment, in dem Sie denken: "Das muss doch besser gehen!" |

**Optionen -- Variante CRM** (Conditional: wenn Frage 3 = "CRM"):
```
□ Leads gehen verloren (liegen in E-Mails, Excel, Notizen)
□ Kein Überblick über den Status von Verkaufsgesprächen
□ Reporting und Auswertungen sind manuell und zeitaufwendig
□ Teamübergaben funktionieren nicht sauber
□ Kundendaten sind an verschiedenen Orten verstreut
□ Andere: [Freitext]
```

**Optionen -- Variante Workflow** (Conditional: wenn Frage 3 = "Workflow"):
```
□ Prozesse sind nicht dokumentiert oder standardisiert
□ Freigaben und Genehmigungen dauern zu lange
□ Keine Nachvollziehbarkeit, wer was wann getan hat
□ Zu viele manuelle Schritte und Medienbrüche
□ Informationen gehen bei Übergaben verloren
□ Andere: [Freitext]
```

**Optionen -- Variante E-Commerce** (Conditional: wenn Frage 3 = "E-Commerce"):
```
□ Bestellprozess ist zu kompliziert für Kunden
□ Lagerverwaltung und Bestellungen nicht synchron
□ Kundenservice ist überlastet mit Standardanfragen
□ Keine personalisierte Kundenansprache möglich
□ Zahlungs- oder Versandintegration fehlt
□ Andere: [Freitext]
```

**Optionen -- Standard** (für alle anderen Kategorien):
```
□ Prozesse sind zu langsam oder umständlich
□ Informationen sind nicht zentral verfügbar
□ Manuelle Arbeit, die automatisiert werden könnte
□ Fehlende Transparenz und Reporting
□ Zusammenarbeit im Team funktioniert nicht gut
□ Andere: [Freitext]
```

| **Pflichtfeld** | Ja (min. 1 Option) |

---

### Frage 6: Top-3-Funktionen
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Ranking |
| **Frage** | Welche 3 Funktionen sind am wichtigsten? Bitte nach Priorität sortieren. |
| **Hilfetext** | Ziehen Sie die 3 wichtigsten Funktionen nach oben. |

**Optionen -- Variante CRM** (Conditional: wenn Frage 3 = "CRM"):
```
1. Lead-Erfassung und -Verwaltung
2. Pipeline-/Kanban-Ansicht
3. Reporting und Dashboards
4. E-Mail-Integration
5. Kalender und Aufgaben
6. Kontakthistorie
7. Angebots-/Rechnungserstellung
8. Automatische Erinnerungen
```

**Optionen -- Variante Workflow** (Conditional: wenn Frage 3 = "Workflow"):
```
1. Formular-basierte Eingabe
2. Freigabe-Workflows
3. Benachrichtigungen / Alerts
4. Audit Trail / Nachvollziehbarkeit
5. Dokumenten-Management
6. Status-Tracking
7. Automatische Eskalation
8. Berichterstellung
```

**Optionen -- Variante E-Commerce** (Conditional: wenn Frage 3 = "E-Commerce"):
```
1. Produktkatalog / Shop-Frontend
2. Warenkorb und Checkout
3. Zahlungsintegration
4. Lagerverwaltung
5. Kundenportal / Self-Service
6. Suche und Filterung
7. Bewertungen und Reviews
8. Marketing / Personalisierung
```

**Optionen -- Standard** (für alle anderen Kategorien):
```
1. Dateneingabe und -verwaltung
2. Suche und Filterung
3. Reporting / Dashboards
4. Benachrichtigungen
5. Benutzerverwaltung und Rollen
6. Import / Export von Daten
7. Dokumenten-Verwaltung
8. Automatisierung von Abläufen
```

> **Hinweis:** Falls Tally keinen "Ranking"-Feldtyp unterstützt, verwende stattdessen **3 separate Dropdown-Felder** ("Wichtigste Funktion", "Zweitwichtigste", "Drittwichtigste") mit denselben Optionen.

---

### Frage 7: Plattformen
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Multiple Choice (Mehrfachauswahl) |
| **Frage** | Auf welchen Geräten soll die Software genutzt werden? |
| **Optionen** | |

```
□ Desktop (Büro-PC / Laptop)
□ Tablet (iPad etc.)
□ Smartphone
□ Alle Geräte (Responsive)
```

| **Pflichtfeld** | Ja (min. 1 Option) |

**Frage 7a** (Conditional: nur wenn Tablet oder Smartphone gewählt):
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Multiple Choice (Einfachauswahl) |
| **Frage** | Muss die App auch ohne Internetverbindung funktionieren? |
| **Optionen** | |

```
○ Ja, vollständig offline nutzbar
○ Teilweise (Lesen ja, Bearbeiten nur online)
○ Nein, immer online
```

---

### Frage 8: Strategie
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Multiple Choice (Einfachauswahl) |
| **Frage** | Was ist Ihnen wichtiger? |
| **Optionen** | |

```
○ Schnell starten mit den Basisfunktionen, dann Schritt für Schritt erweitern
  → "Schnellerer Start, dafür anfangs weniger Funktionen"

○ Alles auf einmal umsetzen, auch wenn es länger dauert
  → "Längere Wartezeit bis zum Go-Live, dafür vollständiger Funktionsumfang"
```

| **Pflichtfeld** | Ja |

---

### Frage 9: E-Mail
| Einstellung | Wert |
|---|---|
| **Feldtyp** | Email |
| **Frage** | An welche E-Mail-Adresse sollen wir Ihre User Stories senden? |
| **Hilfetext** | Sie erhalten das Ergebnis als PDF innerhalb von 5 Minuten. |
| **Pflichtfeld** | Ja |

---

## Schritt 4: Abschluss-Seite

**Titel:**
```
Vielen Dank!
```

**Beschreibung:**
```
Ihre Anforderungen werden jetzt von unserer KI verarbeitet.

📬 Sie erhalten Ihre User Stories als PDF per E-Mail
   innerhalb der nächsten 5 Minuten.

Prüfen Sie auch Ihren Spam-Ordner.

Fragen oder Feedback? Antworten Sie einfach auf die E-Mail.
```

---

## Schritt 5: Conditional Logic einrichten

In Tally unter **"Logic"** folgende Regeln anlegen:

### Regel 1: CRM-spezifische Probleme
```
WENN Frage 3 = "CRM / Kundenmanagement"
DANN zeige Frage 5 mit CRM-Optionen
UND zeige Frage 6 mit CRM-Optionen
```

### Regel 2: Workflow-spezifische Probleme
```
WENN Frage 3 = "Workflow / Prozessautomatisierung"
DANN zeige Frage 5 mit Workflow-Optionen
UND zeige Frage 6 mit Workflow-Optionen
```

### Regel 3: E-Commerce-spezifische Probleme
```
WENN Frage 3 = "E-Commerce / Online-Shop"
DANN zeige Frage 5 mit E-Commerce-Optionen
UND zeige Frage 6 mit E-Commerce-Optionen
```

### Regel 4: Standard (alle anderen Kategorien)
```
WENN Frage 3 = eine der übrigen Optionen
DANN zeige Frage 5 mit Standard-Optionen
UND zeige Frage 6 mit Standard-Optionen
```

### Regel 5: System-Ersetzung
```
WENN Frage 4 = "Ja, wir ersetzen ein bestehendes System"
DANN zeige Frage 4a
```

### Regel 6: System-Ergänzung
```
WENN Frage 4 = "Ja, wir ergänzen bestehende Systeme"
DANN zeige Frage 4b
```

### Regel 7: Offline-Frage
```
WENN Frage 7 enthält "Tablet" ODER "Smartphone"
DANN zeige Frage 7a
```

> **Tipp:** In Tally Pro lassen sich Conditional Logic Regeln über den "Logic"-Tab konfigurieren. Erstelle für die kategorie-abhängigen Fragen (5 und 6) separate Frage-Blöcke mit jeweils eigener Sichtbarkeitsregel.

---

## Schritt 6: Webhook einrichten

1. Gehe zu **Form Settings → Integrations → Webhooks**
2. Füge die Make.com Webhook-URL hinzu (wird in `make-scenario.md` erstellt)
3. Aktiviere "Send webhook on form submission"
4. Teste mit einer Test-Submission

---

## Schritt 7: Design anpassen

1. **Logo:** Eigenes Logo hochladen (oben links)
2. **Farben:** Primärfarbe passend zur Marke wählen
3. **Schrift:** Standard belassen (sauber und neutral)
4. **Progress Bar:** Aktivieren (zeigt Fortschritt in %)
5. **Custom Domain** (optional): Tally Pro erlaubt Custom Domains

---

## Checkliste

- [ ] Alle 10 Fragen (+ 3 konditionale) angelegt
- [ ] Hilfetext und Placeholder bei allen Fragen
- [ ] Conditional Logic für alle 7 Regeln konfiguriert
- [ ] Welcome Page und Thank You Page gestaltet
- [ ] Webhook-URL eingetragen und getestet
- [ ] Progress Bar aktiviert
- [ ] Formular einmal komplett durchgetestet (alle Pfade)
- [ ] Formular-Link kopiert und bereit zum Teilen
