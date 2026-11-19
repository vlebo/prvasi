# Igre za prvašiće

Male obrazovne igre za djecu u prvom razredu. Igraju se u pregledniku, na mobitelu, tabletu ili računalu.

**Igraj:** https://prvasi.lebo.family

## Igre

- **Računko**: izračunaj zadatak i dodirni točan broj
- **Brojalica**: prebroji točkice
- **Prvo slovo**: kojim slovom počinje riječ sa slike?
- **Veće ili manje**: usporedi brojeve
- **Poredaj brojeve**: složi brojeve redom
- **Nastavi niz**: što dolazi sljedeće?
- **Brojevna crta**: pokaži broj na crti i gdje će žabica doskočiti kad zbraja ili oduzima (igra se s položenim mobitelom)
- **Slogovi**: rastavi riječ na slogove
- **Uljez**: pronađi ono što ne pripada skupini
- **Miješanje boja**: koja boja nastaje kad pomiješaš dvije?
- **Zadnje slovo**: kojim slovom završava riječ sa slike?
- **Gdje živi?**: živi li životinja u vodi, u šumi ili uz čovjeka?
- **Lijevo ili desno**: tko je lijevo, a tko desno?

U **Kutku za roditelje** (gumb 👪 na početnoj, otvara se odgovorom na jednostavan račun) vidi se napredak svakog djeteta i što mu ide teže, a mogu se ispisati listići sa zadacima i rješenjima. Napredak je samo na tom uređaju, a može se spremiti u datoteku i učitati na drugom.

Svaka igra traje 30, 60, 90 ili 120 sekundi (bira se na početnoj stranici), a najbolji rezultati spremaju se u rang listu u pregledniku (`localStorage`).

## Pokretanje

Nije potreban build, ali zbog JavaScript modula ne radi dvoklikom (`file://`). Pokreni lokalni server:

```
python3 -m http.server
```

i otvori http://localhost:8000.

## Struktura

```
index.html          zasloni (HTML)
css/style.css       izgled
js/main.js          tijek igre: zasloni, vrijeme, bodovi, razine
js/ui.js            konfeti, zvuk, animacije rang liste
js/scores.js        spremanje rang lista (localStorage)
js/progress.js      napredak djece po igri i vrsti zadatka (localStorage, izvoz/uvoz u datoteku)
js/parents.js       Kutak za roditelje: napredak i listići za ispis
js/news.js          novosti koje se pokažu na početnoj nakon nove verzije
js/lib.js           pomoćne funkcije za igre
js/words.js         riječi sa slikom (Prvo i Zadnje slovo)
js/games/index.js   popis igara, predmeti i provjera generatora zadataka
js/games/*.js       jedna datoteka po igri
```

Novost za korisnike: dodaj novi unos na vrh popisa `NEWS` u `js/news.js`.

Nova igra: napravi `js/games/ime.js` (`export default { title, learns, color, how, icon, make(level) }`) i dodaj je u `js/games/index.js` (u `GAMES` i u `SUBJECTS`).

## Hosting

GitHub Pages s grane `main`, na vlastitoj domeni (datoteka `CNAME`).
