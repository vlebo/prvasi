import { $, AVATARS, optHtml, rnd, fresh } from './lib.js';
import { avBg, STAR, calm, chip, confetti, floatText, countUp, tag, climb, beep } from './ui.js';
import { load, save, remove, ranked } from './scores.js';
import { GAMES, SUBJECTS } from './games/index.js';
import { record, loadAll } from './progress.js';
import { openParents } from './parents.js';
import { showNews } from './news.js';

const DURATIONS = [30, 60, 90, 120];
const durLabel = d => `${d} s`;
let seconds = +localStorage.getItem('trajanje');
if (!DURATIONS.includes(seconds)) seconds = 60; // npr. spremljeno staro trajanje koje više ne postoji

let player = null, avatar = AVATARS[0], game = null, score = 0, streak = 0, solved = 0, step = 0, current = null, timer = null, locked = false, recent = new Set();
const PER_LEVEL = 5; // točnih zadataka do sljedeće razine
const levelOf = () => Math.min(GAMES[game].maxLevel || 1, 1 + Math.floor(solved / PER_LEVEL));

function setColor(c) { document.body.style.setProperty('--c', c); }

function renderBoard(el, id) {
  const g = GAMES[id];
  el.style.setProperty('--c', g.color);
  el.innerHTML = `<h3>${g.icon}${g.title}<small style="margin-left:auto;opacity:.8">${durLabel(seconds)}</small></h3><div class="rows"></div>`;
  const list = el.lastChild, rows = ranked(load(id, seconds)).slice(0, 10);
  if (!rows.length) list.innerHTML = '<div class="empty">Još nitko nije igrao</div>';
  rows.forEach(([name, r], i) => {
    const row = document.createElement('div');
    row.className = 'row' + (name === player ? ' me' : '');
    row.innerHTML = '<span class="rank"></span><span class="avatar"></span><span class="name"></span><span class="pts"></span>';
    [i + 1, r.avatar, name, r.score].forEach((t, k) => row.children[k].textContent = t);
    row.children[1].style.background = avBg(r.avatar);
    list.append(row);
  });
}

function show(id) {
  document.body.classList.toggle('need-landscape', ['introScreen', 'gameScreen'].includes(id) && !!GAMES[game]?.landscape);
  ['pickScreen','menuScreen','introScreen','gameScreen','endScreen','parentScreen'].forEach(s => $(s).hidden = s !== id);
  scrollTo(0, 0);
}

function pickScreen() {
  player = null;
  setColor('#5b6cff');
  const all = Object.assign({}, loadAll(), ...Object.keys(GAMES).flatMap(id => DURATIONS.map(d => load(id, d)))); // svi igrači iz svih igara
  $('players').innerHTML = '';
  const names = Object.entries(all).sort();
  names.forEach(([name, r]) => {
    const b = chip(r.avatar, name, 'button');
    b.className = 'player';
    b.onclick = () => { player = name; avatar = r.avatar; menuScreen(); };
    $('players').append(b);
  });
  const add = chip('+', 'Novi igrač', 'button');
  add.className = 'player add';
  add.onclick = () => { $('newPlayer').hidden = false; $('newPlayer').scrollIntoView({ behavior: 'smooth' }); $('name').focus(); };
  $('players').append(add);
  $('newPlayer').hidden = names.length > 0; // forma odmah otvorena samo kad još nema igrača
  $('name').value = '';
  $('durations').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.secs === seconds));
  $('boards').innerHTML = '';
  bySubject($('boards'), 'boards', id => {
    const d = document.createElement('div');
    d.className = 'board';
    renderBoard(d, id);
    const del = document.createElement('button');
    del.className = 'del';
    del.title = del.ariaLabel = 'Obriši ovu rang listu';
    del.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';
    del.onclick = () => {
      if (!confirm(`Obrisati rang listu: ${GAMES[id].title} (${durLabel(seconds)})?`)) return;
      remove(id, seconds);
      pickScreen();
    };
    d.firstChild.append(del);
    return d;
  });
  show('pickScreen');
}

// Naslov predmeta + mreža elemenata koje vraća make(id)
function bySubject(container, cls, make) {
  container.innerHTML = '';
  Object.entries(SUBJECTS).forEach(([name, ids]) => {
    const h = document.createElement('h2'), grid = document.createElement('div');
    h.className = 'subject';
    h.textContent = name;
    grid.className = cls;
    grid.append(...ids.map(make));
    container.append(h, grid);
  });
}

function menuScreen() {
  setColor('#5b6cff');
  $('hello').textContent = `Bok, ${player}!`;
  bySubject($('menu'), 'menu', id => {
    const g = GAMES[id];
    const b = document.createElement('button');
    b.className = 'game-card shade';
    b.style.setProperty('--c', g.color);
    b.innerHTML = g.icon + g.title + `<small class="learns">${g.learns}</small>`;
    b.onclick = () => { game = id; startGame(); };
    return b;
  });
  show('menuScreen');
}

AVATARS.forEach(a => {
  const b = document.createElement('button');
  b.textContent = a;
  b.style.background = avBg(a);
  b.setAttribute('aria-pressed', a === avatar);
  b.onclick = () => {
    avatar = a;
    document.querySelectorAll('.avatars button').forEach(x => x.setAttribute('aria-pressed', x === b));
  };
  $('avatars').append(b);
});

$('startNew').onclick = () => {
  const name = $('name').value.trim();
  if (!name) { $('name').focus(); return; }
  player = name;
  menuScreen();
};

DURATIONS.forEach(d => {
  const b = document.createElement('button');
  b.textContent = durLabel(d);
  b.dataset.secs = d;
  b.onclick = () => { seconds = d; localStorage.setItem('trajanje', d); pickScreen(); };
  $('durations').append(b);
});

function goHome() {
  clearInterval(timer); timer = null; // prekinuta igra se ne sprema
  pickScreen();
}

// "Brava" za Kutak za roditelje: samo da ga dijete slučajno ne otvori, nije zaštita
$('parents').onclick = () => {
  const a = 12 + rnd(8), b = 3 + rnd(7), r = prompt(`Samo za roditelje: koliko je ${a} × ${b}?`);
  if (r === null) return;
  if (+r !== a * b) { alert('Nije točno.'); return; }
  setColor('#5b6cff');
  openParents();
  show('parentScreen');
};

// Uvodni opis se pokazuje dok ga netko ne zatvori
$('about').hidden = !!localStorage.getItem('uvod-zatvoren');
$('aboutClose').onclick = () => { localStorage.setItem('uvod-zatvoren', 1); $('about').hidden = true; };

$('reset').onclick = () => {
  if (!confirm('Obrisati SVE rang liste? Napredak djece u Kutku za roditelje ostaje.')) return;
  Object.keys(GAMES).forEach(id => DURATIONS.forEach(d => remove(id, d)));
  pickScreen();
};

function renderStatus() {
  $('scorePill').innerHTML = STAR + score;
  $('streak').innerHTML = [0, 1, 2].map(i => `<i class="${i < streak ? 'on' : ''}"></i>`).join('') +
    (streak >= 3 ? '<span class="x2">x2</span>' : '');
  const max = GAMES[game].maxLevel, lv = levelOf();
  $('level').innerHTML = max ? `Razina ${lv}<span class="lvbar"><b style="width:${lv === max ? 100 : solved % PER_LEVEL / PER_LEVEL * 100}%"></b></span>` : '';
}

function levelUp(lv) {
  confetti(30);
  if (calm) return;
  const f = document.createElement('div');
  f.className = 'fx levelup shade';
  f.textContent = `Razina ${lv}!`;
  document.body.append(f);
  f.animate([{ transform: 'translate(-50%,-50%) scale(0)' }, { transform: 'translate(-50%,-50%) scale(1.1)', offset: .25 },
             { transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: .8 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }],
            { duration: 1400, fill: 'forwards' }).onfinish = () => f.remove();
}

const view = k => current.show ? current.show(k) : k ? current.reveal || current.view : current.view;

function nextTask() {
  current = fresh(() => GAMES[game].make(levelOf()), recent);
  current.steps = current.steps || [current.answer];
  step = 0;
  $('question').innerHTML = view(0);
  $('answers').innerHTML = '';
  $('answers').className = 'answers' + (current.labels ? ' line' : current.options.length > 3 ? ' many' : '');
  $('answers').style.gridTemplateColumns = `repeat(${current.options.length}, 1fr)`;
  $('answers').style.setProperty('--n', current.options.length);
  current.options.forEach((n, i) => {
    const b = document.createElement('button');
    b.innerHTML = current.labels ? current.labels[i] : optHtml(n);
    b.onclick = () => answer(n, b);
    $('answers').append(b);
  });
  if (!calm) $('question').firstChild.animate([{ transform: 'scale(.8)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 250, easing: 'ease-out' });
  locked = false;
}

function answer(n, btn) {
  if (locked) return;
  const ok = n === current.steps[step];
  beep(ok);
  // međukorak višekoračnog zadatka (tri broja, poredaj)
  if (ok && step < current.steps.length - 1) {
    step++;
    $('question').innerHTML = view(step);
    btn.className = 'ok';
    if (GAMES[game].sticky) btn.disabled = true;
    else setTimeout(() => btn.className = '', 250);
    return;
  }
  locked = true;
  const before = levelOf();
  record(player, avatar, game, before, current.kind, ok);
  if (ok) {
    streak++; solved++;
    const pts = 10 * before * (streak >= 3 ? 2 : 1); // teža razina = više bodova, niz od 3+ = dupli
    score += pts;
    floatText('+' + pts, btn);
  } else {
    streak = 0; // nema minus bodova
    btn.className = 'bad';
    if (!calm) btn.animate([0, -12, 12, -8, 8, 0].map(x => ({ transform: `translateX(${x}px)` })), { duration: 400 });
  }
  const right = $('answers').children[current.options.indexOf(current.steps[step])];
  right.className = 'ok';
  right.innerHTML = optHtml(current.steps[step]); // broj se pokaže i ako ispod crtice nije pisao
  $('question').innerHTML = view(current.steps.length);
  renderStatus();
  if (levelOf() > before) levelUp(levelOf());
  setTimeout(() => timer && nextTask(), (ok ? 650 : 1500) + (game === 'slovo' ? 500 : 0) + (GAMES[game].pause || 0) + (levelOf() > before ? 600 : 0));
}

// Upute s riješenim primjerom prije svake runde
function startGame() {
  const g = GAMES[game];
  setColor(g.color);
  $('introTitle').textContent = g.title;
  $('introLearns').textContent = 'Vježbamo: ' + g.learns;
  $('introHow').textContent = g.how;
  const ex = g.make(1), steps = ex.steps || [ex.answer];
  $('exQ').innerHTML = ex.show ? ex.show(steps.length) : ex.reveal || ex.view;
  $('exA').style.gridTemplateColumns = `repeat(${ex.options.length}, 1fr)`;
  $('exA').style.setProperty('--n', ex.options.length);
  $('exA').className = 'answers' + (ex.labels ? ' line' : '');
  $('exA').innerHTML = '';
  ex.options.forEach((o, i) => { const b = document.createElement('button'); b.innerHTML = ex.labels && !steps.includes(o) ? ex.labels[i] : optHtml(o); if (steps.includes(o)) b.className = 'ok'; $('exA').append(b); });
  $('introRules').innerHTML = [
    ['⏱', `Imaš ${durLabel(seconds)}.`],
    ['+', 'Točan odgovor donosi bodove.'],
    ['x2', 'Tri točna zaredom: dupli bodovi!'],
    ...(g.maxLevel ? [['↑', `Svakih ${PER_LEVEL} točnih: teža razina i više bodova.`]] : []),
  ].map(([i, t]) => `<li><b>${i}</b>${t}</li>`).join('');
  show('introScreen');
}

function play() {
  score = 0; streak = 0; solved = 0; recent = new Set();
  let left = seconds;
  setColor(GAMES[game].color);
  $('who').replaceChildren(chip(avatar, player));
  renderStatus();
  const bar = $('timer');
  bar.className = 'timer';
  bar.firstChild.style.transition = 'none';
  bar.firstChild.style.width = '100%';
  show('gameScreen');
  bar.offsetWidth; // reset trake prije nove animacije
  bar.firstChild.style.transition = '';
  timer = setInterval(() => {
    left--;
    bar.firstChild.style.width = (left / seconds * 100) + '%';
    bar.classList.toggle('low', left <= Math.min(10, seconds / 3));
    if (left <= 0) endGame();
  }, 1000);
  nextTask();
}

function endGame() {
  clearInterval(timer); timer = null;
  const board = load(game, seconds);
  const order = () => ranked(board).map(e => e[0]);
  const oldIdx = order().indexOf(player);
  const best = board[player]?.score ?? -1;
  board[player] = { avatar, score: Math.max(score, best) };
  save(game, seconds, board);
  $('bravo').textContent = `Bravo, ${player}!`;
  $('tags').innerHTML = '';
  renderBoard($('board'), game);
  show('endScreen');
  countUp($('result'), score);
  if (score > best && best >= 0) setTimeout(() => tag(STAR.replace('#f5b700', '#fff'), 'Novi rekord!'), calm ? 0 : 700);
  confetti(30);
  climb(oldIdx, order().indexOf(player));
}

// HTML gumbi zovu ove funkcije preko onclick="..."
Object.assign(window, { goHome, play, startGame, menuScreen });

pickScreen();
showNews();
