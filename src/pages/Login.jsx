import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Login page component.
 * Allows users to authenticate and access the CRM Workspace console.
 * Integrates "Forgot Password" toast alerts and validation message formatting.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @returns {React.JSX.Element} Rendered Login View.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear all pending toast notifications when page mounts
  useEffect(() => {
    toast.dismiss();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation checks
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      // Success redirection to dashboard home
      navigate('/');
    } catch (err) {
      if (!err.response) {
        toast.error('Cannot connect to the server. Please check your internet connection or try again later.');
        return;
      }
      if (err.response.status === 503) {
        const msg = err.response.data?.message || 'Database connection is currently unavailable. Please try again later.';
        toast.error(msg);
        return;
      }
      const validationErrors = err.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        // Show express-validator field error messages from backend
        setError(validationErrors[0].message);
      } else {
        const msg = err.response?.data?.message;
        setError(msg || `Server error (${err.response?.status || 'unknown'}). Please try again later.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Helper function displaying temporary notice alert for password recovery.
   */
  const handleForgotPassword = () => {
    toast.error('Password reset will be available soon.');
  };

  return (
    // Centered full screen layout matching SaaS themes
    <div className="min-h-screen w-screen flex items-center justify-center bg-bg-base text-txt-main px-4 transition-colors duration-200">
      
      <div className="w-full max-w-md bg-surface-card border border-border-subtle p-8 rounded-2xl shadow-xl transition-all duration-200">
        
        {/* Branding header logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-3 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-txt-main">Welcome back</h2>
          <p className="text-xs text-txt-sub mt-1">Sign in to manage your startup leads pipeline.</p>
        </div>

        {/* Error warning badge */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-danger/10 border border-danger/25 text-danger text-xs font-semibold text-center leading-relaxed">
            {error}
          </div>
        )}

        {/* Log In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-txt-sub uppercase tracking-wider block" htmlFor="email-input">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-sub">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anish@startup.com"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-border-subtle rounded-xl text-sm placeholder-txt-sub focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-txt-main transition-all"
              />
            </div>
          </div>

          {/* Password input field with "Forgot Password" link header */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-txt-sub uppercase tracking-wider block" htmlFor="password-input">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer focus:outline-none bg-transparent border-0"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-sub">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-border-subtle rounded-xl text-sm placeholder-txt-sub focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-txt-main transition-all"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation link to registration */}
        <div className="mt-6 text-center text-xs text-txt-sub">
          <span>New to CRM Lite? </span>
          <Link to="/register" className="text-primary font-bold hover:underline">
            Create an Account
          </Link>
        </div>

      </div>

    </div>
  );
}
