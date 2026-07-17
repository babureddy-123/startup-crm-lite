import React, { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import { Users, Percent, Clock, Award, Calendar, RefreshCw } from 'lucide-react';

// Import analytics components
import PieChartCard from '../components/analytics/PieChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import SalesFunnelCard from '../components/analytics/SalesFunnelCard';
import RevenueHistoryCard from '../components/analytics/RevenueHistoryCard';
import LeadSourcesCard from '../components/analytics/LeadSourcesCard';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import SalesActivityHeatmap from '../components/analytics/SalesActivityHeatmap';
import RevenueForecastCard from '../components/analytics/RevenueForecastCard';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';

// Import common components
import EmptyState from '../components/common/EmptyState';
import { getAvgTimeToClose } from '../utils/analyticsHelpers';

/**
 * Analytics page component acts as the CRM executive statistics center.
 * Displays summary KPIs and responsive chart visualizations using Recharts.
 * Configures mobile-first grid layouts.
 *
 * @returns {React.JSX.Element} Rendered Analytics dashboard view.
 */
export default function Analytics() {
  const { leads } = useLeads();

  // Date range filter states: 'this-month' | '3m' | '6m' | '12m' | 'custom'
  const [dateFilter, setDateFilter] = useState('6m');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // 1. Dynamic Filtering by selected Date Range
  const filteredLeads = useMemo(() => {
    const now = new Date();
    let startDate = null;

    switch (dateFilter) {
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '12m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        break;
      case 'custom':
        if (customStart) {
          startDate = new Date(customStart);
        }
        break;
      default:
        break;
    }

    return leads.filter(lead => {
      if (!lead.createdAt) return false;
      const d = new Date(lead.createdAt);

      if (startDate && d < startDate) return false;

      if (dateFilter === 'custom' && customEnd) {
        const endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
        if (d > endDate) return false;
      }
      return true;
    });
  }, [leads, dateFilter, customStart, customEnd]);

  // 2. Calculations based on filtered leads list
  const stats = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const wonCount = filteredLeads.filter(l => l.status === 'Won').length;
    const lostCount = filteredLeads.filter(l => l.status === 'Lost').length;
    const closedCount = wonCount + lostCount;
    const wonRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;
    const avgCloseTime = getAvgTimeToClose(filteredLeads);
    const totalWonValue = filteredLeads
      .filter(l => l.status === 'Won')
      .reduce((sum, l) => sum + (l.value || 0), 0);

    return {
      totalLeads,
      wonRate,
      avgCloseTime,
      totalWonValue
    };
  }, [filteredLeads]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleResetFilters = () => {
    setDateFilter('6m');
    setCustomStart('');
    setCustomEnd('');
  };

  return (
    <div className="space-y-6">
      
      {/* Page header and Date Filters row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-4 transition-colors duration-200">
        <div>
          <span className="text-xs text-primary font-mono font-semibold tracking-wider uppercase">
            Executive Analytics
          </span>
          <h2 className="text-xl font-bold text-txt-main leading-tight">
            CRM Intelligence Workspace
          </h2>
        </div>

        {/* Global Date Range selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-surface-card border border-border-subtle text-[11px] rounded-lg px-2.5 py-1.5 text-txt-main focus:outline-none focus:border-primary"
                aria-label="Start date filter"
              />
              <span className="text-xs text-txt-sub">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-surface-card border border-border-subtle text-[11px] rounded-lg px-2.5 py-1.5 text-txt-main focus:outline-none focus:border-primary"
                aria-label="End date filter"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-txt-sub shrink-0 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Range</span>
            </span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-surface-card border border-border-subtle text-xs rounded-lg px-3 py-1.5 text-txt-main focus:outline-none focus:border-primary cursor-pointer font-medium transition-colors duration-200"
            >
              <option value="this-month">This Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {leads.length > 0 ? (
        <>
          {filteredLeads.length > 0 ? (
            <>
              {/* 1. Summary Stats Cards Layout grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* KPI Card 1: Total Leads */}
                <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-txt-sub">
                      Total Leads
                    </span>
                    <h3 className="text-lg font-bold text-txt-main mt-0.5">
                      {stats.totalLeads}
                    </h3>
                  </div>
                </div>

                {/* KPI Card 2: Won Rate */}
                <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200">
                  <div className="p-3 rounded-lg bg-success/10 text-success">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-txt-sub">
                      Conversion Rate
                    </span>
                    <h3 className="text-lg font-bold text-txt-main mt-0.5">
                      {stats.wonRate}%
                    </h3>
                  </div>
                </div>

                {/* KPI Card 3: Closure Speed */}
                <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200">
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-605">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-txt-sub">
                      Avg Time to Won
                    </span>
                    <h3 className="text-lg font-bold text-txt-main mt-0.5 font-mono">
                      {stats.avgCloseTime} days
                    </h3>
                  </div>
                </div>

                {/* KPI Card 4: Total Won Revenue */}
                <div className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200">
                  <div className="p-3 rounded-lg bg-warning/10 text-warning">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-txt-sub">
                      Won Revenue
                    </span>
                    <h3 className="text-lg font-bold text-txt-main mt-0.5 font-mono">
                      {formatCurrency(stats.totalWonValue)}
                    </h3>
                  </div>
                </div>
              </div>

              {/* 2. Charts Visualizations Grid Section (Upgraded layout with 10 cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Lead Status Distribution card */}
                <PieChartCard leads={filteredLeads} />

                {/* 2. Monthly Leads card */}
                <BarChartCard leads={filteredLeads} />

                {/* 3. Conversion Rate Trend card */}
                <LineChartCard leads={filteredLeads} />

                {/* 4. Sales Funnel card */}
                <SalesFunnelCard leads={filteredLeads} />

                {/* 5. Won Revenue History card */}
                <RevenueHistoryCard leads={filteredLeads} />

                {/* 6. Lead Sources card */}
                <LeadSourcesCard leads={filteredLeads} />

                {/* 7. Top Performers card */}
                <TopPerformersCard leads={filteredLeads} />

                {/* 8. Sales Activity Heatmap card */}
                <SalesActivityHeatmap leads={filteredLeads} />

                {/* 9. Revenue Forecast card */}
                <RevenueForecastCard leads={filteredLeads} />

                {/* 10. Sales Velocity details card */}
                <SalesVelocityCard leads={filteredLeads} />

              </div>
            </>
          ) : (
            /* Empty state displayed if date range filters return no matching results */
            <div className="flex flex-col items-center justify-center p-8 bg-surface-card border border-border-subtle rounded-xl text-center">
              <span className="text-sm font-semibold text-txt-main mb-2">No matching leads in selected date range</span>
              <p className="text-xs text-txt-sub mb-4">Try choosing a wider duration or click reset below.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 flex items-center gap-1.5 text-xs font-semibold rounded-lg text-txt-main bg-bg-base border border-border-subtle hover:bg-bg-base/80 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty state view displayed if CRM has zero opportunities */
        <EmptyState totalLeadsCount={0} />
      )}
    </div>
  );
}
