import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

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
 * @typedef {Object} RevenueForecastCardProps
 * @property {Lead[]} leads - List of leads in the CRM database.
 */

/**
 * RevenueForecastCard calculates weighted forecasted revenues by status stage probabilities.
 * Displays forecasted close value charts grouped by month and confidence status overlays.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `border-border-subtle`, `text-txt-main`, etc.) for themes.
 *
 * @param {RevenueForecastCardProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered Revenue Forecast Card.
 */
export default function RevenueForecastCard({ leads = [] }) {
  
  // Pipeline stage probabilities mapping
  const PROBABILITIES = {
    'New': 10,
    'Contacted': 20,
    'Meeting Scheduled': 40,
    'Proposal Sent': 70,
    'Won': 100,
    'Lost': 0
  };

  // Forecast summaries calculation
  const stats = useMemo(() => {
    let totalUnweighted = 0;
    let totalWeighted = 0;
    let highProbabilityVolume = 0; // Won + Proposal volume

    leads.forEach(lead => {
      const prob = PROBABILITIES[lead.status] || 0;
      const val = lead.value || 0;
      
      if (lead.status !== 'Lost') {
        totalUnweighted += val;
        totalWeighted += (val * prob) / 100;
        
        if (prob >= 70) {
          highProbabilityVolume += val;
        }
      }
    });

    // Confidence Level: High if Proposal+Won make up >= 60% of total pipeline, Medium if 30%-60%, Low if < 30%
    const ratio = totalUnweighted > 0 ? (highProbabilityVolume / totalUnweighted) : 0;
    let confidence = 'Low Confidence';
    let confidenceColor = 'text-danger bg-danger/10';
    if (ratio >= 0.6) {
      confidence = 'High Confidence';
      confidenceColor = 'text-success bg-success/10';
    } else if (ratio >= 0.3) {
      confidence = 'Medium Confidence';
      confidenceColor = 'text-warning bg-warning/10';
    }

    return {
      unweighted: totalUnweighted,
      weighted: totalWeighted,
      confidence,
      confidenceColor
    };
  }, [leads]);

  // Projected forecast breakdown by month (3 months timeline projection)
  const chartData = useMemo(() => {
    const now = new Date();
    const dataBuckets = [];

    // Bucket current month + next 2 months
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      dataBuckets.push({
        name: label,
        monthKey,
        weighted: 0,
        unweighted: 0
      });
    }

    leads.forEach(lead => {
      if (lead.status === 'Lost') return;
      const createDate = lead.createdAt ? new Date(lead.createdAt) : now;
      
      // Project expected close date to be 30 days after creation
      const expectedClose = new Date(createDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const closeMonthKey = `${expectedClose.getFullYear()}-${String(expectedClose.getMonth() + 1).padStart(2, '0')}`;
      
      const prob = PROBABILITIES[lead.status] || 0;
      const val = lead.value || 0;
      const weightedValue = (val * prob) / 100;

      // Find matching bucket or default to the closest future bucket
      let bucket = dataBuckets.find(b => b.monthKey === closeMonthKey);
      if (!bucket) {
        // If it falls outside the 3 month projection, place in the latest month bucket
        bucket = dataBuckets[dataBuckets.length - 1];
      }

      if (bucket) {
        bucket.weighted += weightedValue;
        bucket.unweighted += val;
      }
    });

    return dataBuckets.map(b => ({
      name: b.name,
      'Weighted Pipeline': Math.round(b.weighted),
      'Total Pipeline': Math.round(b.unweighted)
    }));
  }, [leads]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    // Replaced hardcoded gray/white colors with theme tokens: bg-surface-card, border-border-subtle and text-txt-main
    <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between h-full transition-colors duration-200">
      
      {/* Component Title and confidence indicators */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-txt-main">Revenue Forecast</h3>
          <p className="text-xs text-txt-sub">Probability-weighted deal pipeline calculations.</p>
        </div>
        <div className="text-right">
          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${stats.confidenceColor}`}>
            {stats.confidence}
          </span>
        </div>
      </div>

      {/* Numerical calculations indicators */}
      <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-bg-base/40 border border-border-subtle/50 rounded-xl transition-colors duration-200">
        <div>
          <span className="text-[10px] uppercase font-mono font-medium text-txt-sub">Weighted Value</span>
          <h4 className="text-base font-extrabold text-primary flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-4.5 h-4.5" />
            <span>{formatCurrency(stats.weighted)}</span>
          </h4>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono font-medium text-txt-sub">Raw Pipeline Value</span>
          <h4 className="text-base font-extrabold text-txt-main mt-0.5">
            {formatCurrency(stats.unweighted)}
          </h4>
        </div>
      </div>

      {/* Projection Chart container */}
      <div className="h-44 w-full text-xs">
        {stats.unweighted > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
              <YAxis 
                stroke="var(--text-secondary)" 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  boxShadow: 'var(--shadow-md)'
                }}
                formatter={(value) => [formatCurrency(value)]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={20} 
                iconSize={10} 
                iconType="circle"
                wrapperStyle={{ fontSize: '9px', fontWeight: '600' }}
              />
              <Bar dataKey="Weighted Pipeline" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="Total Pipeline" fill="var(--text-muted)" opacity={0.3} radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-txt-sub text-center">
            <ShieldAlert className="w-8 h-8 text-primary/45 mb-2" />
            <span>No active pipeline to forecast</span>
          </div>
        )}
      </div>

    </div>
  );
}
