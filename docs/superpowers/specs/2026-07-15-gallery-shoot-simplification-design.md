# Gallery shoot simplification

Date: 2026-07-15

## Problem

The site currently treats every batch of photos as a "shoot": a folder with a
required title, date, and narrative story paragraph, rendered on the category
page as its own titled section. That's overkill for casual batches (e.g. prom
send-off photos) where there's no real "event" to narrate — the owner should
be able to drop a folder of photos into a category and be done, without
inventing a title, pinning down an exact date, or writing a story.

Two related changes:
1. Category pages should read as a flowing gallery, not a list of individually
   labeled shoots.
2. The content model (schema + ingest script + docs) should stop forcing
   title/date/story as fields that must be filled in.

## Decisions

- **Grouping stays, gets lighter.** Shoots remain the on-disk grouping unit
  (one folder per ingest run, still called "shoots"). `title` and `date`
  become optional. Alt text per photo stays required — that's an
  accessibility need, unrelated to event framing.
- **Featuring stays per-shoot.** One `featured: true` flag still marks every
  photo in a batch as featured; no per-photo granularity.
- **Title/date/story are never displayed on the category page**, whether or
  not they're filled in. They become purely internal/organizational fields
  (title only surfaces on the homepage featured strip, as a caption — see
  below).
- **Per-batch grids stay, headers don't.** Each shoot still renders as its own
  `ImageGrid` (so `layout_hint`: masonry/editorial/full still varies per
  batch), but stacked with no title/date/story between them — no per-shoot
  `<article>` header, no rendered story text.
- **Keep calling them "shoots."** No renaming of files/config/docs vocabulary
  — only the required fields inside one get lighter.

## Changes

### `src/content.config.ts`
- `shoots.title`: `z.string()` → `z.string().optional()`
- `shoots.date`: `z.coerce.date()` → `z.coerce.date().optional()`
- All other shoot fields (`category`, `cover`, `images[].src/alt`,
  `layout_hint`, `featured`) unchanged.

### `src/lib/shoots.ts`
- `byDateDesc` must not throw on an undefined `date`. A shoot with no date
  sorts as oldest (goes to the back), rather than breaking the sort.

### `src/pages/gallery/[category].astro`
- Remove the `shoot-head` block (eyebrow date + `<h2>` title) and the
  rendered story (`<Content />`). Drop the now-unused `render` import/call
  and the `monthYear` formatter.
- Each shoot keeps its own `<ImageGrid images={shoot.data.images}
  variant={shoot.data.layout_hint} />`, stacked with normal section spacing
  between them — no label of any kind marking where one batch ends and the
  next begins.

### `src/pages/index.astro` (homepage featured strip)
- Caption (`feat-title`): render only if `shoot.data.title` exists. If not,
  show nothing extra — the existing `eyebrow` category name is the only
  label (avoids a duplicate "Seniors / Seniors").
- Cover image `alt` text: `${title} — ${category}` when title exists,
  otherwise just `${category}`.

### `scripts/ingest.mjs`
- Keep auto-filling `title` (title-cased from the slug) and `date` (today)
  in the generated stub — sensible defaults, no reason to omit them.
- Stop writing a forced placeholder story paragraph in the stub body (an
  empty body is fine — story is never displayed and never required).
- Update the printed "next steps" summary: alt text is the one thing that
  should be checked/edited; title/date/story/featured/cover/layout_hint are
  all optional touch-ups, not required steps.

### `CLAUDE.md`
- Rewrite Operation 1 ("Add a shoot") to match the real workflow: run
  ingest, glance at alt text (replace any "EDIT ME"), optionally flip
  `featured`. Drop the instruction to always ask the owner for a shoot date
  and a sentence or two about the session — that's now optional color, not a
  required step.
- No changes needed elsewhere in CLAUDE.md (Operations 2–4, publishing,
  "things that will break the build" are all unaffected — title/date were
  never in that failure list since they were previously required-and-always-
  filled, and remain so via ingest's defaults).

## Non-goals / out of scope

- No renaming of "shoots" to any other term.
- No data migration — all 9 existing shoot folders already have title/date/
  story filled in; they keep working unchanged, those fields just stop being
  rendered.
- No change to `ImageGrid.astro`, `layout_hint` semantics, category schema,
  or the gallery index page's per-category summary grid (`src/pages/gallery/
  index.astro`) — that page already just pools featured images into one grid
  and was never shoot-labeled.
- No per-photo featuring.

## Testing / verification

- `npm run build` succeeds with the existing 9 shoots (title/date present)
  and should be manually spot-checked with a stub shoot that omits both
  fields (simulating a fresh ingest with no manual edits) to confirm the
  optional path doesn't throw.
- Visual check via `npm run dev`: a category page shows back-to-back image
  grids with no headers/story text; homepage featured strip shows correct
  captions for shoots with and without a title.
