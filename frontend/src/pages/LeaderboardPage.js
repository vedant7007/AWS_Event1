import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { leaderboardAPI } from '../utils/api';
import { FiTrendingUp, FiActivity, FiUsers, FiAward, FiZap, FiTarget, FiRefreshCw, FiClock } from 'react-icons/fi';

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
        setError('Communications Uplink Failed: Unable to synchronize rankings.');
        setLoading(false);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-24">
      <div className="flex flex-col items-center space-y-24">
        <div className="relative">
            <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
            <FiZap className="relative text-brand-primary animate-bounce" size={64} />
        </div>
        <p className="text-brand-text-muted font-bold uppercase tracking-[0.4em] text-12">Synchronizing Tactical Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-primary/30 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full -mr-128 -mt-128 blur-[150px] -z-10"></div>
      
      <Header title="Strategic Operations Leaderboard" showLeaderboard={false} />

      <main className="max-w-7xl mx-auto px-24 py-48 flex-1 w-full relative z-10">
        
        {/* Status Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-24 mb-48">
            <div className="space-y-16">
                <div className="flex items-center space-x-12">
                    <div className="h-1 w-24 bg-brand-primary"></div>
                    <span className="text-12 font-bold uppercase tracking-[0.3em] text-brand-primary">Live Mission Stream</span>
                </div>
                <h1 className="text-48 font-semibold tracking-tighter leading-none">
                    Unit <span className="text-brand-primary">Standings</span>.
                </h1>
            </div>
            
            <div className="flex items-center space-x-16">
                <div className="px-16 py-8 bg-brand-surface rounded-xl border border-brand-border flex items-center space-x-12 shadow-lg">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-12 font-black uppercase tracking-widest text-brand-text-muted">Live Uplink Active</span>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="p-10 bg-brand-surface rounded-xl border border-brand-border text-brand-text-muted hover:text-brand-primary hover:border-brand-primary/50 transition-all shadow-lg"
                >
                    <FiRefreshCw size={20} />
                </button>
            </div>
        </div>

        {error && (
            <Card className="border-red-500/30 bg-red-500/5 p-24 mb-32 flex items-center space-x-16 text-red-400">
                <FiActivity size={24} />
                <span className="font-bold">{error}</span>
            </Card>
        )}

        {/* Podium Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-[48px] items-end mt-[20px]">
            {/* Rank 2 */}
            <div className="order-2 md:order-1 flex flex-col items-center">
                {leaderboard[1] && (
                    <div className="w-full flex flex-col items-center group">
                        <div className="relative mb-[16px]">
                            <div className="w-[80px] h-[80px] rounded-full bg-slate-400/20 border-2 border-slate-400/50 flex items-center justify-center text-[32px] shadow-[0_0_20px_rgba(148,163,184,0.2)] group-hover:scale-110 transition-all">🥈</div>
                            <div className="absolute -top-[15px] left-1/2 -translate-x-1/2 text-[24px] rotate-[-15deg]">👑</div>
                        </div>
                        <div className="bg-[#111827] border border-slate-400/30 rounded-t-[16px] p-[24px] w-full text-center shadow-xl relative overflow-hidden h-[180px] flex flex-col justify-center">
                            <div className="absolute inset-0 bg-slate-400/5 pointer-events-none"></div>
                            <span className="text-12 font-black uppercase tracking-widest text-slate-400 mb-[8px] block">Runner Up</span>
                            <h3 className="text-[20px] font-bold text-white mb-[12px] truncate px-[10px]">{leaderboard[1].teamName}</h3>
                            <div className="text-[22px] font-mono font-bold text-slate-300">{leaderboard[1].scoreSum || 0} pts</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Rank 1 */}
            <div className="order-1 md:order-2 flex flex-col items-center">
                {leaderboard[0] && (
                    <div className="w-full flex flex-col items-center group">
                        <div className="relative mb-[20px]">
                            <div className="w-[100px] h-[100px] rounded-full bg-yellow-400/20 border-4 border-yellow-400/50 flex items-center justify-center text-[48px] shadow-[0_0_40px_rgba(250,204,21,0.3)] animate-bounce group-hover:scale-110 transition-all">🥇</div>
                            <div className="absolute -top-[25px] left-1/2 -translate-x-1/2 text-[40px] drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">👑</div>
                        </div>
                        <div className="bg-[#111827] border-2 border-yellow-400/30 rounded-t-[20px] p-[32px] w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden h-[240px] flex flex-col justify-center transform scale-105 z-20">
                            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent pointer-events-none"></div>
                            <span className="text-14 font-black uppercase tracking-[0.3em] text-yellow-400 mb-[10px] block">Supreme Commander</span>
                            <h3 className="text-[28px] font-bold text-white mb-[16px] truncate px-[10px]">{leaderboard[0].teamName}</h3>
                            <div className="text-[32px] font-mono font-bold text-yellow-400 shadow-yellow-400/20 drop-shadow-lg">{leaderboard[0].scoreSum || 0} pts</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Rank 3 */}
            <div className="order-3 md:order-3 flex flex-col items-center">
                {leaderboard[2] && (
                    <div className="w-full flex flex-col items-center group">
                        <div className="relative mb-[16px]">
                            <div className="w-[70px] h-[70px] rounded-full bg-amber-600/20 border-2 border-amber-600/50 flex items-center justify-center text-[28px] shadow-[0_0_15px_rgba(180,83,9,0.2)] group-hover:scale-110 transition-all">🥉</div>
                            <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 text-[20px] rotate-[15deg]">👑</div>
                        </div>
                        <div className="bg-[#111827] border border-amber-600/30 rounded-t-[16px] p-[24px] w-full text-center shadow-xl relative overflow-hidden h-[150px] flex flex-col justify-center">
                            <div className="absolute inset-0 bg-amber-600/5 pointer-events-none"></div>
                            <span className="text-12 font-black uppercase tracking-widest text-amber-600 mb-[8px] block">Elite Unit</span>
                            <h3 className="text-[18px] font-bold text-white mb-[8px] truncate px-[10px]">{leaderboard[2].teamName}</h3>
                            <div className="text-[20px] font-mono font-bold text-amber-500">{leaderboard[2].scoreSum || 0} pts</div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <Card className="overflow-hidden border-brand-border shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-brand-surface/80 border-b border-brand-border">
                  <th className="px-32 py-24 text-left">
                    <div className="flex items-center space-x-12">
                      <FiAward className="text-brand-primary" size={16} />
                      <span className="text-brand-text-muted font-black uppercase tracking-[0.2em] text-10">Ranking</span>
                    </div>
                  </th>
                  <th className="px-32 py-24 text-left">
                    <div className="flex items-center space-x-12">
                      <FiUsers className="text-emerald-400" size={16} />
                      <span className="text-brand-text-muted font-black uppercase tracking-[0.2em] text-10">Unit Designation</span>
                    </div>
                  </th>
                  <th className="px-32 py-24 text-left">
                    <div className="flex items-center space-x-12">
                      <FiTarget className="text-purple-400" size={16} />
                      <span className="text-brand-text-muted font-black uppercase tracking-[0.2em] text-10">Deployment Status</span>
                    </div>
                  </th>
                  <th className="px-16 py-24 text-center">
                    <div className="flex items-center justify-center space-x-8">
                       <FiActivity className="text-blue-400" size={16} />
                       <span className="text-brand-text-muted font-black uppercase tracking-[0.2em] text-10">Efficiency</span>
                    </div>
                  </th>
                  <th className="px-16 py-24 text-center">
                    <div className="flex items-center justify-center space-x-8">
                       <FiClock className="text-orange-400" size={16} />
                       <span className="text-brand-text-muted font-black uppercase tracking-[0.2em] text-10">Avg Output Time</span>
                    </div>
                  </th>
                  {[0, 1, 2, 3, 4].map(y => (
                    <th key={y} className="px-16 py-24 text-right">
                       <span className="text-brand-text-muted font-black uppercase tracking-[0.2em] text-10">R{y + 1}</span>
                    </th>
                  ))}
                  <th className="px-32 py-24 text-right">
                    <div className="flex items-center justify-end space-x-12">
                      <FiTrendingUp className="text-brand-primary" size={16} />
                      <span className="text-brand-text-muted font-black uppercase tracking-[0.2em] text-10">Live Valuation</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {leaderboard.map((team, idx) => (
                  <tr key={team.teamId} className={`group transition-all ${idx < 3 ? 'bg-brand-primary/[0.03]' : 'hover:bg-brand-surface/50'}`}>
                    <td className="px-32 py-24">
                       <div className="flex items-center space-x-16">
                         {idx === 0 && <div className="p-8 bg-yellow-400/20 rounded-lg text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]"><FiAward size={24} /></div>}
                         {idx === 1 && <div className="p-8 bg-slate-400/20 rounded-lg text-slate-400"><FiAward size={20} /></div>}
                         {idx === 2 && <div className="p-8 bg-amber-600/20 rounded-lg text-amber-600"><FiAward size={18} /></div>}
                         <span className={`text-24 font-bold font-mono tracking-tighter ${idx < 3 ? 'text-brand-text-primary' : 'text-brand-text-muted/50'}`}>
                            {idx + 1}
                         </span>
                       </div>
                    </td>
                    <td className="px-32 py-24">
                       <span className="text-18 font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors">{team.teamName}</span>
                    </td>
                    <td className="px-32 py-24">
                      <span className={`px-12 py-4 rounded-full text-10 font-black uppercase tracking-widest inline-flex items-center space-x-8 border ${
                        team.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        team.status === 'in-progress' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
                        'bg-brand-surface text-brand-text-muted border-brand-border'
                      }`}>
                        <div className={`w-6 h-6 rounded-full ${team.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                        <span>{team.status}</span>
                      </span>
                    </td>
                    <td className="px-16 py-24 text-center">
                       <span className="font-mono font-bold text-blue-400 text-16">
                          {team.avgEfficiency !== undefined ? `${team.avgEfficiency}%` : '0%'}
                       </span>
                    </td>
                    <td className="px-16 py-24 text-center">
                       <span className="font-mono font-bold text-orange-400 text-16">
                          {team.totalTimeSpent !== undefined ? `${Math.floor(team.totalTimeSpent/60)}m ${team.totalTimeSpent%60}s` : '--'}
                       </span>
                    </td>
                    {[0, 1, 2, 3, 4].map(y => (
                      <td key={y} className="px-16 py-24 text-right">
                         <span className="font-mono font-bold text-brand-text-muted text-14">
                             {team[`year${y}Points`] !== undefined ? `${team[`year${y}Points`]} pts` : '0 pts'}
                         </span>
                      </td>
                    ))}
                    <td className="px-32 py-24 text-right">
                      <span className={`text-28 font-bold font-mono tracking-tighter ${idx === 0 ? 'text-brand-primary' : 'text-brand-text-primary'}`}>
                        {team.scoreSum || 0} pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {leaderboard.length === 0 && (
          <div className="flex flex-col items-center py-64 opacity-20">
            <FiUsers size={80} className="mb-24" />
            <p className="text-24 font-bold uppercase tracking-[0.3em] text-center">Awaiting Unit Deployment...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaderboardPage;
