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
     link      — link to the full issue PDF / page (use # for none)

   The newest edition (by date) automatically becomes the "Current
   Edition" on the home page.
============================================================ */

const editionsData = parseTSV(`
year	date	title	volume	cover	link
2025	2025-05-01	May 2025	Vol. 47, Issue 5	https://placehold.co/300x400/1a2a4f/c9a55a?text=May+2025	#
2025	2025-04-01	April 2025	Vol. 47, Issue 4	https://placehold.co/300x400/1a2a4f/c9a55a?text=Apr+2025	#
2025	2025-03-01	March 2025	Vol. 47, Issue 3	https://placehold.co/300x400/1a2a4f/c9a55a?text=Mar+2025	#
2025	2025-02-01	February 2025	Vol. 47, Issue 2	https://placehold.co/300x400/1a2a4f/c9a55a?text=Feb+2025	#
2025	2025-01-01	January 2025	Vol. 47, Issue 1	https://placehold.co/300x400/1a2a4f/c9a55a?text=Jan+2025	#
2024	2024-12-01	December 2024	Vol. 46, Issue 12	https://placehold.co/300x400/1a2a4f/c9a55a?text=Dec+2024	#
2024	2024-11-01	November 2024	Vol. 46, Issue 11	https://placehold.co/300x400/1a2a4f/c9a55a?text=Nov+2024	#
2024	2024-10-01	October 2024	Vol. 46, Issue 10	https://placehold.co/300x400/1a2a4f/c9a55a?text=Oct+2024	#
2024	2024-09-01	September 2024	Vol. 46, Issue 9	https://placehold.co/300x400/1a2a4f/c9a55a?text=Sep+2024	#
2024	2024-08-01	August 2024	Vol. 46, Issue 8	https://placehold.co/300x400/1a2a4f/c9a55a?text=Aug+2024	#
2024	2024-07-01	July 2024	Vol. 46, Issue 7	https://placehold.co/300x400/1a2a4f/c9a55a?text=Jul+2024	#
2024	2024-06-01	June 2024	Vol. 46, Issue 6	https://placehold.co/300x400/1a2a4f/c9a55a?text=Jun+2024	#
2023	2023-12-01	December 2023	Vol. 45, Issue 12	https://placehold.co/300x400/1a2a4f/c9a55a?text=Dec+2023	#
2023	2023-09-01	September 2023	Vol. 45, Issue 9	https://placehold.co/300x400/1a2a4f/c9a55a?text=Sep+2023	#
2023	2023-06-01	June 2023	Vol. 45, Issue 6	https://placehold.co/300x400/1a2a4f/c9a55a?text=Jun+2023	#
2023	2023-03-01	March 2023	Vol. 45, Issue 3	https://placehold.co/300x400/1a2a4f/c9a55a?text=Mar+2023	#
2022	2022-11-01	November 2022	Vol. 44, Issue 11	https://placehold.co/300x400/1a2a4f/c9a55a?text=Nov+2022	#
2022	2022-05-01	May 2022	Vol. 44, Issue 5	https://placehold.co/300x400/1a2a4f/c9a55a?text=May+2022	#
`).map((e) => ({ ...e, year: Number(e.year) }));
