# Who funds Reform UK?

A searchable explorer for Reform UK donation records supplied in Electoral Commission-style CSV data. It includes statistics, fuzzy search, filters, selectable columns, donor profiles, Companies House SIC analysis, a privacy-conscious postcode-area map, charts, and full record details.

## Data

Place the source file at `public/results.csv`. Money values such as `£250,000.00` and UK dates such as `31/03/2026` are normalised while every original field remains available in the detail view. Missing information is never inferred.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Deploy to GitHub Pages

1. Push to the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The included `.github/workflows/deploy-pages.yml` workflow builds and publishes `dist` automatically.

The Vite base is configured for `https://debonairlobster.github.io/whofundsreform/`. After each push, check the repository’s **Actions** tab for deployment progress.

## Stack

Vite, React, TypeScript, Tailwind CSS, PapaParse, Fuse.js, D3 Geo, World Atlas, and Lucide icons.
