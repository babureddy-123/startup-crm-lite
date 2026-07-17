import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The display label/title of the metric card (e.g. "Total Leads").
 * @property {string|number} value - The numeric or string representation of the metric value (e.g. "$45,000" or "12").
 * @property {React.ComponentType} icon - The Lucide React icon component to render inside the card.
 * @property {number} change - The numeric percentage change compared to the previous period (e.g., 12.4 or -2.5).
 * @property {'primary'|'success'|'warning'|'danger'} color - The theme style indicator.
 */

/**
 * StatsCard component displays a metrics card with a visual icon, a large key figure,
 * and a color-coded percentage variance indicator vs the prior month.
 * Optimizes card height uniformity and includes subtle hover transition effects.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 * Wrapped in React.memo.
 *
 * @param {StatsCardProps} props - The properties object for the component.
 * @returns {React.JSX.Element} The rendered React card component.
 */
function StatsCardComponent({ title, value, icon: Icon, change, color }) {
  // Determine if the percentage change is positive or negative.
  const isPositive = change >= 0;

  // Define styling objects mapping each theme color to variables
  const themeStyles = {
    primary: {
      iconBg: 'bg-primary/10 text-primary',
      borderGlow: 'hover:border-primary/50',
    },
    success: {
      iconBg: 'bg-success/10 text-success',
      borderGlow: 'hover:border-success/50',
    },
    warning: {
      iconBg: 'bg-warning/10 text-warning',
      borderGlow: 'hover:border-warning/50',
    },
    danger: {
      iconBg: 'bg-danger/10 text-danger',
      borderGlow: 'hover:border-danger/50',
    },
  };

  const currentStyles = themeStyles[color] || themeStyles.primary;

  return (
    // Replaced hardcoded gray/white colors with theme tokens. Added consistent min-h-[140px] and premium translate/hover scale effects.
    <div className={`bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-out flex flex-col justify-between min-h-[140px] ${currentStyles.borderGlow}`}>
      {/* Top Section: Title Label & Icon Box */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-txt-sub uppercase tracking-wider">
          {title}
        </span>
        {/* Color-themed icon container */}
        <div className={`p-2 rounded-lg ${currentStyles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom Section: Main Value and Percentage Badge */}
      <div className="mt-4">
        {/* Large key metric display */}
        <h3 className="text-2xl font-bold text-txt-main tracking-tight">
          {value}
        </h3>
        
        {/* Percentage badge */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            isPositive
              ? 'text-success bg-success/10'
              : 'text-danger bg-danger/10'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-[10px] text-txt-sub font-medium">
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StatsCardComponent);
