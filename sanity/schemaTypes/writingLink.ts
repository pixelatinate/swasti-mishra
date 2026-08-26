import { defineField, defineType } from "sanity";

export const writingLink = defineType({
  name: "writingLink",
  title: "Writing Link",
  type: "document",
  fields: [
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
      description: "Optional pinned release/version this page documents, e.g. R2024a.",
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
      description: "Lower numbers sort first within a category.",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
  },
});
