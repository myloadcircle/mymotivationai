'use client';

import { useState, useEffect } from 'react';
import { 
  QrCode, 
  BarChart3, 
  Users, 
  Download, 
  Filter, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Share2,
  Calendar,
  TrendingUp,
  Smartphone,
  Globe
} from 'lucide-react';

interface QRCodeCampaign {
  id: string;
  name: string;
  description: string;
  url: string;
  qrCodeUrl: string;
  createdAt: Date;
  scans: number;
  uniqueScans: number;
  conversions: number;
  conversionRate: number;
  status: 'active' | 'paused' | 'archived';
  tags: string[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface ScanAnalytics {
  date: string;
  scans: number;
  conversions: number;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  location: string;
}

export default function QRCodeDashboard() {
  const [campaigns, setCampaigns] = useState<QRCodeCampaign[]>([
    {
      id: '1',
      name: 'Main Landing Page',
      description: 'Primary QR code for app installation',
      url: 'https://mymotivationai.com/qr-landing',
      qrCodeUrl: '/api/qr/generate?url=https://mymotivationai.com/qr-landing',
      createdAt: new Date('2024-01-15'),
      scans: 1250,
      uniqueScans: 980,
      conversions: 320,
      conversionRate: 32.7,
      status: 'active',
      tags: ['primary', 'installation'],
      utmSource: 'qr_code',
      utmMedium: 'print',
      utmCampaign: 'main_landing'
    },
    {
      id: '2',
      name: 'Conference Handout',
      description: 'QR codes distributed at Tech Conference 2024',
      url: 'https://mymotivationai.com/qr-landing?utm_source=conference&utm_medium=handout',
      qrCodeUrl: '/api/qr/generate?url=https://mymotivationai.com/qr-landing?utm_source=conference',
      createdAt: new Date('2024-02-10'),
      scans: 850,
      uniqueScans: 720,
      conversions: 210,
      conversionRate: 29.2,
      status: 'active',
      tags: ['event', 'conference'],
      utmSource: 'conference',
      utmMedium: 'handout',
      utmCampaign: 'tech_conf_2024'
    },
    {
      id: '3',
      name: 'Social Media Campaign',
      description: 'QR codes for Instagram and LinkedIn posts',
      url: 'https://mymotivationai.com/qr-landing?utm_source=social&utm_medium=post',
      qrCodeUrl: '/api/qr/generate?url=https://mymotivationai.com/qr-landing?utm_source=social',
      createdAt: new Date('2024-02-25'),
      scans: 420,
      uniqueScans: 380,
      conversions: 95,
      conversionRate: 25.0,
      status: 'active',
      tags: ['social', 'digital'],
      utmSource: 'social',
      utmMedium: 'post',
      utmCampaign: 'q1_social_push'
    },
    {
      id: '4',
      name: 'Printed Brochures',
      description: 'QR codes on printed marketing materials',
      url: 'https://mymotivationai.com/qr-landing?utm_source=print&utm_medium=brochure',
      qrCodeUrl: '/api/qr/generate?url=https://mymotivationai.com/qr-landing?utm_source=print',
      createdAt: new Date('2024-01-30'),
      scans: 310,
      uniqueScans: 280,
      conversions: 68,
      conversionRate: 24.3,
      status: 'paused',
      tags: ['print', 'brochure'],
      utmSource: 'print',
      utmMedium: 'brochure',
      utmCampaign: 'print_materials'
    }
  ]);

  const [analytics, setAnalytics] = useState<ScanAnalytics[]>([
    { date: '2024-03-01', scans: 45, conversions: 12, deviceType: 'mobile', location: 'US' },
    { date: '2024-03-02', scans: 52, conversions: 18, deviceType: 'mobile', location: 'UK' },
    { date: '2024-03-03', scans: 48, conversions: 15, deviceType: 'desktop', location: 'CA' },
    { date: '2024-03-04', scans: 61, conversions: 22, deviceType: 'mobile', location: 'AU' },
    { date: '2024-03-05', scans: 55, conversions: 19, deviceType: 'tablet', location: 'DE' },
    { date: '2024-03-06', scans: 58, conversions: 21, deviceType: 'mobile', location: 'FR' },
    { date: '2024-03-07', scans: 63, conversions: 24, deviceType: 'mobile', location: 'US' },
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState<QRCodeCampaign | null>(campaigns[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  // Calculate totals
  const totalScans = campaigns.reduce((sum, campaign) => sum + campaign.scans, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const overallConversionRate = totalScans > 0 ? (totalConversions / totalScans * 100).toFixed(1) : '0.0';
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateCampaign = () => {
    setShowNewCampaignModal(true);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(campaigns[1] || null);
      }
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Campaign Name', 'URL', 'Scans', 'Unique Scans', 'Conversions', 'Conversion Rate', 'Status', 'Created'],
      ...campaigns.map(campaign => [
        campaign.name,
        campaign.url,
        campaign.scans.toString(),
        campaign.uniqueScans.toString(),
        campaign.conversions.toString(),
        `${campaign.conversionRate}%`,
        campaign.status,
        campaign.createdAt.toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-campaigns-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Code Management Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Track, manage, and analyze your QR code campaigns
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={handleCreateCampaign}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <QrCode className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Scans</p>
                  <p className="text-2xl font-bold text-gray-900">{totalScans.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Conversions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalConversions.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{overallConversionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">QR Code Campaigns</h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Filter by campaign status"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scans
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversions
                      </th>
                      <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCampaigns.map((campaign) => (
                      <tr 
                        key={campaign.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedCampaign?.id === campaign.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.description}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {campaign.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 font-medium">{campaign.scans.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{campaign.uniqueScans.toLocaleString()} unique</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 font-medium">{campaign.conversions.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{campaign.conversionRate}% rate</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // View QR code
                                window.open(campaign.qrCodeUrl, '_blank');
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="View QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Edit campaign
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCampaign(campaign.id);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCampaigns.length === 0 && (
                <div className="p-12 text-center">
                  <QrCode className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No campaigns found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first QR code campaign to get started'}
                  </p>
                  <button
                    onClick={handleCreateCampaign}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Campaign Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedCampaign ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Campaign Details</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedCampaign.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : selectedCampaign.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{selectedCampaign.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedCampaign.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Scans</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedCampaign.scans.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedCampaign.conversionRate}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">QR Code</h4>
                    <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                      <div className="w-48 h-48 bg-white p-4 rounded">
                        {/* QR Code placeholder */}
                        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <QrCode className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
                        <Download className="h-4 w-4 inline mr-2" />
                        Download
                      </button>
                      <button className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100">
                        <Share2 className="h-4 w-4 inline mr-2" />
                        Share
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Campaign URL</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 break-all">{selectedCampaign.url}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">UTM Parameters</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Source:</span>
                        <span className="text-sm font-medium">{selectedCampaign.utmSource || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Medium:</span>
                        <span className="text-sm font-medium">{selectedCampaign.utmMedium || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Campaign:</span>
                        <span className="text-sm font-medium">{selectedCampaign.utmCampaign || 'Not set'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Created</h4>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {selectedCampaign.createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                        Edit Campaign
                      </button>
                      <button 
                        onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <QrCode className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Select a Campaign</h3>
                <p className="text-gray-600">
                  Choose a campaign from the list to view details and analytics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Scan Analytics (Last 7 Days)</h2>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Device Breakdown</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-gray-300" />
                <p className="ml-3 text-gray-500">Scan analytics chart would appear here</p>
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Mobile</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Desktop</span>
                    <span className="text-sm font-medium">24%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Tablet</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Top Locations</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">United States</span>
                    </div>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">United Kingdom</span>
                    </div>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">Canada</span>
                    </div>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}