'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import QRCodeInstallButton from '@/components/QRCodeInstallButton'
import IOSInstallGuide from '@/components/IOSInstallGuide'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { trackEvent } from '@/lib/analytics'

export default function QRLandingPage() {
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [qrScanData, setQrScanData] = useState<any>(null)

  // Detect device and PWA status on component mount
  useEffect(() => {
    // Check if app is running in standalone mode (already installed)
    const isStandaloneCheck = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(isStandaloneCheck)

    // Detect iOS
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iosCheck)

    // Detect Android
    const androidCheck = /Android/.test(navigator.userAgent)
    setIsAndroid(androidCheck)

    // Check for PWA install capability
    const hasServiceWorker = 'serviceWorker' in navigator
    const canInstall = hasServiceWorker && !isStandaloneCheck
    
    // Show install button if PWA is supported and not already installed
    if (canInstall && !isIOS) {
      setShowInstallButton(true)
    }

    // Parse QR code parameters from URL
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get('utm_source')
    const utmMedium = urlParams.get('utm_medium')
    const utmCampaign = urlParams.get('utm_campaign')
    const utmContent = urlParams.get('utm_content')

    if (utmMedium === 'qr-code') {
      const scanData = {
        source: utmSource,
        campaign: utmCampaign,
        content: utmContent,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
      
      setQrScanData(scanData)
      
      // Track QR scan event
      trackEvent('qr_scan_detected', scanData)
      
      // Store in session for later tracking
      sessionStorage.setItem('qr_scan_data', JSON.stringify(scanData))
    }

    // Track landing page view
    trackEvent('landing_page_view', {
      path: '/qr-landing',
      isStandalone: isStandaloneCheck,
      isIOS: iosCheck,
      isAndroid: androidCheck,
      timestamp: new Date().toISOString()
    })
  }, [])

  // Handle install success
  const handleInstallSuccess = () => {
    setShowInstallButton(false)
    
    // Track successful installation
    trackEvent('install_successful', {
      ...qrScanData,
      installTime: new Date().toISOString(),
      platform: isIOS ? 'ios' : isAndroid ? 'android' : 'other'
    })
  }

  // Handle install failure
  const handleInstallError = (error: any) => {
    trackEvent('install_failed', {
      ...qrScanData,
      error: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }

  // If app is already installed and launched from home screen
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">🎯</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">myMotivationAI is already installed on your device.</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to get motivated?</h2>
            <p className="text-gray-600 mb-6">
              Launch the app from your home screen to continue your motivation journey with personalized AI exercises.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">1</span>
                </div>
                <span className="text-gray-700">Find the myMotivationAI icon on your home screen</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">2</span>
                </div>
                <span className="text-gray-700">Tap to launch the app</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">3</span>
                </div>
                <span className="text-gray-700">Continue where you left off</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.close()}
            className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close This Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <AnalyticsTracker qrData={qrScanData} />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
            <div className="text-3xl">🚀</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Boost Your Motivation with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized motivation exercises, track your progress, and achieve your goals with our intelligent self-improvement platform.
          </p>
        </div>

        {/* App Preview */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why myMotivationAI?</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span className="text-gray-700">Personalized AI motivation exercises</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span className="text-gray-700">Progress tracking & analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span className="text-gray-700">Daily challenges & rewards</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span className="text-gray-700">Works offline - no internet needed</span>
                </li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600">📱</span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">Install in seconds</p>
                    <p className="text-blue-600 text-sm">No app store download required</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative mx-auto w-64 h-[500px] bg-gray-900 rounded-[2rem] p-3 shadow-2xl">
                {/* Mock phone screen */}
                <div className="w-full h-full bg-gradient-to-b from-primary-500 to-primary-700 rounded-2xl p-4 flex flex-col">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-white text-xl font-bold">myMotivationAI</h3>
                    <p className="text-white/80 text-sm">Your AI Motivation Coach</p>
                  </div>
                  
                  <div className="space-y-3 flex-grow">
                    {['Daily Challenge', 'Progress Dashboard', 'AI Exercises', 'Achievements'].map((item, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white">{['🏆', '📊', '🤖', '⭐'][index]}</span>
                          </div>
                          <span className="text-white font-medium">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-white text-sm mb-2">"This app changed my daily routine!"</p>
                      <p className="text-white/80 text-xs">- Sarah, 28 days streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Started in 60 Seconds</h2>
          
          {showInstallButton && (
            <div className="mb-8">
              <QRCodeInstallButton
                onSuccess={handleInstallSuccess}
                onError={handleInstallError}
                qrData={qrScanData}
              />
              <p className="text-gray-500 text-sm mt-3">
                One tap install • No app store • Works offline
              </p>
            </div>
          )}

          {isIOS && (
            <div className="mb-8">
              <IOSInstallGuide />
            </div>
          )}

          {/* Alternative access for non-PWA browsers */}
          {!showInstallButton && !isIOS && (
            <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Access Web Version</h3>
              <p className="text-gray-600 mb-6">
                Your browser doesn't support app installation, but you can still use the web version:
              </p>
              <a
                href="/app"
                className="inline-block w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors mb-4"
                onClick={() => trackEvent('web_app_access_click', { ...qrScanData })}
              >
                Open Web App
              </a>
              <p className="text-gray-500 text-sm">
                For the best experience, try Chrome, Firefox, or Edge on Android.
              </p>
            </div>
          )}

          {/* Trust Signals */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">28</div>
              <div className="text-gray-600">Day Avg. Streak</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: "Do I need to download from an app store?",
                a: "No! This is a Progressive Web App (PWA). Install directly from this page with one tap - no app store required."
              },
              {
                q: "Will it work offline?",
                a: "Yes! Once installed, core features work without an internet connection."
              },
              {
                q: "Is it free to use?",
                a: "Yes! Start with our free tier including 3 daily exercises. Upgrade to Pro for unlimited access."
              },
              {
                q: "How do I update the app?",
                a: "Updates happen automatically in the background - no manual updates needed."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
          <p>© {new Date().getFullYear()} myMotivationAI. All rights reserved.</p>
          <p className="mt-2">
            <a href="/privacy" className="hover:text-primary-600">Privacy Policy</a> • 
            <a href="/terms" className="hover:text-primary-600 ml-2">Terms of Service</a>
          </p>
          <p className="mt-2 text-xs">
            Scan this QR code to share with friends!
          </p>
        </div>
      </div>
    </div>
  )
}