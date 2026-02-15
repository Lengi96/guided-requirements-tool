import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createPDFDocument } from './pdf-document';
import { getValidationErrorMessage, pdfExportRequestSchema } from '@/lib/api-schemas';
import { GeneratedOutput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Ungültiges JSON im Request-Body.' },
        { status: 400 },
      );
    }

    const parsed = pdfExportRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: getValidationErrorMessage(parsed.error) },
        { status: 400 },
      );
    }
    const { output, projectName, email } = parsed.data;

    const safeProjectName = (projectName || 'Projekt').toString().trim().slice(0, 120);
    const safeEmail = (email || '').toString().trim().slice(0, 120);

    const doc = createPDFDocument({
      output: output as unknown as GeneratedOutput,
      projectName: safeProjectName,
      email: safeEmail,
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
