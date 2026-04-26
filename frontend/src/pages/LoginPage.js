import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Card from '../components/Card';
import Header from '../components/Header';
import { authAPI } from '../utils/api';
import { useGameStore } from '../utils/store';
import { FiAlertCircle, FiLoader, FiShield, FiUser } from 'react-icons/fi';

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

          {/* Quick Access for Development */}
          <div className="grid grid-cols-2 gap-[16px] mb-[24px]">
            <button 
              onClick={async () => {
                const adminCreds = {
                  teamId: 'ADMIN-EVENT-2026',
                  memberName: 'Coordinator',
                  role: 'admin',
                  password: 'superuser123!'
                };
                setLoading(true);
                try {
                  const res = await authAPI.login(adminCreds);
                  setAuth({
                    token: res.data.token,
                    userId: res.data.userId,
                    teamId: res.data.teamId,
                    teamName: 'Admin Hub',
                    memberName: res.data.memberName,
                    role: res.data.role,
                    currentYear: res.data.currentYear || 0
                  });
                  navigate('/admin');
                } catch (err) {
                  setError('Quick Login Failed: Admin credentials not found.');
                } finally {
                  setLoading(false);
                }
              }}
              className="flex flex-col items-center gap-[8px] p-[16px] bg-[#111827] border border-[#1F2937] hover:border-[#7C3AED]/50 rounded-[12px] group transition-all"
            >
              <div className="w-[40px] h-[40px] bg-[#7C3AED]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiShield className="text-[#7C3AED]" size={20} />
              </div>
              <span className="text-[12px] font-bold text-[#F9FAFB] uppercase tracking-wider">Login as Admin</span>
            </button>

            <button 
              onClick={async () => {
                const userCreds = {
                  teamId: 'TF6CEABF1A025',
                  memberName: 'Bunny',
                  role: 'cfo',
                  password: 'password123'
                };
                setLoading(true);
                try {
                  const res = await authAPI.login(userCreds);
                  setAuth({
                    token: res.data.token,
                    userId: res.data.userId,
                    teamId: res.data.teamId,
                    teamName: res.data.teamName || 'Salar',
                    memberName: res.data.memberName,
                    role: res.data.role,
                    currentYear: res.data.currentYear || 0
                  });
                  navigate('/profile');
                } catch (err) {
                  setError('Quick Login Failed: User credentials not found.');
                } finally {
                  setLoading(false);
                }
              }}
              className="flex flex-col items-center gap-[8px] p-[16px] bg-[#111827] border border-[#1F2937] hover:border-[#10b981]/50 rounded-[12px] group transition-all"
            >
              <div className="w-[40px] h-[40px] bg-[#10b981]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiUser className="text-[#10b981]" size={20} />
              </div>
              <span className="text-[12px] font-bold text-[#F9FAFB] uppercase tracking-wider">Login as User</span>
            </button>
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
              Event Security Active. New accounts must be provisioned by the Coordinator.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
