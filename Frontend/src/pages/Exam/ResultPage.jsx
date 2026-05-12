import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, ChevronDown, Clock, Target } from 'lucide-react';

const ResultPage = () => {
  const score = 85;
  const totalTime = '42:15';
  const results = [
    { q: 'Q.01', topic: 'Distributed Transactions', correct: true, yourAnswer: 'Saga Pattern', correctAnswer: 'Saga Pattern', analysis: 'Employed the Strangler Fig pattern to systematically decouple services while maintaining CI/CD velocity.' },
    { q: 'Q.02', topic: 'Data Structure Efficiency', correct: false, yourAnswer: 'Hash Table', correctAnswer: 'Balanced BST', analysis: 'While Hash Tables offer O(1) average case, balanced BSTs provide guaranteed O(log n) worst case.' },
    { q: 'Q.03', topic: 'Kernel Architecture', correct: true, yourAnswer: 'Better Modularity', correctAnswer: 'Better Modularity', analysis: 'Microkernels offer superior fault isolation by running services in user space.' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-light-muted hover:text-light mb-8 transition-colors">
          <ArrowLeft size={14} /> Return to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Card */}
          <div className="lg:col-span-1 rounded-2xl border border-border-subtle bg-light/[0.02] p-6 text-center animate-fade-in-up self-start">
            <div className="text-[0.65rem] font-mono text-light-muted uppercase tracking-widest mb-2">Assessment Complete</div>
            <div className="text-6xl font-bold font-mono tracking-tighter mb-1">{score}<span className="text-2xl text-light-dim">/100</span></div>
            <div className="text-xs text-light-muted mb-6">Advanced Cognitive Fit</div>
            <div className="flex items-center justify-center gap-4 mb-6 text-light-dim">
              <div className="flex items-center gap-1.5 text-xs"><Clock size={12} />{totalTime}</div>
              <div className="flex items-center gap-1.5 text-xs"><Target size={12} />{results.filter(r => r.correct).length}/{results.length} correct</div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="w-full px-4 py-2.5 text-sm font-semibold text-dark bg-light rounded-full hover:bg-light/90 transition-all cursor-pointer border-none">
                <span className="flex items-center justify-center gap-2"><RotateCcw size={14} /> Retake with Same Parameters</span>
              </button>
              <Link to="/exam/setup" className="w-full px-4 py-2.5 text-sm font-medium text-light-2 border border-border-subtle rounded-full hover:bg-light/[0.04] transition-all text-center">
                New Exam
              </Link>
            </div>
          </div>

          {/* Response Analysis */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
            <h2 className="text-lg font-bold mb-4">Response Analysis</h2>
            <div className="flex flex-col gap-3">
              {results.map((r, i) => (
                <div key={i} className={`rounded-xl border p-5 transition-all ${r.correct ? 'border-green-500/20 bg-green-500/[0.03]' : 'border-red-500/20 bg-red-500/[0.03]'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {r.correct ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
                      <span className="text-xs font-mono text-light-muted">{r.q}</span>
                    </div>
                    <span className="text-xs text-light-dim">{r.topic}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-[0.65rem] text-light-dim uppercase tracking-wider mb-1">Your Answer</div>
                      <div className={`text-sm font-medium ${r.correct ? 'text-green-400' : 'text-red-400'}`}>{r.yourAnswer}</div>
                    </div>
                    {!r.correct && (
                      <div>
                        <div className="text-[0.65rem] text-light-dim uppercase tracking-wider mb-1">Correct Answer</div>
                        <div className="text-sm font-medium text-green-400">{r.correctAnswer}</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-light-muted leading-relaxed border-t border-border-subtle pt-3 mt-1">{r.analysis}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
