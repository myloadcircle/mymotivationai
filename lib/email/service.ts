import { emailTemplates, EmailTemplate } from './templates';

export interface EmailData {
  to: string;
  name: string;
  template: string;
  variables?: Record<string, string>;
}

export interface ScheduledEmail {
  userId: string;
  email: string;
  name: string;
  template: string;
  scheduledFor: Date;
  variables?: Record<string, string>;
  sent: boolean;
}

class EmailService {
  private scheduledEmails: ScheduledEmail[] = [];

  /**
   * Schedule an email for delivery
   */
  async scheduleEmail(
    userId: string,
    email: string,
    name: string,
    templateName: string,
    delayHours: number = 0,
    variables?: Record<string, string>
  ): Promise<void> {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    const scheduledFor = new Date();
    scheduledFor.setHours(scheduledFor.getHours() + delayHours);

    const scheduledEmail: ScheduledEmail = {
      userId,
      email,
      name,
      template: templateName,
      scheduledFor,
      variables,
      sent: false,
    };

    this.scheduledEmails.push(scheduledEmail);
    
    // In production, this would save to a database
    console.log(`📧 Scheduled email "${templateName}" for ${email} at ${scheduledFor.toISOString()}`);
  }

  /**
   * Schedule the onboarding sequence for a new user
   */
  async scheduleOnboardingSequence(
    userId: string,
    email: string,
    name: string,
    plan: string = 'free'
  ): Promise<void> {
    const baseVariables = {
      name,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      helpUrl: `${process.env.NEXT_PUBLIC_APP_URL}/help`,
      communityUrl: `${process.env.NEXT_PUBLIC_APP_URL}/community`,
      pricingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      faqUrl: `${process.env.NEXT_PUBLIC_APP_URL}/faq`,
    };

    // Welcome email (immediate)
    await this.scheduleEmail(userId, email, name, 'welcome', 0, baseVariables);

    // Day 3 check-in
    await this.scheduleEmail(userId, email, name, 'day3_checkin', 72, baseVariables);

    // Week 1 recap
    await this.scheduleEmail(userId, email, name, 'week1_recap', 168, {
      ...baseVariables,
      goalsCreated: '0',
      goalsCompleted: '0',
      loginCount: '3',
    });

    // Free to paid prompt (only for free users, after 14 days)
    if (plan === 'free') {
      await this.scheduleEmail(userId, email, name, 'free_to_paid_prompt', 336, baseVariables);
    }
  }

  /**
   * Send an email immediately (mock implementation)
   */
  async sendEmail(data: EmailData): Promise<boolean> {
    const template = emailTemplates[data.template];
    if (!template) {
      throw new Error(`Template ${data.template} not found`);
    }

    // Replace template variables
    let html = template.html;
    let text = template.text;
    
    const allVariables = {
      name: data.name,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      helpUrl: `${process.env.NEXT_PUBLIC_APP_URL}/help`,
      communityUrl: `${process.env.NEXT_PUBLIC_APP_URL}/community`,
      pricingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      faqUrl: `${process.env.NEXT_PUBLIC_APP_URL}/faq`,
      ...data.variables,
    };

    Object.entries(allVariables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), value || '');
      text = text.replace(new RegExp(placeholder, 'g'), value || '');
    });

    // In production, this would call an email service like SendGrid, Resend, etc.
    console.log(`📨 Mock email sent to ${data.to}`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Preview: ${text.substring(0, 100)}...`);

    return true;
  }

  /**
   * Process scheduled emails that are due
   */
  async processScheduledEmails(): Promise<void> {
    const now = new Date();
    const dueEmails = this.scheduledEmails.filter(
      email => !email.sent && email.scheduledFor <= now
    );

    for (const email of dueEmails) {
      try {
        await this.sendEmail({
          to: email.email,
          name: email.name,
          template: email.template,
          variables: email.variables,
        });
        
        email.sent = true;
        console.log(`✅ Processed scheduled email "${email.template}" for ${email.email}`);
      } catch (error) {
        console.error(`❌ Failed to send scheduled email to ${email.email}:`, error);
      }
    }

    // Clean up sent emails (in production, would archive in database)
    this.scheduledEmails = this.scheduledEmails.filter(email => !email.sent);
  }

  /**
   * Get scheduled emails for a user
   */
  async getUserScheduledEmails(userId: string): Promise<ScheduledEmail[]> {
    return this.scheduledEmails.filter(email => email.userId === userId);
  }

  /**
   * Cancel scheduled emails for a user
   */
  async cancelUserEmails(userId: string): Promise<void> {
    this.scheduledEmails = this.scheduledEmails.filter(email => email.userId !== userId);
    console.log(`🗑️ Cancelled all scheduled emails for user ${userId}`);
  }
}

export const emailService = new EmailService();