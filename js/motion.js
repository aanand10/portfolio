// Motion layer: Lenis smooth scroll + GSAP ScrollTrigger, hero intro,
// magnetic buttons, custom cursor and scroll/cursor-driven globes.
// Everything here is progressive: if GSAP/Lenis fail to load, or the visitor
// prefers reduced motion, the page stays fully usable and visible.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function initSmoothScroll() {
    if (reduceMotion || !window.Lenis) return null;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Drive Lenis from GSAP's ticker so ScrollTrigger and Lenis share one frame
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));

    return lenis;
  }

  // Wrap each character of an element's text in masked spans for a line reveal
  function splitChars(el) {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(" ")
      .map(
        (word) =>
          `<span class="split-word" aria-hidden="true">${[...word]
            .map((ch) => `<span class="split-char">${ch}</span>`)
            .join("")}</span>`
      )
      .join(" ");
    return el.querySelectorAll(".split-char");
  }

  function initHeroIntro() {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const title = hero.querySelector("h1");
    const chars = title ? splitChars(title) : [];

    // Paused until the globes' first (heavy) frames have rendered, otherwise
    // the main-thread stall swallows the start of the intro
    const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
    tl.from(".hero-globe", { scale: 0.6, autoAlpha: 0, duration: 1.8, ease: "power3.out" }, 0)
      .from(".hero-subtitle", { y: 20, autoAlpha: 0, duration: 0.9 }, 0.2)
      .from(chars, { yPercent: 110, rotate: 6, duration: 1.2, stagger: 0.035 }, 0.3)
      .from(".hero-description", { y: 30, autoAlpha: 0, duration: 1 }, 0.9)
      .from(".hero-buttons > *", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 1.05)
      .from(".scroll-indicator", { autoAlpha: 0, duration: 0.8 }, 1.4);

    const start = () => requestAnimationFrame(() => requestAnimationFrame(() => tl.play()));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    // Parallax the copy away as the hero scrolls out
    gsap.to(".hero-content", {
      yPercent: -18,
      autoAlpha: 0.2,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
  }

  function initHeroGlobe(globes, lenis) {
    const el = document.querySelector(".hero-globe");
    if (!el) return;

    // GSAP owns the transform from here; keep the CSS vertical centring
    gsap.set(el, { yPercent: -50 });

    // The planet swells and sinks slightly as you scroll past the hero
    gsap.to(el, {
      scale: 1.25,
      yPercent: -30,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Scrolling spins the globe a little faster
    if (lenis && globes && globes.hero) {
      lenis.on("scroll", ({ velocity }) => globes.hero.nudge(velocity * 0.00025));
    }

    // Cursor parallax: the globe drifts toward the pointer
    if (finePointer) {
      const xTo = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" });
      window.addEventListener("mousemove", (e) => {
        xTo((e.clientX / window.innerWidth - 0.5) * 40);
        yTo((e.clientY / window.innerHeight - 0.5) * 30);
      });
    }
  }

  // Scroll drives the journey: the globe turns to face each city in order
  function initJourneyScroll(globes) {
    const globe = globes && globes.journey;
    const section = document.getElementById("journey");
    const items = [...document.querySelectorAll(".journey-pin-item")];
    if (!globe || !section || !items.length) return;

    let current = -1;
    const activate = (index) => {
      if (index === current) return;
      current = index;
      globe.focusOn(index);
      items.forEach((c, i) => c.classList.toggle("is-active", i === index));
    };

    const mm = gsap.matchMedia();

    // Wide screens: pin the section and step through the stops as you scroll
    mm.add("(min-width: 901px)", () => {
      const content = section.querySelector(".journey-content") || section;
      ScrollTrigger.create({
        trigger: content,
        start: "center center",
        end: () => "+=" + window.innerHeight * 0.6 * items.length,
        pin: section,
        // .main-content is a flex column, where ScrollTrigger drops spacing by default
        pinSpacing: true,
        onUpdate: (self) =>
          activate(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
        onLeaveBack: () => activate(0),
      });
    });

    // Stacked layout: the stop nearest the middle of the screen is the active one
    mm.add("(max-width: 900px)", () => {
      const nearestToCenter = () => {
        const mid = window.innerHeight / 2;
        let best = 0;
        let bestDist = Infinity;
        items.forEach((item, i) => {
          const r = item.getBoundingClientRect();
          const dist = Math.abs(r.top + r.height / 2 - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        activate(best);
      };
      ScrollTrigger.create({
        trigger: items[0].parentElement,
        start: "top 75%",
        end: "bottom 25%",
        onUpdate: nearestToCenter,
        onToggle: nearestToCenter,
      });
    });
  }

  function initSectionReveals() {
    document.querySelectorAll(".section").forEach((section) => {
      const header = section.querySelector(".section-header");
      if (header) {
        gsap.from(header.children, {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: header, start: "top 85%", once: true },
        });
      }

      const body = [...section.children].filter((c) => c !== header);
      if (body.length) {
        gsap.from(body, {
          y: 60,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: body[0], start: "top 88%", once: true },
        });
      }
    });
  }

  function initMagnetic() {
    if (!finePointer) return;
    document.querySelectorAll(".hero-buttons a, .navigation .nav-cta, [data-magnetic]").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  function initCursor() {
    if (!finePointer) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    ring.innerHTML = '<span class="cursor-label"></span>';
    document.body.append(ring, dot);
    // Stay hidden until the first mousemove so it never sits at 0,0
    document.documentElement.classList.add("has-custom-cursor", "cursor-hidden");

    const label = ring.querySelector(".cursor-label");
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1 });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1 });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    window.addEventListener("mousemove", (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      document.documentElement.classList.remove("cursor-hidden");
    });
    document.addEventListener("mouseleave", () =>
      document.documentElement.classList.add("cursor-hidden")
    );

    // Grow over interactive elements; show a "Drag" label over the globes
    document.addEventListener("mouseover", (e) => {
      const onGlobe = e.target.closest(".hero-globe canvas, .journey-globe canvas");
      const onLink = e.target.closest("a, button, input, textarea, [role='button']");
      ring.classList.toggle("is-link", !!onLink && !onGlobe);
      ring.classList.toggle("is-drag", !!onGlobe);
      label.textContent = onGlobe ? "Drag" : "";
    });
    window.addEventListener("mousedown", () => ring.classList.add("is-down"));
    window.addEventListener("mouseup", () => ring.classList.remove("is-down"));
  }

  function initMotion(globes) {
    if (!window.gsap || !window.ScrollTrigger) return { lenis: null };
    gsap.registerPlugin(ScrollTrigger);

    const lenis = initSmoothScroll();
    initCursor();

    if (!reduceMotion) {
      initMagnetic();
      initHeroIntro();
      initHeroGlobe(globes, lenis);
      initSectionReveals();
    }
    initJourneyScroll(globes);

    // Images and the globes' canvases change layout after load
    window.addEventListener("load", () => ScrollTrigger.refresh());

    return { lenis };
  }

  window.PortfolioMotion = { initMotion };
})();
