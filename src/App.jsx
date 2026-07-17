// Import the React core library to enable component structures and JSX rendering.
import React from 'react';
// Import BrowserRouter from react-router-dom to manage and support HTML5 History routing context.
import { BrowserRouter } from 'react-router-dom';
// Import the main layout wrapper containing header, sidebar, footer and viewport frames.
import Layout from './components/common/Layout';
// Import AppRoutes which holds all our lazy loaded routes and Suspense configs.
import AppRoutes from './routes';
// Import the Toast notification system for temporary trigger messages.
import { Toaster } from 'react-hot-toast';

// Define the root App component as the default export.
export default function App() {
  return (
    // Wrap the application within BrowserRouter to activate React Router functionality.
    <BrowserRouter>
      {/* Configure the global notification toaster styling and behavior settings. */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg font-sans text-sm',
          duration: 3000,
        }}
      />
      {/* Wrap views in Layout to show navigation and header controls alongside the routed viewport. */}
      <Layout>
        {/* Render the core routing hierarchy with dynamic lazy-loading and suspense fallback. */}
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}
