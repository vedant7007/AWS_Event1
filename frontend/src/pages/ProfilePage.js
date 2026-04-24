import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../utils/store';
import { adminAPI, authAPI } from '../utils/api';
import { FiUser, FiCheckCircle, FiAlertTriangle, FiBook, FiPlay, FiLock, FiX, FiDownload, FiActivity } from 'react-icons/fi';
import Header from '../components/Header';
import Card from '../components/Card';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn, teamId, role } = useGameStore();
  const [teamData, setTeamData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

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
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [isLoggedIn, navigate, teamId]);

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans text-brand-primary">
        <div className="flex flex-col items-center">
            <div className="w-48 h-48 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-16"></div>
            <p className="animate-pulse font-bold tracking-widest uppercase text-12">Synchronizing with AWS Command...</p>
        </div>
      </div>
    );
  }

  const adminActiveRound = settings?.currentRound || 0;
  const isRoundActive = settings?.isRoundActive;
  const hasCompletedCurrentRound = Object.keys(teamData?.gameState?.[`year${adminActiveRound}`]?.answers?.[role?.toLowerCase()] || {}).length > 0;
  const isCurrentlyPlayable = isRoundActive && !hasCompletedCurrentRound;
  const isEliminated = teamData?.gameState?.[`year${adminActiveRound}`]?.answers?.[role?.toLowerCase()]?.disqualified;

  const roleDescriptions = {
    cto: { name: 'Chief Technology Officer', desc: (<ul className="list-disc pl-20 space-y-2"><li>System design decisions</li><li>Tech stack ownership</li><li>Performance & scalability</li></ul>) },
    cfo: { name: 'Chief Financial Officer', desc: (<ul className="list-disc pl-20 space-y-2"><li>Budget constraints</li><li>Resource allocation</li><li>Financial trade-offs</li></ul>) },
    pm: { name: 'Product Manager', desc: (<ul className="list-disc pl-20 space-y-2"><li>Define product roadmap</li><li>Manage feature prioritization</li><li>Align team goals</li></ul>) }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text-primary">
      <Header showLeaderboard={false} title={teamData?.teamName ? `${teamData.teamName} Dashboard` : 'Team Dashboard'} />
      
      <main className="max-w-[1200px] mx-auto px-16 py-24 flex-1 w-full space-y-20">
        
        {/* Global Stats Bar — Team Name, ID, Round Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-brand-elevated p-8 rounded-xl border border-brand-border">
          <div className="px-16 py-8 bg-brand-surface rounded-lg border border-brand-border/50">
            <p className="text-10 text-brand-text-muted uppercase tracking-widest mb-2 font-bold">Team Identifier</p>
            <p className="text-14 font-mono font-bold text-brand-primary">{teamData?.teamId}</p>
          </div>
          <div className="px-16 py-8 bg-brand-surface rounded-lg border border-brand-border/50">
            <p className="text-10 text-brand-text-muted uppercase tracking-widest mb-2 font-bold">Operational Cluster</p>
            <p className="text-14 font-bold text-brand-text-primary truncate">{teamData?.teamName}</p>
          </div>
          <div className="md:col-span-2 px-16 py-8 bg-brand-surface rounded-lg border border-brand-border/50 flex items-center justify-between">
            <div>
                <p className="text-10 text-brand-text-muted uppercase tracking-widest mb-2 font-bold">Mission Status</p>
                {isEliminated ? (
                  <div className="text-red-400 font-bold text-14 flex items-center"><FiAlertTriangle className="mr-6" /> ELIMINATED — Round {adminActiveRound + 1}</div>
                ) : hasCompletedCurrentRound ? (
                  <div className="text-emerald-400 font-bold text-14 flex items-center"><FiCheckCircle className="mr-6" /> Round {adminActiveRound + 1} Committed</div>
                ) : isRoundActive ? (
                  <div className="text-brand-primary font-bold text-14 flex items-center animate-pulse"><FiActivity className="mr-6" /> Round {adminActiveRound + 1} LIVE</div>
                ) : (
                  <div className="text-brand-text-muted font-semibold text-14 flex items-center"><FiLock className="mr-6" /> Standby — Round {adminActiveRound + 1}</div>
                )}
            </div>
            <span className="text-10 font-bold text-emerald-400 uppercase bg-emerald-500/10 px-8 py-2 rounded border border-emerald-500/20">{teamData?.eventStatus}</span>
          </div>
        </div>

        {/* Role Cards — THE ONLY PLACE for role info now */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {['cto', 'cfo', 'pm'].map(r => {
            const member = teamData?.members?.find(m => m.role?.toLowerCase() === r);
            const isMe = r === role?.toLowerCase();
            return (
              <Card key={r} className={`p-20 border-2 transition-all ${isMe ? 'border-brand-primary shadow-glow bg-brand-primary/5' : 'border-brand-border bg-brand-surface/40 opacity-80 hover:opacity-100'}`}>
                <div className="flex justify-between items-start mb-16">
                  <div className={`p-10 rounded-xl ${isMe ? 'bg-brand-primary text-white' : 'bg-brand-elevated text-brand-text-muted border border-brand-border'}`}>
                    <FiUser size={24} />
                  </div>
                  {isMe && <span className="bg-brand-primary/20 text-brand-primary px-8 py-2 rounded text-10 font-bold uppercase tracking-widest border border-brand-primary/30">Active Operator</span>}
                </div>
                <h3 className="text-14 font-bold text-brand-text-primary uppercase tracking-wide">{roleDescriptions[r].name}</h3>
                <div className="mt-8 pt-8 border-t border-brand-border/30">
                  <p className="text-16 font-bold text-brand-text-secondary">{member?.name || 'Vacant'}</p>
                  <p className="text-11 font-mono text-brand-text-muted mt-4 opacity-60">AuthID: {member?.userId || 'N/A'}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Responsibilities Section */}
        <Card className="p-20 border-brand-border bg-brand-surface/40">
          <div className="flex items-center gap-10 mb-12 border-b border-brand-border pb-8">
            <FiActivity className="text-brand-primary" size={18} />
            <h3 className="text-14 font-bold text-brand-text-primary uppercase tracking-wider">Tactical Responsibilities</h3>
          </div>
          <div className="text-13 text-brand-text-muted leading-relaxed">
            {roleDescriptions[role?.toLowerCase()]?.desc || 'No responsibilities defined.'}
          </div>
        </Card>

        {/* Footer Actions — Compact & Pro */}
        <div className="flex flex-wrap justify-between items-center gap-12 bg-brand-elevated/30 p-12 rounded-xl border border-brand-border">
          <div className="flex gap-8">
            <button 
                onClick={() => setIsHandbookOpen(!isHandbookOpen)} 
                className={`h-36 px-16 rounded-lg text-12 font-bold flex items-center gap-8 border transition-all ${isHandbookOpen ? 'bg-brand-primary text-white border-brand-primary shadow-glow-sm' : 'text-brand-text-secondary hover:text-brand-primary border-brand-border hover:bg-brand-surface'}`}
            >
                <FiBook size={14} />
                {isHandbookOpen ? 'Close Handbook' : 'Open Strategic Handbook'}
            </button>

            <a href="/handbook.pdf" download className="h-36 px-16 rounded-lg bg-brand-surface border border-brand-border flex items-center gap-8 text-brand-text-secondary hover:text-brand-primary transition-colors text-12 font-bold">
                <FiDownload size={14} />
                Download PDF
            </a>
          </div>

          <div className="flex gap-8">
            <button onClick={() => navigate('/training')} className="h-36 px-16 rounded-lg text-12 font-bold text-brand-text-secondary hover:text-brand-primary border border-brand-border hover:bg-brand-surface flex items-center gap-8 transition-all">
                <FiActivity size={14} /> Training Simulations
            </button>

            {hasCompletedCurrentRound && !isEliminated ? (
                <button 
                    onClick={() => navigate(`/answers/${adminActiveRound}`)}
                    className="h-36 px-20 rounded-lg text-12 font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-8 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                >
                    <FiCheckCircle size={14} /> View Debrief
                </button>
            ) : !isEliminated ? (
                <button 
                    onClick={() => isCurrentlyPlayable && navigate(`/instructions/${adminActiveRound}`)}
                    disabled={!isCurrentlyPlayable}
                    className={`h-36 px-24 rounded-lg text-12 font-bold uppercase tracking-wider flex items-center gap-8 transition-all ${
                        isCurrentlyPlayable 
                        ? 'bg-brand-primary hover:scale-105 text-white shadow-lg shadow-brand-primary/30' 
                        : 'opacity-50 cursor-not-allowed bg-brand-surface border border-brand-border text-brand-text-muted'
                    }`}
                >
                    <FiPlay size={14} /> {isRoundActive ? `Initiate Round ${adminActiveRound + 1}` : `Awaiting Round ${adminActiveRound + 1}`}
                </button>
            ) : null}
          </div>
        </div>

        {/* Handbook Modal */}
        {isHandbookOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end p-12 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <aside className="w-full max-w-[600px] h-full bg-brand-bg border border-brand-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right-8 duration-500">
              <div className="px-20 py-12 border-b border-brand-border bg-brand-surface flex justify-between items-center">
                <div className="flex items-center gap-12">
                    <div className="p-8 bg-brand-primary/10 rounded-lg text-brand-primary">
                        <FiBook size={18} />
                    </div>
                    <span className="font-bold text-12 uppercase tracking-widest text-brand-text-primary">Strategic Handbook</span>
                </div>
                <div className="flex items-center gap-8">
                  <a href="/handbook.pdf" download className="p-8 rounded-lg hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-primary transition-colors" title="Download Official Copy">
                    <FiDownload size={18} />
                  </a>
                  <button onClick={() => setIsHandbookOpen(false)} className="p-8 rounded-lg hover:bg-red-500/10 text-brand-text-muted hover:text-red-400 transition-colors">
                    <FiX size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white">
                <iframe src="/handbook.pdf#view=FitH&toolbar=0" className="w-full h-full border-none" title="Handbook PDF" />
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
