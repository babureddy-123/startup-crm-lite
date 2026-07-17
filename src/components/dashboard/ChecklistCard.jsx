import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * @typedef {Object} Task
 * @property {number} id - Unique identifier.
 * @property {string} text - Task description.
 * @property {boolean} completed - Completion status.
 * @property {'high'|'medium'|'low'} priority - Task priority indicator.
 */

/**
 * @typedef {Object} ChecklistCardProps
 * @property {Task[]} tasks - List of checklist tasks.
 * @property {function(number): void} onToggle - Callback triggered when checking/unchecking a task.
 */

/**
 * ChecklistCard component displays a workspace checklist.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 * Wrapped in React.memo.
 *
 * @param {ChecklistCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered checklist panel.
 */
function ChecklistCardComponent({ tasks = [], onToggle }) {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between flex-1 transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-txt-main">Workspace Checklist</h3>
        <p className="text-xs text-txt-sub">Quick action tasks for today's pipelines.</p>
      </div>
      
      {/* Scrollable list containing tasks */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-1">
        {tasks.map(task => (
          <label 
            key={task.id} 
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-150 ${
              task.completed 
                ? 'bg-bg-base/50 border-border-subtle/50 opacity-75' 
                : 'bg-surface-card border border-border-subtle shadow-sm hover:border-border-subtle/80'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="w-4.5 h-4.5 text-blue-600 border-gray-300 dark:border-gray-650 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer bg-white dark:bg-gray-800"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-normal font-semibold ${
                task.completed 
                  ? 'text-txt-sub line-through' 
                  : 'text-txt-main'
              }`}>
                {task.text}
              </p>
              
              <span className={`inline-block text-[9px] font-mono px-1.5 py-0.5 rounded mt-1.5 uppercase font-semibold ${
                task.priority === 'high' 
                  ? 'bg-red-50 text-red-655 dark:bg-red-950/20 dark:text-red-405' 
                  : task.priority === 'medium'
                  ? 'bg-amber-50 text-amber-655 dark:bg-amber-950/20 dark:text-amber-405'
                  : 'bg-bg-base text-txt-sub border border-border-subtle'
              }`}>
                {task.priority} Priority
              </span>
            </div>
          </label>
        ))}
      </div>
      
      {/* Checklist summary footer stats */}
      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[10px] text-txt-sub font-medium transition-colors duration-200">
        <span>TASKS DONE: {completedCount} / {tasks.length}</span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>SYNCED</span>
        </span>
      </div>
    </div>
  );
}

export const ChecklistCard = React.memo(ChecklistCardComponent);
