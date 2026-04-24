import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showLeaderboard={false} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Turn a Failing Startup into a Profit Machine
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Make strategic decisions about AWS infrastructure, costs, and growth. Compete with other teams to achieve the highest profit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2">3-Year Journey</h3>
            <p className="text-gray-600">Navigate Year 1 cost crisis, Year 2 growth, and Year 3 scaling challenges.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Team Strategy</h3>
            <p className="text-gray-600">CTO, CFO, and PM roles work together. Each makes decisions that impact the whole company.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Live Competition</h3>
            <p className="text-gray-600">View live leaderboard as teams progress. Top 3 teams win recognition.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <ol className="space-y-3 text-lg text-gray-700">
            <li><strong>1.</strong> Register your team (3 members with different roles)</li>
            <li><strong>2.</strong> Complete training and learn AWS basics</li>
            <li><strong>3.</strong> Make decisions in Year 1, 2, and 3 scenarios</li>
            <li><strong>4.</strong> Your choices cascade — impact future decisions</li>
            <li><strong>5.</strong> Compete on the live leaderboard</li>
            <li><strong>6.</strong> Win prizes as the most profitable team!</li>
          </ol>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg"
          >
            Register Your Team
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-700 transition shadow-lg"
          >
            Login to Play
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
