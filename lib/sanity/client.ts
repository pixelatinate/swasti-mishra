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
  title: string;
  url: string;
  category: "Wrote" | "Contributed";
  release?: string;
  archiveUrl?: string;
  order?: number;
};

export async function getWritingLinks(): Promise<WritingLink[]> {
  if (!projectId) return [];
  return getClient().fetch(
    `*[_type == "writingLink"] | order(category asc, order asc){ _id, title, url, category, release, archiveUrl, order }`
  );
}
