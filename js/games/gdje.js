import { draw, rnd, shuffle } from '../lib.js';

// Gdje živi: [mjesto, opis]; životinje bez dvojbe (npr. bez žabe)
const HOMES = { '🌊': ['u vodi', ['🐟','🐬','🐳','🐙','🦀','🐠']],
                '🌳': ['u šumi', ['🦊','🐻','🐺','🦉','🐿️','🦔','🦌']],
                '🏡': ['uz čovjeka', ['🐄','🐖','🐑','🐓','🐐','🐴','🐕','🐈']] };
const HOME_ANIMALS = Object.entries(HOMES).flatMap(([h, [, list]]) => list.map(a => [a, h]));

export default { title: 'Gdje živi?', learns: 'životinje i gdje žive: u vodi, u šumi, uz čovjeka', color: '#4d908e',
  how: 'Gdje živi ova životinja: u vodi, u šumi ili uz čovjeka? Ili obrnuto: koja od ponuđenih životinja živi na tom mjestu? Dodirni.',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><path d="M22 70h56M30 70V48l20-16 20 16v22" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  make() {
    const [animal, home] = draw('gdje', HOME_ANIMALS);
    const pic = (p, text) => `<div><div class="pic">${p}</div><div class="word" style="letter-spacing:0">${text}</div></div>`;
    const reveal = pic(animal, `${animal} živi ${HOMES[home][0]}`);
    if (Math.random() < 0.5) return { view: pic(animal, ''), reveal, answer: home, options: shuffle(Object.keys(HOMES)) };
    // obrnuto: zadano mjesto, traži se životinja; ostale dvije su iz drugih mjesta
    const others = Object.keys(HOMES).filter(h => h !== home).map(h => HOMES[h][1][rnd(HOMES[h][1].length)]);
    return { view: pic(home, ''), reveal, answer: animal, options: shuffle([animal, ...others]) };
  } };
