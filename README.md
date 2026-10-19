# Maths Worlds

A comprehension-first maths app for children: floating worlds of islands (fractions, decimals, shapes, ratio, word problems, time, money, graphs) and a final boss, the Eclipse.

- **Play:** open the site and use "Add to Home Screen" on a tablet for a full-screen app that works offline.
- **Progress** is stored only on the device (browser storage). Nothing is sent anywhere.
- One self-contained `index.html`; `sw.js` keeps an offline copy; fonts are Lexend and Fraunces (SIL Open Font License, see `fonts/`).

## Making changes

- The game is written as small files in `src/` (one per island, plus engine and shell). `src/build.sh` joins them into one page.
- `python3 tools/make_site.py` rebuilds everything: runs the build, writes `index.html`, and bumps the offline cache version in `sw.js` so tablets pick up the new version next time they open it online.
- Commit and push to `main`; GitHub Pages publishes it.
