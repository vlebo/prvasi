import { AVATARS, rnd, shuffle } from '../lib.js';

const arrow = left => `<svg viewBox="0 0 24 24"><path fill="none" style="stroke:var(--c)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" d="${left ? 'M20 12H5M11 5l-7 7 7 7' : 'M4 12h15M13 5l7 7-7 7'}"/></svg>`;

export default { title: 'Lijevo ili desno', learns: 'snalaženje u prostoru: lijevo i desno', color: '#3a86ff', maxLevel: 2,
  how: 'Pogledaj strelicu. Tko je skroz lijevo ili desno? Na razini 2: tko je lijevo ili desno od zadane životinje?',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><path d="M44 50H18M28 38L16 50l12 12M56 50h26M72 38l12 12-12 12" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // 1: tko je skroz lijevo/desno · 2: tko je lijevo/desno od X
  make(level) {
    const scene = shuffle([...AVATARS]).slice(0, 4), left = Math.random() < 0.5;
    let ref = null, answer, options;
    if (level === 1) {
      answer = scene[left ? 0 : 3];
      options = shuffle([answer, ...shuffle(scene.filter(x => x !== answer)).slice(0, 2)]);
    } else {
      const i = left ? 1 + rnd(3) : rnd(3);
      ref = scene[i]; answer = scene[left ? i - 1 : i + 1];
      options = shuffle(scene.filter(x => x !== ref));
    }
    const view = k => `<div><div class="scene">${scene.map(x => `<span class="${k && x === answer ? 'hit' : ''}">${x}</span>`).join('')}</div>` +
      `<div class="dir">${arrow(left)}${ref ? `<span>Tko je <b>${left ? 'LIJEVO' : 'DESNO'}</b> od</span> <span class="ref">${ref}</span>` : `<span>Tko je skroz <b>${left ? 'LIJEVO' : 'DESNO'}</b>?</span>`}</div></div>`;
    return { view: view(0), reveal: view(1), answer, options };
  } };
