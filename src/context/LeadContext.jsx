import React, { createContext, useContext, useCallback, useMemo } from 'react';
// Import the custom local storage hook to manage state persistence
import { useLocalStorage } from '../hooks/useLocalStorage';
// Import the realistic seed dataset containing 6 Indian client records
import { sampleLeads } from '../data/sampleLeads';

/**
 * Shape of the Lead Object:
 * 
 * interface Lead {
 *   id: string;
 *   name: string;
 *   company: string;
 *   email: string;
 *   phone: string;
 *   status: 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost';
 *   source: 'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other';
 *   value?: number;
 *   owner?: string;
 *   notes?: Array<{ id: string; text: string; date: string }>;
 *   createdAt: string; // ISO date string
 * }
 */

// Create the Context Object for leads state management.
export const LeadContext = createContext();

/**
 * LeadProvider component initializes leads state within local storage
 * and shares CRUD handler actions with child components.
 * Optimizes references with useCallback and useMemo to prevent consumer re-renders.
 *
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - Child nodes to wrap.
 * @returns {React.JSX.Element} The context Provider layout.
 */
export function LeadProvider({ children }) {
  // Use useLocalStorage hook to bind context leads state to 'startup-crm-leads' key in localStorage, defaulting to sampleLeads
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);

  /**
   * Adds a new lead profile to the state and synchronizes localStorage.
   * Generates a unique UUID and appends the ISO createdAt timestamp automatically.
   * Memoized using useCallback to stabilize its functional reference.
   */
  const addLead = useCallback((leadData) => {
    // Generate UUID. Fall back to Date.now() string if crypto API is unavailable.
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `lead-${Date.now()}`;

    const newLead = {
      id: uniqueId,
      name: leadData.name,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone || '',
      status: leadData.status || 'New',
      source: leadData.source || 'Other',
      value: Number(leadData.value) || 0,
      owner: leadData.owner || 'Anish Reddy',
      notes: leadData.notes ? [{ id: `note-${Date.now()}`, text: leadData.notes, date: new Date().toISOString() }] : [],
      createdAt: new Date().toISOString() // Automatic ISO timestamp generation
    };

    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, [setLeads]);

  /**
   * Updates an existing lead record by ID with changed parameter values.
   * Memoized using useCallback to stabilize its functional reference.
   */
  const updateLead = useCallback((leadId, updatedFields) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, ...updatedFields } : lead))
    );
  }, [setLeads]);

  /**
   * Deletes a lead record by ID from the pipeline state.
   * Memoized using useCallback to stabilize its functional reference.
   */
  const deleteLead = useCallback((leadId) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
  }, [setLeads]);

  /**
   * Retrieves a single lead object from the state.
   * Memoized using useCallback, dependent on the active leads state array.
   */
  const getLeadById = useCallback((leadId) => {
    return leads.find((lead) => lead.id === leadId);
  }, [leads]);

  /**
   * Appends an activity note record to a specific lead profile.
   * Memoized using useCallback to stabilize its functional reference.
   */
  const addNote = useCallback((leadId, noteText) => {
    const newNote = {
      id: `note-${Date.now()}`,
      text: noteText,
      date: new Date().toISOString()
    };
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            notes: lead.notes ? [...lead.notes, newNote] : [newNote]
          };
        }
        return lead;
      })
    );
  }, [setLeads]);

  // Memoize the value distributed to the provider to avoid triggering re-renders of all consumer nodes
  const contextValue = useMemo(() => ({
    leads,
    addLead,
    updateLead,
    deleteLead,
    getLeadById,
    addNote
  }), [leads, addLead, updateLead, deleteLead, getLeadById, addNote]);

  return (
    // Distribute memoized state values and CRUD functions to context consumers
    <LeadContext.Provider value={contextValue}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom hook to consume the LeadContext.
 * Asserts that the consumer resides within a LeadProvider block.
 *
 * @returns {Object} Leads context state values and CRUD actions.
 * @throws {Error} Throws descriptive error if used outside LeadProvider.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be called within an active LeadProvider boundary.');
  }
  return context;
}
