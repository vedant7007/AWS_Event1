import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useGameStore } from '../utils/store';

const YearEndReportPage = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const { gameState, currentYear } = useGameStore();
  const yearKey = `year${year}`;
  const yearData = gameState[yearKey];

  if (!yearData) {
    return <div className="text-center p-8">No data for this year</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`Year ${year} End Report`} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Metric Cards */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              ${yearData.companyState?.monthlyRevenue?.toLocaleString()}
            </div>
            <p className="text-gray-600 mt-2">Monthly Revenue</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              ${yearData.companyState?.monthlyBill?.toLocaleString()}
            </div>
            <p className="text-gray-600 mt-2">Monthly AWS Bill</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className={`text-3xl font-bold ${yearData.companyState?.cumulativeProfit >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
              ${yearData.companyState?.cumulativeProfit?.toLocaleString()}
            </div>
            <p className="text-gray-600 mt-2">Cumulative Profit</p>
          </div>
        </div>

        {/* Decisions Made */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Decisions Made</h2>
          <div className="text-gray-700">
            <p className="mb-4">Your team made strategic decisions that impacted the company:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Optimized EC2 instances based on CPU usage</li>
              <li>Removed unused databases with proper backup procedures</li>
              <li>Balanced cost-cutting with user experience</li>
            </ul>
          </div>
        </div>

        {/* Market Event */}
        {yearData.marketEvent && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold mb-2">📢 Market Event: {yearData.marketEvent.name}</h3>
            <p className="text-gray-700 mb-4">{yearData.marketEvent.description}</p>
            <div className="text-lg">
              Impact: <span className={yearData.marketEvent.penalty < 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                {yearData.marketEvent.penalty > 0 ? '+' : ''}{yearData.marketEvent.penalty}
              </span>
            </div>
          </div>
        )}

        {/* Status & Next Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Status</h3>
          <div className="text-lg text-gray-700">
            <p className="mb-2">
              <strong>Monthly Loss/Profit:</strong> ${(yearData.companyState?.monthlyRevenue - yearData.companyState?.monthlyBill)?.toLocaleString()}
            </p>
            <p>
              <strong>Runway:</strong> {yearData.companyState?.runwayMonths} months
              {yearData.companyState?.runwayMonths > 12 && ' ✅ (Stable!)'}
              {yearData.companyState?.runwayMonths <= 12 && ' ⚠️ (Tight!)'}
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Round Scores</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded p-4">
              <div className="text-2xl font-bold text-blue-600">{yearData.scores?.cto || 0}%</div>
              <p className="text-gray-600">CTO</p>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-2xl font-bold text-green-600">{yearData.scores?.cfo || 0}%</div>
              <p className="text-gray-600">CFO</p>
            </div>
            <div className="bg-white rounded p-4">
              <div className="text-2xl font-bold text-purple-600">{yearData.scores?.pm || 0}%</div>
              <p className="text-gray-600">PM</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {year < 3 ? (
            <button
              onClick={() => navigate(`/questions/${parseInt(year) + 1}`)}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Continue to Year {parseInt(year) + 1} →
            </button>
          ) : (
            <button
              onClick={() => navigate('/results')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              View Final Results →
            </button>
          )}
          <button
            onClick={() => navigate('/leaderboard')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition"
          >
            📊 Leaderboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default YearEndReportPage;
