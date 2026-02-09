import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GeneratedOutput, UserStory, NFR, SprintPlan } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    fontSize: 9,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  storyCard: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  storyTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  priorityBadge: {
    fontSize: 8,
    padding: '2 6',
    borderRadius: 3,
    fontFamily: 'Helvetica-Bold',
  },
  priorityHigh: {
    backgroundColor: '#fecaca',
    color: '#991b1b',
  },
  priorityMedium: {
    backgroundColor: '#fef08a',
    color: '#854d0e',
  },
  priorityLow: {
    backgroundColor: '#bbf7d0',
    color: '#166534',
  },
  storyBody: {
    fontSize: 10,
    marginBottom: 6,
    paddingLeft: 8,
  },
  storyLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
  },
  criteriaTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#4b5563',
    marginTop: 4,
    marginBottom: 3,
  },
  criteriaItem: {
    fontSize: 9,
    color: '#4b5563',
    marginLeft: 12,
    marginBottom: 2,
  },
  effortBadge: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 4,
  },
  nfrItem: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 3,
  },
  nfrId: {
    fontSize: 8,
    color: '#9ca3af',
    fontFamily: 'Helvetica-Bold',
  },
  nfrText: {
    fontSize: 9,
    color: '#374151',
    marginTop: 2,
  },
  nfrRec: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  questionItem: {
    fontSize: 10,
    marginBottom: 4,
    paddingLeft: 8,
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 6,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontSize: 9,
  },
  tableColSprint: { width: '15%' },
  tableColStories: { width: '40%' },
  tableColReasoning: { width: '45%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#9ca3af',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  nextSteps: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
  },
  nextStepsTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    marginBottom: 6,
  },
  nextStepsItem: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 3,
    paddingLeft: 8,
  },
});

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'HOCH': return styles.priorityHigh;
    case 'MITTEL': return styles.priorityMedium;
    case 'NIEDRIG': return styles.priorityLow;
    default: return styles.priorityMedium;
  }
}

function StoryView({ story }: { story: UserStory }) {
  return (
    <View style={styles.storyCard} wrap={false}>
      <View style={styles.storyHeader}>
        <Text style={styles.storyTitle}>
          #{story.number} {story.title}
        </Text>
        <Text style={[styles.priorityBadge, getPriorityStyle(story.priority)]}>
          {story.priority}
        </Text>
      </View>
      <View style={styles.storyBody}>
        <Text>
          <Text style={styles.storyLabel}>Als </Text>
          {story.role}
        </Text>
        <Text>
          <Text style={styles.storyLabel}>möchte ich </Text>
          {story.action}
        </Text>
        <Text>
          <Text style={styles.storyLabel}>damit </Text>
          {story.benefit}
        </Text>
      </View>
      {story.acceptanceCriteria.length > 0 && (
        <View>
          <Text style={styles.criteriaTitle}>Akzeptanzkriterien:</Text>
          {story.acceptanceCriteria.map((c, i) => (
            <Text key={i} style={styles.criteriaItem}>
              {'☐ '}{c}
            </Text>
          ))}
        </View>
      )}
      <Text style={styles.effortBadge}>
        Aufwand: {story.effort}
        {story.dependencies.length > 0
          ? ` | Abhängigkeiten: ${story.dependencies.join(', ')}`
          : ''}
      </Text>
    </View>
  );
}

function NFRView({ nfr }: { nfr: NFR }) {
  return (
    <View style={styles.nfrItem}>
      <Text style={styles.nfrId}>{nfr.id} – {nfr.category}</Text>
      <Text style={styles.nfrText}>{nfr.requirement}</Text>
      <Text style={styles.nfrRec}>Empfehlung: {nfr.recommendation}</Text>
    </View>
  );
}

function SprintRow({ sprint }: { sprint: SprintPlan }) {
  return (
    <View style={styles.tableRow}>
      <Text style={styles.tableColSprint}>Sprint {sprint.sprintNumber}</Text>
      <Text style={styles.tableColStories}>{sprint.stories}</Text>
      <Text style={styles.tableColReasoning}>{sprint.reasoning}</Text>
    </View>
  );
}

interface PDFDocumentProps {
  output: GeneratedOutput;
  projectName: string;
  email: string;
  date: string;
}

export function createPDFDocument(props: PDFDocumentProps) {
  return <PDFDocumentInner {...props} />;
}

function PDFDocumentInner({ output, projectName, email, date }: PDFDocumentProps) {
  const { userStories, nfrs, openQuestions, sprintPlan } = output;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Anforderungsdokument</Text>
          <Text style={styles.subtitle}>{projectName}</Text>
          <View style={styles.meta}>
            <Text>Erstellt am: {date}</Text>
            {email && <Text>Kontakt: {email}</Text>}
          </View>
        </View>

        {/* User Stories */}
        <Text style={styles.sectionTitle}>
          User Stories ({userStories.length})
        </Text>
        {userStories.map((story) => (
          <StoryView key={story.number} story={story} />
        ))}

        {/* NFRs */}
        {nfrs.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>
              Nicht-funktionale Anforderungen ({nfrs.length})
            </Text>
            {nfrs.map((nfr) => (
              <NFRView key={nfr.id} nfr={nfr} />
            ))}
          </View>
        )}

        {/* Open Questions */}
        {openQuestions.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>
              Offene Fragen ({openQuestions.length})
            </Text>
            {openQuestions.map((q, i) => (
              <Text key={i} style={styles.questionItem}>
                {i + 1}. {q}
              </Text>
            ))}
          </View>
        )}

        {/* Sprint Plan */}
        {sprintPlan.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>
              Empfohlene Umsetzungsreihenfolge
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableColSprint}>Sprint</Text>
                <Text style={styles.tableColStories}>User Stories</Text>
                <Text style={styles.tableColReasoning}>Begründung</Text>
              </View>
              {sprintPlan.map((sprint) => (
                <SprintRow key={sprint.sprintNumber} sprint={sprint} />
              ))}
            </View>
          </View>
        )}

        {/* Next Steps */}
        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>Nächste Schritte</Text>
          <Text style={styles.nextStepsItem}>
            1. Offene Fragen mit dem Entwicklungsteam klären
          </Text>
          <Text style={styles.nextStepsItem}>
            2. User Stories priorisieren und Sprint-Planung durchführen
          </Text>
          <Text style={styles.nextStepsItem}>
            3. Akzeptanzkriterien mit Stakeholdern validieren
          </Text>
          <Text style={styles.nextStepsItem}>
            4. Technisches Konzept auf Basis der NFRs erstellen
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Guided Requirements Tool</Text>
          <Text render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
