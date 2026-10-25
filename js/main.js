/* Vedant Developers & Builders — interactions and scroll animations */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const ease = t => 1 - Math.pow(1 - t, 3);

  document.querySelectorAll('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Split text into words / letters ---------- */
  document.querySelectorAll('[data-split]').forEach(el => {
    const byWords = el.dataset.split === 'words';
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.textContent = '';
    let ci = 0;
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      if (byWords) {
        const c = document.createElement('span');
        c.className = 'c';
        c.style.setProperty('--ci', ci++);
        c.textContent = word;
        w.appendChild(c);
      } else {
        [...word].forEach(ch => {
          const c = document.createElement('span');
          c.className = 'c';
          c.style.setProperty('--ci', ci++);
          c.textContent = ch;
          w.appendChild(c);
        });
      }
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- Reveal on enter ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  document.querySelectorAll('[data-split], [data-reveal]').forEach(el => io.observe(el));

  /* ---------- Menu ---------- */
  const menu = document.getElementById('menu');
  const openBtn = document.getElementById('menuOpen');
  const closeBtn = document.getElementById('menuClose');
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if (open) closeBtn.focus({ preventScroll: true });
  };
  openBtn.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => { setMenu(false); openBtn.focus({ preventScroll: true }); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  menu.querySelectorAll('.js-menu-link').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Rotating word ---------- */
  const words = [...document.querySelectorAll('.rotator__word')];
  if (words.length > 1) {
    let i = 0;
    setInterval(() => {
      const cur = words[i];
      i = (i + 1) % words.length;
      const next = words[i];
      cur.classList.remove('is-active');
      cur.classList.add('is-leaving');
      next.classList.remove('is-leaving');
      next.classList.add('is-active');
      setTimeout(() => cur.classList.remove('is-leaving'), 800);
    }, 1800);
  }

  /* ---------- Marquee: duplicate the track so it loops seamlessly ---------- */
  document.querySelectorAll('.marquee__track').forEach(track => {
    [...track.children].forEach(node => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* ---------- Scroll-driven effects ---------- */
  const parallax = [...document.querySelectorAll('[data-speed]')];
  const zoom = document.querySelector('.zoom');
  const scatter = document.querySelector('.scatter');
  const scatterImgs = scatter ? [...scatter.querySelectorAll('.scatter__img')] : [];
  const scatterText = scatter ? scatter.querySelector('.scatter__text') : null;

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    document.body.classList.toggle('is-scrolled', window.scrollY > vh * 0.6);

    if (reduceMotion) return;

    // Parallax: shift relative to how far the element's centre is from the viewport centre
    parallax.forEach(el => {
      const r = (el.parentElement || el).getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const offset = (r.top + r.height / 2) - vh / 2;
      el.style.transform = `translate3d(0, ${(-offset * parseFloat(el.dataset.speed)).toFixed(1)}px, 0)`;
    });

    // Zoom: frame grows while the headline shrinks as the section passes
    if (zoom) {
      const r = zoom.getBoundingClientRect();
      const p = range(vh - r.top, vh * 0.15, vh + r.height * 0.45);
      zoom.style.setProperty('--zp', ease(p).toFixed(4));
    }

    // Scatter: images start stacked, fly out to their spots, then the text fades in
    if (scatter) {
      const r = scatter.getBoundingClientRect();
      const total = r.height - vh;
      const p = clamp(-r.top / total);
      const t = ease(range(p, 0.05, 0.6));
      const k = 1 + range(p, 0.6, 1) * 0.35; // keep drifting outward at the end
      scatterImgs.forEach((img, idx) => {
        const stagger = clamp(t * 1.15 - idx * 0.02);
        img.style.setProperty('--t', stagger.toFixed(4));
        img.style.setProperty('--k', k.toFixed(4));
      });
      if (scatterText) scatterText.style.setProperty('--to', ease(range(p, 0.3, 0.62)).toFixed(3));
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
