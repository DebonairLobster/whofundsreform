# Who funds Reform UK?

A fast, searchable explorer for Reform UK donation records supplied in Electoral Commission-style CSV data. It includes summary statistics, fuzzy search, filters, user-selectable table columns, donor profile pages, a privacy-conscious postcode-area map, charts, and full record detail views.

## Data

Place the source file at `public/results.csv`. The browser parses it at runtime. Money values such as `£250,000.00` and UK dates such as `31/03/2026` are normalised for analysis while every original field remains available in the detail view.

The app does not infer missing information. Replace the CSV to update the database, retaining the same column names.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Deploy to GitHub Pages

1. Push the project to a GitHub repository.
2. Run `npm run build`.
3. Deploy the generated `dist` directory using a GitHub Pages action, or set up the `gh-pages` package.

Vite uses a relative asset base, so the build works from a GitHub Pages repository subpath. In repository **Settings → Pages**, select **GitHub Actions** as the source when using an action.

## Stack

Vite, React, TypeScript, Tailwind CSS, PapaParse, Fuse.js, and Lucide icons.
