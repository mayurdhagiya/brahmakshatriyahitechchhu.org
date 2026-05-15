/* ============================================================
   Brahmakshatriya Hitechchhu - Trustees & Leadership

   Edit by pasting tab-separated rows from Excel directly into the
   table below. Cards are auto-grouped by `designation` in this
   preferred order:
     President → Vice President → Hon. Secretary → Secretary →
     Treasurer → Trustee → Editor → Co-Editor →
     Executive Member → Advisory Committee Member
   (any other designation falls to the end alphabetically)

   📐 COLUMN ORDER (must match the header row exactly)
     name         → English name (e.g. "Dhanshukhbhai H. Bosamia")
     nameGu       → Gujarati name (shown under the English name).
                    Leave blank to hide.
     designation  → One of:
                      President / Vice President / Hon. Secretary /
                      Secretary / Treasurer / Trustee / Editor /
                      Co-Editor / Executive Member /
                      Advisory Committee Member
     bio          → One-line role description shown on the card
     image        → Square portrait URL. Leave blank for placeholder.
     phone        → Full international phone (e.g. +919876543210)
     whatsapp     → WhatsApp digits with country code
     email        → Email address
     facebook     → Full Facebook profile URL (or blank)
     twitter      → Full Twitter / X profile URL (or blank)
     linkedin     → Full LinkedIn profile URL (or blank)

   ✏️  Tip: leave any contact field blank to hide that button on
       the card. If ALL contact fields are blank, the card hides
       the contact-action row entirely.
============================================================ */

const trusteesData = parseTSV(`
name	nameGu	designation	bio	image	phone	whatsapp	email	facebook	twitter	linkedin
# === Trustee Board (ટ્રસ્ટી મંડળ) ===
Dhanshukhbhai H. Bosamia	ધનસુખભાઈ એચ. બોસમીઆ	President	Heads the Brahmakshatriya Hitechchhu Trust and oversees all activities.	https://placehold.co/300x300/1a2a4f/c9a55a?text=DB
Atulbhai M. Veechi	અતુલભાઈ એમ. વીંછી	Vice President	Supports the President in trust governance and outreach.	https://placehold.co/300x300/1a2a4f/c9a55a?text=AV
Bakulesh J. Padia	બકુલેશ જે. પડીઆ	Hon. Secretary	Coordinates trust operations, communications and records.	https://placehold.co/300x300/1a2a4f/c9a55a?text=BP
Pradeepbhai V. Vadher	પ્રદિપભાઈ વી. વાઢેર	Trustee	Active trustee contributing to community welfare initiatives.	https://placehold.co/300x300/1a2a4f/c9a55a?text=PV
Kirankumar I. Varde	કિરણકુમાર આઈ. વારડે	Trustee	Active trustee contributing to community welfare initiatives.	https://placehold.co/300x300/1a2a4f/c9a55a?text=KV

# === Editorial Team (તંત્રી / સહતંત્રી) ===
Praveen P. Dhagia	પ્રવીણ પી. ધગીઆ	Editor	Editor of the monthly Brahmakshatriya Hitechchhu magazine.	https://placehold.co/300x300/1a2a4f/c9a55a?text=PD
Amrutlal B. Soneji	અમૃતલાલ બી. સોનેજી	Co-Editor	Co-editor supporting the magazine's monthly production.	https://placehold.co/300x300/1a2a4f/c9a55a?text=AS

# === Executive Committee (કારોબારી સભ્યો) ===
Sudhirbhai J. Chhatbar	સુધીરભાઈ જે. છાટબાર	Executive Member	Member of the executive committee.	https://placehold.co/300x300/1a2a4f/c9a55a?text=SC
Maheshbhai S. Chhatbar	મહેશભાઈ એસ. છાટબાર	Executive Member	Member of the executive committee.	https://placehold.co/300x300/1a2a4f/c9a55a?text=MC
Jagdishbhai K. Bosamia	જગદીશભાઈ કે. બોસમીઆ	Executive Member	Member of the executive committee.	https://placehold.co/300x300/1a2a4f/c9a55a?text=JB
Dilipkumar D. Bagaria	દિલીપકુમાર ડી. બગરીઆ	Executive Member	Member of the executive committee.	https://placehold.co/300x300/1a2a4f/c9a55a?text=DK
Nikhilbhai C. Madhu	નિખિલભાઈ સી. માધુ	Executive Member	Member of the executive committee.	https://placehold.co/300x300/1a2a4f/c9a55a?text=NM

# === Advisory Committee (સલાહકાર સમિતિ) ===
Jitendrabhai U. Mamtora	જીતેન્દ્રભાઈ યુ. મામતોરા	Advisory Committee Member	Provides strategic guidance to the trust.	https://placehold.co/300x300/1a2a4f/c9a55a?text=JM
Bharatbhai P. Padia	ભરતભાઈ પી. પડીઆ	Advisory Committee Member	Provides strategic guidance to the trust.	https://placehold.co/300x300/1a2a4f/c9a55a?text=BP
Ishwarlal V. Varde	ઈશ્વરલાલ વી. વારડે	Advisory Committee Member	Provides strategic guidance to the trust.	https://placehold.co/300x300/1a2a4f/c9a55a?text=IV
`).map((t) => ({
  ...t,
  // Build the social object the renderer expects from the flat columns
  social: { facebook: t.facebook, twitter: t.twitter, linkedin: t.linkedin }
}));
