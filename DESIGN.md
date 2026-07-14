# DESIGN.md — "Late Light"

The one-page visual contract for this site. Every component and page follows this exactly. If a choice isn't covered here, pick the quieter option.

## Concept

High-desert western Colorado at the last hour of sun. The photographs supply all the color and drama; the site is gallery paper around them — warm, near-white, disciplined. One accent, drawn from sun-cured grass at golden hour, marks everything interactive or active.

## Color tokens (defined in `src/styles/global.css`)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FCFBF8` | Page background. Gallery white with faint warmth. Deliberately whiter than cream. |
| `--shade` | `#F2F0E9` | Alternate surface: footer, contact band, form fields. "Open shade." |
| `--ink` | `#262019` | Text, wordmark. Warm near-black — exposed shadow, never `#000`. |
| `--umber` | `#6B6259` | Secondary text: dates, captions, blurbs, inactive index entries. |
| `--gold` | `#8F6B2C` | THE accent. Links, active index entry, ticks, focus rings. Nothing else is colored. |
| `--gold-soft` | `#C9A96A` | Accent over dark imagery (hero scrim text details), hover tints. |
| `--gold-deep` | `#82601F` | Gold for small text sitting on `--shade` (keeps contrast ≥4.5:1). |

No other colors. No gradients except the hero scrim (transparent → `rgba(20,16,12,…)`).

## Type

- **Display: Young Serif** (`--font-display`, weight 400 only). Warm, chunky, hand-cut. Used ONLY for: wordmark, page titles, category headings, shoot titles, the oversized intro line on the landing page. Never for body text, never under 1.4rem.
- **Body/UI: Karla** (`--font-body`, variable + italic). Everything else: nav, body, forms, captions.
- **Labels/eyebrows:** Karla, 13px, 500, caps, `letter-spacing: 0.12em`, `--umber`. Class `.eyebrow` exists in global.css. Used for dates, category labels, form labels.
- Scale: page titles `clamp(2.5rem, 6vw, 4.25rem)`; section headings `clamp(1.75rem, 3.5vw, 2.5rem)`; landing intro line `clamp(1.75rem, 3.5vw, 2.75rem)`; body 17px.

## Layout rules

- Whitespace is the material. Section spacing `var(--space-section)`, gutters `var(--space-gutter)`, both already defined.
- Photos: **no border-radius, no drop shadows, no borders.** Ever.
- Chrome (nav, footer, form) may use radius up to 2px on fields/buttons — essentially square.
- No cards. Images sit directly on paper with generous margins.
- Max content measure `var(--measure)` (62ch) for prose.
- **No numbered section markers.** No decorative hairline rules except the category-index connective rule (justified below).

## Page concepts

- **Landing:** 100svh hero image, tagline set low-left in `--paper` over a bottom scrim, floating nav. Then: oversized first-person intro line (Young Serif) with a short Karla paragraph, huge margins. Then a featured strip: editorial 12-col grid of 4 featured shoot covers, staggered with intentional white space, each linking to its category page. Then a quiet contact CTA on `--shade`. Footer.
- **Gallery:** long scroll; per category: heading + blurb, grid of that category's featured images, "View all [category] →". Signature index (below) floats right ≥900px.
- **Category page:** title + blurb; each shoot = eyebrow date + Young Serif title + story paragraph + ImageGrid per its `layout_hint`.
- **Contact:** two columns ≥768px (left: warm intro, email + Instagram fallbacks, pricingLine in Karla italic; right: form on `--shade`), stacked below.

## Signature element — the contact-sheet index

The gallery page's category tree, styled like the index a photographer grease-pencils onto a contact sheet:

- Desktop ≥900px: fixed right side, vertically centered. Entries in category order, Karla caps 13px, `--umber`. A thin 1px vertical rule (`--umber` at 30%) connects them. The active (in-view) section's entry turns `--ink` and its frame glyph — a small square outline (`□`, drawn with CSS borders, ~10px) — becomes filled with `--gold` (`■`). Clicking smooth-scrolls (respecting reduced motion).
- Mobile <900px: same component collapses to a horizontal, scrollable chip row pinned under the header; active chip gets `--ink` text + `--gold` underline/frame. Same script, CSS breakpoint swaps layout.

This is the ONE decorated element. Everything around it stays quiet.

## Motion (both gated behind `prefers-reduced-motion`)

1. **Hero settle:** hero image scales 1.035 → 1 with a fade, 1.2s ease-out, once on load.
2. **Gallery reveal:** category sections rise 12px + fade in via IntersectionObserver, 0.6s, once.

Nothing else moves except hover/focus transitions ≤200ms.

## Copy register

Warm, plain, first person. Zero marketing filler. "I photograph people who'd rather forget the camera is there" — that register. Buttons say what they do ("Send inquiry", not "Submit"). Dates written like "June 2026", not ISO.

## Quality floor (unannounced)

Responsive to 360px. Visible `:focus-visible` (already global). Semantic landmarks (`header/nav/main/footer`, one `h1` per page). Alt text on every image. Hero eager + `fetchpriority="high"`; everything below fold lazy. Lighthouse ≥95 a11y / ≥90 perf on gallery.

## Anti-default check (why this isn't a template)

- Paper is whiter/cooler than the cliché cream `#F4F1EA`; accent is muted harvest gold, not terracotta `#D97757`.
- Display serif is chunky low-contrast Young Serif, not a high-contrast Playfair/Didone.
- Light theme; not near-black-plus-acid-accent.
- One connective rule, earned by the contact-sheet metaphor — not broadsheet hairlines everywhere.
- No numbered markers; categories aren't a sequence.
