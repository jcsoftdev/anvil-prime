import EmblaCarousel from 'embla-carousel';

export interface HeroSlide {
  headline: string;
  subheadline: string;
  cta: { label: string; href: string };
  tag: string;
  bgColor: string;
}

export const heroSlides: HeroSlide[] = [
  {
    headline: 'Build Software That Scales',
    subheadline:
      'We partner with enterprise teams to architect, build, and ship technology products that drive real business outcomes.',
    cta: { label: 'See Our Work', href: '/case-studies' },
    tag: 'Technology Consulting',
    bgColor: 'from-slate-900 to-indigo-950',
  },
  {
    headline: 'AI-Native Product Development',
    subheadline:
      'From LLM integrations to custom ML models — we help you embed intelligence into your core product experience.',
    cta: { label: 'Explore AI Services', href: '/services' },
    tag: 'Artificial Intelligence',
    bgColor: 'from-indigo-950 to-violet-950',
  },
  {
    headline: 'Cloud Transformation at Scale',
    subheadline:
      'Migrate, modernize, and optimize your infrastructure with zero downtime and full observability from day one.',
    cta: { label: 'Learn More', href: '/services' },
    tag: 'Cloud Engineering',
    bgColor: 'from-slate-900 to-cyan-950',
  },
  {
    headline: 'Engineering Teams That Deliver',
    subheadline:
      'Embed seasoned engineers directly into your product teams — from staff augmentation to full dedicated pods.',
    cta: { label: 'Work With Us', href: '/contact' },
    tag: 'Staff Augmentation',
    bgColor: 'from-slate-950 to-slate-900',
  },
];

export function initHeroCarousel(rootNode: HTMLElement) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const embla = EmblaCarousel(rootNode, {
    loop: true,
    duration: 30,
    skipSnaps: false,
  });

  const dots = document.querySelectorAll<HTMLElement>('[data-hero-dot]');
  const slides = document.querySelectorAll<HTMLElement>('[data-hero-slide]');
  let autoplayTimer: ReturnType<typeof setInterval>;

  const updateDots = (index: number) => {
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-white', i === index);
      dot.classList.toggle('w-8', i === index);
      dot.classList.toggle('bg-white/40', i !== index);
      dot.classList.toggle('w-2', i !== index);
    });
  };

  const animateSlide = (index: number) => {
    slides.forEach((slide, i) => {
      const content = slide.querySelector<HTMLElement>('[data-slide-content]');
      if (!content) return;
      if (i === index) {
        if (prefersReduced) return;
        content.style.opacity = '0';
        content.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';
        }));
      }
    });
  };

  const startAutoplay = () => {
    autoplayTimer = setInterval(() => embla.scrollNext(), 6000);
  };

  const stopAutoplay = () => clearInterval(autoplayTimer);

  embla.on('select', () => {
    const index = embla.selectedScrollSnap();
    updateDots(index);
    animateSlide(index);
  });

  const carousel = document.getElementById('hero-carousel');
  carousel?.addEventListener('mouseenter', stopAutoplay);
  carousel?.addEventListener('mouseleave', startAutoplay);

  // Arrow buttons
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  prevBtn?.addEventListener('click', () => {
    stopAutoplay();
    embla.scrollPrev();
    startAutoplay();
  });
  nextBtn?.addEventListener('click', () => {
    stopAutoplay();
    embla.scrollNext();
    startAutoplay();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      embla.scrollTo(i);
      startAutoplay();
    });
  });

  // Keyboard nav — only fires when focus is on or inside the carousel
  const handleKeydown = (e: KeyboardEvent) => {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    if (!carousel.contains(document.activeElement) && document.activeElement !== carousel) return;
    if (e.key === 'ArrowLeft') embla.scrollPrev();
    if (e.key === 'ArrowRight') embla.scrollNext();
  };
  document.addEventListener('keydown', handleKeydown);

  embla.on('destroy', () => {
    stopAutoplay();
    document.removeEventListener('keydown', handleKeydown);
  });

  updateDots(0);
  animateSlide(0);
  startAutoplay();

  return embla;
}
