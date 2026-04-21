# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev        # dev server at localhost:4321
bun build      # production build to ./dist/
bun preview    # preview built site
bun astro ...  # Astro CLI (astro check, astro add, etc.)
```

No test suite or linter configured. TypeScript is checked via `astro check`.

## Stack

- **Astro 6** — static site generator, file-based routing, zero-JS by default
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin (no `tailwind.config.js`)
- **TypeScript** (strict mode)
- **Astro Content Collections** — type-safe Markdown/MDX for case studies & insights
- **Embla Carousel** — client-side carousels (`.client.ts` files)
- **Bun** — package manager (use `bun`, not `npm`/`yarn`)

## Architecture

### Routing
`src/pages/` maps to URLs. Dynamic routes use `[...slug].astro` — these pull from Content Collections in `src/content/`.

### Content Collections
`src/content/case-studies/` and `src/content/insights/` hold MDX files. Schemas defined in `src/content.config.ts`. Fields are validated at build time.

### Layouts & SEO
`src/layouts/Base.astro` is the single root layout — handles `<head>`, Open Graph, Twitter Card, JSON-LD structured data. Use `src/utils/seo.ts` to build SEO props.

### Interactivity
Astro is zero-JS by default. Client-side code lives in `*.client.ts` files (Embla carousel, ScrollReveal). Animations use CSS keyframes + Intersection Observer (`src/styles/animations.css`, `src/components/Animations/`).

### Theming
Design tokens live in `src/styles/globals.css`. Brand blue: `--color-accent: #1478c8`. Fonts: Inter (body), Cal Sans (display). All colors meet WCAG AA.

### Key Data Files
- `src/utils/constants.ts` — site name, URL, contact email (update here first after rebrands)
- `src/data/navigation.ts` — nav structure
- `src/data/industries.ts` — industry definitions

## Notes

- `astro.config.mjs` still has `site: https://meridian-labs.com` — should be updated to `https://anvilprime.com`
- Dark navbar behavior driven by `data-dark-hero` attribute on hero sections
- ScrollReveal respects `prefers-reduced-motion`
