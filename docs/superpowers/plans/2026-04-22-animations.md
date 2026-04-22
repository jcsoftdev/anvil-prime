# Animation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GSAP-first comprehensive animation system to the Anvil Prime Astro homepage — canvas dot grid, text scramble, parallax, count-up stats, 3D card tilt, pinned case studies, magnetic buttons, and SVG draw-in — while preserving SEO and Core Web Vitals.

**Architecture:** All JS animations live in `.client.ts` files (Astro's zero-JS-by-default pattern). A shared `src/lib/gsap.client.ts` registers ScrollTrigger once and exports a `reducedMotion` boolean that gates every animation. CSS scroll-driven animations in `animations.css` need no JS at all.

**Tech Stack:** GSAP 3.12+ (ScrollTrigger), Embla Carousel (existing), Astro 6, Tailwind CSS 4, TypeScript strict, Bun

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/lib/gsap.client.ts` | Create | Shared GSAP + ScrollTrigger init, `reducedMotion` export |
| `src/styles/animations.css` | Modify | Add `@property`, scroll-driven CSS rules |
| `src/components/Sliders/HeroCarousel.astro` | Modify | Add canvas element, SVG underline, script imports |
| `src/components/Animations/HeroCanvas.client.ts` | Create | Dot grid with pulsing radial wave |
| `src/components/Animations/TextScramble.client.ts` | Create | Hero headline scramble on page load |
| `src/components/Animations/SvgDraw.client.ts` | Create | SVG path stroke-dashoffset draw-in |
| `src/components/Animations/Parallax.client.ts` | Create | Hero image + content parallax on scroll |
| `src/components/Sections/Performance.astro` | Modify | Add `data-count-to`, `data-count-suffix`, `performance-gradient` |
| `src/components/Animations/CountUp.client.ts` | Create | Stat number count-up on scroll |
| `src/components/Sections/Industries.astro` | Modify | Remove ScrollReveal wrappers, add IDs, add GSAP script |
| `src/components/UI/Button.astro` | Modify | Add `data-magnetic` to primary variant |
| `src/components/Animations/MagneticButton.client.ts` | Create | Cursor-tracking button pull effect |
| `src/layouts/Base.astro` | Modify | Import MagneticButton script globally |
| `src/components/Sections/CaseStudies.astro` | Modify | Add `id="case-studies-section"` |
| `src/components/Sliders/CaseStudiesCarousel.astro` | Modify | Add IDs, progress bar, `data-carousel-card`, hide nav on desktop |
| `src/components/Sliders/CaseStudiesCarousel.client.ts` | Rewrite | GSAP pin (desktop) + Embla stagger (mobile) |

---

## Task 1: Install GSAP and create shared module

**Files:**
- Create: `src/lib/gsap.client.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Install GSAP**

```bash
bun add gsap
```

Expected output: `bun add v1.x.x` with `gsap` added to `package.json`.

- [ ] **Step 2: Add `.superpowers/` to .gitignore**

Open `.gitignore` and add this line at the end:
```
.superpowers/
```

- [ ] **Step 3: Create `src/lib/gsap.client.ts`**

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
bun astro check
```

Expected: zero errors. If GSAP types are missing, run `bun add -d @types/gsap` — though GSAP ships its own types and this should not be needed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gsap.client.ts .gitignore package.json bun.lockb
git commit -m "feat: install gsap and create shared animation module"
```

---

## Task 2: CSS scroll-driven additions

**Files:**
- Modify: `src/styles/animations.css`
- Modify: `src/components/Sections/Performance.astro`

- [ ] **Step 1: Add `@property` declaration and scroll-driven rules to `animations.css`**

Append to the end of `src/styles/animations.css`:

```css
/* ============================================================
   Scroll-Driven Animations (CSS-only, progressive enhancement)
   ============================================================ */

/* @property must be at top level — not inside @supports */
@property --grad-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 135deg;
}

@keyframes grad-rotate {
  to { --grad-angle: 315deg; }
}

/* Gradient fallback: requires @property support (Chrome 85+, Safari 16.4+, FF 128+).
   .bg-accent stays on the element as the static fallback for unsupported browsers. */
@supports (background: linear-gradient(var(--grad-angle, 135deg), red, blue)) {
  .performance-gradient {
    background: linear-gradient(var(--grad-angle, 135deg), #1478c8, #0c5ea5);
    animation: grad-rotate 8s linear infinite alternate;
  }
}

@supports (animation-timeline: scroll()) {
  /* Navbar scroll shadow — #navbar is the actual element ID in Navbar.astro.
     Coexists with the existing JS shadow-sm toggle: both apply box-shadow,
     CSS animation wins specificity for the custom value. */
  @keyframes nav-shadow {
    from { box-shadow: none; }
    to   { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12); }
  }

  #navbar {
    animation: nav-shadow linear both;
    animation-timeline: scroll();
    animation-range: 0px 80px;
  }

  /* Section heading underline grow — add .section-heading class to h2 elements
     in section headers to opt in. */
  @keyframes underline-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .section-heading::after {
    content: '';
    display: block;
    height: 2px;
    background: var(--color-accent);
    transform-origin: left;
    animation: underline-grow linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
}

/* Reduced motion: disable all scroll-driven animations */
@media (prefers-reduced-motion: reduce) {
  #navbar { animation: none; }
  .section-heading::after { animation: none; transform: scaleX(1); }
  .performance-gradient { animation: none; }
}
```

- [ ] **Step 2: Add `performance-gradient` class and `section-heading` to `Performance.astro`**

In `src/components/Sections/Performance.astro`, make two changes:

Change the section opening tag from:
```astro
<section class="py-20 bg-accent" aria-label="Company stats">
```
To:
```astro
<section class="py-20 bg-accent performance-gradient" aria-label="Company stats">
```

Change the `<h2>` from:
```astro
<h2 class="text-3xl font-bold text-white text-center mb-4">
  Performance That Speaks for Itself
</h2>
```
To:
```astro
<h2 class="text-3xl font-bold text-white text-center mb-4 section-heading">
  Performance That Speaks for Itself
</h2>
```

Also add `section-heading` to the section `<h2>` elements in `Industries.astro` and `CaseStudies.astro` for the underline effect:

In `src/components/Sections/Industries.astro`, change:
```astro
<h2 class="text-3xl sm:text-4xl font-bold text-heading mt-2 mb-4">
```
To:
```astro
<h2 class="text-3xl sm:text-4xl font-bold text-heading mt-2 mb-4 section-heading">
```

In `src/components/Sections/CaseStudies.astro`, change:
```astro
<h2 class="text-3xl sm:text-4xl font-bold text-heading mt-2">
```
To:
```astro
<h2 class="text-3xl sm:text-4xl font-bold text-heading mt-2 section-heading">
```

- [ ] **Step 3: Verify**

```bash
bun astro check
bun dev
```

Open http://localhost:4321. Scroll the page and verify:
- Navbar gains a deeper shadow as you scroll past ~80px (Chrome/Edge only for CSS version)
- The performance section background gradient slowly rotates (Chrome/Edge/Safari 16.4+)
- Section headings ("Built for Every Vertical", "Work We're Proud Of") show a blue underline that grows from left as they enter view

- [ ] **Step 4: Commit**

```bash
git add src/styles/animations.css src/components/Sections/Performance.astro src/components/Sections/Industries.astro src/components/Sections/CaseStudies.astro
git commit -m "feat: add css scroll-driven animations and gradient rotation"
```

---

## Task 3: Hero markup — canvas element + SVG underline

**Files:**
- Modify: `src/components/Sliders/HeroCarousel.astro`

The hero carousel has this structure:
```
#hero-carousel (relative overflow-hidden)
  #hero-embla-viewport
    .flex (slides)
  #hero-prev (button)
  #hero-next (button)
  dot indicators
```

Canvas must be injected as a **direct child of `#hero-carousel`** (NOT inside the Embla viewport) so it doesn't enter Embla's flex layout.

- [ ] **Step 1: Add canvas element and update `#hero-carousel` to allow absolute positioning**

In `src/components/Sliders/HeroCarousel.astro`, change the outer div from:
```astro
<div class="relative overflow-hidden" id="hero-carousel" ...>
```
To:
```astro
<div class="relative overflow-hidden" id="hero-carousel" ...>
  <!-- Canvas dot grid: absolute sibling of Embla viewport, z-index below photo overlay -->
  <canvas
    id="hero-canvas"
    aria-hidden="true"
    class="absolute inset-0 w-full h-full pointer-events-none"
    style="z-index: 1;"
  ></canvas>
```

Keep the rest of the component exactly as-is after the canvas tag.

- [ ] **Step 2: Add SVG underline to the first slide's h1**

In `HeroCarousel.astro`, the first slide renders with `Heading = 'h1'`. Find the h1 element:
```astro
<Heading class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
  {slide.headline}
</Heading>
```

Add an SVG immediately after the `</Heading>` closing tag (inside the `if (i === 0)` slide only). The SVG should only render on the first slide. Update the slide map so the first slide gets the SVG:

```astro
{heroSlides.map((slide, i) => {
  const Heading = i === 0 ? 'h1' : 'h2';
  return (
    <div ...>
      <Image ... />
      <div class="absolute inset-0 bg-slate-900/65" />
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div data-slide-content>
          <span ...>{slide.tag}</span>
          <Heading class="...">{slide.headline}</Heading>
          {i === 0 && (
            <svg
              aria-hidden="true"
              width="200"
              height="8"
              viewBox="0 0 200 8"
              style="visibility: hidden; margin-bottom: 1.5rem; display: block;"
              data-svg-draw
            >
              <path
                d="M0,4 Q50,0 100,4 T200,4"
                fill="none"
                stroke="#2cb7e8"
                stroke-width="2"
                stroke-dasharray="230"
                stroke-dashoffset="230"
              />
            </svg>
          )}
          <p class="text-lg sm:text-xl text-white/70 max-w-xl mb-8 leading-relaxed">
            {slide.subheadline}
          </p>
          ...
        </div>
      </div>
    </div>
  );
})}
```

The full updated `HeroCarousel.astro` (the complete map block — replace the entire map call):

```astro
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
          {i === 0 && (
            <svg
              aria-hidden="true"
              width="200"
              height="8"
              viewBox="0 0 200 8"
              style="visibility: hidden; margin-bottom: 1.5rem; display: block;"
              data-svg-draw
            >
              <path
                d="M0,4 Q50,0 100,4 T200,4"
                fill="none"
                stroke="#2cb7e8"
                stroke-width="2"
                stroke-dasharray="230"
                stroke-dashoffset="230"
              />
            </svg>
          )}
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
```

- [ ] **Step 3: Verify markup renders correctly**

```bash
bun astro check
bun dev
```

Open http://localhost:4321. Verify:
- Hero renders normally (canvas element is invisible/transparent for now since no JS yet)
- SVG element is present in the DOM (DevTools → Elements → find `[data-svg-draw]`) but hidden (`visibility: hidden`)
- No layout shift compared to before

- [ ] **Step 4: Commit**

```bash
git add src/components/Sliders/HeroCarousel.astro
git commit -m "feat: add canvas and svg elements to hero carousel markup"
```

---

## Task 4: HeroCanvas.client.ts — dot grid

**Files:**
- Create: `src/components/Animations/HeroCanvas.client.ts`
- Modify: `src/components/Sliders/HeroCarousel.astro` (add script import)

- [ ] **Step 1: Create `src/components/Animations/HeroCanvas.client.ts`**

```ts
import { gsap, reducedMotion } from '../../lib/gsap.client';

interface Dot {
  x: number;
  y: number;
  alpha: number;
}

export function initHeroCanvas(canvas: HTMLCanvasElement): () => void {
  if (reducedMotion) return () => {};

  const ctx = canvas.getContext('2d')!;
  const spacing = 24;
  let dots: Dot[] = [];
  let rafId: number;
  let hidden = false;

  const buildDots = () => {
    gsap.killTweensOf(dots);
    dots = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let x = spacing / 2; x < w; x += spacing) {
      for (let y = spacing / 2; y < h; y += spacing) {
        dots.push({ x, y, alpha: 0.1 });
      }
    }
    animateDots();
  };

  const animateDots = () => {
    const cx = canvas.offsetWidth / 2;
    const cy = canvas.offsetHeight / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    dots.forEach(dot => {
      const dist = Math.sqrt((dot.x - cx) ** 2 + (dot.y - cy) ** 2);
      const delay = (dist / maxDist) * 2;
      gsap.to(dot, {
        alpha: 0.55,
        duration: 2,
        delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  };

  const draw = () => {
    if (!hidden) {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(44, 183, 232, ${dot.alpha})`;
        ctx.fill();
      });
    }
    rafId = requestAnimationFrame(draw);
  };

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    buildDots();
  };

  const onVisibility = () => { hidden = document.hidden; };
  document.addEventListener('visibilitychange', onVisibility);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // requestIdleCallback is not in TypeScript's default DOM lib — use setTimeout(0)
  // which is equivalent here (defers canvas init past the first paint).
  setTimeout(() => {
    resize();
    draw();
  }, 0);

  return () => {
    cancelAnimationFrame(rafId);
    gsap.killTweensOf(dots);
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
```

- [ ] **Step 2: Add script import to `HeroCarousel.astro`**

Add a new `<script>` tag at the bottom of `HeroCarousel.astro`, after the existing `<script>`:

```astro
<script>
  import { initHeroCanvas } from '../Animations/HeroCanvas.client';
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
  if (canvas) {
    const cleanup = initHeroCanvas(canvas);
    document.addEventListener('astro:before-swap', cleanup, { once: true });
  }
</script>
```

- [ ] **Step 3: Verify**

```bash
bun dev
```

Open http://localhost:4321. Verify:
- Blue dot grid is visible in the hero, pulsing in a radial wave from center
- Dots are subtle (visible through the dark overlay but not distracting)
- Grid redraws correctly on window resize
- Switch to a tab and back — dots continue animating normally

- [ ] **Step 4: Commit**

```bash
git add src/components/Animations/HeroCanvas.client.ts src/components/Sliders/HeroCarousel.astro
git commit -m "feat: add hero canvas dot grid animation"
```

---

## Task 5: TextScramble.client.ts + SvgDraw.client.ts

**Files:**
- Create: `src/components/Animations/TextScramble.client.ts`
- Create: `src/components/Animations/SvgDraw.client.ts`
- Modify: `src/components/Sliders/HeroCarousel.astro` (add script imports)

- [ ] **Step 1: Create `src/components/Animations/TextScramble.client.ts`**

```ts
import { gsap, reducedMotion } from '../../lib/gsap.client';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

export function initTextScramble(el: HTMLElement): void {
  if (reducedMotion) return;

  const original = el.textContent ?? '';
  const duration = 0.9; // seconds
  let startTime: number | null = null;

  const tickerId = gsap.ticker.add((time) => {
    if (startTime === null) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    let result = '';
    for (let i = 0; i < original.length; i++) {
      if (original[i] === ' ') {
        result += ' ';
      } else if (i / original.length < progress) {
        result += original[i];
      } else {
        result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
    el.textContent = result;

    if (progress >= 1) {
      el.textContent = original;
      gsap.ticker.remove(tickerId);
    }
  });
}
```

- [ ] **Step 2: Create `src/components/Animations/SvgDraw.client.ts`**

```ts
import { gsap, reducedMotion } from '../../lib/gsap.client';

export function initSvgDraw(svg: SVGElement, scrambleDuration = 0.9): void {
  if (reducedMotion) {
    // Just show the SVG fully drawn
    gsap.set(svg, { visibility: 'visible' });
    const path = svg.querySelector('path');
    if (path) gsap.set(path, { strokeDashoffset: 0 });
    return;
  }

  // Reveal after scramble finishes + 100ms buffer
  const delay = scrambleDuration + 0.1;

  gsap.set(svg, { visibility: 'visible' });
  gsap.to(svg.querySelector('path'), {
    strokeDashoffset: 0,
    duration: 1.2,
    delay,
    ease: 'power2.inOut',
  });
}
```

- [ ] **Step 3: Add both scripts to `HeroCarousel.astro`**

Add two new `<script>` tags after the existing canvas script:

```astro
<script>
  import { initTextScramble } from '../Animations/TextScramble.client';
  const firstSlide = document.querySelector('[data-hero-slide]');
  const h1 = firstSlide?.querySelector('h1') as HTMLElement | null;
  if (h1) initTextScramble(h1);
</script>

<script>
  import { initSvgDraw } from '../Animations/SvgDraw.client';
  const svg = document.querySelector('[data-svg-draw]') as SVGElement | null;
  if (svg) initSvgDraw(svg);
</script>
```

- [ ] **Step 4: Verify**

```bash
bun dev
```

Open http://localhost:4321. Verify:
- On page load, the hero headline ("Build Software That Scales") scrambles through random characters and resolves over ~0.9s
- After ~1s, a wavy blue line draws in beneath the headline from left to right
- Hard reload (`Cmd+Shift+R`) to re-trigger: same effect each time
- TypeScript check: `bun astro check` — zero errors

- [ ] **Step 5: Commit**

```bash
git add src/components/Animations/TextScramble.client.ts src/components/Animations/SvgDraw.client.ts src/components/Sliders/HeroCarousel.astro
git commit -m "feat: add hero text scramble and svg draw-in animations"
```

---

## Task 6: Parallax.client.ts

**Files:**
- Create: `src/components/Animations/Parallax.client.ts`
- Modify: `src/components/Sliders/HeroCarousel.astro` (add script import)

- [ ] **Step 1: Create `src/components/Animations/Parallax.client.ts`**

```ts
import { gsap, ScrollTrigger, reducedMotion } from '../../lib/gsap.client';

export function initHeroParallax(carousel: HTMLElement): void {
  if (reducedMotion) return;
  if (window.innerWidth < 768) return; // mobile: skip

  const images = carousel.querySelectorAll<HTMLImageElement>('[data-hero-slide] img');
  const contents = carousel.querySelectorAll<HTMLElement>('[data-slide-content]');

  // All slide images move together at 40% scroll speed (only active slide is visible)
  ScrollTrigger.create({
    trigger: carousel,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const yImages = progress * window.innerHeight * 0.4;
      const yContent = progress * window.innerHeight * 0.15;
      gsap.set(images, { y: yImages });
      gsap.set(contents, { y: yContent });
    },
  });
}
```

- [ ] **Step 2: Add script to `HeroCarousel.astro`**

```astro
<script>
  import { initHeroParallax } from '../Animations/Parallax.client';
  const carousel = document.getElementById('hero-carousel') as HTMLElement | null;
  if (carousel) initHeroParallax(carousel);
</script>
```

- [ ] **Step 3: Verify**

```bash
bun dev
```

Open http://localhost:4321 on desktop (≥768px wide). Scroll past the hero slowly — the background images should drift upward slightly slower than the page scroll, creating a parallax depth effect. Text content should drift slightly less than images. On mobile (resize browser <768px): no parallax — scroll behaves normally.

- [ ] **Step 4: Commit**

```bash
git add src/components/Animations/Parallax.client.ts src/components/Sliders/HeroCarousel.astro
git commit -m "feat: add hero parallax scroll effect"
```

---

## Task 7: Stats count-up

**Files:**
- Modify: `src/components/Sections/Performance.astro`
- Create: `src/components/Animations/CountUp.client.ts`

- [ ] **Step 1: Add data attributes to stat values in `Performance.astro`**

In `src/components/Sections/Performance.astro`, replace the stats array and the stat value `<div>`:

Change the `stats` array from:
```ts
const stats = [
  { value: '200+', label: 'Projects Delivered', description: 'Across 30 countries' },
  { value: '95%',  label: 'Client Retention',   description: 'Year over year' },
  { value: '12+',  label: 'Years Experience',    description: 'Building at scale' },
  { value: '500+', label: 'Engineers',           description: 'Senior-level talent' },
];
```
To:
```ts
const stats = [
  { value: '200+', countTo: 200, suffix: '+', label: 'Projects Delivered', description: 'Across 30 countries' },
  { value: '95%',  countTo: 95,  suffix: '%', label: 'Client Retention',   description: 'Year over year' },
  { value: '12+',  countTo: 12,  suffix: '+', label: 'Years Experience',   description: 'Building at scale' },
  { value: '500+', countTo: 500, suffix: '+', label: 'Engineers',          description: 'Senior-level talent' },
];
```

Change the stat value `<div>` from:
```astro
<div class="text-5xl font-bold text-white mb-2">{stat.value}</div>
```
To:
```astro
<div
  class="text-5xl font-bold text-white mb-2"
  data-count-to={stat.countTo}
  data-count-suffix={stat.suffix}
>{stat.value}</div>
```

- [ ] **Step 2: Create `src/components/Animations/CountUp.client.ts`**

```ts
import { gsap, ScrollTrigger, reducedMotion } from '../../lib/gsap.client';

export function initCountUp(section: HTMLElement): void {
  if (reducedMotion) return;

  const statEls = section.querySelectorAll<HTMLElement>('[data-count-to]');
  if (!statEls.length) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      statEls.forEach((el, i) => {
        const target = parseInt(el.dataset.countTo ?? '0', 10);
        const suffix = el.dataset.countSuffix ?? '';
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          delay: i * 0.15,
          ease: 'power2.out',
          onStart: () => {
            el.textContent = '0' + suffix;
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
          onComplete: () => {
            el.textContent = target + suffix;
          },
        });
      });
    },
  });
}
```

- [ ] **Step 3: Add script to `Performance.astro`**

Add a `<script>` tag at the bottom of `Performance.astro`:

```astro
<script>
  import { initCountUp } from '../Animations/CountUp.client';
  const section = document.querySelector('section[aria-label="Company stats"]') as HTMLElement | null;
  if (section) initCountUp(section);
</script>
```

- [ ] **Step 4: Verify**

```bash
bun astro check
bun dev
```

Open http://localhost:4321. Scroll down to the blue stats section. Verify:
- Numbers count up from 0 on scroll — `0+` → `200+`, `0%` → `95%`, etc.
- Stagger is visible: each stat starts 150ms after the previous
- Stats resolve to exact final values (`200+`, `95%`, `12+`, `500+`) when complete
- View page source — stats show `200+` etc. in HTML (SEO intact)

- [ ] **Step 5: Commit**

```bash
git add src/components/Sections/Performance.astro src/components/Animations/CountUp.client.ts
git commit -m "feat: add count-up animation to stats section"
```

---

## Task 8: Industries grid — 3D tilt + stagger reveal

**Files:**
- Modify: `src/components/Sections/Industries.astro`

The current `Industries.astro` wraps each card in `<ScrollReveal delay={...}>`. Remove those wrappers and replace with a single GSAP-driven script inline.

- [ ] **Step 1: Rewrite `Industries.astro`**

Replace the entire file content with:

```astro
---
import { industries } from '../../data/industries';
---

<section class="py-20 bg-base-alt" aria-label="Industries we serve">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <span class="text-accent font-semibold text-sm uppercase tracking-wider">Industries</span>
      <h2 class="text-3xl sm:text-4xl font-bold text-heading mt-2 mb-4 section-heading">
        Built for Every Vertical
      </h2>
      <p class="text-secondary text-lg max-w-2xl mx-auto">
        We've shipped production software across the most demanding and regulated industries in the world.
      </p>
    </div>

    <div
      id="industries-grid"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {industries.map((industry) => (
        <div
          data-industry-card
          class="bg-base rounded-xl p-6 border border-border hover:border-accent-dim hover:shadow-md transition-all duration-300 text-center group cursor-default"
        >
          <div class="text-4xl mb-3" aria-hidden="true">{industry.icon}</div>
          <h3 class="font-semibold text-heading mb-1 group-hover:text-accent transition-colors">{industry.name}</h3>
          <p class="text-muted text-sm leading-snug">{industry.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  import { gsap, ScrollTrigger, reducedMotion } from '../../lib/gsap.client';

  const grid = document.getElementById('industries-grid');
  if (!grid) throw new Error('industries-grid not found');

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-industry-card]'));

  if (reducedMotion) {
    // Spec requirement: explicitly set opacity:1 on cards as a defensive measure,
    // in case CSS ever adds an initial opacity:0 to [data-industry-card].
    cards.forEach(card => { card.style.opacity = '1'; });
  } else {
    // Stagger reveal on scroll
    gsap.from(cards, {
      opacity: 0,
      y: 24,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
        once: true,
      },
    });

    // 3D tilt on hover — desktop only
    const isTouch = navigator.maxTouchPoints > 0;
    if (!isTouch) {
      grid.style.perspective = '800px';
      cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform';

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);
          gsap.to(card, {
            rotateX: -dy * 8,
            rotateY: dx * 8,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
      });
    }
  }
</script>
```

- [ ] **Step 2: Verify**

```bash
bun astro check
bun dev
```

Open http://localhost:4321. Scroll to the Industries section. Verify:
- Cards fade and slide up in a staggered wave as the grid enters viewport
- On desktop, hovering over a card causes a subtle 3D tilt toward the cursor
- Moving off the card smoothly resets to flat
- No console errors
- `ScrollReveal` is no longer imported (check the file — import was removed)

- [ ] **Step 3: Commit**

```bash
git add src/components/Sections/Industries.astro
git commit -m "feat: replace scroll reveal with gsap stagger and 3d tilt on industry cards"
```

---

## Task 9: Magnetic buttons

**Files:**
- Modify: `src/components/UI/Button.astro`
- Create: `src/components/Animations/MagneticButton.client.ts`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Add `data-magnetic` to primary variant in `Button.astro`**

In `src/components/UI/Button.astro`, change the `<Tag>` element from:
```astro
<Tag {...(href ? { href } : { type })} class={classes} {...rest}>
  <slot />
</Tag>
```
To:
```astro
<Tag
  {...(href ? { href } : { type })}
  class={classes}
  {...rest}
  {...(variant === 'primary' ? { 'data-magnetic': '' } : {})}
>
  <slot />
</Tag>
```

- [ ] **Step 2: Create `src/components/Animations/MagneticButton.client.ts`**

```ts
import { gsap, reducedMotion } from '../../lib/gsap.client';

export function initMagneticButtons(): void {
  if (reducedMotion) return;
  if (navigator.maxTouchPoints > 0) return; // touch devices only

  const RADIUS = 60; // px — cursor must be within this distance to activate

  document.addEventListener('mousemove', (e) => {
    const buttons = document.querySelectorAll<HTMLElement>('[data-magnetic]');
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        gsap.to(btn, {
          x: dx * 0.2,
          y: dy * 0.2,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    });
  });
}
```

- [ ] **Step 3: Import and run in `Base.astro`**

In `src/layouts/Base.astro`, the `<body>` currently ends with `<Footer />` then `</body>`. Add the script after `<Footer />`:

Change:
```astro
  <body>
    <slot />
    <Footer />
  </body>
```
To:
```astro
  <body>
    <slot />
    <Footer />
    <script>
      import { initMagneticButtons } from '../components/Animations/MagneticButton.client';
      initMagneticButtons();
    </script>
  </body>
```

- [ ] **Step 4: Verify**

```bash
bun astro check
bun dev
```

Open http://localhost:4321. Move the cursor slowly toward a blue primary button (e.g., "See Our Work" hero CTA or any primary Button). Verify:
- Button subtly pulls toward cursor as cursor approaches within ~60px
- Springs back with elastic bounce when cursor moves away
- Outline and ghost buttons are NOT affected
- Mobile (simulate in DevTools): no effect

- [ ] **Step 5: Commit**

```bash
git add src/components/UI/Button.astro src/components/Animations/MagneticButton.client.ts src/layouts/Base.astro
git commit -m "feat: add magnetic button animation to primary CTAs"
```

---

## Task 10: Case studies markup changes

**Files:**
- Modify: `src/components/Sections/CaseStudies.astro`
- Modify: `src/components/Sliders/CaseStudiesCarousel.astro`

- [ ] **Step 1: Add section ID to `CaseStudies.astro`**

In `src/components/Sections/CaseStudies.astro`, change:
```astro
<section class="py-20 bg-base" aria-label="Case studies">
```
To:
```astro
<section class="py-20 bg-base" aria-label="Case studies" id="case-studies-section">
```

- [ ] **Step 2: Update `CaseStudiesCarousel.astro` markup**

Make the following changes to `src/components/Sliders/CaseStudiesCarousel.astro`:

**a) Add `id` to the flex (cards) container:**

Change:
```astro
<div class="flex gap-6 touch-pan-y">
```
To:
```astro
<div class="flex gap-6 touch-pan-y" id="case-studies-cards-container">
```

**b) Add `data-carousel-card` to each slide wrapper:**

Change:
```astro
<div class="flex-none w-[85%] sm:w-[45%] lg:w-[31%]" role="group" ...>
```
To:
```astro
<div class="flex-none w-[85%] sm:w-[45%] lg:w-[31%]" role="group" ... data-carousel-card>
```

**c) Hide prev/next buttons on desktop** (they conflict with the pin scroll mode):

Change the buttons container:
```astro
<div class="flex items-center justify-end gap-3 mt-8">
```
To:
```astro
<div class="flex items-center justify-end gap-3 mt-8 lg:hidden">
```

**d) Add progress bar after the buttons div:**

After the closing `</div>` of the buttons container, add:
```astro
<div
  id="case-studies-progress-bar"
  class="hidden lg:block mt-4 h-0.5 bg-border rounded-full overflow-hidden"
  aria-hidden="true"
>
  <div id="case-studies-progress-fill" class="h-full bg-accent w-0 rounded-full transition-none"></div>
</div>
```

- [ ] **Step 3: Verify markup**

```bash
bun astro check
bun dev
```

Open http://localhost:4321. Check the case studies section:
- Desktop (≥1024px): prev/next buttons are hidden, progress bar div is visible (but empty/thin)
- Mobile (<1024px): prev/next buttons visible, progress bar hidden
- Carousel still functions normally (Embla untouched so far)

- [ ] **Step 4: Commit**

```bash
git add src/components/Sections/CaseStudies.astro src/components/Sliders/CaseStudiesCarousel.astro
git commit -m "feat: add case studies markup for gsap pin — ids, progress bar, card attrs"
```

---

## Task 11: CaseStudiesCarousel.client.ts — GSAP pin + stagger

**Files:**
- Rewrite: `src/components/Sliders/CaseStudiesCarousel.client.ts`
- Modify: `src/components/Sliders/CaseStudiesCarousel.astro` (update script)

The current `CaseStudiesCarousel.client.ts` calls `initCarousel` from `carousel.client.ts`. The new version handles Embla init internally so GSAP can coordinate with Embla's lifecycle.

> **Important:** Steps 1 and 2 must both be completed before committing — Step 1 changes the function signature from two arguments to one, and Step 2 updates the call site to match. Commit only after both steps are done and `bun astro check` passes.

- [ ] **Step 1: Rewrite `CaseStudiesCarousel.client.ts`**

```ts
import EmblaCarousel from 'embla-carousel';
import type { EmblaCarouselType } from 'embla-carousel';
import { gsap, ScrollTrigger, reducedMotion } from '../../lib/gsap.client';

function wirePrevNext(embla: EmblaCarouselType): void {
  // Called exactly once at init — safe to attach listeners unconditionally.
  // On desktop, prev/next buttons are hidden (lg:hidden) and Embla is inactive,
  // so scrollNext() is a no-op. No stacking risk from breakpoint transitions.
  let timer: ReturnType<typeof setInterval>;
  const start = () => { timer = setInterval(() => embla.scrollNext(), 5000); };
  const stop  = () => clearInterval(timer);

  const wrapper = document.getElementById('cs-carousel-wrapper');
  wrapper?.addEventListener('mouseenter', stop);
  wrapper?.addEventListener('mouseleave', start);

  document.getElementById('cs-prev')?.addEventListener('click', () => { stop(); embla.scrollPrev(); start(); });
  document.getElementById('cs-next')?.addEventListener('click', () => { stop(); embla.scrollNext(); start(); });

  embla.on('destroy', stop);
  start();
}

function initPinnedScroll(): ScrollTrigger {
  const section   = document.getElementById('case-studies-section')!;
  const container = document.getElementById('case-studies-cards-container')!;
  const fill      = document.getElementById('case-studies-progress-fill')!;
  const cards     = Array.from(container.querySelectorAll<HTMLElement>('[data-carousel-card]'));

  // gap-6 = 1.5rem. Read computed value for accuracy rather than hardcoding 24px.
  const gap = parseFloat(getComputedStyle(container).gap) || 24;
  const cardWidth = cards[0]?.offsetWidth ?? 0;
  const totalTravel = (cardWidth + gap) * (cards.length - 1);

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: `+=${totalTravel}`,
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    onUpdate: (self) => {
      gsap.set(container, { x: -self.progress * totalTravel });
      fill.style.width = `${self.progress * 100}%`;
    },
  });

  return st;
}

function initStaggerReveal(): ScrollTrigger[] {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>('[data-carousel-card]')
  );

  return cards.map((card, i) =>
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.from(card, {
          opacity: 0,
          x: 40,
          duration: 0.6,
          delay: i * 0.12,
          ease: 'power2.out',
        });
      },
    })
  );
}

export function initCaseStudiesCarousel(viewportEl: HTMLElement): EmblaCarouselType {
  const embla = EmblaCarousel(viewportEl, { loop: true, align: 'start', active: true });

  // Wire prev/next once — safe on desktop (buttons hidden, Embla inactive = no-ops)
  wirePrevNext(embla);

  if (reducedMotion) return embla;

  const mm = gsap.matchMedia();
  let pinST: ScrollTrigger | null = null;
  let staggerSTs: ScrollTrigger[] = [];

  mm.add('(min-width: 1024px)', () => {
    // Disable Embla: translate.clear() fires internally, GSAP takes over x translation
    embla.reInit({ active: false });
    pinST = initPinnedScroll();
    return () => {
      pinST?.kill();
      pinST = null;
      embla.reInit({ active: true }); // re-enable Embla when shrinking below 1024px
    };
  });

  mm.add('(max-width: 1023px)', () => {
    staggerSTs = initStaggerReveal();
    return () => {
      staggerSTs.forEach(st => st.kill());
      staggerSTs = [];
    };
  });

  return embla;
}
```

- [ ] **Step 2: Update script in `CaseStudiesCarousel.astro`**

Replace the existing `<script>` block at the bottom of `CaseStudiesCarousel.astro` with:

```astro
<script>
  import { initCaseStudiesCarousel } from './CaseStudiesCarousel.client';
  const viewport = document.getElementById('cs-embla-viewport') as HTMLElement;
  if (viewport) {
    const embla = initCaseStudiesCarousel(viewport);
    document.addEventListener('astro:before-swap', () => embla.destroy(), { once: true });
  }
</script>
```

- [ ] **Step 3: Verify desktop pin**

```bash
bun astro check
bun dev
```

On desktop (≥1024px), scroll to the case studies section. Verify:
- Section pins to the viewport as you scroll
- Cards slide horizontally from right to left as you continue scrolling down
- Progress bar fills from left to right in sync with scroll
- Section unpins after all 3 cards have scrolled past
- Normal page scroll resumes after

- [ ] **Step 4: Verify mobile stagger**

Resize browser to <1024px (or use DevTools mobile emulation). Verify:
- Embla carousel is active: you can swipe or use prev/next arrows
- Cards animate in from the right with a stagger as they enter the viewport
- No pinning behavior on mobile

- [ ] **Step 5: Commit**

```bash
git add src/components/Sliders/CaseStudiesCarousel.client.ts src/components/Sliders/CaseStudiesCarousel.astro
git commit -m "feat: add gsap pinned horizontal scroll (desktop) and stagger reveal (mobile) to case studies"
```

---

## Final verification

- [ ] **Full TypeScript check**

```bash
bun astro check
```

Expected: zero errors.

- [ ] **Production build**

```bash
bun build
```

Expected: build completes with no errors. Check output for any unexpected large bundles.

- [ ] **Full browser walkthrough**

Start `bun dev` and verify each animation end-to-end:

| Animation | Trigger | Expected |
|---|---|---|
| Dot grid | Page load | Blue dots pulse in radial wave across hero |
| Text scramble | Page load | Hero h1 scrambles then resolves (~0.9s) |
| SVG draw-in | ~1s after load | Wavy line draws under headline |
| Parallax | Scroll past hero | Background drifts slower than content |
| Nav shadow | Scroll 0→80px | Shadow deepens (Chrome/Edge) |
| Stats count-up | Scroll to stats | 0→200+, 0→95%, 0→12+, 0→500+ |
| Gradient rotate | Always on stats | Subtle blue gradient slowly rotates |
| Industries stagger | Scroll to grid | Cards fade up with 80ms stagger |
| 3D tilt | Hover card (desktop) | Card tilts ±8° toward cursor |
| Magnetic button | Hover primary button | Button pulls ~12px toward cursor |
| Case studies pin | Scroll (desktop) | Section pins, cards scroll horizontally |
| Case studies stagger | Scroll (mobile) | Cards slide in from right |

- [ ] **Reduced motion check**

In System Preferences (macOS) → Accessibility → Reduce Motion: enable. Reload http://localhost:4321. Verify: no animations run, all content is fully visible, layout is correct.

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat: complete animation system — gsap dot grid, scramble, parallax, count-up, tilt, pin, magnetic"
```
