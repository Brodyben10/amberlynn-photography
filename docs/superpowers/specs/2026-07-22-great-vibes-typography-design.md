# Great Vibes Typography Design

## Goal

Use Great Vibes for the site's expressive display typography while preserving Karla for readable interface and body copy.

## Typography Scope

Great Vibes will replace Young Serif as the display font. It will apply to:

- Page titles and section headings
- The Amberlynn wordmark and other branding text
- Hero taglines and prominent subtitle-style text

Karla will remain in use for:

- Paragraphs and longer descriptive copy
- Navigation links
- Form labels, fields, and buttons
- Captions, metadata, and small interface labels

## Font Delivery

Install and import Great Vibes through Fontsource, matching the site's existing self-hosted font setup. Remove the unused Young Serif dependency and import. This avoids a runtime request to an external font provider and keeps the font available as part of the built site.

Great Vibes is licensed under the SIL Open Font License and is permitted for commercial use.

## Implementation Boundaries

Update the global display-font variable and selectively assign it to prominent subtitle elements that currently inherit the body font. Do not alter content, layout, imagery, colors, or unrelated typography. Retain cursive and serif fallbacks in the display-font stack.

Because Great Vibes has taller letterforms and pronounced flourishes, check headings and branding at desktop and mobile widths for clipping, overlap, and wrapping. Adjust typography spacing only where required for legibility.

## Verification

- Run the production build.
- Confirm the generated site includes Great Vibes locally and no longer bundles Young Serif.
- Inspect the homepage, gallery, category, contact, and links pages at desktop and mobile widths.
- Confirm body copy, controls, navigation links, captions, and small labels remain in Karla.
