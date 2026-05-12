import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Brain, FileText, BarChart3, Clock, Target,
  ArrowRight, CheckCircle2, Sparkles, Shield, BookOpen, TrendingUp
} from 'lucide-react';

const LandingPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    // Animate elements on mount
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.style.opacity = '1';
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Brain size={22} />,
      title: 'AI-Powered Questions',
      desc: 'Dynamically generated MCQs tailored to your exam, difficulty level, and subjects.',
    },
    {
      icon: <Clock size={22} />,
      title: 'Timed Simulations',
      desc: 'Real exam pressure with smart timing — 5 minutes per 10 questions, scaled to your needs.',
    },
    {
      icon: <Target size={22} />,
      title: 'Precision Analysis',
      desc: 'Detailed breakdowns of correct/wrong answers with AI-driven insights on weak areas.',
    },
    {
      icon: <FileText size={22} />,
      title: 'Resume Analysis',
      desc: 'Upload your resume and get ATS scores, keyword analysis, and improvement suggestions.',
    },
    {
      icon: <BarChart3 size={22} />,
      title: 'Performance Tracking',
      desc: 'Visual analytics dashboard showing your progress over time across all subjects.',
    },
    {
      icon: <Shield size={22} />,
      title: 'Exam-Specific Prep',
      desc: 'Content curated for your target exam — GATE, CAT, UPSC, or any competitive exam.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Questions Generated' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '50+', label: 'Exam Categories' },
    { value: '24/7', label: 'AI Availability' },
  ];

  const steps = [
    { num: '01', title: 'Choose Your Exam', desc: 'Select your target exam and up to 2 subjects to focus on.' },
    { num: '02', title: 'Configure Difficulty', desc: 'Adjust the difficulty slider and set your question count.' },
    { num: '03', title: 'Take the Exam', desc: 'Answer AI-generated MCQs under timed conditions.' },
    { num: '04', title: 'Review & Improve', desc: 'Get detailed analysis, scores, and retry with new questions.' },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(250,250,250,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-light/10 to-transparent" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border-subtle bg-light/[0.03] animate-fade-in">
            <Sparkles size={14} className="text-light-2" />
            <span className="text-xs font-medium text-light-2 tracking-wide">AI-POWERED EXAM PREPARATION</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
            Master Your Career
            <br />
            <span className="text-light-2">with AI Precision</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-lg text-light-2 leading-relaxed mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            AI-generated mock exams, real-time analysis, and intelligent resume reviews — 
            everything you need to crack any competitive exam.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/register"
              id="hero-cta-primary"
              className="flex items-center gap-2 px-8 py-3.5 text-[0.95rem] font-semibold text-dark bg-light rounded-full hover:bg-light/90 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(250,250,250,0.15)] transition-all duration-200"
            >
              <Zap size={16} />
              Start Preparing Free
            </Link>
            <Link
              to="/about"
              id="hero-cta-secondary"
              className="flex items-center gap-2 px-8 py-3.5 text-[0.95rem] font-medium text-light-2 border border-border-subtle rounded-full hover:text-light hover:border-border-hover hover:bg-light/[0.04] transition-all duration-200"
            >
              Learn More
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold font-mono tracking-tight mb-1">{stat.value}</div>
                <div className="text-xs text-light-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="relative py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          {/* Section Header */}
          <div className="text-center mb-16 reveal opacity-0">
            <span className="inline-block text-xs font-mono font-semibold text-light-muted uppercase tracking-widest mb-4">
              FEATURES
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              A systematic approach to
              <br />
              <span className="text-light-2">Interview Supremacy.</span>
            </h2>
            <p className="max-w-lg mx-auto text-light-muted">
              Every tool you need to prepare, practice, and perfect your exam strategy.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {features.map((feature, i) => (
              <div
                key={i}
                className="reveal opacity-0 group p-6 rounded-xl border border-border-subtle bg-light/[0.02] hover:bg-light/[0.04] hover:border-border-hover transition-all duration-300 cursor-default"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-light/[0.06] border border-border-subtle mb-4 text-light group-hover:bg-light/[0.1] transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-light-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-24 lg:py-32 dot-pattern">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="text-center mb-16 reveal opacity-0">
            <span className="inline-block text-xs font-mono font-semibold text-light-muted uppercase tracking-widest mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Four steps to
              <br />
              <span className="text-light-2">Precision Preparation.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {steps.map((step, i) => (
              <div key={i} className="reveal opacity-0 relative p-6 rounded-xl border border-border-subtle bg-dark-card hover:border-border-hover transition-all duration-300">
                <span className="block text-3xl font-bold font-mono text-light/[0.06] mb-3">{step.num}</span>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-light-muted leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border-subtle" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="reveal opacity-0 relative overflow-hidden rounded-2xl border border-border-subtle bg-light/[0.02] p-10 lg:p-16 text-center">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(250,250,250,0.05)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                Ready to crack your next exam?
              </h2>
              <p className="max-w-md mx-auto text-light-muted mb-8">
                Join thousands of aspirants already preparing smarter with AI-powered practice.
              </p>
              <Link
                to="/register"
                id="cta-bottom"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-[0.95rem] font-semibold text-dark bg-light rounded-full hover:bg-light/90 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(250,250,250,0.15)] transition-all duration-200"
              >
                <Zap size={16} />
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border-subtle py-10">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-light-muted" />
              <span className="font-semibold text-sm">CrackIQ</span>
              <span className="text-xs text-light-dim">© 2026</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/about" className="text-sm text-light-muted hover:text-light transition-colors">About</Link>
              <Link to="#" className="text-sm text-light-muted hover:text-light transition-colors">Privacy</Link>
              <Link to="#" className="text-sm text-light-muted hover:text-light transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
