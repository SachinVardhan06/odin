/* Decides where the portal gets its data, then starts the app.

   Served by the Express app  -> /health answers with JSON, so use the real API.
   Served by a static host    -> /health is missing, so run the in-browser API
                                 from mock-api.js. No server, no ports. */

(function () {
  'use strict';

  function start() {
    const script = document.createElement('script');
    script.src = 'app.js';
    document.body.appendChild(script);
  }

  async function hasRealApi() {
    try {
      const res = await fetch('health', { method: 'GET' });
      // A static host may answer unknown paths with index.html, so insist on JSON.
      return res.ok && (res.headers.get('content-type') || '').includes('application/json');
    } catch (e) {
      return false;
    }
  }

  hasRealApi().then((real) => {
    if (!real) {
      window.installNorthwindMock();
      console.info('Northwind: running standalone, data served in the browser.');
    }
    start();
  });
})();
