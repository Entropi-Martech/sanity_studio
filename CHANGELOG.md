# Changelog

All notable changes to the ENTRO.LY Sanity Studio. Newest first.

## 2026-09-16 — Discovery Page schema (programmatic SEO, /stay/)

- Add document type `discoveryPage` (`schemaTypes/discoveryPage.ts`): one programmatic
  Discovery-lane page per `[city] hotels with [attribute]` (PRD cdp-build-prd §4B). Fields mirror
  the CDP `DiscoveryPageDocument` one-to-one (`vertical`, `cityName`, `citySlug`, `stateSlug`,
  `attributeSlug`, `attributeLabel`, `path`, `h1`, `body`, `hotels`, `faqs`, `title`,
  `metaDescription`, `jsonLd`, `verifiedOn`) plus Studio-owned `indexable` (default false) and
  `publishedAt`. Identity fields and `jsonLd` are read-only; `jsonLd` validation rejects
  non-array JSON and any `VideoObject`.
- Register the type and add a "🏨 Discovery Pages" list (ordered by `path`) to the Studio
  structure (`sanity.config.ts`).
- Fix `presentationTool` import (`@sanity/presentation` v2 is a throwing stub; use
  `sanity/presentation`). Unblocks `sanity build`, `sanity schema extract`, and `tsc`.
- README: document the new schema and file.
- By: Claude (Fable 5.1) for Titan.
- Impact: schema-only; no existing type or document changes. Entro.ly-App gains a typed
  target for `/stay/...` pages; the CDP publisher targets `_type: "discoveryPage"`.
