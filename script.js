(function () {
  "use strict";

  var root = document.documentElement;

  /* Theme toggle: follows the system until the visitor picks one. */
  var toggle = document.getElementById("theme-toggle");
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* Reveal sections as they scroll into view. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* Highlight the nav link for the section in view. */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  if (navLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    navLinks.forEach(function (link) { byId[link.getAttribute("href").slice(1)] = link; });
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) { link.classList.remove("active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    // Watch every section, so links clear again over the hero and contact.
    Array.prototype.slice.call(document.querySelectorAll("main > section")).forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* Copy the email address. */
  var copyBtn = document.getElementById("copy-email");
  var copyText = document.getElementById("copy-email-text");
  if (copyBtn && copyText) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var done = function (label) {
        copyText.textContent = label;
        setTimeout(function () { copyText.textContent = "Copy address"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { done("Copied"); },
          function () { done(email); }
        );
      } else {
        done(email);
      }
    });
  }

  /* Keep the footer year current. */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
