import { siteContentLoader } from './lib/site/loader.mjs';
import { publicEntrySchema, chapterSchema } from './lib/site/schemas.mjs';
import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const siteContent = defineCollection({
	loader: siteContentLoader(),
	schema: publicEntrySchema,
});

const designContent = defineCollection({
	loader: siteContentLoader({ preview: true }),
	schema: publicEntrySchema,
});

const journeyContent = defineCollection({
	loader: siteContentLoader({ journey: true }),
	schema: publicEntrySchema,
});

const siteChapters=defineCollection({loader:siteContentLoader({chapters:true}),schema:chapterSchema});
const readingContent=defineCollection({loader:siteContentLoader({reading:true}),schema:publicEntrySchema});
const readingChapters=defineCollection({loader:siteContentLoader({reading:true,chapters:true}),schema:chapterSchema});
export const collections = { blog, siteContent, designContent, journeyContent, siteChapters, readingContent, readingChapters };
