/* Utilities */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ========== Mobile drawer / Hamburger ========== */
(() => {
  const btn = qs('.hamburger');
  const drawer = qs('#mobile-drawer');
  const closeBtn = qs('.drawer-close');
  const backdrop = qs('.drawer-backdrop');

  const open = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  // Close on escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ========== Gallery: arrows, dots, thumbnails ========== */
(() => {
  const slides = qsa('.gallery-slide');
  const dots = qsa('.gallery-dots .dot');
  const thumbs = qsa('.gallery-thumbs .thumb');
  const prev = qs('.gallery-nav.prev');
  const next = qs('.gallery-nav.next');

  let current = 0;

  const setActive = (index) => {
    current = index;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    thumbs.forEach((t, i) => t.classList.toggle('is-active', i === current));
  };

  const go = (dir) => {
    const nextIndex = (current + dir + slides.length) % slides.length;
    setActive(nextIndex);
  };

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => setActive(i)));
  thumbs.forEach((btn) => btn.addEventListener('click', () => setActive(Number(btn.dataset.index))));
})();

/* ========== Radio groups: Add to Cart link updates (9 variations) ========== */
(() => {
  const addToCart = qs('#addToCart');
  const base = addToCart.dataset.base || 'https://example.com/add-to-cart';
  const fragranceInputs = qsa('input[name="fragrance"]');
  const purchaseInputs = qsa('input[name="purchase"]');

  // Subscription panels
  const singleSubPanel = qs('.panel-single-subscription');
  const doubleSubPanel = qs('.panel-double-subscription');

  const updatePanels = (purchaseValue) => {
    const showSingle = purchaseValue === 'single-subscription';
    const showDouble = purchaseValue === 'double-subscription';
    singleSubPanel.hidden = !showSingle;
    doubleSubPanel.hidden = !showDouble;
  };

  const updateLink = () => {
    const fragrance = fragranceInputs.find(i => i.checked)?.value;
    const purchase = purchaseInputs.find(i => i.checked)?.value;
    // Unique 9 combinations => construct dummy link
    const href = `${base}?fragrance=${encodeURIComponent(fragrance)}&purchase=${encodeURIComponent(purchase)}`;
    addToCart.href = href;
  };

  // Init
  updateLink();
  updatePanels(purchaseInputs.find(i => i.checked)?.value);

  fragranceInputs.forEach((inp) => inp.addEventListener('change', updateLink));
  purchaseInputs.forEach((inp) => inp.addEventListener('change', () => {
    updateLink();
    updatePanels(inp.value);
  }));
})();

/* ========== Percent count-up on intersection ========== */
(() => {
  const counters = qsa('.percent-number');
  const format = (n) => `${n}%`;

  const animate = (el) => {
    const target = Number(el.dataset.target) || 0;
    const duration = 1200; // ms
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const value = Math.round(eased * target);
      el.textContent = format(value);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => observer.observe(c));
})();

/* ========== Progressive enhancement: smooth anchor scroll (optional) ========== */
(() => {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const el = qs(`#${CSS.escape(id)}`);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile drawer if open
    const drawer = qs('#mobile-drawer');
    if (drawer.classList.contains('is-open')) {
      qs('.drawer-close').click();
    }
  });
})();