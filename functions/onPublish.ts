/**
 * D19 — Sanity Function: onPostPublish
 * Triggered when a blogPost document is published.
 * - Revalidates Next.js pages via /api/revalidate
 * - Pings Bing IndexNow for immediate reindex
 *
 * Deploy: npx sanity functions deploy
 * Configure trigger in Sanity dashboard → Functions → Add trigger:
 *   Event: document.publish
 *   Filter: _type == "blogPost"
 */

import type { SanityClient } from "sanity";

interface BlogPostEvent {
  _id: string;
  _type: string;
  slug?: { current: string };
  slugId?: { current: string };
}

export default async function onPublish(
  event: { document: BlogPostEvent },
  context: { client: SanityClient }
) {
  const { document: doc } = event;

  if (doc._type !== "blogPost") return;

  const slug = doc.slug?.current;
  const slugId = doc.slugId?.current;
  const web2Url = process.env.WEB2_URL ?? "https://entro.ly";
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    console.error("[onPublish] REVALIDATE_SECRET not set");
    return;
  }

  const res = await fetch(`${web2Url}/api/revalidate?secret=${secret}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, slugId }),
  });

  if (!res.ok) {
    console.error("[onPublish] Revalidation failed:", res.status, await res.text());
  } else {
    console.log("[onPublish] Revalidated:", { slug, slugId });
  }
}
