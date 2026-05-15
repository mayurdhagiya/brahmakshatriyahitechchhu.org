/* ============================================================
   Brahmakshatriya Hitechchhu - In Memoriam (શ્રદ્ધાંજલિ)

   Each row is one tribute to a community member who has
   passed away. The page lists them newest-first and groups
   them by year of passing.

   📐 COLUMN ORDER (must match the header row exactly)
     name         → English (transliterated) name
     nameGu       → Gujarati name
     bornDate     → YYYY-MM-DD birth date (optional)
     passedDate   → YYYY-MM-DD date of passing
     city         → City (used by the City filter)
     photo        → Square portrait URL - leave blank for placeholder
     tribute      → Short tribute text (one or two lines)
     publishedIn  → Edition the tribute first appeared in,
                    e.g. "Year 51, Issue 1 · #609"
     family       → Family contact name (optional)
     phone        → Family contact phone for condolences (optional)

   ✏️  Tip: leave any optional cell blank to hide that detail.
============================================================ */

const memorialsData = parseTSV(`
name	nameGu	bornDate	passedDate	city	photo	tribute	publishedIn	family	phone
# === Sample tribute placeholders - replace with the actual names from each edition ===
Pragnachandra Harilal Ramji Pursev	પ્રજ્ઞાચંદ્ર હરીલાલ રામજી પુરસેવ	1942-08-12	2026-04-08	Ahmedabad	https://placehold.co/300x300/1a2a4f/c9a55a?text=PR	A pillar of the community - generous in spirit and unwavering in service. Featured on the May 2026 cover.	Year 51, Issue 1 · #609	Pursev Family	+919876500099
Shantilal Maganlal Bhatt	શાંતિલાલ મગનલાલ ભટ્ટ	1938-06-21	2026-03-22	Mumbai	https://placehold.co/300x300/0f1c3a/c9a55a?text=SB	Long-time supporter of the trust and the magazine; remembered for his warm hospitality.	Year 50, Issue 12 · #608	Bhatt Family	+919812340000
Hasmukh Pravinchandra Bosamia	હસમુખ પ્રવિણચંદ્ર બોસમીઆ	1945-11-04	2026-02-15	Surat	https://placehold.co/300x300/c9a55a/1a2a4f?text=HB	Devoted family man and community elder - sadly missed by all who knew him.	Year 50, Issue 11 · #607
Indumati Rasiklal Joshi	ઇન્દુમતી રસિકલાલ જોશી	1949-03-30	2026-01-02	Vadodara	https://placehold.co/300x300/2b2b2b/c9a55a?text=IJ	A guiding light to the women's wing of the community for over four decades.	Year 50, Issue 10 · #606	Joshi Family	+919979988877
`).map((m) => ({
  ...m,
  // Convert empty strings to null so the renderer can cleanly check
  bornDate:   m.bornDate   || null,
  passedDate: m.passedDate || null,
  family:     m.family     || '',
  phone:      m.phone      || ''
}));
