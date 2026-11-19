import { MAX, numberOptions, rnd } from '../lib.js';

const eq = (a, op, b, r) => `<div class="eq"><span>${a}</span><span class="op">${op}</span><span>${b}</span><span class="op">=</span>` +
  `<span class="slot${r === '?' ? '' : ' filled'}">${r}</span></div>`;

export default { title: 'Računko', learns: 'zbrajanje i oduzimanje do 10', color: '#5b6cff', how: 'Izračunaj zadatak i dodirni točan broj.',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><path d="M18 38h28M32 24v28M54 66h28" stroke="#fff" stroke-width="9" stroke-linecap="round"/></svg>',
  // do 10, bez negativnih rezultata
  make() {
    const plus = Math.random() < 0.5;
    const a = rnd(MAX + 1);
    const b = plus ? rnd(MAX + 1 - a) : rnd(a + 1);
    const answer = plus ? a + b : a - b, op = plus ? '+' : '−';
    return { kind: plus ? 'zbrajanje' : 'oduzimanje', view: eq(a, op, b, '?'), reveal: eq(a, op, b, answer), answer, options: numberOptions(answer) };
  } };
