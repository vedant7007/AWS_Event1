import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { leaderboardAPI } from '../utils/api';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const response = await leaderboardAPI.getAll();
        setLeaderboard(response.data.leaderboard);
        setLoading(false);
      } catch (err) {
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    };

    loadLeaderboard();
    // Refresh every 5 seconds
    const interval = setInterval(loadLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center p-8">Loading leaderboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Live Leaderboard" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Rank</th>
                <th className="px-6 py-4 text-left">Team</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Year 1</th>
                <th className="px-6 py-4 text-right">Year 2</th>
                <th className="px-6 py-4 text-right">Year 3</th>
                <th className="px-6 py-4 text-right font-bold">Total Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((team, idx) => (
                <tr key={team.teamId} className={idx < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4">
                    {idx === 0 && '🥇'}
                    {idx === 1 && '🥈'}
                    {idx === 2 && '🥉'}
                    {idx > 2 && <span className="font-bold">{team.rank}</span>}
                  </td>
                  <td className="px-6 py-4 font-semibold">{team.teamName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      team.status === 'completed' ? 'bg-green-100 text-green-800' :
                      team.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {team.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm">
                    ${team.year1Profit?.toLocaleString() || '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm">
                    ${team.year2Profit?.toLocaleString() || '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm">
                    ${team.year3Profit?.toLocaleString() || '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold font-mono text-lg">
                    ${team.cumulativeProfit?.toLocaleString() || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No teams have started yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaderboardPage;
