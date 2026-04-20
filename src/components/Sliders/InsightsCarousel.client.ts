import { initCarousel } from './carousel.client';

export function initInsightsCarousel(viewportEl: HTMLElement, wrapperEl: HTMLElement) {
  return initCarousel(viewportEl, wrapperEl, {
    prevId: 'insights-prev',
    nextId: 'insights-next',
    interval: 4000,
  });
}
