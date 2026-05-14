import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Plus, Minus, X, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../api/axios';

const ExamSetup = () => {
  const navigate = useNavigate();
  const [exam, setExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [difficulty, setDifficulty] = useState(50);
  const [questionCount, setQuestionCount] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const difficultyLabel = difficulty < 33 ? 'easy' : difficulty < 66 ? 'medium' : 'hard';
  const timeEstimate = Math.ceil(questionCount * 0.5);

  const addSubject = () => {
    if (subjectInput.trim() && subjects.length < 2) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput('');
    }
  };

  const removeSubject = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));

  const handleStart = async () => {
    let finalSubjects = [...subjects];
    
    // Auto-add current input if subjects list is empty
    if (finalSubjects.length === 0 && subjectInput.trim()) {
      finalSubjects = [subjectInput.trim()];
    }

    if (!exam || finalSubjects.length === 0) {
      setError('Please provide a target domain and at least one subject.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/exams/create', {
        exam_name: exam,
        subject: finalSubjects.join(', '),
        difficulty: difficultyLabel,
        total_questions: questionCount
      });
      
      navigate(`/exam/active?id=${response.data.examId}`);
    } catch (err) {
      console.error("Failed to create exam:", err);
      setError(err.response?.data?.message || 'Failed to start exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in p-8 md:p-12 flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-lg mx-auto">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-lowest/50 overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="p-8 border-b border-outline-variant/10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4 shadow-[0_0_20px_rgba(207,188,255,0.1)]">
              <Brain size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2 text-light">Configure Simulation</h1>
            <p className="text-sm text-outline">Set up your AI-powered performance diagnostic.</p>
          </div>

          {/* Form */}
          <div className="p-8 flex flex-col gap-8">
            {/* Exam Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Target Domain</label>
              <input
                type="text"
                placeholder="e.g. Machine Learning, Cloud Architecture..."
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full px-5 py-4 bg-surface-container border border-outline-variant/30 rounded-xl text-sm text-light placeholder:text-outline outline-none focus:border-primary/50 focus:bg-surface-lowest transition-all"
              />
            </div>

            {/* Subjects */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Focus Subjects <span className="opacity-50">(max 2)</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Neural Networks"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                  disabled={subjects.length >= 2}
                  className="flex-1 px-5 py-4 bg-surface-container border border-outline-variant/30 rounded-xl text-sm text-light placeholder:text-outline outline-none focus:border-primary/50 focus:bg-surface-lowest transition-all disabled:opacity-40"
                />
                <button 
                  onClick={addSubject} 
                  disabled={subjects.length >= 2 || !subjectInput.trim()} 
                  className="w-14 bg-surface-container border border-outline-variant/30 rounded-xl flex items-center justify-center text-light hover:bg-surface-lowest transition-all disabled:opacity-30 cursor-pointer"
                >
                  <Plus size={20} />
                </button>
              </div>
              {subjects.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {subjects.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                      {s}
                      <button onClick={() => removeSubject(i)} className="hover:text-light transition-colors cursor-pointer"><X size={14} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Cognitive Load</label>
                <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${difficulty < 33 ? 'bg-success/10 text-success' : difficulty < 66 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                  {difficultyLabel}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-surface-container outline-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[8px] text-outline uppercase tracking-[0.1em] font-bold">
                <span>Foundational</span><span>Balanced</span><span>Advanced</span>
              </div>
            </div>

            {/* Question Count */}
            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Volume</label>
              <div className="flex items-center gap-6">
                <button onClick={() => setQuestionCount(Math.max(5, questionCount - 5))} className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container border border-outline-variant/30 hover:bg-surface-lowest transition-all cursor-pointer">
                  <Minus size={18} />
                </button>
                <div className="flex-1 text-center">
                  <div className="text-4xl font-bold font-mono text-light">{questionCount}</div>
                  <div className="text-[9px] text-outline uppercase tracking-widest font-bold mt-1">≈ {timeEstimate} min</div>
                </div>
                <button onClick={() => setQuestionCount(Math.min(50, questionCount + 5))} className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container border border-outline-variant/30 hover:bg-surface-lowest transition-all cursor-pointer">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {error && <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs text-center">{error}</div>}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-outline-variant/10">
            <Button
              fullWidth
              loading={loading}
              disabled={!exam || (subjects.length === 0 && !subjectInput.trim())}
              onClick={handleStart}
              size="lg"
              icon={<Zap size={18} />}
            >
              Start Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
