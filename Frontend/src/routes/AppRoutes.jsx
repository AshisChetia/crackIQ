import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/Landing/LandingPage';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import ExamSetup from '../pages/Exam/ExamSetup';
import ExamPage from '../pages/Exam/ExamPage';
import ResultPage from '../pages/Exam/ResultPage';
import HistoryPage from '../pages/History/HistoryPage';
import ResumePage from '../pages/Resume/ResumePage';
import AboutPage from '../pages/About/AboutPage';
import NotFound from '../pages/NotFound/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Authenticated (protection to be added later) */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/exam/setup" element={<ExamSetup />} />
      <Route path="/exam/active" element={<ExamPage />} />
      <Route path="/exam/results" element={<ResultPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/resume" element={<ResumePage />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
