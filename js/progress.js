// Napredak po djetetu, samo na ovom uređaju. Zaseban ključ: "Obriši rang liste" ga ne dira.
// { "Ana": { avatar, days: ["2026-11-19", ...], games: { crta: { "3|skok ulijevo (−)": [točno, ukupno], ... } } } }
const KEY = 'napredak';
export const loadAll = () => JSON.parse(localStorage.getItem(KEY) || '{}');
const saveAll = p => localStorage.setItem(KEY, JSON.stringify(p));

export function record(player, avatar, game, level, kind, ok) {
  const p = loadAll(), me = p[player] ||= { avatar, days: [], games: {} };
  me.avatar = avatar;
  const today = new Date().toLocaleDateString('sv'); // YYYY-MM-DD po lokalnom vremenu
  if (me.days.at(-1) !== today) me.days = [...me.days, today].slice(-90);
  const k = `${level}|${kind || ''}`, s = (me.games[game] ||= {})[k] ||= [0, 0];
  s[0] += ok; s[1]++;
  saveAll(p);
}

export function removePlayer(player) {
  const p = loadAll();
  delete p[player];
  saveAll(p);
}

export function exportFile() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(loadAll(), null, 1)], { type: 'application/json' }));
  a.download = `napredak-${new Date().toLocaleDateString('sv')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Uvoz iz datoteke: provjera oblika jer datoteku može donijeti bilo tko; uvezeni igrači zamjenjuju postojeće istog imena
export function importText(text) {
  const data = JSON.parse(text), p = loadAll();
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('nije datoteka napretka');
  for (const [name, d] of Object.entries(data)) {
    if (!d || typeof d.games !== 'object' || !Array.isArray(d.days)) throw new Error('nije datoteka napretka');
    const games = {};
    for (const [g, ks] of Object.entries(d.games)) {
      games[g] = {};
      for (const [k, v] of Object.entries(ks || {})) {
        const [ok, n] = Array.isArray(v) ? v.map(Number) : [];
        if (n > 0 && ok >= 0 && ok <= n) games[g][k] = [ok, n];
      }
    }
    p[String(name).slice(0, 15)] = { avatar: String(d.avatar || '🙂').slice(0, 4), days: d.days.map(String).slice(-90), games };
  }
  saveAll(p);
  return Object.keys(data).length;
}
