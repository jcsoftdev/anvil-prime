import { gsap, reducedMotion } from '../../lib/gsap.client';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

export function initTextScramble(el: HTMLElement): void {
  if (reducedMotion) return;

  const original = el.textContent ?? '';
  const duration = 0.9; // seconds

  let startTime: number | null = null;

  const tick = (time: number) => {
    if (startTime === null) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    let result = '';
    for (let i = 0; i < original.length; i++) {
      if (original[i] === ' ') {
        result += ' ';
      } else if (i / original.length < progress) {
        result += original[i];
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
}
