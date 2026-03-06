#!/usr/bin/env node

// Test Supabase connection for MotivationAI
// Load .env.local for credentials
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

console.log('🔌 Testing Supabase Connection...')
console.log('================================')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('1. Testing Supabase REST API connection...')
    
    // Test 1: Check if Supabase is reachable
    const { data: healthData, error: healthError } = await supabase.from('_health').select('*').limit(1)
    
    if (healthError) {
      console.log('   ⚠️  Health check failed (expected for new project):', healthError.message)
    } else {
      console.log('   ✅ Supabase REST API is reachable')
    }
    
    // Test 2: Test authentication endpoint
    console.log('2. Testing authentication endpoints...')
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword'
    })
    
    if (authError && authError.message.includes('Invalid login credentials')) {
      console.log('   ✅ Authentication endpoint is working (expected invalid credentials error)')
    } else if (authError) {
      console.log('   ⚠️  Auth test:', authError.message)
    }
    
    // Test 3: Test database connection via REST
    console.log('3. Testing database tables...')
    
    // Try to create a test table via REST (will fail without proper permissions, but shows connection works)
    const { error: tableError } = await supabase
      .from('test_connection')
      .insert({ test: 'connection' })
      .select()
    
    if (tableError && tableError.message.includes('relation "test_connection" does not exist')) {
      console.log('   ✅ Database connection is working (table doesnt exist yet)')
      console.log('   📋 Next step: Run SQL migrations in Supabase SQL Editor')
    } else if (tableError) {
      console.log('   ⚠️  Database test:', tableError.message)
    }
    
    console.log('\n================================')
    console.log('✅ SUPABASE CONNECTION TEST COMPLETE')
    console.log('\n📋 NEXT STEPS:')
    console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/fhtknpbvhmdrlsifrqml')
    console.log('2. Open SQL Editor')
    console.log('3. Copy SQL from: setup-motivationai-database.sql')
    console.log('4. Execute SQL to create tables')
    console.log('5. Verify tables in Table Editor')
    console.log('\n🔧 Hybrid App is ready for:')
    console.log('   - npm run build:hybrid')
    console.log('   - npm run generate:qr')
    console.log('   - npm run android:build')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check if Supabase project is active')
    console.log('2. Verify database password: MotivationAI2026!')
    console.log('3. Check network connectivity')
    console.log('4. Ensure SSL is enabled for database connections')
  }
}

testConnection()