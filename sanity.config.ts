import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { assist } from "@sanity/assist";
import { schemaTypes } from "./schemaTypes";
import { TranslateAction } from "./actions/translateAction";

export default defineConfig({
  name: "entroly",
  title: "ENTRO.LY Blog",
  projectId: "xibhz0or",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("✍️ Blog Posts")
              .schemaType("blogPost")
              .child(
                S.documentTypeList("blogPost")
                  .title("Blog Posts")
                  .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
              ),
            S.divider(),
            S.listItem()
              .title("👤 Authors")
              .schemaType("author")
              .child(S.documentTypeList("author").title("Authors")),
          ]),
    }),
    // AI Assist — ✨ sparkle menu for one-click translation + alt text generation
    // Requires Sanity Growth plan ($15/seat/month)
    assist({
      translate: {
        document: {
          languageField: "__i18n_lang",
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Add "Generate Bahasa Draft" to document actions
    actions: (prev, context) => {
      if (context.schemaType !== "blogPost") return prev;
      return [...prev, TranslateAction];
    },
  },
});
