import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Brain, ArrowRight, Zap } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation placeholder
    if (!form.email) return setErrors({ email: 'Email is required' });
    if (!form.password) return setErrors({ password: 'Password is required' });
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-dark-2 border-r border-border-subtle overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(250,250,250,0.03)_0%,transparent_70%)]" />
        
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-light/[0.05] border border-border-subtle mx-auto mb-8 animate-float">
            <Brain size={30} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Welcome back to
            <br />
            <span className="text-light-2">CrackIQ</span>
          </h2>
          <p className="text-light-muted leading-relaxed mb-8">
            Your AI mentor is ready. Pick up where you left off and keep pushing toward your target score.
          </p>
          <div className="flex items-center justify-center gap-6 text-light-dim">
            <div className="text-center">
              <div className="text-lg font-bold font-mono text-light">42:15</div>
              <div className="text-[0.65rem] uppercase tracking-wider">Avg Session</div>
            </div>
            <div className="w-px h-8 bg-border-subtle" />
            <div className="text-center">
              <div className="text-lg font-bold font-mono text-light">85%</div>
              <div className="text-[0.65rem] uppercase tracking-wider">Accuracy</div>
            </div>
            <div className="w-px h-8 bg-border-subtle" />
            <div className="text-center">
              <div className="text-lg font-bold font-mono text-light">156</div>
              <div className="text-[0.65rem] uppercase tracking-wider">Exams Taken</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2 text-light-muted hover:text-light transition-colors">
            <Brain size={20} />
            <span className="font-semibold text-sm">CrackIQ</span>
          </Link>
        </div>

        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Sign in</h1>
            <p className="text-sm text-light-muted">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              id="login-email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail size={16} />}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              id="login-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={16} />}
              required
            />

            <div className="flex items-center justify-between text-xs mt-1">
              <label className="flex items-center gap-2 text-light-muted cursor-pointer">
                <input type="checkbox" className="accent-light w-3.5 h-3.5" />
                Remember me
              </label>
              <Link to="#" className="text-light-2 hover:text-light transition-colors">Forgot password?</Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
              id="login-submit"
              className="mt-2"
              icon={<ArrowRight size={16} />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-light-muted">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-light font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
