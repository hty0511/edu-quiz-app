import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LessonFeedbackPage from './pages/LessonFeedbackPage';
import FeedbackThankYouPage from './pages/FeedbackThankYouPage';
import CppConditionPage from './pages/CppConditionPage';
import DashboardPage from './pages/DashboardPage';
import DashboardDetailPage from './pages/DashboardDetailPage';
import DashBoardAllPage from './pages/DashboardAllPage';
import WeekSelectPage from './pages/WeekSelectPage';
import HistoryNotFoundPage from './pages/HistoryNotFoundPage';
import SectionSelectPage from './pages/SectionSelectPage';
import QuestionSelectPage from './pages/QuestionSelectPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import SystemControlPage from './pages/SystemControlPage';
import './styles.css';
import { Outlet, Navigate } from 'react-router-dom';
import { DrawerProvider } from './components/DrawerContext';

function ProtectedRoute() {
  if (!checkAuth()) {
    return <Navigate to='/login' />;
  }
  return <Outlet />;
}

function checkAuth() {
  const token = sessionStorage.getItem('jwt');
  return !!token;
}

export default function App() {
  return (
    <DrawerProvider>
      <Router>
        <div className='App'>
          <Routes>
            <Route path='/' element={<ProtectedRoute />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/lesson-feedback' element={<ProtectedRoute />}>
              <Route index element={<LessonFeedbackPage />} />
              <Route path='thank-you' element={<FeedbackThankYouPage />} />
            </Route>
            <Route path='/cpp-quiz' element={<ProtectedRoute />}>
              <Route index element={<CppConditionPage />} />
              <Route path='history' element={<WeekSelectPage />} />
              <Route
                path='history/not-found'
                element={<HistoryNotFoundPage />}
              />
              <Route
                path='history/week/:weekId'
                element={<SectionSelectPage />}
              />
              <Route
                path='history/week/:weekId/section/:sectionId'
                element={<QuestionSelectPage />}
              />
              <Route
                path='history/week/:weekId/section/:sectionId/question/:questionId'
                element={<QuestionDetailPage />}
              />
            </Route>
            <Route path='/dashboard' element={<ProtectedRoute />}>
              <Route index element={<DashboardPage />} />
              <Route
                path='/dashboard/week/:weekId'
                element={<DashboardDetailPage />}
              />
              <Route path='/dashboard/all' element={<DashBoardAllPage />} />
            </Route>
            <Route path='/system-control' element={<ProtectedRoute />}>
              <Route index element={<SystemControlPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </DrawerProvider>
  );
}
