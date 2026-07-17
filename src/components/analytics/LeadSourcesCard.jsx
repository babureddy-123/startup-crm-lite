import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tag } from 'lucide-react';

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
 * @typedef {Object} LeadSourcesCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * LeadSourcesCard aggregates leads by acquisition channel.
 * Displays a Recharts horizontal bar chart of count volumes and a comparison table of conversion rates.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {LeadSourcesCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Lead Sources Card.
 */
export default function LeadSourcesCard({ leads = [] }) {
  
  // Aggregate stats by source dynamically
  const sourceStats = useMemo(() => {
    const sourcesList = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];
    
    return sourcesList.map(src => {
      const srcLeads = leads.filter(l => l.source === src);
      const count = srcLeads.length;
      const wonLeads = srcLeads.filter(l => l.status === 'Won');
      const wonCount = wonLeads.length;
      const conversion = count > 0 ? Math.round((wonCount / count) * 100) : 0;
      const revenue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);

      return {
        name: src,
        count,
        conversion,
        revenue
      };
    }).sort((a, b) => b.count - a.count); // Sort descending by total lead count
  }, [leads]);

  const totalLeads = leads.length;

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
      
      {/* Component Title */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-txt-main">Lead Sources Analysis</h3>
        <p className="text-xs text-txt-sub">Sourcing channel breakdown, counts, conversion rates, and closed revenue.</p>
      </div>

      {/* Horizontal Bar Chart showing lead counts */}
      <div className="h-44 w-full text-xs">
        {totalLeads > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sourceStats}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="var(--text-secondary)" 
                tickLine={false} 
                axisLine={false}
                width={85}
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
                formatter={(value) => [value, 'Leads']}
              />
              <Bar 
                dataKey="count" 
                fill="var(--primary)" 
                radius={[0, 4, 4, 0]} 
                maxBarSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-txt-sub">
            <span>No leads source data to graph</span>
          </div>
        )}
      </div>

      {/* Conversion Rate Table Grid */}
      <div className="mt-4 border-t border-border-subtle pt-4 transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle text-txt-sub uppercase tracking-wider font-semibold text-[10px] transition-colors duration-200">
                <th className="pb-2">Source</th>
                <th className="pb-2 text-right">Leads</th>
                <th className="pb-2 text-right">Conv. Rate</th>
                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {sourceStats.map(stat => (
                <tr 
                  key={stat.name}
                  className="border-b border-border-subtle/50 last:border-0 hover:bg-bg-base/30 transition-colors"
                >
                  <td className="py-2.5 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-txt-sub/70 shrink-0" />
                    <span className="font-semibold text-txt-main">{stat.name}</span>
                  </td>
                  <td className="py-2.5 text-right font-medium text-txt-sub">
                    {stat.count}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      stat.conversion >= 30
                        ? 'text-success bg-success/10'
                        : stat.conversion > 0
                        ? 'text-primary bg-primary/10'
                        : 'text-txt-sub bg-bg-base'
                    }`}>
                      {stat.conversion}%
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-txt-main">
                    {stat.revenue > 0 ? formatCurrency(stat.revenue) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
