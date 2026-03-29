import { defineField, defineType } from "sanity";

const CATEGORIES = [
  "GETTING STARTED",
  "COMMISSION TRACKING",
  "GROW YOUR BUSINESS",
  "TIKTOK SHOP NEWS",
  "INDONESIA",
];

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "english", title: "🇺🇸 English" },
    { name: "indonesia", title: "🇮🇩 Bahasa Indonesia" },
    { name: "settings", title: "⚙️ Settings" },
    { name: "seo", title: "🔍 SEO & GEO" },
    { name: "freshness", title: "🔄 Freshness" },
  ],
  fields: [
    // ─── English ─────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Title (EN)",
      type: "string",
      group: "english",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug (EN)",
      type: "slug",
      group: "english",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt (EN)",
      type: "text",
      rows: 3,
      group: "english",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "quickAnswerEn",
      title: "Quick Answer (EN) — GEO Critical",
      type: "text",
      rows: 4,
      group: "english",
      description:
        "2–3 sentences that directly answer the primary query. Written as if answering a ChatGPT query. This renders ABOVE the article body.",
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "body",
      title: "Content (EN)",
      type: "blockContent",
      group: "english",
    }),

    // ─── Indonesia ────────────────────────────────────────────────────────────
    defineField({
      name: "titleId",
      title: "Judul (ID)",
      type: "string",
      group: "indonesia",
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: "slugId",
      title: "Slug (ID)",
      type: "slug",
      group: "indonesia",
      options: { source: "titleId", maxLength: 96 },
    }),
    defineField({
      name: "excerptId",
      title: "Excerpt (ID)",
      type: "text",
      rows: 3,
      group: "indonesia",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "quickAnswerIdField",
      title: "Quick Answer (ID) — GEO Critical",
      type: "text",
      rows: 4,
      group: "indonesia",
      description:
        "Lokalisasi oleh native writer — BUKAN terjemahan langsung dari EN. Tulis ulang dengan contoh dan konteks Indonesia.",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "bodyId",
      title: "Konten (ID)",
      type: "blockContent",
      group: "indonesia",
    }),

    // ─── SEO & GEO ────────────────────────────────────────────────────────────
    defineField({
      name: "metaTitleEn",
      title: "Meta Title (EN)",
      type: "string",
      group: "seo",
      description: "50–60 chars ideal",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "metaDescEn",
      title: "Meta Description (EN)",
      type: "text",
      rows: 2,
      group: "seo",
      description: "100–160 chars ideal",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "targetKeywordEn",
      title: "Target Keyword (EN)",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageAltEn",
      title: "Cover Image Alt (EN)",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "metaTitleId",
      title: "Meta Title (ID)",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "metaDescId",
      title: "Meta Description (ID)",
      type: "text",
      rows: 2,
      group: "seo",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "targetKeywordId",
      title: "Target Keyword (ID) — BUKAN terjemahan EN",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "imageAltId",
      title: "Cover Image Alt (ID)",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "promptAlignedQueries",
      title: "Prompt-Aligned FAQ (GEO)",
      type: "array",
      group: "seo",
      description:
        "Tulis pertanyaan persis seperti user ketik di ChatGPT/Perplexity. Min 4 pairs.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              type: "string",
              title: "Question (as AI chatbot query)",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              type: "text",
              title: "Answer",
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({
      name: "isListicle",
      title: "Is Listicle / Ranking Article?",
      type: "boolean",
      group: "seo",
      description: "Enables ItemList JSON-LD — 74.2% of AI citations come from Top-N content",
      initialValue: false,
    }),
    defineField({
      name: "listItems",
      title: "List Items (for ItemList JSON-LD)",
      type: "array",
      group: "seo",
      hidden: ({ document }) => !document?.isListicle,
      of: [
        {
          type: "object",
          fields: [
            { name: "position", type: "number", title: "Position (#)", validation: (Rule) => Rule.required().min(1) },
            { name: "name", type: "string", title: "Item Name", validation: (Rule) => Rule.required() },
            { name: "url", type: "url", title: "URL (optional)" },
            { name: "description", type: "text", title: "Description (optional)", rows: 2 },
          ],
          preview: { select: { title: "name", subtitle: "position" } },
        },
      ],
    }),

    // ─── Shared ───────────────────────────────────────────────────────────────
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "settings",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "settings",
      options: { hotspot: true },
      fields: [
        { name: "altEn", type: "string", title: "Alt Text (EN)" },
        { name: "altId", type: "string", title: "Alt Text (ID)" },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "settings",
      options: {
        list: CATEGORIES.map((c) => ({ title: c, value: c })),
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "settings",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "readTimeMinutes",
      title: "Read Time (minutes)",
      type: "number",
      group: "settings",
      initialValue: 5,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "settings",
    }),
    defineField({
      name: "faqs",
      title: "FAQs (for FAQ Accordion)",
      type: "array",
      group: "settings",
      description: "These render as an accordion below the article body.",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question", validation: (Rule) => Rule.required() },
            { name: "answer", type: "text", title: "Answer", rows: 3, validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // ─── Freshness ────────────────────────────────────────────────────────────
    defineField({
      name: "lastVerifiedAt",
      title: "Last Verified At",
      type: "datetime",
      group: "freshness",
      description:
        "Update this every 7–14 days to maintain GEO freshness signal. Sanity Functions will alert if >14 days without update.",
    }),
    defineField({
      name: "versionHistory",
      title: "Version History",
      type: "array",
      group: "freshness",
      of: [
        {
          type: "object",
          fields: [
            { name: "version", type: "string", title: "Version", description: 'e.g. "1.0", "1.1"', validation: (Rule) => Rule.required() },
            { name: "date", type: "date", title: "Date", validation: (Rule) => Rule.required() },
            { name: "description", type: "string", title: "What changed?", validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { title: "version", subtitle: "description" },
            prepare({ title, subtitle }) {
              return { title: `v${title}`, subtitle };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
  orderings: [
    {
      title: "Published (newest)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
