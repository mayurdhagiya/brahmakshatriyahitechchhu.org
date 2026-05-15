# Deploying to GitHub Pages

This site is hosted on **GitHub Pages** at
**[brahmakshatriyahitechchhu.org](https://brahmakshatriyahitechchhu.org)**.

This document covers everything you need to know about that
deployment - the files in this repo that exist *because* of GitHub
Pages, the day-to-day workflow, and a checklist for first-time setup.

---

## 🟢 Day-to-day update workflow

```bash
# 1. Make your edits (data files, HTML, CSS, etc.)

# 2. Bust the cache so visitors see fresh assets
./bump-version.sh

# 3. Commit and push
git add -A
git commit -m "describe what you changed"
git push
```

GitHub Pages typically rebuilds in 30-90 seconds. Visit your domain
to see the change, or refresh once if you had it open.

---

## 📂 GitHub Pages-specific files in this repo

| File | Why it's here |
|------|---------------|
| **`CNAME`** | Tells GitHub Pages your custom domain is `brahmakshatriyahitechchhu.org`. **Do not delete this** - if you do, your site will revert to `<username>.github.io/<repo>`. |
| **`.nojekyll`** | Tells GitHub Pages **not** to run Jekyll. Without this, GH Pages tries to process the site through Jekyll, which can ignore folders starting with `_` and cause confusing errors. The file is empty - its mere presence is the signal. |
| **`404.html`** | GitHub Pages automatically serves this file when a visitor requests a path that doesn't exist. Branded to match the rest of the site, with quick-links to every section + a GA event so you can see broken paths in your dashboard. |
| **`js/redirects.js`** | Client-side redirects (since `.htaccess` is ignored on GH Pages). See [REDIRECTS.md](REDIRECTS.md). |
| **`bump-version.sh`** | Cache-busts every CSS/JS reference in one command. See [CACHE.md](CACHE.md). |
| **`.htaccess`** | Kept as a reference for if you ever migrate to Apache. **Has no effect on GitHub Pages**. |

---

## 🛠 First-time setup checklist

Already done if you're seeing this - kept here in case you (or your
successor) needs to redeploy from scratch.

1. **Create the GitHub repo** - public repo named after your project.
2. **Push these files** to the repo's `main` branch.
3. **Enable Pages**: Repo → Settings → Pages → Source = `main` branch,
   folder = `/` (root).
4. **Add custom domain**: in the same Pages settings page, type
   `brahmakshatriyahitechchhu.org` into the Custom domain field.
   GitHub will create the `CNAME` file automatically.
5. **Configure DNS** at your registrar:
   - **A records** pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **AAAA records** (optional, IPv6):
     - `2606:50c0:8000::153`
     - `2606:50c0:8001::153`
     - `2606:50c0:8002::153`
     - `2606:50c0:8003::153`
   - For `www.brahmakshatriyahitechchhu.org`: a **CNAME** record
     pointing to `<github-username>.github.io`
6. **Enforce HTTPS**: back in Repo → Settings → Pages, tick
   "Enforce HTTPS" once your certificate is provisioned (takes a few
   minutes after DNS propagates).
7. **Verify**: visit `https://brahmakshatriyahitechchhu.org/` - site
   should load with a valid SSL padlock.

---

## ⚠️ Things GitHub Pages can't do

If you hit one of these, the workaround is in the parens:

- **Server-side redirects** (use [`js/redirects.js`](js/redirects.js))
- **Custom HTTP headers** like `Cache-Control` (use the meta tags +
  `?v=…` versioning - see [CACHE.md](CACHE.md))
- **Server-side scripting** like PHP / Node (this site is fully
  static; the contact form just shows a "thank you" - wire it to a
  service like Formspree or Web3Forms when you need real submissions)
- **Pretty URLs without `.html`** (you can't make `/about` serve
  `/about.html` on GH Pages - keep the `.html` in nav links)
- **Files larger than 100 MB** (split or move large PDFs to a CDN)
- **More than 100,000 page views per day** (rarely a concern for a
  community site, but be aware)

---

## 🩺 Common issues + fixes

**"My change isn't showing up"**
1. Check the **Actions** tab on GitHub - there should be a green
   ✅ on the most recent commit. If it's red, click in to see why.
2. Hard-refresh once (`Cmd+Shift+R` / `Ctrl+Shift+R`).
3. If still stale, did you forget to run `./bump-version.sh`?

**"I see Jekyll-related errors in the build log"**
- Make sure `.nojekyll` exists at the repo root. If it's missing,
  re-create it (empty file): `touch .nojekyll`.

**"Custom domain stopped working"**
- Check that `CNAME` still exists at the repo root. GitHub
  occasionally clears this if you toggle Pages settings.
- Verify DNS records haven't changed at your registrar.

**"HTTPS shows certificate warning"**
- Toggle "Enforce HTTPS" off, wait 60 seconds, toggle it back on.
  This forces GitHub to re-provision the certificate.

**"I broke something - how do I revert?"**
- `git log` to see recent commits. `git revert <commit-sha>` makes
  a new commit that undoes a previous one. Push as normal - site
  rebuilds in a minute.

---

## 📊 Where to monitor

- **Site traffic**: [Google Analytics dashboard](https://analytics.google.com/)
  (measurement ID `G-P3QXRQTHMW`)
- **User session recordings**: [Microsoft Clarity dashboard](https://clarity.microsoft.com/)
  (project tag `wracrh4b8s`)
- **404 events**: filter the GA4 events list for `page_not_found`
  to see which broken URLs visitors are hitting
- **Build status**: GitHub repo → Actions tab
- **Deploy history**: GitHub repo → Settings → Pages → Visit site

---

## 🔁 Optional: auto-bump version on every push

If you'd like to automate `./bump-version.sh` so you never forget it,
add a GitHub Actions workflow at `.github/workflows/bump.yml`:

```yaml
name: Auto cache-bump
on:
  push:
    branches: [main]
    paths:
      - 'css/**'
      - 'js/**'

jobs:
  bump:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: Bump cache version
        run: |
          git config user.name 'github-actions[bot]'
          git config user.email 'github-actions[bot]@users.noreply.github.com'
          ./bump-version.sh
          git add -A
          git diff --cached --quiet || git commit -m "Auto-bump cache version"
          git push
```

That's optional - many sites prefer to bump manually so they control
exactly when each deploy is "official". Pick whichever fits your team.
