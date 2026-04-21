# Banner Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Astro `<Image>`-optimized background photos to all 15 banner/hero sections across the Anvil Prime site.

**Architecture:** Each banner becomes a `relative overflow-hidden bg-slate-900` section. An absolutely-positioned `<Image>` with `object-cover` sits behind a `bg-slate-900/65` overlay div; all text uses `text-white`/`text-white/70`. Images are downloaded from Unsplash to `/src/assets/images/` — Astro processes them to WebP with responsive `srcset` at build time. The HeroCarousel imports images in `.astro` frontmatter (not the client bundle) and correlates them by array index.

**Tech Stack:** Astro 6.1.8, `astro:assets` Image component, Tailwind CSS 4, Bun

**Spec:** `docs/superpowers/specs/2026-04-20-banner-images-design.md`

---

## File Map

| Action | Path |
|--------|------|
| Create | `src/assets/images/` (16 JPEGs) |
| Modify | `src/components/Sliders/HeroCarousel.astro` |
| Modify | `src/pages/about.astro` |
| Modify | `src/pages/services/index.astro` |
| Modify | `src/pages/industries/index.astro` |
| Modify | `src/pages/contact.astro` |
| Modify | `src/pages/careers.astro` |
| Modify | `src/pages/services/industry-ai.astro` |
| Modify | `src/pages/services/workflows-ai.astro` |
| Modify | `src/pages/services/sdlc-ai.astro` |
| Modify | `src/pages/industries/banking-financial-services.astro` |
| Modify | `src/pages/industries/healthcare-life-sciences.astro` |
| Modify | `src/pages/industries/media-entertainment.astro` |
| Modify | `src/pages/industries/retail-cpg.astro` |

---

## Task 1: Download images

**Files:**
- Create: `src/assets/images/` (16 files)

- [ ] **Step 1: Create directory and download all 16 images**

```bash
mkdir -p src/assets/images

BASE="https://images.unsplash.com"

curl -L "$BASE/photo-1522071820081-009f0129c71c?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/hero-consulting.jpg
curl -L "$BASE/photo-1620712943543-bcc4688e7485?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/hero-ai.jpg
curl -L "$BASE/photo-1558494949-ef010cbdcc31?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/hero-cloud.jpg
curl -L "$BASE/photo-1522202176988-66273c2fd55f?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/hero-team.jpg
curl -L "$BASE/photo-1497366216548-37526070297c?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/about.jpg
curl -L "$BASE/photo-1518770660439-4636190af475?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/services.jpg
curl -L "$BASE/photo-1477959858617-67f85cf4f1df?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/industries.jpg
curl -L "$BASE/photo-1560439514-4e9645039924?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/contact.jpg
curl -L "$BASE/photo-1593642632559-0c6d3fc62b89?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/careers.jpg
curl -L "$BASE/photo-1485827404703-89b55fcc595e?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/service-industry-ai.jpg
curl -L "$BASE/photo-1581091226825-a6a2a5aee158?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/service-workflows-ai.jpg
curl -L "$BASE/photo-1461749280684-dccba630e2f6?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/service-sdlc-ai.jpg
curl -L "$BASE/photo-1486406146926-c627a92ad1ab?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/industry-banking.jpg
curl -L "$BASE/photo-1576091160399-112ba8d25d1d?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/industry-healthcare.jpg
curl -L "$BASE/photo-1478720568477-152d9b18f4e8?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/industry-media.jpg
curl -L "$BASE/photo-1441986300917-64674bd600d8?w=1920&q=80&fm=jpg&fit=crop" -o src/assets/images/industry-retail.jpg
```

- [ ] **Step 2: Verify all 16 files downloaded (non-zero size)**

```bash
ls -lh src/assets/images/
```

Expected: 16 files, each > 100KB. If any is ~1KB it likely 403'd — replace the photo ID with any valid Unsplash photo of the same theme and re-download that file only.

- [ ] **Step 3: Commit images**

```bash
git add src/assets/images/
git commit -m "feat: add 16 banner images from Unsplash"
```

---

## Task 2: HeroCarousel — 4 slides with images

**Files:**
- Modify: `src/components/Sliders/HeroCarousel.astro`

The current frontmatter only imports `heroSlides` from the client file. The slide divs have `bg-gradient-to-br ${slide.bgColor}` and content inline. We add 4 image imports, `slideBgs` array, then inside each slide add `<Image>` + overlay while keeping content unchanged.

- [ ] **Step 1: Replace HeroCarousel.astro with image-enabled version**

Replace the entire file with:

```astro
---
import { Image } from 'astro:assets';
import { heroSlides } from './HeroCarousel.client';
import slide0Bg from '../../assets/images/hero-consulting.jpg';
import slide1Bg from '../../assets/images/hero-ai.jpg';
import slide2Bg from '../../assets/images/hero-cloud.jpg';
import slide3Bg from '../../assets/images/hero-team.jpg';

const slideBgs = [slide0Bg, slide1Bg, slide2Bg, slide3Bg];
---

<div class="relative overflow-hidden" id="hero-carousel" aria-label="Hero slideshow" aria-roledescription="carousel">
  <!-- Embla viewport -->
  <div class="overflow-hidden h-full" id="hero-embla-viewport">
    <div class="flex h-full touch-pan-y">
      {heroSlides.map((slide, i) => {
        const Heading = i === 0 ? 'h1' : 'h2';
        return (
          <div
            class={`relative flex-none w-full min-h-[600px] lg:min-h-[700px] bg-gradient-to-br ${slide.bgColor} bg-slate-900 flex items-center overflow-hidden`}
            role="group"
            aria-label={`Slide ${i + 1} of ${heroSlides.length}`}
            aria-roledescription="slide"
            data-hero-slide
          >
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
              fetchpriority={i === 0 ? 'high' : undefined}
            />
            <div class="absolute inset-0 bg-slate-900/65" />
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
              <div data-slide-content>
                <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-6">
                  {slide.tag}
                </span>
                <Heading class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
                  {slide.headline}
                </Heading>
                <p class="text-lg sm:text-xl text-white/70 max-w-xl mb-8 leading-relaxed">
                  {slide.subheadline}
                </p>
                <a
                  href={slide.cta.href}
                  class="inline-flex items-center px-8 py-4 bg-base text-heading font-semibold rounded-lg hover:bg-base-muted transition-colors duration-200 text-base"
                >
                  {slide.cta.label}
                  <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  <!-- Arrow navigation -->
  <button
    id="hero-prev"
    class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    aria-label="Previous slide"
  >
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <button
    id="hero-next"
    class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    aria-label="Next slide"
  >
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>

  <!-- Dot indicators -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" aria-label="Slide indicators">
    {heroSlides.map((_, i) => (
      <button
        data-hero-dot
        aria-label={`Go to slide ${i + 1}`}
        class={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${i === 0 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
      />
    ))}
  </div>
</div>

<script>
  import { initHeroCarousel } from './HeroCarousel.client';
  const root = document.getElementById('hero-embla-viewport') as HTMLElement;
  if (root) {
    const embla = initHeroCarousel(root);
    document.addEventListener('astro:before-swap', () => embla.destroy(), { once: true });
  }
</script>
```

- [ ] **Step 2: Verify TypeScript and build**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Sliders/HeroCarousel.astro
git commit -m "feat: add background images to hero carousel slides"
```

---

## Task 3: About page banner

**Files:**
- Modify: `src/pages/about.astro` (lines 19-31, the Mission section)

Current structure: narrow `<section class="max-w-4xl mx-auto ...">` with `text-heading`/`text-secondary`.  
Change: make section full-width with image + overlay; move max-w constraint to inner div; update text colors.

- [ ] **Step 1: Update the Mission section in about.astro**

Replace lines 19-31:
```astro
  <main class="pt-24 pb-20">
    <!-- Mission -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ScrollReveal>
        <span class="text-accent font-semibold text-sm uppercase tracking-wider">About Us</span>
        <h1 class="text-4xl sm:text-5xl font-bold text-heading mt-4 mb-6 leading-tight">
          We're Engineers Who<br />Started a Company
        </h1>
        <p class="text-xl text-secondary leading-relaxed max-w-2xl mx-auto">
          Anvil Prime was founded by engineers who got tired of consulting firms that over-promised and under-delivered. We built the firm we wanted to work with.
        </p>
      </ScrollReveal>
    </section>
```

With:
```astro
  <main class="pt-24 pb-20">
    <!-- Mission -->
    <section class="relative overflow-hidden bg-slate-900">
      <Image
        src={aboutBg}
        alt=""
        aria-hidden="true"
        widths={[768, 1280, 1920]}
        sizes="100vw"
        width={1920}
        height={1080}
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-slate-900/65" />
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ScrollReveal>
          <span class="text-accent-bright font-semibold text-sm uppercase tracking-wider">About Us</span>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
            We're Engineers Who<br />Started a Company
          </h1>
          <p class="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
            Anvil Prime was founded by engineers who got tired of consulting firms that over-promised and under-delivered. We built the firm we wanted to work with.
          </p>
        </ScrollReveal>
      </div>
    </section>
```

Also add to the frontmatter (after existing imports):
```astro
import { Image } from 'astro:assets';
import aboutBg from '../assets/images/about.jpg';
```

- [ ] **Step 2: Run astro check**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add background image to about page banner"
```

---

## Task 4: Services index banner

**Files:**
- Modify: `src/pages/services/index.astro` (lines 32-43, the hero section)

- [ ] **Step 1: Update services/index.astro**

Add to frontmatter imports:
```astro
import { Image } from 'astro:assets';
import servicesBg from '../../assets/images/services.jpg';
```

Replace the hero section (lines 35-43):
```astro
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ScrollReveal>
        <span class="text-accent font-semibold text-sm uppercase tracking-wider">What We Do</span>
        <h1 class="text-4xl sm:text-5xl font-bold text-heading mt-4 mb-6">AI That Ships.</h1>
        <p class="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
          We build applied AI solutions across three practice areas — all engineered to production standards, not prototypes.
        </p>
      </ScrollReveal>
    </section>
```

With:
```astro
    <section class="relative overflow-hidden bg-slate-900">
      <Image
        src={servicesBg}
        alt=""
        aria-hidden="true"
        widths={[768, 1280, 1920]}
        sizes="100vw"
        width={1920}
        height={1080}
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-slate-900/65" />
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ScrollReveal>
          <span class="text-accent-bright font-semibold text-sm uppercase tracking-wider">What We Do</span>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">AI That Ships.</h1>
          <p class="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            We build applied AI solutions across three practice areas — all engineered to production standards, not prototypes.
          </p>
        </ScrollReveal>
      </div>
    </section>
```

- [ ] **Step 2: Run astro check**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/index.astro
git commit -m "feat: add background image to services page banner"
```

---

## Task 5: Industries index banner

**Files:**
- Modify: `src/pages/industries/index.astro` (lines 37-45, the hero section)

- [ ] **Step 1: Update industries/index.astro**

Add to frontmatter imports:
```astro
import { Image } from 'astro:assets';
import industriesBg from '../../assets/images/industries.jpg';
```

Replace the hero section (lines 37-45):
```astro
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ScrollReveal>
        <span class="text-accent font-semibold text-sm uppercase tracking-wider">Industries</span>
        <h1 class="text-4xl sm:text-5xl font-bold text-heading mt-4 mb-6">Built for Your Vertical</h1>
        <p class="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
          We go deep in four industries where AI creates the most durable competitive advantage.
        </p>
      </ScrollReveal>
    </section>
```

With:
```astro
    <section class="relative overflow-hidden bg-slate-900">
      <Image
        src={industriesBg}
        alt=""
        aria-hidden="true"
        widths={[768, 1280, 1920]}
        sizes="100vw"
        width={1920}
        height={1080}
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-slate-900/65" />
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ScrollReveal>
          <span class="text-accent-bright font-semibold text-sm uppercase tracking-wider">Industries</span>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">Built for Your Vertical</h1>
          <p class="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            We go deep in four industries where AI creates the most durable competitive advantage.
          </p>
        </ScrollReveal>
      </div>
    </section>
```

- [ ] **Step 2: Run astro check + commit**

```bash
bunx astro check
git add src/pages/industries/index.astro
git commit -m "feat: add background image to industries page banner"
```

---

## Task 6: Careers page banner

**Files:**
- Modify: `src/pages/careers.astro` (lines 20-28, the hero section)

- [ ] **Step 1: Update careers.astro**

Add to frontmatter imports:
```astro
import { Image } from 'astro:assets';
import careersBg from '../assets/images/careers.jpg';
```

Replace the hero section (lines 20-28):
```astro
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ScrollReveal>
        <span class="text-accent font-semibold text-sm uppercase tracking-wider">Careers</span>
        <h1 class="text-4xl sm:text-5xl font-bold text-heading mt-4 mb-6">Work That Matters</h1>
        <p class="text-xl text-secondary max-w-2xl mx-auto">
          We hire senior engineers and build teams that ship. Remote-first, async-friendly, high-trust.
        </p>
      </ScrollReveal>
    </section>
```

With:
```astro
    <section class="relative overflow-hidden bg-slate-900">
      <Image
        src={careersBg}
        alt=""
        aria-hidden="true"
        widths={[768, 1280, 1920]}
        sizes="100vw"
        width={1920}
        height={1080}
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-slate-900/65" />
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ScrollReveal>
          <span class="text-accent-bright font-semibold text-sm uppercase tracking-wider">Careers</span>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">Work That Matters</h1>
          <p class="text-xl text-white/70 max-w-2xl mx-auto">
            We hire senior engineers and build teams that ship. Remote-first, async-friendly, high-trust.
          </p>
        </ScrollReveal>
      </div>
    </section>
```

- [ ] **Step 2: Run astro check + commit**

```bash
bunx astro check
git add src/pages/careers.astro
git commit -m "feat: add background image to careers page banner"
```

---

## Task 7: Contact page — new banner section

**Files:**
- Modify: `src/pages/contact.astro`

The contact page has no existing banner — the page goes straight from `<main>` to a centered form. We add a new banner section before the form div.

- [ ] **Step 1: Update contact.astro**

Add to frontmatter imports:
```astro
import { Image } from 'astro:assets';
import contactBg from '../assets/images/contact.jpg';
```

Replace lines 13-21 (from `<main>` through the end of the heading `</ScrollReveal>` block — this removes the duplicate heading since the banner takes over):

**Old string (lines 13-21):**
```astro
  <main class="pt-24 pb-20">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div class="text-center mb-12">
          <span class="text-accent font-semibold text-sm uppercase tracking-wider">Contact</span>
          <h1 class="text-4xl font-bold text-heading mt-2 mb-4">Let's Talk</h1>
          <p class="text-secondary text-lg">Tell us about your project. We respond within one business day.</p>
        </div>
      </ScrollReveal>
```

**New string:**
```astro
  <main class="pt-24 pb-20">
    <section class="relative overflow-hidden bg-slate-900">
      <Image
        src={contactBg}
        alt=""
        aria-hidden="true"
        widths={[768, 1280, 1920]}
        sizes="100vw"
        width={1920}
        height={1080}
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-slate-900/65" />
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span class="text-accent-bright font-semibold text-sm uppercase tracking-wider">Contact</span>
        <h1 class="text-4xl sm:text-5xl font-bold text-white mt-4 mb-4">Let's Talk</h1>
        <p class="text-xl text-white/70 max-w-2xl mx-auto">Tell us about your project. We respond within one business day.</p>
      </div>
    </section>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
```

The existing `<ScrollReveal>` wrapping the form (former line 23) continues immediately after the new `<div class="max-w-2xl ...">`, unchanged. `pt-24` stays on `<main>` — the fixed Navbar needs it to avoid overlapping content.

- [ ] **Step 2: Run astro check**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: add banner section with image to contact page"
```

---

## Task 8: Service detail pages (3 pages)

**Files:**
- Modify: `src/pages/services/industry-ai.astro`
- Modify: `src/pages/services/workflows-ai.astro`
- Modify: `src/pages/services/sdlc-ai.astro`

All three follow the same pattern. The hero section has a back link + h1 + p, currently wrapped in `<section class="max-w-4xl mx-auto ...">` with `text-heading`/`text-secondary`.

For each file, the transformation is:

**Add imports** (after existing imports in frontmatter):
```astro
import { Image } from 'astro:assets';
import pageBg from '../../assets/images/<filename>.jpg';
```

**Replace** the opening `<section>` hero block:
```astro
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <a href="/services" class="text-accent text-sm font-medium hover:underline">← What We Do</a>
        <h1 class="text-4xl sm:text-5xl font-bold text-heading mt-6 mb-6">{TITLE}</h1>
        <p class="text-xl text-secondary leading-relaxed max-w-2xl">{DESC}</p>
      </ScrollReveal>
    </section>
```

**With:**
```astro
    <section class="relative overflow-hidden bg-slate-900">
      <Image
        src={pageBg}
        alt=""
        aria-hidden="true"
        widths={[768, 1280, 1920]}
        sizes="100vw"
        width={1920}
        height={1080}
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-slate-900/65" />
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal>
          <a href="/services" class="text-accent-bright text-sm font-medium hover:underline">← What We Do</a>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mt-6 mb-6">{TITLE}</h1>
          <p class="text-xl text-white/70 leading-relaxed max-w-2xl">{DESC}</p>
        </ScrollReveal>
      </div>
    </section>
```

- [ ] **Step 1: Update industry-ai.astro**

Image: `service-industry-ai.jpg` | Back link stays `← What We Do` | Title: `Industry AI` | Desc: unchanged

- [ ] **Step 2: Update workflows-ai.astro**

Read the file first to confirm exact heading/desc text:
```bash
cat src/pages/services/workflows-ai.astro
```
Image: `service-workflows-ai.jpg` | Apply same pattern.

- [ ] **Step 3: Update sdlc-ai.astro**

Read the file first:
```bash
cat src/pages/services/sdlc-ai.astro
```
Image: `service-sdlc-ai.jpg` | Apply same pattern.

- [ ] **Step 4: Run astro check + commit**

```bash
bunx astro check
git add src/pages/services/industry-ai.astro src/pages/services/workflows-ai.astro src/pages/services/sdlc-ai.astro
git commit -m "feat: add background images to service detail page banners"
```

---

## Task 9: Industry detail pages (4 pages)

**Files:**
- Modify: `src/pages/industries/banking-financial-services.astro`
- Modify: `src/pages/industries/healthcare-life-sciences.astro`
- Modify: `src/pages/industries/media-entertainment.astro`
- Modify: `src/pages/industries/retail-cpg.astro`

Same pattern as Task 8. For each file:

**Add imports:**
```astro
import { Image } from 'astro:assets';
import pageBg from '../../assets/images/<filename>.jpg';
```

**Replace** the hero `<section>` (back link is `← Industries` not `← What We Do`):
```astro
    <section class="relative overflow-hidden bg-slate-900">
      <Image
        src={pageBg}
        alt=""
        aria-hidden="true"
        widths={[768, 1280, 1920]}
        sizes="100vw"
        width={1920}
        height={1080}
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-slate-900/65" />
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal>
          <a href="/industries" class="text-accent-bright text-sm font-medium hover:underline">← Industries</a>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mt-6 mb-6">{TITLE}</h1>
          <p class="text-xl text-white/70 leading-relaxed max-w-2xl">{DESC}</p>
        </ScrollReveal>
      </div>
    </section>
```

- [ ] **Step 1: Update banking-financial-services.astro** — image: `industry-banking.jpg`

- [ ] **Step 2: Update healthcare-life-sciences.astro**

Read first: `cat src/pages/industries/healthcare-life-sciences.astro`
Image: `industry-healthcare.jpg`

- [ ] **Step 3: Update media-entertainment.astro**

Read first: `cat src/pages/industries/media-entertainment.astro`
Image: `industry-media.jpg`

- [ ] **Step 4: Update retail-cpg.astro**

Read first: `cat src/pages/industries/retail-cpg.astro`
Image: `industry-retail.jpg`

- [ ] **Step 5: Run astro check + commit**

```bash
bunx astro check
git add src/pages/industries/
git commit -m "feat: add background images to industry detail page banners"
```

---

## Task 10: Final build verification

- [ ] **Step 1: Full build**

```bash
bunx astro build
```

Expected: exits 0, no errors. If image import errors appear, check that the file in `src/assets/images/` matches the exact filename used in the import.

- [ ] **Step 2: Start dev server and visually verify all banners**

```bash
bunx astro dev
```

Visit each page and confirm:
- `/` — carousel shows photo backgrounds on all 4 slides, text is legible white
- `/about` — photo banner visible above the values section
- `/services` — photo banner above service cards
- `/industries` — photo banner above industry cards
- `/contact` — new photo banner above the form
- `/careers` — photo banner above roles list
- `/services/industry-ai`, `/services/workflows-ai`, `/services/sdlc-ai`
- `/industries/banking-financial-services`, `/industries/healthcare-life-sciences`, `/industries/media-entertainment`, `/industries/retail-cpg`

- [ ] **Step 3: Final commit if any tweaks made**

```bash
git add -p
git commit -m "fix: banner image visual adjustments"
```
