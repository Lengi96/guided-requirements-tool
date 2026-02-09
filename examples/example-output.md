# Beispiel-Output: Generierte User Stories

Basierend auf dem Input aus `example-input.md` (CRM für Vertriebsteam, 20 User).

---

## Projektübersicht

**Projekt:** CRM-System Vertriebsteam
**Erstellt am:** 2026-02-09
**User Stories:** 8
**Prioritätsverteilung:** 3x HOCH, 3x MITTEL, 2x NIEDRIG

---

## User Stories

### User Story 1: Lead-Erfassung
**Priorität:** HOCH
**Aufwand:** M

Als Vertriebsmitarbeiter
möchte ich neue Leads in max. 3 Klicks erfassen können
damit ich bei Kundengesprächen nicht den Fokus verliere

**Akzeptanzkriterien:**
- [ ] Pflichtfelder: Name, Firma, Telefon
- [ ] Optionale Felder: E-Mail, Lead-Quelle (Dropdown: Messe, Website, Empfehlung, Kaltakquise, Sonstige)
- [ ] Optionales Notizfeld (Freitext, max. 500 Zeichen)
- [ ] Automatische Zeitstempel-Erfassung (Erstelldatum, letztes Update)
- [ ] Erfolgsbestätigung nach Speicherung sichtbar (min. 3 Sekunden)
- [ ] Lead wird automatisch dem erstellenden Mitarbeiter zugeordnet

**Abhängigkeiten:** US-5 (Login/Auth)

---

### User Story 2: Pipeline-/Kanban-Ansicht
**Priorität:** HOCH
**Aufwand:** L

Als Vertriebsleiter
möchte ich alle Leads in einer Kanban-Ansicht nach Status sehen
damit ich den Stand aller Verkaufsgespräche auf einen Blick erfasse

**Akzeptanzkriterien:**
- [ ] Standard-Spalten: Neu, Kontaktiert, Angebot gesendet, Verhandlung, Gewonnen, Verloren
- [ ] Leads per Drag & Drop zwischen Spalten verschiebbar
- [ ] Jede Karte zeigt: Firmenname, Ansprechpartner, letzter Kontakt, zuständiger Mitarbeiter
- [ ] Filter nach zuständigem Mitarbeiter möglich
- [ ] Ansicht lädt in unter 3 Sekunden bei 500 Leads

**Abhängigkeiten:** US-1 (Lead-Erfassung)

---

### User Story 3: Kontakthistorie
**Priorität:** HOCH
**Aufwand:** M

Als Vertriebsmitarbeiter
möchte ich zu jedem Lead eine chronologische Kontakthistorie sehen
damit ich bei Folgegesprächen sofort weiß, was zuletzt besprochen wurde

**Akzeptanzkriterien:**
- [ ] Chronologische Liste aller Einträge (neueste oben)
- [ ] Pro Eintrag: Datum, Art (Anruf, E-Mail, Meeting, Notiz), Freitext
- [ ] Neuer Eintrag in max. 2 Klicks hinzufügbar
- [ ] Einträge anderer Mitarbeiter sind sichtbar (Read-Only)
- [ ] Mindestens die letzten 100 Einträge pro Lead ohne Paginierung sichtbar

**Abhängigkeiten:** US-1 (Lead-Erfassung)

---

### User Story 4: Lead-Übergabe
**Priorität:** MITTEL
**Aufwand:** S

Als Vertriebsleiter
möchte ich Leads von einem Mitarbeiter auf einen anderen übertragen können
damit bei Krankheit oder Personalwechsel keine Leads verwaisen

**Akzeptanzkriterien:**
- [ ] Einzelne oder mehrere Leads gleichzeitig übertragbar
- [ ] Empfänger wird per E-Mail benachrichtigt
- [ ] Komplette Kontakthistorie bleibt erhalten
- [ ] Übergabe wird in der Kontakthistorie dokumentiert (automatischer Eintrag)
- [ ] Nur Vertriebsleiter und Admin dürfen Übergaben durchführen

**Abhängigkeiten:** US-1, US-3, US-5

---

### User Story 5: Login und Benutzerverwaltung
**Priorität:** MITTEL
**Aufwand:** M

Als Administrator
möchte ich Benutzerkonten mit Rollen anlegen und verwalten können
damit jeder Mitarbeiter nur die für ihn vorgesehenen Funktionen nutzt

**Akzeptanzkriterien:**
- [ ] Rollen: Vertriebsmitarbeiter, Vertriebsleiter, Admin
- [ ] Login per E-Mail und Passwort
- [ ] Passwort-Reset per E-Mail möglich
- [ ] Admin kann Benutzer anlegen, deaktivieren und Rollen ändern
- [ ] Inaktive Benutzer werden nach 30 Tagen automatisch gesperrt

**Abhängigkeiten:** Keine (Basisfunktion)

---

### User Story 6: Mobile Ansicht
**Priorität:** MITTEL
**Aufwand:** M

Als Vertriebsmitarbeiter im Außendienst
möchte ich Lead-Daten und Kontakthistorie auf meinem Smartphone lesen können
damit ich mich unterwegs auf Kundentermine vorbereiten kann

**Akzeptanzkriterien:**
- [ ] Responsive Darstellung auf Smartphones (min. 375px Breite)
- [ ] Lead-Details und Kontakthistorie lesbar
- [ ] Offline-Zugriff auf zuletzt geöffnete Leads (Lesen, nicht Bearbeiten)
- [ ] Synchronisation bei Wiederherstellung der Internetverbindung
- [ ] Seitenaufbau auf mobilem Netz (4G) in unter 4 Sekunden

**Abhängigkeiten:** US-1, US-3

---

### User Story 7: Lead-Suche
**Priorität:** NIEDRIG
**Aufwand:** S

Als Vertriebsmitarbeiter
möchte ich nach Leads per Name, Firma oder Telefonnummer suchen können
damit ich einen bestimmten Lead in unter 10 Sekunden finde

**Akzeptanzkriterien:**
- [ ] Suchfeld prominent sichtbar (Header-Bereich)
- [ ] Suche startet automatisch nach 3 eingegebenen Zeichen
- [ ] Ergebnisse erscheinen in unter 1 Sekunde
- [ ] Suche durchsucht: Name, Firma, Telefon, E-Mail
- [ ] Max. 20 Ergebnisse angezeigt, sortiert nach Relevanz

**Abhängigkeiten:** US-1

---

### User Story 8: Duplikat-Warnung
**Priorität:** NIEDRIG
**Aufwand:** S

Als Vertriebsmitarbeiter
möchte ich beim Anlegen eines Leads gewarnt werden, wenn ein ähnlicher Lead existiert
damit keine doppelten Einträge entstehen

**Akzeptanzkriterien:**
- [ ] Prüfung auf Duplikat bei Eingabe von Firma + Name
- [ ] Warnung erscheint vor dem Speichern (nicht blockierend)
- [ ] Anzeige des potenziellen Duplikats mit Link
- [ ] User kann trotzdem speichern (bewusste Entscheidung)
- [ ] Duplikat-Prüfung in unter 2 Sekunden

**Abhängigkeiten:** US-1

---

## Nicht-funktionale Anforderungen

### Performance
- **NFR-P1:** Seitenaufbau unter 2 Sekunden bei 20 gleichzeitigen Usern
- **NFR-P2:** Kanban-Board lädt in unter 3 Sekunden bei 500 Leads
- **NFR-P3:** Suche liefert Ergebnisse in unter 1 Sekunde

### Security
- **NFR-S1:** Verschlüsselte Datenübertragung (HTTPS/TLS 1.3)
- **NFR-S2:** Passwörter gehasht gespeichert (bcrypt)
- **NFR-S3:** Session-Timeout nach 8 Stunden Inaktivität
- **NFR-S4:** Audit-Log für Lead-Änderungen und Übergaben

### Verfügbarkeit
- **NFR-V1:** Verfügbarkeit Mo-Fr 7:00-20:00 Uhr (99.5%)
- **NFR-V2:** Geplante Wartung nur Sa/So 2:00-6:00 Uhr
- **NFR-V3:** Recovery Time Objective: 4 Stunden

### Plattformen
- **NFR-PL1:** Desktop: Chrome, Firefox, Edge (jeweils aktuelle Version)
- **NFR-PL2:** Mobile: iOS Safari 16+, Android Chrome 110+
- **NFR-PL3:** Offline-Modus: Zuletzt geöffnete Leads (max. 50) cached

---

## Offene Fragen

1. Soll es eine Reporting-Funktion geben? (Vom User als "nicht Top-3" eingestuft, aber evtl. für Phase 2 relevant)
2. Ist eine DSGVO-konforme Löschfunktion für Leads erforderlich?
3. Soll es eine Import-Funktion für bestehende Excel-Daten geben?
4. Wie lange sollen Lead-Daten aufbewahrt werden?

---

## Abhängigkeitsdiagramm

```
US-5 (Login)
  │
  ├── US-1 (Lead-Erfassung)
  │     │
  │     ├── US-2 (Kanban)
  │     ├── US-3 (Kontakthistorie)
  │     │     │
  │     │     └── US-4 (Lead-Übergabe)
  │     ├── US-6 (Mobile Ansicht)
  │     ├── US-7 (Suche)
  │     └── US-8 (Duplikat-Warnung)
```

## Empfohlene Reihenfolge der Umsetzung

| Sprint | Stories | Begründung |
|---|---|---|
| Sprint 1 | US-5, US-1 | Basis: Login + Lead-Erfassung |
| Sprint 2 | US-3, US-7 | Kontakthistorie + Suche |
| Sprint 3 | US-2 | Kanban (benötigt Leads als Datenbasis) |
| Sprint 4 | US-4, US-8 | Übergabe + Duplikate |
| Sprint 5 | US-6 | Mobile Ansicht (kann parallel zu Sprint 3-4) |
