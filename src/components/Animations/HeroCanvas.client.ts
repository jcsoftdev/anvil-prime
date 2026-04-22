import { gsap, reducedMotion } from '../../lib/gsap.client';

interface Dot {
  x: number;
  y: number;
  alpha: number;
}

export function initHeroCanvas(canvas: HTMLCanvasElement): () => void {
  if (reducedMotion) return () => {};

  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const spacing = 24;
  let dots: Dot[] = [];
  let rafId = 0;
  let resizeTimer = 0;

  const buildDots = () => {
    gsap.killTweensOf(dots);
    dots = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let x = spacing / 2; x < w; x += spacing) {
      for (let y = spacing / 2; y < h; y += spacing) {
        dots.push({ x, y, alpha: 0.1 });
      }
    }
    animateDots();
  };

  const animateDots = () => {
    const cx = canvas.offsetWidth / 2;
    const cy = canvas.offsetHeight / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    dots.forEach(dot => {
      const dist = Math.sqrt((dot.x - cx) ** 2 + (dot.y - cy) ** 2);
      const delay = (dist / maxDist) * 2;
      gsap.to(dot, {
        alpha: 0.55,
        duration: 2,
        delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(44, 183, 232, ${dot.alpha})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  };

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    buildDots();
  };

  // Cancel RAF on hide, resume on show — no wasted ticks in background tabs
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  // Debounce resize to avoid rebuilding thousands of tweens on every drag frame
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 150);
  });
  ro.observe(canvas);

  setTimeout(() => {
    resize();
    rafId = requestAnimationFrame(draw);
  }, 0);

  return () => {
    cancelAnimationFrame(rafId);
    clearTimeout(resizeTimer);
    gsap.killTweensOf(dots);
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
