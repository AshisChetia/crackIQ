import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Landing Header: Logo + Login/Get Started (matches Stitch) ─── */
const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-16 py-4 max-w-[1440px] mx-auto transition-all duration-500
        ${scrolled ? 'bg-dark/50 backdrop-blur-xl border-b border-outline-variant/10' : 'bg-transparent'}`}
    >
      <div className="flex items-center gap-2">
        {/* Logo icon */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="hidden md:block">
          <circle cx="16" cy="16" r="12" stroke="#cfbcff" strokeWidth="1.5" opacity="0.6" />
          <path d="M16 8 L16 24 M10 12 L16 8 L22 12 M10 20 L16 24 L22 20" stroke="#cfbcff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-display text-xl tracking-tight font-semibold text-light">CrackIQ</span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-xs font-semibold tracking-[0.1em] uppercase text-on-surface-variant hover:text-light transition-colors duration-300 px-5 py-2.5 border border-outline-variant/30 bg-surface-lowest/30 rounded-full backdrop-blur-md"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-xs font-semibold tracking-[0.1em] uppercase bg-light text-dark hover:bg-surface-bright hover:text-light transition-all duration-300 px-6 py-2.5 rounded-full border border-transparent hover:border-outline-variant shadow-[0_0_15px_rgba(250,250,250,0.1)]"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
};

/* ─── Main Landing Page (matches Stitch design exactly) ─── */
const LandingPage = () => {
  const heroRef = useRef(null);
  const assessmentRef = useRef(null);
  const analyticsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero entrance */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.3 })
        .fromTo('.hero-headline', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.15 }, '-=0.3')
        .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-cta-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .fromTo('.hero-glass-panel', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8');

      /* Scroll-triggered sections */
      gsap.utils.toArray('.reveal-section').forEach((section) => {
        gsap.fromTo(section,
          { y: 50, opacity: 0 },
          { scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      });

      /* Assessment card */
      gsap.fromTo('.assessment-card',
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: assessmentRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );

      /* Analytics section */
      gsap.utils.toArray('.analytics-card').forEach((card, i) => {
        gsap.fromTo(card,
          { y: 30, opacity: 0 },
          { scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: 'power2.out' }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen grain" style={{ fontFamily: "'Geist', 'Outfit', system-ui, sans-serif" }}>
      <LandingHeader />

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section ref={heroRef} className="min-h-screen flex items-center pt-[100px] pb-32 px-4 md:px-16 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Neural grid */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" patternUnits="userSpaceOnUse" width="60" height="60">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(250,250,250,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect fill="url(#grid)" width="100%" height="100%" />
            <circle cx="15%" cy="25%" r="2" fill="#FAFAFA" opacity="0.6" />
            <circle cx="35%" cy="45%" r="3" fill="#FAFAFA" opacity="0.4" />
            <circle cx="75%" cy="30%" r="2" fill="#FAFAFA" opacity="0.5" />
            <circle cx="65%" cy="65%" r="4" fill="#FAFAFA" opacity="0.3" />
            <circle cx="85%" cy="75%" r="1.5" fill="#FAFAFA" opacity="0.7" />
            <circle cx="25%" cy="70%" r="2.5" fill="#FAFAFA" opacity="0.5" />
            <line x1="15%" y1="25%" x2="35%" y2="45%" stroke="rgba(250,250,250,0.08)" strokeWidth="1" />
            <line x1="35%" y1="45%" x2="75%" y2="30%" stroke="rgba(250,250,250,0.08)" strokeWidth="1" />
            <line x1="75%" y1="30%" x2="65%" y2="65%" stroke="rgba(250,250,250,0.08)" strokeWidth="1" />
            <line x1="65%" y1="65%" x2="85%" y2="75%" stroke="rgba(250,250,250,0.08)" strokeWidth="1" />
            <line x1="35%" y1="45%" x2="25%" y2="70%" stroke="rgba(250,250,250,0.05)" strokeWidth="1" />
            <line x1="25%" y1="70%" x2="65%" y2="65%" stroke="rgba(250,250,250,0.05)" strokeWidth="1" />
          </svg>
          {/* Glow effects — reduced blur for performance */}
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/15 rounded-full mix-blend-screen blur-[80px] opacity-35 translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-primary-container/15 rounded-full mix-blend-screen blur-[60px] opacity-25 -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="max-w-[1440px] w-full mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mt-8">
          {/* Left — Typography */}
          <div className="lg:col-span-7 flex flex-col gap-16">
            <div className="flex flex-col gap-6 relative">
              {/* Decorative circles */}
              <div className="absolute -top-12 -left-12 w-24 h-24 border border-outline-variant/20 rounded-full hidden md:flex items-center justify-center opacity-50">
                <div className="w-12 h-12 border border-primary/30 rounded-full" />
              </div>

              <span className="hero-label text-xs font-semibold tracking-[0.2em] uppercase text-primary z-10">
                The Next Evolution in Test Prep
              </span>

              <h1 className="hero-headline font-display text-[60px] md:text-[88px] lg:text-[110px] leading-[0.95] text-light tracking-[-0.04em] font-bold z-10">
                Precision<br />
                <span className="text-on-surface-variant/80">Intelligence</span>
              </h1>
            </div>

            <p className="hero-desc text-lg leading-relaxed text-on-surface-variant max-w-lg">
              An AI-driven adaptive learning experience that maps your cognitive strengths and surgically targets your weaknesses in real-time.
            </p>

            <div className="flex gap-4 mt-2">
              <Link
                to="/register"
                className="hero-cta-btn text-xs font-semibold tracking-[0.1em] uppercase bg-light text-dark hover:bg-surface-bright hover:text-light transition-all duration-300 px-8 py-4 rounded-full flex items-center gap-2 border border-transparent hover:border-outline-variant shadow-[0_10px_30px_rgba(250,250,250,0.1)]"
              >
                Get Started
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Right — Glass Panel (Cognitive Challenge) */}
          <div className="hero-glass-panel lg:col-span-5 relative lg:mt-0 mt-16">
            <div className="bg-surface-lowest/60 border border-outline-variant/20 rounded-2xl p-8 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* Glass edge highlight */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-light/30 to-transparent" />
              <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl z-[-1] blur-xl" />

              <div className="flex flex-col gap-8 relative z-10">
                <div className="flex flex-col gap-2 mb-2">
                  <h3 className="font-display text-2xl tracking-tight text-light">Cognitive Challenge</h3>
                  <p className="text-sm text-outline">Configure your simulation parameters.</p>
                </div>

                {/* Target Domain */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-outline">Target Domain</label>
                  <div className="bg-dark/80 border border-outline-variant/30 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-surface-bright/50 hover:border-outline-variant transition-all backdrop-blur-sm">
                    <span className="text-base text-light">Advanced Machine Learning</span>
                    <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                  </div>
                </div>

                {/* Cognitive Load slider */}
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-outline">Cognitive Load</label>
                    <span className="text-xs font-semibold tracking-[0.1em] uppercase text-primary">Hard</span>
                  </div>
                  <div className="h-1.5 bg-dark rounded-full w-full overflow-hidden mt-3 backdrop-blur-sm">
                    <div className="h-full bg-gradient-to-r from-surface-bright via-primary-container to-primary w-3/4 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-light rounded-full shadow-[0_0_10px_rgba(207,188,255,0.8)]" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] uppercase tracking-widest text-outline-variant">Foundational</span>
                    <span className="text-[9px] uppercase tracking-widest text-outline-variant">Mastery</span>
                  </div>
                </div>

                {/* Volume */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-outline">Volume</label>
                  <div className="flex gap-2">
                    {['10', '20', '50', '∞'].map((v, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-xl py-3 text-center cursor-pointer text-base backdrop-blur-sm transition-all ${
                          i === 1
                            ? 'bg-primary/10 border border-primary/40 text-primary shadow-[0_0_20px_rgba(207,188,255,0.15)]'
                            : 'bg-dark/80 border border-outline-variant/30 hover:bg-surface-bright/50'
                        }`}
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                </div>

                <button className="mt-4 bg-light text-dark text-xs font-semibold tracking-[0.1em] uppercase py-4 rounded-xl w-full hover:bg-surface-bright hover:text-light hover:border-outline-variant transition-all border border-transparent shadow-[0_10px_20px_rgba(250,250,250,0.05)]">
                  Initialize Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ASSESSMENT PREVIEW ═══════════════════════ */}
      <section ref={assessmentRef} className="px-4 md:px-16 max-w-[1440px] mx-auto w-full py-32 relative mt-32">
        <div className="absolute inset-0 bg-surface-lowest skew-y-[-2deg] z-[-1]" />

        <div className="flex flex-col items-center gap-16 reveal-section">
          <div className="text-center flex flex-col gap-4 max-w-2xl">
            <h2 className="font-display text-[32px] font-semibold tracking-[-0.02em]">Real-Time Precision Assessment</h2>
            <p className="text-base leading-relaxed text-on-surface-variant">Experience high-fidelity exam conditions with instant, AI-driven performance analytics.</p>
          </div>

          <div className="assessment-card w-full max-w-3xl bg-surface-container rounded-xl border border-outline-variant/50 p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
            {/* Timer bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-surface-dim">
              <div className="h-full bg-primary w-[65%]" />
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-semibold tracking-[0.1em] uppercase text-outline">Question 14 of 20</span>
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>timer</span>
                <span className="text-xs font-semibold tracking-[0.1em] uppercase">01:42</span>
              </div>
            </div>

            <h3 className="text-lg leading-relaxed text-light mb-8">
              In the context of backpropagation in deep neural networks, which of the following best describes the vanishing gradient problem?
            </h3>

            <div className="flex flex-col gap-4">
              {/* Option A */}
              <div className="p-4 border border-outline-variant rounded-lg bg-dark hover:bg-surface-bright/50 transition-colors cursor-pointer flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-xs text-outline shrink-0">A</div>
                <span className="text-base">The loss function fails to converge to a global minimum due to high learning rates.</span>
              </div>

              {/* Option B (selected/correct) */}
              <div className="p-4 border border-primary rounded-lg bg-primary/10 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                <div className="w-6 h-6 rounded-full bg-primary text-dark flex items-center justify-center text-xs font-bold shrink-0">B</div>
                <span className="text-base text-light">Gradients become infinitesimally small as they propagate backward through deep layers, halting weight updates.</span>
              </div>

              {/* Option C */}
              <div className="p-4 border border-outline-variant rounded-lg bg-dark hover:bg-surface-bright/50 transition-colors cursor-pointer flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-xs text-outline shrink-0">C</div>
                <span className="text-base">The network overfits the training data, causing validation gradients to diverge.</span>
              </div>
            </div>

            {/* AI Analysis chip */}
            <div className="mt-8 p-4 bg-dark border border-outline-variant rounded-lg flex items-start gap-4">
              <div className="bg-surface-bright p-2 rounded-full mt-1 shrink-0">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <span className="text-xs font-semibold tracking-[0.1em] uppercase text-primary mb-1 block">AI Analysis</span>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Correct. The vanishing gradient problem primarily affects deep networks using activation functions like sigmoid or tanh, where the derivative is less than 1, causing exponential decay of the gradient during chain rule application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ANALYTICS / SCORE SECTION ═══════════════════════ */}
      <section ref={analyticsRef} className="px-4 md:px-16 max-w-[1440px] mx-auto w-full mb-32 mt-32">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Left — Score cards */}
          <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
            {/* Main Score */}
            <div className="analytics-card col-span-2 bg-surface-low border border-outline-variant/30 rounded-xl p-8 flex flex-col items-center justify-center gap-4">
              <span className="text-xs font-semibold tracking-[0.1em] uppercase text-outline">Cognitive Readiness Score</span>
              <div className="text-[64px] font-display tracking-[-0.04em] leading-none text-light flex items-baseline font-bold">
                84<span className="text-[32px] text-outline-variant">%</span>
              </div>
              <div className="h-1 w-full bg-dark mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[84%]" />
              </div>
            </div>

            {/* Accuracy */}
            <div className="analytics-card bg-surface-low border border-outline-variant/30 rounded-xl p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                <span className="text-xs font-semibold tracking-[0.1em] uppercase">Accuracy</span>
              </div>
              <span className="font-display text-[32px] font-semibold tracking-[-0.02em]">18/20</span>
            </div>

            {/* Avg Time */}
            <div className="analytics-card bg-surface-low border border-outline-variant/30 rounded-xl p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>speed</span>
                <span className="text-xs font-semibold tracking-[0.1em] uppercase">Avg Time</span>
              </div>
              <span className="font-display text-[32px] font-semibold tracking-[-0.02em]">1m 12s</span>
            </div>
          </div>

          {/* Right — Copy */}
          <div className="md:w-1/2 flex flex-col gap-6 reveal-section">
            <h2 className="font-display text-[32px] font-semibold tracking-[-0.02em]">Post-Simulate Analytics</h2>
            <p className="text-base leading-relaxed text-on-surface-variant">
              Our diagnostics break down your performance by conceptual sub-domains, immediately identifying gaps in your knowledge architecture.
            </p>
            <div className="mt-4 flex gap-4">
              <Link
                to="/register"
                className="text-xs font-semibold tracking-[0.1em] uppercase bg-light text-dark hover:opacity-90 transition-opacity px-6 py-3 rounded-full flex items-center gap-2"
              >
                Review Weaknesses
              </Link>
              <button className="text-xs font-semibold tracking-[0.1em] uppercase border border-outline-variant text-light hover:bg-surface-bright/50 transition-colors px-6 py-3 rounded-full flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>refresh</span>
                Retake Failed
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ RESUME INTELLIGENCE SECTION ═══════════════════════ */}
      <section className="px-4 md:px-16 max-w-[1440px] mx-auto w-full py-32 relative">
        <div className="absolute inset-0 bg-surface-lowest skew-y-[2deg] z-[-1]" />

        <div className="flex flex-col md:flex-row gap-16 items-center reveal-section">
          {/* Left — Copy */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
              Resume Intelligence
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
              ATS-Optimized<br />
              <span className="text-on-surface-variant/80">Resume Analysis</span>
            </h2>
            <p className="text-base leading-relaxed text-on-surface-variant max-w-lg">
              Upload your resume and receive instant AI-powered feedback. Our engine simulates how Applicant Tracking Systems parse your document, identifies keyword gaps, and provides actionable optimization strategies.
            </p>
            <div className="mt-4 flex gap-4">
              <Link
                to="/register"
                className="text-xs font-semibold tracking-[0.1em] uppercase bg-light text-dark hover:opacity-90 transition-opacity px-6 py-3 rounded-full flex items-center gap-2"
              >
                Analyze Your Resume
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Right — Resume Preview Card */}
          <div className="md:w-1/2 w-full">
            <div className="analytics-card bg-surface-lowest/60 border border-outline-variant/20 rounded-2xl p-8 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
              {/* Glass edge */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-light/20 to-transparent" />

              {/* ATS Score Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-light">Resume_JohnDoe.pdf</h4>
                    <p className="text-[11px] text-outline">Analyzed 2 seconds ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[36px] font-display font-bold tracking-[-0.03em] text-light leading-none">
                    72<span className="text-[18px] text-outline-variant">%</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-primary">ATS Score</span>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-1.5 bg-dark rounded-full w-full overflow-hidden mb-8">
                <div className="h-full rounded-full relative" style={{ width: '72%', background: 'linear-gradient(to right, #6750a4, #cfbcff)' }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-light rounded-full shadow-[0_0_8px_rgba(207,188,255,0.8)]" />
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-dark/60 border border-outline-variant/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-display font-bold text-light">8/12</div>
                  <div className="text-[9px] uppercase tracking-wider text-outline mt-1">Keywords</div>
                </div>
                <div className="bg-dark/60 border border-outline-variant/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-display font-bold text-primary">Good</div>
                  <div className="text-[9px] uppercase tracking-wider text-outline mt-1">Formatting</div>
                </div>
                <div className="bg-dark/60 border border-outline-variant/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-display font-bold text-light">3</div>
                  <div className="text-[9px] uppercase tracking-wider text-outline mt-1">Issues</div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-outline">AI Recommendations</span>

                <div className="flex items-start gap-3 p-3 bg-dark/40 border border-outline-variant/15 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>add_circle</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Add <span className="text-primary font-medium">"machine learning"</span>, <span className="text-primary font-medium">"TensorFlow"</span> to match target job keywords.</p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-dark/40 border border-outline-variant/15 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Quantify achievements — replace <span className="text-outline line-through">"improved performance"</span> with measurable metrics.</p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-dark/40 border border-outline-variant/15 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>warning</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Remove graphics/tables — most ATS parsers fail to read visual elements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <footer className="bg-surface-dim text-light w-full py-16 flex flex-col md:flex-row justify-between items-center px-4 md:px-16 gap-8 md:gap-0 border-t border-surface-lowest mt-32">
        <div className="font-display text-xl font-semibold text-light">CrackIQ</div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex gap-6 text-xs font-semibold tracking-[0.1em] uppercase text-outline">
            <a className="hover:text-light transition-colors duration-200" href="#">Privacy Policy</a>
            <a className="hover:text-light transition-colors duration-200" href="#">Terms of Service</a>
            <a className="hover:text-light transition-colors duration-200" href="#">AI Ethics</a>
            <a className="hover:text-light transition-colors duration-200" href="#">Contact</a>
          </div>
          <div className="text-sm text-outline-variant mt-4 md:mt-0">
            © 2024 CrackIQ. Precision Intelligence for High-Stakes Exams.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
