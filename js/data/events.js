/* ============================================================
   Brahmakshatriya Hitechchhu — Community Events
   Status (upcoming / past) is computed automatically from `date`.

   Optional fields used by the "Read More" modal:
     details      — long-form description (HTML allowed)
     highlights[] — { number, label } stat tiles
     agenda[]     — { time, title } schedule rows
     gallery[]    — array of { src, caption } objects
                    (a plain string URL is also accepted)
     gujaratiDate — Vikram Samvat tithi as a free-text string
                    e.g. "Posh Sud 1, V.S. 2082"

   Tithi reference points used below (Gujarati / Amanta system):
     • Diwali 2023 = 12 Nov 2023  → Kartak Sud 1, V.S. 2080 = 13 Nov 2023
     • Diwali 2024 =  1 Nov 2024  → Kartak Sud 1, V.S. 2081 =  2 Nov 2024
     • Diwali 2025 = 21 Oct 2025  → Kartak Sud 1, V.S. 2082 = 22 Oct 2025
   These are still approximations — please verify against an
   authoritative Panchang before publishing.
============================================================ */

const eventsData = [
  /* ---------- Upcoming events ---------- */
  {
    title: "Family Picnic at Polo Forest",
    date: "2026-02-08",
    gujaratiDate: "Maha Sud 1, V.S. 2082",
    time: "8:00 AM – 6:00 PM",
    city: "Sabarkantha",
    venue: "Polo Forest Eco-Camp, Vijaynagar",
    description: "A full-day family picnic in the Polo Forest — guided trekking, group games and lunch under the canopy.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Family+Picnic",
    link: "#",
    details: "Travel together by community bus to the beautiful Polo Forest near Vijaynagar for a refreshing day out. The morning is set aside for a guided nature walk to the ancient temple ruins, followed by group games for kids and adults, and a community lunch under the canopy. Return by evening — pickup and drop from the trust office.",
    highlights: [
      { number: "120", label: "Family seats" },
      { number: "3",   label: "Buses arranged" },
      { number: "1",   label: "Day of fun" }
    ],
    agenda: [
      { time: "8:00 AM",  title: "Departure from trust office" },
      { time: "10:30 AM", title: "Arrival, welcome tea & briefing" },
      { time: "11:00 AM", title: "Guided nature walk to temple ruins" },
      { time: "1:30 PM",  title: "Community lunch" },
      { time: "3:00 PM",  title: "Group games & open exploration" },
      { time: "5:00 PM",  title: "Return journey" }
    ]
  },
  {
    title: "Senior Citizens' Snehmilan",
    date: "2026-01-25",
    gujaratiDate: "Posh Sud 7, V.S. 2082",
    time: "11:00 AM – 3:00 PM",
    city: "Ahmedabad",
    venue: "Trust Hall, Satellite, Ahmedabad",
    description: "An afternoon dedicated to our seniors — bhajan, lunch and felicitation of members above 75.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Senior+Snehmilan",
    link: "#",
    details: "A warm afternoon designed around our senior community members. The programme begins with a bhajan session, followed by a sit-down lunch and the annual felicitation of members above 75 years of age. Transport assistance is available on request.",
    highlights: [
      { number: "150+", label: "Senior guests" },
      { number: "40+",  label: "Felicitations" },
      { number: "Free", label: "Transport on request" }
    ],
    agenda: [
      { time: "11:00 AM", title: "Welcome & bhajan session" },
      { time: "12:30 PM", title: "Felicitation of members above 75" },
      { time: "1:30 PM",  title: "Community lunch" },
      { time: "2:30 PM",  title: "Open mic — sharing memories" }
    ]
  },
  {
    title: "Scholarship Distribution Ceremony",
    date: "2026-01-12",
    gujaratiDate: "Posh Vad 9, V.S. 2082",
    time: "5:30 PM – 8:00 PM",
    city: "Ahmedabad",
    venue: "Tagore Hall, Paldi, Ahmedabad",
    description: "Annual scholarship distribution to bright community students — open to all members.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Scholarships",
    link: "#",
    details: "The trust's annual scholarship programme supports community students pursuing higher education in India and abroad. This year we are distributing scholarships across three categories — merit, need-based and special talent. Parents and the community are warmly invited to attend.",
    highlights: [
      { number: "₹15L", label: "Total scholarships" },
      { number: "60+",  label: "Recipient students" },
      { number: "3",    label: "Categories" }
    ],
    agenda: [
      { time: "5:30 PM", title: "Welcome & lamp lighting" },
      { time: "6:00 PM", title: "Address by President" },
      { time: "6:30 PM", title: "Scholarship distribution" },
      { time: "7:30 PM", title: "Vote of thanks & high tea" }
    ]
  },
  {
    title: "Annual Community Gathering 2025",
    date: "2025-12-20",
    gujaratiDate: "Posh Sud 1, V.S. 2082",
    time: "10:00 AM – 6:00 PM",
    city: "Ahmedabad",
    venue: "Tagore Hall, Paldi, Ahmedabad",
    description: "Our flagship annual gathering — cultural performances, felicitations, community lunch and the launch of the year-end edition.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Annual+Gathering",
    link: "#",
    details: "Join us for a full day of celebration as the community comes together for our biggest gathering of the year. The day kicks off with a traditional welcome, moves through felicitations of our achievers, a packed cultural programme by community youth, a community lunch, and ends with the launch of the December edition of Hitechchhu. Family registration is open — children below 12 attend free.",
    highlights: [
      { number: "500+", label: "Expected attendees" },
      { number: "20+",  label: "Performers" },
      { number: "8",    label: "Felicitations" },
      { number: "1",    label: "Edition launch" }
    ],
    agenda: [
      { time: "10:00 AM", title: "Registration & welcome tea" },
      { time: "11:00 AM", title: "Inauguration & opening address" },
      { time: "12:00 PM", title: "Felicitation of community achievers" },
      { time: "1:30 PM",  title: "Community lunch" },
      { time: "3:00 PM",  title: "Cultural programme" },
      { time: "5:30 PM",  title: "December edition launch & vote of thanks" }
    ]
  },
  {
    title: "Youth Leadership Summit",
    date: "2025-09-14",
    gujaratiDate: "Bhadarvo Vad 7, V.S. 2082",
    time: "9:30 AM – 5:00 PM",
    city: "Mumbai",
    venue: "NCPA, Nariman Point, Mumbai",
    description: "A day-long summit for community youth — keynote talks, mentorship circles and career workshops with industry leaders.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Youth+Summit",
    link: "#",
    details: "An intensive day curated for community members aged 18–35. Hear from senior leaders across technology, finance, design and entrepreneurship; participate in small-group mentorship circles; and walk away with a personalised growth plan. Seats are limited — early registration is recommended.",
    highlights: [
      { number: "200",  label: "Participant seats" },
      { number: "12",   label: "Industry speakers" },
      { number: "6",    label: "Mentorship circles" },
      { number: "3",    label: "Hands-on workshops" }
    ],
    agenda: [
      { time: "9:30 AM",  title: "Check-in & networking breakfast" },
      { time: "10:30 AM", title: "Keynote: Building a career with purpose" },
      { time: "12:00 PM", title: "Mentorship circles (round 1)" },
      { time: "1:00 PM",  title: "Lunch & 1:1 networking" },
      { time: "2:30 PM",  title: "Workshops: leadership, finance, design" },
      { time: "4:30 PM",  title: "Closing panel & next steps" }
    ]
  },
  {
    title: "Heritage Walk & Photography Meet",
    date: "2025-08-03",
    gujaratiDate: "Shravan Sud 10, V.S. 2082",
    time: "7:00 AM – 10:00 AM",
    city: "Vadodara",
    venue: "Sayaji Baug, Vadodara",
    description: "Walk through historic landmarks led by community historians, followed by a photography contest.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Heritage+Walk",
    link: "#",
    details: "Start your day with a guided heritage walk through Vadodara's most iconic landmarks, hosted by community historians. Bring your camera (phone is fine!) — the morning ends with an open photography contest judged by community photographers. Comfortable walking shoes recommended.",
    highlights: [
      { number: "3 km",  label: "Walking route" },
      { number: "5",     label: "Heritage stops" },
      { number: "₹10K",  label: "Prize pool" }
    ]
  },
  {
    title: "Monsoon Cultural Evening",
    date: "2025-07-26",
    gujaratiDate: "Shravan Sud 2, V.S. 2082",
    time: "6:00 PM – 9:30 PM",
    city: "Pune",
    venue: "Bal Gandharva Rang Mandir, Pune",
    description: "Classical music, dance recitals and a Gujarati food festival.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Cultural+Evening",
    link: "#"
  },
  {
    title: "Business & Entrepreneurs' Meet",
    date: "2026-03-22",
    gujaratiDate: "Phagan Vad 8, V.S. 2082",
    time: "10:00 AM – 4:30 PM",
    city: "Bengaluru",
    venue: "JW Marriott, Vittal Mallya Road, Bengaluru",
    description: "Networking meet for community entrepreneurs across South India.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Business+Meet",
    link: "#",
    details: "A first-of-its-kind networking meet bringing together community entrepreneurs, investors and corporate leaders from across South India. Curated round-tables on funding, supply chain and family business succession.",
    highlights: [
      { number: "150",  label: "Founders & CXOs" },
      { number: "5",    label: "Round-tables" },
      { number: "20+",  label: "Investors present" }
    ],
    agenda: [
      { time: "10:00 AM", title: "Registration & networking breakfast" },
      { time: "11:00 AM", title: "Opening keynote — building from Bharat" },
      { time: "12:30 PM", title: "Round-tables (parallel)" },
      { time: "1:30 PM",  title: "Community lunch" },
      { time: "3:00 PM",  title: "Investor speed-dating" },
      { time: "4:00 PM",  title: "Closing remarks" }
    ]
  },
  {
    title: "Spiritual Discourse — Bhagavad Gita",
    date: "2026-04-19",
    gujaratiDate: "Vaishakh Sud 2, V.S. 2082",
    time: "5:30 PM – 8:00 PM",
    city: "Ahmedabad",
    venue: "Trust Hall, Satellite, Ahmedabad",
    description: "Three-evening discourse on the Bhagavad Gita by a visiting scholar.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Gita+Discourse",
    link: "#",
    details: "A three-evening discourse on selected chapters of the Bhagavad Gita by a visiting scholar. Sessions are open to all and translated to Gujarati throughout. Light refreshments are served at the end of each session.",
    highlights: [
      { number: "3",    label: "Evenings" },
      { number: "200+", label: "Expected attendees" },
      { number: "Free", label: "Open to all" }
    ]
  },
  {
    title: "Children's Cultural Workshop",
    date: "2026-05-31",
    gujaratiDate: "Jeth Sud 15, V.S. 2082",
    time: "9:00 AM – 1:00 PM",
    city: "Surat",
    venue: "Sanskar Bharti Hall, Athwa Lines, Surat",
    description: "Hands-on workshop for children — Garba, Bhajan, Sanskrit shlokas and storytelling.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Kids+Workshop",
    link: "#",
    details: "A vibrant half-day workshop introducing children aged 6–14 to traditional arts. Stations include Garba choreography, simple Bhajan singing, Sanskrit shloka recitation and Gujarati folk-tale storytelling. Each child receives a participation kit and a certificate.",
    highlights: [
      { number: "100", label: "Children" },
      { number: "4",   label: "Stations" },
      { number: "₹250", label: "Per child kit" }
    ],
    agenda: [
      { time: "9:00 AM",  title: "Welcome & ice-breaker" },
      { time: "9:30 AM",  title: "Station rotations begin" },
      { time: "11:30 AM", title: "Snack break & open performances" },
      { time: "12:30 PM", title: "Closing & certificate distribution" }
    ]
  },
  {
    title: "Inter-City Cricket Tournament",
    date: "2026-06-21",
    gujaratiDate: "Ashadh Sud 6, V.S. 2082",
    time: "8:00 AM – 6:00 PM",
    city: "Vadodara",
    venue: "Reliance Stadium Ground, Akota, Vadodara",
    description: "T20 tournament with teams representing community chapters from Gujarat and beyond.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Cricket+Cup",
    link: "#",
    details: "Eight community chapters fight for the inaugural Hitechchhu Cup — a T20 knockout played across two grounds in Vadodara. Spectator entry is free, with a community lunch served between semi-finals. Winners receive a trophy plus prize money.",
    highlights: [
      { number: "8",     label: "Chapter teams" },
      { number: "₹1L",   label: "Prize pool" },
      { number: "Free",  label: "Spectator entry" }
    ],
    agenda: [
      { time: "8:00 AM", title: "Quarter-finals (parallel)" },
      { time: "12:30 PM", title: "Community lunch" },
      { time: "1:30 PM",  title: "Semi-finals" },
      { time: "4:00 PM",  title: "Final" },
      { time: "5:30 PM",  title: "Prize distribution" }
    ]
  },
  {
    title: "Women's Empowerment Conclave",
    date: "2026-08-09",
    gujaratiDate: "Shravan Sud 9, V.S. 2082",
    time: "10:00 AM – 5:00 PM",
    city: "Mumbai",
    venue: "ITC Maratha, Andheri East, Mumbai",
    description: "A day of talks, panels and workshops dedicated to community women in business and the arts.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Women+Conclave",
    link: "#",
    details: "Curated programme featuring keynote talks, panel discussions and skills workshops focused on entrepreneurship, finance, leadership and creative careers. Open to community women and allies.",
    highlights: [
      { number: "300", label: "Delegate seats" },
      { number: "15",  label: "Speakers" },
      { number: "5",   label: "Workshops" }
    ],
    agenda: [
      { time: "10:00 AM", title: "Registration & breakfast" },
      { time: "11:00 AM", title: "Opening keynote" },
      { time: "12:30 PM", title: "Panel — Building lasting careers" },
      { time: "1:30 PM",  title: "Lunch & networking" },
      { time: "3:00 PM",  title: "Workshops (parallel)" },
      { time: "4:30 PM",  title: "Closing fireside chat" }
    ]
  },
  {
    title: "Janmashtami Cultural Night",
    date: "2026-09-04",
    gujaratiDate: "Shravan Vad 8, V.S. 2082",
    time: "7:00 PM – 11:30 PM",
    city: "Rajkot",
    venue: "Race Course Community Ground, Rajkot",
    description: "Bhajan, dance dramas and the traditional matki phod celebration.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Janmashtami",
    link: "#",
    details: "An evening dedicated to Lord Krishna's birth — bhajan recitals by community singers, a children's dance drama, the matki phod competition and a midnight aarti. Prasad is distributed after the aarti.",
    highlights: [
      { number: "12",   label: "Bhajan acts" },
      { number: "8",    label: "Matki phod teams" },
      { number: "1,500+", label: "Devotees" }
    ]
  },
  {
    title: "Diwali Snehmilan 2026",
    date: "2026-10-25",
    gujaratiDate: "Aaso Vad 14, V.S. 2082",
    time: "7:00 PM – 11:00 PM",
    city: "Ahmedabad",
    venue: "H.K. Hall, Ashram Road, Ahmedabad",
    description: "The biggest Diwali get-together of the year with games, dinner and cultural programmes.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Diwali+2026",
    link: "#",
    details: "Continuing our long-standing tradition, the annual Diwali Snehmilan brings the Ahmedabad community together for an evening of warmth, light, music and food. Members from across cities are welcome — early registration helps with seating.",
    highlights: [
      { number: "500+", label: "Expected attendees" },
      { number: "20+",  label: "Cultural acts" },
      { number: "12",   label: "Food stalls" }
    ],
    agenda: [
      { time: "7:00 PM", title: "Welcome aarti & lamp lighting" },
      { time: "7:30 PM", title: "Cultural programme begins" },
      { time: "9:00 PM", title: "Community dinner" },
      { time: "10:30 PM", title: "Games & late-night Garba" }
    ]
  },
  {
    title: "Year-End Trustees & Members AGM",
    date: "2026-12-13",
    gujaratiDate: "Margshar Vad 14, V.S. 2083",
    time: "10:00 AM – 2:00 PM",
    city: "Ahmedabad",
    venue: "Trust Office, Satellite, Ahmedabad",
    description: "Annual general meeting — review of the year, financial report and 2027 calendar reveal.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=AGM+2026",
    link: "#",
    details: "The yearly AGM brings trustees and registered members together to review the year — initiatives delivered, finances, member additions, scholarships disbursed — and reveal the publication and events calendar for 2027. Members are encouraged to attend in person.",
    highlights: [
      { number: "12",   label: "Months reviewed" },
      { number: "60+",  label: "Initiatives" },
      { number: "1",    label: "New calendar" }
    ],
    agenda: [
      { time: "10:00 AM", title: "Welcome & quorum check" },
      { time: "10:30 AM", title: "Annual report by Secretary" },
      { time: "11:30 AM", title: "Financial report by Treasurer" },
      { time: "12:30 PM", title: "2027 calendar & strategy reveal" },
      { time: "1:30 PM",  title: "Open Q&A and lunch" }
    ]
  },

  /* ---------- Past events ---------- */
  {
    title: "Republic Day Felicitation",
    date: "2025-01-26",
    gujaratiDate: "Posh Vad 12, V.S. 2081",
    time: "10:00 AM – 1:00 PM",
    city: "Ahmedabad",
    venue: "Trust Office, Satellite, Ahmedabad",
    description: "Honoured community achievers from academics, sports and social work in a small ceremony at the trust office.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Republic+Day",
    link: "#",
    details: "We honoured 12 community members for outstanding contributions in 2024 across academics, sports, social work and entrepreneurship. The morning ended with the unfurling of the national flag and a community breakfast.",
    highlights: [
      { number: "12",  label: "Achievers honoured" },
      { number: "120", label: "Members present" },
      { number: "4",   label: "Categories" }
    ],
    gallery: [
      { src: "https://placehold.co/800x600/1a2a4f/c9a55a?text=Photo+1", caption: "Flag hoisting at the trust office courtyard" },
      { src: "https://placehold.co/800x600/0f1c3a/c9a55a?text=Photo+2", caption: "President Rajesh Patel addresses the gathering" },
      { src: "https://placehold.co/800x600/c9a55a/1a2a4f?text=Photo+3", caption: "Felicitation of academic achievers" },
      { src: "https://placehold.co/800x600/2b2b2b/c9a55a?text=Photo+4", caption: "Sports category awardees with the trustees" },
      { src: "https://placehold.co/800x600/1a2a4f/faf7f0?text=Photo+5", caption: "Community breakfast in the main hall" },
      { src: "https://placehold.co/800x600/0f1c3a/faf7f0?text=Photo+6", caption: "Group photo with all the honourees" }
    ]
  },
  {
    title: "Diwali Snehmilan 2024",
    date: "2024-11-09",
    gujaratiDate: "Kartak Sud 8, V.S. 2081",
    time: "7:00 PM – 10:00 PM",
    city: "Ahmedabad",
    venue: "H.K. Hall, Ashram Road, Ahmedabad",
    description: "Annual Diwali get-together with games, dinner and the unveiling of the November edition.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Diwali+Snehmilan",
    link: "#",
    details: "An evening of warmth, light and laughter. Members from across Ahmedabad and surrounding cities joined for a traditional Diwali snehmilan with games for all age groups, a community dinner, and the unveiling of the November Hitechchhu edition.",
    highlights: [
      { number: "380", label: "Members attended" },
      { number: "15",  label: "Games & activities" },
      { number: "1",   label: "Edition unveiled" }
    ],
    gallery: [
      { src: "https://placehold.co/800x600/c9a55a/1a2a4f?text=Diwali+1", caption: "Lamp lighting ceremony to open the evening" },
      { src: "https://placehold.co/800x600/1a2a4f/c9a55a?text=Diwali+2", caption: "Traditional rangoli at the entrance" },
      { src: "https://placehold.co/800x600/0f1c3a/c9a55a?text=Diwali+3", caption: "Children's games corner in full swing" },
      { src: "https://placehold.co/800x600/c9a55a/0f1c3a?text=Diwali+4", caption: "Unveiling of the November edition cover" }
    ]
  },
  {
    title: "Career & College Counselling Day",
    date: "2024-06-15",
    gujaratiDate: "Jeth Sud 9, V.S. 2081",
    time: "10:00 AM – 4:00 PM",
    city: "Surat",
    venue: "SVNIT Auditorium, Surat",
    description: "Free counselling for Class 10/12 students and parents from community mentors and educators.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Career+Day",
    link: "#",
    details: "A free, full-day counselling event for community students and parents navigating Class 10 and 12 transitions. Sessions covered stream selection, college shortlisting, scholarship opportunities and emerging career paths.",
    highlights: [
      { number: "180", label: "Students counselled" },
      { number: "9",   label: "Mentors" },
      { number: "20+", label: "Colleges discussed" }
    ],
    gallery: [
      { src: "https://placehold.co/800x600/1a2a4f/faf7f0?text=Counselling+1", caption: "Opening keynote on stream selection" },
      { src: "https://placehold.co/800x600/0f1c3a/c9a55a?text=Counselling+2", caption: "One-on-one mentor sessions in the breakout hall" },
      { src: "https://placehold.co/800x600/c9a55a/1a2a4f?text=Counselling+3", caption: "Scholarship information desk with parents" }
    ]
  },
  {
    title: "Health Check-up Camp",
    date: "2024-03-10",
    gujaratiDate: "Phagan Vad Amavasya, V.S. 2080",
    time: "8:00 AM – 2:00 PM",
    city: "Rajkot",
    venue: "Community Hall, Race Course, Rajkot",
    description: "Free general health check-up, eye and dental screening for community members.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Health+Camp",
    link: "#",
    details: "A free preventive health camp organised in partnership with three community-led clinics. General physician consultations, eye screening, dental check-ups and BMI assessments were available throughout the morning.",
    highlights: [
      { number: "240", label: "Members screened" },
      { number: "4",   label: "Specialities" },
      { number: "12",  label: "Doctors & staff" }
    ],
    gallery: [
      { src: "https://placehold.co/800x600/1a2a4f/c9a55a?text=Health+1", caption: "General physician consultation desk" },
      { src: "https://placehold.co/800x600/c9a55a/1a2a4f?text=Health+2", caption: "Eye screening room with the visiting team" }
    ]
  },
  {
    title: "Annual Trust Meeting 2023",
    date: "2023-12-17",
    gujaratiDate: "Margshar Sud 5, V.S. 2080",
    time: "11:00 AM – 2:00 PM",
    city: "Ahmedabad",
    venue: "Trust Office, Satellite, Ahmedabad",
    description: "Year-end trustees meeting and announcement of the 2024 publication calendar.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Trust+Meeting",
    link: "#"
  },
  {
    title: "Navratri Garba Night",
    date: "2023-10-21",
    gujaratiDate: "Aaso Sud 7, V.S. 2080",
    time: "8:00 PM – 12:00 AM",
    city: "Vadodara",
    venue: "United Way Garba Ground, Vadodara",
    description: "Traditional Garba night for the community with live orchestra and Gujarati food stalls.",
    image: "https://placehold.co/600x360/1a2a4f/c9a55a?text=Navratri+Garba",
    link: "#",
    details: "Four hours of traditional Garba and Raas under one roof, with a live orchestra, professional choreography for newcomers, and a curated Gujarati food court with eight stalls.",
    highlights: [
      { number: "1,200", label: "Attendees" },
      { number: "4",     label: "Hours of Garba" },
      { number: "8",     label: "Food stalls" }
    ],
    gallery: [
      { src: "https://placehold.co/800x600/c9a55a/1a2a4f?text=Garba+1", caption: "Traditional aarti before the Garba began" },
      { src: "https://placehold.co/800x600/1a2a4f/c9a55a?text=Garba+2", caption: "Community elders leading the first round" },
      { src: "https://placehold.co/800x600/0f1c3a/c9a55a?text=Garba+3", caption: "Raas circle in full flow at midnight" },
      { src: "https://placehold.co/800x600/c9a55a/0f1c3a?text=Garba+4", caption: "Live orchestra on the main stage" },
      { src: "https://placehold.co/800x600/2b2b2b/c9a55a?text=Garba+5", caption: "Gujarati food stalls along the perimeter" }
    ]
  }
];
