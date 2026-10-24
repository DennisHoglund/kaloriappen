// Start, vyer och registrering av service worker.
(function () {
  'use strict';

  const VERSION = 'T-01';

  function visa(id) {
    document.querySelectorAll('main').forEach((m) => { m.hidden = m.id !== id; });
  }

  function start() {
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
