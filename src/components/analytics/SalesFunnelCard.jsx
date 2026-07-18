import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

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
 * @typedef {Object} SalesFunnelCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * SalesFunnelCard displays opportunity conversion metrics.
 * Renders a visual SVG polygon-based funnel shape (trapezoids narrowing to a downward triangle)
 * alongside a detailed timeline index showing counts and drop-offs.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 *
 * @param {SalesFunnelCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Sales Funnel Card.
 */
export default function SalesFunnelCard({ leads = [] }) {
  
  // Calculate sequential funnel metrics dynamically
  const funnelData = useMemo(() => {
    const newCount = leads.length;
    const contactedCount = leads.filter(l => ['Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'].includes(l.status)).length;
    const meetingCount = leads.filter(l => ['Meeting Scheduled', 'Proposal Sent', 'Won'].includes(l.status)).length;
    const proposalCount = leads.filter(l => ['Proposal Sent', 'Won'].includes(l.status)).length;
    const wonCount = leads.filter(l => l.status === 'Won').length;

    const stages = [
      { id: 'new', name: 'New', count: newCount },
      { id: 'contacted', name: 'Contacted', count: contactedCount },
      { id: 'meeting', name: 'Meeting', count: meetingCount },
      { id: 'proposal', name: 'Proposal', count: proposalCount },
      { id: 'won', name: 'Won', count: wonCount }
    ];

    return stages.map((stage, idx) => {
      const conversion = newCount > 0 ? Math.round((stage.count / newCount) * 100) : 0;
      
      let dropoff = 0;
      if (idx > 0) {
        const prevCount = stages[idx - 1].count;
        dropoff = prevCount > 0 ? Math.round(((prevCount - stage.count) / prevCount) * 100) : 0;
      }

      return {
        ...stage,
        conversion,
        dropoff
      };
    });
  }, [leads]);

  const totalLeads = leads.length;

  return (
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      
      {/* Title Header */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-txt-main">Sales Funnel</h3>
        <p className="text-xs text-txt-sub">Pipeline stage conversion and drop-off analysis.</p>
      </div>

      {totalLeads > 0 ? (
        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 flex-1">
          
          {/* Left side: Premium SVG Funnel Geometry */}
          <div className="w-full sm:w-1/2 flex justify-center shrink-0">
            <svg 
              viewBox="0 0 220 200" 
              className="w-full max-w-[190px] drop-shadow-sm overflow-visible"
              aria-label="SVG Sales Funnel Visualization"
            >
              {/* New (Muted Ocean Trapezoid) */}
              <polygon 
                points="20,10 200,10 195,45 25,45" 
                fill="#6A93A1" 
                className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer" 
              />
              
              {/* Contacted (Primary Ocean) */}
              <polygon 
                points="25,45 195,45 155,80 65,80" 
                fill="#007C91" 
                className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer" 
              />
              
              {/* Meeting Scheduled (Accent Coral) */}
              <polygon 
                points="65,80 155,80 155,115 65,115" 
                fill="#FF8C61" 
                className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer" 
              />
              
              {/* Proposal Sent (Secondary Aqua) */}
              <polygon 
                points="65,115 155,115 155,150 65,150" 
                fill="#3AA5B8" 
                className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer" 
              />
              
              {/* Won (Success Emerald Triangle) */}
              <polygon 
                points="65,150 155,150 110,185" 
                fill="#00A884" 
                className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer" 
              />
            </svg>
          </div>

          {/* Right side: Legend and timeline metrics */}
          <div className="w-full sm:w-1/2 flex gap-4 text-[11px] justify-between h-full items-start py-2">
            
            {/* Stages Legend */}
            <div className="flex-1 space-y-4">
              {funnelData.map((step) => (
                <div key={step.id} className="flex items-start gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${
                    step.id === 'new' ? 'bg-[#6A93A1]' :
                    step.id === 'contacted' ? 'bg-[#007C91]' :
                    step.id === 'meeting' ? 'bg-[#FF8C61]' :
                    step.id === 'proposal' ? 'bg-[#3AA5B8]' : 'bg-[#00A884]'
                  }`} />
                  <div>
                    <p className="font-bold text-txt-main leading-tight">{step.name}</p>
                    <p className="text-[9px] text-txt-sub mt-0.5">Conv: {step.conversion}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vertical timeline metric listing */}
            <div className="w-24 sm:w-28 shrink-0 border-l border-border-subtle pl-4 relative space-y-[21px] py-1.5 transition-colors duration-200">
              {funnelData.map((step, idx) => (
                <div key={step.id} className="relative">
                  {/* Timeline indicator bullet */}
                  <span className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-border-subtle border border-surface-card" />
                  
                  <div>
                    <p className="font-bold text-txt-main leading-none">{step.count} Leads</p>
                    {idx > 0 ? (
                      <p className="text-[9px] font-semibold text-danger mt-0.5 leading-none">Drop: {step.dropoff}%</p>
                    ) : (
                      <p className="text-[9px] font-semibold text-txt-sub mt-0.5 leading-none">Inflow</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
          
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-txt-sub">
          <Sparkles className="w-8 h-8 text-primary/45 mb-2" />
          <span className="text-xs font-semibold">No funnel details registered</span>
        </div>
      )}

    </div>
  );
}
