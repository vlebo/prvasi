import { draw, rnd, shuffle } from '../lib.js';
import { BY_LAST, ALL_LETTERS } from '../words.js';

export default { title: 'Zadnje slovo', learns: 'glasove i zadnje slovo u riječi', color: '#b5651d',
  how: 'Pogledaj sliku i reci riječ. Kojim slovom završava? Dodirni slovo.',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><text x="50" y="66" font-size="44" font-weight="900" text-anchor="middle" fill="#fff" font-family="system-ui">..a</text></svg>',
  make() {
    const last = draw('zadnje', Object.keys(BY_LAST));
    const list = BY_LAST[last], [pic, word] = list[rnd(list.length)];
    const opts = new Set([last]);
    while (opts.size < 3) opts.add(ALL_LETTERS[rnd(ALL_LETTERS.length)]);
    return { kind: 'slovo ' + last, view: `<div><div class="pic">${pic}</div><div class="word"></div></div>`,
             reveal: `<div><div class="pic">${pic}</div><div class="word">${word.slice(0, -1)}<b>${last}</b></div></div>`,
             answer: last, options: shuffle([...opts]) };
  } };
