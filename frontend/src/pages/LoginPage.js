import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PasswordInput from '../components/PasswordInput';
import { authAPI } from '../utils/api';
import { useGameStore } from '../utils/store';
import { FiAlertCircle, FiUser, FiLock } from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useGameStore((state) => state.setAuth);

  const [credentials, setCredentials] = useState({
    teamId: '',
    memberName: '',
    role: 'cto',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate fields
    if (!credentials.teamId.trim()) {
      setError('Team ID is required');
      setLoading(false);
      return;
    }

    if (!credentials.memberName.trim()) {
      setError('Your name is required');
      setLoading(false);
      return;
    }

    if (!credentials.password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(credentials);
      
      setAuth({
        token: response.data.token,
        userId: response.data.userId,
        teamId: response.data.teamId,
        teamName: response.data.teamName || 'Your Team',
        memberName: response.data.memberName,
        role: response.data.role,
        currentYear: response.data.currentYear || 1
      });

      // Navigate to profile first, then training
      navigate('/profile');
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      if (errorMsg?.includes('Team not found')) {
        setError('❌ Team not found. Check your Team ID.');
      } else if (errorMsg?.includes('does not match')) {
        setError('❌ Member name or role does not match registration.');
      } else if (errorMsg?.includes('Invalid password')) {
        setError('❌ Incorrect password.');
      } else {
        setError(errorMsg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center">
      <Header showLeaderboard={false} />

      <main className="max-w-md mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Login to continue playing Cloud-Tycoon</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2">
              <FiAlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Team ID */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center space-x-1">
                <span>🆔</span>
                <span>Team ID</span>
              </label>
              <input
                type="text"
                name="teamId"
                placeholder="e.g., TT-2026-0042"
                value={credentials.teamId}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition uppercase"
                required
                autoComplete="off"
              />
              <p className="text-xs text-gray-600 mt-1">💡 Your team lead shared this with you</p>
            </div>

            {/* Role Selector */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center space-x-1">
                <span>👨‍💼</span>
                <span>Your Role</span>
              </label>
              <select
                name="role"
                value={credentials.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
              >
                <option value="cto">☁️ Cloud Architect (CTO)</option>
                <option value="cfo">💰 Financial Analyst (CFO)</option>
                <option value="pm">📈 Growth Lead (PM)</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">💡 Select your role from registration</p>
            </div>

            {/* Member Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center space-x-1">
                <FiUser size={16} />
                <span>Your Name</span>
              </label>
              <input
                type="text"
                name="memberName"
                placeholder="Enter your name"
                value={credentials.memberName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                required
                autoComplete="off"
              />
              <p className="text-xs text-gray-600 mt-1">💡 Name matching is case-insensitive</p>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center space-x-1">
                <FiLock size={16} />
                <span>Password</span>
              </label>
              <PasswordInput
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                showStrength={false}
                required={true}
                name="password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have a team?{' '}
              <a href="/register" className="text-blue-600 font-bold hover:underline">
                Register here
              </a>
            </p>
            <p className="text-center text-xs text-gray-500 mt-3">
              🔒 Your credentials are secure and encrypted
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
