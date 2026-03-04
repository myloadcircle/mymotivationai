#!/usr/bin/env node

/**
 * Stripe Setup Script for myMotivationAI
 * 
 * This script helps you set up Stripe products and prices for testing.
 * Run with: node scripts/setup-stripe.js
 */

const Stripe = require('stripe');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('🎯 Stripe Setup for myMotivationAI\n');
  
  // Check for .env file
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found. Please create it first.');
    console.log('Copy .env.example to .env.local and add your Stripe keys.');
    process.exit(1);
  }

  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const stripeSecretKey = envContent.match(/STRIPE_SECRET_KEY=(.+)/)?.[1];
  
  if (!stripeSecretKey || stripeSecretKey.includes('XXXX')) {
    console.error('❌ STRIPE_SECRET_KEY not found or contains placeholder in .env.local');
    console.log('Please add your Stripe secret key to .env.local');
    process.exit(1);
  }

  const stripe = Stripe(stripeSecretKey);

  console.log('📦 Creating Stripe products and prices...\n');

  try {
    // Create Basic Plan
    console.log('Creating Basic Plan...');
    const basicProduct = await stripe.products.create({
      name: 'Basic Plan',
      description: 'Essential motivation features for individuals',
      metadata: {
        plan: 'BASIC',
        features: 'daily_quotes,basic_tracking,email_support'
      }
    });

    const basicMonthlyPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 999, // $9.99
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { plan: 'BASIC', billing_period: 'monthly' }
    });

    const basicYearlyPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 7794, // $77.94 (35% off $9.99/month)
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { plan: 'BASIC', billing_period: 'yearly' }
    });

    // Create Pro Plan
    console.log('Creating Pro Plan...');
    const proProduct = await stripe.products.create({
      name: 'Pro Plan',
      description: 'Advanced features for serious users',
      metadata: {
        plan: 'PRO',
        features: 'advanced_analytics,custom_schedules,priority_support,team_collaboration'
      }
    });

    const proMonthlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 2499, // $24.99
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { plan: 'PRO', billing_period: 'monthly' }
    });

    const proYearlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 19494, // $194.94 (35% off $24.99/month)
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { plan: 'PRO', billing_period: 'yearly' }
    });



    console.log('\n✅ Products and prices created successfully!\n');

    // Update .env file with price IDs
    console.log('Updating .env.local with price IDs...');
    
    const updatedEnv = envContent
      .replace(/STRIPE_BASIC_PRICE_ID=.*/g, `STRIPE_BASIC_PRICE_ID=${basicMonthlyPrice.id}`)
      .replace(/STRIPE_PRO_PRICE_ID=.*/g, `STRIPE_PRO_PRICE_ID=${proMonthlyPrice.id}`)
      .replace(/NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=.*/g, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'}`);

    fs.writeFileSync(envPath, updatedEnv);

    // Create .env.local with all price IDs for frontend
    const frontendEnvPath = path.join(__dirname, '..', '.env.local.frontend');
    const frontendEnv = `
# Frontend Stripe Price IDs
NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID=${basicMonthlyPrice.id}
NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID=${basicYearlyPrice.id}
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=${proMonthlyPrice.id}
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=${proYearlyPrice.id}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'}
    `.trim();

    fs.writeFileSync(frontendEnvPath, frontendEnv);

    console.log('\n📋 Created Products and Prices:');
    console.log('==============================');
    console.log(`Basic Plan:`);
    console.log(`  Monthly: ${basicMonthlyPrice.id} ($9.99/month)`);
    console.log(`  Yearly:  ${basicYearlyPrice.id} ($77.94/year - 35% off)`);
    console.log(`\nPro Plan:`);
    console.log(`  Monthly: ${proMonthlyPrice.id} ($24.99/month)`);
    console.log(`  Yearly:  ${proYearlyPrice.id} ($194.94/year - 35% off)`);

    console.log('\n📝 Next Steps:');
    console.log('1. Your .env.local file has been updated with price IDs');
    console.log('2. Restart your development server: npm run dev');
    console.log('3. Visit http://localhost:3000/pricing to test the checkout flow');
    console.log('4. Set up webhooks in Stripe Dashboard:');
    console.log('   - Endpoint: http://localhost:3000/api/webhooks/stripe');
    console.log('   - Events to listen for: checkout.session.completed, customer.subscription.*, invoice.*');
    console.log('5. Copy the webhook secret to STRIPE_WEBHOOK_SECRET in .env.local');

    console.log('\n🎉 Setup complete! Happy testing!');

  } catch (error) {
    console.error('❌ Error setting up Stripe:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();