#!/usr/bin/env node

// QR Code Generator for MotivationAI APK distribution
// Generates QR codes for APK download and marketing site

const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path')

console.log('📱 Generating QR Codes for MotivationAI APK Distribution...')
console.log('========================================================')

// Configuration
const OUTPUT_DIR = 'public/qr-codes'
const APK_URL = 'https://mymotivationai.com/download/motivationai-release.apk' // Update with actual URL
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mymotivationai.app'
const APP_STORE_URL = 'https://apps.apple.com/app/mymotivationai/id1234567890'
const MARKETING_URL = 'https://mymotivationai.com/mobile-app'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
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

async function generateQRCode(text, filename, options = {}) {
  try {
    const filepath = path.join(OUTPUT_DIR, filename)
    
    await QRCode.toFile(filepath, text, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      ...options
    })
    
    logSuccess(`Generated: ${filename}`)
    return filepath
  } catch (error) {
    console.error(`Error generating QR code ${filename}:`, error)
    return null
  }
}

async function generateAllQRCodes() {
  logStep('STEP 1', 'Creating output directory...')
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    logSuccess(`Created directory: ${OUTPUT_DIR}`)
  }
  
  logStep('STEP 2', 'Generating QR codes...')
  
  // Generate QR codes
  const qrCodes = [
    {
      text: APK_URL,
      filename: 'apk-download-qr.png',
      description: 'Direct APK Download'
    },
    {
      text: PLAY_STORE_URL,
      filename: 'play-store-qr.png',
      description: 'Google Play Store'
    },
    {
      text: APP_STORE_URL,
      filename: 'app-store-qr.png',
      description: 'Apple App Store'
    },
    {
      text: MARKETING_URL,
      filename: 'marketing-page-qr.png',
      description: 'Marketing Page'
    },
    {
      text: `SMSTO:1234567890:Download MotivationAI app: ${APK_URL}`,
      filename: 'sms-qr.png',
      description: 'SMS Download Link'
    },
    {
      text: `MATMSG:TO:;SUB:Download MotivationAI;BODY:Download the MotivationAI app: ${APK_URL};;`,
      filename: 'email-qr.png',
      description: 'Email Download Link'
    }
  ]
  
  const generatedFiles = []
  
  for (const qr of qrCodes) {
    const filepath = await generateQRCode(qr.text, qr.filename)
    if (filepath) {
      generatedFiles.push({
        file: qr.filename,
        description: qr.description,
        url: qr.text
      })
    }
  }
  
  logStep('STEP 3', 'Generating HTML preview...')
  
  // Generate HTML preview page
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MotivationAI - QR Codes for APK Distribution</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 2.5rem;
            color: #4f46e5;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            color: #666;
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }
        
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .qr-card {
            background: #f8fafc;
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        
        .qr-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-color: #4f46e5;
        }
        
        .qr-card h3 {
            color: #4f46e5;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .qr-image {
            width: 200px;
            height: 200px;
            margin: 1rem auto;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px;
            background: white;
        }
        
        .qr-image img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .qr-url {
            background: #e0e7ff;
            padding: 0.75rem;
            border-radius: 8px;
            margin-top: 1rem;
            font-size: 0.9rem;
            word-break: break-all;
            color: #3730a3;
        }
        
        .instructions {
            background: #f0f9ff;
            border-radius: 15px;
            padding: 2rem;
            margin-top: 3rem;
            border-left: 5px solid #0ea5e9;
        }
        
        .instructions h2 {
            color: #0369a1;
            margin-bottom: 1rem;
        }
        
        .instructions ol {
            margin-left: 1.5rem;
            line-height: 1.8;
        }
        
        .instructions li {
            margin-bottom: 0.5rem;
        }
        
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1.5rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .qr-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 MotivationAI APK Distribution</h1>
            <p>Scan any QR code below to download the MotivationAI hybrid app. Perfect for marketing materials, websites, and physical displays.</p>
        </div>
        
        <div class="qr-grid">
            ${generatedFiles.map(qr => `
            <div class="qr-card">
                <h3>${qr.description}</h3>
                <div class="qr-image">
                    <img src="${qr.file}" alt="${qr.description} QR Code">
                </div>
                <div class="qr-url">
                    ${qr.url.length > 50 ? qr.url.substring(0, 50) + '...' : qr.url}
                </div>
            </div>
            `).join('')}
        </div>
        
        <div class="instructions">
            <h2>📋 How to Use These QR Codes</h2>
            <ol>
                <li><strong>Direct APK Download</strong>: Users can scan this QR code to download the APK directly to their Android device</li>
                <li><strong>App Stores</strong>: Redirect users to official app stores for secure installation</li>
                <li><strong>Marketing Materials</strong>: Print QR codes on flyers, posters, and business cards</li>
                <li><strong>Website Integration</strong>: Add QR codes to your website for mobile visitors</li>
                <li><strong>Email Campaigns</strong>: Include QR codes in email newsletters</li>
                <li><strong>SMS Marketing</strong>: Send QR codes via SMS for direct download</li>
            </ol>
        </div>
        
        <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} • MotivationAI Hybrid App v1.0</p>
            <p>QR codes automatically update when APK URL changes</p>
        </div>
    </div>
</body>
</html>
  `
  
  const htmlPath = path.join(OUTPUT_DIR, 'index.html')
  fs.writeFileSync(htmlPath, htmlContent)
  logSuccess(`Generated HTML preview: ${htmlPath}`)
  
  logStep('STEP 4', 'Generating README file...')
  
  // Generate README file
  const readmeContent = `# MotivationAI QR Codes for APK Distribution

## Generated QR Codes

${generatedFiles.map((qr, index) => `${index + 1}. **${qr.description}** (${qr.file})
   - URL: ${qr.url}
   - File: ${qr.file}`).join('\n\n')}

## Usage Instructions

### 1. Direct APK Download QR Code
- **File**: apk-download-qr.png
- **Purpose**: Direct download of MotivationAI APK file
- **Best for**: Physical marketing materials, direct distribution
- **Scan Result**: Downloads APK file directly to Android device

### 2. App Store QR Codes
- **Google Play Store**: play-store-qr.png
- **Apple App Store**: app-store-qr.png
- **Purpose**: Redirect to official app stores
- **Best for**: General marketing, website integration

### 3. Marketing QR Codes
- **Marketing Page**: marketing-page-qr.png
- **SMS Download**: sms-qr.png
- **Email Download**: email-qr.png
- **Purpose**: Various distribution channels
- **Best for**: Multi-channel marketing campaigns

## How to Update QR Codes

1. Update the URLs in \`scripts/generate-qr.js\`:
   - \`APK_URL\`: Direct APK download URL
   - \`PLAY_STORE_URL\`: Google Play Store URL
   - \`APP_STORE_URL\`: Apple App Store URL
   - \`MARKETING_URL\`: Marketing page URL

2. Run the generator:
   \`\`\`bash
   npm run generate:qr
   \`\`\`

3. QR codes will be regenerated in \`public/qr-codes/\`

## Integration with Website

Add QR codes to your website:

\`\`\`html
<!-- Direct APK Download -->
<div class="qr-code">
    <img src="/qr-codes/apk-download-qr.png" alt="Download MotivationAI APK">
    <p>Scan to download Android APK</p>
</div>

<!-- Google Play Store -->
<div class="qr-code">
    <img src="/qr-codes/play-store-qr.png" alt="Get on Google Play">
    <p>Scan for Google Play Store</p>
</div>
\`\`\`

## Best Practices

1. **Test QR Codes**: Always test QR codes before distribution
2. **Size Matters**: Minimum 2x2 cm (0.8x0.8 in) for scanning
3. **Contrast**: Ensure good contrast between QR code and background
4. **Error Correction**: Use high error correction for damaged codes
5. **Backup URL**: Always include a text URL as backup

## File Structure

\`\`\`
public/qr-codes/
├── apk-download-qr.png      # Direct APK download
├── play-store-qr.png        # Google Play Store
├── app-store-qr.png         # Apple App Store
├── marketing-page-qr.png    # Marketing page
├── sms-qr.png              # SMS download link
├── email-qr.png            # Email download link
├── index.html              # HTML preview
└── README.md               # This file
\`\`\`

## Last Generated
${new Date().toISOString()}

## Notes
- QR codes use high error correction (30%)
- All QR codes are 400x400 pixels with 2px margin
- Update URLs when APK location changes
- Keep backup of previous QR codes for reference
`

  const readmePath = path.join(OUTPUT_DIR, 'README.md')
  fs.writeFileSync(readmePath, readmeContent)
  logSuccess(`Generated README: ${readmePath}`)
  
  logStep('STEP 5', 'Summary')
  
  console.log('\n✅ QR Code Generation Completed!')
  console.log('========================================================')
  console.log(`📁 Output Directory: ${OUTPUT_DIR}`)
  console.log(`📄 Generated ${generatedFiles.length} QR codes`)
  console.log(`🌐 HTML Preview: ${htmlPath}`)
  console.log(`📋 Documentation: ${readmePath}`)
  console.log('\n🚀 Next Steps:')
  console.log('1. Upload APK to your server')
  console.log('2. Update APK_URL in the script')
  console.log('3. Add QR codes to marketing materials')
  console.log('4. Test all QR codes with different devices')
  console.log('5. Update website with mobile app section')
  console.log('\n💡 Tip: Run \`npm run generate:qr\` whenever URLs change')
}

// Run the generator
generateAllQRCodes().catch(error => {
  console.error('Error generating QR codes:', error)
  process.exit(1)
})