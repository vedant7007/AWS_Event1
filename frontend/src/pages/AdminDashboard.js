import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard';
import Button from '../components/Button';
import Card from '../components/Card';
import { adminAPI } from '../utils/api';
import { useGameStore } from '../utils/store';
import { 
  FiHome, FiTarget, 
  FiUser, FiPlus, FiTrash2, FiPlay, FiStopCircle, 
  FiUsers, FiAward, FiCheckCircle, FiCircle,
  FiZap, FiActivity, FiAlertCircle, FiCloud, FiLock, FiShield, FiX, FiLogOut, FiEye
} from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || 'dashboard';
  const { logout } = useGameStore();

  const [settings, setSettings] = useState(null);
  const [teams, setTeams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [activeRoleFilter, setActiveRoleFilter] = useState('cto'); 
  const [selectedTeam, setSelectedTeam] = useState(null); // For detailed team analysis

  // Admin creation state
  const [newAdmin, setNewAdmin] = useState({
    teamId: '',
    teamName: '',
    password: ''
  });

  // Question Creation Form State
  const [newQ, setNewQ] = useState({
    question: '',
    options: [
      { optionId: 'A', text: '', value: 'A' },
      { optionId: 'B', text: '', value: 'B' },
      { optionId: 'C', text: '', value: 'C' },
      { optionId: 'D', text: '', value: 'D' }
    ],
    correctAnswer: 'A',
    points: 10
  });

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [sets, tms, qns] = await Promise.all([
          adminAPI.getSettings(),
          adminAPI.getTeams(),
          adminAPI.getQuestions()
        ]);
        setSettings(sets.data);
        setTeams(tms.data.teams || []);
        setQuestions(qns.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Data Load Error:', err);
        setLoading(false);
      }
    };
    loadAll();
    const interval = setInterval(loadAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStartStopRound = async (start) => {
    try {
      const res = await adminAPI.updateSettings({
        currentRound: settings.currentRound,
        isRoundActive: start
      });
      setSettings(res.data);
      setMsg({ type: 'success', text: `Mission Phase ${settings.currentRound} is now ${start ? 'LIVE' : 'STANDBY'}.` });
    } catch (err) {
      setMsg({ type: 'error', text: 'Operational transition failed.' });
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const year = activeTab === 'r1' ? 0 : activeTab === 'r2' ? 1 : activeTab === 'r3' ? 2 : activeTab === 'r4' ? 3 : 4;
    try {
        const formattedOptions = newQ.options.map(opt => ({
            optionId: opt.optionId,
            text: opt.text,
            value: opt.optionId
        }));

        const payload = {
            role: activeRoleFilter,
            question: newQ.question,
            options: formattedOptions,
            correctAnswer: newQ.correctAnswer,
            points: Number(newQ.points) || 10,
            year: year
        };

        // Note: adminAPI mapping should correctly set endpoint for this
        await adminAPI.createQuestion(payload);
        const qns = await adminAPI.getQuestions();
        setQuestions(qns.data);
        
        setNewQ({
            question: '',
            options: [
            { optionId: 'A', text: '', value: 'A' },
            { optionId: 'B', text: '', value: 'B' },
            { optionId: 'C', text: '', value: 'C' },
            { optionId: 'D', text: '', value: 'D' }
            ],
            correctAnswer: 'A',
            points: 10
        });
        setIsAddingQuestion(false);
        setMsg({ type: 'success', text: 'Scenario successfully deployed to database.' });
    } catch (err) {
        console.error('Submission Error:', err.response?.data || err.message);
        setMsg({ type: 'error', text: `ERROR: ${err.response?.data?.error || 'Validation failure'}` });
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Monitor', icon: <FiHome /> },
    { id: 'leaderboard', label: 'Rankings', icon: <FiAward /> },
    { id: 'r1', label: 'Round 1', icon: <FiTarget />, year: 0 },
    { id: 'r2', label: 'Round 2', icon: <FiTarget />, year: 1 },
    { id: 'r3', label: 'Round 3', icon: <FiTarget />, year: 2 },
    { id: 'r4', label: 'Round 4', icon: <FiTarget />, year: 3 },
    { id: 'r5', label: 'Round 5', icon: <FiTarget />, year: 4 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        teamId: newAdmin.teamId,
        memberName: newAdmin.teamName,
        password: newAdmin.password
      };
      await adminAPI.createAdmin(payload);
      setMsg({ type: 'success', text: `Administrator ${newAdmin.teamName} initialized in database.` });
      setNewAdmin({ teamId: '', teamName: '', password: '' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Admin creation failed. Check parameters.' });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center">
            <FiZap size={64} className="text-[#7C3AED] mx-auto mb-[24px] animate-pulse" />
            <p className="text-[12px] font-medium text-[#9CA3AF] tracking-widest uppercase">Synchronizing Command Hub...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F14] flex font-sans selection:bg-[#7C3AED]/30">
      {/* PERSISTENT SIDEBAR */}
      <aside className="w-[280px] bg-[#111827] flex flex-col fixed inset-y-0 z-50 border-r border-[#1F2937] shadow-xl">
        <div className="p-[32px] mb-[16px]">
            <div className="flex items-center gap-[12px]">
                <div className="bg-[#7C3AED]/10 p-[8px] rounded-[8px]">
                  <FiCloud className="text-[#7C3AED]" size={24} />
                </div>
                <h1 className="text-[20px] font-semibold tracking-tight text-[#F9FAFB]">AWS <span className="text-[#7C3AED]">Control</span></h1>
            </div>
        </div>

        <nav className="flex-1 px-[16px] flex flex-col gap-[8px] overflow-y-auto hidden-scrollbar">
            {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => navigate(`/admin/${item.id}`)}
                    className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] transition-all duration-200 text-[14px] font-medium ${
                        activeTab === item.id 
                        ? 'bg-[#7C3AED]/10 text-[#7C3AED] shadow-glow border border-[#7C3AED]/20' 
                        : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/5'
                    }`}
                >
                    <span className="text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>

        <div className="p-[16px] mt-auto border-t border-[#1F2937]">
            <button 
                onClick={() => navigate('/admin/profile')}
                className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] transition-all duration-200 text-[14px] font-medium ${
                    activeTab === 'profile' 
                    ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20' 
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/5'
                }`}
            >
                <FiShield size={18} />
                <span>Profile</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] p-[48px] min-h-screen relative">
        {/* Status Message */}
        {msg.text && (
            <div className={`mb-[32px] p-[16px] rounded-[8px] flex items-center justify-between text-[14px] font-medium border animate-in slide-in-from-top-4 duration-300 ${
                msg.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
                 <div className="flex items-center gap-[12px]">
                    {msg.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                    <span>{msg.text}</span>
                 </div>
                 <button onClick={() => setMsg({type:'', text:''})} className="opacity-50 hover:opacity-100 transition">
                    <FiX size={18} />
                 </button>
            </div>
        )}

        {/* Dynamic Content Based on Tab */}
        <div className="max-w-[1200px] mx-auto relative">
            {activeTab === 'dashboard' && (
                <div className="flex flex-col gap-[32px] animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-[32px] font-semibold text-[#F9FAFB] tracking-tight">Mission Intelligence</h2>
                            <p className="text-[14px] text-[#9CA3AF] mt-[4px]">Real-time operational telemetry across all units.</p>
                        </div>
                        <div className="flex items-center gap-[12px] bg-[#111827] border border-[#1F2937] px-[16px] py-[8px] rounded-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#7C3AED] rounded-full animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.5)]"></div>
                            <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest">Live Uplink</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                        <Card className="flex flex-col justify-between relative overflow-hidden group border border-[#1F2937] hover:border-[#7C3AED]/30 transition-all">
                            <div className="relative z-10">
                                <span className="text-[12px] font-medium text-[#7C3AED] uppercase tracking-widest block mb-[12px]">Number of Teams</span>
                                <span className="text-[48px] font-semibold text-[#F9FAFB] tracking-tight">{teams.length}</span>
                            </div>
                            <FiUsers className="absolute -right-[16px] -bottom-[16px] text-[#7C3AED]/5 group-hover:scale-110 transition-transform duration-700" size={160} />
                        </Card>
                        
                        <Card className="flex flex-col justify-between relative overflow-hidden group border border-[#1F2937] hover:border-[#10b981]/30 transition-all">
                            <div className="relative z-10">
                                <span className="text-[12px] font-medium text-[#10b981] uppercase tracking-widest block mb-[12px]">Number of Total Members</span>
                                <span className="text-[48px] font-semibold text-[#F9FAFB] tracking-tight">
                                    {teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}
                                </span>
                            </div>
                            <FiUser className="absolute -right-[16px] -bottom-[16px] text-[#10b981]/5 group-hover:scale-110 transition-transform duration-700" size={160} />
                        </Card>

                        <Card className="flex flex-col justify-between relative overflow-hidden group border border-[#1F2937] hover:border-[#F59E0B]/30 transition-all">
                            <div className="relative z-10">
                                <span className="text-[12px] font-medium text-[#F59E0B] uppercase tracking-widest block mb-[12px]">Integrity Violations</span>
                                <span className="text-[48px] font-semibold text-[#F9FAFB] tracking-tight">
                                    {teams.reduce((acc, t) => acc + (t.gameState?.violations?.length || 0), 0)}
                                </span>
                            </div>
                            <FiShield className="absolute -right-[16px] -bottom-[16px] text-[#F59E0B]/5 group-hover:scale-110 transition-transform duration-700" size={160} />
                        </Card>
                    </div>

                    <Card className="p-0 overflow-hidden flex flex-col h-[500px]">
                        <div className="overflow-x-auto overflow-y-auto flex-1 hidden-scrollbar">
                            <table className="w-full text-left relative">
                                <thead className="border-b border-[#1F2937] bg-[#0F172A] sticky top-0 z-10">
                                    <tr>
                                        <th className="px-[24px] py-[16px] text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest">#</th>
                                        <th className="px-[24px] py-[16px] text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest">Team Name</th>
                                        <th className="px-[24px] py-[16px] text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest text-center">CTO</th>
                                        <th className="px-[24px] py-[16px] text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest text-center">CFO</th>
                                        <th className="px-[24px] py-[16px] text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest text-center">PM</th>
                                        <th className="px-[24px] py-[16px] text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest">Status</th>
                                        <th className="px-[24px] py-[16px] text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1F2937]">
                                    {teams.map((team, idx) => {
                                        const cto = team.members?.find(m => m.role?.toLowerCase() === 'cto');
                                        const cfo = team.members?.find(m => m.role?.toLowerCase() === 'cfo');
                                        const pm = team.members?.find(m => m.role?.toLowerCase() === 'pm');
                                        const violationsFound = team.gameState?.violations?.length > 0;

                                        return (
                                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-[24px] py-[20px]">
                                                    <span className="text-[14px] font-medium text-[#9CA3AF] group-hover:text-[#7C3AED] transition-colors">{idx + 1}</span>
                                                </td>
                                                <td className="px-[24px] py-[20px]">
                                                    <span className="text-[16px] font-semibold text-[#F9FAFB] group-hover:text-[#7C3AED] transition-colors">{team.teamName}</span>
                                                </td>
                                                <td className="px-[24px] py-[20px] text-center">
                                                    <span className={`text-[14px] font-medium ${cto ? 'text-[#F9FAFB]' : 'text-[#4B5563]'}`}>{cto ? cto.name : '—'}</span>
                                                </td>
                                                <td className="px-[24px] py-[20px] text-center">
                                                    <span className={`text-[14px] font-medium ${cfo ? 'text-[#F9FAFB]' : 'text-[#4B5563]'}`}>{cfo ? cfo.name : '—'}</span>
                                                </td>
                                                <td className="px-[24px] py-[20px] text-center">
                                                    <span className={`text-[14px] font-medium ${pm ? 'text-[#F9FAFB]' : 'text-[#4B5563]'}`}>{pm ? pm.name : '—'}</span>
                                                </td>
                                                <td className="px-[24px] py-[20px]">
                                                    <span className={`px-[10px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-wider ${violationsFound ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                        {violationsFound ? `CHEATED (${team.gameState.violations.length})` : 'PERFECT'}
                                                    </span>
                                                </td>
                                                <td className="px-[24px] py-[20px] text-right">
                                                    <button 
                                                        onClick={() => setSelectedTeam(team)}
                                                        className="p-[8px] bg-[#1F2937] hover:bg-[#7C3AED] hover:text-white rounded-[8px] text-[#9CA3AF] transition-colors border border-[#1F2937]"
                                                    >
                                                        <FiEye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {teams.length === 0 && (
                                <div className="py-[64px] text-center">
                                    <FiActivity className="text-[#1F2937] mx-auto mb-[16px]" size={48} />
                                    <p className="text-[14px] text-[#9CA3AF] uppercase tracking-widest">Awaiting Unit Registration...</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Team Details Modal */}
                    {selectedTeam && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[24px] bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                            <Card className="w-full max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-[#374151]">
                                <div className="p-[24px] border-b border-[#1F2937] px-[32px] flex justify-between items-center bg-[#111827]">
                                    <div>
                                        <h3 className="text-[24px] font-semibold text-[#F9FAFB] tracking-tight">{selectedTeam.teamName}</h3>
                                        <p className="text-[14px] text-[#7C3AED] font-mono mt-[4px]">ID: {selectedTeam.teamId}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedTeam(null)}
                                        className="p-[8px] text-[#9CA3AF] hover:text-white hover:bg-white/10 rounded-[8px] transition-colors"
                                    >
                                        <FiX size={28} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto px-[32px] py-[24px] flex flex-col gap-[32px] bg-[#0B0F14]">
                                    {/* Score Overview */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                                        <div className="bg-[#111827] border border-[#1F2937] rounded-[12px] p-[20px] shadow-inner">
                                            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Status</span>
                                            <div className="text-[16px] font-bold text-emerald-400 mt-[4px] uppercase">{selectedTeam.status}</div>
                                        </div>
                                        <div className="bg-[#111827] border border-[#1F2937] rounded-[12px] p-[20px] shadow-inner">
                                            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Raw Score</span>
                                            <div className="text-[16px] font-bold text-[#F9FAFB] mt-[4px]">{selectedTeam.points}</div>
                                        </div>
                                        <div className="bg-[#111827] border border-[#1F2937] rounded-[12px] p-[20px] shadow-inner relative overflow-hidden">
                                            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Global Violations</span>
                                            <div className="text-[16px] font-bold text-red-500 mt-[4px]">
                                                {selectedTeam.gameState?.violations ? selectedTeam.gameState.violations.length : 0}
                                            </div>
                                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-red-500/20" />
                                        </div>
                                    </div>

                                    {/* Rounds Breakdown */}
                                    <div>
                                        <h4 className="text-[16px] font-bold text-[#F9FAFB] border-b border-[#1F2937] pb-[12px] mb-[16px] uppercase tracking-wider">Round Submissions</h4>
                                        {[1,2,3,4,5].map(y => {
                                            const yearKey = `year${y}`;
                                            const yData = selectedTeam.gameState?.[yearKey];
                                            if(!yData || !yData.answers) return null;
                                            
                                            // Mocking per-person violations strictly for the UI representation required
                                            return (
                                                <div key={y} className="mb-[24px] bg-[#111827] border border-[#1F2937] rounded-[12px] overflow-hidden">
                                                    <div className="px-[20px] py-[12px] bg-[#1F2937]/50 border-b border-[#1F2937] flex items-center justify-between">
                                                        <span className="font-semibold text-[#F9FAFB]">Round {y}</span>
                                                        <span className="text-[12px] font-mono text-[#10b981]">${yData.companyState?.cumulativeProfit || 0} Valuation</span>
                                                    </div>
                                                    <div className="p-[20px] flex flex-col gap-[16px]">
                                                        {['cto', 'cfo', 'pm'].map(role => {
                                                            const roleAnswers = yData.answers[role];
                                                            const roleScore = yData.scores?.[role];
                                                            if(!roleAnswers) return null;
                                                            return (
                                                                <div key={role} className="flex flex-col md:flex-row items-start md:items-center gap-[16px] py-[8px] border-b border-[#1F2937]/50 last:border-0 text-[14px]">
                                                                    <div className="w-16 flex-shrink-0">
                                                                        <span className="text-[12px] font-bold text-[#7C3AED] uppercase border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-[10px] py-[4px] rounded-[6px]">{role}</span>
                                                                    </div>
                                                                    <div className="flex-1 text-[#D1D5DB] font-mono">
                                                                        {Object.entries(roleAnswers).map(([qId, ans]) => (
                                                                            <span key={qId} className="mr-[8px] mb-[4px] inline-block px-[8px] py-[2px] bg-[#0B0F14] rounded-[4px] border border-[#1F2937]/80 shadow-sm text-xs">
                                                                                {ans}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                    <div className="w-[80px] text-right font-bold text-emerald-400">{roleScore}%</div>
                                                                    <div className="w-[100px] text-right font-medium text-[12px] text-red-400">
                                                                        0 Violations
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {(!selectedTeam.gameState?.year1 && !selectedTeam.gameState?.year2 && Object.keys(selectedTeam.gameState || {}).filter(k=>k.startsWith('year')).length === 0) && (
                                            <div className="text-center py-[48px] bg-[#111827] rounded-[12px] border border-dashed border-[#1F2937]">
                                                <p className="text-[14px] font-medium text-[#9CA3AF] tracking-[0.1em] uppercase">No mission logs transmitted yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'leaderboard' && (
                <div className="animate-in fade-in duration-500">
                    <div className="mb-[48px]">
                        <h2 className="text-[32px] font-semibold text-[#F9FAFB] tracking-tight">Global Rankings</h2>
                        <p className="text-[14px] text-[#9CA3AF] mt-[4px]">Live valuation progression map and multi-year analytics.</p>
                    </div>
                    {/* Leaderboard gets directly mounted to show valuation of all rounds up to 5 */}
                    <Leaderboard />
                </div>
            )}

            {['r1', 'r2', 'r3', 'r4', 'r5'].includes(activeTab) && (
                <div className="flex flex-col gap-[32px] animate-in fade-in duration-500">
                    <Card className="p-[32px]">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[24px] mb-[48px]">
                            <div>
                                <h2 className="text-[32px] font-semibold text-[#F9FAFB] tracking-tight">Phase 0{activeTab.slice(1)}</h2>
                                <p className="text-[14px] text-[#7C3AED] font-medium uppercase tracking-widest mt-[8px]">Deployment Window: Year {menuItems.find(m=>m.id===activeTab).year}</p>
                            </div>
                            
                            <Button
                                variant={settings?.currentRound === menuItems.find(m=>m.id===activeTab).year && settings?.isRoundActive ? 'secondary' : 'primary'}
                                onClick={() => handleStartStopRound(!(settings?.currentRound === menuItems.find(m=>m.id===activeTab).year && settings?.isRoundActive))}
                                className="w-full lg:w-auto h-[56px] px-[32px]"
                            >
                                {settings?.currentRound === menuItems.find(m=>m.id===activeTab).year && settings?.isRoundActive ? <FiStopCircle size={22}/> : <FiPlay size={22}/>}
                                <span className="text-[16px] uppercase tracking-wider">
                                    {settings?.currentRound === menuItems.find(m=>m.id===activeTab).year && settings?.isRoundActive ? 'TERMINATE ROUND' : 'INITIALIZE ROUND'}
                                </span>
                            </Button>
                        </div>

                        {/* Filter Area for Roles */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] mb-[32px] pb-[24px] border-b border-[#1F2937]">
                             <div className="flex bg-[#111827] rounded-[8px] p-[4px] border border-[#1F2937]">
                                 {['cto', 'cfo', 'pm'].map(role => (
                                     <button
                                         key={role}
                                         onClick={() => { setActiveRoleFilter(role); setIsAddingQuestion(false); }}
                                         className={`px-[24px] py-[8px] rounded-[6px] text-[14px] font-medium uppercase transition-all ${activeRoleFilter === role ? 'bg-[#7C3AED] text-white shadow-glow-sm' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}
                                     >
                                         {role}
                                     </button>
                                 ))}
                             </div>

                             <Button 
                                variant={isAddingQuestion ? 'ghost' : 'secondary'}
                                onClick={() => setIsAddingQuestion(!isAddingQuestion)}
                                className="h-[40px] px-[16px] text-[12px]"
                             >
                                {isAddingQuestion ? <FiX className="text-red-400" /> : <FiPlus />}
                                <span className="ml-[8px]">{isAddingQuestion ? 'CANCEL' : `PLACE NEW SCENARIO FOR ${activeRoleFilter.toUpperCase()}`}</span>
                             </Button>
                        </div>

                        {/* Add Question Form */}
                        {isAddingQuestion && (
                            <div className="bg-[#1F2937] rounded-[12px] p-[32px] mb-[32px] border border-[#7C3AED]/20 animate-in zoom-in-95 duration-300">
                                <div className="mb-[24px]">
                                    <h4 className="text-[18px] font-semibold text-[#F9FAFB]">Scenario Architect - {activeRoleFilter.toUpperCase()}</h4>
                                    <p className="text-[12px] text-[#9CA3AF] mt-[4px]">Configure simulation parameters for Cluster {activeTab}</p>
                                </div>
                                <form onSubmit={handleAddQuestion} className="flex flex-col gap-[24px]">
                                    <div className="flex flex-col gap-[8px]">
                                        <label className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest px-[4px]">Valuation Impact (Points)</label>
                                        <input 
                                            type="number"
                                            value={newQ.points}
                                            onChange={e=>setNewQ({...newQ, points: e.target.value})}
                                            className="w-full px-[16px] py-[12px] bg-[#111827] border border-[#1F2937] rounded-[8px] text-[14px] text-[#F9FAFB] focus:border-[#7C3AED] focus:outline-none transition-all font-mono"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-[8px]">
                                        <label className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest px-[4px]">Mission Scenario</label>
                                        <textarea 
                                            value={newQ.question}
                                            onChange={e=>setNewQ({...newQ, question: e.target.value})}
                                            className="w-full px-[16px] py-[12px] bg-[#111827] border border-[#1F2937] rounded-[8px] text-[14px] text-[#F9FAFB] min-h-[120px] focus:border-[#7C3AED] focus:outline-none transition-all placeholder:text-[#9CA3AF]/30"
                                            placeholder="Define the strategic hurdle..."
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                        {newQ.options.map((opt, i) => (
                                            <div key={i} className="flex flex-col gap-[8px]">
                                                <div className="flex items-center justify-between px-[4px] mb-[4px]">
                                                    <label className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest">Protocol {opt.optionId}</label>
                                                    <button 
                                                        type="button"
                                                        onClick={()=>setNewQ({...newQ, correctAnswer: opt.optionId})}
                                                        className={`text-[18px] font-bold transition-all hover:scale-110 ${newQ.correctAnswer === opt.optionId ? 'text-emerald-400' : 'text-[#4B5563] hover:text-[#9CA3AF]'}`}
                                                        title={newQ.correctAnswer === opt.optionId ? "Correct Answer Selected" : "Set as Correct Answer"}
                                                    >
                                                        {newQ.correctAnswer === opt.optionId ? <FiCheckCircle /> : <FiCircle />}
                                                    </button>
                                                </div>
                                                <input 
                                                    type="text"
                                                    value={opt.text}
                                                    onChange={e => {
                                                        const opts = [...newQ.options];
                                                        opts[i].text = e.target.value;
                                                        setNewQ({...newQ, options: opts});
                                                    }}
                                                    className={`w-full px-[16px] py-[12px] bg-[#111827] border rounded-[8px] text-[14px] text-[#F9FAFB] focus:outline-none transition-all ${
                                                        newQ.correctAnswer === opt.optionId ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-[#1F2937]'
                                                    }`}
                                                    placeholder={`Option ${opt.optionId} Data...`}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-[56px]"
                                    >
                                        <FiZap size={20} className="mr-[8px]" />
                                        <span className="text-[16px] uppercase tracking-wider">DEPLOY SCENARIO TO ROUND {menuItems.find(m=>m.id===activeTab).year}</span>
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* List of Questions */}
                        <div className="flex flex-col gap-[16px]">
                            {questions.filter(q => q.year === menuItems.find(m => m.id === activeTab).year && q.role === activeRoleFilter).length === 0 ? (
                                <div className="py-[48px] text-center text-[#9CA3AF] text-[14px] border border-dashed border-[#1F2937] rounded-[12px]">
                                    No scenarios configured for {activeRoleFilter.toUpperCase()} in this phase.
                                </div>
                            ) : (
                                questions.filter(q => q.year === menuItems.find(m => m.id === activeTab).year && q.role === activeRoleFilter).map((q, i) => (
                                    <div key={i} className="p-[24px] bg-[#111827] rounded-[12px] border border-[#1F2937] flex flex-col md:flex-row items-start justify-between gap-[24px] group hover:bg-[#1F2937]/50 hover:border-[#7C3AED]/30 transition-all duration-300">
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-[12px] mb-[16px]">
                                                <span className="bg-[#7C3AED]/10 text-[#7C3AED] px-[12px] py-[4px] rounded-[4px] text-[10px] font-bold uppercase tracking-wider border border-[#7C3AED]/20">{q.role}</span>
                                                <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest flex items-center">
                                                    <FiAward className="mr-[8px] text-[#7C3AED]" size={14} /> {q.scoringRubric?.full || 0} Units
                                                </span>
                                            </div>
                                            <p className="text-[18px] font-semibold text-[#F9FAFB] leading-tight mb-[20px] transition-colors">{q.question}</p>
                                            <div className="flex flex-wrap gap-[12px]">
                                                {q.options?.map((o, idx) => (
                                                    <div key={idx} className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-medium flex items-center border transition-all ${
                                                        o.optionId === q.correctAnswer 
                                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                                        : 'bg-white/5 border-[#1F2937] text-[#9CA3AF] opacity-60'
                                                    }`}>
                                                        <span className="mr-[8px] opacity-40 font-mono">{o.optionId}</span>
                                                        {o.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                if(window.confirm('IRREVERSIBLE: Eliminate this scenario from operational clusters?')) {
                                                    await adminAPI.deleteQuestion(q._id);
                                                    const res = await adminAPI.getQuestions();
                                                    setQuestions(res.data);
                                                    setMsg({type:'success', text: 'Scenario successfully eliminated.'});
                                                }
                                            }}
                                            className="p-[12px] rounded-[8px] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-red-500/20"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] animate-in fade-in duration-500">
                     <Card className="p-[48px] text-center w-full flex flex-col items-center relative overflow-hidden h-fit">
                        <div className="w-[120px] h-[120px] bg-[#1F2937] rounded-[24px] border border-[#1F2937] flex items-center justify-center mb-[32px] text-[#F9FAFB] transform transition-transform duration-500">
                            <FiUser size={64} />
                        </div>
                        
                        <h2 className="text-[32px] font-semibold text-[#F9FAFB] tracking-tight">{useGameStore.getState().userId || 'Root Admin'}</h2>
                        <p className="text-[#9CA3AF] font-medium uppercase tracking-[0.2em] text-[14px] mb-[48px] mt-[12px]">Authorization Valid</p>

                        <div className="flex gap-[16px]">
                            <button 
                                onClick={handleLogout}
                                className="px-[32px] py-[12px] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-[8px] text-[14px] font-bold uppercase tracking-widest transition-all border border-red-500/20 shadow-glow-sm"
                            >
                                Logout
                            </button>
                        </div>
                     </Card>

                     <Card className="text-left w-full flex flex-col relative overflow-hidden h-fit">
                        <div className="w-full mb-[24px]">
                            <h3 className="text-[20px] font-semibold text-[#F9FAFB] mb-[4px]">Create Sub-Administrator</h3>
                            <p className="text-[14px] text-[#9CA3AF]">Provision new administrative access tokens.</p>
                        </div>
                        <form onSubmit={handleCreateAdmin} className="w-full flex flex-col gap-[16px]">
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest">Admin Team/User ID</label>
                                <input 
                                    type="text"
                                    value={newAdmin.teamId}
                                    onChange={e=>setNewAdmin({...newAdmin, teamId: e.target.value})}
                                    placeholder="ADMIN-002"
                                    className="w-full px-[16px] py-[12px] bg-[#111827] border border-[#1F2937] rounded-[8px] text-[14px] text-[#F9FAFB] focus:border-[#7C3AED] focus:outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest">Admin Alias Name</label>
                                <input 
                                    type="text"
                                    value={newAdmin.teamName}
                                    onChange={e=>setNewAdmin({...newAdmin, teamName: e.target.value})}
                                    placeholder="Event Coordinator"
                                    className="w-full px-[16px] py-[12px] bg-[#111827] border border-[#1F2937] rounded-[8px] text-[14px] text-[#F9FAFB] focus:border-[#7C3AED] focus:outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-widest">Access Password</label>
                                <input 
                                    type="password"
                                    value={newAdmin.password}
                                    onChange={e=>setNewAdmin({...newAdmin, password: e.target.value})}
                                    placeholder="••••••••"
                                    className="w-full px-[16px] py-[12px] bg-[#111827] border border-[#1F2937] rounded-[8px] text-[14px] text-[#F9FAFB] focus:border-[#7C3AED] focus:outline-none transition-all"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full mt-[8px]">
                                Provision Root Access
                            </Button>
                        </form>
                     </Card>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
