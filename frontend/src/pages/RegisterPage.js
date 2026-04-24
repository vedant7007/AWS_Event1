import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PasswordInput from '../components/PasswordInput';
import { authAPI } from '../utils/api';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [teamIdCopied, setTeamIdCopied] = useState(false);

  const validatePasswordField = (password) => {
    const requirements = [];
    if (password.length < 8) requirements.push('Min 8 characters');
    if (!/[A-Z]/.test(password)) requirements.push('1 Uppercase');
    if (!/[a-z]/.test(password)) requirements.push('1 Lowercase');
    if (!/[0-9]/.test(password)) requirements.push('1 Number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) requirements.push('1 Special char');
    return requirements;
  };

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
      setSuccess(`✓ Team registered! Team ID: ${response.data.teamId}`);
      
      // Show copy button for Team ID
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.details) {
        // Multiple password validation errors
        const errorMap = {};
        errorData.details.forEach(item => {
          errorMap[item.role] = item.errors;
        });
        setErrors(errorMap);
        setError('❌ Password requirements not met for some members. See details below.');
      } else {
        setError(errorData?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'cto': return '☁️';
      case 'cfo': return '💰';
      case 'pm': return '📈';
      default: return '👤';
    }
  };

  const getRoleTitle = (role) => {
    switch(role) {
      case 'cto': return 'Cloud Architect (CTO)';
      case 'cfo': return 'Financial Analyst (CFO)';
      case 'pm': return 'Growth Lead (PM)';
      default: return role.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="Team Registration" showLeaderboard={false} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2">
            <FiAlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2">
            <FiCheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Team Info */}
          <div className="mb-8 pb-8 border-b-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <span>🏢</span>
              <span>Team Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team Name *</label>
                <input
                  type="text"
                  name="teamName"
                  placeholder="e.g., TechStars"
                  value={formData.teamName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">College</label>
                <input
                  type="text"
                  name="college"
                  placeholder="e.g., VIT Jaipur"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                />
              </div>
            </div>
          </div>

          {/* Team Lead Info */}
          <div className="mb-8 pb-8 border-b-2">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <span>👤</span>
              <span>Team Lead</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.teamLead.name}
                  onChange={handleTeamLeadChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@college.ac.in"
                  value={formData.teamLead.email}
                  onChange={handleTeamLeadChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.teamLead.phone}
                  onChange={handleTeamLeadChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <span>👥</span>
              <span>Team Members (3 Required)</span>
            </h3>
            {formData.members.map((member, idx) => (
              <div key={idx} className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                <label className="block font-bold mb-4 text-lg text-gray-800 flex items-center space-x-2">
                  <span>{getRoleIcon(member.role)}</span>
                  <span>{getRoleTitle(member.role)}</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Member Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Member Name *</label>
                    <input
                      type="text"
                      placeholder="First and Last Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">💡 Name matching is case-insensitive</p>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                    <PasswordInput
                      value={member.password}
                      onChange={(e) => handleMemberChange(idx, 'password', e.target.value)}
                      placeholder="Enter secure password"
                      showStrength={true}
                      required={true}
                      name={`password-${member.role}`}
                    />
                    {errors[member.role] && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
                        <p className="font-semibold mb-1">⚠️ Password not valid:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {errors[member.role].map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Registering...' : '✓ Register Team'}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have a team? <a href="/login" className="text-blue-600 font-bold hover:underline">Login here</a>
          </p>
        </form>
      </main>
    </div>
  );
};


export default RegisterPage;
