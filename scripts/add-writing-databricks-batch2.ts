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

// Databricks Lakeflow Connect pages Swasti named directly, plus every page
// the Data format options page (already on the site) links out to.
const entries = [
  // Named directly (2026-09-20)
  {
    title: "Managed database connectors",
    url: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/cdc-overview",
  },
  {
    title: "Managed SaaS connectors",
    url: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/saas-overview",
  },
  {
    title: "File connectors",
    url: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/file-connectors-overview",
  },
  {
    title: "Streaming connectors",
    url: "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/streaming-overview",
  },
  {
    title: "Community connectors in Lakeflow Connect",
    url: "https://docs.databricks.com/aws/en/ingestion/community-connectors",
  },
  {
    title: "Build a custom connector for Lakeflow Connect",
    url: "https://docs.databricks.com/aws/en/ingestion/custom-connectors",
  },
  // Linked out from "Data format options" (docs.databricks.com/aws/en/query/formats/)
  { title: "What is Delta Lake in Databricks?", url: "https://docs.databricks.com/aws/en/delta/" },
  { title: "What is Apache Iceberg in Databricks?", url: "https://docs.databricks.com/aws/en/iceberg/" },
  {
    title: "Read OpenSharing shared tables using Apache Spark DataFrames",
    url: "https://docs.databricks.com/aws/en/query/formats/opensharing",
  },
  { title: "Read and write Parquet files", url: "https://docs.databricks.com/aws/en/query/formats/parquet" },
  { title: "Read and write ORC files", url: "https://docs.databricks.com/aws/en/query/formats/orc" },
  { title: "Read and write JSON files", url: "https://docs.databricks.com/aws/en/query/formats/json" },
  { title: "Read and write CSV files", url: "https://docs.databricks.com/aws/en/query/formats/csv" },
  { title: "Read and write XML files", url: "https://docs.databricks.com/aws/en/query/formats/xml" },
  { title: "Read and write text files", url: "https://docs.databricks.com/aws/en/query/formats/text" },
  { title: "Read and write Avro files", url: "https://docs.databricks.com/aws/en/query/formats/avro" },
  {
    title: "Read MLflow experiments",
    url: "https://docs.databricks.com/aws/en/query/formats/mlflow-experiment",
  },
  { title: "Work with unstructured data", url: "https://docs.databricks.com/aws/en/unstructured/" },
  { title: "Read binary files", url: "https://docs.databricks.com/aws/en/query/formats/binary" },
  { title: "Read image files", url: "https://docs.databricks.com/aws/en/query/formats/image" },
  { title: "FILE type and unstructured data", url: "https://docs.databricks.com/aws/en/unstructured/file" },
  { title: "Model semi-structured data", url: "https://docs.databricks.com/aws/en/semi-structured/" },
  { title: "Query variant data", url: "https://docs.databricks.com/aws/en/semi-structured/variant" },
  {
    title: "Transform complex data types",
    url: "https://docs.databricks.com/aws/en/semi-structured/complex-types",
  },
  {
    title: "Higher-order functions",
    url: "https://docs.databricks.com/aws/en/semi-structured/higher-order-functions",
  },
];

async function main() {
  const existing: string[] = await client.fetch(`*[_type == "writingLink"].url`);

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
