import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The editing contract. Content that doesn't match these schemas fails the
 * build with a readable error — the live site is never touched by a bad push.
 */

const site = defineCollection({
  loader: glob({ pattern: 'settings.md', base: './src/content/site' }),
  schema: ({ image }) =>
    z
      .object({
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
      })
      .strict(),
});

const categories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/categories' }),
  schema: z
    .object({
      displayName: z.string(),
      order: z.number().int(),
      blurb: z.string(),
      featuredCount: z.number().int().default(8),
    })
    .strict(),
});

const shoots = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/shoots' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        category: reference('categories'),
        date: z.coerce.date(),
        cover: image(),
        images: z
          .array(
            z
              .object({
                src: image(),
                alt: z.string(),
              })
              .strict()
          )
          .min(1),
        layout_hint: z.enum(['masonry', 'editorial', 'full']).default('masonry'),
        featured: z.boolean().default(false),
      })
      .strict(),
});

export const collections = { site, categories, shoots };
