-- ============================================================
-- Atlas Español — Curriculum Seed Levels 2–6
-- Sprint 2: Expanded Curriculum Library
-- ============================================================

-- ============================================================
-- LEVEL 2: Survival Spanish (CEFR A1)
-- ============================================================

insert into public.lessons (level, module_name, lesson_title, lesson_goal, grammar_focus, scenario, sort_order, vocabulary) values

(2, 'Ordering Food', 'La Comida Colombiana — Eat Like a Local',
 'Order food and drinks confidently at a Colombian restaurant or café',
 'Quiero + infinitive, indefinite articles (un/una)',
 'Having lunch at a small restaurant (restaurante) in Bogotá',
 1,
 '[
   {"spanish":"El menú","english":"The menu","colombian":"La carta / el menú","note":"Ask: ¿Me puede traer la carta?"},
   {"spanish":"Quiero...","english":"I want...","colombian":"Quisiera... (more polite)","note":"Quisiera is softer and more polite"},
   {"spanish":"La bandeja paisa","english":"Typical Colombian platter","colombian":"Bandeja paisa","note":"Rice, beans, chicharrón, egg, avocado"},
   {"spanish":"El aguardiente","english":"Anise spirit (Colombian drink)","colombian":"El guaro","note":"The national drink — very Colombian"},
   {"spanish":"La cuenta, por favor","english":"The bill, please","colombian":"¿Me regala la cuenta?","note":"Me regala is very Colombian — means please give me"},
   {"spanish":"¿Cuánto es?","english":"How much is it?","colombian":"¿A cuánto sale?","note":"Colombian way to ask the price"}
 ]'::jsonb),

(2, 'Cafes and Coffee', 'El Tinto — Colombian Coffee Culture',
 'Order coffee and understand Colombian café vocabulary',
 'Servir + indirect object pronouns',
 'Stopping at a café for the morning tinto in Medellín',
 2,
 '[
   {"spanish":"El tinto","english":"Black coffee (small)","colombian":"El tinto","note":"In Colombia tinto means black coffee, not red wine"},
   {"spanish":"El café con leche","english":"Coffee with milk","colombian":"El perico","note":"A perico is a small coffee with milk"},
   {"spanish":"¿Me sirve un tinto?","english":"Can you serve me a black coffee?","colombian":"¿Me regala un tinto?","note":"Me regala = please give me (very common)"},
   {"spanish":"Caliente","english":"Hot","colombian":"Bien caliente","note":"Colombians love their coffee very hot"},
   {"spanish":"Endulzado","english":"Sweetened","colombian":"¿Lo quiere dulce?","note":"They will often ask if you want sugar"}
 ]'::jsonb),

(2, 'Directions', '¿Dónde Queda? — Getting Around',
 'Ask for and understand basic directions in Colombian Spanish',
 'Quedar for location (Colombian), imperatives for directions',
 'Asking how to get to the nearest metro station in Medellín',
 3,
 '[
   {"spanish":"¿Dónde queda...?","english":"Where is...?","colombian":"¿Dónde queda? (not ¿dónde está?)","note":"Colombians use quedar for location more than estar"},
   {"spanish":"A la derecha","english":"To the right","colombian":"A la derecha","note":"Standard across Colombia"},
   {"spanish":"A la izquierda","english":"To the left","colombian":"A la izquierda","note":"Standard across Colombia"},
   {"spanish":"Derecho","english":"Straight ahead","colombian":"Derecho / recto","note":"Colombians often say siga derecho"},
   {"spanish":"A dos cuadras","english":"Two blocks away","colombian":"A dos cuadras","note":"Cuadra = city block"},
   {"spanish":"El semáforo","english":"The traffic light","colombian":"El semáforo","note":"Common landmark for directions"}
 ]'::jsonb),

(2, 'Transport', 'En el Metro — Getting Around Colombia',
 'Use public transport and taxis confidently',
 'Verb ir + transport prepositions, a/en',
 'Taking the Transmilenio in Bogotá or a taxi in any city',
 4,
 '[
   {"spanish":"Un taxi, por favor","english":"A taxi, please","colombian":"¿Me consigue un taxi?","note":"Literally: can you get me a taxi?"},
   {"spanish":"¿Cuánto vale hasta...?","english":"How much to get to...?","colombian":"¿Cuánto me cobra hasta...?","note":"Me cobra = how much do you charge"},
   {"spanish":"El bus","english":"The bus","colombian":"La buseta / el bus","note":"Buseta is a smaller minibus very common in Colombia"},
   {"spanish":"La parada","english":"The bus stop","colombian":"La parada","note":"Where you wait for the bus"},
   {"spanish":"El metro","english":"The metro","colombian":"El metro (Medellín) / TransMilenio (Bogotá)","note":"TransMilenio is Bogotá''s BRT system"}
 ]'::jsonb),

(2, 'Accommodation', 'En el Hotel — Checking In',
 'Check in and out of accommodation and ask for what you need',
 'Tener (to have) for requests, hay for there is/are',
 'Checking into a hostel or hotel in Cartagena',
 5,
 '[
   {"spanish":"Tengo una reserva","english":"I have a reservation","colombian":"Tengo una reserva / Hice una reserva","note":"Both forms are used"},
   {"spanish":"La habitación","english":"The room","colombian":"La habitación / el cuarto","note":"Cuarto is very common informally"},
   {"spanish":"¿Hay WiFi?","english":"Is there WiFi?","colombian":"¿Hay WiFi? ¿Tiene clave?","note":"Clave = password — always needed!"},
   {"spanish":"El desayuno","english":"Breakfast","colombian":"¿El desayuno está incluido?","note":"Important to ask in Colombian hotels"},
   {"spanish":"El baño compartido","english":"Shared bathroom","colombian":"El baño compartido / el baño privado","note":"Shared vs private bathroom"}
 ]'::jsonb),

(2, 'Shopping', 'De Compras — Shopping Colombian Style',
 'Shop for clothes, food, and goods in markets and stores',
 'Costar (to cost), numbers over 100, adjective agreement',
 'Shopping in the Mercado de las Pulgas in Bogotá',
 6,
 '[
   {"spanish":"¿Cuánto cuesta?","english":"How much does it cost?","colombian":"¿A cuánto está? / ¿Cuánto vale?","note":"Vale is very common in Colombia"},
   {"spanish":"¿Tiene en otra talla?","english":"Do you have it in another size?","colombian":"¿Tiene en otra talla?","note":"Talla = clothing size"},
   {"spanish":"¿Me puede hacer una rebaja?","english":"Can you give me a discount?","colombian":"¿Me regala un descuento?","note":"Bargaining is normal in markets"},
   {"spanish":"Está muy caro","english":"It''s very expensive","colombian":"Está muy caro / eso está muy fufurufo","note":"Fufurufo = overpriced, too fancy"},
   {"spanish":"Me lo llevo","english":"I''ll take it","colombian":"Me lo llevo","note":"Standard across all Spanish"}
 ]'::jsonb),

(2, 'Health Basics', 'No Me Siento Bien — Basic Health',
 'Describe how you feel and handle basic health situations',
 'Doler (to hurt) — indirect object, sentirse + adjective',
 'Going to a farmacia or telling someone you feel unwell',
 7,
 '[
   {"spanish":"No me siento bien","english":"I don''t feel well","colombian":"No estoy bien / me siento mal","note":"Both are natural in Colombia"},
   {"spanish":"Me duele la cabeza","english":"My head hurts","colombian":"Tengo un dolor de cabeza","note":"Both forms are used"},
   {"spanish":"La farmacia","english":"The pharmacy","colombian":"La droguería","note":"In Colombia, pharmacies are called droguerías"},
   {"spanish":"Un médico","english":"A doctor","colombian":"Un médico / un doctor","note":"Doctor is used informally too"},
   {"spanish":"¿Tiene algo para...?","english":"Do you have something for...?","colombian":"¿Tiene algo para el dolor?","note":"Useful phrase in the droguería"}
 ]'::jsonb),

(2, 'Daily Routines', 'El Día a Día — Everyday Life',
 'Talk about your daily routine and common activities',
 'Reflexive verbs (levantarse, bañarse, acostarse)',
 'Describing your typical day to your Colombian host family',
 8,
 '[
   {"spanish":"Me levanto","english":"I get up","colombian":"Me levanto / me paro","note":"Paro is more Colombian"},
   {"spanish":"Me baño","english":"I shower","colombian":"Me baño / me ducho","note":"Bañarse is more common in Colombia"},
   {"spanish":"Desayunar","english":"To eat breakfast","colombian":"Desayunar / tomar el desayuno","note":"Tomar is used for meals in Colombia"},
   {"spanish":"Trabajar","english":"To work","colombian":"Trabajar / chambear","note":"Chambear is Colombian slang for working"},
   {"spanish":"Acostarse","english":"To go to bed","colombian":"Acostarme / echarme","note":"Echarme is very Colombian informal"}
 ]'::jsonb),

(2, 'Weather', 'El Clima — Colombian Weather',
 'Describe the weather and understand Colombian climate vocabulary',
 'Hacer + weather, estar + weather conditions',
 'Chatting about the weather in Bogotá, which changes all day',
 9,
 '[
   {"spanish":"¿Cómo está el clima?","english":"What''s the weather like?","colombian":"¿Cómo está el clima? / ¿Hace frío?","note":"Climate varies hugely in Colombia by altitude"},
   {"spanish":"Está lloviendo","english":"It''s raining","colombian":"Está lloviendo / está cayendo el agua","note":"Bogotá rains a lot"},
   {"spanish":"Hace frío","english":"It''s cold","colombian":"Hace frío / está helado","note":"Bogotá at 2600m is always cool"},
   {"spanish":"Hace calor","english":"It''s hot","colombian":"Hace calor / está caloroso","note":"Coast cities like Cartagena are always hot"},
   {"spanish":"El aguacero","english":"Heavy downpour","colombian":"El aguacero","note":"Common in Bogotá — bring an umbrella"}
 ]'::jsonb),

(2, 'Plans and Invitations', '¿Salimos? — Making Plans',
 'Invite someone to do something and respond to invitations',
 'Ir a + infinitive (going to), querer + infinitive',
 'Inviting a new Colombian friend to go out in Cali',
 10,
 '[
   {"spanish":"¿Quieres salir?","english":"Do you want to go out?","colombian":"¿Salimos? / ¿Vamos?","note":"Colombians often use the first person plural as invitation"},
   {"spanish":"¿A qué hora?","english":"What time?","colombian":"¿A qué horas?","note":"Note: Colombians say horas (plural) for what time"},
   {"spanish":"¡Dale!","english":"Let''s go! / Sure!","colombian":"¡Dale! / ¡Claro!","note":"Dale is very Colombian for agreement"},
   {"spanish":"Hoy no puedo","english":"I can''t today","colombian":"Hoy no puedo / hoy no me queda bien","note":"No me queda bien = it doesn''t work for me"},
   {"spanish":"¿Dónde nos encontramos?","english":"Where do we meet?","colombian":"¿Dónde nos cuadramos?","note":"Cuadrarse = to arrange to meet (very Colombian)"}
 ]'::jsonb),

(2, 'Common Colombian Phrases', 'El Español Colombiano — Sounding Local',
 'Use common Colombian expressions to sound natural and connect better',
 'Fixed phrases and exclamations',
 'Casual conversation with a Colombian in any situation',
 11,
 '[
   {"spanish":"¡Qué bacano!","english":"How cool! / Awesome!","colombian":"¡Qué bacano! / ¡Qué chévere!","note":"Bacano is the most Colombian expression for cool"},
   {"spanish":"Parce / parcero","english":"Friend / mate","colombian":"Parce / parcero","note":"Medellín slang that spread across Colombia"},
   {"spanish":"¿Qué más?","english":"What''s up? / How are things?","colombian":"¿Qué más? ¿Bien o qué?","note":"Very common greeting — more casual than ¿cómo estás?"},
   {"spanish":"Ojo","english":"Watch out / Be careful","colombian":"Ojo / pilas","note":"Pilas (batteries) = be alert, be careful"},
   {"spanish":"Chévere","english":"Cool / Great","colombian":"Chévere","note":"Used across Colombia and Latin America"},
   {"spanish":"Listo","english":"Ready / OK / Got it","colombian":"Listo","note":"One of the most used words in Colombia for agreement"}
 ]'::jsonb),

(2, 'Emergencies', 'En Caso de Emergencia — Basic Emergency Spanish',
 'Handle basic emergency situations and ask for help',
 'Imperative mood (call, help), needs expressions',
 'Dealing with a stolen bag or medical situation while travelling',
 12,
 '[
   {"spanish":"¡Auxilio!","english":"Help!","colombian":"¡Auxilio! / ¡Ayuda!","note":"Auxilio is more Colombian than ayuda in emergencies"},
   {"spanish":"Llame a la policía","english":"Call the police","colombian":"Llame a la policía / al GAULA","note":"GAULA is the anti-kidnapping unit in Colombia"},
   {"spanish":"Me robaron","english":"I was robbed","colombian":"Me robaron / me mochilaron","note":"Mochilar = to rob someone (Colombian slang)"},
   {"spanish":"Necesito un médico","english":"I need a doctor","colombian":"Necesito un médico / estoy mal","note":"Also say: Estoy muy mal"},
   {"spanish":"El hospital","english":"The hospital","colombian":"La clínica / el hospital","note":"Clínica refers to private clinics — often better"}
 ]'::jsonb);

-- ============================================================
-- LEVEL 3: Social Spanish (CEFR A2)
-- ============================================================

insert into public.lessons (level, module_name, lesson_title, lesson_goal, grammar_focus, scenario, sort_order, vocabulary) values

(3, 'Talking About Yourself', 'Cuéntame de Ti — Talking About Yourself',
 'Describe your life, background, and personality in natural Colombian Spanish',
 'Ser vs estar for descriptions, present tense review',
 'Getting to know a Colombian at a social event in Bogotá',
 1,
 '[
   {"spanish":"Soy de...","english":"I am from...","colombian":"Soy de... / Vengo de...","note":"Both work naturally"},
   {"spanish":"Trabajo en...","english":"I work in...","colombian":"Trabajo en... / Me dedico a...","note":"Me dedico a = I dedicate myself to"},
   {"spanish":"Me gusta...","english":"I like...","colombian":"Me gusta / me encanta","note":"Encanta is stronger — I love it"},
   {"spanish":"Llevo viviendo aquí...","english":"I''ve been living here for...","colombian":"Llevo... viviendo aquí","note":"Colombian way to say duration"},
   {"spanish":"¿A qué te dedicas?","english":"What do you do for work?","colombian":"¿A qué te dedicas? / ¿En qué trabajás?","note":"More natural than ¿qué haces?"}
 ]'::jsonb),

(3, 'Family and Friends', 'La Familia — Family Vocabulary',
 'Talk about family relationships and describe people you know',
 'Possessive adjectives (mi, tu, su, nuestro), physical descriptions',
 'Showing photos of your family to a Colombian friend',
 2,
 '[
   {"spanish":"Mi familia","english":"My family","colombian":"Mi familia / los míos","note":"Los míos = my people (family)"},
   {"spanish":"Mi novio / novia","english":"My boyfriend / girlfriend","colombian":"Mi novio / novia / mi churro","note":"Churro = boyfriend/girlfriend (Colombian slang)"},
   {"spanish":"¿Tienes hermanos?","english":"Do you have siblings?","colombian":"¿Tienes hermanos?","note":"Very common conversation starter"},
   {"spanish":"El/la vecino/a","english":"Neighbour","colombian":"El/la vecino/a / el parce de al lado","note":"Parce de al lado = neighbour friend"},
   {"spanish":"Llevarse bien","english":"To get along well","colombian":"Nos llevamos muy bien","note":"Key phrase for talking about relationships"}
 ]'::jsonb),

(3, 'Dating Messages', 'Mensajes de Amor — Texting in Colombian Spanish',
 'Write natural dating messages and express interest in Colombian Spanish',
 'Present progressive, diminutives (-ito/-ita)',
 'Texting someone you met on a night out in Medellín',
 3,
 '[
   {"spanish":"Me gustas","english":"I like you (romantically)","colombian":"Me gustas mucho / me caíste muy bien","note":"Me caíste bien = you made a great impression on me"},
   {"spanish":"¿Qué estás haciendo?","english":"What are you doing?","colombian":"¿Qué estás haciendo? / ¿Qué haces?","note":"Common opening to a conversation"},
   {"spanish":"Eres muy bonita/o","english":"You are very beautiful","colombian":"Estás muy bonita/o / qué linda/o","note":"Note: estar is often used for attractive"},
   {"spanish":"Me tienes pensando en ti","english":"I''ve been thinking about you","colombian":"No me puedes sacar de la cabeza","note":"You can''t get out of my head"},
   {"spanish":"¿Nos vemos mañana?","english":"Shall we meet tomorrow?","colombian":"¿Nos cuadramos mañana?","note":"Cuadrarse = to arrange to meet"}
 ]'::jsonb),

(3, 'Feelings and Reassurance', 'Así Me Siento — Expressing Emotions',
 'Express emotions clearly and reassure someone in Colombian Spanish',
 'Estar + emotions, indirect object for feelings',
 'Comforting a Colombian friend who is going through a difficult time',
 4,
 '[
   {"spanish":"Estoy feliz","english":"I am happy","colombian":"Estoy feliz / estoy contento/a","note":"Contento is slightly softer than feliz"},
   {"spanish":"Estoy triste","english":"I am sad","colombian":"Estoy triste / estoy maluco/a","note":"Maluco = feeling bad (Colombian)"},
   {"spanish":"¡Ánimo!","english":"Cheer up! / Come on!","colombian":"¡Ánimo! / ¡Échele ganas!","note":"Échele ganas = give it your all, keep going"},
   {"spanish":"Te entiendo","english":"I understand you","colombian":"Te entiendo / te capto","note":"Captar = to get it, to understand"},
   {"spanish":"Todo va a estar bien","english":"Everything will be fine","colombian":"Todo va a quedar bien","note":"Quedar bien = to work out well"}
 ]'::jsonb),

(3, 'Making Plans', '¿Qué Hacemos? — Planning Activities',
 'Make and discuss social plans in natural Colombian Spanish',
 'Ir a + infinitive, poder + infinitive, suggestions with ¿qué tal si...?',
 'Planning a weekend trip to the coffee region (Eje Cafetero)',
 5,
 '[
   {"spanish":"¿Qué hacemos este fin de semana?","english":"What shall we do this weekend?","colombian":"¿Qué hacemos este fin? / ¿Cuál es el plan?","note":"Cuál es el plan = what''s the plan"},
   {"spanish":"¿Qué tal si vamos a...?","english":"What if we go to...?","colombian":"¿Qué tal si vamos? / ¿Y si nos vamos?","note":"Nos vamos adds a sense of going together"},
   {"spanish":"Tengo ganas de...","english":"I feel like...","colombian":"Tengo ganas de / me provoca...","note":"Me provoca = I feel like (very Colombian)"},
   {"spanish":"¿Tienes planes?","english":"Do you have plans?","colombian":"¿Tienes algún plan? / ¿Qué tienes?","note":"Very casual way to check availability"},
   {"spanish":"Vamos a...","english":"Let''s go to...","colombian":"Listo, vamos / ¡dale!","note":"Dale confirms the plan energetically"}
 ]'::jsonb),

(3, 'Compliments', '¡Qué Lindo! — Giving Compliments',
 'Give genuine compliments in the Colombian style — warm and expressive',
 'Ser vs estar for compliments, exclamations with qué + adjective',
 'Meeting a Colombian''s family for the first time',
 6,
 '[
   {"spanish":"¡Qué bacano!","english":"How cool / awesome!","colombian":"¡Qué bacano! / ¡Qué chimba!","note":"Chimba is Medellín slang, very strong positive"},
   {"spanish":"Eres muy amable","english":"You are very kind","colombian":"Muy amable / qué gentil","note":"Muy amable is a standard polite compliment"},
   {"spanish":"¡Qué bien te queda!","english":"That looks great on you!","colombian":"¡Qué bien te queda! / ¡Te ves muy bien!","note":"Te ves bien = you look good"},
   {"spanish":"Hablas muy bien español","english":"You speak Spanish very well","colombian":"Hablas muy bien / qué buen español","note":"Colombians genuinely appreciate the effort"},
   {"spanish":"¡Qué talento!","english":"What talent!","colombian":"¡Qué talento! / ¡Eres un duro!","note":"Un duro/a = an expert, someone very good at something"}
 ]'::jsonb),

(3, 'Opinions', 'En Mi Opinión — Sharing Your Views',
 'Express opinions, agree, disagree, and discuss topics in basic Colombian Spanish',
 'Creer que, pensar que, me parece que for expressing opinion',
 'Discussing a Colombian TV show or football match',
 7,
 '[
   {"spanish":"En mi opinión...","english":"In my opinion...","colombian":"En mi opinión / yo creo que","note":"Colombians often start with yo creo"},
   {"spanish":"Me parece que...","english":"It seems to me that...","colombian":"Me parece que / pienso que","note":"Me parece is very commonly used"},
   {"spanish":"Estoy de acuerdo","english":"I agree","colombian":"Estoy de acuerdo / tienes razón","note":"Tienes razón = you''re right"},
   {"spanish":"No estoy de acuerdo","english":"I disagree","colombian":"No estoy de acuerdo / no creo","note":"Can soften with pero entiendo tu punto"},
   {"spanish":"¿Tú qué piensas?","english":"What do you think?","colombian":"¿Y tú qué piensas? / ¿Y tú qué?","note":"Very common for inviting an opinion"}
 ]'::jsonb),

(3, 'Past Experiences', 'Lo Que Pasó — Talking About the Past',
 'Talk about past experiences and events using the preterite tense',
 'Preterite tense (pretérito indefinido) — regular and common irregular verbs',
 'Telling a Colombian friend about your travels in Colombia',
 8,
 '[
   {"spanish":"Fui a...","english":"I went to...","colombian":"Fui / me fui a...","note":"Me fui suggests a longer trip or journey"},
   {"spanish":"Comí...","english":"I ate...","colombian":"Comí / tomé...","note":"Tomar is used for food/drink in Colombia"},
   {"spanish":"Conocí a...","english":"I met...","colombian":"Conocí a... / me encontré con...","note":"Conocer = to meet for first time"},
   {"spanish":"Me encantó","english":"I loved it","colombian":"Me encantó / quedé enamorado/a","note":"Quedé enamorado = I fell in love with it"},
   {"spanish":"Fue increíble","english":"It was incredible","colombian":"Fue increíble / fue una experiencia","note":"Colombians are very expressive about experiences"}
 ]'::jsonb),

(3, 'Voice Notes', 'El Audio — Sending Voice Notes',
 'Communicate naturally in voice notes and audio messages — a huge part of Colombian communication',
 'Informal register, ellipsis, spoken Spanish patterns',
 'Sending a voice note to a Colombian friend explaining why you''re late',
 9,
 '[
   {"spanish":"Te mando un audio","english":"I''m sending you an audio","colombian":"Te mando un audio / voz","note":"Colombians send voice notes constantly"},
   {"spanish":"Oye...","english":"Hey...","colombian":"Oye / mirá / mira","note":"Mirá is Medellín; mira is more general"},
   {"spanish":"Es que...","english":"The thing is...","colombian":"Es que... / lo que pasa es que...","note":"Very common filler when explaining"},
   {"spanish":"Ya voy","english":"I''m on my way / coming now","colombian":"Ya voy / ya salgo","note":"Ya salgo = I''m just leaving"},
   {"spanish":"Listo, hasta luego","english":"OK, bye","colombian":"Listo, cuídate / chao","note":"Chao is the most common goodbye in Colombia"}
 ]'::jsonb),

(3, 'Colombian Social Etiquette', 'Así Somos — Colombian Culture',
 'Understand Colombian social norms to navigate relationships naturally',
 'Cultural vocabulary, social phrases',
 'Being invited to a Colombian home for a meal',
 10,
 '[
   {"spanish":"Bienvenido/a","english":"Welcome","colombian":"¡Bienvenido! ¡Qué pena la espera!","note":"Qué pena la espera = sorry to keep you waiting"},
   {"spanish":"¿Qué le sirvo?","english":"What can I serve you?","colombian":"¿Qué le sirvo? / ¿Le ofrezco algo?","note":"Very common hospitality phrase"},
   {"spanish":"Provecho","english":"Enjoy your meal","colombian":"Buen provecho","note":"Always said before eating in Colombia"},
   {"spanish":"¡Qué pena!","english":"I''m so sorry / How embarrassing","colombian":"¡Qué pena! / Disculpe la molestia","note":"Qué pena is extremely common — means sorry for bothering"},
   {"spanish":"Con mucho gusto","english":"With pleasure / You''re welcome","colombian":"Con mucho gusto","note":"The Colombian way to say de nada"}
 ]'::jsonb),

(3, 'Cancelling Politely', 'Lo Siento, No Puedo — Politely Declining',
 'Cancel plans and apologise politely without sounding rude in Colombian culture',
 'Poder (can/unable to), apologies with disculpa/qué pena',
 'Having to cancel plans with a Colombian friend last minute',
 11,
 '[
   {"spanish":"No puedo ir","english":"I can''t go","colombian":"No puedo / no me queda","note":"No me queda = it doesn''t work for me"},
   {"spanish":"Lo siento mucho","english":"I''m really sorry","colombian":"Qué pena / mil disculpas","note":"Mil disculpas = a thousand apologies — very Colombian"},
   {"spanish":"¿Podemos reagendar?","english":"Can we reschedule?","colombian":"¿Lo cuadramos para otro día?","note":"Cuadramos para otro día = let''s arrange for another day"},
   {"spanish":"Surgió algo","english":"Something came up","colombian":"Surgió algo / me salió algo","note":"Me salió algo = something came up for me"},
   {"spanish":"¿Quedamos pendientes?","english":"Shall we leave it pending?","colombian":"¿Quedamos pendientes?","note":"Very Colombian way to leave plans open"}
 ]'::jsonb),

(3, 'Boundaries', 'Mis Límites — Setting Boundaries',
 'Express personal boundaries clearly and confidently in Colombian Spanish',
 'Me incomoda, no me gusta, prefiero constructions',
 'Telling someone what you are and are not comfortable with',
 12,
 '[
   {"spanish":"No me gusta eso","english":"I don''t like that","colombian":"No me gusta / eso no me cuadra","note":"No me cuadra = that doesn''t work for me"},
   {"spanish":"Me incomoda","english":"It makes me uncomfortable","colombian":"Me incomoda / me molesta","note":"Direct but respectful"},
   {"spanish":"Prefiero que no","english":"I''d prefer not","colombian":"Prefiero que no / mejor no","note":"Mejor no is a soft, natural way to decline"},
   {"spanish":"Necesito espacio","english":"I need space","colombian":"Necesito mi espacio / dame un tiempo","note":"Dame un tiempo = give me some time"},
   {"spanish":"Respetá eso, por favor","english":"Please respect that","colombian":"Respetá / respétame eso","note":"Direct but appropriate when boundaries are crossed"}
 ]'::jsonb);

-- ============================================================
-- LEVEL 4: Independent Speaker (CEFR B1)
-- ============================================================

insert into public.lessons (level, module_name, lesson_title, lesson_goal, grammar_focus, scenario, sort_order, vocabulary) values

(4, 'Storytelling', 'Cuéntame — Telling Stories in Spanish',
 'Tell stories and anecdotes naturally using past and imperfect tenses',
 'Preterite vs imperfect contrast — completed vs ongoing past',
 'Telling a funny or interesting story from your travels in Colombia',
 1,
 '[
   {"spanish":"Resulta que...","english":"As it turns out... / So the thing is...","colombian":"Resulta que... / lo que pasó fue...","note":"Classic story opener in Colombian Spanish"},
   {"spanish":"De repente","english":"Suddenly","colombian":"De repente / de un momento a otro","note":"Adds drama to a story"},
   {"spanish":"Al final","english":"In the end","colombian":"Al final / al fin y al cabo","note":"Al fin y al cabo = at the end of the day"},
   {"spanish":"Estaba + gerundio","english":"Was + -ing (imperfect)","colombian":"Estaba caminando / hablando...","note":"Imperfect for what was happening"},
   {"spanish":"¿Y luego qué?","english":"And then what happened?","colombian":"¿Y luego? / ¿y después?","note":"Shows genuine interest in the story"}
 ]'::jsonb),

(4, 'Giving Advice', 'Te Aconsejo — Giving and Receiving Advice',
 'Give practical advice and recommendations using subjunctive and conditional',
 'Te recomiendo que + subjunctive, deberías + infinitive',
 'Advising a friend on a work or personal problem',
 2,
 '[
   {"spanish":"Te recomiendo que...","english":"I recommend that you...","colombian":"Te recomiendo que / te aconsejo que","note":"Followed by subjunctive"},
   {"spanish":"Deberías...","english":"You should...","colombian":"Deberías / lo que debes hacer es","note":"Lo que debes hacer es = what you should do is"},
   {"spanish":"Si yo fuera tú...","english":"If I were you...","colombian":"Si yo estuviera en tu lugar / si yo fuera tú","note":"Very natural advice-giving phrase"},
   {"spanish":"¿Has pensado en...?","english":"Have you thought about...?","colombian":"¿Has pensado en? / ¿Qué tal si intentás?","note":"Gentle suggestion form"},
   {"spanish":"Lo mejor sería...","english":"The best thing would be...","colombian":"Lo mejor sería / lo ideal sería","note":"Polite way to advise strongly"}
 ]'::jsonb),

(4, 'Handling Conflict', 'Hay un Problema — Handling Difficult Conversations',
 'Navigate conflict, misunderstandings, and difficult conversations calmly',
 'Conditional tense for softening, subjunctive for wishes',
 'Resolving a misunderstanding with a Colombian colleague or friend',
 3,
 '[
   {"spanish":"Entiendo tu punto pero...","english":"I understand your point but...","colombian":"Te entiendo, pero... / te capto, sin embargo...","note":"Capto = I get it (Colombian)"},
   {"spanish":"Me parece que hay una confusión","english":"I think there''s a confusion","colombian":"Creo que hubo un malentendido","note":"Hubo = there was (preterite of haber)"},
   {"spanish":"¿Podemos hablar?","english":"Can we talk?","colombian":"¿Podemos hablar? / ¿Charlamos?","note":"Charlar = to chat, slightly softer"},
   {"spanish":"No fue mi intención","english":"It wasn''t my intention","colombian":"No fue mi intención / no quise ofenderte","note":"Quise = I wanted/intended"},
   {"spanish":"Busquemos una solución","english":"Let''s find a solution","colombian":"Busquemos cómo resolverlo","note":"Resolverlo = to resolve it"}
 ]'::jsonb),

(4, 'Workplace Conversations', 'En el Trabajo — Professional Colombian Spanish',
 'Navigate basic workplace conversations and professional situations in Spanish',
 'Formal register, impersonal constructions, conditional for requests',
 'Attending a meeting with Colombian colleagues or clients',
 4,
 '[
   {"spanish":"Quisiera presentar...","english":"I would like to present...","colombian":"Quisiera presentar / les quiero compartir","note":"Compartir = to share (information) — very used in work"},
   {"spanish":"¿Me podría explicar?","english":"Could you explain to me?","colombian":"¿Me podría explicar? / ¿Me ayuda a entender?","note":"Me ayuda a entender = help me understand"},
   {"spanish":"Voy a proceder con...","english":"I''m going to proceed with...","colombian":"Voy a proceder / voy a gestionar","note":"Gestionar = to manage/handle"},
   {"spanish":"Quedamos de acuerdo","english":"We agreed / We''re in agreement","colombian":"Quedamos de acuerdo / quedamos en eso","note":"Quedamos en eso = we left it at that"},
   {"spanish":"Haré el seguimiento","english":"I will follow up","colombian":"Hago el seguimiento / le doy seguimiento","note":"Very common in Colombian business"}
 ]'::jsonb),

(4, 'Colombian Slang Awareness', 'El Parlache — Colombian Street Slang',
 'Understand and use common Colombian informal language without sounding awkward',
 'Slang vocabulary, register awareness',
 'Hanging out with young Colombians in Medellín or Bogotá',
 5,
 '[
   {"spanish":"Chimba","english":"Awesome / amazing (Medellín)","colombian":"¡Qué chimba! / eso es una chimba","note":"Strong Medellín expression — avoid in formal settings"},
   {"spanish":"Gonorrea (friendly use)","english":"Expression of surprise/affection (informal)","colombian":"Used between close friends only","note":"Like some English profanity used affectionately — context critical"},
   {"spanish":"Marica","english":"Dude / mate (informal between friends)","colombian":"Ey marica / oiga marica","note":"Between friends only — not offensive in this context"},
   {"spanish":"Tener mala leche","english":"To be unlucky / have bad luck","colombian":"¡Qué mala leche!","note":"Mala leche = bad luck"},
   {"spanish":"Hacer una vuelta","english":"To do an errand / to fix something","colombian":"Tengo que hacer una vuelta","note":"Vuelta = errand or business to take care of"}
 ]'::jsonb),

(4, 'Asking Deeper Questions', 'Más Profundo — Deeper Conversations',
 'Have more meaningful conversations and explore topics with depth',
 'Subjunctive for uncertainty and doubt, complex questions',
 'Having a genuine conversation about life and goals with a Colombian',
 6,
 '[
   {"spanish":"¿Cómo te has sentido últimamente?","english":"How have you been feeling lately?","colombian":"¿Cómo has estado? / ¿Cómo te ha ido?","note":"More caring and genuine than ¿cómo estás?"},
   {"spanish":"¿Qué es lo que más valoras en la vida?","english":"What do you value most in life?","colombian":"¿Qué es lo más importante para ti?","note":"Opens meaningful conversation"},
   {"spanish":"¿Cómo ves tu futuro?","english":"How do you see your future?","colombian":"¿Cómo te imaginas tu futuro?","note":"Imaginas adds warmth"},
   {"spanish":"¿Qué te apasiona?","english":"What are you passionate about?","colombian":"¿Qué te apasiona? / ¿Qué te mueve?","note":"Qué te mueve = what moves/drives you"},
   {"spanish":"Cuéntame más","english":"Tell me more","colombian":"Cuéntame más / ¿y eso cómo así?","note":"¿Cómo así? = how so? / explain more"}
 ]'::jsonb),

(4, 'Future Plans', 'El Futuro — Talking About Plans',
 'Discuss future plans, ambitions and goals using future tense and expressions',
 'Futuro simple, ir a + infinitive, esperar + infinitive',
 'Discussing career and life plans with a Colombian mentor',
 7,
 '[
   {"spanish":"Espero poder...","english":"I hope to be able to...","colombian":"Espero poder / ojalá pueda","note":"Ojalá (from Arabic inshallah) = hopefully"},
   {"spanish":"Dentro de un año","english":"In a year","colombian":"Dentro de un año / al año","note":"Temporal expressions for future plans"},
   {"spanish":"Mi meta es...","english":"My goal is...","colombian":"Mi meta es / lo que quiero lograr es","note":"Lograr = to achieve"},
   {"spanish":"Estoy trabajando para...","english":"I''m working towards...","colombian":"Estoy trabajando para / estoy construyendo","note":"Construyendo = building (powerful metaphor)"},
   {"spanish":"¿Y cuáles son tus planes?","english":"And what are your plans?","colombian":"¿Y vos qué tenés planeado?","note":"Vos is used in some Colombian regions"}
 ]'::jsonb),

(4, 'Explaining Problems', 'Tengo un Problema — Problem Solving in Spanish',
 'Explain problems clearly and seek help or solutions effectively',
 'Subjunctive after quiero que, necesito que, es importante que',
 'Explaining a problem to a Colombian landlord, boss, or official',
 8,
 '[
   {"spanish":"Tengo un inconveniente","english":"I have an issue / problem","colombian":"Tengo un inconveniente / hay una situación","note":"Inconveniente sounds more professional than problema"},
   {"spanish":"Lo que pasa es que...","english":"What''s happening is that...","colombian":"Lo que pasa es que / lo que sucede es que","note":"Very common way to explain a situation"},
   {"spanish":"Necesito que me ayude con...","english":"I need you to help me with...","colombian":"Necesito que me ayude con / me colabora con","note":"Me colabora = help me (Colombian service expression)"},
   {"spanish":"¿Cómo podemos resolver esto?","english":"How can we resolve this?","colombian":"¿Cómo lo resolvemos? / ¿Cómo hacemos?","note":"¿Cómo hacemos? = what do we do?"},
   {"spanish":"Agradezco su ayuda","english":"I appreciate your help","colombian":"Le agradezco mucho / muy amable","note":"Muy amable = very kind (essential Colombian phrase)"}
 ]'::jsonb),

(4, 'Travel Problem Solving', 'Problemas de Viaje — Travel Challenges',
 'Handle real travel problems — lost bags, missed connections, wrong hotel',
 'Preterite for what happened, conditional for requests',
 'Your bag was lost at El Dorado airport, Bogotá',
 9,
 '[
   {"spanish":"Perdí mi maleta","english":"I lost my bag","colombian":"Perdí mi maleta / me extraviaron el equipaje","note":"Extraviaron = they misplaced (more formal)"},
   {"spanish":"¿Puede ayudarme?","english":"Can you help me?","colombian":"¿Me colabora? / ¿Me puede ayudar?","note":"Me colabora is the Colombian service way to ask"},
   {"spanish":"Necesito hablar con el encargado","english":"I need to speak to the manager","colombian":"Necesito hablar con el encargado / el responsable","note":"Encargado = person in charge"},
   {"spanish":"¿Cuánto tiempo va a demorar?","english":"How long is it going to take?","colombian":"¿Cuánto demora? / ¿cuánto tarda?","note":"Demorar = to take time (very Colombian)"},
   {"spanish":"Me está urgiendo","english":"It''s urgent for me","colombian":"Me urge / me está urgiendo","note":"Urgir = to be urgent — comes up a lot in complaints"}
 ]'::jsonb),

(4, 'Listening to Native Speech', 'Escuchando a los Colombianos — Real Speed',
 'Understand natural spoken Colombian Spanish at normal speed',
 'Contractions, dropped letters, linking in speech',
 'Listening to Colombian podcasts, YouTube, TV shows',
 10,
 '[
   {"spanish":"Pues","english":"Well / So (filler)","colombian":"Pues / pues sí / pues no","note":"Colombians use pues constantly as a filler"},
   {"spanish":"Entonces","english":"So / then","colombian":"Entonces / entonce'' (dropped s)","note":"Dropped final -s is common in rapid speech"},
   {"spanish":"¿Cómo así?","english":"How so? / What do you mean?","colombian":"¿Cómo así?","note":"Very Colombian — asks for clarification"},
   {"spanish":"O sea","english":"I mean / That is to say","colombian":"O sea / es que","note":"O sea is a very common filler/clarifier"},
   {"spanish":"Pa'' (para)","english":"For / to (contracted)","colombian":"Pa'' la casa / pa'' qué","note":"Para contracted to pa'' in fast speech"}
 ]'::jsonb),

(4, 'Group Conversation Practice', 'La Tertulia — Group Conversation',
 'Participate naturally in group conversations and not lose the thread',
 'Turn-taking expressions, interrupting politely, pausing',
 'Being part of a group meal conversation with Colombians',
 11,
 '[
   {"spanish":"Hablando de eso...","english":"Speaking of that...","colombian":"Hablando de eso / a propósito de eso","note":"Links what you want to say to the topic"},
   {"spanish":"Espera, espera","english":"Wait, wait","colombian":"Espera / espérate / un momento","note":"Used to hold your turn or interrupt"},
   {"spanish":"¿Ustedes qué piensan?","english":"What do you all think?","colombian":"¿Ustedes qué piensan? / ¿Y ustedes?","note":"Opens the conversation to the group"},
   {"spanish":"Lo que decís vos / tú","english":"What you''re saying","colombian":"Lo que decís / lo que dices","note":"Vos/tú variation — both used in Colombia"},
   {"spanish":"Para retomar el tema","english":"To get back to the topic","colombian":"Volviendo al tema / para retomar","note":"Redirects a wandering conversation"}
 ]'::jsonb),

(4, 'Cultural Awareness', 'La Cultura Colombiana — Understanding Colombia',
 'Understand key aspects of Colombian culture to communicate more naturally',
 'Cultural vocabulary, register sensitivity',
 'Being curious about Colombian history, geography, and identity',
 12,
 '[
   {"spanish":"La región","english":"The region","colombian":"La región / la zona","note":"Colombia has very distinct regional identities"},
   {"spanish":"El costeño","english":"Person from the coast","colombian":"El costeño / la costa","note":"Caribbean coast Colombians have distinct culture and accent"},
   {"spanish":"El paisa","english":"Person from Antioquia/Medellín","colombian":"El paisa","note":"Paisas are known for their entrepreneurial spirit"},
   {"spanish":"El rolo","english":"Person from Bogotá","colombian":"El rolo / el bogotano","note":"Rolos are often seen as more formal"},
   {"spanish":"El folclor","english":"Folklore / cultural traditions","colombian":"El folclor / las tradiciones","note":"Colombia is incredibly rich in regional traditions"}
 ]'::jsonb);

-- ============================================================
-- LEVEL 5: Advanced Conversational (CEFR B2)
-- ============================================================

insert into public.lessons (level, module_name, lesson_title, lesson_goal, grammar_focus, scenario, sort_order, vocabulary) values

(5, 'Expressing Nuance', 'Los Matices — Expressing Nuance',
 'Express subtle distinctions in meaning, emotion, and intention',
 'Subjunctive mood for doubt, emotion, and wishes; adverbial phrases',
 'Having a nuanced discussion about a complex personal or professional topic',
 1,
 '[
   {"spanish":"No es que... sino que...","english":"It''s not that... but rather that...","colombian":"No es que no quiera, sino que no puedo","note":"Essential for precise explanation"},
   {"spanish":"Si bien es cierto que...","english":"While it''s true that...","colombian":"Si bien es cierto / aunque es verdad que","note":"Acknowledges a point before counterarguing"},
   {"spanish":"Depende del contexto","english":"It depends on the context","colombian":"Depende / depende del contexto","note":"Shows sophistication in conversation"},
   {"spanish":"En cierta medida","english":"To a certain degree","colombian":"En cierta medida / hasta cierto punto","note":"Nuances a statement — not absolute"},
   {"spanish":"Vale la pena aclarar","english":"It''s worth clarifying","colombian":"Vale la pena aclarar / es importante distinguir","note":"Used to add precision"}
 ]'::jsonb),

(5, 'Persuasion', 'Convénceme — The Art of Persuasion',
 'Persuade, argue, and advocate effectively in Colombian Spanish',
 'Subjunctive in subordinate clauses, rhetorical questions',
 'Convincing a client, partner, or friend of your position',
 2,
 '[
   {"spanish":"Lo que quiero que entiendas es...","english":"What I want you to understand is...","colombian":"Lo que quiero que veas es / lo esencial es","note":"Sets up your key point"},
   {"spanish":"Los datos demuestran que...","english":"The data shows that...","colombian":"Los números muestran / los resultados indican","note":"Evidence-based persuasion"},
   {"spanish":"¿No crees que...?","english":"Don''t you think that...?","colombian":"¿No crees que? / ¿No te parece que?","note":"Rhetorical question for agreement"},
   {"spanish":"Estoy convencido de que...","english":"I am convinced that...","colombian":"Estoy convencido / tengo la certeza de que","note":"Strong confident assertion"},
   {"spanish":"Al fin y al cabo","english":"At the end of the day","colombian":"Al fin y al cabo / en últimas","note":"En últimas is very Colombian — ultimately"}
 ]'::jsonb),

(5, 'Negotiation Basics', 'Negociemos — Basic Negotiation Spanish',
 'Handle basic negotiations in Colombian Spanish — pricing, terms, and agreements',
 'Conditional for proposals, subjunctive for conditions',
 'Negotiating a contract, price, or arrangement with a Colombian',
 3,
 '[
   {"spanish":"¿Qué posibilidades hay?","english":"What are the possibilities?","colombian":"¿Qué se puede hacer? / ¿Qué opciones hay?","note":"Opens space for negotiation"},
   {"spanish":"Estaríamos dispuestos a...","english":"We would be willing to...","colombian":"Estaríamos dispuestos / podríamos considerar","note":"Conditional signals flexibility"},
   {"spanish":"Si aceptas... entonces...","english":"If you accept... then...","colombian":"Si aceptás esto... entonces yo...","note":"Classic if-then negotiation structure"},
   {"spanish":"Llegamos a un acuerdo","english":"We reached an agreement","colombian":"Llegamos a un acuerdo / quedamos de acuerdo","note":"Confirms the deal was closed"},
   {"spanish":"¿Cuál sería el siguiente paso?","english":"What would be the next step?","colombian":"¿Cuál sería el paso a seguir?","note":"Moves the deal forward professionally"}
 ]'::jsonb),

(5, 'Idioms and Expressions', 'Modismos — Colombian Idioms',
 'Use Colombian idioms and idiomatic expressions to speak naturally',
 'Fixed idiomatic phrases, metaphorical language',
 'Any natural conversation where idioms would fit',
 4,
 '[
   {"spanish":"No dar papaya","english":"Don''t give opportunity to be robbed / don''t be careless","colombian":"No dé papaya","note":"Famous Colombian expression — don''t make yourself an easy target"},
   {"spanish":"Coger el toro por los cuernos","english":"Grab the bull by the horns","colombian":"Coger el toro por los cuernos","note":"Face a problem head-on"},
   {"spanish":"Estar en las nubes","english":"To be daydreaming / spaced out","colombian":"Estar en las nubes / estar en otro mundo","note":"Head in the clouds"},
   {"spanish":"Hablar hasta por los codos","english":"To talk a lot / non-stop","colombian":"Hablar hasta por los codos","note":"Talk the ears off someone"},
   {"spanish":"Ponerse las pilas","english":"Get it together / get focused","colombian":"¡Ponte las pilas!","note":"Pilas = batteries — recharge and get going"}
 ]'::jsonb),

(5, 'Professional Small Talk', 'El Networking — Professional Connections',
 'Network and build professional relationships through natural small talk in Spanish',
 'Present perfect for experience, softened imperatives for suggestions',
 'At a business event or networking dinner in Bogotá',
 5,
 '[
   {"spanish":"¿A qué se dedica su empresa?","english":"What does your company do?","colombian":"¿En qué está su empresa? / ¿A qué se dedican?","note":"En qué está = what are you in/working on"},
   {"spanish":"Llevamos varios años en el mercado","english":"We''ve been in the market for several years","colombian":"Llevamos en el mercado desde... / estamos hace... años","note":"Llevar = duration of time in Colombia"},
   {"spanish":"¿Han trabajado con clientes en Colombia?","english":"Have you worked with clients in Colombia?","colombian":"¿Han tenido clientes colombianos?","note":"Tenido from haber tenido"},
   {"spanish":"Con gusto le comparto...","english":"I''d be glad to share...","colombian":"Con gusto le comparto / me alegra compartirle","note":"Very professional Colombian phrase"},
   {"spanish":"Quedo pendiente","english":"I''ll follow up / I''m pending","colombian":"Quedo pendiente / le hago saber","note":"Quedo pendiente = I''m following this up"}
 ]'::jsonb),

(5, 'Advanced Listening', 'Oído Fino — Advanced Listening',
 'Understand fast, complex, and colloquial Colombian Spanish',
 'Reduced speech, regional variation, slang at speed',
 'Watching Colombian news, telenovelas, or YouTube creators',
 6,
 '[
   {"spanish":"Mire que...","english":"Look, the thing is... / Let me tell you...","colombian":"Mire que... / mire usted","note":"Mire is a very Colombian discourse opener"},
   {"spanish":"Eso es lo de menos","english":"That''s the least of it / that''s a minor concern","colombian":"Eso es lo de menos","note":"Dismisses a concern as minor"},
   {"spanish":"¿Cierto?","english":"Right? / Isn''t it?","colombian":"¿Cierto? / ¿no?","note":"Tag question — checking for agreement constantly"},
   {"spanish":"Por ahí","english":"Around there / roughly / somehow","colombian":"Por ahí / más o menos","note":"Vague agreement or approximate — very common"},
   {"spanish":"Sin embargo","english":"However / nevertheless","colombian":"Sin embargo / pero igual","note":"Pero igual = but still (softer)"}
 ]'::jsonb),

(5, 'Humour and Tone', 'El Humor Colombiano — Colombian Humour',
 'Understand and use Colombian humour, sarcasm, and playful language',
 'Irony markers, diminutives for softening, playful registers',
 'Joking around with Colombian friends at a social gathering',
 7,
 '[
   {"spanish":"No, mentiras","english":"No, just kidding","colombian":"No, mentiras / estoy tomando el pelo","note":"Mentiras = lies, used as kidding"},
   {"spanish":"Es un chiste","english":"It''s a joke","colombian":"Es un chiste / estoy bromeando","note":"Bromeando = joking"},
   {"spanish":"¡Me está matando!","english":"You''re killing me! (with laughter)","colombian":"¡Me está matando! / ¡No más!","note":"Exaggerated reaction to something funny"},
   {"spanish":"Eso es muy rolo","english":"That''s very Bogotá-style / uptight","colombian":"Eso es muy rolo","note":"Playful regional teasing — must know context"},
   {"spanish":"Sacar el clavo","english":"To get revenge / to get even","colombian":"Sacar el clavo","note":"Colourful expression for getting revenge"}
 ]'::jsonb),

(5, 'Debate and Opinion', 'El Debate — Debate and Argument',
 'Articulate and defend complex opinions in Spanish with confidence',
 'Relative clauses, complex subordination, subjunctive in argument',
 'Debating a social, political, or cultural topic with Colombians',
 8,
 '[
   {"spanish":"Desde mi perspectiva...","english":"From my perspective...","colombian":"Desde mi punto de vista / a mi modo de ver","note":"A mi modo de ver = the way I see it"},
   {"spanish":"Si bien entiendo tu argumento...","english":"While I understand your argument...","colombian":"Entiendo lo que dices, pero...","note":"Acknowledgment before countering"},
   {"spanish":"Hay que tener en cuenta que...","english":"We have to take into account that...","colombian":"Hay que considerar que / no podemos ignorar que","note":"Introduces a counterpoint or nuance"},
   {"spanish":"En ese caso, yo diría que...","english":"In that case, I would say that...","colombian":"En ese caso / si es así, entonces","note":"Conditional response in debate"},
   {"spanish":"No hay que generalizar","english":"We shouldn''t generalise","colombian":"No podemos generalizar / hay que distinguir","note":"Important in respectful debate"}
 ]'::jsonb),

(5, 'Cultural Context', 'Colombia Profunda — Deep Colombian Culture',
 'Discuss Colombian history, society, and identity with nuance',
 'Imperfect subjunctive for hypotheticals, reported speech',
 'Discussing Colombian history, politics, or the peace process',
 9,
 '[
   {"spanish":"El conflicto","english":"The conflict","colombian":"El conflicto / el posconflicto","note":"Colombia''s armed conflict and its aftermath are central topics"},
   {"spanish":"La cultura de la violencia","english":"The culture of violence","colombian":"La violencia / el narco","note":"Sensitive topic — approach with care and curiosity"},
   {"spanish":"El boom económico","english":"The economic boom","colombian":"El auge / el boom","note":"Colombia''s economic transformation since 2010s"},
   {"spanish":"La diversidad cultural","english":"Cultural diversity","colombian":"La diversidad / somos muy diversos","note":"Colombia has 87 indigenous communities"},
   {"spanish":"El orgullo colombiano","english":"Colombian pride","colombian":"El orgullo paisa / el orgullo colombiano","note":"Colombians are intensely proud of their country"}
 ]'::jsonb),

(5, 'Fast Speech Comprehension', 'Velocidad Real — Real Speed Colombian',
 'Follow conversations at full native Colombian speed without asking for repetition',
 'Reduced syllables, sound linking, zero articles in rapid speech',
 'Listening to a group of Colombians talking among themselves',
 10,
 '[
   {"spanish":"Ahorita","english":"Right now / in a moment (ambiguous)","colombian":"Ahorita","note":"Can mean now, in a bit, or eventually — context is key"},
   {"spanish":"¿Cómo quedamos?","english":"How do we leave it? / What''s the plan?","colombian":"¿Cómo quedamos? / ¿qué hacemos?","note":"Confirms what was agreed"},
   {"spanish":"Eso es todo","english":"That''s all","colombian":"Eso es todo / y ya","note":"Y ya = and that''s it — very common ending"},
   {"spanish":"Hacer el favor","english":"To do the favour / please do","colombian":"Hágame el favor / me hace el favor de...","note":"Please do this for me — can be polite or firm"},
   {"spanish":"¿Me entiende?","english":"Do you understand me?","colombian":"¿Me entiende? / ¿Me captó?","note":"Checking comprehension — captó = did you get it?"}
 ]'::jsonb),

(5, 'Regional Colombian Differences', 'Colombia de Norte a Sur — Regional Variations',
 'Understand key regional differences in Colombian Spanish vocabulary and style',
 'Dialectal vocabulary, register variation by region',
 'Travelling through different Colombian cities and noticing the differences',
 11,
 '[
   {"spanish":"Vos (Antioquia/Medellín)","english":"You (informal) — regional alternative to tú","colombian":"Vos tenés razón (Medellín)","note":"Voseo is common in Antioquia — add -ás/-és to verbs"},
   {"spanish":"¡Uy!","english":"Wow / oh! (surprise)","colombian":"¡Uy! (used everywhere)","note":"Universal Colombian exclamation"},
   {"spanish":"El parcero / la parcera","english":"Friend / mate (Medellín origin)","colombian":"Parce / parcero","note":"Spread from Medellín to all of Colombia"},
   {"spanish":"El Mono / la Mona","english":"Blond/fair-skinned person","colombian":"El mono / la mona","note":"Not offensive — describes physical appearance"},
   {"spanish":"El Negro / la Negra","english":"Dark-skinned person (affectionate)","colombian":"Mi negro / mi negra","note":"Used affectionately between friends in Colombia — not offensive in that context"}
 ]'::jsonb),

(5, 'Emotional Precision', 'Emociones Precisas — Emotional Vocabulary',
 'Express complex emotions with precision and empathy in Spanish',
 'Subjunctive for expressing wishes for others, emotional vocabulary range',
 'Supporting someone through a difficult time or expressing your own feelings',
 12,
 '[
   {"spanish":"Me siento abrumado/a","english":"I feel overwhelmed","colombian":"Me siento abrumado / me tiene agotado","note":"Me tiene agotado = it has me exhausted"},
   {"spanish":"Estoy en un momento de incertidumbre","english":"I''m in a moment of uncertainty","colombian":"Estoy en un momento complicado / incierto","note":"Honest, mature emotional expression"},
   {"spanish":"Me pesa mucho","english":"It weighs heavily on me","colombian":"Me pesa / me preocupa mucho","note":"Me pesa = it bothers/saddens me"},
   {"spanish":"Siento que no soy suficiente","english":"I feel like I''m not enough","colombian":"Siento que no doy la talla","note":"No dar la talla = not meeting the standard"},
   {"spanish":"Espero que estés bien","english":"I hope you''re doing well","colombian":"Ojalá estés bien / espero que todo esté bien","note":"Warm, caring check-in expression"}
 ]'::jsonb);

-- ============================================================
-- LEVEL 6: Professional Working Fluency (CEFR C1)
-- ============================================================

insert into public.lessons (level, module_name, lesson_title, lesson_goal, grammar_focus, scenario, sort_order, vocabulary) values

(6, 'Business Introductions', 'La Primera Reunión — First Business Meeting',
 'Make powerful first impressions and introductions in a Colombian B2B context',
 'Present perfect for experience, nominalisations, formal register',
 'First meeting with a prospective Colombian client or partner',
 1,
 '[
   {"spanish":"Estamos dedicados a...","english":"We are dedicated to...","colombian":"Nos dedicamos a / nuestro enfoque es","note":"Enfoque = focus — professional language"},
   {"spanish":"Contamos con más de X años de experiencia","english":"We have over X years of experience","colombian":"Llevamos X años en el mercado","note":"Llevamos is preferred in Colombian business"},
   {"spanish":"Nos da mucho gusto conocerlos","english":"We''re very pleased to meet you","colombian":"Mucho gusto en conocerlos / es un placer","note":"Es un placer is warm and professional"},
   {"spanish":"¿Cómo está la empresa actualmente?","english":"How is the company currently doing?","colombian":"¿Cómo están hoy en día? / ¿Cómo les ha ido?","note":"Cómo les ha ido = how have things been going"},
   {"spanish":"Queremos entender su situación","english":"We want to understand your situation","colombian":"Queremos entender bien su contexto","note":"Contexto = context — shows consultative approach"}
 ]'::jsonb),

(6, 'Sales Discovery Calls', 'La Llamada de Descubrimiento — Discovery Calls',
 'Run a discovery call in Colombian Spanish — qualifying, exploring, building trust',
 'Interrogative sentences at advanced level, conditional questions',
 'Discovery call with a Colombian SME owner or decision maker',
 2,
 '[
   {"spanish":"¿Cuál es el principal reto que enfrentan hoy?","english":"What is the main challenge you face today?","colombian":"¿Cuál es el mayor reto que tienen? / ¿Qué los tiene preocupados?","note":"Qué los tiene preocupados = what''s keeping them up at night"},
   {"spanish":"¿Cómo están manejando actualmente...?","english":"How are you currently managing...?","colombian":"¿Cómo están gestionando actualmente...?","note":"Gestionar = to manage — very business Colombian"},
   {"spanish":"¿Qué impacto tendría resolver esto?","english":"What impact would resolving this have?","colombian":"¿Qué cambiaría si resolvieran esto?","note":"Conditional for impact questions"},
   {"spanish":"¿Quién más está involucrado en la decisión?","english":"Who else is involved in the decision?","colombian":"¿Quiénes más participan en la decisión?","note":"Maps the decision-making unit"},
   {"spanish":"¿Cuál es su tiempo ideal para implementar?","english":"What is your ideal timeline for implementation?","colombian":"¿Para cuándo necesitarían tener esto listo?","note":"Necesitarían = conditional for timeline"}
 ]'::jsonb),

(6, 'Objection Handling', 'Las Objeciones — Handling Sales Objections',
 'Handle common sales objections in Colombian Spanish with confidence and skill',
 'Conditional sentences, concessive clauses, rhetorical questions',
 'A Colombian prospect says "Es muy caro" or "No es el momento"',
 3,
 '[
   {"spanish":"Entiendo su preocupación","english":"I understand your concern","colombian":"Entiendo su preocupación / tiene razón en preguntar eso","note":"Validates the objection before addressing"},
   {"spanish":"La mayoría de nuestros clientes pensaban lo mismo","english":"Most of our clients thought the same","colombian":"La mayoría empezó con esa misma duda","note":"Normalises the objection},"},
   {"spanish":"¿Qué haría que esto fuera viable para ustedes?","english":"What would make this viable for you?","colombian":"¿Qué necesitarían ver para que esto tenga sentido?","note":"Turns objection into a question about conditions"},
   {"spanish":"Inversión, no gasto","english":"Investment, not an expense","colombian":"No es un gasto, es una inversión / el retorno justifica","note":"Classic reframe for price objections"},
   {"spanish":"Si no es el momento ahora, ¿cuándo sería?","english":"If not now, when would be the right time?","colombian":"Si no es ahora, ¿cuándo se dan las condiciones?","note":"Gentle timeline pressure"}
 ]'::jsonb),

(6, 'Presenting Value', 'La Propuesta de Valor — Value Proposition',
 'Present your value proposition clearly and compellingly in Colombian business Spanish',
 'Nominalisation, passive voice for authority, sequence adverbs',
 'Presenting your product or service to a Colombian audience',
 4,
 '[
   {"spanish":"El valor diferencial de nuestra propuesta es...","english":"The differential value of our proposal is...","colombian":"Lo que nos diferencia es / nuestra propuesta de valor es","note":"Colombian preference: direct and clear"},
   {"spanish":"En términos prácticos, esto significa que...","english":"In practical terms, this means that...","colombian":"En la práctica, esto se traduce en...","note":"Se traduce en = translates to (strong business phrase)"},
   {"spanish":"Nuestros clientes han visto resultados como...","english":"Our clients have seen results like...","colombian":"Casos como el de X empresa muestran que...","note":"Specificity builds credibility"},
   {"spanish":"La implementación es sencilla y rápida","english":"Implementation is simple and fast","colombian":"El proceso de implementación es ágil y sin complicaciones","note":"Ágil = agile (very modern Colombian business language)"},
   {"spanish":"¿Tiene alguna pregunta sobre lo presentado?","english":"Do you have any questions about what was presented?","colombian":"¿Hay alguna duda sobre lo que les compartí?","note":"Compartir = to share — Colombian preference in business"}
 ]'::jsonb),

(6, 'Negotiating Price', 'La Negociación de Precio — Price Negotiation',
 'Negotiate price and terms professionally in Colombian business culture',
 'Conditional and subjunctive for conditions, concessions language',
 'Negotiating a commercial contract or service agreement',
 5,
 '[
   {"spanish":"Nuestra posición inicial es...","english":"Our initial position is...","colombian":"Nuestra propuesta inicial considera...","note":"Considera sounds more thoughtful than es"},
   {"spanish":"¿Qué margen de negociación tienen?","english":"What room do you have for negotiation?","colombian":"¿Tienen flexibilidad en los términos? / ¿Hay espacio para ajustar?","note":"Flexible framing"},
   {"spanish":"Si aumentan el volumen, podemos ajustar el precio","english":"If you increase volume, we can adjust the price","colombian":"Si el volumen crece, el precio puede mejorar","note":"Conditional offer — classic negotiation"},
   {"spanish":"Eso está por encima de nuestro presupuesto","english":"That''s above our budget","colombian":"Está un poco por encima / no nos ajusta al presupuesto","note":"Nos ajusta = fits our budget (very Colombian)"},
   {"spanish":"Podríamos llegar a un punto intermedio","english":"We could meet in the middle","colombian":"Podríamos buscar un punto de equilibrio","note":"Punto de equilibrio = balance point"}
 ]'::jsonb),

(6, 'Follow Up Emails', 'El Seguimiento — Professional Follow-Up',
 'Write and discuss professional follow-up emails in Colombian business Spanish',
 'Formal written register, nominalisations, sequence expressions',
 'Following up after a meeting with a Colombian company',
 6,
 '[
   {"spanish":"De acuerdo a lo conversado...","english":"As discussed...","colombian":"De acuerdo a lo conversado / según lo acordado","note":"Según lo acordado = as agreed"},
   {"spanish":"Le escribo para hacer seguimiento","english":"I''m writing to follow up","colombian":"Le escribo para hacerle seguimiento a nuestra reunión","note":"Standard professional Colombian opening"},
   {"spanish":"Adjunto encontrará...","english":"Attached you will find...","colombian":"Adjunto le envío / en el adjunto encontrará","note":"En el adjunto = in the attachment"},
   {"spanish":"Quedo en espera de su respuesta","english":"I look forward to your reply","colombian":"Quedo atento/a a su respuesta / quedo pendiente","note":"Quedo atento = I remain attentive — formal closing"},
   {"spanish":"Cordialmente","english":"Cordially (sign-off)","colombian":"Cordialmente / un cordial saludo","note":"Cordialmente is the standard Colombian professional sign-off"}
 ]'::jsonb),

(6, 'Running Meetings', 'La Reunión — Running Professional Meetings',
 'Facilitate and participate in business meetings professionally in Colombian Spanish',
 'Discourse markers for structure, impersonal constructions, formal imperatives',
 'Running or participating in a client meeting in Bogotá',
 7,
 '[
   {"spanish":"Procedemos con el orden del día","english":"Let''s proceed with the agenda","colombian":"Procedemos con la agenda / seguimos con el orden del día","note":"Agenda or orden del día — both used"},
   {"spanish":"La palabra está abierta para...","english":"The floor is open for...","colombian":"Le damos la palabra a... / escuchamos a...","note":"Escuchamos = we listen to / we''ll hear from"},
   {"spanish":"Para efectos de esta reunión","english":"For the purposes of this meeting","colombian":"Para efectos de esta reunión / en el marco de esta conversación","note":"Professional framing language"},
   {"spanish":"¿Alguien tiene alguna intervención?","english":"Does anyone want to add something?","colombian":"¿Alguna intervención? / ¿Algún aporte?","note":"Aporte = contribution — very Colombian corporate"},
   {"spanish":"Registramos en acta","english":"We''ll note that in the minutes","colombian":"Lo dejamos en acta / lo documentamos","note":"En acta = in the meeting minutes"}
 ]'::jsonb),

(6, 'Client Management', 'La Gestión del Cliente — Client Relationship Management',
 'Build and maintain strong client relationships in Colombian business culture',
 'Subjunctive in reported speech, formal email register, conditional for commitments',
 'Ongoing relationship management with a Colombian corporate client',
 8,
 '[
   {"spanish":"¿Cómo han percibido los resultados?","english":"How have you perceived the results?","colombian":"¿Cómo han sentido los resultados? / ¿Están conformes?","note":"Conformes = satisfied — used in Colombian client conversations"},
   {"spanish":"Nuestro compromiso es...","english":"Our commitment is...","colombian":"Nuestro compromiso es / nos comprometemos a","note":"Commitment language is important in Colombian relationships"},
   {"spanish":"¿En qué más podemos servirle?","english":"How else can we serve you?","colombian":"¿En qué más le podemos ayudar? / ¿Qué más necesitan?","note":"Servirle = to serve you (formal)"},
   {"spanish":"Vamos a escalar esto internamente","english":"We''re going to escalate this internally","colombian":"Vamos a escalar esto / lo gestionamos internamente","note":"Escalar is adopted from English in Colombian tech/business"},
   {"spanish":"La relación a largo plazo es nuestra prioridad","english":"Long-term relationship is our priority","colombian":"Para nosotros lo importante es la relación duradera","note":"Duradera = lasting — shows Colombian business values"}
 ]'::jsonb),

(6, 'Conflict Resolution', 'Resolviendo Conflictos — Professional Conflict Resolution',
 'Navigate and resolve professional conflicts diplomatically in Colombian Spanish',
 'Imperfect subjunctive for hypotheticals, softened criticism, concessive clauses',
 'Addressing a service failure or difficult client situation',
 9,
 '[
   {"spanish":"Lamentamos lo ocurrido","english":"We regret what happened","colombian":"Lamentamos la situación / sentimos mucho lo ocurrido","note":"Lamentamos is formal and sincere"},
   {"spanish":"Asumimos la responsabilidad","english":"We take responsibility","colombian":"Asumimos la responsabilidad / reconocemos el error","note":"Reconocemos el error = we acknowledge the mistake"},
   {"spanish":"Vamos a tomar las medidas necesarias","english":"We will take the necessary steps","colombian":"Vamos a tomar las medidas del caso","note":"Las medidas del caso = the appropriate measures (very Colombian)"},
   {"spanish":"¿Cómo podríamos compensarle?","english":"How could we compensate you?","colombian":"¿Cómo podemos resarcirle? / ¿Qué podemos hacer?","note":"Resarcir = to compensate for damage"},
   {"spanish":"Garantizamos que esto no se repetirá","english":"We guarantee this will not be repeated","colombian":"Garantizamos que no se va a volver a presentar","note":"Volver a presentar = happen again (Colombian formal)"}
 ]'::jsonb),

(6, 'Commercial Storytelling', 'La Historia de Marca — Brand Storytelling',
 'Tell compelling brand and case study stories that resonate with Colombian clients',
 'Narrative structure in Spanish, present historic for impact',
 'Telling a client story or case study in a sales presentation',
 10,
 '[
   {"spanish":"El punto de inflexión fue...","english":"The turning point was...","colombian":"El momento clave fue / el punto de quiebre fue","note":"Punto de quiebre = breaking point / turning point"},
   {"spanish":"Lo que más nos costó entender fue...","english":"What took us longest to understand was...","colombian":"Lo que nos tomó más tiempo comprender fue...","note":"Authentic storytelling — showing the learning curve"},
   {"spanish":"Los resultados hablan por sí solos","english":"The results speak for themselves","colombian":"Los resultados hablan solos / los números lo dicen todo","note":"Strong closing statement"},
   {"spanish":"Detrás de cada cliente hay una historia","english":"Behind every client there is a story","colombian":"Cada empresa tiene su historia / cada cliente tiene un contexto único","note":"Human-centred approach resonates in Colombia"},
   {"spanish":"Esa es la razón de ser de nuestra empresa","english":"That is the reason for being of our company","colombian":"Por eso existe nuestra empresa / ese es nuestro propósito","note":"Propósito = purpose — very powerful in Colombian business culture"}
 ]'::jsonb),

(6, 'Executive Communication', 'El Lenguaje Ejecutivo — Executive-Level Communication',
 'Communicate at C-suite level with confidence in Colombian corporate Spanish',
 'Nominalisation, passive voice for authority, complex argumentation',
 'Presenting to or engaging with Colombian C-level executives',
 11,
 '[
   {"spanish":"La visión estratégica de la organización","english":"The strategic vision of the organisation","colombian":"La visión estratégica / la hoja de ruta","note":"Hoja de ruta = road map — very used in executive Colombia"},
   {"spanish":"En el marco de nuestra estrategia","english":"Within the framework of our strategy","colombian":"En el marco de / bajo la estrategia de","note":"Formal framing — signals strategic thinking"},
   {"spanish":"Los indicadores muestran","english":"The indicators show","colombian":"Los indicadores señalan / los KPIs reflejan","note":"KPIs is now widely used in Colombian corporate"},
   {"spanish":"Tomamos decisiones basadas en datos","english":"We make data-driven decisions","colombian":"Tomamos decisiones basadas en datos / somos data-driven","note":"Data-driven is now used in Spanish in Colombia"},
   {"spanish":"¿Cuál es el retorno sobre la inversión esperado?","english":"What is the expected ROI?","colombian":"¿Cuál es el ROI proyectado? / ¿Qué retorno esperamos?","note":"ROI is used directly in Colombian business now"}
 ]'::jsonb),

(6, 'Leadership Communication', 'El Líder — Leadership Spanish',
 'Lead, motivate, and communicate with teams in Colombian professional Spanish',
 'Subjunctive for instructions, formal-but-warm leadership register',
 'Leading a Colombian team meeting or performance conversation',
 12,
 '[
   {"spanish":"Confío en el equipo","english":"I trust the team","colombian":"Confío en cada uno de ustedes","note":"Each one of you — personalised Colombian leadership"},
   {"spanish":"¿Qué necesitan de mi parte?","english":"What do you need from me?","colombian":"¿En qué los puedo apoyar? / ¿Qué les hace falta?","note":"Apoyar = to support — key leadership word"},
   {"spanish":"Reconocemos el esfuerzo","english":"We recognise the effort","colombian":"Reconocemos el trabajo y el esfuerzo","note":"Recognition is extremely motivating in Colombian culture"},
   {"spanish":"Juntos podemos llegar más lejos","english":"Together we can go further","colombian":"Juntos llegamos más lejos / somos un equipo","note":"Collective values are strong in Colombian work culture"},
   {"spanish":"El objetivo es claro","english":"The objective is clear","colombian":"El objetivo es claro / todos sabemos para dónde vamos","note":"Para dónde vamos = where we''re going (Colombian)"}
 ]'::jsonb);
