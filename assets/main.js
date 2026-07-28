/* ============================================================
   DI DOLCE DESSERTS — "La Carte"  ·  interactions & motion
   Lenis + GSAP/ScrollTrigger · vanilla
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
  const nav = $("#nav");
  const progress = $("#progress");
  const intro = $("#intro");

  /* ---------------- Lenis ---------------- */
  let lenis = null;
  const uiScroll = (scroll, limit) => {
    if (nav) nav.classList.toggle("scrolled", scroll > 40);
    if (progress) progress.style.transform = `scaleX(${limit ? scroll / limit : 0})`;
  };
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.lenis = lenis;
    lenis.on("scroll", ({ scroll, limit }) => { uiScroll(scroll, limit); if (window.ScrollTrigger) ScrollTrigger.update(); });
    if (window.gsap) { gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  } else {
    const os = () => uiScroll(scrollY, document.documentElement.scrollHeight - innerHeight);
    os(); addEventListener("scroll", os, { passive: true });
  }

  /* ---------------- Curseur ---------------- */
  const cursor = $("#cursor"), follow = $("#cursorFollow");
  if (cursor && follow && fine && !reduce) {
    document.body.classList.add("has-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2, fx = mx, fy = my, shown = false;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; cursor.style.opacity = 1; follow.style.opacity = 1; }
      cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    const raf = () => { fx += (mx - fx) * .16; fy += (my - fy) * .16;
      follow.style.transform = `translate(${fx}px,${fy}px) translate(-50%,-50%)`; requestAnimationFrame(raf); };
    raf();
    $$("a,button,[data-magnetic]").forEach((el) => {
      el.addEventListener("mouseenter", () => follow.classList.add("grow"));
      el.addEventListener("mouseleave", () => follow.classList.remove("grow"));
    });
    $$('[data-cursor="view"]').forEach((el) => {
      el.addEventListener("mouseenter", () => follow.classList.add("view"));
      el.addEventListener("mouseleave", () => follow.classList.remove("view"));
    });
    $$('[data-cursor="hide"]').forEach((el) => {
      el.addEventListener("mouseenter", () => { cursor.style.opacity = 0; follow.style.opacity = 0; });
      el.addEventListener("mouseleave", () => { cursor.style.opacity = 1; follow.style.opacity = 1; });
    });
  }

  /* ---------------- Menu plein écran ---------------- */
  const toggle = $("#menuToggle"), overlay = $("#navOverlay");
  const setMenu = (open) => {
    if (!toggle || !overlay) return;
    toggle.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    overlay.setAttribute("aria-hidden", !open);
    if (lenis) open ? lenis.stop() : lenis.start();
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (toggle) toggle.addEventListener("click", () => setMenu(!toggle.classList.contains("open")));
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------------- Ancres douces ---------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href"); if (!id || id.length < 2) return;
      const t = $(id); if (!t) return;
      e.preventDefault(); setMenu(false);
      if (lenis) lenis.scrollTo(t, { offset: -10, duration: 1.1 });
      else t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------------- Cookies ---------------- */
  const cookie = $("#cookie");
  if (cookie) {
    if (!localStorage.getItem("didolce-cookie")) { cookie.hidden = false; setTimeout(() => cookie.classList.add("show"), 1200); }
    const close = (v) => { localStorage.setItem("didolce-cookie", v); cookie.classList.remove("show"); setTimeout(() => (cookie.hidden = true), 600); };
    $("#cookieAccept")?.addEventListener("click", () => close("accepted"));
    $("#cookieRefuse")?.addEventListener("click", () => close("refused"));
  }

  /* (section Avis supprimée) */

  /* ---------------- Formulaire → WhatsApp ---------------- */
  const form = $("#leadForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) return form.reportValidity();
      const g = (n) => (form.querySelector(`[name="${n}"]`)?.value || "").trim();
      const msg = `Bonjour Di Dolce Desserts,\n\nNom : ${g("name")}\nSociété : ${g("company") || "—"}\nEmail : ${g("email")}\nTéléphone : ${g("phone") || "—"}\n\nMessage : ${g("message") || "—"}`;
      window.open(`https://wa.me/33768408525?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      const ok = $("#formSuccess");
      if (ok) { ok.hidden = false; if (window.gsap && !reduce) gsap.fromTo(ok, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }); }
    });
  }

  /* ---------------- Formulaire Catalogue → email ---------------- */
  const catForm = $("#catalogueForm");
  if (catForm) {
    catForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!catForm.checkValidity()) return catForm.reportValidity();
      const g = (n) => (catForm.querySelector(`[name="${n}"]`)?.value || "").trim();
      const subject = `Demande de catalogue — ${g("company") || g("name")}`;
      const body = `Bonjour,\n\nJe souhaite recevoir le catalogue Di Dolce Desserts.\n\nNom : ${g("name")}\nSociété : ${g("company") || "—"}\nEmail : ${g("email")}\nTéléphone : ${g("phone") || "—"}\n\nMessage : ${g("message") || "—"}`;
      window.location.href = `mailto:contact@didolcedesserts.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const ok = $("#catalogueSuccess");
      if (ok) { ok.hidden = false; if (window.gsap && !reduce) gsap.fromTo(ok, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .5 }); }
    });
  }

  /* ---------- Hero vidéo : toujours animée (GIF de secours si autoplay bloqué) ---------- */
  (function () {
    const v = $("#heroVideo"), gif = $("#heroGif");
    if (!v) return;
    v.muted = true; v.setAttribute("muted", "");
    const showGif = () => { if (gif) gif.hidden = false; };
    const hideGif = () => { if (gif) gif.hidden = true; };
    const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    // dès qu'une vraie lecture démarre, on masque le GIF (qualité vidéo prioritaire)
    v.addEventListener("playing", hideGif);
    v.addEventListener("pause", showGif);
    tryPlay();
    // si la vidéo n'a pas réellement démarré peu après (mode éco / restriction OS),
    // le GIF prend le relais immédiatement — aucune interaction requise
    setTimeout(() => { if (v.paused) showGif(); }, 500);
    setTimeout(() => { if (v.paused) showGif(); }, 1800);
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) tryPlay(); });
    ["touchstart", "pointerdown", "click", "scroll", "keydown"].forEach((e) =>
      addEventListener(e, tryPlay, { passive: true, once: true }));
  })();

  /* ---------- Nos parfums — grille swipable (drag souris + tactile) ---------- */
  (function () {
    const row = $("#flRow"); if (!row) return;
    const dotsWrap = $("#flDots");
    const cards = $$(".fl-card", row);

    cards.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Parfum " + (i + 1));
      if (i === 0) b.classList.add("on");
      b.addEventListener("click", () => {
        row.scrollTo({ left: cards[i].offsetLeft - row.offsetLeft, behavior: "smooth" });
      });
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);
    let tick;
    row.addEventListener("scroll", () => {
      clearTimeout(tick);
      tick = setTimeout(() => {
        let closest = 0, min = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - row.offsetLeft - row.scrollLeft);
          if (d < min) { min = d; closest = i; }
        });
        dots.forEach((d, i) => d.classList.toggle("on", i === closest));
      }, 80);
    }, { passive: true });

    let isDown = false, startX = 0, startScroll = 0, moved = false;
    row.addEventListener("mousedown", (e) => {
      isDown = true; moved = false; row.classList.add("dragging");
      startX = e.pageX; startScroll = row.scrollLeft;
    });
    addEventListener("mouseup", () => { isDown = false; row.classList.remove("dragging"); });
    addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      row.scrollLeft = startScroll - dx;
      e.preventDefault();
    });
    row.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  })();

  /* ================= GSAP ================= */
  const showAll = () => {
    $$(".reveal-fade,.reveal-clip,.reveal-lines").forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; el.style.clipPath = "none"; });
    $$(".hero-title .line>span").forEach((el) => (el.style.transform = "none"));
    if (intro) intro.classList.add("done");
  };
  if (!window.gsap) { document.documentElement.classList.add("no-gsap"); showAll(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* reveal-lines : encapsule le contenu pour un dévoilement par masque */
  $$(".reveal-lines").forEach((el) => {
    const inner = document.createElement("span");
    inner.className = "rl-inner"; inner.style.display = "block";
    inner.innerHTML = el.innerHTML; el.innerHTML = ""; el.appendChild(inner);
    el.style.overflow = "hidden";
  });

  if (reduce) { showAll(); return; }

  /* Hero (joué après l'intro) */
  gsap.set(".hero-title .line>span", { yPercent: 118 });
  const heroTl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  heroTl.to(".hero-title .line>span", { yPercent: 0, duration: 1.05, stagger: .1 }, 0)
        .to(".hero .reveal-fade", { opacity: 1, y: 0, duration: .9, stagger: .12 }, "-=.65");

  /* Intro loader */
  if (intro) {
    const il = $(".intro-logo"), it = $(".intro-tag");
    gsap.timeline()
      .to(il, { opacity: 1, scale: 1, duration: .9, ease: "power2.out" }, 0)
      .fromTo(il, { scale: .94 }, { scale: 1, duration: 1.1, ease: "power2.out" }, 0)
      .to(it, { opacity: 1, duration: .6 }, .35)
      .to({}, { duration: .5 })
      .add(() => heroTl.play(), ">-.1")
      .to(intro, { yPercent: -100, duration: 1, ease: "power4.inOut" }, ">-.2")
      .set(intro, { display: "none" });
  } else heroTl.play();

  /* Hero parallax */
  gsap.to(".hero-media", { yPercent: 14, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* Reveals fade (hors héro, géré par heroTl) */
  $$(".reveal-fade").filter((el) => !el.closest(".hero")).forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  /* Reveals lines */
  $$(".reveal-lines").forEach((el) => {
    const inner = el.firstElementChild;
    gsap.set(el, { opacity: 1 }); gsap.set(inner, { yPercent: 115 });
    gsap.to(inner, { yPercent: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  /* Reveals clip (images) */
  $$(".reveal-clip").forEach((el) => {
    const inner = el.firstElementChild;
    ScrollTrigger.create({ trigger: el, start: "top 84%", once: true, onEnter: () => {
      gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power3.out" });
      if (inner) gsap.to(inner, { scale: 1, duration: 1.3, ease: "power3.out" });
    } });
  });

  /* Marquee infini */
  const mq = $("#marquee");
  if (mq) gsap.to(mq, { xPercent: -50, duration: 26, ease: "none", repeat: -1 });

  /* Nav clair/foncé selon la section sous le header */
  gsap.utils.toArray(".promise,.engagement,.why,.maison,.showcase,.tiramisu-intro").forEach((s) => {
    ScrollTrigger.create({ trigger: s, start: "top 64px", end: "bottom 64px",
      onToggle: (self) => nav.classList.toggle("light", self.isActive) });
  });

  /* Compteurs */
  $$(".stat-num").forEach((el) => {
    const target = el.getAttribute("data-count"); if (target === null) return;
    const suf = el.getAttribute("data-suffix") || ""; const o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: "top 92%", once: true,
      onEnter: () => gsap.to(o, { v: +target, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v) + suf) }) });
  });

  /* Boutons magnétiques */
  if (fine) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5 }); });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.4)" }));
    });
  }

  addEventListener("load", () => ScrollTrigger.refresh());
})();
