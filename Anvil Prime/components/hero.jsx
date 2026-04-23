// Hero — 3 variants, all stats-forward, big-number-as-design-anchor.
// Variant A: "Refined Current" — evolved current look, confident type, subtle grid
// Variant B: "Industrial Bold" — navy dominant, massive stat number, cyan accents
// Variant C: "Modern Premium" — editorial, lots of whitespace, oversized display type

// Carousel stat slides — shared across variants
const HERO_SLIDES = [
  {
    kpi: '$2.4B',
    kpiLabel: 'in client value delivered since 2019',
    eyebrow: '01 — Financial services',
    title: 'We build the systems\nthat run the enterprise.',
    sub: 'Anvil Prime is the partner Fortune 500 teams call when the stakes are existential and the timeline is impossible. AI platforms, cloud migrations, and digital engineering — delivered with industrial precision.',
    client: 'Northgate Bank',
    result: '38% reduction in settlement latency across 14 markets.',
  },
  {
    kpi: '340M',
    kpiLabel: 'transactions/day on platforms we built',
    eyebrow: '02 — Healthcare',
    title: 'Forge what the\nmarket cannot copy.',
    sub: 'Proprietary advantage takes more than slides. It takes hardened platforms, measured outcomes, and teams who ship. We spend 6–18 months embedded — then leave it running.',
    client: 'Meridian Health',
    result: 'Claims triage AI reviewing 1.2M records per hour.',
  },
  {
    kpi: '99.997%',
    kpiLabel: 'uptime across 47 mission-critical systems',
    eyebrow: '03 — Energy & industrial',
    title: 'Precision engineering\nfor the AI era.',
    sub: 'Edge compute, LLM orchestration, zero-trust security. We operate where uptime is measured in nines and compliance is a contract, not a slogan.',
    client: 'Cascade Grid',
    result: 'Predictive outage model across 4,200 substations.',
  },
];

// ────────────── VARIANT A — REFINED CURRENT ──────────────
const HeroRefined = ({ slide, accentLevel = 'medium', typeScale = 1, dark = false }) => {
  const bg = dark ? ANVIL.darkBg : ANVIL.navy;
  const fg = '#fff';
  return (
    <section style={{ position: 'relative', background: bg, color: fg, overflow: 'hidden' }}>
      {/* background layers */}
      <GridLines color="rgba(255,255,255,0.05)" size={72} />
      <DotMatrix color="rgba(44,183,232,0.22)" size={32} dot={1.2} />
      {/* cyan accent bar top-left */}
      {accentLevel !== 'low' && (
        <div style={{ position: 'absolute', top: 0, left: 48, width: 2, height: 120, background: ANVIL.cyan }} />
      )}
      <Grain opacity={0.08} />

      {/* Image right, treated */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '42%',
        clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)',
      }}>
        <Placeholder label="architectural · forge floor" tone="dark" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${bg} 0%, transparent 40%, rgba(11,19,34,0.3) 100%)` }} />
        {accentLevel === 'high' && <CrossMarks positions={[[60, 80], [160, 40], [220, 200]]} color={ANVIL.cyan} />}
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '120px 48px 140px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 680 }}>
          <Eyebrow num={slide.eyebrow.split(' — ')[0]} dark>{slide.eyebrow.split(' — ')[1]}</Eyebrow>
          <h1 style={{
            fontFamily: '"Cal Sans", Inter, sans-serif',
            fontSize: 84 * typeScale, lineHeight: 0.96, letterSpacing: '-0.035em',
            fontWeight: 600, margin: '28px 0 24px', whiteSpace: 'pre-line',
          }}>
            {slide.title}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,0.78)', maxWidth: 560, marginBottom: 40 }}>
            {slide.sub}
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Btn kind="primary" size="lg" accentHot={accentLevel === 'high'}>See our work <Arrow /></Btn>
            <Btn kind="outline" size="lg" dark>Book a consult</Btn>
          </div>
        </div>

        {/* KPI chip bottom-left */}
        <div style={{ position: 'absolute', left: 48, bottom: -60, display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <div style={{ fontFamily: '"Cal Sans", Inter, sans-serif', fontSize: 180 * typeScale, lineHeight: 0.85, letterSpacing: '-0.05em', color: ANVIL.cyan, fontWeight: 600 }}>
            {slide.kpi}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', maxWidth: 220, lineHeight: 1.5, paddingBottom: 20, fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {slide.kpiLabel}
          </div>
        </div>
      </div>
    </section>
  );
};

// ────────────── VARIANT B — INDUSTRIAL BOLD ──────────────
const HeroBold = ({ slide, accentLevel = 'medium', typeScale = 1, dark = false }) => {
  const bg = dark ? '#060b17' : ANVIL.navyDeep;
  return (
    <section style={{ position: 'relative', background: bg, color: '#fff', overflow: 'hidden' }}>
      <GridLines color="rgba(255,255,255,0.04)" size={56} />
      <DotMatrix color="rgba(44,183,232,0.28)" size={28} dot={1.4} />
      {accentLevel !== 'low' && <CrossMarks color={ANVIL.cyan} positions={[[180, 140], [620, 80], [980, 260], [1320, 420], [380, 520]]} />}
      <Grain opacity={0.1} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 48px 60px', position: 'relative', zIndex: 2 }}>
        {/* top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <Eyebrow num={slide.eyebrow.split(' — ')[0]} dark>{slide.eyebrow.split(' — ')[1]}</Eyebrow>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
            Case 04 of 47<br />
            <span style={{ color: ANVIL.cyan }}>Live engagement</span>
          </div>
        </div>

        {/* MASSIVE NUMBER as hero anchor */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{
            fontFamily: '"Cal Sans", Inter, sans-serif',
            fontSize: `clamp(200px, ${28 * typeScale}vw, ${440 * typeScale}px)`,
            lineHeight: 0.82,
            letterSpacing: '-0.06em',
            fontWeight: 600,
            color: '#fff',
            background: `linear-gradient(180deg, #fff 0%, #fff 60%, ${ANVIL.cyan} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            position: 'relative',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}>
            {slide.kpi}
          </div>
          {/* cyan rule under number */}
          <div style={{ position: 'absolute', bottom: 12, left: 0, height: 2, width: '62%', background: ANVIL.cyan, opacity: 0.8 }} />
        </div>

        {/* 2-col under number */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end' }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: ANVIL.cyan, marginBottom: 16 }}>
              {slide.kpiLabel}
            </div>
            <h1 style={{
              fontFamily: '"Cal Sans", Inter, sans-serif',
              fontSize: 56 * typeScale, lineHeight: 1.02, letterSpacing: '-0.03em',
              fontWeight: 600, margin: 0, whiteSpace: 'pre-line',
            }}>
              {slide.title}
            </h1>
          </div>
          <div>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)', marginBottom: 28 }}>
              {slide.sub}
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Btn kind="primary" size="lg" accentHot={accentLevel !== 'low'}>See our work <Arrow /></Btn>
              <Btn kind="outline" size="lg" dark>Book a consult</Btn>
            </div>
          </div>
        </div>

        {/* Bottom spec row */}
        <div style={{
          marginTop: 60, paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.15)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
        }}>
          <div><span style={{ color: ANVIL.cyan, marginRight: 10 }}>▸ CLIENT</span><br /><span style={{ color: '#fff', fontSize: 13, textTransform: 'none', letterSpacing: '0.02em', marginTop: 6, display: 'inline-block' }}>{slide.client}</span></div>
          <div><span style={{ color: ANVIL.cyan, marginRight: 10 }}>▸ OUTCOME</span><br /><span style={{ color: '#fff', fontSize: 13, textTransform: 'none', letterSpacing: '0.02em', marginTop: 6, display: 'inline-block' }}>{slide.result}</span></div>
          <div><span style={{ color: ANVIL.cyan, marginRight: 10 }}>▸ DURATION</span><br /><span style={{ color: '#fff', fontSize: 13, textTransform: 'none', letterSpacing: '0.02em', marginTop: 6, display: 'inline-block' }}>14 months, 2 phases</span></div>
          <div><span style={{ color: ANVIL.cyan, marginRight: 10 }}>▸ TEAM</span><br /><span style={{ color: '#fff', fontSize: 13, textTransform: 'none', letterSpacing: '0.02em', marginTop: 6, display: 'inline-block' }}>38 engineers · 6 leads</span></div>
        </div>
      </div>
    </section>
  );
};

// ────────────── VARIANT C — MODERN PREMIUM ──────────────
const HeroPremium = ({ slide, accentLevel = 'medium', typeScale = 1, dark = false }) => {
  const bg = dark ? ANVIL.darkBg : '#fbfcfe';
  const fg = dark ? ANVIL.darkInk : ANVIL.navy;
  const mutedFg = dark ? ANVIL.darkMuted : ANVIL.slate;

  return (
    <section style={{ position: 'relative', background: bg, color: fg, overflow: 'hidden' }}>
      <GridLines color={dark ? 'rgba(255,255,255,0.04)' : 'rgba(26,43,74,0.05)'} size={80} />
      {accentLevel !== 'low' && <DotMatrix color={dark ? 'rgba(44,183,232,0.2)' : 'rgba(20,120,200,0.16)'} size={28} dot={1} />}

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '100px 48px 80px', position: 'relative', zIndex: 2 }}>
        {/* tag row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 80 }}>
          <Eyebrow num={slide.eyebrow.split(' — ')[0]}>{slide.eyebrow.split(' — ')[1]}</Eyebrow>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: mutedFg }}>
            Established 2011 · 487 engineers · 12 offices
          </div>
        </div>

        {/* Editorial grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 80, alignItems: 'start' }}>
          <div>
            <h1 style={{
              fontFamily: '"Cal Sans", Inter, sans-serif',
              fontSize: 112 * typeScale, lineHeight: 0.94, letterSpacing: '-0.04em',
              fontWeight: 600, margin: '0 0 40px', whiteSpace: 'pre-line',
              color: fg,
            }}>
              {slide.title}
            </h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 48 }}>
              <Btn kind="primary" size="lg" accentHot={accentLevel === 'high'}>See our work <Arrow /></Btn>
              <Btn kind="ghost" size="lg">Book a consult <Arrow /></Btn>
            </div>
          </div>
          <div style={{ paddingTop: 20 }}>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: mutedFg, marginBottom: 40 }}>
              {slide.sub}
            </p>
            <div style={{ borderLeft: `2px solid ${ANVIL.cyan}`, paddingLeft: 20 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: ANVIL.blue, marginBottom: 10 }}>
                Featured · {slide.client}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.5, color: fg, fontWeight: 500 }}>
                {slide.result}
              </div>
            </div>
          </div>
        </div>

        {/* Massive KPI row, full-bleed */}
        <div style={{ marginTop: 120, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 40, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : ANVIL.line}`, paddingTop: 32 }}>
          <div style={{
            fontFamily: '"Cal Sans", Inter, sans-serif',
            fontSize: `clamp(180px, ${24 * typeScale}vw, ${380 * typeScale}px)`,
            lineHeight: 0.82, letterSpacing: '-0.06em', fontWeight: 600,
            color: ANVIL.blue, margin: 0, whiteSpace: 'nowrap',
          }}>
            {slide.kpi}
          </div>
          <div style={{ maxWidth: 280, textAlign: 'right', paddingBottom: 24 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: mutedFg, lineHeight: 1.6 }}>
              {slide.kpiLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Carousel shell with dots + arrows
const HeroCarousel = ({ variant, ...props }) => {
  const [idx, setIdx] = React.useState(0);
  const slide = HERO_SLIDES[idx];

  const Variant = variant === 'bold' ? HeroBold : variant === 'premium' ? HeroPremium : HeroRefined;
  const onDark = variant !== 'premium' || props.dark;

  return (
    <div style={{ position: 'relative' }}>
      <Variant slide={slide} {...props} />
      {/* Controls */}
      <div style={{
        position: 'absolute', bottom: 32, right: 48, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 16,
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.14em',
        color: onDark ? 'rgba(255,255,255,0.7)' : ANVIL.slate,
      }}>
        <span>{String(idx + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              width: i === idx ? 28 : 10, height: 2, background: i === idx ? ANVIL.cyan : (onDark ? 'rgba(255,255,255,0.3)' : ANVIL.line),
              border: 'none', cursor: 'pointer', transition: 'all .25s', padding: 0,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setIdx((idx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} style={navBtn(onDark)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
          <button onClick={() => setIdx((idx + 1) % HERO_SLIDES.length)} style={navBtn(onDark)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const navBtn = (dark) => ({
  width: 32, height: 32,
  background: 'transparent',
  border: `1px solid ${dark ? 'rgba(255,255,255,0.25)' : ANVIL.line}`,
  color: dark ? '#fff' : ANVIL.navy,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
});

Object.assign(window, { HeroCarousel, HERO_SLIDES });
