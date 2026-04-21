# Card Images — Design Spec

**Date:** 2026-04-20  
**Status:** Approved

## Goal

Add background images to Case Studies and Insights carousel cards on the Anvil Prime homepage. Currently both card types use Tailwind gradient placeholders as the image area. Replace with real Unsplash photos using Astro's `<Image>` component for automatic WebP conversion and responsive `srcset`.

## Scope

- **Case Studies carousel** (`src/components/Sliders/CaseStudiesCarousel.astro`): 3 cards, `h-48` image area
- **Insights carousel** (`src/components/Sliders/InsightsCarousel.astro`): 3 cards, `h-40` image area

Industries homepage cards (emoji-based) and service/industry listing cards are **out of scope**.

## Approach

Same pattern as banner images: Astro `<Image>` with local assets in `/src/assets/images/`. Images imported in `.astro` component frontmatter, correlated by array index with the existing card data arrays. The `.client.ts` files are NOT modified.

## Image Pattern

Replace the gradient placeholder `<div>` with:

```astro
<div class="h-48 relative overflow-hidden">
  <Image
    src={csImages[i]}
    alt=""
    aria-hidden="true"
    widths={[400, 800]}
    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 31vw"
    width={800}
    height={384}
    class="w-full h-full object-cover"
    loading="lazy"
  />
  <!-- existing tag badge stays, absolutely positioned on top -->
</div>
```

For Insights (`h-40`):
```astro
<div class="h-40 relative overflow-hidden">
  <Image
    src={insightImages[i]}
    alt=""
    aria-hidden="true"
    widths={[400, 800]}
    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 31vw"
    width={800}
    height={320}
    class="w-full h-full object-cover"
    loading="lazy"
  />
</div>
```

Key points:
- `alt=""` + `aria-hidden="true"` — decorative images, hidden from screen readers
- `widths={[400, 800]}` + responsive `sizes` — appropriate for card dimensions (not full-viewport)
- `loading="lazy"` — cards are below the fold
- `width`/`height` set aspect ratio for Astro's optimizer; `object-cover` fills the fixed-height container
- The tag badge `<span class="absolute top-4 left-4 ...">` in CaseStudies stays on top (z-index stacking already works since it's positioned after the `<Image>`)
- No overlay needed — cards are light-background, text is below the image

## HeroCarousel Pattern Note

Images are imported in `.astro` frontmatter and correlated by index — identical to the HeroCarousel pattern. Do NOT add image fields to any `.client.ts` file.

```astro
---
import { Image } from 'astro:assets';
import cs0Img from '../../assets/images/cs-fintech.jpg';
import cs1Img from '../../assets/images/cs-cloud.jpg';
import cs2Img from '../../assets/images/cs-healthcare.jpg';

const csImages = [cs0Img, cs1Img, cs2Img];
// used as csImages[i] inside the .map()
---
```

## Image Manifest

All 6 images downloaded to `/src/assets/images/` before implementation.

| File | Card | Type | Theme |
|------|------|------|-------|
| `cs-fintech.jpg` | Case Study: AI-Powered Risk Platform (FinTech) | Stock | Trading screens / financial data visualization |
| `cs-cloud.jpg` | Case Study: Zero-Downtime Cloud Migration (E-Commerce) | Mix | Cloud servers / infrastructure |
| `cs-healthcare.jpg` | Case Study: Digital Health Platform (Healthcare) | Stock | Medical technology / health screens |
| `insight-ai-enterprise.jpg` | Insight: The Future of AI in Enterprise | Abstract | AI / neural networks in enterprise context |
| `insight-cloud-native.jpg` | Insight: Cloud-Native Patterns for 2026 | Mix | Infrastructure / DevOps / containers |
| `insight-engineering-culture.jpg` | Insight: Engineering Culture That Scales | Stock | Engineering team / technical collaboration |

Source: Unsplash (free, no attribution required).

## Files to Modify

| File | Change |
|------|--------|
| `/src/assets/images/` | Add 6 downloaded images |
| `/src/components/Sliders/CaseStudiesCarousel.astro` | Import 3 images by index; replace gradient div with `<Image>` |
| `/src/components/Sliders/InsightsCarousel.astro` | Import 3 images by index; replace gradient div with `<Image>` |

## Constraints

- No changes to `.client.ts` files
- Card text, layout, hover effects, tag badges, carousel behavior — all unchanged
- No overlay needed (light-background cards, text is outside the image area)
- `loading="lazy"` on all card images (below fold)
