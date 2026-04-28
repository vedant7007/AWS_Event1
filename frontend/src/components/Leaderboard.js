import React, { useEffect, useState, useRef } from 'react';
import { leaderboardAPI } from '../utils/api';
import { FiTrendingUp, FiActivity, FiUsers, FiAward, FiZap, FiClock, FiRefreshCw } from 'react-icons/fi';
import Card from './Card';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTeams, setActiveTeams] = useState(0);
  const prevLeaderboardRef = useRef([]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const response = await leaderboardAPI.getAll();
        const newData = response.data.leaderboard;

        const active = newData.filter(t => {
          const prev = prevLeaderboardRef.current.find(p => p.teamId === t.teamId);
          return prev && (t.scoreSum !== prev.scoreSum);
        }).length;
        setActiveTeams(active);
        prevLeaderboardRef.current = newData;

        setLeaderboard(newData);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (err) {
        setError('Operational Telemetry Interrupted');
        setLoading(false);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTimeSince = () => {
    if (!lastUpdated) return '';
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(c => c + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) return (
    <div className="py-64 flex flex-col items-center justify-center">
      <FiZap className="text-brand-primary animate-pulse mb-24" size={48} />
      <p className="text-brand-text-muted font-medium uppercase tracking-[0.3em] text-12">Streaming Live Rankings...</p>
    </div>
  );

  return (
    <div className="w-full animate-in fade-in duration-700">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-24 py-16 rounded-xl mb-32 font-medium flex items-center space-x-12">
          <FiActivity size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between mb-16 px-4">
        <div className="flex items-center gap-16">
          {activeTeams > 0 && (
            <div className="flex items-center gap-8 text-12 text-emerald-400 font-bold">
              <div className="w-[8px] h-[8px] bg-emerald-500 rounded-full animate-pulse" />
              <span>{activeTeams} team{activeTeams !== 1 ? 's' : ''} scoring</span>
            </div>
          )}
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-8 text-11 text-brand-text-muted font-medium">
            <FiRefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>Updated {getTimeSince()}</span>
          </div>
        )}
      </div>

      {/* Desktop table */}
      <Card className="p-0 overflow-hidden border border-brand-border bg-brand-surface shadow-premium hidden md:flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1 hidden-scrollbar relative">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-brand-elevated shadow-md">
              <tr className="border-b border-brand-border">
                <th className="px-24 py-[20px] border-b border-brand-border">
                  <div className="flex items-center space-x-4">
                    <FiAward className="text-brand-primary" size={14} />
                    <span className="text-brand-text-muted font-semibold uppercase tracking-widest text-10 whitespace-nowrap">Rank</span>
                  </div>
                </th>
                <th className="px-24 py-[20px] border-b border-brand-border">
                  <div className="flex items-center space-x-4">
                    <FiUsers className="text-brand-primary" size={14} />
                    <span className="text-brand-text-muted font-semibold uppercase tracking-widest text-10 whitespace-nowrap">Unit Identity</span>
                  </div>
                </th>
                <th className="px-24 py-[20px] border-b border-brand-border text-center">
                  <span className="text-brand-text-muted font-semibold uppercase tracking-widest text-10 whitespace-nowrap">Efficiency</span>
                </th>
                <th className="px-24 py-[20px] border-b border-brand-border text-center">
                  <span className="text-brand-text-muted font-semibold uppercase tracking-widest text-10 whitespace-nowrap">Op Time</span>
                </th>
                {[1, 2, 3, 4, 5].map(y => (
                  <th key={y} className="px-24 py-[20px] border-b border-brand-border text-center">
                     <span className="text-brand-text-muted font-semibold uppercase tracking-widest text-10 whitespace-nowrap">R{y}</span>
                  </th>
                ))}
                <th className="px-24 py-[20px] border-b border-brand-border text-right">
                  <div className="flex items-center justify-end space-x-4">
                    <FiTrendingUp className="text-brand-primary" size={14} />
                    <span className="text-brand-text-muted font-semibold uppercase tracking-widest text-10 whitespace-nowrap">Total</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {leaderboard.map((team, idx) => (
                <tr key={team.teamId} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-24 py-24">
                     <span className={`text-16 font-bold font-mono ${
                       idx === 0 ? 'text-yellow-500' :
                       idx === 1 ? 'text-gray-400' :
                       idx === 2 ? 'text-amber-600' :
                       'text-brand-text-muted opacity-50'
                     }`}>
                        {idx + 1}
                     </span>
                  </td>
                  <td className="px-24 py-24 whitespace-nowrap">
                     <span className="text-14 font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors">{team.teamName}</span>
                  </td>
                  <td className="px-24 py-24 text-center">
                    <span className="text-14 font-mono font-bold text-emerald-400">
                      {team.avgEfficiency !== undefined ? `${team.avgEfficiency}%` : '-'}
                    </span>
                  </td>
                  <td className="px-24 py-24 text-center">
                    <span className="text-12 font-mono text-brand-text-secondary whitespace-nowrap">
                      {team.totalTimeSpent !== undefined ? `${Math.floor(team.totalTimeSpent/60)}m ${team.totalTimeSpent%60}s` : '-'}
                    </span>
                  </td>
                  {[0, 1, 2, 3, 4].map(y => {
                    const points = team[`year${y}Points`];
                    return (
                      <td key={y} className="px-24 py-24 text-center">
                        <span className={`font-mono text-14 ${points !== undefined ? 'text-brand-text-secondary' : 'text-brand-text-muted opacity-40'}`}>
                            {points !== undefined ? `${points}` : '0'}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-24 py-24 text-right">
                    <span className={`text-18 font-bold font-mono tracking-tight ${idx === 0 ? 'text-brand-primary' : 'text-brand-text-primary'}`}>
                      {team.scoreSum || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-12">
        {leaderboard.map((team, idx) => (
          <Card key={team.teamId} className={`p-16 ${idx < 3 ? 'border-brand-primary/20' : 'border-brand-border'}`}>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-12">
                <div className={`w-32 h-32 rounded-lg flex items-center justify-center font-bold text-14 font-mono ${
                  idx === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                  idx === 1 ? 'bg-gray-400/20 text-gray-400' :
                  idx === 2 ? 'bg-amber-600/20 text-amber-600' :
                  'bg-brand-elevated text-brand-text-muted'
                }`}>
                  {idx + 1}
                </div>
                <span className="text-16 font-bold text-brand-text-primary">{team.teamName}</span>
              </div>
              <span className={`text-20 font-bold font-mono ${idx === 0 ? 'text-brand-primary' : 'text-brand-text-primary'}`}>
                {team.scoreSum || 0}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {[0, 1, 2, 3, 4].map(y => {
                const points = team[`year${y}Points`];
                return (
                  <div key={y} className="text-center py-4 bg-brand-elevated/50 rounded-lg">
                    <div className="text-[9px] text-brand-text-muted font-bold uppercase">R{y + 1}</div>
                    <div className={`text-12 font-mono font-bold ${points ? 'text-brand-text-secondary' : 'text-brand-text-muted/40'}`}>
                      {points || 0}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-12 pt-12 border-t border-brand-border/30 text-11 text-brand-text-muted">
              <span>Eff: <span className="text-emerald-400 font-bold">{team.avgEfficiency !== undefined ? `${team.avgEfficiency}%` : '-'}</span></span>
              <span>Time: <span className="font-mono">{team.totalTimeSpent !== undefined ? `${Math.floor(team.totalTimeSpent/60)}m ${team.totalTimeSpent%60}s` : '-'}</span></span>
            </div>
          </Card>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="flex flex-col items-center justify-center py-64 rounded-2xl border border-brand-border/40 bg-brand-surface/20 shadow-inner overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent pointer-events-none" />
          <div className="bg-brand-elevated p-24 rounded-full border border-brand-border/40 mb-24 shadow-[0_0_40px_rgba(124,58,237,0.1)]">
            <FiActivity size={48} className="text-brand-primary animate-pulse" />
          </div>
          <p className="text-16 font-bold uppercase tracking-[0.2em] text-brand-text-primary mb-8">Awaiting Unit Registration</p>
          <p className="text-12 font-medium text-brand-text-muted">Global leaderboards will automatically populate upon first team initialization.</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
