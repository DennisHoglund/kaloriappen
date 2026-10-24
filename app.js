// Start, vyer och registrering av service worker.
(function () {
  'use strict';

  const VERSION = 'T-02';
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

  function start() {
    initTheme();
    const v = document.getElementById('version');
    if (v) v.textContent = 'Version ' + VERSION;
    visa('view-start');
  }

  window.KaloriApp = { visa };

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
