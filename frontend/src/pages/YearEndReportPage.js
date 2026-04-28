import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';
import { useGameStore } from '../utils/store';
import { FiTrendingUp, FiDollarSign, FiActivity, FiBriefcase, FiAlertTriangle, FiCheckCircle, FiBarChart2, FiArrowRight, FiBell, FiUsers } from 'react-icons/fi';

const MiniSparkline = ({ data, color = '#7C3AED', height = 40 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data.map(Math.abs), 1);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const w = 100;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} opacity={i === data.length - 1 ? 1 : 0.4} />;
      })}
    </svg>
  );
};

const YearEndReportPage = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const { gameState } = useGameStore();
  const yearKey = `year${year}`;
  const yearData = gameState[yearKey];

  if (!yearData) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-24 text-center selection:bg-brand-primary/30">
        <div className="mb-32 relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
            <FiAlertTriangle className="relative text-amber-500" size={80} />
        </div>
        <h2 className="text-32 font-semibold text-brand-text-primary tracking-tight mb-16">Report Data Not Synchronized</h2>
        <p className="text-brand-text-muted text-18 max-w-md mx-auto leading-relaxed mb-40">
            Year {year} analytics are pending generation. Establish communications with unit members to finalize data capture.
        </p>
        <Button onClick={() => navigate('/profile')} className="px-48">
          Return to Profile
        </Button>
      </div>
    );
  }

  const netMonthly = (yearData.companyState?.monthlyRevenue || 0) - (yearData.companyState?.monthlyBill || 0);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-primary/30 relative overflow-hidden font-sans">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full -mr-128 -mt-128 blur-[150px]"></div>

        <Header title={`Year ${year} Performance Briefing`} showLeaderboard={false} />

        <main className="max-w-7xl mx-auto px-24 py-48 flex-1 w-full relative z-10">
            
            {/* Strategic Overview Header */}
            <div className="mb-48 space-y-16">
                <div className="flex items-center space-x-12">
                    <div className="h-1 w-24 bg-brand-primary"></div>
                    <span className="text-12 font-bold uppercase tracking-[0.3em] text-brand-primary">Annual Performance Audit</span>
                </div>
                <h1 className="text-48 font-semibold tracking-tighter leading-none">
                    System <span className="text-brand-primary">Closure</span> Report.
                </h1>
                <p className="text-brand-text-muted text-16 max-w-2xl">A comprehensive analysis of fiscal year {year} operational expenditures and strategic growth indicators.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-48">
                {(() => {
                    const revenue = yearData.companyState?.monthlyRevenue || 0;
                    const bill = yearData.companyState?.monthlyBill || 0;
                    const profit = yearData.companyState?.cumulativeProfit || 0;
                    const maxVal = Math.max(revenue, bill, Math.abs(profit), 1);

                    return [
                        {
                            label: 'Monthly Revenue',
                            value: `₹${revenue.toLocaleString()}`,
                            raw: revenue,
                            icon: <FiTrendingUp />,
                            color: 'text-emerald-400',
                            bg: 'bg-emerald-500/10',
                            barColor: 'bg-emerald-500',
                            percent: (revenue / maxVal) * 100
                        },
                        {
                            label: 'Monthly AWS Bill',
                            value: `₹${bill.toLocaleString()}`,
                            raw: bill,
                            icon: <FiDollarSign />,
                            color: 'text-red-400',
                            bg: 'bg-red-500/10',
                            barColor: 'bg-red-500',
                            percent: (bill / maxVal) * 100
                        },
                        {
                            label: 'Cumulative Profit',
                            value: `₹${profit.toLocaleString()}`,
                            raw: profit,
                            icon: <FiActivity />,
                            color: profit >= 0 ? 'text-brand-primary' : 'text-amber-400',
                            bg: profit >= 0 ? 'bg-brand-primary/10' : 'bg-amber-500/10',
                            barColor: profit >= 0 ? 'bg-brand-primary' : 'bg-amber-500',
                            percent: (Math.abs(profit) / maxVal) * 100
                        }
                    ].map((metric, idx) => (
                        <Card key={idx} className="p-32 flex flex-col items-center text-center group hover:border-brand-primary/30 transition-all shadow-xl">
                            <div className={`${metric.bg} ${metric.color} p-16 rounded-2xl mb-24 transition-transform group-hover:scale-110 shadow-lg`}>
                                {React.cloneElement(metric.icon, { size: 32 })}
                            </div>
                            <div className="text-40 font-semibold text-brand-text-primary mb-8 font-mono tracking-tighter">
                                {metric.value}
                            </div>
                            <p className="text-12 font-bold text-brand-text-muted uppercase tracking-widest mb-16">{metric.label}</p>
                            <div className="w-full h-[6px] bg-brand-elevated rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${metric.barColor} rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${Math.min(metric.percent, 100)}%` }}
                                />
                            </div>
                        </Card>
                    ));
                })()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-32 mb-64">
                {/* Executive Summary */}
                <Card className="lg:col-span-2 p-40 border-brand-primary/10 shadow-2xl">
                    <div className="flex items-center space-x-16 mb-40">
                        <div className="p-10 bg-brand-surface rounded-xl border border-brand-border text-brand-primary shadow-lg">
                            <FiBriefcase size={24} />
                        </div>
                        <h2 className="text-24 font-semibold tracking-tight">Executive Summary</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
                        <div className="p-24 bg-brand-surface/50 rounded-2xl border border-brand-border space-y-16">
                            <p className="text-10 font-bold text-brand-text-muted uppercase tracking-widest">Net Monthly Cashflow</p>
                            <div className="flex items-center justify-between">
                                <span className="text-14 font-medium text-brand-text-muted italic">Operating Margin</span>
                                <span className={`text-28 font-bold font-mono ${netMonthly >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {netMonthly >= 0 ? '+' : ''}₹{netMonthly.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="p-24 bg-brand-surface/50 rounded-2xl border border-brand-border space-y-16">
                            <p className="text-10 font-bold text-brand-text-muted uppercase tracking-widest">Financial Runway</p>
                            <div className="flex items-center justify-between">
                                <span className="text-14 font-medium text-brand-text-muted italic">Projected Life (Months)</span>
                                <div className="flex items-center space-x-12">
                                    <span className="text-28 font-bold font-mono text-brand-text-primary">{yearData.companyState?.runwayMonths} M</span>
                                    {yearData.companyState?.runwayMonths > 12 ? (
                                        <FiCheckCircle className="text-emerald-400" size={24} />
                                    ) : (
                                        <FiAlertTriangle className="text-amber-400" size={24} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-40 p-24 bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-2xl">
                         <p className="text-16 italic text-brand-text-primary font-medium leading-relaxed">
                            "The Strategic Board has audited your fiscal decisions. Your infrastructure agility and operational discipline have defined this year's growth trajectory."
                        </p>
                    </div>
                </Card>

                {/* Market Events & Scores */}
                <div className="space-y-32">
                    {yearData.marketEvent && (
                    <div className="bg-brand-primary text-white rounded-[2rem] p-32 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-110 transition-all">
                            <FiBell size={100} />
                        </div>
                        <div className="relative z-10 space-y-24">
                            <div className="flex items-center space-x-12">
                                <div className="p-8 bg-white/20 rounded-lg backdrop-blur">
                                    <FiBell size={20} />
                                </div>
                                <span className="text-10 font-black uppercase tracking-[0.2em] text-white/80">Market Intelligence</span>
                            </div>
                            <div>
                                <h3 className="text-24 font-bold tracking-tight mb-8 leading-tight">{yearData.marketEvent.name}</h3>
                                <p className="text-14 text-white/80 leading-relaxed font-medium line-clamp-3">{yearData.marketEvent.description}</p>
                            </div>
                            <div className="p-16 bg-white/10 rounded-xl border border-white/20 text-center">
                                <span className="text-10 font-bold uppercase tracking-widest block mb-4 text-white/60">Profitability Variance</span>
                                <span className={`text-24 font-bold font-mono ${yearData.marketEvent.penalty >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                    {yearData.marketEvent.penalty >= 0 ? '+' : ''}{yearData.marketEvent.penalty}%
                                </span>
                            </div>
                        </div>
                    </div>
                    )}

                    <Card className="p-32 border-brand-border shadow-xl">
                        <div className="flex items-center space-x-12 mb-24">
                            <FiActivity className="text-brand-primary" size={20} />
                            <h3 className="text-12 font-bold uppercase tracking-widest">Unit Performance Rank</h3>
                        </div>
                        <div className="space-y-16">
                            {[
                                { role: 'CTO', color: 'text-brand-primary', barColor: 'bg-brand-primary', score: yearData.scores?.cto },
                                { role: 'CFO', color: 'text-emerald-400', barColor: 'bg-emerald-500', score: yearData.scores?.cfo },
                                { role: 'PM', color: 'text-purple-400', barColor: 'bg-purple-500', score: yearData.scores?.pm }
                            ].map((s, idx) => (
                                <div key={idx} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-10 font-bold text-brand-text-muted uppercase tracking-wider">{s.role}</span>
                                        <span className={`text-14 font-bold font-mono ${s.color}`}>{s.score || 0}%</span>
                                    </div>
                                    <div className="w-full h-[5px] bg-brand-elevated rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${s.barColor} rounded-full transition-all duration-1000 ease-out`}
                                            style={{ width: `${s.score || 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Sparkline Trends + Role Synergy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-64">
                {/* Profit Trend Sparkline */}
                <Card className="p-32 border-brand-border shadow-xl">
                    <div className="flex items-center space-x-12 mb-24">
                        <FiTrendingUp className="text-brand-primary" size={20} />
                        <h3 className="text-12 font-bold uppercase tracking-widest">Profit Trend</h3>
                    </div>
                    <div className="flex items-end justify-between">
                        <MiniSparkline
                            data={[0,1,2,3,4].filter(y => y <= parseInt(year)).map(y => gameState?.[`year${y}`]?.companyState?.cumulativeProfit || 0)}
                            color="#7C3AED"
                            height={60}
                        />
                        <div className="text-right ml-24">
                            {[0,1,2,3,4].filter(y => y <= parseInt(year)).map(y => (
                                <div key={y} className="text-10 text-brand-text-muted font-mono">
                                    R{y+1}: <span className={`font-bold ${(gameState?.[`year${y}`]?.companyState?.cumulativeProfit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        ₹{(gameState?.[`year${y}`]?.companyState?.cumulativeProfit || 0).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Role Synergy Score */}
                <Card className="p-32 border-brand-border shadow-xl">
                    <div className="flex items-center space-x-12 mb-24">
                        <FiUsers className="text-purple-400" size={20} />
                        <h3 className="text-12 font-bold uppercase tracking-widest">Role Synergy Index</h3>
                    </div>
                    {(() => {
                        const cto = yearData.scores?.cto || 0;
                        const cfo = yearData.scores?.cfo || 0;
                        const pm = yearData.scores?.pm || 0;
                        const scores = [cto, cfo, pm];
                        const avg = scores.reduce((a, b) => a + b, 0) / 3;
                        const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / 3;
                        const stdDev = Math.sqrt(variance);
                        const maxScore = Math.max(...scores, 1);
                        const synergy = Math.max(0, Math.round(100 - (stdDev / maxScore) * 100));

                        return (
                            <div className="space-y-16">
                                <div className="flex items-end justify-between">
                                    <div className={`text-48 font-bold font-mono tracking-tighter ${synergy >= 80 ? 'text-emerald-400' : synergy >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                        {synergy}%
                                    </div>
                                    <span className={`text-12 font-bold uppercase tracking-wider px-12 py-4 rounded-full border ${
                                        synergy >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                                        synergy >= 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                                        'text-red-400 bg-red-500/10 border-red-500/30'
                                    }`}>
                                        {synergy >= 80 ? 'Excellent' : synergy >= 50 ? 'Moderate' : 'Low'}
                                    </span>
                                </div>
                                <div className="w-full h-[6px] bg-brand-elevated rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${synergy >= 80 ? 'bg-emerald-500' : synergy >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${synergy}%` }}
                                    />
                                </div>
                                <p className="text-12 text-brand-text-muted leading-relaxed">
                                    Synergy measures how balanced the team's role contributions are. High synergy = all roles performing equally well.
                                </p>
                            </div>
                        );
                    })()}
                </Card>
            </div>

            {/* Final Actions */}
            <div className="flex flex-col md:flex-row gap-24 pt-32 border-t border-brand-border">
                {parseInt(year) < 4 ? (
                    <Button
                        onClick={() => navigate(`/questions/${parseInt(year) + 1}`)}
                        className="flex-1 h-72 text-20 group relative overflow-hidden"
                    >
                        <div className="flex items-center justify-center space-x-20">
                            <span className="uppercase font-black tracking-widest">Initiate Year {parseInt(year) + 1} Deployment</span>
                            <FiArrowRight className="group-hover:translate-x-8 transition-transform" size={24} />
                        </div>
                    </Button>
                ) : (
                    <Button
                        onClick={() => navigate('/results')}
                        className="flex-1 h-72 text-20 group bg-emerald-600 hover:bg-emerald-500 ring-emerald-500/30"
                    >
                        <div className="flex items-center justify-center space-x-20">
                            <span className="uppercase font-black tracking-widest text-white">Final Valuation Protocol</span>
                            <FiCheckCircle className="group-hover:scale-110 transition-transform" size={24} />
                        </div>
                    </Button>
                )}
                
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="px-48 h-72 bg-brand-surface text-brand-text-primary border border-brand-border rounded-2xl font-bold text-16 hover:bg-brand-bg transition-all flex items-center justify-center space-x-12 shadow-xl group"
                >
                    <FiBarChart2 className="text-brand-primary group-hover:-translate-y-4 transition-transform" size={24} />
                    <span>Leaderboard</span>
                </button>
            </div>
        </main>
    </div>
  );
};

export default YearEndReportPage;
