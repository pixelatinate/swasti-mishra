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
3. Until `swasti-mishra.com` is verified as a sending domain in Resend, leave `RESEND_FROM_EMAIL` as
   `onboarding@resend.dev` — email will only deliver to the Resend account's own inbox until then.
4. Once the domain is verified, set `RESEND_FROM_EMAIL` to something like
   `contact@swasti-mishra.com`.

## Development

```bash
npm run dev
```

## Deployment

Deployed on Vercel. Add the env vars above in the Vercel project settings, then point the
`swasti-mishra.com` domain's DNS at Vercel (Vercel's domain settings screen gives the exact records).
