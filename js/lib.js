// Pomoćne funkcije za igre
export const MAX = 10; // brojevi do 10; povećaj na 20 kad dođe gradivo (Brojalica je uvijek do 10)
export const AVATARS = ['🦊','🐸','🦄','🐼','🐯','🐵','🐰','🐻','🐱','🐶','🐧','🐞','🐨','🦁','🐷','🐙'];
export const $ = id => document.getElementById(id);
export const rnd = n => Math.floor(Math.random() * n);
export const shuffle = a => a.sort(() => Math.random() - 0.5);

// 3 ponuđena broja min–max, uključujući točan
export function numberOptions(answer, min = 0, max = MAX) {
  const opts = new Set([answer]);
  while (opts.size < 3) {
    const o = answer + rnd(7) - 3;
    if (o >= min && o <= max) opts.add(o);
  }
  return shuffle([...opts]);
}

export const dot = c => `<span class="dot" style="background:${c}"></span>`;
// opcija je boja (#hex) ili tekst/broj/emoji
export const optHtml = o => typeof o === 'string' && o[0] === '#' ? dot(o) : String(o);
// Nasumično bez ponavljanja: isti element tek kad se cijeli popis iskoristi
export const bags = {};
export function draw(name, list) {
  const last = bags[name + ':last'];
  if (!bags[name]?.length) {
    bags[name] = shuffle([...list]);
    if (list.length > 1 && bags[name].at(-1) === last) bags[name].unshift(bags[name].pop()); // ne dvaput zaredom preko granice
  }
  return bags[name + ':last'] = bags[name].pop();
}
export const sign = (a, b) => a < b ? '<' : a > b ? '>' : '=';
// prazna/aktivna/popunjena kućica za i-ti znak, kad je k znakova već upisano
export const slot = (v, i, k) => `<span class="slot${i < k ? ' filled' : i === k ? ' active' : ''}">${i < k ? v : i === k ? '?' : '&nbsp;'}</span>`;

// Potpis zadatka (što piše + odgovor), da se isti zadatak ne ponavlja
export const sig = t => (t.show ? t.show(0) : t.view) + '|' + (t.steps || [t.answer]).join();
// Zadatak koji nije među zadnjih `keep` viđenih; ako ih nakon 50 pokušaja nema (sve kombinacije potrošene), prihvati bilo koji
export function fresh(make, seen, keep = 30) {
  let t;
  for (let i = 0; i < 50; i++) if (!seen.has(sig(t = make()))) break;
  seen.delete(sig(t)); seen.add(sig(t)); // na kraj reda
  if (seen.size > keep) seen.delete(seen.values().next().value);
  return t;
}
