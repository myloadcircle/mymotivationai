import { useState, useCallback } from 'react';
import { Lead, SyncResult, trackLead } from '@/lib/crm-integration';

interface UseCRMReturn {
  // State
  loading: boolean;
  error: string | null;
  leads: Lead[];
  
  // Actions
  createLead: (lead: Omit<Lead, 'createdAt' | 'updatedAt'>) => Promise<SyncResult>;
  updateLeadStatus: (email: string, status: Lead['status'], notes?: string) => Promise<boolean>;
  getLeadsByStatus: (status: Lead['status'], limit?: number) => Promise<Lead[]>;
  getLeadStatus: (email: string) => Promise<Lead['status'] | null>;
  trackLeadFromSource: (
    email: string, 
    source: Lead['source'], 
    sourceDetails?: Lead['sourceDetails']
  ) => Promise<SyncResult>;
  
  // Utilities
  clearError: () => void;
}

export function useCRM(): UseCRMReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const clearError = useCallback(() => setError(null), []);

  const createLead = useCallback(async (lead: Omit<Lead, 'createdAt' | 'updatedAt'>): Promise<SyncResult> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });

      if (!response.ok) {
        throw new Error(`Failed to create lead: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Add to local state
        setLeads(prev => [...prev, result.lead]);
      }

      return result.syncResult || { success: result.success, leadsSynced: 1, errors: [], timestamp: new Date() };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return {
        success: false,
        leadsSynced: 0,
        errors: [errorMessage],
        timestamp: new Date()
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const updateLeadStatus = useCallback(async (
    email: string, 
    status: Lead['status'], 
    notes?: string
  ): Promise<boolean> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch('/api/crm/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, status, notes }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update lead: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update in local state
        setLeads(prev => prev.map(lead => 
          lead.email === email 
            ? { ...lead, status, updatedAt: new Date() }
            : lead
        ));
      }

      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getLeadsByStatus = useCallback(async (
    status: Lead['status'] = 'new', 
    limit: number = 100
  ): Promise<Lead[]> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/crm/leads?status=${status}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.statusText}`);
      }

      const result = await response.json();
      const fetchedLeads = result.leads || [];
      
      // Update local state
      setLeads(prev => {
        const existingEmails = new Set(prev.map(l => l.email));
        const newLeads = fetchedLeads.filter((l: Lead) => !existingEmails.has(l.email));
        return [...prev, ...newLeads];
      });

      return fetchedLeads;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getLeadStatus = useCallback(async (email: string): Promise<Lead['status'] | null> => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/crm/leads?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lead status: ${response.statusText}`);
      }

      const result = await response.json();
      return result.status || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const trackLeadFromSource = useCallback(async (
    email: string, 
    source: Lead['source'], 
    sourceDetails?: Lead['sourceDetails']
  ): Promise<SyncResult> => {
    setLoading(true);
    clearError();

    try {
      // Use the utility function from crm-integration
      const result = await trackLead(email, source, sourceDetails);
      
      if (result.success) {
        // Also add to local state
        const newLead: Lead = {
          email,
          source,
          sourceDetails,
          status: 'new',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setLeads(prev => [...prev, newLead]);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return {
        success: false,
        leadsSynced: 0,
        errors: [errorMessage],
        timestamp: new Date()
      };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  return {
    // State
    loading,
    error,
    leads,
    
    // Actions
    createLead,
    updateLeadStatus,
    getLeadsByStatus,
    getLeadStatus,
    trackLeadFromSource,
    
    // Utilities
    clearError,
  };
}

// Hook for tracking leads from specific sources
export function useLeadTracker() {
  const [tracking, setTracking] = useState(false);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);

  const trackQRCodeLead = useCallback(async (
    email: string,
    campaignId?: string,
    utmParams?: { source?: string; medium?: string; campaign?: string }
  ) => {
    setTracking(true);
    
    const sourceDetails = {
      campaignId,
      utmSource: utmParams?.source,
      utmMedium: utmParams?.medium,
      utmCampaign: utmParams?.campaign,
      source: 'qr_code'
    };

    const result = await trackLead(email, 'qr_code', sourceDetails);
    setLastResult(result);
    setTracking(false);
    
    return result;
  }, []);

  const trackSocialShareLead = useCallback(async (
    email: string,
    platform: string,
    contentId?: string
  ) => {
    setTracking(true);
    
    const sourceDetails = {
      platform,
      contentId,
      source: 'social_share'
    };

    const result = await trackLead(email, 'social_share', sourceDetails);
    setLastResult(result);
    setTracking(false);
    
    return result;
  }, []);

  const trackAppSignupLead = useCallback(async (email: string, referralCode?: string) => {
    setTracking(true);
    
    const sourceDetails = {
      referralCode,
      source: 'app_signup'
    };

    const result = await trackLead(email, 'app_signup', sourceDetails);
    setLastResult(result);
    setTracking(false);
    
    return result;
  }, []);

  return {
    tracking,
    lastResult,
    trackQRCodeLead,
    trackSocialShareLead,
    trackAppSignupLead,
  };
}