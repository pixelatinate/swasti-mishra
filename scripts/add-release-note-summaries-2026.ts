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

// Original one- or two-sentence summaries, written from scratch after
// reading each MathWorks release note — not copied from their text, since
// that's their copyrighted documentation. Keyed by the #anchor fragment so
// each patch targets the right doc regardless of _id.
const summaries: Record<string, { summary: string; changeType?: string }> = {
  "mw_8fea9d8c-cc1d-4a96-98fc-9b6b0c229789": {
    summary:
      "A new External Languages panel in the MATLAB desktop sidebar lets you add, create, and switch between Python environments without touching the command line.",
  },
  "mw_8bcb410d-c344-4222-90ed-b1839d15141b": {
    summary: "Adds support for running MATLAB against CPython 3.13.",
  },
  "mw_27b8be0a-f22c-4fc4-a5a2-7c4fc594a20d": {
    summary:
      "1-by-N and N-by-1 MATLAB string arrays now convert to Python lists automatically when passed into a Python function.",
  },
  "mw_d4f9cc25-39dc-4a93-823c-6e37adf8fe68": {
    summary:
      "A new pystringarray function turns a MATLAB string array into a NumPy StringDType array (requires NumPy 2.0+).",
  },
  "mw_7d0084be-7803-4e79-a59c-62d3c8592722": {
    summary:
      "isequal and isequaln can now compare Python objects directly — including NumPy arrays — instead of erroring out on them.",
  },
  "mw_0fa55284-5b3f-48c2-9355-ef8f20192c8a": {
    summary: "A new function returns the filesystem path to MATLAB's crash report folder.",
  },
  "mw_167a626d-869a-4096-9661-eba4365c9ebb": {
    summary:
      "MATLAB datetime and duration values returned to Python now convert automatically to Python's datetime/timedelta types (or NumPy equivalents for arrays).",
  },
  "mw_a7c1dadd-3b88-4e3c-813f-29dc92069fcf": {
    summary:
      "MATLAB tables and timetables returned to Python now convert automatically into pandas DataFrames, and back again in the other direction.",
  },
  "mw_475942e8-6d03-4db1-82bc-fe451fb4523c": {
    summary:
      "You can flip the Python interpreter from out-of-process to in-process without restarting MATLAB, once the old process has been terminated.",
  },
  "mw_39425d64-b000-456f-a974-9564ab868a66": {
    changeType: "Behavior change",
    summary:
      "When NumPy is available, MATLAB arrays passed into Python functions now convert to NumPy arrays by default instead of Python array.array objects.",
  },
  "mw_707b637e-781d-4258-9aaf-fb361c7a2975": {
    summary: "Adds support for CPython 3.12.",
  },
  "mw_aba2fffb-072a-4ebe-bd01-8393b20cf036": {
    summary:
      "MATLAB now respects a Python function's type hints, converting a floating-point value to a Python int when the hint calls for one.",
  },
  "mw_8cb466e1-f370-4072-9cd1-f24293792b4f": {
    summary:
      "Passing a Python dict into MATLAB is easier: convert it to a matlab.dictionary first. MATLAB dictionaries can now be handed back to Python the same way.",
  },
  "mw_7ad2f7e1-43a2-4121-8b53-88a9a0660554": {
    summary:
      "MATLAB tables and timetables can now be passed straight into Python functions as pandas DataFrames, and converted back with table()/timetable().",
  },
  "mw_d0dad183-c293-4fcc-9bd7-70de34f35429": {
    summary:
      "A new Live Editor task runs Python code interactively and passes variables back and forth with MATLAB, without hand-writing pyrun calls.",
  },
  "mw_83630296-6685-43a5-8b70-6ae56ae6436a": {
    summary:
      "MATLAB dictionaries can now be passed directly into Python functions as native dicts, and converted back with dictionary().",
  },
  "mw_e5a1cf19-ccc6-4500-a0ca-719852aef033": {
    summary: "Adds support for CPython 3.11.",
  },
  "mw_6c67c294-6fde-4131-b20f-ba5fd6b26ef3": {
    summary:
      "A list or tuple of Python datetime/timedelta objects returned from a Python function can now be converted into a single MATLAB datetime/duration array.",
  },
  "mw_db672864-4991-493a-9105-5b9d28ab267e": {
    summary: "MATLAB datetime values can now convert to and from Python's datetime and NumPy's datetime64 types.",
  },
  "mw_05a6f3d1-5a5d-46aa-89be-b0ae77ba93ab": {
    summary: "MATLAB duration values can now convert to and from Python's timedelta and NumPy's timedelta64 types.",
  },
  "mw_924bab79-883a-4c78-b884-bc0d4bbd3f93": {
    summary: "Python objects can now be used as keys in a MATLAB dictionary.",
  },
};

async function run() {
  const docs = await client.fetch<{ _id: string; url: string }[]>(
    `*[_type == "writingLink" && section == "Release Note"]{_id, url}`
  );

  const transaction = client.transaction();
  let matched = 0;
  for (const doc of docs) {
    const anchor = doc.url.split("#")[1];
    const entry = anchor && summaries[anchor];
    if (!entry) {
      console.warn(`No summary found for ${doc._id} (${doc.url})`);
      continue;
    }
    transaction.patch(doc._id, { set: entry });
    matched++;
  }

  const result = await transaction.commit();
  console.log(`Patched ${matched} of ${docs.length} Release Note documents (${result.results.length} ops).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
