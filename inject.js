// ============================================================
// Hugola Unblock v5.0
// Türkiye'de engellenen YouTube kanallarını VPN'siz görüntüle
// YouTube InnerTube Browse API ile gl bypass
// ============================================================

(function() {
  'use strict';

  const SPOOF_GL = 'US';
  const TRACKED_CHANNELS = {
    'hugola':  'UC6F8_4OLIQ9bkurVgdcLAeQ',
    'hugolaa': 'UC6F8_4OLIQ9bkurVgdcLAeQ',
    'uc6f8_4oliq9bkurvgdclaeq': 'UC6F8_4OLIQ9bkurVgdcLAeQ',
    'ucvzpmrfilnxkrfrqtkruang': 'UCvzpmRfiLNxKRFRQTKrUang'
  };

  function getChannelId() {
    const path = window.location.pathname.toLowerCase();
    const handleMatch = path.match(/^\/@([^\/]+)/);
    if (handleMatch) {
      const id = TRACKED_CHANNELS[handleMatch[1].toLowerCase()];
      if (id) return id;
    }
    const channelMatch = path.match(/^\/channel\/([^\/\?]+)/i);
    if (channelMatch) {
      const lower = channelMatch[1].toLowerCase();
      if (TRACKED_CHANNELS[lower]) return TRACKED_CHANNELS[lower];
      if (channelMatch[1].startsWith('UC')) return channelMatch[1];
    }
    for (const [key, id] of Object.entries(TRACKED_CHANNELS)) {
      if (path.includes(key)) return id;
    }
    return null;
  }

  function isTrackedPage() {
    return getChannelId() !== null;
  }

  // ── FETCH gl patching (SPA navigasyonlar için) ──────────
  function patchBody(bodyStr) {
    try {
      const body = JSON.parse(bodyStr);
      if (body?.context?.client) body.context.client.gl = SPOOF_GL;
      return JSON.stringify(body);
    } catch { return bodyStr; }
  }

  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    let url = typeof input === 'string' ? input : (input?.url || input?.toString?.() || '');
    if (url.includes('/youtubei/') && isTrackedPage()) {
      try {
        let body = init?.body;
        if (typeof body === 'string' && body.includes('"context"')) {
          return originalFetch.call(window, input, { ...init, body: patchBody(body) });
        }
      } catch {}
    }
    return originalFetch.apply(window, arguments);
  };

  // ── XHR gl patching ────────────────────────────────────
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(m, u, ...r) {
    this._hu = u;
    return origOpen.apply(this, [m, u, ...r]);
  };
  XMLHttpRequest.prototype.send = function(b) {
    if (this._hu?.includes('/youtubei/') && isTrackedPage() &&
        typeof b === 'string' && b.includes('"context"'))
      b = patchBody(b);
    return origSend.call(this, b);
  };

  // ── ytcfg patching ─────────────────────────────────────
  function patchConfig() {
    if (!isTrackedPage()) return;
    try {
      if (window.ytcfg?.set) window.ytcfg.set('GL', SPOOF_GL);
      const d = window.ytcfg?.data_ || window.ytcfg?.d_;
      if (d) {
        d.GL = SPOOF_GL;
        if (d.INNERTUBE_CONTEXT?.client) d.INNERTUBE_CONTEXT.client.gl = SPOOF_GL;
      }
    } catch {}
    try {
      if (window.yt?.config_) {
        window.yt.config_.GL = SPOOF_GL;
        if (window.yt.config_.INNERTUBE_CONTEXT?.client)
          window.yt.config_.INNERTUBE_CONTEXT.client.gl = SPOOF_GL;
      }
    } catch {}
  }

  // ── Navigation API — /hugolaa redirect engelle ──────────
  if (window.navigation && isTrackedPage()) {
    window.navigation.addEventListener('navigate', (event) => {
      try {
        const dest = new URL(event.destination.url, window.location.origin);
        if (dest.pathname === '/hugolaa') event.preventDefault();
      } catch {}
    });
  }

  // ── ytInitialData — engel alert'lerini temizle ──────────
  let _ytInitialData;
  if (isTrackedPage()) {
    try {
      Object.defineProperty(window, 'ytInitialData', {
        configurable: true, enumerable: true,
        get() { return _ytInitialData; },
        set(val) {
          if (val && typeof val === 'object' && val.alerts) {
            val.alerts = val.alerts.filter(a => {
              const s = JSON.stringify(a).toLowerCase();
              return !s.includes('unavailable') &&
                     !s.includes('kullanılamıyor') &&
                     !s.includes('not available');
            });
            if (!val.alerts.length) delete val.alerts;
          }
          _ytInitialData = val;
        }
      });
    } catch {}
  }

  // ── Browse API — gl=US ile kanal verisi çek ve enjekte et ──
  async function fetchAndInjectChannel() {
    const channelId = getChannelId();
    if (!channelId) return;

    const key = 'hu_browse_' + channelId;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    setTimeout(() => sessionStorage.removeItem(key), 5 * 60 * 1000);

    try {
      const apiKey = window.ytcfg?.get?.('INNERTUBE_API_KEY') ||
                     'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
      const clientVersion = window.ytcfg?.get?.('INNERTUBE_CLIENT_VERSION') ||
                            '2.20260309';

      const resp = await originalFetch.call(window,
        `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}&prettyPrint=false`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            browseId: channelId,
            context: {
              client: {
                clientName: 'WEB',
                clientVersion: clientVersion,
                gl: SPOOF_GL,
                hl: document.documentElement.lang || 'tr'
              }
            }
          })
        }
      );

      if (!resp.ok) return;
      const data = await resp.json();
      if (!data.header && !data.contents) return;

      injectBrowseData(data);
    } catch {}
  }

  function injectBrowseData(data) {
    window.ytInitialData = data;

    const browse = document.querySelector('ytd-browse');
    if (browse) {
      try {
        if (typeof browse.handleResponse_ === 'function') {
          browse.handleResponse_({
            data: data,
            endpoint: { browseEndpoint: { browseId: getChannelId() } }
          });
          return;
        }
        if (typeof browse.set === 'function') {
          browse.set('data', data);
          return;
        }
        if (browse.__data) browse.__data.data = data;
      } catch {}
    }

    const pageManager = document.querySelector('ytd-page-manager');
    if (pageManager) {
      try {
        if (typeof pageManager.navigate_ === 'function')
          pageManager.navigate_({ data: data });
      } catch {}
    }

    try {
      document.dispatchEvent(new CustomEvent('yt-action', {
        detail: {
          actionName: 'yt-service-request-completed',
          args: [null, { data: data }]
        }
      }));
    } catch {}
  }

  // ── Başlat ──────────────────────────────────────────────
  patchConfig();
  document.addEventListener('yt-navigate-start', patchConfig);
  document.addEventListener('yt-navigate-finish', patchConfig);
  setInterval(patchConfig, 3000);

  if (isTrackedPage()) {
    function waitAndFetch() {
      if (document.querySelector('ytd-browse') ||
          document.querySelector('ytd-page-manager')) {
        setTimeout(fetchAndInjectChannel, 1000);
      } else {
        setTimeout(waitAndFetch, 500);
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(waitAndFetch, 500));
    } else {
      setTimeout(waitAndFetch, 500);
    }
  }
})();
