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
  title: string;
  url: string;
  category: "Wrote" | "Contributed";
  order: number;
};

// New pages from the user's 2026-08-29 list that aren't already represented
// (by an exact-URL match or a version-pinned equivalent) among the 5 docs
// seeded by scripts/seed-writing.ts.
const newEntries: WritingLinkEntry[] = [
  {
    _type: "writingLink",
    title: "terminate",
    url: "https://www.mathworks.com/help/matlab/ref/matlab.pyclient.pythonenvironment.terminate.html",
    category: "Contributed",
    order: 3,
  },
  {
    _type: "writingLink",
    title: "pystringarray",
    url: "https://www.mathworks.com/help/matlab/ref/pystringarray.html",
    category: "Wrote",
    order: 5,
  },
  {
    _type: "writingLink",
    title: "Manage Python Environments Using External Languages Panel",
    url: "https://www.mathworks.com/help/matlab/matlab_external/manage-python-environments-using-external-languages-panel.html",
    category: "Wrote",
    order: 6,
  },
  {
    _type: "writingLink",
    title: "Use Python Datetime Types in MATLAB",
    url: "https://www.mathworks.com/help/matlab/matlab_external/use-python-datetime-types-in-matlab.html",
    category: "Wrote",
    order: 7,
  },
  {
    _type: "writingLink",
    title: "Use Python Duration Types in MATLAB",
    url: "https://www.mathworks.com/help/matlab/matlab_external/use-python-duration-types-in-matlab.html",
    category: "Wrote",
    order: 8,
  },
  {
    _type: "writingLink",
    title: "Limitations to Python Support",
    url: "https://www.mathworks.com/help/matlab/matlab_external/limitations-to-python-support.html",
    category: "Contributed",
    order: 4,
  },
  {
    _type: "writingLink",
    title: "Install MATLAB Engine API for Python",
    url: "https://www.mathworks.com/help/matlab/matlab_external/install-the-matlab-engine-for-python.html",
    category: "Wrote",
    order: 9,
  },
  {
    _type: "writingLink",
    title: "Pass Data Between MATLAB and Python from Python",
    url: "https://www.mathworks.com/help/matlab/matlab_external/pass-data-between-matlab-and-python-from-python.html",
    category: "Wrote",
    order: 10,
  },
  {
    _type: "writingLink",
    title: "Use MATLAB Tables and Timetables in Python",
    url: "https://www.mathworks.com/help/matlab/matlab_external/use-matlab-tables-and-timetables-in-python.html",
    category: "Wrote",
    order: 11,
  },
  {
    _type: "writingLink",
    title: "How MATLAB Handles Datetime and Duration Types in Python",
    url: "https://www.mathworks.com/help/matlab/matlab_external/use-matlab-datetime-and-duration-types-in-python.html",
    category: "Wrote",
    order: 12,
  },
  {
    _type: "writingLink",
    title: "Limitations to MATLAB Engine API for Python",
    url: "https://www.mathworks.com/help/matlab/matlab_external/limitations-to-the-matlab-engine-for-python.html",
    category: "Contributed",
    order: 5,
  },
];

async function run() {
  // The user confirmed "Use Python Dictionaries in MATLAB" should be
  // recategorized Contributed -> Wrote (its pinned R2024a URL stays as-is;
  // they want to keep that version since it's what they actually worked on).
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "writingLink" && url match "*python-dict-variables.html*"][0]{_id}`
  );

  const transaction = client.transaction();
  if (existing) {
    transaction.patch(existing._id, { set: { category: "Wrote", order: 4 } });
    console.log(`Patching ${existing._id} -> category: Wrote, order: 4`);
  } else {
    console.warn("Could not find the existing 'Use Python Dictionaries in MATLAB' doc to recategorize.");
  }

  for (const entry of newEntries) {
    transaction.create(entry);
  }

  const result = await transaction.commit();
  console.log(`Committed ${result.results.length} changes (1 patch + ${newEntries.length} new documents).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
