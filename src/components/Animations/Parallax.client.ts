import { gsap, reducedMotion, ScrollTrigger } from '../../lib/gsap.client';

export function initHeroParallax(carousel: HTMLElement): ScrollTrigger | undefined {
  if (reducedMotion) return;
  if (window.innerWidth < 768) return;

  const images = carousel.querySelectorAll<HTMLImageElement>('[data-hero-slide] img');
  const contents = carousel.querySelectorAll<HTMLElement>('[data-slide-content]');
  if (!images.length || !contents.length) return;

  return ScrollTrigger.create({
    trigger: carousel,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const yImages = self.progress * window.innerHeight * 0.4;
      const yContent = self.progress * window.innerHeight * 0.15;
      gsap.set(images, { y: yImages });
      gsap.set(contents, { y: yContent });
    },
  });
}
