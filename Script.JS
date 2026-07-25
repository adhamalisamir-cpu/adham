/* ============================================================
   KAFAAT — script.js
   Handles: mobile nav, sticky header shadow, scroll-reveal
   animations, animated stat counters, and lightweight form UI.
   ============================================================ */

/* ---------------------------------------------------------
   1. MOBILE NAVIGATION
   --------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   2. STICKY HEADER SHADOW ON SCROLL
   --------------------------------------------------------- */
function initHeaderScrollEffect() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const SCROLL_THRESHOLD = 12;
  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();
}

/* ---------------------------------------------------------
   3. SCROLL-REVEAL ANIMATION (elements with .fade-up)
   --------------------------------------------------------- */
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(".fade-up");
  if (revealTargets.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el, index) => {
    el.style.transitionDelay = `${(index % 6) * 70}ms`;
    observer.observe(el);
  });
}

/* ---------------------------------------------------------
   4. ANIMATED STAT COUNTERS (elements with [data-count-to])
   --------------------------------------------------------- */
function initStatCounters() {
  const counters = document.querySelectorAll("[data-count-to]");
  if (counters.length === 0) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count-to"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1200;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   5. AUTH TABS (Login / Sign Up page)
   --------------------------------------------------------- */
function initAuthTabs() {
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const panelLogin = document.getElementById("panel-login");
  const panelSignup = document.getElementById("panel-signup");
  if (!tabLogin || !tabSignup) return;

  const showTab = (activeTab, activePanel, inactiveTab, inactivePanel) => {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    activePanel.classList.add("active");
    inactivePanel.classList.remove("active");
  };

  tabLogin.addEventListener("click", () => showTab(tabLogin, panelLogin, tabSignup, panelSignup));
  tabSignup.addEventListener("click", () => showTab(tabSignup, panelSignup, tabLogin, panelLogin));

  document.querySelectorAll("[data-switch-tab]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = link.getAttribute("data-switch-tab");
      if (target === "signup") showTab(tabSignup, panelSignup, tabLogin, panelLogin);
      else showTab(tabLogin, panelLogin, tabSignup, panelSignup);
    });
  });

  // Deep-link support: login.html#signup opens directly on the Sign Up tab
  if (window.location.hash === "#signup") {
    showTab(tabSignup, panelSignup, tabLogin, panelLogin);
  }
}

/* ---------------------------------------------------------
   6. CONTACT FORM (static UI feedback — no backend)
   --------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const successMessage = document.getElementById("contact-msg");
    contactForm.reset();
    successMessage.classList.add("show", "success");
    successMessage.textContent = "Thanks! Your message has been noted — our team will reach out shortly.";
  });
}

/* ---------------------------------------------------------
   7. INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeaderScrollEffect();
  initScrollReveal();
  initStatCounters();
  initAuthTabs();
  initContactForm();
});