import { initCarousel } from './carousel.client';

export function initCaseStudiesCarousel(viewportEl: HTMLElement, wrapperEl: HTMLElement) {
  return initCarousel(viewportEl, wrapperEl, {
    prevId: 'cs-prev',
    nextId: 'cs-next',
    interval: 5000,
  });
}
