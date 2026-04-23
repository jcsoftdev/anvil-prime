// Tweaks panel — floats bottom-right, toggled via parent postMessage

const Tweaks = ({ state, setKey, visible }) => {
  if (!visible) return null;
  const cell = { display: 'flex', flexDirection: 'column', gap: 6 };
  const label = { fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fa0bf' };
  const row = { display: 'flex', gap: 6, flexWrap: 'wrap' };
  const chip = (active) => ({
    padding: '6px 10px', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500,
    background: active ? '#2cb7e8' : 'transparent', color: active ? '#0b1322' : '#e7eef9',
    border: `1px solid ${active ? '#2cb7e8' : 'rgba(255,255,255,0.2)'}`, cursor: 'pointer', borderRadius: 2,
  });

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 320, zIndex: 100,
      background: 'rgba(11,19,34,0.96)', color: '#e7eef9',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.12)',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, background: '#2cb7e8' }} />
          <span style={{ fontFamily: '"Cal Sans", Inter', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Tweaks</span>
        </div>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', color: '#8fa0bf' }}>ANVIL · V1</span>
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 18, maxHeight: '72vh', overflow: 'auto' }}>
        <div style={cell}>
          <span style={label}>Hero variant</span>
          <div style={row}>
            {[['refined', 'Refined'], ['bold', 'Industrial Bold'], ['premium', 'Modern Premium']].map(([v, l]) => (
              <button key={v} onClick={() => setKey('heroVariant', v)} style={chip(state.heroVariant === v)}>{l}</button>
            ))}
          </div>
        </div>

        <div style={cell}>
          <span style={label}>Accent intensity (cyan)</span>
          <div style={row}>
            {['low', 'medium', 'high'].map((v) => (
              <button key={v} onClick={() => setKey('accentLevel', v)} style={chip(state.accentLevel === v)}>{v}</button>
            ))}
          </div>
        </div>

        <div style={cell}>
          <span style={label}>Stats treatment</span>
          <div style={row}>
            {[['massive', 'Massive'], ['countup', 'Count-up'], ['compact', 'Compact']].map(([v, l]) => (
              <button key={v} onClick={() => setKey('statsTreatment', v)} style={chip(state.statsTreatment === v)}>{l}</button>
            ))}
          </div>
        </div>

        <div style={cell}>
          <span style={label}>Section dividers</span>
          <div style={row}>
            {[['diagonal', 'Diagonal'], ['hairline', 'Hairline'], ['overlap', 'Overlap cards']].map(([v, l]) => (
              <button key={v} onClick={() => setKey('dividerStyle', v)} style={chip(state.dividerStyle === v)}>{l}</button>
            ))}
          </div>
        </div>

        <div style={cell}>
          <span style={label}>Nav mode</span>
          <div style={row}>
            {[['minimal', 'Minimal'], ['full', 'Full w/ status strip']].map(([v, l]) => (
              <button key={v} onClick={() => setKey('navMode', v)} style={chip(state.navMode === v)}>{l}</button>
            ))}
          </div>
        </div>

        <div style={cell}>
          <span style={label}>Typography scale · {state.typeScale.toFixed(2)}×</span>
          <input type="range" min="0.85" max="1.2" step="0.05" value={state.typeScale}
            onChange={(e) => setKey('typeScale', parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#2cb7e8' }} />
        </div>

        <div style={cell}>
          <span style={label}>Theme</span>
          <div style={row}>
            <button onClick={() => setKey('dark', false)} style={chip(!state.dark)}>Light</button>
            <button onClick={() => setKey('dark', true)} style={chip(state.dark)}>Dark</button>
          </div>
        </div>

        <div style={{ ...cell, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
          <span style={label}>View</span>
          <div style={row}>
            <button onClick={() => setKey('view', 'homepage')} style={chip(state.view === 'homepage')}>Homepage</button>
            <button onClick={() => setKey('view', 'compare')} style={chip(state.view === 'compare')}>Compare heroes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Tweaks });
