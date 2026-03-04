'use client';

import { useState, useEffect } from 'react';
import { useCRM } from '@/hooks/useCRM';
import { 
  Users, 
  Mail, 
  Phone, 
  Building, 
  Filter, 
  Search, 
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface LeadStatusCardProps {
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  count: number;
  color: string;
  icon: React.ReactNode;
}

function LeadStatusCard({ status, count, color, icon }: LeadStatusCardProps) {
  const statusLabels = {
    new: 'New Leads',
    contacted: 'Contacted',
    qualified: 'Qualified',
    converted: 'Converted',
    lost: 'Lost'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{statusLabels[status]}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function CRMDashboard() {
  const { 
    loading, 
    error, 
    leads, 
    getLeadsByStatus, 
    updateLeadStatus,
    clearError 
  } = useCRM();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Calculate lead counts by status
  const leadCounts = {
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    lost: leads.filter(l => l.status === 'lost').length,
  };

  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 
    ? ((leadCounts.converted / totalLeads) * 100).toFixed(1)
    : '0.0';

  // Filter leads based on selected status and search term
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Load leads on component mount
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    await getLeadsByStatus('new', 50);
    await getLeadsByStatus('contacted', 50);
    await getLeadsByStatus('qualified', 50);
    await getLeadsByStatus('converted', 50);
    await getLeadsByStatus('lost', 50);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeads();
    setRefreshing(false);
  };

  const handleStatusChange = async (email: string, newStatus: string) => {
    await updateLeadStatus(email, newStatus as any);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'qr_code': return 'bg-blue-50 text-blue-700';
      case 'social_share': return 'bg-purple-50 text-purple-700';
      case 'app_signup': return 'bg-green-50 text-green-700';
      case 'website': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="font-medium text-red-800">Error Loading CRM Data</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={clearError}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CRM Lead Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Track and manage your leads across all channels
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <LeadStatusCard
              status="new"
              count={leadCounts.new}
              color="bg-blue-100"
              icon={<Clock className="h-6 w-6 text-blue-600" />}
            />
            <LeadStatusCard
              status="contacted"
              count={leadCounts.contacted}
              color="bg-yellow-100"
              icon={<Mail className="h-6 w-6 text-yellow-600" />}
            />
            <LeadStatusCard
              status="qualified"
              count={leadCounts.qualified}
              color="bg-purple-100"
              icon={<Users className="h-6 w-6 text-purple-600" />}
            />
            <LeadStatusCard
              status="converted"
              count={leadCounts.converted}
              color="bg-green-100"
              icon={<CheckCircle className="h-6 w-6 text-green-600" />}
            />
            <LeadStatusCard
              status="lost"
              count={leadCounts.lost}
              color="bg-red-100"
              icon={<XCircle className="h-6 w-6 text-red-600" />}
            />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-sm opacity-90">Total Leads</p>
                  <p className="text-3xl font-bold">{totalLeads}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-sm opacity-90">Conversion Rate</p>
                  <p className="text-3xl font-bold">{conversionRate}%</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 mr-4" />
                <div>
                  <p className="text-sm opacity-90">Active Campaigns</p>
                  <p className="text-3xl font-bold">
                    {new Set(leads.map(l => l.sourceDetails?.campaignId).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">Leads</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by lead status"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        {lead.company && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Building className="h-3 w-3 mr-1" />
                            {lead.company}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {lead.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.jobTitle && (
                          <div className="text-sm text-gray-600">{lead.jobTitle}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                        {lead.source.replace('_', ' ')}
                      </span>
                      {lead.sourceDetails?.campaignId && (
                        <div className="text-xs text-gray-500 mt-1">
                          Campaign: {lead.sourceDetails.campaignId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.email, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(lead.status)}`}
                        aria-label={`Change status for ${lead.email}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                      {lead.createdAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`mailto:${lead.email}`)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"
                        >
                          Email
                        </button>
                        <button
                          onClick={() => {/* View details */}}
                          className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm hover:bg-gray-100"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No leads have been tracked yet'}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {(loading || refreshing) && filteredLeads.length === 0 && (
            <div className="p-12 text-center">
              <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading leads...</p>
            </div>
          )}
        </div>

        {/* Source Breakdown */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Lead Sources</h3>
            <div className="space-y-4">
              {Object.entries(
                leads.reduce((acc, lead) => {
                  acc[lead.source] = (acc[lead.source] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getSourceColor(source)}`}></div>
                    <span className="text-sm text-gray-700 capitalize">
                      {source.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 mr-2">{count}</span>
                    <span className="text-sm text-gray-500">
                      ({((count / totalLeads) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100">
                Export Leads to CSV
              </button>
              <button className="w-full py-3 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100">
                Sync with CRM
              </button>
              <button className="w-full py-3 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100">
                Create Email Campaign
              </button>
              <button className="w-full py-3 bg-gray-50 text-gray-600 rounded-lg font-medium hover:bg-gray-100">
                View Analytics Report
              </button>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">CRM Integration Status</h3>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-green-800">CRM Integration Active</h4>
                <p className="text-sm text-green-600">
                  Leads are being automatically synced with your CRM system
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">{leads.length} leads synced</p>
              <p className="text-xs text-green-500">Last sync: Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}