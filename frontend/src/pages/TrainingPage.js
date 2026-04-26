import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';
import { useGameStore } from '../utils/store';
import { FiCloud, FiDollarSign, FiTrendingUp, FiTarget, FiInfo, FiClock, FiUsers, FiAward, FiBookOpen, FiCheckCircle, FiCalendar, FiChevronLeft } from 'react-icons/fi';

const TrainingPage = () => {
  const navigate = useNavigate();
  const { role } = useGameStore();

  const roleGuides = {
    cto: {
      title: 'Chief Technology Officer',
      icon: <FiCloud size={32} />,
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/10',
      description: 'The architectural visionary. Your objective is focused on implementation, logic building, debugging, and system architecture.',
      focus: [
          'Implementation and logic building',
          'Debugging and testing',
          'System architecture',
          'Security and performance optimization'
      ],
      key: 'Technical excellence and robust code are your primary objectives.'
    },
    cfo: {
      title: 'Chief Financial Officer',
      icon: <FiDollarSign size={32} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      description: 'The creative lead. Your role is focused on UI/UX, wireframing, visual structure, and user experience.',
      focus: [
          'UI/UX design and wireframing',
          'Visual structure and accessibility',
          'User journey mapping',
          'Interactive prototyping'
      ],
      key: 'An intuitive and beautiful interface drives user engagement.'
    },
    pm: {
        title: 'Product Manager',
        icon: <FiTrendingUp size={32} />,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        description: 'The strategic lead. Your objective is planning, decision-making, requirement analysis, and product strategy.',
        focus: [
            'Planning and requirement analysis',
            'Decision-making and feature prioritization',
            'Market analysis and user feedback',
            'Cross-functional team alignment'
        ],
        key: 'A well-defined strategy ensures the team builds the right product.'
    }
  };

  const guide = roleGuides[role] || roleGuides.cto;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-primary/30 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full -mr-128 -mt-128 blur-[150px] -z-10"></div>
      
      <Header title="Assessment Guide" showLeaderboard={false} />

      <main className="max-w-6xl mx-auto px-24 py-48 flex-1 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-32 text-brand-text-muted hover:text-brand-text-primary">
            <FiChevronLeft className="mr-8" size={20} /> Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-48">
            {[
                { title: 'Platform Usage', desc: 'Navigate to active rounds via the Dashboard when instructed.', icon: <FiTarget /> },
                { title: 'General Rules', desc: 'No tab switching, strict fullscreen, and individual decision making.', icon: <FiCheckCircle /> },
                { title: 'The Objective', desc: 'Successfully complete all sequential rounds assigned by the admin.', icon: <FiAward /> }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-48">
            <Card className="p-32 space-y-32">
                <div className="flex items-center space-x-12">
                    <FiBookOpen className="text-brand-primary" size={24} />
                    <h2 className="text-18 font-bold tracking-tight">Platform Usage & Anti-Cheat</h2>
                </div>
                <div className="grid grid-cols-1 gap-16">
                    {[
                        { title: 'Fullscreen Requirement', desc: 'Tests must be taken in fullscreen mode to ensure integrity.', color: 'border-brand-primary' },
                        { title: 'Tab Switching Disabled', desc: 'Moving away from the active tab will result in a warning.', color: 'border-amber-500' },
                        { title: 'Auto-Disqualification', desc: 'Exceeding 3 warnings automatically disqualifies you.', color: 'border-red-500' },
                        { title: 'Keyboard Shortcuts Disabled', desc: 'Copy-paste and developer tools are strictly prohibited.', color: 'border-purple-500' }
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
                    <h2 className="text-18 font-bold tracking-tight">Round Structure</h2>
                </div>
                <div className="space-y-24">
                    <div className="space-y-12">
                        {[
                            'Round 1',
                            'Round 2',
                            'Round 3',
                            'Round 4',
                            'Round 5'
                        ].map((q, idx) => (
                            <div key={idx} className="flex items-center space-x-12 text-13 font-bold text-brand-text-muted">
                                <span className="text-brand-primary">0{idx + 1}</span>
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
                            <p className="text-12 font-medium text-brand-text-muted">20 minutes per active round.</p>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center space-x-8 text-brand-primary">
                                <FiUsers size={16} />
                                <span className="text-10 font-black uppercase tracking-widest">Sequential Entry</span>
                            </div>
                            <p className="text-12 font-medium text-brand-text-muted">Rounds must be completed in order.</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default TrainingPage;
