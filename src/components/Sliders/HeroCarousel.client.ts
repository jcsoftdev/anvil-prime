// No Embla import needed

export function initHeroCarousel(root: HTMLElement): () => void {
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-dot]'));
  const counter = root.querySelector<HTMLElement>('#hero-counter');
  const prevBtn = root.querySelector<HTMLButtonElement>('#hero-prev');
  const nextBtn = root.querySelector<HTMLButtonElement>('#hero-next');

  let current = 0;
  let autoTimer = 0;

  const total = slides.length;

  const goTo = (idx: number) => {
    // Hide current
    slides[current].style.display = 'none';
    dots[current].style.width = '10px';
    dots[current].style.background = 'rgba(255,255,255,0.3)';

    current = (idx + total) % total;

    // Show next
    slides[current].style.display = '';
    dots[current].style.width = '28px';
    dots[current].style.background = '#2cb7e8';

    if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAuto = () => {
    stopAuto();
    autoTimer = window.setInterval(next, 6000);
  };
  const stopAuto = () => window.clearInterval(autoTimer);

  prevBtn?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  nextBtn?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);

  // Keyboard nav
  const onKeydown = (e: KeyboardEvent) => {
    if (!root.contains(document.activeElement) && document.activeElement !== root) return;
    if (e.key === 'ArrowLeft') { stopAuto(); prev(); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); next(); startAuto(); }
  };
  document.addEventListener('keydown', onKeydown);

  startAuto();

  return () => {
    stopAuto();
    root.removeEventListener('mouseenter', stopAuto);
    root.removeEventListener('mouseleave', startAuto);
    document.removeEventListener('keydown', onKeydown);
  };
}
