// ============================================================
// index.html — renderiza el destacado y los carruseles desde games.js
// ============================================================

const SVG_NS = "http://www.w3.org/2000/svg";

// Precios de los juegos pagos (separado de games.js para no pisar tus datos).
const PREMIUM_PRICES = {
  "pizza-now": "1.99",
  "fruit-match": "0.99",
  "call-of-war": "2.99",
  "comando-force": "3.49",
};

function buildCrownBadge() {
  const badge = document.createElement("span");
  badge.className = "badge-premium";
  badge.title = "Juego pago";
  badge.setAttribute("aria-label", "Juego pago");

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("fill", "currentColor");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M2 8l4 3 6-7 6 7 4-3-2 11H4z");
  svg.appendChild(path);
  badge.appendChild(svg);
  return badge;
}

// Botón que aparece al hacer hover sobre la card: "Jugar ahora →" en los
// juegos gratis, "Comprar $X.XX" en los pagos.
function buildOverlayButton(game) {
  const pill = document.createElement("span");
  pill.className = "game-card__overlay-btn";

  if (game.premium) {
    pill.classList.add("game-card__overlay-btn--premium");

    const label = document.createElement("span");
    label.textContent = "Comprar";
    pill.appendChild(label);

    const price = document.createElement("span");
    price.className = "game-card__price";

    const coin = document.createElement("span");
    coin.className = "game-card__price-icon";
    coin.textContent = "$";
    price.appendChild(coin);

    price.appendChild(document.createTextNode(PREMIUM_PRICES[game.id] || "1.99"));
    pill.appendChild(price);
  } else {
    pill.textContent = "Jugar ahora →";
  }
  return pill;
}

function buildCard(game) {
  const li = document.createElement("li");
  li.className = "game-card";

  const a = document.createElement("a");
  a.href = gameUrl(game.id);

  // Envoltorio de la imagen: soporta la corona y el overlay de hover
  const media = document.createElement("div");
  media.className = "game-card__media";

  let thumb;
  if (game.image) {
    thumb = document.createElement("img");
    thumb.className = "game-card__thumb";
    thumb.src = game.image;
    thumb.alt = "";
    // Sin lazy: el carrusel mueve las cards con transform, no con scroll
    // real, y el navegador no llega a pedir la imagen a tiempo.
    thumb.decoding = "async";
  } else {
    thumb = document.createElement("div");
    thumb.className = "game-card__thumb " + game.thumb;
    thumb.setAttribute("aria-hidden", "true");
    const initials = document.createElement("span");
    initials.textContent = game.initials;
    thumb.appendChild(initials);
  }
  media.appendChild(thumb);

  if (game.premium) media.appendChild(buildCrownBadge());

  const overlay = document.createElement("div");
  overlay.className = "game-card__overlay";
  overlay.appendChild(buildOverlayButton(game));
  media.appendChild(overlay);

  a.appendChild(media);

  const title = document.createElement("p");
  title.className = "game-card__title";
  title.textContent = game.homeTitle || game.title;
  a.appendChild(title);

  const category = document.createElement("p");
  category.className = "game-card__category";
  category.textContent = game.category;
  a.appendChild(category);

  li.appendChild(a);
  return li;
}

function renderCarousels() {
  document.querySelectorAll("[data-section]").forEach((track) => {
    const ids = HOME_SECTIONS[track.dataset.section] || [];
    ids.forEach((id) => {
      const game = getGame(id);
      if (game) track.appendChild(buildCard(game));
    });
  });
}

function renderHero() {
  const game = getGame(FEATURED_GAME_ID);
  if (!game) return;

  const title = document.querySelector(".hero__title");
  const desc = document.querySelector(".hero__desc");
  const cta = document.querySelector(".hero .btn");
  const thumb = document.querySelector(".hero__thumb");

  if (title) title.textContent = game.title;
  if (desc) desc.textContent = game.description;
  if (cta) cta.href = gameUrl(game.id);

  if (thumb && game.image) {
    const img = document.createElement("img");
    img.className = "hero__thumb hero__thumb--img";
    img.src = game.image;
    img.alt = "Imagen de " + game.title;
    thumb.replaceWith(img);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderCarousels();
  // Recién acá existen las cards en cada track: ahora sí se arma el carrusel.
  document.querySelectorAll(".carousel").forEach(setupInfiniteCarousel);
});
