import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Import context leads hook to perform CRUD functions
import { useLeads } from '../context/LeadContext';
// Import common subcomponents: search, filter, empty states
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
// Import lead-specific layouts: cards, tables, forms
import LeadTable from '../components/leads/LeadTable';
import LeadCard from '../components/leads/LeadCard';
import LeadForm from '../components/leads/LeadForm';
// Import Lucide React icons for controls
import { LayoutGrid, Table, Plus, X } from 'lucide-react';
// Import React Hot Toast to trigger popups
import { toast } from 'react-hot-toast';

/**
 * Leads page component manages CRM opportunities.
 * Uses dynamic variables/theme tokens (`bg-surface-card`, `bg-bg-base`, `border-border-subtle`, etc.) for themes.
 *
 * @returns {React.JSX.Element} Rendered leads page.
 */
export default function Leads() {
  const { leads, fetchLeads, addLead, updateLead, deleteLead } = useLeads();

  // Automatically fetch fresh leads list on component mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Page layout and interactive modal states
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // holds lead if modifying, null if creating
  const [sortCriteria, setSortCriteria] = useState('newest'); // 'newest' | 'oldest' | 'value-high' | 'value-low'

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('All');
    setSortCriteria('newest');
    toast.success('Filters reset successfully');
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLead(null);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      if (selectedLead) {
        await updateLead(selectedLead.id, formData);
      } else {
        await addLead(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Failed to submit lead details:', err);
    }
  }, [selectedLead, addLead, updateLead, handleCloseModal]);

  const handleEditClick = useCallback((lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    const confirmed = window.confirm(`Are you sure you want to permanently delete lead ${lead ? lead.name : ''}?`);
    
    if (confirmed) {
      deleteLead(leadId);
      toast.error(`Deleted lead: ${lead ? lead.name : ''}`, {
        icon: '🗑️'
      });
    }
  }, [leads, deleteLead]);

  const handleAddClick = useCallback(() => {
    setSelectedLead(null);
    setIsModalOpen(true);
  }, []);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Match status filter
        if (activeFilter !== 'All' && lead.status !== activeFilter) {
          return false;
        }
        
        // Match case-insensitive search text query
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        const nameMatch = lead.name?.toLowerCase().includes(query);
        const companyMatch = lead.company?.toLowerCase().includes(query);
        const emailMatch = lead.email?.toLowerCase().includes(query);

        return nameMatch || companyMatch || emailMatch;
      })
      .sort((a, b) => {
        switch (sortCriteria) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'value-high':
            return (b.value || 0) - (a.value || 0);
          case 'value-low':
            return (a.value || 0) - (b.value || 0);
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [leads, searchQuery, activeFilter, sortCriteria]);

  return (
    <div className="space-y-6">
      {/* Workspace Leads header area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-primary font-mono font-semibold tracking-wider uppercase">
            Leads Management
          </span>
          <h2 className="text-xl font-bold text-txt-main leading-tight">
            Opportunities Pipeline
          </h2>
        </div>

        {/* View toggle and Add Lead controls */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          {/* View mode toggle */}
          <div className="hidden md:flex lg:hidden items-center bg-bg-base border border-border-subtle p-0.5 rounded-lg shadow-inner transition-colors duration-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer transition-all duration-150 ${
                viewMode === 'grid'
                  ? 'bg-surface-card shadow-sm text-primary font-bold'
                  : 'text-txt-sub hover:text-txt-main'
              }`}
              title="Grid View Layout"
              aria-label="Toggle Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md cursor-pointer transition-all duration-150 ${
                viewMode === 'table'
                  ? 'bg-surface-card shadow-sm text-primary font-bold'
                  : 'text-txt-sub hover:text-txt-main'
              }`}
              title="Table View Layout"
              aria-label="Toggle Table view"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          {/* Add New Lead button - bg-primary */}
          <button
            onClick={handleAddClick}
            className="w-full sm:w-auto px-4 py-3 md:py-2.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* 1. Global Filter Panel */}
      <div className="flex flex-col gap-4 bg-surface-card p-4 border border-border-subtle rounded-xl shadow-sm transition-colors duration-200">
        
        {/* Row 1: Search input and sort drop-down */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Sorting Dropdown container */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <label htmlFor="sort-criteria-select" className="text-[10px] uppercase font-mono tracking-wider font-semibold text-txt-sub shrink-0">
              Sort By
            </label>
            <select
              id="sort-criteria-select"
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className="bg-bg-base border border-border-subtle text-xs rounded-lg px-2.5 py-3 md:py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-txt-main cursor-pointer w-full md:w-auto font-medium transition-colors duration-200"
            >
              <option value="newest">Newest Added</option>
              <option value="oldest">Oldest Added</option>
              <option value="value-high">Valuation: High to Low</option>
              <option value="value-low">Valuation: Low to High</option>
            </select>
          </div>
        </div>

        {/* Row 2: Horizontal Scrollable Status Filter Buttons */}
        <div className="border-t border-border-subtle/50 pt-3">
          <FilterBar 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
            leads={leads} 
          />
        </div>
      </div>

      {/* 2. Opportunities Responsive Mapped Viewports */}
      <div id="leads-viewport">
        {filteredLeads.length > 0 ? (
          <>
            {/* Mobile Viewport */}
            <div className="md:hidden space-y-4">
              {filteredLeads.map((lead) => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteClick} 
                />
              ))}
            </div>

            {/* Tablet Viewport */}
            <div className="hidden md:block lg:hidden">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredLeads.map((lead) => (
                    <LeadCard 
                      key={lead.id} 
                      lead={lead} 
                      onEdit={handleEditClick} 
                      onDelete={handleDeleteClick} 
                    />
                  ))}
                </div>
              ) : (
                <LeadTable 
                  leads={filteredLeads} 
                  onEdit={handleEditClick} 
                  onDelete={handleDeleteClick} 
                />
              )}
            </div>

            {/* Desktop Viewport */}
            <div className="hidden lg:block">
              <LeadTable 
                leads={filteredLeads} 
                onEdit={handleEditClick} 
                onDelete={handleDeleteClick} 
              />
            </div>
          </>
        ) : (
          <EmptyState 
            totalLeadsCount={leads.length} 
            onClear={handleClearFilters} 
          />
        )}
      </div>

      {/* 3. CRUD modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm animate-fade-in duration-200"
            onClick={handleCloseModal}
          />
          
          <div className="relative w-full h-full md:h-auto md:max-w-lg bg-surface-card border border-border-subtle md:rounded-xl shadow-2xl z-10 overflow-y-auto p-6 md:p-8 transition-colors duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-lg text-txt-sub hover:text-txt-main hover:bg-bg-base cursor-pointer transition-all focus:outline-none"
              title="Close modal window"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <LeadForm 
              initialData={selectedLead} 
              onSubmit={handleFormSubmit} 
              onCancel={handleCloseModal} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
