export interface Industry {
  name: string;
  icon: string;
  description: string;
}

export const industries: Industry[] = [
  { name: 'Fintech', icon: '💳', description: 'Payments, banking, and financial infrastructure' },
  { name: 'Healthcare', icon: '🏥', description: 'Digital health, EHR, and medical devices' },
  { name: 'E-Commerce', icon: '🛍️', description: 'Marketplace platforms and retail technology' },
  { name: 'SaaS', icon: '☁️', description: 'B2B software products and developer tools' },
  { name: 'Logistics', icon: '🚚', description: 'Supply chain, fleet, and fulfillment systems' },
  { name: 'EdTech', icon: '🎓', description: 'Learning platforms and educational products' },
  { name: 'Media', icon: '📱', description: 'Content platforms and streaming technology' },
  { name: 'Government', icon: '🏛️', description: 'Civic tech and public sector modernization' },
];
