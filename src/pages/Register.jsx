import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, User, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Register page component.
 * Allows new users to create account profiles.
 * Features strict validation error warnings and navigation buttons for duplicate emails.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @returns {React.JSX.Element} Rendered Register View.
 */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear all pending toast notifications when page mounts
  useEffect(() => {
    toast.dismiss();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email must be a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
      toast.success('Registration successful!');
      // Success redirection to dashboard home
      navigate('/');
    } catch (err) {
      if (!err.response) {
        toast.error('Cannot connect to the server. Please ensure the backend is running on port 5000.');
        return;
      }
      if (err.response.status === 503) {
        const msg = err.response.data?.message || 'Database connection is currently unavailable. Please try again later.';
        toast.error(msg);
        return;
      }
      const validationErrors = err.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        // Show validation messages from express-validator backend
        setError(validationErrors[0].message);
      } else {
        const msg = err.response?.data?.message || '';
        // Capture duplicate-email errors (such as 409 conflicts)
        if (msg.includes('exists') || msg.toLowerCase().includes('duplicate') || err.response?.status === 409) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(msg || 'Registration failed. Email may already be in use.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-xl font-bold text-txt-main">Get started</h2>
          <p className="text-xs text-txt-sub mt-1">Create an account to structure your pipeline.</p>
        </div>

        {/* Error warning badge */}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold leading-relaxed flex flex-col items-center gap-3">
            <span className="text-center">{error}</span>
            {/* If duplicate email error occurs, render the direct login redirection button */}
            {(error.includes('exists') || error.includes('already') || error.includes('in use')) && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-4 py-1.5 bg-danger text-white text-[11px] font-bold rounded-lg hover:bg-danger/90 transition-all cursor-pointer shadow-sm"
              >
                Go to Sign In
              </button>
            )}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name input field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-txt-sub uppercase tracking-wider block" htmlFor="name-input">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-sub">
                <User className="w-4.5 h-4.5" />
              </span>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anish Reddy"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-border-subtle rounded-xl text-sm placeholder-txt-sub focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-txt-main transition-all"
              />
            </div>
          </div>

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

          {/* Password input field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-txt-sub uppercase tracking-wider block" htmlFor="password-input">
              Password
            </label>
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

          {/* Confirm Password input field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-txt-sub uppercase tracking-wider block" htmlFor="confirm-password-input">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-sub">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation link back to login */}
        <div className="mt-6 text-center text-xs text-txt-sub">
          <span>Already have an account? </span>
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In instead
          </Link>
        </div>

      </div>

    </div>
  );
}
