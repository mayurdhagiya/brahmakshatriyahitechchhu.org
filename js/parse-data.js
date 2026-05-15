/* ============================================================
   Brahmakshatriya Hitechchhu - Spreadsheet → JS data parser
   ------------------------------------------------------------
   Lets every data file in js/data/ keep its data in a copy-paste
   friendly tab-separated block (exactly the format Excel puts on
   the clipboard when you copy rows). No more wrestling with
   { commas, "quotes", and: braces } when adding a new entry.

   ============================================================
   WORKFLOW FOR EDITORS
   ============================================================
     1. Open the matching js/data/<file>.js in any text editor.
     2. In Excel / Google Sheets, select the row(s) you want to
        add - including ONLY data rows, not the header - and copy.
     3. Paste at the bottom of the table (just before the closing
        backtick `).
     4. Save. Reload the site.

   ============================================================
   RULES FOR CELL VALUES
   ============================================================
     • One row per line. One TAB between cells.
     • Empty cells are allowed (just leave nothing between tabs).
     • Cell text cannot contain a real tab or newline. To force a
       line break inside a cell, write \n (two characters) - the
       parser converts it to a real newline.
     • Lines starting with `#` are treated as comments and skipped.

   ============================================================
   HELPERS EXPOSED GLOBALLY
   ============================================================
     • parseTSV(template)            → array of {col: value, …}
     • parseList(cell, [fields])     → array of {field: value, …}

   Both helpers are ULTRA-defensive:
     • Bad/missing input never throws - they return [] instead.
     • Errors are logged to the browser console (with the data
       file's name) so you can debug without the site crashing.
============================================================ */

(function (global) {
  'use strict';

  /**
   * parseTSV - turn a tab-separated template literal into an array
   * of objects keyed by the header row.
   *
   * @param  {string} tsv   The raw template-literal block.
   * @param  {string} [tag] Optional label used in console warnings
   *                        so you can tell which file produced an
   *                        error (e.g. "events.js").
   * @return {Array<Object>} Always returns an array (never null).
   */
  function parseTSV(tsv, tag) {
    try {
      // Defensive: if someone hands us non-string input, bail with [].
      if (typeof tsv !== 'string') {
        console.warn(`[parseTSV${tag ? ' ' + tag : ''}] expected a string, got`, typeof tsv);
        return [];
      }

      // Split into lines, trim line-ending CR, drop blanks + comments.
      const lines = tsv
        .split('\n')
        .map((l) => l.replace(/\r$/, ''))                      // Windows CR
        .filter((l) => l.trim().length > 0 && !l.trim().startsWith('#'));

      if (!lines.length) {
        console.warn(`[parseTSV${tag ? ' ' + tag : ''}] no data rows found`);
        return [];
      }

      // Header row = first non-blank line.
      const headers = lines[0].split('\t').map((h) => h.trim());

      if (!headers.length || headers.every((h) => h === '')) {
        console.warn(`[parseTSV${tag ? ' ' + tag : ''}] header row is empty`);
        return [];
      }

      // Parse each subsequent line into an object keyed by headers.
      return lines.slice(1).map((line, rowIdx) => {
        const cells = line.split('\t');
        const row = {};
        headers.forEach((h, i) => {
          // Empty / missing cell → empty string (never undefined).
          let val = (cells[i] != null ? cells[i] : '').trim();
          // \n typed in Excel becomes a real newline (Excel can't hold
          // newlines in clipboard rows, so this is the manual escape).
          val = val.replace(/\\n/g, '\n');
          row[h] = val;
        });

        // Helpful warning if a row has more cells than headers - usually
        // means a stray tab in someone's pasted text.
        if (cells.length > headers.length) {
          console.warn(
            `[parseTSV${tag ? ' ' + tag : ''}] row ${rowIdx + 1} has ${cells.length} cells but only ${headers.length} headers - extra cells ignored`
          );
        }

        return row;
      });
    } catch (err) {
      // Catastrophic failure - log it but never break the page.
      console.error(`[parseTSV${tag ? ' ' + tag : ''}] failed:`, err);
      return [];
    }
  }

  /**
   * parseList - turn a single cell that holds an array of objects
   * into a real JS array. Items are separated by `;;`, fields within
   * an item by `||`.
   *
   *   parseList("500+||Attendees;;12||Speakers", ["number","label"])
   *   → [ {number:"500+", label:"Attendees"}, {number:"12", label:"Speakers"} ]
   *
   * @param  {string} cell    The raw cell text. Empty/missing → [].
   * @param  {Array<string>} fields  Field names in left-to-right order.
   * @return {Array<Object>}  Always an array (never null).
   */
  function parseList(cell, fields) {
    try {
      if (!cell || !String(cell).trim()) return [];
      if (!Array.isArray(fields) || !fields.length) {
        console.warn('[parseList] fields[] is missing or empty');
        return [];
      }
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
    } catch (err) {
      console.error('[parseList] failed:', err);
      return [];
    }
  }

  // Expose helpers on `window` so data files can reach them.
  global.parseTSV  = parseTSV;
  global.parseList = parseList;
})(window);
