import { rnd, shuffle } from '../lib.js';

// Brojevna crta 0–R kao SVG, bez brojeva: brojevi su gumbi ispod (.answers.line), poravnati s crticama.
// Žaba na `frog`; skokovi `from`→`to` se crtaju jedan po jedan, žaba se pojavi na kraju.
function numberLine(R, { frog = null, from = null, to = null, text = '' } = {}) {
  const X = n => (n + .5) * 1000 / (R + 1), size = R > 10 ? 40 : 52;
  let s = `<svg viewBox="0 0 1000 180" style="width:min(100%,900px);display:block"><defs><marker id="nl-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--c)"/></marker></defs>`;
  if (text) s += `<text x="500" y="50" font-size="46" font-weight="900" text-anchor="middle" fill="#2f2a3a">${text}</text>`;
  s += `<line x1="${X(0) - 25}" y1="160" x2="${X(R) + 25}" y2="160" stroke="#2f2a3a" stroke-width="5" stroke-linecap="round"/>`;
  for (let n = 0; n <= R; n++) s += `<line x1="${X(n)}" y1="146" x2="${X(n)}" y2="174" stroke="#2f2a3a" stroke-width="4"/>`;
  if (from !== null) {
    const d = to > from ? 1 : -1;
    s += `<text x="${X(from)}" y="148" font-size="${size}" text-anchor="middle" opacity=".35">🐸</text>`;
    for (let n = from, i = 0; n !== to; n += d, i++)
      s += `<path class="hop" style="stroke:var(--c);animation-delay:${i * .3}s" d="M${X(n)} 140Q${(X(n) + X(n + d)) / 2} 70 ${X(n + d)} 140" fill="none" stroke-width="5" marker-end="url(#nl-arr)"/>`;
    s += `<text class="hop" style="animation-delay:${Math.abs(to - from) * .3}s" x="${X(to)}" y="148" font-size="${size}" text-anchor="middle">🐸</text>`;
  } else if (frog !== null) s += `<text x="${X(frog)}" y="148" font-size="${size}" text-anchor="middle">🐸</text>`;
  return s + '</svg>';
}

export default { title: 'Brojevna crta', learns: 'brojevnu crtu: redoslijed brojeva, zbrajanje i oduzimanje skokovima', color: '#2a9d8f', maxLevel: 4, landscape: true,
  how: 'Okreni mobitel. Gdje je zadani broj? Broji crtice i dodirni pravo mjesto na crti. Na višoj razini žabica skače: kreni od žabice, broji skokove i dodirni mjesto na kojem će doskočiti.',
  pause: 1500, // da se stigne vidjeti skok do točnog broja
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><path d="M14 64h72M22 56v16M50 56v16M78 56v16" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M22 50Q36 24 50 50" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>',
  // odgovor je dodir na crtu: options su svi brojevi 0–R, labels što piše ispod crtice
  // 1: gdje je broj · 2: i skokovi udesno (+), svi brojevi upisani · 3: skokovi udesno i ulijevo (−) · 4: sve, crta do 20
  make(level) {
    const R = level === 4 ? 20 : 10, options = [...Array(R + 1).keys()];
    const kinds = [['where'], ['where', 'plus'], ['plus', 'minus'], ['where', 'plus', 'minus']][level - 1], kind = kinds[rnd(kinds.length)];
    // upisano samo nekoliko brojeva (0, 5, 10… ili 3 nasumična), nikad točan odgovor: ostalo se broji po crticama
    const someLabels = ans => {
      const shown = Math.random() < 0.5 ? options.filter(n => n % 5 === 0) : shuffle(options.filter(n => n !== ans)).slice(0, 3);
      return options.map(n => shown.includes(n) && n !== ans ? n : '');
    };
    if (kind === 'where') {
      const answer = rnd(R + 1);
      return { kind: 'pokaži broj', view: numberLine(R, { text: `Gdje je ${answer}?` }), reveal: numberLine(R, { frog: answer, text: `Gdje je ${answer}?` }),
               answer, options, labels: someLabels(answer) };
    }
    const b = 1 + rnd(level === 4 ? 6 : 5), plus = kind === 'plus';
    const a = plus ? rnd(R - b + 1) : b + rnd(R - b + 1), answer = plus ? a + b : a - b;
    const text = `${a} ${plus ? '+' : '−'} ${b} = `;
    return { kind: plus ? 'skok udesno (+)' : 'skok ulijevo (−)', view: numberLine(R, { frog: a, text: text + '?' }), // skokovi tek u rješenju, inače odaju rezultat
             reveal: numberLine(R, { from: a, to: answer, text: text + answer }),
             answer, options, labels: level === 2 ? options : someLabels(answer) };
  } };
