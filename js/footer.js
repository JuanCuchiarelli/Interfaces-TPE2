document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".footer-col__toggle");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.nextElementSibling.classList.toggle("is-open");
    });
  });
});