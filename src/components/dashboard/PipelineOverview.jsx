import React from 'react';

/**
 * @typedef {Object} LeadNote
 * @property {string} id - Unique identifier for the note.
 * @property {string} text - Content text of the note.
 * @property {string} date - ISO date string of when the note was added.
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier for the lead.
 * @property {string} name - Full name of the contact person.
 * @property {string} company - Company name of the lead.
 * @property {string} email - Email address of the contact.
 * @property {string} phone - Phone number of the contact.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline progress status.
 * @property {number} value - Financial contract value of the lead.
 * @property {string} owner - Assigned CRM workspace user.
 * @property {string} source - Direct lead acquisition channel.
 * @property {LeadNote[]} notes - Historical timeline updates.
 * @property {string} createdAt - ISO timestamp of when the lead was generated.
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - List of leads loaded from the CRM workspace state.
 */

/**
 * PipelineOverview displays a visual segmented horizontal pipeline status bar.
 * Converts the legend table into stacked card rows on mobile for responsiveness.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 *
 * @param {PipelineOverviewProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered pipeline component.
 */
export default function PipelineOverview({ leads = [] }) {
  // Define all 6 pipeline stages and their styling tokens.
  const stages = [
    { name: 'New', color: 'bg-gray-400', text: 'text-txt-sub', dot: 'bg-gray-400' },
    { name: 'Contacted', color: 'bg-blue-500', text: 'text-primary', dot: 'bg-blue-500' },
    { name: 'Meeting Scheduled', color: 'bg-amber-500', text: 'text-amber-500 dark:text-amber-400', dot: 'bg-amber-500' },
    { name: 'Proposal Sent', color: 'bg-purple-500', text: 'text-purple-500 dark:text-purple-400', dot: 'bg-purple-500' },
    { name: 'Won', color: 'bg-green-500', text: 'text-green-500 dark:text-green-400', dot: 'bg-green-500' },
    { name: 'Lost', color: 'bg-red-500', text: 'text-red-500 dark:text-red-400', dot: 'bg-red-500' }
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const totalLeads = leads.length;

  const stageStats = stages.map(stage => {
    const stageLeads = leads.filter(lead => lead.status === stage.name);
    const count = stageLeads.length;
    const value = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    
    return {
      ...stage,
      count,
      value,
      percentage
    };
  });

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-txt-main">Pipeline stage distribution</h3>
        <p className="text-xs text-txt-sub">Visual mapping of total deals across development stages.</p>
      </div>

      {/* Segmented Horizontal Bar Section */}
      <div className="relative mt-2 mb-6">
        {totalLeads > 0 ? (
          <div className="w-full h-4 bg-bg-base rounded-full overflow-hidden flex shadow-inner transition-colors duration-200">
            {stageStats.map(stat => 
              stat.count > 0 ? (
                <div
                  key={stat.name}
                  className={`h-full transition-all duration-300 ${stat.color}`}
                  style={{ width: `${stat.percentage}%` }}
                  title={`${stat.name}: ${stat.count} leads (${stat.percentage}%) - ${formatCurrency(stat.value)}`}
                />
              ) : null
            )}
          </div>
        ) : (
          <div className="w-full h-4 bg-border-subtle/50 rounded-full flex items-center justify-center transition-colors duration-200">
            <span className="text-[9px] font-mono text-txt-sub">No leads currently in pipeline</span>
          </div>
        )}
      </div>

      {/* Mobile Stacked Rows/Cards (visible only on mobile viewports < md) */}
      <div className="md:hidden space-y-2 mt-2">
        {stageStats.map(stat => (
          <div 
            key={stat.name}
            className="flex items-center justify-between p-3 rounded-lg border border-border-subtle/50 bg-bg-base/40 transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${stat.dot}`} />
              <span className="font-semibold text-txt-main text-xs">{stat.name}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-txt-main text-xs">{formatCurrency(stat.value)}</p>
              <p className="text-[9px] text-txt-sub mt-0.5">{stat.count} leads ({stat.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/Tablet Table Viewport (visible on md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-subtle text-txt-sub uppercase tracking-wider font-semibold text-[10px] transition-colors duration-200">
              <th className="pb-2 text-left">Stage</th>
              <th className="pb-2 text-right">Leads</th>
              <th className="pb-2 text-right">Percentage</th>
              <th className="pb-2 text-right">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {stageStats.map(stat => (
              <tr 
                key={stat.name}
                className="border-b border-border-subtle/50 last:border-0 hover:bg-bg-base/30 transition-colors"
              >
                <td className="py-2.5 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${stat.dot}`} />
                  <span className="font-semibold text-txt-main">{stat.name}</span>
                </td>
                
                <td className="py-2.5 text-right font-medium text-txt-sub">
                  {stat.count}
                </td>
                
                <td className="py-2.5 text-right font-medium text-txt-sub">
                  {stat.percentage}%
                </td>
                
                <td className="py-2.5 text-right font-mono font-semibold text-txt-main">
                  {formatCurrency(stat.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
