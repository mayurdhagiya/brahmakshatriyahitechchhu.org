/* ============================================================
   Brahmakshatriya Hitechchhu — Community Ads (Display + Classified)

   Edit by pasting tab-separated rows from Excel directly into the
   table below. Each row is one ad. The page automatically:
     • Splits ads into "Display" and "Classified" tabs
     • Builds a Category dropdown from the categories in the data
     • Lets visitors search across every ad detail
     • Surfaces Call / WhatsApp / Email actions per ad
     • Auto-hides ads whose `validUntil` date has passed

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

   📌  The display-ad rows below are based on real advertisers from
       the May 2026 (Year 51, Issue 1, #609) edition. Update the
       contact details and validity dates as needed.
============================================================ */

const adsData = parseTSV(`
type	category	title	description	advertiser	city	image	publishedDate	validUntil	phone	whatsapp	email
# === Display ads (real advertisers from May 2026 / #609) ===
display	Business	Prakash Print — manufacturers & exporters of fabrics	Specialists in 100% cotton fabrics, Punjabi suits & dress materials. Mumbai · Ahmedabad · Jetpur.	Prakash Print	Ahmedabad	https://placehold.co/600x400/1a2a4f/c9a55a?text=Prakash+Print	2026-05-15	2026-12-31	+919879090909	919879090909	info@prakashprint.example
display	Business	Aeromatic Engineering Pvt. Ltd. — liquid-ring vacuum pumps	Manufacturers of liquid-ring vacuum pumps, blowers, fans, oil/gas firing equipment, thermal fluid heaters, steam boilers and more.	Aeromatic Engineering Pvt. Ltd.	Vadher (GIDC)	https://placehold.co/600x400/1a2a4f/c9a55a?text=Aeromatic	2026-05-15	2026-12-31	+912662223334	912662223334	sales@aeromatic.example
display	Services	Jajal Infotech — Digital Signature Certificates	Authorised partner for Class 3 DSC, Aadhaar e-sign, GST/Income-tax filing tools, Tally & PaySwift solutions across India.	Jajal Infotech	Multiple cities	https://placehold.co/600x400/1a2a4f/c9a55a?text=Jajal+Infotech	2026-05-15	2026-12-31	+919898000011	919898000011	hello@jajal.example
display	Business	Texprose1 — one-stop for textile processing machinery	Engineering & supply of textile processing machinery; serving Sajpur Bogha, Naroli, Ahmedabad and beyond.	Texprose1	Ahmedabad	https://placehold.co/600x400/1a2a4f/c9a55a?text=Texprose1	2026-05-15	2026-12-31	+919879876543	919879876543	office@texprose1.example
display	Business	Jay Chemical Industries — dyes & textile auxiliaries	Dyes, dye intermediates, digital textile printing inks, textile auxiliaries and construction chemicals.	Jay Chemical Industries Pvt. Ltd.	Ahmedabad	https://placehold.co/600x400/1a2a4f/c9a55a?text=Jay+Chemical	2026-05-15	2026-12-31	+917927545454	917927545454	contact@jaychemical.example
display	Business	Hi-Tech Industries — packaging & food processing machines	Automatic pouch packing, powder filling, granule filling and carton-tapping machines for namkeen, spices, atta, besan and more.	Hi-Tech Industries	Vatva (GIDC), Ahmedabad	https://placehold.co/600x400/1a2a4f/c9a55a?text=Hi-Tech	2026-05-15	2026-12-31	+917925831007	919727979312	info@hitechmachines.example
display	Business	Hathi Masala — પુરી મસાલા એટલે હાથી, બાકી ચર્ચા	Premium ground spices and chilli powder — trusted by Gujarati households for generations.	Hathi Masala	Ahmedabad	https://placehold.co/600x400/1a2a4f/c9a55a?text=Hathi+Masala	2026-05-15	2026-12-31	+919879700000	919879700000	support@hathimasala.example
display	Services	Soneji & Associates — Chartered Accountants	30+ years of client satisfaction in Audit, Tax, GST, SMSF and Strategy advisory across Australia and India.	Yogesh Soneji & Nirav Soneji	Mumbai	https://placehold.co/600x400/1a2a4f/c9a55a?text=Soneji+%26+Co	2026-05-15	2026-12-31	+919999996451	919999996452	yogeneraj@yahoo.example
display	Business	Khatri Jamnadas Bechardas — since 1910	Gharchola, Bandhani, Patola, Banarasi silk, lehengas, Lucknowi chikankari and more — three Mumbai showrooms.	Khatri Jamnadas Bechardas	Mumbai	https://placehold.co/600x400/1a2a4f/c9a55a?text=Khatri+Jamnadas	2026-05-15	2026-12-31	+912222425711	912222425711	hello@khatrijamnadas.example
display	Property	Mangalya Heritage — luxury sarees & ethnic wear	A boutique heritage brand for premium sarees, lehengas and bridal couture by Pravinchandra Prabhudas Dhagia.	Mangalya Heritage	Ahmedabad	https://placehold.co/600x400/1a2a4f/c9a55a?text=Mangalya+Heritage	2026-05-15	2026-12-31	+917926925569	917926925569	hello@mangalya.example

# === Classifieds (community-submitted) — replace with real submissions ===
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
