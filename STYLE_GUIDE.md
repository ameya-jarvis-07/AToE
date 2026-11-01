# ATOE Style Guide

**Product:** ATOE — Asthitva's Title of Existence  
**Purpose:** Editorial, map-led discovery of India's hospitality culture.

This document is the single reference for the visual language, content
style, colors, typography, layout, and interaction patterns used by ATOE.
The implementation source is `src/style.css`; the product and content
specification is documented in `design.md`.

## Brand direction

ATOE should feel like a printed field guide: tactile, expressive,
editorial, asymmetric, and slightly imperfect. The map is the primary
navigation surface, not a decorative background.

### Do

- Use oversized condensed headlines and strong negative space.
- Combine expressive serif editorial copy with practical sans-serif UI text.
- Use thin rules, angular compositions, paper grain, and cartographic marks.
- Keep state boundaries, café records, and verification status truthful.
- Keep controls readable over textures and colored surfaces.
- Use solid or translucent surfaces when contrast needs protection.

### Avoid

- Generic SaaS or dashboard styling.
- Excessive gradients, rounded cards, or decorative clutter.
- Fabricated café details, ratings, reviews, addresses, photographs, or hours.
- Relying on color alone to communicate selection or status.
- Presenting placeholder art as authentic venue photography.

## Color system

### Core tokens

| Token | CSS variable | Hex | Primary use |
|---|---|---|---|
| Burnt orange | `--orange` | `#F45112` | Main canvas, hero, active states, emphasis |
| Electric blue | `--blue` | `#2549FF` | Map regions, hover accents, interactive highlights |
| Forest green | `--green` | `#075E38` | Secondary bands, map regions, editorial sections |
| Warm cream | `--cream` | `#F4E9D2` | Page background, light panels, text on dark/orange |
| Ink black | `--ink` | `#171612` | Headings, body text, borders, icons, dark panels |

### Supporting colors

| Color | Hex | Use |
|---|---|---|
| Preview accent | `#FF7446` | Small links on dark preview panels |
| Muted text | `#68645B` | Source notes and low-emphasis metadata |
| Map rust | `#C84C34` | Derived map region |
| Map ochre | `#E4B839` | Derived map region |
| Map teal | `#39806B` | Derived map region |
| Map periwinkle | `#708BE7` | Derived map region |
| Map purple | `#4B2D78` | Derived map region |
| Card ochre | `#D7B84D` | Third café card placeholder surface |
| Light search hover | `#F5D1B6` | State search result hover |

### Transparency and effects

| Effect | Value | Use |
|---|---|---|
| Default rule | `rgba(23, 22, 18, 0.32)` | `--line`, dividers, understated borders |
| Light panel rule | `rgba(244, 233, 210, 0.35)` | Rules on ink/green/blue surfaces |
| Detail image rule | `rgba(244, 233, 210, 0.6)` | Decorative rings on blue image placeholders |
| Selected map shadow | `drop-shadow(0 7px 5px rgba(23, 22, 18, 0.38))` | Selected state elevation |
| Preview shadow | `8px 8px 0 var(--blue)` | Floating state preview |
| Body grain | SVG fractal noise, opacity `.12` | Printed-paper texture |

### Color usage rules

- Use warm cream as the default page background.
- Use ink for default text, borders, and icons.
- Use burnt orange for emphasis, active states, hero surfaces, and editorial
  accents.
- Use electric blue and forest green as large supporting surfaces.
- Derived map colors must keep neighboring regions distinguishable.
- Always check text/background contrast, especially on colored hero surfaces.

## Typography

Fonts are loaded from Google Fonts in `src/style.css`.

| Role | Family | Weights/styles | Use |
|---|---|---|---|
| Display | `Barlow Condensed` | 500–900 | Hero headlines, page titles, state names, card titles, numbers |
| Editorial | `Playfair Display` | 500–600, italic | Captions, introductions, descriptions, statements, narrative copy |
| Utility | `DM Sans` | 400–700 | Navigation, body text, forms, metadata, venue details |
| Technical utility | `DM Mono` | 400–500 | Labels, indexes, filters, source notes, compact actions |

Fallbacks:

```css
font-family: "DM Sans", Arial, sans-serif;
font-family: "Barlow Condensed", Impact, sans-serif;
font-family: "Playfair Display", serif;
font-family: "DM Mono", monospace;
```

### Type hierarchy

| Element | Style |
|---|---|
| Hero title | `Barlow Condensed`, weight 900, uppercase, very large, tight tracking, line-height around `.79` |
| Page/state title | `Barlow Condensed`, weight 900, uppercase display scale, line-height around `.82` |
| Section title | `Barlow Condensed`, weight 800, tight tracking, line-height `.85–.9` |
| Editorial statement | `Barlow Condensed` weight 800 with selective `Playfair Display` italic emphasis |
| Editorial intro | `Playfair Display`, italic, approximately 18–21px |
| Body copy | `DM Sans`, approximately 13–16px, line-height `1.6–1.7` |
| Navigation | `DM Sans`, approximately 12px |
| Labels/indexes | `DM Mono`, 8–10px, uppercase, letter-spacing `.5–1.7px` |
| Tags | `DM Mono`, 9px, bordered, compact padding |

### Type rules

- Use uppercase sparingly for short labels, indexes, navigation, and
  editorial signposts.
- Do not use condensed display type for long paragraphs.
- Use italics to distinguish editorial voice from utility information.
- Keep long-form copy readable; preserve normal casing for descriptions.
- Use `letter-spacing` selectively for labels and display lockups.

## Layout and composition

- Use asymmetric grids, thin black rules, and deliberate whitespace.
- Page content generally uses responsive horizontal padding between
  `20px` and `120px`.
- The header is a `76px` cream bar on desktop and `66px` on mobile.
- Hero sections use burnt orange and a minimum desktop height around `610px`.
- The map section uses cream, generous vertical spacing, and a large central
  SVG map.
- Editorial bands may use forest green or electric blue with cream text.
- Avoid excessive rounded corners; most surfaces are rectangular.
- Links commonly use a bottom rule and an arrow icon.
- Use the supplied assets for brand/hero art and clearly label placeholders.

## Component styling

### Header and navigation

- Cream background with a 1px ink bottom border.
- ATOE wordmark uses the supplied logo asset.
- Desktop navigation is minimal: Explore, About, and Search.
- Search is separated by a left rule.
- Mobile navigation becomes a full-width cream dropdown below the header.
- Hover links change to burnt orange.

### Hero

- Burnt orange background with optional hero artwork in the upper-right.
- Kicker and index use small mono uppercase text.
- Headline is oversized condensed type; selected emphasis uses cream.
- Supporting statement uses italic Playfair Display.
- Scroll action uses a mono label and bottom rule.

### Interactive map

- Render actual independent state/territory SVG paths.
- Default paths use cream borders and palette-derived fills.
- Hover/focus/selected paths use ink borders, increased stroke width, scale,
  and a drop shadow.
- Selected state uses burnt orange as the final visual focus.
- Provide searchable state selection as an alternative to small map regions.
- The map side note uses an ink rule and mono state/territory count.

### State preview

- Ink background, cream text, burnt-orange left border, and electric-blue
  offset shadow.
- Includes state label, state name, published count, editorial description,
  up to three real featured records, and an exploration link.
- The preview is positioned near the selected map region without clipping.
- It must be keyboard dismissible and remain usable on touch screens.

### Café cards

- Rectangular abstract image placeholder; never imply it is a real venue
  photograph unless an approved image exists.
- Use burnt orange, electric blue, or ochre card surfaces.
- Add small mono stamp/index details and a simple geometric motif.
- Metadata is uppercase mono text.
- Café title uses Barlow Condensed.
- Description uses DM Sans.
- Tags use bordered mono labels.

### State and search pages

- Use a large condensed title with a burnt-orange terminal period.
- Place the published count beside the state heading where space allows.
- Search and select controls use transparent backgrounds and bottom rules.
- Use directory grids with three columns on desktop, two on tablet, and one
  on mobile.
- Empty states use an editorial message, orange symbol, and a clear return
  action.

### Café detail page

- Use a burnt-orange page surface.
- Pair a large blue abstract image placeholder with a large editorial title.
- Show only supplied and verified metadata.
- Use thin ink rules to separate detail sections.
- Source/verification notes remain quiet and editorial rather than prominent.

### Footer and utility actions

- Footer uses ink background, cream text, and mono utility copy.
- The back-to-top control is an orange rectangular button with an ink border;
  hover changes it to blue with cream text.

## Content style

### Voice

ATOE is observant, warm, concise, and editorial. It should sound like a
careful field note rather than a review platform or directory database.

Prefer:

- “A place to slow down and enjoy stillness.”
- “A distinctly Goan vibe, built around friendship and lingering
  conversations.”
- “The next good thing here is still being found.”

Avoid:

- Unsupported ratings or popularity claims.
- Generic promotional superlatives.
- Invented opening hours, prices, contact details, addresses, coordinates,
  websites, or photographs.

### Content hierarchy

1. Place and atmosphere.
2. Concise editorial description.
3. Verified location and practical details, only when available.
4. Experience tags and specialties, only when supplied.
5. Verification/source metadata for editorial administration.

### Data integrity language

- Say “Location to be confirmed” when a city is absent.
- Omit unavailable fields rather than displaying guessed values.
- Mark unverified records as draft or needs verification.
- Show published counts from the same published dataset used for results.
- Keep non-café venues out of café listings.

## Interaction and accessibility

- All map regions must be keyboard focusable and have descriptive accessible
  names.
- Enter and Space select a focused map region.
- Escape dismisses an unpinned preview.
- Touch uses tap-to-select rather than hover.
- Provide visible focus rings: 3px electric blue outline with 4px offset.
- Never rely on color alone to communicate selection.
- Preserve readable contrast over textures and colored surfaces.
- Respect `prefers-reduced-motion`; disable or minimize transitions and
  smooth scrolling when requested.
- Keep controls semantic and ensure links do not look interactive unless
  they work.

## Responsive behavior

### Desktop

- Large map and floating preview.
- Three-column card grids.
- Two-column café detail layout.
- Full navigation visible.

### Tablet

- Map remains central but uses reduced canvas height.
- Card grids reduce to two columns.
- Detail pages remain spacious but may stack when necessary.

### Mobile

- Header switches to a menu button and dropdown navigation.
- Hero and map use compact horizontal padding.
- Map uses a smaller SVG canvas and a searchable state list.
- State preview becomes narrower and vertically constrained.
- Café grids become one column.
- Café detail image and content stack vertically.
- Do not allow horizontal overflow.

Breakpoints used by the current stylesheet:

- `800px`: tablet/mobile layout changes.
- `520px`: narrow mobile layout changes.
- `prefers-reduced-motion: reduce`: motion and scroll fallback.

## Implementation references

- Global tokens and component styles: `src/style.css`
- Page structure and content usage: `src/App.tsx`
- Product design contract: `design.md`
- Seed content and record status: `src/data/seed.ts`
- Map asset and attribution: `public/in.svg` and `README.md`

