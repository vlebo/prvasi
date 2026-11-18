import racunko from './racunko.js';
import brojalica from './brojalica.js';
import slovo from './slovo.js';
import usporedi from './usporedi.js';
import poredaj from './poredaj.js';
import niz from './niz.js';
import slogovi from './slogovi.js';
import uljez from './uljez.js';
import boje from './boje.js';
import zadnje from './zadnje.js';
import gdje from './gdje.js';
import strane from './strane.js';
import crta from './crta.js';

export const GAMES = { racunko, brojalica, slovo, usporedi, poredaj, niz, slogovi, uljez, boje, zadnje, gdje, strane, crta };

// Predmeti, redom kako se prikazuju
export const SUBJECTS = { 'Matematika': ['racunko', 'brojalica', 'usporedi', 'poredaj', 'niz', 'crta', 'strane'], 'Hrvatski jezik': ['slovo', 'zadnje', 'slogovi'],
                   'Priroda i društvo': ['uljez', 'gdje'], 'Likovna kultura': ['boje'] };
console.assert(Object.values(SUBJECTS).flat().sort().join() === Object.keys(GAMES).sort().join(), 'svaka igra u točno jednom predmetu');

// self-check generatora
for (const g of Object.values(GAMES)) for (let lv = 1; lv <= (g.maxLevel || 1); lv++) for (let i = 0; i < 300; i++) {
  const t = g.make(lv), steps = t.steps || [t.answer];
  console.assert(t.options.length >= 3 && new Set(t.options).size === t.options.length && steps.every(x => t.options.includes(x)), g.title, lv, t);
}
