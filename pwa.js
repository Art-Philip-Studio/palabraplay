/* pwa.js — PalabraPlay
   1) Registra el Service Worker (app instalable)
   2) Botón "Instalar app"
   3) Botón "Soporte" (abajo a la derecha) con chat en vivo de Tawk.to

   ⚙️ CONFIGURACIÓN: pega aquí los 2 códigos de tu cuenta Tawk.to
   (Administración → Canales → Chat Widget → "Direct Chat Link":
    https://tawk.to/chat/PROPERTY_ID/WIDGET_ID)                         */
var TAWK_PROPERTY_ID = '6abd1d55fd2d7034457f314c';
var TAWK_WIDGET_ID   = '1k3pbl5o9';

(function () {
  'use strict';

  /* ── 1. Service Worker ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  /* ── Estilos ── */
  var css = document.createElement('style');
  css.textContent =
    '.pp-fab{position:fixed;z-index:2147483000;display:flex;align-items:center;gap:8px;border:0;cursor:pointer;' +
    'font:800 15px/1 Nunito,system-ui,sans-serif;border-radius:999px;padding:13px 18px;box-shadow:0 6px 20px rgba(0,0,0,.35);' +
    'transition:transform .15s}' +
    '.pp-fab:active{transform:scale(.95)}' +
    '#pp-support{right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));background:#10b981;color:#052e21}' +
    '#pp-install{left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));background:#fff;color:#0f172a}' +
    'body.in-game .pp-fab .pp-t{display:none}body.in-game .pp-fab{padding:12px 14px;opacity:.92}' +
    '#pp-badge{position:absolute;top:-6px;right:-4px;min-width:20px;height:20px;border-radius:10px;background:#ef4444;color:#fff;' +
    'font-size:12px;display:none;align-items:center;justify-content:center;padding:0 5px}' +
    '#pp-ios{position:fixed;z-index:2147483001;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));' +
    'background:#0f172a;color:#e2e8f0;border:1px solid #10b981;border-radius:14px;padding:14px 16px;font:600 14px/1.4 Nunito,system-ui,sans-serif;' +
    'display:none;box-shadow:0 8px 28px rgba(0,0,0,.5)}';
  document.head.appendChild(css);

  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }

  /* ── 3. Botón Soporte + Tawk.to ── */
  var configured = TAWK_PROPERTY_ID.indexOf('PEGA_') !== 0 && TAWK_WIDGET_ID.indexOf('PEGA_') !== 0;
  var support = el('<button id="pp-support" class="pp-fab" type="button" aria-label="Soporte">💬<span class="pp-t"> Soporte</span><span id="pp-badge"></span></button>');
  var badge = support.querySelector('#pp-badge');
  var tawkLoading = false, tawkReady = false, tawkFailed = false, openWhenReady = false, unread = 0, failTimer = null;

  var noFab = !!(document.body && document.body.hasAttribute('data-pp-nofab'));
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  function setBadge(n) {
    unread = n;
    if (noFab) {
      var bg = document.querySelector('.nav-burger'), ds = document.getElementById('dr-support');
      if (bg) bg.classList.toggle('pp-unread', n > 0);
      if (ds) ds.classList.toggle('pp-unread', n > 0);
    }
    badge.textContent = n;
    badge.style.display = n > 0 ? 'flex' : 'none';
  }

  Tawk_API.onLoad = function () {
    tawkReady = true;
    clearTimeout(failTimer); setLabel(' Soporte');
    try { localStorage.setItem('pp_chat_used', '1'); } catch (e) {}
    if (openWhenReady) { openWhenReady = false; openChat(); } else { Tawk_API.hideWidget(); }
  };
  // Al minimizar, se oculta la burbuja de Tawk y queda solo nuestro botón "Soporte"
  Tawk_API.onChatMaximized = function () { support.style.display = 'none'; };
  Tawk_API.onChatMinimized = function () { Tawk_API.hideWidget(); support.style.display = ''; };
  Tawk_API.onChatMessageAgent = function () {
    // Te respondieron: aviso con globito rojo si el chat está cerrado
    if (Tawk_API.isChatMaximized && Tawk_API.isChatMaximized()) return;
    setBadge(unread + 1);
  };

  function loadTawk() {
    if (tawkLoading) return;
    tawkLoading = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://embed.tawk.to/' + TAWK_PROPERTY_ID + '/' + TAWK_WIDGET_ID;
    s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    s.onerror = function () { tawkFailed = true; chatFallback(); };
    document.head.appendChild(s);
  }

  function openChat() {
    setBadge(0);
    Tawk_API.showWidget();
    Tawk_API.maximize();
  }

  function setLabel(t) {
    var l = support.querySelector('.pp-t'); if (l) l.textContent = t;
    if (noFab) {
      if (/Conectando/.test(t)) showTip('<span id="pp-conn">💬 Conectando con soporte…</span>');
      else if (iosTip.querySelector('#pp-conn')) iosTip.style.display = 'none';
    }
  }
  function chatFallback() {
    clearTimeout(failTimer);
    openWhenReady = false;
    setLabel(' Soporte');
    var direct = 'https://tawk.to/chat/' + TAWK_PROPERTY_ID + '/' + TAWK_WIDGET_ID;
    showTip('El chat en vivo no pudo abrirse aquí (puede estar bloqueado por tu navegador, un bloqueador de anuncios o por abrir la página dentro de otra app). ' +
      '<br><a href="' + direct + '" target="_blank" rel="noopener" style="color:#10b981;font-weight:800">💬 Abrir el chat en otra pestaña</a>' +
      ' &nbsp;·&nbsp; <a href="mailto:studio.art.philip@gmail.com" style="color:#10b981;font-weight:800">✉️ Escribir por correo</a>');
  }
  support.addEventListener('click', function () {
    if (!configured) { chatFallback(); return; }
    if (tawkReady) { openChat(); return; }
    if (tawkFailed) { chatFallback(); return; }
    openWhenReady = true;
    setLabel(' Conectando…');
    loadTawk();
    clearTimeout(failTimer);
    failTimer = setTimeout(function () { if (!tawkReady) { tawkFailed = true; chatFallback(); } }, 7000);
  });

  // Si esa persona ya había chateado antes, cargamos el chat en segundo plano
  // para que le lleguen tus respuestas y vea el globito rojo.
  var hadChat = false;
  try { hadChat = localStorage.getItem('pp_chat_used') === '1'; } catch (e) {}
  if (configured && hadChat) window.addEventListener('load', function () { setTimeout(loadTawk, 1500); });

  /* ── 2. Botón Instalar app ── */
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  var installBtn = el('<button id="pp-install" class="pp-fab" type="button" aria-label="Instalar app">📲<span class="pp-t"> Instalar app</span></button>');
  var iosTip = el('<div id="pp-ios"><span id="pp-tip-txt"></span> <span style="color:#10b981;cursor:pointer;float:right" id="pp-ios-x">Cerrar</span></div>');
  var deferred = null;
  var LIGHT = ' Es liviana: no llena tu teléfono. Los juegos se guardan uno por uno con el botón “Sin internet”.';

  function showTip(html) {
    iosTip.querySelector('#pp-tip-txt').innerHTML = html;
    iosTip.style.display = 'block';
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
  });
  window.addEventListener('appinstalled', function () {
    installBtn.style.display = 'none';
    deferred = null;
  });

  var ua = navigator.userAgent;
  var inApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|WhatsApp|TikTok|musical_ly|Snapchat|; wv\)/i.test(ua);
  var iosOther = isIOS && /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);

  function doInstall() {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.finally(function () { deferred = null; });
    } else if (inApp) {
      showTip('Estás viendo la página dentro de otra app (Instagram, Facebook, WhatsApp…) y ahí <b>no se puede instalar</b>. Toca <b>⋮</b> o <b>•••</b> y elige <b>“Abrir en el navegador”</b> (Chrome o Safari); luego toca Instalar otra vez.');
    } else if (isIOS && iosOther) {
      showTip('En iPhone solo <b>Safari</b> puede instalar apps. Abre PalabraPlay en Safari, toca <b>Compartir</b> (cuadro con flecha ↑) y luego <b>“Agregar a pantalla de inicio”</b>.');
    } else if (isIOS) {
      showTip('Para instalar en tu iPhone: toca <b>Compartir</b> (cuadro con flecha ↑) y luego <b>“Agregar a pantalla de inicio”</b>.' + LIGHT);
    } else {
      showTip('Para instalar: abre el menú del navegador (<b>⋮</b>) y toca <b>“Instalar app”</b> o <b>“Agregar a pantalla de inicio”</b>. En computador, busca el icono de instalar en la barra de direcciones. Si no aparece, recarga la página con internet y espera unos segundos.' + LIGHT);
    }
  }
  installBtn.addEventListener('click', doInstall);
  window.ppInstall = doInstall;
  window.ppSupport = function () { support.click(); };

  function mount() {
    if (!noFab) {
      document.body.appendChild(support);
      document.body.appendChild(installBtn);
    }
    document.body.appendChild(iosTip);
    iosTip.querySelector('#pp-ios-x').addEventListener('click', function () { iosTip.style.display = 'none'; });
    if (isStandalone) installBtn.style.display = 'none';
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
