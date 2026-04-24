import { gsap, reducedMotion } from '../../lib/gsap.client';

const AUTO_MS = 7000;

export function initHeroCarousel(root: HTMLElement): () => void {
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-slide]'));
  const bgs = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-bg]'));
  const bgInners = bgs.map(bg => bg.querySelector<HTMLElement>('[data-hero-bg-inner]'));
  const dotFills = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-dot-fill]'));
  const counter = root.querySelector<HTMLElement>('#hero-counter');
  const prevBtn = root.querySelector<HTMLButtonElement>('#hero-prev');
  const nextBtn = root.querySelector<HTMLButtonElement>('#hero-next');

  const total = slides.length;
  let current = 0;
  let autoTween: gsap.core.Tween | null = null;
  let kbTween: gsap.core.Tween | null = null;
  let isChanging = false;

  const revealElementsOf = (idx: number): HTMLElement[] => {
    const els = Array.from(slides[idx].querySelectorAll<HTMLElement>('[data-reveal]'));
    return els.sort((a, b) => Number(a.dataset.reveal) - Number(b.dataset.reveal));
  };

  const setRevealInitial = (idx: number) => {
    if (reducedMotion) return;
    const els = revealElementsOf(idx);
    gsap.set(els, { opacity: 0, y: 24, force3D: true });
    els.forEach(el => { el.style.willChange = 'opacity, transform'; });
    const rule = slides[idx].querySelector<HTMLElement>('[data-kpi-rule]');
    if (rule) gsap.set(rule, { width: '0%' });
    const words = Array.from(slides[idx].querySelectorAll<HTMLElement>('.hero-word'));
    if (words.length) gsap.set(words, { opacity: 0, y: 14, force3D: true });
  };

  const playReveal = (idx: number, delay = 0) => {
    if (reducedMotion) {
      const els = revealElementsOf(idx);
      els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      const rule = slides[idx].querySelector<HTMLElement>('[data-kpi-rule]');
      if (rule) rule.style.width = '62%';
      const words = Array.from(slides[idx].querySelectorAll<HTMLElement>('.hero-word'));
      words.forEach(w => { w.style.opacity = '1'; w.style.transform = 'none'; });
      return;
    }
    const els = revealElementsOf(idx);
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      delay,
      stagger: 0.1,
      ease: 'power3.out',
      force3D: true,
      onComplete: () => {
        els.forEach(el => { el.style.willChange = 'auto'; });
      },
    });
    const rule = slides[idx].querySelector<HTMLElement>('[data-kpi-rule]');
    if (rule) {
      gsap.to(rule, {
        width: '62%',
        duration: 1.0,
        delay: delay + 0.3,
        ease: 'power3.out',
      });
    }
    // Word-by-word stagger on the heading — pure opacity + y, no DOM mutation,
    // so no reflow and no flicker.
    const words = Array.from(slides[idx].querySelectorAll<HTMLElement>('.hero-word'));
    if (words.length) {
      gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.055,
        delay: delay + 0.3,
        ease: 'power3.out',
        force3D: true,
      });
    }
  };

  const startKenBurns = (idx: number) => {
    if (reducedMotion) return;
    const inner = bgInners[idx];
    if (!inner) return;
    if (kbTween) kbTween.kill();
    gsap.set(inner, { scale: 1.0, xPercent: 0, yPercent: 0 });
    kbTween = gsap.to(inner, {
      scale: 1.12,
      xPercent: -2.2,
      yPercent: -1.4,
      duration: 12,
      ease: 'none',
    });
  };

  const startProgress = () => {
    if (reducedMotion) return;
    const fill = dotFills[current];
    if (!fill) return;
    gsap.killTweensOf(fill);
    gsap.set(fill, { scaleX: 0 });
    autoTween = gsap.to(fill, {
      scaleX: 1,
      duration: AUTO_MS / 1000,
      ease: 'none',
      onComplete: () => { if (!isChanging) next(); },
    });
  };

  const stopProgress = () => {
    if (autoTween) { autoTween.kill(); autoTween = null; }
  };

  const resetAllFills = () => {
    dotFills.forEach((fill, i) => {
      if (i !== current) gsap.set(fill, { scaleX: 0 });
    });
  };

  const goTo = (idx: number) => {
    if (isChanging || idx === current) return;
    isChanging = true;
    stopProgress();

    const prev = current;
    current = (idx + total) % total;

    // Fade progress fill of previous dot back to 0 for next time
    if (dotFills[prev]) gsap.to(dotFills[prev], { scaleX: 0, duration: 0.4, ease: 'power2.out' });

    // Reset target slide's reveal elements BEFORE swapping display
    // so the slide never flashes at opacity 1 on re-entry.
    setRevealInitial(current);

    // Crossfade backgrounds
    if (bgs[prev]) bgs[prev].style.opacity = '0';
    if (bgs[current]) bgs[current].style.opacity = '1';

    // Swap slide visibility
    slides[prev].style.display = 'none';
    slides[current].style.display = '';

    // Counter text
    if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

    // Animate entry — text reveal overlaps with bg crossfade (0.2s internal delay)
    startKenBurns(current);
    playReveal(current, 0.2);
    isChanging = false;
    startProgress();
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  prevBtn?.addEventListener('click', () => { prev(); });
  nextBtn?.addEventListener('click', () => { next(); });

  dotFills.forEach((_, i) => {
    const btn = dotFills[i].parentElement as HTMLButtonElement | null;
    btn?.addEventListener('click', () => { goTo(i); });
  });

  // Pause auto-advance on hover
  root.addEventListener('mouseenter', stopProgress);
  root.addEventListener('mouseleave', () => {
    if (!isChanging) startProgress();
  });

  // Keyboard nav (only when hero has focus)
  const onKeydown = (e: KeyboardEvent) => {
    if (!root.contains(document.activeElement) && document.activeElement !== root) return;
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };
  document.addEventListener('keydown', onKeydown);

  // Init state — first slide starts immediately, others stay hidden until activated
  resetAllFills();
  // Pre-hide ALL slides' reveal elements while they're still in initial state.
  // Double-RAF ensures the opacity:0 state is painted before the reveal tween
  // starts — otherwise set() and to() can collapse into the same frame and the
  // user never sees the hidden state (i.e. "no animation").
  slides.forEach((_, i) => setRevealInitial(i));
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      playReveal(0);
      startKenBurns(0);
      startProgress();
    });
  });

  return () => {
    stopProgress();
    if (kbTween) kbTween.kill();
    root.removeEventListener('mouseenter', stopProgress);
    document.removeEventListener('keydown', onKeydown);
  };
}
