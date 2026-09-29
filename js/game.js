// ============================================================
// game.html — contenido dinámico según ?id=, galería, compartir
// y comentarios (todo front-end, sin backend).
// Depende de js/games.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const game = getGame(params.get("id")) || getGame(DEFAULT_GAME_ID);

  renderGame(game);
  initGallery(game);
  initShare(game);
  initComments();
});

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ---------------- Contenido del juego ---------------- */
function renderGame(game) {
  document.title = game.title + " — Mundo Juegos";
  setText("game-title", game.title);
  setText("bc-current", game.title);
  setText("bc-category", game.category);
  setText("game-howto", game.howTo);
  setText("about-title", "Acerca de " + game.title + ":");
  setText("about-text", game.description);

  const board = document.getElementById("game-board");
  if (board) board.className = "game-run__board " + game.thumb;
}

/* ---------------- Galería (carrusel) ---------------- */
function buildSlides(game) {
  if (game.gallery) return game.gallery;
  // Juegos sin galería propia: 4 placeholders con los colores del juego
  return [1, 2, 3, 4].map((n) => ({
    cls: game.thumb + " is-generic",
    caption: game.title + " — imagen " + n,
    src: null,
  }));
}

function buildSlideEl(slide) {
  const li = document.createElement("li");
  li.className = "gallery__item";

  let media;
  if (slide.src) {
    media = document.createElement("img");
    media.className = "gallery__thumb";
    media.src = slide.src;
    media.alt = slide.caption;
    // Sin lazy: la galería se mueve con transform, no con scroll real, así
    // que el navegador no llega a pedir la imagen a tiempo y se ve vacía
    // por un momento. Son pocas imágenes, se cargan todas de entrada.
    media.decoding = "async";
  } else {
    media = document.createElement("div");
    media.className = "gallery__thumb " + slide.cls;
    media.setAttribute("role", "img");
    media.setAttribute("aria-label", slide.caption);
    const label = document.createElement("span");
    label.className = "ph-label";
    label.textContent = slide.caption;
    media.appendChild(label);
  }
  li.appendChild(media);
  return li;
}

function initGallery(game) {
  const gallery = document.getElementById("gallery");
  const track = document.getElementById("gallery-track");
  const prev = document.getElementById("gallery-prev");
  const next = document.getElementById("gallery-next");
  const status = document.getElementById("gallery-status");
  if (!gallery || !track) return;

  const slides = buildSlides(game);
  slides.forEach((s) => track.appendChild(buildSlideEl(s)));

  let index = 0;

  function visibleCount() {
    const v = parseInt(getComputedStyle(gallery).getPropertyValue("--visible"), 10);
    return v > 0 ? v : 3;
  }

  function update() {
    const visible = visibleCount();
    const max = Math.max(0, slides.length - visible);
    index = Math.min(Math.max(index, 0), max);

    track.style.setProperty("--index", index);
    prev.disabled = index <= 0;
    next.disabled = index >= max;

    const from = index + 1;
    const to = Math.min(index + visible, slides.length);
    status.textContent = "Mostrando imágenes " + from + "–" + to + " de " + slides.length;

    // Además del desplazamiento (transition del track), las imágenes que
    // quedan visibles entran con un fundido + escala (animación @keyframes).
    const items = track.querySelectorAll(".gallery__item");
    items.forEach((item, i) => {
      const isVisible = i >= index && i < index + visible;
      item.classList.remove("is-entering");
      if (isVisible) {
        void item.offsetWidth; // fuerza reflow para poder re-disparar la animación
        item.classList.add("is-entering");
      }
    });
  }

  prev.addEventListener("click", () => { index -= 1; update(); });
  next.addEventListener("click", () => { index += 1; update(); });
  window.addEventListener("resize", update);
  update();
}

/* ---------------- Compartir ---------------- */
function initShare(game) {
  const url = window.location.href;
  const text = "Jugá " + game.title + " en Mundo Juegos";

  const email = document.getElementById("share-email");
  const message = document.getElementById("share-message");
  const facebook = document.getElementById("share-facebook");
  const instagram = document.getElementById("share-instagram");
  const status = document.getElementById("share-status");

  if (email) {
    email.href =
      "mailto:?subject=" + encodeURIComponent("Mirá este juego: " + game.title) +
      "&body=" + encodeURIComponent(text + "\n" + url);
  }
  if (message) message.href = "https://wa.me/?text=" + encodeURIComponent(text + " " + url);
  if (facebook) {
    facebook.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
  }

  // Instagram no tiene un enlace web para compartir: copiamos el link al portapapeles.
  if (instagram) {
    instagram.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = "Enlace copiado. Pegalo en Instagram para compartir el juego.";
      } catch (err) {
        window.prompt("Copiá el enlace para compartirlo en Instagram:", url);
      }
    });
  }
}

/* ---------------- Comentarios ---------------- */
function initComments() {
  const form = document.getElementById("comment-form");
  const list = document.getElementById("comment-list");
  if (!form || !list) return;

  const textarea = form.querySelector("textarea");
  const submit = form.querySelector('button[type="submit"]');

  // El botón queda deshabilitado (estado "disabled" del Design System) hasta que haya texto
  submit.disabled = true;
  textarea.addEventListener("input", () => {
    submit.disabled = textarea.value.trim() === "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.className = "comment";
    li.innerHTML = `
      <div class="avatar avatar--sm" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>
      </div>
      <div class="comment__body">
        <p class="comment__meta"><strong>Vos</strong> <span>ahora</span></p>
        <p class="comment__text"></p>
        <div class="comment__actions">
          <button type="button">👍 0</button>
          <button type="button">👎 0</button>
          <button type="button">Responder</button>
        </div>
      </div>`;
    li.querySelector(".comment__text").textContent = text;

    list.prepend(li);
    textarea.value = "";
    submit.disabled = true;
  });
}
