/* ============================================================
   Brahmakshatriya Hitechchhu — Client-side redirect manager
   ------------------------------------------------------------
   Use this ONLY if your hosting doesn't run Apache/Nginx (rare —
   most shared hosts do, and .htaccess is the canonical place to
   manage redirects). This is a JS fallback.

   How it works:
     • Loaded synchronously in the <head> of every page so it can
       redirect BEFORE the page paints.
     • Looks up the current path in the REDIRECTS map below.
     • If a match is found, replaces the URL with the target.

   Limitations vs. server-side redirects:
     • Sends a 200 first, so SEO crawlers can't read this as 301.
     • Brief flash of a blank page on slow connections.
   For these reasons, prefer .htaccess in production. Keep this
   file for friendly aliases and quick fixes.
============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Add or remove redirects here.
     Format: 'old path (with leading slash)': 'new path or full URL'
     Trailing slashes are normalised — both /foo and /foo/ match.
  ---------------------------------------------------------- */
  const REDIRECTS = {
    /* --- Lower-case month aliases → canonical capitalised folders --- */
    '/editions/jan-2025/':  '/editions/Jan-2025/',
    '/editions/feb-2025/':  '/editions/Feb-2025/',
    '/editions/mar-2025/':  '/editions/Mar-2025/',
    '/editions/apr-2025/':  '/editions/Apr-2025/',
    '/editions/may-2025/':  '/editions/May-2025/',
    '/editions/june-2025/': '/editions/June-2025/',
    '/editions/july-2025/': '/editions/July-2025/',
    '/editions/aug-2025/':  '/editions/Aug-2025/',
    '/editions/sep-2025/':  '/editions/Sep-2025/',
    '/editions/oct-2025/':  '/editions/Oct-2025/',
    '/editions/nov-2025/':  '/editions/Nov-2025/',
    '/editions/dec-2025/':  '/editions/Dec-2025/',

    /* --- Common typos / legacy paths --- */
    '/trustee.html':        '/trustees.html',
    '/about-us':            '/about.html',
    '/contact-us':          '/contact.html'

    /* --- Friendly short URLs (uncomment / extend as needed) --- */
    // '/donate':           '/contact.html#bank-details',
    // '/subscribe':        '/contact.html#subscription',
  };

  /* ----------------------------------------------------------
     Normalise + match logic
  ---------------------------------------------------------- */
  const path = window.location.pathname;
  const stripped = path.replace(/\/$/, '');           // /foo/ → /foo
  const slashed  = stripped + '/';                    // /foo  → /foo/
  const target =
    REDIRECTS[path] ||
    REDIRECTS[stripped] ||
    REDIRECTS[slashed] ||
    null;

  if (target && target !== path) {
    // Preserve query string + hash through the redirect
    const dest = target + window.location.search + window.location.hash;
    // Use replace() so the old URL doesn't pollute browser history
    window.location.replace(dest);
  }

  // Also expose the map so other code (or analytics) can introspect
  window.__REDIRECTS__ = REDIRECTS;
})();
