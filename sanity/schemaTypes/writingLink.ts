import { defineField, defineType } from "sanity";

export const writingLink = defineType({
  name: "writingLink",
  title: "Writing Link",
  type: "document",
  fields: [
    defineField({
      name: "section",
      title: "Section",
      description: "Which table this shows up in on the Writing page.",
      type: "string",
      options: {
        list: [
          { title: "Page", value: "Page" },
          { title: "Release Note", value: "Release Note" },
        ],
      },
      initialValue: "Page",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      description: "The live link to the piece.",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Wrote", value: "Wrote" },
          { title: "Contributed", value: "Contributed" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "release",
      title: "Release",
      description:
        "For a Page, the pinned release/version the URL documents (optional), e.g. R2024a. For a Release Note, the release it was published in (required), e.g. R2026a.",
      type: "string",
    }),
    defineField({
      name: "archiveUrl",
      title: "Archive URL",
      description: "Optional Wayback Machine (or similar) snapshot link, in case the live URL breaks.",
      type: "url",
    }),
    defineField({
      name: "driveUrl",
      title: "Drive URL",
      description: "Optional link to a downloadable PDF copy of this piece, backed up on Google Drive.",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Lower numbers sort first within a category. Unused for Release Note entries (those sort alphabetically within their release).",
      type: "number",
    }),
    defineField({
      name: "changeType",
      title: "Change Type",
      description:
        "Release Note only: the badge MathWorks shows on the note (e.g. \"Behavior change\", \"Errors\"), if any. Leave blank for a plain new-feature note.",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description:
        "Release Note only: a short description in your own words — not copied from MathWorks' text, since that's their copyrighted documentation, not something to republish verbatim here.",
      type: "text",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
  },
});
