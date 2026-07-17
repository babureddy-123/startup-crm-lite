import React from 'react';
import { Pencil, Trash2, Mail, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';

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
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads - List of leads loaded from the CRM workspace state.
 * @property {function(Lead): void} onEdit - Callback function executed when the Edit button is clicked.
 * @property {function(string): void} onDelete - Callback function executed when the Delete button is clicked.
 */

/**
 * LeadTable component renders a full tabular view of the lead list.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 *
 * @param {LeadTableProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered lead table component.
 */
export default function LeadTable({ leads = [], onEdit, onDelete }) {
  
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
    <div className="bg-surface-card border border-border-subtle rounded-xl shadow-sm overflow-hidden transition-colors duration-200">
      {/* Horizontal Scroll wrapper */}
      <div className="overflow-x-auto">
        {leads.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-base text-txt-sub uppercase tracking-wider font-semibold text-[10px] transition-colors duration-200">
                <th className="py-3.5 px-5">Lead & Company</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Deal Value</th>
                <th className="py-3.5 px-5">Source</th>
                <th className="py-3.5 px-5">Date Added</th>
                <th className="py-3.5 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr 
                  key={lead.id}
                  className="border-b border-border-subtle/50 hover:bg-bg-base/10 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-txt-main text-sm">{lead.name}</div>
                    <div className="text-[10px] text-txt-sub font-medium">{lead.company}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <StatusBadge status={lead.status} />
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-txt-sub font-medium">
                        <Mail className="w-3.5 h-3.5 text-txt-sub/70" />
                        <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                          {lead.email}
                        </a>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1.5 text-txt-sub">
                          <Phone className="w-3.5 h-3.5 text-txt-sub/70" />
                          <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                            {lead.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-5 font-mono font-bold text-txt-main">
                    {formatCurrency(lead.value)}
                  </td>

                  <td className="py-3.5 px-5 text-txt-sub font-semibold">
                    {lead.source}
                  </td>

                  <td className="py-3.5 px-5 text-txt-sub font-medium">
                    {formatDate(lead.createdAt)}
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-center gap-1">
                      {/* Edit Row Trigger */}
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 rounded-lg text-txt-sub hover:text-primary hover:bg-bg-base transition-all cursor-pointer focus:outline-none"
                        title="Edit Lead"
                        aria-label={`Edit details for ${lead.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Row Trigger */}
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 rounded-lg text-txt-sub hover:text-danger hover:bg-bg-base transition-all cursor-pointer focus:outline-none"
                        title="Delete Lead"
                        aria-label={`Delete lead ${lead.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-sm text-txt-sub font-medium">No leads matching search parameters</span>
          </div>
        )}
      </div>
    </div>
  );
}
