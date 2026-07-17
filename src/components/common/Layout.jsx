import React, { useState } from 'react';
// Import useLocation, NavLink, and Link to manage active links across top, bottom, and sidebar menus
import { useLocation, NavLink, Link } from 'react-router-dom';
// Import layout indicators and Lucide React icons
import { 
  Menu, 
  X, 
  Search, 
  Bell,
  Sparkles,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
// Import the Sidebar component to render sidebar items
import Sidebar from './Sidebar';
// Import the animated DarkModeToggle component
import DarkModeToggle from './DarkModeToggle';

/**
 * Layout component holds sidebar navigation, top header, and mobile bottom navigation.
 * Implements a true full-screen admin console structure:
 * - Left vertical sidebar stays fixed.
 * - Header is fixed at the top of the content area.
 * - Right content container scrollable independently.
 *
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - Router child views.
 * @returns {React.JSX.Element} Rendered Layout structure.
 */
export default function Layout({ children }) {
  // Access location routing updates to render page titles
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Helper mapping route paths to user-friendly title strings.
   * @returns {string} The active view's name.
   */
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Workspace Overview';
      case '/leads': return 'Leads Pipeline';
      case '/analytics': return 'CRM Intelligence';
      case '/settings': return 'Workspace Settings';
      default: return 'CRM Lite';
    }
  };

  return (
    // Replaced min-h-screen flex flex-col md:flex-row with h-screen w-screen overflow-hidden flex
    <div className="h-screen w-screen overflow-hidden flex bg-bg-base text-txt-main transition-colors duration-200">
      
      {/* 1. Responsive Left Sidebar: w-20 on tablet, w-64 (about 250px) on desktop */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-border-subtle bg-surface-card h-full z-20 shrink-0 transition-all duration-200">
        
        {/* Logo and Brand Header */}
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-border-subtle gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/10 shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {/* Brand text */}
          <div className="hidden lg:block">
            <span className="font-semibold text-txt-main tracking-tight">CRM Lite</span>
            <span className="text-[10px] block text-primary font-mono font-medium -mt-1">STARTUP EDITION</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-grow px-2 lg:px-4 py-6 overflow-y-auto">
          <Sidebar />
        </div>

        {/* User Workspace Profile bottom footer */}
        <div className="p-3 m-3 rounded-xl border border-border-subtle/60 bg-bg-base/40 flex flex-col lg:flex-row items-center gap-3 shrink-0 hover:bg-bg-base hover:scale-[1.01] transition-all duration-200">
          <div className="relative shrink-0">
            <img 
              className="w-9 h-9 rounded-full bg-bg-base border border-border-subtle object-cover" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User profile avatar" 
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-card rounded-full"></span>
          </div>
          <div className="hidden lg:block min-w-0">
            <p className="text-sm font-semibold text-txt-main truncate leading-tight">Anish Reddy</p>
            <p className="text-xs text-txt-sub truncate">Founder & CEO</p>
          </div>
        </div>
      </aside>

      {/* 2. Mobile drawer navigation overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Menu contents */}
          <div className="relative flex flex-col w-72 max-w-xs bg-surface-card border-r border-border-subtle h-full p-6 animate-in slide-in-from-left duration-200 transition-colors duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-txt-main">CRM Lite</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-lg text-txt-sub hover:bg-bg-base cursor-pointer focus:outline-none"
                aria-label="Close sidebar drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-grow py-4 overflow-y-auto">
              <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} forceFull />
            </div>

            <div className="pt-6 border-t border-border-subtle flex items-center gap-3 shrink-0">
              <img 
                className="w-10 h-10 rounded-full object-cover" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="User profile avatar" 
              />
              <div>
                <p className="text-sm font-semibold text-txt-main">Anish Reddy</p>
                <p className="text-xs text-txt-sub">Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Right-side content container: h-full overflow-hidden */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Topbar Header: Locked at top */}
        <header className="h-16 border-b border-border-subtle bg-surface-card/70 backdrop-blur-md shrink-0 px-4 md:px-6 flex items-center justify-between transition-colors duration-200">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg text-txt-sub hover:bg-bg-base cursor-pointer focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm md:text-base lg:text-lg font-semibold text-txt-main tracking-tight ml-1 md:ml-0">
              {getPageTitle()}
            </h1>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Search Input */}
            <div className="relative hidden lg:block w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-txt-sub" />
              </span>
              <input
                type="text"
                placeholder="Search Workspace..."
                className="w-full pl-9 pr-8 py-1.5 bg-bg-base border border-border-subtle rounded-lg text-xs font-sans placeholder-txt-sub focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-txt-main"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-txt-sub bg-surface-card border border-border-subtle rounded shadow-sm">
                  ⌘K
                </kbd>
              </span>
            </div>

            {/* Notifications Alert Bell */}
            <button 
              className="w-11 h-11 flex items-center justify-center text-txt-sub hover:text-txt-main rounded-lg hover:bg-bg-base relative transition-all duration-150 cursor-pointer focus:outline-none group"
              title="Notifications"
              aria-label="Open notifications overlay"
            >
              <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute top-3 right-3.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
            </button>

            {/* Settings gear link */}
            <Link
              to="/settings"
              className="w-11 h-11 flex items-center justify-center text-txt-sub hover:text-txt-main rounded-lg hover:bg-bg-base relative transition-all duration-150 cursor-pointer focus:outline-none group"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-300" />
            </Link>

            {/* Mount theme toggle */}
            <DarkModeToggle />
          </div>
        </header>

        {/* Content body: Scrollable independently with 32-48px padding on larger screens */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-24 md:pb-8 transition-colors duration-200">
          <div className="max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 4. Fixed Bottom Navigation Bar on Mobile */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-card border-t border-border-subtle flex items-center justify-around z-30 shadow-lg transition-colors duration-200"
        role="navigation"
        aria-label="Mobile bottom navigation bar"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) => 
            `flex-1 h-full flex flex-col items-center justify-center transition-all ${
              isActive 
                ? 'text-primary' 
                : 'text-txt-sub hover:text-txt-main'
            }`
          }
          aria-label="Dashboard Overview"
        >
          <LayoutDashboard className="w-5.5 h-5.5" />
          <span className="text-[9px] mt-0.5 font-medium tracking-wide">Overview</span>
        </NavLink>

        <NavLink
          to="/leads"
          className={({ isActive }) => 
            `flex-1 h-full flex flex-col items-center justify-center transition-all ${
              isActive 
                ? 'text-primary' 
                : 'text-txt-sub hover:text-txt-main'
            }`
          }
          aria-label="Leads Pipeline"
        >
          <Users className="w-5.5 h-5.5" />
          <span className="text-[9px] mt-0.5 font-medium tracking-wide">Leads</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) => 
            `flex-1 h-full flex flex-col items-center justify-center transition-all ${
              isActive 
                ? 'text-primary' 
                : 'text-txt-sub hover:text-txt-main'
            }`
          }
          aria-label="Analytics Insights"
        >
          <BarChart3 className="w-5.5 h-5.5" />
          <span className="text-[9px] mt-0.5 font-medium tracking-wide">Analytics</span>
        </NavLink>
      </nav>

    </div>
  );
}
