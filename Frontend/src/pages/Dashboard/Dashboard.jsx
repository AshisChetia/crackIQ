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
          exams: dashRes.data.analytics?.exams || { total_exam_attempts: 0, average_score: 0, recent_attempts: [] },
          resumes: dashRes.data.analytics?.resumes || { total_resume_analyses: 0 },
          weakest_subject: strengthRes.data.analysis?.weakest_subject,
          strongest_subject: strengthRes.data.analysis?.strongest_subject,
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
    { label: 'Exams Taken', value: data.exams.total_exam_attempts, icon: <BookOpen size={18} />, color: 'bg-primary/10 text-primary' },
    { label: 'Avg Score', value: `${Math.round(data.exams.average_score)}%`, icon: <TrendingUp size={18} />, color: 'bg-success/10 text-success' },
    { label: 'Resumes Analyzed', value: data.resumes.total_resume_analyses, icon: <FileText size={18} />, color: 'bg-warning/10 text-warning' },
    { label: 'Strongest Topic', value: data.strongest_subject?.subject || 'N/A', icon: <Target size={18} />, color: 'bg-primary/10 text-primary' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Activity size={32} className="text-primary animate-pulse" />
          <p className="text-xs font-mono tracking-widest text-outline uppercase">Syncing Neural Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-8 md:p-12 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl lg:text-4xl font-bold tracking-tight mb-2 text-light">Cognitive Overview.</h1>
        <p className="text-outline text-sm">Real-time metrics on your skill progression and diagnostics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card, i) => (
          <div key={i} className="p-6 rounded-2xl border border-outline-variant/20 bg-surface-lowest/50 hover:bg-surface-lowest transition-all group">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.color} mb-4 border border-current/10`}>{card.icon}</div>
            <div className="text-3xl font-bold font-mono tracking-tight text-light mb-1">{card.value}</div>
            <div className="text-xs text-outline uppercase tracking-widest font-bold">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Exams */}
        <div className="lg:col-span-2 rounded-2xl border border-outline-variant/20 bg-surface-lowest/50 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 bg-surface-container/30">
            <h2 className="font-bold text-sm text-light uppercase tracking-widest">Recent Sessions</h2>
            <Link to="/history" className="text-xs font-bold text-outline hover:text-primary flex items-center gap-1 transition-all uppercase tracking-widest">View All <ChevronRight size={14} /></Link>
          </div>
          
          {data.exams.recent_attempts?.length > 0 ? (
            <div className="divide-y divide-outline-variant/10">
              {data.exams.recent_attempts.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-surface-container/30 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-light mb-1">{exam.exam_name || 'Generic Assessment'}</div>
                    <div className="flex items-center gap-3 text-xs text-outline font-bold uppercase tracking-wider">
                      <span>{new Date(exam.submitted_at).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-surface-container text-outline">{exam.difficulty}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-light">{exam.score}<span className="text-outline text-xs">/{exam.total_questions || 100}</span></div>
                    <div className="w-24 h-1 bg-surface-container mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(exam.score / (exam.total_questions || 100)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-6">
                  <BookOpen size={24} className="text-outline" />
               </div>
               <h3 className="text-base font-bold text-light mb-2">No Active Records</h3>
               <p className="text-xs text-outline max-w-[240px] mb-8 leading-relaxed">Your performance database is empty. Initiate a simulation to begin tracking.</p>
               <Link to="/exam/setup" className="px-6 py-2.5 bg-primary text-dark font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-light transition-all shadow-lg shadow-primary/5">
                Start Session
               </Link>
            </div>
          )}
        </div>

        {/* Weak Topics + Quick Actions */}
        <div className="flex flex-col gap-6">
          {/* Weak Areas */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-lowest/50 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 bg-surface-container/30">
              <h2 className="font-bold text-sm text-light uppercase tracking-widest">Cognitive Gaps</h2>
            </div>
            <div className="p-6">
              {data.weakest_subject ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-light truncate">{data.weakest_subject.subject}</span>
                    <span className="text-xs font-mono font-bold text-warning">{Math.round(data.weakest_subject.average_score)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-warning transition-all duration-500" style={{ width: `${data.weakest_subject.average_score}%` }} />
                  </div>
                  <p className="text-xs text-outline mt-4 leading-relaxed font-medium">This vector shows high variance. Targeted reinforcement of core principles is recommended.</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-outline font-bold uppercase tracking-widest">Awaiting Analysis...</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-lowest/50 p-6">
            <h2 className="font-bold text-sm text-light uppercase tracking-widest mb-6">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link to="/exam/setup" className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container/50 transition-all border border-transparent hover:border-outline-variant/10 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 group-hover:bg-primary group-hover:text-dark transition-all"><Zap size={18} /></div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-light">New Simulation</div>
                  <div className="text-xs text-outline font-medium">Start diagnostic test</div>
                </div>
                <ArrowRight size={16} className="text-outline group-hover:text-primary transition-all" />
              </Link>
              <Link to="/resume" className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container/50 transition-all border border-transparent hover:border-outline-variant/10 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-warning/10 border border-warning/10 group-hover:bg-warning group-hover:text-dark transition-all"><FileText size={18} /></div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-light">Resume Lab</div>
                  <div className="text-xs text-outline font-medium">Analyze ATS Score</div>
                </div>
                <ArrowRight size={16} className="text-outline group-hover:text-warning transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
