# MotivationAI QR Codes for APK Distribution

## Generated QR Codes

1. **Direct APK Download** (apk-download-qr.png)
   - URL: https://mymotivationai.com/download/motivationai-release.apk
   - File: apk-download-qr.png

2. **Google Play Store** (play-store-qr.png)
   - URL: https://play.google.com/store/apps/details?id=com.mymotivationai.app
   - File: play-store-qr.png

3. **Apple App Store** (app-store-qr.png)
   - URL: https://apps.apple.com/app/mymotivationai/id1234567890
   - File: app-store-qr.png

4. **Marketing Page** (marketing-page-qr.png)
   - URL: https://mymotivationai.com/mobile-app
   - File: marketing-page-qr.png

5. **SMS Download Link** (sms-qr.png)
   - URL: SMSTO:1234567890:Download MotivationAI app: https://mymotivationai.com/download/motivationai-release.apk
   - File: sms-qr.png

6. **Email Download Link** (email-qr.png)
   - URL: MATMSG:TO:;SUB:Download MotivationAI;BODY:Download the MotivationAI app: https://mymotivationai.com/download/motivationai-release.apk;;
   - File: email-qr.png

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

1. Update the URLs in `scripts/generate-qr.js`:
   - `APK_URL`: Direct APK download URL
   - `PLAY_STORE_URL`: Google Play Store URL
   - `APP_STORE_URL`: Apple App Store URL
   - `MARKETING_URL`: Marketing page URL

2. Run the generator:
   ```bash
   npm run generate:qr
   ```

3. QR codes will be regenerated in `public/qr-codes/`

## Integration with Website

Add QR codes to your website:

```html
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
```

## Best Practices

1. **Test QR Codes**: Always test QR codes before distribution
2. **Size Matters**: Minimum 2x2 cm (0.8x0.8 in) for scanning
3. **Contrast**: Ensure good contrast between QR code and background
4. **Error Correction**: Use high error correction for damaged codes
5. **Backup URL**: Always include a text URL as backup

## File Structure

```
public/qr-codes/
├── apk-download-qr.png      # Direct APK download
├── play-store-qr.png        # Google Play Store
├── app-store-qr.png         # Apple App Store
├── marketing-page-qr.png    # Marketing page
├── sms-qr.png              # SMS download link
├── email-qr.png            # Email download link
├── index.html              # HTML preview
└── README.md               # This file
```

## Last Generated
2026-03-04T22:04:23.527Z

## Notes
- QR codes use high error correction (30%)
- All QR codes are 400x400 pixels with 2px margin
- Update URLs when APK location changes
- Keep backup of previous QR codes for reference
