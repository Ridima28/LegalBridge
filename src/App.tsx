import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AIChatAssistant from './components/chat/AIChatAssistant';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import NewCasePage from './pages/NewCasePage';
import CaseAnalysisPage from './pages/CaseAnalysisPage';
import LawyersListPage from './pages/LawyersListPage';
import LawyerProfilePage from './pages/LawyerProfilePage';
import LawyerRegistrationPage from './pages/LawyerRegistrationPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-950">
                  <Navbar />
                  <LandingPage />
                  <Footer />
                </div>
              }
            />

            {/* Lawyers listing */}
            <Route
              path="/lawyers"
              element={
                <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-950">
                  <Navbar />
                  <LawyersListPage />
                  <Footer />
                </div>
              }
            />

            <Route
              path="/lawyer/register"
              element={
                <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-950">
                  <Navbar />
                  <LawyerRegistrationPage />
                  <Footer />
                </div>
              }
            />

            <Route
              path="/lawyer/:lawyerId"
              element={
                <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-950">
                  <Navbar />
                  <LawyerProfilePage />
                  <Footer />
                </div>
              }
            />

            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="cases" element={<DashboardPage />} />
              <Route path="consultations" element={<DashboardPage />} />
              <Route path="saved" element={<DashboardPage />} />
              <Route path="notifications" element={<DashboardPage />} />
            </Route>

            {/* Case routes */}
            <Route
              path="/case/new"
              element={
                <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-950">
                  <Navbar />
                  <NewCasePage />
                </div>
              }
            />

            <Route
              path="/case/:caseId/analysis"
              element={
                <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-950">
                  <Navbar />
                  <CaseAnalysisPage />
                </div>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">404</h1>
                    <p className="text-secondary-500 dark:text-secondary-400 mb-6">Page not found</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                </div>
              }
            />
          </Routes>
          <AIChatAssistant />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
