import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
// Import StatusBadge directly to satisfy DRY guidelines
import StatusBadge from '../leads/StatusBadge';

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
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - List of leads loaded from the CRM workspace state.
 */

/**
 * RecentLeads renders a tabular list of the 5 most recently created/updated leads,
 * providing status badge highlights and a direct link to the leads pipeline viewport.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 * Memoized using React.memo.
 *
 * @param {RecentLeadsProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Recent Leads panel component.
 */
function RecentLeadsComponent({ leads = [] }) {
  // Sort leads by creation timestamp in descending order and slice the top 5 records.
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      {/* Component Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-txt-main">Recently active leads</h3>
          <p className="text-xs text-txt-sub">Latest pipeline updates and client creation logs.</p>
        </div>
        <Link 
          to="/leads"
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium group transition-all duration-150"
        >
          <span>Pipeline Workspace</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Leads Table Container */}
      <div className="overflow-x-auto -mx-5 flex-1">
        {recentLeads.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-y border-border-subtle bg-bg-base/60 text-txt-sub uppercase tracking-wider font-semibold text-[10px] transition-colors duration-200">
                <th className="py-3 px-5">Lead & Company</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Value</th>
                <th className="py-3 px-5">Created At</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr 
                  key={lead.id}
                  className="border-b border-border-subtle/50 hover:bg-bg-base/10 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-txt-main">{lead.name}</div>
                    <div className="text-[10px] text-txt-sub">{lead.company}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-semibold text-txt-main">
                    {formatCurrency(lead.value)}
                  </td>
                  <td className="py-3.5 px-5 text-txt-sub font-medium">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-xs text-txt-sub font-medium">No recent leads available</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(RecentLeadsComponent);
