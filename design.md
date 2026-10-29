# ATE --- Design Specification

**Product:** Asthitva's Title of Existence (ATE)\
**Purpose:** An editorial, map-led café discovery website, beginning
with a curated Nagpur catalogue and designed to expand across India.\
**Design reference:** User-provided orange, electric blue, forest green,
cream, and black collage.

## 1. Product principles

-   Make the map the primary navigation, not a decorative background.
-   Lead with atmosphere, place, and editorial storytelling rather than
    dense data.
-   Keep the experience tactile and expressive while ensuring every
    interaction remains usable.
-   Distinguish verified venue information from draft editorial content.
-   Build the data model for nationwide coverage, but do not imply that
    all states or cafés are already populated.

## 2. Brand and art direction

### Palette

  -----------------------------------------------------------------------
  Token                   Hex                     Primary use
  ----------------------- ----------------------- -----------------------
  Burnt orange            `#F45112`               Main canvas, hero
                                                  sections, active states

  Electric blue           `#2549FF`               Map regions, hover
                                                  accents, interactive
                                                  highlights

  Forest green            `#075E38`               Secondary map regions,
                                                  graphic overlays

  Warm cream              `#F4E9D2`               Text on dark/orange
                                                  surfaces, cards, light
                                                  panels

  Ink black               `#171612`               Headlines, body text,
                                                  borders, icons
  -----------------------------------------------------------------------

Use these colors as the core palette. State colors should be selected
from a wider set of accessible tints and shades derived from the
reference palette, while keeping the overall composition coherent. Do
not make adjacent states indistinguishable.

### Typography

-   Display: condensed, heavy sans-serif for oversized headlines and
    state names.
-   Editorial: expressive serif for captions, collection titles, and
    short narrative statements.
-   Utility: legible sans-serif for navigation, forms, labels, and venue
    details.
-   Use uppercase sparingly for strong editorial labels; preserve
    readability in longer descriptions.

### Texture and composition

-   Fine paper grain and restrained print imperfections.
-   Distressed cartographic marks and architectural/map-like overlays
    inspired by the reference.
-   Asymmetric composition, strong negative space, thin rules, oversized
    typography, and editorial image crops.
-   Avoid generic SaaS/dashboard visuals, excessive gradients, excessive
    rounded cards, and decorative clutter.
-   Text and controls must remain readable over textures; use solid or
    translucent surfaces where necessary.

## 3. Information architecture

### Main routes

-   `/` --- Landing page and interactive India map.
-   `/india/:stateSlug` --- State discovery page with cafés in that
    state.
-   `/cafe/:cafeSlug` --- Individual café profile.
-   `/collections/:collectionSlug` --- Optional editorial collection
    page.
-   `/search?q=...` --- Search results.
-   `/about` --- Editorial purpose and submission/verification approach.

Build the architecture for all Indian states and union territories, but
show a state as populated only when real listings exist. Do not invent
cafés to fill empty states.

## 4. Landing page

### Header

-   ATE wordmark.
-   Minimal navigation: Explore, Collections, About.
-   Search entry point.
-   Responsive menu for smaller screens.

### Hero

Suggested copy: - Headline: **SOME PLACES JUST HIT DIFFERENT.** -
Supporting line: **A field guide to India's café culture.** - Map
instruction: **SELECT A STATE. FIND YOUR PLACE.**

Use the supplied visual reference as the art-direction anchor. The map
should remain the dominant interactive element.

### Interactive map

-   Use a real, licensed state-level SVG/GeoJSON map of India.
-   Include all 28 states and 8 union territories.
-   Every region must have a stable ID, accessible name, URL slug, and
    independent hit area.
-   Preserve the geometry and relative position of each state when
    responsive.
-   Use distinct colors from the palette and suitable derived shades.
-   Provide state labels where space allows; small regions need
    tooltips, external labels, or searchable selection.
-   Support zoom/pan only if it improves usability; do not make the map
    hard to navigate.
-   Include a searchable state selector as an alternative to direct map
    interaction.

## 5. State hover and selection behavior

### Hover

1.  Pointer enters a state.
2.  Raise the selected SVG region using a subtle transform and shadow;
    preserve the geographic relationship to neighboring regions.
3.  Bring the selected path to the top rendering layer where practical.
4.  Show a floating preview containing:
    -   State name.
    -   Count of published cafés.
    -   Three featured cafés, if at least three are available.
    -   Café thumbnail, name, and city for each preview item.
5.  Position the preview to avoid clipping at viewport edges.
6.  Keep the preview interactive while the pointer moves from the state
    to the card.
7.  Dismiss the preview when the pointer leaves both the selected state
    and its preview, unless the state has been pinned by click or
    keyboard selection.

If fewer than three published cafés exist, show the available number and
do not fabricate entries.

### Click and keyboard selection

-   Clicking a state opens `/india/:stateSlug`.
-   Enter and Space select a focused state.
-   Escape dismisses an unpinned preview.
-   Provide visible focus styles and accessible names.
-   Hover must never be the only way to discover or select a state.

### Touch behavior

On touch devices, use tap-to-select instead of hover. A tap selects a
state and opens its preview; a second tap or explicit action opens the
state page. Provide an obvious way to dismiss the preview.

## 6. State discovery page

Each state page should contain:

-   State name and concise editorial introduction.
-   Number of published cafés, calculated from actual records.
-   Search within the state.
-   City filter.
-   Optional filters for price range, ambience, amenities, and
    specialties when the data exists.
-   Sorting options based on available fields, such as name or
    editorially featured.
-   Responsive café card grid.
-   Empty, loading, and error states.
-   A route back to the map.

Do not show filters that have no supporting data. Avoid unsupported
ratings or popularity metrics.

## 7. Café card and profile

### Café card

Show only available information: - Cover image. - Café name. - City. -
Short editorial description. - Experience tags or specialties, if
supplied. - Price range, only if verified. - Featured label, only if set
by an editor.

### Café profile page

Possible sections: - Image gallery. - Café name and city/state. -
Editorial description. - Atmosphere and experience tags. - Address and
map/directions link, when verified. - Opening hours, contact,
website/social links, price range, and specialties when verified. -
Source/last-verified metadata in the content system, not necessarily as
prominent public UI. - Related cafés or collection, if available.

Do not fabricate addresses, opening hours, prices, ratings, contacts,
URLs, or photographs. If a field is unavailable, omit it rather than
displaying invented data.

## 8. Initial editorial content

The uploaded document contains three collections and six venue profiles.
The four café entries are grouped under **The Nagpur's Cafe Cartel**:

### The Nagpur's Cafe Cartel

Introductory copy from the supplied PDF: "Four cafes. Four moods. One
family behind the experience."

-   **Matra Cafe:** A personal favourite of SV; calming atmosphere and a
    subtle connection to nature. Positioned as a place to slow down and
    enjoy stillness.
-   **The Jacobs:** A distinctly Goan vibe, built around friendship,
    lingering conversations, shared laughter, and spending time with
    friends.
-   **Rachel's Cafe:** Designed for people on the move; a convenient
    stop for a quick bite or a short pause between commitments.
-   **Apki Dulari:** The document confirms it belongs to the family's
    café collection, but says its defining atmosphere or signature
    experience still needs confirmation. Keep this profile in draft
    until that information is supplied.

The source document also includes two non-café venues in separate
editorial collections: - **The Chug** --- Collection: "Oogway's
Acknowledgement." Described as a biergarten focused on food, beer and
mead, with more than 30 taps and founders Ankit and Ritika. This is not
part of the initial café-only map results unless the product scope later
expands. - **Farro** --- Collection: "Khayaal Se Kamaal." Described as a
fine-dining restaurant built around the chef's childhood dream and
attention to detail. This is not part of the initial café-only map
results unless the product scope later expands.

The PDF's context indicates Nagpur, but it does not provide verified
individual addresses, coordinates, opening hours, prices, contacts, or
official links. Keep location fields in draft until verified. Do not use
unrelated web images as if they were photographs of these venues.

## 9. Data model

Use Supabase PostgreSQL with at least these tables.

### `states`

-   `id` UUID primary key
-   `name` text
-   `slug` unique text
-   `region_code` text
-   `description` text nullable
-   `map_feature_id` text unique

### `cafes`

-   `id` UUID primary key
-   `state_id` UUID foreign key
-   `name` text
-   `slug` unique text
-   `city` text nullable
-   `address` text nullable
-   `description` text nullable
-   `ambience_tags` text array
-   `specialties` text array
-   `price_range` text nullable
-   `opening_hours` JSONB nullable
-   `phone` text nullable
-   `website_url` text nullable
-   `latitude` numeric nullable
-   `longitude` numeric nullable
-   `cover_image_path` text nullable
-   `is_featured` boolean default false
-   `published` boolean default false
-   `verification_status` enum/text, e.g. `draft`, `needs_verification`,
    `verified`
-   `source_notes` text nullable
-   `last_verified_at` timestamp nullable
-   `created_at`, `updated_at` timestamps

### Optional `cafe_images`

-   `id` UUID primary key
-   `cafe_id` UUID foreign key
-   `storage_path` text
-   `alt_text` text
-   `sort_order` integer

### Optional `collections` and `collection_cafes`

Use these if editorial collections are needed. Keep venue type separate
from collection membership.

## 10. Content management and data integrity

-   Supabase is the source of truth for venue records.
-   Public visitors can read published records only.
-   Only authorized editors can create or update listings.
-   Enable Row Level Security and provide explicit policies.
-   Store images in Supabase Storage or a configured image service.
-   Track verification status and last-verified date.
-   Keep the four café profiles as editorial seed data; mark unverified
    location details as missing.
-   Seed the two non-café venues separately and keep them out of café
    search.
-   Use no fabricated review counts, ratings, opening hours,
    coordinates, or business details.
-   Include clear development/demo content indicators where sample data
    is used.

## 11. Technical implementation

Recommended stack: - React + TypeScript + Vite. - Tailwind CSS with
shared design tokens. - Framer Motion for state lift and preview
transitions. - React Router for routes. - Supabase PostgreSQL and
Storage. - A licensed, accurate state-level India GeoJSON/SVG dataset.

Create reusable components: - `SiteHeader` - `IndiaMap` -
`StateRegion` - `StateHoverPreview` - `StateSearch` -
`StateCafeListing` - `CafeCard` - `CafeProfile` - `CollectionHeader` -
`EmptyState` - `LoadingState` - `ErrorState`

Keep map geometry separate from café records. Link map features to state
records by stable IDs, not by array order or display names.

## 12. Responsive behavior

-   Desktop: large interactive map and floating preview.
-   Tablet: map remains central, with preview positioned to avoid
    covering key regions.
-   Mobile: searchable state list plus map/list toggle; tap-to-select
    replaces hover.
-   Café grids adapt to screen width.
-   Avoid horizontal overflow.
-   Make small states selectable with accessible hit targets or a
    searchable alternative.

## 13. Accessibility and motion

-   Keyboard-operable state selection.
-   Semantic buttons/links and descriptive accessible names.
-   Visible focus indicators.
-   Sufficient text/background contrast.
-   Text alternatives for venue imagery.
-   Reduced-motion support.
-   Never rely on color alone to communicate selection.
-   Do not trap keyboard focus in the hover preview.

## 14. SEO and performance

-   Use descriptive page titles and metadata for state and café pages.
-   Generate stable, readable slugs.
-   Lazy-load gallery images.
-   Avoid loading a large map library if SVG paths are sufficient.
-   Optimize map geometry without removing useful boundaries.
-   Cache public read queries appropriately.
-   Add not-found handling for unknown states and cafés.

## 15. Acceptance criteria

-   All 28 states and 8 union territories are represented in the map.
-   Every map region has an independent accessible hit area.
-   Hover raises the selected region and reveals a floating café
    preview.
-   The preview shows up to three real featured cafés; it never invents
    missing entries.
-   The preview remains interactive when the pointer moves onto it.
-   Clicking a state opens the correct state page.
-   State search and café search work.
-   Only published café records appear in public café results.
-   The Chug and Farro do not appear in café results.
-   Apki Dulari remains unpublished until its missing editorial details
    are confirmed, unless an editor explicitly approves a neutral
    profile.
-   Unknown business details remain absent until verified.
-   Keyboard, touch, reduced-motion, and responsive behavior work.
-   Supabase Row Level Security is configured.
-   Type checking and production build complete without errors.

## 16. Suggested build order

1.  Create the project, design tokens, and shared layout.
2.  Integrate and validate the state-level SVG map.
3.  Implement state hover elevation, preview positioning, click, and
    keyboard behavior.
4.  Build state pages and café cards using local typed seed data.
5.  Implement café profile routes.
6.  Connect Supabase schema, policies, and data queries.
7.  Add editorial collections if needed.
8.  Add responsive behavior, accessibility, SEO, and loading/error
    states.
9.  Test all states, map edge cases, and routes.
10. Document setup, environment variables, database migrations, seed
    process, and deployment.

## Implementation status and design system

The interface uses the specified burnt orange (`#F45112`), electric blue (`#2549FF`), forest green (`#075E38`), warm cream (`#F4E9D2`), and ink (`#171612`) as its five core tokens. Barlow Condensed carries display headlines, Playfair Display carries editorial captions, and DM Sans/DM Mono carry utility text. Fine SVG noise, thin rules, asymmetry, oversized typography, and angular image placeholders create the print-inspired visual language. Placeholder art is intentionally typographic and is not presented as venue photography.

The implementation includes responsive shared navigation, map landing page, state and café routes, global published café search, editorial/about pages, reduced-motion behavior, focus styles, local typed seed data, and Supabase schema/RLS migration. The SVG map renderer reads a local feature collection and maps stable `IN-XX` feature IDs to state records. The exact geometry asset is an external setup dependency; until installed the interface reports that state clearly and provides a complete searchable state selector.

State previews use published café counts and featured records from the same published dataset. Keyboard focus opens a preview; Enter/Space opens the state page; Escape dismisses a preview. Touch users can tap once for a preview and again to open the state. Every state also has a direct searchable link, including compact union territories.

## Data integrity notes

The three described, published editorial profiles retain `needs_verification` status and null business detail fields. They are associated with Maharashtra as the source collection's stated Nagpur context, while their city remains null pending individual confirmation. Apki Dulari remains a private draft. The Chug and Farro exist only in the database migration with non-café `venue_type` values and `published = false`. No image, review, price, address, opening time, URL, or phone data was invented.
