import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Card from '../components/Card';
import Header from '../components/Header';
import { authAPI } from '../utils/api';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiCloud, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teamName: '',
    teamLead: { name: '', email: '', phone: '' },
    members: [
      { name: '', role: 'cto', password: '' },
      { name: '', role: 'cfo', password: '' },
      { name: '', role: 'pm', password: '' }
    ],
    college: '',
    department: 'Engineering'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamLeadChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      teamLead: { ...prev.teamLead, [name]: value }
    }));
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors({});
    setSuccess('');

    try {
      const response = await authAPI.register(formData);
      const teamId = response.data.teamId;
      setSuccess(`Registration successful! TEAM ID: ${teamId}. Share this with the team members for login.`);
      
      // Auto redirect after a longer delay so they can read the ID
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.details) {
        const errorMap = {};
        errorData.details.forEach(item => {
          errorMap[item.role] = item.errors;
        });
        setErrors(errorMap);
        setError('Please check the highlighted fields below.');
      } else {
        setError(errorData?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { role: 'cto', title: 'CTO - Infrastructure', icon: <FiCloud size={20} /> },
    { role: 'cfo', title: 'CFO - Finances', icon: <FiDollarSign size={20} /> },
    { role: 'pm', title: 'PM - Product', icon: <FiTrendingUp size={20} /> }
  ];

  const inputClasses = "w-full bg-brand-bg border border-brand-border rounded-xl px-14 py-12 text-14 text-brand-text-primary focus:border-brand-primary focus:shadow-glow focus:outline-none transition-all placeholder:text-brand-text-muted";

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans selection:bg-brand-primary/30 text-brand-text-secondary">
      <Header showLeaderboard={false} showBackButton={true} />

      <main className="max-w-3xl mx-auto px-24 py-64 w-full flex-1">
        
        <div className="mb-48">
            <h1 className="text-32 font-bold text-brand-text-primary tracking-tight mb-8">Deploy Your Unit</h1>
            <p className="text-16 text-brand-text-muted">Complete the form below to authorize your team for the AWS Tycoon simulation.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-32">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-16 rounded-xl flex items-center gap-12 text-14">
                    <FiAlertCircle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-16 rounded-xl flex items-center gap-12 text-14">
                    <FiCheckCircle size={18} className="flex-shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {/* Section: General Info */}
            <Card className="flex flex-col gap-24">
                <div>
                    <h2 className="text-20 font-semibold text-brand-text-primary mb-4">Team Details</h2>
                    <p className="text-14 text-brand-text-muted">Basic information about your deployment unit.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="flex flex-col gap-8">
                        <label className="text-14 font-medium text-brand-text-secondary">Team Name</label>
                        <input
                            type="text"
                            name="teamName"
                            placeholder="e.g. Titan Force"
                            value={formData.teamName}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-8">
                        <label className="text-14 font-medium text-brand-text-secondary">Organization / College</label>
                        <input
                            type="text"
                            name="college"
                            placeholder="e.g. MIT"
                            value={formData.college}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                </div>
            </Card>

            {/* Section: Personnel */}
            <div className="flex flex-col gap-16">
                <div>
                    <h2 className="text-20 font-semibold text-brand-text-primary mb-4">Personnel Configurations</h2>
                    <p className="text-14 text-brand-text-muted">Assign operators and credentials to your core roles.</p>
                </div>

                <div className="space-y-16">
                    {formData.members.map((member, idx) => (
                        <Card key={idx} className="flex flex-col gap-16 p-24">
                            <div className="flex items-center gap-12 border-b border-brand-border pb-16">
                                <div className="text-brand-primary">
                                    {roles[idx].icon}
                                </div>
                                <h3 className="text-16 font-semibold text-brand-text-primary">{roles[idx].title}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="flex flex-col gap-8">
                                    <label className="text-14 font-medium text-brand-text-secondary">Operator Name</label>
                                    <input
                                        type="text"
                                        placeholder={`Name of ${roles[idx].role.toUpperCase()}`}
                                        value={member.name}
                                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                        className={inputClasses}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-8">
                                    <label className="text-14 font-medium text-brand-text-secondary">Access Key</label>
                                    <PasswordInput
                                        value={member.password}
                                        onChange={(e) => handleMemberChange(idx, 'password', e.target.value)}
                                        placeholder="••••••••"
                                        showStrength={false}
                                        required={true}
                                        name={`password-${member.role}`}
                                    />
                                </div>
                            </div>
                            {errors[member.role] && (
                                <div className="p-12 bg-red-500/10 rounded-xl border border-red-500/20 text-12 text-red-500">
                                    {errors[member.role].join(', ')}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            {/* Section: Contact */}
            <Card className="flex flex-col gap-24">
                <div>
                    <h2 className="text-20 font-semibold text-brand-text-primary mb-4">Primary Contact</h2>
                    <p className="text-14 text-brand-text-muted">The liaison for emergency communications and reporting.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="flex flex-col gap-8">
                        <label className="text-14 font-medium text-brand-text-secondary">Team Lead Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.teamLead.name}
                            onChange={handleTeamLeadChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-8">
                        <label className="text-14 font-medium text-brand-text-secondary">Team Lead Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.teamLead.email}
                            onChange={handleTeamLeadChange}
                            className={inputClasses}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-8">
                        <label className="text-14 font-medium text-brand-text-secondary">Team Lead Phone</label>
                        <div className="flex bg-brand-bg border border-brand-border rounded-xl focus-within:border-brand-primary focus-within:shadow-glow transition-all">
                            <span className="flex items-center pl-14 text-brand-text-secondary text-14 border-r border-brand-border pr-12">
                                +91
                            </span>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="00000 00000"
                                value={formData.teamLead.phone}
                                onChange={handleTeamLeadChange}
                                className="flex-1 bg-transparent px-14 py-12 text-14 text-brand-text-primary focus:outline-none placeholder:text-brand-text-muted"
                                required
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="mt-16 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="px-0"
                >
                    Already deployed? Log in
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="px-32"
                >
                    {loading ? <FiLoader className="animate-spin" size={18} /> : 'Complete Sign Up'}
                </Button>
            </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;
