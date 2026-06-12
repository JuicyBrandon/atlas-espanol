import type { SpanishLevel } from '@/types'

export interface PlacementQuestion {
  id: string
  question: string
  options: string[]
  correct: number // index of correct option
  level: SpanishLevel
  explanation: string
}

// 6 questions in ascending difficulty — score maps directly to recommended level
export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'p1',
    question: '¿Qué significa "¿Cómo estás?"',
    options: ['What is your name?', 'How are you?', 'Where are you from?', 'How old are you?'],
    correct: 1,
    level: 1,
    explanation: '"¿Cómo estás?" is the everyday greeting "How are you?" — Level 1 essential.',
  },
  {
    id: 'p2',
    question: 'You want to order a coffee politely. Which phrase is correct?',
    options: [
      'Café me gusta, señor.',
      'Un café quiero.',
      'Me gustaría un café, por favor.',
      'Dame café.',
    ],
    correct: 2,
    level: 2,
    explanation: '"Me gustaría un café, por favor" is natural and polite in Colombian Spanish.',
  },
  {
    id: 'p3',
    question: 'In Colombia, "¡Quiubo!" is used to say:',
    options: ['Goodbye', 'Thank you', 'Hey / What\'s up?', 'I\'m sorry'],
    correct: 2,
    level: 3,
    explanation: '"Quiubo" (from "¿Qué hubo?") is the most common casual greeting across Colombia.',
  },
  {
    id: 'p4',
    question: 'Choose the correct sentence: "Yesterday I was tired."',
    options: [
      'Ayer soy cansado.',
      'Ayer estuve cansado.',
      'Ayer fui cansado.',
      'Ayer tengo cansado.',
    ],
    correct: 1,
    level: 4,
    explanation: 'Temporary states use "estar", and past tense of "estar" is "estuve" — not "fui" (ser).',
  },
  {
    id: 'p5',
    question: '"Estar mamado/a" in Colombian Spanish means:',
    options: ['To be hungry', 'To be drunk', 'To be bored / fed up', 'To be exhausted'],
    correct: 3,
    level: 5,
    explanation: '"Estar mamado" primarily means to be exhausted or completely fed up — very common in everyday Colombian speech.',
  },
  {
    id: 'p6',
    question: 'In a formal Colombian business meeting, the most appropriate greeting is:',
    options: [
      '¿Qué más, parce?',
      'Buenas tardes, un placer conocerle.',
      '¿Quiubo pues?',
      '¿Cómo le va, mijo?',
    ],
    correct: 1,
    level: 6,
    explanation: 'Formal professional settings call for "Buenas tardes, un placer conocerle" — warm but appropriately respectful.',
  },
]

export function scoreToLevel(correctCount: number): SpanishLevel {
  if (correctCount <= 1) return 1
  if (correctCount === 2) return 2
  if (correctCount === 3) return 3
  if (correctCount === 4) return 4
  if (correctCount === 5) return 5
  return 5 // Level 6 = professional fluency; assessment can suggest max 5
}

export const LEVEL_DESCRIPTIONS: Record<SpanishLevel, string> = {
  1: 'Absolute Beginner — start with greetings and survival phrases',
  2: 'Survival Spanish — taxis, restaurants, and everyday situations',
  3: 'Social Spanish — conversations, feelings, and making plans',
  4: 'Independent Speaker — storytelling, opinions, and workplace basics',
  5: 'Advanced Conversational — nuance, humour, and most daily situations',
  6: 'Professional Fluency — meetings, negotiation, and executive communication',
}
