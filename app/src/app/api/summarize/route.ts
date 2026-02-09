import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GuidedFormAnswers } from '@/lib/types';
import { SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, phase } = body as {
      answers: Partial<GuidedFormAnswers>;
      phase: 2 | 3;
    };

    if (!answers || !phase) {
      return NextResponse.json(
        { error: 'Answers und Phase sind erforderlich.' },
        { status: 400 },
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API-Schlüssel nicht konfiguriert.' },
        { status: 500 },
      );
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
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

    return NextResponse.json({ summary: textContent.text });
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
