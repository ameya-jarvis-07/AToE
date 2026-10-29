# ATE — Asthitva's Title of Existence

ATE is a frontend-only, map-led café discovery guide. Café records are
typed in [src/data/seed.ts](./src/data/seed.ts); there is no database,
Supabase project, API key, or remote content service.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Run `npm run typecheck` and `npm run build` before deployment.

## Map asset

The interactive map loads [public/in.svg](./public/in.svg). It contains
36 independent state/union-territory paths. The app maps compact SVG IDs
such as `INMH` to the frontend state IDs such as `IN-MH`.

The SVG includes SimpleMaps attribution and licensing information in its
header. Review and retain those terms when deploying the site.

### What to provide for a map replacement

The best replacement is one of:

- A licensed SVG with one path per region.
- Alternatively, a licensed GeoJSON `FeatureCollection` containing
  exactly 36 features, one for each current Indian state or territory.

Each path/feature must have a stable ISO-style identifier, ideally
`IN-AN`, `IN-AP`, …, `IN-WB`, plus the source license and attribution
text. If you have an official or designer-approved map, provide the file
and its license/attribution terms. Do not send a screenshot; screenshots
cannot provide selectable geographic boundaries.

## Content

The initial café descriptions remain in the frontend seed data. Unknown
addresses, hours, prices, contact details, coordinates, websites, and
photographs stay absent until supplied and verified. Apki Dulari remains
unpublished. The Chug and Farro are not café records.

## Routes

- `/` — interactive India map
- `/india/:stateSlug` — state café directory
- `/cafe/:cafeSlug` — café profile
- `/search?q=...` — published café search
- `/about` — editorial and data approach

The editorial collection section has been removed. The site now presents
the map, state directories, and individual café profiles directly.
