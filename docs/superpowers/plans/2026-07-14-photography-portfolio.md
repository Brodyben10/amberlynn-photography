# Photography Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Production-ready Astro photography portfolio for a solo western-Colorado photographer, beautiful on day one with committed mock content, managed after launch purely through content files by an AI agent.

**Architecture:** Static Astro 5 site. Content collections with strict zod schemas are the editing contract between content and code. Three-phase build per PRD §9: sequential foundation (scaffold + schemas + design system), three parallel subagent lanes (components/pages, content/mock-data, tooling/docs), sequential integration + design critique.

**Tech Stack:** Astro 5 (static), sharp, @fontsource packages (self-hosted fonts), vanilla `.astro` + scoped CSS + design tokens, Cloudflare Pages.

## Global Constraints (from PRD — every task inherits these)

- Astro 5+, `output: 'static'`. No SSR, no CMS, no UI framework, no Tailwind.
- Every photo via `astro:assets` `<Image>`; hero eager + `fetchpriority="high"`; below-fold lazy.
- All photographer-specific strings flow from `src/content/site/settings.md` — zero hardcoded in components.
- Schemas `.strict()`; `category` uses `reference()`; images use `image()` helper; `layout_hint` enum `masonry | editorial | full`.
- No pricing table/page — single `pricingLine` string rendered on contact page.
- Banned aesthetics: cream `#F4F1EA`-ish + high-contrast serif + terracotta `#D97757`-ish; near-black + acid accent; broadsheet hairline everywhere + zero radius; numbered section markers (01/02/03).
- No border-radius or drop shadows on photos. Whitespace is the material.
- Motion: only hero settle + gallery scroll-reveal, both gated `prefers-reduced-motion`.
- Quality floor: responsive to 360px, visible focus states, semantic landmarks, alt text everywhere, Lighthouse ≥95 a11y / ≥90 perf on gallery.
- `npm install && npm run build` must succeed offline (mock images + fonts committed / from npm).
- Commits: brief, one sentence, lowercase, no period, no attribution lines.

## Design Plan (DESIGN.md content — locked before parallel work)

**Concept: "Late Light"** — high-desert western Colorado at the last hour of sun: gallery-white paper, warm exposed-shadow ink, one accent drawn from sun-cured grass. Photography supplies all color beyond that.

**Tokens:**

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#FCFBF8` | page background (gallery white, faint warmth — deliberately whiter than cream) |
| `--shade` | `#F2F0E9` | alternate surface (open shade) — footer, contact band |
| `--ink` | `#262019` | text / wordmark (warm near-black, "exposed shadow", never pure #000) |
| `--umber` | `#6B6259` | secondary text: captions, dates, blurbs |
| `--gold` | `#8F6B2C` | the one accent: links, active states, ticks (dry grass at last light) |
| `--gold-soft` | `#C9A96A` | accent on dark/hover tints, hero scrim glyphs |

**Type:** Display = **Young Serif** (400 only) — warm, chunky, hand-cut feel; used ONLY for wordmark, page titles, category headings. Body/UI = **Karla** (variable + italic) — quiet humanist grotesque; nav, body, captions. Labels/eyebrows = Karla caps, `letter-spacing: 0.12em`, 13px. Both via `@fontsource` npm packages (offline-safe). `font-display: swap`.

**Layout concepts:**
- Landing: 100svh hero (image + tagline low-left, scrim), floating nav; oversized first-person intro line (Young Serif, ~clamp 28–44px) with generous margins; featured strip = editorial 12-col grid of 4 featured shoots (staggered, whitespace between); quiet contact CTA on `--shade` band; small footer.
- Gallery: category sections (heading + blurb + 6–10 featured images + "View all [category] →"), signature index floating right ≥900px, chip row <900px.
- Category: title + blurb, then each shoot: eyebrow date, Young Serif title, 1–3 sentence story, ImageGrid per `layout_hint`.
- Contact: two-column ≥768px (intro + fallbacks left, form right), stacked mobile; pricingLine as quiet italic near form; `--shade` background.

**Signature element:** the contact-sheet category index — thin 1px `--umber`-at-30% vertical rule connecting entries, Karla caps entries, active entry gains a small filled frame glyph (□→■, `--gold`) and full `--ink` color, like a grease-pencil tick on a contact sheet. Collapses to horizontal chip row under 900px, same component + script.

**Motion:** hero image settles (scale 1.035→1, opacity, 1.2s ease-out once) + gallery sections reveal (12px rise + fade, IntersectionObserver). Nothing else. Both disabled under `prefers-reduced-motion`.

**Anti-default critique:** paper is whiter and cooler than banned cream; accent is muted harvest gold, not terracotta/clay; display serif is low-contrast and chunky (Young Serif), not the high-contrast Didone/Playfair default; single connective rule justified by the contact-sheet metaphor (not broadsheet hairlines everywhere); no numbered markers anywhere; light theme (not near-black + acid).

**Mock identity:** "Amber Lynn" (matches repo name — likely close to the real client; trivially replaceable in `settings.md`). Wordmark: "Amber Lynn — Photography". Tagline register: "I photograph people who'd rather forget the camera is there." Location: Grand Junction, Colorado.

## File Structure

```
astro.config.mjs          # static output, image config
package.json              # scripts: dev, build, preview, ingest, fetch-mock-images
src/
  content.config.ts       # zod schemas (Astro 5 location; PRD says config.ts — content.config.ts is the Astro 5 name, flag as deviation)
  styles/global.css       # tokens, reset, base type, focus states
  layouts/Base.astro      # head, fonts, nav, footer, skip link
  components/
    Nav.astro             # floating nav + scrolled state script
    Hero.astro            # 100svh landing hero
    CategoryTree.astro    # signature scroll-spy index / chips
    ImageGrid.astro       # variant: masonry | editorial | full
    ShootSection.astro    # shoot header + story + grid (category pages)
    ContactForm.astro     # Formspree form
  pages/
    index.astro
    gallery/index.astro
    gallery/[category].astro
    contact.astro
  content/
    site/settings.md
    categories/{weddings,engagements,family,seniors}.md
    shoots/<8 slugs>/{index.mdx, *.webp}
scripts/
  fetch-mock-images.mjs   # curated Unsplash list → shoot folders (via sharp pipeline)
  ingest.mjs              # npm run ingest <src> <category> <slug>
CLAUDE.md                 # agent operations manual
README.md                 # owner-facing setup
DESIGN.md                 # design plan above
.gitignore, .node-version
```

---

### Task 1 (Phase 1, inline): Foundation

**Files:** scaffold above minus components/content/scripts; sample content for build validation (1 category + 1 shoot with 2 solid-color webps, slug `_sample`, removed in Phase 3).

**Produces (interface for Phase 2):**
- `content.config.ts` collections: `site` (singleton), `categories`, `shoots` — exact schemas below.
- `src/styles/global.css` custom properties named exactly as token table.
- `Base.astro` props: `{ title: string, description?: string }`, renders `<slot />`, imports global.css + fonts, contains Nav placeholder + footer reading from settings.

Schemas (exact):

```ts
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const site = defineCollection({
  loader: glob({ pattern: 'settings.md', base: './src/content/site' }),
  schema: ({ image }) => z.object({
    photographerName: z.string(),
    wordmark: z.string(),
    tagline: z.string(),
    location: z.string(),
    email: z.string().email(),
    instagram: z.string(),
    formspreeId: z.string(),
    pricingLine: z.string(),
    heroImage: image(),
    heroAlt: z.string(),
  }).strict(),
});

const categories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/categories' }),
  schema: z.object({
    displayName: z.string(),
    order: z.number().int(),
    blurb: z.string(),
    featuredCount: z.number().int().default(8),
  }).strict(),
});

const shoots = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/shoots' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    category: reference('categories'),
    date: z.date(),
    cover: image(),
    images: z.array(z.object({ src: image(), alt: z.string() })).min(1),
    layout_hint: z.enum(['masonry', 'editorial', 'full']).default('masonry'),
    featured: z.boolean().default(false),
  }).strict(),
});

export const collections = { site, categories, shoots };
```

Note: shoot `images` are `{src, alt}` pairs so every image carries alt text (PRD a11y floor). Shoot id = `<slug>/index.mdx` → slug derived via `entry.id.split('/')[0]` — pages must use a shared helper `src/lib/shoots.ts` `shootSlug(entry)`.

Steps:
- [ ] `npm create astro` minimal, strict TS; install sharp, @fontsource/young-serif, @fontsource-variable/karla
- [ ] git init, .gitignore (node_modules, dist, .astro)
- [ ] content.config.ts as above; global.css tokens; Base.astro; 4 page shells rendering settings data (proves wiring)
- [ ] sample content `_sample` + settings.md with real mock identity + hero placeholder image
- [ ] `npm run build` → passes; also verify a deliberately bad frontmatter fails, then revert
- [ ] Write DESIGN.md; commit

### Task 2A (Phase 2, subagent): Components & pages

Owns `src/components|pages|layouts|styles`. Follows DESIGN.md exactly. Details per PRD §2–3 + §8. Builds against Task 1 schemas; may not change them. Verify with `npm run build` + dev inspection.

### Task 2B (Phase 2, subagent): Content & mock data

Owns `src/content`, `scripts/fetch-mock-images.mjs`. Curates ~44 Unsplash URLs (warm natural light, CO-plausible), downloads, sharp-processes (2400px WebP q80, EXIF stripped), authors 4 categories + 8 shoots (6–10 images, stories, past-year dates, believable titles), final settings.md + hero. Deletes `_sample` shoot. May not change schemas.

### Task 2C (Phase 2, subagent): Tooling & docs

Owns `scripts/ingest.mjs`, CLAUDE.md, README.md, root config. Ingest per PRD §6 (sharp pipeline shared shape with 2B, friendly errors). CLAUDE.md per PRD §7 (four operations, hard no-code-edit rule, publish flow). README: owner-facing Cloudflare Pages setup. Cloudflare build config (build command `npm run build`, output `dist`, Node 20+ via `.node-version`).

### Task 3 (Phase 3, inline): Integration & critique

- [ ] `npm run build` clean; fix seams (image paths, slug helper use, featured counts)
- [ ] Serve built site; inspect pages (screenshots if tooling available) against DESIGN.md + banned defaults; apply Chanel rule (remove one decorative element)
- [ ] Verify breakpoints 360/390/768/900, reduced-motion, keyboard focus, alt text
- [ ] Execute CLAUDE.md "add a shoot" literally with 2 spare images; verify; revert
- [ ] Malformed-frontmatter build-failure check (bad ref, unknown key, bad enum)
- [ ] Final commit summarizing design decisions + PRD deviations
