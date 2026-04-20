import EmblaCarousel from 'embla-carousel';

export function initInsightsCarousel(viewportEl: HTMLElement, wrapperEl: HTMLElement) {
  const embla = EmblaCarousel(viewportEl, {
    loop: true,
    align: 'start',
  });

  let autoplayTimer: ReturnType<typeof setInterval>;
  const startAutoplay = () => { autoplayTimer = setInterval(() => embla.scrollNext(), 4000); };
  const stopAutoplay = () => clearInterval(autoplayTimer);

  wrapperEl.addEventListener('mouseenter', stopAutoplay);
  wrapperEl.addEventListener('mouseleave', startAutoplay);

  const prevBtn = document.getElementById('insights-prev');
  const nextBtn = document.getElementById('insights-next');
  prevBtn?.addEventListener('click', () => { stopAutoplay(); embla.scrollPrev(); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { stopAutoplay(); embla.scrollNext(); startAutoplay(); });

  embla.on('destroy', stopAutoplay);

  startAutoplay();
  return embla;
}
