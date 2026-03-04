import { NextRequest, NextResponse } from 'next/server';
import { getCRMIntegration, getDefaultCRMConfig, type Lead, type SyncResult } from '@/lib/crm-integration';

// Initialize CRM integration
const crmConfig = getDefaultCRMConfig();
const crm = getCRMIntegration(crmConfig);

// Initialize on first import
crm.initialize().catch(console.error);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as Lead['status'] || 'new';
    const limit = parseInt(searchParams.get('limit') || '100');
    const email = searchParams.get('email');

    if (email) {
      // Get specific lead status
      const leadStatus = await crm.getLeadStatus(email);
      return NextResponse.json({ email, status: leadStatus });
    } else {
      // Get leads by status
      const leads = await crm.getLeadsByStatus(status, limit);
      return NextResponse.json({
        status,
        count: leads.length,
        leads
      });
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const lead: Lead = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      company: body.company,
      jobTitle: body.jobTitle,
      source: body.source || 'app_signup',
      sourceDetails: body.sourceDetails,
      tags: body.tags || [],
      status: body.status || 'new',
      notes: body.notes,
      metadata: body.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await crm.syncLead(lead);

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Lead created successfully' : 'Failed to create lead',
      lead,
      syncResult: result
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { email, status, notes } = body;
    const success = await crm.updateLeadStatus(email, status, notes);

    return NextResponse.json({
      success,
      message: success ? 'Lead status updated successfully' : 'Failed to update lead status',
      email,
      status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would delete the lead from CRM
    // For demo, just return success
    return NextResponse.json({
      success: true,
      message: 'Lead marked for deletion',
      email,
      deletedAt: new Date()
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}