import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { testCaseGenerationRequestSchema, getValidationErrorMessage } from '@/lib/api-schemas';
import { getAnthropicApiKey } from '@/lib/env';
import { buildTestCaseGenerationPrompt, TEST_CASE_SYSTEM_PROMPT } from '@/lib/prompts';

const generatedTestCasesSchema = z.object({
  gherkin: z.array(
    z.object({
      id: z.string().trim().min(1),
      scenario: z.string().trim().min(1),
      given: z.array(z.string().trim().min(1)).min(1),
      when: z.array(z.string().trim().min(1)).min(1),
      then: z.array(z.string().trim().min(1)).min(1),
    }),
  ),
  classic: z.array(
    z.object({
      id: z.string().trim().min(1),
      scenario: z.string().trim().min(1),
      steps: z.array(z.string().trim().min(1)).min(1),
      expectedResult: z.string().trim().min(1),
    }),
  ),
});

function tryParseModelJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return JSON.parse(trimmed);
  }

  const blockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (blockMatch) {
    return JSON.parse(blockMatch[1].trim());
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
  }

  throw new Error('Kein gueltiges JSON in der Modellantwort gefunden.');
}

function extractTextContent(
  message: Anthropic.Messages.Message,
): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();
}

async function repairToExpectedJson(
  client: Anthropic,
  model: string,
  raw: string,
): Promise<unknown> {
  const repairMessage = await client.messages.create({
    model,
    max_tokens: 2500,
    temperature: 0,
    system:
      'Du bist ein JSON-Formatter. Konvertiere den Input exakt in gueltiges JSON ohne Erklaerungen, ohne Markdown, ohne Codeblock.',
    messages: [
      {
        role: 'user',
        content: `Konvertiere den folgenden Inhalt in exakt dieses JSON-Schema:
{
  "gherkin": [{ "id": "string", "scenario": "string", "given": ["string"], "when": ["string"], "then": ["string"] }],
  "classic": [{ "id": "string", "scenario": "string", "steps": ["string"], "expectedResult": "string" }]
}

Falls Informationen fehlen, ergaenze minimale sinnvolle Inhalte im selben fachlichen Kontext.
Gib nur JSON zurueck.

INPUT:
${raw}`,
      },
    ],
  });

  const repairedText = extractTextContent(repairMessage);
  return tryParseModelJson(repairedText);
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Ungueltiges JSON im Request-Body.' }, { status: 400 });
    }

    const parsedRequest = testCaseGenerationRequestSchema.safeParse(body);
    if (!parsedRequest.success) {
      return NextResponse.json(
        { error: getValidationErrorMessage(parsedRequest.error) },
        { status: 400 },
      );
    }

    const apiKey = getAnthropicApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API-Schluessel nicht konfiguriert. Bitte ANTHROPIC_API_KEY in app/.env.local setzen.' },
        { status: 500 },
      );
    }

    const { story } = parsedRequest.data;
    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL_TEST_CASES || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

    const message = await client.messages.create({
      model,
      max_tokens: 3000,
      temperature: 0.2,
      system: TEST_CASE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildTestCaseGenerationPrompt(story),
        },
      ],
    });

    const rawModelText = extractTextContent(message);
    if (!rawModelText) {
      return NextResponse.json({ error: 'Unerwartete Antwort von Claude.' }, { status: 500 });
    }

    let parsedOutput: unknown;
    try {
      parsedOutput = tryParseModelJson(rawModelText);
    } catch (error) {
      console.warn('Initial test case parse failed, trying repair pass.', error);
      try {
        parsedOutput = await repairToExpectedJson(client, model, rawModelText);
      } catch (repairError) {
        console.error('Test case parse+repair error:', repairError);
        return NextResponse.json(
          { error: 'Die Modellantwort konnte nicht als JSON gelesen werden.' },
          { status: 502 },
        );
      }
    }

    let validOutput = generatedTestCasesSchema.safeParse(parsedOutput);
    if (!validOutput.success) {
      try {
        const repairedOutput = await repairToExpectedJson(client, model, JSON.stringify(parsedOutput));
        validOutput = generatedTestCasesSchema.safeParse(repairedOutput);
      } catch (repairError) {
        console.warn('Schema repair pass failed:', repairError);
      }
    }

    if (!validOutput.success) {
      return NextResponse.json(
        { error: 'Die generierten Testfaelle entsprechen nicht dem erwarteten Format.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, testCases: validOutput.data });
  } catch (error) {
    console.error('Test case generation error:', error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API Fehler: ${error.message}` },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json({ error: 'Ein unerwarteter Fehler ist aufgetreten.' }, { status: 500 });
  }
}
