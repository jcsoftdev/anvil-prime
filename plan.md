MERIDIAN LABS WEBSITE REPLICA - UPDATED TECH STACK & IMPLEMENTATION PLAN
Latest Technologies (2026 Edition)

UPDATED TECHNOLOGY STACK - LATEST VERSIONS
Core Framework

Astro 5.x (Latest) - Zero-JS by default, fastest static site framework, built-in optimizations
Node 20.x LTS - Latest stable version with ES2024 support
pnpm 9.x - Faster package manager with better disk space efficiency

Animation & Interaction Layer (Updated)
TechnologyLatest VersionPurposeWhy CurrentMotion (formerly Framer Motion)11.xGesture animations, micro-interactionsNow with Motion+ ecosystem, vanilla JS supportGSAP 3.12.xScrollTrigger 3.12.xAdvanced scroll animations, parallaxIndustry gold standard, GPU-acceleratedAstro View Transitions APIBuilt-in v5+Native page transitionsZero extra dependenciesWeb Animations APINativeBrowser-native animations98% browser support, no library neededIntersection Observer APINativeScroll trigger detectionModern, performant, native
Carousel/Slider Solutions (Latest)
TechnologyLatest VersionBest ForBundle SizeWhy ChooseEmbla Carousel8.xHero sliders, testimonials7kbZero dependencies, perfect TypeScript supportSwiper12.xProduct showcases, galleries35kbMost mature, 100k+ stars, Vue/React compatibleKeen-Slider6.xPerformance-critical carousels8kbUltra-lightweight, great momentum scrollingLit Carousel1.xWeb components carousel5kbFuture-proof, framework-agnostic
Styling & Components (Latest)

Tailwind CSS 4.x - Zero-config setup, new CSS features support, drastically faster
CSS Subgrid - Native CSS Grid enhancement (96% support)
Container Queries - Component-responsive design (94% support)
PostCSS 8.x - CSS processing pipeline
Open Props - CSS variable system (alternative to styled-components)

SEO & Content (Latest)

Astro Content Collections - Type-safe Markdown/MDX with TypeScript
astro:assets - Automatic image optimization (WebP, AVIF)
@astrojs/sitemap v4.x - Auto-generated sitemaps
@astrojs/rss v4.x - RSS feed generation
schema-dts - TypeScript-first schema.org markup

Development Tools (Latest)

TypeScript 5.x - Latest type system with const type params
Vite 6.x - Lightning-fast build tool (Astro uses this)
ESLint 9.x - New flat config system
Prettier 3.x - Code formatting
Playwright 1.45.x - E2E testing

Performance & Monitoring

Vercel Analytics - Web Vitals monitoring (built-in to Astro)
Sentry 8.x - Error tracking with performance monitoring
WebVitals.js - CWV tracking in real-time
sharp 0.33.x - Image optimization library (used by Astro)

Deployment & Hosting (Latest)

Vercel - Zero-config Astro deployment with Edge Functions
Netlify 2.x - Alternative, with Edge Functions support
Cloudflare Pages - Global CDN with Workers support
GitHub Actions - CI/CD pipeline for automated testing/deployment


MODERN ANIMATION TECHNIQUES FOR 2026
Latest Animation Approaches
1. CSS-First Animations (Recommended)

Native CSS Animations (no library overhead)
CSS Transitions with transition-property, transition-timing-function
CSS Keyframes with animation-timeline: view() (new in 2024)
Container Queries for responsive animations

2. JavaScript Animation Engines

GSAP 3.12+ - For complex scroll-linked animations (ScrollTrigger)
Motion 11+ - For gesture-driven interactions (vanilla JS version)
Web Animations API - Native browser API, zero dependencies
RequestAnimationFrame - Low-level, performant 60fps animations

3. View Transitions API (Built into Astro 5)

Automatic page transition animations
Shared element transitions between pages
No extra library needed
Perfect for SPA-like experiences in static sites


REVISED PROJECT STRUCTURE (2026 Standards)
meridian-labs/
├── src/
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Blog.astro
│   ├── components/
│   │   ├── Navigation/
│   │   │   ├── Navbar.astro
│   │   │   ├── MobileMenu.astro
│   │   │   └── Navbar.styles.css
│   │   ├── Sliders/
│   │   │   ├── HeroCarousel.astro
│   │   │   ├── HeroCarousel.client.ts (Island)
│   │   │   ├── EmblaCarousel.astro
│   │   │   ├── EmblaCarousel.client.ts (Island)
│   │   │   └── carousel-config.ts
│   │   ├── Sections/
│   │   │   ├── Hero.astro
│   │   │   ├── Performance.astro
│   │   │   ├── Industries.astro
│   │   │   ├── CaseStudies.astro
│   │   │   └── Insights.astro
│   │   ├── Animations/
│   │   │   ├── ScrollReveal.astro
│   │   │   ├── ScrollReveal.client.ts (Island)
│   │   │   ├── ParallaxScroll.client.ts (Island)
│   │   │   └── animation-variants.ts
│   │   └── UI/
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       └── Badge.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── insights/
│   │   │   └── [...slug].astro
│   │   ├── case-studies/
│   │   │   └── [...slug].astro
│   │   ├── careers.astro
│   │   ├── contact.astro
│   │   └── 404.astro
│   ├── content/
│   │   ├── config.ts (Collections schema)
│   │   ├── case-studies/
│   │   └── insights/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── animations.css (CSS keyframes)
│   │   ├── variables.css (CSS custom properties)
│   │   └── container-queries.css
│   ├── utils/
│   │   ├── seo.ts
│   │   ├── animation-observers.ts
│   │   ├── carousel-options.ts
│   │   └── constants.ts
│   └── data/
│       ├── navigation.ts
│       ├── team.ts
│       └── testimonials.ts
├── public/
│   ├── images/ (will be optimized by astro:assets)
│   ├── videos/
│   └── fonts/
├── astro.config.mjs
├── tailwind.config.cjs (v4 format)
├── tsconfig.json (v5.x)
├── prettier.config.cjs
├── eslint.config.mjs (new flat config)
└── package.json

PHASE 1: SETUP & FOUNDATION (Week 1-2)
1.1 Project Initialization
Latest Setup Commands:
- Astro 5.x with TypeScript
- Tailwind CSS 4.x (auto-configured)
- React for interactive islands (optional, only for carousels)
- View Transitions API enabled
- Image optimization enabled
- Sitemap generation enabled
1.2 Configuration Files

astro.config.mjs - Enable integrations (sitemap, image, view-transitions)
tsconfig.json - v5.x strict mode enabled
tailwind.config.cjs - v4 with custom theme
eslint.config.mjs - New flat config (replace .eslintrc)
prettier.config.cjs - Consistent formatting

1.3 Tech Stack Decisions

Carousel Library: Embla Carousel 8.x (primary) + Keen-Slider 6.x (backup for mobile)
Animations: GSAP 3.12.x + Motion 11.x + CSS animations (hybrid approach)
Build Output: Static HTML + minimal client-side JS (island architecture)
Data Sources: Content Collections for blog/case studies, JSON for dynamic data


PHASE 2: CORE COMPONENTS (Week 3-4)
2.1 Navigation Components

Sticky navbar with scroll detection
Mobile hamburger menu with animation
Notification banner with close animation
Breadcrumbs with structured data

2.2 Hero Carousel

Library: Embla Carousel 8.x
Features:

4-6 slides rotating auto every 6 seconds
Smooth fade transitions (800ms)
Text stagger animations (titles → body → CTA)
Touch/swipe support on mobile
Keyboard navigation (arrow keys)
Pause on hover



2.3 Industry/Workflow Grid Carousel

Horizontal scrolling grid (5+ columns desktop, 2 tablet, 1 mobile)
Momentum scrolling with snap points
Auto-scroll with pagination indicators
Category expansion on click

2.4 Case Studies Carousel

3-column layout with Embla Carousel
Card with image, title, excerpt
Navigation buttons + numbered pagination
Auto-advance every 5 seconds

2.5 Insights/Blog Carousel

Featured articles in carousel format
Automatic cycling through recent posts
Link to full article views
Schema.org Article markup


PHASE 3: ANIMATION STRATEGY (Week 5-6)
3.1 Scroll-Triggered Animations (Native API)

IntersectionObserver API for detecting scroll position
CSS Animation Timeline (view() function) for fade-in effects
GSAP ScrollTrigger for complex parallax/timeline animations
Motion 11.x for gesture-based interactions

3.2 Animation Categories
Section Reveals:

Fade-in + slide-up (0.6-0.8s)
Stagger delay (50-100ms between elements)
Start at 20% opacity, slide 30px down

Card Hover States:

Scale 1.02 + shadow increase (200ms)
Color shift on CTAs
Underline animation on links

Carousel Transitions:

Slide animation (300-500ms)
Fade in new slide content
Smooth pagination dot transitions

Loading States:

Skeleton screens with shimmer animation
Gradual content reveal
Progress indicators for forms

3.3 Performance Optimization

Use CSS transform: translateY() and opacity only
Avoid animating width, height, top, left
Enable will-change for animated elements
Lazy-load GSAP ScrollTrigger only when needed
Reduce animations on prefers-reduced-motion media query


PHASE 4: SEO & STRUCTURED DATA (Week 7)
4.1 SEO Configuration

Meta descriptions (155-160 chars) per page
Open Graph + Twitter Card tags
Canonical URLs
Robots meta tags
Hreflang for internationalization (if needed)

4.2 Structured Data (JSON-LD)

Organization Schema: Company info, contact, social media
LocalBusiness Schema: Office locations with coordinates
Article Schema: Blog posts with author, date, image
BreadcrumbList: Site navigation structure
FAQPage: FAQ sections with Q&A
VideoObject: For hero video content

4.3 Technical SEO

Auto-generated sitemap.xml via @astrojs/sitemap
robots.txt with crawl rules
Mobile-first responsive design
Core Web Vitals target: LCP < 2.5s, CLS < 0.1, FID < 100ms
Image optimization (AVIF + WebP)
CSS/JS minification (automatic)


PHASE 5: SLIDERS & CAROUSELS DETAILED SPECS
5.1 Hero Carousel (Embla 8.x)

Auto-scroll: 6s interval
Transition: fade, 0.8s
Navigation: arrows + dots
Mobile: Full-width, swipe-enabled
Accessibility: ARIA live regions, keyboard nav

5.2 Content Grid (Keen-Slider 6.x Alternative)

Scroll Type: Horizontal momentum scroll
Snap Points: Column-aligned snap
Columns: Responsive (5 → 3 → 1)
Navigation: Smooth continuous scroll
Touch: Mobile-optimized swipe

5.3 Case Studies (Embla 8.x)

Layout: 3-column carousel
Items: Clickable cards (link to detail page)
Navigation: Prev/Next + dot indicators
Auto-advance: 5 seconds with pause on hover
Mobile: Single column, full-width

5.4 Recent Insights (Swiper 12.x)

Layout: Article cards with metadata
Autoplay: 4-second interval
Pagination: Numbered (1/6, 2/6, etc.)
Navigation: Side arrows
Mobile: Stack vertically


PHASE 6: IMPLEMENTATION & TESTING (Week 8-9)
6.1 Development Workflow

Build components in .astro files (zero-JS default)
Create .client.ts files only for interactive carousels
Use Client Islands pattern (Astro feature) for JS-heavy components
Test locally with npm run dev
Build and preview with npm run build && npm run preview

6.2 Performance Testing

Lighthouse audit (target: 95+)
Core Web Vitals via PageSpeed Insights
Bundle size analysis (npm run build --stats)
Mobile performance testing
Cross-browser testing (Chrome, Firefox, Safari, Edge)

6.3 Accessibility Testing

WCAG 2.1 AA compliance
Keyboard navigation (Tab, Enter, Arrow keys)
Screen reader testing
Color contrast ratios (4.5:1 minimum)
Focus visible indicators

6.4 Content Population

Copy Wizeline content or create custom for Meridian
Source high-quality images (2:1 to 1:1 aspect)
Create/curate video content
Generate/write blog posts for Insights section
Gather team photos for About/Team pages


PHASE 7: DEPLOYMENT & MONITORING (Week 10)
7.1 Deployment Options

Recommended: Vercel (Astro-optimized, edge functions)
Alternative 1: Netlify (git-based deployment)
Alternative 2: Cloudflare Pages (global edge network)

7.2 CI/CD Pipeline

Auto-deploy on git push to main
Preview deployments on pull requests
Automated Lighthouse CI checks
Automated E2E tests with Playwright

7.3 Monitoring & Analytics

Google Analytics 4 (traffic, behavior)
Sentry.io (error tracking, performance)
Vercel Analytics (Core Web Vitals)
Custom conversion tracking (form submissions, CTAs)


FINAL TECH STACK SUMMARY (2026)
CORE FRAMEWORK
├─ Astro 5.x (static-first)
├─ TypeScript 5.x
├─ Node 20.x LTS
└─ pnpm 9.x

ANIMATIONS & INTERACTIONS
├─ GSAP 3.12.x (advanced scrolls)
├─ Motion 11.x (gestures)
├─ CSS Animations (scroll-driven, view())
├─ Web Animations API
└─ Intersection Observer (native)

CAROUSELS & SLIDERS
├─ Embla Carousel 8.x (primary)
├─ Keen-Slider 6.x (ultra-light)
├─ Swiper 12.x (featured content)
└─ Astro View Transitions (page nav)

STYLING
├─ Tailwind CSS 4.x
├─ CSS Subgrid
├─ Container Queries
└─ CSS Custom Properties

SEO & CONTENT
├─ Astro Content Collections
├─ astro:assets (image optimization)
├─ @astrojs/sitemap v4.x
├─ Schema.org JSON-LD
└─ Meta tags (OG, Twitter)

DEVELOPMENT
├─ Vite 6.x (build tool)
├─ ESLint 9.x (new flat config)
├─ Prettier 3.x
└─ Playwright 1.45.x (testing)

DEPLOYMENT
├─ Vercel (recommended)
├─ GitHub Actions (CI/CD)
├─ Sentry 8.x (monitoring)
└─ Google Analytics 4