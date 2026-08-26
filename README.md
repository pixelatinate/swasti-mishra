# swasti-mishra.com

Personal site, rebuilt in Next.js (App Router) with a Sanity-backed writing section.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

### Sanity

1. `npx sanity login` (opens a browser to authenticate — needs a Sanity account, free to create).
2. `npx sanity init` — when prompted, choose "create new project", dataset `production`, and say no to
   the default starter schema (this repo already has one in `sanity/schemaTypes/`).
3. Copy the project ID it gives you into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
4. Create a write token: Sanity dashboard → your project → API → Tokens → Add API token → "Editor"
   permissions. Put it in `.env.local` as `SANITY_API_TOKEN`.
5. Seed the existing writing links: `npm run seed:writing`.
6. Manage content going forward at `/studio` on the running site.

### Contact form (Resend)

1. Create a free account at [resend.com](https://resend.com).
2. Create an API key, put it in `.env.local` as `RESEND_API_KEY`.
3. `swasti-mishra.com` is already verified as a sending domain in Resend (DNS records live at
   DreamHost), so `RESEND_FROM_EMAIL` is set to `hello@swasti-mishra.com`. If you ever need to
   re-verify from scratch, Resend's domain page will give you the DNS records to add.
4. Remember to set both `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in the Vercel project's
   environment variables too — `.env.local` only affects local dev.

## Development

```bash
npm run dev
```

## Deployment

Deployed on Vercel. Add the env vars above in the Vercel project settings, then point the
`swasti-mishra.com` domain's DNS at Vercel (Vercel's domain settings screen gives the exact records).
