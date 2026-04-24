import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../utils/store';
import { FiLogOut, FiCopy, FiCheck, FiUser, FiUsers } from 'react-icons/fi';
import Header from '../components/Header';

/**
 * ProfilePage Component
 * Shows user profile with Team ID and member info
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn, teamId, userId, role, user, logout } = useGameStore();
  const [copied, setCopied] = React.useState(false);
  const [teamData, setTeamData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Fetch team data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/auth/team/${teamId}`, {
          headers: {
            'Authorization': `Bearer ${useGameStore.getState().token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTeamData(data);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  // Copy Team ID to clipboard
  const copyTeamId = () => {
    navigator.clipboard.writeText(teamId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <FiUser size={32} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user || 'Team Member'}</h1>
                  <p className="text-blue-100 text-lg capitalize">{role} (Cloud Architect)</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-semibold"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Team ID Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <FiUsers size={24} />
              <span>Team Information</span>
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <label className="text-sm font-semibold text-gray-600">Team ID</label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={teamId}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-mono text-lg font-bold text-gray-800 select-all"
                />
                <button
                  onClick={copyTeamId}
                  className={`px-4 py-3 rounded-lg font-semibold transition flex items-center space-x-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <FiCheck size={20} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy size={20} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">📌 Share this ID with your team members for login</p>
            </div>

            {/* Team Members Section */}
            {teamData && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teamData.members && teamData.members.map((member) => (
                    <div
                      key={member.userId}
                      className={`p-4 rounded-lg border-2 transition ${
                        member.role.toLowerCase() === role.toLowerCase()
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{member.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                        </div>
                      </div>
                      {member.role.toLowerCase() === role.toLowerCase() && (
                        <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded w-fit">
                          👤 You
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/training')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                📚 Go to Training
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                🏆 View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
