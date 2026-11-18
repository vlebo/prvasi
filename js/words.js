// Riječi sa slikom: Prvo slovo i Zadnje slovo
// Riječi bez dvojbe što slika predstavlja
export const WORDS = [['🐱','MAČKA'],['🐶','PAS'],['🍎','JABUKA'],['🐟','RIBA'],['🌞','SUNCE'],['🏠','KUĆA'],
  ['🐻','MEDVJED'],['🚗','AUTO'],['🍌','BANANA'],['🐸','ŽABA'],['🐰','ZEC'],['🦊','LISICA'],['🎈','BALON'],
  ['🐘','SLON'],['🦁','LAV'],['🍓','JAGODA'],['🐝','PČELA'],['⭐','ZVIJEZDA'],['🌙','MJESEC'],['🐄','KRAVA'],
  ['🐭','MIŠ'],['🐢','KORNJAČA'],['🍐','KRUŠKA'],['🥕','MRKVA'],['⚽','LOPTA'],['🦆','PATKA'],['🐑','OVCA'],
  ['🐍','ZMIJA'],['🍋','LIMUN'],['🌹','RUŽA'],['🐴','KONJ'],['🍕','PIZZA'],['🎁','POKLON'],['🧀','SIR'],['🐷','SVINJA']];
export const LETTERS = [...new Set(WORDS.map(w => w[1][0]))];

// Zadnje slovo: riječi grupirane po zadnjem slovu, da ne bude stalno "A"
export const BY_LAST = WORDS.reduce((m, w) => ((m[w[1].at(-1)] ||= []).push(w), m), {});
export const ALL_LETTERS = [...new Set([...LETTERS, ...Object.keys(BY_LAST)])];
