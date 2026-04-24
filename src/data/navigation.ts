export interface NavChild {
  label: string;
  href: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

export const navLinks: NavLink[] = [
  {
    label: 'What We Do',
    href: '/services',
    children: [
      {
        label: 'Industry AI',
        href: '/services/industry-ai',
        description: 'Transforming industry-specific use cases with Applied AI solutions',
      },
      {
        label: 'Workflows AI',
        href: '/services/workflows-ai',
        description: 'Building agentic systems that unify workflows and multiply performance',
      },
      {
        label: 'SDLC AI',
        href: '/services/sdlc-ai',
        description: 'Accelerating software product engineering with agentic pods across the SDLC',
      },
    ],
  },
  {
    label: 'Industries',
    href: '/industries',
    children: [
      {
        label: 'Media & Entertainment',
        href: '/industries/media-entertainment',
        description: 'Media Supply Chain, Content Monetization, Audience Distribution',
      },
      {
        label: 'Banking, Financial Services & Insurance',
        href: '/industries/banking-financial-services',
        description: 'Neo/Hybrid Banking, Document Intelligence, Financial Workflows',
      },
      {
        label: 'Healthcare & Life Sciences',
        href: '/industries/healthcare-life-sciences',
        description: 'Preventative Health, Diagnostics, Research, Facility Operations',
      },
      {
        label: 'Retail & CPG',
        href: '/industries/retail-cpg',
        description: 'Supply Chain Optimization, Forecasting, Omni-Channel Retail',
      },
    ],
  },
  { label: 'Insights', href: '/insights' },
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
];

export const ctaLink = { label: 'Contact Us', href: '/contact' };
