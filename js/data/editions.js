/* ============================================================
   Brahmakshatriya Hitechchhu - Monthly Editions
   ============================================================

   📋 HOW TO ADD A NEW EDITION
   --------------------------------------------------------------
     1. In Excel / Google Sheets, type ONE row with the columns
        listed below (in the same order).
     2. Copy that row (Cmd-C / Ctrl-C).
     3. Open this file in any text editor.
     4. Paste the row at the bottom of the table - just before
        the closing backtick (`).
     5. Save. Done. The home page picks it up automatically.

   📐 COLUMN ORDER (must match the header row exactly)
   --------------------------------------------------------------
     year       → calendar year (4-digit). Used to GROUP cards on
                  the archive page.
     date       → issue date in YYYY-MM-DD. Drives sort order and
                  picks the newest as the "Current Edition" hero.
     title      → display title shown on the card (e.g. "May 2026")
     volume     → display label combining publication year + issue,
                  formatted as "Year NN, Issue MM".
                  • Publication year (NN) starts at 1 in May 1976,
                    so May 2026 is Year 51.
                  • Issue (MM) is 1-12 within each publication
                    year, starting in May.
                  • The publication year rolls over every May.
     editionNo  → continuous edition number across the entire
                  history of the magazine. Just add 1 to whatever
                  the previous month was. Example: April 2026 = 608,
                  May 2026 = 609, June 2026 = 610.
     cover      → cover thumbnail URL (relative or absolute)
                  e.g. /editions/May-2026/files/thumb/1.png
     link       → full-issue URL - convention matches your folder
                  layout on the server:
                    /editions/<MonthShort>-<Year>/
                  where MonthShort is the 3-letter abbreviation,
                  EXCEPT for May / June / July which stay full.
                  e.g. /editions/May-2026/
                       /editions/Jan-2025/
                       /editions/June-2025/

   📊 ANCHOR (so editors can verify their numbers)
   --------------------------------------------------------------
     May 2026 = Year 51, Issue 1, Edition #609

     From there, every month adds 1 to editionNo.
     Issue rolls 1→12 within a publication year and resets every May.
     Publication year (Year 51, 52, …) increments every May.

   ⚠️  URLs are case-sensitive on most servers, so keep the
       capitalised first letter exactly as the folder is named.

   📅 SCHEDULED PUBLISHING (set-and-forget)
   --------------------------------------------------------------
     • An edition goes LIVE on the LAST DAY of its cover month.
       So you can paste next month's row in advance and it stays
       hidden until then - no need to edit anything on the day.
       Example: a row dated 2026-06-15 (June 2026) appears as the
       Current Edition automatically on 30 June 2026. Until then
       the previous live edition stays "current", and the new row
       is hidden from the archive and the "Editions Published" count.
     • Tip: the day-of-month in `date` doesn't matter for this -
       only the month/year decides the go-live day (month-end).

   ✨ AUTOMATIC FEATURES (handled by the .map() at the bottom)
   --------------------------------------------------------------
     • The newest LIVE row (by `date`) automatically becomes the
       "Current Edition" hero on the home page (see scheduling above).
     • Past editions are grouped by `year` in the archive.
     • The "Editions Published" stat on the home page reads the
       highest editionNo in this table - so it's always correct.
     • If you leave `link` blank, it's auto-derived from `title`
       using the convention above.
     • If you leave `cover` blank, the card shows a navy SVG
       placeholder so the layout doesn't break.

   ✏️  SECTION MARKERS
   --------------------------------------------------------------
     Lines starting with `#` are comments - the parser ignores
     them. Use `# === Year 2026 ===` style headers to organise
     the table by year.
============================================================ */

const editionsData = parseTSV(`
year	date	title	volume	editionNo	cover	link
# === Year 2024 ===
2024	2024-09-15	September 2024	Year 49, Issue 5	589	/editions/Sep-2024/files/thumb/1.jpg	/editions/Sep-2024/

# === Year 2025 ===
2025	2025-01-15	January 2025	Year 49, Issue 9	593	/editions/Jan-2025/files/thumb/1.jpg	/editions/Jan-2025/
2025	2025-03-15	March 2025	Year 49, Issue 11	595	/editions/Mar-2025/files/thumb/1.jpg	/editions/Mar-2025/
2025	2025-06-15	June 2025	Year 50, Issue 2	598	/editions/June-2025/files/thumb/1.jpg	/editions/June-2025/
2025	2025-07-15	July 2025	Year 50, Issue 3	599	/editions/July-2025/files/thumb/1.jpg	/editions/July-2025/
2025	2025-08-15	August 2025	Year 50, Issue 4	600	/editions/Aug-2025/files/thumb/1.jpg	/editions/Aug-2025/
2025	2025-09-15	September 2025	Year 50, Issue 5	601	/editions/Sep-2025/files/thumb/1.jpg	/editions/Sep-2025/
2025	2025-10-15	October 2025	Year 50, Issue 6	602	/editions/Oct-2025/files/thumb/1.jpg	/editions/Oct-2025/
2025	2025-11-15	November 2025	Year 50, Issue 7	603	/editions/Nov-2025/files/thumb/1.jpg	/editions/Nov-2025/
2025	2025-12-15	December 2025	Year 50, Issue 8	604	/editions/Dec-2025/files/thumb/1.jpg	/editions/Dec-2025/

# === Year 2026 ===
2026	2026-01-15	January 2026	Year 50, Issue 9	605	/editions/Jan-2026/files/thumb/1.png	/editions/Jan-2026/
2026	2026-02-15	February 2026	Year 50, Issue 10	606	/editions/Feb-2026/files/thumb/1.png	/editions/Feb-2026/
2026	2026-03-15	March 2026	Year 50, Issue 11	607	/editions/Mar-2026/files/thumb/1.png	/editions/Mar-2026/
2026	2026-04-15	April 2026	Year 50, Issue 12	608	/editions/Apr-2026/files/thumb/1.png	/editions/Apr-2026/
2026	2026-05-15	May 2026	Year 51, Issue 1	609	/editions/May-2026/files/thumb/1.png	/editions/May-2026/
2026	2026-06-15	June 2026	Year 51, Issue 2	610	/editions/Jun-2026/files/thumb/1.png	/editions/Jun-2026/

# Add new editions below this line, keeping the same column order.
# Tip: copy a row above, paste below, then change the values.
# Remember: editionNo continues counting upward (next is 610, 611, …)
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
    May:      'May',     // already 3 letters - kept as is
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
    ...e,                                                 // keep every parsed field
    year:      Number(e.year),                            // coerce "2025" → 2025
    editionNo: e.editionNo ? Number(e.editionNo) : null,  // coerce "609" → 609 (or null)
    link:      (e.link && e.link !== '#') ? e.link : derive() // auto-derive if blank
  };
});
