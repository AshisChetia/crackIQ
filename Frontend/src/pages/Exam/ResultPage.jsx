import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Target, CheckCircle2, XCircle, BarChart3, RotateCcw, Home, ChevronRight, Zap, Loader2, ChevronDown, ChevronUp, AlertCircle, HelpCircle } from 'lucide-react';
import api from '../../api/axios';

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const attemptIdFromUrl = searchParams.get('id');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(location.state?.result || null);
  const [answers, setAnswers] = useState(location.state?.answers || []);
  const [loading, setLoading] = useState(!location.state?.result);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!attemptIdFromUrl && !result) return;
      
      const id = attemptIdFromUrl || result?.id;
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.get(`/exams/result/${id}`);
        setResult(response.data.result);
        setAnswers(response.data.answers);
      } catch (err) {
        console.error("Failed to fetch detailed results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptIdFromUrl]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-outline font-mono text-xs uppercase tracking-widest">Reconstructing Session Data...</p>
      </div>
    );
  }

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

  const toggleQuestion = (id) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  return (
    <div className="animate-fade-in p-8 md:p-12 max-w-5xl mx-auto w-full pb-24">
      {/* Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-[2rem] mb-6 shadow-2xl ${isPassed ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
          <Zap size={32} fill="currentColor" className={isPassed ? 'text-success' : 'text-warning'} />
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-3 text-light">Diagnostic Complete</h1>
        <p className="text-outline max-w-lg mx-auto">The cognitive engine has analyzed your responses and generated a performance profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Main Score Card */}
        <div className="lg:col-span-8">
           <div className="bg-surface-lowest/50 border border-outline-variant/20 rounded-[2.5rem] p-10 lg:p-16 relative overflow-hidden backdrop-blur-xl h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="text-[12px] font-bold text-outline uppercase tracking-[0.3em] mb-4">Precision Metric</div>
                <div className="relative mb-8">
                   <svg className="w-48 h-48 -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surface-container" />
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary" strokeDasharray={552.92} strokeDashoffset={552.92 - (552.92 * scorePercentage) / 100} strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-bold font-mono text-light tracking-tighter">{scorePercentage}%</span>
                      <span className="text-[10px] font-bold text-outline uppercase tracking-widest mt-1">Accuracy</span>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full max-w-md pt-8 border-t border-outline-variant/10">
                   <div>
                      <div className="text-2xl font-bold text-light font-mono">{result.score}</div>
                      <div className="text-[10px] text-outline uppercase font-bold tracking-widest">Total Correct</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-light font-mono">{result.total_questions}</div>
                      <div className="text-[10px] text-outline uppercase font-bold tracking-widest">Questions</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-warning font-mono">{result.wrong_answers}</div>
                      <div className="text-[10px] text-outline uppercase font-bold tracking-widest">Deductions</div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Side Actions */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           <div className="p-8 bg-surface-lowest/50 border border-outline-variant/20 rounded-[2rem] backdrop-blur-md h-full">
              <h3 className="text-sm font-bold text-light mb-4 flex items-center gap-2">
                 <Target size={16} className="text-primary" /> Analysis Insights
              </h3>
              <p className="text-sm text-outline leading-relaxed mb-6">
                Your performance indicates a strong grasp of {isPassed ? 'foundational concepts' : 'the core subjects'}, though there are opportunities for precision refinement in advanced scenarios.
              </p>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm text-light font-medium p-3 bg-surface-container/50 rounded-xl border border-outline-variant/10">
                    <CheckCircle2 size={14} className="text-success" /> {result.correct_answers} Key strengths identified
                 </div>
                 <div className="flex items-center gap-3 text-sm text-light font-medium p-3 bg-surface-container/50 rounded-xl border border-outline-variant/10">
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

      {/* Detailed Question Breakdown */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <BarChart3 size={16} />
           </div>
           <h2 className="text-xl font-bold text-light">Session Breakdown</h2>
        </div>

        <div className="space-y-4">
          {answers.length > 0 ? (
            answers.map((answer, index) => {
              const options = answer.options ? (typeof answer.options === 'string' ? JSON.parse(answer.options) : answer.options) : [];
              const isExpanded = expandedQuestion === answer.question_id;
              
              return (
                <div 
                  key={answer.question_id} 
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    answer.is_correct 
                      ? 'border-success/20 bg-success/5' 
                      : 'border-danger/20 bg-danger/5'
                  }`}
                >
                  <div 
                    className="p-6 cursor-pointer flex items-start gap-4"
                    onClick={() => toggleQuestion(answer.question_id)}
                  >
                    <div className={`mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      answer.is_correct ? 'bg-success text-dark' : 'bg-danger text-light'
                    }`}>
                      {answer.is_correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-outline uppercase tracking-widest">Question {index + 1}</span>
                        {isExpanded ? <ChevronUp size={16} className="text-outline" /> : <ChevronDown size={16} className="text-outline" />}
                      </div>
                      <p className="text-base font-medium text-light leading-relaxed mb-1 line-clamp-2">
                        {answer.question_text}
                      </p>
                      {!answer.is_correct && !isExpanded && (
                        <p className="text-xs font-bold text-danger uppercase tracking-tighter flex items-center gap-1">
                          <AlertCircle size={10} /> View Explanation
                        </p>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-outline-variant/10 animate-slide-down">
                      <p className="text-base text-light/90 leading-relaxed mb-6 font-medium">
                        {answer.question_text}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {options && options.map((option, optIdx) => {
                          const optionLabel = String.fromCharCode(65 + optIdx);
                          const isSelected = answer.selected_answer === optionLabel;
                          const isCorrect = answer.correct_answer === optionLabel;
                          
                          let bgClass = 'bg-surface-container/30 border-outline-variant/10';
                          if (isSelected) bgClass = answer.is_correct ? 'bg-success/20 border-success/30' : 'bg-danger/20 border-danger/30';
                          if (isCorrect && !answer.is_correct) bgClass = 'bg-success/20 border-success/30';

                          return (
                            <div 
                              key={optIdx} 
                              className={`p-4 rounded-xl border flex items-center gap-3 ${bgClass}`}
                            >
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isCorrect ? 'bg-success text-dark' : isSelected ? 'bg-danger text-light' : 'bg-surface-lowest text-outline'
                              }`}>
                                {optionLabel}
                              </div>
                              <span className="text-sm text-light font-medium">{option}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-5 rounded-2xl bg-surface-lowest border border-outline-variant/10">
                        <div className="flex items-center gap-2 mb-3">
                          <HelpCircle size={14} className="text-primary" />
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Explanation</span>
                        </div>
                        <p className="text-base text-outline leading-relaxed font-medium">
                          {answer.explanation || "No detailed explanation provided for this question."}
                        </p>
                        <div className="mt-4 pt-4 border-t border-outline-variant/5 flex items-center gap-2">
                           <span className="text-xs font-bold text-outline uppercase tracking-widest">Correct Answer:</span>
                           <span className="text-sm font-bold text-success font-mono">{answer.correct_answer}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center">
               <Loader2 className="w-8 h-8 text-outline animate-spin mb-4" />
               <p className="text-xs text-outline font-medium">Decrypting detailed analysis...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
