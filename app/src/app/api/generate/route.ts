import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GuidedFormAnswers } from '@/lib/types';
import { SYSTEM_PROMPT, buildGenerationPrompt } from '@/lib/prompts';
import { parseClaudeOutput } from '@/lib/parser';

export async function POST(request: NextRequest) {
  try {
    const answers: GuidedFormAnswers = await request.json();

    if (!answers.projectVision || !answers.category || !answers.topFeatures?.length) {
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen. Bitte fülle das Formular vollständig aus.' },
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
      max_tokens: 4096,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildGenerationPrompt(answers),
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

    const output = parseClaudeOutput(textContent.text);

    return NextResponse.json(output);
  } catch (error) {
    console.error('Generate error:', error);

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
