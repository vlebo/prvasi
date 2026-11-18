// Efekti i sitni UI dijelovi: konfeti, zvuk, animacije rang liste
import { $, rnd, AVATARS } from './lib.js';

export const avBg = a => AVATARS.includes(a) ? `hsl(${AVATARS.indexOf(a) * 360 / AVATARS.length} 85% 88%)` : '#fff';
export const STAR = '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="#f5b700" d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z"/></svg>';
export const ARROW = '<svg viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" d="M12 20V5M5 11l7-7 7 7"/></svg>';
export const CROWN = '<svg viewBox="0 0 24 24"><path fill="#fff" d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>';
export const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Avatar + ime; ime uvijek kao tekst (unos korisnika)
export function chip(av, name, tag = 'span') {
  const el = document.createElement(tag);
  el.className = 'chip';
  el.innerHTML = '<span class="avatar"></span><span></span>';
  el.children[0].textContent = av;
  el.children[0].style.background = avBg(av);
  el.children[1].textContent = name;
  return el;
}

// Papirnati konfeti
export function confetti(n) {
  if (calm) return;
  const colors = ['#5b6cff', '#1fa774', '#f07b2e', '#f5b700', '#ef5350', '#9b5de5'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'fx';
    c.style.cssText += `left:${rnd(100)}vw;top:-20px;width:${8 + rnd(8)}px;height:${12 + rnd(10)}px;border-radius:3px;background:${colors[rnd(6)]}`;
    document.body.append(c);
    c.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: `translateY(110vh) translateX(${rnd(200) - 100}px) rotate(${rnd(1080)}deg)` }],
      { duration: 2200 + rnd(1800), delay: rnd(700), easing: 'cubic-bezier(.3,.6,.6,1)', fill: 'backwards' }).onfinish = () => c.remove();
  }
}

// "+10" koji odleti s gumba
export function floatText(text, el) {
  if (calm) return;
  const r = el.getBoundingClientRect(), f = document.createElement('span');
  f.className = 'fx plus';
  f.textContent = text;
  f.style.cssText += `left:${r.left + r.width / 2 - 40}px;top:${r.top - 20}px`;
  document.body.append(f);
  f.animate([{ transform: 'translateY(0) scale(.6)', opacity: 1 }, { transform: 'translateY(-60px) scale(1.2)', opacity: 1, offset: .4 },
             { transform: 'translateY(-150px) scale(1)', opacity: 0 }], { duration: 900 }).onfinish = () => f.remove();
}

export function countUp(el, to) {
  const t0 = performance.now();
  const step = t => {
    const p = calm ? 1 : Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(to * (1 - (1 - p) ** 3));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function tag(icon, text) {
  const t = document.createElement('span');
  t.className = 'tag';
  t.innerHTML = icon;
  t.append(text);
  $('tags').append(t);
  if (!calm) t.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 400 });
}

// Penjanje: moj red klizi odozdo na novo mjesto, ostali se pomaknu dolje
export function climb(oldIdx, newIdx) {
  const rows = [...$('board').querySelectorAll('.row')];
  if (newIdx >= rows.length || (oldIdx !== -1 && oldIdx <= newIdx)) return;
  const from = oldIdx === -1 ? rows.length : Math.min(oldIdx, rows.length);
  const steps = from - newIdx;
  setTimeout(() => {
    if (newIdx === 0) tag(CROWN, 'Prvo mjesto!');
    else tag(ARROW, oldIdx === -1 ? `${newIdx + 1}. mjesto` : `${steps} ${steps === 1 ? 'mjesto' : 'mjesta'} gore`);
    if (newIdx < 3) confetti(70);
  }, calm ? 0 : 900 + 300 * steps);
  if (calm) return;
  const h = rows[newIdx].offsetHeight;
  const opts = { duration: 300 * steps + 500, delay: 900, easing: 'ease-in-out', fill: 'backwards' };
  rows[newIdx].animate([{ transform: `translateY(${steps * h}px) scale(1.06)`, boxShadow: '0 8px 20px rgba(0,0,0,.15)' },
    { transform: 'scale(1.06)', boxShadow: '0 8px 20px rgba(0,0,0,.15)', offset: .85 }, { transform: 'none', boxShadow: 'none' }], opts);
  for (let i = newIdx + 1; i <= Math.min(from, rows.length - 1); i++)
    rows[i].animate([{ transform: `translateY(${-h}px)` }, { transform: 'none' }], opts);
}

let audio;
export function beep(ok) {
  audio = audio || new AudioContext();
  const o = audio.createOscillator(), g = audio.createGain();
  o.frequency.value = ok ? 880 : 220;
  g.gain.setValueAtTime(0.2, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.3);
  o.connect(g).connect(audio.destination);
  o.start(); o.stop(audio.currentTime + 0.3);
}
