import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Target, CheckCircle2, XCircle, BarChart3, RotateCcw, Home, ChevronRight, Zap } from 'lucide-react';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-dark">
        <div className="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center mb-6">
          <BarChart3 size={32} className="text-outline" />
        </div>
        <h2 className="text-2xl font-bold text-light mb-2">No Results Found</h2>
        <p className="text-outline mb-8 max-w-xs">We couldn't retrieve the performance data for this session.</p>
        <Link to="/dashboard" className="px-8 py-3 bg-primary text-dark font-bold rounded-xl flex items-center gap-2">
          <Home size={18} /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const scorePercentage = Math.round((result.score / result.total_questions) * 100);
  const isPassed = scorePercentage >= 70;

  return (
    <div className="animate-fade-in p-8 md:p-12 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-[2rem] mb-6 shadow-2xl ${isPassed ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
          <Zap size={32} fill="currentColor" className={isPassed ? 'text-success' : 'text-warning'} />
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-3 text-light">Diagnostic Complete</h1>
        <p className="text-outline max-w-lg mx-auto">The cognitive engine has analyzed your responses and generated a performance profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Score Card */}
        <div className="lg:col-span-8">
           <div className="bg-surface-lowest/50 border border-outline-variant/20 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="text-[10px] font-bold text-outline uppercase tracking-[0.3em] mb-4">Precision Metric</div>
                <div className="relative mb-8">
                   <svg className="w-48 h-48 -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surface-container" />
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary" strokeDasharray={552.92} strokeDashoffset={552.92 - (552.92 * scorePercentage) / 100} strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-bold font-mono text-light tracking-tighter">{scorePercentage}%</span>
                      <span className="text-[8px] font-bold text-outline uppercase tracking-widest mt-1">Accuracy</span>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full max-w-md pt-8 border-t border-outline-variant/10">
                   <div>
                      <div className="text-2xl font-bold text-light font-mono">{result.score}</div>
                      <div className="text-[8px] text-outline uppercase font-bold tracking-widest">Total Correct</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-light font-mono">{result.total_questions}</div>
                      <div className="text-[8px] text-outline uppercase font-bold tracking-widest">Questions</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-warning font-mono">{result.wrong_answers}</div>
                      <div className="text-[8px] text-outline uppercase font-bold tracking-widest">Deductions</div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Side Actions */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           <div className="p-8 bg-surface-lowest/50 border border-outline-variant/20 rounded-[2rem] backdrop-blur-md">
              <h3 className="text-sm font-bold text-light mb-4 flex items-center gap-2">
                 <Target size={16} className="text-primary" /> Analysis Insights
              </h3>
              <p className="text-xs text-outline leading-relaxed mb-6">
                Your performance indicates a strong grasp of {isPassed ? 'foundational concepts' : 'the core subjects'}, though there are opportunities for precision refinement in advanced scenarios.
              </p>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-xs text-light font-medium p-3 bg-surface-container/50 rounded-xl border border-outline-variant/10">
                    <CheckCircle2 size={14} className="text-success" /> {result.correct_answers} Key strengths identified
                 </div>
                 <div className="flex items-center gap-3 text-xs text-light font-medium p-3 bg-surface-container/50 rounded-xl border border-outline-variant/10">
                    <XCircle size={14} className="text-danger" /> {result.wrong_answers} Knowledge gaps detected
                 </div>
              </div>
           </div>

           <button onClick={() => navigate('/exam/setup')} className="w-full py-5 bg-primary text-dark font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-light transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/10">
              <RotateCcw size={16} className="group-hover:-rotate-45 transition-transform" /> Retake Diagnostic
           </button>
           <button onClick={() => navigate('/dashboard')} className="w-full py-5 bg-surface-container border border-outline-variant/20 text-light font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-surface-lowest transition-all flex items-center justify-center gap-2">
              <Home size={16} /> Return to Hub
           </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
