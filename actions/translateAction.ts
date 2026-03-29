/**
 * D18 — "Generate Bahasa Draft" document action
 * Appears in Sanity Studio document actions menu.
 * Calls web2 /api/blog/translate which uses SANITY_API_WRITE_TOKEN
 * to run Agent Actions translate (vX API — experimental).
 *
 * NOTE: Requires NEXT_PUBLIC_WEB2_URL env in studio .env
 */

import type { DocumentActionComponent, DocumentActionProps } from "sanity";

const TRANSLATABLE_FIELDS = [
  "titleId",
  "excerptId",
  "quickAnswerIdField",
  "bodyId",
  "metaTitleId",
  "metaDescId",
];

export const TranslateAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { id, type, published, draft } = props;

  if (type !== "blogPost") return null;

  // Only show if English content exists
  const doc = draft ?? published;
  if (!doc?.title) return null;

  return {
    label: "🇮🇩 Generate Bahasa Draft",
    title:
      "Auto-translate English content to Bahasa Indonesia draft using AI. Native writer must review before publishing.",
    tone: "primary",
    onHandle: async () => {
      const web2Url =
        process.env.SANITY_STUDIO_WEB2_URL ?? "https://entro.ly";

      const res = await fetch(`${web2Url}/api/blog/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: id,
          fields: TRANSLATABLE_FIELDS,
          secret: process.env.SANITY_STUDIO_TRANSLATE_SECRET,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        alert(`Translation failed: ${err}`);
        return;
      }

      const { draftId } = await res.json();
      alert(
        `✅ Bahasa draft generated (${draftId}).\n\nReview ALL fields — especially examples, pricing, and market context. Localize for Indonesian audience before publishing.`
      );
    },
  };
};
