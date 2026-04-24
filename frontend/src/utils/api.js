import axios from 'axios';
import { useGameStore } from './store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = useGameStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth API
export const authAPI = {
  register: (teamData) => apiClient.post('/auth/register', teamData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getTeam: (teamId) => apiClient.get(`/auth/team/${teamId}`)
};

// Questions API
export const questionsAPI = {
  getByYear: (year, role) => apiClient.get(`/questions/${year}/${role}`),
  getById: (questionId) => apiClient.get(`/questions/question/${questionId}`)
};

// Submissions API
export const submissionsAPI = {
  submit: (year, answers, timeSpent) => 
    apiClient.post(`/submissions/${year}`, { answers, timeSpent }),
  get: (teamId, year) => apiClient.get(`/submissions/${teamId}/${year}`)
};

// Leaderboard API
export const leaderboardAPI = {
  getAll: () => apiClient.get('/leaderboard'),
  getTeamPosition: (teamId) => apiClient.get(`/leaderboard/team/${teamId}`)
};

// Admin API
export const adminAPI = {
  getStatus: () => apiClient.get('/admin/status'),
  getAlerts: () => apiClient.get('/admin/alerts'),
  flagTeam: (teamId, reason) => apiClient.post(`/admin/teams/${teamId}/flag`, { reason }),
  getTeams: () => apiClient.get('/admin/teams')
};

export default apiClient;
