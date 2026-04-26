import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../utils/store';
import { adminAPI } from '../utils/api';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { FiClock, FiShield, FiAlertTriangle, FiCheckCircle, FiChevronRight } from 'react-icons/fi';

export default function InstructionsPage() {
  const { year } = useParams();
  const navigate = useNavigate();
  const { role, teamId } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const settingsRes = await adminAPI.getSettings();
        const settings = settingsRes.data;
        if (settings.isRoundActive && settings.currentRound === parseInt(year)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          // Immediately send them back if round was stopped or changed
          navigate('/profile');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    // Also periodically check so we can boot them if the admin hits "Stop Round" while they are reading instructions
    const intervalId = setInterval(checkAuth, 3000);
    return () => clearInterval(intervalId);
  }, [year, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans">
        <div className="animate-pulse text-brand-primary">Authenticating Protocol...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans p-24">
        <Card className="max-w-md w-full p-48 text-center border-red-500/20">
          <FiAlertTriangle size={48} className="mx-auto text-red-500 mb-24" />
          <h2 className="text-24 font-bold text-brand-text-primary mb-16">Access Denied</h2>
          <p className="text-brand-text-muted mb-32">This strategic window is not currently active.</p>
          <Button onClick={() => navigate('/profile')} className="w-full">Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  const roleNames = {
    cto: 'Chief Technology Officer',
    cfo: 'Chief Financial Officer',
    pm: 'Product Manager'
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-text-primary">
      <Header title="Mission Briefing" />
      <main className="flex-1 flex items-center justify-center p-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <Card className="max-w-3xl w-full p-48 z-10 relative bg-brand-surface/80 backdrop-blur-xl border-brand-primary/20">
          <div className="flex items-center space-x-16 mb-32">
            <div className="w-16 h-48 bg-brand-primary rounded-full"></div>
            <div>
              <h1 className="text-32 font-bold tracking-tight">Round {year} Initiation</h1>
              <p className="text-14 text-brand-primary font-medium uppercase tracking-widest mt-4">
                Role Authorized: {roleNames[role?.toLowerCase()] || role}
              </p>
            </div>
          </div>

          {/* Dummy text description as requested */}
          <div className="mb-32 text-brand-text-muted leading-relaxed p-16 bg-brand-bg rounded-lg border border-brand-border">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>

          <div className="space-y-32">
            <div className="bg-brand-bg p-24 rounded-card border border-brand-border">
              <h3 className="text-18 font-semibold flex items-center mb-16">
                <FiClock className="mr-12 text-brand-primary" /> Time Protocol
              </h3>
              <p className="text-brand-text-muted leading-relaxed">
                You have exactly <span className="font-bold text-brand-text-primary">20 minutes</span> to complete this mission phase. The simulation will auto-terminate and commit your current data if time expires.
              </p>
            </div>

            <div className="bg-red-500/5 p-24 rounded-card border border-red-500/20">
              <h3 className="text-18 font-semibold flex items-center mb-16 text-red-400">
                <FiShield className="mr-12" /> Security & Integrity Guidelines
              </h3>
              <ul className="space-y-12 text-brand-text-muted">
                <li className="flex items-start">
                  <span className="text-red-400 mr-12 mt-4">•</span>
                  <span>The session will enter <strong>Strict Lockdown Mode</strong> requiring Fullscreen.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-12 mt-4">•</span>
                  <span><strong>Do not switch tabs</strong> or exit fullscreen. Doing so will flag a security violation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-12 mt-4">•</span>
                  <span>Exceeding <strong>3 violations</strong> will instantly disqualify you for this round (0 points).</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-12 mt-4">•</span>
                  <span>Developer tools, right-click, and copy/paste are strictly prohibited.</span>
                </li>
              </ul>
            </div>

            <div className="bg-brand-bg p-24 rounded-card border border-brand-border">
              <h3 className="text-18 font-semibold flex items-center mb-16">
                <FiCheckCircle className="mr-12 text-emerald-400" /> Completion Conditions
              </h3>
              <p className="text-brand-text-muted leading-relaxed">
                Every scenario demands a tactical decision. Ensure all responses are plotted before initiating the final commlink. Only your submitted answers will be visible post-mission.
              </p>
            </div>
          </div>

          <div className="mt-32 flex justify-end">
            <Button 
              onClick={() => {
                // Request fullscreen on user gesture to ensure LockdownMode works
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(e => console.warn('Fullscreen denied:', e));
                }
                navigate(`/questions/${year}`);
              }} 
              className="h-44 px-32 text-14 shadow-lg hover:shadow-brand-primary/20"
            >
              <span className="uppercase tracking-wider font-bold">Start Quiz</span>
              <FiChevronRight className="ml-8" size={18} />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
