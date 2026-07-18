import React, { lazy, Suspense } from 'react';
// Import routing hooks
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';

// Dynamically import (Lazy Load) page components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * LoadingSpinner renders a high-fidelity loading state.
 * Uses dynamic variables/theme tokens (`bg-bg-base`, `text-txt-sub`, etc.) for themes.
 *
 * @returns {React.JSX.Element} Rendered spinner placeholder.
 */
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full bg-bg-base/20 transition-colors duration-200">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
      <span className="mt-4 text-xs font-mono font-medium text-txt-sub tracking-wider uppercase animate-pulse">
        Syncing Workspace...
      </span>
    </div>
  );
}

/**
 * ProtectedRoute component acts as a route guard.
 * Redirects visitors without token credentials to `/login`.
 * Wraps authorized visits inside the admin Layout template.
 *
 * @returns {React.JSX.Element} Guard layout wrapper.
 */
function ProtectedRoute() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if user lacks JWT token credentials
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render Layout and matched child routes
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

/**
 * UnprotectedRoute component acts as an inverse route guard.
 * Redirects visitors with active JWT token credentials to `/dashboard`.
 *
 * @returns {React.JSX.Element} Guard layout wrapper.
 */
function UnprotectedRoute() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if user has token credentials
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

/**
 * AppRoutes orchestrates application paths, mapping components to routes.
 * Separates public routes (Login, Register) from protected ones.
 *
 * @returns {React.JSX.Element} Configured routes switcher.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public authentication paths */}
        <Route element={<UnprotectedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected workspace paths */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
