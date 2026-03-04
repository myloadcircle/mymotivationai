export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  delayHours: number;
  trigger: 'signup' | 'goal_created' | 'goal_completed' | 'inactive_7_days' | 'free_to_paid_upgrade';
}

export const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    subject: 'Welcome to MyMotivationAI! Start Your Journey 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MyMotivationAI</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MyMotivationAI!</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Your journey to better habits starts now</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #4a5568; margin-top: 0;">Hi {{name}}! 👋</h2>
          
          <p>We're excited to have you join our community of motivated individuals working towards their goals.</p>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">🎯 Your First 3 Steps:</h3>
            <ol style="margin: 15px 0; padding-left: 20px;">
              <li><strong>Set your first goal</strong> - Start with something achievable</li>
              <li><strong>Check your daily motivation quote</strong> - Fresh inspiration every day</li>
              <li><strong>Track your progress</strong> - Small steps lead to big changes</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: #4299e1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Go to Your Dashboard →
            </a>
          </div>
          
          <p><strong>Pro Tip:</strong> Start with just one goal. Consistency beats intensity every time!</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #718096;">
            Need help? Check out our <a href="{{helpUrl}}" style="color: #4299e1;">Getting Started Guide</a> or 
            reply to this email for personalized assistance.
          </p>
          
          <p style="font-size: 14px; color: #718096;">
            Stay motivated,<br>
            The MyMotivationAI Team
          </p>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to MyMotivationAI!

Hi {{name}}!

We're excited to have you join our community of motivated individuals working towards their goals.

🎯 Your First 3 Steps:
1. Set your first goal - Start with something achievable
2. Check your daily motivation quote - Fresh inspiration every day
3. Track your progress - Small steps lead to big changes

Go to Your Dashboard: {{dashboardUrl}}

Pro Tip: Start with just one goal. Consistency beats intensity every time!

Need help? Check out our Getting Started Guide: {{helpUrl}}

Stay motivated,
The MyMotivationAI Team`,
    delayHours: 0,
    trigger: 'signup',
  },

  day3_checkin: {
    subject: 'How are your goals going? 🎯',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3-Day Check-in</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4fd1c5 0%, #319795 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">3-Day Progress Check</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Keep that momentum going!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #4a5568; margin-top: 0;">Hi {{name}}! 👋</h2>
          
          <p>You've been with us for 3 days now! How's your motivation journey going?</p>
          
          <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #276749; margin-top: 0;">💪 Today's Motivation:</h3>
            <blockquote style="font-style: italic; color: #2d3748; border-left: 4px solid #48bb78; padding-left: 15px; margin: 15px 0;">
              "The secret of getting ahead is getting started."<br>
              <small style="color: #718096;">— Mark Twain</small>
            </blockquote>
          </div>
          
          <p><strong>Quick Tip:</strong> If you haven't set a goal yet, now's the perfect time! Even 5 minutes of progress each day adds up.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}/goals/new" style="background: #38a169; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Set Your First Goal →
            </a>
          </div>
          
          <p>Remember: Progress, not perfection. Every small step counts!</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #718096;">
            Need inspiration? Browse our <a href="{{communityUrl}}" style="color: #38a169;">community goals</a> for ideas.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `3-Day Progress Check

Hi {{name}}!

You've been with us for 3 days now! How's your motivation journey going?

💪 Today's Motivation:
"The secret of getting ahead is getting started." — Mark Twain

Quick Tip: If you haven't set a goal yet, now's the perfect time! Even 5 minutes of progress each day adds up.

Set Your First Goal: {{dashboardUrl}}/goals/new

Remember: Progress, not perfection. Every small step counts!

Need inspiration? Browse our community goals: {{communityUrl}}`,
    delayHours: 72,
    trigger: 'signup',
  },

  week1_recap: {
    subject: 'Your First Week Recap 📊',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Week 1 Recap</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">One Week Strong! 🎉</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Celebrate your consistency</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #4a5568; margin-top: 0;">Hi {{name}}! 👋</h2>
          
          <p>Congratulations on completing your first week with MyMotivationAI! That's 7 days of potential progress.</p>
          
          <div style="background: #fffaf0; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #c05621; margin-top: 0;">📈 Your Week 1 Stats:</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li><strong>{{goalsCreated}}</strong> goals created</li>
              <li><strong>{{goalsCompleted}}</strong> goals completed</li>
              <li><strong>7</strong> motivation quotes delivered</li>
              <li><strong>{{loginCount}}</strong> times you checked in</li>
            </ul>
          </div>
          
          <p><strong>Did you know?</strong> It takes an average of 21 days to form a habit. You're already 1/3 of the way there!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: #ed8936; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Your Progress →
            </a>
          </div>
          
          <p>Keep up the great work! Consistency is your superpower.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #718096;">
            Want more features? <a href="{{pricingUrl}}" style="color: #ed8936;">Upgrade to Basic</a> for unlimited goals and advanced tracking.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `One Week Strong! 🎉

Hi {{name}}!

Congratulations on completing your first week with MyMotivationAI! That's 7 days of potential progress.

📈 Your Week 1 Stats:
- {{goalsCreated}} goals created
- {{goalsCompleted}} goals completed
- 7 motivation quotes delivered
- {{loginCount}} times you checked in

Did you know? It takes an average of 21 days to form a habit. You're already 1/3 of the way there!

View Your Progress: {{dashboardUrl}}

Keep up the great work! Consistency is your superpower.

Want more features? Upgrade to Basic for unlimited goals and advanced tracking: {{pricingUrl}}`,
    delayHours: 168,
    trigger: 'signup',
  },

  free_to_paid_prompt: {
    subject: 'Ready for Unlimited Goals? 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upgrade Your Experience</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Unlock Your Full Potential</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Take your motivation to the next level</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #4a5568; margin-top: 0;">Hi {{name}}! 👋</h2>
          
          <p>We've noticed you're getting great value from MyMotivationAI! Ready to unlock even more potential?</p>
          
          <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #6b46c1; margin-top: 0;">✨ What You'll Get with Basic:</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li><strong>Unlimited goals</strong> (no 3-goal limit)</li>
              <li><strong>Advanced progress tracking</strong> with charts</li>
              <li><strong>Mobile app access</strong> on iOS & Android</li>
              <li><strong>Priority email support</strong></li>
              <li><strong>Custom goal categories</strong></li>
            </ul>
            
            <div style="text-align: center; margin-top: 20px;">
              <div style="display: inline-block; background: #e9d8fd; padding: 10px 20px; border-radius: 6px;">
                <span style="font-size: 24px; font-weight: bold; color: #6b46c1;">$9/month</span>
                <span style="color: #718096; margin-left: 10px;">or $86/year (save 35%)</span>
              </div>
            </div>
          </div>
          
          <p><strong>Special Offer:</strong> As an active free user, get your first month for just <strong>$5</strong>!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{pricingUrl}}?coupon=FIRSTMONTH5" style="background: #9f7aea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Upgrade Now & Save →
            </a>
          </div>
          
          <p>No pressure! The free plan will always be available. This is just an opportunity to get more from your motivation journey.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #718096;">
            Questions? Reply to this email or check our <a href="{{faqUrl}}" style="color: #9f7aea;">FAQ</a>.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `Unlock Your Full Potential

Hi {{name}}!

We've noticed you're getting great value from MyMotivationAI! Ready to unlock even more potential?

✨ What You'll Get with Basic:
- Unlimited goals (no 3-goal limit)
- Advanced progress tracking with charts
- Mobile app access on iOS & Android
- Priority email support
- Custom goal categories

Price: $9/month or $86/year (save 35%)

Special Offer: As an active free user, get your first month for just $5!

Upgrade Now & Save: {{pricingUrl}}?coupon=FIRSTMONTH5

No pressure! The free plan will always be available. This is just an opportunity to get more from your motivation journey.

Best regards,
The MyMotivationAI Team

---

You're receiving this email because you signed up for MyMotivationAI.
If you no longer wish to receive these emails, you can update your preferences in your account settings.`,
    delayHours: 72,
    trigger: 'free_to_paid_upgrade',
  },
  // ... other email templates would continue here
};