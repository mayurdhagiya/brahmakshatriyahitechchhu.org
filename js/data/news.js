/* ============================================================
   Brahmakshatriya Hitechchhu - Community News (સમાચાર)

   Edit by pasting tab-separated rows from Excel directly into
   the table below. The page automatically:
     . Sorts newest-first by `date`
     . Builds Year + Category + City filters
     . Lets visitors search across every detail
     . Groups items by year of publication
     . Opens a Read More modal with full story + photo gallery
     . Surfaces Share buttons (Web Share API / WhatsApp / Email)

   📐 COLUMN ORDER (must match the header row exactly)
     date         - YYYY-MM-DD when the news happened (drives sort)
     category     - One of: Election | Award | Marriage | Birth |
                    Achievement | Felicitation | Announcement |
                    Obituary | Other
     title        - Short headline (e.g. "New trustees elected for Surat district")
     titleGu      - Gujarati title (optional). Leave blank to hide.
     summary      - 1-2 sentence summary shown on the card
     city         - City / region (used by City filter & search)
     image        - Cover image URL (16:9 looks best). Leave blank for placeholder.
     publishedIn  - Edition the news appeared in,
                    e.g. "Year 51, Issue 1 · #609"
     link         - Optional external article link (use # for none)
     details      - Long-form story for the Read More modal
     gallery      - Photos for the modal, encoded:  src||caption;;src||caption
                    . Items separated by  ;;
                    . Fields within an item by ||
                    . Leave blank to hide the gallery section

   ✏️  Tip: lines starting with `#` are comments and are ignored.
============================================================ */

const newsData = parseTSV(`
date	category	title	titleGu	summary	city	image	publishedIn	link	details	gallery
# === News from May 2026 (Year 51, Issue 1, #609) ===
2026-04-18	Election	New trustees elected for Surat district	સુરત જિલ્લા માટે નવા ટ્રસ્ટીઓ ચૂંટાયા	The Surat district committee elected its new office bearers at the annual general meeting. Shri Hiren Shah continues as President.	Surat	https://placehold.co/600x360/1a2a4f/c9a55a?text=Surat+Election	Year 51, Issue 1 · #609	#	The Surat district committee held its annual general meeting at the trust office on April 18, with over 80 members in attendance. Shri Hiren Shah was unanimously re-elected as President for a second term, with Smt. Anjali Patel joining as the new Secretary. The new committee laid out plans for three community welfare initiatives over the coming year, including a free medical camp and a scholarship drive for higher-education students.	https://placehold.co/800x600/1a2a4f/c9a55a?text=Photo+1||The new committee taking oath;;https://placehold.co/800x600/0f1c3a/c9a55a?text=Photo+2||Members at the AGM
2026-04-22	Felicitation	Kolkata Trust honours senior community members	કોલકાતા ટ્રસ્ટ દ્વારા સન્માન સમારંભ	The Kolkata branch held a felicitation ceremony for community elders who have served the trust for over 25 years.	Kolkata	https://placehold.co/600x360/1a2a4f/c9a55a?text=Kolkata+Felicitation	Year 51, Issue 1 · #609	#	The Kolkata branch held a heartfelt felicitation ceremony on April 22 to honour 14 senior community members who have served the Brahmakshatriya Hitechchhu Trust for more than 25 years. Each honoree received a shawl, a memento and a citation read out by President Shri Rajesh Patel. The ceremony concluded with a community lunch attended by over 200 members.
2026-04-28	Achievement	Mahila Mandal organises career counselling for students	બ્રહ્મક્ષત્રિય મહિલા મંડળ દ્વારા કરિયર માર્ગદર્શન	Over 60 girl students from the community attended the day-long career-counselling session organised by the Mahila Mandal.	Ahmedabad	https://placehold.co/600x360/1a2a4f/c9a55a?text=Career+Day	Year 51, Issue 1 · #609	#	The Brahmakshatriya Mahila Mandal organised a free, day-long career-counselling session at the trust hall on April 28. Sixty-three girl students from Class 10 to graduation attended sessions on stream selection, scholarship opportunities and emerging career paths. Mentors included community professionals from medicine, law, finance and engineering. Plans are underway for a follow-up session for parents in June.
2026-04-30	Announcement	Annual scholarship applications now open	વાર્ષિક શિષ્યવૃત્તિ માટે અરજીઓ ખુલ્લી	Community students pursuing higher education in 2026-27 can now apply for the annual scholarship grants. Deadline: 31 July 2026.	Ahmedabad	https://placehold.co/600x360/1a2a4f/c9a55a?text=Scholarships	Year 51, Issue 1 · #609	#	The trust's annual scholarship programme is now accepting applications for the 2026-27 academic year. Three categories are available: merit-based (top 5 students), need-based (qualifying family-income criteria) and special-talent (sports, arts, sciences). Applications close on 31 July 2026. Forms can be downloaded from the office or requested by email at info@brahmakshatriyahitechchhu.org.
2026-05-02	Award	Two community youth win state-level cricket trophy	બે યુવાનોએ રાજ્યસ્તરીય ક્રિકેટ ટ્રોફી જીતી	Aarav Patel and Nikhil Bosamia were part of the winning Gujarat U-19 team at the western zone tournament.	Vadodara	https://placehold.co/600x360/1a2a4f/c9a55a?text=Cricket+Win	Year 51, Issue 1 · #609	#	Aarav Patel (16, Vadodara) and Nikhil Bosamia (17, Ahmedabad) were part of the Gujarat U-19 cricket team that lifted the western zone trophy this April. Aarav was named Player of the Tournament for his unbeaten 142 in the final. Both have been awarded the trust's special-talent scholarship to support their training over the next two years.

# === News from earlier editions ===
2026-03-15	Marriage	Annual mass-marriage ceremony unites 12 couples	સામૂહિક લગ્ન સમારોહમાં 12 યુગલો જોડાયા	The trust's annual mass-marriage event saw 12 community couples married in a single ceremony - supported by donations from over 200 members.	Ahmedabad	https://placehold.co/600x360/1a2a4f/c9a55a?text=Mass+Marriage	Year 50, Issue 11 · #607	#	The trust's 17th annual mass-marriage event saw 12 community couples married in a single ceremony at the H.K. Hall on March 15. The event was funded entirely through community donations - over 200 members contributed, ranging from ₹500 to ₹1 lakh. Each couple received gold ornaments, household essentials and a starter fund of ₹25,000. Special thanks to the volunteer coordination team led by Smt. Meera Shah.
2026-02-26	Felicitation	Republic Day felicitation honours 12 achievers	પ્રજાસત્તાક દિન સન્માન સમારંભ	On Republic Day, the trust honoured 12 community members across academics, sports, social work and entrepreneurship for their 2025 achievements.	Ahmedabad	https://placehold.co/600x360/1a2a4f/c9a55a?text=Republic+Day	Year 50, Issue 10 · #606	#	The trust's annual Republic Day felicitation honoured 12 community members on January 26 for outstanding contributions in 2025 across four categories: academics (4 honorees), sports (3), social work (3) and entrepreneurship (2). Highlights included Dr. Pranav Bosamia's research publication in The Lancet and Riya Joshi's bronze medal at the National Skating Championship. The morning ended with the unfurling of the national flag and a community breakfast at the trust office.
2026-01-12	Election	New office bearers for Mumbai chapter	મુંબઈ શાખાના નવા હોદ્દેદારો	The Mumbai chapter announced its 2026 committee, with Smt. Anita Desai elected as the new chapter President.	Mumbai	https://placehold.co/600x360/1a2a4f/c9a55a?text=Mumbai+Election	Year 50, Issue 9 · #605	#

# Add new news rows below this line. Tip: copy a row above, paste, then change the values.
`);
