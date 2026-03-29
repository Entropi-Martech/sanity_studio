import { defineArrayMember, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    // ─── Standard text blocks ─────────────────────────────────────────────────
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (Rule) =>
                  Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
              {
                name: "blank",
                type: "boolean",
                title: "Open in new tab",
                initialValue: true,
              },
            ],
          },
          {
            name: "internalLink",
            type: "object",
            title: "Internal Link",
            fields: [
              { name: "href", type: "string", title: "Path (e.g. /blog/en/my-post)" },
            ],
          },
        ],
      },
    }),

    // ─── Callout block ────────────────────────────────────────────────────────
    defineArrayMember({
      name: "callout",
      type: "object",
      title: "Callout",
      fields: [
        {
          name: "calloutType",
          type: "string",
          title: "Type",
          options: {
            list: [
              { title: "💡 Tip", value: "tip" },
              { title: "⚠️ Warning", value: "warning" },
              { title: "📝 Note", value: "note" },
              { title: "❗ Important", value: "important" },
            ],
            layout: "radio",
          },
          initialValue: "tip",
        },
        { name: "text", type: "text", title: "Text", rows: 3, validation: (Rule) => Rule.required() },
      ],
      preview: {
        select: { title: "calloutType", subtitle: "text" },
        prepare({ title, subtitle }) {
          const icons: Record<string, string> = { tip: "💡", warning: "⚠️", note: "📝", important: "❗" };
          return { title: `${icons[title] ?? "📌"} ${(title ?? "callout").toUpperCase()}`, subtitle };
        },
      },
    }),

    // ─── Code block ───────────────────────────────────────────────────────────
    defineArrayMember({
      name: "codeBlock",
      type: "object",
      title: "Code Block",
      fields: [
        {
          name: "language",
          type: "string",
          title: "Language",
          options: {
            list: ["javascript", "typescript", "bash", "json", "python", "sql", "html", "css"].map(
              (l) => ({ title: l, value: l })
            ),
          },
          initialValue: "bash",
        },
        { name: "filename", type: "string", title: "Filename (optional)" },
        { name: "code", type: "text", title: "Code", rows: 8, validation: (Rule) => Rule.required() },
      ],
      preview: {
        select: { title: "filename", subtitle: "language" },
        prepare({ title, subtitle }) {
          return { title: title || "Code Block", subtitle };
        },
      },
    }),

    // ─── Stat block ───────────────────────────────────────────────────────────
    defineArrayMember({
      name: "statBlock",
      type: "object",
      title: "Stat Block (Metrics)",
      fields: [
        {
          name: "stats",
          type: "array",
          title: "Stats (2–4 items)",
          of: [
            {
              type: "object",
              fields: [
                { name: "value", type: "string", title: "Value (e.g. $24M, 10,000+)", validation: (Rule) => Rule.required() },
                { name: "label", type: "string", title: "Label", validation: (Rule) => Rule.required() },
                { name: "note", type: "string", title: "Note (optional, e.g. GMV Q1 2025)" },
              ],
              preview: { select: { title: "value", subtitle: "label" } },
            },
          ],
          validation: (Rule) => Rule.min(2).max(4),
        },
      ],
      preview: {
        select: { stats: "stats" },
        prepare({ stats }) {
          const first = Array.isArray(stats) ? stats[0] : null;
          return { title: `Stat Block — ${first?.value ?? ""}`, subtitle: first?.label };
        },
      },
    }),

    // ─── Comparison table ─────────────────────────────────────────────────────
    defineArrayMember({
      name: "comparisonTable",
      type: "object",
      title: "Comparison Table",
      fields: [
        {
          name: "headers",
          type: "array",
          title: "Column Headers",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.min(2).max(6),
        },
        {
          name: "rows",
          type: "array",
          title: "Rows",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "cells",
                  type: "array",
                  title: "Cells",
                  of: [{ type: "string" }],
                },
              ],
              preview: {
                select: { cells: "cells" },
                prepare({ cells }) {
                  return { title: Array.isArray(cells) ? cells[0] : "Row" };
                },
              },
            },
          ],
        },
      ],
      preview: {
        select: { title: "headers" },
        prepare({ title }) {
          return { title: `Table: ${Array.isArray(title) ? title.join(" | ") : ""}` };
        },
      },
    }),

    // ─── Inline CTA ───────────────────────────────────────────────────────────
    defineArrayMember({
      name: "inlineCta",
      type: "object",
      title: "Inline CTA",
      fields: [
        { name: "headline", type: "string", title: "Headline", validation: (Rule) => Rule.required() },
        { name: "subtext", type: "string", title: "Subtext (optional)" },
        { name: "buttonLabel", type: "string", title: "Button Label", initialValue: "Get Started Free" },
        { name: "buttonUrl", type: "string", title: "Button URL", initialValue: "/signup" },
      ],
      preview: {
        select: { title: "headline", subtitle: "buttonLabel" },
      },
    }),

    // ─── Step list ────────────────────────────────────────────────────────────
    defineArrayMember({
      name: "stepList",
      type: "object",
      title: "Step List",
      fields: [
        {
          name: "steps",
          type: "array",
          title: "Steps",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", type: "string", title: "Step Title", validation: (Rule) => Rule.required() },
                { name: "body", type: "text", title: "Step Body", rows: 3 },
              ],
              preview: { select: { title: "title" } },
            },
          ],
          validation: (Rule) => Rule.min(2),
        },
      ],
      preview: {
        select: { steps: "steps" },
        prepare({ steps }) {
          return { title: `Step List — ${Array.isArray(steps) ? steps.length : 0} steps` };
        },
      },
    }),

    // ─── Pull quote ───────────────────────────────────────────────────────────
    defineArrayMember({
      name: "pullQuote",
      type: "object",
      title: "Pull Quote",
      fields: [
        { name: "text", type: "text", title: "Quote Text", rows: 3, validation: (Rule) => Rule.required() },
        { name: "attribution", type: "string", title: "Attribution (optional)" },
      ],
      preview: {
        select: { title: "text", subtitle: "attribution" },
        prepare({ title, subtitle }) {
          return { title: `"${title?.slice(0, 60)}…"`, subtitle };
        },
      },
    }),

    // ─── Product card ─────────────────────────────────────────────────────────
    defineArrayMember({
      name: "productCard",
      type: "object",
      title: "Product Card",
      fields: [
        { name: "title", type: "string", title: "Product Name", initialValue: "ENTRO.LY", validation: (Rule) => Rule.required() },
        { name: "tagline", type: "string", title: "Tagline" },
        {
          name: "features",
          type: "array",
          title: "Feature List",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.min(2).max(6),
        },
        { name: "buttonLabel", type: "string", title: "Button Label", initialValue: "Get Started Free" },
        { name: "buttonUrl", type: "string", title: "Button URL", initialValue: "/signup" },
      ],
      preview: {
        select: { title: "title", subtitle: "tagline" },
      },
    }),

    // ─── Image block ──────────────────────────────────────────────────────────
    defineArrayMember({
      name: "imageBlock",
      type: "object",
      title: "Image",
      fields: [
        {
          name: "image",
          type: "image",
          title: "Image",
          options: { hotspot: true },
        },
        { name: "alt", type: "string", title: "Alt Text (EN)" },
        { name: "altId", type: "string", title: "Alt Text (ID)" },
        { name: "caption", type: "string", title: "Caption (optional)" },
        { name: "fullBleed", type: "boolean", title: "Full Bleed", initialValue: false },
      ],
      preview: {
        select: { title: "alt", media: "image" },
        prepare({ title, media }) {
          return { title: title || "Image", media };
        },
      },
    }),

    // ─── YouTube embed ────────────────────────────────────────────────────────
    defineArrayMember({
      name: "youtubeEmbed",
      type: "object",
      title: "YouTube Video",
      fields: [
        { name: "url", type: "url", title: "YouTube URL", validation: (Rule) => Rule.required() },
        { name: "caption", type: "string", title: "Caption (optional)" },
      ],
      preview: {
        select: { title: "url" },
        prepare({ title }) {
          return { title: `YouTube: ${title || "No URL"}` };
        },
      },
    }),

    // ─── Spotify embed ────────────────────────────────────────────────────────
    defineArrayMember({
      name: "spotifyEmbed",
      type: "object",
      title: "Spotify Embed",
      fields: [
        { name: "url", type: "url", title: "Spotify Share URL", validation: (Rule) => Rule.required() },
        { name: "compact", type: "boolean", title: "Compact player", initialValue: true },
      ],
      preview: {
        select: { title: "url" },
        prepare({ title }) {
          return { title: `Spotify: ${title || "No URL"}` };
        },
      },
    }),

    // ─── TikTok embed ─────────────────────────────────────────────────────────
    defineArrayMember({
      name: "tiktokEmbed",
      type: "object",
      title: "TikTok Embed",
      fields: [
        { name: "url", type: "url", title: "TikTok Video URL", validation: (Rule) => Rule.required() },
      ],
      preview: {
        select: { title: "url" },
        prepare({ title }) {
          return { title: `TikTok: ${title || "No URL"}` };
        },
      },
    }),
  ],
});
