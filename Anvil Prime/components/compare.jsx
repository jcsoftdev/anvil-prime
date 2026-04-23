// Compare view — side-by-side hero variants in design_canvas

const CompareView = ({ state }) => {
  const variants = [
    { id: 'refined', label: 'A · Refined Current', variant: 'refined' },
    { id: 'bold', label: 'B · Industrial Bold', variant: 'bold' },
    { id: 'premium', label: 'C · Modern Premium', variant: 'premium' },
  ];
  const slide = HERO_SLIDES[0];

  return (
    <DesignCanvas>
      <DCSection id="heroes" title="Hero directions" subtitle="Three takes on the stats-forward brief. Drag to reorder; click to focus.">
        {variants.map((v) => (
          <DCArtboard key={v.id} id={v.id} label={v.label} width={1280} height={900}>
            <div style={{ width: 1280, background: v.variant === 'premium' && !state.dark ? '#fbfcfe' : '#0b1322' }}>
              <Nav dark={v.variant !== 'premium' || state.dark} navMode="minimal" darkMode={state.dark} onToggleDark={() => {}} />
              {React.createElement(
                v.variant === 'bold' ? HeroBold : v.variant === 'premium' ? HeroPremium : HeroRefined,
                { slide, accentLevel: state.accentLevel, typeScale: state.typeScale, dark: state.dark }
              )}
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="stats" title="Stats treatments" subtitle="Three treatments for the performance band. The brief calls for stats as design anchors.">
        {[['massive', 'Massive · 240px numbers'], ['countup', 'Animated count-up'], ['compact', 'Compact · current-plus']].map(([id, label]) => (
          <DCArtboard key={id} id={id} label={label} width={1280} height={820}>
            <div style={{ width: 1280 }}>
              <StatsSection treatment={id} dark={state.dark} />
            </div>
          </DCArtboard>
        ))}
      </DCSection>
    </DesignCanvas>
  );
};

Object.assign(window, { CompareView });
