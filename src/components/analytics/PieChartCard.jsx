import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getStatusDistribution } from '../../utils/analyticsHelpers';

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
 * @typedef {Object} PieChartCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * PieChartCard renders a responsive pie visualization of leads status categories.
 * Renders custom legends detailing status totals and percentages.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {PieChartCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Pie Chart Card.
 */
export default function PieChartCard({ leads = [] }) {
  // Aggregate leads by status stage using helpers
  const data = getStatusDistribution(leads);
  const totalLeads = leads.length;

  // Specific status colors requested by design
  const COLORS = {
    'New': '#94A3B8',
    'Contacted': '#2563EB',
    'Meeting Scheduled': '#F59E0B',
    'Proposal Sent': '#7C3AED',
    'Won': '#22C55E',
    'Lost': '#EF4444'
  };

  const sliceColors = data.map(item => COLORS[item.name] || '#94A3B8');

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      {/* Component Title and description header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-txt-main">Lead Status Distribution</h3>
        <p className="text-xs text-txt-sub">Volumetric share of opportunities at each stage of execution.</p>
      </div>

      {/* Pie Chart display block */}
      <div className="h-48 flex items-center justify-center text-xs relative">
        {totalLeads > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                animationBegin={100}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={sliceColors[index]} className="focus:outline-none" />
                ))}
              </Pie>
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  boxShadow: 'var(--shadow-md)'
                }}
                formatter={(value, name) => [value, `Leads (${name})`]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <span className="text-txt-sub">No status distribution data</span>
        )}
      </div>

      {/* Structured grid legend mapping Name, Count, and Percentage */}
      <div className="mt-4 border-t border-border-subtle pt-4 transition-colors duration-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.map((stat, index) => {
            const percentage = totalLeads > 0 ? Math.round((stat.value / totalLeads) * 100) : 0;
            const sliceColor = sliceColors[index];

            return (
              <div 
                key={stat.name}
                className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-bg-base transition-colors"
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" 
                  style={{ backgroundColor: sliceColor }}
                />
                
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-txt-main truncate leading-tight">
                    {stat.name}
                  </p>
                  <p className="text-[10px] text-txt-sub font-mono mt-0.5">
                    {stat.value} ({percentage}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
