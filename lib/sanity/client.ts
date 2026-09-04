import { createClient, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

let cachedClient: SanityClient | null = null;

function getClient(): SanityClient {
  if (!cachedClient) {
    cachedClient = createClient({ projectId, dataset, apiVersion, useCdn: true });
  }
  return cachedClient;
}

export type WritingLink = {
  _id: string;
  section: "Page" | "Release Note";
  title: string;
  url: string;
  category: "Wrote" | "Contributed";
  product?: "Databricks" | "MATLAB";
  release?: string;
  archiveUrl?: string;
  driveUrl?: string;
  order?: number;
  changeType?: string;
  summary?: string;
};

export async function getWritingLinks(): Promise<WritingLink[]> {
  if (!projectId) return [];
  return getClient().fetch(
    `*[_type == "writingLink"] | order(category asc, order asc){ _id, section, title, url, category, product, release, archiveUrl, driveUrl, order, changeType, summary }`
  );
}
