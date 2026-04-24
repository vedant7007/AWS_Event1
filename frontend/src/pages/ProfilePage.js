import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../utils/store';
import { adminAPI, authAPI } from '../utils/api';
import { 
  FiLogOut, FiCopy, FiCheck, FiUser, FiUsers, FiShield, 
  FiBarChart2, FiBook, FiHash, FiZap, FiPlay, FiLock, FiChevronRight,
  FiAward
 } from 'react-icons/fi';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn, teamId, role, memberName, logout } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (teamId === 'ADMIN-EVENT-2026') {
      navigate('/admin');
      return;
    }

    const fetchData = async () => {
      try {
        const [tResponse, sResponse] = await Promise.all([
          authAPI.getTeam(teamId),
          adminAPI.getSettings()
        ]);
        setTeamData(tResponse.data);
        setSettings(sResponse.data);
      } catch (error) {
        console.error('Data acquisition error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [isLoggedIn, navigate, teamId]);

  const copyTeamId = () => {
    navigator.clipboard.writeText(teamId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  const currentYear = teamData?.currentYear ?? 0;
  const isRoundActive = settings?.isRoundActive && settings?.currentRound === currentYear;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <Header showLeaderboard={true} title="Operational Dashboard" />
      
      <main className="max-w-[1200px] mx-auto px-16 py-48 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
          
          {/* Column 1: Identity */}
          <div className="lg:col-span-1 space-y-32">
            <Card className="flex flex-col items-center p-32">
               <div className="w-80 h-80 bg-brand-primary rounded-button flex items-center justify-center mb-24 shadow-glow">
                 <FiUser size={40} className="text-white" />
               </div>
               <h1 className="text-24 font-semibold text-brand-text-primary mb-8 tracking-tight">{memberName || 'Agent'}</h1>
               <div className="px-16 py-4 bg-brand-elevated text-brand-text-secondary rounded-button font-medium tracking-wider text-12 mb-32 border border-brand-border">
                 {role || 'Specialist'}
               </div>
               
               <div className="w-full space-y-16">
                  <div className="bg-brand-elevated p-16 rounded-button border border-brand-border">
                      <p className="text-12 font-medium text-brand-text-muted uppercase tracking-widest mb-8">Sync ID</p>
                      <div className="flex items-center justify-between">
                          <span className="font-mono font-semibold text-brand-text-primary">{teamId}</span>
                          <button onClick={copyTeamId} className="text-brand-primary hover:scale-110 transition">
                              {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                          </button>
                      </div>
                  </div>
                  <Button variant="ghost" onClick={handleLogout} className="w-full text-brand-text-muted hover:text-danger">
                    Interrupt Linkage
                  </Button>
               </div>
            </Card>

            <Card elevated className="p-32">
                <div className="flex items-center space-x-12 mb-24">
                    <FiAward className="text-brand-primary" size={20} />
                    <h3 className="text-14 font-medium text-brand-text-muted uppercase tracking-widest">Efficiency Points</h3>
                </div>
                <div className="flex items-baseline space-x-12">
                    <span className="text-48 font-semibold tracking-tight text-brand-text-primary">{teamData?.points || 0}</span>
                    <span className="text-12 font-medium text-brand-text-muted uppercase">Total Score</span>
                </div>
            </Card>
          </div>

          {/* Column 2 & 3: Mission & Roster */}
          <div className="lg:col-span-2 space-y-32">
            {/* Mission Critical Round Starter */}
            <Card className="p-48 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-200 h-200 bg-brand-primary/5 rounded-full -mr-100 -mt-100 transition-transform group-hover:scale-110 duration-700"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-32">
                        <div>
                            <span className="text-12 font-medium text-brand-primary uppercase tracking-widest block mb-8 text-opacity-80">Live Mission Protocol</span>
                            <h2 className="text-32 font-semibold text-brand-text-primary tracking-tight">Year {currentYear} Round</h2>
                        </div>
                        <div className={`px-16 py-8 rounded-button flex items-center space-x-8 font-medium text-12 uppercase tracking-wider border ${
                            isRoundActive ? 'bg-success/10 text-success border-success/20' : 'bg-brand-elevated text-brand-text-muted border-brand-border'
                        }`}>
                            <div className={`w-8 h-8 rounded-full ${isRoundActive ? 'bg-success animate-pulse' : 'bg-brand-text-muted'}`}></div>
                            <span>{isRoundActive ? 'Synchronized' : 'Encrypted'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-32">
                        <div className="flex-1">
                            <p className="text-brand-text-secondary text-16 leading-relaxed mb-32">
                                {isRoundActive 
                                    ? `Strategic window is open for Year ${currentYear}. Collaborate with your leadership to optimize resources.`
                                    : "Mission assets are locked by Command Hub. Awaiting sequential round authorization."
                                }
                            </p>
                            <Button
                                onClick={() => isRoundActive && navigate(`/question/${currentYear}`)}
                                disabled={!isRoundActive}
                                className="w-full md:w-auto"
                            >
                                {isRoundActive ? <FiPlay /> : <FiLock />}
                                <span>{isRoundActive ? 'Commence Round' : 'Round Locked'}</span>
                            </Button>
                        </div>
                        <div className="bg-brand-elevated p-24 rounded-button border border-brand-border text-center min-w-[160px] flex flex-col justify-center">
                            <span className="text-32 font-mono font-semibold text-brand-text-primary block">0{currentYear + 1}</span>
                            <span className="text-12 font-medium text-brand-text-muted uppercase tracking-widest mt-4">Active Phase</span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
                {/* Team Roster */}
                <Card className="p-32">
                    <div className="flex items-center space-x-12 mb-32">
                        <FiUsers className="text-brand-primary" size={20} />
                        <h3 className="text-18 font-semibold text-brand-text-primary tracking-tight">Team Roster</h3>
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center py-32 opacity-20 animate-pulse">
                            <FiZap size={32} className="text-brand-primary" />
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {teamData?.members?.map((member, idx) => (
                                <div key={idx} className={`p-16 rounded-button flex items-center justify-between border transition-all ${
                                    member.role.toLowerCase() === role?.toLowerCase() 
                                    ? 'bg-brand-elevated border-brand-primary/50' 
                                    : 'bg-brand-surface border-brand-border'
                                }`}>
                                    <div className="flex items-center space-x-12">
                                        <div className={`w-40 h-40 rounded-button flex items-center justify-center font-bold text-14 ${
                                            member.role.toLowerCase() === role?.toLowerCase() ? 'bg-brand-primary text-white' : 'bg-brand-elevated text-brand-text-muted'
                                        }`}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-14 text-brand-text-primary">{member.name}</p>
                                            <p className="text-12 text-brand-text-muted uppercase tracking-widest">{member.role}</p>
                                        </div>
                                    </div>
                                    {member.role.toLowerCase() === role?.toLowerCase() && (
                                        <span className="text-10 font-bold text-brand-primary uppercase tracking-widest border border-brand-primary/30 px-8 py-2 rounded-button bg-brand-primary/5">YOU</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Secondary Actions */}
                <div className="space-y-16">
                    <button onClick={()=>navigate('/training')} className="w-full bg-brand-surface p-24 rounded-card border border-brand-border hover:border-brand-primary/30 transition-all text-left group flex items-center space-x-16">
                        <div className="bg-brand-elevated p-16 rounded-button text-brand-text-muted group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <FiBook size={24} />
                        </div>
                        <div>
                            <h4 className="text-18 font-semibold text-brand-text-primary tracking-tight">Training</h4>
                            <p className="text-brand-text-muted text-12 mt-4 font-medium uppercase tracking-wider">Operational Protocols</p>
                        </div>
                    </button>

                    <button onClick={()=>navigate('/leaderboard')} className="w-full bg-brand-surface p-24 rounded-card border border-brand-border hover:border-brand-primary/30 transition-all text-left group flex items-center space-x-16">
                        <div className="bg-brand-elevated p-16 rounded-button text-brand-text-muted group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <FiBarChart2 size={24} />
                        </div>
                        <div>
                            <h4 className="text-18 font-semibold text-brand-text-primary tracking-tight">Leaderboard</h4>
                            <p className="text-brand-text-muted text-12 mt-4 font-medium uppercase tracking-wider">Unit Rankings</p>
                        </div>
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

