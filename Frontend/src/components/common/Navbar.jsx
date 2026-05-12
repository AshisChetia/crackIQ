import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain, Zap } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/exam/setup', label: 'Mock Exams' },
    { path: '/resume', label: 'Resume Lab' },
    { path: '/history', label: 'History' },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 transition-all duration-300
        ${scrolled ? 'bg-dark/85 backdrop-blur-xl border-b border-border-subtle' : 'bg-transparent'}`}
    >
      <div className="flex items-center justify-between max-w-[1280px] mx-auto h-16">
        {/* Brand */}
        <Link to="/" id="nav-brand" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-light/[0.03] border border-border-subtle">
            <Brain size={20} strokeWidth={1.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">CrackIQ</span>
          <span className="font-mono text-[0.6rem] font-semibold tracking-widest px-1.5 py-0.5 rounded-full bg-light/[0.08] text-light-muted border border-border-subtle">
            BETA
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              id={`nav-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              className={`relative px-3.5 py-1.5 text-sm font-medium rounded-md transition-all duration-150
                ${location.pathname === link.path
                  ? 'text-light'
                  : 'text-light-2 hover:text-light hover:bg-light/[0.04]'
                }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-light animate-scale-in" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            id="nav-login-btn"
            className="px-4 py-2 text-sm font-medium text-light-2 rounded-full hover:text-light hover:bg-light/[0.04] transition-all duration-150"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            id="nav-register-btn"
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-dark bg-light rounded-full hover:bg-light/90 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(250,250,250,0.1)] transition-all duration-150"
          >
            <Zap size={14} />
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          id="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-[10px] border border-border-subtle bg-transparent text-light cursor-pointer hover:bg-light/[0.04] transition-all duration-150"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col p-4 border-t border-border-subtle bg-dark/95 backdrop-blur-xl animate-fade-in-down">
          <div className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 text-[0.95rem] font-medium rounded-[10px] transition-all duration-150
                  ${location.pathname === link.path
                    ? 'text-light bg-light/[0.04]'
                    : 'text-light-2 hover:text-light hover:bg-light/[0.04]'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/login" className="w-full text-center px-4 py-2.5 text-sm font-medium text-light-2 rounded-full hover:text-light hover:bg-light/[0.04] transition-all">
              Sign In
            </Link>
            <Link to="/register" className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-dark bg-light rounded-full hover:bg-light/90 transition-all">
              <Zap size={14} />
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
