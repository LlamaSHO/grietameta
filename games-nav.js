/* GrietaMeta — buscador de juegos.
   Lee /assets/games.json y, al escribir, sugiere juegos; al elegir uno (clic o
   Enter) lleva a su página. Para añadir un juego basta con añadirlo a games.json. */
(function () {
  "use strict";

  function normalize(s) {
    return String(s).toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  var gamesPromise = null;
  function loadGames() {
    if (!gamesPromise) {
      gamesPromise = fetch("/assets/games.json")
        .then(function (r) { return r.ok ? r.json() : { games: [] }; })
        .then(function (d) { return d.games || []; })
        .catch(function () { return []; });
    }
    return gamesPromise;
  }

  // 0 = coincidencia exacta, 1 = empieza por lo escrito, 2 = lo contiene, -1 = no coincide
  function score(game, q) {
    var names = [game.name, game.short].concat(game.aliases || []).map(normalize).filter(Boolean);
    var best = -1;
    for (var i = 0; i < names.length; i++) {
      var n = names[i];
      if (n === q) return 0;
      var s = n.indexOf(q) === 0 ? 1 : n.indexOf(q) > -1 ? 2 : -1;
      if (s > -1 && (best === -1 || s < best)) best = s;
    }
    return best;
  }

  function matchGames(games, query) {
    var q = normalize(query);
    if (!q) return games.slice();
    return games
      .map(function (g) { return { g: g, s: score(g, q) }; })
      .filter(function (x) { return x.s >= 0; })
      .sort(function (a, b) { return a.s - b.s; })
      .map(function (x) { return x.g; });
  }

  function enhance(box) {
    var input = box.querySelector("input");
    var list = box.querySelector(".game-results");
    if (!input || !list) return null;
    var mail = box.getAttribute("data-request-mail") || "";
    var items = [];
    var active = -1;

    function close() {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }

    function render() {
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      if (!items.length) {
        var q = input.value.trim();
        list.innerHTML =
          '<li class="g-empty">No tenemos «' + esc(q) + '» todavía.' +
          (mail
            ? ' <a href="mailto:' + esc(mail) + "?subject=" +
              encodeURIComponent("Quiero que añadáis un juego: " + q) + '">Pídelo aquí</a>'
            : "") +
          "</li>";
        return;
      }
      list.innerHTML = items.map(function (g, i) {
        return '<li role="option" class="' + (i === active ? "is-active" : "") +
          '" aria-selected="' + (i === active) + '"><a href="' + esc(g.url) + '">' +
          '<span class="g-name">' + esc(g.name) + "</span>" +
          '<span class="g-tag">' + esc(g.tagline || "") + "</span>" +
          (g.status === "building" ? '<span class="g-badge">En construcción</span>' : "") +
          "</a></li>";
      }).join("");
    }

    function show() {
      loadGames().then(function (games) {
        items = matchGames(games, input.value);
        active = items.length ? 0 : -1;
        render();
      });
    }

    input.addEventListener("input", show);
    input.addEventListener("focus", show);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && items.length) {
        e.preventDefault();
        active = (active + 1) % items.length;
        render();
      } else if (e.key === "ArrowUp" && items.length) {
        e.preventDefault();
        active = (active - 1 + items.length) % items.length;
        render();
      } else if (e.key === "Enter") {
        if (items[active]) {
          e.preventDefault();
          window.location.href = items[active].url;
        }
      } else if (e.key === "Escape") {
        close();
        if (input.blur) input.blur();
      }
    });
    document.addEventListener("click", function (e) {
      if (!box.contains(e.target)) close();
    });
    return input;
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll(".game-search"))
    .map(enhance).filter(Boolean);

  // Atajo: pulsar "/" fuera de un campo de texto lleva el cursor al buscador.
  if (inputs.length) {
    document.addEventListener("keydown", function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) {
        e.preventDefault();
        inputs[0].focus();
      }
    });
  }
})();
