import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';
import { useGameStore } from '../utils/store';
import { FiCloud, FiDollarSign, FiTrendingUp, FiTarget, FiInfo, FiClock, FiUsers, FiAward, FiPlay, FiBookOpen, FiCheckCircle, FiCalendar, FiChevronRight } from 'react-icons/fi';

const TrainingPage = () => {
  const navigate = useNavigate();
  const { role } = useGameStore();

  const roleGuides = {
    cto: {
      title: 'Cloud Architect (CTO)',
      icon: <FiCloud size={32} />,
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/10',
      description: 'The architectural visionary. Your objective is to engineer high-velocity AWS infrastructure while maintaining extreme cost efficiency.',
      focus: [
          'Right-sizing EC2/RDS strategies',
          'Database high-availability patterns',
          'Elastic Auto-scaling protocols',
          'Latency and reliability audits'
      ],
      key: 'Scale for the peak, but pay for the baseline. Efficiency is your primary technical KPI.'
    },
    cfo: {
      title: 'Economic Strategist (CFO)',
      icon: <FiDollarSign size={32} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      description: 'The fiscal guardian. Your role is to balance technical ambition with aggressive burn rate management and growth forecasting.',
      focus: [
          'Infrastructure margin analysis',
          'Break-even trajectory mapping',
          'OPEX optimization and forecasting',
          'Strategic budget allocation'
      ],
      key: 'A high burn rate is only acceptable if it fuels exponential growth. Watch the runway.'
    },
    pm: {
        title: 'Product Growth Lead (PM)',
        icon: <FiTrendingUp size={32} />,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        description: 'The market catalyst. Your objective is to drive user acquisition and revenue scaling while ensuring product-market fit.',
        focus: [
            'User lifecycle and revenue metrics',
            'Market-driven feature prioritization',
            'Operational reliability impact',
            'Strategic positioning and expansion'
        ],
        key: 'Infrastructure reliability is a feature. Growth without stability leads to churn.'
    }
  };

  const guide = roleGuides[role] || roleGuides.cto;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-primary/30 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full -mr-128 -mt-128 blur-[150px] -z-10"></div>
      
      <Header title="Pre-Deployment Briefing" />

      <main className="max-w-6xl mx-auto px-24 py-48 flex-1 relative z-10">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-48">
            {[
                { title: 'The Infrastructure', desc: 'AWS provides the global scaffolding for our digital operations.', icon: <FiCloud /> },
                { title: 'The Simulation', desc: 'Competitive scenario-based learning with real fiscal consequences.', icon: <FiTarget /> },
                { title: 'The Objective', desc: 'Establish the market-leading startup through technical discipline.', icon: <FiAward /> }
            ].map((item, idx) => (
                <Card key={idx} className="p-24 space-y-16 hover:border-brand-primary/30 transition-all shadow-xl group">
                    <div className="p-12 w-fit bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20 shadow-lg group-hover:scale-110 transition-transform">
                        {React.cloneElement(item.icon, { size: 24 })}
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-16 font-bold tracking-tight">{item.title}</h3>
                        <p className="text-13 text-brand-text-muted leading-relaxed font-medium">{item.desc}</p>
                    </div>
                </Card>
            ))}
        </div>

        {/* Assigned Operational Role */}
        <Card className="p-40 mb-48 border-brand-primary/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-40 opacity-[0.03] -mr-16 -mt-16 group-hover:rotate-12 transition-transform duration-1000">
                {React.cloneElement(guide.icon, { size: 200 })}
            </div>
            
            <div className="relative z-10 space-y-32">
                <div className="flex items-center space-x-16">
                    <div className={`p-16 ${guide.bg} ${guide.color} rounded-2xl border border-white/5 shadow-xl`}>
                        {guide.icon}
                    </div>
                    <div className="space-y-4">
                        <span className="text-10 font-black uppercase tracking-[0.4em] text-brand-primary">Active Assignment</span>
                        <h2 className="text-32 font-bold tracking-tight">{guide.title}</h2>
                    </div>
                </div>

                <p className="text-18 text-brand-text-muted leading-relaxed max-w-3xl font-medium italic">
                    "{guide.description}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {guide.focus.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-12 p-16 bg-brand-bg rounded-xl border border-brand-border group hover:border-brand-primary/40 transition-all">
                            <FiCheckCircle className="text-brand-primary" size={18} />
                            <span className="text-14 font-semibold text-brand-text-primary tracking-tight">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="p-20 bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-xl flex items-start space-x-16">
                    <FiInfo className="text-brand-primary mt-4" size={20} />
                    <p className="text-15 font-bold text-brand-text-primary/90 leading-relaxed">
                        <span className="uppercase tracking-widest text-10 block mb-4 opacity-70">Operational Directive</span>
                        {guide.key}
                    </p>
                </div>
            </div>
        </Card>

        {/* Architecture & Protocol Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-48">
            <Card className="p-32 space-y-32">
                <div className="flex items-center space-x-12">
                    <FiBookOpen className="text-brand-primary" size={24} />
                    <h2 className="text-18 font-bold tracking-tight">Resource Classification</h2>
                </div>
                <div className="grid grid-cols-1 gap-16">
                    {[
                        { title: 'EC2 - Elastic Compute', desc: 'Virtual server fleet. Performance vs Cost trade-offs.', color: 'border-brand-primary' },
                        { title: 'RDS - Managed Databases', desc: 'High-availability data persistence for user scaling.', color: 'border-emerald-500' },
                        { title: 'S3 - Scalable Storage', desc: 'Massive object storage for application assets.', color: 'border-purple-500' },
                        { title: 'Auto-Scaling Protocols', desc: 'Dynamic resource provisioning based on demand surges.', color: 'border-amber-500' }
                    ].map((aws, idx) => (
                        <div key={idx} className={`p-16 border-l-4 ${aws.color} bg-brand-surface/50 rounded-r-xl space-y-4`}>
                            <h4 className="text-14 font-bold text-brand-text-primary">{aws.title}</h4>
                            <p className="text-12 text-brand-text-muted font-medium">{aws.desc}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-32 space-y-32">
                <div className="flex items-center space-x-12">
                    <FiCalendar className="text-brand-primary" size={24} />
                    <h2 className="text-18 font-bold tracking-tight">Mission Parameters</h2>
                </div>
                <div className="space-y-24">
                    <div className="space-y-12">
                        {[
                            'Q0: Initial Infrastructure Deployment',
                            'Q1: Cost Optimization Crisis',
                            'Q2: Rapid Scalability Wave',
                            'Q3: Global Expansion Modules',
                            'Q4: IPO Strategy & Final Consolidaton'
                        ].map((q, idx) => (
                            <div key={idx} className="flex items-center space-x-12 text-13 font-bold text-brand-text-muted">
                                <span className="text-brand-primary">0{idx}</span>
                                <span>{q}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-16 pt-24 border-t border-brand-border">
                        <div className="space-y-8">
                            <div className="flex items-center space-x-8 text-brand-primary">
                                <FiClock size={16} />
                                <span className="text-10 font-black uppercase tracking-widest">Time Constraint</span>
                            </div>
                            <p className="text-12 font-medium text-brand-text-muted">8 minutes per operational cycle.</p>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center space-x-8 text-brand-primary">
                                <FiUsers size={16} />
                                <span className="text-10 font-black uppercase tracking-widest">Unit Autonomy</span>
                            </div>
                            <p className="text-12 font-medium text-brand-text-muted">Independent decision submission logic.</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        {/* Trial Simulation */}
        <Card className="bg-brand-primary p-40 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10 space-y-32">
                <div className="space-y-12">
                    <div className="flex items-center space-x-8">
                        <div className="h-1 w-16 bg-white/50"></div>
                        <span className="text-10 font-black uppercase tracking-[0.3em] text-white/80">Diagnostic Simulation</span>
                    </div>
                    <h3 className="text-24 font-bold text-white tracking-tight">Tactical Scenario Assessment</h3>
                    <p className="text-18 text-white/90 max-w-3xl leading-relaxed font-medium">
                        "Operational burn is exceeding projections by 25%. A high-cost RDS instance has remained idle for 6 fiscal months. Determine the resolution protocol."
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                   <div className="p-20 bg-white/10 backdrop-blur rounded-2xl border border-white/20 text-white font-bold opacity-70">
                       A) Execute Immediate Termination
                   </div>
                   <div className="p-20 bg-white rounded-2xl text-brand-primary font-black border-4 border-white/30 shadow-2xl flex items-center justify-between">
                       <span>B) Snapshot → Terminate</span>
                       <FiCheckCircle size={24} />
                   </div>
                </div>
            </div>
        </Card>

        {/* Start Action */}
        <div className="mt-64 flex justify-center">
            <Button
                onClick={() => navigate('/questions/0')}
                className="w-full max-w-2xl h-80 text-24 group relative overflow-hidden"
            >
                <div className="flex items-center justify-center space-x-16">
                    <FiPlay className="group-hover:translate-x-8 transition-transform" size={28} />
                    <span className="uppercase font-black tracking-widest">Initiate Mission (Q0 Arrival)</span>
                </div>
            </Button>
        </div>
      </main>
    </div>
  );
};

export default TrainingPage;
