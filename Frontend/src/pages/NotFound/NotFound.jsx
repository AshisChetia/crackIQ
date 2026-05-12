import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <div className="text-8xl font-bold font-mono text-light/[0.06] mb-4">404</div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Page not found</h1>
        <p className="text-sm text-light-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-dark bg-light rounded-full hover:bg-light/90 hover:-translate-y-0.5 transition-all">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
