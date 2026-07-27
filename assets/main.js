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

  /* ---------- Hero vidéo : autoplay robuste (iOS / mode éco) ---------- */
  (function () {
    const v = document.querySelector(".hero-video");
    if (!v) return;
    v.muted = true; v.setAttribute("muted", "");
    const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    const evts = ["touchstart", "pointerdown", "click", "scroll", "keydown"];
    const kick = () => { tryPlay(); if (!v.paused) evts.forEach((e) => removeEventListener(e, kick)); };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) tryPlay(); });
    evts.forEach((e) => addEventListener(e, kick, { passive: true }));
  })();

  /* ---------- Showcase produits (coverflow symétrique) ---------- */
  (function () {
    const stage = $("#scStage"); if (!stage) return;
    const cards = $$(".sc-card", stage); const N = cards.length; if (!N) return;
    const nameEl = $("#scName"), descEl = $("#scDesc"), noteEl = $("#scNote"), idxEl = $("#scIdx"), totEl = $("#scTot");
    if (totEl) totEl.textContent = N;
    // niveaux par distance |offset| au centre — symétrique gauche/droite
    const LV = [
      { s: 1,   o: 1,   z: 50, b: 0,   xf: 0   },
      { s: .62, o: .5,  z: 40, b: 1,   xf: .30 },
      { s: .42, o: .18, z: 30, b: 2.4, xf: .46 },
    ];
    const HIDDEN = { s: .38, o: 0, z: 20, b: 3, xf: .5 };
    let active = 0, timer;
    const signed = (i) => { let o = i - active; if (o > N / 2) o -= N; if (o < -N / 2) o += N; return o; };
    const apply = (c, off, W, animate) => {
      const lv = LV[Math.abs(off)] || HIDDEN;
      const x = Math.sign(off) * W * lv.xf;
      if (window.gsap && !reduce) {
        const props = { x, xPercent: -50, yPercent: -50, scale: lv.s, opacity: lv.o, filter: `blur(${lv.b}px)`, zIndex: lv.z };
        animate ? gsap.to(c, { ...props, duration: .8, ease: "power3.out", overwrite: "auto" }) : gsap.set(c, props);
      } else {
        c.style.transform = `translate(-50%,-50%) translateX(${x}px) scale(${lv.s})`;
        c.style.opacity = lv.o; c.style.filter = `blur(${lv.b}px)`; c.style.zIndex = lv.z;
      }
      c.style.pointerEvents = lv.o > .04 ? "auto" : "none";
    };
    const setInfo = (d, animate) => {
      const nm = d.dataset.name, de = d.dataset.desc, no = d.dataset.note;
      if (window.gsap && animate && !reduce) {
        gsap.to([nameEl, descEl, noteEl], { opacity: 0, y: -8, duration: .22, onComplete: () => {
          nameEl.textContent = nm; descEl.textContent = de; noteEl.textContent = no;
          gsap.fromTo([nameEl, descEl, noteEl], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .45, stagger: .05 });
        } });
      } else { nameEl.textContent = nm; descEl.textContent = de; noteEl.textContent = no; }
    };
    const layout = (animate) => {
      const W = stage.clientWidth || stage.offsetWidth || 1;
      cards.forEach((c, i) => apply(c, signed(i), W, animate));
      setInfo(cards[active], animate); if (idxEl) idxEl.textContent = active + 1;
    };
    const go = (dir) => { active = (active + dir + N) % N; layout(true); restart(); };
    const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(1), 4600); };
    $("#scNext")?.addEventListener("click", () => go(1));
    $("#scPrev")?.addEventListener("click", () => go(-1));
    cards.forEach((c, i) => c.addEventListener("click", () => { if (i !== active) { active = i; layout(true); restart(); } }));
    // swipe tactile (mobile)
    let sx = 0, sy = 0, sw = false;
    stage.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; sw = false; }, { passive: true });
    stage.addEventListener("touchmove", (e) => {
      if (sw) return;
      const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
      if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) { sw = true; go(dx < 0 ? 1 : -1); }
    }, { passive: true });
    let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => layout(false), 150); });
    layout(false); restart();
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
  gsap.utils.toArray(".promise,.engagement,.why,.maison,.showcase").forEach((s) => {
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
