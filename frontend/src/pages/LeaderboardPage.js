import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import { leaderboardAPI } from '../utils/api';
import { FiTrendingUp, FiActivity, FiUsers, FiAward, FiZap, FiRefreshCw, FiClock, FiChevronUp, FiChevronDown, FiMinus } from 'react-icons/fi';

const PODIUM_CONFIG = [
  { idx: 1, label: '2nd', color: 'slate', ring: 'ring-slate-400/50', bg: 'from-slate-400/10 to-slate-600/5', text: 'text-slate-300', border: 'border-slate-400/20', glow: '', height: 'h-[140px]', avatarSize: 'w-[64px] h-[64px] text-[22px]', scoreSize: 'text-[24px]', order: 'order-1', mt: 'mt-[40px]' },
  { idx: 0, label: '1st', color: 'yellow', ring: 'ring-yellow-400/60', bg: 'from-yellow-400/15 to-amber-600/5', text: 'text-yellow-400', border: 'border-yellow-400/30', glow: 'shadow-[0_0_60px_rgba(250,204,21,0.12)]', height: 'h-[180px]', avatarSize: 'w-[80px] h-[80px] text-[28px]', scoreSize: 'text-[32px]', order: 'order-2', mt: '' },
  { idx: 2, label: '3rd', color: 'amber', ring: 'ring-amber-600/50', bg: 'from-amber-600/10 to-amber-800/5', text: 'text-amber-500', border: 'border-amber-600/20', glow: '', height: 'h-[120px]', avatarSize: 'w-[56px] h-[56px] text-[20px]', scoreSize: 'text-[22px]', order: 'order-3', mt: 'mt-[60px]' },
];

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeRounds, setActiveRounds] = useState([]);
  const prevRanks = useRef({});
  const [rankChanges, setRankChanges] = useState({});

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const response = await leaderboardAPI.getAll();
        const data = response.data.leaderboard;

        const changes = {};
        data.forEach((team, idx) => {
          const prevRank = prevRanks.current[team.teamId];
          if (prevRank !== undefined) {
            if (idx < prevRank) changes[team.teamId] = 'up';
            else if (idx > prevRank) changes[team.teamId] = 'down';
          }
          prevRanks.current[team.teamId] = idx;
        });
        setRankChanges(changes);
        setTimeout(() => setRankChanges({}), 3000);

        const rounds = [];
        for (let i = 0; i <= 9; i++) {
          if (data.some(t => (t[`year${i}Points`] || 0) > 0)) {
            rounds.push(i);
          }
        }
        setActiveRounds(rounds);

        setLeaderboard(data);
        setLastUpdated(new Date());
        setError('');
        setLoading(false);
      } catch (err) {
        setError('Unable to load leaderboard. Retrying...');
        setLoading(false);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(c => c + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const getTimeSince = () => {
    if (!lastUpdated) return '';
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  const formatTime = (seconds) => {
    if (seconds === undefined) return '--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getInitials = (name) => {
    return name.split(/[\s-]+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-[24px]">
        <div className="relative">
          <div className="absolute inset-0 bg-[#7C3AED]/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <FiZap className="relative text-[#7C3AED] animate-bounce" size={56} />
        </div>
        <p className="text-[#9CA3AF] font-semibold uppercase tracking-[0.3em] text-[12px]">Loading Rankings...</p>
      </div>
    </div>
  );

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#030712] text-[#F9FAFB] font-sans">
      <Header title="Leaderboard" showLeaderboard={false} />

      <main className="max-w-[1200px] mx-auto px-[16px] md:px-[24px] py-[32px]">

        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px] mb-[40px]">
          <div>
            <div className="flex items-center gap-[10px] mb-[8px]">
              <div className="h-[3px] w-[24px] bg-[#7C3AED] rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Live Rankings</span>
            </div>
            <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight leading-none">
              Global <span className="text-[#7C3AED]">Leaderboard</span>
            </h1>
          </div>

          <div className="flex items-center gap-[12px]">
            {lastUpdated && (
              <div className="flex items-center gap-[8px] px-[14px] py-[8px] bg-[#111827] rounded-[10px] border border-[#1F2937]">
                <div className="w-[7px] h-[7px] bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[11px] font-semibold text-[#9CA3AF]">Updated {getTimeSince()}</span>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="p-[10px] bg-[#111827] rounded-[10px] border border-[#1F2937] text-[#9CA3AF] hover:text-[#7C3AED] hover:border-[#7C3AED]/40 transition-all"
            >
              <FiRefreshCw size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-[20px] py-[14px] rounded-[12px] mb-[28px] flex items-center gap-[12px] text-[14px] font-medium">
            <FiActivity size={18} />
            <span>{error}</span>
          </div>
        )}

        {leaderboard.length === 0 && (
          <div className="flex flex-col items-center py-[80px]">
            <div className="bg-[#111827] p-[28px] rounded-full border border-[#1F2937] mb-[24px]">
              <FiUsers size={48} className="text-[#7C3AED]/40" />
            </div>
            <p className="text-[18px] font-bold text-[#9CA3AF] mb-[8px]">No Teams Yet</p>
            <p className="text-[13px] text-[#6B7280]">Rankings will appear once teams start competing.</p>
          </div>
        )}

        {/* Podium - Top 3 */}
        {top3.length >= 2 && (
          <div className="hidden md:flex items-end justify-center gap-[20px] mb-[48px] px-[40px]">
            {PODIUM_CONFIG.map(({ idx, label, ring, bg, text, border, glow, height, avatarSize, scoreSize, order, mt }) => {
              const team = top3[idx];
              if (!team) return null;
              return (
                <div key={idx} className={`flex-1 max-w-[320px] ${order} ${mt}`}>
                  <div className="flex flex-col items-center mb-[16px]">
                    <div className={`${avatarSize} rounded-full bg-gradient-to-br ${bg} ${ring} ring-2 flex items-center justify-center font-bold ${text} mb-[8px]`}>
                      {getInitials(team.teamName)}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${text}`}>{label} Place</span>
                  </div>
                  <div className={`bg-[#0B0F14] ${border} border rounded-[16px] p-[24px] text-center ${glow} relative overflow-hidden ${height} flex flex-col justify-center`}>
                    <div className={`absolute inset-0 bg-gradient-to-b ${bg} pointer-events-none`} />
                    <div className="relative z-10">
                      <h3 className="text-[18px] font-bold text-white truncate mb-[8px] px-[4px]">{team.teamName}</h3>
                      <div className={`${scoreSize} font-bold font-mono ${text} tracking-tight`}>
                        {team.scoreSum || 0}
                        <span className="text-[13px] font-medium ml-[4px] opacity-60">pts</span>
                      </div>
                      {team.avgEfficiency !== undefined && (
                        <div className="mt-[10px] flex items-center justify-center gap-[6px]">
                          <div className="w-[60px] h-[4px] bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/70 rounded-full" style={{ width: `${team.avgEfficiency}%` }} />
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400/80">{team.avgEfficiency}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile Podium */}
        {top3.length >= 1 && (
          <div className="md:hidden space-y-[12px] mb-[32px]">
            {top3.map((team, idx) => {
              const cfg = PODIUM_CONFIG.find(p => p.idx === idx);
              return (
                <div key={team.teamId} className={`bg-[#0B0F14] ${cfg.border} border rounded-[14px] p-[16px] flex items-center gap-[14px] relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${cfg.bg} pointer-events-none`} />
                  <div className={`relative z-10 w-[44px] h-[44px] rounded-full bg-gradient-to-br ${cfg.bg} ${cfg.ring} ring-2 flex items-center justify-center font-bold ${cfg.text} text-[16px] shrink-0`}>
                    {idx + 1}
                  </div>
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-white truncate">{team.teamName}</div>
                    <div className="text-[11px] text-[#9CA3AF]">Efficiency: {team.avgEfficiency || 0}%</div>
                  </div>
                  <div className={`relative z-10 ${cfg.scoreSize} font-bold font-mono ${cfg.text} shrink-0`}>
                    {team.scoreSum || 0}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Summary */}
        {leaderboard.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px] mb-[32px]">
            {[
              { label: 'Teams', value: leaderboard.length, icon: FiUsers, color: 'text-[#7C3AED]' },
              { label: 'Rounds Played', value: activeRounds.length, icon: FiActivity, color: 'text-emerald-400' },
              { label: 'Top Score', value: leaderboard[0]?.scoreSum || 0, icon: FiTrendingUp, color: 'text-yellow-400' },
              { label: 'Avg Score', value: Math.round(leaderboard.reduce((s, t) => s + (t.scoreSum || 0), 0) / leaderboard.length), icon: FiAward, color: 'text-sky-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[#0B0F14] border border-[#1F2937] rounded-[12px] p-[16px] flex items-center gap-[12px]">
                <div className={`w-[36px] h-[36px] rounded-[10px] bg-white/[0.04] flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-[18px] font-bold font-mono text-white">{value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6B7280]">{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Table */}
        {leaderboard.length > 0 && (
          <div className="hidden md:block bg-[#0B0F14] border border-[#1F2937] rounded-[16px] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#111827] border-b border-[#1F2937]">
                    <th className="px-[20px] py-[16px] text-left w-[60px]">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">#</span>
                    </th>
                    <th className="px-[20px] py-[16px] text-left">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">Team</span>
                    </th>
                    <th className="px-[16px] py-[16px] text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">Efficiency</span>
                    </th>
                    <th className="px-[16px] py-[16px] text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">Time</span>
                    </th>
                    {activeRounds.map(r => (
                      <th key={r} className="px-[14px] py-[16px] text-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">R{r + 1}</span>
                      </th>
                    ))}
                    <th className="px-[20px] py-[16px] text-right">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">Total</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((team, idx) => {
                    const change = rankChanges[team.teamId];
                    return (
                      <tr
                        key={team.teamId}
                        className={`border-b border-[#1F2937]/50 transition-all group ${
                          idx < 3 ? 'bg-[#7C3AED]/[0.02]' : 'hover:bg-white/[0.02]'
                        } ${change === 'up' ? 'animate-pulse' : ''}`}
                      >
                        {/* Rank */}
                        <td className="px-[20px] py-[18px]">
                          <div className="flex items-center gap-[8px]">
                            <span className={`text-[16px] font-bold font-mono ${
                              idx === 0 ? 'text-yellow-400' :
                              idx === 1 ? 'text-slate-300' :
                              idx === 2 ? 'text-amber-500' :
                              'text-[#4B5563]'
                            }`}>
                              {idx + 1}
                            </span>
                            {change === 'up' && <FiChevronUp size={14} className="text-emerald-400" />}
                            {change === 'down' && <FiChevronDown size={14} className="text-red-400" />}
                            {!change && idx < 20 && <FiMinus size={10} className="text-[#374151]" />}
                          </div>
                        </td>

                        {/* Team Name */}
                        <td className="px-[20px] py-[18px]">
                          <div className="flex items-center gap-[12px]">
                            <div className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[12px] font-bold shrink-0 ${
                              idx === 0 ? 'bg-yellow-400/15 text-yellow-400 ring-1 ring-yellow-400/20' :
                              idx === 1 ? 'bg-slate-400/15 text-slate-300 ring-1 ring-slate-400/20' :
                              idx === 2 ? 'bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20' :
                              'bg-[#1F2937] text-[#6B7280]'
                            }`}>
                              {getInitials(team.teamName)}
                            </div>
                            <span className={`text-[14px] font-semibold group-hover:text-[#7C3AED] transition-colors ${
                              idx < 3 ? 'text-white' : 'text-[#D1D5DB]'
                            }`}>
                              {team.teamName}
                            </span>
                          </div>
                        </td>

                        {/* Efficiency */}
                        <td className="px-[16px] py-[18px] text-center">
                          <div className="flex items-center justify-center gap-[6px]">
                            <div className="w-[40px] h-[4px] bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500/60 rounded-full transition-all" style={{ width: `${team.avgEfficiency || 0}%` }} />
                            </div>
                            <span className="text-[13px] font-mono font-semibold text-emerald-400/80">
                              {team.avgEfficiency !== undefined ? `${team.avgEfficiency}%` : '--'}
                            </span>
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-[16px] py-[18px] text-center">
                          <span className="text-[12px] font-mono text-[#9CA3AF]">
                            {formatTime(team.totalTimeSpent)}
                          </span>
                        </td>

                        {/* Round scores */}
                        {activeRounds.map(r => {
                          const pts = team[`year${r}Points`] || 0;
                          return (
                            <td key={r} className="px-[14px] py-[18px] text-center">
                              <span className={`text-[13px] font-mono font-semibold ${
                                pts > 0 ? 'text-[#D1D5DB]' : 'text-[#374151]'
                              }`}>
                                {pts > 0 ? pts : '--'}
                              </span>
                            </td>
                          );
                        })}

                        {/* Total */}
                        <td className="px-[20px] py-[18px] text-right">
                          <span className={`text-[20px] font-bold font-mono tracking-tight ${
                            idx === 0 ? 'text-yellow-400' :
                            idx === 1 ? 'text-slate-200' :
                            idx === 2 ? 'text-amber-400' :
                            'text-white'
                          }`}>
                            {team.scoreSum || 0}
                          </span>
                          <span className="text-[11px] text-[#6B7280] ml-[4px]">pts</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards (for ranks 4+) */}
        {rest.length > 0 && (
          <div className="md:hidden space-y-[8px]">
            {rest.map((team, i) => {
              const idx = i + 3;
              return (
                <div key={team.teamId} className="bg-[#0B0F14] border border-[#1F2937] rounded-[12px] p-[14px]">
                  <div className="flex items-center gap-[12px] mb-[10px]">
                    <div className="w-[28px] h-[28px] rounded-[6px] bg-[#1F2937] flex items-center justify-center text-[12px] font-bold font-mono text-[#6B7280] shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-[14px] font-semibold text-white flex-1 truncate">{team.teamName}</span>
                    <span className="text-[18px] font-bold font-mono text-white shrink-0">{team.scoreSum || 0}</span>
                  </div>
                  {activeRounds.length > 0 && (
                    <div className="flex gap-[6px] flex-wrap">
                      {activeRounds.map(r => {
                        const pts = team[`year${r}Points`] || 0;
                        return (
                          <div key={r} className="bg-[#111827] rounded-[6px] px-[8px] py-[4px] text-center min-w-[44px]">
                            <div className="text-[8px] text-[#6B7280] font-bold uppercase">R{r + 1}</div>
                            <div className={`text-[12px] font-mono font-bold ${pts > 0 ? 'text-[#D1D5DB]' : 'text-[#374151]'}`}>
                              {pts > 0 ? pts : '--'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-[10px] pt-[10px] border-t border-[#1F2937]/50 text-[11px] text-[#6B7280]">
                    <span>Eff: <span className="text-emerald-400 font-semibold">{team.avgEfficiency || 0}%</span></span>
                    <span className="flex items-center gap-[4px]"><FiClock size={10} /> {formatTime(team.totalTimeSpent)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-[48px] pb-[24px]">
          <p className="text-[11px] text-[#4B5563]">Rankings auto-refresh every 5 seconds</p>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
