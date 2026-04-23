import { gsap, reducedMotion } from '../../lib/gsap.client';

export function initMagneticButtons(): () => void {
  if (reducedMotion) return () => {};
  if (navigator.maxTouchPoints > 0) return () => {};

  const buttons = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
  if (!buttons.length) return () => {};

  const ac = new AbortController();
  const { signal } = ac;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, {
        x: dx * 0.35,
        y: dy * 0.35,
        duration: 0.3,
        ease: 'power2.out',
      });
    }, { signal });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    }, { signal });
  });

  return () => ac.abort();
}
