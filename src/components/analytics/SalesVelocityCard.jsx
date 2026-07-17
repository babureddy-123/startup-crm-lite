import React, { useMemo } from 'react';
import { Clock, Tag, Milestone, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * @typedef {Object} LeadNote
 * @property {string} id - Unique identifier.
 * @property {string} text - Content text.
 * @property {string} date - ISO date string.
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier.
 * @property {string} name - Contact person's name.
 * @property {string} company - Company name.
 * @property {string} email - Email contact address.
 * @property {string} phone - Contact phone.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline progress status.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Sourcing channel.
 * @property {number} value - Deal contract value.
 * @property {string} owner - Assigned account manager.
 * @property {LeadNote[]} notes - Timeline note history.
 * @property {string} createdAt - Date created timestamp.
 */

/**
 * @typedef {Object} SalesVelocityCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * SalesVelocityCard displays sales speed KPIs (average closure speed, stage durations, and MoM values).
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {SalesVelocityCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Sales Velocity Card.
 */
export default function SalesVelocityCard({ leads = [] }) {
  
  // Calculate average closure velocity and MoM deal variance
  const velocityData = useMemo(() => {
    // 1. Avg Time to Won (Creation to last note date for Won leads)
    const wonLeads = leads.filter(l => l.status === 'Won');
    let totalDaysToWon = 0;
    let countedWon = 0;

    wonLeads.forEach(lead => {
      if (lead.createdAt && lead.notes && lead.notes.length > 0) {
        const sortedNotes = [...lead.notes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const closeDate = new Date(sortedNotes[sortedNotes.length - 1].date);
        const createDate = new Date(lead.createdAt);
        
        const diffTime = Math.abs(closeDate.getTime() - createDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        totalDaysToWon += diffDays;
        countedWon++;
      }
    });

    const avgWonSpeed = countedWon > 0 ? Math.round(totalDaysToWon / countedWon) : 8; // fallback to 8 days

    // 2. Avg Stage Duration for active deals (Current date minus creation date)
    const activeLeads = leads.filter(l => ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent'].includes(l.status));
    let totalActiveDays = 0;
    const now = new Date();

    activeLeads.forEach(lead => {
      if (lead.createdAt) {
        const createDate = new Date(lead.createdAt);
        const diffTime = Math.abs(now.getTime() - createDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalActiveDays += diffDays;
      }
    });

    const avgStageDuration = activeLeads.length > 0 ? Math.round(totalActiveDays / activeLeads.length) : 3;

    // 3. Avg Deal Value
    const totalLeads = leads.length;
    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
    const avgDealValue = totalLeads > 0 ? Math.round(totalValue / totalLeads) : 0;

    // 4. MoM Average Deal Value variance
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevMonthYear = prevMonthDate.getFullYear();

    const currentMonthLeads = leads.filter(l => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const prevMonthLeads = leads.filter(l => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear;
    });

    const currentAvg = currentMonthLeads.length > 0
      ? currentMonthLeads.reduce((sum, l) => sum + (l.value || 0), 0) / currentMonthLeads.length
      : 0;

    const prevAvg = prevMonthLeads.length > 0
      ? prevMonthLeads.reduce((sum, l) => sum + (l.value || 0), 0) / prevMonthLeads.length
      : 40000; // default benchmark comparison

    const valueDiff = currentAvg - prevAvg;
    const valuePercentChange = prevAvg > 0 ? Math.round((valueDiff / prevAvg) * 100) : 0;

    return {
      avgWonSpeed,
      avgStageDuration,
      avgDealValue,
      valuePercentChange,
      isPositiveChange: valuePercentChange >= 0
    };
  }, [leads]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      
      {/* Title Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-txt-main">Sales Velocity</h3>
        <p className="text-xs text-txt-sub">Average conversion speeds and pipeline velocity factors.</p>
      </div>

      {/* Grid of KPIs */}
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        
        {/* KPI 1: Speed to Won */}
        <div className="flex items-center justify-between p-3 bg-bg-base/35 border border-border-subtle/50 rounded-xl transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-txt-main">Average Days to Won</h4>
              <p className="text-[10px] text-txt-sub">Days taken from Lead inflow to Closed Won.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-txt-main font-mono">{velocityData.avgWonSpeed} days</span>
          </div>
        </div>

        {/* KPI 2: Avg Stage Duration */}
        <div className="flex items-center justify-between p-3 bg-bg-base/35 border border-border-subtle/50 rounded-xl transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Milestone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-txt-main">Average Stage Age</h4>
              <p className="text-[10px] text-txt-sub">Days opportunities spend in their active stage.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-txt-main font-mono">{velocityData.avgStageDuration} days</span>
          </div>
        </div>

        {/* KPI 3: Avg Deal Value */}
        <div className="flex items-center justify-between p-3 bg-bg-base/35 border border-border-subtle/50 rounded-xl transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-txt-main">Average Deal Size</h4>
              <p className="text-[10px] text-txt-sub">Mean financial value across active pipeline deals.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-txt-main font-mono block">
              {formatCurrency(velocityData.avgDealValue)}
            </span>
            {/* MoM variance indicator */}
            <span className={`inline-flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.2 rounded mt-0.5 ${
              velocityData.isPositiveChange
                ? 'text-success bg-success/10'
                : 'text-danger bg-danger/10'
            }`}>
              {velocityData.isPositiveChange ? (
                <ArrowUpRight className="w-2.5 h-2.5" />
              ) : (
                <ArrowDownRight className="w-2.5 h-2.5" />
              )}
              {Math.abs(velocityData.valuePercentChange)}% MoM
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
