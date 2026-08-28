import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { LanguageModel } from 'ai'

/**
 * Returns an AI model instance based on environment configuration.
 *
 * Environment variables:
 *   AI_PROVIDER   = "anthropic" | "openai" | "compatible"  (default: anthropic)
 *   AI_MODEL      = model name override (optional for anthropic/openai, REQUIRED for compatible)
 *   AI_BASE_URL   = base URL, REQUIRED for compatible providers (Groq, Together, Perplexity, Mistral, Ollama…)
 *
 *   API keys — set whichever matches your provider:
 *   ANTHROPIC_API_KEY   — for Anthropic / Claude
 *   OPENAI_API_KEY      — for OpenAI
 *   AI_API_KEY          — for compatible providers (also accepted as fallback by the others)
 *
 * Note: "compatible" uses the Chat Completions API via @ai-sdk/openai-compatible.
 * Do NOT route third-party providers through the openai provider — recent
 * @ai-sdk/openai versions default to OpenAI's Responses API, which providers
 * like Groq do not implement.
 */
export function getAIModel(): LanguageModel {
  const provider = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase()
  const modelOverride = process.env.AI_MODEL
  const fallbackKey = process.env.AI_API_KEY

  if (provider === 'compatible') {
    const baseURL = process.env.AI_BASE_URL
    if (!baseURL) {
      throw new Error('AI_PROVIDER=compatible requires AI_BASE_URL to be set')
    }
    const compatible = createOpenAICompatible({
      name: 'compatible',
      baseURL,
      apiKey: fallbackKey ?? process.env.OPENAI_API_KEY,
    })
    // Chat Completions endpoint — supported by Groq, Together, Mistral, Ollama, etc.
    return compatible.chatModel(modelOverride ?? 'llama-3.3-70b-versatile')
  }

  if (provider === 'openai') {
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY ?? fallbackKey,
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
  const provider = (process.env.AI_PROVIDER ?? 'anthropic').toLowerCase()

  if (provider === 'compatible') {
    // Compatible providers need both a base URL and a key
    return !!(process.env.AI_BASE_URL && (process.env.AI_API_KEY || process.env.OPENAI_API_KEY))
  }
  if (provider === 'openai') {
    return !!(process.env.OPENAI_API_KEY || process.env.AI_API_KEY)
  }
  return !!(process.env.ANTHROPIC_API_KEY || process.env.AI_API_KEY)
}
