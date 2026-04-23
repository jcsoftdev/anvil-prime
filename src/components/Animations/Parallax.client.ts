import { gsap, ScrollTrigger, reducedMotion } from '../../lib/gsap.client';

export function initHeroParallax(carousel: HTMLElement): void {
  if (reducedMotion) return;
  if (window.innerWidth < 768) return; // mobile: skip

  const images = carousel.querySelectorAll<HTMLImageElement>('[data-hero-slide] img');
  const contents = carousel.querySelectorAll<HTMLElement>('[data-slide-content]');

  // All slide images move together at 40% scroll speed (only active slide is visible)
  ScrollTrigger.create({
    trigger: carousel,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const yImages = progress * window.innerHeight * 0.4;
      const yContent = progress * window.innerHeight * 0.15;
      gsap.set(images, { y: yImages });
      gsap.set(contents, { y: yContent });
    },
  });
}
