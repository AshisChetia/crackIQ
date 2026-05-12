import { Link } from 'react-router-dom';
import { Calendar, Clock, Target, ChevronRight, BarChart3, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const history = [
    { id: 1, subject: 'System Design', difficulty: 'Hard', score: 85, total: 100, questions: 20, time: '42:15', date: '2026-05-12', status: 'completed' },
    { id: 2, subject: 'Data Structures', difficulty: 'Medium', score: 74, total: 100, questions: 15, time: '18:30', date: '2026-05-11', status: 'completed' },
    { id: 3, subject: 'Operating Systems', difficulty: 'Easy', score: 91, total: 100, questions: 10, time: '8:45', date: '2026-05-10', status: 'completed' },
    { id: 4, subject: 'Database Management', difficulty: 'Hard', score: 62, total: 100, questions: 20, time: '38:20', date: '2026-05-09', status: 'completed' },
    { id: 5, subject: 'Computer Networks', difficulty: 'Medium', score: 78, total: 100, questions: 15, time: '22:10', date: '2026-05-08', status: 'completed' },
  ];

  const filtered = history.filter(h => h.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-1">History</h1>
            <p className="text-light-muted text-sm">Review your past exam attempts and track progress.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-2 border border-border-subtle">
              <Search size={14} className="text-light-dim" />
              <input type="text" placeholder="Search exams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-light placeholder:text-light-dim w-40" />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8 stagger">
          {[
            { label: 'Total Exams', value: history.length, icon: <BarChart3 size={16} /> },
            { label: 'Avg Score', value: `${Math.round(history.reduce((a, h) => a + h.score, 0) / history.length)}%`, icon: <Target size={16} /> },
            { label: 'Total Time', value: '2h 10m', icon: <Clock size={16} /> },
          ].map((s, i) => (
            <div key={i} className="opacity-0 animate-fade-in-up p-4 rounded-xl border border-border-subtle bg-light/[0.02] text-center">
              <div className="flex items-center justify-center text-light-dim mb-2">{s.icon}</div>
              <div className="text-xl font-bold font-mono">{s.value}</div>
              <div className="text-[0.65rem] text-light-dim uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* History List */}
        <div className="rounded-xl border border-border-subtle bg-light/[0.02] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="hidden lg:grid grid-cols-6 gap-4 px-5 py-3 border-b border-border-subtle text-[0.65rem] font-mono text-light-dim uppercase tracking-widest">
            <span>Subject</span><span>Difficulty</span><span>Score</span><span>Questions</span><span>Time</span><span>Date</span>
          </div>
          <div className="divide-y divide-border-subtle">
            {filtered.map((h) => (
              <Link key={h.id} to={`/exam/results`} className="grid grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-4 px-5 py-4 hover:bg-light/[0.02] transition-colors items-center group">
                <span className="font-medium text-sm col-span-2 lg:col-span-1">{h.subject}</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full w-fit ${h.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : h.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
                  {h.difficulty}
                </span>
                <span className="text-sm font-mono font-semibold">{h.score}<span className="text-light-dim">/{h.total}</span></span>
                <span className="text-sm text-light-muted">{h.questions} Q</span>
                <span className="text-sm text-light-muted font-mono">{h.time}</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-light-dim">{h.date}</span>
                  <ChevronRight size={14} className="text-light-dim group-hover:text-light transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
