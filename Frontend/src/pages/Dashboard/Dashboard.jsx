import { Link } from 'react-router-dom';
import { Brain, BookOpen, FileText, History, TrendingUp, Zap, ArrowRight, BarChart3, Clock, Target, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const statsCards = [
    { label: 'Exams Taken', value: '14', change: '+3 this week', icon: <BookOpen size={18} />, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Avg Score', value: '78%', change: '+5% improvement', icon: <TrendingUp size={18} />, color: 'bg-green-500/10 text-green-400' },
    { label: 'Time Spent', value: '12h', change: '2.4h avg/session', icon: <Clock size={18} />, color: 'bg-amber-500/10 text-amber-400' },
    { label: 'Accuracy', value: '85%', change: 'Top 15%', icon: <Target size={18} />, color: 'bg-purple-500/10 text-purple-400' },
  ];

  const recentExams = [
    { subject: 'Data Structures', score: 82, total: 100, date: '2 hours ago', difficulty: 'Hard' },
    { subject: 'System Design', score: 74, total: 100, date: 'Yesterday', difficulty: 'Medium' },
    { subject: 'Operating Systems', score: 91, total: 100, date: '3 days ago', difficulty: 'Easy' },
  ];

  const weakTopics = [
    { topic: 'Graph Algorithms', accuracy: 45, attempts: 8 },
    { topic: 'Dynamic Programming', accuracy: 52, attempts: 12 },
    { topic: 'Database Normalization', accuracy: 58, attempts: 6 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-1">Welcome Back.</h1>
          <p className="text-light-muted text-sm">Here&apos;s your preparation overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 stagger">
          {statsCards.map((card, i) => (
            <div key={i} className="opacity-0 animate-fade-in-up p-5 rounded-xl border border-border-subtle bg-light/[0.02] hover:bg-light/[0.04] hover:border-border-hover transition-all duration-300 group">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${card.color} mb-3`}>{card.icon}</div>
              <div className="text-2xl font-bold font-mono tracking-tight mb-0.5">{card.value}</div>
              <div className="text-xs text-light-muted uppercase tracking-wider mb-1">{card.label}</div>
              <div className="text-[0.7rem] text-light-dim">{card.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Exams */}
          <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-light/[0.02] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
              <h2 className="font-semibold text-sm">Recent Exams</h2>
              <Link to="/history" className="text-xs text-light-muted hover:text-light flex items-center gap-1 transition-colors">View All <ChevronRight size={12} /></Link>
            </div>
            <div className="divide-y divide-border-subtle">
              {recentExams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-5 hover:bg-light/[0.02] transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-0.5">{exam.subject}</div>
                    <div className="flex items-center gap-3 text-xs text-light-muted">
                      <span>{exam.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-light/[0.06] text-light-dim text-[0.65rem] font-mono">{exam.difficulty}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono">{exam.score}<span className="text-light-dim text-sm">/{exam.total}</span></div>
                    <div className="w-24 h-1.5 rounded-full bg-light/[0.06] mt-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-light/60 transition-all duration-500" style={{ width: `${exam.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Topics + Quick Actions */}
          <div className="flex flex-col gap-4">
            {/* Weak Topics */}
            <div className="rounded-xl border border-border-subtle bg-light/[0.02] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <div className="p-5 border-b border-border-subtle">
                <h2 className="font-semibold text-sm">Weak Areas</h2>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {weakTopics.map((topic, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm">{topic.topic}</span>
                      <span className="text-xs font-mono text-light-muted">{topic.accuracy}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-light/[0.06] overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${topic.accuracy < 50 ? 'bg-red-400/60' : topic.accuracy < 60 ? 'bg-amber-400/60' : 'bg-light/40'}`} style={{ width: `${topic.accuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-border-subtle bg-light/[0.02] p-5 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <h2 className="font-semibold text-sm mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                <Link to="/exam/setup" className="flex items-center gap-3 p-3 rounded-lg hover:bg-light/[0.04] transition-colors group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-light/[0.06]"><Zap size={14} /></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">New Exam</div>
                    <div className="text-[0.7rem] text-light-dim">Start a mock test</div>
                  </div>
                  <ArrowRight size={14} className="text-light-dim group-hover:text-light transition-colors" />
                </Link>
                <Link to="/resume" className="flex items-center gap-3 p-3 rounded-lg hover:bg-light/[0.04] transition-colors group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-light/[0.06]"><FileText size={14} /></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Resume Lab</div>
                    <div className="text-[0.7rem] text-light-dim">Analyze your resume</div>
                  </div>
                  <ArrowRight size={14} className="text-light-dim group-hover:text-light transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
