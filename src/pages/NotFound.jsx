import React from 'react';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * NotFound renders a warning layout for unregistered pathways.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 *
 * @returns {React.JSX.Element} Rendered NotFound page component.
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-bg-base, border-border-subtle and text-txt-main
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-bg-base p-6 transition-colors duration-200">
      
      {/* Absolute background blur gradient circle */}
      <div className="absolute w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main glassmorphic container card */}
      <div className="w-full max-w-md text-center bg-surface-card border border-border-subtle rounded-2xl shadow-xl p-8 backdrop-blur-md transition-colors duration-200">
        
        {/* Animated Warning Icon Bubble */}
        <div className="mx-auto w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center text-danger mb-6 animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* 404 Heading */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-450 dark:to-indigo-400 tracking-tight leading-none mb-4">
          404
        </h1>

        {/* Status descriptions */}
        <h2 className="text-xl font-bold text-txt-main mb-3">
          Page Not Found
        </h2>

        <p className="text-sm text-txt-sub mb-8 leading-relaxed max-w-xs mx-auto">
          The pipeline path you are looking for does not exist or has been shifted.
        </p>

        {/* Row actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl text-txt-main bg-bg-base hover:bg-bg-base/80 border border-border-subtle hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer focus:outline-none"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl text-white bg-primary hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer focus:outline-none"
            aria-label="Go to Dashboard home page"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>

      </div>

      <span className="text-[10px] text-txt-sub font-mono tracking-widest uppercase mt-6">
        CRM Lite Startup Edition
      </span>
    </div>
  );
}
