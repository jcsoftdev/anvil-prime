import { gsap, reducedMotion } from '../../lib/gsap.client';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

export function initTextScramble(el: HTMLElement): () => void {
  if (reducedMotion) return () => {};

  const original = el.textContent ?? '';
  if (el.childElementCount > 0) return () => {};
  const duration = 0.9; // seconds

  let startTime: number | null = null;

  const tick = (time: number) => {
    if (startTime === null) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    let result = '';
    for (let i = 0; i < original.length; i++) {
      const ch = original[i];
      // Preserve whitespace (incl. \n) so line-count stays constant during scramble.
      // Otherwise the heading collapses into one long line, wraps to 3 lines, then
      // snaps back to 2 — causing layout shift in every element below it.
      if (ch === ' ' || ch === '\n' || ch === '\t') {
        result += ch;
      } else if (i / original.length < progress) {
        result += ch;
      } else {
        result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
    el.textContent = result;

    if (progress >= 1) {
      el.textContent = original;
      gsap.ticker.remove(tick);
    }
  };

  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}
