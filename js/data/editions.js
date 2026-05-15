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
2024	2025-05-15	September 2024	Vol. 47, Issue 5	https://placehold.co/300x400/1a2a4f/c9a55a?text=Sep+2024	/editions/Sep-2024/
2025	2025-05-01	May 2025	Vol. 47, Issue 5	https://placehold.co/300x400/1a2a4f/c9a55a?text=May+2025	/editions/May-2025/
2025	2025-04-01	April 2025	Vol. 47, Issue 4	https://placehold.co/300x400/1a2a4f/c9a55a?text=Apr+2025	/editions/Apr-2025/
2025	2025-03-01	March 2025	Vol. 47, Issue 3	https://placehold.co/300x400/1a2a4f/c9a55a?text=Mar+2025	/editions/Mar-2025/
2025	2025-02-01	February 2025	Vol. 47, Issue 2	https://placehold.co/300x400/1a2a4f/c9a55a?text=Feb+2025	/editions/Feb-2025/
2025	2025-01-01	January 2025	Vol. 47, Issue 1	https://placehold.co/300x400/1a2a4f/c9a55a?text=Jan+2025	/editions/Jan-2025/
2024	2024-12-01	December 2024	Vol. 46, Issue 12	https://placehold.co/300x400/1a2a4f/c9a55a?text=Dec+2024	/editions/Dec-2024/
2024	2024-11-01	November 2024	Vol. 46, Issue 11	https://placehold.co/300x400/1a2a4f/c9a55a?text=Nov+2024	/editions/Nov-2024/
2024	2024-10-01	October 2024	Vol. 46, Issue 10	https://placehold.co/300x400/1a2a4f/c9a55a?text=Oct+2024	/editions/Oct-2024/
2024	2024-09-01	September 2024	Vol. 46, Issue 9	https://placehold.co/300x400/1a2a4f/c9a55a?text=Sep+2024	/editions/Sep-2024/
2024	2024-08-01	August 2024	Vol. 46, Issue 8	https://placehold.co/300x400/1a2a4f/c9a55a?text=Aug+2024	/editions/Aug-2024/
2024	2024-07-01	July 2024	Vol. 46, Issue 7	https://placehold.co/300x400/1a2a4f/c9a55a?text=Jul+2024	/editions/July-2024/
2024	2024-06-01	June 2024	Vol. 46, Issue 6	https://placehold.co/300x400/1a2a4f/c9a55a?text=Jun+2024	/editions/June-2024/
2023	2023-12-01	December 2023	Vol. 45, Issue 12	https://placehold.co/300x400/1a2a4f/c9a55a?text=Dec+2023	/editions/Dec-2023/
2023	2023-09-01	September 2023	Vol. 45, Issue 9	https://placehold.co/300x400/1a2a4f/c9a55a?text=Sep+2023	/editions/Sep-2023/
2023	2023-06-01	June 2023	Vol. 45, Issue 6	https://placehold.co/300x400/1a2a4f/c9a55a?text=Jun+2023	/editions/June-2023/
2023	2023-03-01	March 2023	Vol. 45, Issue 3	https://placehold.co/300x400/1a2a4f/c9a55a?text=Mar+2023	/editions/Mar-2023/
2022	2022-11-01	November 2022	Vol. 44, Issue 11	https://placehold.co/300x400/1a2a4f/c9a55a?text=Nov+2022	/editions/Nov-2022/
2022	2022-05-01	May 2022	Vol. 44, Issue 5	https://placehold.co/300x400/1a2a4f/c9a55a?text=May+2022	/editions/May-2022/
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
