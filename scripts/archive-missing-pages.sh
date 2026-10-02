#!/bin/bash
# One-off helper: triggers a fresh Wayback Machine (Save Page Now) snapshot
# for every writingLink Page doc missing an archiveUrl, then prints
# "OK\t<docId>\t<archiveUrl>" (or "FAIL\t<docId>\t<url>") per line.
#
# Usage:
#   1. Dump the docs that need archiving to /tmp/need-archive.json, e.g.:
#      npx tsx -e "
#        import { createClient } from '@sanity/client';
#        const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: 'production', apiVersion: '2024-01-01', useCdn: false });
#        client.fetch('*[_type==\"writingLink\" && section==\"Page\" && !defined(archiveUrl)]{_id,url}').then(r => require('fs').writeFileSync('/tmp/need-archive.json', JSON.stringify(r)));
#      "
#   2. Run this script, capture the output, then patch each doc's
#      archiveUrl from the OK lines (see patch-release-notes-verbatim.ts
#      for the general shape of a patch script).
#
# archive.org rate-limits bursts (429) — if several lines come back FAIL,
# wait ~30-60s and re-run just the failed URLs with a longer `sleep`.
node -e "
const docs = require('/tmp/need-archive.json');
console.log(docs.map(d => d._id + '\t' + d.url).join('\n'));
" | while IFS=$'\t' read -r id url; do
  loc=$(curl -s -D - -o /dev/null --max-time 90 "https://web.archive.org/save/${url}" | grep -i '^location:' | sed 's/^[Ll]ocation: //' | tr -d '\r')
  if [ -z "$loc" ]; then
    echo "FAIL	$id	$url"
  else
    echo "OK	$id	$loc"
  fi
  sleep 2
done
