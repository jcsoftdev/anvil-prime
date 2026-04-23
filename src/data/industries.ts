export interface Industry {
  num: string;
  name: string;
  description: string;
  stat: string;
  statLabel: string;
}

export const industries: Industry[] = [
  {
    num: '01',
    name: 'Financial Services',
    description: 'Capital markets, retail banking, payments, insurance. $1.8T in assets under management on our platforms.',
    stat: '14',
    statLabel: 'top-50 banks',
  },
  {
    num: '02',
    name: 'Healthcare & Life Sciences',
    description: 'Payers, providers, biotech, devices. AI-assisted diagnostics and claims at population scale.',
    stat: '220M',
    statLabel: 'patient records',
  },
  {
    num: '03',
    name: 'Energy & Industrial',
    description: 'Grid, manufacturing, logistics, supply chain. Edge compute and predictive operations across four continents.',
    stat: '4.2K',
    statLabel: 'substations live',
  },
  {
    num: '04',
    name: 'Public Sector',
    description: 'Federal, state, defense. FedRAMP High, IL-5, and classified-capable infrastructure for mission teams.',
    stat: '87',
    statLabel: 'agency engagements',
  },
  {
    num: '05',
    name: 'Technology & Media',
    description: 'Platform scaling, content pipelines, developer experience. Where the product is the business.',
    stat: '2.1B',
    statLabel: 'monthly users served',
  },
  {
    num: '06',
    name: 'Retail & Consumer',
    description: 'Omnichannel, supply chain resilience, loyalty systems, AI personalization that actually converts.',
    stat: '38%',
    statLabel: 'avg. margin lift',
  },
];
