import { gsap, reducedMotion, ScrollTrigger } from '../../lib/gsap.client';

export function initCountUp(section: HTMLElement): () => void {
  const triggers: ScrollTrigger[] = [];

  // Heading reveal
  const heading = section.querySelector<HTMLElement>('[data-perf-heading]');
  if (heading) {
    if (reducedMotion) {
      heading.style.opacity = '1';
      heading.style.transform = 'none';
    } else {
      triggers.push(
        ScrollTrigger.create({
          trigger: heading,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(heading, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
          },
        })
      );
    }
  }

  // Stat cards stagger + bar draw-in + count-up
  const statCards = Array.from(section.querySelectorAll<HTMLElement>('[data-perf-stat]'));

  if (reducedMotion) {
    statCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'none';
      const bar = card.querySelector<HTMLElement>('[data-perf-bar]');
      if (bar) bar.style.transform = 'scaleX(1)';
      const counter = card.querySelector<HTMLElement>('[data-count-to]');
      if (counter) {
        const to = parseFloat(counter.dataset.countTo ?? '0');
        const dec = parseInt(counter.dataset.countDecimals ?? '0', 10);
        const pre = counter.dataset.countPrefix ?? '';
        const suf = counter.dataset.countSuffix ?? '';
        counter.textContent = pre + to.toFixed(dec) + suf;
      }
    });
    return () => {};
  }

  triggers.push(
    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        statCards.forEach((card, i) => {
          const delay = i * 0.18;

          // Card fade-up
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay,
            ease: 'power3.out',
          });

          // Cyan bar draw-in
          const bar = card.querySelector<HTMLElement>('[data-perf-bar]');
          if (bar) {
            gsap.to(bar, {
              scaleX: 1,
              duration: 0.7,
              delay: delay + 0.1,
              ease: 'power3.out',
            });
          }

          // Count-up
          const counter = card.querySelector<HTMLElement>('[data-count-to]');
          if (!counter) return;

          const to = parseFloat(counter.dataset.countTo ?? '0');
          if (Number.isNaN(to)) return;

          const dec = parseInt(counter.dataset.countDecimals ?? '0', 10);
          const pre = counter.dataset.countPrefix ?? '';
          const suf = counter.dataset.countSuffix ?? '';

          // Lock the counter box size to its SSR-rendered dimensions (= final value).
          // Without this, each textContent change causes the element to reflow
          // (different char count → different line wrapping → height change → content below jumps).
          const h = counter.offsetHeight;
          const w = counter.offsetWidth;
          if (h) counter.style.minHeight = h + 'px';
          if (w) counter.style.width = w + 'px';
          // overflow:hidden clips anything that momentarily exceeds the locked width
          counter.style.overflow = 'hidden';

          const obj = { val: 0 };
          gsap.to(obj, {
            val: to,
            duration: 2.2,
            delay: delay + 0.25,
            ease: 'power2.out',
            onUpdate: () => {
              counter.textContent = pre + obj.val.toFixed(dec) + suf;
            },
            onComplete: () => {
              counter.textContent = pre + to.toFixed(dec) + suf;
              // Release the locks once the final value is shown
              counter.style.minHeight = '';
              counter.style.width = '';
              counter.style.overflow = '';
            },
          });
        });
      },
    })
  );

  return () => triggers.forEach(t => t.kill());
}
