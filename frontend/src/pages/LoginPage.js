import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Card from '../components/Card';
import Header from '../components/Header';
import { authAPI } from '../utils/api';
import { useGameStore } from '../utils/store';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';

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

    // Note: Admin login is now routed identically to typical user authentication using the backend. 
    // It issues real, verified JWT tokens. No more static auth bypasses.

    if (!credentials.teamId.trim() || !credentials.memberName.trim() || !credentials.password.trim()) {
      setError('Required: Team ID, Member Name, and Password.');
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
        currentYear: response.data.currentYear || 0
      });

      if (response.data.teamId === 'ADMIN-EVENT-2026') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      if (errorMsg?.includes('Team not found')) {
        setError('Team ID not recognized in current event.');
      } else if (errorMsg?.includes('does not match')) {
        setError('Role mismatch for this agent.');
      } else {
        setError(errorMsg || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#0F172A] border border-[#1F2937] rounded-[10px] px-[14px] py-[12px] text-[14px] text-[#F9FAFB] focus:border-[#7C3AED] focus:shadow-glow focus:outline-none transition-all placeholder:text-[#9CA3AF]";

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col font-sans selection:bg-[#7C3AED]/30 text-[#D1D5DB]">
      <Header showLeaderboard={false} showBackButton={true} />
      
      <main className="flex-1 flex justify-center items-center p-[24px]">
        <div className="w-full max-w-[400px]">
          <div className="mb-[32px] text-center">
            <h1 className="text-[24px] font-semibold text-[#F9FAFB] tracking-tight mb-[8px]">Welcome back</h1>
            <p className="text-[14px] text-[#9CA3AF]">Enter your credentials to access the console</p>
          </div>

          <Card className="p-[32px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-[16px] rounded-[10px] flex items-start gap-[12px] text-[14px]">
                        <FiAlertCircle size={18} className="mt-[2px] flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex flex-col gap-[8px]">
                    <label className="text-[14px] font-medium text-[#D1D5DB]">Deployment ID</label>
                    <input
                        type="text"
                        name="teamId"
                        placeholder="e.g. TT-2026-XXXX"
                        value={credentials.teamId}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                    />
                </div>

                <div className="flex gap-[16px]">
                    <div className="flex flex-col gap-[8px] w-1/3">
                        <label className="text-[14px] font-medium text-[#D1D5DB]">Role</label>
                        <select
                            name="role"
                            value={credentials.role}
                            onChange={handleChange}
                            className={`${inputClasses} appearance-none cursor-pointer`}
                        >
                            <option value="cto">CTO</option>
                            <option value="cfo">CFO</option>
                            <option value="pm">PM</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-[8px] w-2/3">
                        <label className="text-[14px] font-medium text-[#D1D5DB]">Operator Name</label>
                        <input
                            type="text"
                            name="memberName"
                            placeholder="Your Name"
                            value={credentials.memberName}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                    <label className="text-[14px] font-medium text-[#D1D5DB]">Access Key</label>
                    <PasswordInput
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        showStrength={false}
                        required={true}
                        name="password"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-[8px]"
                >
                    {loading ? <FiLoader className="animate-spin" size={18} /> : 'Log In'}
                </Button>
            </form>
          </Card>

          <div className="mt-[24px] text-center">
            <p className="text-[14px] text-[#9CA3AF]">
              Don't have an account?{' '}
              <button 
                  onClick={() => navigate('/register')}
                  className="text-[#F9FAFB] hover:text-[#7C3AED] transition-colors"
              >
                  Sign up
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
