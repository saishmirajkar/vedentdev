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

  /* ---------- Panorama viewer: drag or auto-pan across a wide photo ---------- */
  document.querySelectorAll('[data-pano]').forEach(pano => {
    const view = pano.querySelector('.pano__view');
    let x = 0, dir = -1, dragging = false, startX = 0, startPos = 0, imgW = 0;
    let auto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const measure = src => {
      const im = new Image();
      im.onload = () => {
        const h = view.clientHeight, w = view.clientWidth;
        imgW = Math.max(w, h * im.naturalWidth / im.naturalHeight);
        view.style.backgroundSize = `${imgW}px auto`;
        if (imgW * im.naturalHeight / im.naturalWidth < h) view.style.backgroundSize = 'cover';
        x = (w - imgW) / 2; set();
      };
      im.src = src;
    };
    const set = () => {
      const min = Math.min(0, view.clientWidth - imgW);
      x = Math.max(min, Math.min(0, x));
      view.style.backgroundPosition = `${x}px 50%`;
    };
    const touched = () => { auto = false; pano.classList.add('is-touched'); };
    view.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; startPos = x; touched(); view.setPointerCapture(e.pointerId); });
    view.addEventListener('pointermove', e => { if (dragging) { x = startPos + (e.clientX - startX); set(); } });
    ['pointerup', 'pointercancel'].forEach(t => view.addEventListener(t, () => { dragging = false; }));
    view.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { x += 60; touched(); set(); }
      if (e.key === 'ArrowRight') { x -= 60; touched(); set(); }
    });
    const tick = () => {
      if (auto && imgW && pano.getBoundingClientRect().top < innerHeight) {
        const min = Math.min(0, view.clientWidth - imgW);
        x += dir * 0.4;
        if (x <= min || x >= 0) dir *= -1;
        set();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const first = view.style.backgroundImage.match(/url\(["']?([^"')]+)/);
    if (first) measure(first[1]);
    window.addEventListener('resize', () => { const m = view.style.backgroundImage.match(/url\(["']?([^"')]+)/); if (m) measure(m[1]); });
    pano.querySelectorAll('.pano__rooms button').forEach(btn => btn.addEventListener('click', () => {
      pano.querySelectorAll('.pano__rooms button').forEach(o => o.classList.toggle('is-active', o === btn));
      view.style.backgroundImage = `url(${btn.dataset.src})`;
      measure(btn.dataset.src);
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

/* =========================================================
   V2: loader, page transitions, smooth scroll, cursor, cinematic scroll scenes
   ========================================================= */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  const store = { get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } } };

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -80 });
    }));
  }

  /* ---------- Loader / curtain ---------- */
  const loader = document.querySelector('.loader');
  const finishLoad = () => {
    if (loader) loader.classList.add('is-done');
    document.body.classList.add('is-loaded');
    if (lenis) lenis.start();
  };
  if (loader) {
    const isHome = !!document.querySelector('[data-rise]');
    const first = isHome && !store.get('vd-intro');
    if (reduce || !first) {
      loader.classList.add('is-quick');
      setTimeout(finishLoad, reduce ? 0 : 350);
    } else {
      store.set('vd-intro', '1');
      if (lenis) lenis.stop();
      const num = loader.querySelector('.loader__count span');
      const t0 = performance.now(), dur = 1700;
      const step = now => {
        const k = clamp((now - t0) / dur);
        num.textContent = Math.round(ease(k) * 100);
        if (k < 1) requestAnimationFrame(step); else setTimeout(finishLoad, 200);
      };
      requestAnimationFrame(step);
    }
    // Curtain on the way out to another page
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html?$|\/$/.test(url.pathname) || (url.pathname === location.pathname)) return;
      e.preventDefault();
      loader.classList.add('is-quick');
      loader.classList.remove('is-done');
      document.body.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 650);
    });
    window.addEventListener('pageshow', ev => { if (ev.persisted) { document.body.classList.remove('is-leaving'); finishLoad(); } });
  } else {
    document.body.classList.add('is-loaded');
  }

  /* ---------- Cursor ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && fine && !reduce) {
    document.documentElement.classList.add('has-cursor');
    const dot = cursor.querySelector('.cursor__dot'), ring = cursor.querySelector('.cursor__ring'), label = cursor.querySelector('.cursor__label');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const loop = () => {
      rx = lerp(rx, mx, .18); ry = lerp(ry, my, .18);
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', e => {
      const lab = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, [tabindex], .gpanel, .alist__rows li');
      cursor.classList.toggle('is-label', !!lab);
      cursor.classList.toggle('is-link', !lab && !!link);
      label.textContent = lab ? lab.dataset.cursor : '';
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Image wipe reveals ---------- */
  const imgIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); imgIO.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-img-reveal]').forEach(el => imgIO.observe(el));

  /* ---------- Fill text: split into words ---------- */
  const fills = [...document.querySelectorAll('[data-fill]')].map(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(w => `<span class="fw" aria-hidden="true">${w}</span>`).join(' ');
    return { el, words: [...el.querySelectorAll('.fw')] };
  });

  /* ---------- Generations panels ---------- */
  const gpanels = [...document.querySelectorAll('.gpanel')];
  const openPanel = p => gpanels.forEach(o => o.classList.toggle('is-open', o === p));
  gpanels.forEach(p => {
    p.addEventListener('mouseenter', () => openPanel(p));
    p.addEventListener('focus', () => openPanel(p));
    p.addEventListener('click', () => openPanel(p));
  });

  /* ---------- Amenities floating preview ---------- */
  const float = document.querySelector('.alist__float');
  if (float && fine) {
    const fimg = float.querySelector('img');
    let fx = 0, fy = 0, tx = 0, ty = 0, on = false;
    document.querySelectorAll('.alist__rows li').forEach(li => {
      const pre = new Image(); pre.src = li.dataset.img;
      li.addEventListener('mouseenter', () => { fimg.src = li.dataset.img; on = true; float.classList.add('is-on'); });
      li.addEventListener('mouseleave', () => { on = false; float.classList.remove('is-on'); });
    });
    window.addEventListener('mousemove', e => { tx = e.clientX + 30; ty = e.clientY - 120; }, { passive: true });
    const loop = () => {
      fx = lerp(fx, tx, .14); fy = lerp(fy, ty, .14);
      if (on || float.classList.contains('is-on')) float.style.transform = `translate3d(${fx}px, ${fy}px, 0) scale(${on ? 1 : .8})`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Scenes ---------- */
  const rise = document.querySelector('[data-rise]');
  const riseStages = rise ? [...rise.querySelectorAll('.rise__stages li')] : [];
  const cam = document.querySelector('[data-camera]');
  const camImg = cam && cam.querySelector('.camera__img');
  const camPin = cam && cam.querySelector('.camera__pin');
  const camSteps = cam ? [...cam.querySelectorAll('.camera__step')] : [];
  const stops = camSteps.map(s => ({ x: +s.dataset.x, y: +s.dataset.y, z: +s.dataset.z }));
  const hs = document.querySelector('[data-hscroll]');
  const hsTrack = hs && hs.querySelector('.hscroll__track');
  const cut = document.querySelector('[data-cutout] .cutout__word');
  const mobile = () => innerWidth <= 809;

  const sizeHs = () => {
    if (!hs) return;
    if (mobile() || reduce) { hs.style.height = ''; return; }
    hs.style.height = `${hsTrack.scrollWidth - innerWidth + innerHeight}px`;
  };
  sizeHs();
  window.addEventListener('resize', sizeHs);
  window.addEventListener('load', sizeHs);

  const progress = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight)); };

  const frame = () => {
    const vw = innerWidth, vh = innerHeight;

    if (rise && !reduce) {
      const p = progress(rise);
      const r = ease(range(p, .06, .55));
      const s = rise.style;
      s.setProperty('--r', r.toFixed(4));
      s.setProperty('--scan', r > .002 && r < .995 ? 1 : 0);
      s.setProperty('--tp', ease(range(p, .28, .52)).toFixed(4));
      s.setProperty('--inset', (1 - ease(range(p, .55, .78))).toFixed(4));
      const fin = ease(range(p, .72, .9));
      s.setProperty('--fin', fin.toFixed(4));
      s.setProperty('--zoom', range(p, .78, 1).toFixed(4));
      rise.classList.toggle('is-final', fin > .5);
      const idx = r <= .001 ? 0 : Math.min(4, 1 + Math.floor(r * 4 - 1e-6));
      riseStages.forEach((li, i) => li.classList.toggle('is-active', i === idx));
    }

    fills.forEach(({ el, words }) => {
      const r = el.getBoundingClientRect();
      const q = clamp((vh * .85 - r.top) / (r.height + vh * .35));
      const n = Math.round(q * words.length * 1.1);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    });

    if (cam && camImg && stops.length) {
      const p = reduce ? 0 : progress(cam);
      const pos = p * (stops.length - 1);
      const i = Math.min(stops.length - 2, Math.floor(pos));
      const f = ease(range(pos - i, .3, .85));
      const a = stops[i], b = stops[i + 1];
      const x = lerp(a.x, b.x, f), y = lerp(a.y, b.y, f), z = a.z * Math.pow(b.z / a.z, f);
      const ar = 2400 / 1350;
      let w = vw, h = vw / ar;
      if (h < vh) { h = vh; w = vh * ar; }
      const cx = mobile() ? vw * .5 : vw * .62, cy = mobile() ? vh * .36 : vh * .5;
      let tx = cx - x * w * z, ty = cy - y * h * z;
      tx = clamp(tx, vw - w * z, 0); ty = clamp(ty, vh - h * z, 0);
      camImg.style.width = `${w}px`; camImg.style.height = `${h}px`;
      camImg.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${z.toFixed(4)})`;
      const active = f < .5 ? i : i + 1;
      camSteps.forEach((s, k) => s.classList.toggle('is-active', k === active));
      cam.style.setProperty('--cp', p.toFixed(4));
      if (camPin) {
        camPin.style.left = `${tx + x * w * z}px`; camPin.style.top = `${ty + y * h * z}px`;
        camPin.style.setProperty('--pin', z > 1.5 && (f < .15 || f > .85) ? 1 : 0);
      }
    }

    if (hs && hsTrack && !mobile() && !reduce) {
      const p = progress(hs);
      hsTrack.style.transform = `translate3d(${(-p * (hsTrack.scrollWidth - vw)).toFixed(1)}px, 0, 0)`;
    }

    if (cut) {
      const r = cut.getBoundingClientRect();
      cut.style.setProperty('--bp', `${(clamp((vh - r.top) / (vh + r.height)) * 100).toFixed(1)}%`);
    }

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
