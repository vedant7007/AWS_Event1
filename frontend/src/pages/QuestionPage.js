import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LockdownMode from '../components/LockdownMode';
import Button from '../components/Button';
import Card from '../components/Card';
import { useGameStore } from '../utils/store';
import { questionsAPI, submissionsAPI, adminAPI, authAPI } from '../utils/api';
import { FiClock, FiAlertCircle, FiChevronRight, FiChevronLeft, FiCheckCircle, FiLoader, FiZap, FiLock, FiBook, FiX } from 'react-icons/fi';

const QuestionPage = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const { role, teamId, answers, setCurrentQuestions, setAnswer } = useGameStore();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

  useEffect(() => {
    let intervalId;

    const validateAndLoad = async () => {
      try {
        // 1. Check global round authorization and team status
        const [settingsRes, teamRes] = await Promise.all([
            adminAPI.getSettings(),
            authAPI.getTeam(teamId)
        ]);
        const settings = settingsRes.data;
        const teamData = teamRes.data;
        
        if (!settings.isRoundActive || settings.currentRound !== parseInt(year)) {
          setIsAuthorized(false);
          setLoading(false);
          // If they were actively taking it and it was stopped, force them out
          if (questions.length > 0) {
              navigate('/profile');
          }
          return;
        }

        // 1.5 Check if user already submitted
        const hasCompleted = Object.keys(teamData?.gameState?.[`year${year}`]?.answers?.[role?.toLowerCase()] || {}).length > 0;
        if (hasCompleted) {
            setIsAuthorized(false);
            setLoading(false);
            if (questions.length > 0) navigate('/profile');
            return;
        }

        // 2. Load questions (only once)
        if (questions.length === 0) {
            const response = await questionsAPI.getByYear(year, role);
            setQuestions(response.data.questions);
            setCurrentQuestions(response.data.questions);
        }
        setLoading(false);
      } catch (err) {
        setError('Communications Link Failure. Verify AWS Connection.');
        setLoading(false);
      }
    };

    if (year && role) {
      validateAndLoad();
      intervalId = setInterval(validateAndLoad, 5000); // Check every 5 seconds
    }

    return () => {
        if (intervalId) clearInterval(intervalId);
    };
  }, [year, role, teamId, navigate, questions.length, setCurrentQuestions]);

  // Timer logic
  useEffect(() => {
    if (!isAuthorized) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthorized]);

  useEffect(() => {
    if (timeLeft === 0 && !submitting && isAuthorized) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleDisqualify = async (reason) => {
    if (submitting) return;
    setSubmitting(true);
    setError('Disqualified: ' + reason);
    try {
      await submissionsAPI.disqualify(year, reason);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Disqualification Uplink Failed. Retrying...');
      setSubmitting(false);
    }
  };

  const handleTabSwitch = (count, reason) => {
    setTabSwitchWarnings(count);
    if (count >= 3) handleDisqualify(reason || 'Security Violation'); 
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswer(questionId, answer);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (questions.length > 0) {
        const allAnswered = questions.every(q => answers[q.questionId] !== undefined);
        if (!allAnswered && timeLeft > 0) {
          setError('Mandatory Field Check: All strategic scenarios require a data point.');
          return;
        }
    }

    setSubmitting(true);
    setError('');

    try {
      await submissionsAPI.submit(year, answers, 1200 - timeLeft);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Uplink Failed. Retrying...');
      setSubmitting(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-24">
      <div className="relative">
          <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full"></div>
          <FiZap className="relative animate-pulse text-brand-primary mb-24" size={64} />
      </div>
      <p className="text-12 font-bold text-brand-text-muted uppercase tracking-[0.4em] animate-pulse">Synchronizing Strategic Data Stream...</p>
    </div>
  );

  if (!isAuthorized) return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-24 selection:bg-brand-primary/30">
        <Card className="p-48 max-w-md w-full text-center space-y-32 border-brand-primary/20">
            <div className="w-80 h-80 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary mx-auto">
                <FiLock size={40} />
            </div>
            <div className="space-y-12">
                <h2 className="text-24 font-semibold tracking-tight text-brand-text-primary italic">Authorization Denied</h2>
                <p className="text-14 text-brand-text-muted leading-relaxed">
                    This tactical sector is currently <span className="text-brand-text-primary px-4 font-mono font-bold bg-brand-surface rounded">ARCHIVED</span> or <span className="text-brand-text-primary px-4 font-mono font-bold bg-brand-surface rounded">UNINITIALIZED</span> by Command.
                </p>
            </div>
            <Button onClick={() => navigate('/profile')} className="w-full">
                Return to Dashboard
            </Button>
        </Card>
    </div>
  );

  if (error && questions.length === 0) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-24 font-sans">
      <Card className="p-48 max-w-md w-full text-center space-y-32 border-red-500/20 bg-brand-surface/40 backdrop-blur-xl">
        <div className="w-80 h-80 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto animate-pulse">
            <FiAlertTriangle size={40} />
        </div>
        <div className="space-y-12">
            <h2 className="text-24 font-bold tracking-tight text-brand-text-primary uppercase">Communication Severed</h2>
            <p className="text-14 text-brand-text-muted leading-relaxed">The secure link to AWS Command has been interrupted. Re-establish handshake to continue mission.</p>
            <div className="bg-red-500/5 p-12 rounded border border-red-500/10 mt-16">
                <p className="text-11 font-mono text-red-400 uppercase">Error: {error}</p>
            </div>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-48 font-bold uppercase tracking-widest bg-brand-primary shadow-lg shadow-brand-primary/20">
            Re-establish Handshake
        </Button>
      </Card>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-primary/30 relative overflow-hidden font-sans">
        <LockdownMode onTabSwitch={handleTabSwitch} onWarning={(msg) => setError(msg)} />
        
        {/* Background Data Stream (Visual Only) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2d2d2d_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        {/* Strategic Header */}
        <header className="relative z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md px-32 py-16">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-16">
                    <div className="p-8 rounded-lg bg-brand-primary/10 text-brand-primary">
                        <FiZap size={20} />
                    </div>
                    <div>
                        <h1 className="text-14 font-bold uppercase tracking-[0.2em]">Operational Year {year}</h1>
                        <p className="text-10 text-brand-text-muted font-mono">SECTOR-{role?.toUpperCase()}-SIM-01</p>
                    </div>
                </div>

                <div className="flex items-center space-x-32">
                    {/* Handbook Toggle */}
                    <button 
                        onClick={() => setIsHandbookOpen(!isHandbookOpen)}
                        className={`px-16 py-8 rounded-lg flex items-center space-x-8 font-bold text-14 transition-all ${isHandbookOpen ? 'bg-brand-primary text-white' : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'}`}
                    >
                        <FiBook size={18} />
                        <span>Handbook</span>
                    </button>

                    {/* Session Timer */}
                    <div className={`flex items-center space-x-12 px-20 py-8 rounded-full border transition-all ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-brand-surface border-brand-border'}`}>
                        <FiClock size={16} />
                        <span className="text-18 font-mono font-bold tracking-tighter">{formatTime(timeLeft)}</span>
                    </div>

                    <button 
                        onClick={() => navigate('/profile')}
                        className="p-8 text-brand-text-muted hover:text-brand-primary transition-colors"
                        title="Abort Mission"
                    >
                        <FiLock size={20} />
                    </button>
                </div>
            </div>
        </header>

        <main className={`relative z-10 mx-auto px-24 py-48 flex gap-32 transition-all duration-300 ${isHandbookOpen ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
            {/* Left Navigation Panel */}
            <aside className="w-[280px] flex-shrink-0 space-y-24">
                <div className="bg-brand-surface/40 border border-brand-border rounded-xl p-24">
                    <h3 className="text-14 font-bold text-brand-text-muted uppercase tracking-widest mb-16 border-b border-brand-border pb-12">Nav Panel</h3>
                    <div className="flex flex-col gap-8">
                        {questions.map((q, idx) => {
                            const isAnswered = answers[q.questionId] !== undefined;
                            const isActive = idx === currentIndex;
                            return (
                                <button
                                    key={q.questionId}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`flex items-center justify-between p-12 rounded-lg transition-all border ${
                                        isActive ? 'bg-brand-primary/20 border-brand-primary text-brand-text-primary' :
                                        isAnswered ? 'bg-brand-surface border-emerald-500/30 text-brand-text-primary' :
                                        'bg-brand-bg border-brand-border text-brand-text-muted hover:border-brand-primary/30'
                                    }`}
                                >
                                    <span className="font-bold">Question {idx + 1}</span>
                                    {isAnswered && <FiCheckCircle className="text-emerald-400" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Status and Submit */}
                <div className="bg-brand-surface/40 border border-brand-border rounded-xl p-24 space-y-16">
                    <div className="flex justify-between items-center text-12 font-bold uppercase tracking-widest text-brand-text-muted">
                        <span>Answered</span>
                        <span>{Object.keys(answers).length} / {questions.length}</span>
                    </div>
                    {error && (
                        <div className="text-red-400 text-12 font-bold p-8 bg-red-500/10 rounded animate-pulse text-center">
                            {error}
                        </div>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`w-full h-48 ${submitting ? 'opacity-50' : 'bg-emerald-600 hover:bg-emerald-500 ring-emerald-500/30'}`}
                    >
                        {submitting ? <FiLoader className="animate-spin mx-auto" /> : 'Submit Responses'}
                    </Button>
                </div>
            </aside>

            {/* Active Question Display */}
            <div className="flex-1 min-w-0">
                {/* Combat Scenario Card */}
                {currentQuestion && (
                    <div className="space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <Card className="p-40 border-brand-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-128 h-128 bg-brand-primary/5 -mr-64 -mt-64 rounded-full blur-3xl"></div>
                            
                            <div className="space-y-24 relative z-10">
                                    <div className="flex items-center space-x-8 text-brand-primary">
                                        <div className="w-8 h-1 bg-brand-primary"></div>
                                        <span className="text-10 font-bold uppercase tracking-[0.2em]">Briefing Narrative</span>
                                    </div>
                                    <p className="text-20 text-brand-text-muted leading-relaxed font-medium italic">
                                        "{currentQuestion.scenario}"
                                    </p>
                                </div>

                                <h3 className="text-32 font-semibold text-brand-text-primary tracking-tight leading-tight pt-16 border-t border-brand-border/50">
                                    {currentQuestion.question}
                                </h3>
                            </div>
                        </Card>

                        {/* Strategic Responses */}
                        <div className="grid grid-cols-1 gap-16">
                            {currentQuestion.options.map((opt) => (
                                <button 
                                    key={opt.optionId}
                                    onClick={() => handleAnswerChange(currentQuestion.questionId, opt.value)}
                                    className={`group flex items-center space-x-24 p-24 rounded-2xl border transition-all text-left relative overflow-hidden backdrop-blur-sm ${
                                        answers[currentQuestion.questionId] === opt.value
                                        ? 'bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary/50'
                                        : 'bg-brand-surface/40 border-brand-border hover:border-brand-primary/30'
                                    }`}
                                >
                                    {/* Selection Glow */}
                                    {answers[currentQuestion.questionId] === opt.value && (
                                        <div className="absolute left-0 top-0 w-4 h-full bg-brand-primary"></div>
                                    )}

                                    <div className={`flex-shrink-0 w-48 h-48 rounded-xl flex items-center justify-center font-bold text-18 font-mono border transition-all ${
                                        answers[currentQuestion.questionId] === opt.value
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                        : 'bg-brand-bg text-brand-text-muted border-brand-border group-hover:border-brand-primary/30'
                                    }`}>
                                        {opt.optionId}
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <p className={`text-18 font-medium transition-colors ${
                                            answers[currentQuestion.questionId] === opt.value ? 'text-brand-text-primary' : 'text-brand-text-muted group-hover:text-brand-text-primary'
                                        }`}>
                                            {opt.text}
                                        </p>
                                    </div>

                                    {answers[currentQuestion.questionId] === opt.value && (
                                        <div className="flex-shrink-0 text-brand-primary">
                                            <FiCheckCircle size={24} className="animate-in zoom-in duration-300" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Handbook Right Panel */}
            {isHandbookOpen && (
                <aside className="w-[500px] h-[calc(100vh-200px)] flex-shrink-0 bg-brand-surface/40 border border-brand-border rounded-xl overflow-hidden animate-in slide-in-from-right-8 duration-300 relative flex flex-col sticky top-24">
                    <div className="px-16 py-12 border-b border-brand-border bg-brand-surface flex justify-between items-center">
                        <span className="font-bold text-12 uppercase tracking-widest text-brand-text-primary">Strategic Handbook</span>
                        <div className="flex items-center gap-8">
                            <a 
                                href="/handbook.pdf" 
                                download 
                                className="p-4 rounded-lg hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-primary transition-colors"
                                title="Download PDF"
                            >
                                <FiBook size={18} />
                            </a>
                            <button onClick={() => setIsHandbookOpen(false)} className="p-4 rounded-lg hover:bg-red-500/10 text-brand-text-muted hover:text-red-400 transition-colors">
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <iframe 
                            src="/handbook.pdf" 
                            className="w-full h-full border-none"
                            title="Handbook PDF"
                        />
                    </div>
                </aside>
            )}
        </main>
    </div>
  );
};

export default QuestionPage;
