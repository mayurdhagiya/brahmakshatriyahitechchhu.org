# How to update the site's data from Excel

You don't need to know JavaScript to edit any of the data on this site.
Each section (Editions, Trustees, Network, Events) has a corresponding
**`.js`** file in `js/data/` — and inside each file is a tab-separated
table that mirrors a spreadsheet exactly.

This folder (`data/excel-templates/`) holds **CSV starter files** with
the right column headers. Open them in Excel / Google Sheets, fill in
your rows, then paste back into the matching `js/data/*.js` file.

---

## The 3-step update workflow

1. **Open the Excel template** for the section you want to update:
   - `editions.csv` → monthly magazine issues
   - `trustees.csv` → trustee cards on the Trustees page
   - `network.csv`  → regional contacts on the Network page
   - `events.csv`   → community events page
   - `ads.csv`      → display + classified ads on the Ads page

   Excel will preserve the header row. Add or edit data rows below it
   like you would any spreadsheet.

2. **In Excel, select the data rows you want to publish** (don't include
   the header row), then **Copy** (Cmd-C / Ctrl-C).

3. **Open the matching `js/data/<file>.js`** in any text editor. You'll
   see a block that looks like this:

   ```js
   const editionsData = parseTSV(`
   year	date	title	volume	cover	link
   2025	2025-05-01	May 2025	Vol. 47, Issue 5	...
   ...
   `).map(...);
   ```

   Place your cursor on a new line just below the header row (or below
   the last existing data row), then **Paste**. Save the file. Reload
   the site. Done.

> **Tip — replacing all data instead of appending:**
> Select the existing data lines (everything between the header row
> and the closing backtick), delete them, then paste your new rows.

---

## Field-by-field reference

### `editions.csv`

| Column   | What to write                                            |
| -------- | -------------------------------------------------------- |
| `year`   | 4-digit year (e.g. `2025`)                               |
| `date`   | `YYYY-MM-DD` issue date — the newest auto-becomes "Current Edition" |
| `title`  | Display title (e.g. `May 2025`)                          |
| `volume` | Volume / issue label (e.g. `Vol. 47, Issue 5`)           |
| `cover`  | URL to the cover image (300×400 looks best)              |
| `link`   | URL to the full PDF or page; use `#` if not yet uploaded |

### `trustees.csv`

| Column        | What to write                                                |
| ------------- | ------------------------------------------------------------ |
| `name`        | Full name                                                    |
| `designation` | One of: `President`, `Vice President`, `Secretary`, `Treasurer`, `Trustee` |
| `bio`         | One-line bio shown on the card                               |
| `image`       | Square portrait URL                                          |
| `phone`       | Full international phone (e.g. `+919876543210`)              |
| `whatsapp`    | WhatsApp number, digits only with country code               |
| `email`       | Email address                                                |
| `facebook`    | Full Facebook profile URL, or `#` for none                   |
| `twitter`     | Full Twitter / X profile URL, or `#`                         |
| `linkedin`    | Full LinkedIn profile URL, or `#`                            |

### `network.csv`

| Column          | What to write                          |
| --------------- | -------------------------------------- |
| `state`         | Indian state name                      |
| `city`          | City / town                            |
| `contactPerson` | Name of regional contact               |
| `mobile`        | 10-digit mobile (no country code)      |
| `whatsapp`      | WhatsApp digits with country code      |
| `address`       | Full street address                    |

### `events.csv`

The first nine columns are simple text — just fill them in:

| Column         | What to write                                     |
| -------------- | ------------------------------------------------- |
| `title`        | Event name                                        |
| `date`         | `YYYY-MM-DD` — drives Upcoming vs Past automatically |
| `gujaratiDate` | Vikram Samvat tithi (e.g. `Maha Sud 8, V.S. 2081`) |
| `time`         | Display time (e.g. `10:00 AM – 6:00 PM`)          |
| `city`         | Used by the Location filter                       |
| `venue`        | Full venue + street (used to render the embedded map) |
| `description`  | Short blurb for the card                          |
| `image`        | Cover image URL (16:9, around 600×360)            |
| `link`         | RSVP / album URL; use `#` for none                |
| `details`      | Long description for the modal                    |

The last three columns hold **lists** packed into a single cell:

- `highlights` — `number||label;;number||label;;...`
  Example: `500+||Attendees;;12||Speakers;;Free||Open to all`

- `agenda` — `time||title;;time||title;;...`
  Example: `10:00 AM||Registration;;11:00 AM||Keynote`

- `gallery` — `imageURL||caption;;imageURL||caption;;...`
  Example: `https://...img1.jpg||Felicitation;;https://...img2.jpg||Group photo`

> Use `;;` (two semicolons) to separate list items, and `||` (two pipes)
> to separate fields inside one item. Leave the cell empty to skip the
> section.

### `ads.csv`

| Column          | What to write                                                 |
| --------------- | ------------------------------------------------------------- |
| `type`          | `display` (with image) or `classified` (text-only)            |
| `category`      | `Matrimonial`, `Property`, `Jobs`, `Business`, `Services`, `Education`, `Vehicles` or `Other` |
| `title`         | Short headline shown on the card                              |
| `description`   | Body text / ad copy                                           |
| `advertiser`    | Name of person or business placing the ad                     |
| `city`          | City — drives the City filter dropdown                        |
| `image`         | Image URL (only for `type=display`; leave blank for classifieds) |
| `publishedDate` | `YYYY-MM-DD` when the ad was published (newest sorts first)   |
| `validUntil`    | `YYYY-MM-DD` — the ad **auto-hides** after this date passes   |
| `phone`         | Full international phone for the Call button                  |
| `whatsapp`      | WhatsApp number, digits only, country code first              |
| `email`         | Email address for the Email button                            |

> Visitors get one-tap **Call**, **WhatsApp** and **Email** buttons on
> every ad. The WhatsApp link pre-fills a polite message referencing
> the ad title — they just need to hit send.

---

## Common pitfalls

- **Don't paste the header row** when adding new data — the JS file
  already has its own header row.
- **Avoid tab and newline characters inside cells** — they break the
  table structure. If you really need a line break inside the long
  `details` field, type `\n` (backslash + n, two characters) and the
  parser will turn it into a real line break.
- **Save the `.js` file as plain UTF-8 text** — most editors do this
  by default. Don't save it as RTF or Word format.
- **Test locally** by opening `index.html` in a browser, or by running
  `python3 -m http.server` from the project root and visiting
  `http://localhost:8000/`.
