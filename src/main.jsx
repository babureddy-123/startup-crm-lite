import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { LeadProvider } from './context/LeadContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './style.css';

// Initialize and mount the React application on the DOM element with the ID 'app'.
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    {/* ThemeProvider mounted at root */}
    <ThemeProvider>
      {/* AuthProvider mounted above LeadProvider so authentication states can be resolved for lead service API calls */}
      <AuthProvider>
        <LeadProvider>
          <App />
        </LeadProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
