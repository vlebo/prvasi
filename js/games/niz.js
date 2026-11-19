import { MAX, numberOptions, optHtml, rnd, shuffle, slot } from '../lib.js';

export default { title: 'Nastavi niz', learns: 'uočavanje pravila u nizu sličica i brojeva', color: '#8a5cf6', maxLevel: 4,
  how: 'Pogledaj kako se sličice ponavljaju ili kako brojevi rastu i padaju. Što dolazi sljedeće? Dodirni.',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><circle cx="22" cy="50" r="9" fill="#fff"/><rect x="36" y="41" width="18" height="18" rx="3" fill="#fff"/><circle cx="68" cy="50" r="9" fill="#fff"/><text x="86" y="60" font-size="28" font-weight="900" fill="#fff" text-anchor="middle" font-family="system-ui">?</text></svg>',
  // sličice: 1: AB · 2: AAB / ABB · 3: ABC · 4: AABC / ABCC
  // brojevi: 1: +1 · 2: i −1 · 3: i +2 · 4: i −2
  make(level) {
    if (Math.random() < 0.5) {
      const step = [1, -1, 2, -2][rnd(level)], n = 4;
      const start = step > 0 ? rnd(MAX - step * n + 1) : -step * n + rnd(MAX + step * n + 1); // cijeli niz unutar 0–MAX
      const seq = Array.from({ length: n + 1 }, (_, i) => start + i * step), answer = seq[n];
      const show = k => '<div class="eq small">' + seq.slice(0, n).map(x => `<span class="box">${x}</span>`).join('') + slot(answer, 0, k) + '</div>';
      return { kind: 'niz brojeva', show, steps: [answer], options: numberOptions(answer) };
    }
    const sets = [['#e53935', '#1e88e5', '#fdd835', '#43a047'], ['🍎', '🍌', '🍇', '🍐'], ['⭐', '🌙', '❤️', '☀️'], ['🐱', '🐶', '🐭', '🐰']];
    const [a, b, c, d] = shuffle([...sets[rnd(sets.length)]]);
    const pattern = shuffle([[[a, b]], [[a, a, b], [a, b, b]], [[a, b, c]], [[a, a, b, c], [a, b, c, c]]][level - 1])[0];
    const len = pattern.length * 2 + rnd(pattern.length) + (pattern.length < 3 ? 1 : 0);
    const seq = Array.from({ length: len + 1 }, (_, i) => pattern[i % pattern.length]);
    const answer = seq[len];
    const opts = new Set([answer, ...shuffle([...new Set(pattern)])]);
    if (opts.size < 3) opts.add(d);
    const show = k => '<div class="eq small" style="flex-wrap:wrap;justify-content:center">' +
      seq.slice(0, len).map(x => `<span>${optHtml(x)}</span>`).join('') + slot(optHtml(answer), 0, k) + '</div>';
    return { kind: 'niz sličica', show, steps: [answer], options: shuffle([...opts].slice(0, 3)) };
  } };
