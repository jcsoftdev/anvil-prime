# Meridian Labs Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full Meridian Labs technology consulting website using Astro 6.x with animated carousels, scroll effects, SEO structured data, and multiple content pages.

**Architecture:** Static-first Astro site with Client Islands only for interactive carousels. CSS animations + IntersectionObserver for scroll reveals. Embla Carousel for hero/case-studies sliders. Content Collections for blog/case-studies.

**Tech Stack:** Astro 6.x, Tailwind CSS 4.x, Embla Carousel 8.x, TypeScript 5.x, Bun (runtime already set up).

---

> **Note:** This spec covers multiple independent subsystems. It's split into 7 phases, each producing testable, deployable output independently.

---

## File Map

```
src/
├── layouts/
│   ├── Base.astro                     # HTML shell, meta, fonts, global scripts
│   └── Layout.astro                   # (DELETE - replaced by Base.astro)
├── components/
│   ├── Navigation/
│   │   ├── Navbar.astro               # Sticky nav with scroll detection
│   │   └── MobileMenu.astro           # Hamburger menu island
│   ├── Sections/
│   │   ├── Hero.astro                 # Hero section with carousel
│   │   ├── Performance.astro          # Stats/metrics section
│   │   ├── Industries.astro           # Industry cards grid
│   │   ├── CaseStudies.astro          # Case studies carousel section
│   │   └── Insights.astro            # Blog/insights carousel section
│   ├── Sliders/
│   │   ├── HeroCarousel.astro         # Hero slider markup
│   │   ├── HeroCarousel.client.ts     # Embla init for hero
│   │   ├── CaseStudiesCarousel.astro  # Case studies slider markup
│   │   ├── CaseStudiesCarousel.client.ts
│   │   ├── InsightsCarousel.astro     # Insights slider markup
│   │   └── InsightsCarousel.client.ts
│   ├── Animations/
│   │   └── ScrollReveal.astro         # IntersectionObserver reveal wrapper
│   └── UI/
│       ├── Button.astro               # Reusable button variants
│       ├── Card.astro                 # Reusable card component
│       └── Badge.astro                # Label/tag component
├── pages/
│   ├── index.astro                    # Home page (replace existing)
│   ├── about.astro                    # About/team page
│   ├── services.astro                 # Services page
│   ├── careers.astro                  # Careers page
│   ├── contact.astro                  # Contact form page
│   ├── 404.astro                      # Custom 404
│   ├── insights/
│   │   └── [...slug].astro            # Dynamic blog post page
│   └── case-studies/
│       └── [...slug].astro            # Dynamic case study page
├── content/
│   ├── config.ts                      # Collections schema
│   ├── case-studies/
│   │   ├── ai-ml-platform.md
│   │   ├── cloud-migration.md
│   │   └── digital-transformation.md
│   └── insights/
│       ├── future-of-ai.md
│       ├── cloud-native-patterns.md
│       └── engineering-culture.md
├── styles/
│   ├── globals.css                    # Base reset + Tailwind import
│   ├── animations.css                 # CSS keyframes + scroll-driven
│   └── variables.css                  # CSS custom properties
├── data/
│   ├── navigation.ts                  # Nav links config
│   ├── services.ts                    # Services data
│   ├── team.ts                        # Team members data
│   └── industries.ts                  # Industries/verticals data
└── utils/
    ├── seo.ts                         # SEO meta helpers
    └── constants.ts                   # Site-wide constants
```

---

## Phase 1: Foundation & Dependencies

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Create: `src/styles/variables.css`
- Create: `src/styles/animations.css`
- Create: `src/styles/globals.css`

- [ ] **Step 1.1: Install all dependencies**

```bash
bun add @astrojs/tailwind @astrojs/sitemap embla-carousel
bun add -D tailwindcss @tailwindcss/vite prettier prettier-plugin-astro
```

- [ ] **Step 1.2: Update astro.config.mjs**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://meridian-labs.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  image: {
    domains: [],
  },
});
```

- [ ] **Step 1.3: Create src/styles/variables.css**

```css
:root {
  --color-primary: #0f172a;
  --color-accent: #6366f1;
  --color-accent-light: #818cf8;
  --color-surface: #ffffff;
  --color-surface-alt: #f8fafc;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Cal Sans', 'Inter', sans-serif;

  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.5rem;

  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-elevated: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

- [ ] **Step 1.4: Create src/styles/animations.css**

```css
/* Scroll-driven reveal animations */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-fade-up {
  opacity: 0;
  animation: fade-up 0.6s ease forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: fade-in 0.4s ease forwards;
}

.is-visible {
  opacity: 1 !important;
}

/* Stagger delays */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-up,
  .animate-fade-in {
    animation: none;
    opacity: 1;
  }
}
```

- [ ] **Step 1.5: Create src/styles/globals.css**

```css
@import './variables.css';
@import './animations.css';
@import 'tailwindcss';

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-surface);
  margin: 0;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 1.6: Verify Astro still starts**

```bash
bun run dev
```

Expected: Dev server starts at localhost:4321, no errors in terminal.

- [ ] **Step 1.7: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind 4, Embla Carousel, Sitemap dependencies"
```

---

### Task 2: Create Base Layout + data/utils foundation

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/utils/seo.ts`
- Create: `src/utils/constants.ts`
- Create: `src/data/navigation.ts`

- [ ] **Step 2.1: Create src/utils/constants.ts**

```ts
export const SITE_NAME = 'Meridian Labs';
export const SITE_URL = 'https://meridian-labs.com';
export const SITE_DESCRIPTION =
  'Meridian Labs is a technology consulting firm helping enterprises build better software, faster.';
export const SITE_TWITTER = '@meridian_labs';
export const CONTACT_EMAIL = 'hello@meridian-labs.com';
```

- [ ] **Step 2.2: Create src/utils/seo.ts**

```ts
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from './constants';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
}

export function buildSEO(props: SEOProps = {}) {
  const title = props.title ? `${props.title} | ${SITE_NAME}` : SITE_NAME;
  const description = props.description ?? SITE_DESCRIPTION;
  const image = props.image ?? `${SITE_URL}/og-default.png`;
  const canonical = props.canonical ?? SITE_URL;

  return { title, description, image, canonical, noindex: props.noindex ?? false };
}
```

- [ ] **Step 2.3: Create src/data/navigation.ts**

```ts
export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
];

export const ctaLink = { label: 'Contact Us', href: '/contact' };
```

- [ ] **Step 2.4: Create src/layouts/Base.astro**

```astro
---
import '../styles/globals.css';
import { buildSEO } from '../utils/seo';
import type { SEOProps } from '../utils/seo';
import { SITE_NAME } from '../utils/constants';

interface Props extends SEOProps {}

const seo = buildSEO(Astro.props);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />

    <title>{seo.title}</title>
    <meta name="description" content={seo.description} />
    <link rel="canonical" href={seo.canonical} />
    {seo.noindex && <meta name="robots" content="noindex,nofollow" />}

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={seo.title} />
    <meta property="og:description" content={seo.description} />
    <meta property="og:image" content={seo.image} />
    <meta property="og:url" content={seo.canonical} />
    <meta property="og:site_name" content={SITE_NAME} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seo.title} />
    <meta name="twitter:description" content={seo.description} />
    <meta name="twitter:image" content={seo.image} />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2.5: Run type check**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 2.6: Commit**

```bash
git add -A
git commit -m "feat: add Base layout with SEO helpers and site constants"
```

---

## Phase 2: Navigation

### Task 3: Navbar component

**Files:**
- Create: `src/components/Navigation/Navbar.astro`
- Create: `src/components/Navigation/MobileMenu.astro`
- Create: `src/components/UI/Button.astro`

- [ ] **Step 3.1: Create src/components/UI/Button.astro**

```astro
---
interface Props {
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const {
  href,
  variant = 'primary',
  size = 'md',
  class: className = '',
} = Astro.props;

const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
  outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-500',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const classes = [base, variants[variant], sizes[size], className].join(' ');
const Tag = href ? 'a' : 'button';
---

<Tag href={href} class={classes}>
  <slot />
</Tag>
```

- [ ] **Step 3.2: Create src/components/Navigation/Navbar.astro**

```astro
---
import Button from '../UI/Button.astro';
import { navLinks, ctaLink } from '../../data/navigation';
---

<header
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
  id="navbar"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="flex items-center justify-between h-16 lg:h-20">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 font-bold text-xl text-slate-900">
        <span class="text-indigo-600">M</span>eridian Labs
      </a>

      <!-- Desktop nav -->
      <ul class="hidden lg:flex items-center gap-8 list-none m-0 p-0">
        {navLinks.map(link => (
          <li>
            <a
              href={link.href}
              class="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 text-sm"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <!-- CTA + Hamburger -->
      <div class="flex items-center gap-4">
        <Button href={ctaLink.href} variant="primary" size="sm" class="hidden lg:inline-flex">
          {ctaLink.label}
        </Button>

        <button
          id="mobile-menu-toggle"
          class="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Toggle mobile menu"
          aria-expanded="false"
          aria-controls="mobile-menu"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path id="hamburger-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path id="close-icon" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>
  </div>

  <!-- Mobile menu -->
  <div
    id="mobile-menu"
    class="lg:hidden hidden bg-white border-t border-slate-200 shadow-lg"
    role="navigation"
    aria-label="Mobile navigation"
  >
    <ul class="px-4 py-4 space-y-2 list-none m-0">
      {navLinks.map(link => (
        <li>
          <a
            href={link.href}
            class="block px-4 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
          >
            {link.label}
          </a>
        </li>
      ))}
      <li class="pt-2">
        <Button href={ctaLink.href} variant="primary" size="md" class="w-full">
          {ctaLink.label}
        </Button>
      </li>
    </ul>
  </div>
</header>

<script>
  // Scroll detection for navbar background
  const navbar = document.getElementById('navbar')!;
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-sm', 'shadow-sm', 'border-b', 'border-slate-200/80');
    } else {
      navbar.classList.remove('bg-white/95', 'backdrop-blur-sm', 'shadow-sm', 'border-b', 'border-slate-200/80');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const toggle = document.getElementById('mobile-menu-toggle')!;
  const menu = document.getElementById('mobile-menu')!;
  const hamburgerIcon = document.getElementById('hamburger-icon')!;
  const closeIcon = document.getElementById('close-icon')!;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!isOpen));
    hamburgerIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  });

  // Close mobile menu on nav link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });
</script>
```

- [ ] **Step 3.3: Run type check**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 3.4: Update index.astro to use Base layout + Navbar to verify**

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
---

<Base title="Technology Consulting">
  <Navbar />
  <main class="pt-20">
    <h1 class="text-4xl font-bold text-center py-20">Meridian Labs</h1>
  </main>
</Base>
```

- [ ] **Step 3.5: Start dev server and verify navbar renders + scroll behavior works**

```bash
bun run dev
```

Open localhost:4321. Check: navbar sticky, background changes on scroll, mobile menu opens/closes.

- [ ] **Step 3.6: Commit**

```bash
git add -A
git commit -m "feat: add sticky Navbar with mobile menu toggle and scroll detection"
```

---

## Phase 3: UI Components + Animations

### Task 4: Card, Badge, ScrollReveal components

**Files:**
- Create: `src/components/UI/Card.astro`
- Create: `src/components/UI/Badge.astro`
- Create: `src/components/Animations/ScrollReveal.astro`

- [ ] **Step 4.1: Create src/components/UI/Badge.astro**

```astro
---
interface Props {
  variant?: 'default' | 'accent' | 'success';
  class?: string;
}
const { variant = 'default', class: className = '' } = Astro.props;
const variants = {
  default: 'bg-slate-100 text-slate-700',
  accent: 'bg-indigo-100 text-indigo-700',
  success: 'bg-emerald-100 text-emerald-700',
};
---
<span class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
  <slot />
</span>
```

- [ ] **Step 4.2: Create src/components/UI/Card.astro**

```astro
---
interface Props {
  href?: string;
  class?: string;
  hover?: boolean;
}
const { href, class: className = '', hover = true } = Astro.props;
const Tag = href ? 'a' : 'div';
const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : '';
---
<Tag
  href={href}
  class={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${hoverClasses} ${className}`}
>
  <slot />
</Tag>
```

- [ ] **Step 4.3: Create src/components/Animations/ScrollReveal.astro**

```astro
---
interface Props {
  animation?: 'fade-up' | 'fade-in' | 'slide-in-left';
  delay?: 0 | 100 | 200 | 300 | 400;
  threshold?: number;
  class?: string;
}
const {
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  class: className = '',
} = Astro.props;

const delayClass = delay > 0 ? `delay-${delay}` : '';
---

<div
  class={`animate-${animation} ${delayClass} ${className}`}
  data-reveal
  data-threshold={threshold}
>
  <slot />
</div>

<script>
  const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
</script>
```

- [ ] **Step 4.4: Run type check**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 4.5: Commit**

```bash
git add -A
git commit -m "feat: add Card, Badge, ScrollReveal UI components"
```

---

## Phase 4: Hero Section + Carousels

### Task 5: Hero Carousel (Embla 8.x)

**Files:**
- Create: `src/components/Sliders/HeroCarousel.astro`
- Create: `src/components/Sliders/HeroCarousel.client.ts`
- Create: `src/components/Sections/Hero.astro`

- [ ] **Step 5.1: Create src/components/Sliders/HeroCarousel.client.ts**

```ts
import EmblaCarousel from 'embla-carousel';

export interface HeroSlide {
  headline: string;
  subheadline: string;
  cta: { label: string; href: string };
  tag: string;
  bgColor: string;
}

export const heroSlides: HeroSlide[] = [
  {
    headline: 'Build Software That Scales',
    subheadline: 'We partner with enterprise teams to architect, build, and ship technology products that drive real business outcomes.',
    cta: { label: 'See Our Work', href: '/case-studies' },
    tag: 'Technology Consulting',
    bgColor: 'from-slate-900 to-indigo-950',
  },
  {
    headline: 'AI-Native Product Development',
    subheadline: 'From LLM integrations to custom ML models — we help you embed intelligence into your core product experience.',
    cta: { label: 'Explore AI Services', href: '/services' },
    tag: 'Artificial Intelligence',
    bgColor: 'from-indigo-950 to-violet-950',
  },
  {
    headline: 'Cloud Transformation at Scale',
    subheadline: 'Migrate, modernize, and optimize your infrastructure with zero downtime and full observability from day one.',
    cta: { label: 'Learn More', href: '/services' },
    tag: 'Cloud Engineering',
    bgColor: 'from-slate-900 to-cyan-950',
  },
  {
    headline: 'Engineering Teams That Deliver',
    subheadline: 'Embed seasoned engineers directly into your product teams — from staff augmentation to full dedicated pods.',
    cta: { label: 'Work With Us', href: '/contact' },
    tag: 'Staff Augmentation',
    bgColor: 'from-slate-950 to-slate-900',
  },
];

export function initHeroCarousel(rootNode: HTMLElement) {
  const embla = EmblaCarousel(rootNode, {
    loop: true,
    duration: 30,
    skipSnaps: false,
  });

  const dots = document.querySelectorAll<HTMLElement>('[data-hero-dot]');
  const slides = document.querySelectorAll<HTMLElement>('[data-hero-slide]');
  let autoplayTimer: ReturnType<typeof setInterval>;

  const updateDots = (index: number) => {
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-white', i === index);
      dot.classList.toggle('bg-white/40', i !== index);
    });
  };

  const animateSlide = (index: number) => {
    slides.forEach((slide, i) => {
      const content = slide.querySelector<HTMLElement>('[data-slide-content]');
      if (!content) return;
      if (i === index) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => {
          content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';
        });
      }
    });
  };

  const startAutoplay = () => {
    autoplayTimer = setInterval(() => embla.scrollNext(), 6000);
  };

  const stopAutoplay = () => clearInterval(autoplayTimer);

  embla.on('select', () => {
    const index = embla.selectedScrollSnap();
    updateDots(index);
    animateSlide(index);
  });

  rootNode.addEventListener('mouseenter', stopAutoplay);
  rootNode.addEventListener('mouseleave', startAutoplay);

  // Arrow buttons
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  prevBtn?.addEventListener('click', () => { stopAutoplay(); embla.scrollPrev(); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { stopAutoplay(); embla.scrollNext(); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); embla.scrollTo(i); startAutoplay(); });
  });

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') embla.scrollPrev();
    if (e.key === 'ArrowRight') embla.scrollNext();
  });

  updateDots(0);
  animateSlide(0);
  startAutoplay();

  return embla;
}
```

- [ ] **Step 5.2: Create src/components/Sliders/HeroCarousel.astro**

```astro
---
import { heroSlides } from './HeroCarousel.client';
---

<div class="relative overflow-hidden" id="hero-carousel" aria-label="Hero slideshow" aria-roledescription="carousel">
  <!-- Embla viewport -->
  <div class="overflow-hidden h-full" id="hero-embla-viewport">
    <div class="flex h-full touch-pan-y">
      {heroSlides.map((slide, i) => (
        <div
          class={`relative flex-none w-full min-h-[600px] lg:min-h-[700px] bg-gradient-to-br ${slide.bgColor} flex items-center`}
          role="group"
          aria-label={`Slide ${i + 1} of ${heroSlides.length}`}
          aria-roledescription="slide"
          data-hero-slide
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
            <div data-slide-content>
              <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-6">
                {slide.tag}
              </span>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
                {slide.headline}
              </h1>
              <p class="text-lg sm:text-xl text-white/70 max-w-xl mb-8 leading-relaxed">
                {slide.subheadline}
              </p>
              <a
                href={slide.cta.href}
                class="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors duration-200 text-base"
              >
                {slide.cta.label}
                <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <!-- Arrow navigation -->
  <button
    id="hero-prev"
    class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    aria-label="Previous slide"
  >
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <button
    id="hero-next"
    class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    aria-label="Next slide"
  >
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>

  <!-- Dot indicators -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="Slide indicators">
    {heroSlides.map((_, i) => (
      <button
        data-hero-dot
        role="tab"
        aria-label={`Go to slide ${i + 1}`}
        aria-selected={i === 0}
        class={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${i === 0 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
      />
    ))}
  </div>
</div>

<script>
  import { initHeroCarousel } from './HeroCarousel.client';
  const root = document.getElementById('hero-embla-viewport') as HTMLElement;
  if (root) initHeroCarousel(root);
</script>
```

- [ ] **Step 5.3: Create src/components/Sections/Hero.astro**

```astro
---
import HeroCarousel from '../Sliders/HeroCarousel.astro';
---

<section class="relative" aria-label="Hero">
  <HeroCarousel />
</section>
```

- [ ] **Step 5.4: Update index.astro to include Hero**

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
import Hero from '../components/Sections/Hero.astro';
---

<Base title="Technology Consulting">
  <Navbar />
  <main>
    <Hero />
  </main>
</Base>
```

- [ ] **Step 5.5: Run type check and verify build**

```bash
bunx astro check && bun run build
```

Expected: 0 errors, build completes.

- [ ] **Step 5.6: Start dev and test carousel**

```bash
bun run dev
```

Check: Slides auto-advance, arrows work, dots update, keyboard navigation works, pause on hover.

- [ ] **Step 5.7: Commit**

```bash
git add -A
git commit -m "feat: add Hero section with Embla Carousel (auto-advance, arrows, dots, keyboard nav)"
```

---

## Phase 5: Home Page Sections

### Task 6: Performance/Stats + Industries sections

**Files:**
- Create: `src/components/Sections/Performance.astro`
- Create: `src/components/Sections/Industries.astro`
- Create: `src/data/industries.ts`

- [ ] **Step 6.1: Create src/data/industries.ts**

```ts
export interface Industry {
  name: string;
  icon: string;
  description: string;
}

export const industries: Industry[] = [
  { name: 'Fintech', icon: '💳', description: 'Payments, banking, and financial infrastructure' },
  { name: 'Healthcare', icon: '🏥', description: 'Digital health, EHR, and medical devices' },
  { name: 'E-Commerce', icon: '🛍️', description: 'Marketplace platforms and retail technology' },
  { name: 'SaaS', icon: '☁️', description: 'B2B software products and developer tools' },
  { name: 'Logistics', icon: '🚚', description: 'Supply chain, fleet, and fulfillment systems' },
  { name: 'EdTech', icon: '🎓', description: 'Learning platforms and educational products' },
  { name: 'Media', icon: '📱', description: 'Content platforms and streaming technology' },
  { name: 'Government', icon: '🏛️', description: 'Civic tech and public sector modernization' },
];
```

- [ ] **Step 6.2: Create src/components/Sections/Performance.astro**

```astro
---
import ScrollReveal from '../Animations/ScrollReveal.astro';

const stats = [
  { value: '200+', label: 'Projects Delivered', description: 'Across 30 countries' },
  { value: '95%', label: 'Client Retention', description: 'Year over year' },
  { value: '12+', label: 'Years Experience', description: 'Building at scale' },
  { value: '500+', label: 'Engineers', description: 'Senior-level talent' },
];
---

<section class="py-20 bg-indigo-600" aria-label="Company stats">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal>
      <h2 class="text-3xl font-bold text-white text-center mb-4">
        Performance That Speaks for Itself
      </h2>
      <p class="text-indigo-200 text-center text-lg mb-16 max-w-2xl mx-auto">
        We measure our success by our clients' outcomes — not hours billed.
      </p>
    </ScrollReveal>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <ScrollReveal delay={i * 100 as 0 | 100 | 200 | 300 | 400} class="text-center">
          <div class="text-5xl font-bold text-white mb-2">{stat.value}</div>
          <div class="text-lg font-semibold text-white mb-1">{stat.label}</div>
          <div class="text-indigo-200 text-sm">{stat.description}</div>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 6.3: Create src/components/Sections/Industries.astro**

```astro
---
import ScrollReveal from '../Animations/ScrollReveal.astro';
import { industries } from '../../data/industries';
---

<section class="py-20 bg-slate-50" aria-label="Industries we serve">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal>
      <div class="text-center mb-16">
        <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Industries</span>
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
          Built for Every Vertical
        </h2>
        <p class="text-slate-600 text-lg max-w-2xl mx-auto">
          We've shipped production software across the most demanding and regulated industries in the world.
        </p>
      </div>
    </ScrollReveal>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {industries.map((industry, i) => (
        <ScrollReveal delay={(i % 4 * 100) as 0 | 100 | 200 | 300 | 400}>
          <div class="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 text-center group cursor-default">
            <div class="text-4xl mb-3">{industry.icon}</div>
            <h3 class="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{industry.name}</h3>
            <p class="text-slate-500 text-sm leading-snug">{industry.description}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 6.4: Add sections to index.astro**

Update `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
import Hero from '../components/Sections/Hero.astro';
import Performance from '../components/Sections/Performance.astro';
import Industries from '../components/Sections/Industries.astro';
---

<Base title="Technology Consulting">
  <Navbar />
  <main>
    <Hero />
    <Performance />
    <Industries />
  </main>
</Base>
```

- [ ] **Step 6.5: Type check**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 6.6: Visual test**

```bash
bun run dev
```

Verify: Stats section renders with indigo background. Industry cards show in grid. Scroll animations trigger on scroll.

- [ ] **Step 6.7: Commit**

```bash
git add -A
git commit -m "feat: add Performance stats section and Industries grid with scroll animations"
```

---

### Task 7: Case Studies + Insights carousels

**Files:**
- Create: `src/components/Sliders/CaseStudiesCarousel.astro`
- Create: `src/components/Sliders/CaseStudiesCarousel.client.ts`
- Create: `src/components/Sections/CaseStudies.astro`
- Create: `src/components/Sliders/InsightsCarousel.astro`
- Create: `src/components/Sliders/InsightsCarousel.client.ts`
- Create: `src/components/Sections/Insights.astro`

- [ ] **Step 7.1: Create src/components/Sliders/CaseStudiesCarousel.client.ts**

```ts
import EmblaCarousel from 'embla-carousel';

export function initCaseStudiesCarousel(rootNode: HTMLElement) {
  const embla = EmblaCarousel(rootNode, {
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  });

  let autoplayTimer: ReturnType<typeof setInterval>;
  const startAutoplay = () => { autoplayTimer = setInterval(() => embla.scrollNext(), 5000); };
  const stopAutoplay = () => clearInterval(autoplayTimer);

  rootNode.addEventListener('mouseenter', stopAutoplay);
  rootNode.addEventListener('mouseleave', startAutoplay);

  const prevBtn = document.getElementById('cs-prev');
  const nextBtn = document.getElementById('cs-next');
  prevBtn?.addEventListener('click', () => { stopAutoplay(); embla.scrollPrev(); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { stopAutoplay(); embla.scrollNext(); startAutoplay(); });

  startAutoplay();
  return embla;
}
```

- [ ] **Step 7.2: Create src/components/Sliders/CaseStudiesCarousel.astro**

```astro
---
const caseStudies = [
  {
    title: 'AI-Powered Risk Platform',
    client: 'Global FinTech',
    industry: 'Fintech',
    excerpt: 'Built a real-time ML risk scoring engine processing 50M transactions/day with <10ms latency.',
    href: '/case-studies/ai-ml-platform',
    tag: 'AI/ML',
  },
  {
    title: 'Zero-Downtime Cloud Migration',
    client: 'Enterprise Retailer',
    industry: 'E-Commerce',
    excerpt: 'Migrated a monolithic e-commerce platform to microservices with zero downtime and 60% cost reduction.',
    href: '/case-studies/cloud-migration',
    tag: 'Cloud',
  },
  {
    title: 'Digital Health Platform',
    client: 'Healthcare Network',
    industry: 'Healthcare',
    excerpt: 'Launched a HIPAA-compliant patient portal serving 2M users with 99.99% uptime.',
    href: '/case-studies/digital-transformation',
    tag: 'Healthcare',
  },
  {
    title: 'Developer Experience Overhaul',
    client: 'SaaS Startup',
    industry: 'SaaS',
    excerpt: 'Reduced CI/CD pipeline from 45 minutes to 4 minutes; increased deployment frequency 10x.',
    href: '/case-studies/cloud-migration',
    tag: 'DevOps',
  },
];
---

<div class="relative">
  <div class="overflow-hidden" id="cs-embla-viewport">
    <div class="flex gap-6 touch-pan-y" style="margin-left: calc(var(--slide-spacing, 0px) * -1)">
      {caseStudies.map(cs => (
        <div class="flex-none w-[85%] sm:w-[45%] lg:w-[31%]">
          <a
            href={cs.href}
            class="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full group"
          >
            <!-- Placeholder gradient image area -->
            <div class="h-48 bg-gradient-to-br from-indigo-100 to-slate-100 relative">
              <span class="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                {cs.tag}
              </span>
            </div>
            <div class="p-6">
              <div class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">{cs.client} · {cs.industry}</div>
              <h3 class="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{cs.title}</h3>
              <p class="text-slate-600 text-sm leading-relaxed mb-4">{cs.excerpt}</p>
              <span class="text-indigo-600 text-sm font-semibold group-hover:underline">Read case study →</span>
            </div>
          </a>
        </div>
      ))}
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex items-center justify-end gap-3 mt-8">
    <button
      id="cs-prev"
      class="p-3 rounded-full border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      aria-label="Previous case study"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      id="cs-next"
      class="p-3 rounded-full border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      aria-label="Next case study"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>

<script>
  import { initCaseStudiesCarousel } from './CaseStudiesCarousel.client';
  const root = document.getElementById('cs-embla-viewport') as HTMLElement;
  if (root) initCaseStudiesCarousel(root);
</script>
```

- [ ] **Step 7.3: Create src/components/Sections/CaseStudies.astro**

```astro
---
import CaseStudiesCarousel from '../Sliders/CaseStudiesCarousel.astro';
import ScrollReveal from '../Animations/ScrollReveal.astro';
import Button from '../UI/Button.astro';
---

<section class="py-20 bg-white" aria-label="Case studies">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal>
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
        <div>
          <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Case Studies</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            Work We're Proud Of
          </h2>
        </div>
        <Button href="/case-studies" variant="outline" size="sm">
          View All
        </Button>
      </div>
    </ScrollReveal>

    <CaseStudiesCarousel />
  </div>
</section>
```

- [ ] **Step 7.4: Create src/components/Sliders/InsightsCarousel.client.ts**

```ts
import EmblaCarousel from 'embla-carousel';

export function initInsightsCarousel(rootNode: HTMLElement) {
  const embla = EmblaCarousel(rootNode, {
    loop: true,
    align: 'start',
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  });

  let autoplayTimer: ReturnType<typeof setInterval>;
  const startAutoplay = () => { autoplayTimer = setInterval(() => embla.scrollNext(), 4000); };
  const stopAutoplay = () => clearInterval(autoplayTimer);

  rootNode.addEventListener('mouseenter', stopAutoplay);
  rootNode.addEventListener('mouseleave', startAutoplay);

  const prevBtn = document.getElementById('insights-prev');
  const nextBtn = document.getElementById('insights-next');
  prevBtn?.addEventListener('click', () => { stopAutoplay(); embla.scrollPrev(); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { stopAutoplay(); embla.scrollNext(); startAutoplay(); });

  startAutoplay();
  return embla;
}
```

- [ ] **Step 7.5: Create src/components/Sliders/InsightsCarousel.astro**

```astro
---
const articles = [
  {
    title: 'The Future of AI in Enterprise Software',
    excerpt: 'How large language models are reshaping how enterprises build internal tools and customer experiences.',
    category: 'Artificial Intelligence',
    readTime: '8 min read',
    date: 'Apr 15, 2026',
    href: '/insights/future-of-ai',
  },
  {
    title: 'Cloud-Native Patterns for 2026',
    excerpt: 'Platform engineering, eBPF, and WebAssembly — the infrastructure patterns every team should know.',
    category: 'Cloud Engineering',
    readTime: '6 min read',
    date: 'Apr 10, 2026',
    href: '/insights/cloud-native-patterns',
  },
  {
    title: 'Engineering Culture That Scales',
    excerpt: 'What separates engineering organizations that stay productive at 500 engineers from those that stall at 50.',
    category: 'Engineering Culture',
    readTime: '10 min read',
    date: 'Apr 5, 2026',
    href: '/insights/engineering-culture',
  },
  {
    title: 'Designing for Observability',
    excerpt: 'Building distributed systems with OpenTelemetry, structured logs, and distributed tracing from day one.',
    category: 'DevOps',
    readTime: '7 min read',
    date: 'Mar 30, 2026',
    href: '/insights/cloud-native-patterns',
  },
];
---

<div class="relative">
  <div class="overflow-hidden" id="insights-embla-viewport">
    <div class="flex gap-6 touch-pan-y">
      {articles.map(article => (
        <div class="flex-none w-[85%] sm:w-[45%] lg:w-[31%]">
          <a
            href={article.href}
            class="block h-full border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
            <div class="h-40 bg-gradient-to-br from-slate-100 to-indigo-50" />
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                  {article.category}
                </span>
              </div>
              <h3 class="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                {article.title}
              </h3>
              <p class="text-slate-500 text-sm leading-relaxed mb-4">{article.excerpt}</p>
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  </div>

  <div class="flex items-center justify-end gap-3 mt-8">
    <button
      id="insights-prev"
      class="p-3 rounded-full border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      aria-label="Previous insight"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      id="insights-next"
      class="p-3 rounded-full border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      aria-label="Next insight"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</div>

<script>
  import { initInsightsCarousel } from './InsightsCarousel.client';
  const root = document.getElementById('insights-embla-viewport') as HTMLElement;
  if (root) initInsightsCarousel(root);
</script>
```

- [ ] **Step 7.6: Create src/components/Sections/Insights.astro**

```astro
---
import InsightsCarousel from '../Sliders/InsightsCarousel.astro';
import ScrollReveal from '../Animations/ScrollReveal.astro';
import Button from '../UI/Button.astro';
---

<section class="py-20 bg-slate-50" aria-label="Insights and blog">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ScrollReveal>
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
        <div>
          <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Insights</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            Thinking From the Field
          </h2>
        </div>
        <Button href="/insights" variant="outline" size="sm">
          All Articles
        </Button>
      </div>
    </ScrollReveal>

    <InsightsCarousel />
  </div>
</section>
```

- [ ] **Step 7.7: Update index.astro with all home page sections**

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
import Hero from '../components/Sections/Hero.astro';
import Performance from '../components/Sections/Performance.astro';
import Industries from '../components/Sections/Industries.astro';
import CaseStudies from '../components/Sections/CaseStudies.astro';
import Insights from '../components/Sections/Insights.astro';
---

<Base title="Technology Consulting">
  <Navbar />
  <main>
    <Hero />
    <Performance />
    <Industries />
    <CaseStudies />
    <Insights />
  </main>
</Base>
```

- [ ] **Step 7.8: Type check + build**

```bash
bunx astro check && bun run build
```

Expected: 0 errors, successful build.

- [ ] **Step 7.9: Visual test carousels**

```bash
bun run dev
```

Verify: Case studies carousel scrolls. Insights carousel scrolls. Both auto-advance and pause on hover. Mobile swipe works.

- [ ] **Step 7.10: Commit**

```bash
git add -A
git commit -m "feat: add Case Studies and Insights carousels with auto-advance and pause-on-hover"
```

---

## Phase 6: Content Collections + Dynamic Pages

### Task 8: Content Collections schema + sample content

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/case-studies/ai-ml-platform.md`
- Create: `src/content/case-studies/cloud-migration.md`
- Create: `src/content/case-studies/digital-transformation.md`
- Create: `src/content/insights/future-of-ai.md`
- Create: `src/content/insights/cloud-native-patterns.md`
- Create: `src/content/insights/engineering-culture.md`

- [ ] **Step 8.1: Create src/content/config.ts**

```ts
import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
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
  type: 'content',
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
```

- [ ] **Step 8.2: Create src/content/case-studies/ai-ml-platform.md**

```md
---
title: AI-Powered Risk Platform
client: Global FinTech
industry: Fintech
tag: AI/ML
excerpt: Built a real-time ML risk scoring engine processing 50M transactions/day with sub-10ms latency.
date: "2026-02-15"
outcomes:
  - 50M transactions processed per day
  - <10ms average scoring latency
  - 42% reduction in fraudulent transactions
  - $12M annual savings in fraud losses
tech:
  - Python
  - PyTorch
  - Kubernetes
  - Apache Kafka
  - PostgreSQL
---

## Challenge

Our client, a leading fintech platform serving 8 million users across Latin America, faced a growing fraud problem. Their rule-based risk engine was generating false positives that blocked 12% of legitimate transactions, costing them millions in lost revenue and damaging user trust.

## What We Built

We designed and built a real-time ML risk scoring platform that evaluates every transaction in under 10ms using a gradient-boosted ensemble model trained on 18 months of behavioral data.

The system processes transaction events via Apache Kafka, runs inference in a low-latency Python service backed by TorchServe, and writes decisions to PostgreSQL with a full audit trail.

## Outcome

- Fraudulent transactions down 42% in the first 90 days
- False positive rate dropped from 12% to 1.8%
- System now processes 50M transactions per day at peak
- $12M projected annual savings in prevented fraud losses
```

- [ ] **Step 8.3: Create src/content/case-studies/cloud-migration.md**

```md
---
title: Zero-Downtime Cloud Migration
client: Enterprise Retailer
industry: E-Commerce
tag: Cloud
excerpt: Migrated a monolithic e-commerce platform to microservices with zero downtime and 60% infrastructure cost reduction.
date: "2026-01-10"
outcomes:
  - Zero downtime during migration
  - 60% reduction in infrastructure costs
  - 10x increase in deployment frequency
  - 99.99% uptime SLA achieved
tech:
  - AWS ECS
  - Terraform
  - Node.js
  - PostgreSQL
  - Redis
  - Datadog
---

## Challenge

A $500M enterprise retailer was running its entire e-commerce platform on a 10-year-old monolith deployed to physical servers. Scaling for peak events like Black Friday required weeks of manual provisioning. Deployments took 4 hours and caused 30-minute downtime windows.

## What We Built

We designed a phased migration strategy using the strangler fig pattern — incrementally extracting services from the monolith while keeping the existing system live. Each extracted service was deployed to AWS ECS with Terraform-managed infrastructure and full Datadog observability.

## Outcome

- Zero downtime across the entire 9-month migration
- Infrastructure costs dropped 60% through right-sizing and reserved instances
- Deployments went from 4 hours + downtime to 12 minutes with zero downtime
- Team now ships to production 10x more frequently
```

- [ ] **Step 8.4: Create src/content/case-studies/digital-transformation.md**

```md
---
title: Digital Health Platform
client: Regional Healthcare Network
industry: Healthcare
tag: Healthcare
excerpt: Launched a HIPAA-compliant patient portal serving 2 million users with 99.99% uptime.
date: "2025-11-20"
outcomes:
  - 2M active users at launch
  - 99.99% uptime in first year
  - HIPAA and SOC2 Type II certified
  - NPS score of 72
tech:
  - React
  - Node.js
  - AWS
  - PostgreSQL
  - HL7 FHIR
  - Terraform
---

## Challenge

A regional healthcare network with 45 hospitals needed a unified patient portal that could handle medical record access, appointment scheduling, and telehealth — all while meeting strict HIPAA compliance requirements.

## What We Built

We built a FHIR-compliant patient portal using React on the frontend and a Node.js API layer that integrates with existing EHR systems via HL7 FHIR R4. The platform runs on AWS with full encryption at rest and in transit, BAA agreements in place, and a SOC2 Type II audit trail.

## Outcome

- 2 million patients onboarded at launch
- 99.99% uptime maintained in the first year
- HIPAA and SOC2 Type II certification achieved
- Patient satisfaction NPS of 72 — well above industry average
```

- [ ] **Step 8.5: Create src/content/insights/future-of-ai.md**

```md
---
title: The Future of AI in Enterprise Software
category: Artificial Intelligence
excerpt: How large language models are reshaping how enterprises build internal tools and customer experiences.
date: "2026-04-15"
readTime: 8 min read
author:
  name: Sofia Reyes
  role: Head of AI Practice
---

The era of AI as a bolt-on feature is over. The teams winning in 2026 are those treating AI as a first-class architectural concern — not a plugin.

## What's Changed

Twelve months ago, most enterprise AI projects were experiments: a chatbot here, a summarization feature there. Today, we're seeing something different. The most competitive teams are building AI into the core of their product — not just the surface.

## The Shift to Compound AI

Single-model pipelines are giving way to compound systems: multiple models, tools, retrieval layers, and human checkpoints working together. An AI that can *search*, *reason*, *write code*, and *verify its own output* is categorically different from one that just responds to a prompt.

## What This Means for Architecture

Engineering teams need to think differently about state, latency, cost, and observability when AI is in the critical path. The mental models from traditional software don't fully transfer.

The teams doing this best share a few traits: they instrument everything, they treat model behavior like an external dependency, and they design for graceful degradation.
```

- [ ] **Step 8.6: Create src/content/insights/cloud-native-patterns.md**

```md
---
title: Cloud-Native Patterns for 2026
category: Cloud Engineering
excerpt: Platform engineering, eBPF, and WebAssembly — the infrastructure patterns every team should know.
date: "2026-04-10"
readTime: 6 min read
author:
  name: Marcus Chen
  role: Principal Cloud Architect
---

Platform engineering isn't a trend — it's the acknowledgment that developer experience is a product. In 2026, the infrastructure teams winning are those treating their internal platform like a product with customers.

## Platform Engineering Maturity

Level 1: Script collection. Level 2: Internal tooling. Level 3: Self-service platform with golden paths. Most teams are at Level 1-2. The jump to Level 3 requires investment, but the payoff in developer velocity is enormous.

## eBPF in Production

Extended Berkeley Packet Filter has crossed the chasm from networking curiosity to production infrastructure. Cilium, Pixie, and Tetragon are making eBPF-powered observability and security accessible to application teams without kernel expertise.

## WebAssembly Beyond the Browser

Wasm is quietly becoming the runtime of choice for edge compute and plugin systems. If you're building an extensible platform, Wasm sandboxing gives you isolation at near-native performance.
```

- [ ] **Step 8.7: Create src/content/insights/engineering-culture.md**

```md
---
title: Engineering Culture That Scales
category: Engineering Culture
excerpt: What separates engineering organizations that stay productive at 500 engineers from those that stall at 50.
date: "2026-04-05"
readTime: 10 min read
author:
  name: Amara Okonkwo
  role: VP of Engineering
---

Most engineering organizations hit a wall somewhere between 40 and 80 engineers. Velocity that felt effortless at 20 people becomes painful coordination overhead. The teams that push through this wall share a common thread: they treat culture as infrastructure.

## The Trust-Autonomy Equation

High-trust organizations give teams autonomy. Low-trust organizations create process to compensate for missing trust. The problem: process doesn't fix trust deficits, it institutionalizes them.

## What "Good" Looks Like at Scale

At 500 engineers, the teams shipping the most have a few things in common: small-batch deployments, strong on-call culture, clear ownership, and a bias toward reversible decisions.

## The Measurement Trap

DORA metrics are useful leading indicators, not lagging outcomes. Teams that optimize for deployment frequency without improving system reliability are gaming the metric. The point is to create feedback loops, not optimize numbers.
```

- [ ] **Step 8.8: Type check**

```bash
bunx astro check
```

Expected: 0 errors.

- [ ] **Step 8.9: Commit**

```bash
git add -A
git commit -m "feat: add Content Collections schema and sample case studies + insights content"
```

---

### Task 9: Dynamic detail pages

**Files:**
- Create: `src/pages/insights/[...slug].astro`
- Create: `src/pages/case-studies/[...slug].astro`

- [ ] **Step 9.1: Create src/pages/insights/[...slug].astro**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Navbar from '../../components/Navigation/Navbar.astro';
import Badge from '../../components/UI/Badge.astro';

export async function getStaticPaths() {
  const posts = await getCollection('insights');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Base title={post.data.title} description={post.data.excerpt}>
  <Navbar />
  <main class="pt-24 pb-20">
    <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <header class="mb-12">
        <Badge variant="accent" class="mb-4">{post.data.category}</Badge>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
          {post.data.title}
        </h1>
        <div class="flex items-center gap-4 text-slate-500 text-sm border-t border-b border-slate-200 py-4">
          <div>
            <span class="font-semibold text-slate-700">{post.data.author.name}</span>
            <span class="mx-2">·</span>
            <span>{post.data.author.role}</span>
          </div>
          <span class="ml-auto">{post.data.date}</span>
          <span>{post.data.readTime}</span>
        </div>
      </header>

      <div class="prose prose-slate prose-lg max-w-none">
        <Content />
      </div>
    </article>
  </main>
</Base>
```

- [ ] **Step 9.2: Create src/pages/case-studies/[...slug].astro**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Navbar from '../../components/Navigation/Navbar.astro';
import Badge from '../../components/UI/Badge.astro';

export async function getStaticPaths() {
  const studies = await getCollection('case-studies');
  return studies.map(study => ({
    params: { slug: study.slug },
    props: { study },
  }));
}

const { study } = Astro.props;
const { Content } = await study.render();
---

<Base title={study.data.title} description={study.data.excerpt}>
  <Navbar />
  <main class="pt-24 pb-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <header class="mb-12">
        <div class="flex items-center gap-3 mb-4">
          <Badge variant="accent">{study.data.tag}</Badge>
          <span class="text-slate-400 text-sm">{study.data.industry}</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
          {study.data.title}
        </h1>
        <p class="text-xl text-slate-600">{study.data.excerpt}</p>
      </header>

      <!-- Outcomes + Tech sidebar layout -->
      <div class="grid lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <div class="prose prose-slate prose-lg max-w-none">
            <Content />
          </div>
        </div>

        <aside class="space-y-8">
          <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Key Outcomes</h3>
            <ul class="space-y-2">
              {study.data.outcomes.map(outcome => (
                <li class="flex items-start gap-2 text-sm text-slate-700">
                  <span class="text-emerald-500 mt-0.5">✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Tech Stack</h3>
            <div class="flex flex-wrap gap-2">
              {study.data.tech.map(tech => (
                <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div class="bg-indigo-600 rounded-xl p-6 text-white">
            <h3 class="font-bold mb-2">Ready to see similar results?</h3>
            <p class="text-indigo-200 text-sm mb-4">Talk to our team about your next project.</p>
            <a
              href="/contact"
              class="inline-flex items-center px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg text-sm hover:bg-indigo-50 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </aside>
      </div>
    </div>
  </main>
</Base>
```

- [ ] **Step 9.3: Type check + build**

```bash
bunx astro check && bun run build
```

Expected: Static pages generated for all 6 content items.

- [ ] **Step 9.4: Test dynamic pages in dev**

```bash
bun run dev
```

Navigate to: localhost:4321/insights/future-of-ai and localhost:4321/case-studies/ai-ml-platform
Expected: Pages render with correct content, author info, tech stack sidebar.

- [ ] **Step 9.5: Commit**

```bash
git add -A
git commit -m "feat: add dynamic insight and case study detail pages via Content Collections"
```

---

## Phase 7: Additional Pages + Footer

### Task 10: Index pages + remaining pages

**Files:**
- Create: `src/pages/insights/index.astro`
- Create: `src/pages/case-studies/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/services.astro`
- Create: `src/pages/careers.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/404.astro`
- Create: `src/components/Navigation/Footer.astro`

- [ ] **Step 10.1: Create src/components/Navigation/Footer.astro**

```astro
---
import { navLinks } from '../../data/navigation';
import { SITE_NAME } from '../../utils/constants';

const currentYear = new Date().getFullYear();
---

<footer class="bg-slate-900 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <!-- Brand -->
      <div class="md:col-span-2">
        <div class="font-bold text-xl mb-4">
          <span class="text-indigo-400">M</span>eridian Labs
        </div>
        <p class="text-slate-400 text-sm leading-relaxed max-w-xs">
          We help enterprises build better software, faster. From strategy to shipping.
        </p>
      </div>

      <!-- Navigation -->
      <div>
        <h3 class="font-semibold text-slate-300 text-sm uppercase tracking-wider mb-4">Company</h3>
        <ul class="space-y-3 list-none m-0 p-0">
          {navLinks.map(link => (
            <li>
              <a href={link.href} class="text-slate-400 hover:text-white text-sm transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="font-semibold text-slate-300 text-sm uppercase tracking-wider mb-4">Get In Touch</h3>
        <div class="space-y-3">
          <a href="/contact" class="block text-slate-400 hover:text-white text-sm transition-colors">hello@meridian-labs.com</a>
          <a href="/careers" class="block text-slate-400 hover:text-white text-sm transition-colors">Careers</a>
        </div>
      </div>
    </div>

    <div class="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-slate-500 text-sm">© {currentYear} {SITE_NAME}. All rights reserved.</p>
      <div class="flex gap-6">
        <a href="/privacy" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy</a>
        <a href="/terms" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 10.2: Update Base.astro to include Footer**

Add `import Footer from '../components/Navigation/Footer.astro';` to the frontmatter of `src/layouts/Base.astro`, then update the `<body>` to:

```astro
<body>
  <slot />
  <Footer />
</body>
```

- [ ] **Step 10.3: Create src/pages/insights/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Navbar from '../../components/Navigation/Navbar.astro';
import Badge from '../../components/UI/Badge.astro';
import ScrollReveal from '../../components/Animations/ScrollReveal.astro';

const posts = (await getCollection('insights')).sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---

<Base title="Insights" description="Technology insights and engineering perspectives from the Meridian Labs team.">
  <Navbar />
  <main class="pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div class="text-center mb-16">
          <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Insights</span>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 mt-2 mb-4">Thinking From the Field</h1>
          <p class="text-slate-600 text-lg max-w-2xl mx-auto">Perspectives on technology, engineering, and building products that last.</p>
        </div>
      </ScrollReveal>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <ScrollReveal delay={(i % 3 * 100) as 0 | 100 | 200}>
            <a
              href={`/insights/${post.slug}`}
              class="block h-full border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div class="h-40 bg-gradient-to-br from-slate-100 to-indigo-50" />
              <div class="p-6">
                <Badge variant="accent" class="mb-3">{post.data.category}</Badge>
                <h2 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                  {post.data.title}
                </h2>
                <p class="text-slate-500 text-sm leading-relaxed mb-4">{post.data.excerpt}</p>
                <div class="flex items-center justify-between text-xs text-slate-400">
                  <span>{post.data.author.name}</span>
                  <span>{post.data.readTime}</span>
                </div>
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </main>
</Base>
```

- [ ] **Step 10.4: Create src/pages/case-studies/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Navbar from '../../components/Navigation/Navbar.astro';
import Badge from '../../components/UI/Badge.astro';
import ScrollReveal from '../../components/Animations/ScrollReveal.astro';

const studies = (await getCollection('case-studies')).sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---

<Base title="Case Studies" description="Real results from real projects. See how Meridian Labs has helped companies build better software.">
  <Navbar />
  <main class="pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div class="text-center mb-16">
          <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Case Studies</span>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 mt-2 mb-4">Work We're Proud Of</h1>
          <p class="text-slate-600 text-lg max-w-2xl mx-auto">A sample of the enterprise projects we've shipped in the last two years.</p>
        </div>
      </ScrollReveal>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {studies.map((study, i) => (
          <ScrollReveal delay={(i % 3 * 100) as 0 | 100 | 200}>
            <a
              href={`/case-studies/${study.slug}`}
              class="block h-full border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div class="h-48 bg-gradient-to-br from-indigo-100 to-slate-100 relative">
                <span class="absolute top-4 left-4">
                  <Badge variant="accent">{study.data.tag}</Badge>
                </span>
              </div>
              <div class="p-6">
                <div class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">{study.data.client} · {study.data.industry}</div>
                <h2 class="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{study.data.title}</h2>
                <p class="text-slate-600 text-sm leading-relaxed">{study.data.excerpt}</p>
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </main>
</Base>
```

- [ ] **Step 10.5: Create src/pages/about.astro**

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
import ScrollReveal from '../components/Animations/ScrollReveal.astro';
import Button from '../components/UI/Button.astro';

const values = [
  { name: 'Ownership', description: 'We treat every project like it\'s our own product. No handoffs to nowhere.' },
  { name: 'Craft', description: 'We care about the quality of what we build — not just whether it ships.' },
  { name: 'Transparency', description: 'No surprises. Clients always know where things stand, especially when it\'s complicated.' },
  { name: 'Speed', description: 'We move fast without creating debt. Working software over perfect documentation.' },
];
---

<Base title="About Us" description="Learn about Meridian Labs — who we are, what we believe, and how we work.">
  <Navbar />
  <main class="pt-24 pb-20">
    <!-- Mission -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ScrollReveal>
        <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 mt-4 mb-6 leading-tight">
          We're Engineers Who<br />Started a Company
        </h1>
        <p class="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Meridian Labs was founded by engineers who got tired of consulting firms that over-promised and under-delivered. We built the firm we wanted to work with.
        </p>
      </ScrollReveal>
    </section>

    <!-- Values -->
    <section class="bg-slate-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 class="text-3xl font-bold text-slate-900 text-center mb-16">How We Work</h2>
        </ScrollReveal>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <ScrollReveal delay={(i * 100) as 0 | 100 | 200 | 300}>
              <div class="text-center">
                <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div class="w-6 h-6 bg-indigo-600 rounded" />
                </div>
                <h3 class="font-bold text-slate-900 mb-2">{value.name}</h3>
                <p class="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <ScrollReveal>
        <h2 class="text-3xl font-bold text-slate-900 mb-4">Want to Work Together?</h2>
        <p class="text-slate-600 text-lg mb-8">Tell us about your project and we'll get back to you within one business day.</p>
        <Button href="/contact" variant="primary" size="lg">Get in Touch</Button>
      </ScrollReveal>
    </section>
  </main>
</Base>
```

- [ ] **Step 10.6: Create src/pages/services.astro**

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
import ScrollReveal from '../components/Animations/ScrollReveal.astro';
import Button from '../components/UI/Button.astro';

const services = [
  {
    name: 'Product Engineering',
    description: 'We embed senior engineers directly into your team to build and ship products — not just write code.',
    capabilities: ['Full-stack development', 'Mobile (iOS/Android)', 'API design', 'Database architecture'],
  },
  {
    name: 'AI & Machine Learning',
    description: 'From LLM integrations to custom ML models — we help you build AI-native products, not AI experiments.',
    capabilities: ['LLM integration & fine-tuning', 'ML pipeline design', 'Vector search & RAG', 'AI product strategy'],
  },
  {
    name: 'Cloud & Platform Engineering',
    description: 'Modern infrastructure built for reliability, cost efficiency, and developer productivity.',
    capabilities: ['Cloud migration (AWS/GCP/Azure)', 'Kubernetes & containers', 'IaC with Terraform', 'Observability & SRE'],
  },
  {
    name: 'Staff Augmentation',
    description: 'Extend your team with senior engineers who hit the ground running — no ramp-up tax.',
    capabilities: ['Individual contributors', 'Dedicated engineering pods', 'Tech lead placement', 'Interim CTO/VP Eng'],
  },
];
---

<Base title="Services" description="Technology consulting, product engineering, AI/ML, cloud, and staff augmentation.">
  <Navbar />
  <main class="pt-24 pb-20">
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ScrollReveal>
        <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Services</span>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 mt-4 mb-6">What We Do</h1>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          We work across the full technology stack — from strategy to shipping — wherever you need us most.
        </p>
      </ScrollReveal>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div class="grid lg:grid-cols-2 gap-8">
        {services.map((service, i) => (
          <ScrollReveal delay={(i % 2 * 100) as 0 | 100}>
            <div class="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-md transition-shadow">
              <h2 class="text-xl font-bold text-slate-900 mb-3">{service.name}</h2>
              <p class="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
              <ul class="space-y-2">
                {service.capabilities.map(cap => (
                  <li class="flex items-center gap-2 text-sm text-slate-700">
                    <span class="h-1.5 w-1.5 rounded-full bg-indigo-600 flex-none" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal class="mt-16 text-center">
        <Button href="/contact" variant="primary" size="lg">Start a Conversation</Button>
      </ScrollReveal>
    </div>
  </main>
</Base>
```

- [ ] **Step 10.7: Create src/pages/contact.astro**

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
import ScrollReveal from '../components/Animations/ScrollReveal.astro';
import { CONTACT_EMAIL } from '../utils/constants';
---

<Base title="Contact" description="Talk to the Meridian Labs team about your next project.">
  <Navbar />
  <main class="pt-24 pb-20">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div class="text-center mb-16">
          <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Contact</span>
          <h1 class="text-4xl font-bold text-slate-900 mt-2 mb-4">Let's Talk</h1>
          <p class="text-slate-600 text-lg">Tell us about your project. We respond within one business day.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <form
          class="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm"
          action="/api/contact"
          method="POST"
        >
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2" for="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2" for="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="jane@company.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2" for="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2" for="service">What do you need help with?</label>
            <select
              id="service"
              name="service"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              <option value="">Select a service...</option>
              <option value="product-engineering">Product Engineering</option>
              <option value="ai-ml">AI & Machine Learning</option>
              <option value="cloud">Cloud & Platform Engineering</option>
              <option value="staff-aug">Staff Augmentation</option>
              <option value="other">Other / Not sure yet</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2" for="message">Tell us more</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
              placeholder="What are you building? What's the timeline? What's been tried already?"
            />
          </div>

          <button
            type="submit"
            class="w-full py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Send Message
          </button>
        </form>

        <p class="text-center text-slate-500 text-sm mt-6">
          Or email us directly at <a href={`mailto:${CONTACT_EMAIL}`} class="text-indigo-600 hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </ScrollReveal>
    </div>
  </main>
</Base>
```

- [ ] **Step 10.8: Create src/pages/careers.astro**

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
import ScrollReveal from '../components/Animations/ScrollReveal.astro';
import Button from '../components/UI/Button.astro';

const openRoles = [
  { title: 'Senior Full-Stack Engineer', type: 'Full-time', location: 'Remote', team: 'Product Engineering' },
  { title: 'Staff ML Engineer', type: 'Full-time', location: 'Remote', team: 'AI/ML' },
  { title: 'Senior Cloud/Platform Engineer', type: 'Full-time', location: 'Remote', team: 'Cloud' },
  { title: 'Engineering Manager', type: 'Full-time', location: 'Remote', team: 'Leadership' },
];
---

<Base title="Careers" description="Join the Meridian Labs team. Senior-level roles in product engineering, AI/ML, and cloud.">
  <Navbar />
  <main class="pt-24 pb-20">
    <!-- Header -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ScrollReveal>
        <span class="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Careers</span>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 mt-4 mb-6">Work That Matters</h1>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          We hire senior engineers and build teams that ship. Remote-first, async-friendly, high-trust.
        </p>
      </ScrollReveal>
    </section>

    <!-- Open roles -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <ScrollReveal>
        <h2 class="text-2xl font-bold text-slate-900 mb-8">Open Roles</h2>
      </ScrollReveal>

      <div class="space-y-4">
        {openRoles.map((role, i) => (
          <ScrollReveal delay={(i % 4 * 100) as 0 | 100 | 200 | 300}>
            <div class="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-shadow">
              <div>
                <h3 class="font-bold text-slate-900 mb-1">{role.title}</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{role.team}</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{role.type}</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">{role.location}</span>
                </div>
              </div>
              <Button href="/contact" variant="outline" size="sm">
                Apply
              </Button>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal class="mt-12 text-center">
        <p class="text-slate-600 mb-4">Don't see your role? We're always interested in exceptional people.</p>
        <Button href="/contact" variant="ghost" size="md">Send us your resume</Button>
      </ScrollReveal>
    </div>
  </main>
</Base>
```

- [ ] **Step 10.9: Create src/pages/404.astro**

```astro
---
import Base from '../layouts/Base.astro';
import Navbar from '../components/Navigation/Navbar.astro';
import Button from '../components/UI/Button.astro';
---

<Base title="Page Not Found" noindex>
  <Navbar />
  <main class="pt-24 min-h-[80vh] flex items-center">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
      <div class="text-8xl font-bold text-slate-100 mb-4">404</div>
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Page not found</h1>
      <p class="text-slate-600 text-lg mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button href="/" variant="primary" size="lg">Go Home</Button>
    </div>
  </main>
</Base>
```

- [ ] **Step 10.10: Type check + full build**

```bash
bunx astro check && bun run build
```

Expected: 0 TypeScript errors, all pages generated successfully.

- [ ] **Step 10.11: Visual walkthrough in dev**

```bash
bun run dev
```

Walk through every page:
- `/` — home: hero carousel, stats, industries, case studies, insights, footer
- `/about` — values grid, CTA
- `/services` — 4 service cards
- `/case-studies` — card grid
- `/case-studies/ai-ml-platform` — detail with sidebar
- `/insights` — card grid
- `/insights/future-of-ai` — article
- `/contact` — contact form
- `/careers` — role listings
- `/404` — custom error page (navigate to `/nonexistent`)

- [ ] **Step 10.12: Commit**

```bash
git add -A
git commit -m "feat: add all remaining pages (about, services, careers, contact, 404, insights index, case studies index) with Footer"
```

---

## Phase 8: SEO Polish + Organization Schema

### Task 11: JSON-LD structured data

**Files:**
- Modify: `src/layouts/Base.astro`
- Modify: `src/utils/seo.ts`

- [ ] **Step 11.1: Add Organization JSON-LD to Base.astro**

In `src/layouts/Base.astro`, add inside `<head>`:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Meridian Labs",
  "url": "https://meridian-labs.com",
  "logo": "https://meridian-labs.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@meridian-labs.com",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://linkedin.com/company/meridian-labs",
    "https://github.com/meridian-labs"
  ]
})} />
```

- [ ] **Step 11.2: Add Article JSON-LD to insights/[...slug].astro**

Before `</head>` (inside `<Base>` — use a slot or add directly in the page using `<head>` slot):

Add `slot="head"` to Base.astro and in insights/[...slug].astro:

In `Base.astro` inside `<head>`:
```astro
<slot name="head" />
```

In `insights/[...slug].astro`, add:
```astro
<Base ...>
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.data.title,
      "description": post.data.excerpt,
      "datePublished": post.data.date,
      "author": {
        "@type": "Person",
        "name": post.data.author.name
      },
      "publisher": {
        "@type": "Organization",
        "name": "Meridian Labs"
      }
    })} />
  </Fragment>
  <!-- rest of page content -->
</Base>
```

- [ ] **Step 11.3: Build and inspect HTML output for JSON-LD**

```bash
bun run build && grep -l "application/ld+json" dist/**/*.html | head -5
```

Expected: Multiple files contain JSON-LD markup.

- [ ] **Step 11.4: Commit**

```bash
git add -A
git commit -m "feat: add Organization and Article JSON-LD structured data for SEO"
```

---

## Verification Checklist

Before marking implementation complete, verify:

- [ ] `bunx astro check` — 0 TypeScript errors
- [ ] `bun run build` — successful build, no warnings
- [ ] All 12+ pages render in browser
- [ ] Hero carousel: auto-advance, arrows, dots, keyboard, pause on hover
- [ ] Case Studies carousel: auto-advance, arrows, touch swipe
- [ ] Insights carousel: auto-advance, arrows
- [ ] Navbar: sticky, scroll background change, mobile menu
- [ ] Footer: renders on all pages
- [ ] Scroll reveal animations trigger on scroll
- [ ] All internal links work
- [ ] Dynamic pages (insights/case-studies) render from content
- [ ] JSON-LD in page source

---

## Dependencies Reference

```bash
# Install all at once
bun add @astrojs/tailwind @astrojs/sitemap embla-carousel
bun add -D tailwindcss @tailwindcss/vite prettier prettier-plugin-astro
```

## Commands Reference

```bash
bun run dev        # Dev server at localhost:4321
bun run build      # Production build to ./dist
bun run preview    # Preview production build
bunx astro check   # TypeScript type check
```
