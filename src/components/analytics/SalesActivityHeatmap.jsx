import React, { useMemo } from 'react';
import { Calendar, Info } from 'lucide-react';

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
 * @typedef {Object} SalesActivityHeatmapProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * SalesActivityHeatmap displays CRM workspace event metrics by day of week (rows) and time-blocks (columns).
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {SalesActivityHeatmapProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Activity Heatmap.
 */
export default function SalesActivityHeatmap({ leads = [] }) {
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const timeBlocks = [
    { label: '9a-12p', startHour: 9, endHour: 11 },
    { label: '12p-3p', startHour: 12, endHour: 14 },
    { label: '3p-6p', startHour: 15, endHour: 17 },
    { label: '6p-9p', startHour: 18, endHour: 20 },
    { label: '9p-12a', startHour: 21, endHour: 23 },
    { label: '12a-9a', startHour: 0, endHour: 8 }
  ];

  // Group events by day and hour slot
  const { matrix, maxActivity, totalActivities } = useMemo(() => {
    // Initialize 7 (days) x 6 (timeblocks) matrix with 0s
    const grid = Array(7).fill(null).map(() => Array(6).fill(0));
    let maxCount = 0;
    let totalCount = 0;

    const processDate = (dateString) => {
      if (!dateString) return;
      const date = new Date(dateString);
      
      // getDay() returns 0 for Sunday, 1 for Monday etc. Map Sunday to index 6, others to day - 1
      let dayIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const hour = date.getHours();
      
      let blockIdx = -1;
      for (let i = 0; i < timeBlocks.length; i++) {
        const { startHour, endHour } = timeBlocks[i];
        if (hour >= startHour && hour <= endHour) {
          blockIdx = i;
          break;
        }
      }

      if (dayIdx >= 0 && dayIdx < 7 && blockIdx >= 0 && blockIdx < 6) {
        grid[dayIdx][blockIdx] += 1;
        totalCount += 1;
        if (grid[dayIdx][blockIdx] > maxCount) {
          maxCount = grid[dayIdx][blockIdx];
        }
      }
    };

    // Aggregate lead creations
    leads.forEach(lead => {
      processDate(lead.createdAt);
      // Aggregate note updates as activities
      if (lead.notes) {
        lead.notes.forEach(note => {
          processDate(note.date);
        });
      }
    });

    return {
      matrix: grid,
      maxActivity: maxCount,
      totalActivities: totalCount
    };
  }, [leads]);

  // Determine cell color shade depending on relative weight
  const getCellColor = (count) => {
    if (count === 0) return 'bg-bg-base dark:bg-slate-900 border-border-subtle/20 text-transparent';
    if (maxActivity === 0) return 'bg-primary/10 text-txt-sub';
    
    const weight = count / maxActivity;
    
    if (weight <= 0.25) return 'bg-primary/20 text-primary border-primary/25 font-bold';
    if (weight <= 0.5) return 'bg-primary/40 text-primary border-primary/35 font-bold';
    if (weight <= 0.75) return 'bg-primary/70 text-white border-primary/50 font-bold';
    return 'bg-primary text-white border-primary font-bold';
  };

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      
      {/* Title Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-txt-main">Sales Activity Heatmap</h3>
        <p className="text-xs text-txt-sub">Hour vs Day distribution of workspace operations: <strong className="font-semibold text-txt-main">{totalActivities}</strong> events logged.</p>
      </div>

      {/* Grid Heatmap container */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[340px] space-y-1.5 py-1">
            
            {/* Column Headers (Timeblocks) */}
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-mono uppercase tracking-wider font-semibold text-txt-sub">
              {/* Empty placeholder for day row index header */}
              <div></div>
              {timeBlocks.map(block => (
                <div key={block.label} className="truncate">{block.label}</div>
              ))}
            </div>

            {/* Row Layout (Day Grid) */}
            {days.map((dayName, dIdx) => (
              <div key={dayName} className="grid grid-cols-7 gap-1 items-center">
                {/* Day label */}
                <div className="text-[10px] font-bold text-txt-main pr-1.5 text-right font-sans">
                  {dayName}
                </div>

                {/* Day hour cells */}
                {timeBlocks.map((block, bIdx) => {
                  const count = matrix[dIdx][bIdx];
                  const colorClass = getCellColor(count);
                  
                  return (
                    <div
                      key={`${dIdx}-${bIdx}`}
                      className={`h-7 rounded flex items-center justify-center border text-[10px] font-mono transition-all duration-200 hover:scale-105 ${colorClass}`}
                      title={`${days[dIdx]} at ${block.label}: ${count} activities logged`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[10px] text-txt-sub transition-colors duration-200">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Events: Lead creation & notes</span>
        </span>
        <div className="flex items-center gap-1 font-mono">
          <span>Low</span>
          <span className="w-2.5 h-2.5 rounded bg-primary/20 border border-primary/25" />
          <span className="w-2.5 h-2.5 rounded bg-primary/40 border border-primary/35" />
          <span className="w-2.5 h-2.5 rounded bg-primary/70 border border-primary/50" />
          <span className="w-2.5 h-2.5 rounded bg-primary" />
          <span>High</span>
        </div>
      </div>

    </div>
  );
}
