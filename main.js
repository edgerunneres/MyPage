(function () {
  const data = window.portfolioData;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function byId(id) {
    return document.getElementById(id);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(name) {
    const node = document.createElement("i");
    node.setAttribute("data-lucide", name);
    return node;
  }

  function setProfile() {
    document.title = `${data.profile.displayName} | Portfolio`;
    document.querySelectorAll("[data-profile]").forEach((node) => {
      const key = node.dataset.profile;
      if (key === "avatar") {
        node.src = data.profile.avatar;
        node.alt = `${data.profile.handle} avatar`;
        node.addEventListener(
          "error",
          () => {
            node.style.display = "none";
            node.parentElement.dataset.initials = data.profile.handle.slice(0, 2).toUpperCase();
          },
          { once: true }
        );
      } else if (data.profile[key]) {
        node.textContent = data.profile[key];
      }
    });
  }

  function renderMetrics() {
    const board = byId("metric-board");
    board.innerHTML = "";
    data.metrics.forEach((metric) => {
      const card = el("article", "metric-card");
      const number = el("strong");
      number.dataset.countTo = metric.value;
      number.dataset.suffix = metric.suffix || "";
      number.textContent = `0${metric.suffix || ""}`;
      card.append(number, el("span", "", metric.label), el("small", "", metric.detail));
      board.append(card);
    });
  }

  function renderPillars() {
    const grid = byId("pillar-grid");
    grid.innerHTML = "";
    data.pillars.forEach((pillar) => {
      const card = el("article", "pillar-card tilt-card");
      const iconBox = el("div", "card-icon");
      iconBox.append(icon(pillar.icon));
      card.append(
        iconBox,
        el("div", "card-kicker", pillar.kicker),
        el("h3", "", pillar.title),
        el("p", "", pillar.body)
      );
      grid.append(card);
    });
  }

  function renderProjects() {
    const grid = byId("project-grid");
    grid.innerHTML = "";
    data.projects.forEach((project) => {
      const card = el("article", "project-card tilt-card");
      const head = el("div", "project-head");
      const titleGroup = el("div");
      titleGroup.append(el("div", "project-status", project.status), el("h3", "", project.title));
      head.append(titleGroup, el("span", "project-period", project.period));

      const tags = el("div", "tag-row");
      project.tags.forEach((tag) => tags.append(el("span", "", tag)));

      const links = el("div", "project-links");
      project.links.forEach((link) => {
        const anchor = el("a", "", link.label);
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
        links.append(anchor);
      });

      card.append(
        head,
        el("p", "", project.summary),
        tags,
        el("div", "project-impact", project.impact)
      );

      if (project.links.length) card.append(links);
      grid.append(card);
    });
  }

  function renderResearch() {
    const list = byId("research-list");
    list.innerHTML = "";
    data.research.forEach((item) => {
      const card = el("article", "research-card tilt-card");
      const methods = el("div", "method-row");
      item.methods.forEach((method) => methods.append(el("span", "", method)));
      card.append(el("div", "card-meta", item.period), el("h3", "", item.title), el("p", "", item.body), methods);
      list.append(card);
    });

    const paperList = byId("paper-list");
    paperList.innerHTML = "";
    data.papers.forEach((paper) => {
      const card = el("article", "paper-card tilt-card");
      card.append(
        el("div", "paper-venue", `${paper.venue} / ${paper.year}`),
        el("h3", "", paper.title),
        el("p", "", paper.description)
      );
      paperList.append(card);
    });
  }

  function renderProof() {
    const grid = byId("proof-grid");
    grid.innerHTML = "";
    data.proof.forEach((item) => {
      const card = el("article", "proof-card tilt-card");
      card.dataset.proofType = item.type;
      const iconBox = el("div", "card-icon");
      iconBox.append(icon(item.icon));
      card.append(iconBox, el("div", "card-meta", item.meta), el("h3", "", item.title), el("p", "", item.body));
      grid.append(card);
    });
  }

  function renderTimeline() {
    const list = byId("timeline-list");
    list.innerHTML = "";
    data.timeline.forEach((item) => {
      const row = el("li", "timeline-item");
      row.append(
        el("div", "timeline-period", item.period),
        (() => {
          const copy = el("div");
          copy.append(el("h3", "", item.title), el("p", "", item.body));
          return copy;
        })()
      );
      list.append(row);
    });
  }

  function renderContacts() {
    const links = byId("contact-links");
    links.innerHTML = "";
    data.contacts.forEach((contact) => {
      const anchor = el("a", "contact-card tilt-card");
      anchor.href = contact.url;
      if (!contact.url.startsWith("mailto:") && contact.url !== "#") {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }
      const iconBox = el("div", "card-icon");
      iconBox.append(icon(contact.icon));
      const copy = el("div");
      copy.append(el("strong", "", contact.label), el("span", "", contact.value));
      anchor.append(iconBox, copy);
      links.append(anchor);
    });
  }

  function initReveal() {
    const targets = document.querySelectorAll(
      "[data-reveal], .project-card, .pillar-card, .research-card, .paper-card, .proof-card, .timeline-item"
    );
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    targets.forEach((target) => observer.observe(target));
  }

  function initCounters() {
    const numbers = document.querySelectorAll("[data-count-to]");
    if (reducedMotion) {
      numbers.forEach((node) => {
        node.textContent = `${node.dataset.countTo}${node.dataset.suffix || ""}`;
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          const target = Number(node.dataset.countTo);
          const suffix = node.dataset.suffix || "";
          const started = performance.now();
          const duration = 900;

          function tick(now) {
            const progress = Math.min(1, (now - started) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = `${Math.round(target * eased)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.unobserve(node);
        });
      },
      { threshold: 0.6 }
    );

    numbers.forEach((node) => observer.observe(node));
  }

  function initProofFilter() {
    const buttons = document.querySelectorAll("[data-proof-filter]");
    const cards = document.querySelectorAll("[data-proof-type]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.proofFilter;
        buttons.forEach((item) => item.classList.toggle("active", item === button));
        cards.forEach((card) => {
          card.classList.toggle("is-hidden", filter !== "all" && card.dataset.proofType !== filter);
        });
      });
    });
  }

  function initScrollState() {
    const progress = document.querySelector(".scroll-progress span");
    const navLinks = [...document.querySelectorAll(".site-nav a")];
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      progress.style.width = `${ratio * 100}%`;

      let activeId = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom > 160) activeId = section.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initTilt() {
    if (reducedMotion) return;
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }

  function initMagneticButtons() {
    if (reducedMotion) return;
    document.querySelectorAll(".magnetic").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  function initAmbientCanvas() {
    const canvas = byId("ambient-canvas");
    const context = canvas.getContext("2d");
    const pointer = { x: 0.72, y: 0.28 };
    let width = 0;
    let height = 0;
    let lines = [];
    let raf = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(18, Math.floor(width / 62));
      lines = Array.from({ length: count }, (_, index) => ({
        x: (index / count) * width + Math.random() * 30,
        y: Math.random() * height,
        speed: 0.18 + Math.random() * 0.32,
        length: 130 + Math.random() * 260,
        phase: Math.random() * Math.PI * 2,
        hue: index % 3
      }));
    }

    function draw(now) {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      lines.forEach((line, index) => {
        const wave = Math.sin(now * 0.0007 + line.phase) * 34;
        const targetX = pointer.x * width;
        const targetY = pointer.y * height;
        const attract = 1 / (1 + Math.abs(line.x - targetX) / width + Math.abs(line.y - targetY) / height);
        const x = line.x + wave * attract;
        const y = line.y;
        const gradient = context.createLinearGradient(x, y, x + line.length, y + line.length * 0.34);
        const accent = line.hue === 0 ? "201, 164, 92" : line.hue === 1 ? "94, 199, 189" : "141, 63, 74";
        gradient.addColorStop(0, `rgba(${accent}, 0)`);
        gradient.addColorStop(0.5, `rgba(${accent}, ${0.08 + attract * 0.18})`);
        gradient.addColorStop(1, `rgba(${accent}, 0)`);

        context.beginPath();
        context.strokeStyle = gradient;
        context.lineWidth = index % 5 === 0 ? 1.4 : 0.8;
        context.moveTo(x, y);
        context.bezierCurveTo(x + line.length * 0.3, y - 28, x + line.length * 0.68, y + 48, x + line.length, y);
        context.stroke();

        line.y += line.speed;
        line.x += Math.sin(now * 0.0003 + line.phase) * 0.12;
        if (line.y > height + 80) {
          line.y = -80;
          line.x = Math.random() * width;
        }
      });

      context.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    }

    if (reducedMotion) return;
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.x = event.clientX / Math.max(1, width);
        pointer.y = event.clientY / Math.max(1, height);
      },
      { passive: true }
    );
    raf = requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
  }

  function initIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      window.addEventListener("load", () => window.lucide && window.lucide.createIcons());
    }
  }

  setProfile();
  renderMetrics();
  renderPillars();
  renderProjects();
  renderResearch();
  renderProof();
  renderTimeline();
  renderContacts();
  initIcons();
  initReveal();
  initCounters();
  initProofFilter();
  initScrollState();
  initTilt();
  initMagneticButtons();
  initAmbientCanvas();
})();
