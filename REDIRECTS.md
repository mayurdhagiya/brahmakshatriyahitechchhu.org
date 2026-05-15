# Managing redirects

> **You're hosted on GitHub Pages.** GitHub Pages **does not** read
> `.htaccess`, so the file in this repo is just kept for reference
> (in case you ever migrate to Apache hosting). Your live redirects
> live in **`js/redirects.js`** - that's the file to edit.

---

## ✅ Add a redirect - `js/redirects.js`

Open [`js/redirects.js`](js/redirects.js) and add a key/value pair
inside the `REDIRECTS` object. Save, commit, push.

```js
const REDIRECTS = {
  '/editions/may-2025/':  '/editions/May-2025/',
  '/donate':              '/contact.html#bank-details',
  '/old-page.html':       '/new-page.html'
};
```

**How it works:**
- Loaded synchronously at the very top of every page's `<head>` so
  it redirects **before** the page paints.
- Trailing slashes are normalised - both `/foo` and `/foo/` match.
- Query strings (`?utm=…`) and hash fragments (`#section`) are
  preserved through the redirect.
- Wrapped in `try/catch` so a typo can never break the page.

**Already configured for you:**
- All lower-case month aliases redirect to canonical capitalised
  folders (`/editions/may-2025/` → `/editions/May-2025/`)
- `/about-us` → `/about.html`
- `/contact-us` → `/contact.html`
- `/trustee.html` → `/trustees.html` (legacy from earlier versions)

---

## How GitHub Pages handles bad URLs

When someone visits a path that doesn't exist on your site,
GitHub Pages automatically serves [`404.html`](404.html). I built
you a branded 404 page that:

- Matches the rest of the site's design.
- Shows the URL the visitor tried (helpful for spotting typos).
- Offers Home + Contact buttons plus quick-links to every section.
- Sends a `page_not_found` event to Google Analytics so you can see
  which broken paths people are hitting.

So between **`js/redirects.js`** (catches known bad paths) and
**`404.html`** (gracefully handles everything else), unknown URLs
never look broken to a visitor.

---

## Trade-offs vs. server-side redirects

|                              | `js/redirects.js` | `.htaccess` (Apache only) |
|------------------------------|-------------------|---------------------------|
| Works on GitHub Pages        | ✅                | ❌                         |
| HTTP status code             | 200 then JS jump  | 301 (SEO-friendly)        |
| Speed                        | ~5ms after load   | Instant (server-side)     |
| Works without JavaScript     | ❌                | ✅                         |

For most use cases on GitHub Pages, the JS approach is good enough -
search engines now execute JavaScript when crawling, and visitors
notice no delay.

---

## If you ever migrate to Apache hosting

Open [`.htaccess`](.htaccess) and copy your `js/redirects.js` entries
across as `Redirect 301` lines. The format is documented in the file.

## If you ever migrate to Netlify / Vercel / Cloudflare Pages

Each platform has its own redirect file format:

| Platform | File to create | Format |
|---|---|---|
| Netlify | `_redirects` | `/old /new 301` |
| Vercel  | `vercel.json` | `{ "redirects": [{ "source": "/old", "destination": "/new", "permanent": true }] }` |
| Cloudflare Pages | `_redirects` | same as Netlify |
| Nginx (VPS) | `nginx.conf` | `rewrite ^/old$ /new permanent;` |

In all those cases the JS file (`js/redirects.js`) keeps working
too - they just coexist as belt-and-braces.

---

## URL case sensitivity - important reminder

GitHub Pages serves URLs **case-sensitively**, like most servers:

- `/editions/May-2025/` ≠ `/editions/may-2025/` ≠ `/editions/MAY-2025/`

Your folder convention is **capitalised first letter**, with
3-letter month abbreviations EXCEPT for May/June/July (full):

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

The redirects in `js/redirects.js` already catch lower-case typos
and bounce visitors to the right canonical URL.
