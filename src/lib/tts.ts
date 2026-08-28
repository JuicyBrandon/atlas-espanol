// Colombian Spanish text-to-speech via Azure Cognitive Services Speech.
// Azure is the only major provider with authentic es-CO neural voices.
//
// Env:
//   AZURE_SPEECH_KEY     — Speech resource key
//   AZURE_SPEECH_REGION  — resource region, e.g. "eastus"
//
// When unset, callers should fall back to the browser's Web Speech API.

export type ColombianVoice = 'salome' | 'gonzalo'

// es-CO neural voices. Salomé (female) and Gonzalo (male) are the two
// Colombian voices Azure ships.
const VOICE_NAMES: Record<ColombianVoice, string> = {
  salome: 'es-CO-SalomeNeural',
  gonzalo: 'es-CO-GonzaloNeural',
}

export function isTTSConfigured(): boolean {
  return !!(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION)
}

export function resolveVoice(voice?: string): ColombianVoice {
  return voice === 'gonzalo' ? 'gonzalo' : 'salome'
}

// Escape text for safe inclusion inside SSML.
function escapeSsml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Synthesizes MP3 audio for the given text. Returns the audio bytes,
// or null if TTS isn't configured. Throws on a provider error.
export async function synthesizeSpeech(
  text: string,
  voice: ColombianVoice = 'salome'
): Promise<ArrayBuffer | null> {
  const key = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION
  if (!key || !region) return null

  const voiceName = VOICE_NAMES[voice]
  // Slightly slower rate makes it easier for learners to follow.
  const ssml = `<speak version='1.0' xml:lang='es-CO'><voice xml:lang='es-CO' name='${voiceName}'><prosody rate='-8%'>${escapeSsml(
    text
  )}</prosody></voice></speak>`

  const res = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'atlas-espanol',
      },
      body: ssml,
    }
  )

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Azure TTS error ${res.status}: ${detail.slice(0, 200)}`)
  }

  return res.arrayBuffer()
}
