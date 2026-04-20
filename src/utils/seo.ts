import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from './constants';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  ogType?: 'website' | 'article';
}

export function buildSEO(props: SEOProps = {}) {
  const title = props.title ? `${props.title} | ${SITE_NAME}` : SITE_NAME;
  const description = props.description ?? SITE_DESCRIPTION;
  const image = props.image ?? `${SITE_URL}/og-default.png`;
  const canonical = props.canonical ?? SITE_URL;

  return {
    title,
    description,
    image,
    canonical,
    noindex: props.noindex ?? false,
    ogType: props.ogType ?? 'website',
  };
}
