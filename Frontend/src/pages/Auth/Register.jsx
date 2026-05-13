import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import api from '../../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      formRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.name) return setErrors({ name: 'Name is required' });
    if (!form.email) return setErrors({ email: 'Email is required' });
    if (!form.password) return setErrors({ password: 'Password is required' });
    
    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setErrors({ email: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col-reverse lg:flex-row font-sans grain relative overflow-hidden">
      {/* ─── LEFT PANEL (Form) ─── */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-16 relative">
        {/* Header (Visible on all screens) */}
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-3 group">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="transition-transform group-hover:scale-110 duration-300">
              <circle cx="16" cy="16" r="12" stroke="#cfbcff" strokeWidth="2" opacity="0.8" />
              <path d="M16 8 L16 24 M10 12 L16 8 L22 12 M10 20 L16 24 L22 20" stroke="#cfbcff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-display font-bold text-light text-xl tracking-tight">CrackIQ</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] mt-16 lg:mt-0" ref={formRef}>
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold text-light tracking-[-0.02em] mb-3">Initialize Account</h1>
            <p className="text-on-surface-variant text-sm">Create your profile to access AI-driven diagnostics.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-outline">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className={`w-full bg-surface-lowest border ${errors.name ? 'border-danger' : 'border-outline-variant/30'} rounded-xl px-5 py-4 text-light placeholder:text-outline focus:outline-none focus:border-primary focus:bg-surface-container transition-all`}
              />
              {errors.name && <span className="text-[11px] text-danger mt-1">{errors.name}</span>}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-outline">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-surface-lowest border ${errors.email ? 'border-danger' : 'border-outline-variant/30'} rounded-xl px-5 py-4 text-light placeholder:text-outline focus:outline-none focus:border-primary focus:bg-surface-container transition-all`}
              />
              {errors.email && <span className="text-[11px] text-danger mt-1">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-outline">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`w-full bg-surface-lowest border ${errors.password ? 'border-danger' : 'border-outline-variant/30'} rounded-xl px-5 py-4 text-light placeholder:text-outline focus:outline-none focus:border-primary focus:bg-surface-container transition-all`}
              />
              {errors.password && <span className="text-[11px] text-danger mt-1">{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-primary text-dark font-semibold text-xs tracking-[0.1em] uppercase py-4 rounded-xl hover:bg-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(207,188,255,0.15)]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-dark/20 border-t-dark rounded-full animate-spin-slow" />
              ) : (
                <>
                  Create Profile
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-outline">
              Already initialized?{' '}
              <Link to="/login" className="text-light font-semibold hover:text-primary transition-colors underline decoration-outline-variant underline-offset-4">
                Authenticate here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL (Branding) ─── */}
      <div className="hidden lg:flex w-[45%] relative border-l border-outline-variant/10 flex-col justify-center p-16 overflow-hidden bg-surface-low/50">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(207,188,255,0.06)_0%,transparent_60%)]" />
          <div className="absolute top-1/4 left-1/4 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-45" />
          <div className="absolute top-1/3 left-1/3 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent -rotate-45" />
        </div>

        <div className="relative z-10">
          <div className="w-12 h-px bg-primary/40 mb-8" />
          <h2 className="font-display text-5xl font-bold text-light tracking-[-0.03em] leading-[1.1] mb-8">
            Establish your<br />
            <span className="text-on-surface-variant">cognitive baseline.</span>
          </h2>
          
          <div className="flex flex-col gap-5 mt-10">
            {[
              { title: 'Adaptive Engine', desc: 'Real-time difficulty scaling based on neural models.' },
              { title: 'Resume ATS Analysis', desc: 'Identify critical keyword gaps before submission.' },
              { title: 'Precision Metrics', desc: 'Granular insights into your conceptual weaknesses.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-6 h-6 mt-0.5 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 shrink-0">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-light mb-1">{item.title}</h4>
                  <p className="text-xs text-outline leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
