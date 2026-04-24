import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useGameStore } from '../utils/store';

const TrainingPage = () => {
  const navigate = useNavigate();
  const { role } = useGameStore();

  const roleGuides = {
    cto: {
      title: '☁️ Cloud Architect (CTO)',
      description: 'Your job is to choose the right AWS services and optimize infrastructure decisions.',
      focus: [
        'Instance sizing (right-sizing)',
        'Database optimization',
        'Auto-scaling strategies',
        'Cost-aware architecture'
      ],
      key: 'Remember: Bigger is not always better. Optimize based on actual usage patterns.'
    },
    cfo: {
      title: '💰 Financial Analyst (CFO)',
      description: 'Your job is to keep costs down while growing revenue and understanding financial health.',
      focus: [
        'Cost calculations',
        'Break-even analysis',
        'Budget management',
        'Financial forecasting'
      ],
      key: 'Remember: Profitability comes from managing the gap between revenue and costs.'
    },
    pm: {
      title: '📈 Growth Lead (PM)',
      description: 'Your job is to grow users while maintaining quality and considering business impact.',
      focus: [
        'Revenue growth strategies',
        'Product decisions',
        'User experience impact',
        'Market positioning'
      ],
      key: 'Remember: Speed and cost optimization matter, but not at the expense of user satisfaction.'
    }
  };

  const guide = roleGuides[role] || roleGuides.cto;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Pre-Event Training" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="font-bold mb-2">What is AWS?</h3>
            <p className="text-sm text-gray-600">Amazon Web Services — cloud infrastructure for hosting applications, data, and services.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="font-bold mb-2">Why This Game?</h3>
            <p className="text-sm text-gray-600">Learn real AWS decision-making through competitive gameplay and financial consequences.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold mb-2">Your Goal</h3>
            <p className="text-sm text-gray-600">Build the most profitable startup by making smart AWS and business decisions.</p>
          </div>
        </div>

        {/* Your Role */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{guide.title}</h2>
          <p className="text-gray-700 mb-6">{guide.description}</p>

          <h3 className="text-lg font-bold mb-4">Your Key Responsibilities:</h3>
          <ul className="space-y-3 mb-6">
            {guide.focus.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">✓</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
            <p className="font-semibold text-blue-900">💡 Key Tip: {guide.key}</p>
          </div>
        </div>

        {/* AWS Glossary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">AWS Services Glossary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-lg mb-2">EC2 - Elastic Compute Cloud</h3>
              <p className="text-gray-700 text-sm">Virtual servers in the cloud. Like renting computers. You pay for instance size and uptime.</p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-bold text-lg mb-2">RDS - Relational Database Service</h3>
              <p className="text-gray-700 text-sm">Managed databases (SQL). Like having a database admin. More expensive than self-managed.</p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-lg mb-2">S3 - Simple Storage Service</h3>
              <p className="text-gray-700 text-sm">File storage (backups, logs, assets). Cheap storage but data transfer costs add up.</p>
            </div>

            <div className="border-l-4 border-yellow-600 pl-4">
              <h3 className="font-bold text-lg mb-2">Auto-Scaling</h3>
              <p className="text-gray-700 text-sm">Automatically add/remove servers based on traffic. Save money during low traffic, handle spikes.</p>
            </div>

            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="font-bold text-lg mb-2">Multi-AZ</h3>
              <p className="text-gray-700 text-sm">Redundancy across availability zones. Higher cost but protects against failures.</p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-4">
              <h3 className="font-bold text-lg mb-2">Reserved Instances</h3>
              <p className="text-gray-700 text-sm">Commit to usage for 1-3 years. Cheaper than On-Demand but less flexible.</p>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Game Rules</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">📅 The 3 Years</h3>
              <p className="text-gray-700 text-sm">
                <strong>Year 1:</strong> Cost Crisis — your startup is bleeding money. Cut costs without breaking the product.<br />
                <strong>Year 2:</strong> Growth Phase — steady growth. Scale infrastructure wisely.<br />
                <strong>Year 3:</strong> Scaling Challenge — viral moment! Your decisions are locked in. Handle the surge.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">⏱️ Time Limit</h3>
              <p className="text-gray-700 text-sm">8 minutes per round. Full-screen lockdown. You can't switch tabs or use copy-paste.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">👥 Team Submission</h3>
              <p className="text-gray-700 text-sm">You can't see each other's answers before submitting. CTO, CFO, and PM each answer their own questions. Decisions cascade to next year.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">🏆 Scoring</h3>
              <p className="text-gray-700 text-sm">Leaderboard is ranked by final cumulative profit. Market events can boost or penalize based on preparedness.</p>
            </div>
          </div>
        </div>

        {/* Practice Question */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Practice Question</h2>
          <p className="text-gray-700 mb-4">
            You notice a database that hasn't had any queries in 6 months. Your monthly AWS bill is $18,000, and you need to cut costs.
          </p>
          <p className="text-gray-700 font-semibold mb-4">What's the best action?</p>
          <div className="space-y-3">
            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
              <input type="radio" name="practice" className="w-4 h-4" />
              <span className="ml-3">A) Delete it immediately, save money</span>
            </label>
            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
              <input type="radio" name="practice" className="w-4 h-4" />
              <span className="ml-3">B) Snapshot it first as backup, then delete it ✓ CORRECT</span>
            </label>
            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
              <input type="radio" name="practice" className="w-4 h-4" />
              <span className="ml-3">C) Leave it running, too risky</span>
            </label>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            💡 <strong>Lesson:</strong> Always backup before deleting. You might need it someday. Professional practice beats recklessness.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={() => navigate('/questions/1')}
          className="w-full bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-lg"
        >
          🎮 Start Year 1
        </button>
      </main>
    </div>
  );
};

export default TrainingPage;
