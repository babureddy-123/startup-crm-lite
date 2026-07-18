import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { LeadProvider } from './context/LeadContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './style.css';

// Initialize and mount the React application on the DOM element with the ID 'app'.
const root = ReactDOM.createRoot(document.getElementById('app'));

const isProdMissingApi = import.meta.env.PROD && !import.meta.env.VITE_API_URL;

if (isProdMissingApi) {
  root.render(
    <React.StrictMode>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: '#1e293b',
          padding: '2.5rem',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '500px',
          border: '1px solid #334155'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 'bold' }}>Configuration Error</h1>
          <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            The production build is missing the required backend URL environment variable.
          </p>
          <code style={{
            display: 'block',
            backgroundColor: '#0f172a',
            color: '#38bdf8',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            textAlign: 'left',
            overflowX: 'auto',
            border: '1px solid #1e293b'
          }}>
            VITE_API_URL is undefined
          </code>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  root.render(
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
    </React.StrictMode>
  );
}
