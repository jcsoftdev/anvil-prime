import { gsap, reducedMotion, ScrollTrigger } from '../../lib/gsap.client';

export function initCountUp(section: HTMLElement): () => void {
  if (reducedMotion) return () => {};

  const statEls = section.querySelectorAll<HTMLElement>('[data-count-to]');
  if (!statEls.length) return () => {};

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      statEls.forEach((el, i) => {
        const raw = parseInt(el.dataset.countTo ?? '', 10);
        if (Number.isNaN(raw)) return;
        const suffix = el.dataset.countSuffix ?? '';
        const obj = { val: 0 };

        gsap.to(obj, {
          val: raw,
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
            el.textContent = raw + suffix;
          },
        });
      });
    },
  });

  return () => trigger.kill();
}
