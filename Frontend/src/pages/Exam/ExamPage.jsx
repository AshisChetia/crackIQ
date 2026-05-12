import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';

const ExamPage = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState({});
  const [timeLeft, setTimeLeft] = useState(2535); // 42:15

  // Mock questions
  const questions = [
    {
      id: 1, section: 'Systems Design', qNum: 'Q.01',
      text: 'In a microservices architecture, which pattern is most appropriate for managing distributed transactions across multiple independent services to ensure data consistency without relying on a centralized database lock?',
      note: 'Consider the implications on system availability, complexity, and eventual consistency when selecting your answer.',
      options: [
        { id: 'A', label: 'Two-Phase Commit (2PC)', desc: 'Utilizes a coordinator node to ensure all services commit or rollback simultaneously.' },
        { id: 'B', label: 'Shared Database Architecture', desc: 'Mandates all microservices interact with a single, monolithic database instance.' },
        { id: 'C', label: 'Saga Pattern', desc: 'Manages a sequence of local transactions where each service updates its own database and publishes an event.' },
        { id: 'D', label: 'Event Sourcing', desc: 'Stores the state of a business entity as a sequence of state-changing events.' },
      ],
    },
    {
      id: 2, section: 'Data Structures', qNum: 'Q.02',
      text: 'Which data structure provides the most efficient average-case time complexity for both search and insert operations in a dynamic dataset?',
      note: 'Consider amortized analysis and worst-case scenarios.',
      options: [
        { id: 'A', label: 'Balanced BST (AVL Tree)', desc: 'Self-balancing binary search tree with O(log n) operations.' },
        { id: 'B', label: 'Hash Table', desc: 'Average O(1) for search and insert using hash functions.' },
        { id: 'C', label: 'Linked List', desc: 'Sequential access with O(n) search time.' },
        { id: 'D', label: 'Skip List', desc: 'Probabilistic data structure with O(log n) average operations.' },
      ],
    },
    {
      id: 3, section: 'Operating Systems', qNum: 'Q.03',
      text: 'What is the primary advantage of using a microkernel architecture over a monolithic kernel in operating system design?',
      note: 'Think about modularity, reliability, and performance tradeoffs.',
      options: [
        { id: 'A', label: 'Higher Performance', desc: 'Reduces context switching overhead for system calls.' },
        { id: 'B', label: 'Better Modularity', desc: 'Services run in user space, making the system more modular and fault-tolerant.' },
        { id: 'C', label: 'Simpler Implementation', desc: 'Fewer lines of code needed for the kernel.' },
        { id: 'D', label: 'Direct Hardware Access', desc: 'All drivers run in kernel space for faster I/O.' },
      ],
    },
  ];

  const q = questions[currentQ];
  const totalQ = questions.length;

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 border-b border-border-subtle bg-dark-2/50 backdrop-blur-sm">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-light-muted hover:text-light transition-colors cursor-pointer bg-transparent border-none">
          <X size={16} /> Exit Exam
        </button>
        <span className="font-semibold text-sm tracking-tight">CrackIQ</span>
        <button className="text-light-dim hover:text-light transition-colors cursor-pointer bg-transparent border-none"><Info size={16} /></button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl animate-fade-in">
          {/* Timer + Progress */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-dark-2 border border-border-subtle">
              <span className="text-[0.65rem] font-mono text-light-muted uppercase tracking-widest">Time Remaining</span>
              <span className={`text-2xl font-bold font-mono tracking-tight ${timeLeft < 300 ? 'text-red-400' : ''}`}>{formatTime(timeLeft)}</span>
            </div>
            <div className="text-right">
              <span className="text-[0.65rem] font-mono text-light-muted uppercase tracking-widest">Progress</span>
              <span className="ml-2 text-sm font-mono font-semibold">Question {currentQ + 1} of {totalQ}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 rounded-full bg-light/[0.06] mb-8 overflow-hidden">
            <div className="h-full rounded-full bg-light/50 transition-all duration-500" style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }} />
          </div>

          {/* Question */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-mono text-light-dim uppercase tracking-widest">{q.qNum}</span>
            <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded-full bg-light/[0.06] text-light-dim">{q.section}</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold leading-snug mb-3">{q.text}</h2>
          {q.note && <p className="text-sm text-light-muted mb-8">{q.note}</p>}

          {/* Options */}
          <div className="flex flex-col gap-3 mb-10">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected({ ...selected, [q.id]: opt.id })}
                className={`flex items-start gap-4 w-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer bg-transparent
                  ${selected[q.id] === opt.id
                    ? 'border-light/30 bg-light/[0.06]'
                    : 'border-border-subtle hover:border-border-hover hover:bg-light/[0.02]'
                  }`}
              >
                <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold font-mono border transition-all
                  ${selected[q.id] === opt.id ? 'bg-light text-dark border-light' : 'bg-light/[0.06] border-border-subtle text-light-muted'}`}>
                  {opt.id}
                </span>
                <div>
                  <div className="font-semibold text-sm mb-0.5">{opt.label}</div>
                  <div className="text-xs text-light-muted leading-relaxed">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-border-subtle rounded-full hover:bg-light/[0.04] transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed bg-transparent text-light"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => {
                if (currentQ < totalQ - 1) setCurrentQ(currentQ + 1);
                else navigate('/exam/results');
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-dark bg-light rounded-full hover:bg-light/90 hover:-translate-y-0.5 transition-all cursor-pointer border-none"
            >
              {currentQ < totalQ - 1 ? 'Next' : 'Submit'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
