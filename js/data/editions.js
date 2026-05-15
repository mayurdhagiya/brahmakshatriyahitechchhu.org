/* ============================================================
   Brahmakshatriya Hitechchhu — Monthly Editions

   Edit by pasting tab-separated rows from Excel directly into the
   table below. Header row defines the columns — keep them in this
   exact order:

     year      — the publication year (number)
     date      — issue date in YYYY-MM-DD format
     title     — display title (e.g. "May 2025")
     volume    — volume / issue label (e.g. "Vol. 47, Issue 5")
     cover     — cover image URL (300×400 looks best)
     link      — full-issue URL. Convention matches your folder
                 structure on the server:
                   /editions/<MonthShort>-<Year>/
                 where MonthShort is the 3-letter abbreviation,
                 EXCEPT for May / June / July which stay full.
                 e.g. /editions/May-2026/
                      /editions/Jan-2025/
                      /editions/June-2025/
                 NOTE: URLs are case-sensitive on most servers, so
                 keep the capitalised first letter exactly as below.

   The newest edition (by date) automatically becomes the "Current
   Edition" on the home page.

   Tip: if you leave `link` blank, the parser will auto-derive it
   from the title using the same convention.
============================================================ */

const editionsData = parseTSV(`
year	date	title	volume	cover	link
2024	2024-09-15	September 2024	Vol. 49, Issue 5	/editions/Sep-2024/files/thumb/1.jpg	/editions/Sep-2024/
2025	2025-01-15	January 2025	Vol. 49, Issue 9	/editions/Jan-2025/files/thumb/1.jpg	/editions/Jan-2025/
2025	2025-03-15	March 2025	Vol. 49, Issue 11	/editions/Mar-2025/files/thumb/1.jpg	/editions/Mar-2025/
2025	2025-06-15	June 2025	Vol. 50, Issue 2	/editions/June-2025/files/thumb/1.jpg	/editions/June-2025/
2025	2025-07-15	July 2025	Vol. 50, Issue 3	/editions/July-2025/files/thumb/1.jpg	/editions/July-2025/
2025	2025-08-15	August 2025	Vol. 50, Issue 4	/editions/Aug-2025/files/thumb/1.jpg	/editions/Aug-2025/
2025	2025-09-15	September 2025	Vol. 50, Issue 5	/editions/Sep-2025/files/thumb/1.jpg	/editions/Sep-2025/
2025	2025-10-15	October 2025	Vol. 50, Issue 6	/editions/Oct-2025/files/thumb/1.jpg	/editions/Oct-2025/
2025	2025-11-15	November 2025	Vol. 50, Issue 7	/editions/Nov-2025/files/thumb/1.jpg	/editions/Nov-2025/
2025	2025-12-15	December 2025	Vol. 50, Issue 8	/editions/Dec-2025/files/thumb/1.jpg	/editions/Dec-2025/
2026	2026-01-15	January 2026	Vol. 50, Issue 9	/editions/Jan-2026/files/thumb/1.png	/editions/Jan-2026/
2026	2026-02-15	February 2026	Vol. 50, Issue 10	/editions/Feb-2026/files/thumb/1.png	/editions/Feb-2026/
2026	2026-03-15	March 2026	Vol. 50, Issue 11	/editions/Mar-2026/files/thumb/1.png	/editions/Mar-2026/
2026	2026-04-15	April 2026	Vol. 50, Issue 12	/editions/Apr-2026/files/thumb/1.png	/editions/Apr-2026/
2026	2026-05-15	May 2026	Vol. 51, Issue 1	/editions/May-2026/files/thumb/1.png	/editions/May-2026/
`).map((e) => {
  // Map full month names → folder-name form. May/June/July stay full.
  const SHORT = {
    January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr',
    May: 'May', June: 'June', July: 'July', August: 'Aug',
    September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec'
  };
  const derive = () => {
    const m = (e.title || '').trim().match(/^(\w+)\s+(\d{4})$/);
    if (!m) return `/editions/${(e.title || '').replace(/\s+/g, '-')}/`;
    return `/editions/${SHORT[m[1]] || m[1]}-${m[2]}/`;
  };
  return {
    ...e,
    year: Number(e.year),
    link: (e.link && e.link !== '#') ? e.link : derive()
  };
});
