import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LockdownMode from '../components/LockdownMode';
import { useGameStore } from '../utils/store';
import { questionsAPI, submissionsAPI, adminAPI, authAPI } from '../utils/api';
import {
  FiClock, FiAlertCircle, FiChevronRight, FiChevronLeft,
  FiCheckCircle, FiLoader, FiActivity, FiGrid
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

const QuestionPage = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const { role, teamId, answers, setCurrentQuestions, setAnswer, setNextRoundSettings, setTabSwitchWarnings } = useGameStore();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [showNavigator, setShowNavigator] = useState(false);
  const pageRef = useRef(null);

  const answeredCount = questions.filter(q => {
    const a = answers[q.questionId];
    if (a === undefined || a === '') return false;
    if (Array.isArray(a) && a.length === 0) return false;
    return true;
  }).length;

  const isQuestionAnswered = (q) => {
    const a = answers[q.questionId];
    if (a === undefined || a === '') return false;
    if (Array.isArray(a) && a.length === 0) return false;
    return true;
  };

  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return;

    if (questions.length > 0) {
        const unansweredIndices = questions.map((q, i) => (answers[q.questionId] === undefined || answers[q.questionId] === '') ? i + 1 : null).filter(i => i !== null);
        if (unansweredIndices.length > 0 && timeLeft > 0) {
          setError(`Tactical scenarios ${unansweredIndices.join(', ')} require data input before final commitment.`);
          return;
        }
    }

    setSubmitting(true);
    setError('');

    try {
      await submissionsAPI.submit(year, answers, 1200 - timeLeft);
      setSubmitted(true);
      const end = Date.now() + 2000;
      const fire = () => {
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 }, colors: ['#7C3AED', '#10B981', '#F59E0B', '#3B82F6'] });
        if (Date.now() < end) requestAnimationFrame(fire);
      };
      fire();
      setTimeout(() => {
          if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
          }
          navigate('/profile', { state: { submissionSuccess: true } });
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Uplink Failed. Retrying...');
      setSubmitting(false);
    }
  }, [submitting, submitted, questions, answers, timeLeft, year, navigate]);

  useEffect(() => {
    let intervalId;

    const validateAndLoad = async () => {
      try {
        const [settingsRes, teamRes] = await Promise.all([
            adminAPI.getSettings(),
            authAPI.getTeam(teamId)
        ]);
        const settings = settingsRes.data;
        const teamData = teamRes.data;
        setNextRoundSettings(settings);

        if (!settings.isRoundActive || settings.currentRound !== parseInt(year)) {
          if (!submitted) {
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
            navigate('/profile');
          }
          return;
        }

        const hasCompleted = Object.keys(teamData?.gameState?.[`year${year}`]?.answers?.[role?.toLowerCase()] || {}).length > 0;
        if (hasCompleted && !submitted) {
            setSubmitted(true);
        }

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
      intervalId = setInterval(validateAndLoad, 5000);
    }

    return () => {
        if (intervalId) clearInterval(intervalId);
    };
  }, [year, role, teamId, navigate, questions.length, setCurrentQuestions, submitted, setNextRoundSettings, setTabSwitchWarnings]);

  useEffect(() => {
    if (!isAuthorized || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthorized, submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitting && isAuthorized && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitting, isAuthorized, submitted, handleSubmit]);

  // Keyboard navigation
  useEffect(() => {
    if (loading || submitted) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }

      const currentQuestion = questions[currentIndex];
      if (!currentQuestion) return;

      if (currentQuestion.type === 'mcq' && currentQuestion.options) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= currentQuestion.options.length) {
          setAnswerInternal(currentQuestion.questionId, currentQuestion.options[num - 1].optionId);
        }
      }

      if (currentQuestion.type === 'truefalse') {
        if (e.key === '1') setAnswerInternal(currentQuestion.questionId, 'True');
        if (e.key === '2') setAnswerInternal(currentQuestion.questionId, 'False');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, submitted, currentIndex, questions, answers]);

  const handleDisqualify = async (reason) => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setError('Disqualified: ' + reason);
    try {
      await submissionsAPI.disqualify(year, reason);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Disqualification Uplink Failed.');
      setSubmitting(false);
    }
  };

  const handleTabSwitch = (count, reason) => {
    setTabSwitchWarnings(count);
    if (count >= 3) handleDisqualify(reason || 'Security Violation');
  };

  const setAnswerInternal = (questionId, answer) => {
    if (submitted) return;
    setAnswer(questionId, answer);
    setError('');
  };

  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const renderQuestion = () => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentQuestion.questionId] === opt.optionId;
                return (
                    <button
                        key={opt.optionId}
                        onClick={() => setAnswerInternal(currentQuestion.questionId, opt.optionId)}
                        className={`p-24 rounded-2xl border-2 text-left transition-all group relative overflow-hidden ${
                            isSelected
                            ? 'bg-brand-primary/10 border-brand-primary shadow-glow'
                            : 'bg-brand-surface border-brand-border hover:border-brand-primary/40'
                        }`}
                    >
                        <div className="flex items-start gap-16 relative z-10">
                            <div className={`w-32 h-32 rounded-lg flex items-center justify-center font-bold text-14 shrink-0 transition-all ${
                                isSelected ? 'bg-brand-primary text-white' : 'bg-brand-elevated text-brand-text-muted'
                            }`}>
                                {idx + 1}
                            </div>
                            <span className={`text-16 font-medium leading-relaxed ${isSelected ? 'text-brand-text-primary' : 'text-brand-text-muted'}`}>
                                {opt.text}
                            </span>
                        </div>
                        {isSelected && (
                            <div className="absolute top-8 right-8">
                                <FiCheckCircle className="text-brand-primary" size={20} />
                            </div>
                        )}
                    </button>
                );
            })}
          </div>
        );

      case 'truefalse':
        return (
          <div className="grid grid-cols-2 gap-24 max-w-xl">
            {['True', 'False'].map((val, idx) => {
              const isSelected = answers[currentQuestion.questionId] === val;
              const isTrue = val === 'True';
              return (
                <button
                  key={val}
                  onClick={() => setAnswerInternal(currentQuestion.questionId, val)}
                  className={`p-[40px] rounded-2xl border-2 flex flex-col items-center justify-center gap-16 transition-all group ${
                    isSelected
                      ? (isTrue ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]')
                      : 'bg-brand-surface border-brand-border hover:border-white/20'
                  }`}
                >
                  <div className={`text-[48px] font-black uppercase tracking-tighter transition-all ${
                    isSelected ? 'scale-110' : 'opacity-20'
                  } ${isTrue ? 'text-emerald-500' : 'text-red-500'}`}>
                    {val === 'True' ? 'YES' : 'NO'}
                  </div>
                  <span className={`text-12 font-bold uppercase tracking-widest px-16 py-[6px] rounded-full border ${
                    isSelected
                      ? (isTrue ? 'border-emerald-500/30 text-emerald-500' : 'border-red-500/30 text-red-500')
                      : 'border-brand-border text-brand-text-muted'
                  }`}>
                    {idx + 1}. {val.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        );

      case 'multi-select':
        return (
            <div className="space-y-16">
                <div className="flex items-center gap-12 text-purple-400 text-12 font-bold uppercase tracking-widest mb-12 p-12 bg-brand-primary/10 rounded">
                    <FiActivity size={14} className="animate-pulse shrink-0" />
                    <span style={{textTransform: 'none'}}>Note: This is a multiple choice question. This question may have more than one correct option and you are allowed to select more than one answer.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {currentQuestion.options.map((opt) => {
                        const currentAnswers = answers[currentQuestion.questionId] || [];
                        const isSelected = currentAnswers.includes(opt.optionId);
                        return (
                            <button
                                key={opt.optionId}
                                onClick={() => {
                                    const next = isSelected
                                        ? currentAnswers.filter(id => id !== opt.optionId)
                                        : [...currentAnswers, opt.optionId];
                                    setAnswerInternal(currentQuestion.questionId, next);
                                }}
                                className={`p-24 rounded-2xl border-2 text-left transition-all group ${
                                    isSelected
                                    ? 'bg-brand-primary/10 border-brand-primary shadow-glow'
                                    : 'bg-brand-surface border-brand-border hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-16">
                                    <div className={`w-24 h-24 rounded-md border-2 flex items-center justify-center transition-all ${
                                        isSelected ? 'bg-brand-primary border-brand-primary' : 'border-brand-border'
                                    }`}>
                                        {isSelected && <FiCheckCircle size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-[15px] font-medium ${isSelected ? 'text-brand-text-primary' : 'text-brand-text-muted'}`}>
                                        {opt.text}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );

      case 'range':
        return (
            <div className="max-w-[700px] p-32 bg-brand-surface border border-brand-border rounded-3xl space-y-[40px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
                    <div className="space-y-12">
                        <label className="text-10 font-bold text-brand-text-muted uppercase tracking-widest">Lower Bound Threshold</label>
                        <div className="relative group">
                            <input
                                type="number"
                                value={answers[currentQuestion.questionId]?.min || ''}
                                onChange={(e) => {
                                    const current = answers[currentQuestion.questionId] || { min: '', max: '' };
                                    setAnswerInternal(currentQuestion.questionId, { ...current, min: e.target.value });
                                }}
                                className="w-full bg-brand-bg border-2 border-brand-border rounded-2xl py-[20px] px-24 text-32 font-bold text-brand-text-primary focus:border-brand-primary outline-none transition-all"
                                placeholder="0"
                            />
                            <div className="absolute right-[20px] top-1/2 -translate-y-1/2 text-brand-text-muted/20 font-bold">MIN</div>
                        </div>
                    </div>
                    <div className="space-y-12">
                        <label className="text-10 font-bold text-brand-text-muted uppercase tracking-widest">Upper Bound Threshold</label>
                        <div className="relative group">
                            <input
                                type="number"
                                value={answers[currentQuestion.questionId]?.max || ''}
                                onChange={(e) => {
                                    const current = answers[currentQuestion.questionId] || { min: '', max: '' };
                                    setAnswerInternal(currentQuestion.questionId, { ...current, max: e.target.value });
                                }}
                                className="w-full bg-brand-bg border-2 border-brand-border rounded-2xl py-[20px] px-24 text-32 font-bold text-brand-text-primary focus:border-brand-primary outline-none transition-all"
                                placeholder="100"
                            />
                            <div className="absolute right-[20px] top-1/2 -translate-y-1/2 text-brand-text-muted/20 font-bold">MAX</div>
                        </div>
                    </div>
                </div>
            </div>
        );

      case 'numerical':
        return (
          <div className="max-w-[400px]">
             <div className="relative group">
                <input
                    type="number"
                    value={answers[currentQuestion.questionId] || ''}
                    onChange={(e) => setAnswerInternal(currentQuestion.questionId, e.target.value)}
                    className="w-full bg-brand-surface border-2 border-brand-border rounded-2xl py-24 px-32 text-[40px] font-bold text-brand-text-primary focus:border-brand-primary outline-none transition-all text-center focus:shadow-glow"
                    placeholder="ENTER VALUE"
                />
                <div className="absolute inset-x-0 -bottom-12 flex justify-center">
                    <span className="bg-brand-primary text-white text-10 font-bold py-[4px] px-12 rounded-full uppercase tracking-widest">Numerical Input Lock</span>
                </div>
             </div>
          </div>
        );

      default:
        return <p className="text-brand-text-muted">Scenario data corrupted. Please contact command center.</p>;
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-brand-bg text-brand-text-primary font-mono selection:bg-brand-primary/30 flex flex-col overflow-hidden">
      {!isAuthorized && <LockdownMode onAuthorized={() => setIsAuthorized(true)} />}
      <LockdownMode onTabSwitch={handleTabSwitch} onWarning={(msg) => setError(msg)} />

      {/* Top Tactical Taskbar */}
      <div className="h-[64px] border-b border-brand-border bg-brand-elevated/80 backdrop-blur-md flex items-center justify-between px-32 shrink-0 z-50">
        <div className="flex items-center gap-24">
          <div className="flex items-center gap-12 group cursor-default">
            <div className="w-[10px] h-[10px] bg-brand-primary rounded-full animate-pulse shadow-glow"></div>
            <span className="text-14 font-bold tracking-[0.2em] text-brand-text-primary uppercase">Round {parseInt(year) + 1}</span>
          </div>

          {!loading && !submitted && (
            <button
              onClick={() => setShowNavigator(!showNavigator)}
              className={`flex items-center gap-8 px-12 py-[6px] rounded-lg text-11 font-bold uppercase tracking-wider transition-all ${
                showNavigator ? 'bg-brand-primary text-white' : 'bg-brand-surface border border-brand-border text-brand-text-muted hover:text-brand-primary'
              }`}
            >
              <FiGrid size={14} />
              Navigator
            </button>
          )}
        </div>

        <div className="flex items-center gap-24">
          {!loading && !submitted && (
            <div className="hidden md:flex items-center gap-8 text-12 text-brand-text-muted">
              <span className="font-bold text-brand-primary">{answeredCount}</span>
              <span>/</span>
              <span>{questions.length}</span>
              <span className="text-10 uppercase tracking-wider">answered</span>
            </div>
          )}

          {error && (
            <div className="hidden lg:flex items-center gap-[10px] text-red-400 text-12 font-bold uppercase tracking-wider animate-in slide-in-from-right duration-300 max-w-xs truncate">
                <FiAlertCircle className="animate-pulse shrink-0" />
                <span className="truncate">{error}</span>
            </div>
          )}

          <div className={`flex items-center gap-16 px-[20px] py-8 rounded-lg border transition-all duration-500 ${
            timeLeft < 300 ? 'bg-red-500/10 border-red-500/30 animate-pulse' : 'bg-brand-surface border-brand-border'
          }`}>
            <FiClock size={18} className={timeLeft < 300 ? 'text-red-500' : 'text-brand-primary'} />
            <span className={`text-[20px] font-bold tabular-nums tracking-wider ${timeLeft < 300 ? 'text-red-500' : 'text-brand-text-primary'}`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!loading && !submitted && (
        <div className="h-[3px] bg-brand-border shrink-0 relative z-50">
          <div
            className="h-full bg-brand-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Mobile error banner */}
      {error && (
        <div className="lg:hidden flex items-center gap-8 px-16 py-8 bg-red-500/10 border-b border-red-500/20 text-red-400 text-12 font-bold shrink-0 z-40">
          <FiAlertCircle className="shrink-0" size={14} />
          <span className="truncate">{error}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-transparent"></div>
        </div>

        {/* Question Navigator Panel */}
        {showNavigator && !submitted && !loading && (
          <div className="w-[220px] border-r border-brand-border bg-brand-elevated/50 backdrop-blur-sm shrink-0 z-10 overflow-y-auto custom-scrollbar p-16 space-y-8 animate-in slide-in-from-left duration-300">
            <p className="text-10 font-bold text-brand-text-muted uppercase tracking-widest mb-12 px-4">Questions</p>
            {questions.map((q, idx) => {
              const answered = isQuestionAnswered(q);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.questionId}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full flex items-center gap-12 px-12 py-10 rounded-xl text-left transition-all ${
                    isCurrent
                      ? 'bg-brand-primary/15 border border-brand-primary/40 text-brand-text-primary'
                      : answered
                        ? 'bg-emerald-500/5 border border-emerald-500/20 text-brand-text-secondary hover:bg-emerald-500/10'
                        : 'bg-brand-surface/50 border border-brand-border text-brand-text-muted hover:bg-brand-surface'
                  }`}
                >
                  <div className={`w-24 h-24 rounded-md flex items-center justify-center text-11 font-bold shrink-0 ${
                    isCurrent ? 'bg-brand-primary text-white'
                    : answered ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-brand-elevated text-brand-text-muted'
                  }`}>
                    {answered && !isCurrent ? <FiCheckCircle size={12} /> : idx + 1}
                  </div>
                  <span className="text-12 font-semibold truncate">
                    {q.type === 'mcq' ? 'MCQ' : q.type === 'truefalse' ? 'T/F' : q.type === 'multi-select' ? 'Multi' : q.type === 'range' ? 'Range' : 'Num'}
                  </span>
                </button>
              );
            })}

            <div className="pt-12 mt-8 border-t border-brand-border">
              <div className="text-center space-y-4">
                <div className="text-24 font-bold text-brand-primary font-mono">{Math.round(progressPercent)}%</div>
                <p className="text-10 text-brand-text-muted uppercase tracking-widest font-bold">Complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-24">
              <FiLoader className="w-48 h-48 text-brand-primary animate-spin" />
              <p className="text-12 font-bold uppercase tracking-[0.4em] text-brand-text-muted animate-pulse">Syncing Tactical Link...</p>
            </div>
          ) : submitted ? (
            <div className="h-full flex flex-col items-center justify-center p-[40px] text-center max-w-xl mx-auto animate-in zoom-in duration-500">
               <div className="w-[80px] h-[80px] rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-24">
                 <FiCheckCircle size={40} className="text-emerald-500" />
               </div>
               <h2 className="text-32 font-bold mb-24 text-emerald-400">ROUND {parseInt(year) + 1} COMPLETED</h2>
               <div className="p-24 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center gap-16 mb-[40px]">
                  <div className="w-8 h-8 bg-brand-primary rounded-full animate-ping"></div>
                  <span className="text-12 font-bold uppercase tracking-[0.2em] text-brand-text-muted">Syncing tactical data with Command Center...</span>
               </div>
               <p className="text-12 text-brand-text-muted animate-pulse uppercase tracking-widest font-bold">Redirecting to Dashboard in 3 seconds...</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-[40px] md:p-[64px] animate-in slide-in-from-bottom-4 duration-500">
              {questions[currentIndex] && (
                <div className="space-y-48">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[20px] opacity-60">
                      <span className="text-12 font-bold text-brand-primary uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
                    </div>

                    {/* Inline mini question dots */}
                    <div className="hidden md:flex items-center gap-[6px]">
                      {questions.map((q, idx) => (
                        <button
                          key={q.questionId}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-[10px] h-[10px] rounded-full transition-all ${
                            idx === currentIndex
                              ? 'bg-brand-primary scale-125'
                              : isQuestionAnswered(q)
                                ? 'bg-emerald-500'
                                : 'bg-brand-elevated hover:bg-brand-text-muted'
                          }`}
                          title={`Question ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-24">
                    <h3 className="text-32 md:text-[40px] font-bold text-brand-text-primary leading-[1.2] tracking-tight">
                        {questions[currentIndex].question}
                    </h3>
                    <div className="h-[4px] w-[64px] bg-brand-primary rounded-full"></div>
                  </div>

                  <div className="py-12">
                    {renderQuestion()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      {!submitted && !loading && (
        <div className="border-t border-brand-border bg-brand-elevated shrink-0 z-40">
          {/* Keyboard hint */}
          <div className="hidden md:flex items-center justify-center gap-24 py-[6px] border-b border-brand-border/50 text-10 text-brand-text-muted/50 font-medium">
            <span><kbd className="px-[5px] py-[1px] bg-brand-surface border border-brand-border rounded text-[9px]">&larr;</kbd> <kbd className="px-[5px] py-[1px] bg-brand-surface border border-brand-border rounded text-[9px]">&rarr;</kbd> navigate</span>
            <span><kbd className="px-[5px] py-[1px] bg-brand-surface border border-brand-border rounded text-[9px]">1</kbd>-<kbd className="px-[5px] py-[1px] bg-brand-surface border border-brand-border rounded text-[9px]">4</kbd> select option</span>
          </div>

          <div className="h-[72px] flex items-center px-[40px]">
            <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`flex items-center gap-12 px-24 py-12 rounded-xl text-12 font-bold uppercase tracking-widest transition-all ${
                    currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'text-brand-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <FiChevronLeft size={18} />
                Previous
              </button>

              <div className="flex items-center gap-16">
                {currentIndex === questions.length - 1 ? (
                   <button
                     onClick={handleSubmit}
                     disabled={submitting}
                     className="bg-emerald-600 hover:bg-emerald-500 text-white px-32 py-14 rounded-xl font-bold text-12 uppercase tracking-[0.2em] transition-all flex items-center gap-12 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                   >
                     {submitting ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                     Submit
                   </button>
                ) : (
                   <button
                     onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                     className="bg-brand-primary hover:bg-brand-primary/90 text-white px-32 py-14 rounded-xl font-bold text-12 uppercase tracking-[0.2em] transition-all flex items-center gap-12 shadow-glow"
                   >
                     Next
                     <FiChevronRight size={18} />
                   </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
