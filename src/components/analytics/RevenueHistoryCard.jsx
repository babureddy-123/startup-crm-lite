import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';

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
 * @typedef {Object} RevenueHistoryCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * RevenueHistoryCard displays won revenue volumes by month using an AreaChart.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {RevenueHistoryCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Revenue History Card.
 */
export default function RevenueHistoryCard({ leads = [] }) {
  
  // Dynamic aggregation of closed won deal values grouped by month
  const data = useMemo(() => {
    const dataBuckets = [];
    const now = new Date();

    // Default to last 6 months buckets
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      dataBuckets.push({
        name: monthName,
        monthKey,
        revenue: 0
      });
    }

    leads.forEach(lead => {
      if (lead.status !== 'Won' || !lead.createdAt) return;
      const date = new Date(lead.createdAt);
      const leadMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const bucket = dataBuckets.find(m => m.monthKey === leadMonthKey);
      if (bucket) {
        bucket.revenue += (lead.value || 0);
      }
    });

    return dataBuckets.map(({ name, revenue }) => ({ name, revenue }));
  }, [leads]);

  const totalWonRevenue = useMemo(() => {
    return leads
      .filter(l => l.status === 'Won')
      .reduce((sum, l) => sum + (l.value || 0), 0);
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
      
      {/* Component Title and Revenue Summary */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-txt-main">Won Revenue History</h3>
          <p className="text-xs text-txt-sub">Closed won deal value timeline.</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-mono font-medium text-txt-sub">Total Revenue</span>
          <h4 className="text-base font-bold text-success flex items-center justify-end gap-1">
            <Award className="w-4 h-4 text-success" />
            <span>{formatCurrency(totalWonRevenue)}</span>
          </h4>
        </div>
      </div>

      {/* Area Chart Viewport container */}
      <div className="h-56 w-full text-xs">
        {totalWonRevenue > 0 ? (
          <ResponsiveContainer width="100%" height="105%">
            <AreaChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => `$${value / 1000}k`}
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
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />

              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)"
                animationBegin={200}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-txt-sub">No won revenue history to plot</span>
          </div>
        )}
      </div>
    </div>
  );
}
