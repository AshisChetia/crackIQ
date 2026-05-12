import { Link } from 'react-router-dom';
import { Brain, Target, Zap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-light/[0.05] border border-border-subtle mb-6">
            <Brain size={26} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">About CrackIQ</h1>
          <p className="text-light-muted leading-relaxed max-w-lg mx-auto">
            An AI-powered exam preparation platform designed to help students and professionals crack competitive exams with precision and confidence.
          </p>
        </div>

        <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <div className="rounded-xl border border-border-subtle bg-light/[0.02] p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Target size={16} /> Our Mission</h2>
            <p className="text-sm text-light-muted leading-relaxed">To democratize exam preparation by providing AI-driven, personalized mock tests and analytics that adapt to each student's strengths and weaknesses — making world-class preparation accessible to everyone.</p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-light/[0.02] p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Zap size={16} /> What Makes Us Different</h2>
            <ul className="flex flex-col gap-2 text-sm text-light-muted">
              <li className="flex items-start gap-2"><span className="text-light mt-0.5">•</span>AI generates unique questions every session — no repeated question banks</li>
              <li className="flex items-start gap-2"><span className="text-light mt-0.5">•</span>Real-time performance analytics with weak-area identification</li>
              <li className="flex items-start gap-2"><span className="text-light mt-0.5">•</span>Smart resume analyzer aligned with your target job/exam</li>
              <li className="flex items-start gap-2"><span className="text-light mt-0.5">•</span>Timed simulations that replicate actual exam pressure</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <p className="text-sm text-light-dim">Built with ❤ by the CrackIQ team</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
