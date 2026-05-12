import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Brain, ArrowRight, Zap } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return setErrors({ name: 'Name is required' });
    if (!form.email) return setErrors({ email: 'Email is required' });
    if (!form.password) return setErrors({ password: 'Password is required' });
    if (form.password !== form.confirmPassword) return setErrors({ confirmPassword: 'Passwords do not match' });
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const benefits = ['AI-generated exam questions', 'Smart resume analyzer', 'Performance analytics dashboard'];

  return (
    <div className="min-h-screen flex">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-dark-2 border-r border-border-subtle overflow-hidden">
        <div className="absolute inset-0 dot-pattern" />
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-light/[0.05] border border-border-subtle mx-auto mb-8 animate-float">
            <Zap size={30} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Begin your journey to<br /><span className="text-light-2">Precision Preparation.</span></h2>
          <p className="text-light-muted leading-relaxed mb-8">Create an account and get instant access to AI-powered mock exams and performance tracking.</p>
          <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
            {benefits.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-light-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-light/[0.08] text-[0.65rem] font-bold">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2 text-light-muted hover:text-light transition-colors"><Brain size={20} /><span className="font-semibold text-sm">CrackIQ</span></Link>
        </div>
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Create Account</h1>
            <p className="text-sm text-light-muted">Get started with your free CrackIQ account.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" name="name" id="register-name" placeholder="John Doe" value={form.name} onChange={handleChange} error={errors.name} icon={<User size={16} />} required />
            <Input label="Email" type="email" name="email" id="register-email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} icon={<Mail size={16} />} required />
            <Input label="Password" type="password" name="password" id="register-password" placeholder="••••••••" value={form.password} onChange={handleChange} error={errors.password} icon={<Lock size={16} />} required />
            <Input label="Confirm Password" type="password" name="confirmPassword" id="register-confirm" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={<Lock size={16} />} required />
            <Button type="submit" variant="primary" size="md" fullWidth loading={loading} id="register-submit" className="mt-2" icon={<ArrowRight size={16} />}>Create Account</Button>
          </form>
          <p className="mt-6 text-center text-sm text-light-muted">Already have an account? <Link to="/login" className="text-light font-medium hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
