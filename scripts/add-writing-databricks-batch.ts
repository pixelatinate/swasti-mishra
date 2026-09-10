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

// Databricks page samples from Swasti's 2026-09 recruiter email.
const entries = [
  {
    title: "Auto Loader with file events overview",
    url: "https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/file-events-explained",
  },
  {
    title: "Data format options",
    url: "https://docs.databricks.com/aws/en/query/formats/",
  },
  {
    title: "Databricks Runtime 18 LTS",
    url: "https://docs.databricks.com/aws/en/release-notes/runtime/18",
  },
];

async function main() {
  const existing: string[] = await client.fetch(
    `*[_type == "writingLink"].url`
  );

  const tx = client.transaction();
  let count = 0;
  for (const entry of entries) {
    if (existing.includes(entry.url)) {
      console.log(`skip (already present): ${entry.title}`);
      continue;
    }
    tx.create({
      _type: "writingLink",
      section: "Page",
      product: "Databricks",
      category: "Wrote",
      title: entry.title,
      url: entry.url,
    });
    console.log(`create: ${entry.title}`);
    count += 1;
  }
  if (count === 0) {
    console.log("Nothing to create.");
    return;
  }
  await tx.commit();
  console.log(`Created ${count} docs.`);
}

main();
