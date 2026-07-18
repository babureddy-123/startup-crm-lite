import React, { useState, useCallback, useMemo, useEffect } from 'react';
// Import subcomponents from components/dashboard/ directory
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { ChecklistCard } from '../components/dashboard/ChecklistCard';
// Import context leads hook to fetch pipeline opportunities
import { useLeads } from '../context/LeadContext';
// Import layout indicators and Lucide React icons
import { Users, TrendingUp, FileText, Percent } from 'lucide-react';

/**
 * @typedef {Object} Task
 * @property {number} id - Unique identifier for the checklist task.
 * @property {string} text - Describing the action item content.
 * @property {boolean} completed - Task completion boolean.
 * @property {'high'|'medium'|'low'} priority - Action priority level.
 */

/**
 * Dashboard page component.
 * Uses dynamic variables/theme tokens (`text-txt-main`, `text-txt-sub`) for themes.
 *
 * @returns {React.JSX.Element} Rendered Dashboard view component.
 */
export default function Dashboard() {
  const { leads, fetchLeads } = useLeads();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Follow up with Stripe Jenkins regarding pricing proposal', completed: false, priority: 'high' },
    { id: 2, text: 'Verify Vercel user permission requirements list', completed: true, priority: 'medium' },
    { id: 3, text: 'Schedule product demo with Supabase founder', completed: false, priority: 'high' },
    { id: 4, text: 'Draft enterprise service agreement for Retool app', completed: false, priority: 'low' }
  ]);

  const handleToggleTask = useCallback((id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const activeLeads = useMemo(() => {
    return leads.filter(l => ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent'].includes(l.status));
  }, [leads]);

  const activeCount = activeLeads.length;

  const activePipelineValue = useMemo(() => {
    return activeLeads.reduce((acc, l) => acc + (l.value || 0), 0);
  }, [activeLeads]);

  const proposalCount = useMemo(() => {
    return leads.filter(l => l.status === 'Proposal Sent').length;
  }, [leads]);

  const winRate = useMemo(() => {
    const wonLeadsCount = leads.filter(l => l.status === 'Won').length;
    const lostLeadsCount = leads.filter(l => l.status === 'Lost').length;
    const closedCount = wonLeadsCount + lostLeadsCount;
    return closedCount > 0 ? Math.round((wonLeadsCount / closedCount) * 100) : 0;
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Replaced hardcoded slate colors with theme tokens */}
          <h2 className="text-xl font-bold text-txt-main leading-tight">Workspace Overview</h2>
          <p className="text-sm text-txt-sub">Here's what's happening with your leads pipeline today.</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Active Leads" 
          value={activeCount} 
          icon={Users} 
          change={12.4} 
          color="primary" 
        />
        <StatsCard 
          title="Active Pipeline" 
          value={formatCurrency(activePipelineValue)} 
          icon={TrendingUp} 
          change={8.2} 
          color="success" 
        />
        <StatsCard 
          title="In Proposal" 
          value={proposalCount} 
          icon={FileText} 
          change={5.5} 
          color="warning" 
        />
        <StatsCard 
          title="Win Rate" 
          value={`${winRate}%`} 
          icon={Percent} 
          change={-1.2} 
          color="danger" 
        />
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side Section */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <PipelineOverview leads={leads} />
          <RecentLeads leads={leads} />
        </div>

        {/* Right Side Section */}
        <div className="space-y-6 flex flex-col justify-start">
          <QuickActions />
          <ChecklistCard tasks={tasks} onToggle={handleToggleTask} />
        </div>

      </div>
    </div>
  );
}
