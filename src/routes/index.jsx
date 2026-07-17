// Import React, lazy loading API, and Suspense capability for deferred UI rendering.
import React, { lazy, Suspense } from 'react';
// Import routing components
import { Routes, Route } from 'react-router-dom';

// Dynamically import (Lazy Load) page components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
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
 * AppRoutes orchestrates application paths, mapping components to routes.
 *
 * @returns {React.JSX.Element} Configured routes switcher.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
