# Srivani Digital Store — 1,500+ Product Digital Storefront

Next.js 15 (App Router) + MongoDB storefront and admin for **Srivani Book Stall, Karimnagar**.
Search, catalogue, product pages, WhatsApp enquiries, school-list & bulk enquiries, offers, and a simple admin with CSV bulk import.

## Architecture (kept deliberately simple)

```
Browser ──> Vercel (Next.js: server components + server actions + route handlers)
                │
                ├── MongoDB Atlas          products / offers / enquiries / settings / users / sessions
                └── Emergent Object Storage product images (original + optimized WebP + thumbnail), served via /media/*
```

- `lib/` — all data access (server-only). UI components never touch the database directly.
- `app/actions/` — server actions for enquiries and admin mutations.
- `app/auth/*` — Emergent-managed Google login for the admin (httpOnly session cookie).
- `app/media/[...path]` — streams optimized images from object storage with long-lived cache headers.
- Product URLs are `/product/<slug>`; SEO collection URLs are `/books/<slug>` and `/stationery/<slug>`
  (e.g. `/books/class-10`, `/books/ssc`, `/books/school`, `/stationery/notebooks`).
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, Product/Book + BreadcrumbList + BookStore JSON-LD are generated.
- Images are lazy-loaded with responsive `sizes`; products without a photo get a generated cover (zero bytes downloaded).
- Demo data (~100 products, 3 offers) is auto-seeded the first time the catalogue is opened on an empty database.

## Environment variables

Copy `.env.example` → `.env` (local) or add them in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URL` | ✅ | MongoDB connection string (e.g. MongoDB Atlas `mongodb+srv://...`). Server-only. |
| `DB_NAME` | ✅ | Database name, e.g. `srivani`. |
| `ADMIN_EMAILS` | ✅ | Comma-separated Google account emails allowed into `/admin`. |
| `EMERGENT_LLM_KEY` | ✅ | Emergent key used for object storage (image uploads). Server-only. |
| `INTEGRATION_PROXY_URL` | optional | Emergent integration proxy base URL. Leave empty to use the default. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public site URL (e.g. `https://srivani.vercel.app`) used for sitemap, canonical & structured data. Not a secret. |

No secrets are exposed via `NEXT_PUBLIC_*`.

## Deploy to Vercel

1. Push this `frontend/` folder to a Git repository (GitHub/GitLab/Bitbucket). If the repo root is the monorepo, set **Root Directory** to `frontend` in Vercel.
2. In Vercel: **Add New → Project → Import** the repository. Framework preset: **Next.js** (auto-detected).
   - Build command: `next build` (default) · Install command: `yarn install` (or npm/pnpm) · Output: default.
3. Add all environment variables from the table above (Production + Preview).
   - Create a free MongoDB Atlas cluster, allow access from `0.0.0.0/0` (Vercel uses dynamic IPs), and paste the connection string as `MONGO_URL`.
4. Click **Deploy**. On first load the catalogue seeds demo data automatically.
5. Open `https://<your-domain>/admin` → **Continue with Google** with an email listed in `ADMIN_EMAILS`.
6. In **Admin → Settings**, replace the placeholder WhatsApp number/phone with the store's real numbers.
7. Submit `https://<your-domain>/sitemap.xml` in Google Search Console.

Direct navigation to any product URL works after deployment because every page is server-rendered by Next.js.

## Local development

```bash
cd frontend
yarn install
cp .env.example .env   # fill in values
yarn dev               # http://localhost:3000
yarn build && yarn serve   # production build check
```

## Loading the real 1,500 products

Admin → **Bulk Import** → download the CSV template → fill it (one row per product, `SKU` is the stable key) → Preview → Import.
Images: put an image URL in the `Image` column, or upload per product in the product editor (auto-optimized to WebP + thumbnail in object storage).
Re-importing the same SKUs updates existing products, so the catalogue can be refreshed anytime without touching the frontend.
