# Homepage Category Photo Rotation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cycle all eight featured photos for each category through its homepage category card.

**Architecture:** Keep the feature local to `src/pages/index.astro`. Build each category's image pool at build time, render an optimized stacked image set, and use a small client script to crossfade active images on staggered four-second intervals.

**Tech Stack:** Astro content collections, Astro Image, CSS, browser JavaScript

## Global Constraints

- Use only photos belonging to featured shoots in the matching category.
- Crossfade every four seconds and stagger categories.
- Preserve the current category links and 4:5 image frame.
- Disable animation for `prefers-reduced-motion: reduce`.
- Preserve a visible first image without JavaScript.

---

### Task 1: Homepage category-card slideshow

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: Astro `shoot.data.images` assets and each category id.
- Produces: `.cat-media[data-category-rotator]` containers containing optimized images with one `.is-active` image.

- [ ] **Step 1: Record the current failure**

Run a source assertion that requires `data-category-rotator`, all featured shoot images, reduced-motion handling, and a 4000 ms interval. It must fail against the current static-cover implementation.

- [ ] **Step 2: Build each category's image pool**

Change `categoryCards` to return `images: pool.flatMap((shoot) => shoot.data.images)` so every featured image is available to its category card.

- [ ] **Step 3: Render accessible optimized image stacks**

Wrap the card images in `.cat-media`, render every image with Astro `Image`, mark only the first image `.is-active`, and give rotating images empty alt text because the category name already labels the destination link.

- [ ] **Step 4: Add crossfade styling and rotation script**

Stack images absolutely inside the existing 4:5 frame, transition opacity, and schedule each card at `4000 + cardIndex * 350` milliseconds. Exit without scheduling when reduced motion is requested or fewer than two images exist.

- [ ] **Step 5: Verify behavior**

Run the source assertion again and expect it to pass. Run `npm run build` and expect exit code 0. Inspect the generated homepage to confirm 24 category-card images, three rotators, intact category links, and no missing image output.

- [ ] **Step 6: Commit**

Stage `src/pages/index.astro` and this plan, then commit with `rotate homepage category photos`.
