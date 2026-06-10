-- ============================================================
-- Atlas Español — Level 1 Curriculum Seed (12 modules)
-- Absolute Beginner | CEFR A0-A1
-- ============================================================

insert into public.lessons (level, module_name, lesson_title, lesson_goal, grammar_focus, scenario, sort_order, vocabulary) values

(1, 'Greetings and Introductions', 'Hola Colombia — Your First Words',
 'Greet people confidently and introduce yourself in Colombian Spanish',
 'Ser — identity (soy, eres, es)',
 'Meeting someone new at a café in Bogotá',
 1,
 '[
   {"spanish":"Hola","english":"Hello","colombian":"Quiubo / Qué hubo","note":"Most common casual greeting in Colombia"},
   {"spanish":"Buenos días","english":"Good morning","colombian":"Buenos días","note":"Used until midday"},
   {"spanish":"Buenas tardes","english":"Good afternoon","colombian":"Buenas tardes","note":"After noon until evening"},
   {"spanish":"Me llamo...","english":"My name is...","colombian":"Me llamo / Soy...","note":"Both forms used naturally"},
   {"spanish":"Mucho gusto","english":"Nice to meet you","colombian":"Mucho gusto / Un placer","note":"Very warm greeting"},
   {"spanish":"¿Cómo estás?","english":"How are you?","colombian":"¿Qué más? / ¿Cómo vas?","note":"Colombians use usted more than most countries"}
 ]'::jsonb),

(1, 'Pronunciation Basics', 'Speak Like a Costeño — Colombian Sounds',
 'Understand Colombian Spanish pronunciation patterns and key differences',
 'Vowel clarity and rolled R basics',
 'Listening to Colombian radio or podcast clips',
 2,
 '[
   {"spanish":"La erre (R)","english":"The R sound","colombian":"Rolled or tapped","note":"Not as harsh as Spanish R"},
   {"spanish":"El yeísmo","english":"ll/y sound","colombian":"Both ll and y sound like English y","note":"ll and y sound the same in Colombia"},
   {"spanish":"Las vocales","english":"The vowels","colombian":"Pure and clear","note":"Colombian Spanish has very clear, unblurred vowels"}
 ]'::jsonb),

(1, 'Colombian Politeness', 'The Art of Colombian Courtesy',
 'Use polite expressions naturally and understand when to use usted vs tú',
 'Usted vs tú — formal vs informal',
 'Interacting with a shopkeeper in Medellín',
 3,
 '[
   {"spanish":"Por favor","english":"Please","colombian":"Por favor","note":"Always appreciated"},
   {"spanish":"Gracias","english":"Thank you","colombian":"Gracias / Muy amable","note":"Muy amable = very kind, very common"},
   {"spanish":"De nada","english":"You are welcome","colombian":"Con mucho gusto","note":"Con mucho gusto is the Colombian standard"},
   {"spanish":"Perdón","english":"Sorry / Excuse me","colombian":"Perdón / Disculpe","note":"Disculpe is slightly more formal"},
   {"spanish":"Usted","english":"You (formal)","colombian":"Used even with friends in some regions","note":"Especially common in Antioquia and Bogotá"}
 ]'::jsonb),

(1, 'Numbers', 'Uno, Dos, Tres — Count in Colombian Spanish',
 'Count to 100, use numbers in basic situations',
 'Cardinal numbers, agreement with nouns',
 'Paying for something at a mercado in Cali',
 4,
 '[
   {"spanish":"Uno / Una","english":"One","colombian":"Uno / Una","note":"Gender agreement applies"},
   {"spanish":"Diez","english":"Ten","colombian":"Diez","note":"Foundation for teens"},
   {"spanish":"Veinte","english":"Twenty","colombian":"Veinte","note":"Veintidós = 22 etc"},
   {"spanish":"Cien","english":"One hundred","colombian":"Cien / Ciento","note":"Cien = exactly 100, ciento = 101+"},
   {"spanish":"¿Cuánto cuesta?","english":"How much does it cost?","colombian":"¿Cuánto vale?","note":"¿Cuánto vale? is very common in Colombia"}
 ]'::jsonb),

(1, 'Days and Time', 'Time in Colombia — Hora y Días',
 'Tell the time, name the days of the week, make basic time references',
 'Ser for time, days as masculine nouns',
 'Arranging a meeting or coffee catch-up',
 5,
 '[
   {"spanish":"Lunes","english":"Monday","colombian":"Lunes","note":"Days are lowercase in Spanish"},
   {"spanish":"El fin de semana","english":"The weekend","colombian":"El finde","note":"Finde is casual short form"},
   {"spanish":"¿Qué hora es?","english":"What time is it?","colombian":"¿Qué hora es?","note":"Standard across Colombia"},
   {"spanish":"Son las dos","english":"It is two o clock","colombian":"Son las dos","note":"Plural for most times"},
   {"spanish":"Mañana","english":"Tomorrow / Morning","colombian":"Mañana","note":"Context determines meaning"}
 ]'::jsonb),

(1, 'Basic Questions', 'The Magic Five — Colombian Question Words',
 'Ask and understand basic questions confidently',
 'Question words and inversion',
 'Getting information at a tourist office in Cartagena',
 6,
 '[
   {"spanish":"¿Qué?","english":"What?","colombian":"¿Qué? / ¿Qué fue?","note":"¿Qué fue? = what happened? — very Colombian"},
   {"spanish":"¿Dónde?","english":"Where?","colombian":"¿Dónde? / ¿Por dónde?","note":"¿Por dónde? = which way? / whereabouts?"},
   {"spanish":"¿Cuándo?","english":"When?","colombian":"¿Cuándo?","note":"Standard"},
   {"spanish":"¿Cómo?","english":"How?","colombian":"¿Cómo así?","note":"¿Cómo así? = what do you mean? Very Colombian"},
   {"spanish":"¿Por qué?","english":"Why?","colombian":"¿Por qué? / ¿A qué se debe?","note":"More formal variant common in business"}
 ]'::jsonb),

(1, 'Ser and Estar Introduction', 'Two Ways to Say "To Be" in Colombian Spanish',
 'Understand the fundamental ser/estar distinction',
 'Ser (permanent) vs estar (temporary/state/location)',
 'Describing yourself and your current situation',
 7,
 '[
   {"spanish":"Soy australiano","english":"I am Australian (permanent)","colombian":"Soy australiano","note":"Nationality uses ser"},
   {"spanish":"Estoy cansado","english":"I am tired (temporary)","colombian":"Estoy cansado / rendido","note":"Rendido = exhausted, very Colombian"},
   {"spanish":"Estoy en Bogotá","english":"I am in Bogotá (location)","colombian":"Estoy en Bogotá","note":"Location uses estar"},
   {"spanish":"Soy vendedor","english":"I am a salesperson","colombian":"Soy vendedor","note":"Profession uses ser"}
 ]'::jsonb),

(1, 'Gender and Articles', 'El, La, Los, Las — Gender in Spanish',
 'Apply gender to nouns and use articles correctly',
 'Masculine/feminine nouns, definite and indefinite articles',
 'Shopping for items and using correct article forms',
 8,
 '[
   {"spanish":"El hombre","english":"The man","colombian":"El hombre","note":"Masculine definite"},
   {"spanish":"La mujer","english":"The woman","colombian":"La mujer","note":"Feminine definite"},
   {"spanish":"Un café","english":"A coffee","colombian":"Un tinto","note":"In Colombia, black coffee is called tinto"},
   {"spanish":"Una arepa","english":"An arepa","colombian":"Una arepa","note":"Essential Colombian food vocabulary"}
 ]'::jsonb),

(1, 'Basic Verbs', 'Action Words — Your First Colombian Verbs',
 'Use high-frequency verbs in present tense for basic communication',
 'Present tense -ar, -er, -ir verb conjugation',
 'Talking about daily activities with a Colombian flatmate',
 9,
 '[
   {"spanish":"Querer","english":"To want","colombian":"Querer / Querer mucho","note":"Colombians express want warmly — lo quiero means I love it"},
   {"spanish":"Tener","english":"To have","colombian":"Tener","note":"Also used for age: tengo 30 años"},
   {"spanish":"Hablar","english":"To speak","colombian":"Hablar / Charlar","note":"Charlar = to chat, very common"},
   {"spanish":"Ir","english":"To go","colombian":"Ir / Irse","note":"Irse = to leave or go away"},
   {"spanish":"Poder","english":"To be able to / can","colombian":"Poder","note":"¿Me puede ayudar? = Can you help me?"}
 ]'::jsonb),

(1, 'Survival Phrases', 'Get By Anywhere — Essential Colombian Phrases',
 'Handle basic real situations with confidence using key survival phrases',
 'Imperative and polite request forms',
 'First day arriving in Colombia — airport and hotel',
 10,
 '[
   {"spanish":"No entiendo","english":"I do not understand","colombian":"No entiendo / No le entendí","note":"Le entendí is more Colombian"},
   {"spanish":"¿Puede repetir?","english":"Can you repeat that?","colombian":"¿Me repite?","note":"¿Me repite? is very natural in Colombia"},
   {"spanish":"Más despacio por favor","english":"More slowly please","colombian":"Más despacito","note":"Despacito = a little slower, gentler request"},
   {"spanish":"¿Dónde está el baño?","english":"Where is the bathroom?","colombian":"¿Dónde está el baño?","note":"Universal and essential"},
   {"spanish":"Necesito ayuda","english":"I need help","colombian":"Necesito ayuda / ¿Me colabora?","note":"¿Me colabora? = can you help me? Very Colombian"}
 ]'::jsonb),

(1, 'Basic Emotions', 'Feelings in Colombian Spanish',
 'Express basic emotions and understand emotional responses',
 'Estar for emotional states, gustar for preferences',
 'Chatting about how your day went with a Colombian friend',
 11,
 '[
   {"spanish":"Estoy feliz","english":"I am happy","colombian":"Estoy feliz / Estoy contento","note":"Contentísimo = extremely happy"},
   {"spanish":"Estoy triste","english":"I am sad","colombian":"Estoy triste / Estoy mal","note":"Mal covers sad, unwell, and off"},
   {"spanish":"Me da miedo","english":"It scares me / I am afraid","colombian":"Me da miedo / Me aterriza","note":"Me aterriza = it lands on me, freaks me out"},
   {"spanish":"Estoy bien","english":"I am fine","colombian":"Todo bien / Acá bien","note":"Acá bien = all good here, very Colombian"},
   {"spanish":"Me gusta","english":"I like it","colombian":"Me gusta / Me encanta","note":"Me encanta = I love it"}
 ]'::jsonb),

(1, 'Simple Sentence Building', 'Build Your First Colombian Sentences',
 'Construct complete, natural-sounding sentences in Colombian Spanish',
 'Subject-verb-object order, negation with no',
 'Having a full basic conversation from start to finish',
 12,
 '[
   {"spanish":"Yo soy de Australia","english":"I am from Australia","colombian":"Soy de Australia","note":"Subject pronoun optional in Spanish"},
   {"spanish":"No hablo español bien todavía","english":"I do not speak Spanish well yet","colombian":"Todavía no hablo bien el español","note":"Todavía at the front sounds more natural"},
   {"spanish":"Estoy aprendiendo colombiano","english":"I am learning Colombian Spanish","colombian":"Estoy aprendiendo español colombiano","note":"Colombiano here refers to the accent/dialect"},
   {"spanish":"¿Puedo practicar contigo?","english":"Can I practise with you?","colombian":"¿Puedo practicar con vos/usted?","note":"Vos used in some Colombian regions as informal"}
 ]'::jsonb);

-- Level 2-6 placeholder modules (to be expanded in Sprint 2)
insert into public.lessons (level, module_name, lesson_title, lesson_goal, grammar_focus, scenario, sort_order, vocabulary) values
(2, 'Ordering Food', 'At the Table — Cafés and Restaurants', 'Order food and drink confidently in Colombian venues', 'Querer/quisiera for polite orders', 'Lunch at a typical Colombian restaurante corriente', 1, '[]'::jsonb),
(2, 'Directions', 'Getting Around — Colombian Cities', 'Ask for and understand directions in urban Colombia', 'Imperative for directions, prepositions of place', 'Navigating Medellín on foot', 2, '[]'::jsonb),
(3, 'Talking About Yourself', 'Your Story in Spanish', 'Describe yourself, your work, and your life in Colombian Spanish', 'Present tense extended, adjective agreement', 'Meeting people at a coworking space in Bogotá', 1, '[]'::jsonb),
(4, 'Storytelling', 'Tell It Like a Colombian', 'Narrate past events naturally using preterite and imperfect', 'Preterite vs imperfect contrast', 'Telling a friend about your weekend', 1, '[]'::jsonb),
(5, 'Expressing Nuance', 'Beyond Basic — Shades of Meaning', 'Add nuance, qualification, and precision to your Spanish', 'Subjunctive introduction, conditional', 'Discussing opinions on a complex topic', 1, '[]'::jsonb),
(6, 'Business Introductions', 'First Impressions in Colombian Business', 'Make professional introductions and build business rapport in Colombian style', 'Formal register, ser for professional identity', 'Opening a business meeting in Bogotá', 1, '[]'::jsonb);
