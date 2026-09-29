// ============================================================
// Mundo Juegos — interacciones base (Fase 2) + carrusel infinito (Fase 3)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initSideMenu();
  initSearchToggle();
  // Los carruseles de la Home se inicializan desde home.js, DESPUÉS de que
  // renderCarousels() cargue las cards en el track (si se hiciera acá, se
  // ejecutaría antes de que existan las cards, porque este script se carga
  // antes que home.js).
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
// Recibe el contenedor `.carousel` (ya con las cards reales cargadas en su
// `.carousel__track`) y lo convierte en un carrusel que gira sin fin,
// reciclando los MISMOS nodos reales en vez de duplicarlos.
//
// Importante: la "reubicación" NUNCA mueve el nodo dentro del árbol del
// DOM (nada de appendChild/prepend). Si moviéramos el <li> de verdad, el
// navegador desconecta y reconecta su <img>, y algunos navegadores la
// vuelven a decodificar como si fuera contenido nuevo — eso se ve como la
// imagen en blanco por un segundo. En cambio, cada card se queda siempre
// en el mismo lugar del árbol y lo que cambia es su propiedad CSS `order`
// (flexbox): eso reordena visualmente el track sin tocar ningún <img>, así
// que la imagen ya cargada se queda cargada.
//
//   "Siguiente": se anima el track un card-step hacia la izquierda (la
//   transición normal). Cuando termina, a la card que quedó primera se le
//   sube el `order` para que pase a ser la última visualmente, y el track
//   se reubica en 0 sin transición — como el resultado visual es idéntico,
//   el salto no se nota.
//
//   "Anterior": el mismo truco al revés. A la card que está última se le
//   baja el `order` para que pase a ser la primera, se salta (sin
//   transición) un card-step a la izquierda para que la vista no cambie
//   todavía, y recién ahí se anima el track de vuelta a 0 — eso hace
//   entrar a esa card desde la izquierda.
//
// Resultado: el DOM nunca tiene más nodos que juegos tiene la sección (acá,
// 5), no hay que ocultarle clones al lector de pantalla, no se descargan
// imágenes de más, y ninguna imagen se desconecta nunca del documento.
//
// Cuántas cards se muestran: las 5 de siempre (como en el Figma), sin
// forzar ningún ancho artificial. Para que el giro siempre tenga algo real
// para revelar (aunque la pantalla sea muy ancha), cada sección tiene un 6º
// juego cargado en games.js que queda escondido a propósito — con eso
// alcanza y sobra para que quede contenido real fuera de vista en cualquier
// resolución de escritorio, así que acá solo hace falta la comprobación de
// seguridad de siempre (ver measure()).
function setupInfiniteCarousel(root) {
  const viewport = root.querySelector(".carousel__viewport");
  const track = viewport && viewport.querySelector(".carousel__track");
  const prevBtn = root.querySelector(".carousel__arrow--left");
  const nextBtn = root.querySelector(".carousel__arrow--right");
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  if (cards.length === 0) return;

  // Orden visual inicial: igual al orden real del DOM.
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
    const totalWidth = cardStep * cards.length - gap; // ancho real de todas las cards + gaps

    // Si por algún motivo (una sección con pocos juegos, una pantalla
    // gigante) llegaran a entrar todas las cards igual, no queda nada real
    // para revelar al girar: ahí sí deshabilitamos las flechas en vez de
    // animar hacia un hueco vacío. El margen ("SLACK") evita confundir un
    // sobrante de pocos píxeles (redondeo, el --max-width del sitio) con
    // una card entera escondida.
    const SLACK = 40;
    canScroll = totalWidth > viewport.clientWidth + SLACK;
    prevBtn.disabled = !canScroll;
    nextBtn.disabled = !canScroll;
  }

  // Aplica un cambio de posición SIN transición (salto invisible) y vuelve
  // a habilitar la transición para el próximo movimiento animado.
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
    // Reciclamos la última card (por orden visual) al principio y saltamos
    // un paso a la izquierda para que la vista no cambie todavía...
    minOrder -= 1;
    lastCard().style.order = minOrder;
    jumpTo(-cardStep);
    // ...y en el siguiente frame animamos de vuelta a 0: eso hace entrar
    // a esa card desde la izquierda.
    requestAnimationFrame(() => {
      track.style.transform = "translateX(0px)";
    });
  }

  track.addEventListener("transitionend", (e) => {
    if (e.target !== track || e.propertyName !== "transform") return;
    // Si la transición terminó en -cardStep, veníamos de "goNext": reciclamos
    // la primera card (por orden visual) al final y saltamos a 0 sin que se note.
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
