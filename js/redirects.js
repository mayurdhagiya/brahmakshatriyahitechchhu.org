/* ============================================================
   Brahmakshatriya Hitechchhu - Client-side redirect manager
   ------------------------------------------------------------
   THE ONE FILE TO EDIT when you want to add a URL alias.

   When does this file run?
     • Loaded synchronously at the very top of every page's <head>
       so it can redirect BEFORE the page paints.
     • If a redirect matches, the browser swaps to the target URL
       immediately; otherwise execution falls through and the page
       loads normally.

   When should you use this file?
     • You're hosted on a service that DOESN'T process .htaccess
       (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, …).
     • Or you just want a quick alias without touching server config.

   When should you use .htaccess instead?
     • You're on Apache hosting (most cPanel-based shared hosts).
       Server-side 301s are faster and SEO-correct.

   Both files can coexist - server redirects fire first, this is
   the safety net.

   ============================================================
   HOW TO ADD A REDIRECT
   ============================================================
   Add a key/value pair to the REDIRECTS object below:

     '/old-path/': '/new-path/'

   Trailing slashes are normalised - both `/foo` and `/foo/`
   match the same key. Query strings (?x=1) and hash fragments
   (#section) are preserved through the redirect.

   You can also redirect to an external URL:
     '/podcast': 'https://anchor.fm/our-podcast'

   ============================================================
   IDIOT-PROOFING
   ============================================================
     • Wrapped in try/catch so a typo can never break the page.
     • Self-redirect detection (target === current) → no-op.
     • Uses location.replace() so back-button works as expected.
============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     ⬇️  EDIT THIS MAP - your redirect rules live here
     Format: 'old path (with leading slash)': 'new path or full URL'
  ---------------------------------------------------------- */
  const REDIRECTS = {

    /* --- Lower-case month aliases → canonical capitalised folders --- */
    /* (URLs are case-sensitive on most servers, so anyone typing      */
    /*  "may-2025" lands on the wrong path. These send them home.)    */
    '/editions/jan-2025/':  '/editions/Jan-2025/',
    '/editions/feb-2025/':  '/editions/Feb-2025/',
    '/editions/mar-2025/':  '/editions/Mar-2025/',
    '/editions/apr-2025/':  '/editions/Apr-2025/',
    '/editions/may-2025/':  '/editions/May-2025/',
    '/editions/june-2025/': '/editions/Jun-2025/',
    '/editions/july-2025/': '/editions/Jul-2025/',
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
     ⚙️  Match + redirect logic - you shouldn't need to edit
                                    anything below this line
  ---------------------------------------------------------- */
  try {
    const path     = window.location.pathname;
    const stripped = path.replace(/\/$/, '');   // /foo/ → /foo
    const slashed  = stripped + '/';            // /foo  → /foo/

    // Check the path 3 ways so editors don't have to worry about
    // trailing slashes when they add new entries.
    const target =
      REDIRECTS[path]     ||
      REDIRECTS[stripped] ||
      REDIRECTS[slashed]  ||
      null;

    if (target && target !== path && target !== stripped && target !== slashed) {
      // Preserve query string + hash through the redirect so users
      // landing on /old?utm=email#bio still get to /new?utm=email#bio.
      const dest = target + window.location.search + window.location.hash;
      // location.replace() - back-button still works as expected
      // because the old URL doesn't get pushed onto history.
      window.location.replace(dest);
    }

    // Expose the map so other code (or analytics) can introspect.
    window.__REDIRECTS__ = REDIRECTS;
  } catch (err) {
    // Belt-and-braces: even a typo in the map should never break
    // the page. Log it for the editor and move on.
    console.error('[redirects] failed:', err);
  }
})();
