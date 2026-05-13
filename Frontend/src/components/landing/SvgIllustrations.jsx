/* SVG illustration components for the landing page */

export const HeroIllustration = () => (
  <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Outer rotating ring */}
    <circle cx="400" cy="300" r="220" stroke="rgba(200,182,255,0.08)" strokeWidth="1" strokeDasharray="8 6" className="origin-center" style={{ animation: 'orbit 40s linear infinite' }} />
    <circle cx="400" cy="300" r="180" stroke="rgba(250,250,250,0.05)" strokeWidth="1" strokeDasharray="4 8" className="origin-center" style={{ animation: 'orbit 30s linear infinite reverse' }} />
    <circle cx="400" cy="300" r="140" stroke="rgba(200,182,255,0.06)" strokeWidth="0.5" />

    {/* Central brain node */}
    <g transform="translate(370, 270)">
      <rect x="0" y="0" width="60" height="60" rx="16" fill="rgba(200,182,255,0.06)" stroke="rgba(200,182,255,0.2)" strokeWidth="1" />
      <path d="M20 38c0-6 4-10 10-14 6 4 10 8 10 14" stroke="rgba(200,182,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="22" r="6" stroke="rgba(200,182,255,0.5)" strokeWidth="1.5" fill="none" />
      <path d="M24 22c0-3.3 2.7-6 6-6" stroke="rgba(200,182,255,0.3)" strokeWidth="1" fill="none" />
    </g>

    {/* Orbiting nodes */}
    <g style={{ animation: 'orbit 20s linear infinite', transformOrigin: '400px 300px' }}>
      <circle cx="400" cy="80" r="6" fill="rgba(200,182,255,0.15)" stroke="rgba(200,182,255,0.3)" strokeWidth="1" />
      <circle cx="400" cy="80" r="2" fill="rgba(200,182,255,0.5)" />
    </g>
    <g style={{ animation: 'orbit 25s linear infinite reverse', transformOrigin: '400px 300px' }}>
      <circle cx="580" cy="300" r="5" fill="rgba(250,250,250,0.1)" stroke="rgba(250,250,250,0.2)" strokeWidth="1" />
      <circle cx="580" cy="300" r="1.5" fill="rgba(250,250,250,0.4)" />
    </g>
    <g style={{ animation: 'orbit 22s linear infinite', transformOrigin: '400px 300px' }}>
      <circle cx="220" cy="300" r="4" fill="rgba(200,182,255,0.1)" stroke="rgba(200,182,255,0.25)" strokeWidth="1" />
    </g>

    {/* Connection lines */}
    <line x1="400" y1="270" x2="400" y2="86" stroke="rgba(200,182,255,0.06)" strokeWidth="0.5" strokeDasharray="3 5" />
    <line x1="430" y1="300" x2="575" y2="300" stroke="rgba(250,250,250,0.04)" strokeWidth="0.5" strokeDasharray="3 5" />
    <line x1="370" y1="300" x2="225" y2="300" stroke="rgba(200,182,255,0.04)" strokeWidth="0.5" strokeDasharray="3 5" />

    {/* Floating data cards */}
    <g transform="translate(520, 140)" style={{ animation: 'float 4s ease-in-out infinite' }}>
      <rect width="120" height="70" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <rect x="12" y="14" width="50" height="4" rx="2" fill="rgba(250,250,250,0.1)" />
      <rect x="12" y="24" width="35" height="4" rx="2" fill="rgba(200,182,255,0.12)" />
      <rect x="12" y="40" width="96" height="18" rx="4" fill="rgba(200,182,255,0.04)" stroke="rgba(200,182,255,0.1)" strokeWidth="0.5" />
      <text x="60" y="53" textAnchor="middle" fill="rgba(200,182,255,0.3)" fontSize="8" fontFamily="monospace">98.5%</text>
    </g>

    <g transform="translate(160, 380)" style={{ animation: 'float 5s ease-in-out infinite 1s' }}>
      <rect width="110" height="65" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <rect x="12" y="12" width="40" height="4" rx="2" fill="rgba(250,250,250,0.1)" />
      <rect x="12" y="22" width="60" height="4" rx="2" fill="rgba(250,250,250,0.06)" />
      {/* Mini bar chart */}
      <rect x="12" y="48" width="8" height="8" rx="1" fill="rgba(200,182,255,0.15)" />
      <rect x="24" y="42" width="8" height="14" rx="1" fill="rgba(200,182,255,0.2)" />
      <rect x="36" y="38" width="8" height="18" rx="1" fill="rgba(200,182,255,0.25)" />
      <rect x="48" y="44" width="8" height="12" rx="1" fill="rgba(200,182,255,0.15)" />
      <rect x="60" y="36" width="8" height="20" rx="1" fill="rgba(200,182,255,0.3)" />
    </g>

    {/* Scattered particles */}
    {[
      [150, 120], [650, 450], [300, 500], [550, 100], [100, 350],
      [700, 200], [250, 150], [600, 380], [480, 480], [350, 80]
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r={Math.random() * 1.5 + 0.5} fill={`rgba(200,182,255,${0.1 + Math.random() * 0.2})`} style={{ animation: `pulse-glow ${2 + i * 0.3}s ease-in-out infinite ${i * 0.2}s` }} />
    ))}
  </svg>
);

export const FeatureIllustrationAI = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="20" fill="rgba(200,182,255,0.04)" />
    <circle cx="40" cy="32" r="10" stroke="rgba(200,182,255,0.4)" strokeWidth="1.5" fill="none" />
    <path d="M30 52c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="rgba(200,182,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M40 22v-6M52 32h6M28 32h-6M49 23l4-4M31 23l-4-4" stroke="rgba(200,182,255,0.2)" strokeWidth="1" strokeLinecap="round" />
    <circle cx="40" cy="32" r="3" fill="rgba(200,182,255,0.2)" />
  </svg>
);

export const FeatureIllustrationTimer = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="20" fill="rgba(200,182,255,0.04)" />
    <circle cx="40" cy="42" r="18" stroke="rgba(200,182,255,0.3)" strokeWidth="1.5" fill="none" />
    <line x1="40" y1="42" x2="40" y2="30" stroke="rgba(200,182,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="40" y1="42" x2="50" y2="42" stroke="rgba(200,182,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="36" y1="20" x2="44" y2="20" stroke="rgba(200,182,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="40" cy="42" r="2" fill="rgba(200,182,255,0.4)" />
  </svg>
);

export const FeatureIllustrationTarget = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="20" fill="rgba(200,182,255,0.04)" />
    <circle cx="40" cy="40" r="18" stroke="rgba(200,182,255,0.15)" strokeWidth="1" fill="none" />
    <circle cx="40" cy="40" r="12" stroke="rgba(200,182,255,0.25)" strokeWidth="1" fill="none" />
    <circle cx="40" cy="40" r="6" stroke="rgba(200,182,255,0.35)" strokeWidth="1.5" fill="none" />
    <circle cx="40" cy="40" r="2" fill="rgba(200,182,255,0.5)" />
    <line x1="40" y1="18" x2="40" y2="26" stroke="rgba(200,182,255,0.2)" strokeWidth="1" />
    <line x1="40" y1="54" x2="40" y2="62" stroke="rgba(200,182,255,0.2)" strokeWidth="1" />
    <line x1="18" y1="40" x2="26" y2="40" stroke="rgba(200,182,255,0.2)" strokeWidth="1" />
    <line x1="54" y1="40" x2="62" y2="40" stroke="rgba(200,182,255,0.2)" strokeWidth="1" />
  </svg>
);

export const FeatureIllustrationResume = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="20" fill="rgba(200,182,255,0.04)" />
    <rect x="22" y="16" width="36" height="48" rx="4" stroke="rgba(200,182,255,0.3)" strokeWidth="1.5" fill="none" />
    <rect x="30" y="24" width="20" height="3" rx="1.5" fill="rgba(200,182,255,0.2)" />
    <rect x="30" y="31" width="14" height="3" rx="1.5" fill="rgba(200,182,255,0.12)" />
    <line x1="30" y1="40" x2="50" y2="40" stroke="rgba(200,182,255,0.1)" strokeWidth="0.5" />
    <rect x="30" y="45" width="20" height="2" rx="1" fill="rgba(200,182,255,0.08)" />
    <rect x="30" y="50" width="16" height="2" rx="1" fill="rgba(200,182,255,0.08)" />
    <rect x="30" y="55" width="12" height="2" rx="1" fill="rgba(200,182,255,0.08)" />
  </svg>
);

export const FeatureIllustrationChart = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="20" fill="rgba(200,182,255,0.04)" />
    <rect x="18" y="52" width="8" height="14" rx="2" fill="rgba(200,182,255,0.15)" />
    <rect x="30" y="40" width="8" height="26" rx="2" fill="rgba(200,182,255,0.2)" />
    <rect x="42" y="30" width="8" height="36" rx="2" fill="rgba(200,182,255,0.28)" />
    <rect x="54" y="36" width="8" height="30" rx="2" fill="rgba(200,182,255,0.22)" />
    <path d="M22 48 L34 36 L46 26 L58 32" stroke="rgba(200,182,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="48" r="2" fill="rgba(200,182,255,0.5)" />
    <circle cx="34" cy="36" r="2" fill="rgba(200,182,255,0.5)" />
    <circle cx="46" cy="26" r="2" fill="rgba(200,182,255,0.5)" />
    <circle cx="58" cy="32" r="2" fill="rgba(200,182,255,0.5)" />
  </svg>
);

export const FeatureIllustrationShield = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="20" fill="rgba(200,182,255,0.04)" />
    <path d="M40 16 L58 26 V42 C58 54 40 64 40 64 C40 64 22 54 22 42 V26 L40 16Z" stroke="rgba(200,182,255,0.3)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    <path d="M32 40 L38 46 L50 34" stroke="rgba(200,182,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AbstractWave = () => (
  <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
    <path d="M0 100 C360 20, 720 180, 1080 80 S1440 120, 1440 120 V200 H0 Z" fill="rgba(200,182,255,0.02)" />
    <path d="M0 120 C300 60, 600 160, 900 100 S1200 140, 1440 100" stroke="rgba(200,182,255,0.06)" strokeWidth="1" fill="none" />
  </svg>
);
