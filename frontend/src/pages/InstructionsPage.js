import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../utils/store';
import { adminAPI } from '../utils/api';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { FiClock, FiShield, FiAlertTriangle, FiCheckCircle, FiChevronRight, FiTarget, FiZap, FiUser } from 'react-icons/fi';

const ROUND_DATA = {
  0: {
    title: 'The Cleanup',
    subtitle: 'Year 0 — Inherited Chaos',
    theme: 'PulseStream just raised its Series A, but the AWS bill is a disaster. The previous CTO left behind a graveyard of idle EC2 instances, orphaned snapshots, and over-provisioned resources. Your job: audit the infrastructure, cut the waste, and bring the cloud spend under control — without breaking anything.',
    roles: {
      cto: {
        mission: 'Audit Infrastructure & Right-Size Resources',
        tasks: [
          'Identify over-provisioned and idle EC2 instances across all regions',
          'Recommend right-sizing strategies (instance families, sizing tiers)',
          'Flag orphaned EBS volumes, unused Elastic IPs, and zombie snapshots',
          'Propose a tagging strategy for cost allocation visibility',
        ],
      },
      cfo: {
        mission: 'Cost Analysis & Budget Framework',
        tasks: [
          'Analyze the current AWS billing breakdown by service and region',
          'Identify the top 5 cost drivers and billing anomalies',
          'Set up budget alerts and spending thresholds',
          'Build a baseline cost model for the next quarter',
        ],
      },
      pm: {
        mission: 'Prioritize & Coordinate the Cleanup',
        tasks: [
          'Prioritize cleanup tasks by impact vs. risk of service disruption',
          'Create a phased cleanup roadmap (quick wins → deep optimizations)',
          'Coordinate with CTO and CFO to align technical and financial targets',
          'Define success metrics: target spend reduction percentage',
        ],
      },
    },
  },
  1: {
    title: 'The Commitment Trap',
    subtitle: 'Year 1 — Lock In or Lose Out',
    theme: 'PulseStream\'s workloads are stabilizing, and AWS is offering Reserved Instances and Savings Plans at steep discounts. But commit too early and you\'re locked into capacity you don\'t need. Stay on-demand and you\'re burning cash. This round is about making smart long-term bets without falling into the commitment trap.',
    roles: {
      cto: {
        mission: 'Evaluate Workload Patterns & Commitment Options',
        tasks: [
          'Analyze historical utilization patterns across compute and database services',
          'Compare Reserved Instances vs. Savings Plans vs. Spot Instances',
          'Identify workloads suitable for each commitment type',
          'Design a mixed strategy: committed baseline + on-demand burst + spot for batch',
        ],
      },
      cfo: {
        mission: 'Financial Modeling & Risk Analysis',
        tasks: [
          'Calculate break-even points for 1-year vs. 3-year commitments',
          'Model total cost of ownership under different commitment scenarios',
          'Assess financial risk of over-commitment vs. under-commitment',
          'Recommend an optimal commitment coverage ratio',
        ],
      },
      pm: {
        mission: 'Balance Velocity with Cost Discipline',
        tasks: [
          'Forecast product roadmap capacity needs for the next 12 months',
          'Identify which features drive predictable vs. bursty workloads',
          'Align engineering sprint planning with commitment windows',
          'Define guardrails so cost commitments don\'t slow feature delivery',
        ],
      },
    },
  },
  2: {
    title: 'Chaotic Virality',
    subtitle: 'Year 2 — Traffic Tsunami',
    theme: 'A celebrity just posted a PulseStream clip that went mega-viral. Traffic has spiked 10x overnight. Servers are buckling, latency is through the roof, and users are rage-tweeting. You need to scale — fast — without bankrupting the company. Every second of downtime costs users and reputation.',
    roles: {
      cto: {
        mission: 'Emergency Scaling & Architecture Resilience',
        tasks: [
          'Design auto-scaling policies for web, API, and video processing tiers',
          'Choose between vertical scaling, horizontal scaling, or both',
          'Set up CloudFront CDN for static assets and video delivery',
          'Implement queue-based decoupling for video processing pipeline',
        ],
      },
      cfo: {
        mission: 'Surge Cost Management & Forecasting',
        tasks: [
          'Forecast the cost impact of 10x traffic on current architecture',
          'Negotiate emergency capacity options with reserved vs. spot pricing',
          'Model different scaling scenarios and their budget implications',
          'Determine the revenue-to-infrastructure cost ratio at scale',
        ],
      },
      pm: {
        mission: 'User Experience Under Pressure',
        tasks: [
          'Prioritize: stability and uptime vs. new features during the surge',
          'Define graceful degradation — which features can be temporarily disabled',
          'Plan user communication strategy for any service interruptions',
          'Set SLA targets and monitor real-time user experience metrics',
        ],
      },
    },
  },
  3: {
    title: 'Cascade Failure',
    subtitle: 'Year 3 — Everything is on Fire',
    theme: 'Disaster strikes on three fronts simultaneously: a multi-AZ outage knocks out your primary region, a DDoS attack floods your endpoints, and a security audit reveals a critical vulnerability in your authentication service. This is the ultimate stress test — triage, contain, and recover before PulseStream loses everything.',
    roles: {
      cto: {
        mission: 'Incident Response & Disaster Recovery',
        tasks: [
          'Activate multi-region failover and reroute traffic to the backup region',
          'Deploy WAF rules and Shield Advanced to mitigate the DDoS attack',
          'Patch the authentication vulnerability and rotate compromised credentials',
          'Establish incident command: assign roles, set up war room comms',
        ],
      },
      cfo: {
        mission: 'Downtime Cost & Compliance Impact',
        tasks: [
          'Calculate per-minute revenue loss from the outage',
          'Assess compliance implications of the security breach (GDPR, SOC 2)',
          'Model insurance claim scenarios and legal exposure',
          'Budget emergency recovery resources and post-incident remediation',
        ],
      },
      pm: {
        mission: 'Crisis Communication & Stakeholder Management',
        tasks: [
          'Draft real-time status page updates and customer communications',
          'Manage stakeholder expectations: board, investors, enterprise clients',
          'Prioritize recovery tasks: what gets fixed first for maximum user impact',
          'Plan the post-mortem process and publish a transparent incident report',
        ],
      },
    },
  },
  4: {
    title: 'Strategic Warfare',
    subtitle: 'Year 4 — Go Global or Go Home',
    theme: 'PulseStream is ready to go international. The board wants expansion into Europe and Asia-Pacific within 6 months. But global means data sovereignty laws, multi-region latency challenges, new competitors, and massive infrastructure costs. This is the final battle — architect for the world stage or risk being acquired by a bigger player.',
    roles: {
      cto: {
        mission: 'Multi-Region Architecture & Data Sovereignty',
        tasks: [
          'Design a multi-region architecture spanning US, EU, and APAC',
          'Implement data residency controls for GDPR and local regulations',
          'Optimize cross-region latency with Global Accelerator and edge caching',
          'Plan database replication strategy: active-active vs. active-passive',
        ],
      },
      cfo: {
        mission: 'International Pricing & Regional Cost Modeling',
        tasks: [
          'Model infrastructure costs per region (US-East vs. EU-West vs. AP-Southeast)',
          'Develop region-specific pricing strategy accounting for local markets',
          'Plan for currency exchange risk and regional billing structures',
          'Build a 3-year global expansion financial model',
        ],
      },
      pm: {
        mission: 'Market Entry & Competitive Strategy',
        tasks: [
          'Define market entry priority: which region launches first and why',
          'Plan product localization: language, compliance, feature parity',
          'Analyze competitive landscape in each target market',
          'Set regional KPIs: user acquisition, retention, and revenue targets',
        ],
      },
    },
  },
};

const ROUND_COLORS = {
  0: { accent: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)' },
  1: { accent: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
  2: { accent: '#7C3AED', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.2)' },
  3: { accent: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)' },
  4: { accent: '#3b82f6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)' },
};

export default function InstructionsPage() {
  const { year } = useParams();
  const navigate = useNavigate();
  const { role } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const yearNum = parseInt(year);
  const round = ROUND_DATA[yearNum];
  const colors = ROUND_COLORS[yearNum] || ROUND_COLORS[0];
  const roleKey = role?.toLowerCase();
  const roleData = round?.roles?.[roleKey];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const settingsRes = await adminAPI.getSettings();
        const settings = settingsRes.data;
        if (settings.isRoundActive && settings.currentRound === yearNum) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          navigate('/profile');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    const intervalId = setInterval(checkAuth, 3000);
    return () => clearInterval(intervalId);
  }, [yearNum, navigate]);

  const roleLabels = {
    cto: 'Chief Technology Officer',
    cfo: 'Chief Financial Officer',
    pm: 'Product Manager',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-[16px]">
          <div className="w-[48px] h-[48px] border-[3px] border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-text-muted text-[14px] tracking-wider uppercase">Authenticating Protocol...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans p-24">
        <Card className="max-w-md w-full p-48 text-center border-red-500/20">
          <FiAlertTriangle size={48} className="mx-auto text-red-500 mb-24" />
          <h2 className="text-[24px] font-bold text-brand-text-primary mb-16">Access Denied</h2>
          <p className="text-brand-text-muted mb-32">This strategic window is not currently active.</p>
          <Button onClick={() => navigate('/profile')} className="w-full">Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text-primary">
      <Header title="Mission Briefing" />
      <main className="flex-1 flex items-start justify-center p-24 pt-[40px] relative overflow-y-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: `${colors.accent}10` }} />

        <div className="max-w-[820px] w-full z-10 relative space-y-[24px]">

          {/* Round Header */}
          <div className="rounded-[16px] p-[32px] border" style={{ background: colors.bg, borderColor: colors.border }}>
            <div className="flex items-start gap-[16px]">
              <div className="w-[4px] h-[56px] rounded-full shrink-0" style={{ background: colors.accent }} />
              <div className="flex-1">
                <p className="text-[12px] font-bold uppercase tracking-[0.15em] mb-[4px]" style={{ color: colors.accent }}>
                  {round?.subtitle}
                </p>
                <h1 className="text-[32px] font-extrabold tracking-tight leading-tight">{round?.title}</h1>
                <div className="flex items-center gap-[8px] mt-[8px]">
                  <FiUser size={14} style={{ color: colors.accent }} />
                  <span className="text-[13px] text-brand-text-muted">
                    Playing as <span className="font-semibold text-brand-text-primary">{roleLabels[roleKey] || role}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Briefing */}
          <Card className="p-[28px] border-brand-border">
            <h3 className="text-[16px] font-bold mb-[12px] flex items-center gap-[8px]">
              <FiTarget size={16} style={{ color: colors.accent }} />
              Scenario Briefing
            </h3>
            <p className="text-[14px] text-brand-text-muted leading-[1.7]">{round?.theme}</p>
          </Card>

          {/* Role-Specific Mission */}
          {roleData && (
            <Card className="p-[28px]" style={{ borderColor: colors.border }}>
              <h3 className="text-[16px] font-bold mb-[4px] flex items-center gap-[8px]">
                <FiZap size={16} style={{ color: colors.accent }} />
                Your Mission
              </h3>
              <p className="text-[13px] font-medium mb-[16px]" style={{ color: colors.accent }}>
                {roleData.mission}
              </p>
              <ul className="space-y-[10px]">
                {roleData.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-[10px] text-[14px] text-brand-text-muted">
                    <span className="shrink-0 w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] font-bold mt-[1px]" style={{ background: colors.bg, color: colors.accent, border: `1px solid ${colors.border}` }}>
                      {i + 1}
                    </span>
                    <span className="leading-[1.6]">{task}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Time Protocol + Security side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <Card className="p-[24px] border-brand-border">
              <h3 className="text-[15px] font-bold flex items-center gap-[8px] mb-[10px]">
                <FiClock size={16} className="text-brand-primary" /> Time Protocol
              </h3>
              <p className="text-[13px] text-brand-text-muted leading-[1.6]">
                You have exactly <span className="font-bold text-brand-text-primary">20 minutes</span> to complete this round. The simulation auto-submits your answers when time expires.
              </p>
            </Card>

            <Card className="p-[24px] border-red-500/20">
              <h3 className="text-[15px] font-bold flex items-center gap-[8px] mb-[10px] text-red-400">
                <FiShield size={16} /> Lockdown Rules
              </h3>
              <ul className="space-y-[6px] text-[13px] text-brand-text-muted">
                <li className="flex items-start gap-[6px]">
                  <span className="text-red-400 mt-[2px]">•</span>
                  <span>Fullscreen mode is <strong>mandatory</strong></span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <span className="text-red-400 mt-[2px]">•</span>
                  <span>No tab switching or exiting fullscreen</span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <span className="text-red-400 mt-[2px]">•</span>
                  <span><strong>5 violations</strong> = automatic disqualification</span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <span className="text-red-400 mt-[2px]">•</span>
                  <span>DevTools, right-click, copy/paste blocked</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Completion + Launch */}
          <Card className="p-[24px] border-brand-border">
            <div className="flex items-start gap-[10px]">
              <FiCheckCircle size={18} className="text-emerald-400 mt-[2px] shrink-0" />
              <div>
                <h3 className="text-[15px] font-bold mb-[4px]">Before You Begin</h3>
                <p className="text-[13px] text-brand-text-muted leading-[1.6]">
                  Every scenario presents multiple decision points. Read each question carefully, submit your answers before time runs out. Only submitted responses count toward your score. There is no going back once you proceed.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end pb-[24px]">
            <Button
              onClick={() => {
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(e => console.warn('Fullscreen denied:', e));
                }
                navigate(`/questions/${year}`);
              }}
              className="h-[48px] px-[32px] text-[14px] shadow-lg hover:shadow-brand-primary/20"
            >
              <span className="uppercase tracking-wider font-bold">Enter Round {year}</span>
              <FiChevronRight className="ml-[8px]" size={18} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
