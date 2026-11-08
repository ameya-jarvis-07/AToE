# ATOE Content Guide

ATOE is currently a frontend-only application. Content is stored in typed
local files and static assets.

## Add or edit a café

Edit [`src/data/seed.ts`](./src/data/seed.ts).

Add a record to the exported `cafes` array. Keep the existing `Cafe` type and
use a stable lowercase `id` and `slug`. Set `published` to `false` until the
record is ready for public display.

Only add details that are supplied and verified. Keep unknown addresses,
opening hours, prices, contact details, coordinates, websites, and photographs
as `null` or absent. Use `verificationStatus` and `lastVerifiedAt` to record
the editorial state.

## Add or edit states

State records are generated near the top of
[`src/data/seed.ts`](./src/data/seed.ts). Preserve the stable state ID, slug,
region code, and map feature ID because the map uses those values to connect
geography with content.

## Add or edit cities

Edit [`src/data/cities.json`](./src/data/cities.json). Each city needs a
stable ID, state ID, name, slug, and `majorCity` value.

District associations are stored in
[`src/data/cities-by-district.json`](./src/data/cities-by-district.json).
Regenerate the district assets and this index with:

```powershell
node scripts/build-state-district-assets.mjs
```

Do not assign a city to a district when the source data does not provide a
reliable unique match.

## Add images and static files

Place approved public assets in [`public/`](./public). Use descriptive
lowercase filenames and reference them with a root-relative URL such as
`/images/matra-cafe-cover.webp`.

Map and district files belong under [`public/states/`](./public/states).
Review the attribution requirements in
[`public/states/README.md`](./public/states/README.md) before replacing or
regenerating map data.

## Change application behavior

Edit the relevant component under [`src/`](./src). Route definitions and page
composition live in [`src/pages/AppRoutes.tsx`](./src/pages/AppRoutes.tsx).
Shared styling lives in [`src/style.css`](./src/style.css).

Do not edit generated district assets by hand. Do not put content records
directly into route or presentation components.

## Validate changes

Run these commands from the repository root:

```powershell
npm run typecheck
npm run build
```

Before submitting a content change, confirm that unpublished records do not
appear in public lists or search results and that no unsupported details were
introduced.
