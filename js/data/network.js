/* ============================================================
   Brahmakshatriya Hitechchhu — Community Network

   Edit by pasting tab-separated rows from Excel directly into the
   table below.

   Columns (in order):
     state          — Indian state name (drives the State filter)
     city           — city / town
     contactPerson  — name of regional contact
     mobile         — 10-digit mobile (no country code)
     whatsapp       — WhatsApp number (digits, with country code)
     address        — full street address
============================================================ */

const networkData = parseTSV(`
state	city	contactPerson	mobile	whatsapp	address
Gujarat	Ahmedabad	Rajesh Patel	9876543210	9876543210	123 Gandhi Road, Ahmedabad, Gujarat
Gujarat	Ahmedabad	Pritesh Patel	9876500000	9876500000	B-19 Popular Centre, Satellite, Ahmedabad
Gujarat	Surat	Hiren Shah	9879876543	9879876543	21 Athwa Lines, Surat, Gujarat
Gujarat	Vadodara	Bhavesh Joshi	9979123456	9979123456	45 Alkapuri, Vadodara, Gujarat
Gujarat	Rajkot	Mehul Trivedi	9099887766	9099887766	7 Race Course Road, Rajkot, Gujarat
Maharashtra	Mumbai	Anita Desai	9123456789	9123456789	456 Marine Drive, Mumbai, Maharashtra
Maharashtra	Pune	Sandeep Kothari	9823456789	9823456789	12 FC Road, Pune, Maharashtra
Karnataka	Bengaluru	Rohit Shah	9845123456	9845123456	88 MG Road, Bengaluru, Karnataka
Delhi	New Delhi	Vinay Mehta	9810012345	9810012345	32 Connaught Place, New Delhi
Tamil Nadu	Chennai	Arvind Iyer	9444056789	9444056789	9 Anna Nagar, Chennai, Tamil Nadu
Telangana	Hyderabad	Manish Bhatt	9849012345	9849012345	21 Banjara Hills, Hyderabad, Telangana
Rajasthan	Jaipur	Deepak Sharma	9414012345	9414012345	C-Scheme, Jaipur, Rajasthan
`);
