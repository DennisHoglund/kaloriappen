// Bildvisare (US-21): matfotot i helskärm. Ett foto åt gången (D-29), ingen karusell.
// Nyp eller dubbeltryck zoomar. Stäng med ✕, tryck bredvid bilden, dra nedåt eller Esc.
(function () {
  'use strict';

  const el = document.getElementById('bildvisare');
  const zoom = el.querySelector('.bv-zoom');
  const img = zoom.querySelector('img');
  let skala = 1;
  let tillbakaTill = null; // knappen som öppnade, får fokus igen

  function oppna(src, alt, kalla) {
    tillbakaTill = kalla || null;
    satt(1, 0, 0);
    img.src = src;
    img.alt = alt || '';
    el.style.transform = '';
    el.style.opacity = '';
    el.hidden = false;
    document.body.classList.add('bv-oppen');
    el.querySelector('.bv-stang').focus({ preventScroll: true });
  }

  function stang() {
    if (el.hidden) return;
    el.hidden = true;
    document.body.classList.remove('bv-oppen');
    img.removeAttribute('src');
    if (tillbakaTill) tillbakaTill.focus({ preventScroll: true });
  }

  // Zoomar till skala s kring punkten (cx, cy) i visaren
  function satt(s, cx, cy) {
    const fore = skala;
    skala = Math.min(5, Math.max(1, s));
    if (skala === 1) {
      zoom.classList.remove('zoomad');
      img.style.width = img.style.height = img.style.margin = '';
      zoom.scrollLeft = zoom.scrollTop = 0;
      return;
    }
    if (!zoom.classList.contains('zoomad')) {
      // Startstorlek = så som bilden visas nu (object-fit: contain)
      const r = zoom.getBoundingClientRect();
      const k = Math.min(r.width / (img.naturalWidth || 1), r.height / (img.naturalHeight || 1));
      img.dataset.b = (img.naturalWidth || r.width) * k;
      img.dataset.h = (img.naturalHeight || r.height) * k;
      zoom.classList.add('zoomad');
    }
    const b = +img.dataset.b * skala, h = +img.dataset.h * skala;
    img.style.width = b + 'px';
    img.style.height = h + 'px';
    img.style.margin = Math.max(0, (zoom.clientHeight - h) / 2) + 'px ' + Math.max(0, (zoom.clientWidth - b) / 2) + 'px';
    const k = skala / fore; // håll punkten under fingrarna på plats
    zoom.scrollLeft = (zoom.scrollLeft + cx) * k - cx;
    zoom.scrollTop = (zoom.scrollTop + cy) * k - cy;
  }

  // Ligger punkten på själva bilden (inte på de svarta kanterna)?
  function paBilden(x, y) {
    if (skala > 1) return true;
    const r = img.getBoundingClientRect();
    const k = Math.min(r.width / (img.naturalWidth || 1), r.height / (img.naturalHeight || 1));
    const b = img.naturalWidth * k, h = img.naturalHeight * k;
    const v = r.left + (r.width - b) / 2, o = r.top + (r.height - h) / 2;
    return x >= v && x <= v + b && y >= o && y <= o + h;
  }

  const punkt = (x, y) => { const r = zoom.getBoundingClientRect(); return [x - r.left, y - r.top]; };

  // ---------- Pekgester ----------
  let nyp = null, drag = null, flyttat = false, senasteTryck = 0;
  const avstand = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  el.addEventListener('touchstart', (e) => {
    flyttat = false;
    if (e.touches.length === 2) {
      const [cx, cy] = punkt((e.touches[0].clientX + e.touches[1].clientX) / 2, (e.touches[0].clientY + e.touches[1].clientY) / 2);
      nyp = { d: avstand(e.touches), s: skala, cx, cy };
      drag = null;
    } else if (e.touches.length === 1 && skala === 1) {
      drag = { x: e.touches[0].clientX, y: e.touches[0].clientY, dy: 0, aktiv: false };
    }
  }, { passive: true });

  el.addEventListener('touchmove', (e) => {
    flyttat = true;
    if (nyp && e.touches.length === 2) {
      e.preventDefault();
      satt(nyp.s * avstand(e.touches) / nyp.d, nyp.cx, nyp.cy);
    } else if (drag && e.touches.length === 1) {
      const dx = e.touches[0].clientX - drag.x, dy = e.touches[0].clientY - drag.y;
      if (!drag.aktiv && dy > 12 && dy > Math.abs(dx) * 1.5) drag.aktiv = true;
      if (drag.aktiv) {
        e.preventDefault();
        drag.dy = dy;
        el.style.transform = 'translateY(' + dy + 'px)';
        el.style.opacity = String(Math.max(0.3, 1 - dy / 400));
      }
    }
  }, { passive: false });

  el.addEventListener('touchend', (e) => {
    if (nyp && e.touches.length < 2) { nyp = null; if (skala < 1.05) satt(1, 0, 0); return; }
    if (drag && drag.aktiv) {
      if (drag.dy > 110) stang(); else { el.style.transform = ''; el.style.opacity = ''; }
      drag = null;
      return;
    }
    drag = null;
    // Dubbeltryck på bilden zoomar in eller ut
    if (!flyttat && e.target === img) {
      const nu = Date.now();
      if (nu - senasteTryck < 300) {
        const t = e.changedTouches[0];
        const [cx, cy] = punkt(t.clientX, t.clientY);
        satt(skala > 1 ? 1 : 2.5, cx, cy);
        senasteTryck = 0;
        e.preventDefault();
        return;
      }
      senasteTryck = nu;
    }
  });

  // ---------- Mus och tangentbord ----------
  el.addEventListener('click', (e) => {
    if (e.target.closest('.bv-stang')) return stang();
    if (!flyttat && !paBilden(e.clientX, e.clientY)) stang();
  });
  el.addEventListener('dblclick', (e) => {
    if (e.target !== img) return;
    const [cx, cy] = punkt(e.clientX, e.clientY);
    satt(skala > 1 ? 1 : 2.5, cx, cy);
  });
  document.addEventListener('keydown', (e) => {
    if (!el.hidden && e.key === 'Escape') { e.stopImmediatePropagation(); stang(); }
  }, true);

  window.KaloriBildvisare = { oppna, stang, get oppen() { return !el.hidden; } };
})();
