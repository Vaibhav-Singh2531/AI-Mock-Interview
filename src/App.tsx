import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Auth
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import RootLayout from '@/layouts/RootLayout';

// Pages
import DashboardPage from '@/pages/DashboardPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import InterviewGeneratePage from '@/pages/InterviewGeneratePage';
import InterviewPage from '@/pages/InterviewPage';
import FeedbackPage from '@/pages/FeedbackPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes — no nav bar */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Route>

          {/* Protected routes — with nav bar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RootLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/interview" element={<InterviewGeneratePage />} />
              <Route path="/interview/:id" element={<InterviewPage />} />
              <Route path="/interview/:id/feedback" element={<FeedbackPage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
