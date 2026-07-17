import React from 'react';
import { Pencil, Trash2, Mail, Phone, Tag, Calendar, User } from 'lucide-react';
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
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead - The lead object containing contact details and stats.
 * @property {function(Lead): void} onEdit - Callback function executed when the Edit button is clicked.
 * @property {function(string): void} onDelete - Callback function executed when the Delete button is clicked.
 */

/**
 * LeadCard component displays a grid card profile of a single lead.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 * Enforces touch targets of at least 44x44px for actions on mobile.
 *
 * @param {LeadCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered lead card component.
 */
export default function LeadCard({ lead, onEdit, onDelete }) {
  
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
    <div className="bg-surface-card border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 flex flex-col justify-between h-full group">
      
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {/* Contact Person Name */}
            <h4 className="text-sm font-bold text-txt-main group-hover:text-primary transition-colors">
              {lead.name}
            </h4>
            {/* Associated Company */}
            <span className="text-xs text-txt-sub font-medium">
              {lead.company}
            </span>
          </div>
          {/* Status Badge */}
          <StatusBadge status={lead.status} />
        </div>

        {/* Middle Section: Contact details list */}
        <div className="space-y-2.5 my-4 border-t border-border-subtle/50 pt-4 text-xs">
          
          {/* Email Address */}
          <div className="flex items-center gap-2.5 text-txt-sub">
            <Mail className="w-3.5 h-3.5 text-txt-sub/70 shrink-0" />
            <a 
              href={`mailto:${lead.email}`} 
              className="hover:text-primary py-1 transition-colors truncate"
              title={lead.email}
            >
              {lead.email}
            </a>
          </div>

          {/* Phone Number */}
          {lead.phone && (
            <div className="flex items-center gap-2.5 text-txt-sub">
              <Phone className="w-3.5 h-3.5 text-txt-sub/70 shrink-0" />
              <a 
                href={`tel:${lead.phone}`} 
                className="hover:text-primary py-1 transition-colors"
              >
                {lead.phone}
              </a>
            </div>
          )}

          {/* Sourcing Channel */}
          <div className="flex items-center gap-2.5 text-txt-sub">
            <Tag className="w-3.5 h-3.5 text-txt-sub/70 shrink-0" />
            <span>Source: <strong className="font-semibold text-txt-main">{lead.source}</strong></span>
          </div>

          {/* Creation Date */}
          <div className="flex items-center gap-2.5 text-txt-sub">
            <Calendar className="w-3.5 h-3.5 text-txt-sub/70 shrink-0" />
            <span>Added: <strong className="font-semibold text-txt-main">{formatDate(lead.createdAt)}</strong></span>
          </div>

          {/* Owner */}
          {lead.owner && (
            <div className="flex items-center gap-2.5 text-txt-sub">
              <User className="w-3.5 h-3.5 text-txt-sub/70 shrink-0" />
              <span>Owner: <strong className="font-semibold text-txt-main">{lead.owner}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono font-medium text-txt-sub tracking-wider">
            Deal Value
          </span>
          <span className="text-sm font-mono font-bold text-txt-main">
            {formatCurrency(lead.value)}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Edit Trigger */}
          <button
            onClick={() => onEdit(lead)}
            className="w-11 h-11 md:w-auto md:h-auto md:p-1.5 flex items-center justify-center rounded-lg text-txt-sub hover:text-primary hover:bg-bg-base transition-all cursor-pointer focus:outline-none"
            title="Edit Lead"
            aria-label={`Edit details for ${lead.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Delete Trigger */}
          <button
            onClick={() => onDelete(lead.id)}
            className="w-11 h-11 md:w-auto md:h-auto md:p-1.5 flex items-center justify-center rounded-lg text-txt-sub hover:text-danger hover:bg-bg-base transition-all cursor-pointer focus:outline-none"
            title="Delete Lead"
            aria-label={`Delete lead ${lead.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
