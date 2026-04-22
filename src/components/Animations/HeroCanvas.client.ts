import { gsap, reducedMotion } from '../../lib/gsap.client';

interface Dot {
  x: number;
  y: number;
  alpha: number;
}

export function initHeroCanvas(canvas: HTMLCanvasElement): () => void {
  if (reducedMotion) return () => {};

  const ctx = canvas.getContext('2d')!;
  const spacing = 24;
  let dots: Dot[] = [];
  let rafId: number;
  let hidden = false;

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
    if (!hidden) {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(44, 183, 232, ${dot.alpha})`;
        ctx.fill();
      });
    }
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

  const onVisibility = () => { hidden = document.hidden; };
  document.addEventListener('visibilitychange', onVisibility);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // requestIdleCallback is not in TypeScript's default DOM lib — use setTimeout(0)
  // which is equivalent here (defers canvas init past the first paint).
  setTimeout(() => {
    resize();
    draw();
  }, 0);

  return () => {
    cancelAnimationFrame(rafId);
    gsap.killTweensOf(dots);
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
