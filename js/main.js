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

/* =========================================================
   Project page: tabs, gallery, lightbox, 360 view, lead forms, WhatsApp
   ========================================================= */
(() => {
  // Your WhatsApp number with country code, digits only (e.g. 919876543210)
  const WHATSAPP_NUMBER = '910000000000';
  // Optional: paste a form endpoint (e.g. https://formspree.io/f/xxxx) to receive leads by email
  const FORM_ENDPOINT = '';

  const waLink = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  document.querySelectorAll('.js-wa').forEach(a => {
    a.href = waLink('Hi, I am interested in Vedant Residency. Please share details.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const select = tab => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const next = tabs[(i + d + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
    select(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]);
  });

  /* ---------- Sticky sub-navigation: highlight the section in view ---------- */
  const subLinks = [...document.querySelectorAll('.subnav a[href^="#"]')];
  if (subLinks.length) {
    const map = new Map(subLinks.map(a => [document.querySelector(a.getAttribute('href')), a]).filter(([s]) => s));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        subLinks.forEach(a => a.classList.remove('is-active'));
        const a = map.get(e.target);
        if (a && !a.classList.contains('subnav__cta')) {
          a.classList.add('is-active');
          a.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, s) => spy.observe(s));
  }

  /* ---------- Gallery filter ---------- */
  const filters = document.querySelectorAll('.filters button');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    document.querySelectorAll('.gallery__grid .g').forEach(g => g.classList.toggle('is-hidden', f !== 'all' && g.dataset.cat !== f));
  }));

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById('lightbox');
  if (lb) {
    const img = lb.querySelector('img');
    let list = [], idx = 0, opener = null;
    const show = i => {
      idx = (i + list.length) % list.length;
      const el = list[idx];
      img.src = el.dataset.lightbox;
      img.alt = (el.querySelector('img') || {}).alt || '';
    };
    const open = el => {
      const group = el.closest('.gallery__grid, .tabs') || document;
      list = [...group.querySelectorAll('[data-lightbox]')].filter(x => !x.classList.contains('is-hidden') && !x.closest('[hidden]'));
      opener = el;
      show(list.indexOf(el));
      lb.hidden = false;
      document.body.classList.add('menu-open');
      lb.querySelector('.lightbox__close').focus();
    };
    const close = () => {
      lb.hidden = true;
      document.body.classList.remove('menu-open');
      if (opener) opener.focus({ preventScroll: true });
    };
    document.querySelectorAll('[data-lightbox]').forEach(el => el.addEventListener('click', () => open(el)));
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__nav--prev').addEventListener('click', () => show(idx - 1));
    lb.querySelector('.lightbox__nav--next').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- 360° panorama viewer ---------- */
  document.querySelectorAll('[data-pano]').forEach(pano => {
    const view = pano.querySelector('.pano__view');
    let x = 0, dragging = false, startX = 0, startPos = 0, auto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const set = () => { view.style.backgroundPositionX = `${x}px`; };
    const touched = () => { auto = false; pano.classList.add('is-touched'); };
    view.addEventListener('pointerdown', e => {
      dragging = true; startX = e.clientX; startPos = x; touched();
      view.setPointerCapture(e.pointerId);
    });
    view.addEventListener('pointermove', e => { if (dragging) { x = startPos + (e.clientX - startX) * 1.4; set(); } });
    ['pointerup', 'pointercancel'].forEach(t => view.addEventListener(t, () => { dragging = false; }));
    view.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { x += 60; touched(); set(); }
      if (e.key === 'ArrowRight') { x -= 60; touched(); set(); }
    });
    const tick = () => {
      if (auto && pano.getBoundingClientRect().top < innerHeight) { x -= 0.35; set(); }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    pano.querySelectorAll('.pano__rooms button').forEach(b => b.addEventListener('click', () => {
      pano.querySelectorAll('.pano__rooms button').forEach(o => o.classList.toggle('is-active', o === b));
      view.style.backgroundImage = `url(${b.dataset.src})`;
    }));
    const full = pano.querySelector('.pano__full');
    if (full) full.addEventListener('click', () => {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else pano.requestFullscreen().catch(() => {});
      } catch (err) { /* fullscreen not available */ }
    });
  });

  /* ---------- Prefill the enquiry form from a floor plan ---------- */
  document.querySelectorAll('.js-prefill').forEach(a => a.addEventListener('click', () => {
    const sel = document.getElementById('enq-config');
    if (sel) sel.value = a.dataset.config;
  }));

  /* ---------- Lead forms ---------- */
  document.querySelectorAll('.js-lead').forEach(form => {
    const err = form.querySelector('.form-error');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const phone = (data.phone || '').replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
      const problems = [];
      form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
      if (!(data.name || '').trim()) { problems.push('Please enter your name.'); form.querySelector('[name="name"]').setAttribute('aria-invalid', 'true'); }
      if (!/^[6-9]\d{9}$/.test(phone)) { problems.push('Please enter a valid 10-digit mobile number.'); form.querySelector('[name="phone"]').setAttribute('aria-invalid', 'true'); }
      if (!data.consent) problems.push('Please agree to be contacted.');
      if (problems.length) { err.textContent = problems.join(' '); err.hidden = false; return; }
      err.hidden = true;

      const lead = { ...data, phone, type: form.dataset.kind, page: location.pathname, time: new Date().toISOString() };
      if (FORM_ENDPOINT) {
        try {
          await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(lead) });
        } catch (x) { /* still show the thank-you and WhatsApp option */ }
      }
      const msg = [`Hi, I am ${lead.name}.`, `${lead.type} for Vedant Residency.`, lead.configuration ? `Interested in: ${lead.configuration}.` : '', lead.visit_date ? `Preferred visit date: ${lead.visit_date}.` : '', `Mobile: ${phone}.`, lead.message || ''].filter(Boolean).join(' ');
      const waDone = form.querySelector('.js-wa-done');
      if (waDone) waDone.href = waLink(msg);
      form.classList.add('is-sent');
      form.querySelector('.form-done').hidden = false;
    });
  });
})();
