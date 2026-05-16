import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../api/axios';

const reviewHighlights = [
  {
    icon: <Target size={16} />,
    title: 'ATS readiness',
    description: 'See how well your resume is structured for automated screening systems.',
  },
  {
    icon: <Search size={16} />,
    title: 'Keyword coverage',
    description: 'Spot the terms your resume already signals well and the gaps still hurting visibility.',
  },
  {
    icon: <ShieldCheck size={16} />,
    title: 'Actionable fixes',
    description: 'Get practical recommendations you can apply before your next application.',
  },
];

const workflowSteps = [
  'Upload a clean PDF or DOCX resume.',
  'Set the target role you want the analysis tuned for.',
  'Review strengths, gaps, keywords, and formatting guidance.',
];

const scoreBands = [
  { min: 85, label: 'Excellent fit', chip: 'text-success bg-success/10 border-success/20', accent: 'bg-success' },
  { min: 70, label: 'Strong foundation', chip: 'text-primary bg-primary/10 border-primary/20', accent: 'bg-primary' },
  { min: 0, label: 'Needs refinement', chip: 'text-warning bg-warning/10 border-warning/20', accent: 'bg-warning' },
];

const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getScoreBand = (score) => scoreBands.find((band) => score >= band.min) || scoreBands[scoreBands.length - 1];

const ResumePage = () => {
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('General');
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const hasResult = Boolean(result);
  const selectedRole = targetRole.trim() || 'General';
  const foundKeywords = result?.keywords?.found || [];
  const missingKeywords = result?.keywords?.missing || [];
  const scoreBand = getScoreBand(result?.score || 0);
  const keywordCoverage = foundKeywords.length + missingKeywords.length > 0
    ? Math.round((foundKeywords.length / (foundKeywords.length + missingKeywords.length)) * 100)
    : 0;

  useEffect(() => {
    if (!hasResult || !resultsRef.current) return;

    const timer = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [hasResult]);

  const handleFileSelect = (nextFile) => {
    if (!nextFile) return;

    const extension = nextFile.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'docx'];

    if (!allowedExtensions.includes(extension)) {
      setError('Please upload a PDF or DOCX resume.');
      return;
    }

    if (nextFile.size === 0) {
      setError('The selected file is empty. Please choose a valid resume file.');
      return;
    }

    if (nextFile.size > 5 * 1024 * 1024) {
      setError('Please upload a file smaller than 5 MB.');
      return;
    }

    setFile(nextFile);
    setResult(null);
    setError(null);
  };

  const handleFileChange = (event) => {
    handleFileSelect(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileSelect(event.dataTransfer?.files?.[0]);
  };

  const clearSelectedFile = () => {
    setFile(null);
    setResult(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Select a resume before starting the analysis.');
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('target_role', selectedRole);

    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { resume } = response.data;

      setResult({
        score: resume.ats_score || 0,
        summary: resume.summary,
        strengths: resume.strengths || [],
        improvements: resume.improvements || resume.suggestions || [],
        keywords: {
          found: resume.keywords?.found || [],
          missing: resume.keywords?.missing || resume.missing_skills || [],
        },
        roleAlignment: resume.roleAlignment || 0,
        formattingFeedback: resume.formattingFeedback,
        targetRole: resume.target_role || selectedRole,
        fileName: file.name,
      });
    } catch (err) {
      let message = err.response?.data?.message || err.message || 'Failed to analyze resume.';

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        message = 'The analysis is taking longer than expected. Please try again in a moment.';
      }

      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden grain">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40 grid-pattern" />
        <div className="absolute top-0 right-[-12rem] h-[28rem] w-[28rem] rounded-full bg-primary/12 blur-[110px]" />
        <div className="absolute left-[-10rem] top-[18rem] h-[22rem] w-[22rem] rounded-full bg-primary-container/16 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-light/[0.03] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
        <section className="mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-lowest/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur-xl animate-fade-in-up">
            <Sparkles size={14} />
            {hasResult ? 'Analysis Ready' : 'Resume Intelligence'}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <div className="animate-fade-in-up">
              <h1 className="font-display text-4xl leading-tight tracking-[-0.04em] text-light sm:text-5xl lg:text-6xl">
                {hasResult ? 'Your resume review is' : 'Make your resume feel'}
                <span className="block text-on-surface-variant/78">{hasResult ? 'ready to review.' : 'clearer, sharper, and job-ready.'}</span>
              </h1>
            </div>

            <div className="animate-fade-in-up rounded-[24px] border border-outline-variant/15 bg-surface-lowest/60 p-5 text-[15px] leading-7 text-on-surface-variant backdrop-blur-xl lg:ml-auto lg:max-w-xl">
              {hasResult
                ? 'The report is now the main focus below. Review the score snapshot first, then move through summary, strengths, improvements, and keyword gaps.'
                : 'Upload your resume, choose the role you are targeting, and get a cleaner ATS review with keyword guidance, strengths, and focused improvements.'}
            </div>
          </div>
        </section>

        {hasResult ? (
          <section ref={resultsRef} className="mb-8">
            <div className="relative overflow-hidden rounded-[34px] border border-primary/20 bg-surface-lowest/80 p-6 shadow-[0_18px_70px_rgba(103,80,164,0.18)] backdrop-blur-2xl sm:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(207,188,255,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(103,80,164,0.14),transparent_34%)]" />
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

              <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-success">
                    <CheckCircle2 size={14} />
                    Analysis complete
                  </div>
                  <h2 className="mt-4 font-display text-3xl tracking-[-0.04em] text-light sm:text-4xl">
                    Your output is ready.
                  </h2>
                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-on-surface-variant">
                    Start with the score snapshot and immediate focus area below, then continue into the full report for strengths, improvements, and keyword intelligence.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-outline-variant/15 bg-light/[0.04] p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">ATS score</div>
                    <div className="mt-3 text-3xl font-display font-semibold tracking-[-0.04em] text-light">{result.score}</div>
                  </div>
                  <div className="rounded-[24px] border border-outline-variant/15 bg-light/[0.04] p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">Alignment</div>
                    <div className="mt-3 text-3xl font-display font-semibold tracking-[-0.04em] text-light">{result.roleAlignment || 0}%</div>
                  </div>
                  <div className="rounded-[24px] border border-outline-variant/15 bg-light/[0.04] p-4 sm:col-span-1 col-span-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">Keywords</div>
                    <div className="mt-3 text-3xl font-display font-semibold tracking-[-0.04em] text-light">{keywordCoverage}%</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-outline-variant/15 bg-surface-lowest/55 p-5 backdrop-blur-xl animate-fade-in-up">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Brain size={20} />
              </div>
              <div className="text-sm font-semibold text-light">Tailored analysis</div>
              <p className="mt-2 text-[15px] leading-7 text-on-surface-variant">Tune the review to a specific role instead of relying on a one-size-fits-all score.</p>
            </div>

            <div className="rounded-[24px] border border-outline-variant/15 bg-surface-lowest/55 p-5 backdrop-blur-xl animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <TrendingUp size={20} />
              </div>
              <div className="text-sm font-semibold text-light">Professional reporting</div>
              <p className="mt-2 text-[15px] leading-7 text-on-surface-variant">See the outcome in a tidy dashboard that highlights the signal first and avoids visual clutter.</p>
            </div>

            <div className="rounded-[24px] border border-outline-variant/15 bg-surface-lowest/55 p-5 backdrop-blur-xl animate-fade-in-up" style={{ animationDelay: '0.16s' }}>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-sm font-semibold text-light">Practical feedback</div>
              <p className="mt-2 text-[15px] leading-7 text-on-surface-variant">Focus on what to keep, what to revise, and which missing keywords matter most.</p>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className={hasResult ? 'xl:col-span-4 xl:order-2' : 'xl:col-span-5'}>
            <div className="relative overflow-hidden rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 backdrop-blur-2xl">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-light/30 to-transparent" />

              <div className={`p-6 sm:p-7 ${hasResult ? 'xl:sticky xl:top-24' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Upload Workspace</div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-light">{hasResult ? 'Run another analysis' : 'Analyze your resume'}</h2>
                    <p className="mt-2 text-[15px] leading-7 text-on-surface-variant">
                      {hasResult
                        ? 'Keep this panel available for a revised file or a different target role while the report stays front and center.'
                        : 'Built to feel more like a polished review desk than a raw upload box.'}
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-outline-variant/20 bg-light/[0.03] text-light sm:flex">
                    <FileText size={20} />
                  </div>
                </div>

                <div className="mt-6">
                  <Input
                    id="resume-target-role"
                    label="Target Role"
                    placeholder="Frontend Developer, Product Analyst, Data Scientist..."
                    value={targetRole}
                    onChange={(event) => setTargetRole(event.target.value)}
                    icon={<BriefcaseBusiness size={16} />}
                  />
                </div>

                <div
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="mt-6 rounded-[28px] border border-dashed border-outline-variant/25 bg-light/[0.02] p-6 transition-all duration-300 hover:border-primary/35 hover:bg-light/[0.04] focus:outline-none focus:ring-0"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_30px_rgba(207,188,255,0.08)]">
                      <Upload size={26} />
                    </div>

                    {file ? (
                      <div className="mt-5 w-full rounded-[22px] border border-outline-variant/15 bg-surface/70 p-4 text-left">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-sm font-semibold text-light">
                              <FileText size={16} className="shrink-0 text-primary" />
                              <span className="truncate">{file.name}</span>
                            </div>
                            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-outline">
                              {formatFileSize(file.size)} . Ready for analysis
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              clearSelectedFile();
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20 bg-transparent text-outline transition-colors hover:text-light"
                            aria-label="Remove selected file"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="mt-5 text-lg font-semibold text-light">Drop your resume here</h3>
                        <p className="mt-2 max-w-md text-[15px] leading-7 text-on-surface-variant">
                          Click to browse or drag a file in. PDF and DOCX are accepted, and text-based PDFs usually give the cleanest analysis.
                        </p>
                      </>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-outline">
                      <span className="rounded-full border border-outline-variant/15 bg-surface/70 px-3 py-1.5">PDF</span>
                      <span className="rounded-full border border-outline-variant/15 bg-surface/70 px-3 py-1.5">DOCX</span>
                      <span className="rounded-full border border-outline-variant/15 bg-surface/70 px-3 py-1.5">Up to 5 MB</span>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-red-300 animate-fade-in-up">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <div>{error}</div>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAnalyze}
                    disabled={!file}
                    loading={analyzing}
                    icon={!analyzing ? <Brain size={18} /> : null}
                    iconRight={!analyzing ? <ArrowRight size={16} /> : null}
                    id="analyze-resume-btn"
                    className="rounded-2xl"
                  >
                    {analyzing ? 'Analyzing resume...' : 'Analyze Resume'}
                  </Button>

                  <p className="text-xs leading-6 text-outline">
                    Target role: <span className="font-semibold text-light">{selectedRole}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={hasResult ? 'xl:col-span-8 xl:order-1' : 'xl:col-span-7'}>
            {result ? (
              <div className="relative overflow-hidden rounded-[30px] border border-primary/20 bg-surface-lowest/80 p-6 shadow-[0_18px_60px_rgba(103,80,164,0.14)] backdrop-blur-2xl sm:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(207,188,255,0.08),transparent_30%)]" />
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-light/30 to-transparent" />

                <div className="relative flex flex-col gap-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Latest Analysis</div>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-light">Review snapshot</h2>
                      <p className="mt-2 max-w-2xl text-[15px] leading-7 text-on-surface-variant">
                        {result.summary || 'Your AI review is ready. Use the detailed report below to refine structure, language, and role alignment.'}
                      </p>
                    </div>

                    <div className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${scoreBand.chip}`}>
                      <Sparkles size={14} />
                      {scoreBand.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-[26px] border border-outline-variant/15 bg-light/[0.03] p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">ATS Score</div>
                      <div className="mt-4 flex items-end gap-2">
                        <span className="font-display text-5xl font-semibold tracking-[-0.04em] text-light">{result.score}</span>
                        <span className="pb-2 text-sm text-outline">/ 100</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container">
                        <div className={`h-full rounded-full ${scoreBand.accent}`} style={{ width: `${result.score}%` }} />
                      </div>
                    </div>

                    <div className="rounded-[26px] border border-outline-variant/15 bg-light/[0.03] p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">Role Alignment</div>
                      <div className="mt-4 text-4xl font-display font-semibold tracking-[-0.04em] text-light">{result.roleAlignment || 0}%</div>
                      <p className="mt-3 text-[15px] leading-7 text-on-surface-variant">{result.targetRole}</p>
                    </div>

                    <div className="rounded-[26px] border border-outline-variant/15 bg-light/[0.03] p-5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-outline">Keyword Coverage</div>
                      <div className="mt-4 text-4xl font-display font-semibold tracking-[-0.04em] text-light">{keywordCoverage}%</div>
                      <p className="mt-3 text-[15px] leading-7 text-on-surface-variant">
                        {foundKeywords.length} found . {missingKeywords.length} missing
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
                    <div className="rounded-[26px] border border-outline-variant/15 bg-surface/70 p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-light">
                        <FileText size={16} className="text-primary" />
                        File in review
                      </div>
                      <div className="mt-3 text-[15px] leading-7 text-on-surface-variant">{result.fileName}</div>
                    </div>

                    <div className="rounded-[26px] border border-outline-variant/15 bg-surface/70 p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-light">
                        <AlertCircle size={16} className="text-warning" />
                        Immediate focus
                      </div>
                      <div className="mt-3 text-[15px] leading-7 text-on-surface-variant">
                        {result.improvements[0] || 'Review the detailed recommendations below for the highest-impact update.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col gap-6">
                <div className="relative overflow-hidden rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 p-6 backdrop-blur-2xl sm:p-7">
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-light/30 to-transparent" />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Preview</div>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-light">What your review will cover</h2>
                    </div>

                    <div className="hidden rounded-2xl border border-outline-variant/15 bg-light/[0.03] p-3 text-primary sm:block">
                      <Brain size={18} />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {reviewHighlights.map((item) => (
                      <div key={item.title} className="rounded-[24px] border border-outline-variant/15 bg-light/[0.02] p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-light">{item.title}</div>
                            <p className="mt-1 text-[15px] leading-7 text-on-surface-variant">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 p-6 backdrop-blur-2xl sm:p-7">
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-light/30 to-transparent" />

                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workflow</div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-light">A cleaner review flow</h3>

                  <div className="mt-5 space-y-4">
                    {workflowSteps.map((step, index) => (
                      <div key={step} className="flex items-start gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20 bg-light/[0.03] text-xs font-semibold text-light">
                          0{index + 1}
                        </div>
                        <p className="pt-1 text-[15px] leading-7 text-on-surface-variant">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          {result ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-8 xl:order-1 flex flex-col gap-6">
                <div className="rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 p-6 backdrop-blur-2xl">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Executive Summary</div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-light">What stands out most</h3>
                  <p className="mt-4 text-[15px] leading-8 text-on-surface-variant">
                    {result.summary || 'The analysis completed successfully. Use the sections below to sharpen role alignment, keyword placement, and clarity.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 p-6 backdrop-blur-2xl">
                    <div className="flex items-center gap-2 text-sm font-semibold text-light">
                      <CheckCircle2 size={16} className="text-success" />
                      Key strengths
                    </div>

                    <div className="mt-5 space-y-3">
                      {result.strengths.length > 0 ? (
                        result.strengths.map((strength, index) => (
                          <div key={`${strength}-${index}`} className="rounded-[20px] border border-success/15 bg-success/5 p-4 text-[15px] leading-8 text-on-surface-variant">
                            <span className="mr-2 font-semibold text-success">0{index + 1}</span>
                            {strength}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[20px] border border-outline-variant/15 bg-light/[0.02] p-4 text-[15px] leading-8 text-on-surface-variant">
                          No strengths were highlighted in this run.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 p-6 backdrop-blur-2xl">
                    <div className="flex items-center gap-2 text-sm font-semibold text-light">
                      <AlertCircle size={16} className="text-warning" />
                      Priority improvements
                    </div>

                    <div className="mt-5 space-y-3">
                      {result.improvements.length > 0 ? (
                        result.improvements.map((improvement, index) => (
                          <div key={`${improvement}-${index}`} className="rounded-[20px] border border-warning/15 bg-warning/5 p-4 text-[15px] leading-8 text-on-surface-variant">
                            <span className="mr-2 font-semibold text-warning">0{index + 1}</span>
                            {improvement}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[20px] border border-outline-variant/15 bg-light/[0.02] p-4 text-[15px] leading-8 text-on-surface-variant">
                          No improvement notes were returned in this run.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 p-6 backdrop-blur-2xl">
                  <div className="flex items-center gap-2 text-sm font-semibold text-light">
                    <TrendingUp size={16} className="text-primary" />
                    Keyword intelligence
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-outline">Relevant keywords found</div>
                      <div className="flex flex-wrap gap-2">
                        {foundKeywords.length > 0 ? (
                          foundKeywords.map((keyword, index) => (
                            <span key={`${keyword}-${index}`} className="rounded-full border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-success">
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-[15px] leading-7 text-on-surface-variant">No specific matching keywords were returned.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-outline">Critical keywords missing</div>
                      <div className="flex flex-wrap gap-2">
                        {missingKeywords.length > 0 ? (
                          missingKeywords.map((keyword, index) => (
                            <span key={`${keyword}-${index}`} className="rounded-full border border-danger/20 bg-danger/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-300">
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-[15px] leading-7 text-on-surface-variant">No critical keyword gaps were flagged.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4 xl:order-2 flex flex-col gap-6">
                <div className="rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 p-6 backdrop-blur-2xl">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Detailed Metrics</div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-light">Performance overview</h3>

                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">ATS compatibility</span>
                        <span className="font-semibold text-light">{result.score}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                        <div className={`h-full rounded-full ${scoreBand.accent}`} style={{ width: `${result.score}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">Role alignment</span>
                        <span className="font-semibold text-light">{result.roleAlignment || 0}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${result.roleAlignment || 0}%` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-[22px] border border-outline-variant/15 bg-light/[0.02] p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-outline">Strengths</div>
                        <div className="mt-3 text-3xl font-display font-semibold tracking-[-0.03em] text-light">{result.strengths.length}</div>
                      </div>

                      <div className="rounded-[22px] border border-outline-variant/15 bg-light/[0.02] p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-outline">Improvements</div>
                        <div className="mt-3 text-3xl font-display font-semibold tracking-[-0.03em] text-light">{result.improvements.length}</div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-outline-variant/15 bg-light/[0.02] p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-light">
                        <Sparkles size={16} className="text-primary" />
                        Formatting and structure
                      </div>
                      <p className="mt-3 text-[15px] leading-8 text-on-surface-variant">
                        {result.formattingFeedback || 'No special formatting notes were returned for this resume.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[30px] border border-outline-variant/15 bg-surface-lowest/75 p-6 backdrop-blur-2xl sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Waiting for analysis</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-light">Your report will appear here</h2>
                  <p className="mt-2 max-w-2xl text-[15px] leading-7 text-on-surface-variant">
                    Once you upload a file and run the analysis, this section will turn into a cleaner review dashboard with scores, strengths, improvements, and keyword guidance.
                  </p>
                </div>

                <div className="rounded-[26px] border border-outline-variant/15 bg-light/[0.03] px-5 py-4 text-[15px] text-on-surface-variant">
                  Professional layout. Clear hierarchy. Theme-consistent styling.
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResumePage;
