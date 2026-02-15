import { readFileSync } from 'fs';
import { resolve } from 'path';

let envLoaded = false;

/**
 * Ensures ANTHROPIC_API_KEY is loaded.
 * Next.js does NOT override existing (even empty) environment variables from .env.local.
 * This function manually reads .env.local as a fallback.
 */
export function getAnthropicApiKey(): string | undefined {
  const key = process.env.ANTHROPIC_API_KEY;
  if (key && key.trim().length > 0) {
    return key.trim();
  }

  // Fallback: manually read .env.local
  if (!envLoaded) {
    envLoaded = true;
    try {
      const envPath = resolve(process.cwd(), '.env.local');
      const content = readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
        const [rawKey, ...valueParts] = trimmed.split('=');
        const envKey = rawKey.trim();
        const envValue = valueParts.join('=').trim();
        if (envKey && envValue && (!process.env[envKey] || process.env[envKey]?.trim() === '')) {
          process.env[envKey] = envValue;
        }
      }
    } catch {
      // .env.local not found, ignore
    }
  }

  const reloaded = process.env.ANTHROPIC_API_KEY;
  return reloaded && reloaded.trim().length > 0 ? reloaded.trim() : undefined;
}
