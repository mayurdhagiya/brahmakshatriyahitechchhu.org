# Cache management — the easy way

> **You're hosted on GitHub Pages.** GitHub Pages doesn't let you
> set custom server cache headers (`.htaccess` is ignored), so this
> site relies on **two browser-controlled layers**:
>
>   1. **Meta tags** in every HTML page tell browsers "don't cache me"
>   2. **`?v=…` version stamps** on every CSS/JS reference force
>      browsers to fetch fresh copies after you bump the version
>
> One command (`./bump-version.sh`) handles both layers for you.

Browsers cache CSS/JS aggressively. When you push an update, returning
visitors can keep seeing the **old** site for hours or days because
their browser thinks "I already have this file, why download it again?"

You don't need to think about any of this manually. There's a
**one-command helper**:

---

## After every update — run this command

```bash
./bump-version.sh
git add -A && git commit -m "bump cache version"
git push
```

That's it. The script:

1. Reads today's date (e.g. `2026-05-22`)
2. Rewrites the `?v=…` query string on **every** CSS/JS reference
   in **every** HTML file
3. Reports how many files / references it updated

Push to GitHub. GitHub Pages rebuilds in ~1 minute. Every visitor —
including ones with old copies cached — will fetch the latest CSS/JS
the next time they visit. **No more "tell users to hard-refresh."**

---

## Variations

### Multiple updates in one day

If you ship a fix in the morning and another in the afternoon, append
a sub-counter:

```bash
./bump-version.sh                    # uses today, e.g. 2026-05-22
./bump-version.sh 2026-05-22-02      # second update of the day
./bump-version.sh 2026-05-22-03      # third…
```

The script accepts both `YYYY-MM-DD` and `YYYY-MM-DD-NN` formats.

### Just want to see what's currently deployed?

```bash
./bump-version.sh check
```

Prints the version stamp(s) currently in use. Useful before you
decide what to bump to.

### Force a re-stamp (rare)

Just pass any new version, even an older date. The script does an
exact find/replace, so any unique value works.

---

## How the layers work together (on GitHub Pages)

| Layer | What it does |
|---|---|
| **HTML meta tag** | Every `<head>` carries `<meta http-equiv="Cache-Control" content="no-cache, must-revalidate, max-age=0" />` so browsers always re-validate the HTML before showing a cached copy. |
| **`?v=…` on CSS/JS** | Every `<link>` / `<script>` ends with a version stamp like `?v=2026-05-15-03`. When you bump the stamp, the URL is "new" so the browser fetches a fresh copy. |
| **GitHub Pages CDN** | GitHub fronts your site with a CDN that respects your meta tags and serves versioned assets fast worldwide. |

This is the same strategy big sites (Twitter, GitHub, Wikipedia) use:
short-lived HTML + long-lived versioned assets.

---

## When NOT to bump

You don't need to bump after:
- Editing data files in `js/data/*.js` — wait, **yes, you do**.
  Those are JS files referenced from HTML, so visitors' browsers
  cache them too. Always bump after any update.

You don't need to bump after:
- Adding new edition folders to `/editions/` (those URLs are unique
  per edition, no caching collision possible)
- Editing `robots.txt` or `sitemap.xml` (no caching layer in front)

When in doubt: **just bump**. There's no downside.

---

## If you ever migrate off GitHub Pages

The HTML meta tag works everywhere. The `?v=…` version stamps work
everywhere. The `.htaccess` (currently ignored by GitHub Pages) takes
effect the moment you move to an Apache host — no edits needed.

So your cache strategy is portable across hosts.
