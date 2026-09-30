// ============================================================
// login.html — alternar registro/login + validación (front-end only)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".auth-card");
  const title = document.getElementById("auth-title");
  const tabRegister = document.getElementById("tab-register");
  const tabLogin = document.getElementById("tab-login");
  const formRegister = document.getElementById("panel-register");
  const formLogin = document.getElementById("panel-login");
  const success = document.getElementById("auth-success");
  const social = document.getElementById("auth-social");

  /* ---------------- Tabs ---------------- */
  function showTab(which) {
    const isRegister = which === "register";
    tabRegister.classList.toggle("is-active", isRegister);
    tabLogin.classList.toggle("is-active", !isRegister);
    tabRegister.setAttribute("aria-selected", String(isRegister));
    tabLogin.setAttribute("aria-selected", String(!isRegister));
    formRegister.hidden = !isRegister;
    formLogin.hidden = isRegister;
    title.textContent = isRegister ? "Creá tu cuenta" : "Iniciar sesión";
    document.title = (isRegister ? "Registro" : "Iniciar sesión") + " — Mundo Juegos";
  }

  tabRegister.addEventListener("click", () => showTab("register"));
  tabLogin.addEventListener("click", () => showTab("login"));
  if (location.hash === "#login") showTab("login");

  /* ---------------- Helpers de validación ---------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, message) {
    const field = input.closest(".field");
    const error = field.querySelector(".field__error");
    field.classList.toggle("is-invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    error.textContent = message || "";
    error.hidden = !message;
    return !message;
  }

  function clearOnInput(form) {
    form.querySelectorAll("input").forEach((input) => {
      const evt = input.type === "checkbox" ? "change" : "input";
      input.addEventListener(evt, () => setError(input, ""));
    });
  }
  clearOnInput(formRegister);
  clearOnInput(formLogin);

  // La fecha de nacimiento no puede ser futura
  const birth = document.getElementById("reg-birth");
  birth.max = new Date().toISOString().split("T")[0];

  /* ---------------- Registro ---------------- */
  formRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name");
    const nick = document.getElementById("reg-nick");
    const email = document.getElementById("reg-email");
    const pass = document.getElementById("reg-pass");
    const pass2 = document.getElementById("reg-pass2");
    const captcha = document.getElementById("reg-captcha");

    const results = [
      setError(name, name.value.trim().length < 3 ? "Ingresá tu nombre completo." : ""),
      setError(
        birth,
        !birth.value
          ? "Ingresá tu fecha de nacimiento."
          : birth.value > birth.max
            ? "La fecha no puede ser futura."
            : ""
      ),
      setError(email, !EMAIL_RE.test(email.value.trim()) ? "Ingresá un email válido." : ""),
      setError(pass, pass.value.length < 8 ? "Usá al menos 8 caracteres." : ""),
      setError(pass2, pass2.value !== pass.value || !pass2.value ? "Las contraseñas no coinciden." : ""),
      setError(captcha, captcha.checked ? "" : "Confirmá que no sos un robot."),
    ];

    if (!results.every(Boolean)) {
      const firstInvalid = formRegister.querySelector(".is-invalid input");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const displayName = nick.value.trim() || name.value.trim().split(" ")[0];
    document.getElementById("auth-success-text").textContent =
      "Te damos la bienvenida a Mundo Juegos, " + displayName + ".";

    formRegister.hidden = true;
    social.hidden = true;
    success.hidden = false;
    card.classList.add("is-done");
    // Frame siguiente: para que la animación se dispare
    requestAnimationFrame(() => success.classList.add("is-visible"));
  });

  /* ---------------- Login ---------------- */
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("log-email");
    const pass = document.getElementById("log-pass");

    const results = [
      setError(email, !EMAIL_RE.test(email.value.trim()) ? "Ingresá un email válido." : ""),
      setError(pass, !pass.value ? "Ingresá tu contraseña." : ""),
    ];
    if (!results.every(Boolean)) return;

    // Sin backend: simulamos el ingreso y volvemos al inicio.
    window.location.href = "index.html";
  });
});
