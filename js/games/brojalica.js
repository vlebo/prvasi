import { numberOptions, rnd, shuffle } from '../lib.js';

// Okvir od 10 polja s n nasumično raspoređenih točkica
function frame(n) {
  const filled = shuffle([...Array(10).keys()]).slice(0, n);
  let s = '<svg class="frame" viewBox="0 0 530 220">';
  for (let i = 0; i < 10; i++) {
    const x = 10 + (i % 5) * 104, y = 10 + Math.floor(i / 5) * 104;
    s += `<rect x="${x}" y="${y}" width="96" height="96" rx="20" fill="#fff" stroke="#e7e0d4" stroke-width="4"/>`;
    if (filled.includes(i)) s += `<circle cx="${x + 48}" cy="${y + 48}" r="34" style="fill:var(--c)"/>`;
  }
  return s + '</svg>';
}

export default { title: 'Brojalica', learns: 'brojanje i prepoznavanje količine do 10', color: '#1fa774', how: 'Prebroji točkice i dodirni koliko ih ima.',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/>' +
    [[30,38],[50,38],[70,38],[30,62],[50,62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#fff"/>`).join('') + '</svg>',
  make() {
    const answer = 1 + rnd(10);
    return { view: frame(answer), answer, options: numberOptions(answer, 1) };
  } };
