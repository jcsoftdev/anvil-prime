# Banner Images — Design Spec

**Date:** 2026-04-20  
**Status:** Approved

## Goal

Add background images to all banners across the Anvil Prime site. Currently all banners use Tailwind gradient backgrounds only. Images should be relevant to each banner's content and reinforce the brand's AI/tech consulting identity.

## Approach

Astro `<Image>` component with local assets in `/src/assets/images/`. Astro automatically converts images to WebP and generates correct `srcset` at build time.

Each banner follows this structure:

```astro
---
import { Image } from 'astro:assets';
import heroBg from '../assets/images/<name>.jpg';
---

<section class="relative overflow-hidden min-h-[Xpx]">
  <Image
    src={heroBg}
    alt=""
    class="absolute inset-0 w-full h-full object-cover"
    width={1920}
    height={1080}
    loading="eager"
  />
  <div class="absolute inset-0 bg-slate-900/65"></div>
  <div class="relative z-10">
    <!-- existing content unchanged -->
  </div>
</section>
```

- `alt=""` on decorative background images (accessibility)
- `loading="eager"` on above-the-fold banners; `loading="lazy"` on inner-page heroes below fold
- Overlay opacity `bg-slate-900/65` preserves WCAG AA contrast on white text
- Existing text/CTA markup is untouched — only the container gains the image layer

## Image Manifest

| File | Banner | Type | Theme |
|------|--------|------|-------|
| `hero-consulting.jpg` | Hero slide 1 — "Build Software That Scales" | Stock | Developers in modern workspace |
| `hero-ai.jpg` | Hero slide 2 — "AI-Native Product Development" | Abstract | Neural network / glowing nodes |
| `hero-cloud.jpg` | Hero slide 3 — "Cloud Transformation at Scale" | Mix | Data center / aerial infrastructure |
| `hero-team.jpg` | Hero slide 4 — "Engineering Teams That Deliver" | Stock | Team collaborating |
| `about.jpg` | About — "We're Engineers Who Started a Company" | Stock | Office / team culture |
| `services.jpg` | Services index — "AI That Ships" | Abstract | Tech/AI visualization |
| `industries.jpg` | Industries index — "Built for Your Vertical" | Stock | City skyline |
| `contact.jpg` | Contact — "Let's Talk" | Stock | Professional meeting |
| `careers.jpg` | Careers — "Work That Matters" | Stock | Modern remote workspace |
| `service-industry-ai.jpg` | Service: Industry AI | Abstract | AI + industry |
| `service-workflows-ai.jpg` | Service: Workflows AI | Abstract | Automation / flows |
| `service-sdlc-ai.jpg` | Service: SDLC AI | Abstract | Code / development |
| `industry-banking.jpg` | Industry: Banking & Financial Services | Stock | Financial district |
| `industry-healthcare.jpg` | Industry: Healthcare & Life Sciences | Stock | Medical lab |
| `industry-media.jpg` | Industry: Media & Entertainment | Stock | Studio / entertainment |
| `industry-retail.jpg` | Industry: Retail & CPG | Stock | Retail / shopping |

Source: Unsplash (free, no attribution required under Unsplash license). Download to `/src/assets/images/`.

## Files to Modify

| File | Change |
|------|--------|
| `/src/components/Sliders/HeroCarousel.astro` | Import 4 slide images; wrap each slide with image + overlay pattern |
| `/src/pages/about.astro` | Add image + overlay to hero section |
| `/src/pages/services/index.astro` | Add image + overlay to hero section |
| `/src/pages/industries/index.astro` | Add image + overlay to hero section |
| `/src/pages/contact.astro` | Add image + overlay to hero section |
| `/src/pages/careers.astro` | Add image + overlay to hero section |
| `/src/pages/services/industry-ai.astro` | Add image + overlay to hero section |
| `/src/pages/services/workflows-ai.astro` | Add image + overlay to hero section |
| `/src/pages/services/sdlc-ai.astro` | Add image + overlay to hero section |
| `/src/pages/industries/banking-financial-services.astro` | Add image + overlay to hero section |
| `/src/pages/industries/healthcare-life-sciences.astro` | Add image + overlay to hero section |
| `/src/pages/industries/media-entertainment.astro` | Add image + overlay to hero section |
| `/src/pages/industries/retail-cpg.astro` | Add image + overlay to hero section |

## Constraints

- No changes to existing text content, CTAs, or layout structure
- Overlay must maintain WCAG AA contrast (≥4.5:1) for body text, ≥3:1 for large headings
- Images must be downloaded locally — no external CDN references in production
- HeroCarousel slides are server-rendered Astro, so images can be imported in frontmatter normally
