import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LockdownMode from '../components/LockdownMode';
import Button from '../components/Button';
import Card from '../components/Card';
import { useGameStore } from '../utils/store';
import { questionsAPI, submissionsAPI, adminAPI } from '../utils/api';
import { FiClock, FiAlertCircle, FiChevronRight, FiChevronLeft, FiCheckCircle, FiLoader, FiZap, FiLock } from 'react-icons/fi';

const QuestionPage = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const { role, teamId, answers, setCurrentQuestions, setAnswer } = useGameStore();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const validateAndLoad = async () => {
      try {
        // 1. Check global round authorization
        const settingsRes = await adminAPI.getSettings();
        const settings = settingsRes.data;
        
        if (!settings.isRoundActive || settings.currentRound !== parseInt(year)) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // 2. Load questions
        const response = await questionsAPI.getByYear(year, role);
        setQuestions(response.data.questions);
        setCurrentQuestions(response.data.questions);
        setLoading(false);
      } catch (err) {
        setError('Communications Link Failure. Verify AWS Connection.');
        setLoading(false);
      }
    };

    if (year && role) {
      validateAndLoad();
    }
  }, [year, role, setCurrentQuestions]);

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

  const handleTabSwitch = (count) => {
    setTabSwitchWarnings(count);
    if (count >= 3) handleSubmit(); 
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
      await submissionsAPI.submit(year, answers, 480 - timeLeft);
      setTimeout(() => navigate(`/year-end-report/${year}`), 1500);
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
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-24">
      <Card className="p-48 max-w-md w-full text-center space-y-32 border-red-500/20">
        <div className="w-80 h-80 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto animate-pulse">
            <FiAlertCircle size={40} />
        </div>
        <div className="space-y-12">
            <h2 className="text-24 font-semibold tracking-tight text-brand-text-primary">Communication Servered</h2>
            <p className="text-14 text-brand-text-muted leading-relaxed">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full bg-brand-surface border-brand-border text-brand-text-primary hover:bg-brand-bg">
            Retry Handshake
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

        <main className="relative z-10 max-w-5xl mx-auto px-24 py-48">
            {/* Progress Tracking */}
            <div className="mb-48 space-y-16">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-10 font-bold text-brand-primary uppercase tracking-[0.3em]">Decision Sequence</span>
                        <h2 className="text-32 font-semibold tracking-tighter leading-none mt-4">
                            Case Study {currentIndex + 1} <span className="text-brand-text-muted">/ {questions.length}</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <span className="text-10 font-bold text-brand-text-muted uppercase tracking-widest leading-none">Authorization Rank</span>
                        <p className="text-14 text-brand-text-primary font-bold uppercase">{role === 'cto' ? 'Cloud Architect' : role === 'cfo' ? 'Finance' : 'Growth Lead'}</p>
                    </div>
                </div>
                <div className="h-4 bg-brand-surface rounded-full overflow-hidden border border-brand-border">
                    <div 
                        className="h-full bg-brand-primary shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-700" 
                        style={{width: `${((currentIndex + 1)/questions.length)*100}%`}}
                    ></div>
                </div>
            </div>

            {/* Combat Scenario Card */}
            {currentQuestion && (
                <div className="space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <Card className="p-40 border-brand-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-128 h-128 bg-brand-primary/5 -mr-64 -mt-64 rounded-full blur-3xl"></div>
                        
                        <div className="space-y-24 relative z-10">
                            <div className="space-y-16">
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

            {/* Mission Controls */}
            <div className="mt-64 flex flex-col md:flex-row items-center gap-24 font-sans">
                <button
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="w-full md:w-auto px-32 py-16 text-12 font-bold uppercase tracking-widest text-brand-text-muted hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex items-center space-x-8"
                >
                    <FiChevronLeft />
                    <span>Previous Response</span>
                </button>

                <div className="flex-1">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-12 px-24 rounded-full flex items-center space-x-12 text-12 font-bold justify-center animate-shake">
                            <FiAlertCircle size={14} className="flex-shrink-0" />
                            <span>SYSTEM ALERT: {error}</span>
                        </div>
                    )}
                </div>

                {currentIndex === questions.length - 1 ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`w-full md:w-[280px] h-64 ${submitting ? 'opacity-50' : 'bg-emerald-600 hover:bg-emerald-500 ring-emerald-500/30'}`}
                    >
                        {submitting ? (
                            <FiLoader className="animate-spin" size={20} />
                        ) : (
                            <div className="flex items-center space-x-12">
                                <span className="text-14 uppercase font-black tracking-widest">Commit Strategic Data</span>
                                <FiZap size={18} />
                            </div>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                        className="w-full md:w-[280px] h-64"
                    >
                        <div className="flex items-center space-x-12">
                            <span className="text-14 uppercase font-black tracking-widest">Continue Evaluation</span>
                            <FiChevronRight size={20} />
                        </div>
                    </Button>
                )}
            </div>
        </main>
    </div>
  );
};

export default QuestionPage;
