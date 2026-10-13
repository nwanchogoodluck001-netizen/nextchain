/* NEXTCHAIN landing-page interactions. */
(() => {
  "use strict";

  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const year = document.getElementById("currentYear");

  if (year) year.textContent = String(new Date().getFullYear());

  function closeMobileMenu() {
    if (!menuToggle || !primaryNav) return;
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    const icon = menuToggle.querySelector("i");
    if (icon) icon.className = "bx bx-menu";
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      const icon = menuToggle.querySelector("i");
      if (icon) icon.className = isOpen ? "bx bx-x" : "bx bx-menu";
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
      if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileMenu();
    });
  }

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      if (targetId.length > 1) history.replaceState(null, "", targetId);
    });
  });

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${currentId}`;
          link.classList.toggle("active", isActive);
          if (isActive) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const answer = button.closest(".faq-item")?.querySelector(".faq-answer");
      button.setAttribute("aria-expanded", String(!expanded));
      if (answer) answer.hidden = expanded;
    });
  });

  const modal = document.getElementById("infoModal");
  const dialog = modal?.querySelector(".info-modal");
  const openModalButtons = document.querySelectorAll("[data-open-modal]");
  const closeModalButton = modal?.querySelector(".modal-close");
  const doneButton = modal?.querySelector(".modal-done");
  let lastFocusedElement = null;

  function openModal() {
    if (!modal || !dialog) return;
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    dialog.focus();
    const firstControl = modal.querySelector("button");
    if (firstControl) firstControl.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }

  openModalButtons.forEach((button) => button.addEventListener("click", openModal));
  closeModalButton?.addEventListener("click", closeModal);
  doneButton?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (!modal || modal.hidden) return;
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key === "Tab") {
      const focusable = Array.from(modal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();




/* NEXTCHAIN hero slideshow */
(() => {
  const root = document.querySelector(".hero-slideshow");
  if (!root) return;

  const slides = [...root.querySelectorAll(".showcase-slide")];
  const dots = [...root.querySelectorAll("[data-go-slide]")];
  const currentLabel = root.querySelector("#showcaseCurrent");
  const previousButton = root.querySelector("#showcasePrev");
  const nextButton = root.querySelector("#showcaseNext");

  if (!slides.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let currentIndex = 0;
  let intervalId;
  let isPaused = false;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    if (currentLabel) {
      currentLabel.textContent = String(currentIndex + 1).padStart(2, "0");
    }
  }

  function stopAutoplay() {
    window.clearInterval(intervalId);
    intervalId = undefined;
  }

  function startAutoplay() {
    stopAutoplay();

    if (reducedMotion || isPaused || slides.length < 2) return;

    intervalId = window.setInterval(() => {
      showSlide(currentIndex + 1);
    }, 6000);
  }

  function goToSlide(index) {
    showSlide(index);
    startAutoplay();
  }

  previousButton?.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  root.addEventListener("mouseenter", () => {
    isPaused = true;
    stopAutoplay();
  });

  root.addEventListener("mouseleave", () => {
    isPaused = false;
    startAutoplay();
  });

  root.addEventListener("focusin", () => {
    isPaused = true;
    stopAutoplay();
  });

  root.addEventListener("focusout", event => {
    if (!root.contains(event.relatedTarget)) {
      isPaused = false;
      startAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  showSlide(0);
  startAutoplay();
})();
