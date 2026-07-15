import type { CollectionEntry } from 'astro:content';

/** Shoot entries live at `shoots/<slug>/index.mdx`; the slug is the folder name. */
export function shootSlug(entry: CollectionEntry<'shoots'>): string {
  return entry.id.split('/')[0];
}

/** Sort shoots newest first. A missing date sorts to the back (oldest). */
export function byDateDesc(a: CollectionEntry<'shoots'>, b: CollectionEntry<'shoots'>): number {
  const aTime = a.data.date?.valueOf() ?? 0;
  const bTime = b.data.date?.valueOf() ?? 0;
  return bTime - aTime;
}
