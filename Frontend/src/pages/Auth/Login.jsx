import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import api from '../../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
    if (!form.email) return setErrors({ email: 'Email is required' });
    if (!form.password) return setErrors({ password: 'Password is required' });
    
    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setErrors({ email: err.response?.data?.message || 'Authentication failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex font-sans grain relative overflow-hidden">
      {/* ─── LEFT PANEL (Branding) ─── */}
      <div className="hidden lg:flex w-[45%] relative border-r border-outline-variant/10 flex-col justify-between p-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(207,188,255,0.08)_0%,transparent_60%)]" />
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" patternUnits="userSpaceOnUse" width="40" height="40">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cfbcff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect fill="url(#grid-pattern)" width="100%" height="100%" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group w-max">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="transition-transform group-hover:scale-110 duration-300">
              <circle cx="16" cy="16" r="12" stroke="#cfbcff" strokeWidth="2" opacity="0.8" />
              <path d="M16 8 L16 24 M10 12 L16 8 L22 12 M10 20 L16 24 L22 20" stroke="#cfbcff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-display text-xl tracking-tight font-bold text-light">CrackIQ</span>
          </Link>
        </div>

        <div className="relative z-10 mb-12">
          <div className="w-12 h-px bg-primary/40 mb-8" />
          <h2 className="font-display text-5xl font-bold text-light tracking-[-0.03em] leading-[1.1] mb-6">
            Resume your<br />
            <span className="text-on-surface-variant">cognitive training.</span>
          </h2>
          <p className="text-lg text-outline max-w-sm leading-relaxed">
            Access your personalized analytics dashboard and pick up exactly where you left off.
          </p>
        </div>
      </div>

      {/* ─── RIGHT PANEL (Form) ─── */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-16 relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="#cfbcff" strokeWidth="2" opacity="0.8" />
              <path d="M16 8 L16 24 M10 12 L16 8 L22 12 M10 20 L16 24 L22 20" stroke="#cfbcff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-display font-bold text-light">CrackIQ</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px]" ref={formRef}>
          <div className="mb-12">
            <h1 className="font-display text-4xl font-bold text-light tracking-[-0.02em] mb-3">Sign in</h1>
            <p className="text-on-surface-variant text-sm">Authenticate to access the intelligence platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-outline">Password</label>
                <Link to="#" className="text-[10px] font-semibold uppercase tracking-widest text-primary hover:text-light transition-colors">Forgot?</Link>
              </div>
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
              className="mt-4 w-full bg-light text-dark font-semibold text-xs tracking-[0.1em] uppercase py-4 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-dark/20 border-t-dark rounded-full animate-spin-slow" />
              ) : (
                <>
                  Authenticate
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-outline">
              Don't have an account?{' '}
              <Link to="/register" className="text-light font-semibold hover:text-primary transition-colors underline decoration-outline-variant underline-offset-4">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
