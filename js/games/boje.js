import { dot, draw, shuffle, slot } from '../lib.js';

const COLORS = { crvena: '#e53935', žuta: '#fdd835', plava: '#1e88e5', bijela: '#ffffff', crna: '#222222',
                 narančasta: '#fb8c00', zelena: '#43a047', ljubičasta: '#8e24aa', ružičasta: '#f48fb1', siva: '#9e9e9e', svijetloplava: '#90caf9' };
const MIXES = [['crvena','žuta','narančasta'], ['plava','žuta','zelena'], ['crvena','plava','ljubičasta'],
               ['crvena','bijela','ružičasta'], ['plava','bijela','svijetloplava'], ['crna','bijela','siva']];
const BASE = ['crvena', 'žuta', 'plava', 'bijela', 'crna'];
// svaka kombinacija × oba redoslijeda × koja boja nedostaje (0, 1 ili rezultat) = 36 zadataka
const MIX_TASKS = MIXES.flatMap(([x, y, r]) => [[x, y, r], [y, x, r]]).flatMap(m => [0, 1, 2].map(miss => [...m, miss]));

export default { title: 'Miješanje boja', learns: 'miješanje osnovnih boja', color: '#e76f51',
  how: 'Koja boja nedostaje? Što nastane kad pomiješaš dvije boje? Dodirni krug s pravom bojom.',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><circle cx="40" cy="42" r="18" fill="#fff" opacity=".9"/><circle cx="60" cy="42" r="18" fill="#fff" opacity=".6"/><circle cx="50" cy="60" r="18" fill="#fff" opacity=".75"/></svg>',
  make() {
    const [a, b, r, miss] = draw('boje', MIX_TASKS);
    const parts = [a, b, r], answer = parts[miss];
    // ponuđene boje iste vrste kao tražena (osnovne ili rezultati), bez one koja je već na ekranu
    const pool = (miss === 2 ? MIXES.map(m => m[2]) : BASE).filter(c => c !== answer && !parts.includes(c));
    const opts = [answer, ...shuffle(pool).slice(0, 2)];
    const cell = (c, i, k) => i === miss ? slot(dot(COLORS[c]), 0, k) : dot(COLORS[c]);
    const view = k => `<div><div class="eq">${cell(a, 0, k)}<span class="op">+</span>${cell(b, 1, k)}<span class="op">=</span>${cell(r, 2, k)}</div>` +
      `<div class="word" style="font-size:1.6rem;letter-spacing:0">${k ? `${a} + ${b} = ${r}` : ''}</div></div>`;
    return { view: view(0), reveal: view(1), answer: COLORS[answer], options: shuffle(opts.map(c => COLORS[c])) };
  } };
