import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
 * @typedef {Object} BarChartCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * BarChartCard component displays a bar chart of monthly lead creation volumes.
 * Includes a selectable local time filter (Last 6 Months, Last 12 Months, and This Year).
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {BarChartCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Bar Chart Card.
 */
export default function BarChartCard({ leads = [] }) {
  // Local time filter state: '6m' | '12m' | 'ytd'
  const [timeFilter, setTimeFilter] = useState('6m');

  // Dynamically bucket leads monthly inflow depending on timeFilter criteria
  const data = useMemo(() => {
    const now = new Date();
    let monthsToFetch = 6;
    
    if (timeFilter === '12m') {
      monthsToFetch = 12;
    } else if (timeFilter === 'ytd') {
      monthsToFetch = now.getMonth() + 1; // Jan to current month inclusive
    }

    const dataBuckets = [];
    for (let i = monthsToFetch - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      dataBuckets.push({
        name: monthName,
        monthKey,
        count: 0
      });
    }

    leads.forEach(lead => {
      if (!lead.createdAt) return;
      const date = new Date(lead.createdAt);
      const leadMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const bucket = dataBuckets.find(m => m.monthKey === leadMonthKey);
      if (bucket) {
        bucket.count += 1;
      }
    });

    return dataBuckets.map(({ name, count }) => ({ name, count }));
  }, [leads, timeFilter]);

  const totalAddedLeads = useMemo(() => {
    return data.reduce((sum, item) => sum + item.count, 0);
  }, [data]);

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      
      {/* Component Title, Selector dropdown in header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-txt-main">Monthly Leads</h3>
          <p className="text-xs text-txt-sub">Added opportunities: <strong className="font-semibold text-txt-main">{totalAddedLeads}</strong> total.</p>
        </div>
        
        {/* Dropdown filter selector */}
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-bg-base border border-border-subtle text-[11px] font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-txt-main cursor-pointer transition-colors duration-200"
          aria-label="Filter lead inflow duration"
        >
          <option value="6m">Last 6 Months</option>
          <option value="12m">Last 12 Months</option>
          <option value="ytd">This Year</option>
        </select>
      </div>

      {/* Bar Chart Viewport container */}
      <div className="h-56 w-full text-xs">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="var(--border)" 
              />
              
              <XAxis 
                dataKey="name" 
                stroke="var(--text-secondary)" 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />

              <YAxis 
                stroke="var(--text-secondary)" 
                tickLine={false} 
                axisLine={false}
                dx={-5}
                allowDecimals={false}
              />

              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--surface)', 
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  boxShadow: 'var(--shadow-md)'
                }}
                formatter={(value) => [value, 'Added Leads']}
                cursor={{ fill: 'var(--active-sidebar)' }}
              />

              <Bar 
                dataKey="count" 
                fill="var(--primary)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={32}
                animationBegin={150}
                animationDuration={850}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-txt-sub">No inflow data for this period</span>
          </div>
        )}
      </div>
    </div>
  );
}
