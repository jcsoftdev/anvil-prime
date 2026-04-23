import { gsap, reducedMotion, ScrollTrigger } from '../../lib/gsap.client';

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
