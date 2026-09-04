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

async function main() {
  const result = await client.create({
    _type: "writingLink",
    section: "Page",
    title: "Tutorial: Develop a Databricks app with Streamlit",
    url: "https://docs.databricks.com/aws/en/dev-tools/databricks-apps/tutorial-streamlit",
    archiveUrl: "https://web.archive.org/web/20260904052946/https://docs.databricks.com/aws/en/dev-tools/databricks-apps/tutorial-streamlit",
    driveUrl: "https://drive.google.com/file/d/1RNAnkFxGzTIHaiSO0qGeidiRAgaRV73x/view?usp=drive_link",
    category: "Wrote",
  });
  console.log("Created:", result._id);
}

main();
