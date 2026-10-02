import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

// `notes` is a dump of every writingLink Release Note doc ({_id,title,url}),
// produced ad hoc before running this script — see the add-writing-* scripts
// in this folder for the GROQ query pattern used to build it.
const notes = JSON.parse(readFileSync("/tmp/release-notes.json", "utf8"));
const verbatim = JSON.parse(readFileSync(__dirname + "/release-notes-verbatim-texts.json", "utf8"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN (write token) before running this script.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

type Note = { _id: string; title: string; url: string };

async function main() {
  const tx = client.transaction();
  let count = 0;
  for (const note of notes as Note[]) {
    const anchor = new URL(note.url).hash.replace("#", "");
    const text = (verbatim as Record<string, string | null>)[anchor];
    if (!text) {
      console.warn(`WARNING: no verbatim text found for "${note.title}" (${anchor})`);
      continue;
    }
    tx.patch(note._id, { set: { summary: text } });
    console.log(`patch: ${note.title}`);
    count += 1;
  }
  await tx.commit();
  console.log(`Patched ${count} release notes with verbatim text.`);
}

main();
