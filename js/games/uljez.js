import { draw, rnd, shuffle } from '../lib.js';

// Uljez: skupine i s kojima se smiju miješati (bez dvojbenih parova)
const GROUPS = {
  voce: { name: 'voće', items: ['🍎','🍌','🍐','🍇','🍓','🍒','🍑','🍋','🍉','🍊'], vs: ['povrce', 'prijevoz', 'divlje'] },
  povrce: { name: 'povrće', items: ['🥕','🥦','🌽','🥒','🥔','🧅','🧄'], vs: ['voce', 'prijevoz'] },
  domace: { name: 'domaća životinja', items: ['🐄','🐖','🐑','🐓','🐐','🐴'], vs: ['divlje', 'prijevoz'] },
  divlje: { name: 'divlja životinja', items: ['🦁','🐯','🐻','🦊','🐺','🐘','🦒','🦓'], vs: ['domace', 'voda'] },
  voda: { name: 'životinja iz vode', items: ['🐟','🐬','🐳','🐙','🦀','🐠'], vs: ['divlje', 'prijevoz'] },
  prijevoz: { name: 'prijevozno sredstvo', items: ['🚗','🚌','🚲','🚂','✈️','🚢','🚜'], vs: ['voce', 'divlje'] },
};

export default { title: 'Uljez', learns: 'razvrstavanje: voće, povrće, životinje, prijevoz', color: '#6a994e',
  how: 'Tri sličice idu zajedno, a jedna ne pripada. Pronađi uljeza!',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><circle cx="34" cy="36" r="11" fill="#fff"/><circle cx="66" cy="36" r="11" fill="#fff"/><circle cx="34" cy="68" r="11" fill="#fff"/><rect x="55" y="57" width="22" height="22" rx="3" fill="none" stroke="#fff" stroke-width="5"/></svg>',
  make() {
    const g = draw('uljez', Object.keys(GROUPS));
    const other = GROUPS[g].vs[rnd(GROUPS[g].vs.length)];
    const odd = GROUPS[other].items[rnd(GROUPS[other].items.length)];
    const three = shuffle([...GROUPS[g].items]).slice(0, 3);
    const hint = '<svg viewBox="0 0 260 70" style="width:min(80%,360px)">' + [0, 1, 2].map(i => `<circle cx="${35 + i * 64}" cy="35" r="26" style="fill:var(--c)"/>`).join('') +
      '<rect x="200" y="9" width="52" height="52" rx="10" fill="none" stroke="#2f2a3a" stroke-width="6" stroke-dasharray="10 6"/></svg>';
    return { kind: GROUPS[g].name, view: hint, reveal: `<div class="word" style="letter-spacing:0">${odd} nije ${GROUPS[g].name}</div>`,
             answer: odd, options: shuffle([...three, odd]) };
  } };
