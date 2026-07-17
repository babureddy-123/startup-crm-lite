import React from 'react';

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
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Lead stage status.
 * @property {number} value - Deal contract value.
 * @property {string} owner - Owner username.
 * @property {string} source - Direct source channel.
 * @property {LeadNote[]} notes - Timeline note history.
 * @property {string} createdAt - Date created timestamp.
 */

/**
 * @typedef {Object} FilterBarProps
 * @property {string} activeFilter - The current active status stage key passed from parent state (e.g. 'All' or 'Won').
 * @property {function(string): void} onFilterChange - Callback function executed when a filter tab button is clicked.
 * @property {Lead[]} leads - List of leads used to dynamically tally counts per stage.
 */

/**
 * FilterBar renders a horizontal row of status filters with dynamic lead tallies.
 * Uses dynamic variables/theme tokens (`bg-primary`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 *
 * @param {FilterBarProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered filter bar component.
 */
export default function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  const filters = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  const getFilterCount = (filterOption) => {
    if (filterOption === 'All') {
      return leads.length;
    }
    return leads.filter((lead) => lead.status === filterOption).length;
  };

  return (
    <div 
      className="w-full overflow-x-auto no-scrollbar py-1" 
      role="tablist" 
      aria-label="Filter opportunities by stage"
    >
      <div className="flex items-center gap-2 min-w-max pb-0.5">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          const count = getFilterCount(filter);

          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              role="tab"
              aria-selected={isActive}
              aria-controls="leads-viewport"
              // Replaced hardcoded gray/white colors with theme tokens: bg-primary, bg-bg-base, border-border-subtle and text-txt-sub
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 select-none hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/15'
                  : 'bg-bg-base hover:bg-bg-base/80 text-txt-sub hover:text-txt-main border border-border-subtle'
              }`}
            >
              <span>{filter}</span>
              {/* Lead count badge */}
              <span className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-border-subtle/80 text-txt-sub'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
