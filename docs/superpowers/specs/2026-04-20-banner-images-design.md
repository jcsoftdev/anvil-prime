# Banner Images — Design Spec

**Date:** 2026-04-20  
**Status:** Approved

## Goal

Add background images to all banners across the Anvil Prime site. Currently all banners use Tailwind gradient backgrounds only. Images should be relevant to each banner's content and reinforce the brand's AI/tech consulting identity.

## Approach

Astro `<Image>` component with local assets in `/src/assets/images/`. Astro automatically converts images to WebP and generates `srcset` at build time. Each image renders as an absolutely-positioned `<img>` with `object-cover`, behind a dark overlay div, behind content.

## Image Pattern

```astro
---
import { Image } from 'astro:assets';
import heroBg from '../assets/images/<name>.jpg';
---

<section class="relative overflow-hidden min-h-[Xpx] bg-slate-900">
  <!-- bg-slate-900 is fallback if image fails to load -->
  <Image
    src={heroBg}
    alt=""
    aria-hidden="true"
    widths={[768, 1280, 1920]}
    sizes="100vw"
    width={1920}
    height={1080}
    class="absolute inset-0 w-full h-full object-cover"
    loading="eager"
  />
  <div class="absolute inset-0 bg-slate-900/65"></div>
  <div class="relative z-10 text-white">
    <!-- All text inside must use text-white / text-white/70, NOT text-heading/text-secondary tokens -->
  </div>
</section>
```

Key points:
- `alt=""` + `aria-hidden="true"` — decorative image, hidden from screen readers
- `widths={[768, 1280, 1920]}` + `sizes="100vw"` — generates responsive `srcset`; mobile loads 768px, not 1920px
- `bg-slate-900` on `<section>` — fallback color if image 404s or loads slowly
- Existing gradient class (e.g. `from-slate-900 to-indigo-950`) retained alongside image for CSS fallback
- **All text colors inside the banner must be `text-white` / `text-white/70`** — the dark overlay invalidates `text-heading` / `text-secondary` tokens which are designed for light backgrounds

## HeroCarousel — Special Case

`heroSlides` data lives in `HeroCarousel.client.ts` (browser bundle). **Do NOT add image imports or image fields to this file** — Vite's asset pipeline does not process image assets in client bundles the same way.

Instead, import all 4 images in `HeroCarousel.astro` frontmatter and correlate by array index:

```astro
---
import { Image } from 'astro:assets';
import slide1Bg from '../../assets/images/hero-consulting.jpg';
import slide2Bg from '../../assets/images/hero-ai.jpg';
import slide3Bg from '../../assets/images/hero-cloud.jpg';
import slide4Bg from '../../assets/images/hero-team.jpg';
import { heroSlides } from './HeroCarousel.client';

const slideBgs = [slide1Bg, slide2Bg, slide3Bg, slide4Bg];
---

{heroSlides.map((slide, i) => (
  <div class="embla__slide relative overflow-hidden ...">
    <Image
      src={slideBgs[i]}
      alt=""
      aria-hidden="true"
      widths={[768, 1280, 1920]}
      sizes="100vw"
      width={1920}
      height={1080}
      class="absolute inset-0 w-full h-full object-cover"
      loading={i === 0 ? 'eager' : 'lazy'}
    />
    <!-- overlay + content -->
  </div>
))}
```

- `loading={i === 0 ? 'eager' : 'lazy'}` — only slide 1 is above the fold; slides 2–4 are lazy
- Retain existing `bgColor` gradient class on each slide as CSS fallback behind the image

## LCP — Preload First Carousel Image

Add `fetchpriority="high"` to slide 1's `<Image>` in `HeroCarousel.astro`. Astro 6 passes this attribute through to the rendered `<img>`, signaling the browser to prioritize this image for LCP. Do NOT use a `<link rel="preload">` with a hardcoded path — Astro hashes asset filenames at build time, so `/src/assets/images/hero-consulting.jpg` does not exist in the output and would 404.

```astro
<Image
  src={slideBgs[0]}
  fetchpriority="high"
  loading="eager"
  ...
/>
```

For slides 2–4 use `loading="lazy"` with no `fetchpriority`.

## Contact Page — New Banner Section

The contact page has no existing banner. Add a full-width hero section above the form:

```astro
<section class="relative overflow-hidden min-h-[340px] bg-slate-900 flex items-center">
  <Image src={contactBg} alt="" aria-hidden="true" widths={[768,1280,1920]} sizes="100vw" width={1920} height={1080} class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
  <div class="absolute inset-0 bg-slate-900/65"></div>
  <div class="relative z-10 container mx-auto px-6 py-20 text-center text-white">
    <p class="text-accent-bright text-sm font-semibold uppercase tracking-widest mb-4">Contact</p>
    <h1 class="font-display text-4xl md:text-5xl font-bold mb-4">Let's Talk</h1>
    <p class="text-white/70 text-lg max-w-xl mx-auto">Tell us about your project. We respond within one business day.</p>
  </div>
</section>
<!-- existing form section below, unchanged -->
```

## Image Manifest

All images downloaded to `/src/assets/images/` before implementation begins.

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

Source: Unsplash (free, no attribution required under Unsplash license).

## Directory Setup

```bash
mkdir -p src/assets/images
# Download 16 images via curl/wget from Unsplash
# Files total ~8-16MB; no git lfs required for this size on a solo project
```

## Files to Modify

| File | Change |
|------|--------|
| `/src/assets/images/` | Create directory; add 16 downloaded images |
| `/src/layouts/Base.astro` | No change needed — LCP handled via `fetchpriority` on slide 1 image |
| `/src/components/Sliders/HeroCarousel.astro` | Import 4 images by index; add `<Image>` + overlay per slide; update text colors to `text-white` |
| `/src/pages/about.astro` | Add image + overlay; update text to `text-white`/`text-white/70` |
| `/src/pages/services/index.astro` | Add image + overlay; update text colors |
| `/src/pages/industries/index.astro` | Add image + overlay; update text colors |
| `/src/pages/contact.astro` | Add new banner section above form with image + overlay |
| `/src/pages/careers.astro` | Add image + overlay; update text colors |
| `/src/pages/services/industry-ai.astro` | Add image + overlay; update text colors |
| `/src/pages/services/workflows-ai.astro` | Add image + overlay; update text colors |
| `/src/pages/services/sdlc-ai.astro` | Add image + overlay; update text colors |
| `/src/pages/industries/banking-financial-services.astro` | Add image + overlay; update text colors |
| `/src/pages/industries/healthcare-life-sciences.astro` | Add image + overlay; update text colors |
| `/src/pages/industries/media-entertainment.astro` | Add image + overlay; update text colors |
| `/src/pages/industries/retail-cpg.astro` | Add image + overlay; update text colors |

## Constraints

- Overlay `bg-slate-900/65` maintains WCAG AA contrast (≥4.5:1) on `text-white`
- All banner text must be `text-white` or `text-white/70` — do not use design-token classes (`text-heading`, `text-secondary`) inside overlaid banners
- No external image CDN references in production code
- HeroCarousel client file (`HeroCarousel.client.ts`) must not be modified
