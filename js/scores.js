// Rang lista po igri i trajanju: najbolji rezultat po igraču, { "Ana": {avatar, score} }
// Sad samo u pregledniku (localStorage); ovdje će ići i globalna rang lista sa servera.
const key = (id, secs) => secs === 60 ? id + '-rang' : `${id}-${secs}-rang`; // 60 s zadržava stari ključ
export const load = (id, secs) => JSON.parse(localStorage.getItem(key(id, secs)) || '{}');
export const save = (id, secs, b) => localStorage.setItem(key(id, secs), JSON.stringify(b));
export const remove = (id, secs) => localStorage.removeItem(key(id, secs));
export const ranked = b => Object.entries(b).sort((x, y) => y[1].score - x[1].score);
