import './styles/globals.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGameStore } from './utils/store';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import TrainingPage from './pages/TrainingPage';
import QuestionPage from './pages/QuestionPage';
import InstructionsPage from './pages/InstructionsPage';
import AnswersPage from './pages/AnswersPage';
import YearEndReportPage from './pages/YearEndReportPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ResultsPage from './pages/ResultsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isLoggedIn } = useGameStore();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/training"
          element={<ProtectedRoute><TrainingPage /></ProtectedRoute>}
        />
        <Route
          path="/instructions/:year"
          element={<ProtectedRoute><InstructionsPage /></ProtectedRoute>}
        />
        <Route
          path="/questions/:year"
          element={<ProtectedRoute><QuestionPage /></ProtectedRoute>}
        />
        <Route
          path="/answers/:year"
          element={<ProtectedRoute><AnswersPage /></ProtectedRoute>}
        />
        <Route
          path="/year-end-report/:year"
          element={<ProtectedRoute><YearEndReportPage /></ProtectedRoute>}
        />
        <Route
          path="/leaderboard"
          element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>}
        />
        <Route
          path="/results"
          element={<ProtectedRoute><ResultsPage /></ProtectedRoute>}
        />

        {/* Admin routes */}
        <Route
          path="/admin/:tab?"
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
        />

        {/* Catch-all */}
        <Route path="*" element={<div className="text-center p-8">Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
