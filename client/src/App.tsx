import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

import LandingPage        from "@/pages/LandingPage";
import LoginPage          from "@/pages/LoginPage";
import SignupPage         from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage  from "@/pages/ResetPasswordPage";
import CreatorPage        from "@/pages/CreatorPage";
import FanDashboardPage   from "@/pages/FanDashboardPage";
import DashboardPage      from "@/pages/dashboard/DashboardPage";
import BuilderPage        from "@/pages/dashboard/BuilderPage";
import AnalyticsPage      from "@/pages/dashboard/AnalyticsPage";
import MonetizePage       from "@/pages/dashboard/MonetizePage";
import SettingsPage       from "@/pages/dashboard/SettingsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg-elevated)",
              color:      "var(--text-primary)",
              border:     "1px solid var(--border-strong)",
              fontSize:   "14px",
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/"                element={<LandingPage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/signup"          element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
          <Route path="/:username"       element={<CreatorPage />} />

          {/* Fan dashboard — protected but no sidebar */}
          <Route path="/subscriptions" element={
            <ProtectedRoute><FanDashboardPage /></ProtectedRoute>
          } />

          {/* Creator dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/builder" element={
            <ProtectedRoute><AppLayout><BuilderPage /></AppLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/analytics" element={
            <ProtectedRoute><AppLayout><AnalyticsPage /></AppLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/monetize" element={
            <ProtectedRoute><AppLayout><MonetizePage /></AppLayout></ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}