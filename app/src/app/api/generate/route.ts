import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildGenerationPrompt } from '@/lib/prompts';
import { parseClaudeOutput } from '@/lib/parser';
import { generateRequestSchema, getValidationErrorMessage } from '@/lib/api-schemas';
import { getAnthropicApiKey } from '@/lib/env';

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

    const parsed = generateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: getValidationErrorMessage(parsed.error) },
        { status: 400 },
      );
    }
    const { answers, followUpQuestions, followUpAnswers } = parsed.data;

    const apiKey = getAnthropicApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API-Schlüssel nicht konfiguriert. Bitte ANTHROPIC_API_KEY in app/.env.local setzen.' },
        { status: 500 },
      );
    }

    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

    const message = await client.messages.create({
      model,
      max_tokens: 4096,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildGenerationPrompt(
            answers as Parameters<typeof buildGenerationPrompt>[0],
            followUpQuestions,
            followUpAnswers,
          ),
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

    return NextResponse.json({ success: true, output });
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
