import { gsap, reducedMotion, ScrollTrigger } from '../../lib/gsap.client';

export function initHeroParallax(carousel: HTMLElement): ScrollTrigger | undefined {
  if (reducedMotion) return;
  if (window.innerWidth < 768) return;

  const images = carousel.querySelectorAll<HTMLImageElement>('[data-hero-slide] img');
  const contents = carousel.querySelectorAll<HTMLElement>('[data-slide-content]');
  const kpis = carousel.querySelectorAll<HTMLElement>('[data-kpi]');

  // Require at least content or KPIs to animate
  if (!contents.length && !kpis.length) return;

  return ScrollTrigger.create({
    trigger: carousel,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      if (images.length) {
        gsap.set(Array.from(images), { y: self.progress * window.innerHeight * 0.4 });
      }
      if (contents.length) {
        gsap.set(Array.from(contents), { y: self.progress * window.innerHeight * 0.15 });
      }
      if (kpis.length) {
        gsap.set(Array.from(kpis), { y: self.progress * window.innerHeight * 0.25 });
      }
    },
  });
}
