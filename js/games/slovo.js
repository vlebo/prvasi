import { draw, rnd, shuffle } from '../lib.js';
import { WORDS, LETTERS } from '../words.js';

export default { title: 'Prvo slovo', learns: 'glasove i prvo slovo u riječi', color: '#f07b2e', how: 'Pogledaj sliku. Kojim slovom počinje ta riječ? Dodirni slovo.',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><text x="50" y="67" font-size="48" font-weight="900" text-anchor="middle" fill="#fff" font-family="system-ui">Aa</text></svg>',
  make() {
    const [pic, word] = draw('slovo', WORDS);
    const opts = new Set([word[0]]);
    while (opts.size < 3) opts.add(LETTERS[rnd(LETTERS.length)]);
    return { kind: 'slovo ' + word[0], view: `<div><div class="pic">${pic}</div><div class="word"></div></div>`,
             reveal: `<div><div class="pic">${pic}</div><div class="word"><b>${word[0]}</b>${word.slice(1)}</div></div>`,
             answer: word[0], options: shuffle([...opts]) };
  } };
