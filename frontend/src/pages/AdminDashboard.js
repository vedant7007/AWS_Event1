import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const [status, setStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('status');

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [statusRes, alertsRes, teamsRes] = await Promise.all([
          adminAPI.getStatus(),
          adminAPI.getAlerts(),
          adminAPI.getTeams()
        ]);

        setStatus(statusRes.data);
        setAlerts(alertsRes.data.alerts || []);
        setTeams(teamsRes.data.teams || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        setLoading(false);
      }
    };

    loadAdminData();
    const interval = setInterval(loadAdminData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center p-8">Loading admin dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Dashboard" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 font-semibold ${activeTab === 'status' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            📊 Event Status
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 font-semibold ${activeTab === 'alerts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            ⚠️ Fraud Alerts
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 font-semibold ${activeTab === 'teams' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            👥 All Teams
          </button>
        </div>

        {/* Status Tab */}
        {activeTab === 'status' && status && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{status.teams.total}</div>
              <p className="text-gray-600 mt-2">Total Teams</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{status.teams.inProgress}</div>
              <p className="text-gray-600 mt-2">In Progress</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{status.teams.completed}</div>
              <p className="text-gray-600 mt-2">Completed</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">{status.currentYear.year1}</div>
              <p className="text-gray-600 mt-2">On Year 1</p>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No fraud alerts detected. All clear!</div>
            ) : (
              <table className="w-full">
                <thead className="bg-red-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">Team</th>
                    <th className="px-6 py-4 text-left">Tab Switches</th>
                    <th className="px-6 py-4 text-left">Multi-Device</th>
                    <th className="px-6 py-4 text-left">Fast Submissions</th>
                    <th className="px-6 py-4 text-left">Last Flagged</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {alerts.map((alert) => (
                    <tr key={alert.teamId} className="hover:bg-red-50">
                      <td className="px-6 py-4 font-semibold">{alert.teamName}</td>
                      <td className="px-6 py-4">{alert.tabSwitches}</td>
                      <td className="px-6 py-4">{alert.multiDeviceLogin ? '⚠️ Yes' : 'No'}</td>
                      <td className="px-6 py-4">{alert.fastSubmissions}</td>
                      <td className="px-6 py-4 text-sm">{new Date(alert.lastFlaggedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left">Team Name</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Year</th>
                  <th className="px-6 py-4 text-center">Y1 Done</th>
                  <th className="px-6 py-4 text-center">Y2 Done</th>
                  <th className="px-6 py-4 text-center">Y3 Done</th>
                  <th className="px-6 py-4 text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teams.map((team) => (
                  <tr key={team.teamId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{team.teamName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        team.status === 'completed' ? 'bg-green-100 text-green-800' :
                        team.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{team.currentYear}</td>
                    <td className="px-6 py-4 text-center">{team.year1Completed ? '✓' : '—'}</td>
                    <td className="px-6 py-4 text-center">{team.year2Completed ? '✓' : '—'}</td>
                    <td className="px-6 py-4 text-center">{team.year3Completed ? '✓' : '—'}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold">
                      ${team.cumulativeProfit?.toLocaleString() || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
