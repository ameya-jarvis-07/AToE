# Complete Build Prompt --- ATE Interactive India Café Discovery

Act as a senior frontend engineer, interaction designer, and
product-minded full-stack developer. Build a complete, working website
called **ATE --- Asthitva's Title of Existence**, an editorial café
discovery platform using an interactive political map of India.

Read and follow `design.md` as the source of truth for visual direction,
behavior, initial venue copy, data integrity, architecture, and
acceptance criteria. If the existing repository has code, inspect it
first and extend it without breaking working features. Do not stop at a
mockup or static landing page.

## Product objective

The landing page uses India's political map as the main navigation.
Every state and union territory is individually selectable. Hovering
over a state raises it above the map and opens a floating preview with
the state name, published café count, and up to three featured cafés.
Clicking a state opens its full discovery page. Clicking a café opens
its own detail page.

The first editorial catalogue is based on the supplied
`cafe_profiles_nagpur.pdf`. Start with its four café profiles and keep
The Chug and Farro out of café search because the document describes
them as a biergarten and a restaurant. Do not fabricate a nationwide
café catalogue. All other states should exist on the map but may show
zero published listings until verified records are added.

## Mandatory design direction

Use the supplied reference image and the exact palette: - Burnt orange
`#F45112` - Electric blue `#2549FF` - Forest green `#075E38` - Warm
cream `#F4E9D2` - Ink black `#171612`

Build a bold editorial identity with condensed oversized headings, serif
captions, distressed cartographic textures, paper grain, asymmetry, thin
rules, and deliberate negative space. Avoid generic SaaS dashboard
design, excessive gradients, unnecessary pill-shaped UI, and clutter.
Keep all text readable and interactions obvious. Reuse the supplied
image only as a design reference, not as a substitute for the real map.

## Required stack

Use React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router,
and Supabase (PostgreSQL and Storage). Use the existing repository's
conventions if they are already established and suitable.

## Map implementation

1.  Integrate an accurate, appropriately licensed state-level
    SVG/GeoJSON dataset covering all 28 states and 8 union territories.
2.  Render every region as an independently interactive SVG path.
3.  Give each path a stable state ID, accessible name, and route slug.
4.  Keep geographic geometry separate from café content.
5.  Use distinct state fills drawn from the design palette and
    accessible derived shades. Keep neighboring states distinguishable.
6.  On hover or focus, elevate the region with a subtle translate/scale
    effect, shadow, and increased visual prominence. Avoid changing its
    geographic position so much that it obscures neighboring areas.
7.  Ensure the selected path renders above other paths where feasible.
8.  Display a floating preview with state name, real published café
    count, and up to three featured cafés. Show fewer than three when
    fewer are available; never invent entries.
9.  Keep the preview open as the pointer moves from the state into the
    preview card. Dismiss it when both are left, unless the state is
    pinned by click or keyboard selection.
10. Position the preview intelligently near viewport edges so it does
    not clip.
11. Clicking a state navigates to `/india/:stateSlug`.
12. Add keyboard support: Tab navigation, visible focus, Enter/Space
    selection, Escape dismissal, and semantic accessible names.
13. On touch screens, use tap-to-select and provide an obvious
    close/open-state action.
14. Add a searchable state selector as a reliable alternative for small
    regions.
15. Do not use an ordinary image of India with fake hotspots. The map
    must use actual independent geographic paths.

## Pages and routes

### `/`

Create the editorial landing page: - Minimal ATE header and
navigation. - Hero headline: "SOME PLACES JUST HIT DIFFERENT." -
Supporting copy: "A field guide to India's café culture." - Main
interactive map. - Instruction: "SELECT A STATE. FIND YOUR PLACE." -
State search and floating preview. - A responsive, polished footer.

### `/india/:stateSlug`

Create a full state discovery page: - State name and editorial
introduction. - Published café count computed from data. - Search by
café name. - City filter and other filters only when corresponding data
exists. - Sorting by name or editor-selected featured order. -
Responsive café cards. - Loading, empty, error, and invalid-state
states. - Link back to the map.

### `/cafe/:cafeSlug`

Create a café detail page: - Café name, gallery, city/state, and
editorial description. - Ambience tags and specialties when supplied. -
Address, directions, opening hours, phone, website, and price range only
when verified and available. - Related cafés only when real records
exist. - Clear back navigation.

### Optional editorial collections

If practical, support `/collections/:collectionSlug` for editorial
groups. Preserve the exact supplied collection names. Collection
membership must not redefine a venue's type.

## Initial editorial seed data

Use these descriptions from the supplied PDF, preserving their meaning:

**Collection: The Nagpur's Cafe Cartel** Intro: "Four cafes. Four moods.
One family behind the experience."

-   **Matra Cafe:** A personal favourite of SV. Calming atmosphere with
    a subtle connection to nature; a place to slow down and enjoy
    stillness.
-   **The Jacobs:** A distinctly Goan vibe focused on friendship,
    lingering conversations, shared laughter, and time with friends.
-   **Rachel's Cafe:** Designed for people on the move; a convenient
    place for a quick bite or a short pause between commitments.
-   **Apki Dulari:** The source says its distinct atmosphere and
    character should be presented once its defining vibe or signature
    experience is confirmed. Keep this record in draft/unpublished
    status until the client supplies that information.

The PDF also includes: - **The Chug**, in "Oogway's Acknowledgement": a
biergarten focused on food, beer and mead, with more than 30 taps and
founders Ankit and Ritika. Store as a non-café venue if the schema
supports it, but exclude it from café results. - **Farro**, in "Khayaal
Se Kamaal": a fine-dining restaurant born from the chef's childhood
dream, with emphasis on service, presentation, and detail. Store as a
non-café venue if supported, but exclude it from café results.

The source does not provide verified individual addresses, coordinates,
opening hours, prices, contact details, official URLs, or authentic
image files. Do not invent these. The PDF's context indicates Nagpur,
but confirm each venue's actual location before publishing it as a
verified Nagpur listing. Do not present unrelated web search images as
authentic venue photos. Use client-supplied assets or clearly marked
placeholders.

## Data and backend

Create Supabase migrations/schema and seed scripts. Use a `states` table
and a `cafes` table, with optional gallery and collection tables. Each
café record should support: - UUID, state foreign key, name, unique
slug, city, address, description - Ambience tags, specialties, price
range, opening hours - Phone, website, latitude, longitude - Cover
image/storage path - Featured flag, published flag, verification
status - Source notes, last verified timestamp, created/updated
timestamps

All unknown business fields must remain null. Use actual state geometry
IDs to link map paths to state records; do not depend on array position
or fragile display-name matching.

Enable Row Level Security. Public users can read published listings
only. Only authorized editors can create, update, publish, or delete
records. Never expose service-role credentials in client-side code. Use
environment variables and include `.env.example` with placeholders only.

If Supabase credentials are unavailable, the application must still run
in a clearly identified local demo mode using typed seed data. Do not
claim that the database is connected when it is not.

## Search, filtering, and performance

-   Search published café names and descriptions.
-   Filter by state and city; only show other filters when data supports
    them.
-   Keep counts derived from the same filtered/published dataset.
-   Lazy-load images and avoid unnecessary heavy map libraries.
-   Optimize SVG geometry without losing meaningful state boundaries.
-   Add SEO titles and descriptions for state and café pages.
-   Ensure deep links work after refresh and handle unknown slugs
    gracefully.

## Quality requirements

-   Fully responsive desktop, tablet, and mobile layouts.
-   Accessible keyboard and touch interactions.
-   Reduced-motion support.
-   Visible focus styles and adequate contrast.
-   Semantic HTML, alt text, and usable forms.
-   No fake ratings, reviews, contact details, hours, addresses, or
    coordinates.
-   No dead buttons, placeholder links that appear functional, or broken
    routes.
-   Useful loading, empty, and error states.
-   No hardcoded secrets.

## Required deliverables

1.  Complete runnable application.
2.  `design.md` documenting visual system, interaction, content, data
    model, and acceptance criteria.
3.  Supabase SQL migrations and seed scripts.
4.  `.env.example`.
5.  README with setup, local development, Supabase configuration,
    seeding, and deployment.
6.  Working routes for map, state, and café pages.
7.  Tests or a documented verification checklist for map selection,
    hover-preview persistence, routes, search, filtering, and
    published-only data.

## Execution process

First inspect the repository and identify existing framework, files, and
working features. Then implement the smallest complete end-to-end
version. Do not merely return a plan or code snippets. Run available
type checks, tests, and production build; fix issues you encounter.
Report what was implemented, which checks passed, any external dataset
or credential still required, and how to run the application.

Use `design.md` as the implementation contract. If a requirement cannot
be completed because a licensed map dataset, client asset, or credential
is missing, build the surrounding integration cleanly and document the
exact missing dependency rather than faking it.
