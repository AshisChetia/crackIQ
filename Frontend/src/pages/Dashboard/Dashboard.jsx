import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, TrendingUp, Zap, ArrowRight, Clock, Target, ChevronRight, Activity } from 'lucide-react';
import api from '../../api/axios';

const Dashboard = () => {
  const [data, setData] = useState({
    exams: { total_exam_attempts: 0, average_score: 0, recent_attempts: [] },
    resumes: { total_resume_analyses: 0 },
    weakest_subject: null,
    strongest_subject: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashRes, strengthRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/strength-analysis')
        ]);
        
        setData({
          exams: dashRes.data.data.analytics.exams || { total_exam_attempts: 0, average_score: 0, recent_attempts: [] },
          resumes: dashRes.data.data.analytics.resumes || { total_resume_analyses: 0 },
          weakest_subject: strengthRes.data.data.analysis.weakest_subject,
          strongest_subject: strengthRes.data.data.analysis.strongest_subject,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    { label: 'Exams Taken', value: data.exams.total_exam_attempts, icon: <BookOpen size={18} />, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Avg Score', value: `${Math.round(data.exams.average_score)}%`, icon: <TrendingUp size={18} />, color: 'bg-green-500/10 text-green-400' },
    { label: 'Resumes Analyzed', value: data.resumes.total_resume_analyses, icon: <FileText size={18} />, color: 'bg-amber-500/10 text-amber-400' },
    { label: 'Strongest Topic', value: data.strongest_subject?.subject || 'N/A', icon: <Target size={18} />, color: 'bg-purple-500/10 text-purple-400' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse-glow">
          <Activity size={32} className="text-primary animate-pulse" />
          <p className="text-sm font-mono tracking-widest text-primary uppercase">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-1">Cognitive Overview.</h1>
          <p className="text-light-muted text-sm">Real-time metrics on your neural progression.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 stagger">
          {statsCards.map((card, i) => (
            <div key={i} className="opacity-0 animate-fade-in-up p-5 rounded-xl border border-border-subtle bg-light/[0.02] hover:bg-light/[0.04] hover:border-border-hover transition-all duration-300 group">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${card.color} mb-3`}>{card.icon}</div>
              <div className="text-2xl font-bold font-mono tracking-tight mb-0.5 truncate">{card.value}</div>
              <div className="text-xs text-light-muted uppercase tracking-wider mb-1">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Exams */}
          <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-light/[0.02] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
              <h2 className="font-semibold text-sm">Recent Activity</h2>
              <Link to="/history" className="text-xs text-light-muted hover:text-light flex items-center gap-1 transition-colors">View All <ChevronRight size={12} /></Link>
            </div>
            
            {data.exams.recent_attempts?.length > 0 ? (
              <div className="divide-y divide-border-subtle">
                {data.exams.recent_attempts.map((exam, i) => (
                  <div key={i} className="flex items-center justify-between p-5 hover:bg-light/[0.02] transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-0.5">{exam.exam_id?.title || 'Unknown Subject'}</div>
                      <div className="flex items-center gap-3 text-xs text-light-muted">
                        <span>{new Date(exam.created_at).toLocaleDateString()}</span>
                        <span className="px-2 py-0.5 rounded-full bg-light/[0.06] text-light-dim text-[0.65rem] font-mono">Attempt</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono">{exam.score}<span className="text-light-dim text-sm">/{exam.total_questions || 100}</span></div>
                      <div className="w-24 h-1.5 rounded-full bg-light/[0.06] mt-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-primary/60 transition-all duration-500" style={{ width: `${(exam.score / (exam.total_questions || 100)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 rounded-full bg-light/[0.03] flex items-center justify-center mb-4">
                    <BookOpen size={20} className="text-light-dim" />
                 </div>
                 <h3 className="text-sm font-medium text-light mb-1">No Activity Yet</h3>
                 <p className="text-xs text-outline max-w-[200px] mb-4">You haven't taken any exams or simulations recently.</p>
                 <Link to="/exam/setup" className="text-xs font-semibold text-primary hover:text-light transition-colors">Start a Simulation &rarr;</Link>
              </div>
            )}
          </div>

          {/* Weak Topics + Quick Actions */}
          <div className="flex flex-col gap-4">
            {/* Weak Areas */}
            <div className="rounded-xl border border-border-subtle bg-light/[0.02] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <div className="p-5 border-b border-border-subtle">
                <h2 className="font-semibold text-sm">Focus Required</h2>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {data.weakest_subject ? (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm truncate pr-2">{data.weakest_subject.subject}</span>
                      <span className="text-xs font-mono text-light-muted">{Math.round(data.weakest_subject.average_score)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-light/[0.06] overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 bg-amber-400/60`} style={{ width: `${data.weakest_subject.average_score}%` }} />
                    </div>
                    <p className="text-[10px] text-outline mt-3 leading-relaxed">This area requires immediate attention. Recommend targeted practice to improve baseline.</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-outline">Insufficient data for weakness analysis. Take more exams.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-border-subtle bg-light/[0.02] p-5 animate-fade-in-up flex-1" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <h2 className="font-semibold text-sm mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                <Link to="/exam/setup" className="flex items-center gap-3 p-3 rounded-lg hover:bg-light/[0.04] transition-colors group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-light/[0.06]"><Zap size={14} className="text-primary" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">New Simulation</div>
                    <div className="text-[0.7rem] text-light-dim">Initialize assessment</div>
                  </div>
                  <ArrowRight size={14} className="text-light-dim group-hover:text-light transition-colors" />
                </Link>
                <Link to="/resume" className="flex items-center gap-3 p-3 rounded-lg hover:bg-light/[0.04] transition-colors group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-light/[0.06]"><FileText size={14} className="text-primary" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Resume Lab</div>
                    <div className="text-[0.7rem] text-light-dim">Run ATS Analysis</div>
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
