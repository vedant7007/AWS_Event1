import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../utils/store';
import { adminAPI, authAPI, submissionsAPI, questionsAPI } from '../utils/api';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { FiCheckCircle, FiChevronLeft, FiLock } from 'react-icons/fi';

export default function AnswersPage() {
  const { year } = useParams();
  const navigate = useNavigate();
  const { teamId, role } = useGameStore();
  const [submission, setSubmission] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, qRes] = await Promise.all([
          submissionsAPI.get(teamId, year),
          questionsAPI.getByYear(year, role)
        ]);
        setSubmission(subRes.data);
        setQuestions(qRes.data.questions || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId, year, role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans">
        <div className="animate-pulse text-brand-primary">Loading Responses...</div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-24 font-sans">
        <Card className="max-w-md w-full p-48 text-center border-brand-primary/20">
          <FiLock size={48} className="mx-auto text-brand-primary mb-24" />
          <h2 className="text-24 font-bold text-brand-text-primary mb-16">No Data Available</h2>
          <p className="text-brand-text-muted mb-32">You have not successfully submitted responses for this round or the data is encrypted.</p>
          <Button onClick={() => navigate('/profile')} className="w-full">Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <Header title={`Round ${year} - Your Submissions`} />
      <main className="max-w-4xl mx-auto px-24 py-48 relative z-10 space-y-32">
        <div className="flex items-center space-x-16">
          <div className="w-12 h-40 bg-emerald-400 rounded-full"></div>
          <div>
            <h1 className="text-32 font-bold tracking-tight">Mission Log: Round {year}</h1>
            <p className="text-14 text-emerald-400 font-medium uppercase tracking-widest mt-4">Transmitted Successfully</p>
          </div>
        </div>

        <Card className="p-32 space-y-32 bg-brand-surface/80 backdrop-blur-xl border-brand-border">
          <div className="border-b border-brand-border pb-16">
            <h2 className="text-20 font-bold text-brand-text-primary">Your Tactical Decisions</h2>
            <p className="text-14 text-brand-text-muted mt-4">These are your recorded inputs. Accurate assessment data will remain hidden.</p>
          </div>

          <div className="space-y-24">
            {questions.map((q, i) => {
              const myAnswer = submission.answers[q.questionId];
              const selectedOption = q.options.find(o => o.value === myAnswer) || { text: myAnswer, optionId: myAnswer };

              return (
                <div key={i} className="p-24 rounded-card bg-brand-bg border border-brand-border">
                  <h3 className="text-16 font-semibold text-brand-text-primary mb-16 leading-relaxed">
                    <span className="text-brand-primary mr-8">Q{i + 1}.</span>
                    {q.question}
                  </h3>
                  <div className="flex items-center space-x-16 bg-brand-primary/10 p-16 rounded-button border border-brand-primary/20">
                    <div className="w-40 h-40 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold font-mono">
                      {selectedOption.optionId || '?'}
                    </div>
                    <div className="flex-1 text-brand-text-primary font-medium">
                      {myAnswer === undefined ? <span className="text-brand-text-muted italic">No response provided</span> : selectedOption.text}
                    </div>
                    <FiCheckCircle className="text-brand-primary" size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex justify-start">
          <Button variant="ghost" onClick={() => navigate('/profile')} className="px-32 text-brand-text-muted hover:text-brand-text-primary">
            <FiChevronLeft className="mr-8" size={20} /> Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
