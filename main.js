"use strict";

/* Elements */
const modalOverlay = document.querySelector(".modal-overlay");
const authModal = document.querySelector(".auth-modal");

const loginBox = document.querySelector(".form-box.login");
const registerBox = document.querySelector(".form-box.register");

const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

const loginButton = document.querySelector(".btn-login-popup");
const heroLoginButton = document.querySelector(".hero-login-button");

const closeButton = document.querySelector(".modal-close");

const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".login-link");

const formMessage = document.querySelector(".form-message");

const navToggle = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".navigation");
const navigationLinks = document.querySelectorAll(".navigation a");

const passwordToggleButtons = document.querySelectorAll(".password-toggle");

let lastFocusedElement = null;

/* Navigation Functions */
function openNavigation() {
  navigation.classList.add("is-open");
  navToggle.classList.add("is-active");

  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation menu");
}

function closeNavigation() {
  navigation.classList.remove("is-open");
  navToggle.classList.remove("is-active");

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

function toggleNavigation() {
  const isOpen = navigation.classList.contains("is-open");

  if (isOpen) {
    closeNavigation();
  } else {
    openNavigation();
  }
}

/* Form Functions */
function clearFormMessage() {
  formMessage.textContent = "";
  formMessage.classList.remove("is-visible");
}

function showFormMessage(message) {
  formMessage.textContent = message;
  formMessage.classList.add("is-visible");
}

function showForm(formName) {
  const showRegister = formName === "register";

  clearFormMessage();

  loginBox.hidden = showRegister;
  registerBox.hidden = !showRegister;

  loginBox.classList.toggle("is-active", !showRegister);
  registerBox.classList.toggle("is-active", showRegister);

  loginBox.inert = showRegister;
  registerBox.inert = !showRegister;

  authModal.setAttribute(
    "aria-labelledby",
    showRegister ? "register-title" : "login-title",
  );

  const firstInput = showRegister
    ? document.querySelector("#register-username")
    : document.querySelector("#login-email");

  window.setTimeout(() => {
    firstInput.focus();
  }, 100);
}

/* Modal Functions */
function openModal(formName = "login") {
  lastFocusedElement = document.activeElement;

  closeNavigation();
  showForm(formName);

  modalOverlay.classList.add("is-open");
  modalOverlay.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}

function closeModal() {
  modalOverlay.classList.remove("is-open");
  modalOverlay.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");

  clearFormMessage();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

/* Password Visibility */
function togglePassword(button) {
  const inputId = button.dataset.target;
  const passwordInput = document.getElementById(inputId);
  const icon = button.querySelector("ion-icon");

  const passwordIsHidden = passwordInput.type === "password";

  passwordInput.type = passwordIsHidden ? "text" : "password";

  icon.setAttribute(
    "name",
    passwordIsHidden ? "eye-off-outline" : "eye-outline",
  );

  button.setAttribute(
    "aria-label",
    passwordIsHidden ? "Hide password" : "Show password",
  );
}

/* Focus Trap */
function trapFocus(event) {
  if (event.key !== "Tab" || !modalOverlay.classList.contains("is-open")) {
    return;
  }

  const focusableElements = [
    ...authModal.querySelectorAll(
      `
        button:not([disabled]),
        a[href],
        input:not([disabled])
      `,
    ),
  ].filter((element) => {
    return !element.closest("[hidden]");
  });

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/* Form Submission Demo */
function handleLogin(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) {
    return;
  }

  showFormMessage("Login information was submitted successfully.");

  form.reset();
}

function handleRegister(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) {
    return;
  }

  showFormMessage("Your account was created successfully.");

  form.reset();
}

/* Event Listeners */
navToggle.addEventListener("click", toggleNavigation);

loginButton.addEventListener("click", () => {
  openModal("login");
});

heroLoginButton.addEventListener("click", () => {
  openModal("login");
});

closeButton.addEventListener("click", closeModal);

registerLink.addEventListener("click", (event) => {
  event.preventDefault();
  showForm("register");
});

loginLink.addEventListener("click", (event) => {
  event.preventDefault();
  showForm("login");
});

passwordToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    togglePassword(button);
  });
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

loginForm.addEventListener("submit", handleLogin);
registerForm.addEventListener("submit", handleRegister);

/* Close modal by clicking outside it */
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

/* Keyboard Controls */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalOverlay.classList.contains("is-open")) {
    closeModal();
  }

  trapFocus(event);
});

/* Close navigation when clicking outside it */
document.addEventListener("click", (event) => {
  const clickedInsideNavigation = navigation.contains(event.target);

  const clickedNavigationButton = navToggle.contains(event.target);

  if (!clickedInsideNavigation && !clickedNavigationButton) {
    closeNavigation();
  }
});

/* Reset mobile navigation after resizing */
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeNavigation();
  }
});
