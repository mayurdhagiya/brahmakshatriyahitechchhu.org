/* ============================================================
   Brahmakshatriya Hitechchhu — Monthly Editions
   ============================================================

   📋 HOW TO ADD A NEW EDITION
   --------------------------------------------------------------
     1. In Excel / Google Sheets, type ONE row with the columns
        listed below (in the same order).
     2. Copy that row (Cmd-C / Ctrl-C).
     3. Open this file in any text editor.
     4. Paste the row at the bottom of the table — just before
        the closing backtick (`).
     5. Save. Done. The home page picks it up automatically.

   📐 COLUMN ORDER (must match the header row exactly)
   --------------------------------------------------------------
     year      → publication year (4-digit number)
     date      → issue date in YYYY-MM-DD (drives sort order)
     title     → display title shown on the card (e.g. "May 2026")
     volume    → volume / issue label (e.g. "Vol. 51, Issue 1")
     cover     → cover thumbnail URL — relative or absolute
                 e.g. /editions/May-2026/files/thumb/1.png
     link      → full-issue URL — convention matches your folder
                 layout on the server:
                   /editions/<MonthShort>-<Year>/
                 where MonthShort is the 3-letter abbreviation,
                 EXCEPT for May / June / July which stay full.
                 e.g. /editions/May-2026/
                      /editions/Jan-2025/
                      /editions/June-2025/

   ⚠️  URLs are case-sensitive on most servers, so keep the
       capitalised first letter exactly as the folder is named.

   ✨ AUTOMATIC FEATURES (handled by the .map() at the bottom)
   --------------------------------------------------------------
     • The newest row (by `date`) automatically becomes the
       "Current Edition" hero on the home page.
     • Past editions are grouped by `year` in the archive.
     • If you leave `link` blank, it's auto-derived from `title`
       using the convention above (e.g. "May 2025" →
       /editions/May-2025/).
     • If you leave `cover` blank, the card shows a navy SVG
       placeholder so the layout doesn't break.

   ✏️  SECTION MARKERS
   --------------------------------------------------------------
     Lines starting with `#` are comments — the parser ignores
     them. Use `# === Year 2026 ===` style headers to organise
     the table by year. Editors can scroll to the right block
     instantly.
============================================================ */

const editionsData = parseTSV(`
year	date	title	volume	cover	link
# === Year 2024 ===
2024	2024-09-15	September 2024	Vol. 49, Issue 5	/editions/Sep-2024/files/thumb/1.jpg	/editions/Sep-2024/

# === Year 2025 ===
2025	2025-01-15	January 2025	Vol. 49, Issue 9	/editions/Jan-2025/files/thumb/1.jpg	/editions/Jan-2025/
2025	2025-03-15	March 2025	Vol. 49, Issue 11	/editions/Mar-2025/files/thumb/1.jpg	/editions/Mar-2025/
2025	2025-06-15	June 2025	Vol. 50, Issue 2	/editions/June-2025/files/thumb/1.jpg	/editions/June-2025/
2025	2025-07-15	July 2025	Vol. 50, Issue 3	/editions/July-2025/files/thumb/1.jpg	/editions/July-2025/
2025	2025-08-15	August 2025	Vol. 50, Issue 4	/editions/Aug-2025/files/thumb/1.jpg	/editions/Aug-2025/
2025	2025-09-15	September 2025	Vol. 50, Issue 5	/editions/Sep-2025/files/thumb/1.jpg	/editions/Sep-2025/
2025	2025-10-15	October 2025	Vol. 50, Issue 6	/editions/Oct-2025/files/thumb/1.jpg	/editions/Oct-2025/
2025	2025-11-15	November 2025	Vol. 50, Issue 7	/editions/Nov-2025/files/thumb/1.jpg	/editions/Nov-2025/
2025	2025-12-15	December 2025	Vol. 50, Issue 8	/editions/Dec-2025/files/thumb/1.jpg	/editions/Dec-2025/

# === Year 2026 ===
2026	2026-01-15	January 2026	Vol. 50, Issue 9	/editions/Jan-2026/files/thumb/1.png	/editions/Jan-2026/
2026	2026-02-15	February 2026	Vol. 50, Issue 10	/editions/Feb-2026/files/thumb/1.png	/editions/Feb-2026/
2026	2026-03-15	March 2026	Vol. 50, Issue 11	/editions/Mar-2026/files/thumb/1.png	/editions/Mar-2026/
2026	2026-04-15	April 2026	Vol. 50, Issue 12	/editions/Apr-2026/files/thumb/1.png	/editions/Apr-2026/
2026	2026-05-15	May 2026	Vol. 51, Issue 1	/editions/May-2026/files/thumb/1.png	/editions/May-2026/

# Add new editions below this line, keeping the same column order.
# Tip: copy a row above, paste below, then change the values.
`).map((e) => {
  /* ----------------------------------------------------------
     Post-processing for every row coming out of parseTSV().
     Keeps the data table above clean (just a spreadsheet)
     while still building proper JS objects for the renderer.
  ---------------------------------------------------------- */

  // Map full month names → folder-name form. May/June/July stay
  // full (no good 3-letter abbreviation). Used only by derive()
  // when an editor leaves the `link` cell blank.
  const SHORT = {
    January:  'Jan',
    February: 'Feb',
    March:    'Mar',
    April:    'Apr',
    May:      'May',     // already 3 letters — kept as is
    June:     'June',    // editors prefer the full word
    July:     'July',    // editors prefer the full word
    August:   'Aug',
    September:'Sep',
    October:  'Oct',
    November: 'Nov',
    December: 'Dec'
  };

  /**
   * Build a /editions/<MonthShort>-<Year>/ URL from the title.
   * Falls back to a slug of the title if it doesn't match the
   * expected "Month YYYY" pattern.
   */
  const derive = () => {
    const m = (e.title || '').trim().match(/^(\w+)\s+(\d{4})$/);
    if (!m) return `/editions/${(e.title || '').replace(/\s+/g, '-')}/`;
    return `/editions/${SHORT[m[1]] || m[1]}-${m[2]}/`;
  };

  // Return the cleaned-up edition object the renderer expects.
  return {
    ...e,                                            // keep every parsed field
    year: Number(e.year),                            // coerce "2025" → 2025
    link: (e.link && e.link !== '#') ? e.link : derive() // auto-derive if blank
  };
});
