import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt } from '@/lib/prompts';
import { parseSummaryResponse } from '@/lib/parser';
import { getValidationErrorMessage, summarizeRequestSchema } from '@/lib/api-schemas';

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

    const parsed = summarizeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: getValidationErrorMessage(parsed.error) },
        { status: 400 },
      );
    }
    const { answers, phase } = parsed.data;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API-Schlüssel nicht konfiguriert.' },
        { status: 500 },
      );
    }

    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

    const message = await client.messages.create({
      model,
      max_tokens: 700,
      temperature: 0.3,
      system: SUMMARY_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildSummaryPrompt(answers, phase),
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json(
        { error: 'Unerwartete Antwort von Claude.' },
        { status: 500 },
      );
    }

    const summaryParsed = parseSummaryResponse(textContent.text);

    return NextResponse.json({
      success: true,
      summary: summaryParsed.summaryText,
      followUpQuestions: summaryParsed.followUpQuestions,
    });
  } catch (error) {
    console.error('Summarize error:', error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API Fehler: ${error.message}` },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten.' },
      { status: 500 },
    );
  }
}
