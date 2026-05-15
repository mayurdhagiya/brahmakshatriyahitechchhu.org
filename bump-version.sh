#!/usr/bin/env bash
# =============================================================
#  Brahmakshatriya Hitechchhu — cache-bust helper
#  -------------------------------------------------------------
#  Run this ONE command after you make any update to CSS, JS or
#  data files. It rewrites the ?v=YYYY-MM-DD query string on
#  every CSS / JS reference in every HTML file, forcing all
#  browsers to download the fresh files instead of using their
#  cached copy.
#
#  Usage:
#    ./bump-version.sh                 # uses today's date
#    ./bump-version.sh 2026-06-14      # uses the date you give
#    ./bump-version.sh check           # just shows current versions
# =============================================================

set -euo pipefail
cd "$(dirname "$0")"

# -------------------------------------------------------------
#  Helper: print in colour so the output stands out
# -------------------------------------------------------------
GREEN='\033[0;32m'; YELLOW='\033[0;33m'; BLUE='\033[0;34m'; OFF='\033[0m'

# -------------------------------------------------------------
#  Decide what version to use
# -------------------------------------------------------------
NEW_VERSION="${1:-$(date +%F)}"   # default = today (YYYY-MM-DD)

# Special "check" mode → just report current versions and exit
if [ "$NEW_VERSION" = "check" ]; then
  echo -e "${BLUE}Current cache versions in HTML files:${OFF}"
  grep -h '?v=[0-9-]*' *.html 2>/dev/null \
    | grep -oE '\?v=[0-9-]*' \
    | sort -u \
    | sed 's/^/  /'
  exit 0
fi

# -------------------------------------------------------------
#  Sanity check: must look like YYYY-MM-DD or YYYY-MM-DD-NN
#  (a sub-counter suffix is handy when you ship more than once
#  in a single day — e.g. 2026-05-15, 2026-05-15-02, 2026-05-15-03)
# -------------------------------------------------------------
if ! [[ "$NEW_VERSION" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}(-[0-9]{1,3})?$ ]]; then
  echo "❌  Not a valid version: $NEW_VERSION"
  echo "    Use YYYY-MM-DD or YYYY-MM-DD-NN  (e.g. 2026-05-15  or  2026-05-15-02)"
  echo "    Usage: ./bump-version.sh [YYYY-MM-DD[-NN]|check]"
  exit 1
fi

# -------------------------------------------------------------
#  Find the existing version (assumes all files agree)
# -------------------------------------------------------------
OLD_VERSION="$(grep -h -oE '\?v=[0-9-]+' index.html 2>/dev/null | head -1 | sed 's/^?v=//' || true)"

if [ -z "$OLD_VERSION" ]; then
  echo "⚠️   No existing ?v=… stamps found. Adding $NEW_VERSION to every CSS/JS reference."
  for f in *.html; do
    perl -i -pe 's|(href="css/[^"?]+\.css)"|$1?v='"$NEW_VERSION"'"|g' "$f"
    perl -i -pe 's|(src="js/[^"?]+\.js)"|$1?v='"$NEW_VERSION"'"|g' "$f"
  done
elif [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
  echo -e "${YELLOW}ℹ️   Version is already $NEW_VERSION — nothing to do.${OFF}"
  echo "    (If you really want to force a re-stamp, pick a different version.)"
  exit 0
else
  echo -e "${BLUE}Bumping cache version:${OFF}  $OLD_VERSION  →  $NEW_VERSION"
  for f in *.html; do
    sed -i.bak "s|?v=$OLD_VERSION|?v=$NEW_VERSION|g" "$f"
    rm -f "$f.bak"
  done
fi

# -------------------------------------------------------------
#  Report what changed
# -------------------------------------------------------------
echo ""
echo -e "${GREEN}✓ Done.${OFF} Updated files:"
for f in *.html; do
  count="$(grep -c "?v=$NEW_VERSION" "$f" || true)"
  printf "  %-20s %s reference(s)\n" "$f" "$count"
done

echo ""
echo -e "${GREEN}Now upload the updated files. Every visitor — even those${OFF}"
echo -e "${GREEN}with old copies cached — will fetch the new versions.${OFF}"
