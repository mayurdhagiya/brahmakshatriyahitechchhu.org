/* ============================================================
   Brahmakshatriya Hitechchhu — Trustees

   Edit by pasting tab-separated rows from Excel directly into the
   table below. Cards are auto-grouped by `designation` in this
   preferred order: President → Vice President → Secretary →
   Treasurer → Trustee → others.

   Columns (in order):
     name         — full name
     designation  — President / Vice President / Secretary / Treasurer / Trustee
     bio          — one-line bio shown on the card
     image        — square portrait URL
     phone        — full international phone (e.g. +919876543210)
     whatsapp     — WhatsApp number (digits only, with country code)
     email        — email address
     facebook     — full Facebook profile URL (or # for none)
     twitter      — full Twitter / X profile URL (or # for none)
     linkedin     — full LinkedIn profile URL (or # for none)
============================================================ */

const trusteesData = parseTSV(`
name	designation	bio	image	phone	whatsapp	email	facebook	twitter	linkedin
Rajesh Patel	President	Visionary leader guiding the trust's mission and direction.	https://placehold.co/300x300/1a2a4f/c9a55a?text=RP	+919876543210	919876543210	rajesh.patel@example.com	#	#	#
Anjali Mehta	Vice President	Strategist focused on community growth and engagement.	https://placehold.co/300x300/1a2a4f/c9a55a?text=AM	+919123456780	919123456780	anjali.mehta@example.com	#	#	#
Suresh Joshi	Secretary	Coordinates trust operations, communications and records.	https://placehold.co/300x300/1a2a4f/c9a55a?text=SJ	+919812345678	919812345678	suresh.joshi@example.com	#	#	#
Meera Shah	Treasurer	Oversees financial planning, audits and donor relations.	https://placehold.co/300x300/1a2a4f/c9a55a?text=MS	+919898989898	919898989898	meera.shah@example.com	#	#	#
Hitesh Trivedi	Trustee	Active contributor to community welfare initiatives.	https://placehold.co/300x300/1a2a4f/c9a55a?text=HT	+919900112233	919900112233	hitesh.trivedi@example.com	#	#	#
Nisha Desai	Trustee	Champions youth and women empowerment programmes.	https://placehold.co/300x300/1a2a4f/c9a55a?text=ND	+919811223344	919811223344	nisha.desai@example.com	#	#	#
Pritesh Pandya	Trustee	Leads regional outreach and chapter development.	https://placehold.co/300x300/1a2a4f/c9a55a?text=PP	+919855667788	919855667788	pritesh.pandya@example.com	#	#	#
Kavita Bhatt	Trustee	Curates editorial content and cultural programming.	https://placehold.co/300x300/1a2a4f/c9a55a?text=KB	+919844556677	919844556677	kavita.bhatt@example.com	#	#	#
`).map((t) => ({
  ...t,
  social: { facebook: t.facebook, twitter: t.twitter, linkedin: t.linkedin }
}));
