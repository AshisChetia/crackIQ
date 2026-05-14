import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Clock, Loader2, AlertCircle, Zap, CheckCircle2, LayoutGrid, Brain } from 'lucide-react';
import { gsap } from 'gsap';
import api from '../../api/axios';
import Button from '../../components/common/Button';

const ExamPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('id');

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showNavigator, setShowNavigator] = useState(false);
  
  const questionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!examId) {
      navigate('/exam/setup');
      return;
    }

    const fetchExam = async () => {
      try {
        const response = await api.get(`/exams/${examId}`);
        setExam(response.data.exam);
        setQuestions(response.data.questions);
        setTimeLeft(response.data.exam.duration_minutes * 60);
      } catch (err) {
        console.error("Failed to fetch exam:", err);
        if (err.response?.status === 401) {
           // axios interceptor handles redirect
           return;
        }
        setError("Failed to load exam. It might have expired or doesn't exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 || loading || submitting) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          // Auto submit logic could go here
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, submitting]);

  // Question Transition Animation
  useEffect(() => {
    if (!loading && questionRef.current) {
      gsap.fromTo(questionRef.current, 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [currentQ, loading]);

  const handleSubmit = async () => {
    const answeredCount = Object.keys(selected).length;
    const totalCount = questions.length;
    
    if (answeredCount < totalCount) {
      if (!window.confirm(`You have only answered ${answeredCount}/${totalCount} questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(selected).map(([qId, ans]) => ({
        question_id: parseInt(qId),
        selected_answer: ans
      }));

      const response = await api.post('/exams/submit', {
        exam_id: parseInt(examId),
        answers: formattedAnswers
      });

      navigate('/exam/results', { state: { result: response.data.result } });
    } catch (err) {
      console.error("Failed to submit exam:", err);
      alert("Submission failed. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40" size={24} />
        </div>
        <p className="text-outline text-xs font-mono tracking-[0.3em] uppercase mt-6 animate-pulse">Initializing Neural Link...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mb-6">
          <AlertCircle className="text-danger" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-light mb-2 font-display">Diagnostic Terminated</h2>
        <p className="text-outline mb-8 max-w-md leading-relaxed">{error}</p>
        <Button onClick={() => navigate('/exam/setup')} variant="outline">Return to Hub</Button>
      </div>
    );
  }

  const q = questions[currentQ];
  const totalQ = questions.length;

  return (
    <div className="min-h-screen bg-dark text-light font-sans flex flex-col selection:bg-primary/30">
      {/* ─── NAVIGATION SIDEBAR (Real Exam Style) ─── */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-surface-lowest border-l border-outline-variant/20 z-50 transform transition-transform duration-300 ease-spring ${showNavigator ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-outline">Question Navigator</h3>
            <button onClick={() => setShowNavigator(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"><X size={18}/></button>
          </div>
          
          <div className="grid grid-cols-5 gap-3 mb-auto">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentQ(i); setShowNavigator(false); }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border
                  ${currentQ === i ? 'bg-primary text-dark border-primary shadow-[0_0_15px_rgba(207,188,255,0.3)]' : 
                    selected[questions[i].question_id] ? 'bg-success/10 text-success border-success/30' : 
                    'bg-surface-container border-outline-variant/30 text-outline hover:border-primary/50'}
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-outline-variant/10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-outline">
                <span>Attempted</span>
                <span className="text-light">{Object.keys(selected).length} / {totalQ}</span>
              </div>
              <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${(Object.keys(selected).length / totalQ) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── HEADER ─── */}
      <div className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-outline-variant/10 bg-dark/80 backdrop-blur-xl sticky top-0 z-40">
        <button onClick={() => window.confirm("Abandon this session? Your progress will not be saved.") && navigate('/dashboard')} className="flex items-center gap-2 text-[10px] font-bold text-outline uppercase tracking-widest hover:text-danger transition-all">
          <X size={14} /> Abandon
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <span className="font-display font-bold text-xl tracking-tight text-light group flex items-center gap-2">
            Crack<span className="text-primary">IQ</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-surface-lowest border border-outline-variant/20 shadow-inner" ref={timerRef}>
              <div className={`p-1.5 rounded-lg ${timeLeft < 60 ? 'bg-danger/10 text-danger animate-pulse' : 'bg-primary/10 text-primary'}`}>
                <Clock size={16} />
              </div>
              <span className={`font-mono font-bold text-xl tracking-tighter ${timeLeft < 60 ? 'text-danger' : 'text-light'}`}>{formatTime(timeLeft)}</span>
           </div>
           
           <button 
             onClick={() => setShowNavigator(true)}
             className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-lowest border border-outline-variant/20 hover:border-primary/50 text-outline hover:text-primary transition-all group"
           >
             <LayoutGrid size={20} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </div>

      {/* ─── PROGRESS BAR ─── */}
      <div className="w-full h-1 bg-surface-container/50">
        <div className="h-full bg-primary transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(207,188,255,0.5)]" style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }} />
      </div>

      {/* ─── MAIN EXAM CONTENT ─── */}
      <div className="flex-1 flex flex-col items-center px-6 py-12 lg:py-20 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-4xl relative z-10" ref={questionRef}>
          {/* Question Meta */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                 Question {currentQ + 1}
               </span>
               <span className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">
                 {exam?.subject} • {exam?.difficulty}
               </span>
            </div>
            {selected[q?.question_id] && (
              <div className="flex items-center gap-2 text-success text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle2 size={14} /> Answered
              </div>
            )}
          </div>
          
          {/* Question Text */}
          <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-12 text-light font-display">
            {q?.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q?.options.map((opt, idx) => {
              const optionLabel = String.fromCharCode(65 + idx);
              const isSelected = selected[q.question_id] === optionLabel;

              return (
                <button
                  key={idx}
                  onClick={() => setSelected({ ...selected, [q.question_id]: optionLabel })}
                  className={`flex items-start gap-4 w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative overflow-hidden
                    ${isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-lowest'
                    }`}
                >
                  <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold font-mono border-2 transition-all
                    ${isSelected ? 'bg-primary text-dark border-primary' : 'bg-surface-container border-outline-variant/20 text-outline'}`}>
                    {optionLabel}
                  </span>
                  <span className={`text-base leading-relaxed pt-0.5 ${isSelected ? 'text-light font-semibold' : 'text-outline group-hover:text-light'}`}>
                    {opt}
                  </span>
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 flex items-center justify-center rounded-bl-3xl">
                      <Zap size={14} className="text-primary fill-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── FOOTER CONTROLS ─── */}
      <div className="px-6 lg:px-12 py-8 bg-surface-lowest/50 backdrop-blur-md border-t border-outline-variant/10 sticky bottom-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-3 px-6 py-3 text-xs font-bold uppercase tracking-widest text-outline hover:text-light transition-all disabled:opacity-20 cursor-pointer"
          >
            <ChevronLeft size={18} /> Previous
          </button>

          <div className="hidden sm:flex items-center gap-2">
            {questions.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentQ ? 'w-6 bg-primary' : selected[questions[i].question_id] ? 'bg-success/50' : 'bg-outline-variant/20'}`} />
            ))}
          </div>

          <div className="flex gap-4">
            {currentQ < totalQ - 1 ? (
              <button
                onClick={() => setCurrentQ(currentQ + 1)}
                className="flex items-center gap-3 px-8 py-3 bg-light text-dark font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary transition-all shadow-lg cursor-pointer"
              >
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="flex items-center gap-3 px-10 py-3 bg-primary text-dark font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-light transition-all shadow-[0_0_30px_rgba(207,188,255,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Zap size={18} /> Finalize Session</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
