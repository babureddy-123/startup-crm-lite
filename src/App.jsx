// Import the React core library.
import React from 'react';
// Import BrowserRouter from react-router-dom to manage page routes.
import { BrowserRouter } from 'react-router-dom';
// Import AppRoutes which holds all our lazy loaded routes and guards.
import AppRoutes from './routes';
// Import the Toast notification system for temporary messages.
import { Toaster } from 'react-hot-toast';

/**
 * Root App component rendering the routers and global toast triggers.
 *
 * @returns {React.JSX.Element} App viewport layout.
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications styling mapping */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg font-sans text-sm',
          duration: 3000,
        }}
      />
      {/* AppRoutes handles Layout wrapping for protected elements dynamically */}
      <AppRoutes />
    </BrowserRouter>
  );
}
