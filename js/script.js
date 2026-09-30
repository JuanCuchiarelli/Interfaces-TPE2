// ============================================================
// Mundo Juegos — interacciones base (Fase 2) + carrusel infinito (Fase 3)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initSideMenu();
  initSearchToggle();
  // Los carruseles de la Home los inicializa home.js, después de cargar las cards.
});

/* ---------------- Menú lateral ---------------- */
function initSideMenu() {
  const menu = document.getElementById("side-menu");
  const overlay = document.getElementById("side-menu-overlay");
  const openBtn = document.getElementById("menu-open");
  const closeBtn = document.getElementById("menu-close");

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------------- Buscador colapsable (mobile) ---------------- */
function initSearchToggle() {
  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("search-toggle");
  const form = document.getElementById("search-form");
  if (!header || !toggle || !form) return;

  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-search-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar buscador" : "Abrir buscador");
    if (open) form.querySelector("input").focus();
  });
}

/* ---------------- Carruseles infinitos (sin clonar cards) ---------------- */
// Recicla las mismas cards en vez de clonarlas: no se mueven de lugar en el
// DOM (eso desconectaría sus <img> y las volvería a mostrar en blanco), lo
// que cambia es su `order` (flexbox), que solo reordena visualmente.
//
//   Siguiente: anima el track un card-step a la izquierda. Al terminar, sube
//   el `order` de la primera card para que pase a última, y reubica el
//   track en 0 sin transición (el salto no se nota porque el resultado es
//   igual).
//
//   Anterior: al revés. Baja el `order` de la última card para que pase a
//   primera, salta sin transición un card-step a la izquierda, y recién ahí
//   anima de vuelta a 0 — así esa card entra desde la izquierda.
//
// Cada sección tiene un 6º juego oculto en games.js (ver measure): así
// siempre hay algo real para revelar al girar, sin importar la resolución.
function setupInfiniteCarousel(root) {
  const viewport = root.querySelector(".carousel__viewport");
  const track = viewport && viewport.querySelector(".carousel__track");
  const prevBtn = root.querySelector(".carousel__arrow--left");
  const nextBtn = root.querySelector(".carousel__arrow--right");
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  if (cards.length === 0) return;

  // Orden visual inicial = orden real del DOM.
  let minOrder = 0;
  let maxOrder = cards.length - 1;
  cards.forEach((card, i) => { card.style.order = i; });

  function firstCard() {
    return cards.reduce((a, b) => (Number(a.style.order) < Number(b.style.order) ? a : b));
  }
  function lastCard() {
    return cards.reduce((a, b) => (Number(a.style.order) > Number(b.style.order) ? a : b));
  }

  let cardStep = 0;
  let busy = false; // evita pisar una animación en curso con otro click
  let canScroll = true;

  function measure() {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    cardStep = cards[0].getBoundingClientRect().width + gap;
    const totalWidth = cardStep * cards.length - gap;

    // Si igual entraran todas las cards (pantalla gigante), no hay nada
    // para revelar: se deshabilitan las flechas en vez de animar al vacío.
    // SLACK evita confundir unos pocos px de redondeo con una card escondida.
    const SLACK = 40;
    canScroll = totalWidth > viewport.clientWidth + SLACK;
    prevBtn.disabled = !canScroll;
    nextBtn.disabled = !canScroll;
  }

  // Reposiciona sin transición (salto invisible) y reactiva la transición.
  function jumpTo(px) {
    track.classList.add("no-anim");
    track.style.transform = "translateX(" + px + "px)";
    void track.offsetWidth; // fuerza a pintar el salto antes de reactivar la transición
    track.classList.remove("no-anim");
  }

  function goNext() {
    if (busy || !cardStep || !canScroll) return;
    busy = true;
    track.style.transform = "translateX(-" + cardStep + "px)"; // animado
  }

  function goPrev() {
    if (busy || !cardStep || !canScroll) return;
    busy = true;
    // Reciclamos la última card al principio y saltamos un paso a la
    // izquierda para que la vista no cambie todavía...
    minOrder -= 1;
    lastCard().style.order = minOrder;
    jumpTo(-cardStep);
    // ...y en el siguiente frame animamos de vuelta a 0: entra desde la izquierda.
    requestAnimationFrame(() => {
      track.style.transform = "translateX(0px)";
    });
  }

  track.addEventListener("transitionend", (e) => {
    if (e.target !== track || e.propertyName !== "transform") return;
    // Terminó en -cardStep: veníamos de goNext. Reciclamos la primera card
    // al final y saltamos a 0 sin que se note.
    if (track.style.transform === "translateX(-" + cardStep + "px)") {
      maxOrder += 1;
      firstCard().style.order = maxOrder;
      jumpTo(0);
    }
    busy = false;
  });

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  window.addEventListener("resize", () => {
    measure();
    if (!busy) jumpTo(0);
  });

  measure();
  jumpTo(0);
}
