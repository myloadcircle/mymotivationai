#!/usr/bin/env node

// Android APK build script for MotivationAI hybrid app
// This script builds the Next.js app as static assets and packages it as Android APK

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Starting Android APK build pipeline for MotivationAI...')
console.log('====================================================')

// Configuration
const BUILD_DIR = 'out'
const ANDROID_DIR = 'android'
const APK_OUTPUT_DIR = 'android/app/build/outputs/apk/release'
const HYBRID_APP_ENV = 'NEXT_PUBLIC_IS_HYBRID_APP=true'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m'
}

function logStep(step, message) {
  console.log(`\n${colors.blue}${step}${colors.reset}: ${message}`)
}

function logSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`)
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`)
}

function logError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`)
}

function runCommand(command, options = {}) {
  try {
    console.log(`${colors.yellow}$ ${command}${colors.reset}`)
    const output = execSync(command, { 
      stdio: 'inherit',
      ...options 
    })
    return { success: true, output }
  } catch (error) {
    return { success: false, error }
  }
}

async function buildAndroidAPK() {
  logStep('STEP 1', 'Checking prerequisites...')
  
  // Check if Node.js is installed
  const nodeCheck = runCommand('node --version', { stdio: 'pipe' })
  if (!nodeCheck.success) {
    logError('Node.js is not installed or not in PATH')
    process.exit(1)
  }
  logSuccess(`Node.js ${nodeCheck.output?.toString().trim() || 'found'}`)
  
  // Check if npm is installed
  const npmCheck = runCommand('npm --version', { stdio: 'pipe' })
  if (!npmCheck.success) {
    logError('npm is not installed or not in PATH')
    process.exit(1)
  }
  logSuccess(`npm ${npmCheck.output?.toString().trim() || 'found'}`)
  
  // Check if Capacitor CLI is installed
  const capacitorCheck = runCommand('npx cap --version', { stdio: 'pipe' })
  if (!capacitorCheck.success) {
    logWarning('Capacitor CLI not found, installing...')
    runCommand('npm install -g @capacitor/cli')
  }
  logSuccess('Capacitor CLI ready')
  
  logStep('STEP 2', 'Building Next.js app as static assets...')
  
  // Set hybrid app environment variable
  process.env.NEXT_PUBLIC_IS_HYBRID_APP = 'true'
  
  // Clean previous build
  if (fs.existsSync(BUILD_DIR)) {
    logWarning('Cleaning previous build...')
    fs.rmSync(BUILD_DIR, { recursive: true, force: true })
  }
  
  // Build Next.js app
  const buildResult = runCommand('npm run build', { 
    env: { ...process.env, NEXT_PUBLIC_IS_HYBRID_APP: 'true' }
  })
  
  if (!buildResult.success) {
    logError('Next.js build failed')
    process.exit(1)
  }
  logSuccess('Next.js build completed')
  
  logStep('STEP 3', 'Preparing Capacitor Android project...')
  
  // Check if Android directory exists
  if (!fs.existsSync(ANDROID_DIR)) {
    logWarning('Android project not found, creating...')
    
    // Add Android platform
    const addAndroidResult = runCommand('npx cap add android')
    if (!addAndroidResult.success) {
      logError('Failed to add Android platform')
      process.exit(1)
    }
  }
  
  // Copy web assets to Android
  const copyResult = runCommand('npx cap copy android')
  if (!copyResult.success) {
    logError('Failed to copy web assets to Android')
    process.exit(1)
  }
  logSuccess('Web assets copied to Android project')
  
  // Sync Android project
  const syncResult = runCommand('npx cap sync android')
  if (!syncResult.success) {
    logError('Failed to sync Android project')
    process.exit(1)
  }
  logSuccess('Android project synced')
  
  logStep('STEP 4', 'Building Android APK...')
  
  // Check if Android SDK is available
  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
  if (!androidHome) {
    logWarning('ANDROID_HOME not set. Make sure Android SDK is installed.')
    logWarning('You can install Android Studio from: https://developer.android.com/studio')
    logWarning('Or set ANDROID_HOME environment variable.')
  } else {
    logSuccess(`Android SDK found at: ${androidHome}`)
  }
  
  // Build APK (this requires Android Studio or Gradle)
  logWarning('Building APK requires Android Studio or Gradle installed.')
  logWarning('If you have Android Studio installed, you can:')
  logWarning('1. Open the android folder in Android Studio')
  logWarning('2. Build → Build Bundle(s) / APK(s) → Build APK(s)')
  logWarning('3. Find the APK in android/app/build/outputs/apk/')
  
  // Alternative: Use Gradle command if available
  const gradleWrapper = path.join(ANDROID_DIR, 'gradlew')
  if (fs.existsSync(gradleWrapper)) {
    logSuccess('Gradle wrapper found, attempting to build APK...')
    
    // Change to Android directory
    process.chdir(ANDROID_DIR)
    
    // Build release APK
    const gradleResult = runCommand('./gradlew assembleRelease')
    if (!gradleResult.success) {
      logError('Gradle build failed. You may need to set up Android SDK.')
      logWarning('Continuing with manual build instructions...')
    } else {
      logSuccess('APK built successfully!')
      
      // Find APK file
      const apkFiles = []
      function findAPKFiles(dir) {
        const files = fs.readdirSync(dir, { withFileTypes: true })
        for (const file of files) {
          const fullPath = path.join(dir, file.name)
          if (file.isDirectory()) {
            findAPKFiles(fullPath)
          } else if (file.name.endsWith('.apk')) {
            apkFiles.push(fullPath)
          }
        }
      }
      
      findAPKFiles('app/build/outputs')
      
      if (apkFiles.length > 0) {
        console.log('\n📱 APK Files Generated:')
        apkFiles.forEach((apk, index) => {
          const size = (fs.statSync(apk).size / (1024 * 1024)).toFixed(2)
          console.log(`  ${index + 1}. ${apk} (${size} MB)`)
        })
        
        // Copy APK to project root for easy access
        const mainApk = apkFiles.find(apk => apk.includes('release') && !apk.includes('unaligned'))
        if (mainApk) {
          const targetPath = path.join('..', '..', 'motivationai-release.apk')
          fs.copyFileSync(mainApk, targetPath)
          logSuccess(`APK copied to: ${targetPath}`)
        }
      }
    }
    
    // Change back to project root
    process.chdir('..')
  } else {
    logWarning('Gradle wrapper not found. Manual build required.')
  }
  
  logStep('STEP 5', 'APK Distribution Instructions')
  
  console.log('\n📦 APK Distribution Options:')
  console.log('1. Direct Install: Transfer APK to Android device and install')
  console.log('2. Google Play Store: Need to create signed bundle (AAB)')
  console.log('3. Third-party stores: APKPure, Aptoide, etc.')
  console.log('4. QR Code Distribution: Generate QR code for download')
  
  console.log('\n🔧 Next Steps:')
  console.log('1. Sign the APK for production:')
  console.log('   ./gradlew assembleRelease (with signing config)')
  console.log('2. Generate QR code for APK download')
  console.log('3. Update marketing site with download section')
  console.log('4. Test on multiple Android devices')
  
  console.log('\n✅ Android APK build pipeline completed!')
  console.log('====================================================')
}

// Run the build
buildAndroidAPK().catch(error => {
  logError(`Build failed: ${error.message}`)
  process.exit(1)
})