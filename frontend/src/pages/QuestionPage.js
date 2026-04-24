import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LockdownMode from '../components/LockdownMode';
import { useGameStore } from '../utils/store';
import { questionsAPI, submissionsAPI } from '../utils/api';

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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await questionsAPI.getByYear(year, role);
        setQuestions(response.data.questions);
        setCurrentQuestions(response.data.questions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load questions');
        setLoading(false);
      }
    };

    loadQuestions();
  }, [year, role]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTabSwitch = (count) => {
    setTabSwitchWarnings(count);
    if (count >= 3) {
      handleSubmit(); // Auto-submit on 4th tab switch
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswer(questionId, answer);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const allAnswered = questions.every(q => answers[q.questionId] !== undefined);
      if (!allAnswered) {
        setError('Please answer all questions before submitting');
        setSubmitting(false);
        return;
      }

      const response = await submissionsAPI.submit(year, answers, 480 - timeLeft);
      
      setTimeout(() => {
        navigate(`/year-end-report/${year}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading questions...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  const currentQuestion = questions[currentIndex];
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LockdownMode onTabSwitch={handleTabSwitch} onWarning={setError} />
      <Header title={`Year ${year} - ${role.toUpperCase()} Questions`} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Timer & Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-lg font-bold">Question {currentIndex + 1} of {questions.length}</span>
            </div>
            <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-green-600'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          {tabSwitchWarnings > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              ⚠️ Tab switch detected ({tabSwitchWarnings}/3 warnings). Auto-submit on 4th attempt.
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">{currentQuestion.scenario}</p>
              <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.question}</h2>
            </div>

            {/* Question Type: MCQ */}
            {currentQuestion.type === 'mcq' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <label key={option.optionId} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                    <input
                      type="radio"
                      name={currentQuestion.questionId}
                      value={option.value}
                      checked={answers[currentQuestion.questionId] === option.value}
                      onChange={(e) => handleAnswerChange(currentQuestion.questionId, option.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3">{option.text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Question Type: True/False */}
            {currentQuestion.type === 'truefalse' && (
              <div className="space-y-3">
                {[true, false].map((value) => (
                  <label key={value} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                    <input
                      type="radio"
                      name={currentQuestion.questionId}
                      value={value}
                      checked={answers[currentQuestion.questionId] === value}
                      onChange={(e) => handleAnswerChange(currentQuestion.questionId, value === 'true')}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-semibold">{value ? 'True' : 'False'}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Question Type: Numerical */}
            {currentQuestion.type === 'numerical' && (
              <input
                type="number"
                placeholder="Enter your answer"
                value={answers[currentQuestion.questionId] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.questionId, parseFloat(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            )}

            {/* Question Type: Rating */}
            {currentQuestion.type === 'rating' && (
              <input
                type="range"
                min="1"
                max="10"
                value={answers[currentQuestion.questionId] || 5}
                onChange={(e) => handleAnswerChange(currentQuestion.questionId, parseInt(e.target.value))}
                className="w-full"
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            ← Previous
          </button>

          <button
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Next →
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : '✓ Submit Round'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuestionPage;
