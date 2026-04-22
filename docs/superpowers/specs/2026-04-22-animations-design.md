# Animation System Design — Anvil Prime

**Date:** 2026-04-22
**Status:** Approved

## Overview

Add a comprehensive GSAP-first animation system to the Anvil Prime Astro site. GSAP acts as the single animation orchestrator for all JS-driven animations. CSS handles hover states and scroll-driven declarations. All animations are SEO-safe (content server-rendered, no JS-injected text), respect `prefers-reduced-motion`, and are loaded as `.client.ts` files per the existing pattern.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Animation orchestrator | GSAP-first (single API) | Simpler mental model vs mixed CSS+vanilla JS |
| Canvas hero style | Dot Grid (pulsing, radial wave) | Precision/blueprint feel, zero layout cost |
| GSAP case studies — desktop | Pinned horizontal scroll | Immersive editorial feel |
| GSAP case studies — mobile | ScrollTrigger stagger reveal | Preserves Embla, no scroll disruption |
| Text scramble trigger | On page load only (first slide h1) | One strong first impression, no fatigue |

## Architecture

### New Dependency

```bash
bun add gsap
```

GSAP 3.12+ + ScrollTrigger only. No other animation libraries.

### Shared GSAP Module

**`src/lib/gsap.client.ts`** (new directory — intentional, separates shared libs from component-level clients)
- Imports `gsap` and `ScrollTrigger`
- Registers `ScrollTrigger` plugin once
- Checks `prefers-reduced-motion` — exports a `reducedMotion` boolean
- All animation client files import from here

### New Files

```
src/lib/gsap.client.ts                               ← new directory, intentional
src/components/Animations/HeroCanvas.client.ts
src/components/Animations/TextScramble.client.ts
src/components/Animations/CountUp.client.ts
src/components/Animations/Parallax.client.ts
src/components/Animations/MagneticButton.client.ts
src/components/Animations/SvgDraw.client.ts
```

### Modified Files

```
src/components/Sliders/CaseStudiesCarousel.client.ts  ← GSAP pin + stagger, Embla gating
src/components/Sliders/HeroCarousel.astro             ← canvas element + SVG underline
src/components/Sections/Performance.astro             ← data-count-to / data-count-suffix attrs
src/components/Sections/Industries.astro              ← remove ScrollReveal wrappers from cards
src/styles/animations.css                             ← scroll-driven CSS additions
```

---

## Section Designs

### 1. Hero — Canvas Dot Grid

**File:** `src/components/Animations/HeroCanvas.client.ts`

**DOM placement:** Canvas is appended as a direct child of `#hero-carousel` (outside the Embla viewport `#hero-embla-viewport`), positioned `absolute inset-0 w-full h-full` so it covers the hero without entering Embla's flex layout. The Embla viewport sits above it via stacking context. Z-index layering: canvas at `z-index: 1`, Embla viewport (and photo overlay) inherits stacking normally, slide content at `z-10` — canvas texture is visible through the semi-transparent `bg-slate-900/65` overlay.

- Grid spacing: 24px. Each dot: 1.5px radius, color `rgba(44, 183, 232, alpha)` (`--color-accent-bright`)
- Pulsing radial wave from canvas center using `gsap.to()` on alpha values with `stagger` across flat dot array
- `ResizeObserver` handles canvas resize and dot recomputation
- Canvas init deferred to `requestIdleCallback` to avoid blocking LCP
- Paused via Page Visibility API when tab is hidden
- Runs on all viewport sizes

### 2. Hero — Text Scramble

**File:** `src/components/Animations/TextScramble.client.ts`

- Targets first slide `[data-slide-content] h1` only
- Fires once on page load
- Uses `gsap.ticker` — each tick advances reveal head (proportional to elapsed time over 900ms), randomizes remaining chars from `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&`
- Spaces always preserved as spaces — not scrambled
- No layout shift — element stays in DOM at full size and full opacity during scramble; only `textContent` changes
- Skip entirely if `reducedMotion === true`

### 3. Hero — Parallax Layers

**File:** `src/components/Animations/Parallax.client.ts`

**Target elements:** Each slide's `<img>` element (the Astro `<Image>` output) — targeted via `[data-hero-slide] img`. ScrollTrigger applies a `y` offset on each image individually, not on the Embla flex container, so Embla's own `x` transform stack is unaffected.

- Active slide image moves at 40% scroll speed (`y: viewportHeight * 0.4, scrub: true`)
- Slide content text (`[data-slide-content]`) moves at 15% scroll speed in the same direction
- ScrollTrigger scoped to `#hero-carousel` section
- On Embla `select` event, the parallax ScrollTrigger is refreshed (`ScrollTrigger.refresh()`) so the incoming slide's image picks up the correct position
- **Desktop only** (`window.innerWidth >= 768`) — skip on mobile

### 4. Stats — Count-Up

**File:** `src/components/Animations/CountUp.client.ts`

**Markup change in `Performance.astro`** — all four stats:

```astro
<div class="text-5xl font-bold text-white mb-2"
  data-count-to="200"
  data-count-suffix="+"
>200+</div>

<div class="text-5xl font-bold text-white mb-2"
  data-count-to="95"
  data-count-suffix="%"
>95%</div>

<div class="text-5xl font-bold text-white mb-2"
  data-count-to="12"
  data-count-suffix="+"
>12+</div>

<div class="text-5xl font-bold text-white mb-2"
  data-count-to="500"
  data-count-suffix="+"
>500+</div>
```

All four values are clean integers (`200`, `95`, `12`, `500`) — no parsing issues.

**Runtime mechanism:**
- On scroll trigger: `element.textContent = '0' + suffix` in `onStart` callback (direct DOM write, not `gsap.set()`)
- GSAP animates a plain JS object `{ val: 0 }` to `{ val: target }`
- `onUpdate`: `element.textContent = Math.round(obj.val) + suffix`
- Suffix appended from the first frame — always visible
- Crawlers see the original `200+` etc. in server HTML before JS runs

**ScrollTrigger config:** `once: true`, fires when section enters viewport. Easing: `power2.out`, duration: 2s, stagger: 150ms between 4 stats. Fires 150ms after the existing `ScrollReveal` fade-up completes.

**Reduced motion:** skip count-up entirely if `reducedMotion === true` — values stay at `200+`, `95%` etc. as rendered.

### 5. Industries Grid — 3D Tilt + Stagger Reveal

**Modified file:** `src/components/Sections/Industries.astro` — remove all `<ScrollReveal>` wrappers from individual card items. Cards render as direct children of the grid. Add `data-industry-card` attribute to each card `<div>` for GSAP targeting. Add `id="industries-grid"` to the grid container.

**Reduced motion fallback:** When `reducedMotion === true`, skip both animations. Cards must still be visible — add `opacity: 1` directly to all `[data-industry-card]` elements in JS before returning, since GSAP never sets the initial `opacity: 0`.

**3D Tilt (desktop only, `navigator.maxTouchPoints === 0`):**
- Grid container gets `style="perspective: 800px"` via JS
- Cards get `transform-style: preserve-3d` via JS
- Single `mousemove` listener on `#industries-grid` (event delegation)
- `gsap.to(card, { rotateX, rotateY, duration: 0.3, ease: "power2.out" })` — max ±8°
- `mouseleave` on card: `gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" })`

**Stagger Reveal:**
- Single ScrollTrigger on `#industries-grid`
- `gsap.from('[data-industry-card]', { opacity: 0, y: 24, stagger: 0.08, duration: 0.6, ease: "power2.out" })`
- Replaces the removed individual `ScrollReveal` Intersection Observers

### 6. Case Studies — GSAP Pin (Desktop) + Stagger (Mobile)

**File:** `src/components/Sliders/CaseStudiesCarousel.client.ts` (extended)

**Breakpoint switching via `gsap.matchMedia()`** (not the deprecated `ScrollTrigger.matchMedia()`):

```ts
import { gsap, reducedMotion } from '../../lib/gsap.client';
import ScrollTrigger from 'gsap/ScrollTrigger';

const mm = gsap.matchMedia();

mm.add('(min-width: 1024px)', (context) => {
  // Desktop: disable Embla, enable pin
  embla.reInit({ active: false }); // Disables drag/scroll interaction. Side effect: Embla calls
  // translate.clear() internally, resetting the container's CSS transform to 0. This is desirable
  // here — GSAP's pin ScrollTrigger takes full ownership of the x translation on desktop.
  // On re-enable, Embla reinitializes from the current scroll index, preserving position.
  initPinnedScroll();
  return () => {
    // Cleanup on breakpoint exit
    ScrollTrigger.getAll().forEach(st => st.kill());
    embla.reInit({ active: true });
  };
});

mm.add('(max-width: 1023px)', (context) => {
  // Mobile: Embla stays active, stagger on cards
  initStaggerReveal();
  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
});
```

**Embla gating:** `embla.reInit({ active: false })` disables Embla interaction and CSS transforms on desktop without destroying the instance. `embla.reInit({ active: true })` re-enables on breakpoint exit. Embla init still happens unconditionally — `gsap.matchMedia()` handles the behavioral switch. No race condition since `gsap.matchMedia()` fires synchronously at the correct breakpoint.

**Desktop — Pinned Horizontal Scroll:**
- Add `id="case-studies-cards-container"` to the cards wrapper in `CaseStudiesCarousel.astro`
- Add `id="case-studies-progress-bar"` to a new `<div>` element added below the cards in `CaseStudiesCarousel.astro`:
  ```astro
  <div id="case-studies-progress-bar"
    class="mt-4 h-0.5 bg-border rounded-full overflow-hidden"
    aria-hidden="true">
    <div id="case-studies-progress-fill" class="h-full bg-accent w-0 rounded-full"></div>
  </div>
  ```
- ScrollTrigger `pin: true` on the case studies `<section>` (add `id="case-studies-section"`)
- Horizontal tween: `gsap.to('#case-studies-cards-container', { x: -(cardWidth + gap) * (cardCount - 1) })`
- `scrub: 1` — scroll position directly drives translation
- `onUpdate`: set `#case-studies-progress-fill` width as percentage of progress
- Section unpins after last card clears

**Mobile — Stagger Reveal:**
- Embla carousel remains fully active
- Each card (`[data-carousel-card]` — add attribute in markup): `gsap.from(card, { opacity: 0, x: 40 })` on ScrollTrigger enter
- Cards stagger 120ms apart, `once: true`

**SEO:** All card HTML (titles, descriptions, links) server-rendered. Transform is purely visual.

### 7. Magnetic Buttons

**File:** `src/components/Animations/MagneticButton.client.ts`

- Add `data-magnetic` attribute to primary CTA `<a>` and `<button>` elements in `Button.astro` (variant="primary" only)
- `mousemove` within 60px radius of button center: `gsap.to(btn, { x: dx * 0.2, y: dy * 0.2, duration: 0.3, ease: "power2.out" })`
- `mouseleave`: `gsap.to(btn, { x: 0, y: 0, ease: "elastic.out(1, 0.4)", duration: 0.6 })`
- Max displacement: ~12px
- Single delegated `mousemove` on `document`
- Desktop only (`navigator.maxTouchPoints === 0`)
- Skip if `reducedMotion === true`

### 8. SVG Path Draw-In

**File:** `src/components/Animations/SvgDraw.client.ts`

**Markup in `HeroCarousel.astro`** — added beneath the `h1` inside `[data-slide-content]` on the first slide only:

```astro
<svg
  aria-hidden="true"
  width="200" height="8"
  viewBox="0 0 200 8"
  style="visibility: hidden;"
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
```

`visibility: hidden` prevents the path from flashing as fully drawn before JS runs. `stroke-dasharray` and `stroke-dashoffset` are set to the path's approximate total length in the static markup.

**Runtime:**
- `gsap.set('[data-svg-draw]', { visibility: 'visible' })` at animation start
- `gsap.to('[data-svg-draw] path', { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", delay: 1.0 })` — fires after text scramble completes (~900ms + 100ms buffer)
- Skip if `reducedMotion === true`

### 9. CSS Scroll-Driven Additions

**File:** `src/styles/animations.css`

**`@property` block — must be at top level, NOT inside `@supports`:**

```css
@property --grad-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 135deg;
}
```

**`@supports` wrapper for scroll-driven rules:**

```css
@supports (animation-timeline: scroll()) {

  /* Navbar scroll shadow — targets #navbar (the actual element ID) */
  /* Coexists with existing JS shadow-sm toggle: JS adds Tailwind class,
     CSS animation adds box-shadow directly. CSS animation wins on specificity
     for the custom box-shadow value; Tailwind shadow-sm is suppressed by
     the animation value when scroll > 80px. */
  @keyframes nav-shadow {
    from { box-shadow: none; }
    to { box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
  }
  #navbar {
    animation: nav-shadow linear both;
    animation-timeline: scroll();
    animation-range: 0px 80px;
  }

  /* Section heading underline grow */
  @keyframes underline-grow {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
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

  /* Performance section gradient rotation */
  @keyframes grad-rotate {
    to { --grad-angle: 315deg; }
  }
}

/* Gradient animation: @property + @keyframes at top level, applied via class.
   Fallback: element keeps bg-accent (solid #1478c8) when @property unsupported.
   The .performance-gradient class is added alongside bg-accent — when @property
   is supported, the background rule in this class overrides Tailwind's bg-accent.
   When unsupported, this class has no background rule that takes effect. */
@supports (background: linear-gradient(var(--grad-angle, 135deg), red, blue)) {
  .performance-gradient {
    background: linear-gradient(var(--grad-angle, 135deg), #1478c8, #0c5ea5);
    animation: grad-rotate 8s linear infinite alternate;
  }
}
```

Add `performance-gradient` class to the `<section>` in `Performance.astro` alongside existing `bg-accent`. The `bg-accent` remains as the CSS fallback for unsupported browsers.

---

## SEO & Performance Safeguards

| Risk | Mitigation |
|---|---|
| Hidden text from crawlers | All content in server-rendered HTML; GSAP only transforms, never injects text |
| `opacity: 0` initial states | Set by GSAP at runtime — crawlers see full-opacity server HTML |
| Count-up overwrites visible values | `element.textContent` written in `onStart`, after page is fully loaded |
| CLS from canvas | Canvas positioned `absolute` as sibling of Embla viewport — no layout impact |
| LCP regression (hero image) | Canvas init deferred to `requestIdleCallback`; hero `<Image>` has `fetchpriority="high"` |
| INP from GSAP ticker | Dot grid paused via Page Visibility API when tab hidden |
| SVG flash before JS | `visibility: hidden` on SVG in static markup; revealed by `gsap.set()` at animation start |
| Parallax breaking Embla | Parallax targets individual slide `<img>` elements, not the Embla flex container |
| GSAP bundle cost | ~30KB gzipped, Astro defers `.client.ts` automatically |
| Reduced motion | `reducedMotion` boolean from `gsap.client.ts` gates all animations; industry cards explicitly set `opacity: 1` as fallback |

---

## Out of Scope

- Lottie (no AE assets available)
- Dark mode animations
- Page transition animations (requires View Transitions API integration)
- Animation on inner pages (services, about, contact) — homepage only for this phase
