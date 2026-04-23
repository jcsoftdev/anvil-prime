// Design tokens + shared primitives for Anvil Prime
// Expose to window so other Babel scripts see them.

const ANVIL = {
  navy: '#1a2b4a',
  navyDeep: '#0f1a30',
  blue: '#1478c8',
  blueDark: '#0e5fa3',
  cyan: '#2cb7e8',
  cyanSoft: '#8fd9f1',
  ink: '#0b1322',
  slate: '#4a5a78',
  muted: '#7a8699',
  line: '#d9e2ef',
  lineSoft: '#eaf0f8',
  bg: '#ffffff',
  bgAlt: '#f2f7fc',      // light-blue alternating
  bgAlt2: '#e8f1fa',
  // dark mode
  darkBg: '#0b1322',
  darkBgAlt: '#101a33',
  darkLine: '#22304d',
  darkInk: '#e7eef9',
  darkMuted: '#8fa0bf',
};

// Dot-matrix pattern (subtle, technical)
const DotMatrix = ({ color = 'rgba(20,120,200,0.18)', size = 22, dot = 1.2, style }) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute', inset: 0,
      backgroundImage: `radial-gradient(${color} ${dot}px, transparent ${dot}px)`,
      backgroundSize: `${size}px ${size}px`,
      pointerEvents: 'none',
      ...style,
    }}
  />
);

// Blueprint grid lines (hairline)
const GridLines = ({ color = 'rgba(26,43,74,0.07)', size = 64, style }) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute', inset: 0,
      backgroundImage:
        `linear-gradient(to right, ${color} 1px, transparent 1px),` +
        `linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      pointerEvents: 'none',
      ...style,
    }}
  />
);

// Thin industrial "+" crosshair marks at intersections
const CrossMarks = ({ color = 'rgba(44,183,232,0.55)', positions = [], style }) => (
  <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
    {positions.map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`} stroke={color} strokeWidth="1">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
    ))}
  </svg>
);

// Subtle grain overlay (SVG noise, cheap)
const Grain = ({ opacity = 0.05, style }) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
      mixBlendMode: 'overlay',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      ...style,
    }}
  />
);

// Placeholder image (striped, monospace caption)
const Placeholder = ({ label = 'image', tone = 'light', style, children }) => {
  const isDark = tone === 'dark';
  const stripeA = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,43,74,0.06)';
  const stripeB = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(26,43,74,0.02)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,43,74,0.18)';
  const text = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(26,43,74,0.55)';
  return (
    <div style={{
      position: 'relative',
      backgroundImage: `repeating-linear-gradient(135deg, ${stripeA} 0 8px, ${stripeB} 8px 16px)`,
      border: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: text,
      ...style,
    }}>
      <span style={{ background: isDark ? 'rgba(11,19,34,0.6)' : 'rgba(255,255,255,0.7)', padding: '4px 10px', border: `1px solid ${border}` }}>
        {label}
      </span>
      {children}
    </div>
  );
};

// Button system (primary / outline / ghost)
const Btn = ({ kind = 'primary', size = 'md', children, dark = false, accentHot = false, style, ...p }) => {
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13 },
    md: { padding: '12px 20px', fontSize: 14 },
    lg: { padding: '16px 28px', fontSize: 15 },
  }[size];
  const base = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    borderRadius: 2,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1.5px solid transparent',
    transition: 'all .15s ease',
    ...sizes,
  };
  const variants = {
    primary: {
      background: ANVIL.blue,
      color: '#fff',
      borderColor: ANVIL.blue,
    },
    outline: {
      background: 'transparent',
      color: dark ? '#fff' : ANVIL.blue,
      borderColor: dark ? 'rgba(255,255,255,0.4)' : ANVIL.blue,
    },
    ghost: {
      background: 'transparent',
      color: dark ? ANVIL.cyan : ANVIL.blue,
      borderColor: 'transparent',
      padding: sizes.padding,
    },
  };
  return (
    <button
      {...p}
      style={{ ...base, ...variants[kind], ...style }}
      onMouseEnter={(e) => {
        if (kind === 'primary') { e.currentTarget.style.background = accentHot ? ANVIL.cyan : ANVIL.blueDark; e.currentTarget.style.borderColor = accentHot ? ANVIL.cyan : ANVIL.blueDark; }
        if (kind === 'outline') { e.currentTarget.style.background = dark ? 'rgba(44,183,232,0.12)' : 'rgba(44,183,232,0.08)'; e.currentTarget.style.borderColor = ANVIL.cyan; e.currentTarget.style.color = dark ? '#fff' : ANVIL.cyan; }
        if (kind === 'ghost') { e.currentTarget.style.color = ANVIL.cyan; }
      }}
      onMouseLeave={(e) => {
        const v = variants[kind];
        e.currentTarget.style.background = v.background;
        e.currentTarget.style.borderColor = v.borderColor;
        e.currentTarget.style.color = v.color;
      }}
    >
      {children}
    </button>
  );
};

// Eyebrow / tech label ("01 — INDUSTRIES")
const Eyebrow = ({ num, children, dark = false, style }) => (
  <div style={{
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: dark ? ANVIL.cyan : ANVIL.blue,
    display: 'flex', alignItems: 'center', gap: 10,
    ...style,
  }}>
    {num && <span style={{ opacity: 0.7 }}>{num}</span>}
    {num && <span style={{ width: 24, height: 1, background: 'currentColor', opacity: 0.5 }} />}
    <span>{children}</span>
  </div>
);

// Arrow icon
const Arrow = ({ size = 14, style }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

Object.assign(window, { ANVIL, DotMatrix, GridLines, CrossMarks, Grain, Placeholder, Btn, Eyebrow, Arrow });
