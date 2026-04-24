import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useGameStore } from '../utils/store';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { teamName, gameState } = useGameStore();

  const finalProfit = gameState?.year3?.companyState?.cumulativeProfit || 0;

  const getAward = () => {
    if (finalProfit > 100000) return { emoji: '🏆', title: 'Champion', color: 'gold' };
    if (finalProfit > 50000) return { emoji: '🥈', title: 'Runner-up', color: 'silver' };
    if (finalProfit > 0) return { emoji: '🥉', title: 'Profitable', color: '#CD7F32' };
    return { emoji: '📈', title: 'Learning Experience', color: 'gray' };
  };

  const award = getAward();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="Final Results" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">{award.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Congratulations, {teamName}!
          </h1>
          <p className="text-xl text-gray-700">{award.title}</p>
        </div>

        {/* Final Score Card */}
        <div className="bg-white rounded-lg shadow-lg p-12 text-center mb-12">
          <p className="text-gray-600 mb-2">Final Cumulative Profit</p>
          <div className={`text-6xl font-bold mb-4 ${finalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${finalProfit.toLocaleString()}
          </div>
          <p className="text-gray-600">After 3 years of strategic decisions</p>
        </div>

        {/* Year Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Year 1 - Cost Crisis</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Profit:</strong> ${gameState?.year1?.companyState?.cumulativeProfit?.toLocaleString()}</p>
              <p><strong>Score:</strong> {gameState?.year1?.scores?.cto}% CTO</p>
              <p><strong>Focus:</strong> Cost optimization</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Year 2 - Growth Phase</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Profit:</strong> ${gameState?.year2?.companyState?.cumulativeProfit?.toLocaleString()}</p>
              <p><strong>Score:</strong> {gameState?.year2?.scores?.cfo}% CFO</p>
              <p><strong>Focus:</strong> Scaling decisions</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Year 3 - Viral Moment</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Profit:</strong> ${gameState?.year3?.companyState?.cumulativeProfit?.toLocaleString()}</p>
              <p><strong>Score:</strong> {gameState?.year3?.scores?.pm}% PM</p>
              <p><strong>Focus:</strong> Handling growth surge</p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Insights from Your Journey</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold mb-2">💡 Cost Optimization</h3>
              <p className="text-gray-700">In Year 1, you saved ${Math.abs(gameState?.year1?.companyState?.monthlyBill - 18000).toLocaleString()} per month through smart decisions.</p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-bold mb-2">📈 Growth Impact</h3>
              <p className="text-gray-700">Your Year 1-2 decisions shaped Year 3 infrastructure and costs.</p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold mb-2">🎯 Team Strategy</h3>
              <p className="text-gray-700">CTO, CFO, and PM perspectives all matter. Technical decisions have financial impact; financial decisions affect product quality.</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
          <p className="mb-4">
            This game was designed to teach you real AWS decision-making. The patterns you learned apply to real-world cloud architecture, cost optimization, and business decisions.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Explore AWS documentation for services you used</li>
            <li>Consider real-world cost implications in future projects</li>
            <li>Think about how technical decisions affect business outcomes</li>
            <li>Join the AWS Club for hands-on learning sessions</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/leaderboard')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            📊 View Leaderboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition"
          >
            🏠 Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
