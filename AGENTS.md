# Instructions for AI agents (Codex, Claude Code, or any other)

**Read `CLAUDE.md` in this directory — it is the complete operations manual for this site.** Everything below is a summary; CLAUDE.md is authoritative.

The two rules that matter most:

1. **Never edit code.** Nothing under `src/components`, `src/pages`, `src/layouts`, `src/styles`, `src/lib`, or root config files. Content lives ONLY in `src/content/` (and `public/` favicon assets).
2. **Never add images by hand.** Always run `npm run ingest <source-folder> <category> <shoot-slug>` — it resizes, compresses to WebP, and strips private EXIF/GPS data. Hand-copied full-size photos will bloat the site and slow it down.

Verify any change with `npm run build` before pushing — if the build fails, the live site is untouched.
