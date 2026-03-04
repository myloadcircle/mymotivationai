/**
 * CRM Integration Module for MotivationAI
 * 
 * This module provides integration with popular CRM platforms for lead tracking,
 * contact management, and sales pipeline automation.
 */

export interface Lead {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: 'qr_code' | 'social_share' | 'app_signup' | 'website' | 'referral' | 'event' | 'other';
  sourceDetails?: {
    campaignId?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    referrer?: string;
    landingPage?: string;
    platform?: string;
    contentId?: string;
    referralCode?: string;
    [key: string]: any;
  };
  tags?: string[];
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CRMConfig {
  provider: 'hubspot' | 'salesforce' | 'zoho' | 'pipedrive' | 'custom';
  apiKey?: string;
  apiUrl?: string;
  webhookUrl?: string;
  syncEnabled: boolean;
  syncInterval?: number; // in minutes
}

export interface SyncResult {
  success: boolean;
  leadsSynced: number;
  errors: string[];
  timestamp: Date;
}

class CRMIntegration {
  private config: CRMConfig;
  private isInitialized = false;

  constructor(config: CRMConfig) {
    this.config = config;
  }

  /**
   * Initialize the CRM integration
   */
  async initialize(): Promise<boolean> {
    try {
      if (!this.config.syncEnabled) {
        console.log('CRM sync is disabled in configuration');
        this.isInitialized = true;
        return true;
      }

      // Validate configuration based on provider
      switch (this.config.provider) {
        case 'hubspot':
          if (!this.config.apiKey) {
            throw new Error('HubSpot integration requires an API key');
          }
          break;
        case 'salesforce':
          if (!this.config.apiUrl || !this.config.apiKey) {
            throw new Error('Salesforce integration requires API URL and key');
          }
          break;
        case 'custom':
          if (!this.config.webhookUrl) {
            throw new Error('Custom integration requires a webhook URL');
          }
          break;
      }

      // Test connection
      await this.testConnection();
      
      this.isInitialized = true;
      console.log(`CRM integration initialized with ${this.config.provider}`);
      return true;
    } catch (error) {
      console.error('Failed to initialize CRM integration:', error);
      return false;
    }
  }

  /**
   * Test connection to CRM
   */
  private async testConnection(): Promise<boolean> {
    // Implementation would vary by provider
    switch (this.config.provider) {
      case 'hubspot':
        // Test HubSpot API connection
        return await this.testHubSpotConnection();
      case 'salesforce':
        // Test Salesforce API connection
        return await this.testSalesforceConnection();
      case 'custom':
        // Test webhook endpoint
        return await this.testWebhookConnection();
      default:
        return true; // For demo purposes
    }
  }

  private async testHubSpotConnection(): Promise<boolean> {
    // In a real implementation, this would make an API call to HubSpot
    return true;
  }

  private async testSalesforceConnection(): Promise<boolean> {
    // In a real implementation, this would make an API call to Salesforce
    return true;
  }

  private async testWebhookConnection(): Promise<boolean> {
    // In a real implementation, this would test the webhook endpoint
    return true;
  }

  /**
   * Create or update a lead in CRM
   */
  async syncLead(lead: Lead): Promise<SyncResult> {
    if (!this.isInitialized) {
      throw new Error('CRM integration not initialized. Call initialize() first.');
    }

    if (!this.config.syncEnabled) {
      return {
        success: true,
        leadsSynced: 0,
        errors: ['CRM sync is disabled'],
        timestamp: new Date()
      };
    }

    try {
      let result: boolean;
      
      switch (this.config.provider) {
        case 'hubspot':
          result = await this.syncToHubSpot(lead);
          break;
        case 'salesforce':
          result = await this.syncToSalesforce(lead);
          break;
        case 'zoho':
          result = await this.syncToZoho(lead);
          break;
        case 'pipedrive':
          result = await this.syncToPipedrive(lead);
          break;
        case 'custom':
          result = await this.syncToCustomWebhook(lead);
          break;
        default:
          throw new Error(`Unsupported CRM provider: ${this.config.provider}`);
      }

      return {
        success: result,
        leadsSynced: result ? 1 : 0,
        errors: result ? [] : ['Failed to sync lead'],
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        leadsSynced: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date()
      };
    }
  }

  /**
   * Sync multiple leads in batch
   */
  async syncLeadsBatch(leads: Lead[]): Promise<SyncResult> {
    if (!this.isInitialized) {
      throw new Error('CRM integration not initialized. Call initialize() first.');
    }

    if (!this.config.syncEnabled) {
      return {
        success: true,
        leadsSynced: 0,
        errors: ['CRM sync is disabled'],
        timestamp: new Date()
      };
    }

    const results = await Promise.allSettled(
      leads.map(lead => this.syncLead(lead))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const errors = results
      .filter(r => r.status === 'rejected')
      .map(r => (r as PromiseRejectedResult).reason?.message || 'Unknown error');

    return {
      success: successful === leads.length,
      leadsSynced: successful,
      errors,
      timestamp: new Date()
    };
  }

  /**
   * Get lead status from CRM
   */
  async getLeadStatus(email: string): Promise<Lead['status'] | null> {
    if (!this.isInitialized) {
      throw new Error('CRM integration not initialized. Call initialize() first.');
    }

    // Implementation would query CRM for lead status
    // For demo, return a mock status
    const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'lost'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * Update lead status in CRM
   */
  async updateLeadStatus(email: string, status: Lead['status'], notes?: string): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('CRM integration not initialized. Call initialize() first.');
    }

    // Implementation would update lead in CRM
    console.log(`Updating lead ${email} to status: ${status}`);
    return true;
  }

  /**
   * Get leads by status
   */
  async getLeadsByStatus(status: Lead['status'], limit = 100): Promise<Lead[]> {
    if (!this.isInitialized) {
      throw new Error('CRM integration not initialized. Call initialize() first.');
    }

    // Implementation would query CRM for leads
    // Return mock data for demo
    return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      email: `lead${i + 1}@example.com`,
      firstName: `Lead${i + 1}`,
      lastName: `User${i + 1}`,
      source: 'app_signup' as const,
      status,
      createdAt: new Date(Date.now() - i * 86400000), // 1 day apart
      updatedAt: new Date()
    }));
  }

  // Provider-specific implementations
  private async syncToHubSpot(lead: Lead): Promise<boolean> {
    console.log('Syncing lead to HubSpot:', lead.email);
    // HubSpot API implementation would go here
    return true;
  }

  private async syncToSalesforce(lead: Lead): Promise<boolean> {
    console.log('Syncing lead to Salesforce:', lead.email);
    // Salesforce API implementation would go here
    return true;
  }

  private async syncToZoho(lead: Lead): Promise<boolean> {
    console.log('Syncing lead to Zoho:', lead.email);
    // Zoho API implementation would go here
    return true;
  }

  private async syncToPipedrive(lead: Lead): Promise<boolean> {
    console.log('Syncing lead to Pipedrive:', lead.email);
    // Pipedrive API implementation would go here
    return true;
  }

  private async syncToCustomWebhook(lead: Lead): Promise<boolean> {
    if (!this.config.webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'lead.created',
          data: lead,
          timestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Webhook sync failed:', error);
      return false;
    }
  }

  /**
   * Schedule automatic sync
   */
  scheduleSync(intervalMinutes: number = 60): NodeJS.Timeout | null {
    if (!this.config.syncEnabled) {
      console.log('CRM sync is disabled, not scheduling automatic sync');
      return null;
    }

    console.log(`Scheduling CRM sync every ${intervalMinutes} minutes`);
    
    return setInterval(async () => {
      console.log('Running scheduled CRM sync...');
      // In a real implementation, this would fetch unsynced leads and sync them
    }, intervalMinutes * 60 * 1000);
  }
}

// Singleton instance
let crmInstance: CRMIntegration | null = null;

/**
 * Get or create the CRM integration instance
 */
export function getCRMIntegration(config?: CRMConfig): CRMIntegration {
  if (!crmInstance) {
    if (!config) {
      throw new Error('CRM configuration required for first initialization');
    }
    crmInstance = new CRMIntegration(config);
  }
  return crmInstance;
}

/**
 * Default configuration from environment variables
 */
export function getDefaultCRMConfig(): CRMConfig {
  return {
    provider: (process.env.CRM_PROVIDER as CRMConfig['provider']) || 'custom',
    apiKey: process.env.CRM_API_KEY,
    apiUrl: process.env.CRM_API_URL,
    webhookUrl: process.env.CRM_WEBHOOK_URL,
    syncEnabled: process.env.CRM_SYNC_ENABLED === 'true',
    syncInterval: process.env.CRM_SYNC_INTERVAL ? parseInt(process.env.CRM_SYNC_INTERVAL) : 60
  };
}

/**
 * Utility function to track lead from various sources
 */
export async function trackLead(
  email: string,
  source: Lead['source'],
  sourceDetails?: Lead['sourceDetails'],
  metadata?: Record<string, any>
): Promise<SyncResult> {
  const lead: Lead = {
    email,
    source,
    sourceDetails,
    status: 'new',
    metadata,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    const crm = getCRMIntegration();
    return await crm.syncLead(lead);
  } catch (error) {
    console.error('Failed to track lead:', error);
    return {
      success: false,
      leadsSynced: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      timestamp: new Date()
    };
  }
}

/**
 * Lead enrichment service
 */
export async function enrichLead(email: string): Promise<Partial<Lead>> {
  // In a real implementation, this would use services like Clearbit or Hunter.io
  // For demo, return mock enriched data
  return {
    firstName: 'John',
    lastName: 'Doe',
    company: 'Example Corp',
    jobTitle: 'Software Engineer',
    tags: ['enriched', 'software_industry']
  };
}