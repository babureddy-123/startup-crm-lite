// Import the React core library for element creation and React ecosystem features.
import React from 'react';
// Import the ReactDOM client engine to mount and render the React application tree to the browser DOM.
import ReactDOM from 'react-dom/client';
// Import the root App component that wraps layouts and routing boundaries.
import App from './App.jsx';
// Import the LeadProvider component to orchestrate the application leads state context at the root.
import { LeadProvider } from './context/LeadContext';
// Import the ThemeProvider component to orchestrate application light/dark theme context.
import { ThemeProvider } from './context/ThemeContext';
// Import global styling settings, including Tailwind CSS setups and standard theme configurations.
import './style.css';

// Initialize and mount the React application on the DOM element with the ID 'app'.
ReactDOM.createRoot(document.getElementById('app')).render(
  // Wrap the mounting process in React.StrictMode to inspect the application code and warn of deprecations or issues.
  <React.StrictMode>
    {/* Mount LeadProvider as the outermost provider context wrapper */}
    <LeadProvider>
      {/* Mount ThemeProvider inside LeadProvider to enable theme logic across nested states */}
      <ThemeProvider>
        {/* Render the core App component */}
        <App />
      </ThemeProvider>
    </LeadProvider>
  </React.StrictMode>,
);
