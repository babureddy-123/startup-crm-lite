import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Briefcase, 
  Monitor, 
  Sun, 
  Moon, 
  Bell, 
  Lock, 
  Save, 
  ShieldCheck, 
  Key,
  Laptop
} from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Settings page displays multi-section workspace configurations.
 * Supports Profile details, Workspace parameters, Appearance (Light/Dark/System theme options), Notifications, and Security.
 * Uses dynamic variable/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 *
 * @returns {React.JSX.Element} Rendered Settings page view.
 */
export default function Settings() {
  const { themeMode, setThemeMode } = useTheme();

  // Tab navigation states: 'profile' | 'workspace' | 'appearance' | 'notifications' | 'security'
  const [activeSection, setActiveSection] = useState('profile');

  // Form State: Profile Details
  const [profileName, setProfileName] = useState('Anish Reddy');
  const [profileEmail, setProfileEmail] = useState('anish.reddy@crmlite.io');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileRole, setProfileRole] = useState('Founder & CEO');

  // Form State: Workspace
  const [workspaceName, setWorkspaceName] = useState('CRM Lite HQ');
  const [workspaceCurrency, setWorkspaceCurrency] = useState('USD');
  const [workspaceTimezone, setWorkspaceTimezone] = useState('IST (UTC+05:30)');

  // Form State: Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [slackSync, setSlackSync] = useState(false);

  // Form State: Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /**
   * Action handler to save settings with visual Toast feedbacks.
   */
  const handleSaveSettings = (sectionName) => {
    // Validate password changes if security section is updated
    if (sectionName === 'security') {
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match!");
        return;
      }
      if (newPassword && !currentPassword) {
        toast.error("Please enter your current password.");
        return;
      }
    }

    const toastId = toast.loading('Syncing settings...');
    setTimeout(() => {
      toast.success(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} configurations updated successfully!`, {
        id: toastId,
        icon: '⚙️'
      });
      // Clear passwords on save
      if (sectionName === 'security') {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    }, 800);
  };

  // Sidebar settings navigation links
  const sections = [
    { id: 'profile', name: 'Profile Details', icon: User },
    { id: 'workspace', name: 'Workspace Admin', icon: Briefcase },
    { id: 'appearance', name: 'Appearance Settings', icon: Monitor },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security & Access', icon: Lock }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <span className="text-xs text-primary font-mono font-semibold tracking-wider uppercase">
          Administration
        </span>
        <h2 className="text-xl font-bold text-txt-main leading-tight">
          System & Settings
        </h2>
        <p className="text-sm text-txt-sub mt-1">Configure profile details, workspace themes, alerts, and access keys.</p>
      </div>

      {/* Main Settings Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side Section: Vertical Navigation Menu */}
        <div className="lg:col-span-1 bg-surface-card border border-border-subtle rounded-xl p-3 space-y-1 shadow-sm transition-colors duration-200">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                  isActive 
                    ? 'bg-active-sidebar text-primary' 
                    : 'text-txt-sub hover:bg-bg-base hover:text-txt-main'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Section: Settings Forms Content */}
        <div className="lg:col-span-3 bg-surface-card border border-border-subtle rounded-xl p-5 md:p-6 shadow-sm min-h-[400px] flex flex-col justify-between transition-colors duration-200">
          
          {/* Section 1: Profile Details Form */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-txt-main flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>Profile Information</span>
                </h3>
                <p className="text-xs text-txt-sub mt-0.5">Manage your user profile details and communication parameters.</p>
              </div>

              {/* Avatar Upload mockup */}
              <div className="flex items-center gap-4 py-2 border-b border-border-subtle/50 pb-4">
                <img 
                  className="w-16 h-16 rounded-full object-cover border border-border-subtle" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="User profile avatar" 
                />
                <div>
                  <button className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 transition-all cursor-pointer">
                    Upload New Avatar
                  </button>
                  <p className="text-[10px] text-txt-sub mt-1">Recommended size: Square (PNG/JPG, max 2MB).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-txt-main mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-txt-main mb-1.5">Role/Title</label>
                  <input
                    type="text"
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-txt-main mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-txt-main mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Workspace Admin Settings */}
          {activeSection === 'workspace' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-txt-main flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>Workspace Administration</span>
                </h3>
                <p className="text-xs text-txt-sub mt-0.5">Control business configurations, regional settings, and values.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-txt-main mb-1.5">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main placeholder-txt-sub focus:outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-txt-main mb-1.5">Default Currency</label>
                  <select
                    value={workspaceCurrency}
                    onChange={(e) => setWorkspaceCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main focus:outline-none cursor-pointer"
                  >
                    <option value="USD">USD ($ USD)</option>
                    <option value="EUR">EUR (€ EUR)</option>
                    <option value="INR">INR (₹ INR)</option>
                    <option value="GBP">GBP (£ GBP)</option>
                  </select>
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-xs font-semibold text-txt-main mb-1.5">Business Timezone</label>
                  <select
                    value={workspaceTimezone}
                    onChange={(e) => setWorkspaceTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main focus:outline-none cursor-pointer"
                  >
                    <option value="IST (UTC+05:30)">IST (India Standard Time, UTC+05:30)</option>
                    <option value="EST (UTC-05:00)">EST (Eastern Standard Time, UTC-05:00)</option>
                    <option value="GMT (UTC+00:00)">GMT (Greenwich Mean Time, UTC+00:00)</option>
                    <option value="PST (UTC-08:00)">PST (Pacific Standard Time, UTC-08:00)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Appearance Themes Tiles Selection */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-txt-main flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary" />
                  <span>Appearance & Mode</span>
                </h3>
                <p className="text-xs text-txt-sub mt-0.5">Customize your visual interface theme selection.</p>
              </div>

              {/* Three Theme selection tiles layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* Tile 1: Light Mode option */}
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode('light');
                    toast.success('Visual theme set to Light mode!');
                  }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border cursor-pointer select-none text-center transition-all ${
                    themeMode === 'light'
                      ? 'border-primary bg-active-sidebar text-primary ring-1 ring-primary'
                      : 'border-border-subtle bg-bg-base/30 text-txt-sub hover:border-border-subtle/80 hover:bg-bg-base/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-txt-main">Light Mode</h4>
                    <p className="text-[10px] text-txt-sub mt-0.5">SaaS white theme outline layout.</p>
                  </div>
                </button>

                {/* Tile 2: Dark Mode option */}
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode('dark');
                    toast.success('Visual theme set to Dark mode!');
                  }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border cursor-pointer select-none text-center transition-all ${
                    themeMode === 'dark'
                      ? 'border-primary bg-active-sidebar text-primary ring-1 ring-primary'
                      : 'border-border-subtle bg-bg-base/30 text-txt-sub hover:border-border-subtle/80 hover:bg-bg-base/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-txt-main">Dark Mode</h4>
                    <p className="text-[10px] text-txt-sub mt-0.5">Modern dim background format.</p>
                  </div>
                </button>

                {/* Tile 3: System preference option */}
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode('system');
                    toast.success('Visual theme matched to System preference!');
                  }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border cursor-pointer select-none text-center transition-all ${
                    themeMode === 'system'
                      ? 'border-primary bg-active-sidebar text-primary ring-1 ring-primary'
                      : 'border-border-subtle bg-bg-base/30 text-txt-sub hover:border-border-subtle/80 hover:bg-bg-base/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-txt-main">System Mode</h4>
                    <p className="text-[10px] text-txt-sub mt-0.5">Sync with OS color layout preference.</p>
                  </div>
                </button>
              </div>

              {/* Theme detail alert info */}
              <div className="p-3 bg-bg-base border border-border-subtle rounded-lg text-[10px] text-txt-sub flex items-center gap-2">
                <Laptop className="w-4 h-4 shrink-0 text-primary" />
                <span>If set to System mode, CRM Lite will auto-detect your computer OS dark mode preference and toggle themes automatically.</span>
              </div>
            </div>
          )}

          {/* Section 4: Notifications Settings checkboxes */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-txt-main flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span>Notification Settings</span>
                </h3>
                <p className="text-xs text-txt-sub mt-0.5">Specify when and how you receive alerts and reports.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-3 bg-bg-base/30 border border-border-subtle rounded-xl cursor-pointer hover:bg-bg-base/60 transition-all select-none">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shrink-0 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-txt-main">Email Pipeline Digests</span>
                    <p className="text-[10px] text-txt-sub mt-0.5">Weekly summaries detailing closed won leads, metrics value, and top performers list.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-bg-base/30 border border-border-subtle rounded-xl cursor-pointer hover:bg-bg-base/60 transition-all select-none">
                  <input
                    type="checkbox"
                    checked={pushAlerts}
                    onChange={(e) => setPushAlerts(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shrink-0 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-txt-main">Browser Push Notifications</span>
                    <p className="text-[10px] text-txt-sub mt-0.5">Alerts when a client status shifts, new updates are saved, or checklist items sync.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-bg-base/30 border border-border-subtle rounded-xl cursor-pointer hover:bg-bg-base/60 transition-all select-none">
                  <input
                    type="checkbox"
                    checked={slackSync}
                    onChange={(e) => setSlackSync(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shrink-0 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-txt-main">Slack Workspace Integration</span>
                    <p className="text-[10px] text-txt-sub mt-0.5">Sync pipeline status notifications directly to corporate Slack channel logs.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Section 5: Security & Access keys panel */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-txt-main flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Security & API Access</span>
                </h3>
                <p className="text-xs text-txt-sub mt-0.5">Modify profile credentials and manage workspace development credentials.</p>
              </div>

              {/* Password update inputs */}
              <div className="space-y-4 border-b border-border-subtle/50 pb-5">
                <h4 className="text-xs font-bold text-txt-main flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-primary" />
                  <span>Change Password</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-txt-sub mb-1.5">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-txt-sub mb-1.5">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-txt-sub mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-bg-base text-txt-main focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Mock API Credentials */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-txt-main flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  <span>Workspace API Credentials</span>
                </h4>
                <div className="p-3 bg-bg-base border border-border-subtle rounded-lg flex items-center justify-between gap-4 font-mono text-[10px] text-txt-main transition-colors duration-200">
                  <span className="truncate">client_key_sandbox_crm_lite_5883ef0e9981</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      navigator.clipboard.writeText('client_key_sandbox_crm_lite_5883ef0e9981');
                      toast.success('API credential copied to clipboard!');
                    }}
                    className="px-2 py-1 bg-surface-card border border-border-subtle rounded hover:bg-bg-base/80 transition-all font-sans font-semibold cursor-pointer shrink-0"
                  >
                    Copy Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Save Trigger Button */}
          {activeSection !== 'appearance' && (
            <div className="flex justify-end pt-5 border-t border-border-subtle mt-8 transition-colors duration-200">
              <button
                type="button"
                onClick={() => handleSaveSettings(activeSection)}
                className="px-4 py-2.5 flex items-center gap-1.5 text-xs font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 shadow-sm shadow-primary/10 transition-all cursor-pointer focus:outline-none"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
