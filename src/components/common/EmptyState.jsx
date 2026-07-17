import React from 'react';
import { SearchX, FolderOpen, RefreshCw } from 'lucide-react';

/**
 * @typedef {Object} EmptyStateProps
 * @property {number} totalLeadsCount - Total count of leads loaded from context before filters are applied.
 * @property {function(): void} onClear - Callback function to clear active search query and status filter criteria.
 */

/**
 * EmptyState renders a visual placeholder when a list view contains no matching records.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 * Wrapped in React.memo.
 *
 * @param {EmptyStateProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered empty state component.
 */
function EmptyStateComponent({ totalLeadsCount, onClear }) {
  const isWorkspaceEmpty = totalLeadsCount === 0;

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-surface-card border border-border-subtle rounded-xl shadow-sm max-w-lg mx-auto my-6 animate-fade-in duration-200 transition-colors duration-200">
      
      {/* Dynamic Icon Display */}
      <div className="w-14 h-14 bg-bg-base rounded-full flex items-center justify-center text-txt-sub mb-5 border border-border-subtle transition-colors duration-200">
        {isWorkspaceEmpty ? (
          <FolderOpen className="w-6 h-6 text-primary/80" />
        ) : (
          <SearchX className="w-6 h-6 text-amber-500/80" />
        )}
      </div>

      {/* Dynamic Main Heading */}
      <h3 className="text-base font-bold text-txt-main mb-2">
        {isWorkspaceEmpty ? 'Your Pipeline is Empty' : 'No Leads Match Your Criteria'}
      </h3>

      {/* Dynamic Explanation Text Details */}
      <p className="text-xs text-txt-sub max-w-xs leading-relaxed mb-6">
        {isWorkspaceEmpty
          ? 'Get started by creating your first business lead opportunity in the workspace to begin tracking your deals.'
          : 'Try clearing your search query input, modifying status stage filters, or sorting configurations to display all results.'}
      </p>

      {/* Dynamic Call to Action */}
      {!isWorkspaceEmpty && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 px-4 py-3 md:py-2 text-xs font-semibold rounded-lg text-txt-main bg-bg-base hover:bg-bg-base/80 border border-border-subtle transition-all duration-200 cursor-pointer"
          aria-label="Clear active search and status filters"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Active Filters</span>
        </button>
      )}
    </div>
  );
}

export default React.memo(EmptyStateComponent);
