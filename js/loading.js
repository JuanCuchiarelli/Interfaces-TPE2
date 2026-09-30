// ============================================================
// index.html — loading simulado de 5s con % de avance
// Simulación con requestAnimationFrame, no depende de carga real.
// ============================================================

(function () {
  const DURATION = 5000; // 5 segundos exactos

  document.addEventListener("DOMContentLoaded", () => {
    const screen = document.getElementById("loading-screen");
    const percentEl = document.getElementById("loading-percent");
    if (!screen || !percentEl) return;

    screen.style.display = "flex";
    document.body.classList.add("is-loading");

    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.floor((elapsed / DURATION) * 100));
      percentEl.textContent = pct + "%";

      if (elapsed < DURATION) {
        requestAnimationFrame(tick);
      } else {
        percentEl.textContent = "100%";
        finish();
      }
    }

    function finish() {
      screen.classList.add("is-hiding");
      screen.addEventListener(
        "transitionend",
        () => {
          screen.style.display = "none";
          document.body.classList.remove("is-loading");
        },
        { once: true }
      );
    }

    requestAnimationFrame(tick);
  });
})();
