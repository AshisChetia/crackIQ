import { Link } from 'react-router-dom';
import { Calendar, Clock, Target, ChevronRight, BarChart3, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/exams/history/me');
        setHistory(response.data.history || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = history.filter(h => 
    h.exam_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((a, h) => a + h.score, 0) / history.length) 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-8 md:p-12 max-w-[1440px] mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-1">Performance History</h1>
          <p className="text-outline text-sm">Review your past exam attempts and track progress.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-lowest border border-outline-variant/30">
            <Search size={14} className="text-outline" />
            <input 
              type="text" 
              placeholder="Search exams..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-light placeholder:text-outline w-40" 
            />
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-lowest/30 rounded-3xl border border-dashed border-outline-variant/50">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
            <BarChart3 className="text-outline" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-light mb-1">No history yet</h3>
          <p className="text-sm text-outline mb-6">Complete your first simulation to see metrics here.</p>
          <Link to="/exam/setup" className="px-6 py-2.5 bg-primary text-dark font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-light transition-all">
            Start First Test
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Exams', value: history.length, icon: <BarChart3 size={18} /> },
              { label: 'Avg Score', value: `${avgScore}%`, icon: <Target size={18} /> },
              { label: 'Success Rate', value: 'High', icon: <Clock size={18} /> },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-2xl border border-outline-variant/20 bg-surface-lowest/50 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-3">{s.icon}</div>
                <div className="text-2xl font-bold font-mono text-light mb-1">{s.value}</div>
                <div className="text-[10px] text-outline uppercase tracking-widest font-semibold">{s.label}</div>
              </div>
            ))}
          </div>

          {/* History List */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-lowest/50 overflow-hidden">
            <div className="hidden lg:grid grid-cols-6 gap-4 px-6 py-4 border-b border-outline-variant/20 text-[10px] font-bold text-outline uppercase tracking-widest bg-surface-container/30">
              <span>Exam / Subject</span><span>Difficulty</span><span>Score</span><span>Status</span><span>Date</span><span></span>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {filtered.map((h) => (
                <Link key={h.id} to={`/exam/results?id=${h.id}`} className="grid grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-4 px-6 py-5 hover:bg-surface-container/40 transition-colors items-center group">
                  <div className="col-span-2 lg:col-span-1">
                    <div className="font-semibold text-sm text-light mb-0.5">{h.exam_name}</div>
                    <div className="text-[10px] text-outline uppercase tracking-tight">{h.subject}</div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg w-fit ${h.difficulty === 'hard' ? 'bg-danger/10 text-danger' : h.difficulty === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                    {h.difficulty}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-mono font-bold text-light">{h.score}<span className="text-outline text-xs">/{h.total_questions}</span></span>
                    <div className="w-20 h-1 bg-surface-container rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(h.score / h.total_questions) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-success font-medium">Completed</span>
                  <span className="text-xs text-outline font-mono">{new Date(h.created_at).toLocaleDateString()}</span>
                  <div className="text-right">
                    <ChevronRight size={16} className="inline text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
