import type { CollectionEntry } from 'astro:content';

/** Shoot entries live at `shoots/<slug>/index.mdx`; the slug is the folder name. */
export function shootSlug(entry: CollectionEntry<'shoots'>): string {
  return entry.id.split('/')[0];
}

/** Sort shoots newest first. */
export function byDateDesc(a: CollectionEntry<'shoots'>, b: CollectionEntry<'shoots'>): number {
  return b.data.date.valueOf() - a.data.date.valueOf();
}
