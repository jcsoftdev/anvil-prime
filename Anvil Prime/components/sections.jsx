// Sections — industries, case studies, insights, stats, CTA strip, footer.
// Stats treatment "massive" is the default.

// ────────────── INDUSTRIES GRID ──────────────
const INDUSTRIES = [
  { n: '01', title: 'Financial Services', desc: 'Capital markets, retail banking, payments, insurance. $1.8T in assets under management on our platforms.', stat: '14', statLabel: 'top-50 banks' },
  { n: '02', title: 'Healthcare & Life Sciences', desc: 'Payers, providers, biotech, devices. AI-assisted diagnostics and claims at population scale.', stat: '220M', statLabel: 'patient records' },
  { n: '03', title: 'Energy & Industrial', desc: 'Grid, manufacturing, logistics, supply chain. Edge compute and predictive operations across four continents.', stat: '4.2K', statLabel: 'substations live' },
  { n: '04', title: 'Public Sector', desc: 'Federal, state, defense. FedRAMP High, IL-5, and classified-capable infrastructure for mission teams.', stat: '87', statLabel: 'agency engagements' },
  { n: '05', title: 'Technology & Media', desc: 'Platform scaling, content pipelines, developer experience. Where the product is the business.', stat: '2.1B', statLabel: 'monthly users served' },
  { n: '06', title: 'Retail & Consumer', desc: 'Omnichannel, supply chain resilience, loyalty systems, AI personalization that actually converts.', stat: '38%', statLabel: 'avg. margin lift' },
];

const IndustriesGrid = ({ dark = false }) => {
  const bg = dark ? ANVIL.darkBgAlt : ANVIL.bgAlt;
  const cardBg = dark ? ANVIL.darkBg : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : ANVIL.line;
  const fg = dark ? ANVIL.darkInk : ANVIL.navy;
  const muted = dark ? ANVIL.darkMuted : ANVIL.slate;

  return (
    <section style={{ position: 'relative', background: bg, padding: '140px 0 120px', overflow: 'hidden' }}>
      {/* diagonal top divider */}
      <svg style={{ position: 'absolute', top: -1, left: 0, right: 0, width: '100%', height: 80, display: 'block' }} preserveAspectRatio="none" viewBox="0 0 100 10">
        <polygon points="0,0 100,0 100,4 0,10" fill={dark ? ANVIL.darkBg : '#fff'} />
      </svg>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'end', marginBottom: 72 }}>
          <div>
            <Eyebrow num="01" dark={dark}>Industries</Eyebrow>
            <h2 style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 64, lineHeight: 1, letterSpacing: '-0.035em', fontWeight: 600, margin: '24px 0 0', color: fg }}>
              Six sectors.<br />One standard.
            </h2>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: muted, maxWidth: 560 }}>
            We don't serve every market — we serve the ones where engineering discipline creates compounding advantage.
            Below are the industries where Anvil Prime teams are embedded today, running production systems for the companies that define them.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1px solid ${border}`, background: border }}>
          {INDUSTRIES.map((ind) => (
            <div key={ind.n} style={{
              background: cardBg, padding: 40, position: 'relative', minHeight: 320,
              transition: 'background .2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = dark ? ANVIL.navyDeep : ANVIL.bgAlt2; e.currentTarget.querySelector('[data-ap-hover]').style.opacity = 1; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = cardBg; e.currentTarget.querySelector('[data-ap-hover]').style.opacity = 0; }}
            >
              <div data-ap-hover style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 2, background: ANVIL.cyan, opacity: 0, transition: 'opacity .2s' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.16em', color: ANVIL.blue }}>
                  {ind.n}
                </div>
                <Arrow />
              </div>
              <h3 style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 16px', color: fg }}>
                {ind.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: muted, margin: '0 0 36px' }}>
                {ind.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingTop: 20, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : ANVIL.lineSoft}` }}>
                <div style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 40, fontWeight: 600, color: ANVIL.blue, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {ind.stat}
                </div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: muted }}>
                  {ind.statLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────── CASE STUDIES CAROUSEL ──────────────
const CASES = [
  { tag: 'Financial · 18 mo', client: 'Northgate Bank', title: 'Rebuilt real-time settlement across 14 markets.', kpi: '38%', kpiLabel: 'lower latency', color: ANVIL.blue },
  { tag: 'Healthcare · 9 mo', client: 'Meridian Health', title: 'Claims triage AI processing 1.2M records/hour.', kpi: '$112M', kpiLabel: 'saved annually', color: ANVIL.navy },
  { tag: 'Energy · 14 mo', client: 'Cascade Grid', title: 'Predictive outage model across 4,200 substations.', kpi: '99.997%', kpiLabel: 'uptime', color: ANVIL.cyan },
  { tag: 'Public · 22 mo', client: 'Defense Logistics', title: 'Classified supply-chain twin, IL-5 certified.', kpi: '4×', kpiLabel: 'ops throughput', color: ANVIL.blueDark },
];

const CaseCarousel = ({ dark = false }) => {
  const [idx, setIdx] = React.useState(0);
  const bg = dark ? ANVIL.darkBg : '#fff';
  const fg = dark ? ANVIL.darkInk : ANVIL.navy;
  const muted = dark ? ANVIL.darkMuted : ANVIL.slate;
  const line = dark ? 'rgba(255,255,255,0.1)' : ANVIL.line;

  return (
    <section style={{ background: bg, padding: '140px 0', color: fg, position: 'relative' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 60 }}>
          <div>
            <Eyebrow num="02" dark={dark}>Case studies</Eyebrow>
            <h2 style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 64, lineHeight: 1, letterSpacing: '-0.035em', fontWeight: 600, margin: '24px 0 0' }}>
              Outcomes, not output.
            </h2>
          </div>
          <a href="#" style={{ color: ANVIL.blue, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            All 47 case studies <Arrow />
          </a>
        </div>

        {/* Featured card — large */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 0, border: `1px solid ${line}`, minHeight: 520 }}>
          <div style={{ position: 'relative', overflow: 'hidden', background: CASES[idx].color }}>
            <Placeholder tone="dark" label={`${CASES[idx].client.toLowerCase().replace(' ', '-')} · hero image`} style={{ position: 'absolute', inset: 0 }} />
            <GridLines color="rgba(255,255,255,0.08)" size={48} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${CASES[idx].color}99 100%)` }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 80, background: ANVIL.cyan }} />
            <div style={{ position: 'absolute', bottom: 32, left: 40, color: '#fff', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.8 }}>
              {CASES[idx].tag}
            </div>
          </div>
          <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: ANVIL.blue, marginBottom: 20 }}>
                {CASES[idx].client}
              </div>
              <h3 style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 38, lineHeight: 1.1, letterSpacing: '-0.025em', fontWeight: 600, margin: 0, color: fg }}>
                {CASES[idx].title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: muted, marginTop: 24 }}>
                A 36-engineer team embedded for 18 months — from architecture review through production handoff. Delivered under budget, two months ahead of target.
              </p>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderTop: `1px solid ${line}`, paddingTop: 24, marginBottom: 28 }}>
                <div style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 72, fontWeight: 600, lineHeight: 0.9, letterSpacing: '-0.04em', color: ANVIL.blue }}>
                  {CASES[idx].kpi}
                </div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: muted, paddingBottom: 8 }}>
                  {CASES[idx].kpiLabel}
                </div>
              </div>
              <Btn kind="outline">Read the case <Arrow /></Btn>
            </div>
          </div>
        </div>

        {/* Other cases mini row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderLeft: `1px solid ${line}`, borderRight: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
          {CASES.map((c, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                textAlign: 'left', background: idx === i ? (dark ? ANVIL.navyDeep : ANVIL.bgAlt) : 'transparent',
                padding: 24, border: 'none', borderRight: i < CASES.length - 1 ? `1px solid ${line}` : 'none',
                cursor: 'pointer', color: fg, position: 'relative', transition: 'background .2s',
              }}
            >
              {idx === i && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: ANVIL.cyan }} />}
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>
                0{i + 1} · {c.tag}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: fg }}>
                {c.client}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────── PERFORMANCE STATS (massive numbers) ──────────────
const STATS = [
  { n: '$2.4B', l: 'Client value delivered', sub: 'Measured impact across 47 flagship engagements since 2019.' },
  { n: '487', l: 'Engineers · globally', sub: 'Staff badges only. No subcontractors on client work. Ever.' },
  { n: '99.997%', l: 'Uptime SLA met', sub: 'Across 47 live production systems we operate or support.' },
  { n: '14', l: 'Years in business', sub: 'Founded 2011 in Pittsburgh. Now across 12 offices on 4 continents.' },
];

const StatsSection = ({ treatment = 'massive', dark = false }) => {
  return (
    <section style={{ background: ANVIL.blue, color: '#fff', padding: '140px 0', position: 'relative', overflow: 'hidden' }}>
      <GridLines color="rgba(255,255,255,0.08)" size={64} />
      <DotMatrix color="rgba(255,255,255,0.12)" size={28} dot={1.4} />
      <CrossMarks color="rgba(255,255,255,0.35)" positions={[[80, 60], [400, 180], [900, 100], [1280, 280], [200, 420]]} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px', position: 'relative' }}>
        <div style={{ marginBottom: 80 }}>
          <Eyebrow num="03" dark>Performance</Eyebrow>
          <h2 style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 64, lineHeight: 1, letterSpacing: '-0.035em', fontWeight: 600, margin: '24px 0 0', maxWidth: 900 }}>
            The work speaks. The numbers are receipts.
          </h2>
        </div>

        {treatment === 'massive' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '80px 96px' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ position: 'relative', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.25)' }}>
                <div style={{ position: 'absolute', top: -1, left: 0, width: 48, height: 2, background: ANVIL.cyan }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
                  <span>0{i + 1}</span>
                  <span>{s.l}</span>
                </div>
                <div style={{
                  fontFamily: '"Cal Sans", Inter, sans-serif',
                  fontSize: 'clamp(140px, 14vw, 240px)',
                  lineHeight: 0.85, letterSpacing: '-0.05em', fontWeight: 600,
                  color: '#fff', margin: '0 0 20px',
                }}>
                  {s.n}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)', maxWidth: 420, margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        ) : treatment === 'countup' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48 }}>
            {STATS.map((s, i) => (
              <CountUpStat key={i} n={s.n} l={s.l} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 72, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const CountUpStat = ({ n, l }) => {
  const [val, setVal] = React.useState(n);
  React.useEffect(() => {
    const num = parseFloat(n.replace(/[^0-9.]/g, ''));
    if (!num) { setVal(n); return; }
    const prefix = n.match(/^[^0-9]*/)[0];
    const suffix = n.match(/[^0-9.]*$/)[0];
    let start = 0;
    const steps = 40;
    const step = num / steps;
    let i = 0;
    const int = setInterval(() => {
      i++;
      start = Math.min(num, step * i);
      const rounded = num >= 100 ? Math.round(start) : start.toFixed(num >= 10 ? 1 : 3);
      setVal(prefix + rounded + suffix);
      if (i >= steps) clearInterval(int);
    }, 40);
    return () => clearInterval(int);
  }, [n]);
  return (
    <div>
      <div style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 120, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 0.85, marginBottom: 16 }}>{val}</div>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>{l}</div>
    </div>
  );
};

// ────────────── INSIGHTS CAROUSEL ──────────────
const INSIGHTS = [
  { tag: 'Field note', date: 'Apr 2026', title: 'Why most enterprise AI pilots stall at month 9 — and how to design past it.', author: 'M. Okoro, Principal' },
  { tag: 'Whitepaper', date: 'Mar 2026', title: 'FinOps at petabyte scale: the 6 anti-patterns we see in every audit.', author: 'S. Vasquez, VP Cloud' },
  { tag: 'Case brief', date: 'Feb 2026', title: 'Inside the Northgate settlement rebuild: 38% faster, 0 regressions.', author: 'D. Patel, Lead' },
];

const InsightsCarousel = ({ dark = false }) => {
  const bg = dark ? ANVIL.darkBgAlt : ANVIL.bgAlt;
  const cardBg = dark ? ANVIL.darkBg : '#fff';
  const fg = dark ? ANVIL.darkInk : ANVIL.navy;
  const muted = dark ? ANVIL.darkMuted : ANVIL.slate;
  const line = dark ? 'rgba(255,255,255,0.08)' : ANVIL.line;

  return (
    <section style={{ background: bg, padding: '140px 0', color: fg, position: 'relative', overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', top: -1, left: 0, right: 0, width: '100%', height: 80, display: 'block' }} preserveAspectRatio="none" viewBox="0 0 100 10">
        <polygon points="0,0 100,0 100,10 0,4" fill={ANVIL.blue} />
      </svg>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 60 }}>
          <div>
            <Eyebrow num="04" dark={dark}>Insights</Eyebrow>
            <h2 style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 64, lineHeight: 1, letterSpacing: '-0.035em', fontWeight: 600, margin: '24px 0 0' }}>
              What we're learning.
            </h2>
          </div>
          <a href="#" style={{ color: ANVIL.blue, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            All insights <Arrow />
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {INSIGHTS.map((ins, i) => (
            <a key={i} href="#" style={{ textDecoration: 'none', color: 'inherit', background: cardBg, border: `1px solid ${line}`, padding: 0, display: 'flex', flexDirection: 'column', minHeight: 460, position: 'relative', transition: 'transform .2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.querySelector('[data-acc]').style.width = '100%'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.querySelector('[data-acc]').style.width = '48px'; }}
            >
              <div data-acc style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 2, background: ANVIL.cyan, transition: 'width .3s' }} />
              <Placeholder tone={dark ? 'dark' : 'light'} label={`insight · ${ins.tag.toLowerCase()}`} style={{ height: 200 }} />
              <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: muted, marginBottom: 16 }}>
                  <span style={{ color: ANVIL.blue }}>{ins.tag}</span>
                  <span>{ins.date}</span>
                </div>
                <h3 style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.02em', fontWeight: 600, margin: '0 0 20px', color: fg }}>
                  {ins.title}
                </h3>
                <div style={{ marginTop: 'auto', fontSize: 13, color: muted }}>— {ins.author}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────── CTA STRIP ──────────────
const CTAStrip = ({ dark = false }) => (
  <section style={{ background: ANVIL.navy, color: '#fff', padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
    <GridLines color="rgba(255,255,255,0.04)" size={64} />
    <DotMatrix color="rgba(44,183,232,0.22)" size={28} dot={1.2} />
    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 2, height: 80, background: ANVIL.cyan }} />
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px', position: 'relative', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 80, alignItems: 'center' }}>
      <div>
        <Eyebrow dark>Start a project</Eyebrow>
        <h2 style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 80, lineHeight: 0.98, letterSpacing: '-0.04em', fontWeight: 600, margin: '20px 0 0' }}>
          Have a system<br />worth building?
        </h2>
      </div>
      <div>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)', marginBottom: 32 }}>
          Most engagements begin with a 45-minute architecture review at no cost. We'll tell you honestly whether we're the right partner — and who to call if we aren't.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn kind="primary" size="lg" accentHot>Book the review <Arrow /></Btn>
          <Btn kind="outline" size="lg" dark>Read our approach</Btn>
        </div>
      </div>
    </div>
  </section>
);

// ────────────── FOOTER ──────────────
const Footer = ({ dark = false }) => {
  const bg = dark ? '#060b17' : ANVIL.navyDeep;
  return (
    <footer style={{ background: bg, color: '#fff', padding: '80px 0 32px', position: 'relative' }}>
      <GridLines color="rgba(255,255,255,0.04)" size={72} />
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 48, paddingBottom: 64, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <AnvilMark dark />
              <span style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Anvil<span style={{ color: ANVIL.cyan }}>Prime</span></span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', maxWidth: 320 }}>
              Enterprise tech consulting with industrial precision. Headquartered in Pittsburgh — operating across 12 offices and 4 continents.
            </p>
          </div>
          {[
            ['Services', ['AI & Data Platforms', 'Cloud Modernization', 'Digital Engineering', 'Cybersecurity']],
            ['Industries', ['Financial Services', 'Healthcare', 'Energy', 'Public Sector']],
            ['Company', ['About', 'Leadership', 'Careers (87 open)', 'News']],
            ['Contact', ['New business', 'Media inquiries', 'Investor relations', 'Press kit']],
          ].map(([h, items]) => (
            <div key={h}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: ANVIL.cyan, marginBottom: 20 }}>{h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map((it) => (
                  <li key={it} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 14 }}>{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 28, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          <span>© 2011–2026 Anvil Prime Ltd. All rights reserved.</span>
          <span style={{ display: 'flex', gap: 32 }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Accessibility · WCAG AA</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

Object.assign(window, { IndustriesGrid, CaseCarousel, StatsSection, InsightsCarousel, CTAStrip, Footer });
