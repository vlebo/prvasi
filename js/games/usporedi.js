import { MAX, rnd, shuffle, sign, slot } from '../lib.js';

export default { title: 'Veće ili manje', learns: 'uspoređivanje brojeva i znakove <, >, =', color: '#d94f8a', maxLevel: 5,
  how: 'Usporedi brojeve i dodirni ono što ide u praznu kućicu: znak (< manje, > veće, = jednako) ili, na višoj razini, broj.',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><path d="M40 30L22 50l18 20M60 30l18 20-18 20" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // 1: dva broja · 2: izaberi broj · 3: tri broja · 4: zbroj i broj · 5: zbroj i zbroj
  make(level) {
    if (level === 2) {
      // npr. 7 > [?]: od 3 ponuđena broja točno jedan odgovara znaku
      let a, op, ok, bad;
      do {
        a = rnd(MAX + 1); op = '<=>'[rnd(3)];
        const all = [...Array(MAX + 1).keys()];
        ok = all.filter(x => sign(a, x) === op);
        bad = all.filter(x => sign(a, x) !== op);
      } while (!ok.length || bad.length < 2);
      const answer = ok[rnd(ok.length)], left = Math.random() < 0.5; // nepoznati broj lijevo ili desno
      const opFlip = { '<': '>', '>': '<', '=': '=' }[op];
      const show = k => '<div class="eq">' + (left
        ? `${slot(answer, 0, k)}<span class="op">${opFlip}</span><span class="box">${a}</span>`
        : `<span class="box">${a}</span><span class="op">${op}</span>${slot(answer, 0, k)}`) + '</div>';
      return { show, steps: [answer], options: shuffle([answer, ...shuffle(bad).slice(0, 2)]) };
    }
    const near = x => Math.random() < 0.2 ? x : rnd(MAX + 1); // "=" ne smije biti prerijedak
    const sum = (total = rnd(MAX + 1)) => { const x = rnd(total + 1); return [total, `${x}+${total - x}`]; };
    let items;
    if (level === 1) { const a = rnd(MAX + 1); items = [[a], [near(a)]]; }
    else if (level === 3) { const a = rnd(MAX + 1), b = near(a); items = [[a], [b], [near(b)]]; }
    else { const s1 = sum(); items = [s1, level === 4 ? [near(s1[0])] : sum(near(s1[0]))]; }
    const steps = items.slice(1).map(([v], i) => sign(items[i][0], v));
    const show = k => `<div class="eq${level > 1 ? ' small' : ''}">` + items.map(([v, label = v], i) =>
      (i ? slot(steps[i - 1], i - 1, k) : '') + `<span class="box">${label}</span>`).join('') + '</div>';
    return { show, steps, options: ['<', '=', '>'] }; // uvijek isti redoslijed znakova
  } };
