/* ============================================================
   Brahmakshatriya Hitechchhu — App Logic
   Mobile nav, edition loader, trustee loader, network filter
============================================================ */

/* ---------- Mobile navigation toggle ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
}

/* ---------- Helpers ---------- */
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

/* ---------- Home: current edition + past editions grouped by year ---------- */
function loadEditions() {
  if (typeof editionsData === 'undefined') return;

  const sorted = [...editionsData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const current = sorted[0];
  const rest = sorted.slice(1);

  // Hero / current
  const heroCover  = document.querySelector('[data-current-cover]');
  const heroTitle  = document.querySelector('[data-current-title]');
  const heroVolume = document.querySelector('[data-current-volume]');
  const heroLink   = document.querySelector('[data-current-link]');

  if (current && heroCover)  heroCover.src = current.cover;
  if (current && heroTitle)  heroTitle.textContent  = current.title;
  if (current && heroVolume) heroVolume.textContent = current.volume;
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

  const cardHTML = (ed) => `
    <div class="edition-card">
      <div class="cover"><img src="${ed.cover}" alt="${ed.title} cover" loading="lazy"></div>
      <h4 class="title">${ed.title}</h4>
      <p class="date">${ed.volume}</p>
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

  // Define preferred ordering of designations; anything else falls to the end
  const order = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Trustee'];
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
    group.innerHTML = `
      <h3 class="designation-title">${designation}</h3>
      <div class="trustee-grid"></div>
    `;
    const grid = group.querySelector('.trustee-grid');
    grouped[designation].forEach((t) => {
      const card = document.createElement('article');
      card.className = 'trustee-card';
      const social = t.social || {};
      card.innerHTML = `
        <div class="trustee-photo"><img src="${t.image}" alt="${t.name}" loading="lazy"></div>
        <h4>${t.name}</h4>
        <div class="role">${t.designation}</div>
        <p class="bio">${t.bio || ''}</p>
        <div class="trustee-actions">
          ${t.phone    ? `<a href="tel:${t.phone}" title="Call ${t.name}"><i class="fas fa-phone"></i></a>` : ''}
          ${t.whatsapp ? `<a href="https://wa.me/${t.whatsapp}" target="_blank" rel="noopener" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
          ${t.email    ? `<a href="mailto:${t.email}" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
          ${social.facebook ? `<a href="${social.facebook}" target="_blank" rel="noopener" title="Facebook"><i class="fab fa-facebook-f"></i></a>` : ''}
          ${social.twitter  ? `<a href="${social.twitter}"  target="_blank" rel="noopener" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
          ${social.linkedin ? `<a href="${social.linkedin}" target="_blank" rel="noopener" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
        </div>
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
  img.src = item.src;
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
              <img src="${g.src}" alt="${g.caption || 'Photo ' + (i + 1)}" loading="lazy" />
            </button>
            ${g.caption ? `<figcaption>${g.caption}</figcaption>` : ''}
          </figure>
        `).join('')}
      </div>
    </section>
  ` : '';

  body.innerHTML = `
    <div class="event-modal-hero">
      <img src="${ev.image}" alt="${ev.title}" />
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
  const sorted = [...eventsData].sort((a, b) => new Date(b.date) - new Date(a.date));

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
        <img src="${e.image}" alt="${e.title}" loading="lazy" />
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

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('[data-status]');
    if (status) {
      status.textContent = 'Thank you! Your message has been received.';
      status.style.color = 'var(--navy)';
    }
    form.reset();
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

/* ---------- Footer year ---------- */
function setFooterYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setFooterYear();
  loadEditions();
  loadTrustees();
  loadNetwork();
  loadEvents();
  initContactForm();

  // SEO: emit JSON-LD for any data sets present on this page
  injectEventStructuredData();
  injectTrusteesStructuredData();
  injectNetworkStructuredData();
});
