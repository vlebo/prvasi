// Kutak za roditelje: napredak djeteta i listići za ispis (zadaci iz istih generatora kao igre)
import { $, optHtml, sig } from './lib.js';
import { chip } from './ui.js';
import { GAMES, SUBJECTS } from './games/index.js';
import { loadAll, removePlayer, exportFile, importText } from './progress.js';

const pct = ([ok, n]) => Math.round(ok / n * 100);
const sum = list => list.reduce((a, [ok, n]) => [a[0] + ok, a[1] + n], [0, 0]);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
let selected = null;

export function openParents() {
  const all = loadAll(), names = Object.keys(all).sort();
  if (!names.includes(selected)) selected = names[0] ?? null;
  $('pPlayers').innerHTML = '';
  names.forEach(name => {
    const b = chip(all[name].avatar, name, 'button');
    b.className = 'player' + (name === selected ? ' on' : '');
    b.onclick = () => { selected = name; openParents(); };
    $('pPlayers').append(b);
  });
  report(all[selected]);
  fillGames();
}

function report(me) {
  const box = $('pReport');
  box.innerHTML = '';
  if (!me) { box.append(el('p', 'empty', 'Još nema napretka. Bilježi se dok dijete igra.')); return; }
  const cutoff = new Date(Date.now() - 13 * 864e5).toLocaleDateString('sv');
  const entries = Object.entries(me.games).filter(([g]) => GAMES[g]); // samo igre koje postoje
  const total = sum(entries.flatMap(([, ks]) => Object.values(ks)));
  box.append(el('p', 'sub', `Igra ${me.days.filter(d => d >= cutoff).length} od zadnjih 14 dana · ${total[1]} zadataka · ${total[1] ? pct(total) : 0} % točno`));

  Object.entries(SUBJECTS).forEach(([subject, ids]) => {
    const played = ids.filter(id => me.games[id]);
    if (!played.length) return;
    box.append(el('h2', 'subject', subject));
    played.forEach(id => {
      const ks = Object.entries(me.games[id]), s = sum(ks.map(([, v]) => v));
      const lv = Math.max(...ks.map(([k]) => +k.split('|')[0]));
      const row = el('div', 'prow');
      row.style.setProperty('--c', GAMES[id].color);
      row.append(el('span', 'pname', GAMES[id].title), el('span', 'pbar'), el('b', null, pct(s) + ' %'),
                 el('span', 'plv', GAMES[id].maxLevel ? `razina ${lv}/${GAMES[id].maxLevel}` : ''));
      row.children[1].innerHTML = `<i style="width:${pct(s)}%"></i>`;
      box.append(row);
    });
  });

  // slabe točke: barem 5 pokušaja i ispod 75 %
  const weak = entries.flatMap(([g, ks]) => Object.entries(ks).map(([k, v]) => ({ g, lv: +k.split('|')[0], kind: k.split('|')[1], v })))
    .filter(w => w.v[1] >= 5 && pct(w.v) < 75).sort((a, b) => pct(a.v) - pct(b.v)).slice(0, 4);
  box.append(el('h2', 'subject', 'Što ide teže'));
  if (!weak.length) box.append(el('p', 'empty', 'Ništa posebno. Bravo!'));
  weak.forEach(w => {
    const row = el('div', 'prow');
    row.style.setProperty('--c', GAMES[w.g].color);
    row.append(el('span', 'pname', `${GAMES[w.g].title}: ${w.kind || 'razina ' + w.lv}`), el('b', null, pct(w.v) + ' %'), el('button', 'btn small', 'Ispiši listić za ovo'));
    row.lastChild.onclick = () => printSheet(w.g, w.lv, w.kind, $('wsFlip').checked);
    box.append(row);
  });

  const del = el('button', 'reset', `Obriši napredak: ${selected}`);
  del.onclick = () => {
    if (!confirm(`Obrisati SAV napredak za ${selected}? To se ne može vratiti (osim iz spremljene datoteke).`)) return;
    removePlayer(selected);
    openParents();
  };
  box.append(del);
}

function fillGames() {
  if ($('wsGame').options.length) return;
  Object.values(SUBJECTS).flat().forEach(id => $('wsGame').add(new Option(GAMES[id].title, id)));
  $('wsGame').onchange = () => {
    $('wsLevel').innerHTML = '';
    for (let lv = 1; lv <= (GAMES[$('wsGame').value].maxLevel || 1); lv++) $('wsLevel').add(new Option('Razina ' + lv, lv));
    $('wsLevel').hidden = $('wsLevel').options.length < 2;
  };
  $('wsGame').onchange();
  $('wsPrint').onclick = () => printSheet($('wsGame').value, +$('wsLevel').value, '', $('wsFlip').checked);
  $('pExport').onclick = exportFile;
  $('pImport').onchange = async e => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f || !confirm('Učitati napredak iz datoteke? Djeca istog imena bit će zamijenjena.')) return;
    try { alert(`Učitano: ${importText(await f.text())} djece.`); openParents(); }
    catch (err) { alert('Ova datoteka nije spremljeni napredak.'); }
  };
}

// 10 zadataka (5 za brojevnu crtu, treba cijeli redak, da stane na A4); s `kind` samo ta vrsta zadatka (npr. "oduzimanje")
export function printSheet(id, level, kind, flip) {
  const g = GAMES[id], tasks = [], seen = new Set();
  const n = g.make(level).labels ? 5 : 10;
  for (let i = 0; i < 500 && tasks.length < n; i++) {
    const t = g.make(level), s = sig(t);
    if ((!kind || t.kind === kind) && !seen.has(s)) { seen.add(s); tasks.push(t); } // bez ponavljanja na listiću
  }
  const answers = t => (t.steps || [t.answer]).map(optHtml).join(' ');
  // broj, slovo ili znak se upisuje (vježba pisanja); sličice i boje se zaokružuju; brojevna crta se označava na crti
  const write = t => !t.labels && (t.steps || [t.answer]).every(a => typeof a === 'number' || /^[\p{Lu}<>=]+$/u.test(a));
  const view = t => t.show ? t.show(0) : t.view;
  const opts = t => write(t) ? (g.sticky ? plain(t) : view(t).includes('class="slot') ? '' : '<div class="wbox"></div>') : t.labels ? line(t) : plain(t);
  const line = t => `<div class="answers line" style="grid-template-columns:repeat(${t.options.length},1fr);--n:${t.options.length}">${t.labels.map(l => `<button>${l}</button>`).join('')}</div>`;
  const plain = t => `<div class="answers" style="grid-template-columns:repeat(${t.options.length},1fr)">${t.options.map(o => `<button>${optHtml(o)}</button>`).join('')}</div>`;
  const key = `<div class="key${flip ? ' flip' : ''}"><b>Rješenja</b> ${tasks.map((t, i) => `<span>${i + 1}. ${answers(t)}</span>`).join('')}</div>`;
  $('sheet').style.setProperty('--c', g.color);
  $('sheet').innerHTML = `<div class="sheet-head"><b>${g.title}${kind ? ': ' + kind : ''}</b><span>Ime: ________________</span><span>Datum: __________</span></div>` +
    `<p class="sheet-how">${paperHow(g.how, tasks.every(write) ? 'upiši' : tasks.some(write) ? 'upiši ili zaokruži' : 'zaokruži')}</p>` +
    `<div class="tasks">${tasks.map((t, i) => `<div class="task${t.labels ? ' wide' : ''}"><span class="tno">${i + 1}</span><div class="tbody"><div class="q">${view(t)}</div>${opts(t)}</div></div>`).join('')}</div>` + key;
  window.print();
}

// upute iz igre prilagođene papiru: "dodirni" -> "upiši" / "zaokruži"
function paperHow(how, verb) {
  const cap = s => s[0].toUpperCase() + s.slice(1);
  return how.replace('Okreni mobitel. ', '').replace(/dodiruj|dodirni/gi, m =>
    (m[0] === 'D' ? cap : x => x)(m.length > 7 ? verb.replace('upiši', 'upisuj').replace('zaokruži', 'zaokružuj') : verb));
}
