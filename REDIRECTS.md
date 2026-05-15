# Managing redirects

There are **two places** to add a redirect, depending on your hosting.
Pick one (or use both — they coexist safely).

---

## 1. `.htaccess` — preferred for Apache hosting

Most shared web hosts (Hostinger, Bluehost, GoDaddy, cPanel-based hosts)
run **Apache** and read `.htaccess`. This is the canonical place to
manage redirects because:

- Returns proper **301 Moved Permanently** responses → great for SEO.
- The redirect happens **before** the page loads → no flash of content.
- Works for visitors with JavaScript disabled.

### Add a redirect

Open [`.htaccess`](.htaccess) and add a line under
`# YOUR REDIRECTS — add new entries below`:

```apache
# Simple page redirect
Redirect 301 /old-page.html         /new-page.html

# Pattern with capture group
RedirectMatch 301 ^/edition-(\d{4})/?$   /editions/$1/

# Friendly short URL
Redirect 301 /donate                /contact.html#bank-details
```

### Already configured for you

- `/about-us` → `/about.html`
- `/contact-us` → `/contact.html`
- `/trustee.html` → `/trustees.html`
- All lower-case month aliases (`/editions/may-2025/`) → canonical
  capitalised versions (`/editions/May-2025/`)
- Auto-add trailing slash to `/editions/<Month>-<Year>` if missing
- HTTPS + www enforcement (commented out — uncomment when SSL is live)
- Strip `.html` from URLs (`/about` serves `/about.html`)

---

## 2. `js/redirects.js` — fallback for non-Apache hosts

If you host on **Netlify, Vercel, Cloudflare Pages, GitHub Pages,
Firebase Hosting** (anything that isn't Apache), `.htaccess` won't
do anything. Use this JavaScript fallback instead.

### Add a redirect

Open [`js/redirects.js`](js/redirects.js) and add a key/value pair
inside the `REDIRECTS` object:

```js
const REDIRECTS = {
  '/editions/may-2025/':  '/editions/May-2025/',
  '/donate':              '/contact.html#bank-details',
  '/old-page.html':       '/new-page.html'
};
```

### Trade-offs vs. server redirects

| | `.htaccess` | `js/redirects.js` |
|---|---|---|
| HTTP status code | **301** (SEO-friendly) | 200 then JS redirect |
| Speed | Instant (server-side) | Tiny delay (after JS loads) |
| Works without JS | ✅ | ❌ |
| Works on any static host | Apache only | ✅ everywhere |

---

## 3. Platform-specific alternatives

If you're on a specific platform, here's the equivalent of `.htaccess`
to use instead:

| Platform | File to create | Format |
|---|---|---|
| Netlify | `_redirects` | `/old /new 301` |
| Vercel  | `vercel.json` | `{ "redirects": [{ "source": "/old", "destination": "/new", "permanent": true }] }` |
| Cloudflare Pages | `_redirects` | same as Netlify |
| Nginx (VPS) | `nginx.conf` | `rewrite ^/old$ /new permanent;` |

If you tell me which host you use, I can generate the matching file.

---

## URL case sensitivity — important

URLs **are** case-sensitive on most servers (Linux + Apache/Nginx
serve filesystem paths exactly). So:

- `/editions/May-2025/` ≠ `/editions/may-2025/` ≠ `/editions/MAY-2025/`

Your folder naming convention is **capitalised first letter**, with
3-letter month abbreviations EXCEPT for May/June/July (which stay
full):

| Month | Folder |
|---|---|
| January | `Jan` |
| February | `Feb` |
| March | `Mar` |
| April | `Apr` |
| **May** | `May` |
| **June** | `June` |
| **July** | `July` |
| August | `Aug` |
| September | `Sep` |
| October | `Oct` |
| November | `Nov` |
| December | `Dec` |

The site-wide redirects in `.htaccess` and `js/redirects.js` already
catch lower-case typos and send users to the right canonical URL.
