import { useState } from 'react';
import { Upload, FileText, Brain, CheckCircle2, AlertCircle, TrendingUp, X } from 'lucide-react';
import Button from '../../components/common/Button';

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files[0] || e.target.files[0];
    if (f) setFile(f);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        score: 78,
        strengths: ['Strong technical skills section', 'Good use of action verbs', 'Relevant project experience'],
        improvements: ['Add quantifiable metrics to achievements', 'Include more industry keywords', 'Shorten summary to 2-3 lines'],
        keywords: { found: ['React', 'Node.js', 'SQL', 'Git'], missing: ['Docker', 'AWS', 'CI/CD', 'Agile'] },
      });
      setAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-1">Resume Analysis Lab</h1>
          <p className="text-light-muted text-sm">Upload your resume and get AI-powered feedback for your target role.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div className="animate-fade-in-up">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed border-border-subtle hover:border-border-hover bg-light/[0.01] hover:bg-light/[0.03] transition-all duration-300 cursor-pointer text-center min-h-[280px]"
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <Upload size={32} className="text-light-dim mb-4" />
              {file ? (
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-light-2" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }} className="text-light-dim hover:text-light cursor-pointer bg-transparent border-none"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium mb-1">Drop your resume here</p>
                  <p className="text-xs text-light-dim">or click to browse — PDF, DOCX supported</p>
                </>
              )}
              <input id="resume-file-input" type="file" accept=".pdf,.docx" className="hidden" onChange={handleDrop} />
            </div>

            <div className="mt-4">
              <Button variant="primary" size="md" fullWidth onClick={handleAnalyze} disabled={!file} loading={analyzing} icon={<Brain size={16} />} id="analyze-resume-btn">
                {analyzing ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.15s', opacity: result ? 1 : 0 }}>
            {result && (
              <div className="flex flex-col gap-4">
                {/* ATS Score */}
                <div className="rounded-xl border border-border-subtle bg-light/[0.02] p-6 text-center">
                  <div className="text-[0.65rem] font-mono text-light-muted uppercase tracking-widest mb-2">ATS Compatibility Score</div>
                  <div className="relative inline-flex items-center justify-center w-28 h-28 mb-3">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(250,250,250,0.06)" strokeWidth="6" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#FAFAFA" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.score / 100)}`}
                        className="transition-all duration-1000" />
                    </svg>
                    <span className="absolute text-2xl font-bold font-mono">{result.score}</span>
                  </div>
                  <div className="text-xs text-light-muted">out of 100</div>
                </div>

                {/* Strengths */}
                <div className="rounded-xl border border-border-subtle bg-light/[0.02] p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-400" /> Strengths</h3>
                  <ul className="flex flex-col gap-2">
                    {result.strengths.map((s, i) => <li key={i} className="text-sm text-light-2 flex items-start gap-2"><span className="text-green-400 mt-0.5">•</span>{s}</li>)}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="rounded-xl border border-border-subtle bg-light/[0.02] p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><AlertCircle size={14} className="text-amber-400" /> Improvements</h3>
                  <ul className="flex flex-col gap-2">
                    {result.improvements.map((s, i) => <li key={i} className="text-sm text-light-2 flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span>{s}</li>)}
                  </ul>
                </div>

                {/* Keywords */}
                <div className="rounded-xl border border-border-subtle bg-light/[0.02] p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><TrendingUp size={14} /> Keyword Analysis</h3>
                  <div className="mb-3">
                    <div className="text-[0.65rem] text-light-dim uppercase tracking-wider mb-2">Found</div>
                    <div className="flex flex-wrap gap-1.5">{result.keywords.found.map((k, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-mono">{k}</span>)}</div>
                  </div>
                  <div>
                    <div className="text-[0.65rem] text-light-dim uppercase tracking-wider mb-2">Missing</div>
                    <div className="flex flex-wrap gap-1.5">{result.keywords.missing.map((k, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-mono">{k}</span>)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
