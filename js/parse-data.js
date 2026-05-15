/* ============================================================
   Brahmakshatriya Hitechchhu — Spreadsheet → JS data parser
   ------------------------------------------------------------
   Lets every data file in js/data/ keep its data in a copy-paste
   friendly tab-separated block (exactly the format Excel puts on
   the clipboard when you copy rows). No more wrestling with
   { commas, "quotes", and: braces } when adding a new entry.

   Workflow for editors:
     1. Open the matching js/data/<file>.js in any text editor.
     2. In Excel / Google Sheets, select the row(s) you want to
        add — including ONLY data rows, not the header — and copy.
     3. Paste at the bottom of the table (just before the closing
        backtick `).
     4. Save. Reload the site.

   Rules for cell values:
     • One row per line. One TAB between cells.
     • Empty cells are allowed (just leave nothing between tabs).
     • Cell text cannot contain a real tab or newline. To force a
       line break inside a cell, write \n (two characters) — the
       parser converts it to a real newline.

   Helpers exposed globally:
     • parseTSV(template)            → array of {col: value, …}
     • parseList(cell, [fields])     → array of {field: value, …}
============================================================ */

(function (global) {
  'use strict';

  /**
   * Parse a tab-separated block (first non-blank line = headers).
   * Lines starting with `#` are treated as comments and skipped.
   */
  function parseTSV(tsv) {
    if (typeof tsv !== 'string') return [];
    const lines = tsv
      .split('\n')
      .map((l) => l.replace(/\r$/, ''))
      .filter((l) => l.trim().length > 0 && !l.trim().startsWith('#'));
    if (!lines.length) return [];

    const headers = lines[0].split('\t').map((h) => h.trim());

    return lines.slice(1).map((line) => {
      const cells = line.split('\t');
      const row = {};
      headers.forEach((h, i) => {
        let val = (cells[i] != null ? cells[i] : '').trim();
        // \n typed in a cell becomes a real newline (Excel can't hold
        // newlines in clipboard rows, so this is the manual escape).
        val = val.replace(/\\n/g, '\n');
        row[h] = val;
      });
      return row;
    });
  }

  /**
   * Parse a single cell that holds an array of objects.
   * Items separated by `;;`, fields within an item separated by `||`.
   *
   *   parseList("500+||Attendees;;12||Speakers", ["number","label"])
   *   → [ {number:"500+", label:"Attendees"}, {number:"12", label:"Speakers"} ]
   */
  function parseList(cell, fields) {
    if (!cell || !String(cell).trim()) return [];
    return String(cell)
      .split(';;')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const parts = item.split('||');
        const obj = {};
        fields.forEach((f, i) => {
          obj[f] = (parts[i] != null ? parts[i] : '').trim();
        });
        return obj;
      });
  }

  global.parseTSV = parseTSV;
  global.parseList = parseList;
})(window);
