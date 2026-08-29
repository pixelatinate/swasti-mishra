import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN (write token) before running this script.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

type WritingLinkEntry = {
  _type: "writingLink";
  section: "Page" | "Release Note";
  title: string;
  url: string;
  category: "Wrote" | "Contributed";
  release?: string;
  order: number;
};

const RELEASE_NOTES_BASE =
  "https://www.mathworks.com/help/matlab/release-notes.html?startrelease=R2023a&endrelease=R2026a&category=desktop&category=graphics&category=performance&category=external-interfaces&rntext=&groupby=release&sortby=descending&searchHighlight=";

// 3 links from the user's 2026-08-29 paste that turned out to be regular
// pages (pinned to R2025a, or general), not release-notes.html anchors.
const newPages: WritingLinkEntry[] = [
  {
    _type: "writingLink",
    section: "Page",
    title: "When MATLAB Terminates Unexpectedly",
    url: "https://www.mathworks.com/help/releases/R2025a/matlab/matlab_env/when-the-matlab-program-terminates-unexpectedly.html",
    category: "Wrote",
    release: "R2025a",
    order: 13,
  },
  {
    _type: "writingLink",
    section: "Page",
    title: "matlab.crashhandling.crashReportFolder",
    url: "https://www.mathworks.com/help/releases/R2025a/matlab/ref/matlab.crashhandling.crashreportfolder.html",
    category: "Wrote",
    release: "R2025a",
    order: 14,
  },
  {
    _type: "writingLink",
    section: "Page",
    title: "bench",
    url: "https://www.mathworks.com/help/matlab/ref/bench.html",
    category: "Contributed",
    order: 6,
  },
];

// The 21 release-notes.html#anchor links, resolved to their actual note
// heading and release by walking the live page's DOM (each anchor's H4
// heading text, and the nearest preceding rngroup_R20XXx marker). order is
// assigned release-descending so the table reads newest-first without extra
// client-side sorting.
const releaseNotes: WritingLinkEntry[] = [
  {
    _type: "writingLink",
    section: "Release Note",
    title: "External Languages Panel: View, create, and manage Python environments in MATLAB",
    url: RELEASE_NOTES_BASE + "#mw_8fea9d8c-cc1d-4a96-98fc-9b6b0c229789",
    category: "Wrote",
    release: "R2026a",
    order: 1,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python: Support for CPython version 3.13",
    url: RELEASE_NOTES_BASE + "#mw_8bcb410d-c344-4222-90ed-b1839d15141b",
    category: "Wrote",
    release: "R2026a",
    order: 2,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Call Python from MATLAB: Automatically convert MATLAB string array to Python list",
    url: RELEASE_NOTES_BASE + "#mw_27b8be0a-f22c-4fc4-a5a2-7c4fc594a20d",
    category: "Wrote",
    release: "R2026a",
    order: 3,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "pystringarray Function: Convert MATLAB string arrays to NumPy string arrays",
    url: RELEASE_NOTES_BASE + "#mw_d4f9cc25-39dc-4a93-823c-6e37adf8fe68",
    category: "Wrote",
    release: "R2026a",
    order: 4,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Call Python from MATLAB: Compare two Python objects for equality",
    url: RELEASE_NOTES_BASE + "#mw_7d0084be-7803-4e79-a59c-62d3c8592722",
    category: "Wrote",
    release: "R2026a",
    order: 5,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "matlab.crashhandling.crashReportFolder Function: Locate crash report folder",
    url: RELEASE_NOTES_BASE + "#mw_0fa55284-5b3f-48c2-9355-ef8f20192c8a",
    category: "Wrote",
    release: "R2025a",
    order: 6,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Call MATLAB from Python: Automatically convert between Python and MATLAB datetime and duration types",
    url: RELEASE_NOTES_BASE + "#mw_167a626d-869a-4096-9661-eba4365c9ebb",
    category: "Wrote",
    release: "R2025a",
    order: 7,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title:
      "Call MATLAB from Python: Automatically convert between MATLAB tables, timetables, and Python Pandas DataFrames",
    url: RELEASE_NOTES_BASE + "#mw_a7c1dadd-3b88-4e3c-813f-29dc92069fcf",
    category: "Wrote",
    release: "R2025a",
    order: 8,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Call Python from MATLAB: Switch execution modes without restarting MATLAB",
    url: RELEASE_NOTES_BASE + "#mw_475942e8-6d03-4db1-82bc-fe451fb4523c",
    category: "Wrote",
    release: "R2025a",
    order: 9,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title:
      "Python interface converts MATLAB arrays to Python NumPy arrays when passed as input to Python functions",
    url: RELEASE_NOTES_BASE + "#mw_39425d64-b000-456f-a974-9564ab868a66",
    category: "Wrote",
    release: "R2025a",
    order: 10,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python: Support for CPython version 3.12",
    url: RELEASE_NOTES_BASE + "#mw_707b637e-781d-4258-9aaf-fb361c7a2975",
    category: "Wrote",
    release: "R2024b",
    order: 11,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Call Python from MATLAB: Follow Python type hints when passing data from MATLAB",
    url: RELEASE_NOTES_BASE + "#mw_aba2fffb-072a-4ebe-bd01-8393b20cf036",
    category: "Wrote",
    release: "R2024b",
    order: 12,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Call MATLAB from Python: Convert between Python and MATLAB dictionaries",
    url: RELEASE_NOTES_BASE + "#mw_8cb466e1-f370-4072-9cd1-f24293792b4f",
    category: "Wrote",
    release: "R2024b",
    order: 13,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python Interface: Convert between MATLAB tables and Python Pandas DataFrames",
    url: RELEASE_NOTES_BASE + "#mw_7ad2f7e1-43a2-4121-8b53-88a9a0660554",
    category: "Wrote",
    release: "R2024a",
    order: 14,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python Interface: Interactively run Python code with Run Python Live Editor Task",
    url: RELEASE_NOTES_BASE + "#mw_d0dad183-c293-4fcc-9bd7-70de34f35429",
    category: "Wrote",
    release: "R2024a",
    order: 15,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python Interface: Convert between MATLAB and Python dictionaries",
    url: RELEASE_NOTES_BASE + "#mw_83630296-6685-43a5-8b70-6ae56ae6436a",
    category: "Wrote",
    release: "R2024a",
    order: 16,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python: Support for version 3.11",
    url: RELEASE_NOTES_BASE + "#mw_e5a1cf19-ccc6-4500-a0ca-719852aef033",
    category: "Wrote",
    release: "R2023b",
    order: 17,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python Interface: Convert list and tuple of Python datetime or timedelta objects to MATLAB arrays",
    url: RELEASE_NOTES_BASE + "#mw_6c67c294-6fde-4131-b20f-ba5fd6b26ef3",
    category: "Wrote",
    release: "R2023b",
    order: 18,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python Interface: Convert between MATLAB datetime and Python datetime, NumPy datetime64 types",
    url: RELEASE_NOTES_BASE + "#mw_db672864-4991-493a-9105-5b9d28ab267e",
    category: "Wrote",
    release: "R2023a",
    order: 19,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python Interface: Convert between MATLAB duration and Python timedelta, NumPy timedelta64 types",
    url: RELEASE_NOTES_BASE + "#mw_05a6f3d1-5a5d-46aa-89be-b0ae77ba93ab",
    category: "Wrote",
    release: "R2023a",
    order: 20,
  },
  {
    _type: "writingLink",
    section: "Release Note",
    title: "Python Objects: Use Python objects as keys in dictionary",
    url: RELEASE_NOTES_BASE + "#mw_924bab79-883a-4c78-b884-bc0d4bbd3f93",
    category: "Wrote",
    release: "R2023a",
    order: 21,
  },
];

async function run() {
  // Backfill `section: "Page"` on every writingLink doc that predates this
  // field (the 17 docs from the first two seed scripts).
  const existingIds = await client.fetch<string[]>(`*[_type == "writingLink" && !defined(section)]._id`);
  const transaction = client.transaction();
  for (const id of existingIds) {
    transaction.patch(id, { set: { section: "Page" } });
  }
  console.log(`Backfilling section: "Page" on ${existingIds.length} existing documents.`);

  for (const entry of [...newPages, ...releaseNotes]) {
    transaction.create(entry);
  }

  const result = await transaction.commit();
  console.log(
    `Committed ${result.results.length} changes (${existingIds.length} backfill patches + ${newPages.length} new pages + ${releaseNotes.length} new release notes).`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
