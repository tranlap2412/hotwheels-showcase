# Hot Wheels Premium Showcase

A small side project — made for fun, not for business.

This site is basically a digital toy shelf for kids (and kids-at-heart) who love die-cast cars. Browse Hot Wheels models, save favorites, flip through photos, and pretend you're at the store picking your next ride. No login, no ads, no seriousness required.

**Live:** [hotwheels.vercel.app](https://hotwheels.vercel.app)

**Made by:** William Bond

---

## What it does

- Browse a curated catalog of Hot Wheels premium models
- Search by name, code, or series
- Filter by collection
- Save favorites (stored in your browser)
- View details and flip through photos

## Tech stack

Next.js · React · Tailwind CSS · TypeScript

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project on [Vercel](https://vercel.com) (Framework Preset: **Next.js**)
3. Add environment variable:

```
NEXT_PUBLIC_SITE_URL=https://hotwheels.vercel.app
```

4. Deploy — no extra build settings needed (`npm run build`)

Or via CLI:

```bash
npm install
npm run build
npx vercel
```

Use **npm** (not yarn) — the repo ships with `package-lock.json`.

---

*Not affiliated with Mattel or Hot Wheels. Just a fan project for people who like tiny fast cars.*
