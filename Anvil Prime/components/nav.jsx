// Anvil Prime — sticky nav with dark-hero/light-scrolled transition.
// Mobile accordion behavior.

const NAV_ITEMS = [
  {
    label: 'Services',
    children: [
      { title: 'AI & Data Platforms', desc: 'Production LLM systems, MLOps, governance' },
      { title: 'Cloud Modernization', desc: 'Migration, FinOps, platform engineering' },
      { title: 'Digital Engineering', desc: 'Product builds, design systems, delivery' },
      { title: 'Cybersecurity', desc: 'Zero-trust, compliance, incident response' },
    ],
  },
  {
    label: 'Industries',
    children: [
      { title: 'Financial Services', desc: 'Banks, insurers, capital markets' },
      { title: 'Healthcare & Life Sciences', desc: 'Payers, providers, biotech' },
      { title: 'Energy & Industrial', desc: 'Utilities, manufacturing, supply chain' },
      { title: 'Public Sector', desc: 'Federal, state, defense' },
    ],
  },
  { label: 'Case Studies' },
  { label: 'Insights' },
  { label: 'About' },
];

const Nav = ({ dark = true, navMode = 'minimal', darkMode = false, onToggleDark }) => {
  const [openIdx, setOpenIdx] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileSection, setMobileSection] = React.useState(null);

  const fg = dark ? '#fff' : ANVIL.navy;
  const fgMuted = dark ? 'rgba(255,255,255,0.75)' : ANVIL.slate;
  const bg = dark ? 'rgba(11, 19, 34, 0.72)' : 'rgba(255,255,255,0.88)';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(26,43,74,0.08)';

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: bg,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${border}`,
        color: fg,
      }}
    >
      {/* Top strip — only in "full" nav mode */}
      {navMode === 'full' && (
        <div style={{
          borderBottom: `1px solid ${border}`,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: fgMuted,
        }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '8px 48px', display: 'flex', justifyContent: 'space-between' }}>
            <span>AP · EST 2011 · NEW YORK / LONDON / SINGAPORE</span>
            <span style={{ display: 'flex', gap: 24 }}>
              <span>Investor Relations</span>
              <span>Careers (87 open)</span>
              <span style={{ color: ANVIL.cyan }}>● Systems nominal</span>
            </span>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '18px 48px', display: 'flex', alignItems: 'center', gap: 48 }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: fg }}>
          <AnvilMark dark={dark} />
          <span style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Anvil<span style={{ color: ANVIL.cyan }}>Prime</span>
          </span>
        </a>

        {/* Desktop */}
        <nav style={{ display: 'flex', gap: 4, marginLeft: 12 }} className="ap-desktop-nav">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => item.children && setOpenIdx(i)}
              onMouseLeave={() => setOpenIdx(null)}
            >
              <button
                style={{
                  background: 'none', border: 'none', color: fg, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
                  padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {item.label}
                {item.children && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>

              {item.children && openIdx === i && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0,
                  background: dark ? ANVIL.navyDeep : '#fff',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : ANVIL.line}`,
                  padding: 8, minWidth: 380,
                  boxShadow: dark ? '0 24px 60px rgba(0,0,0,0.5)' : '0 24px 60px rgba(26,43,74,0.12)',
                }}>
                  {/* cyan accent rule */}
                  <div style={{ position: 'absolute', top: -1, left: 0, width: 48, height: 2, background: ANVIL.cyan }} />
                  {item.children.map((c) => (
                    <a key={c.title} href="#" style={{
                      display: 'block', padding: '12px 14px', textDecoration: 'none',
                      color: fg, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : ANVIL.lineSoft}`,
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = dark ? 'rgba(44,183,232,0.08)' : ANVIL.bgAlt}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: fgMuted, lineHeight: 1.5 }}>{c.desc}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Dark mode toggle */}
        <button onClick={onToggleDark} title="Toggle theme" style={{
          background: 'transparent', border: `1px solid ${border}`, color: fg,
          width: 36, height: 36, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {darkMode
            ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3.5" fill="currentColor" /><g stroke="currentColor" strokeWidth="1.2"><line x1="8" y1="1" x2="8" y2="3" /><line x1="8" y1="13" x2="8" y2="15" /><line x1="1" y1="8" x2="3" y2="8" /><line x1="13" y1="8" x2="15" y2="8" /><line x1="3" y1="3" x2="4.5" y2="4.5" /><line x1="11.5" y1="11.5" x2="13" y2="13" /><line x1="3" y1="13" x2="4.5" y2="11.5" /><line x1="11.5" y1="4.5" x2="13" y2="3" /></g></svg>
            : <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13 9.5a5.5 5.5 0 01-6.5-6.5 5.5 5.5 0 106.5 6.5z" /></svg>}
        </button>

        <Btn kind="ghost" size="sm" dark={dark}>Client login</Btn>
        <Btn kind="primary" size="sm" accentHot>Start a project <Arrow /></Btn>
      </div>
    </header>
  );
};

const AnvilMark = ({ dark }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    <rect x="1" y="1" width="30" height="30" stroke={dark ? '#fff' : ANVIL.navy} strokeWidth="1.5" />
    <rect x="6" y="6" width="20" height="20" fill={ANVIL.blue} />
    <rect x="6" y="6" width="20" height="4" fill={ANVIL.cyan} />
    <line x1="1" y1="1" x2="31" y2="31" stroke={ANVIL.cyan} strokeWidth="1" opacity="0.5" />
  </svg>
);

Object.assign(window, { Nav, AnvilMark });
