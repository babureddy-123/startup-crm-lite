import React, { useMemo } from 'react';
import { Award, Users, TrendingUp, Sparkles } from 'lucide-react';

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
 * @typedef {Object} TopPerformersCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * TopPerformersCard component displays a ranked table listing performance indicators by owner/sales rep.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {TopPerformersCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Top Performers Card.
 */
export default function TopPerformersCard({ leads = [] }) {
  
  // Dynamic performance leaderboard calculation
  const performers = useMemo(() => {
    // Collect unique owners from the active leads database
    const uniqueOwners = Array.from(new Set(leads.map(l => l.owner).filter(Boolean)));
    
    if (uniqueOwners.length === 0) return [];

    // Map rep details
    const reps = uniqueOwners.map(owner => {
      const repLeads = leads.filter(l => l.owner === owner);
      const totalCount = repLeads.length;
      const wonLeads = repLeads.filter(l => l.status === 'Won');
      const wonCount = wonLeads.length;
      const conversion = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0;
      const revenue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);

      return {
        name: owner,
        totalLeads: totalCount,
        wonDeals: wonCount,
        conversionRate: conversion,
        revenue
      };
    });

    // Rank sales reps by revenue generated (closed won deal sum), descending
    return reps.sort((a, b) => b.revenue - a.revenue);
  }, [leads]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Mock avatar pictures linked by owner name key
  const avatars = {
    'Anish Reddy': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    'Rohith Nair': 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
    'Sarah Connor': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    'Sarah Connor ': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80'
  };

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      
      {/* Header section */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-txt-main">Top Performers</h3>
        <p className="text-xs text-txt-sub">Sales performance metrics grouped by lead assignment.</p>
      </div>

      {/* Leaderboard table viewport */}
      <div className="overflow-x-auto flex-1">
        {performers.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle text-txt-sub uppercase tracking-wider font-semibold text-[10px] transition-colors duration-200">
                <th className="pb-2 text-center w-10">Rank</th>
                <th className="pb-2">Representative</th>
                <th className="pb-2 text-center">Leads</th>
                <th className="pb-2 text-center">Deals</th>
                <th className="pb-2 text-center">Conv. %</th>
                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {performers.map((rep, index) => {
                const rank = index + 1;
                const avatarUrl = avatars[rep.name.trim()] || null;
                const initials = rep.name.split(' ').map(n => n[0]).join('').substring(0, 2);

                return (
                  <tr 
                    key={rep.name}
                    className="border-b border-border-subtle/50 last:border-0 hover:bg-bg-base/30 transition-colors"
                  >
                    {/* Rank medal display */}
                    <td className="py-3 text-center">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-500/10 text-amber-500 rounded-full font-bold">
                          🥇
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-slate-300/20 text-slate-500 rounded-full font-bold">
                          🥈
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-305/10 text-orange-500 rounded-full font-bold">
                          🥉
                        </span>
                      ) : (
                        <span className="font-mono text-txt-sub font-bold">{rank}</span>
                      )}
                    </td>

                    {/* Sales Representative Avatar and Name */}
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        {avatarUrl ? (
                          <img 
                            className="w-7 h-7 rounded-full object-cover border border-border-subtle shrink-0" 
                            src={avatarUrl} 
                            alt={`${rep.name} avatar`} 
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                            {initials}
                          </div>
                        )}
                        <span className="font-bold text-txt-main truncate">{rep.name}</span>
                      </div>
                    </td>

                    <td className="py-3 text-center text-txt-sub font-medium">
                      {rep.totalLeads}
                    </td>

                    <td className="py-3 text-center text-txt-sub font-semibold">
                      {rep.wonDeals}
                    </td>

                    <td className="py-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        rep.conversionRate >= 40
                          ? 'text-success bg-success/10'
                          : rep.conversionRate > 0
                          ? 'text-primary bg-primary/10'
                          : 'text-txt-sub bg-bg-base'
                      }`}>
                        {rep.conversionRate}%
                      </span>
                    </td>

                    <td className="py-3 text-right font-mono font-bold text-txt-main">
                      {formatCurrency(rep.revenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-txt-sub">
            <Sparkles className="w-8 h-8 text-primary/45 mb-2" />
            <span className="text-xs font-semibold">No performance rankings available</span>
          </div>
        )}
      </div>

    </div>
  );
}
