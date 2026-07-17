import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getConversionByMonth } from '../../utils/analyticsHelpers';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
 * @typedef {Object} LineChartCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * LineChartCard component renders a monthly closed won conversion rate
 * trend visualization for the past 6 months, displaying MoM metrics.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {LineChartCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Line Chart Card.
 */
export default function LineChartCard({ leads = [] }) {
  const data = getConversionByMonth(leads);

  // MoM calculation
  const momStats = useMemo(() => {
    if (data.length < 2) return { value: 0, isPositive: true };
    const currentVal = data[data.length - 1]['Conversion Rate (%)'] || 0;
    const prevVal = data[data.length - 2]['Conversion Rate (%)'] || 0;
    const diff = currentVal - prevVal;
    return {
      current: currentVal,
      value: diff,
      isPositive: diff >= 0
    };
  }, [data]);

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      
      {/* Component Title and MoM indicator */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-txt-main">Conversion Rate Trend</h3>
          <p className="text-xs text-txt-sub">Won deals count relative to opportunities added per month.</p>
        </div>
        
        {/* MoM Badge */}
        {data.length >= 2 && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded ${
            momStats.isPositive
              ? 'text-success bg-success/10'
              : 'text-danger bg-danger/10'
          }`}>
            {momStats.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(momStats.value)}% MoM
          </span>
        )}
      </div>

      {/* Line Chart Viewport container */}
      <div className="h-56 w-full text-xs">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="105%">
            <LineChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
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
                formatter={(value) => [`${value}%`, 'Conversion Rate']}
              />

              <Line 
                type="monotone" 
                dataKey="Conversion Rate (%)" 
                stroke="var(--success)" 
                strokeWidth={3}
                dot={{ r: 4, stroke: 'var(--success)', strokeWidth: 2, fill: 'var(--surface)' }}
                activeDot={{ r: 6, stroke: 'var(--success)', strokeWidth: 2, fill: 'var(--success)' }}
                animationBegin={200}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-txt-sub">No conversion trends recorded</span>
          </div>
        )}
      </div>
    </div>
  );
}
