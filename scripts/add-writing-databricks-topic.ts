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

// Cluster the data-format/data-type pages into their own "Data Formats"
// table within the Databricks Pages section, instead of the flat
// alphabetical list.
const dataFormatTitles = [
  "Data format options",
  "What is Delta Lake in Databricks?",
  "What is Apache Iceberg in Databricks?",
  "Read OpenSharing shared tables using Apache Spark DataFrames",
  "Read and write Parquet files",
  "Read and write ORC files",
  "Read and write JSON files",
  "Read and write CSV files",
  "Read and write XML files",
  "Read and write text files",
  "Read and write Avro files",
  "Read MLflow experiments",
  "Work with unstructured data",
  "Read binary files",
  "Read image files",
  "FILE type and unstructured data",
  "Model semi-structured data",
  "Query variant data",
  "Transform complex data types",
  "Higher-order functions",
];

async function main() {
  const docs: { _id: string; title: string }[] = await client.fetch(
    `*[_type == "writingLink" && product == "Databricks" && title in $titles]{_id, title}`,
    { titles: dataFormatTitles }
  );

  const found = new Set(docs.map((d) => d.title));
  for (const title of dataFormatTitles) {
    if (!found.has(title)) console.warn(`WARNING: no doc found for "${title}"`);
  }

  const tx = client.transaction();
  for (const doc of docs) {
    tx.patch(doc._id, { set: { topic: "Data Formats" } });
    console.log(`tag: ${doc.title}`);
  }
  await tx.commit();
  console.log(`Tagged ${docs.length} docs.`);
}

main();
