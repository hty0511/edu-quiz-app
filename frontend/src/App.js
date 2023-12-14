import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LessonFeedbackPage from "./pages/LessonFeedbackPage";
import FeedbackThankYouPage from "./pages/FeedbackThankYouPage";
import CppConditionPage from "./pages/CppConditionPage";
import "./styles.css";
import { Outlet, Navigate } from "react-router-dom";
import { DrawerProvider } from "./components/DrawerContext";

function ProtectedRoute() {
  if (!checkAuth()) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

function checkAuth() {
  const token = sessionStorage.getItem("jwt");
  return !!token;
}

export default function App() {
  return (
    <DrawerProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lesson-feedback" element={<ProtectedRoute />}>
              <Route index element={<LessonFeedbackPage />} />
              <Route path="thank-you" element={<FeedbackThankYouPage />} />
            </Route>
            <Route path="/cpp-quiz" element={<ProtectedRoute />}>
              <Route index element={<CppConditionPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </DrawerProvider>
  );
}
