# Card Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Astro `<Image>`-optimized photos to the Case Studies and Insights carousel card image areas, replacing gradient placeholders.

**Architecture:** Import images in `.astro` frontmatter, correlated by array index with existing card data arrays — identical to the HeroCarousel pattern already working on this site. Replace the gradient placeholder `<div>` in each carousel with a `relative overflow-hidden` wrapper containing an `<Image>` with `object-cover`. No `.client.ts` files touched.

**Tech Stack:** Astro 6.1.8, `astro:assets` Image component, Tailwind CSS 4, Bun (Node 22 via fnm required: `eval "$(fnm env)" && fnm use 22`)

**Spec:** `docs/superpowers/specs/2026-04-20-card-images-design.md`

---

## File Map

| Action | Path |
|--------|------|
| Create | `src/assets/images/cs-fintech.jpg` |
| Create | `src/assets/images/cs-cloud.jpg` |
| Create | `src/assets/images/cs-healthcare.jpg` |
| Create | `src/assets/images/insight-ai-enterprise.jpg` |
| Create | `src/assets/images/insight-cloud-native.jpg` |
| Create | `src/assets/images/insight-engineering-culture.jpg` |
| Modify | `src/components/Sliders/CaseStudiesCarousel.astro` |
| Modify | `src/components/Sliders/InsightsCarousel.astro` |

---

## Task 1: Download 6 card images

**Files:**
- Create: `src/assets/images/` (6 new files)

- [ ] **Step 1: Download all 6 images**

```bash
cd /Users/jcsoftdev/personal/meridian-labs
BASE="https://images.unsplash.com"

curl -L "$BASE/photo-1611974789855-9c2a0a7236a3?w=800&q=80&fm=jpg&fit=crop" -o src/assets/images/cs-fintech.jpg
curl -L "$BASE/photo-1451187580459-43490279c0fa?w=800&q=80&fm=jpg&fit=crop"  -o src/assets/images/cs-cloud.jpg
curl -L "$BASE/photo-1576091160550-2173dba999ef?w=800&q=80&fm=jpg&fit=crop"  -o src/assets/images/cs-healthcare.jpg
curl -L "$BASE/photo-1677442135703-1787eea5ce01?w=800&q=80&fm=jpg&fit=crop"  -o src/assets/images/insight-ai-enterprise.jpg
curl -L "$BASE/photo-1667372393119-3d4c48d07fc9?w=800&q=80&fm=jpg&fit=crop"  -o src/assets/images/insight-cloud-native.jpg
curl -L "$BASE/photo-1557804506-669a67965ba0?w=800&q=80&fm=jpg&fit=crop"     -o src/assets/images/insight-engineering-culture.jpg
```

- [ ] **Step 2: Verify all 6 files are > 50KB**

```bash
ls -lh src/assets/images/cs-*.jpg src/assets/images/insight-*.jpg
```

Expected: 6 files, each > 50KB. If any is tiny (< 10KB) the photo ID returned a 403/404 — replace that file's photo ID with a valid Unsplash photo of the same theme:
- `cs-fintech.jpg` → financial trading screens / data visualization
- `cs-cloud.jpg` → server room / cloud infrastructure
- `cs-healthcare.jpg` → medical technology / health screens
- `insight-ai-enterprise.jpg` → AI visualization / enterprise tech
- `insight-cloud-native.jpg` → Kubernetes / containers / DevOps
- `insight-engineering-culture.jpg` → engineering team / collaboration

- [ ] **Step 3: Commit images**

```bash
git add src/assets/images/cs-fintech.jpg src/assets/images/cs-cloud.jpg src/assets/images/cs-healthcare.jpg src/assets/images/insight-ai-enterprise.jpg src/assets/images/insight-cloud-native.jpg src/assets/images/insight-engineering-culture.jpg
git commit -m "feat: add 6 card images for case studies and insights"
```

---

## Task 2: CaseStudiesCarousel — replace gradient with images

**Files:**
- Modify: `src/components/Sliders/CaseStudiesCarousel.astro`

The current file starts with a frontmatter block (`---`) that contains only the `caseStudies` array (no imports). The card image area is at line 39: `<div class="h-48 bg-gradient-to-br from-accent-light to-slate-100 relative">`.

- [ ] **Step 1: Add imports to frontmatter**

Replace this exact old-string (the two opening lines of the file):

```astro
---
const caseStudies = [
```

With:

```astro
---
import { Image } from 'astro:assets';
import cs0Img from '../../assets/images/cs-fintech.jpg';
import cs1Img from '../../assets/images/cs-cloud.jpg';
import cs2Img from '../../assets/images/cs-healthcare.jpg';

const csImages = [cs0Img, cs1Img, cs2Img];

const caseStudies = [
```

All existing `caseStudies` array entries, the closing `---`, and all template markup remain unchanged.

- [ ] **Step 2: Replace the gradient image area**

Find and replace this exact block (line 39-43 of the current file):

```astro
            <div class="h-48 bg-gradient-to-br from-accent-light to-slate-100 relative">
              <span class="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                {cs.tag}
              </span>
            </div>
```

With:

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
              <span class="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                {cs.tag}
              </span>
            </div>
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/jcsoftdev/personal/meridian-labs
eval "$(fnm env)" && fnm use 22 && bunx astro check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Sliders/CaseStudiesCarousel.astro
git commit -m "feat: add images to case studies carousel cards"
```

---

## Task 3: InsightsCarousel — replace gradient with images

**Files:**
- Modify: `src/components/Sliders/InsightsCarousel.astro`

The current file has a frontmatter block with only the `articles` array. The image placeholder is at line 39: `<div class="h-40 bg-gradient-to-br from-slate-100 to-accent-ghost" aria-hidden="true" />` (self-closing).

- [ ] **Step 1: Add imports to frontmatter**

Replace this exact old-string (the two opening lines of the file):

```astro
---
const articles = [
```

With:

```astro
---
import { Image } from 'astro:assets';
import insight0Img from '../../assets/images/insight-ai-enterprise.jpg';
import insight1Img from '../../assets/images/insight-cloud-native.jpg';
import insight2Img from '../../assets/images/insight-engineering-culture.jpg';

const insightImages = [insight0Img, insight1Img, insight2Img];

const articles = [
```

All existing `articles` array entries, the closing `---`, and all template markup remain unchanged.

- [ ] **Step 2: Replace the gradient placeholder**

Find and replace this exact line (line 39):

```astro
            <div class="h-40 bg-gradient-to-br from-slate-100 to-accent-ghost" aria-hidden="true" />
```

With:

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

- [ ] **Step 3: Verify TypeScript**

```bash
cd /Users/jcsoftdev/personal/meridian-labs
eval "$(fnm env)" && fnm use 22 && bunx astro check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Sliders/InsightsCarousel.astro
git commit -m "feat: add images to insights carousel cards"
```

---

## Task 4: Final build verification

- [ ] **Step 1: Full build**

```bash
cd /Users/jcsoftdev/personal/meridian-labs
eval "$(fnm env)" && fnm use 22 && bunx astro build
```

Expected: exits 0. Astro will generate optimized WebP variants at 400px and 800px for all 6 card images. Check the output includes entries like `/_astro/cs-fintech.*.webp`.

- [ ] **Step 2: Visual check in dev server**

```bash
eval "$(fnm env)" && fnm use 22 && bunx astro dev
```

Visit `http://localhost:4321` and confirm:
- Case Studies section: 3 cards each show a relevant photo in the `h-48` area; tag badge (AI/ML, Cloud, Healthcare) visible on top of each image
- Insights section: 3 cards each show a relevant photo in the `h-40` area
- Card text (title, excerpt, links) unchanged and readable
- Carousel navigation (prev/next arrows) still works on both carousels
