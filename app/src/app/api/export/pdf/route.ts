import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { GeneratedOutput } from '@/lib/types';
import { createPDFDocument } from './pdf-document';

interface ExportRequest {
  output: GeneratedOutput;
  projectName: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json();
    const { output, projectName, email } = body;

    if (!output?.userStories?.length) {
      return NextResponse.json(
        { error: 'Keine User Stories zum Exportieren.' },
        { status: 400 },
      );
    }

    const doc = createPDFDocument({
      output,
      projectName,
      email,
      date: new Date().toLocaleDateString('de-DE'),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(doc as any);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="anforderungen-${new Date().toISOString().slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'PDF-Generierung fehlgeschlagen.' },
      { status: 500 },
    );
  }
}
