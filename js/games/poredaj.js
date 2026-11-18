import { MAX, rnd, shuffle } from '../lib.js';

export default { title: 'Poredaj brojeve', learns: 'redoslijed brojeva od najmanjeg do najvećeg', color: '#0e9fb3', maxLevel: 4, sticky: true,
  how: 'Dodiruj brojeve redom, od najmanjeg do najvećeg. Kućice rastu kao brojevi. Na razini 4 ide obrnuto!',
  icon: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.2)"/><rect x="24" y="56" width="14" height="18" rx="4" fill="#fff"/><rect x="43" y="44" width="14" height="30" rx="4" fill="#fff"/><rect x="62" y="30" width="14" height="44" rx="4" fill="#fff"/></svg>',
  // 1: 3 broja · 2: 4 broja · 3: 5 brojeva · 4: 4 broja od najvećeg
  make(level) {
    const [count, down] = [[3, false], [4, false], [5, false], [4, true]][level - 1];
    const nums = new Set();
    while (nums.size < count) nums.add(rnd(MAX + 1));
    const steps = [...nums].sort((a, b) => down ? b - a : a - b);
    // kućice rastu (ili padaju) da se bez čitanja vidi smjer
    const show = k => '<div class="eq small">' + steps.map((n, i) =>
      `<span class="slot${i < k ? ' filled' : i === k ? ' active' : ''}" style="font-size:${(down ? count - 1 - i : i) * .15 + .8}em">${i < k ? n : '&nbsp;'}</span>`).join('') + '</div>';
    return { show, steps, options: shuffle([...nums]) };
  } };
