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
    name: 'Banking & Financial Services',
    description:
      'Real-time payment systems, fraud detection, risk platforms, and compliance-ready financial data infrastructure built for regulated environments.',
    stat: 'PCI-DSS',
    statLabel: 'compliant by design',
  },
  {
    num: '02',
    name: 'Healthcare & Life Sciences',
    description:
      'HIPAA-compliant patient platforms, HL7 FHIR integrations, clinical AI, and secure data pipelines built for health systems.',
    stat: 'HIPAA',
    statLabel: 'compliant by design',
  },
  {
    num: '03',
    name: 'Media & Entertainment',
    description:
      'Content pipelines, streaming infrastructure, ad tech platforms, and high-throughput media workflows where latency is never an excuse.',
    stat: 'Sub-50ms',
    statLabel: 'delivery target',
  },
  {
    num: '04',
    name: 'Retail & CPG',
    description:
      'Supply chain optimization, demand forecasting, omnichannel platforms, and AI-driven personalization that moves the margin needle.',
    stat: 'D2C · B2B',
    statLabel: 'omnichannel ready',
  },
  {
    num: '05',
    name: 'Energy & Utilities',
    description:
      'Sensor data pipelines, predictive maintenance, grid analytics, and edge compute for operations where downtime has a real cost.',
    stat: 'IIoT · Edge',
    statLabel: 'data ready',
  },
  {
    num: '06',
    name: 'Technology & SaaS',
    description:
      'Multi-tenant platform engineering, developer tooling, internal platforms, and the data infrastructure that keeps B2B SaaS competitive.',
    stat: 'Multi-tenant',
    statLabel: 'SaaS architecture',
  },
];
