import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Download, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * @typedef {Object} QuickActionsProps
 * @property {function} [onAddLead] - Custom callback function triggered when the user clicks 'Add New Lead'. If omitted, navigates to the leads page.
 * @property {function} [onViewLeads] - Custom callback function triggered when the user clicks 'View All Leads'. If omitted, navigates to the leads page.
 * @property {function} [onExport] - Custom callback function triggered when the user clicks 'Export Data'. If omitted, simulates CSV download with a toast.
 */

/**
 * QuickActions renders a card displaying premium operational action triggers.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 *
 * @param {QuickActionsProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered QuickActions component.
 */
export default function QuickActions({ onAddLead, onViewLeads, onExport }) {
  const navigate = useNavigate();

  const handleAddLead = () => {
    if (onAddLead) {
      onAddLead();
    } else {
      navigate('/leads');
    }
  };

  const handleViewLeads = () => {
    if (onViewLeads) {
      onViewLeads();
    } else {
      navigate('/leads');
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      const toastId = toast.loading('Compiling workspace pipelines...');

      setTimeout(() => {
        toast.success('CRM Database exported successfully! (crm_leads_export.csv)', {
          id: toastId,
          icon: '📥',
          duration: 3500
        });
      }, 1200);
    }
  };

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      {/* Component Title and description header */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-txt-main">Workspace Operations</h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </div>
        <p className="text-xs text-txt-sub">Quick-access triggers for CRM execution.</p>
      </div>

      {/* Button Layout Grid */}
      <div className="flex flex-col gap-3 justify-center">
        {/* Action Button 1: Add New Lead - bg-primary */}
        <button
          onClick={handleAddLead}
          className="w-full px-4 py-3 flex items-center justify-between gap-3 text-sm font-semibold rounded-xl text-white bg-primary hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <Plus className="w-4.5 h-4.5" />
            <span>Add New Lead</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 opacity-60" />
        </button>

        {/* Action Button 2: View All Leads - bg-bg-base */}
        <button
          onClick={handleViewLeads}
          className="w-full px-4 py-3 flex items-center justify-start gap-3 text-sm font-semibold rounded-xl text-txt-main bg-bg-base border border-border-subtle hover:bg-bg-base/80 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4.5 h-4.5 text-txt-sub" />
            <span>View Leads Database</span>
          </div>
        </button>

        {/* Action Button 3: Export Data - bg-bg-base */}
        <button
          onClick={handleExport}
          className="w-full px-4 py-3 flex items-center justify-start gap-3 text-sm font-semibold rounded-xl text-txt-main bg-bg-base border border-border-subtle hover:bg-bg-base/80 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <Download className="w-4.5 h-4.5 text-txt-sub" />
            <span>Export Pipeline (CSV)</span>
          </div>
        </button>
      </div>

      {/* Mini Brand Footer Tag */}
      <div className="mt-5 pt-3 border-t border-border-subtle text-[10px] text-txt-sub font-mono tracking-wider text-center">
        READY FOR INTEGRATIONS
      </div>
    </div>
  );
}
