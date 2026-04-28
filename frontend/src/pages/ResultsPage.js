import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';
import { useGameStore } from '../utils/store';
import { FiAward, FiTrendingUp, FiActivity, FiUsers, FiInfo, FiBarChart2, FiHome, FiCheckCircle, FiStar, FiZap } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const useCountUp = (target, duration = 2000) => {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const { teamName, gameState } = useGameStore();

  const finalProfit = gameState?.year4?.companyState?.cumulativeProfit || 0;
  const displayProfit = useCountUp(finalProfit, 2500);
  const confettiFired = useRef(false);

  useEffect(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    const end = Date.now() + 3000;
    const fire = () => {
      confetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, colors: ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'] });
      if (Date.now() < end) setTimeout(fire, 400);
    };
    setTimeout(fire, 500);
  }, []);

  const getAward = () => {
    if (finalProfit > 200000) return { icon: <FiStar size={64} className="text-yellow-400" />, title: 'Market Dominator', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (finalProfit > 100000) return { icon: <FiAward size={64} className="text-blue-400" />, title: 'Elite AWS Architect', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (finalProfit > 50000) return { icon: <FiCheckCircle size={64} className="text-emerald-400" />, title: 'Profitable Startup', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    return { icon: <FiActivity size={64} className="text-brand-primary" />, title: 'Resilient Competitor', color: 'text-brand-primary', bg: 'bg-brand-primary/10' };
  };

  const award = getAward();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-primary/30 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-brand-primary/5 rounded-full blur-[150px] -z-10 mt-[-500px]"></div>
      
      <Header title="Final Valuation Protocol" showLeaderboard={true} />

      <main className="max-w-7xl mx-auto px-24 py-64 flex-1 w-full relative z-10">
        
        {/* Celebration Header */}
        <div className="text-center mb-64 space-y-24">
          <div className="inline-flex items-center justify-center p-24 bg-brand-surface rounded-[3rem] border border-brand-border shadow-2xl relative group">
            <div className={`absolute inset-0 ${award.bg} blur-2xl rounded-full opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            {React.cloneElement(award.icon, { className: `${award.color} relative z-10 animate-pulse` })}
          </div>
          <div className="space-y-8">
            <h1 className="text-56 font-semibold tracking-tighter leading-none">
                Mission Complete, <span className="text-brand-primary">{teamName}</span>.
            </h1>
            <p className={`text-14 font-black uppercase tracking-[0.5em] ${award.color}`}>{award.title}</p>
          </div>
        </div>

        {/* Final Valuation Terminal */}
        <Card className="p-64 text-center mb-64 border-brand-primary/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-30"></div>
            <div className="absolute -right-32 -bottom-32 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <FiZap size={300} className="text-brand-primary" />
            </div>
            
            <p className="text-12 font-bold text-brand-text-muted uppercase tracking-[0.3em] mb-24">Final Consolidated Valuation</p>
            <div className={`text-96 font-bold mb-16 font-mono tracking-tighter transition-all duration-500 ${finalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ₹{displayProfit.toLocaleString()}
            </div>
            <p className="text-16 text-brand-text-muted font-medium max-w-xl mx-auto leading-relaxed">
                Aggregated fiscal performance spanning the 5-year initial operational cycle (Q0 - Q4 Consolidation).
            </p>
        </Card>

        {/* Multi-Year Breakdown */}
        <div className="space-y-32 mb-64">
            <div className="flex items-center space-x-12">
                <div className="h-1 w-24 bg-brand-primary"></div>
                <h2 className="text-12 font-bold uppercase tracking-[0.3em] text-brand-text-muted">Operational Timeline</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
                {[0, 1, 2, 3, 4].map((year) => (
                    <Card key={year} className="p-24 border-brand-border hover:border-brand-primary/30 transition-all group">
                        <h3 className="text-10 font-bold text-brand-text-muted uppercase tracking-widest mb-16">Year {year}</h3>
                        <div className="text-20 font-bold text-brand-text-primary mb-4 font-mono group-hover:text-brand-primary transition-colors">
                            ₹{gameState?.[`year${year}`]?.companyState?.cumulativeProfit?.toLocaleString() || '0'}
                        </div>
                        <p className="text-10 text-brand-text-muted font-bold uppercase tracking-tighter">
                            {year === 0 ? 'Seed' : year === 1 ? 'Optimal' : year === 2 ? 'Growth' : year === 3 ? 'Scale' : 'Target'}
                        </p>
                    </Card>
                ))}
            </div>
        </div>

        {/* Key Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-32 mb-64">
            {[
                { 
                    title: 'System Efficiency', 
                    desc: 'Resource utilization optimized across EC2/RDS layers, maintaining target availability.', 
                    icon: <FiActivity />, 
                    color: 'text-brand-primary' 
                },
                { 
                    title: 'Elastic Scalability', 
                    desc: 'Successfully mitigated peak demand cycles during critical growth windows.', 
                    icon: <FiTrendingUp />, 
                    color: 'text-emerald-400' 
                },
                { 
                    title: 'Unit Synergy', 
                    desc: 'High alignment between executive roles (CTO/CFO/PM) facilitated strategic agility.', 
                    icon: <FiUsers />, 
                    color: 'text-purple-400' 
                }
            ].map((intel, idx) => (
                <Card key={idx} className="p-32 space-y-20 border-brand-border/50">
                    <div className={`p-10 w-fit bg-brand-surface rounded-xl border border-brand-border ${intel.color} shadow-lg`}>
                        {React.cloneElement(intel.icon, { size: 24 })}
                    </div>
                    <div className="space-y-8">
                        <h3 className="text-18 font-semibold tracking-tight">{intel.title}</h3>
                        <p className="text-14 text-brand-text-muted leading-relaxed font-medium">{intel.desc}</p>
                    </div>
                </Card>
            ))}
        </div>

        {/* Strategic Debrief */}
        <Card className="bg-brand-surface border-brand-border p-48 mb-64 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-32 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
            <FiInfo size={250} />
          </div>
          <div className="relative z-10 space-y-32">
            <div>
                <h2 className="text-32 font-bold tracking-tight mb-16">Strategic Debrief</h2>
                <p className="text-18 text-brand-text-muted max-w-4xl leading-relaxed font-medium">
                You have successfully navigated a 5-year longitudinal simulation of cloud-native growth. The patterns mastered—architectural rightsizing, cost management, and multi-region expansion—mirror real-world SaaS operational excellence.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 font-bold">
              <div className="flex items-center space-x-12 p-16 bg-brand-bg/50 rounded-xl border border-brand-border">
                <FiCheckCircle className="text-brand-primary" />
                <span className="text-12 uppercase tracking-widest text-brand-text-muted">Technical Debt Impact Audit</span>
              </div>
              <div className="flex items-center space-x-12 p-16 bg-brand-bg/50 rounded-xl border border-brand-border">
                <FiCheckCircle className="text-brand-primary" />
                <span className="text-12 uppercase tracking-widest text-brand-text-muted">Infrastructure Lag Mitigation</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Global Navigation */}
        <div className="flex flex-col md:flex-row gap-24 justify-center pt-32 border-t border-brand-border">
            <Button
                onClick={() => navigate('/leaderboard')}
                className="px-64 h-72 text-20 group relative overflow-hidden"
            >
                <div className="flex items-center justify-center space-x-16">
                    <FiBarChart2 size={24} />
                    <span className="uppercase font-black tracking-widest">Global Standings</span>
                </div>
            </Button>
            
            <button
                onClick={() => navigate('/')}
                className="px-64 h-72 bg-brand-surface text-brand-text-primary border border-brand-border rounded-2xl font-bold text-18 hover:bg-brand-bg transition-all flex items-center justify-center space-x-16 shadow-xl group"
            >
                <FiHome size={24} className="text-brand-primary group-hover:-translate-y-4 transition-transform" />
                <span className="uppercase tracking-widest">Home Terminal</span>
            </button>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
