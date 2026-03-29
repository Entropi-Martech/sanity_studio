/**
 * D19 — Sanity Function: freshnessAlert (CRON)
 * Runs daily. Flags articles that haven't been verified in >14 days.
 *
 * Deploy: npx sanity functions deploy
 * Configure in Sanity dashboard → Functions → Add CRON:
 *   Schedule: 0 9 * * *  (daily at 9am UTC)
 *   No document trigger needed — pure CRON
 *
 * Output: logs stale articles + optionally pings Slack/email webhook
 */

import type { SanityClient } from "sanity";

export default async function freshnessAlert(
  _event: unknown,
  context: { client: SanityClient }
) {
  const { client } = context;

  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const stalePosts = await client.fetch<
    Array<{ _id: string; title: string; lastVerifiedAt?: string; slug: { current: string } }>
  >(
    `*[_type == "blogPost" && !(_id in path("drafts.**")) && (lastVerifiedAt < $cutoff || !defined(lastVerifiedAt))] {
      _id, title, lastVerifiedAt, slug
    }`,
    { cutoff }
  );

  if (stalePosts.length === 0) {
    console.log("[freshnessAlert] All articles are fresh.");
    return;
  }

  console.warn(`[freshnessAlert] ${stalePosts.length} stale article(s):`);
  for (const post of stalePosts) {
    console.warn(
      `  - "${post.title}" (${post.slug.current}) — last verified: ${
        post.lastVerifiedAt
          ? new Date(post.lastVerifiedAt).toLocaleDateString()
          : "NEVER"
      }`
    );
  }

  // Optional: ping Slack webhook
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  if (slackWebhook) {
    const text = `⚠️ *Freshness Alert* — ${stalePosts.length} article(s) need content verification:\n${stalePosts
      .map((p) => `• <https://entro.ly/blog/en/${p.slug.current}|${p.title}> — last verified: ${p.lastVerifiedAt ? new Date(p.lastVerifiedAt).toLocaleDateString() : "never"}`)
      .join("\n")}`;

    await fetch(slackWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  }
}
