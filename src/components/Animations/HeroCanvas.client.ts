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
  let logicalW = 0;
  let logicalH = 0;

  const buildDots = () => {
    cancelAnimationFrame(rafId);
    dots.forEach(dot => gsap.killTweensOf(dot));
    dots = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let x = spacing / 2; x < w; x += spacing) {
      for (let y = spacing / 2; y < h; y += spacing) {
        dots.push({ x, y, alpha: 0.1 });
      }
    }
    animateDots();
    rafId = requestAnimationFrame(draw);
  };

  const animateDots = () => {
    const cx = logicalW / 2;
    const cy = logicalH / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    dots.forEach(dot => {
      const dist = Math.sqrt((dot.x - cx) ** 2 + (dot.y - cy) ** 2);
      const delay = (dist / maxDist) * 2.4;
      gsap.to(dot, {
        alpha: 0.22,
        duration: 2.4,
        delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, logicalW, logicalH);
    ctx.fillStyle = 'rgb(44, 183, 232)';
    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 0.9, 0, Math.PI * 2);
      ctx.globalAlpha = dot.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  };

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    logicalW = w;
    logicalH = h;
    // Assigning canvas.width/height resets the transform matrix — scale is not cumulative here
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
  }, 0);

  return () => {
    cancelAnimationFrame(rafId);
    clearTimeout(resizeTimer);
    dots.forEach(dot => gsap.killTweensOf(dot));
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
