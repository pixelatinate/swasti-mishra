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
  release?: string;
  order: number;
};

const entries: WritingLinkEntry[] = [
  {
    _type: "writingLink",
    title: "Use MATLAB Dictionaries in Python",
    url: "https://www.mathworks.com/help/matlab/matlab_external/use-matlab-dictionaries-in-python.html",
    category: "Wrote",
    order: 1,
  },
  {
    _type: "writingLink",
    title: "Use Python Pandas DataFrames in MATLAB",
    url: "https://www.mathworks.com/help/releases/R2024a/matlab/matlab_external/python-pandas-dataframes.html",
    category: "Wrote",
    release: "R2024a",
    order: 2,
  },
  {
    _type: "writingLink",
    title: "Run Python Code",
    url: "https://www.mathworks.com/help/releases/R2024a/matlab/ref/runpythoncode.html",
    category: "Wrote",
    release: "R2024a",
    order: 3,
  },
  {
    _type: "writingLink",
    title: "Use Python Dictionaries in MATLAB",
    url: "https://www.mathworks.com/help/releases/R2024a/matlab/matlab_external/python-dict-variables.html",
    category: "Contributed",
    release: "R2024a",
    order: 1,
  },
  {
    _type: "writingLink",
    title: "Pass MATLAB Data to Python",
    url: "https://www.mathworks.com/help/matlab/matlab_external/passing-data-to-python.html",
    category: "Contributed",
    order: 2,
  },
];

async function seed() {
  const transaction = client.transaction();
  for (const entry of entries) {
    transaction.create(entry);
  }
  const result = await transaction.commit();
  console.log(`Created ${result.results.length} writingLink documents.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
