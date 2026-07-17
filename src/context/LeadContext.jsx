import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import leadService from '../services/leadService';
import { useAuth } from './AuthContext';

const LeadContext = createContext(null);

/**
 * Normalizes a lead document returned from the backend API.
 * Ensures Mongoose ObjectIds (_id) map to front-end ids and string notes format safely into array lists.
 *
 * @param {Object} lead - Raw lead document.
 * @returns {Object} Cleaned, front-end compatible lead.
 */
function normalizeLead(lead) {
  return {
    ...lead,
    id: lead._id || lead.id,
    notes: typeof lead.notes === 'string'
      ? (lead.notes ? [{ id: `note-${lead._id || lead.id}`, text: lead.notes, date: lead.updatedAt || lead.createdAt }] : [])
      : (Array.isArray(lead.notes) ? lead.notes : [])
  };
}

/**
 * LeadProvider manages the active pipeline opportunities.
 * Connects directly to the REST API database endpoints.
 *
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - Child routes inside layout framework.
 * @returns {React.JSX.Element} Lead Context Provider wrapper.
 */
export function LeadProvider({ children }) {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });

  /**
   * Fetches pipeline leads list from server with active query filters.
   */
  const fetchLeads = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads(params);
      // getLeads returns { success: true, data: [...], pagination: { ... } }
      if (res && res.data) {
        const cleaned = res.data.map(normalizeLead);
        setLeads(cleaned);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to load leads from database';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatically sync pipeline leads when user session resolves/tokens change
  useEffect(() => {
    if (token) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [token, fetchLeads]);

  /**
   * Appends a new opportunity to the workspace.
   */
  const addLead = useCallback(async (leadData) => {
    setIsLoading(true);
    try {
      const res = await leadService.createLead(leadData);
      if (res && res.data) {
        const cleaned = normalizeLead(res.data);
        setLeads((prev) => [cleaned, ...prev]);
        toast.success('Lead created successfully');
        return cleaned;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create new lead';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Updates lead profile parameters.
   */
  const updateLead = useCallback(async (leadId, updatedFields) => {
    setIsLoading(true);
    try {
      const res = await leadService.updateLead(leadId, updatedFields);
      if (res && res.data) {
        const cleaned = normalizeLead(res.data);
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? cleaned : l))
        );
        toast.success('Lead updated successfully');
        return cleaned;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update lead details';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deletes a lead record.
   */
  const deleteLead = useCallback(async (leadId) => {
    setIsLoading(true);
    try {
      await leadService.deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      toast.success('Lead deleted successfully');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete lead from pipeline';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Helper retrieve method to grab individual lead data.
   */
  const getLeadById = useCallback((leadId) => {
    return leads.find((l) => l.id === leadId);
  }, [leads]);

  // Memoize lead context values
  const contextValue = useMemo(() => ({
    leads,
    isLoading,
    pagination,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    getLeadById
  }), [leads, isLoading, pagination, fetchLeads, addLead, updateLead, deleteLead, getLeadById]);

  return (
    <LeadContext.Provider value={contextValue}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom hook to consume the LeadContext.
 *
 * @returns {Object} Leads context state values and CRUD actions.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be called within an active LeadProvider boundary.');
  }
  return context;
}
export default LeadContext;
