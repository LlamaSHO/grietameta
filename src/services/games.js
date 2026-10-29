/* Catálogo de juegos del sitio (public/data/games.json).
   Para añadir un juego basta con añadirlo a ese archivo. */

let gamesPromise = null;

export function fetchGames() {
  if (!gamesPromise) {
    gamesPromise = fetch("/data/games.json")
      .then((r) => (r.ok ? r.json() : { games: [] }))
      .then((d) => d.games || [])
      .catch(() => []);
  }
  return gamesPromise;
}

export function normalize(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// 0 = coincidencia exacta, 1 = empieza por lo escrito, 2 = lo contiene, -1 = no coincide
function score(game, q) {
  const names = [game.name, game.short, ...(game.aliases || [])].map(normalize).filter(Boolean);
  let best = -1;
  for (const n of names) {
    if (n === q) return 0;
    const s = n.indexOf(q) === 0 ? 1 : n.indexOf(q) > -1 ? 2 : -1;
    if (s > -1 && (best === -1 || s < best)) best = s;
  }
  return best;
}

export function matchGames(games, query) {
  const q = normalize(query);
  if (!q) return games.slice();
  return games
    .map((g) => ({ g, s: score(g, q) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => a.s - b.s)
    .map((x) => x.g);
}
