/* ============================================================
   Brahmakshatriya Hitechchhu — Community Ads (Display + Classified)

   Edit by pasting tab-separated rows from Excel directly into the
   table below. Each row is one ad. The page automatically:
     • Splits ads into "Display" and "Classified" tabs
     • Builds a Category dropdown from the categories in the data
     • Lets visitors search across every ad detail
     • Surfaces Call / WhatsApp / Email actions per ad

   Columns (in order):
     type            — display | classified
                       (display ads show an image; classified are text-only)
     category        — Matrimonial | Property | Jobs | Business |
                       Services | Education | Vehicles | Other
     title           — short headline shown on the card
     description     — body text. For classifieds this is the ad copy.
     advertiser      — name of the person / business placing the ad
     city            — city (used only in Filter / search)
     image           — ad image URL — only for type=display
     publishedDate   — YYYY-MM-DD when the ad was published
     validUntil      — YYYY-MM-DD when the ad expires (auto-hidden after)
     phone           — full international phone for the Call button
     whatsapp        — WhatsApp number (digits only, country code first)
     email           — email address for the Email button
============================================================ */

const adsData = parseTSV(`
type	category	title	description	advertiser	city	image	publishedDate	validUntil	phone	whatsapp	email
display	Business	Patel Catering — weddings & community events	Specialists in pure vegetarian Gujarati menus for 50–5,000 guests. Trusted by the trust for 12+ years.	Patel Catering Services	Ahmedabad	https://placehold.co/600x400/1a2a4f/c9a55a?text=Patel+Catering	2026-04-01	2026-12-31	+919876500011	919876500011	hello@patelcatering.example
display	Property	2 BHK flat for sale — Satellite, Ahmedabad	Brand-new 2 BHK with covered parking, lift and 24x7 security. Walking distance from the trust office.	Shah Realty	Ahmedabad	https://placehold.co/600x400/1a2a4f/c9a55a?text=2BHK+Flat	2026-05-02	2026-08-31	+919898765432	919898765432	contact@shahrealty.example
display	Education	Career counselling for Class 10/12 students	Personalised guidance from community mentors. Free first session for community members.	Bright Path Education	Surat	https://placehold.co/600x400/1a2a4f/c9a55a?text=Career+Counselling	2026-04-15	2026-10-15	+919979111222	919979111222	info@brightpath.example
display	Services	CA & tax filing for community members	GST, ITR, audits and trust compliance. Special rates for Hitechchhu subscribers.	Mehta & Co. Chartered Accountants	Mumbai	https://placehold.co/600x400/1a2a4f/c9a55a?text=CA+Services	2026-03-10	2026-12-31	+919123456001	919123456001	office@mehtaca.example
display	Matrimonial	Looking for groom — community girl, MBA, Mumbai	28, well-educated (MBA Finance), working in a multinational bank. Family details on request.	Desai Family	Mumbai	https://placehold.co/600x400/1a2a4f/c9a55a?text=Matrimonial	2026-04-20	2026-09-30	+919812400000	919812400000	desai.match@example.com

classified	Matrimonial	Suitable match wanted — IT engineer, 30, Bengaluru	Vegetarian, family-oriented, settled in Bengaluru. Looking for graduate / post-graduate girl from the community. Caste no bar within community.	Joshi Family	Bengaluru		2026-05-01	2026-09-30	+919845600099	919845600099	joshi.match@example.com
classified	Property	1 BHK on rent near Trust Office, Satellite	Furnished 1 BHK with parking, ₹18,000/month. Preferred: bachelor / small family from community. Available immediately.	Bhavesh Patel	Ahmedabad		2026-05-05	2026-07-31	+919879090909	919879090909	bhavesh.p@example.com
classified	Jobs	Junior accountant wanted — Ahmedabad	Small CA firm hiring B.Com fresher with Tally knowledge. Salary ₹18-25k. Walk-in interviews every Saturday 11 AM.	Trivedi & Associates	Ahmedabad		2026-04-28	2026-06-30	+917926501010	917926501010	hr@trivediassociates.example
classified	Jobs	Tuition teacher needed — Class 6-10 Maths/Science	Home tuition for one student, 6 days/week, evenings. Surat (Adajan area). ₹8,000/month. Community member preferred.	Kavita Mehta	Surat		2026-05-08	2026-06-30	+919879111222	919879111222	kavita.m@example.com
classified	Vehicles	Maruti Swift VXi 2019 for sale	Single-owner, 38,000 km, full service history, insurance till Feb 2027. Asking ₹4.8 lakh, slightly negotiable.	Hiren Shah	Vadodara		2026-05-10	2026-07-15	+919979801234	919979801234	hiren.cars@example.com
classified	Services	Home tutor — Sanskrit & Gujarati for kids	Retired teacher offers personalised Sanskrit and Gujarati lessons online and in-person (Ahmedabad West). 25 years' experience.	Suresh Joshi	Ahmedabad		2026-04-22	2026-12-31	+919812345001	919812345001	suresh.tutor@example.com
classified	Business	Looking for distributor — organic ghee	Pune-based dairy seeking community distributors across Gujarat for premium A2 ghee. Margin 20%. Serious enquiries only.	Maitri Dairy	Pune		2026-05-03	2026-11-30	+919823009900	919823009900	maitri.dairy@example.com
classified	Education	Free Vedic Maths workshop for Class 5-8	Two-day weekend workshop at trust hall. Limited seats — first 40 children. Free for community subscribers; ₹200 for others.	Bright Path Education	Surat		2026-05-12	2026-06-15	+919979111222	919979111222	info@brightpath.example
classified	Other	Lost cat — orange tabby, Satellite area	Friendly orange tabby missing since May 9 evening near Popular Centre. Responds to "Bittu". Reward ₹2,000. Please contact if seen.	Anjali Patel	Ahmedabad		2026-05-10	2026-06-10	+919898000001	919898000001	anjalipa@example.com
`).map((a) => ({
  ...a,
  contact: { phone: a.phone, whatsapp: a.whatsapp, email: a.email }
}));
