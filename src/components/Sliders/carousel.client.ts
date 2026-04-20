import EmblaCarousel from 'embla-carousel';

export interface CarouselOptions {
  prevId: string;
  nextId: string;
  interval: number;
}

export function initCarousel(
  viewportEl: HTMLElement,
  wrapperEl: HTMLElement,
  opts: CarouselOptions
) {
  const embla = EmblaCarousel(viewportEl, {
    loop: true,
    align: 'start',
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer: ReturnType<typeof setInterval>;

  const start = () => {
    if (prefersReduced) return;
    timer = setInterval(() => embla.scrollNext(), opts.interval);
  };
  const stop = () => clearInterval(timer);

  wrapperEl.addEventListener('mouseenter', stop);
  wrapperEl.addEventListener('mouseleave', start);

  document.getElementById(opts.prevId)?.addEventListener('click', () => { stop(); embla.scrollPrev(); start(); });
  document.getElementById(opts.nextId)?.addEventListener('click', () => { stop(); embla.scrollNext(); start(); });

  embla.on('destroy', stop);
  start();
  return embla;
}
