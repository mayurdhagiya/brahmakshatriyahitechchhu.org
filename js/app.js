/* ============================================================
   Brahmakshatriya Hitechchhu — App Logic
   ------------------------------------------------------------
   ONE script powers every page. Each loader (loadEditions,
   loadTrustees, loadNetwork, loadEvents, loadAds) checks for
   the data file's presence and silently no-ops if it isn't on
   the current page — so this single file is safe to include
   on every HTML document.

   Defensive philosophy:
     • If a data file is missing or empty, log a console warning
       and gracefully render an empty state — never throw.
     • If a date string is malformed, fall back to "Invalid date"
       text rather than crashing the sort/filter pipeline.
     • If an image URL 404s in the browser, swap to an inline
       SVG placeholder so the layout doesn't collapse.
     • Every event listener is null-guarded — missing DOM nodes
       are normal because not every page has every widget.
============================================================ */


/* =============================================================
   ⚙️  Defensive helpers — reused everywhere
============================================================= */

/* Inline SVG placeholders (data: URIs so they need no HTTP request) */
const FALLBACK_COVER =
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
       <rect fill="#1a2a4f" width="300" height="400"/>
       <text x="50%" y="48%" text-anchor="middle" fill="#c9a55a"
             font-family="Georgia,serif" font-size="22">Brahmakshatriya</text>
       <text x="50%" y="58%" text-anchor="middle" fill="#c9a55a"
             font-family="Georgia,serif" font-size="22">Hitechchhu</text>
     </svg>`);

const FALLBACK_PHOTO =
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">
       <rect fill="#1a2a4f" width="600" height="360"/>
       <text x="50%" y="50%" text-anchor="middle" fill="#c9a55a"
             font-family="Georgia,serif" font-size="26">Image unavailable</text>
     </svg>`);

/**
 * Build an <img> tag that auto-falls-back to a placeholder if the
 * real URL 404s. Use everywhere instead of writing <img> by hand.
 *
 *   safeImg('cover.jpg', 'May 2025', 'cover-img')
 *
 * @param {string} src       The intended image URL.
 * @param {string} alt       Alt text — required for accessibility/SEO.
 * @param {string} [fb]      Fallback URL (defaults to FALLBACK_COVER).
 * @param {string} [extra]   Extra HTML attrs (e.g. 'class="x"').
 * @return {string} HTML string ready to drop into innerHTML.
 */
function safeImg(src, alt, fb, extra) {
  const fallback = fb || FALLBACK_COVER;
  const safeAlt  = (alt || '').replace(/"/g, '&quot;');
  const safeSrc  = (src || fallback);
  // onerror disables itself first so a broken fallback can't loop forever
  return `<img src="${safeSrc}" alt="${safeAlt}" loading="lazy" ${extra || ''} onerror="this.onerror=null;this.src='${fallback}'" />`;
}

/**
 * Safe date parser — returns a real Date or `null` for bad input.
 * Avoids the JavaScript "Invalid Date" trap that breaks sorts.
 */
function safeDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format an ISO date for display. Returns '' on bad input
 * instead of "Invalid Date" so card UIs stay clean.
 */
function formatDate(iso) {
  const d = safeDate(iso);
  return d ? d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';
}

/**
 * Wrap a loader so a runtime error in one section can never break
 * the rest of the page. The error is logged to the console so the
 * editor can investigate.
 */
function safely(label, fn) {
  try { fn(); }
  catch (err) { console.error(`[${label}] failed:`, err); }
}


/* =============================================================
   📱  Mobile navigation toggle
============================================================= */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.nav');
  if (!toggle || !nav) return; // pages without nav (shouldn't happen)

  // Tap the hamburger → reveal/hide the menu
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  // Tap anywhere else → close the menu
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
}

/* ---------- Home: current edition + past editions grouped by year ---------- */
function loadEditions() {
  // No-op when this page didn't load editions.js (about, contact, etc.).
  if (typeof editionsData === 'undefined') return;
  if (!Array.isArray(editionsData) || !editionsData.length) {
    console.warn('[loadEditions] editionsData is empty');
    return;
  }

  // Sort newest-first. Rows with a missing/invalid date sink to the
  // bottom rather than crashing the comparator.
  const sorted = [...editionsData].sort((a, b) => {
    const da = safeDate(a.date), db = safeDate(b.date);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
  });
  const current = sorted[0];
  const rest = sorted.slice(1);

  // Hero / current
  const heroCover  = document.querySelector('[data-current-cover]');
  const heroTitle  = document.querySelector('[data-current-title]');
  const heroVolume = document.querySelector('[data-current-volume]');
  const heroLink   = document.querySelector('[data-current-link]');

  // Build the hero subtitle: "Year 51, Issue 1 · Edition #609"
  const heroVolumeLabel = (ed) => {
    const parts = [];
    if (ed.volume)    parts.push(ed.volume);                    // e.g. "Year 51, Issue 1"
    if (ed.editionNo) parts.push('Edition #' + ed.editionNo);   // e.g. "Edition #609"
    return parts.join(' · ');
  };

  if (current && heroCover)  heroCover.src = current.cover;
  if (current && heroTitle)  heroTitle.textContent  = current.title;
  if (current && heroVolume) heroVolume.textContent = heroVolumeLabel(current);
  if (current && heroLink)   heroLink.href = current.link;

  const archive = document.getElementById('archive');
  if (!archive) return;

  // Filter controls (optional — only present on index.html)
  const yearSel  = document.getElementById('editionYearFilter');
  const monthSel = document.getElementById('editionMonthFilter');
  const resetBtn = document.getElementById('editionFilterReset');

  if (yearSel) {
    const years = [...new Set(rest.map((e) => new Date(e.date).getFullYear()))].sort((a, b) => b - a);
    years.forEach((y) => {
      const o = document.createElement('option');
      o.value = y; o.textContent = y;
      yearSel.appendChild(o);
    });
  }

  // Each archive card shows: cover, title, "Year 51, Issue 1" + small "#609"
  // pill, and a Read button.
  const cardHTML = (ed) => `
    <div class="edition-card">
      <div class="cover">${safeImg(ed.cover, ed.title + ' cover', FALLBACK_COVER)}</div>
      <h4 class="title">${ed.title}</h4>
      <p class="date">${ed.volume || ''}</p>
      ${ed.editionNo ? `<span class="edition-no">#${ed.editionNo}</span>` : ''}
      <a class="btn" href="${ed.link}" target="_blank" rel="noopener">
        <i class="fas fa-book-open"></i> Read
      </a>
    </div>
  `;

  const renderGrouped = (items) => {
    const grouped = items.reduce((acc, ed) => {
      (acc[ed.year] = acc[ed.year] || []).push(ed);
      return acc;
    }, {});

    Object.keys(grouped)
      .sort((a, b) => b - a)
      .forEach((year) => {
        const list = grouped[year];
        const block = document.createElement('div');
        block.className = 'year-block';
        block.innerHTML = `
          <div class="year-head">
            <h3>${year}</h3>
            <span class="count">${list.length} edition${list.length > 1 ? 's' : ''}</span>
          </div>
          <div class="scroller">
            <button class="scroll-btn left"  aria-label="Scroll left"><i class="fas fa-chevron-left"></i></button>
            <div class="scroller-track"></div>
            <button class="scroll-btn right" aria-label="Scroll right"><i class="fas fa-chevron-right"></i></button>
          </div>
        `;
        const track = block.querySelector('.scroller-track');
        list.forEach((ed) => {
          const wrap = document.createElement('div');
          wrap.innerHTML = cardHTML(ed);
          track.appendChild(wrap.firstElementChild);
        });

        const left  = block.querySelector('.scroll-btn.left');
        const right = block.querySelector('.scroll-btn.right');
        const step  = () => Math.max(track.clientWidth * 0.8, 240);
        left.addEventListener('click',  () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
        right.addEventListener('click', () => track.scrollBy({ left:  step(), behavior: 'smooth' }));

        archive.appendChild(block);

        // Show arrows only when the track actually overflows, and hide
        // each side when there's nothing more to scroll in that direction.
        const updateArrows = () => {
          const overflow = track.scrollWidth - track.clientWidth;
          if (overflow <= 1) {
            left.style.display  = 'none';
            right.style.display = 'none';
            return;
          }
          left.style.display  = track.scrollLeft > 4 ? '' : 'none';
          right.style.display = track.scrollLeft < overflow - 4 ? '' : 'none';
        };
        track.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        // Defer one frame so layout is settled before measuring.
        requestAnimationFrame(updateArrows);
      });
  };

  const renderGrid = (items, summary) => {
    const block = document.createElement('div');
    block.className = 'archive-grid-block';
    block.innerHTML = `
      <div class="year-head">
        <h3>${summary}</h3>
        <span class="count">${items.length} edition${items.length === 1 ? '' : 's'}</span>
      </div>
      <div class="editions-grid">${items.map(cardHTML).join('')}</div>
    `;
    archive.appendChild(block);
  };

  const monthName = (m) => ['January','February','March','April','May','June',
    'July','August','September','October','November','December'][m - 1];

  const render = () => {
    archive.innerHTML = '';
    const y = yearSel?.value  || '';
    const m = monthSel?.value || '';

    // No filters → original grouped scrollers (excluding the current/hero edition)
    if (!y && !m) {
      renderGrouped(rest);
      return;
    }

    // Filters applied → flat grid across the *entire* archive (incl. current edition)
    const filtered = sorted.filter((ed) => {
      const d = new Date(ed.date);
      const yearOk  = !y || String(d.getFullYear()) === y;
      const monthOk = !m || String(d.getMonth() + 1) === m;
      return yearOk && monthOk;
    });

    if (!filtered.length) {
      archive.innerHTML = `<div class="empty-state">
        <i class="fas fa-magnifying-glass"></i>
        No editions found for ${m ? monthName(+m) : ''}${m && y ? ' ' : ''}${y || ''}.
      </div>`;
      return;
    }

    let summary;
    if (y && m) summary = `${monthName(+m)} ${y}`;
    else if (y) summary = `${y} editions`;
    else        summary = `${monthName(+m)} editions`;

    renderGrid(filtered, summary);
  };

  yearSel?.addEventListener('change', render);
  monthSel?.addEventListener('change', render);
  resetBtn?.addEventListener('click', () => {
    if (yearSel)  yearSel.value  = '';
    if (monthSel) monthSel.value = '';
    render();
  });

  render();
}

/* ---------- Trustees: grouped by designation ---------- */
function loadTrustees() {
  if (typeof trusteesData === 'undefined') return;
  const container = document.getElementById('trustees');
  if (!container) return;

  // Preferred ordering of designations from board-most to advisory.
  // Anything not in this list falls to the end alphabetically.
  const order = [
    'President',
    'Vice President',
    'Hon. Secretary',
    'Secretary',
    'Treasurer',
    'Trustee',
    'Editor',
    'Co-Editor',
    'Executive Member',
    'Advisory Committee Member'
  ];

  // Map each designation to a Gujarati subtitle shown under the group heading
  // — purely cosmetic; an unknown designation just hides the subtitle.
  const designationGu = {
    'President':                 'પ્રમુખ',
    'Vice President':            'ઉપપ્રમુખ',
    'Hon. Secretary':            'મા. મંત્રી',
    'Secretary':                 'મંત્રી',
    'Treasurer':                 'કોષાધ્યક્ષ',
    'Trustee':                   'ટ્રસ્ટી',
    'Editor':                    'તંત્રી',
    'Co-Editor':                 'સહતંત્રી',
    'Executive Member':          'કારોબારી સભ્ય',
    'Advisory Committee Member': 'સલાહકાર સમિતિ સભ્ય'
  };

  const grouped = trusteesData.reduce((acc, t) => {
    (acc[t.designation] = acc[t.designation] || []).push(t);
    return acc;
  }, {});

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const ai = order.indexOf(a), bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  container.innerHTML = '';
  sortedKeys.forEach((designation) => {
    const group = document.createElement('section');
    group.className = 'trustee-group';
    // Group heading shows English only — the Gujarati designation
    // appears inline on each card's role pill instead.
    group.innerHTML = `
      <h3 class="designation-title">${designation}</h3>
      <div class="trustee-grid"></div>
    `;
    const grid = group.querySelector('.trustee-grid');
    grouped[designation].forEach((t) => {
      const card = document.createElement('article');
      card.className = 'trustee-card';
      const social = t.social || {};

      // Build the contact-action row only if at least one channel exists,
      // so trustees with no contact info don't show an empty stub.
      const hasContact = t.phone || t.whatsapp || t.email
        || social.facebook || social.twitter || social.linkedin;
      const actionsHTML = hasContact ? `
        <div class="trustee-actions">
          ${t.phone    ? `<a href="tel:${t.phone}" title="Call ${t.name}"><i class="fas fa-phone"></i></a>` : ''}
          ${t.whatsapp ? `<a href="https://wa.me/${t.whatsapp}" target="_blank" rel="noopener" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
          ${t.email    ? `<a href="mailto:${t.email}" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
          ${social.facebook ? `<a href="${social.facebook}" target="_blank" rel="noopener" title="Facebook"><i class="fab fa-facebook-f"></i></a>` : ''}
          ${social.twitter  ? `<a href="${social.twitter}"  target="_blank" rel="noopener" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
          ${social.linkedin ? `<a href="${social.linkedin}" target="_blank" rel="noopener" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
        </div>
      ` : '';

      // Render the designation pill bilingually: "PRESIDENT · પ્રમુખ"
      const guRole = designationGu[t.designation];
      const roleHTML = `
        <div class="role">
          <span class="role-en">${t.designation}</span>
          ${guRole ? `<span class="role-sep">·</span><span class="role-gu">${guRole}</span>` : ''}
        </div>
      `;

      card.innerHTML = `
        <div class="trustee-photo">${safeImg(t.image, t.name, FALLBACK_PHOTO)}</div>
        <h4>${t.name}</h4>
        ${t.nameGu ? `<div class="trustee-name-gu">${t.nameGu}</div>` : ''}
        ${roleHTML}
        <p class="bio">${t.bio || ''}</p>
        ${actionsHTML}
      `;
      grid.appendChild(card);
    });
    container.appendChild(group);
  });
}

/* ---------- Network: state filter + search ---------- */
function loadNetwork() {
  if (typeof networkData === 'undefined') return;
  const directory = document.getElementById('directory');
  const stateFilter = document.getElementById('stateFilter');
  const searchInput = document.getElementById('searchInput');
  if (!directory) return;

  // Dedupe defensively
  const seen = new Set();
  const unique = networkData.filter((item) => {
    const key = [item.contactPerson, item.address, item.city, item.state, item.mobile].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Populate states
  if (stateFilter) {
    const states = [...new Set(unique.map((i) => i.state))].sort();
    states.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      stateFilter.appendChild(opt);
    });
  }

  const render = (rows) => {
    directory.innerHTML = '';
    if (!rows.length) {
      directory.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i> No contacts match your search.</div>`;
      return;
    }
    rows.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'directory-card';
      card.innerHTML = `
        <span class="location"><i class="fas fa-map-marker-alt"></i> ${item.city}, ${item.state}</span>
        <h3>${item.contactPerson}</h3>
        <div class="info"><i class="fas fa-home"></i> <span>${item.address}</span></div>
        <div class="info"><i class="fas fa-phone"></i>    <a href="tel:${item.mobile}">${item.mobile}</a></div>
        <div class="info"><i class="fab fa-whatsapp"></i> <a href="https://wa.me/${item.whatsapp}" target="_blank" rel="noopener">Chat on WhatsApp</a></div>
      `;
      directory.appendChild(card);
    });
  };

  const apply = () => {
    const s = (stateFilter?.value || '').toLowerCase();
    const q = (searchInput?.value || '').toLowerCase().trim();
    const filtered = unique.filter((i) => {
      const stateOk = !s || i.state.toLowerCase() === s;
      const queryOk = !q || [i.contactPerson, i.city, i.state, i.mobile, i.address]
        .join(' ').toLowerCase().includes(q);
      return stateOk && queryOk;
    });
    render(filtered);
  };

  stateFilter?.addEventListener('change', apply);
  searchInput?.addEventListener('input', apply);
  render(unique);
}

/* ---------- Helpers: slug + share + venue ---------- */
const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Combine venue + city without repeating the city when the venue already ends with it. */
function venueWithCity(venue, city) {
  if (!city)  return venue || '';
  if (!venue) return city;
  const v = venue.trim().toLowerCase();
  const c = city.trim().toLowerCase();
  if (v === c || v.endsWith(', ' + c) || v.endsWith(' ' + c)) return venue;
  return `${venue}, ${city}`;
}

/* Normalise a gallery entry to { src, caption } so strings still work. */
function normaliseGalleryItem(item, i) {
  if (typeof item === 'string') return { src: item, caption: '' };
  return { src: item.src, caption: item.caption || '' };
}

/* Google Maps helpers — derive search + embed URLs from venue + city,
   unless the event explicitly provides mapUrl / mapEmbed overrides. */
function mapsQuery(ev) {
  return [ev.venue, ev.city].filter(Boolean).join(', ');
}
function mapsLinkFor(ev) {
  if (ev.mapUrl) return ev.mapUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(ev))}`;
}
function mapsEmbedFor(ev) {
  if (ev.mapEmbed) return ev.mapEmbed;
  return `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery(ev))}&output=embed`;
}

function buildShareData(ev) {
  const slug = slugify(ev.title);
  const url = `${location.origin}${location.pathname}#event-${slug}`;
  const text = `${ev.title} — ${new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at ${ev.venue}, ${ev.city}`;
  return { url, text, title: ev.title };
}

async function shareEvent(ev, anchorEl) {
  const data = buildShareData(ev);
  if (navigator.share) {
    try {
      await navigator.share({ title: data.title, text: data.text, url: data.url });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      // fall through to popover
    }
  }
  showSharePopover(anchorEl, data);
}

function showSharePopover(anchorEl, data) {
  closeSharePopover();
  const enc = encodeURIComponent;
  const links = {
    whatsapp: `https://wa.me/?text=${enc(data.text + ' ' + data.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(data.url)}`,
    twitter:  `https://twitter.com/intent/tweet?text=${enc(data.text)}&url=${enc(data.url)}`,
    email:    `mailto:?subject=${enc(data.title)}&body=${enc(data.text + '\n\n' + data.url)}`
  };

  const pop = document.createElement('div');
  pop.className = 'share-popover';
  pop.id = 'sharePopover';
  pop.innerHTML = `
    <a href="${links.whatsapp}" target="_blank" rel="noopener" class="share-opt"><i class="fab fa-whatsapp"></i> WhatsApp</a>
    <a href="${links.facebook}" target="_blank" rel="noopener" class="share-opt"><i class="fab fa-facebook-f"></i> Facebook</a>
    <a href="${links.twitter}"  target="_blank" rel="noopener" class="share-opt"><i class="fa-brands fa-x-twitter"></i> Twitter / X</a>
    <a href="${links.email}"    class="share-opt"><i class="fas fa-envelope"></i> Email</a>
    <button type="button" class="share-opt" data-share-copy><i class="fas fa-link"></i> <span>Copy link</span></button>
  `;
  document.body.appendChild(pop);

  // Position relative to anchor
  const r = anchorEl.getBoundingClientRect();
  const popW = 220;
  let left = r.left + window.scrollX + (r.width / 2) - (popW / 2);
  left = Math.max(12, Math.min(left, window.scrollX + document.documentElement.clientWidth - popW - 12));
  let top = r.bottom + window.scrollY + 10;
  pop.style.left = `${left}px`;
  pop.style.top  = `${top}px`;
  pop.style.minWidth = `${popW}px`;
  requestAnimationFrame(() => pop.classList.add('open'));

  // Copy link
  pop.querySelector('[data-share-copy]')?.addEventListener('click', async (e) => {
    const label = e.currentTarget.querySelector('span');
    try {
      await navigator.clipboard.writeText(data.url);
      if (label) { const old = label.textContent; label.textContent = 'Copied!'; setTimeout(() => label.textContent = old, 1500); }
    } catch {
      if (label) label.textContent = 'Copy failed';
    }
  });

  // Dismiss handlers
  setTimeout(() => {
    document.addEventListener('click', _shareDismiss, { once: false });
    document.addEventListener('keydown', _shareEsc);
  }, 0);
}
function _shareDismiss(e) {
  const pop = document.getElementById('sharePopover');
  if (!pop) return;
  if (pop.contains(e.target)) return;
  if (e.target.closest('[data-event-share],[data-modal-share]')) return;
  closeSharePopover();
}
function _shareEsc(e) { if (e.key === 'Escape') closeSharePopover(); }
function closeSharePopover() {
  const pop = document.getElementById('sharePopover');
  if (pop) pop.remove();
  document.removeEventListener('click', _shareDismiss);
  document.removeEventListener('keydown', _shareEsc);
}

/* ---------- Event detail modal (highlights, agenda, gallery, lightbox) ---------- */
let _galleryItems = [];
let _galleryIndex = 0;

function ensureEventModal() {
  let backdrop = document.getElementById('eventModal');
  if (backdrop) return backdrop;

  backdrop = document.createElement('div');
  backdrop.id = 'eventModal';
  backdrop.className = 'event-modal-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = `
    <div class="event-modal" role="dialog" aria-modal="true" aria-labelledby="eventModalTitle">
      <button type="button" class="event-modal-close" aria-label="Close">
        <i class="fas fa-xmark"></i>
      </button>
      <div class="event-modal-body"></div>
    </div>
    <div class="event-lightbox" hidden>
      <button type="button" class="event-lightbox-close" aria-label="Close image"><i class="fas fa-xmark"></i></button>
      <button type="button" class="event-lightbox-nav prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
      <button type="button" class="event-lightbox-nav next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      <figure class="event-lightbox-figure">
        <img alt="" />
        <figcaption class="event-lightbox-meta">
          <span class="event-lightbox-caption"></span>
          <span class="event-lightbox-counter"></span>
        </figcaption>
      </figure>
    </div>
  `;
  document.body.appendChild(backdrop);

  const closeBtn  = backdrop.querySelector('.event-modal-close');
  const lightbox  = backdrop.querySelector('.event-lightbox');
  const lbClose   = backdrop.querySelector('.event-lightbox-close');
  const lbPrev    = backdrop.querySelector('.event-lightbox-nav.prev');
  const lbNext    = backdrop.querySelector('.event-lightbox-nav.next');

  const close = () => closeEventModal();
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  document.addEventListener('keydown', (e) => {
    if (!backdrop.classList.contains('open')) return;
    if (!lightbox.hidden) {
      if (e.key === 'Escape')      { lightbox.hidden = true; }
      else if (e.key === 'ArrowLeft')  { stepLightbox(-1); }
      else if (e.key === 'ArrowRight') { stepLightbox( 1); }
      return;
    }
    if (e.key === 'Escape') close();
  });

  lbClose.addEventListener('click', () => { lightbox.hidden = true; });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.hidden = true; });
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox( 1); });

  return backdrop;
}

function showLightbox(idx) {
  const backdrop = document.getElementById('eventModal');
  if (!backdrop || !_galleryItems.length) return;
  _galleryIndex = (idx + _galleryItems.length) % _galleryItems.length;
  const item = _galleryItems[_galleryIndex];
  const lightbox = backdrop.querySelector('.event-lightbox');
  const img      = lightbox.querySelector('img');
  const counter  = lightbox.querySelector('.event-lightbox-counter');
  const caption  = lightbox.querySelector('.event-lightbox-caption');
  // Defensive: if the image URL 404s, swap to a placeholder so the
  // lightbox still renders something instead of a broken-image icon.
  img.onerror = () => { img.onerror = null; img.src = FALLBACK_PHOTO; };
  img.src = item.src || FALLBACK_PHOTO;
  img.alt = item.caption || `Photo ${_galleryIndex + 1} of ${_galleryItems.length}`;
  counter.textContent = `${_galleryIndex + 1} / ${_galleryItems.length}`;
  caption.textContent = item.caption || '';
  caption.style.display = item.caption ? '' : 'none';
  const showNav = _galleryItems.length > 1;
  lightbox.querySelector('.event-lightbox-nav.prev').style.display = showNav ? '' : 'none';
  lightbox.querySelector('.event-lightbox-nav.next').style.display = showNav ? '' : 'none';
  lightbox.hidden = false;
}
function stepLightbox(delta) { showLightbox(_galleryIndex + delta); }

function openEventModal(ev) {
  const backdrop = ensureEventModal();
  const body = backdrop.querySelector('.event-modal-body');
  const lightbox = backdrop.querySelector('.event-lightbox');

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isPast = new Date(ev.date) < today;
  const fmtFull = new Date(ev.date).toLocaleDateString('en-IN',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const highlightsHTML = ev.highlights?.length ? `
    <section class="event-modal-section">
      <h3>By the numbers</h3>
      <div class="event-highlights">
        ${ev.highlights.map((h) => `
          <div class="event-stat">
            <div class="event-stat-num">${h.number}</div>
            <div class="event-stat-label">${h.label}</div>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';

  const agendaHTML = ev.agenda?.length ? `
    <section class="event-modal-section">
      <h3>Agenda</h3>
      <ol class="event-agenda">
        ${ev.agenda.map((a) => `
          <li><span class="event-agenda-time">${a.time}</span><span>${a.title}</span></li>
        `).join('')}
      </ol>
    </section>
  ` : '';

  const locationHTML = (ev.venue || ev.city) ? `
    <section class="event-modal-section">
      <h3>How to reach</h3>
      <p class="event-location-line">
        <i class="fas fa-location-dot"></i>
        <strong>${venueWithCity(ev.venue, ev.city)}</strong>
      </p>
      <div class="event-map">
        <iframe
          src="${mapsEmbedFor(ev)}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Map showing ${ev.venue || ev.city}"
          allowfullscreen></iframe>
      </div>
      <div class="event-map-actions">
        <a href="${mapsLinkFor(ev)}" target="_blank" rel="noopener" class="btn">
          <i class="fas fa-diamond-turn-right"></i> Get directions
        </a>
      </div>
    </section>
  ` : '';

  const galleryItems = (ev.gallery || []).map(normaliseGalleryItem);
  const galleryHTML = galleryItems.length ? `
    <section class="event-modal-section">
      <h3>Photo gallery <span class="muted-count">(${galleryItems.length})</span></h3>
      <div class="event-gallery">
        ${galleryItems.map((g, i) => `
          <figure class="event-gallery-thumb">
            <button type="button" class="event-gallery-btn" data-gallery-index="${i}" aria-label="Open photo ${i + 1}${g.caption ? ': ' + g.caption : ''}">
              ${safeImg(g.src, g.caption || ('Photo ' + (i + 1)), FALLBACK_PHOTO)}
            </button>
            ${g.caption ? `<figcaption>${g.caption}</figcaption>` : ''}
          </figure>
        `).join('')}
      </div>
    </section>
  ` : '';

  body.innerHTML = `
    <div class="event-modal-hero">
      ${safeImg(ev.image, ev.title, FALLBACK_PHOTO)}
      <span class="event-status ${isPast ? 'is-past' : ''}">${isPast ? 'Past Event' : 'Upcoming'}</span>
      <div class="event-modal-hero-text">
        <h2 id="eventModalTitle">${ev.title}</h2>
        <div class="event-modal-meta">
          <span><i class="fas fa-calendar"></i> ${fmtFull}</span>
          ${ev.gujaratiDate ? `<span title="Vikram Samvat tithi"><i class="fas fa-moon"></i> ${ev.gujaratiDate}</span>` : ''}
          ${ev.time ? `<span><i class="fas fa-clock"></i> ${ev.time}</span>` : ''}
          <span><i class="fas fa-location-dot"></i>
            <a href="${mapsLinkFor(ev)}" target="_blank" rel="noopener" class="event-map-link on-dark" title="Open in Google Maps">${venueWithCity(ev.venue, ev.city)} <i class="fas fa-arrow-up-right-from-square"></i></a>
          </span>
        </div>
      </div>
    </div>

    <section class="event-modal-section">
      <h3>About this event</h3>
      <p>${ev.details || ev.description || ''}</p>
    </section>

    ${highlightsHTML}
    ${agendaHTML}
    ${locationHTML}
    ${galleryHTML}

    <div class="event-modal-cta">
      ${ev.link && ev.link !== '#' ? `
        <a href="${ev.link}" class="btn" target="_blank" rel="noopener">
          <i class="fas fa-${isPast ? 'images' : 'ticket'}"></i>
          ${isPast ? 'View full photo album' : 'Register / RSVP'}
        </a>` : ''}
      <button type="button" class="btn btn-outline" data-modal-share>
        <i class="fas fa-share-nodes"></i> Share
      </button>
    </div>
  `;

  // Wire gallery thumbnails to lightbox with prev/next support
  _galleryItems = galleryItems;
  body.querySelectorAll('.event-gallery-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.galleryIndex, 10) || 0;
      showLightbox(idx);
    });
  });

  // Share button inside modal
  body.querySelector('[data-modal-share]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    shareEvent(ev, e.currentTarget);
  });

  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  body.scrollTop = 0;
}

function closeEventModal() {
  const backdrop = document.getElementById('eventModal');
  if (!backdrop) return;
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.querySelector('.event-lightbox').hidden = true;
  document.body.style.overflow = '';
}

/* ---------- Events: upcoming/past tabs + year/location/search filters ---------- */
function loadEvents() {
  if (typeof eventsData === 'undefined') return;
  const wrap = document.getElementById('events');
  if (!wrap) return;

  const yearFilter     = document.getElementById('eventYearFilter');
  const locationFilter = document.getElementById('eventLocationFilter');
  const searchInput    = document.getElementById('eventSearchInput');
  const tabs           = document.querySelectorAll('[data-event-tab]');

  const today = new Date(); today.setHours(0, 0, 0, 0);
  // Newest-first; rows with invalid dates sink to the bottom safely.
  const sorted = [...eventsData].sort((a, b) => {
    const da = safeDate(a.date), db = safeDate(b.date);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
  });

  // Populate year + location dropdowns
  const years     = [...new Set(sorted.map((e) => new Date(e.date).getFullYear()))].sort((a, b) => b - a);
  const locations = [...new Set(sorted.map((e) => e.city))].sort();

  if (yearFilter) {
    years.forEach((y) => {
      const o = document.createElement('option'); o.value = y; o.textContent = y;
      yearFilter.appendChild(o);
    });
  }
  if (locationFilter) {
    locations.forEach((c) => {
      const o = document.createElement('option'); o.value = c; o.textContent = c;
      locationFilter.appendChild(o);
    });
  }

  let currentTab = 'upcoming';

  const fmtDay   = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit' });
  const fmtMonth = (d) => new Date(d).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
  const fmtYear  = (d) => new Date(d).getFullYear();
  const fmtFull  = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const cardHTML = (e, isPast, idx) => `
    <article class="event-card ${isPast ? 'is-past' : 'is-upcoming'}">
      <div class="event-media">
        ${safeImg(e.image, e.title, FALLBACK_PHOTO)}
        <div class="event-date-badge">
          <span class="day">${fmtDay(e.date)}</span>
          <span class="month">${fmtMonth(e.date)}</span>
          <span class="year">${fmtYear(e.date)}</span>
        </div>
        <span class="event-status">${isPast ? 'Past' : 'Upcoming'}</span>
      </div>
      <div class="event-body">
        <h3>${e.title}</h3>
        <div class="event-meta">
          <span><i class="fas fa-calendar"></i> ${fmtFull(e.date)}</span>
          ${e.gujaratiDate ? `<span title="Vikram Samvat tithi"><i class="fas fa-moon"></i> ${e.gujaratiDate}</span>` : ''}
          ${e.time   ? `<span><i class="fas fa-clock"></i> ${e.time}</span>` : ''}
          <span><i class="fas fa-location-dot"></i>
            <a href="${mapsLinkFor(e)}" target="_blank" rel="noopener" class="event-map-link" title="Open in Google Maps">${venueWithCity(e.venue, e.city)} <i class="fas fa-arrow-up-right-from-square"></i></a>
          </span>
        </div>
        <p class="event-desc">${e.description || ''}</p>
        <div class="event-actions">
          <button type="button" class="btn" data-event-readmore="${idx}">
            <i class="fas fa-arrow-right"></i> Read more
          </button>
          <button type="button" class="btn btn-outline" data-event-share="${idx}">
            <i class="fas fa-share-nodes"></i> Share
          </button>
        </div>
      </div>
    </article>
  `;

  const render = () => {
    const y = yearFilter?.value || '';
    const c = locationFilter?.value || '';
    const q = (searchInput?.value || '').toLowerCase().trim();

    const buildSearchCorpus = (e) => {
      const d = new Date(e.date);
      const parts = [
        e.title, e.description, e.details,
        e.venue, e.city, e.gujaratiDate, e.time,
        fmtFull(e.date), fmtMonth(e.date), String(fmtYear(e.date)),
        d.toLocaleDateString('en-IN', { month: 'long' }),
        d.toLocaleDateString('en-IN', { weekday: 'long' })
      ];
      (e.agenda     || []).forEach((a) => parts.push(a.time, a.title));
      (e.highlights || []).forEach((h) => parts.push(h.number, h.label));
      (e.gallery    || []).forEach((g) => parts.push(typeof g === 'string' ? '' : (g.caption || '')));
      return parts.filter(Boolean).join(' • ').toLowerCase();
    };

    const filtered = sorted.filter((e) => {
      const d = new Date(e.date); d.setHours(0, 0, 0, 0);
      const isPast = d < today;
      const tabOk  = currentTab === 'past' ? isPast : !isPast;
      const yearOk = !y || String(d.getFullYear()) === y;
      const locOk  = !c || e.city === c;
      const qOk    = !q || buildSearchCorpus(e).includes(q);
      return tabOk && yearOk && locOk && qOk;
    });

    // Upcoming chronological ascending, past descending
    filtered.sort((a, b) => currentTab === 'past'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date));

    wrap.innerHTML = filtered.length
      ? `<div class="event-grid">${filtered.map((e) => {
          const realIdx = sorted.indexOf(e);
          return cardHTML(e, currentTab === 'past', realIdx);
        }).join('')}</div>`
      : `<div class="empty-state"><i class="fas fa-calendar-xmark"></i>
           No ${currentTab} events match your filters.</div>`;

    wrap.querySelectorAll('[data-event-readmore]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ev = sorted[+btn.dataset.eventReadmore];
        if (ev) openEventModal(ev);
      });
    });

    wrap.querySelectorAll('[data-event-share]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ev = sorted[+btn.dataset.eventShare];
        if (ev) shareEvent(ev, btn);
      });
    });

    // Update counts on the tab buttons
    const upcomingCount = sorted.filter((e) => new Date(e.date) >= today).length;
    const pastCount     = sorted.filter((e) => new Date(e.date) < today).length;
    const upTab = document.querySelector('[data-event-tab="upcoming"] .count');
    const pTab  = document.querySelector('[data-event-tab="past"] .count');
    if (upTab) upTab.textContent = upcomingCount;
    if (pTab)  pTab.textContent  = pastCount;
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.eventTab;
      render();
    });
  });

  yearFilter?.addEventListener('change', render);
  locationFilter?.addEventListener('change', render);
  searchInput?.addEventListener('input', render);

  render();

  // Deep-link: open a specific event from the URL hash (#event-<slug>)
  const openFromHash = () => {
    const m = (location.hash || '').match(/^#event-(.+)$/);
    if (!m) return;
    const target = sorted.find((e) => slugify(e.title) === m[1]);
    if (target) openEventModal(target);
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
}

/* =============================================================
   📨  Submit Your Content form (submit.html)
   -------------------------------------------------------------
   The submission type dropdown drives which extra fields are
   visible. Submission flows through the same Web3Forms relay
   as the contact form, with a hidden field telling the office
   what type of submission it is.
============================================================= */
function initSubmitForm() {
  const form = document.getElementById('submitForm');
  if (!form) return;

  const typeSel  = form.querySelector('select[name="submission_type"]');
  const blocks   = form.querySelectorAll('[data-show-for]');
  const hint     = form.querySelector('[data-show-for="__none"]');
  const status   = form.querySelector('[data-status]');
  const button   = form.querySelector('button[type="submit"]');
  const subjectEl = form.querySelector('input[name="subject"]');

  // Show only the field-blocks that match the chosen submission type.
  // Important: when nothing is chosen yet (type = ''), hide ALL conditional
  // blocks so visitors first pick a type and then see only the relevant fields.
  const refresh = () => {
    const type = typeSel?.value || '';
    blocks.forEach((block) => {
      const showFor = (block.dataset.showFor || '').split(',').map((s) => s.trim());
      // The "__none" hint is special: shown only when nothing is picked.
      const visible = showFor.includes('__none')
        ? !type
        : (!!type && showFor.includes(type));
      // Use explicit 'block' so it overrides any default `display: none`
      // inline style on the markup (which prevents a flash of all sections
      // before JS runs).
      block.style.display = visible ? 'block' : 'none';
      // Disable hidden required fields so they don't block submission
      block.querySelectorAll('input, textarea, select').forEach((el) => {
        if (el.dataset.origRequired === undefined) {
          el.dataset.origRequired = el.required ? '1' : '0';
        }
        el.required = visible && el.dataset.origRequired === '1';
        el.disabled = !visible;
      });
    });

    // Update the email subject so the office can see what kind it is
    if (subjectEl && type) {
      const map = {
        advertisement: 'Ad submission',
        news:          'Community news submission',
        tribute:       'In Memoriam tribute',
        article:       'Article / story submission',
        achievement:   'Achievement submission'
      };
      subjectEl.value = `[${map[type] || type}] from website`;
    }
  };
  typeSel?.addEventListener('change', refresh);
  refresh();

  // Helper to set status text + colour
  const setStatus = (msg, color) => {
    if (!status) return;
    status.textContent = msg;
    status.style.color = color || 'var(--muted)';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot
    const honeypot = form.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) {
      setStatus('✓ Thank you! Your submission has been received.', 'var(--navy)');
      form.reset(); refresh();
      return;
    }

    // Demo mode if access key isn't configured
    const accessKey = form.querySelector('input[name="access_key"]')?.value;
    if (!accessKey || accessKey.startsWith('YOUR-')) {
      setStatus(
        '⚠️  Form not yet configured. See CONTACT-FORM.md for the 3-step setup. (Submission was NOT sent.)',
        '#b54708'
      );
      return;
    }

    if (button) button.disabled = true;
    setStatus('Sending…', 'var(--muted)');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      let data = {};
      try { data = await response.json(); } catch (_) {}
      if (response.ok) {
        setStatus('✓ Thank you! Your submission has been received. Our editorial team will review it shortly.', 'var(--navy)');
        form.reset(); refresh();
      } else {
        throw new Error((data && data.message) || ('Server returned ' + response.status));
      }
    } catch (err) {
      console.error('[submitForm] failed:', err);
      setStatus('✗ Sorry, something went wrong. Please email info@brahmkshatriya.org with your submission.', '#c00000');
    } finally {
      if (button) button.disabled = false;
    }
  });
}

/* =============================================================
   📰  Community News (સમાચાર)
   -------------------------------------------------------------
   Renders short news items on news.html — district elections,
   awards, marriages, achievements, announcements. Sorted
   newest-first, grouped by year, with Category + City filters
   and a free-text search.
============================================================= */
function loadNews() {
  if (typeof newsData === 'undefined') return;
  const wrap = document.getElementById('news');
  if (!wrap) return;
  if (!Array.isArray(newsData) || !newsData.length) {
    wrap.innerHTML = `<div class="empty-state"><i class="fas fa-newspaper"></i> No news yet.</div>`;
    return;
  }

  const categoryFilter = document.getElementById('newsCategoryFilter');
  const cityFilter     = document.getElementById('newsCityFilter');
  const searchInput    = document.getElementById('newsSearchInput');

  // Sort newest-first; rows with bad dates sink to the bottom
  const sorted = [...newsData].sort((a, b) => {
    const da = safeDate(a.date), db = safeDate(b.date);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
  });

  // Populate filter dropdowns
  if (categoryFilter) {
    [...new Set(sorted.map((n) => n.category).filter(Boolean))].sort().forEach((c) => {
      const o = document.createElement('option'); o.value = c; o.textContent = c;
      categoryFilter.appendChild(o);
    });
  }
  if (cityFilter) {
    [...new Set(sorted.map((n) => n.city).filter(Boolean))].sort().forEach((c) => {
      const o = document.createElement('option'); o.value = c; o.textContent = c;
      cityFilter.appendChild(o);
    });
  }

  const fmtFull = (iso) => {
    const d = safeDate(iso);
    return d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  };
  const yearOf  = (iso) => { const d = safeDate(iso); return d ? d.getFullYear() : '—'; };
  const fmtDay  = (iso) => { const d = safeDate(iso); return d ? d.toLocaleDateString('en-IN', { day: '2-digit' }) : ''; };
  const fmtMon  = (iso) => { const d = safeDate(iso); return d ? d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase() : ''; };

  const corpus = (n) => [
    n.title, n.titleGu, n.summary, n.category, n.city, n.publishedIn, fmtFull(n.date)
  ].filter(Boolean).join(' • ').toLowerCase();

  const cardHTML = (n) => `
    <article class="news-card">
      <div class="news-date-badge">
        <span class="day">${fmtDay(n.date)}</span>
        <span class="month">${fmtMon(n.date)}</span>
      </div>
      <div class="news-body">
        <span class="news-category">${n.category || 'News'}</span>
        <h3>${n.title}</h3>
        ${n.titleGu ? `<div class="news-title-gu">${n.titleGu}</div>` : ''}
        <p class="news-summary">${n.summary || ''}</p>
        <div class="news-meta">
          <span><i class="fas fa-calendar"></i> ${fmtFull(n.date)}</span>
          ${n.city ? `<span><i class="fas fa-location-dot"></i> ${n.city}</span>` : ''}
          ${n.publishedIn ? `<span><i class="fas fa-book-open"></i> ${n.publishedIn}</span>` : ''}
        </div>
        ${n.link && n.link !== '#' ? `<a class="btn btn-outline" href="${n.link}" target="_blank" rel="noopener" style="margin-top:6px; padding:8px 16px; font-size:0.85rem;"><i class="fas fa-arrow-right"></i> Read more</a>` : ''}
      </div>
    </article>
  `;

  const render = () => {
    const cat = categoryFilter?.value || '';
    const cty = cityFilter?.value     || '';
    const q   = (searchInput?.value || '').toLowerCase().trim();

    const filtered = sorted.filter((n) => {
      const catOk = !cat || n.category === cat;
      const ctyOk = !cty || n.city     === cty;
      const qOk   = !q   || corpus(n).includes(q);
      return catOk && ctyOk && qOk;
    });

    if (!filtered.length) {
      wrap.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i> No news matches your filters.</div>`;
      return;
    }

    // Group by year of news date
    const grouped = filtered.reduce((acc, n) => {
      const y = yearOf(n.date);
      (acc[y] = acc[y] || []).push(n);
      return acc;
    }, {});

    wrap.innerHTML = Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => `
        <div class="news-year">
          <h2 class="news-year-head">${y}</h2>
          <div class="news-grid">${grouped[y].map(cardHTML).join('')}</div>
        </div>
      `).join('');
  };

  categoryFilter?.addEventListener('change', render);
  cityFilter?.addEventListener('change', render);
  searchInput?.addEventListener('input', render);
  render();
}

/* =============================================================
   🕯  Memorial / In Memoriam (શ્રદ્ધાંજલિ)
   -------------------------------------------------------------
   Renders tribute cards on memorial.html. Cards are sorted
   newest-first by `passedDate` and grouped by year of passing.
   A City filter and a free-text search narrow the list.
============================================================= */
function loadMemorials() {
  if (typeof memorialsData === 'undefined') return;
  const wrap = document.getElementById('memorials');
  if (!wrap) return;
  if (!Array.isArray(memorialsData) || !memorialsData.length) {
    wrap.innerHTML = `<div class="empty-state"><i class="fas fa-feather"></i> No tributes recorded yet.</div>`;
    return;
  }

  const cityFilter   = document.getElementById('memorialCityFilter');
  const searchInput  = document.getElementById('memorialSearchInput');

  // Newest-first; rows with bad/missing passedDate sink to the bottom
  const sorted = [...memorialsData].sort((a, b) => {
    const da = safeDate(a.passedDate), db = safeDate(b.passedDate);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
  });

  // Populate City filter dropdown from the data
  if (cityFilter) {
    const cities = [...new Set(sorted.map((m) => m.city).filter(Boolean))].sort();
    cities.forEach((c) => {
      const o = document.createElement('option');
      o.value = c; o.textContent = c;
      cityFilter.appendChild(o);
    });
  }

  const fmtDay = (iso) => {
    const d = safeDate(iso);
    return d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  };
  const yearOf = (iso) => {
    const d = safeDate(iso);
    return d ? d.getFullYear() : '—';
  };

  // Build the search corpus per row so editors can find by anything
  const corpus = (m) => [
    m.name, m.nameGu, m.city, m.tribute, m.publishedIn,
    fmtDay(m.bornDate), fmtDay(m.passedDate), m.family
  ].filter(Boolean).join(' • ').toLowerCase();

  const cardHTML = (m) => `
    <article class="memorial-card">
      <div class="memorial-photo">
        ${safeImg(m.photo, m.name, FALLBACK_PHOTO)}
        <span class="memorial-flame" aria-hidden="true">🕯</span>
      </div>
      <div class="memorial-body">
        <h3>${m.name}</h3>
        ${m.nameGu ? `<div class="memorial-name-gu">${m.nameGu}</div>` : ''}
        <div class="memorial-dates">
          ${m.bornDate ? `<span><i class="fas fa-circle"></i> Born ${fmtDay(m.bornDate)}</span>` : ''}
          ${m.passedDate ? `<span><i class="fas fa-cross"></i> Passed ${fmtDay(m.passedDate)}</span>` : ''}
        </div>
        ${m.city ? `<div class="memorial-city"><i class="fas fa-location-dot"></i> ${m.city}</div>` : ''}
        ${m.tribute ? `<p class="memorial-tribute">${m.tribute}</p>` : ''}
        ${m.publishedIn ? `<div class="memorial-pub"><i class="fas fa-book-open"></i> Tribute first appeared in <strong>${m.publishedIn}</strong></div>` : ''}
        ${(m.family || m.phone) ? `
          <div class="memorial-family">
            ${m.family ? `<span><i class="fas fa-users"></i> ${m.family}</span>` : ''}
            ${m.phone  ? `<a href="tel:${m.phone}" class="ad-contact-btn"><i class="fas fa-phone"></i> Condolences</a>` : ''}
          </div>` : ''}
      </div>
    </article>
  `;

  const render = () => {
    const cty = cityFilter?.value || '';
    const q   = (searchInput?.value || '').toLowerCase().trim();

    const filtered = sorted.filter((m) => {
      const cityOk = !cty || m.city === cty;
      const qOk    = !q   || corpus(m).includes(q);
      return cityOk && qOk;
    });

    if (!filtered.length) {
      wrap.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i> No tributes match your filters.</div>`;
      return;
    }

    // Group by year of passing
    const grouped = filtered.reduce((acc, m) => {
      const y = yearOf(m.passedDate);
      (acc[y] = acc[y] || []).push(m);
      return acc;
    }, {});

    wrap.innerHTML = Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) => `
        <div class="memorial-year">
          <h2 class="memorial-year-head">${y}</h2>
          <div class="memorial-grid">
            ${grouped[y].map(cardHTML).join('')}
          </div>
        </div>
      `).join('');
  };

  cityFilter?.addEventListener('change', render);
  searchInput?.addEventListener('input', render);
  render();
}

/* ---------- Ads: type tabs + category + search + contact actions ---------- */
function loadAds() {
  if (typeof adsData === 'undefined') return;
  const wrap = document.getElementById('ads');
  if (!wrap) return;

  const categoryFilter = document.getElementById('adCategoryFilter');
  const cityFilter     = document.getElementById('adCityFilter');
  const searchInput    = document.getElementById('adSearchInput');
  const tabs           = document.querySelectorAll('[data-ad-tab]');

  const today = new Date(); today.setHours(0, 0, 0, 0);

  // Drop expired ads if validUntil is in the past
  const live = adsData.filter((a) => {
    if (!a.validUntil) return true;
    return new Date(a.validUntil) >= today;
  });

  // Sort newest-first by publishedDate
  // Newest-first by publishedDate. Rows missing a date sink to the bottom.
  live.sort((a, b) => {
    const da = safeDate(a.publishedDate), db = safeDate(b.publishedDate);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
  });

  // Populate filter dropdowns
  if (categoryFilter) {
    [...new Set(live.map((a) => a.category).filter(Boolean))].sort().forEach((c) => {
      const o = document.createElement('option'); o.value = c; o.textContent = c;
      categoryFilter.appendChild(o);
    });
  }
  if (cityFilter) {
    [...new Set(live.map((a) => a.city).filter(Boolean))].sort().forEach((c) => {
      const o = document.createElement('option'); o.value = c; o.textContent = c;
      cityFilter.appendChild(o);
    });
  }

  let currentTab = 'display';

  const fmtDate = (iso) => iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const corpus = (a) => [
    a.title, a.description, a.advertiser, a.category, a.city,
    fmtDate(a.publishedDate), fmtDate(a.validUntil)
  ].filter(Boolean).join(' • ').toLowerCase();

  const displayCardHTML = (a) => `
    <article class="ad-card ad-display">
      <div class="ad-media">
        ${safeImg(a.image, a.title, FALLBACK_PHOTO)}
        <span class="ad-category">${a.category}</span>
      </div>
      <div class="ad-body">
        <h3>${a.title}</h3>
        <p class="ad-desc">${a.description || ''}</p>
        <div class="ad-meta">
          <span><i class="fas fa-user"></i> ${a.advertiser}</span>
          ${a.city ? `<span><i class="fas fa-location-dot"></i> ${a.city}</span>` : ''}
          ${a.validUntil ? `<span><i class="fas fa-calendar-day"></i> Valid till ${fmtDate(a.validUntil)}</span>` : ''}
        </div>
        ${contactRowHTML(a)}
      </div>
    </article>
  `;

  const classifiedCardHTML = (a) => `
    <article class="ad-card ad-classified">
      <div class="ad-body">
        <div class="ad-classified-head">
          <span class="ad-category">${a.category}</span>
          ${a.city ? `<span class="ad-city"><i class="fas fa-location-dot"></i> ${a.city}</span>` : ''}
        </div>
        <h3>${a.title}</h3>
        <p class="ad-desc">${a.description || ''}</p>
        <div class="ad-meta">
          <span><i class="fas fa-user"></i> ${a.advertiser}</span>
          ${a.validUntil ? `<span><i class="fas fa-calendar-day"></i> Valid till ${fmtDate(a.validUntil)}</span>` : ''}
        </div>
        ${contactRowHTML(a)}
      </div>
    </article>
  `;

  function contactRowHTML(a) {
    const c = a.contact || {};
    return `
      <div class="ad-contact">
        ${c.phone    ? `<a href="tel:${c.phone}" class="ad-contact-btn"><i class="fas fa-phone"></i> Call</a>` : ''}
        ${c.whatsapp ? `<a href="https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Hi, I saw your ad "' + a.title + '" on Brahmakshatriya Hitechchhu.')}" target="_blank" rel="noopener" class="ad-contact-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>` : ''}
        ${c.email    ? `<a href="mailto:${c.email}?subject=${encodeURIComponent('Enquiry about: ' + a.title)}" class="ad-contact-btn"><i class="fas fa-envelope"></i> Email</a>` : ''}
      </div>
    `;
  }

  const render = () => {
    const cat = categoryFilter?.value || '';
    const cty = cityFilter?.value     || '';
    const q   = (searchInput?.value || '').toLowerCase().trim();

    const filtered = live.filter((a) => {
      const tabOk = a.type === currentTab;
      const catOk = !cat || a.category === cat;
      const ctyOk = !cty || a.city === cty;
      const qOk   = !q   || corpus(a).includes(q);
      return tabOk && catOk && ctyOk && qOk;
    });

    const cardFn = currentTab === 'display' ? displayCardHTML : classifiedCardHTML;
    wrap.innerHTML = filtered.length
      ? `<div class="ad-grid ${currentTab === 'classified' ? 'is-classified' : ''}">${filtered.map(cardFn).join('')}</div>`
      : `<div class="empty-state"><i class="fas fa-search"></i> No ${currentTab} ads match your filters.</div>`;

    // Counts on tab buttons
    const dCount = live.filter((a) => a.type === 'display').length;
    const cCount = live.filter((a) => a.type === 'classified').length;
    const dEl = document.querySelector('[data-ad-tab="display"] .count');
    const cEl = document.querySelector('[data-ad-tab="classified"] .count');
    if (dEl) dEl.textContent = dCount;
    if (cEl) cEl.textContent = cCount;
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.adTab;
      render();
    });
  });
  categoryFilter?.addEventListener('change', render);
  cityFilter?.addEventListener('change', render);
  searchInput?.addEventListener('input', render);

  render();
}

/* =============================================================
   📬  Contact form
   -------------------------------------------------------------
   Submits via fetch() to whatever URL the form's `action`
   attribute points to (Web3Forms by default — see contact.html
   and CONTACT-FORM.md).

   Behaviour:
     • Disables the submit button while the request is in flight
     • Shows a "Sending…" status, then "Thank you" or an error
     • Falls back to a friendly demo message if the access key
       hasn't been configured yet (so you can test the UI before
       wiring Web3Forms)
     • Honours the honeypot — if a bot ticks the hidden checkbox,
       the form silently "succeeds" without sending anything
============================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = form.querySelector('[data-status]');
  const button = form.querySelector('button[type="submit"]');

  // Helper to set status text + colour
  const setStatus = (msg, color) => {
    if (!status) return;
    status.textContent = msg;
    status.style.color = color || 'var(--muted)';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot — bots fill every field, including hidden ones
    const honeypot = form.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) {
      setStatus('✓ Thank you! Your message has been received.', 'var(--navy)');
      form.reset();
      return;
    }

    // Detect "demo mode": access key still has the placeholder value
    const accessKey = form.querySelector('input[name="access_key"]')?.value;
    if (!accessKey || accessKey.startsWith('YOUR-')) {
      setStatus(
        '⚠️  Form not yet configured. See CONTACT-FORM.md for the 3-step setup. (Submission was NOT sent.)',
        '#b54708'
      );
      return;
    }

    if (button) button.disabled = true;
    setStatus('Sending…', 'var(--muted)');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      let data = {};
      try { data = await response.json(); } catch (_) { /* not JSON, that's ok */ }

      if (response.ok) {
        setStatus('✓ Thank you! Your message has been received. We will reply soon.', 'var(--navy)');
        form.reset();
      } else {
        const msg = (data && data.message) || ('Server returned ' + response.status);
        throw new Error(msg);
      }
    } catch (err) {
      console.error('[contactForm] submission failed:', err);
      setStatus(
        '✗ Sorry, something went wrong. Please email us directly at info@brahmkshatriya.org',
        '#c00000'
      );
    } finally {
      if (button) button.disabled = false;
    }
  });
}

/* ---------- SEO: inject JSON-LD structured data dynamically ---------- */
const SITE_BASE = 'https://brahmakshatriyahitechchhu.org';

function injectJsonLd(id, data) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = id;
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function injectEventStructuredData() {
  if (typeof eventsData === 'undefined' || !eventsData.length) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const items = eventsData.map((e) => {
    const isPast = new Date(e.date) < today;
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": e.title,
      "startDate": e.date,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": e.venue || e.city,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": e.city || '',
          "addressCountry": "IN",
          "streetAddress": e.venue || ''
        }
      },
      "image": e.image ? [e.image] : undefined,
      "description": e.details || e.description || '',
      "url": `${SITE_BASE}/events.html#event-${slugify(e.title)}`,
      "organizer": {
        "@type": "NGO",
        "name": "Brahmakshatriya Hitechchhu Trust",
        "url": SITE_BASE + '/'
      },
      "isAccessibleForFree": true,
      "performer": { "@type": "Organization", "name": "Brahmakshatriya Hitechchhu Trust" }
    };
  });

  injectJsonLd('jsonld-events', { "@context": "https://schema.org", "@graph": items });
}

function injectTrusteesStructuredData() {
  if (typeof trusteesData === 'undefined' || !trusteesData.length) return;
  injectJsonLd('jsonld-trustees', {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Trustees of Brahmakshatriya Hitechchhu Trust",
    "itemListElement": trusteesData.map((t, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Person",
        "name": t.name,
        "jobTitle": t.designation,
        "image": t.image,
        "telephone": t.phone,
        "email": t.email,
        "worksFor": { "@type": "NGO", "name": "Brahmakshatriya Hitechchhu Trust" }
      }
    }))
  });
}

function injectNetworkStructuredData() {
  if (typeof networkData === 'undefined' || !networkData.length) return;
  injectJsonLd('jsonld-network', {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Brahmakshatriya Community Network — regional contacts",
    "itemListElement": networkData.map((n, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Place",
        "name": `${n.contactPerson} — ${n.city} chapter`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": n.address,
          "addressLocality": n.city,
          "addressRegion": n.state,
          "addressCountry": "IN"
        },
        "telephone": n.mobile
      }
    }))
  });
}

/* =============================================================
   📊  Home page: number highlights ("By the numbers" band)
   -------------------------------------------------------------
   Auto-computes the dynamic stats so they never go stale:
     • Years of publishing  =  current year − founded year
     • Editions published   =  count of rows in editionsData
   The founded year is read from the section's data-founded
   attribute so editors can change it in one place (the HTML).
   The "Community members" tile is plain HTML — edit the number
   directly in index.html when membership changes.
============================================================= */
function loadStats() {
  // No-op when this page doesn't have the stats band (about, ads, …)
  const section = document.querySelector('.stats-section');
  if (!section) return;

  // Years of publishing — read founded year from data-founded (default 1976)
  const founded = parseInt(section.dataset.founded, 10) || 1976;
  const years   = Math.max(0, new Date().getFullYear() - founded);
  const yearsEl = section.querySelector('[data-stat="years"]');
  if (yearsEl) yearsEl.innerHTML = years + '<span class="stat-plus">+</span>';

  // Editions published — use the HIGHEST editionNo across all rows
  // (since edition numbers are continuous across the entire history).
  // Falls back to the row count if no editionNo is set anywhere.
  const editionsEl = section.querySelector('[data-stat="editions"]');
  if (editionsEl && typeof editionsData !== 'undefined' && Array.isArray(editionsData)) {
    const numbered = editionsData
      .map((e) => Number(e.editionNo))
      .filter((n) => Number.isFinite(n));
    const total = numbered.length ? Math.max(...numbered) : editionsData.length;
    editionsEl.innerHTML = total + '<span class="stat-plus">+</span>';
  }
}

/* ---------- Footer year ---------- */
function setFooterYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

/* =============================================================
   🚀  Bootstrap — runs once the DOM is parsed.
   Each call is wrapped in `safely()` so a runtime error in one
   loader (e.g. a malformed event row) can't break the others.
============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  safely('initNav',           initNav);
  safely('setFooterYear',     setFooterYear);
  safely('loadEditions',      loadEditions);
  safely('loadStats',         loadStats);
  safely('loadTrustees',      loadTrustees);
  safely('loadNetwork',       loadNetwork);
  safely('loadEvents',        loadEvents);
  safely('loadAds',           loadAds);
  safely('loadMemorials',     loadMemorials);
  safely('loadNews',          loadNews);
  safely('initContactForm',   initContactForm);
  safely('initSubmitForm',    initSubmitForm);

  // SEO: emit JSON-LD for any data sets present on this page.
  // Each injector is also self-guarded — it only emits markup
  // when the matching data file is loaded.
  safely('injectEventStructuredData',    injectEventStructuredData);
  safely('injectTrusteesStructuredData', injectTrusteesStructuredData);
  safely('injectNetworkStructuredData',  injectNetworkStructuredData);
});
