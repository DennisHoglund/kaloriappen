// Start, vyer och registrering av service worker.
(function () {
  'use strict';

  const VERSION = '1.2';
  const $ = (id) => document.getElementById(id);
  const THEME_KEY = 'kalori-theme';

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  // ---------- Tema ----------
  const THEMES = ['auto', 'light', 'dark'];
  const THEME_LABELS = { auto: 'Auto', light: 'Ljust', dark: 'Mörkt' };
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    const t = store.get(THEME_KEY);
    return THEMES.includes(t) ? t : 'auto';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const label = $('theme-label');
    if (label) label.textContent = THEME_LABELS[theme];
    const dark = theme === 'dark' || (theme === 'auto' && darkQuery.matches);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#0E1430' : '#F4F6FC');
  }

  function initTheme() {
    $('btn-theme').addEventListener('click', () => {
      const next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
      if (next === 'auto') store.del(THEME_KEY); else store.set(THEME_KEY, next);
      applyTheme(next);
    });
    darkQuery.addEventListener('change', () => applyTheme(currentTheme()));
    applyTheme(currentTheme());
  }

  function visa(id) {
    document.querySelectorAll('main').forEach((m) => { m.hidden = m.id !== id; });
  }

  function setMsg(text, kind) {
    const el = $('login-msg');
    el.textContent = text || '';
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }

  // ---------- Inloggning med lösenord (samma konto som Svampkartan och Jaktvind) ----------
  function vanligtFel(err) {
    const m = (err && err.message || '').toLowerCase();
    if (m.includes('invalid login') || m.includes('invalid credentials')) return 'Fel e-post eller lösenord.';
    if (m.includes('email not confirmed')) return 'E-postadressen är inte bekräftad.';
    if ((err && err.status === 429) || m.includes('rate limit')) return 'För många försök. Vänta en stund och prova igen.';
    if (m.includes('fetch') || m.includes('network') || m.includes('load failed')) return 'Ingen kontakt med servern. Kontrollera nätet och försök igen.';
    return 'Något gick fel: ' + (err && err.message || 'okänt fel');
  }

  let sb = null;

  function initAuth() {
    const cfg = window.KALORI_CONFIG || {};
    if (!window.supabase || !cfg.supabaseUrl) {
      visa('view-login');
      $('form-login').hidden = true;
      setMsg('Kunde inte ladda inloggningen. Kontrollera nätet och ladda om sidan.', 'error');
      return;
    }
    sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });

    $('form-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('email').value.trim().toLowerCase();
      const password = $('password').value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMsg('Ange en giltig e-postadress.', 'error'); return; }
      if (!password) { setMsg('Ange ditt lösenord.', 'error'); return; }

      const btn = $('form-login').querySelector('button[type="submit"]');
      btn.disabled = true;
      setMsg('Loggar in…');
      let error = null;
      try { ({ error } = await sb.auth.signInWithPassword({ email, password })); } catch (err) { error = err; }
      btn.disabled = false;
      if (error) { setMsg(vanligtFel(error), 'error'); return; }
      $('password').value = '';
      setMsg('');
    });

    $('btn-logout').addEventListener('click', async () => {
      await sb.auth.signOut().catch(() => {});
      render(null);
    });

    window.KaloriProfil.setup(sb, { klar: laddaProfil, avbryt: visaApp });
    $('btn-profil').addEventListener('click', () => window.KaloriProfil.oppna(data.profil, data.viktKg, false));
    window.KaloriMaltid.setup(sb, { klar: visaApp, avbryt: visaApp });
    window.KaloriRedigera.setup(sb, { klar: visaApp, avbryt: visaApp });
    window.KaloriFoto.setup(sb, { klar: visaApp, avbryt: visaApp });
    window.KaloriTraning.setup(sb, { klar: visaApp, avbryt: visaApp, viktKg: () => data.viktKg });
    // Ny vikt ändrar dagsmålet, så profil och vikt hämtas om (US-09 AC2)
    window.KaloriVecka.setup(sb, { avbryt: visaApp });
    window.KaloriVikt.setup(sb, { klar: laddaProfil, avbryt: visaApp, malvikt: () => data.profil ? Number(data.profil.malvikt_kg) : null });
    window.KaloriIdag.setup(sb, {
      loggaMat: (o) => window.KaloriMaltid.oppna(o),
      redigera: (r) => window.KaloriRedigera.oppna(r),
      traning: (o) => window.KaloriTraning.oppna(o),
      vikt: (o) => window.KaloriVikt.oppna(o),
      vecka: (o) => window.KaloriVecka.oppna(o)
    });

    sb.auth.onAuthStateChange((_event, session) => render(session));
    sb.auth.getSession().then(({ data }) => render(data.session)).catch(() => render(null));
  }

  // Dagens datum i svensk tid (D-15), ÅÅÅÅ-MM-DD
  function idag() {
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  }

  let data = { profil: null, viktKg: null };
  let aktuellAnvandare = null;

  function dagsmalNu() {
    const p = data.profil;
    const r = p && window.KaloriBerakning.dagsmal({ kon: p.kon, viktKg: data.viktKg, langdCm: p.langd_cm, fodelsedatum: p.fodelsedatum,
      aktivitet: p.aktivitet, taktKgVecka: Number(p.takt_kg_vecka) }, idag());
    return r ? r.mal : null;
  }

  function visaApp() {
    visa('view-app');
    const golv = data.profil ? window.KaloriBerakning.GOLV[data.profil.kon] : null;
    window.KaloriIdag.visa({ mal: dagsmalNu(), golv });
  }

  async function laddaProfil() {
    visa('view-loading');
    try {
      data = await window.KaloriProfil.hamta();
    } catch (e) {
      visa('view-login');
      setMsg('Kunde inte hämta din profil. Kontrollera nätet och försök igen.', 'error');
      return;
    }
    if (!data.profil || data.viktKg == null) window.KaloriProfil.oppna(data.profil, data.viktKg, true);
    else visaApp();
  }

  let toastTimer = null;
  function toast(text) {
    const el = $('toast');
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3500);
  }

  function render(session) {
    if (session && session.user) {
      $('user-email').textContent = session.user.email || '';
      window.KaloriProfil.setUser(session.user.id);
      window.KaloriMaltid.setUser(session.user.id);
      window.KaloriIdag.setUser(session.user.id);
      window.KaloriFoto.setUser(session.user.id);
      window.KaloriTraning.setUser(session.user.id);
      window.KaloriVikt.setUser(session.user.id);
      window.KaloriVecka.setUser(session.user.id);
      if (aktuellAnvandare !== session.user.id) {
        aktuellAnvandare = session.user.id;
        laddaProfil();
      }
    } else {
      aktuellAnvandare = null;
      visa('view-login');
    }
  }

  function start() {
    initTheme();
    const v = $('version');
    if (v) v.textContent = 'Version ' + VERSION;
    initAuth();
  }

  window.KaloriApp = { visa, idag, toast, get sb() { return sb; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  if ('serviceWorker' in navigator) {
    // Ladda om en gång när en ny version av appen tagit över
    let reloaded = false;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloaded) { reloaded = true; location.reload(); }
    });
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => reg.update()).catch(() => {});
    });
  }
})();
