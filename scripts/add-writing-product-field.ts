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

// One-off migration: backfill the new `product` field on existing Page
// docs. The Databricks Streamlit tutorial gets "Databricks"; every other
// existing Page doc predates this field and is a MATLAB doc, so it gets
// "MATLAB". Release Note docs are untouched (product is Page-only).
async function main() {
  const pages: { _id: string; title: string }[] = await client.fetch(
    `*[_type == "writingLink" && section == "Page" && !defined(product)]{ _id, title }`
  );

  const tx = client.transaction();
  for (const page of pages) {
    const product = page.title === "Tutorial: Develop a Databricks app with Streamlit" ? "Databricks" : "MATLAB";
    tx.patch(page._id, { set: { product } });
    console.log(`${product}: ${page.title}`);
  }
  if (pages.length === 0) {
    console.log("Nothing to migrate.");
    return;
  }
  await tx.commit();
  console.log(`Patched ${pages.length} docs.`);
}

main();
