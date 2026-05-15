/* ============================================================
   Brahmakshatriya Hitechchhu - Spreadsheet -> JS data parser
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
     . One row per line. One TAB between cells.
     . Empty cells are allowed (just leave nothing between tabs).
     . Cell text cannot contain a real tab or newline. To force a
       line break inside a cell, write \n (two characters) - the
       parser converts it to a real newline.
     . Lines starting with `#` are treated as comments and skipped.

   ============================================================
   HELPERS EXPOSED GLOBALLY (via the IIFE at the bottom)
   ============================================================
     . parseTSV(template)            -> array of {col: value, ...}
     . parseList(cell, [fields])     -> array of {field: value, ...}

   Both helpers are ULTRA-defensive:
     . Bad / missing input never throws - they return [] instead.
     . Errors are logged to the browser console (with the data
       file's name) so you can debug without the site crashing.
============================================================ */


// ------------------------------------------------------------------
// IIFE wrapper - everything runs in a private scope so we don't leak
// internal helpers onto `window`. Only parseTSV and parseList are
// exposed at the bottom of this file.
// ------------------------------------------------------------------
(function (global) {
  // 'use strict' enforces stricter parsing + error handling, e.g.
  // assigning to undeclared variables throws instead of silently
  // creating globals. Standard hygiene for any module.
  'use strict';

  // ----------------------------------------------------------------
  // parseTSV - the main public helper.
  // Takes a tab-separated template literal, returns an array of
  // objects keyed by the header row.
  //
  // Example:
  //   parseTSV(`name\tage
  //             Alice\t30
  //             Bob\t27`)
  //   -> [{name: "Alice", age: "30"}, {name: "Bob", age: "27"}]
  //
  // The optional `tag` arg (e.g. "events.js") is used in console
  // warnings so editors can tell which data file produced an issue.
  // ----------------------------------------------------------------
  /**
   * Parse a tab-separated template-literal block into row objects.
   *
   * @param  {string} tsv   The raw template-literal block.
   * @param  {string} [tag] Optional label for console warnings.
   * @return {Array<Object>} Always returns an array (never null).
   */
  function parseTSV(tsv, tag) {
    // Wrap the whole body in try/catch so a malformed input file
    // can never crash the page - we'd much rather render an empty
    // section than a white screen.
    try {
      // Defensive: if someone passes non-string input by mistake,
      // log a warning and bail out with [] so callers don't crash.
      if (typeof tsv !== 'string') {
        // Warn (not error) because this is recoverable; the caller
        // gets [] and renders an empty state.
        console.warn(
          `[parseTSV${tag ? ' ' + tag : ''}] expected a string, got`,
          typeof tsv
        );
        // Returning [] keeps every loader's contract intact.
        return [];
      }

      // Split the input into lines.
      const lines = tsv
        // Standard newline split - works for both \n and \r\n inputs
        // because we strip the trailing \r in the next step.
        .split('\n')
        // Strip trailing CR characters (Windows-style line endings)
        // so equality / regex checks behave the same on every OS.
        .map((l) => l.replace(/\r$/, ''))
        // Drop two kinds of lines:
        //   - Pure whitespace (l.trim() === '') - blank separators
        //     editors add for readability.
        //   - Comments (l.trim() starts with '#') - section markers
        //     like "# === Year 2025 ===" or "# Add new rows below".
        .filter((l) => l.trim().length > 0 && !l.trim().startsWith('#'));

      // If everything got filtered out (no header, no rows) the
      // file is effectively empty. Warn and bail.
      if (!lines.length) {
        console.warn(`[parseTSV${tag ? ' ' + tag : ''}] no data rows found`);
        return [];
      }

      // The FIRST surviving line is the header row.
      // We split it on tabs and trim each cell to get column names.
      const headers = lines[0].split('\t').map((h) => h.trim());

      // Edge case: the header line exists but every cell is blank.
      // That means the editor pasted blank header cells - nothing
      // we can usefully do, so warn and bail.
      if (!headers.length || headers.every((h) => h === '')) {
        console.warn(`[parseTSV${tag ? ' ' + tag : ''}] header row is empty`);
        return [];
      }

      // For every line AFTER the header, build a {column: value}
      // object using the headers as keys.
      return lines.slice(1).map((line, rowIdx) => {
        // Split this row into individual cell values.
        const cells = line.split('\t');
        // Build the object incrementally.
        const row = {};
        // Walk the headers (not the cells) so missing trailing cells
        // become empty-string values instead of `undefined`.
        headers.forEach((h, i) => {
          // Defensive: cells[i] might be undefined if the row has
          // fewer cells than headers - default to '' in that case.
          let val = (cells[i] != null ? cells[i] : '').trim();
          // Replace the literal escape sequence "\n" (two chars)
          // with a real newline. Excel can't put real newlines in
          // a single clipboard row, so editors type \n manually
          // when they need a line break inside a long cell.
          val = val.replace(/\\n/g, '\n');
          // Assign to the header-named key.
          row[h] = val;
        });

        // If this row had MORE cells than headers, log a friendly
        // warning so the editor can spot a stray tab in their
        // pasted text. We still return the row - we just ignore
        // the extra cells.
        if (cells.length > headers.length) {
          console.warn(
            `[parseTSV${tag ? ' ' + tag : ''}] row ${rowIdx + 1} has ${cells.length} cells but only ${headers.length} headers - extra cells ignored`
          );
        }

        // Return the freshly built row - .map() collects them into
        // the final array.
        return row;
      });

    } catch (err) {
      // Catastrophic, unexpected failure (e.g. some future browser
      // quirk). Log it loudly and return [] so the site survives.
      console.error(`[parseTSV${tag ? ' ' + tag : ''}] failed:`, err);
      return [];
    }
  }


  // ----------------------------------------------------------------
  // parseList - the second public helper.
  // Takes a single cell that holds a packed list of objects, and
  // returns a real JS array.
  //
  //   parseList("500+||Attendees;;12||Speakers", ["number","label"])
  //   -> [
  //        {number: "500+", label: "Attendees"},
  //        {number: "12",   label: "Speakers"}
  //      ]
  //
  // The encoding:
  //   ;; (two semicolons) separates one item from the next
  //   || (two pipes)      separates the fields within an item
  //
  // We chose ;; and || because they almost never appear in the
  // real text editors paste (a single ; or | is fine - only the
  // doubled forms are reserved).
  // ----------------------------------------------------------------
  /**
   * Parse a packed-list cell into an array of objects.
   *
   * @param  {string} cell    The raw cell text. Empty / missing -> [].
   * @param  {Array<string>} fields  Field names in left-to-right order.
   * @return {Array<Object>}  Always an array (never null).
   */
  function parseList(cell, fields) {
    // try/catch for the same reason as parseTSV - never let a
    // malformed cell crash the page.
    try {
      // Empty / missing / whitespace-only cell -> empty list.
      // (String() coerces non-string input safely.)
      if (!cell || !String(cell).trim()) return [];

      // Defensive: caller forgot to pass field names. Without them
      // we don't know how to label the resulting object keys, so
      // return [] and warn.
      if (!Array.isArray(fields) || !fields.length) {
        console.warn('[parseList] fields[] is missing or empty');
        return [];
      }

      // Coerce + split + trim + filter + map into the final array.
      return String(cell)
        // Split items on the doubled-semicolon delimiter.
        .split(';;')
        // Trim whitespace around each item.
        .map((item) => item.trim())
        // Drop empty items (e.g. trailing ";;" makes a ghost item).
        .filter(Boolean)
        // Convert each item string into an object.
        .map((item) => {
          // Split THIS item's fields on the doubled-pipe delimiter.
          const parts = item.split('||');
          // Build the object incrementally.
          const obj = {};
          // Walk the field-name list (not the parts) so missing
          // trailing parts become empty-string values, not undefined.
          fields.forEach((f, i) => {
            // Defensive null-check, then trim.
            obj[f] = (parts[i] != null ? parts[i] : '').trim();
          });
          // Return the built object - .map() collects all of them.
          return obj;
        });

    } catch (err) {
      // Same defensive logging as parseTSV.
      console.error('[parseList] failed:', err);
      return [];
    }
  }


  // ----------------------------------------------------------------
  // Expose helpers globally.
  // The data files (js/data/*.js) are loaded as plain <script> tags
  // - no module system - so they need parseTSV and parseList on the
  // window object to be able to call them.
  // ----------------------------------------------------------------
  global.parseTSV  = parseTSV;
  global.parseList = parseList;

// Pass the global window object into our IIFE wrapper.
})(window);
