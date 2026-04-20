import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    tag: z.string(),
    excerpt: z.string(),
    date: z.string(),
    outcomes: z.array(z.string()),
    tech: z.array(z.string()),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    excerpt: z.string(),
    date: z.string(),
    readTime: z.string(),
    author: z.object({
      name: z.string(),
      role: z.string(),
    }),
  }),
});

export const collections = { 'case-studies': caseStudies, insights };
