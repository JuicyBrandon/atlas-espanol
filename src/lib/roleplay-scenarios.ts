// ============================================================
// Atlas Español — Role Play Scenario Library (Sprint 3)
// ============================================================

import type { RolePlayMode } from '@/types'

export interface RolePlayScenario {
  slug: string
  title: string
  description: string
  aiCharacter: string
  setting: string
  objective: string
  minLevel: number
}

export interface RolePlayModeConfig {
  mode: RolePlayMode
  label: string
  tagline: string
  description: string
  scenarios: RolePlayScenario[]
}

export const ROLE_PLAY_MODES: RolePlayModeConfig[] = [
  {
    mode: 'sales',
    label: 'Sales Mode',
    tagline: 'Sell in Colombian Spanish',
    description: 'Cold calls, discovery, objection handling, negotiation, closing — with a realistic Colombian prospect.',
    scenarios: [
      {
        slug: 'cold-call',
        title: 'Cold Call',
        description: 'Call a Colombian business owner who has never heard of you.',
        aiCharacter: 'Don Álvaro, a busy 52-year-old owner of a mid-size logistics company in Bogotá. Sceptical of salespeople, polite but guards his time fiercely.',
        setting: 'An unscheduled phone call to his office on a Tuesday morning.',
        objective: 'Earn 3 more minutes of his time and book a discovery meeting.',
        minLevel: 4,
      },
      {
        slug: 'discovery-call',
        title: 'Discovery Call',
        description: 'Run a discovery call with a warm lead exploring solutions.',
        aiCharacter: 'Catalina, 38, operations director at a Medellín manufacturing firm. Friendly and open, but answers only what is asked — good questions get gold, lazy questions get small talk.',
        setting: 'A scheduled 30-minute video call she accepted after a referral.',
        objective: 'Uncover her real pain points, budget context, and decision process.',
        minLevel: 4,
      },
      {
        slug: 'objection-handling',
        title: 'Objection Handling',
        description: 'Your prospect likes the product but keeps raising objections.',
        aiCharacter: 'Jorge, 45, finance manager in Cali. Interested but cautious — will raise price, timing, and "we already have a provider" objections one by one.',
        setting: 'Second meeting, after your initial pitch went well.',
        objective: 'Address at least three objections without getting defensive, and keep the deal alive.',
        minLevel: 5,
      },
      {
        slug: 'negotiation',
        title: 'Price Negotiation',
        description: 'Negotiate final pricing and terms with a tough buyer.',
        aiCharacter: 'Doña Marcela, 50, procurement head for a Bogotá retail chain. A seasoned negotiator who respects firmness and preparation, and punishes desperation.',
        setting: 'Final negotiation meeting — the deal is yours to win or lose.',
        objective: 'Close the deal while protecting at least 85% of your initial price.',
        minLevel: 5,
      },
      {
        slug: 'closing',
        title: 'Closing the Deal',
        description: 'Everything has gone well — now ask for the business.',
        aiCharacter: 'Andrés, 41, CEO of a growing Medellín startup. Ready to buy but needs a confident close; hesitation makes him "want to think about it".',
        setting: 'Final meeting in his office, contract ready.',
        objective: 'Ask for the signature directly and handle any last-second wobble.',
        minLevel: 5,
      },
    ],
  },
  {
    mode: 'dating',
    label: 'Dating Mode',
    tagline: 'Connect in Colombian Spanish',
    description: 'First messages, flirty conversation, making plans, expressing feelings — warm and natural.',
    scenarios: [
      {
        slug: 'first-message',
        title: 'First Conversation',
        description: 'You matched with someone — start the conversation naturally.',
        aiCharacter: 'Valentina, 29, a graphic designer from Medellín. Warm and playful, loves salsa and hiking, but bored by "hola, ¿cómo estás?" openers.',
        setting: 'A dating app chat that just matched.',
        objective: 'Stand out from generic messages and get a real conversation flowing.',
        minLevel: 2,
      },
      {
        slug: 'flirty-conversation',
        title: 'Flirty Conversation',
        description: 'The chat is going well — keep it playful and charming.',
        aiCharacter: 'Sebastián, 31, a paisa chef with quick wit. Teases affectionately and appreciates wordplay; responds warmly to confidence, coolly to try-hard lines.',
        setting: 'Late evening WhatsApp chat after a few days of messaging.',
        objective: 'Keep the flirty energy going and naturally suggest meeting up.',
        minLevel: 3,
      },
      {
        slug: 'making-plans',
        title: 'Making the First Date',
        description: 'Time to suggest a first date — Colombian style.',
        aiCharacter: 'Camila, 27, from Bogotá. Interested but busy with work; vague plans get a vague "de pronto", concrete and fun proposals get a yes.',
        setting: 'WhatsApp conversation midweek.',
        objective: 'Propose a specific, appealing plan and lock in day, time, and place.',
        minLevel: 3,
      },
      {
        slug: 'expressing-feelings',
        title: 'Expressing Your Feelings',
        description: 'A few dates in — tell them how you feel.',
        aiCharacter: 'Daniela, 30, thoughtful and a little guarded after a bad past relationship. Responds to sincerity, retreats from pressure.',
        setting: 'A quiet café in Chapinero after your fourth date.',
        objective: 'Express genuine interest clearly without overwhelming her.',
        minLevel: 3,
      },
      {
        slug: 'repair-misunderstanding',
        title: 'Repairing a Misunderstanding',
        description: 'Your last message landed badly — fix it.',
        aiCharacter: 'Laura, 28, slightly hurt because your joke read as dismissive over text. Cold at first, warms up to real acknowledgement, not excuses.',
        setting: 'WhatsApp, a day of awkward silence after the misfire.',
        objective: 'Acknowledge, apologise naturally, and recover the warmth.',
        minLevel: 4,
      },
    ],
  },
  {
    mode: 'travel',
    label: 'Travel Mode',
    tagline: 'Navigate Colombia with confidence',
    description: 'Airport, taxi, hotel, restaurant, pharmacy — real situations with realistic locals.',
    scenarios: [
      {
        slug: 'airport',
        title: 'Airport Arrival',
        description: 'You just landed at El Dorado — immigration and onward travel.',
        aiCharacter: 'An immigration officer (formal, efficient) then a taxi dispatcher (fast-talking, helpful).',
        setting: 'El Dorado International Airport, Bogotá, after a long flight.',
        objective: 'Clear immigration, explain your visit, and arrange a safe taxi to your hotel.',
        minLevel: 1,
      },
      {
        slug: 'taxi',
        title: 'Taxi Ride',
        description: 'A chatty Bogotá taxi driver wants to talk the whole ride.',
        aiCharacter: 'Don Gustavo, 58, a Bogotá taxi driver of 30 years. Friendly, opinionated about traffic and football, speaks quickly with local expressions.',
        setting: 'A 40-minute ride from the airport to Chapinero in heavy traffic.',
        objective: 'Hold a friendly conversation, confirm the route and price, and arrive without confusion.',
        minLevel: 2,
      },
      {
        slug: 'hotel',
        title: 'Hotel Check-In Problem',
        description: 'The hotel cannot find your reservation.',
        aiCharacter: 'Paola, 33, a courteous but procedural front-desk manager in Cartagena. Wants to help but needs the right questions and patience.',
        setting: 'Hotel lobby in Cartagena, 9pm, you are tired and it is hot.',
        objective: 'Stay calm, resolve the missing booking, and get a room tonight.',
        minLevel: 2,
      },
      {
        slug: 'restaurant',
        title: 'Restaurant Dinner',
        description: 'Order a full meal at a typical Colombian restaurant.',
        aiCharacter: 'Doña Rosa, 60, owner of a family restaurant in Salento. Warm and motherly, recommends dishes enthusiastically and asks about your trip.',
        setting: 'A cosy restaurante típico in the coffee region, dinner time.',
        objective: 'Order starter, main, and drink; ask what things are; handle the bill Colombian-style.',
        minLevel: 1,
      },
      {
        slug: 'pharmacy',
        title: 'Pharmacy Visit',
        description: 'You feel unwell and need medicine and advice.',
        aiCharacter: 'Felipe, 35, a knowledgeable droguería pharmacist in Medellín. Asks clarifying questions about symptoms before recommending anything.',
        setting: 'A droguería in El Poblado, mid-afternoon.',
        objective: 'Describe your symptoms clearly and leave with the right medicine and dosage instructions.',
        minLevel: 2,
      },
      {
        slug: 'lost-item',
        title: 'Lost Phone',
        description: 'You left your phone in a taxi — report it and try to get it back.',
        aiCharacter: 'A police officer at a CAI post (formal, asks precise questions) and later the taxi company operator (busy, needs details fast).',
        setting: 'A CAI police post in Bogotá, an hour after the taxi ride.',
        objective: 'File the report with accurate details and coordinate with the taxi company.',
        minLevel: 3,
      },
    ],
  },
  {
    mode: 'social',
    label: 'Social Mode',
    tagline: 'Everyday Colombian life',
    description: 'Parties, small talk, group conversations, slang — the social fabric of Colombia.',
    scenarios: [
      {
        slug: 'house-party',
        title: 'Colombian House Party',
        description: 'Your friend brought you to a family gathering — everyone wants to meet you.',
        aiCharacter: 'A rotating cast: Tía Gloria (warm, asks personal questions), cousin Miguel (jokes and slang), and the host Doña Carmen (insists you eat more).',
        setting: 'A Saturday family gathering in a Medellín home, music playing.',
        objective: 'Survive the affectionate interrogation, use polite expressions, and accept food graciously.',
        minLevel: 2,
      },
      {
        slug: 'futbol-talk',
        title: 'Football Small Talk',
        description: 'Talk football with passionate Colombian fans.',
        aiCharacter: 'Camilo, 34, die-hard Atlético Nacional fan. Passionate, uses football slang, delighted when foreigners engage with Colombian football.',
        setting: 'A bar in Medellín during half-time of a big match.',
        objective: 'Hold your own in football small talk and learn the key expressions.',
        minLevel: 3,
      },
      {
        slug: 'making-friends',
        title: 'Making a New Friend',
        description: 'Strike up a conversation with a stranger at a language exchange.',
        aiCharacter: 'Juliana, 26, a friendly bogotana practising English who would rather speak Spanish. Curious about foreigners, suggests plans easily.',
        setting: 'A language exchange meetup in a Bogotá café.',
        objective: 'Build rapport, swap interests, and exchange numbers to meet again.',
        minLevel: 2,
      },
      {
        slug: 'group-dinner',
        title: 'Group Dinner Conversation',
        description: 'Keep up with a fast group conversation over dinner.',
        aiCharacter: 'Three friends — Sara, Nico, and Pipe — who talk over each other, switch topics fast, and pull you into the conversation.',
        setting: 'A pizzeria in Cali with your new friend group, Friday night.',
        objective: 'Follow the thread, interject naturally, and contribute a story of your own.',
        minLevel: 4,
      },
    ],
  },
]

export function getModeConfig(mode: string): RolePlayModeConfig | undefined {
  return ROLE_PLAY_MODES.find(m => m.mode === mode)
}

export function getScenario(mode: string, slug: string): RolePlayScenario | undefined {
  return getModeConfig(mode)?.scenarios.find(s => s.slug === slug)
}
