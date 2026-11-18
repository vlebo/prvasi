import { draw } from '../lib.js';

// Slogovi: [slika, riječ, broj slogova]; izbjegnute riječi s dvojbom (auto, mrkva, riječi s "ije")
const SYLLABLES = [['🐶','PAS',1],['🐭','MIŠ',1],['🐰','ZEC',1],['🧀','SIR',1],['🦁','LAV',1],['🐳','KIT',1],['👃','NOS',1],
  ['🌲','BOR',1],['🔑','KLJUČ',1],['🐘','SLON',1],['🐴','KONJ',1],['🚂','VLAK',1],
  ['🐱','MAČKA',2],['🐟','RIBA',2],['🏠','KUĆA',2],['🐸','ŽABA',2],['⚽','LOPTA',2],['🍐','KRUŠKA',2],['🐝','PČELA',2],['🐄','KRAVA',2],
  ['🐑','OVCA',2],['🐍','ZMIJA',2],['🍋','LIMUN',2],['🌹','RUŽA',2],['🌞','SUNCE',2],['📚','KNJIGA',2],['🐔','KOKOŠ',2],['🎂','TORTA',2],
  ['🦋','LEPTIR',2],['🦆','PATKA',2],
  ['🍎','JABUKA',3],['🍌','BANANA',3],['🍓','JAGODA',3],['🦊','LISICA',3],['🐢','KORNJAČA',3],['🦒','ŽIRAFA',3],['👞','CIPELA',3],
  ['☂️','KIŠOBRAN',3],['🐊','KROKODIL',3],['🦜','PAPIGA',3],['📱','MOBITEL',3],
  ['🍫','ČOKOLADA',4],['💻','RAČUNALO',4],['🍉','LUBENICA',4],['🚁','HELIKOPTER',4]];

export default { title: 'Slogovi', learns: 'rastavljanje riječi na slogove', color: '#d4a017',
  how: 'Izgovori riječ sa slike i pljesni za svaki slog. Koliko puta si pljesnuo/la?',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><rect x="16" y="40" width="20" height="20" rx="6" fill="#fff"/><rect x="40" y="40" width="20" height="20" rx="6" fill="#fff"/><rect x="64" y="40" width="20" height="20" rx="6" fill="#fff"/></svg>',
  make() {
    const [pic, word, n] = draw('slogovi', SYLLABLES);
    return { view: `<div><div class="pic">${pic}</div><div class="word"></div></div>`,
             reveal: `<div><div class="pic">${pic}</div><div class="word">${word}</div><div class="claps">${'<i></i>'.repeat(n)}</div></div>`,
             answer: n, options: [1, 2, 3, 4] };
  } };
