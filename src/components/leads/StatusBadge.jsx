import React from 'react';

/**
 * @typedef {Object} StatusBadgeProps
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - The current pipeline progress status of the lead.
 */

/**
 * StatusBadge component renders a styled pill badge indicating the status of a lead.
 * Uses dynamic variables/theme tokens (`bg-bg-base`, `border-border-subtle`, etc.) for themes.
 * Wrapped in React.memo.
 *
 * @param {StatusBadgeProps} props - The properties object for the component.
 * @returns {React.JSX.Element} The rendered colored badge element.
 */
function StatusBadgeComponent({ status }) {
  // Define custom styles mapping each status option using dynamic theme variables and opacity values
  const statusStyles = {
    New: 'bg-bg-base text-txt-sub border border-border-subtle',
    Contacted: 'bg-primary/10 text-primary border border-primary/20',
    'Meeting Scheduled': 'bg-warning/10 text-warning border border-warning/20',
    'Proposal Sent': 'bg-purple-500/10 text-purple-605 dark:text-purple-400 border border-purple-500/20',
    Won: 'bg-success/10 text-success border border-success/20',
    Lost: 'bg-danger/10 text-danger border border-danger/20',
  };

  const currentClass = statusStyles[status] || statusStyles.New;

  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold select-none ${currentClass}`}>
      {status}
    </span>
  );
}

export default React.memo(StatusBadgeComponent);
