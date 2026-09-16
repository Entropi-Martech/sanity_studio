# ENTRO.LY Blog Studio

Sanity Studio v3 untuk pengelolaan konten blog ENTRO.LY. Di-deploy secara terpisah di `studio.entro.ly` (Vercel) agar tidak membebani server utama (AWS t3.small).

**Akses:** [studio.entro.ly](https://studio.entro.ly) — hanya untuk tim internal ENTROPI.

---

## Stack

- [Sanity Studio v3](https://www.sanity.io/docs/sanity-studio) — CMS editor
- [@sanity/assist](https://www.sanity.io/docs/sanity-assist) — AI translation & content assist
- [@sanity/vision](https://www.sanity.io/docs/vision) — GROQ query tester
- Vercel — hosting (free tier)

---

## Struktur

```
studio/
├── sanity.cli.ts          # Sanity CLI config (project ID, dataset)
├── sanity.config.ts       # Studio config (plugins, schema, document actions)
├── schemaTypes/
│   ├── author.ts          # Schema: Author (name, credentials, social links)
│   ├── blogPost.ts        # Schema: Blog Post (EN+ID fields, GEO blocks, FAQs)
│   ├── discoveryPage.ts   # Schema: Discovery Page (programmatic SEO /stay/..., CDP-generated)
│   ├── blockContent.ts    # Portable Text block types (16 types)
│   └── index.ts
├── actions/
│   └── translateAction.ts # Document action: "Generate Bahasa Draft" (AI)
├── functions/
│   ├── onPublish.ts       # Sanity Function: revalidate web2 + ping IndexNow
│   └── freshnessAlert.ts  # Sanity Function CRON: alert konten stale (>14 hari)
├── vercel.json            # Vercel deployment config
└── .env.example           # Template environment variables
```

---

## Schema: blogPost

Field utama yang perlu diisi tim konten:

| Field | Keterangan |
|-------|------------|
| `title` / `titleId` | Judul EN dan ID |
| `slug` | URL-friendly, auto-generate dari title |
| `excerpt` / `excerptId` | Meta description / ringkasan |
| `quickAnswerEn` / `quickAnswerId` | **GEO block** — jawaban singkat di atas artikel, dibaca AI crawler |
| `body` / `bodyId` | Konten utama (Portable Text — EN dan ID) |
| `coverImage` | Gambar cover + alt text EN/ID |
| `author` | Referensi ke dokumen Author |
| `publishedAt` | Tanggal publish |
| `lastVerifiedAt` | Tanggal terakhir fakta di-review — update tiap edit konten |
| `faqs` | FAQ block — otomatis generate FAQPage JSON-LD |
| `promptAlignedQueries` | Pertanyaan target untuk AI (GEO/Share of Model) |

---

## Schema: discoveryPage

Halaman programmatic SEO (Discovery lane, PRD `cdp-build-prd` §4B). Unit = `[city] hotels with [attribute]`, URL `/stay/[city]-hotels-with-[attribute]/`. Dokumen **di-generate oleh CDP** setelah lolos publication gate — bukan ditulis tangan. Edit manual pada konten akan ditimpa saat CDP refresh.

| Field | Keterangan |
|-------|------------|
| `vertical`, `cityName`, `citySlug`, `stateSlug`, `attributeSlug`, `attributeLabel`, `path` | Identitas + route (read-only, dari CDP) |
| `h1` | Wajib mengandung nama kota (gate) |
| `body` | Portable Text: qualification line, per-hotel facts + 1 `tiktokEmbed`, Q&A, FAQ |
| `hotels` | Hotel yang lolos kualifikasi (`merchantId`, `name`) — min 1 |
| `faqs` | Sumber FAQPage JSON-LD |
| `title`, `metaDescription` | Meta title + description (≤155) |
| `jsonLd` | JSON string ItemList + FAQPage yang sudah divalidasi gate. **Tanpa VideoObject.** Web merender apa adanya |
| `verifiedOn` | Tanggal kualifikasi creator-visit (YYYY-MM-DD) |
| `indexable` | OFF ⇒ `noindex` + keluar dari sitemap. Diisi oleh indexation gate CDP; override manual hanya kalau sengaja |
| `publishedAt` | Diisi publisher saat pertama live |

Renderer: Entro.ly-App route `/stay/...` (bukan blog). CDP source of truth: `content-distribution-platform/src/discovery/pages/types.ts` (`DiscoveryPageDocument`).

---

## Block Types (Portable Text)

`blockContent.ts` mendukung 16 tipe block:

`callout` · `codeBlock` · `statBlock` · `comparisonTable` · `inlineCta` · `stepList` · `pullQuote` · `productCard` · `imageBlock` · `youtubeEmbed` · `spotifyEmbed` · `tiktokEmbed` · + standard heading/list/link blocks

---

## Document Actions

### 🇮🇩 Generate Bahasa Draft
Tombol di toolbar Studio (hanya untuk dokumen `blogPost`).

Cara kerja:
1. Klik **"🇮🇩 Generate Bahasa Draft"** di menu Actions
2. Studio memanggil `https://entro.ly/api/blog/translate`
3. Web2 menggunakan Sanity Agent Actions (vX API) untuk auto-translate field EN → ID
4. Draft ID dibuat otomatis — **wajib direview oleh native writer sebelum publish**

> Requires Sanity Growth plan ($15/seat/month) untuk Agent Actions.

---

## Setup Local Dev

```bash
# Clone repo
git clone https://github.com/Entropi-Martech/sanity_studio.git
cd sanity_studio

# Install dependencies
npm install

# Setup env
cp .env.example .env
# Edit .env — isi SANITY_STUDIO_PROJECT_ID, dll.

# Jalankan studio local
npm run dev
# → http://localhost:3333
```

---

## Environment Variables

| Variable | Keterangan |
|----------|------------|
| `SANITY_STUDIO_PROJECT_ID` | Sanity project ID (`xibhz0or`) |
| `SANITY_STUDIO_DATASET` | Dataset name (`production`) |
| `SANITY_STUDIO_WEB2_URL` | URL web2 untuk TranslateAction (`https://entro.ly`) |
| `SANITY_STUDIO_TRANSLATE_SECRET` | Secret key yang sama dengan `TRANSLATE_SECRET` di web2 |

Set environment variables di Vercel dashboard sebelum deploy.

---

## Deploy (Vercel)

```bash
# Build manual (opsional — Vercel auto-build dari git push)
npm run build
# Output: dist/
```

Vercel config sudah ada di `vercel.json`:
- Build command: `sanity build`
- Output directory: `dist`
- Custom domain: `studio.entro.ly`

**Setiap push ke `main` → auto-deploy ke Vercel.**

---

## Sanity Dashboard Setup

Di [manage.sanity.io](https://www.sanity.io/manage) → project `xibhz0or`:

1. **API → CORS Origins** → tambah:
   - `https://studio.entro.ly`
   - `https://sso.entro.ly` (untuk link dari admin panel)
2. **API → Tokens** → buat token `SANITY_API_WRITE_TOKEN` (Editor role) → set di web2 `.env`
3. **Functions** → deploy setelah `npm run functions:deploy`

---

## Sanity Functions

```bash
# Deploy functions (onPublish + freshnessAlert CRON)
npm run functions:deploy
```

- `onPublish` — dipanggil saat dokumen dipublish: revalidate Next.js cache + ping Bing IndexNow
- `freshnessAlert` — CRON harian: cek artikel yang `lastVerifiedAt` > 14 hari → kirim alert

---

## Hubungan dengan Repo Lain

| Repo | Hubungan |
|------|----------|
| `web2` (entro.ly) | Membaca konten via GROQ + Sanity client. Endpoint `/api/blog/translate` dipanggil TranslateAction. |
| `sso2` (sso.entro.ly) | Admin panel di `/admin/blog` berisi tombol link ke `studio.entro.ly` |

---

*ENTROPI — Hailstone AI Innovations Limited*
