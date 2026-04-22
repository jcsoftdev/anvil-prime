import { gsap, reducedMotion } from '../../lib/gsap.client';

export function initSvgDraw(svg: SVGElement, scrambleDuration = 0.9): () => void {
  if (reducedMotion) {
    // Just show the SVG fully drawn
    gsap.set(svg, { visibility: 'visible' });
    const path = svg.querySelector<SVGPathElement>('path');
    if (path) gsap.set(path, { strokeDashoffset: 0 });
    return () => {};
  }

  // Reveal after scramble finishes + 100ms buffer
  const delay = scrambleDuration + 0.1;

  gsap.set(svg, { visibility: 'visible' });

  const path = svg.querySelector<SVGPathElement>('path');
  if (!path) return () => {};

  const tween = gsap.to(path, {
    strokeDashoffset: 0,
    duration: 1.2,
    delay,
    ease: 'power2.inOut',
  });

  return () => tween.kill();
}
