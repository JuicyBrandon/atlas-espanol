import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'

/**
 * Returns an AI model instance based on environment configuration.
 *
 * Environment variables:
 *   AI_PROVIDER   = "anthropic" | "openai" | "compatible"  (default: anthropic)
 *   AI_MODEL      = model name override (optional)
 *   AI_BASE_URL   = custom base URL for OpenAI-compatible providers (Groq, Together, Perplexity, Mistral…)
 *
 *   API keys — set whichever matches your provider:
 *   ANTHROPIC_API_KEY   — for Anthropic / Claude
 *   OPENAI_API_KEY      — for OpenAI
 *   AI_API_KEY          — fallback key accepted by any provider
 */
export function getAIModel(): LanguageModel {
  const provider = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase()
  const modelOverride = process.env.AI_MODEL
  const fallbackKey = process.env.AI_API_KEY

  if (provider === 'openai' || provider === 'compatible') {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY ?? fallbackKey,
      baseURL: process.env.AI_BASE_URL, // undefined = OpenAI default
    })
    return openai(modelOverride ?? 'gpt-4o-mini')
  }

  // Default: Anthropic
  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? fallbackKey,
  })
  return anthropic(modelOverride ?? 'claude-haiku-4-5-20251001')
}

export function isAIConfigured(): boolean {
  return !!(
    process.env.ANTHROPIC_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.AI_API_KEY
  )
}
