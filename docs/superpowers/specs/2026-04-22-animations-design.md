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

GSAP + ScrollTrigger only. No other animation libraries.

### Shared GSAP Module

**`src/lib/gsap.client.ts`**
- Imports `gsap` and `ScrollTrigger`
- Registers `ScrollTrigger` plugin once
- Checks `prefers-reduced-motion` — exports a `reducedMotion` boolean
- All animation client files import from here

### New Files

```
src/lib/gsap.client.ts
src/components/Animations/HeroCanvas.client.ts
src/components/Animations/TextScramble.client.ts
src/components/Animations/CountUp.client.ts
src/components/Animations/Parallax.client.ts
src/components/Animations/MagneticButton.client.ts
src/components/Animations/SvgDraw.client.ts
```

### Modified Files

```
src/components/Sliders/CaseStudiesCarousel.client.ts  ← GSAP pin + stagger
src/components/Sliders/HeroCarousel.astro             ← canvas element + SVG underline
src/components/Sections/Performance.astro             ← data-count-to attributes
src/styles/animations.css                             ← scroll-driven CSS additions
```

---

## Section Designs

### 1. Hero — Canvas Dot Grid

**File:** `src/components/Animations/HeroCanvas.client.ts`

- Canvas element injected behind slide content (`z-index: 1`)
- Photo overlay at `z-index: 2`, content at `z-index: 10`
- Grid spacing: 24px. Each dot: 1.5px radius, `rgba(44, 183, 232, alpha)`
- Pulsing radial wave from canvas center using `gsap.to()` on alpha values
- `stagger` across flat dot array for wave propagation effect
- `ResizeObserver` handles canvas resize and dot recomputation
- Runs on all viewport sizes

### 2. Hero — Text Scramble

**File:** `src/components/Animations/TextScramble.client.ts`

- Targets first slide `[data-slide-content] h1` only
- Fires once on page load
- Uses `gsap.ticker` — each tick advances reveal head, randomizes remaining chars from `A-Z a-z 0-9 @#$%&`
- Duration: ~900ms (reveal head advances proportionally per tick)
- No layout shift — element stays in DOM at full size during scramble
- Skip entirely if `reducedMotion === true`

### 3. Hero — Parallax Layers

**File:** `src/components/Animations/Parallax.client.ts`

- Background image: ScrollTrigger `scrub: true`, moves at 40% scroll speed
- Slide content text: moves at 15% scroll speed
- Creates depth between image and text layers
- **Desktop only** (`window.innerWidth >= 768`) — disabled on mobile to prevent jank in fixed-height heroes
- Applied to `#hero-carousel` using ScrollTrigger on the section

### 4. Stats — Count-Up

**File:** `src/components/Animations/CountUp.client.ts`

**Markup change in `Performance.astro`:**
```astro
<div class="text-5xl font-bold text-white mb-2"
  data-count-to="200"
  data-count-suffix="+"
>200+</div>
```

- GSAP reads `data-count-to` and `data-count-suffix` at runtime
- `gsap.set()` overwrites display to `0` — crawlers still see `200+` in server HTML
- ScrollTrigger fires when section enters viewport (`once: true`)
- Easing: `power2.out`, duration: 2s
- Stagger: 150ms between 4 stats
- Values rounded via `Math.round()` in `onUpdate`
- Suffix appended immediately, not counted
- Fires after existing `ScrollReveal` fade-up (150ms offset)

### 5. Industries Grid — 3D Tilt + Stagger Reveal

**Replaces:** individual `ScrollReveal` wrappers on industry cards

**3D Tilt:**
- Parent grid gets `perspective: 800px`; cards get `transform-style: preserve-3d`
- Single `mousemove` listener on grid container (event delegation)
- `gsap.to(card, { rotateX, rotateY, duration: 0.3, ease: "power2.out" })` — max ±8°
- `mouseleave` resets: `gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" })`
- Desktop only (`navigator.maxTouchPoints === 0`)

**Stagger Reveal:**
- Single ScrollTrigger on `.industries-grid` container
- `gsap.from(cards, { opacity: 0, y: 24, stagger: 0.08, duration: 0.6, ease: "power2.out" })`
- Replaces 8 separate Intersection Observers from `ScrollReveal`
- `ScrollReveal` component untouched — just not used for industry cards

### 6. Case Studies — GSAP Pin (Desktop) + Stagger (Mobile)

**File:** `src/components/Sliders/CaseStudiesCarousel.client.ts` (extended)

**Desktop (≥1024px) — Pinned Horizontal Scroll:**
- ScrollTrigger `pin: true` on the case studies `<section>`
- Horizontal tween: `gsap.to(cardsContainer, { x: -(cardWidth + gap) * (cardCount - 1) })`
- `scrub: 1` — scroll position directly drives translation
- Progress bar element fills from 0% to 100% as cards scroll through
- Embla **disabled** on desktop — ScrollTrigger owns movement
- Section unpins after last card clears

**Mobile (<1024px) — Stagger Reveal:**
- Embla carousel remains active
- Each card: `gsap.from(card, { opacity: 0, x: 40 })` on ScrollTrigger enter
- Cards stagger 120ms apart
- No pinning

**Responsive switching:**
- `ScrollTrigger.matchMedia()` decides which path runs at init
- On breakpoint cross: kills ScrollTrigger instances, re-initializes appropriate mode

**SEO:** All card HTML (titles, descriptions, links) server-rendered. Transform is purely visual.

### 7. Magnetic Buttons

**File:** `src/components/Animations/MagneticButton.client.ts`

- Targets all `[data-magnetic]` elements (attribute added to primary CTA buttons)
- `mousemove` within 60px radius: `gsap.to(btn, { x: dx * 0.2, y: dy * 0.2, duration: 0.3 })`
- `mouseleave`: `gsap.to(btn, { x: 0, y: 0, ease: "elastic.out(1, 0.4)", duration: 0.6 })`
- Max displacement: ~12px
- Single delegated `mousemove` on `document`
- Desktop only (`navigator.maxTouchPoints === 0`)

### 8. SVG Path Draw-In

**File:** `src/components/Animations/SvgDraw.client.ts`

- Small SVG `<line>` or `<path>` element added to `HeroCarousel.astro` beneath the `h1`
- Initial state: `stroke-dashoffset` = total path length (set via GSAP `gsap.set()`)
- Animates to `stroke-dashoffset: 0` after text scramble completes (~1000ms delay)
- Duration: 1.2s, `ease: "power2.inOut"`
- Color: `--color-accent-bright` (#2cb7e8)

### 9. CSS Scroll-Driven Additions

**File:** `src/styles/animations.css`

All wrapped in `@supports (animation-timeline: scroll())`:

**Navbar scroll shadow:**
```css
@keyframes nav-shadow {
  from { box-shadow: none; }
  to { box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
}
.navbar {
  animation: nav-shadow linear both;
  animation-timeline: scroll();
  animation-range: 0px 80px;
}
```

**Section heading underline grow:**
```css
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
```

**Performance section gradient rotation:**
```css
@property --grad-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 135deg;
}
@keyframes grad-rotate {
  to { --grad-angle: 315deg; }
}
.performance-section {
  background: linear-gradient(var(--grad-angle), #1478c8, #0c5ea5);
  animation: grad-rotate 8s linear infinite alternate;
}
```

Unsupported browsers fall back to existing static styles.

---

## SEO & Performance Safeguards

| Risk | Mitigation |
|---|---|
| Hidden text from crawlers | All content in server-rendered HTML; GSAP only transforms, never injects text |
| `opacity: 0` initial states | Set by `gsap.set()` at runtime — crawlers see full opacity HTML |
| CLS from canvas | Canvas positioned `absolute` inside existing relative container — no layout impact |
| LCP regression (hero image) | Canvas `z-index: 1`, image loads normally; canvas init deferred to `requestIdleCallback` |
| INP from GSAP ticker | Dot grid uses `gsap.ticker` — capped at 60fps, paused when tab not visible via Page Visibility API |
| Reduced motion | Single check at `gsap.client.ts` module level; all animations skipped if true |
| GSAP bundle cost | ~30KB gzipped, loaded only as `.client.ts` (Astro defers automatically) |

---

## Out of Scope

- Lottie (no AE assets available)
- Dark mode animations
- Page transition animations (requires View Transitions API integration)
- Animation on inner pages (services, about, contact) — homepage only for this phase
