// Novosti: kartica "Novo!" na početnoj dok je korisnik ne zatvori. Novu verziju dodaj NA VRH popisa.
import { $ } from './lib.js';

const NEWS = [
  { v: '2026-11-19', items: [
    'Kutak za roditelje (gumb 👪 na početnoj): koliko dijete vježba, što mu ide teže i listići za ispis s rješenjima.',
  ] },
];

const SEEN = 'novosti-vidjeno';
export function showNews() {
  const latest = NEWS[0];
  if (localStorage.getItem(SEEN) === latest.v) return;
  $('newsList').innerHTML = latest.items.map(t => `<li>${t}</li>`).join('');
  $('news').hidden = false;
  $('newsClose').onclick = () => { localStorage.setItem(SEEN, latest.v); $('news').hidden = true; };
}
