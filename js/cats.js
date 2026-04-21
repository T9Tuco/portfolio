// cat, cause i love cats

(function cats() {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function cbust() { return `_t=${Date.now()}-${Math.floor(Math.random()*1e9)}`; }

  function buildWidget() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes catWidgetIn {
        from { opacity: 0; transform: translateY(20px) rotate(-1deg); }
        to { opacity: 1; transform: translateY(0) rotate(0deg); }
      }

      @keyframes catPhotoIn {
        from { opacity: 0; transform: translateY(12px) rotate(var(--cat-rotate, 0deg)); }
        to { opacity: 1; transform: translateY(0) rotate(var(--cat-rotate, 0deg)); }
      }

      #cat-widget {
        position: fixed;
        right: 24px;
        bottom: 24px;
        width: 248px;
        background: #11111b;
        border: 2px solid #f5c2e7;
        box-shadow: 0 0 0 1px #1a1a2e, 4px 4px 0 0 #f5c2e7;
        z-index: 9000;
        animation: catWidgetIn 0.35s ease;
      }

      #cat-widget.minimized #cat-widget-body {
        display: none;
      }

      #cat-widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 7px 10px;
        background: #1a0a2e;
        border-bottom: 1px solid #f5c2e7;
        user-select: none;
      }

      #cat-widget-title {
        font-size: 10px;
        color: #f5c2e7;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      #cat-widget-btns {
        display: flex;
        gap: 6px;
        align-items: center;
      }

      #cat-widget-btns button {
        background: none;
        border: 1px solid #f5c2e7;
        color: #f5c2e7;
        font: inherit;
        font-size: 9px;
        padding: 1px 5px;
        cursor: pointer;
      }

      #cat-widget-btns button:hover {
        background: #f5c2e7;
        color: #11111b;
      }

      #cat-widget-body {
        padding: 10px;
      }

      #cat-widget-frame {
        background: #0b0b14;
        border: 1px solid #2a1a3e;
        padding: 8px;
      }

      #cat-widget-photo {
        background: #f2e9de;
        padding: 8px 8px 20px;
        transform: rotate(-1.5deg);
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
      }

      #cat-widget-photo img {
        width: 100%;
        height: 170px;
        object-fit: cover;
        display: none;
        border: 1px solid rgba(0, 0, 0, 0.18);
        filter: saturate(0.96) contrast(1.04);
      }

      #cat-widget-loading {
        height: 170px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #11111b;
        font-size: 24px;
        background: linear-gradient(180deg, #f3eadf, #e7dbcd);
      }

      #cat-widget-caption {
        margin-top: 10px;
        color: #3d2b3d;
        font-size: 10px;
        letter-spacing: 0.08em;
        text-align: center;
        text-transform: lowercase;
      }

      #cat-widget-status {
        margin-top: 10px;
        color: #6c7086;
        font-size: 10px;
        line-height: 1.6;
        text-align: center;
      }

      #cat-widget-status::before {
        content: "real cat feed";
        display: block;
        color: #cba6f7;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .cat-gallery {
        margin-top: 1.8rem;
      }

      .cat-gallery-label {
        display: inline-block;
        color: #cba6f7;
        font-size: 0.65rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        margin-bottom: 0.9rem;
      }

      .cat-gallery-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.9rem;
        align-items: end;
      }

      .cat-photo-card {
        --cat-rotate: 0deg;
        background: #efe3d4;
        padding: 0.5rem 0.5rem 0.9rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
        transform: rotate(var(--cat-rotate));
        animation: catPhotoIn 0.35s ease;
      }

      .cat-photo-card img,
      .cat-photo-placeholder {
        width: 100%;
        height: 150px;
        object-fit: cover;
        display: block;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background: linear-gradient(180deg, #f3eadf, #e7dbcd);
      }

      .cat-photo-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: #2b1f2f;
      }

      .cat-photo-caption {
        margin-top: 0.55rem;
        color: #3d2b3d;
        font-size: 0.62rem;
        letter-spacing: 0.08em;
        text-align: center;
        text-transform: lowercase;
      }

      .cat-footer-strip {
        margin-top: 1.25rem;
        padding-top: 1rem;
        border-top: 1px solid #2a1a3e;
      }

      .cat-footer-row {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .cat-footer-shot {
        width: 112px;
        background: #efe3d4;
        padding: 0.35rem 0.35rem 0.75rem;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transform: rotate(var(--cat-rotate, 0deg));
      }

      .cat-footer-shot img,
      .cat-footer-shot .cat-photo-placeholder {
        height: 88px;
      }

      .cat-footer-note {
        text-align: center;
        color: #cba6f7;
        font-size: 0.62rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
      }

      @media (max-width: 768px) {
        #cat-widget {
          right: 12px;
          bottom: 12px;
          width: 214px;
        }

        #cat-widget-photo img,
        #cat-widget-loading {
          height: 148px;
        }

        .cat-gallery-grid {
          grid-template-columns: 1fr 1fr;
        }

        .cat-photo-card:last-child {
          grid-column: span 2;
        }
      }
    `;
    document.head.appendChild(style);

    const widget = document.createElement("div");
    widget.id = "cat-widget";
    widget.innerHTML = `
      <div id="cat-widget-header">
        <span id="cat-widget-title">today's cat photo</span>
        <div id="cat-widget-btns">
          <button id="cat-new">new</button>
          <button id="cat-min">_</button>
          <button id="cat-close">x</button>
        </div>
      </div>
      <div id="cat-widget-body">
        <div id="cat-widget-frame">
          <div id="cat-widget-photo">
            <div id="cat-widget-loading">🐈</div>
            <img id="cat-widget-img" alt="real cat photo" />
            <div id="cat-widget-caption">loading cat...</div>
          </div>
        </div>
        <div id="cat-widget-status">pulled from the internet because obviously.</div>
      </div>
    `;
    document.body.appendChild(widget);

    const img = widget.querySelector("#cat-widget-img");
    const loading = widget.querySelector("#cat-widget-loading");
    const caption = widget.querySelector("#cat-widget-caption");
    const status = widget.querySelector("#cat-widget-status");
    const minButton = widget.querySelector("#cat-min");

    const catCaptions = [
      "small criminal", "professional loaf", "blep evidence secured",
      "high-volume fur deployment", "sleepy mode activated", "junior internet resident",
      "cozy chaos agent", "definitely plotting something", "void starer",
    ];

    function loadCat() {
      loading.style.display = "flex";
      img.style.display = "none";
      caption.textContent = "loading cat...";
      status.textContent = "requesting a new real cat from cataas";

      img.src = `https://cataas.com/cat?width=240&height=180&${cbust()}`;
      img.onload = () => {
        loading.style.display = "none";
        img.style.display = "block";
        caption.textContent = catCaptions[Math.floor(Math.random() * catCaptions.length)];
        status.textContent = "pulled from the internet because obviously.";
      };
      img.onerror = () => {
        loading.textContent = "😿";
        caption.textContent = "cat escaped";
        status.textContent = "try again in a second";
      };
    }

    widget.querySelector("#cat-new").addEventListener("click", (event) => {
      event.stopPropagation();
      loadCat();
    });

    minButton.addEventListener("click", (event) => {
      event.stopPropagation();
      widget.classList.toggle("minimized");
      minButton.textContent = widget.classList.contains("minimized") ? "□" : "_";
    });

    widget.querySelector("#cat-close").addEventListener("click", (event) => {
      event.stopPropagation();
      widget.remove();
    });

    loadCat();
  }

  function addCursorPaws() {
    if (isReducedMotion) return;

    let lastSpawn = 0;
    document.addEventListener("mousemove", (event) => {
      const now = Date.now();
      if (now - lastSpawn < 110) return;
      lastSpawn = now;

      const paw = document.createElement("span");
      paw.textContent = "🐾";
      paw.style.cssText = `
        position: fixed;
        left: ${event.clientX - 8}px;
        top: ${event.clientY - 8}px;
        pointer-events: none;
        user-select: none;
        font-size: 13px;
        opacity: 1;
        z-index: 2147483640;
        transition: opacity 0.7s ease, transform 0.7s ease;
      `;
      document.body.appendChild(paw);

      requestAnimationFrame(() => {
        paw.style.opacity = "0";
        paw.style.transform = `translate(${(Math.random() - 0.5) * 16}px, -14px) rotate(${Math.random() * 20 - 10}deg)`;
      });

      setTimeout(() => paw.remove(), 800);
    });
  }

  function createCatPhotoCard(caption, rotate) {
    const card = document.createElement("figure");
    card.className = "cat-photo-card";
    card.style.setProperty("--cat-rotate", `${rotate}deg`);
    card.innerHTML = `
      <div class="cat-photo-placeholder skeleton">🐈</div>
      <img alt="real cat photo" style="display:none" />
      <figcaption class="cat-photo-caption">${caption}</figcaption>
    `;

    const img = card.querySelector("img");
    const placeholder = card.querySelector(".cat-photo-placeholder");
    img.src = `https://cataas.com/cat?width=320&height=220&${cbust()}`;
    img.onload = () => {
      placeholder.style.display = "none";
      img.style.display = "block";
    };
    img.onerror = () => {
      placeholder.classList.remove("skeleton");
      placeholder.textContent = "😿";
    };

    return card;
  }

  function addHeroCats() {
    const hero = document.querySelector(".hero-content");
    if (!hero) return;

    const wrap = document.createElement("div");
    wrap.className = "cat-gallery";
    wrap.innerHTML = `<span class="cat-gallery-label">random cats from the internet. finde ich</span>`;

    const grid = document.createElement("div");
    grid.className = "cat-gallery-grid";
    // bro wtf am i doing
    grid.appendChild(createCatPhotoCard("yea", -2.5));
    grid.appendChild(createCatPhotoCard("idk what to put in here", 1.8));
    grid.appendChild(createCatPhotoCard("idk bro", -1.2));

    wrap.appendChild(grid);
    hero.appendChild(wrap);
  }

  function createFooterCat(rotate) {
    const shot = document.createElement("figure");
    shot.className = "cat-footer-shot";
    shot.style.setProperty("--cat-rotate", `${rotate}deg`);
    shot.innerHTML = `
      <div class="cat-photo-placeholder skeleton">🐾</div>
      <img alt="real cat photo" style="display:none" />
    `;

    const img = shot.querySelector("img");
    const placeholder = shot.querySelector(".cat-photo-placeholder");
    img.src = `https://cataas.com/cat?width=180&height=140&${cbust()}`;
    img.onload = () => {
      placeholder.style.display = "none";
      img.style.display = "block";
    };
    img.onerror = () => {
      placeholder.classList.remove("skeleton");
      placeholder.textContent = "😿";
    };

    return shot;
  }

  function addFooterCats() {
    const footer = document.querySelector(".footer-content");
    if (!footer) return;

    const strip = document.createElement("div");
    strip.className = "cat-footer-strip";
    strip.innerHTML = `<div class="cat-footer-note">backup cat archive</div>`;

    const row = document.createElement("div");
    row.className = "cat-footer-row";
    row.appendChild(createFooterCat(-2));
    row.appendChild(createFooterCat(1.5));
    row.appendChild(createFooterCat(-1));

    strip.appendChild(row);
    footer.appendChild(strip);
  }

  function cycleTitle() {
    const base = document.title;
    const titles = [`🐈 ${base}`, `🐾 ${base}`, base];
    let index = 0;
    setInterval(() => {
      index = (index + 1) % titles.length;
      document.title = titles[index];
    }, 2600);
  }

  function init() {
    buildWidget();
    addHeroCats();
    addFooterCats();
    addCursorPaws();
    cycleTitle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
