/* ============================================================
   Brahmakshatriya Hitechchhu - Community News (સમાચાર)

   Edit by pasting tab-separated rows from Excel directly into
   the table below. The page automatically:
     • Sorts newest-first by `date`
     • Builds Year + Category dropdown filters
     • Lets visitors search across every detail
     • Groups items by year of publication

   📐 COLUMN ORDER (must match the header row exactly)
     date         → YYYY-MM-DD when the news happened (drives sort)
     category     → One of: Election | Award | Marriage | Birth |
                    Achievement | Felicitation | Announcement |
                    Obituary | Other
     title        → Short headline (e.g. "New trustees elected for Surat district")
     titleGu      → Gujarati title (optional). Leave blank to hide.
     summary      → 1-2 sentence summary shown on the card
     city         → City / region (used by the City filter & search)
     image        → Image URL (optional). Leave blank for placeholder.
     publishedIn  → Edition the news appeared in,
                    e.g. "Year 51, Issue 1 · #609"
     link         → Optional link to a fuller story / external article

   ✏️  Tip: lines starting with `#` are comments and are ignored.
============================================================ */

const newsData = parseTSV(`
date	category	title	titleGu	summary	city	image	publishedIn	link
# === News from May 2026 (Year 51, Issue 1, #609) ===
2026-04-18	Election	New trustees elected for Surat district	સુરત જિલ્લા માટે નવા ટ્રસ્ટીઓ ચૂંટાયા	The Surat district committee elected its new office bearers at the annual general meeting. Shri Hiren Shah continues as President.	Surat		Year 51, Issue 1 · #609	#
2026-04-22	Felicitation	Kolkata Trust honours senior community members	કોલકાતા ટ્રસ્ટ દ્વારા સન્માન સમારંભ	The Kolkata branch held a felicitation ceremony for community elders who have served the trust for over 25 years.	Kolkata		Year 51, Issue 1 · #609	#
2026-04-28	Achievement	Brahmakshatriya Mahila Mandal organises career counselling	બ્રહ્મક્ષત્રિય મહિલા મંડળ દ્વારા કરિયર માર્ગદર્શન	Over 60 girl students from the community attended the day-long career-counselling session organised by the Mahila Mandal.	Ahmedabad		Year 51, Issue 1 · #609	#
2026-04-30	Announcement	Annual scholarship applications now open	વાર્ષિક શિષ્યવૃત્તિ માટે અરજીઓ ખુલ્લી	Community students pursuing higher education in 2026-27 can now apply for the annual scholarship grants. Deadline: 31 July 2026.	Ahmedabad		Year 51, Issue 1 · #609	#
2026-05-02	Award	Two community youth win state-level cricket trophy	બે યુવાનોએ રાજ્યસ્તરીય ક્રિકેટ ટ્રોફી જીતી	Aarav Patel and Nikhil Bosamia were part of the winning Gujarat U-19 team at the western zone tournament.	Vadodara		Year 51, Issue 1 · #609	#

# === News from earlier editions ===
2026-03-15	Marriage	Annual mass-marriage ceremony unites 12 couples	સામૂહિક લગ્ન સમારોહમાં 12 યુગલો જોડાયા	The trust's annual mass-marriage event saw 12 community couples married in a single ceremony - supported by donations from over 200 members.	Ahmedabad		Year 50, Issue 11 · #607	#
2026-02-26	Felicitation	Republic Day felicitation honours 12 achievers	પ્રજાસત્તાક દિન સન્માન સમારંભ	On Republic Day, the trust honoured 12 community members across academics, sports, social work and entrepreneurship for their 2025 achievements.	Ahmedabad		Year 50, Issue 10 · #606	#
2026-01-12	Election	New office bearers for Mumbai chapter	મુંબઈ શાખાના નવા હોદ્દેદારો	The Mumbai chapter announced its 2026 committee, with Shri Anita Desai elected as the new chapter President.	Mumbai		Year 50, Issue 9 · #605	#

# Add new news rows below this line. Tip: copy a row above, paste, then change the values.
`);
