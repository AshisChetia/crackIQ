import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sliders, BookOpen, Hash, Zap, ChevronDown, X, Plus, Minus } from 'lucide-react';
import Button from '../../components/common/Button';

const ExamSetup = () => {
  const navigate = useNavigate();
  const [exam, setExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [difficulty, setDifficulty] = useState(50);
  const [questionCount, setQuestionCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const difficultyLabel = difficulty < 33 ? 'Easy' : difficulty < 66 ? 'Medium' : 'Hard';
  const timeEstimate = Math.ceil(questionCount * 0.5);

  const addSubject = () => {
    if (subjectInput.trim() && subjects.length < 2) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput('');
    }
  };

  const removeSubject = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => navigate('/exam/active'), 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="rounded-2xl border border-border-subtle bg-light/[0.02] overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="p-6 border-b border-border-subtle text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-light/[0.05] border border-border-subtle mb-4">
              <Brain size={22} strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-1">Configure Simulation</h1>
            <p className="text-sm text-light-muted">Set up your AI-powered mock exam.</p>
          </div>

          {/* Form */}
          <div className="p-6 flex flex-col gap-6">
            {/* Exam Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-light-2 uppercase tracking-wide">Target Exam</label>
              <input
                type="text"
                placeholder="e.g. GATE, CAT, UPSC..."
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full px-4 py-3 bg-dark-2 border border-border-subtle rounded-[10px] text-[0.9rem] text-light placeholder:text-light-dim outline-none focus:border-border-active focus:bg-dark-3 transition-all duration-150"
              />
            </div>

            {/* Subjects */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-light-2 uppercase tracking-wide">Subjects <span className="text-light-dim">(max 2)</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                  disabled={subjects.length >= 2}
                  className="flex-1 px-4 py-3 bg-dark-2 border border-border-subtle rounded-[10px] text-[0.9rem] text-light placeholder:text-light-dim outline-none focus:border-border-active focus:bg-dark-3 transition-all duration-150 disabled:opacity-40"
                />
                <button onClick={addSubject} disabled={subjects.length >= 2 || !subjectInput.trim()} className="px-4 py-3 bg-light/[0.06] border border-border-subtle rounded-[10px] text-light hover:bg-light/[0.1] transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                  <Plus size={16} />
                </button>
              </div>
              {subjects.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {subjects.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-light/[0.06] border border-border-subtle text-sm">
                      {s}
                      <button onClick={() => removeSubject(i)} className="text-light-dim hover:text-light transition-colors cursor-pointer bg-transparent border-none"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-light-2 uppercase tracking-wide">Difficulty</label>
                <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${difficulty < 33 ? 'bg-green-500/10 text-green-400' : difficulty < 66 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                  {difficultyLabel}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-light/[0.08] outline-none cursor-pointer accent-light"
              />
              <div className="flex justify-between text-[0.65rem] text-light-dim uppercase tracking-wider">
                <span>Easy</span><span>Medium</span><span>Hard</span>
              </div>
            </div>

            {/* Question Count */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-light-2 uppercase tracking-wide">Questions</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuestionCount(Math.max(5, questionCount - 5))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-light/[0.06] border border-border-subtle hover:bg-light/[0.1] transition-all cursor-pointer">
                  <Minus size={14} />
                </button>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold font-mono">{questionCount}</div>
                  <div className="text-[0.65rem] text-light-dim uppercase tracking-wider">≈ {timeEstimate} min</div>
                </div>
                <button onClick={() => setQuestionCount(Math.min(50, questionCount + 5))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-light/[0.06] border border-border-subtle hover:bg-light/[0.1] transition-all cursor-pointer">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border-subtle">
            <Button variant="primary" size="lg" fullWidth loading={loading} onClick={handleStart} disabled={!exam || subjects.length === 0} icon={<Zap size={16} />} id="start-exam-btn">
              Initialize Simulation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
