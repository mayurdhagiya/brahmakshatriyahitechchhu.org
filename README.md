# Brahmakshatriya Hitechchhu - Website

> The official website for **Brahmakshatriya Hitechchhu**, the monthly
> publication of the Brahmakshatriya Hitechchhu Trust (Ahmedabad, since
> 1976). Hosted on **GitHub Pages** at
> **[brahmakshatriyahitechchhu.org](https://brahmakshatriyahitechchhu.org)**.

This README is the **single source of truth** for how the site is put
together. If you're new to the project, read this top-to-bottom once -
you'll then know where to find anything.

---

## Table of contents

1. [Quick reference](#quick-reference)
2. [Architecture in one paragraph](#architecture-in-one-paragraph)
3. [Folder structure](#folder-structure)
4. [Page-by-page guide](#page-by-page-guide)
5. [Editing data (the most common task)](#editing-data-the-most-common-task)
6. [Deploying changes to the live site](#deploying-changes-to-the-live-site)
7. [The cache strategy (why `?v=…` matters)](#the-cache-strategy)
8. [Forms - how submissions reach your inbox](#forms)
9. [Redirects](#redirects)
10. [SEO + analytics](#seo--analytics)
11. [GitHub Pages specifics](#github-pages-specifics)
12. [Common tasks - cookbook](#common-tasks---cookbook)
13. [Troubleshooting](#troubleshooting)
14. [Companion docs](#companion-docs)

---

## Quick reference

| Need to… | Do this |
|---|---|
| Add a new monthly edition | Edit [`js/data/editions.js`](js/data/editions.js), bump cache, push |
| Add a community news item | Edit [`js/data/news.js`](js/data/news.js), bump cache, push |
| Add an upcoming event | Edit [`js/data/events.js`](js/data/events.js), bump cache, push |
| Add an in-memoriam tribute | Edit [`js/data/memorials.js`](js/data/memorials.js), bump cache, push |
| Add an ad | Edit [`js/data/ads.js`](js/data/ads.js), bump cache, push |
| Update a regional contact | Edit [`js/data/network.js`](js/data/network.js), bump cache, push |
| Update trustees list | Edit [`js/data/trustees.js`](js/data/trustees.js), bump cache, push |
| Add a URL redirect | Edit [`js/redirects.js`](js/redirects.js), bump cache, push |
| Force every visitor to fetch fresh files | Run `./bump-version.sh`, push |
| Wire the contact / submit form to your inbox | See [`CONTACT-FORM.md`](CONTACT-FORM.md) - 3-minute setup |

After **any** edit:

```bash
./bump-version.sh                # bumps the cache stamp on every CSS/JS reference
git add -A
git commit -m "describe your change"
git push                         # GitHub rebuilds in ~1 minute
```

---

## Architecture in one paragraph

The site is **fully static** - just HTML, CSS, and a single shared JavaScript
file. Each HTML page is independently editable; they share the same nav,
footer, design system, and JS. **Data lives in plain TSV (tab-separated)
tables** inside small `.js` files under `js/data/` - editors paste rows
straight from Excel into those files. A single `js/app.js` reads each data
file (when present on the page) and renders the cards, filters, modals,
search, share buttons, and JSON-LD structured data. **No build step**, **no
server**, **no framework** - just open any `.html` file in a browser to
see the latest state.

---

## Folder structure

```
final/
├── 📄 README.md                  ← you are here
├── 📄 CACHE.md                   ← cache strategy + bump script docs
├── 📄 CONTACT-FORM.md            ← how to wire the form to your inbox
├── 📄 GITHUB-PAGES.md            ← deployment specifics
├── 📄 REDIRECTS.md               ← URL redirect management
├── ⚙️  bump-version.sh            ← one-command cache buster
│
├── 📄 CNAME                      ← GitHub Pages custom domain
├── 📄 .nojekyll                  ← tells GH Pages to skip Jekyll processing
├── 📄 .htaccess                  ← Apache fallback (ignored on GH Pages)
├── 📄 robots.txt                 ← search-crawler instructions
├── 📄 sitemap.xml                ← list of all pages for search engines
│
├── 🌐 index.html                 ← Home: current edition + stats + editor + archive
├── 🌐 about.html                 ← Mission / vision / what we offer
├── 🌐 trustees.html              ← Trustee Board, Editorial, Executive, Advisory
├── 🌐 network.html               ← Regional chapter contacts (filterable)
├── 🌐 news.html                  ← Community news feed (filter + modal)
├── 🌐 events.html                ← Upcoming + past events (filter + modal)
├── 🌐 ads.html                   ← Display + classified ads
├── 🌐 memorial.html              ← In Memoriam · શ્રદ્ધાંજલિ
├── 🌐 submit.html                ← One-form-many-types content submission
├── 🌐 contact.html               ← Office address, map, bank, subscription, form
├── 🌐 404.html                   ← Branded "page not found" (GH Pages serves it)
│
├── css/
│   └── style.css                 ← Single design system + every component
│
├── js/
│   ├── parse-data.js             ← TSV → JS object parser (used by every data file)
│   ├── redirects.js              ← Client-side redirect manager
│   ├── app.js                    ← All loaders, modals, share, JSON-LD injectors
│   └── data/                     ← One TSV per content type:
│       ├── editions.js           ←   Monthly editions
│       ├── trustees.js           ←   Trustees + editorial team
│       ├── network.js            ←   Regional chapter contacts
│       ├── events.js             ←   Community events
│       ├── ads.js                ←   Ads (display + classified)
│       ├── memorials.js          ←   In-memoriam tributes
│       └── news.js               ←   Community news items
│
├── images/
│   └── logo.png                  ← Trust logo (used as favicon + OG image)
│
├── data/excel-templates/         ← Spreadsheet starters editors copy from
│   ├── HOW-TO-EDIT.md            ←   Editorial guide for non-technical users
│   ├── editions.csv
│   ├── events.csv
│   ├── trustees.csv
│   ├── network.csv
│   ├── ads.csv
│   ├── memorials.csv
│   └── news.csv
│
└── editions/                     ← Real edition flipbooks (one folder per issue)
    ├── May-2026/                 ←   /editions/May-2026/files/thumb/1.png
    ├── Apr-2026/                 ←   /editions/Apr-2026/files/thumb/1.png
    └── … (15 month folders)
```

> **Folder-naming rule for editions:** capitalised first letter, standard
> three-letter abbreviation. E.g. `Jan-2025`, `Feb-2025`, `May-2025`,
> `Jun-2025`, `Jul-2025`, `Aug-2025` (May is already three letters). URLs
> are case-sensitive on most servers, so keep the capitalisation exact.

---

## Page-by-page guide

| URL | File | What's on it | Data file used |
|---|---|---|---|
| `/` | `index.html` | Hero (current edition, clickable) · By-the-numbers stats band · From the Editor · Past-editions archive (filterable by year + month, year-grouped scrollers) | `editions.js` |
| `/about.html` | `about.html` | Static info cards: Mission, Vision, What We Offer, Heritage, Join Us | _(none)_ |
| `/trustees.html` | `trustees.html` | All 15 leaders, auto-grouped by designation, bilingual labels | `trustees.js` |
| `/network.html` | `network.html` | Regional chapter contacts, State filter + free-text search | `network.js` |
| `/news.html` | `news.html` | Community news feed (year-grouped), category + city filter, search, **Read more modal** with photos, **Share button** with deep-linking | `news.js` |
| `/events.html` | `events.html` | Upcoming/Past tabs, year + location filter, search, **Read more modal** with highlights / agenda / map / gallery, share | `events.js` |
| `/ads.html` | `ads.html` | Display/Classified tabs, category + city filter, search, one-tap Call/WhatsApp/Email per ad | `ads.js` |
| `/memorial.html` | `memorial.html` | In-memoriam tributes, city filter, search, year-grouped | `memorials.js` |
| `/submit.html` | `submit.html` | One smart form with 5 conditional flows (Ad / News / Tribute / Article / Achievement) + file upload | _(none)_ |
| `/contact.html` | `contact.html` | Office address + embedded map · Subscription rates · Bank details · Publication particulars (RNI, postal reg) · Message form | _(none)_ |
| `/404.html` | `404.html` | Branded "Page not found" served by GH Pages on any unknown path | _(none)_ |

### What every page shares

Every HTML page has the **same head boilerplate**, in this exact order:

1. Basic meta (charset, viewport, theme-color, robots, author)
2. `<title>` + meta description + canonical URL
3. Favicon + apple-touch-icon
4. Cache-Control no-cache for HTML
5. Open Graph + Twitter Card meta (for link previews)
6. Resources: preconnect, dns-prefetch, font + Font Awesome + style.css
7. Analytics: **Google Analytics (GA4)** + **Microsoft Clarity**
8. Structured data: page-specific JSON-LD + BreadcrumbList

And the **same body shell**:

1. `<a class="skip-link">` for keyboard users
2. `<noscript>` banner for JS-disabled browsers
3. `<header class="site-header">` with brand + 10-link nav
4. `<main id="main-content">` with the page's unique content
5. `<footer class="site-footer">` with brand, Explore links, Reach Us info
6. `<script>` tags at the bottom: `parse-data.js`, the relevant `js/data/*.js`, `app.js` (all `defer`)

If you're adding a new page, **copy any existing page** and only change
the unique parts (title, description, the `<main>` content, and which
data file you load).

---

## Editing data - the most common task

This is the workflow you'll use 95% of the time.

1. Open the data file you want to update (e.g. `js/data/news.js`).
2. The data lives between two backticks (`` ` ``), in **tab-separated
   format** - exactly what Excel puts on the clipboard when you copy
   rows.
3. In Excel / Google Sheets, lay out your row(s) using the column order
   shown in the file's header comment.
4. Select the row(s) (just the data, no header row) → Copy.
5. Paste into the JS file at the bottom of the table, just before the
   closing backtick.
6. Save.
7. Run `./bump-version.sh` from the project root.
8. Commit and push.

> **Tip:** every data file has a header comment block listing every column
> name, what to put in it, and how the renderer treats blank values. Read
> the header once and you'll know how to update that file forever.

For a non-technical editor's walkthrough see
[`data/excel-templates/HOW-TO-EDIT.md`](data/excel-templates/HOW-TO-EDIT.md).
The matching CSV files in the same folder are pre-filled spreadsheet
templates you can keep as your editing master.

---

## Deploying changes to the live site

This site is on **GitHub Pages**. The deploy is just a `git push`.

```bash
# 1. Make your edits

# 2. Bust browser caches so visitors see fresh assets
./bump-version.sh

# 3. Commit + push
git add -A
git commit -m "describe what changed"
git push

# 4. Wait ~60-90 seconds, refresh the live site
```

GitHub builds a fresh deploy on every push to `main`. You can watch the
build progress in the repo's **Actions** tab.

---

## The cache strategy

> See [`CACHE.md`](CACHE.md) for the full explanation.

Two layers:

1. **HTML never caches** - every page carries `<meta http-equiv="Cache-Control" content="no-cache">` so browsers always fetch the latest HTML.
2. **CSS / JS / images cache for 1 year, busted by `?v=YYYY-MM-DD`** - the bump-version script rewrites the version stamp on every CSS/JS reference; new stamp = new URL = browsers fetch fresh.

After every update, run `./bump-version.sh` (default = today's date) or
`./bump-version.sh 2026-05-16-02` to bump to a specific version. The
script accepts `YYYY-MM-DD` or `YYYY-MM-DD-NN` (sub-counter for multiple
updates per day).

---

## Forms

> See [`CONTACT-FORM.md`](CONTACT-FORM.md) for the full setup guide.

Both the **Contact** form and the **Submit** form post to
[Web3Forms](https://web3forms.com) - free, no signup, submissions
arrive at your inbox.

**3-step setup (one-time):**

1. Visit web3forms.com, enter `info@brahmakshatriyahitechchhu.org`, click *Create
   Access Key*.
2. Open `contact.html` and `submit.html`, find the line:
   ```html
   <input type="hidden" name="access_key" value="YOUR-WEB3FORMS-ACCESS-KEY-HERE" />
   ```
   Replace the placeholder with the key emailed to you.
3. Push to GitHub.

Until the key is set, the forms display a friendly "Form not yet
configured - see CONTACT-FORM.md" message instead of trying to submit.

The Submit form has 5 modes selected by a dropdown (Advertisement /
News / Tribute / Article / Achievement) - each reveals only the
relevant fields, plus an optional **file attachment** field that
accepts JPG / PNG / PDF / DOC up to 10 MB.

---

## Redirects

> See [`REDIRECTS.md`](REDIRECTS.md) for full documentation.

Because the site is on **GitHub Pages**, `.htaccess` is ignored.
**[`js/redirects.js`](js/redirects.js)** is the redirect file to edit.

It runs synchronously at the very top of every page's `<head>` so it
redirects visitors **before** the page paints. Add a redirect by
inserting a key/value pair into the `REDIRECTS` object:

```js
const REDIRECTS = {
  '/old-path/':       '/new-path/',
  '/donate':          '/contact.html#bank-details',
  '/editions/may-2025/': '/editions/May-2025/'   // case-fix
};
```

Trailing slashes are normalised. Query strings + hash fragments are
preserved. A typo in the map can never break the page (wrapped in
`try/catch`).

---

## SEO + analytics

**Google Analytics 4** (`G-P3QXRQTHMW`) and **Microsoft Clarity**
(`wracrh4b8s`) are wired into every page's `<head>`. View dashboards at:

- https://analytics.google.com/
- https://clarity.microsoft.com/

**Structured data (JSON-LD)** is emitted on every page:

- Static JSON-LD on every page: Organization (NGO), WebSite, Periodical,
  CollectionPage, BreadcrumbList, ContactPage (where applicable).
- Dynamic JSON-LD injected by `app.js`:
  - `Event` schema for every events row → eligible for Google Events.
  - `NewsArticle` schema for every news row → eligible for Google News.
  - `ItemList` of `Person` for trustees.
  - `ItemList` of `Place` for network contacts.

`sitemap.xml` lists all URLs with appropriate `changefreq` + `priority`.
`robots.txt` allows all crawlers.

---

## GitHub Pages specifics

> See [`GITHUB-PAGES.md`](GITHUB-PAGES.md) for the full deployment guide.

Files that exist *because of* GitHub Pages:

| File | Why |
|---|---|
| `CNAME` | Tells GH Pages to serve this repo at `brahmakshatriyahitechchhu.org`. **Don't delete.** |
| `.nojekyll` | Empty file - tells GH Pages to skip Jekyll processing. |
| `404.html` | Auto-served by GH Pages on any unknown path. |
| `js/redirects.js` | Client-side redirects (since `.htaccess` is ignored). |
| `bump-version.sh` | Cache-bust helper. |
| `.htaccess` | Reference only - dormant on GH Pages, ready if you migrate to Apache. |

**DNS setup (one-time):** A records pointing `brahmakshatriyahitechchhu.org`
to GitHub's IPs (`185.199.108-111.153`). HTTPS is auto-provisioned once
DNS is in place; tick "Enforce HTTPS" in repo Settings → Pages.

---

## Common tasks - cookbook

### Add a new monthly edition

Open `js/data/editions.js`. Add one row to the bottom of the table
(before the closing backtick), keeping column order:

```
2026	2026-06-15	June 2026	Year 51, Issue 2	610	/editions/Jun-2026/files/thumb/1.png	/editions/Jun-2026/
```

Anchor: May 2026 = Year 51, Issue 1, Edition #609. Each new month adds
1 to `editionNo`. Save, run `./bump-version.sh`, push.

### Add a memorial tribute

Open `js/data/memorials.js`. Add a row with name, Gujarati name,
born/passed dates, city, photo URL, tribute text, edition reference,
optional family contact + phone. Save, bump, push.

### Add a community news item

Open `js/data/news.js`. Add a row with date, category, title, Gujarati
title, summary, city, image, source-edition reference, optional
external link, optional `details` (long-form story for the modal),
optional `gallery` (`src||caption;;src||caption`). Save, bump, push.

### Add an event

Same pattern in `js/data/events.js`. The `gujaratiDate`, `highlights`,
`agenda`, and `gallery` fields are optional and unlock the rich modal.

### Update the trustees list

Open `js/data/trustees.js`. Replace the row(s) for whoever changed.
Designations are auto-grouped in this order: President → Vice President
→ Hon. Secretary → Secretary → Treasurer → Trustee → Editor →
Co-Editor → Executive Member → Advisory Committee Member.

### Update bank details / subscription rates / office address

These live as plain text in `contact.html`. Find the relevant
`<article class="info-card">` and edit. Bump cache, push.

### Add a redirect

Edit `js/redirects.js`, add a key/value pair to the `REDIRECTS`
object. Bump cache, push.

### Update the editor's monthly column excerpt

Edit `index.html`, find `<!-- ===== From the Editor =====`. Change the
`.editor-headline` quote and the `.editor-excerpt` paragraph. Bump,
push.

### Update the membership count on the home stats band

Edit `index.html`, find the `Community Members` stat tile, change the
number. Bump, push.

---

## Troubleshooting

**"My change isn't showing up on the live site"**
1. Did you push? `git status` should be clean.
2. Did you bump the cache? `./bump-version.sh`.
3. Open the GitHub repo's Actions tab - is the build green?
4. Hard-refresh once (Cmd+Shift+R). If still stale, the CDN may be
   warming up - wait a minute.

**"The contact form shows 'Form not yet configured'"**
You haven't replaced `YOUR-WEB3FORMS-ACCESS-KEY-HERE` in `contact.html`
(and `submit.html`). See `CONTACT-FORM.md`.

**"Editions show a navy placeholder instead of the cover"**
The `cover` URL in `editions.js` is wrong, or the file isn't deployed
yet. Confirm the path matches the actual file in
`editions/<Month>-<Year>/files/thumb/`.

**"Clicking a cover doesn't open anything"**
The `link` field in `editions.js` is blank or `#`. The file's `.map()`
auto-derives a `/editions/<Month>-<Year>/` URL when `link` is blank,
but only if the title matches the `Month YYYY` pattern.

**"I broke something - how do I revert?"**
`git log --oneline` to see recent commits. `git revert <sha>` makes a
new commit that undoes a previous one. Push - site rebuilds in a
minute.

---

## Companion docs

| File | What's in it |
|---|---|
| [`CACHE.md`](CACHE.md) | The cache strategy + how `./bump-version.sh` works |
| [`CONTACT-FORM.md`](CONTACT-FORM.md) | 3-minute Web3Forms setup + alternatives (Formspree / Google Forms) |
| [`GITHUB-PAGES.md`](GITHUB-PAGES.md) | First-time deploy + DNS records + GH-Pages-specific tooling |
| [`REDIRECTS.md`](REDIRECTS.md) | How to add redirects on GH Pages (vs. Apache) |
| [`data/excel-templates/HOW-TO-EDIT.md`](data/excel-templates/HOW-TO-EDIT.md) | Non-technical editor's guide to updating data |

---

## A note on philosophy

This site is intentionally **simple**. No framework. No build. No
node_modules. The whole codebase is small enough to read in one sitting.

If you're tempted to add a build step or a framework - first ask
whether it solves a real problem the editors are hitting. The editors
hit *content* problems. Frameworks add *developer* problems. The
deliberate trade-off here is **slightly more verbose code in exchange
for never needing to debug a build pipeline at 11 PM the night before
publication**.

When you do need to add complexity, please update this README so the
next person knows where to look.
