# Meridian Labs Supply — storefront

## Run locally
```bash
npm install
npm run dev
```
Opens at http://localhost:5173

## Build for production
```bash
npm run build
```
Outputs static files to `dist/`.

## Deploy — Vercel (recommended, easiest)
1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. Go to https://vercel.com, sign in with GitHub, click "Add New Project", pick your repo.
3. Vercel auto-detects Vite — leave build command as `npm run build` and output directory as `dist`. Click Deploy.
4. You'll get a live `*.vercel.app` URL immediately. Add a custom domain under Project Settings → Domains once you've registered one.

## Deploy — Netlify (alternative)
1. Same GitHub push as above.
2. Go to https://app.netlify.com → "Add new site" → "Import an existing project" → pick your repo.
3. Build command: `npm run build`. Publish directory: `dist`. Deploy.

## Deploy — no GitHub, drag-and-drop
1. Run `npm run build` locally.
2. Go to https://app.netlify.com/drop and drag the `dist/` folder in. You get a live URL in seconds (good for a quick preview, not for ongoing updates).

## What's still a mock
- Checkout does not process real payments — it's a UI flow that generates a fake confirmation number.
- No backend/database — cart and orders live only in browser memory and reset on refresh.
- Product data is hardcoded in `src/Store.jsx` — replace the `PRODUCTS` array with your real catalog, or wire it up to a CMS/database.

See the follow-up message for what's involved in wiring up real payments and order storage.
